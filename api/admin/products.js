/**
 * GET /api/admin/products — Liste produits avec pagination/filtre
 * POST /api/admin/products — Créer un produit
 * PATCH /api/admin/products — Modifier un produit
 * DELETE /api/admin/products — Désactiver un produit (soft delete)
 * Requiert : auth Supabase + rôle admin
 *
 * Table products : id(uuid), slug, name, tagline, description, price, compare_at_price,
 * category(text), images(text[]), badge, is_active, is_featured, stock, weight_grams,
 * metadata(jsonb), loyalty_points_multiplier, created_at, updated_at
 */
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

const VALID_BADGES = ['new', 'best', 'promo', 'lancement', null, ''];

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // ── GET : Liste / Détail ──
    if (req.method === 'GET') {
        try {
            const { id, category, active, search, page = '1', limit = '50' } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(parseInt(limit) || 50, 100);
            const offset = (pageNum - 1) * limitNum;

            if (id) {
                const { data, error } = await sb
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error || !data) return res.status(404).json({ error: 'Produit introuvable' });
                return res.status(200).json(data);
            }

            let query = sb
                .from('products')
                .select('id, name, slug, price, compare_at_price, images, badge, category, is_active, is_featured, stock, created_at', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limitNum - 1);

            if (category) query = query.eq('category', category);
            if (active === 'true') query = query.eq('is_active', true);
            if (active === 'false') query = query.eq('is_active', false);
            if (search) {
                const safe = search.replace(/[%_\\(),.]/g, '');
                if (safe) query = query.ilike('name', `%${safe}%`);
            }

            const { data, count, error } = await query;
            if (error) throw error;

            return res.status(200).json({
                products: data || [],
                total: count || 0,
                page: pageNum,
                pages: Math.ceil((count || 0) / limitNum)
            });
        } catch (err) {
            console.error('[admin/products GET]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── POST : Créer un produit ──
    if (req.method === 'POST') {
        try {
            const { name, price, compare_at_price, tagline, description, category, images, badge, is_active, is_featured, stock, weight_grams, metadata } = req.body || {};

            if (!name || !price) {
                return res.status(400).json({ error: 'name et price requis' });
            }
            if (parseFloat(price) <= 0) {
                return res.status(400).json({ error: 'Le prix doit être positif' });
            }
            if (badge && !VALID_BADGES.includes(badge)) {
                return res.status(400).json({ error: 'Badge invalide', valid: VALID_BADGES.filter(Boolean) });
            }

            const slug = name.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            const { data, error } = await sb
                .from('products')
                .insert({
                    name,
                    slug,
                    price: parseFloat(price),
                    compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
                    tagline: tagline || null,
                    description: description || null,
                    category: category || null,
                    images: Array.isArray(images) ? images : [],
                    badge: badge || null,
                    is_active: is_active !== false,
                    is_featured: is_featured || false,
                    stock: stock ? parseInt(stock) : null,
                    weight_grams: weight_grams ? parseInt(weight_grams) : null,
                    metadata: metadata || {}
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    return res.status(409).json({ error: 'Un produit avec ce nom existe déjà' });
                }
                throw error;
            }

            await logAdminAction({
                adminId: admin.userId, action: 'create', entityType: 'product',
                entityId: String(data.id), details: { name, price }, req
            });

            return res.status(201).json(data);
        } catch (err) {
            console.error('[admin/products POST]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── PATCH : Modifier un produit ──
    if (req.method === 'PATCH') {
        try {
            const body = req.body || {};
            const { id } = body;
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const allowed = ['name', 'price', 'compare_at_price', 'tagline', 'description', 'category', 'images', 'badge', 'is_active', 'is_featured', 'stock', 'weight_grams', 'metadata', 'loyalty_points_multiplier'];
            const updates = {};
            for (const key of allowed) {
                if (body[key] !== undefined) {
                    updates[key] = body[key];
                }
            }

            if (updates.price !== undefined && parseFloat(updates.price) <= 0) {
                return res.status(400).json({ error: 'Le prix doit être positif' });
            }
            if (updates.badge !== undefined && updates.badge && !VALID_BADGES.includes(updates.badge)) {
                return res.status(400).json({ error: 'Badge invalide' });
            }

            if (updates.name) {
                updates.slug = updates.name.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            }

            updates.updated_at = new Date().toISOString();

            if (Object.keys(updates).length <= 1) {
                return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
            }

            const { data, error } = await sb
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: 'update', entityType: 'product',
                entityId: String(id), details: updates, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/products PATCH]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // ── DELETE : Soft delete (is_active = false) ──
    if (req.method === 'DELETE') {
        try {
            const { id } = req.body || req.query || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const { data, error } = await sb
                .from('products')
                .update({ is_active: false, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('id, name, is_active')
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: 'deactivate', entityType: 'product',
                entityId: String(id), details: { name: data.name }, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/products DELETE]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
