/**
 * /api/stock-alert — Alertes retour en stock
 * POST : S'inscrire pour une alerte (email + productId)
 * GET  : Traiter les alertes — trouver produits restockés, envoyer emails via Resend, marquer notifié
 *
 * CORS : eclat-boutique.vercel.app, maison-eclat.shop
 *
 * ============================================================
 * SQL SCHEMA — stock_alerts
 * ============================================================
 * CREATE TABLE stock_alerts (
 *   id BIGSERIAL PRIMARY KEY,
 *   email TEXT NOT NULL,
 *   product_id BIGINT NOT NULL REFERENCES products(id),
 *   notified BOOLEAN NOT NULL DEFAULT FALSE,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   notified_at TIMESTAMPTZ,
 *   UNIQUE(email, product_id)
 * );
 * CREATE INDEX idx_stock_alerts_pending ON stock_alerts(notified) WHERE notified = FALSE;
 * CREATE INDEX idx_stock_alerts_email ON stock_alerts(email);
 *
 * ============================================================
 * SQL SCHEMA — products (colonnes utilisées)
 * ============================================================
 * CREATE TABLE products (
 *   id BIGSERIAL PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   stock INTEGER NOT NULL DEFAULT 0,
 *   price NUMERIC(10,2) NOT NULL,
 *   image_url TEXT,
 *   ...
 * );
 * ============================================================
 */

const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

var RESEND_KEY = process.env.RESEND_API_KEY || '';
var EMAIL_FROM = 'ÉCLAT Beauté <contact@maison-eclat.shop>';
var SITE_URL = 'https://maison-eclat.shop';
var ALLOWED_ORIGINS = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
var MAX_ALERTS_PER_EMAIL = 10;

