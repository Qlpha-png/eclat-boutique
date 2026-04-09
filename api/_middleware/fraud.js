/**
 * Middleware anti-fraude pour checkout
 * Vérifie : velocity par IP, velocity par email, montant suspect, doublons
 */

// Stockage in-memory (reset au redémarrage serverless — acceptable pour Vercel)
const checkoutHistory = {};
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 min
const WINDOW_MS = 60 * 60 * 1000; // 1 heure

// Nettoyage périodique
setInterval(() => {
    const now = Date.now();
    for (const key of Object.keys(checkoutHistory)) {
        checkoutHistory[key] = checkoutHistory[key].filter(t => now - t < WINDOW_MS);
        if (checkoutHistory[key].length === 0) delete checkoutHistory[key];
    }
}, CLEANUP_INTERVAL);

/**
 * Vérifie les patterns de fraude avant checkout
 * @returns {object|null} null = OK, objet = fraude détectée
 */
function checkFraud(req, { email, items, total }) {
    const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const flags = [];

    // 1. Velocity par IP : max 5 checkouts/heure
    const ipKey = 'ip:' + ip;
    if (!checkoutHistory[ipKey]) checkoutHistory[ipKey] = [];
    checkoutHistory[ipKey].push(now);
    const ipCount = checkoutHistory[ipKey].filter(t => now - t < WINDOW_MS).length;
    if (ipCount > 5) {
        flags.push({ type: 'velocity_ip', detail: ipCount + ' checkouts/heure depuis ' + ip });
    }

    // 2. Velocity par email : max 3 checkouts/heure
    if (email) {
        const emailKey = 'email:' + email.toLowerCase();
        if (!checkoutHistory[emailKey]) checkoutHistory[emailKey] = [];
        checkoutHistory[emailKey].push(now);
        const emailCount = checkoutHistory[emailKey].filter(t => now - t < WINDOW_MS).length;
        if (emailCount > 3) {
            flags.push({ type: 'velocity_email', detail: emailCount + ' checkouts/heure pour ' + email });
        }
    }

    // 3. Montant suspect : > 500€ ou < 1€
    if (total > 500) {
        flags.push({ type: 'high_amount', detail: 'Total ' + total + '€ dépasse le seuil' });
    }
    if (total < 1) {
        flags.push({ type: 'low_amount', detail: 'Total ' + total + '€ suspect' });
    }

    // 4. Quantité excessive : un même article > 10 fois
    if (items && Array.isArray(items)) {
        for (const item of items) {
            if (item.qty > 10) {
                flags.push({ type: 'high_qty', detail: item.name + ' x' + item.qty });
            }
        }
    }

    // 5. Email jetable (domaines connus)
    if (email) {
        const disposable = ['yopmail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
            'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com', 'guerrillamailblock.com',
            'grr.la', 'dispostable.com', 'trashmail.com', 'maildrop.cc'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (disposable.includes(domain)) {
            flags.push({ type: 'disposable_email', detail: 'Email jetable: ' + domain });
        }
    }

    if (flags.length === 0) return null;

    // Log pour monitoring
    console.warn('[FRAUD]', ip, email, flags.map(f => f.type).join(', '));

    // Bloquer si velocity dépassée ou email jetable, sinon juste flag
    const blocking = flags.some(f => ['velocity_ip', 'velocity_email', 'disposable_email'].includes(f.type));

    return { blocked: blocking, flags };
}

module.exports = { checkFraud };
