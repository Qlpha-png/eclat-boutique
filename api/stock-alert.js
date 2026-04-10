/**
 * POST /api/stock-alert — S'inscrire pour une alerte retour en stock
 * GET /api/stock-alert — Vérifier si inscrit (auth)
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'public')) return;

    var sb = getSupabase();

    if (req.method === 'POST') {
        var { email, productId } = req.body || {};
        if (!email || !productId) return res.status(400).json({ error: 'email et productId requis' });

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        await sb.from('stock_alerts').upsert({
            email: email.toLowerCase().trim(),
            product_id: Number(productId),
            notified: false,
            created_at: new Date().toISOString()
        }, { onConflict: 'email,product_id' }).catch(function() {});

        return res.status(200).json({ ok: true, message: 'Vous serez prévenu(e) du retour en stock.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
