/**
 * GET /api/admin/reviews — Liste avis avec pagination/filtre
 * PATCH /api/admin/reviews — Approuver/rejeter un avis
 * DELETE /api/admin/reviews — Supprimer un avis
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // ── GET : Liste avis ──
    if (req.method === 'GET') {
        try {
            const { approved, rating, search, page = '1', limit = '20' } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(parseInt(limit) || 20, 100);
            const offset = (pageNum - 1) * limitNum;

            let query = sb
                .from('reviews')
                .select('*, products(name, slug, images), customers(email, first_name, last_name)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limitNum - 1);

            if (approved === 'true') query = query.eq('approved', true);
            if (approved === 'false') query = query.eq('approved', false);
            if (rating) query = query.eq('rating', parseInt(rating));
            if (search) {
                const safe = search.replace(/[%_\\(),.]/g, '');
                if (safe) query = query.or(`title.ilike.%${safe}%,body.ilike.%${safe}%`);
            }

            const { data, count, error } = await query;
            if (error) throw error;

            return res.status(200).json({
                reviews: data || [],
                total: count || 0,
                page: pageNum,
                pages: Math.ceil((count || 0) / limitNum)
            });
        } catch (err) {
            console.error('[admin/reviews GET]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // ── PATCH : Approuver/rejeter ──
    if (req.method === 'PATCH') {
        try {
            const { id, approved } = req.body || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });
            if (typeof approved !== 'boolean') return res.status(400).json({ error: 'approved (true/false) requis' });

            const { data, error } = await sb
                .from('reviews')
                .update({ approved })
                .eq('id', id)
                .select('id, approved, rating, title')
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: approved ? 'approve' : 'reject', entityType: 'review',
                entityId: String(id), details: { approved }, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/reviews PATCH]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // ── DELETE : Supprimer un avis ──
    if (req.method === 'DELETE') {
        try {
            const { id } = req.body || req.query || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const { data, error } = await sb
                .from('reviews')
                .delete()
                .eq('id', id)
                .select('id, title')
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: 'delete', entityType: 'review',
                entityId: String(id), details: { title: data.title }, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/reviews DELETE]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
