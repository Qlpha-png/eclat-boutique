/**
 * ÉCLAT Boutique — Module de connexion Supabase (PostgreSQL)
 * Singleton partagé par toutes les API serverless
 */

const { createClient } = require('@supabase/supabase-js');

let _supabase = null;

function getDB() {
    if (!_supabase) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

module.exports = { getDB };
