// ============================
// ÉCLAT — Coffre du Jour (gacha-style)
// POST /api/loyalty/chest
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// POOLS ÉCONOMIE V2 — Rebalancé par analyse économique
// Objectif : coffre = petit plaisir quotidien (2-5 Éclats/jour max)
// Les achats doivent rester la source PRINCIPALE d'Éclats (80%+)
// Ancienne version : 20-145 Éclats/jour GRATUITS → économie cassée
// Nouvelle version : 2-5 Éclats/jour → engagement sans hémorragie
// Plus de discount/shipping gratuits dans le coffre (réservé aux achats)
// ══════════════════════════════════════════════════════════════
const CHEST_POOLS = {
    eclat: {
        slots: 2,
        pool: [
            { rarity: 'commun', prob: 0.75, rewards: [
                { type: 'eclats', min: 1, max: 1 }
            ]},
            { rarity: 'peu_commun', prob: 0.20, rewards: [
                { type: 'eclats', min: 1, max: 2 }
            ]},
            { rarity: 'rare', prob: 0.04, rewards: [
                { type: 'eclats', min: 2, max: 3 }
            ]},
            { rarity: 'exclusif', prob: 0.01, rewards: [
                { type: 'eclats', min: 3, max: 5 }
            ]}
        ]
    },
    lumiere: {
        slots: 2,
        pool: [
            { rarity: 'commun', prob: 0.70, rewards: [
                { type: 'eclats', min: 1, max: 2 }
            ]},
            { rarity: 'peu_commun', prob: 0.23, rewards: [
                { type: 'eclats', min: 2, max: 3 }
            ]},
            { rarity: 'rare', prob: 0.06, rewards: [
                { type: 'eclats', min: 3, max: 4 }
            ]},
            { rarity: 'exclusif', prob: 0.01, rewards: [
                { type: 'eclats', min: 4, max: 6 }
            ]}
        ]
    },
    prestige: {
        slots: 3,
        pool: [
            { rarity: 'commun', prob: 0.65, rewards: [
                { type: 'eclats', min: 1, max: 2 }
            ]},
            { rarity: 'peu_commun', prob: 0.27, rewards: [
                { type: 'eclats', min: 2, max: 3 }
            ]},
            { rarity: 'rare', prob: 0.06, rewards: [
                { type: 'eclats', min: 3, max: 5 }
            ]},
            { rarity: 'exclusif', prob: 0.02, rewards: [
                { type: 'eclats', min: 5, max: 8 }
            ]}
        ]
    },
    diamant: {
        slots: 3,
        pool: [
            { rarity: 'commun', prob: 0.60, rewards: [
                { type: 'eclats', min: 1, max: 2 }
            ]},
            { rarity: 'peu_commun', prob: 0.28, rewards: [
                { type: 'eclats', min: 2, max: 4 }
            ]},
            { rarity: 'rare', prob: 0.08, rewards: [
                { type: 'eclats', min: 4, max: 6 }
            ]},
            { rarity: 'exclusif', prob: 0.03, rewards: [
                { type: 'eclats', min: 6, max: 10 }
            ]},
            { rarity: 'legendaire', prob: 0.01, rewards: [
                { type: 'eclats', min: 10, max: 15 }
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
