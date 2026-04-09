/**
 * GET /api/admin/orders — Liste des commandes avec pagination + filtres
 * PATCH /api/admin/orders — Mise à jour d'une commande (status, tracking, notes)
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');

module.exports = async function handler(req, res) {
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // ── GET : Liste / Détail ──
    if (req.method === 'GET') {
        try {
            const { id, status, search, page = '1', limit = '20' } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(parseInt(limit) || 20, 100);
            const offset = (pageNum - 1) * limitNum;

            // Détail d'une commande
            if (id) {
                const { data: order, error } = await sb
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('id', id)
                    .single();
                if (error || !order) return res.status(404).json({ error: 'Commande introuvable' });
                return res.status(200).json(order);
            }

            // Liste avec filtres
            let query = sb
                .from('orders')
                .select('id, email, status, fulfillment_status, total, shipping_address, tracking_number, carrier, notes, created_at, updated_at, order_items(name, price, quantity)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limitNum - 1);

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }
            if (search) {
                query = query.or(`email.ilike.%${search}%,notes.ilike.%${search}%`);
            }

            const { data, count, error } = await query;
            if (error) throw error;

            return res.status(200).json({
                orders: data || [],
                total: count || 0,
                page: pageNum,
                pages: Math.ceil((count || 0) / limitNum)
            });
        } catch (err) {
            console.error('[admin/orders GET]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // ── PATCH : Mise à jour ──
    if (req.method === 'PATCH') {
        try {
            const { id, status, fulfillment_status, tracking_number, carrier, tracking_url, notes } = req.body || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const updates = {};
            if (status) updates.status = status;
            if (fulfillment_status) updates.fulfillment_status = fulfillment_status;
            if (tracking_number !== undefined) updates.tracking_number = tracking_number;
            if (carrier !== undefined) updates.carrier = carrier;
            if (tracking_url !== undefined) updates.tracking_url = tracking_url;
            if (notes !== undefined) updates.notes = notes;

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
            }

            const { data, error } = await sb
                .from('orders')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/orders PATCH]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
