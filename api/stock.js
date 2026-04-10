/**
 * GET /api/stock?productId=X — Stock temps réel depuis inventory
 * Public, cache court (5min)
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'public')) return;

    var productId = parseInt(req.query.productId);
    if (!productId) return res.status(400).json({ error: 'productId requis' });

    try {
        var sb = getSupabase();
        var { data: inv, error } = await sb
            .from('inventory')
            .select('stock_quantity, reserved_quantity, low_stock_threshold')
            .eq('product_id', productId)
            .single();

        if (error || !inv) {
            // Pas d'entrée inventory = stock non géré, considérer en stock
            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
            return res.status(200).json({ available: true, quantity: null, low: false });
        }

        var available = inv.stock_quantity - inv.reserved_quantity;
        var isLow = available > 0 && available <= inv.low_stock_threshold;

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({
            available: available > 0,
            quantity: available,
            low: isLow,
            threshold: inv.low_stock_threshold
        });
    } catch (err) {
        console.error('[stock]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
