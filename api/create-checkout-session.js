const Stripe = require('stripe');

const { applyRateLimit } = require('./_middleware/rateLimit');
const { checkFraud } = require('./_middleware/fraud');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (applyRateLimit(req, res, 'public')) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY not set', debug: 'env missing' });
    }

    // Check key format
    if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
        return res.status(500).json({ error: 'Invalid key format' });
    }

    try {
        const stripe = new Stripe(secretKey);

        const { items, shipping_cost, customer_email } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items provided' });
        }

        // Server-side validation
        for (const item of items) {
            if (typeof item.price !== 'number' || item.price <= 0 || item.price > 500) {
                return res.status(400).json({ error: 'Invalid item price' });
            }
            if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) {
                return res.status(400).json({ error: 'Invalid item quantity' });
            }
            if (typeof item.name !== 'string' || item.name.length === 0 || item.name.length > 200) {
                return res.status(400).json({ error: 'Invalid item name' });
            }
        }
        if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (shipping_cost !== undefined && shipping_cost !== null) {
            const validShipping = [0, 3.90, 7.90];
            if (typeof shipping_cost !== 'number' || !validShipping.includes(shipping_cost)) {
                return res.status(400).json({ error: 'Invalid shipping cost' });
            }
        }

        // Anti-fraude
        const itemsTotal = items.reduce((s, i) => s + i.price * i.qty, 0) + (shipping_cost || 0);
        const fraudResult = checkFraud(req, { email: customer_email, items, total: itemsTotal });
        if (fraudResult && fraudResult.blocked) {
            return res.status(429).json({ error: 'Trop de tentatives. Réessayez plus tard.' });
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

        // Déterminer la locale selon la langue du client
        const langMap = { fr: 'fr', en: 'en', es: 'es', de: 'de' };
        const clientLang = req.body.lang || 'fr';
        const stripeLocale = langMap[clientLang] || 'fr';

        const session = await stripe.checkout.sessions.create({
            // Apple Pay, Google Pay, Link (Stripe wallet) — auto-détecté par Stripe
            payment_method_types: ['card', 'link'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin || 'https://maison-eclat.shop'}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'https://maison-eclat.shop'}/pages/checkout.html?cancelled=1`,
            allow_promotion_codes: true,
            phone_number_collection: { enabled: true },
            locale: stripeLocale,
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE', 'GB'],
            },
            customer_email: customer_email || undefined,
            // Metadata pour tracking et factures
            metadata: {
                source: 'eclat-website',
                lang: clientLang,
                items_count: String(items.length),
                total_eur: String(itemsTotal.toFixed(2))
            },
            // Expiration 30 minutes (anti-fraude)
            expires_at: Math.floor(Date.now() / 1000) + 1800,
            // Consentement RGPD — ne pas stocker automatiquement
            consent_collection: {
                terms_of_service: 'required'
            },
            custom_text: {
                terms_of_service_acceptance: {
                    message: clientLang === 'fr'
                        ? 'J\'accepte les [Conditions Générales de Vente](https://maison-eclat.shop/pages/cgv.html) et la [Politique de Confidentialité](https://maison-eclat.shop/pages/confidentialite.html).'
                        : clientLang === 'en'
                        ? 'I agree to the [Terms of Service](https://maison-eclat.shop/pages/cgv.html) and [Privacy Policy](https://maison-eclat.shop/pages/confidentialite.html).'
                        : clientLang === 'es'
                        ? 'Acepto las [Condiciones Generales](https://maison-eclat.shop/pages/cgv.html) y la [Política de Privacidad](https://maison-eclat.shop/pages/confidentialite.html).'
                        : 'Ich akzeptiere die [AGB](https://maison-eclat.shop/pages/cgv.html) und die [Datenschutzrichtlinie](https://maison-eclat.shop/pages/confidentialite.html).'
                }
            }
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