module.exports = async function handler(req, res) {
    // CORS
    var origin = req.headers.origin || '';
    var allowedOrigin = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        return handleSubscribe(req, res);
    }

    if (req.method === 'GET') {
        return handleProcessAlerts(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
};

/**
 * POST — S'inscrire pour une alerte retour en stock
 * Body: { email, productId }
 */
async function handleSubscribe(req, res) {
    if (applyRateLimit(req, res, 'public')) return;

    var sb = getSupabase();
    var body = req.body || {};
    var email = body.email;
    var productId = body.productId;

    // Validation champs requis
    if (!email || !productId) {
        return res.status(400).json({ error: 'email et productId requis' });
    }

    // Validation format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Format email invalide' });
    }

    var cleanEmail = email.toLowerCase().trim();
    var cleanProductId = Number(productId);

    if (!cleanProductId || cleanProductId <= 0) {
        return res.status(400).json({ error: 'productId invalide' });
    }

    try {
        // Vérifier que le produit existe
        var { data: product, error: prodErr } = await sb
            .from('products')
            .select('id, name, stock')
            .eq('id', cleanProductId)
            .single();

        if (prodErr || !product) {
            return res.status(404).json({ error: 'Produit introuvable' });
        }

        // Si le produit est déjà en stock, pas besoin d'alerte
        if (product.stock > 0) {
            return res.status(200).json({
                ok: true,
                already_in_stock: true,
                message: product.name + ' est actuellement disponible !'
            });
        }

        // Vérifier doublon (même email + même produit, non notifié)
        var { data: existing } = await sb
            .from('stock_alerts')
            .select('id')
            .eq('email', cleanEmail)
            .eq('product_id', cleanProductId)
            .eq('notified', false)
            .limit(1);

        if (existing && existing.length > 0) {
            return res.status(200).json({
                ok: true,
                duplicate: true,
                message: 'Vous êtes déjà inscrit(e) pour ce produit.'
            });
        }

        // Limite de 10 alertes actives par email
        var { data: activeAlerts, error: countErr } = await sb
            .from('stock_alerts')
            .select('id')
            .eq('email', cleanEmail)
            .eq('notified', false);

        var alertCount = (activeAlerts && !countErr) ? activeAlerts.length : 0;

        if (alertCount >= MAX_ALERTS_PER_EMAIL) {
            return res.status(429).json({
                error: 'Limite atteinte : maximum ' + MAX_ALERTS_PER_EMAIL + ' alertes actives par email.'
            });
        }

        // Insérer l'alerte
        var { error: insertErr } = await sb
            .from('stock_alerts')
            .insert({
                email: cleanEmail,
                product_id: cleanProductId,
                notified: false,
                created_at: new Date().toISOString()
            });

        if (insertErr) {
            // Gérer la contrainte unique en fallback
            if (insertErr.code === '23505') {
                return res.status(200).json({
                    ok: true,
                    duplicate: true,
                    message: 'Vous êtes déjà inscrit(e) pour ce produit.'
                });
            }
            console.error('[stock-alert POST]', insertErr.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        return res.status(200).json({
            ok: true,
            message: 'Vous serez prévenu(e) dès que ' + product.name + ' sera de retour en stock.'
        });

    } catch (err) {
        console.error('[stock-alert POST]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

/**
 * GET — Traiter les alertes : trouver produits restockés, envoyer emails, marquer notifié
 * Sécurisé par CRON_SECRET (appelé par cron ou manuellement)
 */
async function handleProcessAlerts(req, res) {
    var CRON_SECRET = process.env.CRON_SECRET || '';
    if (CRON_SECRET && req.headers.authorization !== 'Bearer ' + CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!RESEND_KEY) {
        return res.status(200).json({
            ok: false,
            message: 'RESEND_API_KEY non configurée. Emails désactivés.'
        });
    }

    var sb = getSupabase();
    var results = { processed: 0, sent: 0, errors: 0 };

    try {
        // 1. Récupérer toutes les alertes en attente
        var { data: pendingAlerts, error: fetchErr } = await sb
            .from('stock_alerts')
            .select('id, email, product_id')
            .eq('notified', false)
            .limit(200);

        if (fetchErr || !pendingAlerts || pendingAlerts.length === 0) {
            return res.status(200).json({ ok: true, message: 'Aucune alerte en attente', results: results });
        }

        // 2. Récupérer les product_id uniques
        var productIdMap = {};
        for (var i = 0; i < pendingAlerts.length; i++) {
            productIdMap[pendingAlerts[i].product_id] = true;
        }
        var uniqueProductIds = Object.keys(productIdMap).map(function(k) { return Number(k); });

        // 3. Trouver les produits qui sont de retour en stock (stock > 0)
        var { data: inStockProducts, error: stockErr } = await sb
            .from('products')
            .select('id, name, price, image_url, stock')
            .in('id', uniqueProductIds)
            .gt('stock', 0);

        if (stockErr || !inStockProducts || inStockProducts.length === 0) {
            return res.status(200).json({ ok: true, message: 'Aucun produit restocké', results: results });
        }

        // Map des produits en stock par ID
        var productMap = {};
        for (var p = 0; p < inStockProducts.length; p++) {
            productMap[inStockProducts[p].id] = inStockProducts[p];
        }

        // 4. Envoyer les emails pour chaque alerte dont le produit est restocké
        for (var a = 0; a < pendingAlerts.length; a++) {
            var alert = pendingAlerts[a];
            var product = productMap[alert.product_id];

            if (!product) continue; // Produit pas encore restocké

            results.processed++;

            try {
                var emailSent = await sendStockAlertEmail(alert.email, product);

                if (emailSent) {
                    // Marquer comme notifié
                    await sb
                        .from('stock_alerts')
                        .update({
                            notified: true,
                            notified_at: new Date().toISOString()
                        })
                        .eq('id', alert.id);

                    results.sent++;
                } else {
                    results.errors++;
                }
            } catch (sendErr) {
                console.error('[stock-alert] Erreur envoi email:', alert.email, sendErr.message);
                results.errors++;
            }
        }

        return res.status(200).json({ ok: true, results: results });

    } catch (err) {
        console.error('[stock-alert GET]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

/**
 * Envoie un email de retour en stock via Resend API
 */
async function sendStockAlertEmail(toEmail, product) {
    var priceFormatted = Number(product.price).toFixed(2).replace('.', ',');
    var productUrl = SITE_URL + '/pages/product.html?id=' + product.id;
    var imageUrl = product.image_url || (SITE_URL + '/images/placeholder.jpg');

    var html = '<!DOCTYPE html>' +
        '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
        '<body style="font-family:\'Helvetica Neue\',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">' +
        '<div style="max-width:600px;margin:0 auto;padding:0;">' +

        // Header ÉCLAT sombre avec accent doré
        '<div style="background:#1a1714;padding:32px 24px;text-align:center;">' +
        '<h1 style="font-family:Georgia,serif;font-size:28px;color:#c9a87c;letter-spacing:4px;margin:0;">\u00c9CLAT</h1>' +
        '<div style="width:40px;height:2px;background:#c9a87c;margin:12px auto 0;"></div>' +
        '</div>' +

        // Contenu principal
        '<div style="background:#ffffff;padding:40px 32px;">' +

        '<h2 style="font-family:Georgia,serif;font-size:22px;color:#2d2926;margin:0 0 8px;text-align:center;">' +
        'Bonne nouvelle !' +
        '</h2>' +
        '<p style="color:#6b6560;font-size:15px;line-height:1.7;text-align:center;margin:0 0 32px;">' +
        'Un produit de votre liste d\'attente est de retour en stock.' +
        '</p>' +

        // Carte produit
        '<div style="background:#faf8f5;border-radius:12px;padding:24px;border:1px solid #e8e4de;text-align:center;">' +
        '<img src="' + imageUrl + '" alt="' + product.name + '" ' +
        'style="width:180px;height:180px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />' +
        '<h3 style="font-family:Georgia,serif;font-size:18px;color:#2d2926;margin:0 0 8px;">' + product.name + '</h3>' +
        '<p style="font-size:20px;font-weight:700;color:#c9a87c;margin:0 0 4px;">' + priceFormatted + ' \u20ac</p>' +
        '<p style="font-size:13px;color:#16a34a;font-weight:600;margin:0;">' +
        '\u2713 Disponible \u2014 Stock limit\u00e9' +
        '</p>' +
        '</div>' +

        // Bouton CTA
        '<div style="text-align:center;margin:32px 0 0;">' +
        '<a href="' + productUrl + '" style="display:inline-block;background:#2d2926;color:#ffffff;' +
        'padding:16px 48px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;' +
        'letter-spacing:0.5px;">Je le veux !</a>' +
        '</div>' +

        '</div>' +

        // Footer
        '<div style="background:#1a1714;padding:24px;text-align:center;">' +
        '<p style="color:#c9a87c;font-family:Georgia,serif;font-size:14px;letter-spacing:2px;margin:0 0 8px;">' +
        '\u00c9CLAT Beaut\u00e9 & Wellness Premium</p>' +
        '<p style="margin:0;">' +
        '<a href="' + SITE_URL + '" style="color:#8a847e;font-size:12px;text-decoration:none;">maison-eclat.shop</a>' +
        '</p>' +
        '<p style="margin:8px 0 0;">' +
        '<a href="' + SITE_URL + '/api/unsubscribe?email=' + encodeURIComponent(toEmail) + '&type=stock_alert" ' +
        'style="color:#6b6560;font-size:11px;text-decoration:underline;">Se d\u00e9sabonner des alertes stock</a>' +
        '</p>' +
        '</div>' +

        '</div>' +
        '</body></html>';

    try {
        var response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_KEY
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: toEmail,
                subject: product.name + ' est de retour en stock !',
                html: html
            })
        });

        if (response.ok) {
            return true;
        }

        var errData = await response.json().catch(function() { return {}; });
        console.error('[stock-alert] Resend error:', errData.message || response.status);
        return false;
    } catch (err) {
        console.error('[stock-alert] sendEmail error:', err.message);
        return false;
    }
}
