// ============================
// ÉCLAT - Système d'emails automatiques
// Utilise Resend (resend.com) - Gratuit jusqu'à 3000 emails/mois
// ============================

const EMAIL_FROM = 'ÉCLAT Beauté <contact@maison-eclat.shop>';
const SITE_URL = 'https://maison-eclat.shop';

// Templates d'emails
const TEMPLATES = {

    // 1. Confirmation de commande
    order_confirmation: (order) => ({
        subject: `Merci pour votre commande ${order.id} ! ✨`,
        html: `
<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>
    </div>
    <div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">
        <h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Merci pour votre commande !</h2>
        <p style="color:#6b6560;line-height:1.7;">Bonjour ${order.customer.name || 'cher(e) client(e)'},</p>
        <p style="color:#6b6560;line-height:1.7;">Votre commande <strong style="color:#2d2926;">${order.id}</strong> a bien été confirmée. Nous préparons vos produits avec soin.</p>

        <div style="background:#faf8f5;border-radius:8px;padding:20px;margin:24px 0;">
            <h3 style="font-family:Georgia,serif;font-size:16px;color:#2d2926;margin-top:0;">Récapitulatif</h3>
            ${order.items.map(item => `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e8e4de;">
                    <span style="color:#2d2926;">${item.name} × ${item.quantity}</span>
                    <strong style="color:#c9a87c;">${item.total.toFixed(2).replace('.', ',')} €</strong>
                </div>
            `).join('')}
            <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;">
                <strong style="color:#2d2926;font-size:18px;">Total</strong>
                <strong style="color:#2d2926;font-size:18px;">${order.total.toFixed(2).replace('.', ',')} €</strong>
            </div>
        </div>

        <div style="background:#2d2926;color:#fff;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;opacity:0.7;">Prochaine étape</p>
            <p style="margin:0;font-size:16px;font-weight:600;">Exp&eacute;dition sous 1-3 jours ouvr&eacute;s</p>
        </div>

        <p style="color:#6b6560;font-size:14px;line-height:1.7;">Vous recevrez un email avec votre numéro de suivi dès l'expédition.</p>

        <p style="color:#c9a87c;font-weight:600;font-size:14px;">+ Vous avez gagné ${Math.floor(order.total)} points fidélité !</p>
    </div>
    <div style="text-align:center;margin-top:24px;color:#6b6560;font-size:12px;">
        <p>ÉCLAT Beauté & Wellness Premium</p>
        <p><a href="${SITE_URL}" style="color:#c9a87c;">maison-eclat.shop</a></p>
    </div>
</div>
</body></html>`
    }),

    // 2. Notification d'expédition
    shipping_notification: (order, trackingNumber, carrier) => ({
        subject: `Votre commande ${order.id} est en route ! 🚚`,
        html: `
<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>
    </div>
    <div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">
        <h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Votre colis est en route !</h2>
        <p style="color:#6b6560;line-height:1.7;">Bonne nouvelle ! Votre commande <strong>${order.id}</strong> vient d'être expédiée.</p>

        <div style="background:#faf8f5;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
            <p style="margin:0 0 8px;font-size:14px;color:#6b6560;">Numéro de suivi</p>
            <p style="margin:0;font-size:20px;font-weight:700;color:#2d2926;letter-spacing:1px;">${trackingNumber}</p>
            <p style="margin:8px 0 0;font-size:14px;color:#c9a87c;">${carrier || 'Transporteur'}</p>
        </div>

        <p style="color:#6b6560;font-size:14px;line-height:1.7;">D&eacute;lai de livraison estim&eacute; : <strong style="color:#2d2926;">7-14 jours ouvr&eacute;s</strong></p>
    </div>
</div>
</body></html>`
    }),

    // 3. Demande d'avis post-livraison (envoyé 7 jours après expédition)
    review_request: (order) => ({
        subject: `Comment trouvez-vous vos produits ÉCLAT ? 💬`,
        html: `
<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>
    </div>
    <div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">
        <h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Votre avis compte !</h2>
        <p style="color:#6b6560;line-height:1.7;">Bonjour ${order.customer.name || ''},</p>
        <p style="color:#6b6560;line-height:1.7;">Vous avez reçu votre commande depuis quelques jours. Comment trouvez-vous vos produits ?</p>

        <div style="text-align:center;margin:32px 0;">
            <p style="font-size:14px;color:#6b6560;margin-bottom:16px;">Notez votre expérience :</p>
            <a href="${SITE_URL}#avis" style="display:inline-block;background:#2d2926;color:#fff;padding:16px 40px;border-radius:30px;text-decoration:none;font-weight:600;">Laisser un avis ⭐</a>
        </div>

        <div style="background:linear-gradient(135deg,#2d2926,#1a1714);color:#fff;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;opacity:0.7;">En remerciement</p>
            <p style="margin:0;font-size:22px;font-weight:700;">-10% sur votre prochaine commande</p>
            <p style="margin:8px 0 0;font-size:16px;letter-spacing:2px;color:#c9a87c;font-weight:700;">MERCI10</p>
        </div>
    </div>
</div>
</body></html>`
    }),

    // 4. Panier abandonné (envoyé 1h après abandon)
    abandoned_cart: (email, cartItems, cartTotal) => ({
        subject: `Vous avez oublié quelque chose... 🛍️`,
        html: `
<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>
    </div>
    <div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">
        <h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Vos produits vous attendent !</h2>
        <p style="color:#6b6560;line-height:1.7;">Vous avez laissé des articles dans votre panier. Ils sont encore disponibles, mais le stock est limité.</p>

        <div style="background:#faf8f5;border-radius:8px;padding:20px;margin:24px 0;">
            ${cartItems.map(item => `
                <div style="padding:8px 0;border-bottom:1px solid #e8e4de;">
                    <strong style="color:#2d2926;">${item.name}</strong> × ${item.qty}
                    <span style="float:right;color:#c9a87c;font-weight:600;">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
                </div>
            `).join('')}
            <div style="padding:12px 0 0;text-align:right;">
                <strong style="color:#2d2926;font-size:18px;">Total : ${cartTotal.toFixed(2).replace('.', ',')} €</strong>
            </div>
        </div>

        <div style="text-align:center;margin:32px 0;">
            <a href="${SITE_URL}" style="display:inline-block;background:#2d2926;color:#fff;padding:16px 40px;border-radius:30px;text-decoration:none;font-weight:600;">Finaliser ma commande</a>
        </div>

        <div style="background:linear-gradient(135deg,#2d2926,#1a1714);color:#fff;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;opacity:0.7;">Rien que pour vous</p>
            <p style="margin:0;font-size:20px;font-weight:700;">-10% avec le code REVIENS10</p>
        </div>
    </div>
</div>
</body></html>`
    })
};

