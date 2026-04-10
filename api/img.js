/**
 * GET /api/img?url=ENCODED_URL — Proxy images CJ Dropshipping
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
 * Sécurité : seuls les domaines CJ autorisés.
 */

module.exports = async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    var url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'url parameter required' });
    }

    // Décoder si nécessaire
    try { url = decodeURIComponent(url); } catch(e) {}

    // Sécurité : uniquement CJ CDN
    if (url.indexOf('cjdropshipping.com') === -1) {
        return res.status(403).json({ error: 'Only CJ CDN URLs allowed' });
    }

    // Forcer HTTPS
    if (url.indexOf('http://') === 0) {
        url = url.replace('http://', 'https://');
    }

    try {
        var response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://cjdropshipping.com/',
                'Origin': 'https://cjdropshipping.com'
            }
        });

        if (!response.ok) {
            // Fallback : essayer sans Referer
            response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*,*/*;q=0.8'
                }
            });
        }

        if (!response.ok) {
            return res.status(response.status).end();
        }

        var buffer = Buffer.from(await response.arrayBuffer());
        var contentType = response.headers.get('content-type') || 'image/jpeg';

        // Cache agressif : 30j CDN, 7j navigateur
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400');
        return res.status(200).send(buffer);

    } catch (err) {
        console.error('[img-proxy]', err.message);
        return res.status(502).json({ error: 'Image fetch failed' });
    }
};
