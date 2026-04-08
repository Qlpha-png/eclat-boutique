/**
 * ÉCLAT Boutique — Module de connexion Neon (PostgreSQL serverless)
 * Singleton partagé par toutes les API serverless
 * Wrapper de compatibilité : même API que l'ancien client Turso
 */

const { Pool } = require('@neondatabase/serverless');

let _pool = null;

function getDB() {
    if (!_pool) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL must be set');
        }
        _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    return {
        execute: async (query) => {
            let sql, args;
            if (typeof query === 'string') {
                sql = query;
                args = [];
            } else {
                sql = query.sql;
                args = query.args || [];
            }
            // Convertir les placeholders ? en $1, $2, $3... (PostgreSQL)
            let idx = 0;
            const pgSql = sql.replace(/\?/g, () => `$${++idx}`);
            const result = await _pool.query(pgSql, args);
            return { rows: result.rows };
        }
    };
}

module.exports = { getDB };
