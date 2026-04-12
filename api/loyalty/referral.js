// ============================
// ÉCLAT — Système de parrainage
// GET/POST /api/loyalty/referral
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V3 — Parrainage rebalancé
// V2 : 25+10 = 35 Éclats, max 5/mois = 175 max
// V3 : 20+10 = 30 Éclats, max 3/mois = 90 max
// Condition : filleul doit faire un achat de 20€+ minimum
// ══════════════════════════════════════════════════════════════
const REFERRAL_REWARD_PARRAIN = 20;
const REFERRAL_REWARD_FILLEUL = 10;
const MAX_REFERRALS_PER_MONTH = 3;
const MIN_FILLEUL_ORDER_AMOUNT = 20;

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'public')) return;

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

    const sb = getSupabase();

    // GET : récupérer ou générer le code parrainage
    if (req.method === 'GET') {
        try {
            const profile = await getProfile(user.userId);
            if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

            let referralCode = profile.referral_code;
            if (!referralCode) {
                referralCode = 'ECLAT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                await sb.from('profiles').update({ referral_code: referralCode }).eq('id', user.userId);
            }

            // Compter les filleuls
            const { count } = await sb
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('referred_by', user.userId);

            return res.status(200).json({
                referral_code: referralCode,
                total_referrals: count || 0,
                referrals_this_month: profile.referrals_this_month || 0,
                max_per_month: MAX_REFERRALS_PER_MONTH,
                reward_parrain: REFERRAL_REWARD_PARRAIN,
                reward_filleul: REFERRAL_REWARD_FILLEUL
            });
        } catch (err) {
            console.error('[referral GET]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // POST : appliquer un code parrainage (appelé à l'inscription du filleul)
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { referral_code } = req.body || {};
    if (!referral_code) return res.status(400).json({ error: 'Code parrainage manquant' });

    try {
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        // Ne pas se parrainer soi-même
        if (profile.referral_code === referral_code) {
            return res.status(400).json({ error: 'Vous ne pouvez pas utiliser votre propre code' });
        }

        // Déjà parrainé ?
        if (profile.referred_by) {
            return res.status(400).json({ error: 'Vous avez d\u00e9j\u00e0 un parrain' });
        }

        // Trouver le parrain
        const { data: parrain } = await sb
            .from('profiles')
            .select('id, eclats, referrals_this_month, referrals_month')
            .eq('referral_code', referral_code)
            .single();

        if (!parrain) {
            return res.status(404).json({ error: 'Code parrainage invalide' });
        }

        // Vérifier le plafond mensuel du parrain
        const currentMonth = new Date().toISOString().substring(0, 7);
        let monthlyCount = parrain.referrals_this_month || 0;
        if (parrain.referrals_month !== currentMonth) {
            monthlyCount = 0; // Reset nouveau mois
        }

        if (monthlyCount >= MAX_REFERRALS_PER_MONTH) {
            return res.status(400).json({ error: 'Le parrain a atteint son plafond mensuel' });
        }

        // Enregistrer le parrain du filleul SANS créditer les Éclats immédiatement.
        // Les Éclats filleul (REFERRAL_REWARD_FILLEUL) ne sont crédités qu'après
        // un achat >= MIN_FILLEUL_ORDER_AMOUNT confirmé via le webhook post-achat
        // (voir module.exports.creditReferralFilleul appelé dans webhook.js).
        await sb.from('profiles').update({
            referred_by: parrain.id
        }).eq('id', user.userId);

        // Incrémenter le compteur mensuel du parrain
        await sb.from('profiles').update({
            referrals_this_month: monthlyCount + 1,
            referrals_month: currentMonth
        }).eq('id', parrain.id);

        // Badge premier parrainage
        const { data: existingBadge } = await sb
            .from('user_badges')
            .select('id')
            .eq('user_id', parrain.id)
            .eq('badge_key', 'first_referral')
            .single();

        if (!existingBadge) {
            await sb.from('user_badges').insert({
                user_id: parrain.id,
                badge_key: 'first_referral'
            });
        }

        return res.status(200).json({
            success: true,
            eclats_earned: 0,
            pending_eclats: REFERRAL_REWARD_FILLEUL,
            min_order_required: MIN_FILLEUL_ORDER_AMOUNT,
            message: 'Code parrainage enregistr\u00e9 ! Vous recevrez ' + REFERRAL_REWARD_FILLEUL + ' \u00c9clats apr\u00e8s votre premier achat de ' + MIN_FILLEUL_ORDER_AMOUNT + '\u20ac minimum.'
        });
    } catch (err) {
        console.error('[referral POST]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Fonction exportée pour webhook.js : créditer le filleul après son 1er achat >= MIN_FILLEUL_ORDER_AMOUNT
module.exports.creditReferralFilleul = async function(sb, filleulUserId, orderAmount) {
    try {
        // Vérifier le montant minimum
        if (!orderAmount || orderAmount < MIN_FILLEUL_ORDER_AMOUNT) return null;

        const { data: filleulProfile } = await sb
            .from('profiles')
            .select('referred_by, eclats')
            .eq('id', filleulUserId)
            .single();

        if (!filleulProfile || !filleulProfile.referred_by) return null;

        // Vérifier si le filleul a déjà reçu ses Éclats de bienvenue parrainage
        const { data: existing } = await sb
            .from('loyalty_points')
            .select('id')
            .eq('user_id', filleulUserId)
            .eq('source', 'referral')
            .single();

        if (existing) return null; // Déjà crédité

        await sb.from('profiles').update({
            eclats: (filleulProfile.eclats || 0) + REFERRAL_REWARD_FILLEUL
        }).eq('id', filleulUserId);

        await sb.from('loyalty_points').insert({
            user_id: filleulUserId,
            amount: REFERRAL_REWARD_FILLEUL,
            type: 'earn',
            source: 'referral',
            reference_id: filleulProfile.referred_by,
            metadata: { role: 'filleul', triggered_by: 'first_purchase', order_amount: orderAmount }
        });

        return { filleul_id: filleulUserId, eclats: REFERRAL_REWARD_FILLEUL };
    } catch (err) {
        console.error('[referral] creditFilleul error:', err.message);
        return null;
    }
};

// Fonction exportée pour webhook.js : créditer le parrain quand le filleul commande
module.exports.creditReferralParrain = async function(sb, filleulUserId) {
    try {
        const { data: filleulProfile } = await sb
            .from('profiles')
            .select('referred_by')
            .eq('id', filleulUserId)
            .single();

        if (!filleulProfile || !filleulProfile.referred_by) return null;

        // Vérifier si déjà crédité pour ce filleul
        const { data: existing } = await sb
            .from('loyalty_points')
            .select('id')
            .eq('user_id', filleulProfile.referred_by)
            .eq('source', 'referral')
            .eq('reference_id', filleulUserId)
            .single();

        if (existing) return null; // Déjà crédité

        const { data: parrainProfile } = await sb
            .from('profiles')
            .select('eclats')
            .eq('id', filleulProfile.referred_by)
            .single();

        if (!parrainProfile) return null;

        await sb.from('profiles').update({
            eclats: (parrainProfile.eclats || 0) + REFERRAL_REWARD_PARRAIN
        }).eq('id', filleulProfile.referred_by);

        await sb.from('loyalty_points').insert({
            user_id: filleulProfile.referred_by,
            amount: REFERRAL_REWARD_PARRAIN,
            type: 'earn',
            source: 'referral',
            reference_id: filleulUserId,
            metadata: { role: 'parrain', filleul_id: filleulUserId }
        });

        // Badge 5 parrainages
        const { count } = await sb
            .from('loyalty_points')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', filleulProfile.referred_by)
            .eq('source', 'referral')
            .contains('metadata', { role: 'parrain' });

        if (count >= 5) {
            await sb.from('user_badges').insert({
                user_id: filleulProfile.referred_by,
                badge_key: 'referral_5'
            }).then(() => {}).catch(() => {});
        }

        return { parrain_id: filleulProfile.referred_by, eclats: REFERRAL_REWARD_PARRAIN };
    } catch (err) {
        console.error('[referral] creditParrain error:', err.message);
        return null;
    }
};
