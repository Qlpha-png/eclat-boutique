/**
 * GET /api/admin/supplier-search — Recherche unifiée multi-fournisseurs
 * ?q=serum+vitamine+c&supplier=cj|bigbuy|all&page=1
 * Auth admin requis
 */
const { getSupabase, requireAdmin } = require('../_middleware/auth');

var CJ_API_KEY = process.env.CJ_API_KEY || '';
var CJ_EMAIL = process.env.CJ_EMAIL || '';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    var admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    var q = (req.query.q || '').trim();
    var supplier = (req.query.supplier || 'cj').trim().toLowerCase();
    var page = Math.max(1, parseInt(req.query.page) || 1);

    if (!q) return res.status(400).json({ error: 'Terme de recherche requis (q)' });

    try {
        var results = [];

        if (supplier === 'cj' || supplier === 'all') {
            var cjResults = await searchCJ(q, page);
            results = results.concat(cjResults);
        }

        // BigBuy, Ankorstore etc. peuvent être ajoutés ici avec le même pattern

        return res.status(200).json({
            results: results,
            query: q,
            supplier: supplier,
            page: page
        });
    } catch (err) {
        console.error('[supplier-search]', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Recherche dans CJDropshipping via leur API
 */
async function searchCJ(query, page) {
    if (!CJ_API_KEY) return [];

    try {
        // Get CJ access token
        var tokenRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY })
        });
        var tokenData = await tokenRes.json();
        if (!tokenData.data || !tokenData.data.accessToken) return [];
        var token = tokenData.data.accessToken;

        // Search products
        var searchRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': token
            }
        });

        // Use product search endpoint
        var listRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/list?productNameEn=' + encodeURIComponent(query) + '&pageNum=' + page + '&pageSize=20', {
            method: 'GET',
            headers: { 'CJ-Access-Token': token }
        });
        var listData = await listRes.json();

        if (!listData.data || !listData.data.list) return [];

        return listData.data.list.map(function(p) {
            return {
                supplier: 'cj',
                supplierId: p.pid || '',
                name: p.productNameEn || p.productName || '',
                image: p.productImage || '',
                images: p.productImageSet || [],
                price: parseFloat(p.sellPrice) || 0,
                msrp: parseFloat(p.productWeight) || 0,
                category: p.categoryName || '',
                variants: (p.variants || []).length,
                stock: p.productType === 'AVAILABLE' ? 'En stock' : 'Sur demande',
                url: 'https://cjdropshipping.com/product/' + (p.pid || '')
            };
        });
    } catch (err) {
        console.error('[CJ search]', err.message);
        return [];
    }
}
