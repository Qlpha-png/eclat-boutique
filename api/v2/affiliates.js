// ============================
// ÉCLAT — API Affiliation v2
// GET /api/v2/affiliates?action=track&ref=xxx — Tracker un clic
// GET /api/v2/affiliates?action=dashboard — Dashboard affilié (authentifié)
// POST /api/v2/affiliates?action=register — S'inscrire comme affilié
// ============================

const { getSupabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    const action = req.query.action;

    try {
        // ===== TRACKER UN CLIC AFFILIÉ =====
        if (action === 'track' && req.method === 'GET') {
            const refCode = req.query.ref;
            if (!refCode) return res.status(200).json({ tracked: false });

            const { data: affiliate } = await supabase
                .from('affiliates')
                .select('id')
                .eq('ref_code', refCode)
                .eq('active', true)
                .single();

            if (!affiliate) return res.status(200).json({ tracked: false });

            await supabase.from('affiliate_clicks').insert({
                affiliate_id: affiliate.id,
                ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                user_agent: req.headers['user-agent'],
                page_url: req.headers.referer
            });

            return res.status(200).json({ tracked: true, affiliate_id: affiliate.id });
        }

        // ===== S'INSCRIRE COMME AFFILIÉ =====
        if (action === 'register' && req.method === 'POST') {
            const { name, email } = req.body;
            if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

            const refCode = 'AFF' + Math.random().toString(36).substring(2, 8).toUpperCase();

            const { data, error } = await supabase
                .from('affiliates')
                .insert({ name, email, ref_code: refCode })
                .select('id, ref_code')
                .single();

            if (error) {
                if (error.message.includes('unique')) {
                    return res.status(409).json({ error: 'Email already registered as affiliate' });
                }
                return res.status(500).json({ error: error.message });
            }

            return res.status(201).json({
                success: true,
                ref_code: data.ref_code,
                tracking_url: `https://maison-eclat.shop/?ref=${data.ref_code}`,
                message: 'Welcome! Share your link to earn 10% commission on every sale.'
            });
        }

        // ===== DASHBOARD AFFILIÉ =====
        if (action === 'dashboard') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user } } = await supabase.auth.getUser(token);
            if (!user) return res.status(401).json({ error: 'Invalid token' });

            const { data: affiliate } = await supabase
                .from('affiliates')
                .select('*')
                .eq('email', user.email)
                .single();

            if (!affiliate) return res.status(404).json({ error: 'Not registered as affiliate' });

            // Stats
            const { count: totalClicks } = await supabase
                .from('affiliate_clicks')
                .select('*', { count: 'exact', head: true })
                .eq('affiliate_id', affiliate.id);

            const { data: conversions } = await supabase
                .from('affiliate_conversions')
                .select('order_total, commission, paid, created_at')
                .eq('affiliate_id', affiliate.id)
                .order('created_at', { ascending: false });

            return res.status(200).json({
                ref_code: affiliate.ref_code,
                tracking_url: `https://maison-eclat.shop/?ref=${affiliate.ref_code}`,
                commission_rate: affiliate.commission_rate,
                total_clicks: totalClicks || 0,
                total_conversions: (conversions || []).length,
                total_earned: affiliate.total_earned,
                total_paid: affiliate.total_paid,
                balance: affiliate.total_earned - affiliate.total_paid,
                conversions: conversions || []
            });
        }

        return res.status(400).json({ error: 'Invalid action. Use: track, register, dashboard' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
