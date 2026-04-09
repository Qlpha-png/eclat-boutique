/**
 * RGPD — Droits des utilisateurs
 * GET /api/gdpr?action=export — Exporter mes données (JSON)
 * POST /api/gdpr — Demander la suppression de mon compte
 * Requiert : auth Supabase (utilisateur connecté)
 */
const { verifyAuth, getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'auth')) return;

    // CORS
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Connexion requise' });

    const sb = getSupabase();

    // ── GET : Exporter mes données ──
    if (req.method === 'GET' && req.query.action === 'export') {
        try {
            // Récupérer toutes les données liées à cet utilisateur
            const [profileRes, ordersRes, reviewsRes, newsletterRes] = await Promise.all([
                sb.from('profiles').select('*').eq('id', user.userId).single(),
                sb.from('orders').select('*, order_items(*)').eq('user_id', user.userId).order('created_at', { ascending: false }),
                sb.from('reviews').select('*').eq('customer_id', user.userId),
                sb.from('newsletter_subscribers').select('*').eq('email', user.email)
            ]);

            const exportData = {
                _info: {
                    export_date: new Date().toISOString(),
                    user_email: user.email,
                    description: 'Export RGPD — Toutes vos données personnelles chez Maison ÉCLAT'
                },
                profile: profileRes.data || null,
                orders: ordersRes.data || [],
                reviews: reviewsRes.data || [],
                newsletter: newsletterRes.data || []
            };

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=eclat-mes-donnees-' + new Date().toISOString().slice(0, 10) + '.json');
            return res.status(200).json(exportData);
        } catch (err) {
            console.error('[gdpr/export]', err.message);
            return res.status(500).json({ error: 'Erreur export données' });
        }
    }

    // ── POST : Demande de suppression ──
    if (req.method === 'POST') {
        try {
            const { confirm } = req.body || {};
            if (confirm !== true) {
                return res.status(400).json({
                    error: 'Confirmation requise',
                    message: 'Envoyez { "confirm": true } pour confirmer la suppression de vos données. Cette action est irréversible.'
                });
            }

            // Anonymiser les données (on ne supprime pas les commandes pour la compta — obligation légale 10 ans)
            // 1. Anonymiser le profil
            await sb.from('profiles').update({
                first_name: 'Utilisateur',
                last_name: 'Supprimé',
                phone: null,
                avatar_url: null,
                preferences: {}
            }).eq('id', user.userId);

            // 2. Anonymiser les commandes (garder pour compta, mais supprimer PII)
            await sb.from('orders').update({
                email: 'supprime@rgpd.eclat',
                phone: null,
                shipping_address: { anonymized: true },
                notes: 'Données anonymisées — demande RGPD ' + new Date().toISOString().slice(0, 10)
            }).eq('user_id', user.userId);

            // 3. Supprimer les avis
            await sb.from('reviews').delete().eq('customer_id', user.userId);

            // 4. Désabonner de la newsletter
            await sb.from('newsletter_subscribers').update({ subscribed: false }).eq('email', user.email);

            // 5. Supprimer les données client (loyalty, etc.)
            await sb.from('customers').update({
                email: 'supprime@rgpd.eclat',
                first_name: 'Supprimé',
                last_name: null,
                phone: null,
                loyalty_points: 0
            }).eq('id', user.userId);

            console.log('[RGPD] Données supprimées pour:', user.userId);

            return res.status(200).json({
                success: true,
                message: 'Vos données personnelles ont été supprimées/anonymisées. Les données de facturation sont conservées 10 ans conformément à la loi française.'
            });
        } catch (err) {
            console.error('[gdpr/delete]', err.message);
            return res.status(500).json({ error: 'Erreur suppression données' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
