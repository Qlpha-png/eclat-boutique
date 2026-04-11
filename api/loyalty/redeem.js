// ============================
// ÉCLAT — Dépenser des Éclats (redemption)
// POST /api/loyalty/redeem
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V3 — Coûts de rédemption rehaussés (~0.038€/Éclat)
// V2 : ~0.05€/Éclat → trop facile de dépenser
// V3 : ~0.038€/Éclat → il faut plus d'Éclats pour la même réduction
// Suppression du "Double Éclats 24h" = amplificateur d'inflation
// Un client qui dépense 50€/mois gagne 50 Éclats d'achat
// + ~130 gratuits réalistes = 180 total → -5€ en ~2 mois = ratio sain
// ══════════════════════════════════════════════════════════════
const REWARDS = {
    discount_3: { cost: 80, type: 'fixed', value: 3, label: '-3€ sur votre commande' },
    discount_5: { cost: 130, type: 'fixed', value: 5, label: '-5€ sur votre commande' },
    discount_10: { cost: 260, type: 'fixed', value: 10, label: '-10€ sur votre commande' },
    discount_10pct: { cost: 150, type: 'percentage', value: 10, label: '-10% sur votre commande' },
    shipping: { cost: 100, type: 'fixed', value: 4.90, label: 'Livraison gratuite' },
    ai_messages: { cost: 80, type: 'ai', value: 10, label: '+10 messages IA' }
};

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'public')) return;

    // GET : lister les récompenses disponibles
    if (req.method === 'GET') {
        const user = await verifyAuth(req);
        if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

        const profile = await getProfile(user.userId);
        const balance = profile?.eclats || 0;

        const available = Object.entries(REWARDS).map(([key, r]) => ({
            key,
            cost: r.cost,
            label: r.label,
            type: r.type,
            affordable: balance >= r.cost
        }));

        return res.status(200).json({ balance, rewards: available });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

    const { reward_key } = req.body || {};
    if (!reward_key || !REWARDS[reward_key]) {
        return res.status(400).json({ error: 'Récompense invalide', available: Object.keys(REWARDS) });
    }

    const reward = REWARDS[reward_key];

    try {
        const sb = getSupabase();
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        const balance = profile.eclats || 0;
        if (balance < reward.cost) {
            return res.status(400).json({
                error: 'Solde insuffisant',
                balance,
                cost: reward.cost,
                missing: reward.cost - balance
            });
        }

        // ══════════════════════════════════════════════════════════════
        // V3 — Minimum de commande pour utiliser les Éclats
        // Les réductions nécessitent un vrai historique d'achat
        // Empêche le farming de réductions sans jamais acheter
        // ══════════════════════════════════════════════════════════════
        if (reward.type === 'fixed' || reward.type === 'percentage' || reward.type === 'shipping') {
            // Vérifier que l'utilisateur a au moins 1 commande confirmée
            const { count: orderCount } = await sb
                .from('orders')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.userId)
                .in('status', ['confirmed', 'shipped', 'delivered']);

            if (!orderCount || orderCount < 1) {
                return res.status(403).json({
                    error: 'Vous devez avoir passé au moins 1 commande pour utiliser vos Éclats.',
                    hint: 'Faites votre première commande, puis revenez dépenser vos Éclats !'
                });
            }
        }

        let result = {};

        if (reward.type === 'fixed' || reward.type === 'percentage') {
            // Générer un code promo — min_order basé sur la valeur de la réduction
            const prefix = reward.type === 'percentage' ? 'ECLAT' + reward.value + 'P' : 'ECLAT' + reward.value + 'E';
            const code = prefix + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
            const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

            // V3 — Minimum de commande : 2x la valeur de la réduction
            // -3€ → min 25€, -5€ → min 30€, -10€ → min 40€, -10% → min 35€
            const minOrders = { 3: 25, 5: 30, 10: 40 };
            const minOrder = reward.type === 'percentage' ? 35 : (minOrders[reward.value] || reward.value * 3);

            await sb.from('promo_codes').insert({
                code,
                type: reward.type === 'percentage' ? 'percentage' : 'fixed',
                value: reward.value,
                min_order: minOrder,
                max_uses: 1,
                expires_at: expiresAt,
                active: true
            });

            result = { code, label: reward.label + ' (commande min. ' + minOrder + '€)', expires: expiresAt, min_order: minOrder };

        } else if (reward.type === 'ai') {
            // Créditer des messages IA supplémentaires
            const extraMessages = reward.value;
            result = { extra_messages: extraMessages, label: reward.label };
        }

        // Débiter les Éclats
        await sb.from('profiles').update({
            eclats: balance - reward.cost
        }).eq('id', user.userId);

        // Logger la transaction
        await sb.from('loyalty_points').insert({
            user_id: user.userId,
            amount: reward.cost,
            type: 'spend',
            source: reward_key,
            metadata: result
        });

        return res.status(200).json({
            success: true,
            reward: reward_key,
            cost: reward.cost,
            new_balance: balance - reward.cost,
            result
        });
    } catch (err) {
        console.error('[redeem]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
