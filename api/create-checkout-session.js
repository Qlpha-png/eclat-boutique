const Stripe = require('stripe');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({ error: 'Stripe is not configured on server' });
    }

    const stripe = new Stripe(secretKey, {
        apiVersion: '2024-12-18.acacia',
        timeout: 10000,
    });

    try {
        const { items, shipping_cost, customer_email } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items provided' });
        }

        // Build line items for Stripe Checkout
        const line_items = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.qty,
        }));

        // Add shipping cost if applicable
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

        const sessionParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin || 'https://eclat-boutique.vercel.app'}/pages/success.html`,
            cancel_url: `${req.headers.origin || 'https://eclat-boutique.vercel.app'}/pages/checkout.html`,
            locale: 'fr',
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU'],
            },
        };

        if (customer_email) {
            sessionParams.customer_email = customer_email;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
