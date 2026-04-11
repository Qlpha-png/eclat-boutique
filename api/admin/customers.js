/**
 * GET /api/admin/customers — Liste des clients avec stats
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
        const { search, page = '1', limit = '20', sort = 'created_at' } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(parseInt(limit) || 20, 100);
        const offset = (pageNum - 1) * limitNum;

        const validSorts = ['created_at', 'total_spent', 'loyalty_points', 'email'];
        const sortField = validSorts.includes(sort) ? sort : 'created_at';
        const ascending = sort === 'email';

        let query = sb
            .from('customers')
            .select('id, email, name, phone, tier, loyalty_points, total_spent, referral_code, created_at', { count: 'exact' })
            .order(sortField, { ascending })
            .range(offset, offset + limitNum - 1);

        if (search) {
            const safe = search.replace(/[%_\\(),.]/g, '');
            if (safe) query = query.or(`email.ilike.%${safe}%,name.ilike.%${safe}%`);
        }

        const { data, count, error } = await query;
        if (error) throw error;

        return res.status(200).json({
            customers: data || [],
            total: count || 0,
            page: pageNum,
            pages: Math.ceil((count || 0) / limitNum)
        });
    } catch (err) {
        console.error('[admin/customers]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
