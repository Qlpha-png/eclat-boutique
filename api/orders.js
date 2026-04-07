const Stripe = require('stripe');

// API Orders - Dashboard admin pour lister/gérer les commandes
// GET /api/orders - Liste les paiements Stripe récents
// GET /api/orders?session_id=xxx - Détails d'une commande
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // Authentification simple par clé admin
    const adminKey = process.env.ADMIN_API_KEY || '';
    const authHeader = req.headers.authorization || '';

    if (adminKey && authHeader !== `Bearer ${adminKey}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY not set' });
    }

    try {
        const stripe = new Stripe(secretKey);
        const { session_id } = req.query;

        // Détails d'une commande spécifique
        if (session_id) {
            const session = await stripe.checkout.sessions.retrieve(session_id, {
                expand: ['line_items', 'customer_details', 'payment_intent']
            });

            return res.status(200).json({
                id: session.id,
                status: session.payment_status,
                created: new Date(session.created * 1000).toISOString(),
                customer: {
                    email: session.customer_details?.email,
                    name: session.customer_details?.name,
                    phone: session.customer_details?.phone
                },
                shipping: session.shipping_details,
                items: session.line_items?.data.map(item => ({
                    name: item.description,
                    quantity: item.quantity,
                    unitPrice: item.price?.unit_amount / 100,
                    total: item.amount_total / 100
                })),
                total: session.amount_total / 100,
                currency: session.currency
            });
        }

        // Liste des commandes récentes
        const limit = Math.min(parseInt(req.query.limit) || 25, 100);
        const sessions = await stripe.checkout.sessions.list({
            limit,
            expand: ['data.line_items']
        });

        const orders = sessions.data
            .filter(s => s.payment_status === 'paid')
            .map(s => ({
                id: s.id,
                created: new Date(s.created * 1000).toISOString(),
                email: s.customer_details?.email || s.customer_email,
                items: s.line_items?.data?.length || 0,
                total: (s.amount_total || 0) / 100,
                currency: s.currency || 'eur',
                status: s.payment_status,
                fulfillment: 'pending' // À connecter avec un système de suivi
            }));

        return res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
