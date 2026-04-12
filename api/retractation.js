// ============================
// ECLAT - API Formulaire de Retractation
// Conforme Article L221-18 du Code de la consommation
// POST /api/retractation
// ============================
//
// SQL pour creer la table Supabase :
// -----------------------------------------
// CREATE TABLE IF NOT EXISTS retractations (
//   id SERIAL PRIMARY KEY,
//   ref VARCHAR(20) UNIQUE NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   name VARCHAR(255),
//   order_id VARCHAR(100),
//   order_date DATE,
//   reason TEXT,
//   products TEXT,
//   status VARCHAR(20) DEFAULT 'pending',
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// -----------------------------------------

var { createClient } = require('@supabase/supabase-js');
var { applyRateLimit } = require('./_middleware/rateLimit');

// ---- Config ----
var CONTACT_EMAIL = process.env.CONTACT_RECIPIENT || 'contact@maison-eclat.shop';
var SUPABASE_URL = process.env.SUPABASE_URL || '';
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
var RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// ---- Rate limit specifique retractation : 3 demandes par jour par email ----
var retractRateLimitMap = new Map();
var RETRACT_LIMIT = 3;
var RETRACT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

// Nettoyage periodique (toutes les 30 min)
setInterval(function() {
    var now = Date.now();
    for (var entry of retractRateLimitMap) {
        if (now - entry[1].start > RETRACT_WINDOW_MS * 2) {
            retractRateLimitMap.delete(entry[0]);
        }
    }
}, 30 * 60 * 1000);

function checkRetractRateLimit(email) {
    var key = 'retract:' + email.toLowerCase().trim();
    var now = Date.now();
    var entry = retractRateLimitMap.get(key);

    if (!entry || (now - entry.start) > RETRACT_WINDOW_MS) {
        entry = { start: now, count: 0 };
        retractRateLimitMap.set(key, entry);
    }

    entry.count++;
    return entry.count > RETRACT_LIMIT;
}

function generateReference() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'RET-' + code;
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return null;
    return createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ---- Handler ----
