/**
 * GET /api/admin/promos — Liste des codes promo
 * POST /api/admin/promos — Créer un code promo
 * PATCH /api/admin/promos — Modifier un code promo
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

const VALID_PROMO_TYPES = ['percentage', 'fixed'];

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // ── GET : Liste des promos ──
    if (req.method === 'GET') {
        try {
            const { data, error } = await sb
                .from('promo_codes')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return res.status(200).json({ promos: data || [] });
        } catch (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── POST : Créer un code promo ──
    if (req.method === 'POST') {
        try {
            const { code, type, value, min_order, max_uses, expires_at } = req.body || {};
            if (!code || !type || !value) {
                return res.status(400).json({ error: 'code, type et value requis' });
            }
            if (!VALID_PROMO_TYPES.includes(type)) {
                return res.status(400).json({ error: 'Type invalide', valid: VALID_PROMO_TYPES });
            }
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue <= 0) {
                return res.status(400).json({ error: 'La valeur doit être un nombre positif' });
            }
            if (type === 'percentage' && numValue > 100) {
                return res.status(400).json({ error: 'Le pourcentage ne peut pas dépasser 100' });
            }

            const { data, error } = await sb
                .from('promo_codes')
                .insert({
                    code: code.toUpperCase().trim(),
                    type,
                    value: numValue,
                    min_order: parseFloat(min_order) || 0,
                    max_uses: max_uses ? parseInt(max_uses) : null,
                    expires_at: expires_at || null,
                    active: true
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    return res.status(409).json({ error: 'Ce code promo existe déjà' });
                }
                throw error;
            }

            await logAdminAction({
                adminId: admin.userId, action: 'create', entityType: 'promo',
                entityId: data.id, details: { code: data.code, type, value: numValue }, req
            });

            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── PATCH : Modifier un code promo ──
    if (req.method === 'PATCH') {
        try {
            const { id, active, max_uses, expires_at } = req.body || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const updates = {};
            if (active !== undefined) updates.active = active;
            if (max_uses !== undefined) updates.max_uses = max_uses;
            if (expires_at !== undefined) updates.expires_at = expires_at;

            const { data, error } = await sb
                .from('promo_codes')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: 'update', entityType: 'promo',
                entityId: id, details: updates, req
            });

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
