/**
 * ÉCLAT Boutique — Middleware d'authentification Supabase
 * Vérifie les tokens JWT Supabase dans les API serverless
 */

const { createClient } = require('@supabase/supabase-js');

let _supabase = null;

function getSupabase() {
    if (!_supabase) {
        const url = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
        _supabase = createClient(url, serviceKey);
    }
    return _supabase;
}

/**
 * Vérifie le token Bearer et retourne les informations utilisateur
 * @param {Request} req - La requête HTTP
 * @returns {{ userId: string } | null}
 */
async function verifyAuth(req) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return null;

    try {
        const sb = getSupabase();
        const { data, error } = await sb.auth.getUser(token);
        if (error || !data.user) return null;
        return { userId: data.user.id, email: data.user.email };
    } catch (err) {
        console.error('[auth] Token verification failed:', err.message);
        return null;
    }
}

/**
 * Vérifie que l'utilisateur est admin via la table profiles
 * @param {Request} req - La requête HTTP
 * @returns {{ userId: string, email: string } | null}
 */
async function requireAdmin(req) {
    const authResult = await verifyAuth(req);
    if (!authResult) return null;

    try {
        const sb = getSupabase();
        const { data } = await sb.from('profiles').select('role').eq('id', authResult.userId).single();
        if (!data || data.role !== 'admin') return null;
        return authResult;
    } catch (err) {
        console.error('[auth] Admin check failed:', err.message);
        return null;
    }
}

/**
 * Récupère le profil complet d'un utilisateur
 * @param {string} userId - UUID Supabase de l'utilisateur
 * @returns {object | null}
 */
async function getProfile(userId) {
    try {
        const sb = getSupabase();
        const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
        return data || null;
    } catch (err) {
        console.error('[auth] getProfile failed:', err.message);
        return null;
    }
}

module.exports = {
    verifyAuth,
    requireAdmin,
    getProfile,
    getSupabase
};
