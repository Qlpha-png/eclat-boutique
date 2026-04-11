// ============================
// ÉCLAT — Admin Fidélité / Économie Éclats
// GET /api/admin/loyalty — Stats globales
// PATCH /api/admin/loyalty — Ajuster Éclats manuellement
// ============================

const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'admin')) return;
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // GET : dashboard économie
    if (req.method === 'GET') {
        try {
            // Total Éclats en circulation
            const { data: profiles } = await sb
                .from('profiles')
                .select('eclats, loyalty_tier')
                .neq('role', 'admin');

            let totalCirculating = 0;
            const tierDistribution = { eclat: 0, lumiere: 0, prestige: 0, diamant: 0 };
            for (const p of (profiles || [])) {
                totalCirculating += p.eclats || 0;
                const tier = p.loyalty_tier || 'eclat';
                if (tierDistribution[tier] !== undefined) tierDistribution[tier]++;
            }

            // Total émis et brûlés (depuis loyalty_points)
            const { data: earnData } = await sb
                .from('loyalty_points')
                .select('amount')
                .eq('type', 'earn');

            const { data: spendData } = await sb
                .from('loyalty_points')
                .select('amount')
                .eq('type', 'spend');

            const totalEarned = (earnData || []).reduce((sum, r) => sum + r.amount, 0);
            const totalSpent = (spendData || []).reduce((sum, r) => sum + r.amount, 0);
            const burnRate = totalEarned > 0 ? Math.round((totalSpent / totalEarned) * 100) : 0;

            // Top 10 clients par Éclats
            const { data: topClients } = await sb
                .from('profiles')
                .select('id, first_name, email, eclats, loyalty_tier, streak_days')
                .neq('role', 'admin')
                .order('eclats', { ascending: false })
                .limit(10);

            // Transactions récentes (20 dernières)
            const { data: recentTx } = await sb
                .from('loyalty_points')
                .select('amount, type, source, reference_id, created_at, user_id')
                .order('created_at', { ascending: false })
                .limit(20);

            // Coffres ouverts aujourd'hui
            const today = new Date().toISOString().split('T')[0];
            const { count: chestsToday } = await sb
                .from('chest_history')
                .select('id', { count: 'exact', head: true })
                .gte('opened_at', today + 'T00:00:00Z');

            // Check-ins aujourd'hui
            const { count: checkinsToday } = await sb
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('last_checkin', today);

            // Émission par source (7 derniers jours)
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
            const { data: weeklyBySource } = await sb
                .from('loyalty_points')
                .select('source, amount')
                .eq('type', 'earn')
                .gte('created_at', weekAgo);

            const sourceBreakdown = {};
            for (const tx of (weeklyBySource || [])) {
                sourceBreakdown[tx.source] = (sourceBreakdown[tx.source] || 0) + tx.amount;
            }

            return res.status(200).json({
                economy: {
                    total_circulating: totalCirculating,
                    total_earned: totalEarned,
                    total_spent: totalSpent,
                    burn_rate: burnRate,
                    inflation_alert: burnRate < 20 && totalEarned > 1000
                },
                tiers: tierDistribution,
                today: {
                    chests_opened: chestsToday || 0,
                    checkins: checkinsToday || 0
                },
                weekly_sources: sourceBreakdown,
                top_clients: (topClients || []).map(c => ({
                    id: c.id,
                    name: c.first_name || c.email,
                    eclats: c.eclats || 0,
                    tier: c.loyalty_tier || 'eclat',
                    streak: c.streak_days || 0
                })),
                recent_transactions: recentTx || []
            });
        } catch (err) {
            console.error('[admin/loyalty GET]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // PATCH : ajuster manuellement les Éclats d'un user
    if (req.method === 'PATCH') {
        const { user_id, amount, reason } = req.body || {};

        if (!user_id || !amount || !reason) {
            return res.status(400).json({ error: 'user_id, amount et reason requis' });
        }

        if (!Number.isInteger(amount) || amount === 0) {
            return res.status(400).json({ error: 'amount doit \u00eatre un entier non nul' });
        }

        try {
            const { data: profile } = await sb
                .from('profiles')
                .select('eclats, loyalty_tier')
                .eq('id', user_id)
                .single();

            if (!profile) return res.status(404).json({ error: 'Utilisateur introuvable' });

            const newBalance = Math.max(0, (profile.eclats || 0) + amount);

            await sb.from('profiles').update({ eclats: newBalance }).eq('id', user_id);

            await sb.from('loyalty_points').insert({
                user_id,
                amount: Math.abs(amount),
                type: amount > 0 ? 'earn' : 'spend',
                source: 'admin_adjustment',
                metadata: { reason, admin_id: admin.userId, previous_balance: profile.eclats || 0 }
            });

            await logAdminAction(req, admin.userId, amount > 0 ? 'credit_eclats' : 'debit_eclats', 'profile', user_id, {
                amount, reason, previous: profile.eclats || 0, new_balance: newBalance
            });

            return res.status(200).json({
                success: true,
                user_id,
                previous_balance: profile.eclats || 0,
                adjustment: amount,
                new_balance: newBalance
            });
        } catch (err) {
            console.error('[admin/loyalty PATCH]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
