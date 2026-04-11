// ============================
// ÉCLAT — SMS Notifications via Brevo
// Envoi de SMS transactionnels (suivi commande)
// ============================

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // AUTH REQUIRED — prevent use as SMS spam relay
    const authHeader = req.headers.authorization || '';
    const cronSecret = process.env.CRON_SECRET || '';
    const adminKey = process.env.ADMIN_API_KEY || '';
    const isCron = cronSecret && authHeader === 'Bearer ' + cronSecret;
    const isAdmin = adminKey && authHeader === 'Bearer ' + adminKey;
    if (!isCron && !isAdmin) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.log('[SMS] BREVO_API_KEY non configurée — SMS ignoré');
        return res.status(200).json({ sent: false, reason: 'BREVO_API_KEY not configured' });
    }

    const { phone, message, sender } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'phone and message required' });
    }

    // Formater le numéro FR : 06... → +336...
    let formattedPhone = phone.replace(/\s/g, '').replace(/\./g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '+33' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                type: 'transactional',
                unicodeEnabled: true,
                sender: sender || 'MaisonEclat',
                recipient: formattedPhone,
                content: message,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`[SMS] ✅ Envoyé à ${formattedPhone.substring(0, 6)}***`);
            return res.status(200).json({ sent: true, messageId: data.messageId });
        } else {
            console.error('[SMS] Erreur Brevo:', data);
            return res.status(200).json({ sent: false, error: data.message });
        }
    } catch (error) {
        console.error('[SMS] Erreur:', error.message);
        return res.status(200).json({ sent: false, error: error.message });
    }
};
