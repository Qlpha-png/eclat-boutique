/**
 * POST /api/admin/bulk-import — Import massif de produits dans Supabase
 * Protégé par clé secrète (BULK_IMPORT_KEY en env var)
 * Body: { products: [...], key: "secret" }
 */
const { getSupabase } = require('../_middleware/auth');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    // Vérifier clé admin (ADMIN_API_KEY en env var Vercel)
    var key = (req.body && req.body.key) || '';
    var expected = process.env.ADMIN_API_KEY || '';
    if (!expected || key !== expected) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    var products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'products array required' });
    }

    var sb = getSupabase();
    var inserted = 0;
    var skipped = 0;
    var errors = [];

    // Insert par batch de 50
    for (var i = 0; i < products.length; i += 50) {
        var batch = products.slice(i, i + 50).map(function(p) {
            var slug = p.name.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            return {
                name: p.name,
                slug: slug,
                price: parseFloat(p.price),
                compare_at_price: null,
                tagline: p.tagline || null,
                description: p.description || null,
                category: p.category || null,
                images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
                badge: p.badge || null,
                is_active: true,
                is_featured: p.bestseller || false,
                stock: p.stock || 100,
                metadata: p.subcategory ? { subcategory: p.subcategory } : {}
            };
        });

        var { data, error } = await sb
            .from('products')
            .upsert(batch, { onConflict: 'slug', ignoreDuplicates: true })
            .select('id');

        if (error) {
            errors.push({ batch: Math.floor(i/50), error: error.message });
        } else {
            inserted += (data ? data.length : 0);
        }
    }

    return res.status(200).json({
        inserted: inserted,
        skipped: skipped,
        total: products.length,
        errors: errors
    });
};
