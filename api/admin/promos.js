/**
 * GET /api/admin/promos — Liste des codes promo
 * POST /api/admin/promos — Créer un code promo
 * PATCH /api/admin/promos — Modifier un code promo
 * Requiert : auth Supabase + rôle admin
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');

module.exports = async function handler(req, res) {
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
            return res.status(500).json({ error: err.message });
        }
    }

    // ── POST : Créer un code promo ──
    if (req.method === 'POST') {
        try {
            const { code, type, value, min_order, max_uses, expires_at } = req.body || {};
            if (!code || !type || !value) {
                return res.status(400).json({ error: 'code, type et value requis' });
            }

            const { data, error } = await sb
                .from('promo_codes')
                .insert({
                    code: code.toUpperCase().trim(),
                    type,
                    value: parseFloat(value),
                    min_order: parseFloat(min_order) || 0,
                    max_uses: max_uses ? parseInt(max_uses) : null,
                    expires_at: expires_at || null,
                    active: true
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
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
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
