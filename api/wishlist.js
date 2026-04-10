/**
 * /api/wishlist — Gestion wishlist Supabase
 * GET : liste des favoris de l'utilisateur
 * POST : ajouter un produit (ou bulk sync)
 * DELETE : retirer un produit
 */
const { getSupabase, verifyAuth } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'authenticated')) return;

    var sb = getSupabase();
    var auth = await verifyAuth(req);
    if (!auth) return res.status(401).json({ error: 'Authentification requise' });

    // Get customer_id from auth_id
    var { data: customer } = await sb
        .from('customers')
        .select('id')
        .eq('auth_id', auth.userId)
        .single();

    if (!customer) return res.status(404).json({ error: 'Profil client introuvable' });
    var customerId = customer.id;

    try {
        // GET — liste des favoris
        if (req.method === 'GET') {
            var { data: items, error } = await sb
                .from('wishlists')
                .select('product_id, created_at')
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json({ items: items || [] });
        }

        // POST — ajouter un/plusieurs produits
        if (req.method === 'POST') {
            var body = req.body || {};

            if (body.bulk && Array.isArray(body.productIds)) {
                // Bulk sync
                var rows = body.productIds.map(function(pid) {
                    return { customer_id: customerId, product_id: Number(pid) };
                });
                await sb.from('wishlists').upsert(rows, { onConflict: 'customer_id,product_id' });
                return res.status(200).json({ ok: true, synced: rows.length });
            }

            if (!body.productId) return res.status(400).json({ error: 'productId requis' });
            var { error: insertErr } = await sb.from('wishlists').upsert({
                customer_id: customerId,
                product_id: Number(body.productId)
            }, { onConflict: 'customer_id,product_id' });

            if (insertErr) throw insertErr;
            return res.status(200).json({ ok: true });
        }

        // DELETE — retirer un produit
        if (req.method === 'DELETE') {
            var delBody = req.body || {};
            if (!delBody.productId) return res.status(400).json({ error: 'productId requis' });

            var { error: delErr } = await sb.from('wishlists')
                .delete()
                .eq('customer_id', customerId)
                .eq('product_id', Number(delBody.productId));

            if (delErr) throw delErr;
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('[wishlist]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
