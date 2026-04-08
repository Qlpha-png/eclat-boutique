// ============================
// ÉCLAT — API Auth v2 (Supabase Auth)
// POST /api/v2/auth?action=signup — Inscription
// POST /api/v2/auth?action=login — Connexion
// POST /api/v2/auth?action=logout — Déconnexion
// POST /api/v2/auth?action=reset — Reset mot de passe
// GET /api/v2/auth?action=profile — Profil utilisateur
// ============================

const { getSupabase, getSupabasePublic } = require('../../lib/supabase');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = getSupabase();
    if (!supabase) {
        return res.status(503).json({ error: 'Auth service not configured' });
    }

    const action = req.query.action;

    try {
        // ===== INSCRIPTION =====
        if (action === 'signup' && req.method === 'POST') {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }
            if (password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' });
            }

            // Créer l'utilisateur dans Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { name: name || '' }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    return res.status(409).json({ error: 'Email already registered' });
                }
                return res.status(400).json({ error: authError.message });
            }

            // Créer le profil client dans la table customers
            const referralCode = 'ECL' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const { error: profileError } = await supabase
                .from('customers')
                .insert({
                    auth_id: authData.user.id,
                    email,
                    name: name || '',
                    referral_code: referralCode
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
            }

            return res.status(201).json({
                success: true,
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    name: name || ''
                }
            });
        }

        // ===== CONNEXION =====
        if (action === 'login' && req.method === 'POST') {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Récupérer le profil client
            const { data: customer } = await supabase
                .from('customers')
                .select('*')
                .eq('auth_id', data.user.id)
                .single();

            return res.status(200).json({
                success: true,
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at
                },
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: customer?.name || '',
                    tier: customer?.tier || 'bronze',
                    loyalty_points: customer?.loyalty_points || 0
                }
            });
        }

        // ===== RESET MOT DE PASSE =====
        if (action === 'reset' && req.method === 'POST') {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Email required' });

            const siteUrl = req.headers.origin || 'https://maison-eclat.shop';
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${siteUrl}/pages/reset-password.html`
            });

            // Toujours répondre success (ne pas révéler si l'email existe)
            return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent' });
        }

        // ===== PROFIL =====
        if (action === 'profile' && req.method === 'GET') {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'Not authenticated' });

            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) return res.status(401).json({ error: 'Invalid token' });

            const { data: customer } = await supabase
                .from('customers')
                .select(`
                    *,
                    addresses(*),
                    wishlists(product_id, products(id, name, price, image_url))
                `)
                .eq('auth_id', user.id)
                .single();

            // Commandes récentes
            const { data: orders } = await supabase
                .from('orders')
                .select('id, status, total, created_at, tracking_number, tracking_url')
                .eq('customer_id', customer?.id)
                .order('created_at', { ascending: false })
                .limit(20);

            return res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: customer?.name || '',
                    phone: customer?.phone || '',
                    tier: customer?.tier || 'bronze',
                    loyalty_points: customer?.loyalty_points || 0,
                    total_spent: customer?.total_spent || 0,
                    referral_code: customer?.referral_code || '',
                    addresses: customer?.addresses || [],
                    wishlist: customer?.wishlists || [],
                    orders: orders || []
                }
            });
        }

        return res.status(400).json({ error: 'Invalid action. Use: signup, login, reset, profile' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
