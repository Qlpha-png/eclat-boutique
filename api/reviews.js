/**
 * /api/reviews — Avis produits ÉCLAT Beauté
 * GET  ?productId=X : avis approuvés (public) avec moyenne, compte, distribution
 * POST : soumettre un avis (auth requis, vérifie achat, +Éclats)
 *
 * SQL Schema:
 * CREATE TABLE reviews (
 *   id                BIGSERIAL PRIMARY KEY,
 *   product_id        INTEGER NOT NULL,
 *   user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   rating            SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
 *   text              TEXT NOT NULL CHECK (char_length(text) >= 10 AND char_length(text) <= 2000),
 *   author_name       TEXT,
 *   photos            TEXT[] DEFAULT '{}',
 *   verified_purchase BOOLEAN NOT NULL DEFAULT false,
 *   approved          BOOLEAN NOT NULL DEFAULT false,
 *   created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   UNIQUE(user_id, product_id)
 * );
 * CREATE INDEX idx_reviews_product_approved ON reviews(product_id) WHERE approved = true;
 * CREATE INDEX idx_reviews_user ON reviews(user_id);
 */

const { createClient } = require('@supabase/supabase-js');
const { applyRateLimit } = require('./_middleware/rateLimit');

var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop'
];

var ECLATS_REVIEW = 15;
var ECLATS_REVIEW_WITH_PHOTOS = 25;
var MIN_TEXT_LENGTH = 10;
var MAX_TEXT_LENGTH = 2000;
var MAX_PHOTOS = 3;

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

    // ========== GET — avis approuvés (public) ==========
    if (req.method === 'GET') {
        try {
            var productId = parseInt(req.query.productId);
            var isHomepage = req.query.homepage === '1';
            var limit = parseInt(req.query.limit) || 50;

            // Homepage mode: return latest reviews across all products
            if (isHomepage) {
                var { data: homeReviews, error: homeErr } = await supabase
                    .from('reviews')
                    .select('rating, text, author_name, verified_purchase, photos, created_at, product_id')
                    .eq('approved', true)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (homeErr) {
                    console.error('[reviews GET homepage]', homeErr.message);
                    // Return empty instead of 500 — table may not exist yet
                    return res.status(200).json({ reviews: [], count: 0 });
                }

                res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
                return res.status(200).json({
                    reviews: homeReviews || [],
                    count: (homeReviews || []).length
                });
            }

            // Product mode: require productId
            if (!productId || isNaN(productId)) {
                return res.status(400).json({ error: 'productId requis (entier)' });
            }

            var { data: reviews, error: listErr } = await supabase
                .from('reviews')
                .select('rating, text, author_name, verified_purchase, photos, created_at')
                .eq('product_id', productId)
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (listErr) {
                console.error('[reviews GET]', listErr.message);
                // Return empty instead of 500 — table may not exist yet
                return res.status(200).json({
                    average: 0, count: 0,
                    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    reviews: []
                });
            }

            var list = reviews || [];
            var count = list.length;
            var sum = 0;
            var distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            for (var i = 0; i < count; i++) {
                sum += list[i].rating;
                distribution[list[i].rating] = (distribution[list[i].rating] || 0) + 1;
            }

            var average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
            return res.status(200).json({
                average: average,
                count: count,
                distribution: distribution,
                reviews: list
            });
        } catch (err) {
            console.error('[reviews GET error]', err.message);
            return res.status(200).json({
                average: 0, count: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                reviews: []
            });
        }
    }

    // ========== POST — soumettre un avis (auth requis) ==========
    if (req.method === 'POST') {
        // Auth via Bearer token + getUser
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
        var userName = authData.user.user_metadata
            ? (authData.user.user_metadata.full_name || authData.user.user_metadata.name || 'Anonyme')
            : 'Anonyme';

        var body = req.body || {};

        // --- Validation ---
        var postProductId = parseInt(body.productId);
        var rating = parseInt(body.rating);
        var text = (body.text || '').trim();
        var photos = Array.isArray(body.photos) ? body.photos.slice(0, MAX_PHOTOS) : [];

        if (!postProductId || isNaN(postProductId)) {
            return res.status(400).json({ error: 'productId requis (entier)' });
        }
        if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'rating requis (1-5)' });
        }
        if (text.length < MIN_TEXT_LENGTH) {
            return res.status(400).json({ error: 'Le texte doit contenir au moins ' + MIN_TEXT_LENGTH + ' caractères' });
        }
        if (text.length > MAX_TEXT_LENGTH) {
            return res.status(400).json({ error: 'Le texte ne doit pas dépasser ' + MAX_TEXT_LENGTH + ' caractères' });
        }

        // Filtrer les URLs de photos invalides
        var validPhotos = [];
        for (var p = 0; p < photos.length; p++) {
            if (typeof photos[p] === 'string' && photos[p].startsWith('http')) {
                validPhotos.push(photos[p]);
            }
        }

        try {
            // Vérifier max 1 avis par user par produit
            var { data: existing, error: existErr } = await supabase
                .from('reviews')
                .select('id')
                .eq('user_id', userId)
                .eq('product_id', postProductId)
                .limit(1);

            if (existErr) throw existErr;

            if (existing && existing.length > 0) {
                return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour ce produit' });
            }

            // Vérifier achat dans order_items
            var verifiedPurchase = false;
            var { data: orderItems, error: oiErr } = await supabase
                .from('order_items')
                .select('id, order_id')
                .eq('product_id', postProductId);

            if (!oiErr && orderItems && orderItems.length > 0) {
                // Vérifier que l'une de ces commandes appartient à l'utilisateur
                var orderIds = [];
                for (var oi = 0; oi < orderItems.length; oi++) {
                    orderIds.push(orderItems[oi].order_id);
                }

                var { data: userOrders } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('user_id', userId)
                    .in('id', orderIds)
                    .limit(1);

                if (userOrders && userOrders.length > 0) {
                    verifiedPurchase = true;
                }
            }

            // Insérer l'avis (approved: false par défaut → modération)
            var { data: newReview, error: insertErr } = await supabase
                .from('reviews')
                .insert({
                    product_id: postProductId,
                    user_id: userId,
                    rating: rating,
                    text: text,
                    author_name: userName,
                    photos: validPhotos,
                    verified_purchase: verifiedPurchase,
                    approved: false
                })
                .select('id')
                .single();

            if (insertErr) throw insertErr;

            // Récompenser en Éclats : +15 pour un avis, +25 si photos
            var eclatsAwarded = validPhotos.length > 0 ? ECLATS_REVIEW_WITH_PHOTOS : ECLATS_REVIEW;

            var { error: eclatsErr } = await supabase
                .from('profiles')
                .select('eclats')
                .eq('user_id', userId)
                .single()
                .then(function(result) {
                    if (result.error) return result;
                    var currentEclats = result.data ? result.data.eclats : 0;
                    return supabase
                        .from('profiles')
                        .update({ eclats: currentEclats + eclatsAwarded })
                        .eq('user_id', userId);
                });

            if (eclatsErr) {
                console.error('[reviews POST] Erreur mise à jour Éclats:', eclatsErr.message);
            }

            return res.status(201).json({
                ok: true,
                reviewId: newReview ? newReview.id : null,
                verified_purchase: verifiedPurchase,
                eclats_awarded: eclatsAwarded,
                message: 'Merci ! Votre avis sera publié après modération.'
            });

        } catch (err) {
            console.error('[reviews POST]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
};
