/**
 * GET /api/frequently-bought?productId=X — Co-occurrences d'achat
 * Fallback sur crossSellMap statique si peu de données
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

    // Fallback statique
    var crossSellMap = {
        1:[8,3], 2:[5,6], 3:[8,4], 4:[3,8], 5:[2,9],
        6:[2,5], 7:[1,10], 8:[11,9], 9:[8,12], 10:[8,7],
        11:[8,10], 12:[9,11], 13:[14,7], 14:[13,15], 15:[2,5]
    };

    try {
        var sb = getSupabase();

        // Query co-occurrences: produits achetés dans les mêmes commandes
        var { data: coItems } = await sb.rpc('get_frequently_bought', { p_product_id: productId, p_limit: 3 }).catch(function() { return { data: null }; });

        if (coItems && coItems.length > 0) {
            var ids = coItems.map(function(item) { return item.product_id; });
            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
            return res.status(200).json({ productIds: ids, source: 'data' });
        }

        // Fallback statique
        var fallback = crossSellMap[productId] || [];
        res.setHeader('Cache-Control', 's-maxage=86400');
        return res.status(200).json({ productIds: fallback, source: 'static' });

    } catch (err) {
        console.error('[frequently-bought]', err.message);
        var fb = crossSellMap[productId] || [];
        return res.status(200).json({ productIds: fb, source: 'fallback' });
    }
};
