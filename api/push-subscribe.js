/**
 * /api/push-subscribe — Gestion des abonnements push
 * POST : s'abonner (auth requis)
 * DELETE : se désabonner
 */
const { getSupabase, verifyAuth } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'authenticated')) return;

    var sb = getSupabase();
    var auth = await verifyAuth(req);
    if (!auth) return res.status(401).json({ error: 'Authentification requise' });

    // POST — subscribe
    if (req.method === 'POST') {
        var sub = req.body || {};
        if (!sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
            return res.status(400).json({ error: 'Subscription invalide (endpoint + keys requis)' });
        }

        var { error } = await sb.from('push_subscriptions').upsert({
            user_id: auth.userId,
            endpoint: sub.endpoint,
            keys_p256dh: sub.keys.p256dh,
            keys_auth: sub.keys.auth,
            created_at: new Date().toISOString()
        }, { onConflict: 'endpoint' });

        if (error) {
            console.error('[push-subscribe POST]', error.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        return res.status(200).json({ ok: true });
    }

    // DELETE — unsubscribe
    if (req.method === 'DELETE') {
        var body = req.body || {};
        if (!body.endpoint) return res.status(400).json({ error: 'endpoint requis' });

        await sb.from('push_subscriptions')
            .delete()
            .eq('user_id', auth.userId)
            .eq('endpoint', body.endpoint)
            .catch(function() {});

        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
