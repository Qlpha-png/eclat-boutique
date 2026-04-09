/**
 * GET /api/admin/stats — KPIs du dashboard admin
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
        const now = new Date();
        const thirtyDaysAgo = new Date(now - 30 * 86400000).toISOString();
        const sevenDaysAgo = new Date(now - 7 * 86400000).toISOString();

        // Requêtes en parallèle pour la performance
        const [ordersAll, ordersMonth, ordersWeek, customersCount, pendingOrders] = await Promise.all([
            sb.from('orders').select('total, created_at', { count: 'exact' }),
            sb.from('orders').select('total').gte('created_at', thirtyDaysAgo),
            sb.from('orders').select('total').gte('created_at', sevenDaysAgo),
            sb.from('customers').select('id', { count: 'exact', head: true }),
            sb.from('orders').select('id', { count: 'exact', head: true }).eq('fulfillment_status', 'pending')
        ]);

        const allOrders = ordersAll.data || [];
        const monthOrders = ordersMonth.data || [];
        const weekOrders = ordersWeek.data || [];

        const totalRevenue = allOrders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
        const monthRevenue = monthOrders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
        const weekRevenue = weekOrders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
        const avgOrder = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

        // Time-series : revenu et commandes par jour (30 derniers jours)
        const daily = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
            daily[d] = { revenue: 0, orders: 0 };
        }
        allOrders.forEach(o => {
            const d = new Date(o.created_at).toISOString().slice(0, 10);
            if (daily[d]) {
                daily[d].revenue += parseFloat(o.total || 0);
                daily[d].orders += 1;
            }
        });
        const timeSeries = Object.entries(daily).map(([date, v]) => ({
            date,
            revenue: Math.round(v.revenue * 100) / 100,
            orders: v.orders
        }));

        return res.status(200).json({
            revenue: {
                total: Math.round(totalRevenue * 100) / 100,
                month: Math.round(monthRevenue * 100) / 100,
                week: Math.round(weekRevenue * 100) / 100
            },
            orders: {
                total: ordersAll.count || allOrders.length,
                month: monthOrders.length,
                week: weekOrders.length,
                pending: pendingOrders.count || 0
            },
            customers: {
                total: customersCount.count || 0
            },
            avgOrder: Math.round(avgOrder * 100) / 100,
            timeSeries
        });
    } catch (err) {
        console.error('[admin/stats]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