// Envoyer un email via Resend API
async function sendEmail(to, template, resendApiKey) {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to,
                subject: template.subject,
                html: template.html
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, emailId: data.id };
        } else {
            return { success: false, error: data.message || 'Resend API error' };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// API endpoint
module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const resendApiKey = process.env.RESEND_API_KEY || '';
    if (!resendApiKey) {
        return res.status(200).json({
            success: false,
            mode: 'disabled',
            message: 'RESEND_API_KEY non configurée. Emails désactivés.',
            setup: 'Créer un compte gratuit sur resend.com, ajouter le domaine maison-eclat.shop, copier la clé API'
        });
    }

    const { type, to, order, trackingNumber, carrier, cartItems, cartTotal } = req.body;

    let template;
    switch (type) {
        case 'order_confirmation':
            template = TEMPLATES.order_confirmation(order);
            break;
        case 'shipping_notification':
            template = TEMPLATES.shipping_notification(order, trackingNumber, carrier);
            break;
        case 'review_request':
            template = TEMPLATES.review_request(order);
            break;
        case 'abandoned_cart':
            template = TEMPLATES.abandoned_cart(to, cartItems, cartTotal);
            break;
        default:
            return res.status(400).json({ error: 'Unknown email type' });
    }

    const result = await sendEmail(to, template, resendApiKey);
    return res.status(200).json(result);
};

module.exports.sendEmail = sendEmail;
module.exports.TEMPLATES = TEMPLATES;
