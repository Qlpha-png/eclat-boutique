// ============================
// ÉCLAT - Formulaire de contact
// Reçoit les messages du formulaire contact et les envoie par email via Resend
// ============================

const CONTACT_EMAIL = 'contact@maison-eclat.shop';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://maison-eclat.shop');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email invalide.' });
    }

    if (message.length > 5000) {
        return res.status(400).json({ error: 'Message trop long (5000 caractères max).' });
    }

    const resendApiKey = process.env.RESEND_API_KEY || '';
    if (!resendApiKey) {
        return res.status(200).json({
            success: false,
            mode: 'mailto',
            message: 'Resend non configuré. Utilisez le lien mailto.'
        });
    }

    const subjectLabels = {
        commande: 'Ma commande',
        produit: 'Question produit',
        retour: 'Retour / Remboursement',
        partenariat: 'Partenariat / Presse',
        autre: 'Autre'
    };

    const subjectLabel = subjectLabels[subject] || subject;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: `ÉCLAT Contact <contact@maison-eclat.shop>`,
                to: CONTACT_EMAIL,
                reply_to: email,
                subject: `[Contact] ${subjectLabel} — ${name}`,
                html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
    <h2 style="color:#2d2926;border-bottom:2px solid #c9a87c;padding-bottom:12px;">Nouveau message — Formulaire de contact</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#6b6560;width:100px;"><strong>Nom</strong></td><td style="padding:8px 0;color:#2d2926;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#6b6560;"><strong>Email</strong></td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c9a87c;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b6560;"><strong>Sujet</strong></td><td style="padding:8px 0;color:#2d2926;">${escapeHtml(subjectLabel)}</td></tr>
    </table>
    <div style="background:#faf8f5;border-radius:8px;padding:20px;margin:16px 0;color:#2d2926;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</div>
    <p style="font-size:12px;color:#999;margin-top:24px;">Envoyé depuis le formulaire de contact maison-eclat.shop</p>
</div>`
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Resend error:', data);
            return res.status(500).json({ error: 'Erreur envoi email.' });
        }
    } catch (err) {
        console.error('Contact API error:', err.message);
        return res.status(500).json({ error: 'Erreur serveur.' });
    }
};

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
