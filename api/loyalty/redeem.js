// ============================
// ÉCLAT — Dépenser des Éclats (redemption)
// POST /api/loyalty/redeem
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V2 — Coûts de rédemption augmentés
// Ancien : livraison 40 Éclats (0.12€/Éclat = DOUBLE du taux normal!)
// Nouveau : coûts ajustés, taux uniforme ~0.05€/Éclat
// Un client qui dépense 35€ gagne 35 Éclats/mois → peut obtenir
// une réduction -3€ tous les ~1.5 mois = ratio sain (8.5% en valeur)
// ══════════════════════════════════════════════════════════════
const REWARDS = {
    discount_3: { cost: 60, type: 'fixed', value: 3, label: '-3\u20ac sur votre commande' },
    discount_5: { cost: 100, type: 'fixed', value: 5, label: '-5\u20ac sur votre commande' },
    discount_10: { cost: 200, type: 'fixed', value: 10, label: '-10\u20ac sur votre commande' },
    discount_10pct: { cost: 120, type: 'percentage', value: 10, label: '-10% sur votre commande' },
    shipping: { cost: 80, type: 'fixed', value: 4.90, label: 'Livraison gratuite' },
    ai_messages: { cost: 80, type: 'ai', value: 10, label: '+10 messages IA' },
    double_eclats: { cost: 100, type: 'boost', value: 2, label: 'Double \u00c9clats 24h' }
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
        return res.status(400).json({ error: 'R\u00e9compense invalide', available: Object.keys(REWARDS) });
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

        let result = {};

        if (reward.type === 'fixed' || reward.type === 'percentage') {
            // Générer un code promo Stripe
            const prefix = reward.type === 'percentage' ? 'ECLAT' + reward.value + 'P' : 'ECLAT' + reward.value + 'E';
            const code = prefix + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
            const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

            await sb.from('promo_codes').insert({
                code,
                type: reward.type === 'percentage' ? 'percentage' : 'fixed',
                value: reward.value,
                min_order: 0,
                max_uses: 1,
                expires_at: expiresAt,
                active: true
            });

            result = { code, label: reward.label, expires: expiresAt };

        } else if (reward.type === 'ai') {
            // Créditer des messages IA supplémentaires
            const today = new Date().toISOString().split('T')[0];
            const currentDate = profile.ai_messages_date;

            // On ajoute au compteur ou on reset si nouveau jour
            const extraMessages = reward.value;
            // Stocker comme bonus dans metadata, le chat.js vérifiera
            result = { extra_messages: extraMessages, label: reward.label };

        } else if (reward.type === 'boost') {
            // Double Éclats 24h — stocker dans metadata
            result = {
                boost: 'double_eclats',
                until: new Date(Date.now() + 24 * 3600000).toISOString(),
                label: reward.label
            };
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
