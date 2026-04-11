// ============================
// ÉCLAT — Leaderboard mensuel
// GET /api/loyalty/leaderboard — Top 10 collecteurs du mois
// ============================

const { verifyAuth, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop'
];

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'public')) return;

    // Auth optionnel (pour marquer le user actuel)
    const authResult = await verifyAuth(req).catch(() => null);
    const currentUserId = authResult ? authResult.userId : null;

    try {
        const sb = getSupabase();

        // Éclats gagnés ce mois
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { data: monthlyEarnings } = await sb
            .from('loyalty_points')
            .select('user_id, amount')
            .eq('type', 'earn')
            .gte('created_at', monthStart);

        // Agréger par user
        const userTotals = {};
        for (const row of (monthlyEarnings || [])) {
            userTotals[row.user_id] = (userTotals[row.user_id] || 0) + row.amount;
        }

        // Trier et prendre top 10
        const sorted = Object.entries(userTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        if (sorted.length === 0) {
            return res.status(200).json({ leaderboard: [], currentUserRank: null });
        }

        // Récupérer les noms
        const userIds = sorted.map(s => s[0]);
        const { data: profiles } = await sb
            .from('profiles')
            .select('id, first_name, loyalty_tier')
            .in('id', userIds);

        const profileMap = {};
        for (const p of (profiles || [])) {
            profileMap[p.id] = p;
        }

        const leaderboard = sorted.map(function([userId, earned], idx) {
            const profile = profileMap[userId] || {};
            const isCurrentUser = userId === currentUserId;
            // Anonymiser partiellement le nom sauf pour le user actuel
            let displayName = profile.first_name || 'Anonyme';
            if (!isCurrentUser && displayName.length > 2) {
                displayName = displayName.charAt(0) + '***' + displayName.charAt(displayName.length - 1);
            }
            return {
                rank: idx + 1,
                name: displayName,
                earned: earned,
                tier: profile.loyalty_tier || 'eclat',
                isYou: isCurrentUser
            };
        });

        // Rang du user actuel s'il n'est pas dans le top 10
        let currentUserRank = null;
        if (currentUserId && userTotals[currentUserId]) {
            const allSorted = Object.entries(userTotals).sort((a, b) => b[1] - a[1]);
            const idx = allSorted.findIndex(e => e[0] === currentUserId);
            if (idx >= 0) {
                currentUserRank = {
                    rank: idx + 1,
                    earned: userTotals[currentUserId],
                    total: allSorted.length
                };
            }
        }

        // Cache 5 min
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({ leaderboard, currentUserRank });
    } catch (err) {
        console.error('[leaderboard]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
