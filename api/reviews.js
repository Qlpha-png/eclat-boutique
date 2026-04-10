/**
 * /api/reviews — Avis produits (public GET, auth POST)
 * GET ?productId=X : avis approuvés (public)
 * POST : soumettre un avis (auth requis, vérifie achat)
 */
const { getSupabase, getUser } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    var sb = getSupabase();

    // GET — avis approuvés (public)
    if (req.method === 'GET') {
        if (applyRateLimit(req, res, 'public')) return;
        var productId = parseInt(req.query.productId);
        if (!productId) return res.status(400).json({ error: 'productId requis' });

        var { data: reviews, error } = await sb
            .from('reviews')
            .select('id, rating, title, body, photos, verified, helpful_count, created_at')
            .eq('product_id', productId)
            .eq('approved', true)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('[reviews GET]', error.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        // Compute aggregate
        var total = reviews ? reviews.length : 0;
        var sum = 0;
        var distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        for (var i = 0; i < total; i++) {
            sum += reviews[i].rating;
            distribution[reviews[i].rating] = (distribution[reviews[i].rating] || 0) + 1;
        }
        var avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({
            reviews: reviews || [],
            aggregate: { average: avg, count: total, distribution: distribution }
        });
    }

    // POST — soumettre un avis
    if (req.method === 'POST') {
        if (applyRateLimit(req, res, 'authenticated')) return;

        var user = await getUser(req, sb);
        if (!user) return res.status(401).json({ error: 'Connexion requise pour laisser un avis' });

        var { data: customer } = await sb
            .from('customers')
            .select('id')
            .eq('auth_id', user.id)
            .single();
        if (!customer) return res.status(404).json({ error: 'Profil introuvable' });

        var body = req.body || {};
        var rating = parseInt(body.rating);
        var title = (body.title || '').trim().substring(0, 200);
        var reviewBody = (body.body || '').trim().substring(0, 2000);
        var photos = Array.isArray(body.photos) ? body.photos.slice(0, 3) : [];
        var pId = parseInt(body.productId);

        if (!pId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'productId et rating (1-5) requis' });
        }
        if (!reviewBody) {
            return res.status(400).json({ error: 'Le texte de l\'avis est requis' });
        }

        // Vérifier si déjà un avis de ce client sur ce produit
        var { data: existing } = await sb
            .from('reviews')
            .select('id')
            .eq('product_id', pId)
            .eq('customer_id', customer.id)
            .limit(1);
        if (existing && existing.length > 0) {
            return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour ce produit' });
        }

        // Vérifier achat (commande confirmée contenant ce produit)
        var verified = false;
        var { data: orders } = await sb
            .from('orders')
            .select('id')
            .eq('customer_id', customer.id)
            .in('status', ['confirmed', 'shipped', 'delivered'])
            .limit(100);

        if (orders && orders.length > 0) {
            var orderIds = orders.map(function(o) { return o.id; });
            var { data: items } = await sb
                .from('order_items')
                .select('id')
                .in('order_id', orderIds)
                .eq('product_id', pId)
                .limit(1);
            verified = items && items.length > 0;
        }

        // Insérer l'avis (approved: false → modération admin)
        var { data: newReview, error: insertErr } = await sb
            .from('reviews')
            .insert({
                product_id: pId,
                customer_id: customer.id,
                rating: rating,
                title: title || null,
                body: reviewBody,
                photos: photos,
                verified: verified,
                approved: false
            })
            .select('id')
            .single();

        if (insertErr) {
            console.error('[reviews POST]', insertErr.message);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi' });
        }

        // +15 Éclats pour l'avis, +10 bonus si photo
        var eclatsBonus = 15 + (photos.length > 0 ? 10 : 0);
        await sb.rpc('add_eclats', { p_customer_id: customer.id, p_amount: eclatsBonus, p_reason: 'review' }).catch(function() {});

        return res.status(201).json({
            ok: true,
            reviewId: newReview ? newReview.id : null,
            verified: verified,
            eclatsEarned: eclatsBonus,
            message: 'Merci ! Votre avis sera publié après modération.'
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
