// ============================
// ÉCLAT — Abandoned Cart Recovery API
// POST /api/abandoned-cart
// Envoie un email de rappel panier abandonné
// Conforme RGPD : uniquement si email connu + consentement newsletter
// ============================
// SQL:
// CREATE TABLE IF NOT EXISTS abandoned_carts (
//   id SERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   items JSONB NOT NULL,
//   total NUMERIC(10,2) DEFAULT 0,
//   recovered BOOLEAN DEFAULT false,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE INDEX idx_abandoned_email ON abandoned_carts(email);

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

module.exports = async (req, res) => {
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    try {
        var body = req.body || {};
        var email = body.email;
        var items = body.items;
        var total = body.total;

        if (!email || !items || !items.length) {
            return res.status(400).json({ error: 'email and items required' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        if (items.length > 20) {
            return res.status(400).json({ error: 'Too many items' });
        }

        // RGPD : vérifier consentement marketing (inscription newsletter)
        var { data: subscriber } = await supabase
            .from('newsletter_subscribers')
            .select('id, unsubscribed')
            .eq('email', email.toLowerCase())
            .single();

        if (!subscriber || subscriber.unsubscribed) {
            return res.status(200).json({ success: false, reason: 'no_consent' });
        }

        // Cooldown 24h — anti-spam
        var { data: lastRecovery } = await supabase
            .from('abandoned_carts')
            .select('created_at')
            .eq('email', email.toLowerCase())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (lastRecovery) {
            var lastSent = new Date(lastRecovery.created_at).getTime();
            if (Date.now() - lastSent < 86400000) {
                return res.status(200).json({ success: false, reason: 'cooldown' });
            }
        }

        // Sauvegarder le panier abandonné
        await supabase.from('abandoned_carts').insert({
            email: email.toLowerCase(),
            items: items,
            total: total || 0,
            recovered: false,
            created_at: new Date().toISOString()
        });

        // Envoyer email de rappel
        var resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) {
            return res.status(200).json({ success: true, email_sent: false });
        }

        var itemsHTML = items.slice(0, 5).map(function(item) {
            var imgTag = item.image
                ? '<img src="' + item.image + '" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">'
                : '<div style="width:80px;height:80px;background:#f3efe9;border-radius:8px;"></div>';
            return '<tr><td style="padding:8px;vertical-align:middle;">' + imgTag + '</td>' +
                '<td style="padding:8px;vertical-align:middle;"><strong>' + (item.name || 'Produit') + '</strong><br>' +
                '<span style="color:#c9a87c;font-weight:600;">' + Number(item.price || 0).toFixed(2).replace('.', ',') + ' \u20ac</span>' +
                (item.qty > 1 ? ' \u00d7 ' + item.qty : '') + '</td></tr>';
        }).join('');

        var totalFormatted = Number(total || 0).toFixed(2).replace('.', ',');

        var emailHTML = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">' +
            '<div style="background:#2d2926;padding:24px;text-align:center;">' +
            '<h1 style="font-family:Georgia,serif;color:#fff;letter-spacing:3px;margin:0;font-size:24px;">\u00c9CLAT</h1>' +
            '</div>' +
            '<div style="padding:32px;">' +
            '<h2 style="font-family:Georgia,serif;color:#2d2926;margin:0 0 16px;">Vous avez oubli\u00e9 quelque chose ?</h2>' +
            '<p style="color:#6b6560;line-height:1.6;">Vos produits vous attendent ! Finalisez votre commande avant qu\'ils ne soient plus disponibles.</p>' +
            '<table style="width:100%;margin:24px 0;border-collapse:collapse;">' + itemsHTML + '</table>' +
            '<div style="background:#f3efe9;padding:16px;border-radius:12px;text-align:center;margin:24px 0;">' +
            '<span style="color:#6b6560;">Total du panier :</span> ' +
            '<strong style="font-size:20px;color:#2d2926;margin-left:8px;">' + totalFormatted + ' \u20ac</strong>' +
            '</div>' +
            '<div style="text-align:center;margin:32px 0;">' +
            '<a href="https://maison-eclat.shop" style="display:inline-block;background:#2d2926;color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;">Retrouver mon panier</a>' +
            '</div>' +
            '<p style="color:#6b6560;font-size:13px;text-align:center;">Livraison offerte d\u00e8s 29\u20ac | Retours gratuits 30 jours</p>' +
            '</div>' +
            '<div style="background:#f3efe9;padding:20px;text-align:center;font-size:12px;color:#6b6560;">' +
            '<p>Vous recevez cet email car vous \u00eates inscrit(e) \u00e0 la newsletter \u00c9CLAT.</p>' +
            '<p><a href="https://maison-eclat.shop/api/unsubscribe?email=' + encodeURIComponent(email) + '" style="color:#c9a87c;">Se d\u00e9sinscrire</a></p>' +
            '</div></div>';

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + resendKey
            },
            body: JSON.stringify({
                from: '\u00c9CLAT Beaut\u00e9 <contact@maison-eclat.shop>',
                to: email,
                subject: 'Votre panier vous attend chez \u00c9CLAT \u2728',
                html: emailHTML
            })
        }).catch(function() {});

        return res.status(200).json({ success: true, email_sent: true });

    } catch (err) {
        console.error('Abandoned cart error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
