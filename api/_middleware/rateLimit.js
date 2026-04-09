/**
 * Rate Limiter in-memory pour Vercel Serverless
 * Limite par IP — reset automatique par fenêtre glissante
 * Note : sur Vercel, chaque cold start repart à zéro (acceptable pour notre trafic)
 */

const rateLimitMap = new Map();

const PRESETS = {
    admin: { windowMs: 60000, max: 60 },   // 60 req/min pour admin
    public: { windowMs: 60000, max: 20 },   // 20 req/min pour endpoints publics
    auth: { windowMs: 60000, max: 10 },     // 10 req/min pour login/register
    chat: { windowMs: 60000, max: 10 },     // 10 req/min pour le chatbot IA
    contact: { windowMs: 300000, max: 5 },  // 5 req/5min pour contact/newsletter
    webhook: null                            // Pas de limite pour webhooks Stripe
};

// Nettoyage périodique des entrées expirées (toutes les 5 min)
setInterval(function () {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now - entry.windowStart > 600000) {
            rateLimitMap.delete(key);
        }
    }
}, 300000);

/**
 * Applique le rate limiting sur une requête
 * @param {Request} req
 * @param {Response} res
 * @param {string} preset - Clé du preset ('admin', 'public', 'auth', 'chat', 'contact', 'webhook')
 * @returns {boolean} true si la requête est bloquée (réponse déjà envoyée)
 */
function applyRateLimit(req, res, preset) {
    const config = PRESETS[preset];
    if (!config) return false; // webhook = pas de limite

    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const key = preset + ':' + ip;
    const now = Date.now();

    let entry = rateLimitMap.get(key);
    if (!entry || (now - entry.windowStart) > config.windowMs) {
        entry = { windowStart: now, count: 0 };
        rateLimitMap.set(key, entry);
    }

    entry.count++;

    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.max - entry.count));

    if (entry.count > config.max) {
        res.setHeader('Retry-After', Math.ceil((entry.windowStart + config.windowMs - now) / 1000));
        res.status(429).json({ error: 'Trop de requêtes, réessayez dans un moment' });
        return true;
    }

    return false;
}

module.exports = { applyRateLimit, PRESETS };
