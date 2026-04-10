/**
 * GET /api/stock?productId=X — Vérification stock temps réel
 * Public, pas d'auth requise, cache 5 minutes
 * Modèle dropshipping : si produit absent de la table inventory, on assume en stock (CJ gère)
 *
 * SQL Schema:
 * CREATE TABLE inventory (
 *     id SERIAL PRIMARY KEY,
 *     product_id INTEGER NOT NULL UNIQUE,
 *     quantity INTEGER NOT NULL DEFAULT 0,
 *     low_threshold INTEGER NOT NULL DEFAULT 5,
 *     updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_inventory_product_id ON inventory(product_id);
 */
const { createClient } = require('@supabase/supabase-js');

var ALLOWED_ORIGINS = [
    'https://maison-eclat.shop',
    'https://www.maison-eclat.shop',
    'http://localhost:3000',
    'http://localhost:5173'
];

var _supabase = null;

function getSupabase() {
    if (!_supabase) {
        var url = process.env.SUPABASE_URL;
        var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');
}

module.exports = async function handler(req, res) {
    setCors(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    var productId = req.query.productId;
    if (!productId) {
        return res.status(400).json({ error: 'productId requis' });
    }

    var parsedId = parseInt(productId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: 'productId invalide' });
    }

    try {
        var sb = getSupabase();
        var { data: inv, error } = await sb
            .from('inventory')
            .select('quantity, low_threshold')
            .eq('product_id', parsedId)
            .single();

        // Produit absent de inventory = dropshipping, CJ gère le stock
        if (error || !inv) {
            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
            return res.status(200).json({
                available: true,
                quantity: null,
                low: false
            });
        }

        var qty = inv.quantity;
        var threshold = inv.low_threshold != null ? inv.low_threshold : 5;
        var available = qty > 0;
        var low = qty > 0 && qty <= threshold;

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({
            available: available,
            quantity: qty,
            low: low
        });
    } catch (err) {
        console.error('[stock]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
