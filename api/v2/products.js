// ============================
// ÉCLAT — API Produits v2 (Supabase)
// GET /api/v2/products — Liste avec pagination, filtres, recherche
// GET /api/v2/products?id=1 — Détail d'un produit
// GET /api/v2/products?category=visage — Par catégorie
// GET /api/v2/products?search=LED — Recherche texte
// GET /api/v2/products?bestseller=true — Best-sellers
// ============================

const { getSupabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const supabase = getSupabase();

    // Fallback: si Supabase n'est pas configuré, utiliser les données statiques
    if (!supabase) {
        return res.status(200).json({
            source: 'static',
            message: 'Supabase not configured — using static products.js',
            data: []
        });
    }

    try {
        const { id, category, search, bestseller, page = 1, limit = 20, sort = 'position' } = req.query;

        // Détail d'un produit
        if (id) {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories(name, slug),
                    reviews(id, rating, title, body, verified, created_at, customers(name)),
                    inventory(stock_quantity)
                `)
                .eq('id', parseInt(id))
                .eq('active', true)
                .single();

            if (error || !data) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Cross-sell: produits de la même catégorie
            const { data: related } = await supabase
                .from('products')
                .select('id, name, slug, price, image_url, rating')
                .eq('category_id', data.category_id)
                .neq('id', data.id)
                .eq('active', true)
                .limit(4);

            return res.status(200).json({
                source: 'database',
                data: { ...data, related: related || [] }
            });
        }

        // Liste de produits avec filtres
        let query = supabase
            .from('products')
            .select(`
                id, name, slug, price, old_price, description, image_url, badge,
                rating, review_count, bestseller, bestseller_rank, features,
                categories(name, slug),
                inventory(stock_quantity)
            `, { count: 'exact' })
            .eq('active', true);

        // Filtre catégorie
        if (category) {
            const { data: cat } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single();
            if (cat) {
                query = query.eq('category_id', cat.id);
            }
        }

        // Recherche texte
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Best-sellers
        if (bestseller === 'true') {
            query = query.eq('bestseller', true).order('bestseller_rank', { ascending: true });
        }

        // Tri
        switch (sort) {
            case 'price_asc': query = query.order('price', { ascending: true }); break;
            case 'price_desc': query = query.order('price', { ascending: false }); break;
            case 'rating': query = query.order('rating', { ascending: false }); break;
            case 'newest': query = query.order('created_at', { ascending: false }); break;
            default: query = query.order('bestseller', { ascending: false }).order('id');
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
        const from = (pageNum - 1) * pageSize;
        query = query.range(from, from + pageSize - 1);

        const { data, error, count } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
            source: 'database',
            data: data || [],
            pagination: {
                page: pageNum,
                limit: pageSize,
                total: count || 0,
                pages: Math.ceil((count || 0) / pageSize)
            }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
