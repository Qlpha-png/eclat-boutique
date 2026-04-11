// ============================
// ÉCLAT - Auto Fulfillment Marques via BigBuy API
// API REST : https://api.bigbuy.eu
// Remplace Faire (pas d'API acheteur) par BigBuy (API complète)
// ============================

const BIGBUY_API = 'https://api.bigbuy.eu';

// Créer une commande automatiquement chez BigBuy
async function createBigBuyOrder(order, wholesaleItems, apiKey) {
    if (!apiKey) {
        return {
            success: false,
            mode: 'manual',
            items: wholesaleItems,
            message: 'BIGBUY_API_KEY non configurée. Commander manuellement.'
        };
    }

    const address = order.shipping?.address || {};

    try {
        const response = await fetch(`${BIGBUY_API}/rest/order/create.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                internalReference: order.id,
                language: 'fr',
                paymentMethod: 'moneyTransfer',
                carriers: [{
                    name: 'standard'
                }],
                shippingAddress: {
                    firstName: (order.shipping?.name || order.customer.name || '').split(' ')[0] || 'Client',
                    lastName: (order.shipping?.name || order.customer.name || '').split(' ').slice(1).join(' ') || 'ÉCLAT',
                    country: address.country || 'FR',
                    postcode: address.postal_code || '',
                    town: address.city || '',
                    address: address.line1 || '',
                    phone: order.customer.phone || '0000000000',
                    email: order.customer.email || ''
                },
                products: wholesaleItems.map(item => ({
                    reference: item.bigbuyRef || item.name,
                    quantity: item.quantity
                }))
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[BIGBUY] Commande créée:', data.id || data);
            return {
                success: true,
                mode: 'auto',
                orderId: data.id,
                message: 'Commande BigBuy créée automatiquement'
            };
        } else {
            console.error('[BIGBUY] Erreur:', JSON.stringify(data));
            return {
                success: false,
                mode: 'auto_failed',
                error: data.message || JSON.stringify(data),
                fallback: 'manual'
            };
        }
    } catch (err) {
        console.error('[BIGBUY] API error:', err.message);
        return { success: false, mode: 'auto_failed', error: err.message, fallback: 'manual' };
    }
}

// Vérifier le stock d'un produit chez BigBuy
async function checkBigBuyStock(reference, apiKey) {
    try {
        const response = await fetch(`${BIGBUY_API}/rest/catalog/productstock/${reference}.json`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const data = await response.json();
        return { available: data.quantity > 0, quantity: data.quantity };
    } catch {
        return { available: true, error: 'Could not check stock' };
    }
}

// Obtenir le suivi de commande BigBuy
async function getBigBuyTracking(orderId, apiKey) {
    try {
        const response = await fetch(`${BIGBUY_API}/rest/order/${orderId}.json`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const data = await response.json();
        return {
            status: data.status,
            trackingNumber: data.trackingNumber,
            carrier: data.carrier
        };
    } catch {
        return { error: 'Could not get tracking' };
    }
}

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Auth admin — FAIL CLOSED
    const adminKey = process.env.ADMIN_API_KEY || '';
    const authHeader = req.headers.authorization || '';
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKey = process.env.BIGBUY_API_KEY || '';

    if (req.method === 'POST') {
        const result = await createBigBuyOrder(req.body.order, req.body.items, apiKey);
        return res.status(200).json(result);
    }

    if (req.method === 'GET' && req.query.orderId) {
        const tracking = await getBigBuyTracking(req.query.orderId, apiKey);
        return res.status(200).json(tracking);
    }

    return res.status(400).json({ error: 'Invalid request' });
};

module.exports.createBigBuyOrder = createBigBuyOrder;
module.exports.checkBigBuyStock = checkBigBuyStock;
