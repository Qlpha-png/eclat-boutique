/**
 * GET /api/unsubscribe?email=xxx&token=xxx — Désabonnement newsletter 1-clic
 * Pas d'auth requise — vérifié par token HMAC
 */
const crypto = require('crypto');
const { getSupabase } = require('./_middleware/auth');

// Génère un token de désabonnement (utilisé dans les emails)
function generateUnsubToken(email) {
    const secret = process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eclat-unsub-secret';
    return crypto.createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 32);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { email, token } = req.query;

    if (!email || !token) {
        return res.status(400).send(htmlPage('Lien invalide', 'Le lien de desabonnement est incomplet.', false));
    }

    // Vérifier le token
    const expected = generateUnsubToken(email);
    if (token !== expected) {
        return res.status(403).send(htmlPage('Lien invalide', 'Le lien de desabonnement n\'est pas valide.', false));
    }

    try {
        const sb = getSupabase();
        const { error } = await sb
            .from('newsletter_subscribers')
            .update({ subscribed: false })
            .eq('email', email.toLowerCase());

        if (error) throw error;

        return res.status(200).send(htmlPage(
            'Desabonnement confirme',
            'Vous ne recevrez plus d\'emails marketing de Maison ECLAT.<br>Vous pouvez vous reabonner a tout moment sur notre site.',
            true
        ));
    } catch (err) {
        console.error('[unsubscribe]', err.message);
        return res.status(500).send(htmlPage('Erreur', 'Une erreur est survenue. Contactez contact@maison-eclat.shop.', false));
    }
};

// Exporter pour utilisation dans les emails
module.exports.generateUnsubToken = generateUnsubToken;

function htmlPage(title, message, success) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} - ECLAT</title>
<style>
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.card{background:#fff;border-radius:16px;padding:48px 40px;text-align:center;max-width:480px;border:1px solid #e8e4de;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
h1{font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;margin-bottom:8px;}
h2{font-size:20px;color:${success ? '#4caf50' : '#e74c3c'};margin-bottom:16px;}
p{color:#6b6560;line-height:1.7;margin-bottom:24px;}
a{display:inline-block;background:#2d2926;color:#fff;padding:14px 32px;border-radius:30px;text-decoration:none;font-weight:600;}
a:hover{opacity:0.85;}
</style></head><body>
<div class="card">
<h1>ECLAT</h1>
<h2>${title}</h2>
<p>${message}</p>
<a href="https://maison-eclat.shop">Retour a la boutique</a>
</div></body></html>`;
}
