// ============================
// ÉCLAT — Coffre du Jour (gacha-style)
// POST /api/loyalty/chest
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// Pools de récompenses par tier
const CHEST_POOLS = {
    eclat: {
        slots: 3,
        pool: [
            { rarity: 'commun', prob: 0.60, rewards: [
                { type: 'eclats', min: 3, max: 5 }
            ]},
            { rarity: 'peu_commun', prob: 0.30, rewards: [
                { type: 'eclats', min: 8, max: 12 }
            ]},
            { rarity: 'rare', prob: 0.09, rewards: [
                { type: 'eclats', min: 18, max: 22 },
                { type: 'discount', value: 2, label: '-2\u20ac' }
            ]},
            { rarity: 'exclusif', prob: 0.01, rewards: [
                { type: 'eclats', min: 40, max: 50 },
                { type: 'discount', value: 5, label: '-5\u20ac' }
            ]}
        ]
    },
    lumiere: {
        slots: 4,
        pool: [
            { rarity: 'commun', prob: 0.45, rewards: [
                { type: 'eclats', min: 5, max: 8 }
            ]},
            { rarity: 'peu_commun', prob: 0.35, rewards: [
                { type: 'eclats', min: 12, max: 18 }
            ]},
            { rarity: 'rare', prob: 0.15, rewards: [
                { type: 'eclats', min: 22, max: 28 },
                { type: 'discount', value: 3, label: '-3\u20ac' }
            ]},
            { rarity: 'exclusif', prob: 0.05, rewards: [
                { type: 'eclats', min: 40, max: 55 },
                { type: 'shipping', value: 1, label: 'Livraison offerte' }
            ]}
        ]
    },
    prestige: {
        slots: 5,
        pool: [
            { rarity: 'commun', prob: 0.35, rewards: [
                { type: 'eclats', min: 8, max: 12 }
            ]},
            { rarity: 'peu_commun', prob: 0.35, rewards: [
                { type: 'eclats', min: 15, max: 22 }
            ]},
            { rarity: 'rare', prob: 0.22, rewards: [
                { type: 'eclats', min: 25, max: 35 },
                { type: 'discount', value: 5, label: '-5\u20ac' }
            ]},
            { rarity: 'exclusif', prob: 0.08, rewards: [
                { type: 'eclats', min: 60, max: 80 },
                { type: 'discount', value: 10, label: '-10\u20ac' }
            ]}
        ]
    },
    diamant: {
        slots: 6,
        pool: [
            { rarity: 'commun', prob: 0.25, rewards: [
                { type: 'eclats', min: 10, max: 15 }
            ]},
            { rarity: 'peu_commun', prob: 0.35, rewards: [
                { type: 'eclats', min: 20, max: 30 }
            ]},
            { rarity: 'rare', prob: 0.28, rewards: [
                { type: 'eclats', min: 35, max: 45 },
                { type: 'discount', value: 5, label: '-5\u20ac' }
            ]},
            { rarity: 'exclusif', prob: 0.10, rewards: [
                { type: 'eclats', min: 80, max: 110 },
                { type: 'discount', value: 15, label: '-15\u20ac' }
            ]},
            { rarity: 'legendaire', prob: 0.02, rewards: [
                { type: 'eclats', min: 180, max: 220 },
                { type: 'discount', value: 15, label: '-15\u20ac' }
            ]}
        ]
    }
};

function rollSlot(pool) {
    const rand = Math.random();
    let cumulative = 0;
    for (const tier of pool) {
        cumulative += tier.prob;
        if (rand <= cumulative) {
            const reward = tier.rewards[Math.floor(Math.random() * tier.rewards.length)];
            const result = { rarity: tier.rarity, type: reward.type };

            if (reward.type === 'eclats') {
                result.value = Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min;
                result.label = '+' + result.value + ' \u00c9clats';
            } else {
                result.value = reward.value;
                result.label = reward.label;
            }
            return result;
        }
    }
    // Fallback commun
    return { rarity: 'commun', type: 'eclats', value: 3, label: '+3 \u00c9clats' };
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
    if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

    try {
        const sb = getSupabase();
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        const today = new Date().toISOString().split('T')[0];

        // Déjà ouvert aujourd'hui ?
        if (profile.last_chest_open === today) {
            return res.status(200).json({
                success: false,
                already_opened: true,
                next_chest: getNextChestTime()
            });
        }

        const tier = profile.loyalty_tier || 'eclat';
        const chestConfig = CHEST_POOLS[tier] || CHEST_POOLS.eclat;

        // Tirer les récompenses
        const rewards = [];
        let totalEclats = 0;
        const promoCodesGenerated = [];

        for (let i = 0; i < chestConfig.slots; i++) {
            const reward = rollSlot(chestConfig.pool);
            rewards.push(reward);

            if (reward.type === 'eclats') {
                totalEclats += reward.value;
            } else if (reward.type === 'discount' || reward.type === 'shipping') {
                // Générer un code promo unique
                const code = 'COFFRE-' + Math.random().toString(36).substring(2, 7).toUpperCase();
                const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString(); // 7 jours

                await sb.from('promo_codes').insert({
                    code: code,
                    type: 'fixed',
                    value: reward.type === 'shipping' ? 4.90 : reward.value,
                    min_order: 0,
                    max_uses: 1,
                    expires_at: expiresAt,
                    active: true
                });

                reward.code = code;
                reward.expires = expiresAt;
                promoCodesGenerated.push({ code, label: reward.label, expires: expiresAt });
            }
        }

        // Créditer les Éclats
        if (totalEclats > 0) {
            await sb.from('profiles').update({
                eclats: (profile.eclats || 0) + totalEclats,
                last_chest_open: today
            }).eq('id', user.userId);

            await sb.from('loyalty_points').insert({
                user_id: user.userId,
                amount: totalEclats,
                type: 'earn',
                source: 'chest',
                metadata: { tier, slots: chestConfig.slots, rewards }
            });
        } else {
            await sb.from('profiles').update({
                last_chest_open: today
            }).eq('id', user.userId);
        }

        // Sauvegarder l'historique
        await sb.from('chest_history').insert({
            user_id: user.userId,
            tier,
            slots: chestConfig.slots,
            rewards,
            total_eclats: totalEclats
        });

        // Badge coffre (10x et 50x)
        const { count } = await sb
            .from('chest_history')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.userId);

        const chestBadges = [];
        if (count >= 10) {
            const { data: existing } = await sb.from('user_badges')
                .select('id').eq('user_id', user.userId).eq('badge_key', 'coffret_lover').single();
            if (!existing) {
                await sb.from('user_badges').insert({ user_id: user.userId, badge_key: 'coffret_lover' });
                chestBadges.push('coffret_lover');
            }
        }

        return res.status(200).json({
            success: true,
            tier,
            slots: chestConfig.slots,
            rewards,
            total_eclats: totalEclats,
            promo_codes: promoCodesGenerated,
            badges_unlocked: chestBadges,
            new_balance: (profile.eclats || 0) + totalEclats,
            next_chest: getNextChestTime()
        });
    } catch (err) {
        console.error('[chest]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

function getNextChestTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}
