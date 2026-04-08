/**
 * ÉCLAT Boutique — Middleware d'authentification
 * Fonctions utilitaires pour vérifier les tokens Clerk dans les API serverless
 */

const { createClerkClient } = require('@clerk/backend');

let _clerkClient = null;

function getClerkClient() {
    if (!_clerkClient) {
        if (!process.env.CLERK_SECRET_KEY) {
            throw new Error('CLERK_SECRET_KEY must be set');
        }
        _clerkClient = createClerkClient({
            secretKey: process.env.CLERK_SECRET_KEY
        });
    }
    return _clerkClient;
}

/**
 * Vérifie le token Bearer et retourne les informations utilisateur
 * @param {Request} req - La requête HTTP
 * @returns {{ userId: string, sessionId: string } | null}
 */
async function verifyAuth(req) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return null;

    try {
        const clerk = getClerkClient();
        const { sub: userId, sid: sessionId } = await clerk.verifyToken(token);
        return { userId, sessionId };
    } catch (err) {
        console.error('[auth] Token verification failed:', err.message);
        return null;
    }
}

/**
 * Vérifie que l'utilisateur est admin via les metadata Clerk
 * @param {Request} req - La requête HTTP
 * @returns {{ userId: string, clerkUser: object } | null}
 */
async function requireAdmin(req) {
    const authResult = await verifyAuth(req);
    if (!authResult) return null;

    try {
        const clerk = getClerkClient();
        const user = await clerk.users.getUser(authResult.userId);
        const role = user.publicMetadata?.role;

        if (role !== 'admin') {
            return null;
        }

        return { userId: authResult.userId, clerkUser: user };
    } catch (err) {
        console.error('[auth] Admin check failed:', err.message);
        return null;
    }
}

/**
 * Récupère le user_id interne (Turso) à partir du clerk_id
 * @param {object} db - Client Turso
 * @param {string} clerkId - ID utilisateur Clerk
 * @returns {number | null}
 */
async function getInternalUserId(db, clerkId) {
    const result = await db.execute({
        sql: 'SELECT id FROM users WHERE clerk_id = ?',
        args: [clerkId]
    });
    return result.rows.length > 0 ? result.rows[0].id : null;
}

module.exports = {
    verifyAuth,
    requireAdmin,
    getInternalUserId,
    getClerkClient
};