module.exports = async function handler(req, res) {
    // CORS
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Rate limit global (reutilise le preset contact : 5 req/5min par IP)
    if (applyRateLimit(req, res, 'contact')) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    var body = req.body || {};
    var name = body.name;
    var email = body.email;
    var order_id = body.order_id;
    var order_date = body.order_date;
    var products = body.products;
    var reason = body.reason || '';

    // ---- Validation ----
    if (!name || !email || !order_id || !order_date || !products) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent \u00eatre remplis.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    if (typeof name === 'string' && name.length > 255) {
        return res.status(400).json({ error: 'Nom trop long (255 caract\u00e8res max).' });
    }

    if (typeof order_id === 'string' && order_id.length > 100) {
        return res.status(400).json({ error: 'Num\u00e9ro de commande invalide.' });
    }

    if (typeof products === 'string' && products.length > 2000) {
        return res.status(400).json({ error: 'Description des produits trop longue (2000 caract\u00e8res max).' });
    }

    // Validation date (format YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(order_date)) {
        return res.status(400).json({ error: 'Date de commande invalide.' });
    }

    // ---- Rate limit par email (3/jour) ----
    if (checkRetractRateLimit(email)) {
        return res.status(429).json({
            error: 'Vous avez atteint la limite de 3 demandes de r\u00e9tractation par jour. Veuillez r\u00e9essayer demain ou contacter contact@maison-eclat.shop.'
        });
    }

    // ---- Generer la reference unique ----
    var ref = generateReference();

    // ---- Sauvegarder en Supabase ----
    var supabase = getSupabase();
    var savedInDb = false;

    if (supabase) {
        try {
            // Tenter d'inserer, re-generer la ref en cas de collision
            var attempts = 0;
            var insertError = null;

            while (attempts < 3) {
                var result = await supabase.from('retractations').insert({
                    ref: ref,
                    email: email.toLowerCase().trim(),
                    name: name.trim(),
                    order_id: order_id.trim(),
                    order_date: order_date,
                    reason: reason,
                    products: products.trim(),
                    status: 'pending'
                });

                if (result.error && result.error.code === '23505') {
                    // Collision sur ref unique, re-generer
                    ref = generateReference();
                    attempts++;
                } else if (result.error) {
                    insertError = result.error;
                    console.error('[RETRACTATION] Supabase insert error:', result.error.message);
                    break;
                } else {
                    savedInDb = true;
                    break;
                }
            }

            if (insertError) {
                console.error('[RETRACTATION] DB save failed after attempts:', insertError.message);
            }
        } catch (dbErr) {
            console.error('[RETRACTATION] Supabase exception:', dbErr.message);
        }
    } else {
        console.log('[RETRACTATION] Supabase non configur\u00e9 \u2014 demande non sauvegard\u00e9e en base.');
    }

    // ---- Envoi emails via Resend ----
    if (!RESEND_API_KEY) {
        // Meme sans Resend, on accepte la demande (obligation legale L221-18)
        console.log('[RETRACTATION] ' + ref + ' \u2014 ' + name + ' \u2014 ' + email + ' \u2014 Commande: ' + order_id + ' \u2014 Resend non configur\u00e9');
        return res.status(200).json({
            success: true,
            ref: ref,
            savedInDb: savedInDb,
            emailSent: false,
            message: 'Demande enregistr\u00e9e. Emails d\u00e9sactiv\u00e9s (Resend non configur\u00e9).'
        });
    }

    try {
        // 1. Email de confirmation au client
        var customerEmailPromise = fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_API_KEY
            },
            body: JSON.stringify({
                from: 'Maison \u00c9clat <contact@maison-eclat.shop>',
                to: email,
                subject: 'Confirmation de r\u00e9tractation ' + ref + ' \u2014 \u00c9CLAT',
                html: '<div style="font-family:\'Helvetica Neue\',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">'
                    + '<div style="max-width:600px;margin:0 auto;padding:32px 24px;">'
                    + '<div style="text-align:center;margin-bottom:32px;">'
                    + '<h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">\u00c9CLAT</h1>'
                    + '</div>'
                    + '<div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">'
                    + '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Demande de r\u00e9tractation re\u00e7ue</h2>'
                    + '<p style="color:#6b6560;line-height:1.7;">Bonjour ' + escapeHtml(name) + ',</p>'
                    + '<p style="color:#6b6560;line-height:1.7;">Nous accusons bonne r\u00e9ception de votre demande de r\u00e9tractation conform\u00e9ment \u00e0 l\'article L221-18 du Code de la consommation. Voici le r\u00e9capitulatif :</p>'
                    + '<div style="background:#faf8f5;border-radius:8px;padding:20px;margin:24px 0;">'
                    + '<table style="width:100%;border-collapse:collapse;">'
                    + '<tr><td style="padding:6px 0;color:#6b6560;width:130px;"><strong>R\u00e9f\u00e9rence</strong></td><td style="padding:6px 0;color:#c9a87c;font-weight:700;font-size:16px;">' + ref + '</td></tr>'
                    + '<tr><td style="padding:6px 0;color:#6b6560;"><strong>Commande</strong></td><td style="padding:6px 0;color:#2d2926;">' + escapeHtml(order_id) + '</td></tr>'
                    + '<tr><td style="padding:6px 0;color:#6b6560;"><strong>Date commande</strong></td><td style="padding:6px 0;color:#2d2926;">' + escapeHtml(order_date) + '</td></tr>'
                    + '<tr><td style="padding:6px 0;color:#6b6560;"><strong>Produit(s)</strong></td><td style="padding:6px 0;color:#2d2926;">' + escapeHtml(products) + '</td></tr>'
                    + '</table>'
                    + '</div>'
                    + '<div style="background:#2d2926;color:#fff;border-radius:8px;padding:20px;margin:24px 0;">'
                    + '<p style="margin:0 0 8px;font-size:14px;opacity:0.7;">Prochaines \u00e9tapes</p>'
                    + '<ul style="margin:0;padding-left:20px;line-height:2;">'
                    + '<li>Notre \u00e9quipe traitera votre demande sous <strong>48h ouvr\u00e9es</strong></li>'
                    + '<li>Vous recevrez l\u2019adresse de retour par email (frais d\u2019exp\u00e9dition \u00e0 votre charge)</li>'
                    + '<li>Le remboursement sera effectu\u00e9 sous <strong>14 jours</strong> apr\u00e8s r\u00e9ception du retour</li>'
                    + '</ul>'
                    + '</div>'
                    + '<p style="color:#6b6560;font-size:14px;line-height:1.7;">Conservez cette r\u00e9f\u00e9rence : <strong style="color:#2d2926;">' + ref + '</strong> pour tout \u00e9change avec notre service client.</p>'
                    + '<p style="color:#6b6560;font-size:14px;line-height:1.7;">Si vous avez des questions, contactez-nous \u00e0 <a href="mailto:contact@maison-eclat.shop" style="color:#c9a87c;">contact@maison-eclat.shop</a>.</p>'
                    + '</div>'
                    + '<div style="text-align:center;margin-top:24px;color:#6b6560;font-size:12px;">'
                    + '<p>Maison \u00c9clat &amp; Wellness Premium</p>'
                    + '<p><a href="https://maison-eclat.shop" style="color:#c9a87c;">maison-eclat.shop</a></p>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
            })
        });

        // 2. Email notification admin
        var adminEmailPromise = fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_API_KEY
            },
            body: JSON.stringify({
                from: '\u00c9CLAT R\u00e9tractation <contact@maison-eclat.shop>',
                to: CONTACT_EMAIL,
                reply_to: email,
                subject: '[R\u00e9tractation ' + ref + '] ' + escapeHtml(name) + ' \u2014 Commande ' + escapeHtml(order_id),
                html: '<div style="font-family:\'Helvetica Neue\',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">'
                    + '<div style="text-align:center;margin-bottom:24px;">'
                    + '<h1 style="font-family:Georgia,serif;font-size:24px;color:#2d2926;letter-spacing:3px;">\u00c9CLAT</h1>'
                    + '</div>'
                    + '<div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e4de;">'
                    + '<h2 style="font-family:Georgia,serif;color:#c0392b;margin-top:0;font-size:18px;">Nouvelle demande de r\u00e9tractation</h2>'
                    + '<div style="background:#fdf2f2;border-left:4px solid #c0392b;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:20px;">'
                    + '<strong style="color:#c0392b;">R\u00e9f\u00e9rence : ' + ref + '</strong>'
                    + (savedInDb ? ' <span style="color:#27ae60;">\u2714 Sauvegard\u00e9 en base</span>' : ' <span style="color:#e67e22;">\u26a0 Non sauvegard\u00e9 en base</span>')
                    + '</div>'
                    + '<table style="width:100%;border-collapse:collapse;">'
                    + '<tr><td style="padding:10px 0;color:#6b6560;width:140px;border-bottom:1px solid #f0ede8;"><strong>Client</strong></td><td style="padding:10px 0;color:#2d2926;border-bottom:1px solid #f0ede8;">' + escapeHtml(name) + '</td></tr>'
                    + '<tr><td style="padding:10px 0;color:#6b6560;border-bottom:1px solid #f0ede8;"><strong>Email</strong></td><td style="padding:10px 0;border-bottom:1px solid #f0ede8;"><a href="mailto:' + escapeHtml(email) + '" style="color:#c9a87c;">' + escapeHtml(email) + '</a></td></tr>'
                    + '<tr><td style="padding:10px 0;color:#6b6560;border-bottom:1px solid #f0ede8;"><strong>Commande</strong></td><td style="padding:10px 0;color:#2d2926;border-bottom:1px solid #f0ede8;">' + escapeHtml(order_id) + '</td></tr>'
                    + '<tr><td style="padding:10px 0;color:#6b6560;border-bottom:1px solid #f0ede8;"><strong>Date commande</strong></td><td style="padding:10px 0;color:#2d2926;border-bottom:1px solid #f0ede8;">' + escapeHtml(order_date) + '</td></tr>'
                    + '<tr><td style="padding:10px 0;color:#6b6560;border-bottom:1px solid #f0ede8;"><strong>Produit(s)</strong></td><td style="padding:10px 0;color:#2d2926;border-bottom:1px solid #f0ede8;">' + escapeHtml(products) + '</td></tr>'
                    + '<tr><td style="padding:10px 0;color:#6b6560;border-bottom:1px solid #f0ede8;"><strong>Motif</strong></td><td style="padding:10px 0;color:#2d2926;border-bottom:1px solid #f0ede8;">' + escapeHtml(reason || 'Non renseign\u00e9') + '</td></tr>'
                    + '</table>'
                    + '<div style="background:#faf8f5;border-radius:8px;padding:16px;margin-top:20px;font-size:13px;color:#6b6560;">'
                    + '<strong>Action requise :</strong> R\u00e9pondre au client sous 14 jours conform\u00e9ment \u00e0 l\'article L221-24 du Code de la consommation. Envoyer l\'\u00e9tiquette de retour.'
                    + '</div>'
                    + '</div>'
                    + '<p style="text-align:center;font-size:12px;color:#999;margin-top:16px;">Notification automatique \u2014 maison-eclat.shop</p>'
                    + '</div>'
            })
        });

        // Envoyer les deux emails en parallele
        var results = await Promise.all([customerEmailPromise, adminEmailPromise]);
        var customerRes = results[0];
        var adminRes = results[1];

        var customerData = await customerRes.json();
        var adminData = await adminRes.json();

        if (!customerRes.ok) {
            console.error('[RETRACTATION] Customer email error:', customerData);
        }
        if (!adminRes.ok) {
            console.error('[RETRACTATION] Admin email error:', adminData);
        }

        // Succes meme si un email echoue — la demande est enregistree (obligation legale)
        return res.status(200).json({
            success: true,
            ref: ref,
            savedInDb: savedInDb,
            emailSent: customerRes.ok
        });

    } catch (err) {
        console.error('[RETRACTATION] API error:', err.message);

        // En cas d'erreur serveur, on retourne quand meme un succes
        // car la demande de retractation DOIT etre acceptee (obligation legale L221-18)
        return res.status(200).json({
            success: true,
            ref: ref,
            savedInDb: savedInDb,
            emailSent: false,
            note: 'Demande enregistr\u00e9e. Confirmation email en attente.'
        });
    }
};
