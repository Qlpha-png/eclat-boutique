// ============================
// ÉCLAT — Profil fidélité complet
// GET /api/loyalty/profile
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V3 — Tiers rehaussés, multiplicateurs réduits
// V2 : 200/500/1000 avec 1.3/1.6/2.0x → trop facile de monter + inflation
// V3 : 300/750/1500 avec 1.2/1.4/1.7x → faut acheter pour monter
// ══════════════════════════════════════════════════════════════
const TIER_THRESHOLDS = [
    { key: 'diamant', threshold: 1500, label: 'Diamant', multiplier: 1.7 },
    { key: 'prestige', threshold: 750, label: 'Prestige', multiplier: 1.4 },
    { key: 'lumiere', threshold: 300, label: 'Lumière', multiplier: 1.2 },
    { key: 'eclat', threshold: 0, label: 'Éclat', multiplier: 1.0 }
];

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'public')) return;
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

    try {
        const sb = getSupabase();
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        // Tier actuel et prochain
        const currentTier = TIER_THRESHOLDS.find(t => t.key === (profile.loyalty_tier || 'eclat')) || TIER_THRESHOLDS[3];
        const currentIdx = TIER_THRESHOLDS.indexOf(currentTier);
        const nextTier = currentIdx > 0 ? TIER_THRESHOLDS[currentIdx - 1] : null;

        // Badges du user
        const { data: userBadges } = await sb
            .from('user_badges')
            .select('badge_key, unlocked_at, badges(name, description, icon, category, eclats_reward)')
            .eq('user_id', user.userId)
            .order('unlocked_at', { ascending: false });

        // Historique récent (10 dernières transactions)
        const { data: recentHistory } = await sb
            .from('loyalty_points')
            .select('amount, type, source, metadata, created_at')
            .eq('user_id', user.userId)
            .order('created_at', { ascending: false })
            .limit(10);

        // Défis en cours
        const today = new Date().toISOString().split('T')[0];
        const { data: activeChallenges } = await sb
            .from('weekly_challenges')
            .select('id, challenge_key, title, description, icon, condition_type, condition_target, reward_eclats, active_from, active_until')
            .lte('active_from', today)
            .gte('active_until', today);

        let challengesWithProgress = [];
        if (activeChallenges && activeChallenges.length > 0) {
            const { data: progressData } = await sb
                .from('challenge_progress')
                .select('challenge_id, progress, completed, completed_at')
                .eq('user_id', user.userId)
                .in('challenge_id', activeChallenges.map(c => c.id));

            const progressMap = {};
            if (progressData) {
                for (const p of progressData) {
                    progressMap[p.challenge_id] = p;
                }
            }

            challengesWithProgress = activeChallenges.map(c => ({
                ...c,
                progress: progressMap[c.id]?.progress || 0,
                completed: progressMap[c.id]?.completed || false,
                completed_at: progressMap[c.id]?.completed_at || null
            }));
        }

        // Coffre du Jour disponible ?
        const chestAvailable = profile.last_chest_open !== today;
        const checkinAvailable = profile.last_checkin !== today;

        // Streak multiplier
        const streakDays = profile.streak_days || 0;
        let streakMultiplier = 1.0;
        if (streakDays >= 30) streakMultiplier = 2.0;
        else if (streakDays >= 21) streakMultiplier = 1.8;
        else if (streakDays >= 14) streakMultiplier = 1.5;
        else if (streakDays >= 7) streakMultiplier = 1.2;

        // Referral code
        let referralCode = profile.referral_code;
        if (!referralCode) {
            referralCode = 'ECLAT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            await sb.from('profiles').update({ referral_code: referralCode }).eq('id', user.userId);
        }

        return res.status(200).json({
            eclats: profile.eclats || 0,
            tier: {
                current: currentTier.key,
                label: currentTier.label,
                multiplier: currentTier.multiplier,
                next: nextTier ? {
                    key: nextTier.key,
                    label: nextTier.label,
                    threshold: nextTier.threshold,
                    progress: Math.min(100, Math.round(((profile.eclats || 0) / nextTier.threshold) * 100))
                } : null
            },
            streak: {
                days: streakDays,
                multiplier: streakMultiplier,
                checkin_available: checkinAvailable
            },
            chest: {
                available: chestAvailable,
                next: chestAvailable ? null : getNextTime()
            },
            badges: (userBadges || []).map(b => ({
                key: b.badge_key,
                name: b.badges?.name || b.badge_key,
                description: b.badges?.description || '',
                icon: b.badges?.icon || '',
                category: b.badges?.category || '',
                unlocked_at: b.unlocked_at
            })),
            challenges: challengesWithProgress,
            history: recentHistory || [],
            referral: {
                code: referralCode,
                referrals_this_month: profile.referrals_this_month || 0
            }
        });
    } catch (err) {
        console.error('[loyalty/profile]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

function getNextTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}
