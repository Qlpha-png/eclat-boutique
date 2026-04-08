// ============================
// ÉCLAT — API Admin v2
// CRUD produits, gestion commandes, avis, retours
// Auth: Bearer ADMIN_API_KEY
// ============================

const { getSupabase } = require('../../lib/supabase');

function isAdmin(req) {
    const key = req.headers.authorization?.replace('Bearer ', '');
    return key === process.env.ADMIN_API_KEY;
}

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    const resource = req.query.resource; // products, orders, reviews, customers, inventory

    try {
        // ===== PRODUCTS CRUD =====
        if (resource === 'products') {
            if (req.method === 'GET') {
                const { data } = await supabase.from('products')
                    .select('*, categories(name, slug), inventory(stock_quantity)')
                    .order('id');
                return res.status(200).json({ data });
            }
            if (req.method === 'POST') {
                const { data, error } = await supabase.from('products')
                    .insert(req.body).select().single();
                if (error) return res.status(400).json({ error: error.message });
                // Auto-create inventory
                await supabase.from('inventory').insert({ product_id: data.id, stock_quantity: 999 });
                return res.status(201).json({ data });
            }
            if (req.method === 'PUT') {
                const id = req.query.id;
                const { error } = await supabase.from('products').update(req.body).eq('id', id);
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json({ success: true });
            }
            if (req.method === 'DELETE') {
                const id = req.query.id;
                await supabase.from('products').update({ active: false }).eq('id', id);
                return res.status(200).json({ success: true });
            }
        }

        // ===== ORDERS MANAGEMENT =====
        if (resource === 'orders') {
            if (req.method === 'GET') {
                const { data } = await supabase.from('orders')
                    .select('*, order_items(*), customers(name, email)')
                    .order('created_at', { ascending: false })
                    .limit(100);
                return res.status(200).json({ data });
            }
            if (req.method === 'PUT') {
                const id = req.query.id;
                const { error } = await supabase.from('orders').update(req.body).eq('id', id);
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json({ success: true });
            }
        }

        // ===== REVIEWS MODERATION =====
        if (resource === 'reviews') {
            if (req.method === 'GET') {
                const { data } = await supabase.from('reviews')
                    .select('*, products(name), customers(name, email)')
                    .order('created_at', { ascending: false });
                return res.status(200).json({ data });
            }
            if (req.method === 'PUT') {
                const id = req.query.id;
                const { approved } = req.body;
                const { error } = await supabase.from('reviews').update({ approved }).eq('id', id);
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json({ success: true });
            }
            if (req.method === 'DELETE') {
                const id = req.query.id;
                await supabase.from('reviews').delete().eq('id', id);
                return res.status(200).json({ success: true });
            }
        }

        // ===== CUSTOMERS =====
        if (resource === 'customers') {
            if (req.method === 'GET') {
                const { data } = await supabase.from('customers')
                    .select('id, email, name, tier, loyalty_points, total_spent, created_at')
                    .order('total_spent', { ascending: false });
                return res.status(200).json({ data });
            }
        }

        // ===== INVENTORY =====
        if (resource === 'inventory') {
            if (req.method === 'GET') {
                const { data } = await supabase.from('inventory')
                    .select('*, products(id, name, image_url)')
                    .order('stock_quantity', { ascending: true });
                return res.status(200).json({ data });
            }
            if (req.method === 'PUT') {
                const productId = req.query.product_id;
                const { stock_quantity } = req.body;
                const { error } = await supabase.from('inventory')
                    .update({ stock_quantity }).eq('product_id', productId);
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json({ success: true });
            }
        }

        // ===== DASHBOARD STATS =====
        if (resource === 'stats') {
            const [
                { count: totalOrders },
                { count: totalCustomers },
                { count: pendingReviews },
                { count: pendingReturns }
            ] = await Promise.all([
                supabase.from('orders').select('*', { count: 'exact', head: true }),
                supabase.from('customers').select('*', { count: 'exact', head: true }),
                supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approved', false),
                supabase.from('returns').select('*', { count: 'exact', head: true }).eq('status', 'requested')
            ]);

            // Revenue totale
            const { data: revenueData } = await supabase
                .from('orders')
                .select('total')
                .in('status', ['paid', 'processing', 'shipped', 'delivered']);

            const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total), 0);

            return res.status(200).json({
                total_orders: totalOrders || 0,
                total_customers: totalCustomers || 0,
                total_revenue: totalRevenue,
                pending_reviews: pendingReviews || 0,
                pending_returns: pendingReturns || 0
            });
        }

        return res.status(400).json({ error: 'Invalid resource. Use: products, orders, reviews, customers, inventory, stats' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
