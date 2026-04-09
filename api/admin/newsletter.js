/**
 * GET /api/admin/newsletter — Stats et liste abonnés newsletter
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    try {
        const sb = getSupabase();
        const { page = '1', limit = '30', subscribed } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(parseInt(limit) || 30, 100);
        const offset = (pageNum - 1) * limitNum;

        // Stats globales
        const [totalRes, activeRes, monthRes] = await Promise.all([
            sb.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
            sb.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('subscribed', true),
            sb.from('newsletter_subscribers').select('id', { count: 'exact', head: true })
                .eq('subscribed', true)
                .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
        ]);

        // Liste paginée
        let query = sb
            .from('newsletter_subscribers')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limitNum - 1);

        if (subscribed === 'true') query = query.eq('subscribed', true);
        if (subscribed === 'false') query = query.eq('subscribed', false);

        const { data, count, error } = await query;
        if (error) throw error;

        return res.status(200).json({
            stats: {
                total: totalRes.count || 0,
                active: activeRes.count || 0,
                thisMonth: monthRes.count || 0,
                unsubscribed: (totalRes.count || 0) - (activeRes.count || 0)
            },
            subscribers: data || [],
            total: count || 0,
            page: pageNum,
            pages: Math.ceil((count || 0) / limitNum)
        });
    } catch (err) {
        console.error('[admin/newsletter]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
