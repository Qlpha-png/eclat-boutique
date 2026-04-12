/**
 * GET /api/admin/export?type=orders|customers|products — Export CSV
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const { type } = req.query;
    if (!['orders', 'customers', 'products'].includes(type)) {
        return res.status(400).json({ error: 'Type requis: orders, customers ou products' });
    }

    try {
        const sb = getSupabase();
        let csv = '';

        if (type === 'orders') {
            const { data, error } = await sb
                .from('orders')
                .select('id, email, total, status, fulfillment_status, tracking_number, carrier, created_at')
                .order('created_at', { ascending: false })
                .limit(5000);
            if (error) throw error;

            csv = 'ID,Email,Total,Statut,Fulfillment,Tracking,Transporteur,Date\n';
            csv += (data || []).map(o =>
                [o.id, esc(o.email), o.total, o.status, o.fulfillment_status || '',
                 esc(o.tracking_number || ''), esc(o.carrier || ''), fmtDate(o.created_at)].join(',')
            ).join('\n');
        }

        if (type === 'customers') {
            const { data, error } = await sb
                .from('customers')
                .select('id, email, first_name, last_name, total_spent, loyalty_points, tier, created_at')
                .order('created_at', { ascending: false })
                .limit(5000);
            if (error) throw error;

            csv = 'ID,Email,Prenom,Nom,Total depense,Points,Palier,Inscription\n';
            csv += (data || []).map(c =>
                [c.id, esc(c.email), esc(c.first_name || ''), esc(c.last_name || ''),
                 c.total_spent || 0, c.loyalty_points || 0, c.tier || 'eclat', fmtDate(c.created_at)].join(',')
            ).join('\n');
        }

        if (type === 'products') {
            const { data, error } = await sb
                .from('products')
                .select('id, name, slug, category, price, compare_at_price, badge, is_active, is_featured, stock, created_at')
                .order('created_at', { ascending: false })
                .limit(5000);
            if (error) throw error;

            csv = 'ID,Nom,Slug,Categorie,Prix,Ancien prix,Badge,Actif,Vedette,Stock,Date\n';
            csv += (data || []).map(p =>
                [p.id, esc(p.name), esc(p.slug), esc(p.category || ''), p.price,
                 p.compare_at_price || '', p.badge || '', p.is_active, p.is_featured, p.stock ?? '', fmtDate(p.created_at)].join(',')
            ).join('\n');
        }

        await logAdminAction({
            adminId: admin.userId, action: 'export', entityType: type,
            entityId: null, details: { type }, req
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=eclat-${type}-${new Date().toISOString().slice(0, 10)}.csv`);
        return res.status(200).send('\uFEFF' + csv); // BOM for Excel UTF-8
    } catch (err) {
        console.error('[admin/export]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

function esc(val) {
    if (val == null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toISOString().slice(0, 10);
}
