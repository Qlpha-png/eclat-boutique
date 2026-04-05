const Stripe = require('stripe');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY not set', debug: 'env missing' });
    }

    // Debug: check key format without exposing it
    if (!secretKey.startsWith('sk_test_')) {
        return res.status(500).json({ error: 'Invalid key format', debug: 'key does not start with sk_test_', keyStart: secretKey.substring(0, 10) });
    }

    try {
        const stripe = new Stripe(secretKey);

        const { items, shipping_cost, customer_email } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items provided' });
        }

        const line_items = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));

        if (shipping_cost && shipping_cost > 0) {
            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Frais de livraison',
                    },
                    unit_amount: Math.round(shipping_cost * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin || 'https://eclat-boutique.vercel.app'}/pages/success.html`,
            cancel_url: `${req.headers.origin || 'https://eclat-boutique.vercel.app'}/pages/checkout.html`,
            locale: 'fr',
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU'],
            },
            customer_email: customer_email || undefined,
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            type: error.type || 'unknown',
            code: error.code || 'unknown'
        });
    }
};
