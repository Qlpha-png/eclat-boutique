/**
 * Audit Logger — Trace les actions admin dans admin_audit_log
 * Utilise le service_role_key (pas impacté par RLS)
 */
const { getSupabase } = require('./auth');

/**
 * Log une action admin dans la table admin_audit_log
 * @param {object} params
 * @param {string} params.adminId - UUID de l'admin
 * @param {string} params.action - Action effectuée (create, update, delete, export, etc.)
 * @param {string} params.entityType - Type d'entité (order, customer, promo, product, review, return)
 * @param {string} [params.entityId] - ID de l'entité concernée
 * @param {object} [params.details] - Détails supplémentaires (champs modifiés, ancienne valeur, etc.)
 * @param {Request} [params.req] - Requête HTTP (pour extraire l'IP)
 */
async function logAdminAction({ adminId, action, entityType, entityId, details, req }) {
    try {
        const sb = getSupabase();
        const ip = req
            ? (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown')
            : 'unknown';

        await sb.from('admin_audit_log').insert({
            admin_id: adminId,
            action: action,
            entity_type: entityType,
            entity_id: entityId || null,
            details: details || null,
            ip: ip,
            created_at: new Date().toISOString()
        });
    } catch (err) {
        // Ne jamais bloquer l'action principale si le log échoue
        console.warn('[audit] Log failed:', err.message);
    }
}

module.exports = { logAdminAction };
