// ============================
// ÉCLAT — Système de parrainage
// GET/POST /api/loyalty/referral
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V2 — Parrainage rebalancé
// Ancien : 75+30 = 105 Éclats = 6.30€ par referral → farming facile
// Nouveau : 25+10 = 35 Éclats = 2.10€ → acceptable car acquisition client
// Le parrain reçoit ses Éclats seulement après le 1er ACHAT du filleul
// ══════════════════════════════════════════════════════════════
const REFERRAL_REWARD_PARRAIN = 25;
const REFERRAL_REWARD_FILLEUL = 10;
const MAX_REFERRALS_PER_MONTH = 5;

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

        // Créditer le filleul
        await sb.from('profiles').update({
            referred_by: parrain.id,
            eclats: (profile.eclats || 0) + REFERRAL_REWARD_FILLEUL
        }).eq('id', user.userId);

        await sb.from('loyalty_points').insert({
            user_id: user.userId,
            amount: REFERRAL_REWARD_FILLEUL,
            type: 'earn',
            source: 'referral',
            reference_id: parrain.id,
            metadata: { role: 'filleul', parrain_code: referral_code }
        });

        // Créditer le parrain (bonus immédiat)
        // Note : le gros bonus (75) est donné quand le filleul fait sa 1ère commande (dans webhook.js)
        // Ici on donne juste une notification au parrain qu'un filleul s'est inscrit
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
            eclats_earned: REFERRAL_REWARD_FILLEUL,
            new_balance: (profile.eclats || 0) + REFERRAL_REWARD_FILLEUL,
            message: 'Code parrainage appliqu\u00e9 ! Vous recevez ' + REFERRAL_REWARD_FILLEUL + ' \u00c9clats.'
        });
    } catch (err) {
        console.error('[referral POST]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
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
