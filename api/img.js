/**
 * GET /api/img?url=ENCODED_URL — Proxy images CJ Dropshipping / Unsplash
 *
 * CJ CDN bloque :
 * - Requêtes navigateur (hotlink protection)
 * - Proxy connus (wsrv.nl, weserv, etc.)
 *
 * Solution : on fetch côté serveur Vercel avec :
 * - User-Agent navigateur réaliste
 * - Referer cjdropshipping.com
 * - Cache CDN Vercel 30 jours (1 fetch par image, puis edge cache)
 *
 * Sécurité : allowlist stricte de domaines, HTTPS uniquement, blocage IP privées.
 */

const { URL } = require('url');
const dns = require('dns');
const { promisify } = require('util');

const dnsResolve = promisify(dns.resolve4);
const { applyRateLimit } = require('./_middleware/rateLimit');

// --- Allowlist stricte des domaines autorisés ---
const ALLOWED_HOSTS = new Set([
    'oss-cf.cjdropshipping.com',
    'cf.cjdropshipping.com',
    'images.unsplash.com'
]);

/**
 * Vérifie si une adresse IP est dans un range privé/réservé.
 * Bloque : 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12,
 *          192.168.0.0/16, 0.0.0.0, 169.254.0.0/16
 */
function isPrivateIP(ip) {
    // IPv6 loopback
    if (ip === '::1' || ip === '::') return true;

    var parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(function(p) { return isNaN(p); })) return true;

    // 0.0.0.0
    if (parts[0] === 0) return true;
    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;

    return false;
}

module.exports = async function handler(req, res) {
    // CORS
    var origin = req.headers.origin || '';
    var ALLOWED_ORIGINS = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'api')) return;

    var rawUrl = req.query.url;
    if (!rawUrl) {
        return res.status(400).json({ error: 'Missing required parameter' });
    }

    // Décoder si nécessaire
    try { rawUrl = decodeURIComponent(rawUrl); } catch(e) {}

    // --- Validation stricte de l'URL ---
    var parsed;
    try {
        parsed = new URL(rawUrl);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Protocole : HTTPS uniquement
    if (parsed.protocol !== 'https:') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Hostname : doit être exactement dans l'allowlist
    var hostname = parsed.hostname.toLowerCase();

    // Bloquer localhost et variantes
    if (hostname === 'localhost' || hostname === '[::1]') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (!ALLOWED_HOSTS.has(hostname)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Bloquer les credentials dans l'URL (user:pass@host)
    if (parsed.username || parsed.password) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Résolution DNS pour bloquer les IP privées (anti DNS-rebinding basique)
    try {
        var addresses = await dnsResolve(hostname);
        for (var i = 0; i < addresses.length; i++) {
            if (isPrivateIP(addresses[i])) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }
    } catch (dnsErr) {
        // Si la résolution DNS échoue, on bloque par précaution
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Reconstruire l'URL à partir de l'objet parsé (évite l'injection via fragments, etc.)
    var safeUrl = parsed.toString();

    try {
        var response = await fetch(safeUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://cjdropshipping.com/',
                'Origin': 'https://cjdropshipping.com'
            },
            redirect: 'error'  // Bloquer les redirections vers des domaines non autorisés
        });

        if (!response.ok) {
            // Fallback : essayer sans Referer
            response = await fetch(safeUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*,*/*;q=0.8'
                },
                redirect: 'error'
            });
        }

        if (!response.ok) {
            return res.status(502).json({ error: 'Image unavailable' });
        }

        // Vérifier que la réponse est bien une image
        var contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        var buffer = Buffer.from(await response.arrayBuffer());

        // Limiter la taille (10 MB max)
        if (buffer.length > 10 * 1024 * 1024) {
            return res.status(413).json({ error: 'Image too large' });
        }

        // Cache agressif : 30j CDN, 7j navigateur
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400');
        return res.status(200).send(buffer);

    } catch (err) {
        console.error('[img-proxy] fetch error');
        return res.status(502).json({ error: 'Image unavailable' });
    }
};
