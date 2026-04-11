// ============================
// ÉCLAT — Gamification endpoint
// POST /api/gamification — daily-login auto check-in
// Appelé automatiquement par auth.js à chaque connexion quotidienne
// ============================

const { verifyAuth, getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin || '';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.indexOf(origin) !== -1 ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'auth')) return;

    const authResult = await verifyAuth(req);
    if (!authResult) return res.status(401).json({ error: 'Non autorisé' });

    const { action } = req.body || {};

    if (action === 'daily-login') {
        try {
            const sb = getSupabase();
            const userId = authResult.userId;
            const today = new Date().toISOString().split('T')[0];

            // Vérifie si déjà check-in aujourd'hui
            const { data: profile } = await sb
                .from('profiles')
                .select('last_checkin, streak_days, eclats, loyalty_tier')
                .eq('id', userId)
                .single();

            if (!profile) return res.status(200).json({ ok: true, skipped: true });

            // Si déjà fait aujourd'hui, skip
            if (profile.last_checkin === today) {
                return res.status(200).json({ ok: true, already: true });
            }

            // Calculer streak
            let streak = profile.streak_days || 0;
            if (profile.last_checkin) {
                const lastDate = new Date(profile.last_checkin);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate - lastDate) / 86400000);
                if (diffDays === 1) {
                    streak += 1;
                } else if (diffDays > 2) {
                    streak = 1; // Reset après 48h+ sans check-in
                } else {
                    streak += 1; // Grace period 48h
                }
            } else {
                streak = 1;
            }

            // Éclats selon streak
            let eclatsGain = 2;
            if (streak >= 30) eclatsGain = 10;
            else if (streak >= 21) eclatsGain = 8;
            else if (streak >= 7) eclatsGain = 5;

            const newEclats = (profile.eclats || 0) + eclatsGain;

            // Mettre à jour le profil
            await sb.from('profiles').update({
                last_checkin: today,
                streak_days: streak,
                eclats: newEclats
            }).eq('id', userId);

            // Log transaction
            await sb.from('loyalty_points').insert({
                user_id: userId,
                amount: eclatsGain,
                type: 'earn',
                source: 'checkin',
                metadata: { streak: streak, auto: true }
            });

            return res.status(200).json({
                ok: true,
                eclats_gained: eclatsGain,
                new_balance: newEclats,
                streak: streak
            });
        } catch (err) {
            console.error('[gamification]', err.message);
            return res.status(200).json({ ok: true, error: 'silent' });
        }
    }

    return res.status(200).json({ ok: true });
};
