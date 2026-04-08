// ============================
// ÉCLAT — API Commandes v2
// GET /api/v2/orders — Mes commandes (authentifié)
// GET /api/v2/orders?id=xxx — Détail commande
// POST /api/v2/orders — Créer commande (interne, depuis webhook)
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
        // ===== LISTE COMMANDES CLIENT =====
        if (req.method === 'GET') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
            if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

            // Trouver le customer
            const { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('auth_id', user.id)
                .single();

            if (!customer) return res.status(200).json({ data: [] });

            const orderId = req.query.id;

            if (orderId) {
                // Détail d'une commande
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('id', orderId)
                    .eq('customer_id', customer.id)
                    .single();

                if (error || !data) return res.status(404).json({ error: 'Order not found' });
                return res.status(200).json({ data });
            }

            // Liste des commandes
            const { data, error } = await supabase
                .from('orders')
                .select('id, status, total, shipping_cost, created_at, tracking_number, carrier, fulfillment_status')
                .eq('customer_id', customer.id)
                .order('created_at', { ascending: false });

            return res.status(200).json({ data: data || [] });
        }

        // ===== CRÉER COMMANDE (interne) =====
        if (req.method === 'POST') {
            const adminKey = req.headers.authorization?.replace('Bearer ', '');
            if (adminKey !== process.env.ADMIN_API_KEY) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const { stripe_session_id, stripe_payment_intent, email, phone, items, subtotal, shipping_cost, total, shipping_address, promo_code } = req.body;

            // Chercher ou créer le customer
            let { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('email', email)
                .single();

            if (!customer) {
                const { data: newCustomer } = await supabase
                    .from('customers')
                    .insert({ email, phone, referral_code: 'ECL' + Math.random().toString(36).substring(2, 8).toUpperCase() })
                    .select('id')
                    .single();
                customer = newCustomer;
            }

            // Créer la commande
            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .insert({
                    customer_id: customer?.id,
                    stripe_session_id,
                    stripe_payment_intent,
                    email, phone,
                    subtotal, shipping_cost, total,
                    shipping_address,
                    promo_code,
                    status: 'paid'
                })
                .select('id')
                .single();

            if (orderErr) return res.status(500).json({ error: orderErr.message });

            // Créer les items
            if (items && items.length > 0) {
                const orderItems = items.map(item => ({
                    order_id: order.id,
                    product_id: typeof item.id === 'number' ? item.id : null,
                    name: item.name,
                    price: item.price,
                    quantity: item.qty || item.quantity || 1,
                    image_url: item.image
                }));

                await supabase.from('order_items').insert(orderItems);
            }

            // Mettre à jour le total dépensé du client
            if (customer) {
                await supabase.rpc('increment_customer_spent', {
                    customer_id_param: customer.id,
                    amount_param: total
                });
            }

            return res.status(201).json({ success: true, order_id: order.id });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
