/**
 * GET /api/products — Catalogue public produits + coffrets
 * Cache CDN 60s pour performance
 * Pas d'auth requise
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop'
];

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'public')) return;

    // Cache CDN 60 secondes
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    try {
        const sb = getSupabase();

        const productsRes = await sb.from('products')
            .select('id, name, slug, price, compare_at_price, tagline, description, category, images, badge, is_featured, metadata')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        if (productsRes.error) throw productsRes.error;

        // Bundles table may not exist yet — fail silently
        let bundles = [];
        try {
            const bundlesRes = await sb.from('bundles').select('*').eq('active', true);
            if (!bundlesRes.error) bundles = bundlesRes.data || [];
        } catch (e) { /* table doesn't exist */ }

        return res.status(200).json({
            products: productsRes.data || [],
            bundles: bundles
        });
    } catch (err) {
        console.error('[products]', err.message);
        return res.status(500).json({ error: 'Erreur chargement catalogue' });
    }
};
