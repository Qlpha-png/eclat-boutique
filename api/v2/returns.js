// ============================
// ÉCLAT — API Retours v2
// POST /api/v2/returns — Demander un retour (authentifié)
// GET /api/v2/returns — Mes retours
// PUT /api/v2/returns?id=xxx — Admin: mettre à jour un retour
// ============================

const { getSupabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    try {
        // ===== DEMANDER UN RETOUR =====
        if (req.method === 'POST') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user } } = await supabase.auth.getUser(token);
            if (!user) return res.status(401).json({ error: 'Invalid token' });

            const { data: customer } = await supabase
                .from('customers').select('id').eq('auth_id', user.id).single();
            if (!customer) return res.status(403).json({ error: 'Customer not found' });

            const { order_id, reason, description } = req.body;
            if (!order_id || !reason) {
                return res.status(400).json({ error: 'order_id and reason required' });
            }

            // Vérifier que la commande appartient au client
            const { data: order } = await supabase
                .from('orders').select('id, total, created_at')
                .eq('id', order_id).eq('customer_id', customer.id).single();

            if (!order) return res.status(404).json({ error: 'Order not found' });

            // Vérifier le délai de retour (30 jours)
            const daysSinceOrder = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceOrder > 30) {
                return res.status(400).json({ error: 'Return period expired (30 days)' });
            }

            const { data: returnReq, error } = await supabase
                .from('returns')
                .insert({
                    order_id,
                    customer_id: customer.id,
                    reason,
                    description: description || '',
                    refund_amount: order.total
                })
                .select('id')
                .single();

            if (error) return res.status(500).json({ error: error.message });

            return res.status(201).json({
                success: true,
                return_id: returnReq.id,
                message: 'Return request submitted — we will review within 48h'
            });
        }

        // ===== MES RETOURS =====
        if (req.method === 'GET') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user } } = await supabase.auth.getUser(token);
            if (!user) return res.status(401).json({ error: 'Invalid token' });

            const { data: customer } = await supabase
                .from('customers').select('id').eq('auth_id', user.id).single();

            const { data } = await supabase
                .from('returns')
                .select('*, orders(id, total, created_at)')
                .eq('customer_id', customer?.id)
                .order('created_at', { ascending: false });

            return res.status(200).json({ data: data || [] });
        }

        // ===== ADMIN: METTRE À JOUR RETOUR =====
        if (req.method === 'PUT') {
            const adminKey = req.headers.authorization?.replace('Bearer ', '');
            if (adminKey !== process.env.ADMIN_API_KEY) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const returnId = req.query.id;
            const { status, admin_notes, refund_amount } = req.body;

            const updates = {};
            if (status) updates.status = status;
            if (admin_notes) updates.admin_notes = admin_notes;
            if (refund_amount) updates.refund_amount = refund_amount;

            // Si le statut passe à "refunded", effectuer le remboursement Stripe
            if (status === 'refunded') {
                const { data: returnData } = await supabase
                    .from('returns')
                    .select('order_id, refund_amount')
                    .eq('id', returnId)
                    .single();

                if (returnData) {
                    const { data: order } = await supabase
                        .from('orders')
                        .select('stripe_payment_intent')
                        .eq('id', returnData.order_id)
                        .single();

                    if (order?.stripe_payment_intent) {
                        const Stripe = require('stripe');
                        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
                        const refund = await stripe.refunds.create({
                            payment_intent: order.stripe_payment_intent,
                            amount: Math.round((refund_amount || returnData.refund_amount) * 100)
                        });
                        updates.stripe_refund_id = refund.id;
                    }
                }
            }

            const { error } = await supabase
                .from('returns')
                .update(updates)
                .eq('id', returnId);

            if (error) return res.status(500).json({ error: error.message });

            return res.status(200).json({ success: true });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
