// ============================
// ÉCLAT — Check-in quotidien + streak
// POST /api/loyalty/checkin
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V3 — Check-in = 1 Éclat fixe/jour, pas de bonus streak
// Max 30 Éclats/mois = 1.14€ de valeur gratuite
// V2 : 47/mois = 2.35€ → encore trop, le streak ne doit pas gonfler le gratuit
// Le streak récompense les ACHETEURS via le multiplicateur (max 1.3x)
// ══════════════════════════════════════════════════════════════
const STREAK_REWARDS = [
    { minDays: 30, eclats: 1 },
    { minDays: 14, eclats: 1 },
    { minDays: 7, eclats: 1 },
    { minDays: 0, eclats: 1 }
];

// Multiplicateur d'achat basé sur le streak
// Les vrais bonus vont aux ACHETEURS, pas aux visiteurs
// Plafonné à 1.3x (V2 : 1.5x) pour contrôler l'inflation
const STREAK_MULTIPLIERS = [
    { minDays: 30, mult: 1.3 },
    { minDays: 21, mult: 1.2 },
    { minDays: 14, mult: 1.15 },
    { minDays: 7, mult: 1.1 },
    { minDays: 0, mult: 1.0 }
];

function getStreakReward(days) {
    for (const r of STREAK_REWARDS) {
        if (days >= r.minDays) return r.eclats;
    }
    return 2;
}

function getStreakMultiplier(days) {
    for (const m of STREAK_MULTIPLIERS) {
        if (days >= m.minDays) return m.mult;
    }
    return 1.0;
}

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'public')) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });

    try {
        const sb = getSupabase();
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        const today = new Date().toISOString().split('T')[0];

        // Déjà check-in aujourd'hui ?
        if (profile.last_checkin === today) {
            return res.status(200).json({
                success: false,
                already_checked_in: true,
                streak: profile.streak_days || 0,
                next_checkin: getNextCheckinTime()
            });
        }

        // Calculer le streak
        let newStreak = 1;
        if (profile.last_checkin) {
            const lastDate = new Date(profile.last_checkin);
            const todayDate = new Date(today);
            const diffMs = todayDate - lastDate;
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffDays === 1) {
                // Jour consécutif → incrémenter
                newStreak = (profile.streak_days || 0) + 1;
            } else if (diffDays === 2) {
                // 48h de grâce — on garde le streak mais pas d'incrément
                newStreak = profile.streak_days || 1;
            }
            // > 2 jours → reset à 1
        }

        const eclatsEarned = getStreakReward(newStreak);

        // Mettre à jour le profil
        await sb.from('profiles').update({
            last_checkin: today,
            streak_days: newStreak,
            eclats: (profile.eclats || 0) + eclatsEarned
        }).eq('id', user.userId);

        // Logger la transaction
        await sb.from('loyalty_points').insert({
            user_id: user.userId,
            amount: eclatsEarned,
            type: 'earn',
            source: 'checkin',
            metadata: { streak: newStreak, multiplier: getStreakMultiplier(newStreak) }
        });

        // Vérifier badges streak
        const streakBadges = [
            { days: 7, key: 'streak_3' },   // Réutilise les badges existants (streak_3 = fidélité)
            { days: 30, key: 'streak_6' }
        ];
        const unlockedBadges = [];
        for (const b of streakBadges) {
            if (newStreak >= b.days) {
                const { data: existing } = await sb
                    .from('user_badges')
                    .select('id')
                    .eq('user_id', user.userId)
                    .eq('badge_key', b.key)
                    .single();
                if (!existing) {
                    await sb.from('user_badges').insert({
                        user_id: user.userId,
                        badge_key: b.key
                    });
                    unlockedBadges.push(b.key);
                }
            }
        }

        // Vérifier tier upgrade
        const tierResult = await checkTierUpgrade(sb, user.userId, (profile.eclats || 0) + eclatsEarned, profile.loyalty_tier);

        return res.status(200).json({
            success: true,
            eclats_earned: eclatsEarned,
            streak: newStreak,
            streak_multiplier: getStreakMultiplier(newStreak),
            total_eclats: (profile.eclats || 0) + eclatsEarned,
            tier: tierResult.tier,
            tier_upgraded: tierResult.upgraded,
            badges_unlocked: unlockedBadges,
            next_checkin: getNextCheckinTime()
        });
    } catch (err) {
        console.error('[checkin]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

function getNextCheckinTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

async function checkTierUpgrade(sb, userId, totalEclats, currentTier) {
    const TIERS = [
        { key: 'diamant', threshold: 1000 },
        { key: 'prestige', threshold: 500 },
        { key: 'lumiere', threshold: 200 },
        { key: 'eclat', threshold: 0 }
    ];

    let newTier = 'eclat';
    for (const t of TIERS) {
        if (totalEclats >= t.threshold) {
            newTier = t.key;
            break;
        }
    }

    if (newTier !== currentTier) {
        await sb.from('profiles').update({ loyalty_tier: newTier }).eq('id', userId);

        // Badge tier
        const tierBadgeMap = { lumiere: 'lumiere', prestige: 'prestige', diamant: 'diamant' };
        if (tierBadgeMap[newTier]) {
            await sb.from('user_badges').insert({
                user_id: userId,
                badge_key: tierBadgeMap[newTier]
            }).then(() => {}).catch(() => {});
        }

        return { tier: newTier, upgraded: true };
    }

    return { tier: currentTier, upgraded: false };
}

module.exports.getStreakMultiplier = getStreakMultiplier;
module.exports.checkTierUpgrade = checkTierUpgrade;
