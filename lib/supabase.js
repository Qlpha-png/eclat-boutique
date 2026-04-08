// ============================
// ÉCLAT — Supabase Client
// Centralise la connexion à la base de données
// ============================

const { createClient } = require('@supabase/supabase-js');

let supabase = null;

function getSupabase() {
    if (supabase) return supabase;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY; // service_role key for server-side

    if (!url || !key) {
        return null; // Graceful fallback if not configured
    }

    supabase = createClient(url, key, {
        auth: { persistSession: false }
    });

    return supabase;
}

// Public client for browser-side auth (uses anon key)
function getSupabasePublic() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) return null;

    return createClient(url, key);
}

module.exports = { getSupabase, getSupabasePublic };
