// ============================
// ÉCLAT — API Avis v2
// GET /api/v2/reviews?product_id=1 — Avis d'un produit
// POST /api/v2/reviews — Laisser un avis (authentifié)
// ============================

const { getSupabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    try {
        // ===== LIRE LES AVIS D'UN PRODUIT =====
        if (req.method === 'GET') {
            const productId = parseInt(req.query.product_id);
            if (!productId) return res.status(400).json({ error: 'product_id required' });

            const { data, error } = await supabase
                .from('reviews')
                .select('id, rating, title, body, photos, verified, created_at, customers(name)')
                .eq('product_id', productId)
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) return res.status(500).json({ error: error.message });

            // Stats
            const ratings = (data || []).map(r => r.rating);
            const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
            const distribution = [5, 4, 3, 2, 1].map(star => ({
                stars: star,
                count: ratings.filter(r => r === star).length,
                percentage: ratings.length ? Math.round(ratings.filter(r => r === star).length / ratings.length * 100) : 0
            }));

            return res.status(200).json({
                data: data || [],
                stats: {
                    average: parseFloat(avg),
                    total: ratings.length,
                    distribution
                }
            });
        }

        // ===== POSTER UN AVIS =====
        if (req.method === 'POST') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
            if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

            const { product_id, order_id, rating, title, body } = req.body;

            if (!product_id || !rating || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'product_id and rating (1-5) required' });
            }

            // Trouver le customer
            const { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('auth_id', user.id)
                .single();

            if (!customer) return res.status(403).json({ error: 'Customer profile not found' });

            // Vérifier si l'achat est réel (verified review)
            let verified = false;
            if (order_id) {
                const { data: order } = await supabase
                    .from('order_items')
                    .select('id')
                    .eq('order_id', order_id)
                    .eq('product_id', product_id)
                    .single();
                verified = !!order;
            }

            // Vérifier qu'il n'a pas déjà laissé un avis
            const { data: existing } = await supabase
                .from('reviews')
                .select('id')
                .eq('product_id', product_id)
                .eq('customer_id', customer.id)
                .single();

            if (existing) {
                return res.status(409).json({ error: 'You already reviewed this product' });
            }

            const { data: review, error: insertErr } = await supabase
                .from('reviews')
                .insert({
                    product_id,
                    customer_id: customer.id,
                    order_id: order_id || null,
                    rating,
                    title: title || '',
                    body: body || '',
                    verified,
                    approved: false // admin doit valider
                })
                .select('id')
                .single();

            if (insertErr) return res.status(500).json({ error: insertErr.message });

            return res.status(201).json({
                success: true,
                review_id: review.id,
                verified,
                message: 'Review submitted — pending admin approval'
            });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
