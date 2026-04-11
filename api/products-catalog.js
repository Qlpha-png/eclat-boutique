/**
 * GET /api/products-catalog — Catalogue public avec pagination, filtres, tri, recherche
 * Params : ?page=1&limit=24&category=visage&concern=acne&sort=popular&q=serum&gender=femme
 * Cache CDN 5 min
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'public')) return;

    var origin = req.headers.origin || '';
    var ALLOWED_ORIGINS = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

    var sb = getSupabase();

    try {
        var page = Math.max(1, parseInt(req.query.page) || 1);
        var limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 24));
        var offset = (page - 1) * limit;
        var category = (req.query.category || '').trim().toLowerCase();
        var subcategory = (req.query.subcategory || '').trim().toLowerCase();
        var concern = (req.query.concern || '').trim().toLowerCase();
        var gender = (req.query.gender || '').trim().toLowerCase();
        var sort = (req.query.sort || 'popular').trim();
        var q = (req.query.q || '').trim();
        var trending = req.query.trending === 'true';
        var minScore = parseInt(req.query.minScore) || 0;

        var query = sb.from('products')
            .select('id, name, slug, price, compare_at_price, tagline, description, category, subcategory, images, badge, is_featured, metadata, concerns, gender, clean_beauty_score, trending, bestseller_rank, created_at', { count: 'exact' })
            .eq('is_active', true);

        // Filtres
        if (category) query = query.eq('category', category);
        if (subcategory) query = query.eq('subcategory', subcategory);
        if (gender) query = query.eq('gender', gender);
        if (trending) query = query.eq('trending', true);
        if (minScore > 0) query = query.gte('clean_beauty_score', minScore);
        if (concern) query = query.contains('concerns', [concern]);

        // Recherche texte
        if (q) {
            // Remove any characters that could break the Supabase filter syntax
            var sanitizedQ = q.replace(/[^a-zA-Z0-9\s\u00C0-\u024F\u0300-\u036f'-]/g, '');
            query = query.or('name.ilike.%' + sanitizedQ + '%,description.ilike.%' + sanitizedQ + '%,tagline.ilike.%' + sanitizedQ + '%');
        }

        // Tri
        switch (sort) {
            case 'price_asc': query = query.order('price', { ascending: true }); break;
            case 'price_desc': query = query.order('price', { ascending: false }); break;
            case 'newest': query = query.order('created_at', { ascending: false }); break;
            case 'score': query = query.order('clean_beauty_score', { ascending: false, nullsFirst: false }); break;
            case 'name': query = query.order('name', { ascending: true }); break;
            default: // popular
                query = query.order('bestseller_rank', { ascending: true, nullsFirst: false })
                             .order('created_at', { ascending: false });
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        var { data, error, count } = await query;
        if (error) throw error;

        // Catégories disponibles pour navigation
        var { data: cats } = await sb
            .from('products')
            .select('category')
            .eq('is_active', true);

        var categories = [];
        if (cats) {
            var seen = {};
            for (var i = 0; i < cats.length; i++) {
                var c = cats[i].category;
                if (c && !seen[c]) { seen[c] = true; categories.push(c); }
            }
            categories.sort();
        }

        return res.status(200).json({
            products: data || [],
            total: count || 0,
            page: page,
            limit: limit,
            totalPages: Math.ceil((count || 0) / limit),
            categories: categories
        });
    } catch (err) {
        console.error('[products-catalog]', err.message);
        return res.status(500).json({ error: 'Erreur catalogue' });
    }
};
