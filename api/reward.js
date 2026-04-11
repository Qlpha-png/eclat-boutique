/**
 * POST /api/reward — Appliquer une récompense (roue, coffre, streak)
 * Crédite les Éclats ou génère un code promo
 */
const { verifyAuth, getProfile, getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'public')) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifié' });

    const { reward, source } = req.body || {};
    if (!reward || !reward.type) return res.status(400).json({ error: 'Reward invalide' });

    try {
        const sb = getSupabase();
        const profile = await getProfile(user.userId);
        if (!profile) return res.status(404).json({ error: 'Profil introuvable' });

        var result = {};

        switch (reward.type) {
            case 'eclats': {
                var bonus = Math.min(parseInt(reward.value) || 0, 200); // Cap à 200 pour sécurité
                if (bonus > 0) {
                    await sb.from('profiles').update({
                        eclats: (profile.eclats || 0) + bonus
                    }).eq('id', user.userId);
                    result = { credited: bonus, total: (profile.eclats || 0) + bonus };
                }
                break;
            }
            case 'discount': {
                var pct = Math.min(parseInt(reward.value) || 0, 20); // Cap à 20%
                var code = 'ROUE' + pct + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
                var expires = new Date(Date.now() + 30 * 86400000).toISOString(); // 30 jours

                await sb.from('promo_codes').insert({
                    code: code,
                    type: 'percentage',
                    value: pct,
                    min_order: 0,
                    max_uses: 1,
                    expires_at: expires,
                    active: true
                });

                result = { code: code, discount: pct + '%', expires: expires };
                break;
            }
            case 'shipping': {
                var shipCode = 'LIVR-' + Math.random().toString(36).substring(2, 7).toUpperCase();
                var shipExpires = new Date(Date.now() + 30 * 86400000).toISOString();

                await sb.from('promo_codes').insert({
                    code: shipCode,
                    type: 'fixed',
                    value: 4.90, // Coût livraison standard
                    min_order: 0,
                    max_uses: 1,
                    expires_at: shipExpires,
                    active: true
                });

                result = { code: shipCode, discount: 'Livraison offerte', expires: shipExpires };
                break;
            }
            default:
                return res.status(400).json({ error: 'Type de récompense inconnu' });
        }

        console.log('[reward]', source, reward.type, reward.value, 'for', user.email);
        return res.status(200).json({ success: true, result: result });
    } catch (err) {
        console.error('[reward]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
