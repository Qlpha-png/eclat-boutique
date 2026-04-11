/**
 * GET /api/admin/orders — Liste des commandes avec pagination + filtres
 * PATCH /api/admin/orders — Mise à jour d'une commande (status, tracking, notes)
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

const VALID_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled'];
const VALID_FULFILLMENT = ['unfulfilled', 'processing', 'shipped', 'delivered', 'returned'];

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;

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
                const safe = search.replace(/[%_\\(),.]/g, '');
                if (safe) query = query.or(`email.ilike.%${safe}%,notes.ilike.%${safe}%`);
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
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── PATCH : Mise à jour ──
    if (req.method === 'PATCH') {
        try {
            const { id, status, fulfillment_status, tracking_number, carrier, tracking_url, notes } = req.body || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const updates = {};
            if (status) {
                if (!VALID_STATUSES.includes(status)) {
                    return res.status(400).json({ error: 'Statut invalide', valid: VALID_STATUSES });
                }
                updates.status = status;
            }
            if (fulfillment_status) {
                if (!VALID_FULFILLMENT.includes(fulfillment_status)) {
                    return res.status(400).json({ error: 'Statut fulfillment invalide', valid: VALID_FULFILLMENT });
                }
                updates.fulfillment_status = fulfillment_status;
            }
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

            await logAdminAction({
                adminId: admin.userId, action: 'update', entityType: 'order',
                entityId: id, details: updates, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/orders PATCH]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
