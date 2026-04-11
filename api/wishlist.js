/**
 * /api/wishlist — Liste de souhaits ÉCLAT Beauté
 * GET  : liste des favoris de l'utilisateur (auth requis)
 * POST : ajouter un produit à la wishlist (auth requis)
 * DELETE : retirer un produit de la wishlist (auth requis)
 *
 * SQL Schema:
 * CREATE TABLE wishlists (
 *   id          BIGSERIAL PRIMARY KEY,
 *   user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   product_id  INTEGER NOT NULL,
 *   created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   UNIQUE(user_id, product_id)
 * );
 * CREATE INDEX idx_wishlists_user ON wishlists(user_id);
 * CREATE INDEX idx_wishlists_product ON wishlists(product_id);
 */

const { createClient } = require('@supabase/supabase-js');
const { applyRateLimit } = require('./_middleware/rateLimit');

var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop'
];

var MAX_WISHLIST_ITEMS = 50;

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

function extractToken(req) {
    var auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
        return auth.slice(7);
    }
    return null;
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'api')) return;

    var supabase = getSupabase();

    // --- Auth via Bearer token + getUser ---
    var token = extractToken(req);
    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    var authClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    var { data: authData, error: authError } = await authClient.auth.getUser(token);

    if (authError || !authData || !authData.user) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    var userId = authData.user.id;

    try {
        // ========== GET — liste des favoris ==========
        if (req.method === 'GET') {
            var { data: items, error: listErr } = await supabase
                .from('wishlists')
                .select('id, product_id, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (listErr) throw listErr;

            return res.status(200).json({
                count: items ? items.length : 0,
                items: items || []
            });
        }

        // ========== POST — ajouter un produit ==========
        if (req.method === 'POST') {
            var body = req.body || {};
            var productId = parseInt(body.productId);

            if (!productId || isNaN(productId)) {
                return res.status(400).json({ error: 'productId requis (entier)' });
            }

            // Vérifier la limite de 50 items
            var { count: currentCount, error: countErr } = await supabase
                .from('wishlists')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (countErr) throw countErr;

            if (currentCount >= MAX_WISHLIST_ITEMS) {
                return res.status(400).json({
                    error: 'Limite atteinte : ' + MAX_WISHLIST_ITEMS + ' produits maximum dans la wishlist'
                });
            }

            // Vérifier si déjà présent
            var { data: existing, error: existErr } = await supabase
                .from('wishlists')
                .select('id')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .limit(1);

            if (existErr) throw existErr;

            if (existing && existing.length > 0) {
                return res.status(409).json({ error: 'Produit déjà dans la wishlist' });
            }

            // Insérer
            var { error: insertErr } = await supabase
                .from('wishlists')
                .insert({
                    user_id: userId,
                    product_id: productId
                });

            if (insertErr) throw insertErr;

            return res.status(201).json({ ok: true, message: 'Produit ajouté à la wishlist' });
        }

        // ========== DELETE — retirer un produit ==========
        if (req.method === 'DELETE') {
            var delBody = req.body || {};
            var delProductId = parseInt(delBody.productId);

            if (!delProductId || isNaN(delProductId)) {
                return res.status(400).json({ error: 'productId requis (entier)' });
            }

            var { data: deleted, error: delErr } = await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', delProductId)
                .select('id');

            if (delErr) throw delErr;

            if (!deleted || deleted.length === 0) {
                return res.status(404).json({ error: 'Produit non trouvé dans la wishlist' });
            }

            return res.status(200).json({ ok: true, message: 'Produit retiré de la wishlist' });
        }

        return res.status(405).json({ error: 'Méthode non autorisée' });

    } catch (err) {
        console.error('[wishlist]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
