const Stripe = require('stripe');

const { applyRateLimit } = require('./_middleware/rateLimit');
const { checkFraud } = require('./_middleware/fraud');
const { getSupabase } = require('./_middleware/auth');

const SITE_URL = 'https://maison-eclat.shop';

const ALLOWED_ORIGINS = [
    'https://maison-eclat.shop',
    'https://www.maison-eclat.shop',
    'https://eclat-boutique.vercel.app'
];

module.exports = async (req, res) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // CSRF / Origin check — reject requests from unauthorized origins
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
        return res.status(403).json({ error: 'Origine non autorisée' });
    }

    if (applyRateLimit(req, res, 'public')) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!secretKey) {
        console.error('[checkout] STRIPE_SECRET_KEY not configured');
        return res.status(500).json({ error: 'Service de paiement temporairement indisponible' });
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

        // SERVER-SIDE PRICE VERIFICATION — query real prices from Supabase
        const sb = getSupabase();
        const productNames = items.map(i => i.name);
        const { data: dbProducts, error: dbError } = await sb
            .from('products')
            .select('id, name, price')
            .in('name', productNames)
            .eq('is_active', true);

        if (dbError) {
            console.error('[checkout] Supabase product lookup error:', dbError.message);
            return res.status(500).json({ error: 'Erreur de vérification des prix' });
        }

        // Build a lookup map: product name -> real price
        const priceMap = {};
        if (dbProducts) {
            for (const p of dbProducts) {
                priceMap[p.name] = p.price;
            }
        }

        // Verify each item's price against the database
        for (const item of items) {
            const realPrice = priceMap[item.name];
            if (realPrice === undefined) {
                console.error('[checkout] Product not found in DB:', item.name);
                return res.status(400).json({ error: `Produit introuvable : ${item.name}` });
            }
            if (Math.abs(item.price - realPrice) > 0.01) {
                console.error('[checkout] Price mismatch for', item.name, '- client:', item.price, 'db:', realPrice);
                return res.status(400).json({ error: 'Prix invalide. Veuillez rafraîchir la page.' });
            }
            // Use the verified DB price instead of client-sent price
            item.price = realPrice;
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
            success_url: `${SITE_URL}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${SITE_URL}/pages/checkout.html?cancelled=1`,
            allow_promotion_codes: true,
            phone_number_collection: { enabled: true },
            locale: stripeLocale,
            shipping_address_collection: {
                // Toute l'Europe : UE + EEE + UK + CH + micro-états
                allowed_countries: [
                    'FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE', 'GB',
                    'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT',
                    'FI', 'SE', 'DK', 'NO', 'IS', 'GR', 'CY', 'MT', 'MC', 'AD', 'LI'
                ],
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
        console.error('[checkout] Stripe error:', error.message, error.type, error.code);
        return res.status(500).json({
            error: 'Erreur lors de la création du paiement. Réessayez.'
        });
    }
};
