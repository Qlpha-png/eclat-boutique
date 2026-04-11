// ============================
// ÉCLAT - Auto Fulfillment CJDropshipping
// Commande automatique chez le fournisseur
// ============================

// Mapping produit ÉCLAT → SKU CJDropshipping
// À remplir avec les vrais SKU une fois le compte CJ créé
const PRODUCT_MAP = {
    'Masque LED 7 Couleurs':     { sku: '', cost: 20.00, supplier: 'cj' },
    'Jade Roller Facial':        { sku: '', cost: 3.00,  supplier: 'cj' },
    'Gua Sha Quartz Rose':       { sku: '', cost: 2.00,  supplier: 'cj' },
    'Sérum Vitamine C Pure':     { sku: '', cost: 7.00,  supplier: 'cj' },
    'Patchs Yeux Anti-Cernes Or':{ sku: '', cost: 2.00,  supplier: 'cj' },
    'Derma Roller Pro 0.5mm':    { sku: '', cost: 4.00,  supplier: 'cj' },
    'Diffuseur Nuage de Pluie':  { sku: '', cost: 12.00, supplier: 'cj' },
    'Huile Visage Rose Musquée': { sku: '', cost: 5.00,  supplier: 'cj' },
    'Brosse Nettoyante Visage':  { sku: '', cost: 6.00,  supplier: 'cj' },
    'Set Pinceaux Maquillage Pro':{ sku: '', cost: 8.00, supplier: 'cj' },
    'Bandeau Spa Microfibre':    { sku: '', cost: 1.50,  supplier: 'cj' },
    'Éponge Konjac Naturelle':   { sku: '', cost: 0.80,  supplier: 'cj' },
    // Frais de livraison - ignorer
    'Frais de livraison':        { sku: 'SHIPPING', cost: 0, supplier: 'none' }
};

// CJDropshipping API
const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

async function createCJOrder(order, cjApiKey) {
    const products = order.items
        .filter(item => {
            const mapped = PRODUCT_MAP[item.name];
            return mapped && mapped.sku && mapped.supplier === 'cj';
        })
        .map(item => ({
            vid: PRODUCT_MAP[item.name].sku,
            quantity: item.quantity
        }));

    if (products.length === 0) {
        return { success: false, error: 'No mapped products found' };
    }

    const address = order.shipping?.address || {};

    const cjOrder = {
        orderNumber: order.id,
        shippingZip: address.postal_code || '',
        shippingCountryCode: address.country || 'FR',
        shippingCountry: address.country === 'FR' ? 'France' :
                         address.country === 'BE' ? 'Belgium' :
                         address.country === 'CH' ? 'Switzerland' :
                         address.country === 'LU' ? 'Luxembourg' : 'France',
        shippingProvince: address.state || '',
        shippingCity: address.city || '',
        shippingAddress: address.line1 || '',
        shippingAddress2: address.line2 || '',
        shippingCustomerName: order.shipping?.name || order.customer.name || '',
        shippingPhone: order.customer.phone || '',
        products
    };

    try {
        const response = await fetch(`${CJ_API_BASE}/shopping/order/createOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': cjApiKey
            },
            body: JSON.stringify(cjOrder)
        });

        const data = await response.json();

        if (data.result) {
            return {
                success: true,
                cjOrderId: data.data?.orderId || data.data,
                message: 'Commande CJ créée automatiquement'
            };
        } else {
            return { success: false, error: data.message || 'CJ API error' };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// Vérifier le stock d'un produit chez CJ
async function checkCJStock(sku, cjApiKey) {
    try {
        const response = await fetch(`${CJ_API_BASE}/product/stock?vid=${sku}`, {
            headers: { 'CJ-Access-Token': cjApiKey }
        });
        const data = await response.json();
        return data.data || { available: true };
    } catch {
        return { available: true, error: 'Could not check stock' };
    }
}

// API endpoint pour le fulfillment manuel ou automatique
module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Auth admin — FAIL CLOSED (refuse si clé non configurée)
    const adminKey = process.env.ADMIN_API_KEY || '';
    const authHeader = req.headers.authorization || '';
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const cjApiKey = process.env.CJ_API_KEY || '';
    if (!cjApiKey) {
        return res.status(200).json({
            success: false,
            mode: 'manual',
            message: 'CJ_API_KEY non configurée. Commande en mode manuel.',
            action: 'Commandez manuellement sur cjdropshipping.com avec les détails ci-dessous',
            order: req.body
        });
    }

    try {
        const result = await createCJOrder(req.body, cjApiKey);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.createCJOrder = createCJOrder;
module.exports.checkCJStock = checkCJStock;
module.exports.PRODUCT_MAP = PRODUCT_MAP;
