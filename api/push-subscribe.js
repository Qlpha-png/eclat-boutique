// ============================
// ECLAT - Push Subscribe API
// POST /api/push-subscribe - Save push subscription
// ============================
// SQL:
// CREATE TABLE IF NOT EXISTS push_subscriptions (
//   id SERIAL PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id),
//   endpoint TEXT UNIQUE NOT NULL,
//   keys_p256dh TEXT NOT NULL,
//   keys_auth TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

module.exports = async (req, res) => {
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    try {
        var body = req.body || {};
        var subscription = body.subscription;
        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return res.status(400).json({ error: 'Invalid subscription' });
        }

        // Optional auth
        var userId = null;
        var authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            var token = authHeader.replace('Bearer ', '');
            var { data: { user } } = await supabase.auth.getUser(token);
            if (user) userId = user.id;
        }

        // Upsert subscription
        var { error } = await supabase.from('push_subscriptions').upsert({
            user_id: userId,
            endpoint: subscription.endpoint,
            keys_p256dh: subscription.keys.p256dh,
            keys_auth: subscription.keys.auth,
            created_at: new Date().toISOString()
        }, { onConflict: 'endpoint' });

        if (error) return res.status(500).json({ error: 'Erreur serveur' });
        return res.status(201).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
