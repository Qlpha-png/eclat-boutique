// ============================
// ÉCLAT - Récupération paniers abandonnés
// Appelé côté client quand un utilisateur a un panier + email mais ne commande pas
// ============================

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const resendApiKey = process.env.RESEND_API_KEY || '';
    if (!resendApiKey) {
        return res.status(200).json({ success: false, message: 'Emails non configurés' });
    }

    const { email, items, total } = req.body;

    if (!email || !items || !items.length) {
        return res.status(400).json({ error: 'Missing email or items' });
    }

    // Vérifier que l'email est valide
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'ÉCLAT Beauté <contact@maison-eclat.shop>',
                to: email,
                subject: 'Vous avez oublié quelque chose... 🛍️',
                html: buildAbandonedCartEmail(items, total)
            })
        });

        const data = await response.json();
        return res.status(200).json({ success: response.ok, id: data.id });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

function buildAbandonedCartEmail(items, total) {
    return `
<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>
    </div>
    <div style="background:#fff;border-radius:12px;padding:40px 32px;border:1px solid #e8e4de;">
        <h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Vos produits vous attendent !</h2>
        <p style="color:#6b6560;line-height:1.7;">Vous avez laissé des articles dans votre panier. Ils sont encore disponibles, mais les stocks sont limités.</p>
        <div style="background:#faf8f5;border-radius:8px;padding:20px;margin:24px 0;">
            ${items.map(item => `
                <div style="padding:8px 0;border-bottom:1px solid #e8e4de;display:flex;justify-content:space-between;">
                    <span style="color:#2d2926;"><strong>${item.name}</strong> × ${item.qty}</span>
                    <span style="color:#c9a87c;font-weight:600;">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
                </div>
            `).join('')}
        </div>
        <div style="text-align:center;margin:32px 0;">
            <a href="https://maison-eclat.shop" style="display:inline-block;background:#2d2926;color:#fff;padding:16px 40px;border-radius:30px;text-decoration:none;font-weight:600;">Finaliser ma commande</a>
        </div>
        <div style="background:linear-gradient(135deg,#2d2926,#1a1714);color:#fff;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;opacity:0.7;">Rien que pour vous</p>
            <p style="margin:0;font-size:20px;font-weight:700;">-10% avec le code REVIENS10</p>
        </div>
    </div>
</div>
</body></html>`;
}
