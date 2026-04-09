/**
 * GET /api/admin/returns — Liste retours avec pagination/filtre
 * PATCH /api/admin/returns — Mettre à jour statut + traiter remboursement
 * Requiert : auth Supabase + rôle admin
 *
 * Table returns : id(uuid), order_id, customer_id, reason, description,
 * status (requested|approved|received|refunded|rejected),
 * refund_amount, stripe_refund_id, admin_notes, created_at, updated_at
 */
const Stripe = require('stripe');
const { requireAdmin, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');
const { logAdminAction } = require('../_middleware/audit');

const VALID_STATUSES = ['requested', 'approved', 'received', 'refunded', 'rejected'];
const VALID_REASONS = ['defective', 'wrong_item', 'not_satisfied', 'damaged', 'other'];

module.exports = async function handler(req, res) {
    if (applyRateLimit(req, res, 'admin')) return;

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    const sb = getSupabase();

    // ── GET : Liste retours ──
    if (req.method === 'GET') {
        try {
            const { status, reason, page = '1', limit = '20' } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(parseInt(limit) || 20, 100);
            const offset = (pageNum - 1) * limitNum;

            let query = sb
                .from('returns')
                .select('*, orders(email, total, stripe_session_id, created_at), customers(email, first_name, last_name)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limitNum - 1);

            if (status && VALID_STATUSES.includes(status)) query = query.eq('status', status);
            if (reason && VALID_REASONS.includes(reason)) query = query.eq('reason', reason);

            const { data, count, error } = await query;
            if (error) throw error;

            return res.status(200).json({
                returns: data || [],
                total: count || 0,
                page: pageNum,
                pages: Math.ceil((count || 0) / limitNum)
            });
        } catch (err) {
            console.error('[admin/returns GET]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // ── PATCH : Modifier statut + remboursement Stripe ──
    if (req.method === 'PATCH') {
        try {
            const { id, status, admin_notes, refund_amount, process_refund } = req.body || {};
            if (!id) return res.status(400).json({ error: 'ID requis' });

            const updates = { updated_at: new Date().toISOString() };

            if (status) {
                if (!VALID_STATUSES.includes(status)) {
                    return res.status(400).json({ error: 'Statut invalide', valid: VALID_STATUSES });
                }
                updates.status = status;
            }
            if (admin_notes !== undefined) updates.admin_notes = admin_notes;
            if (refund_amount !== undefined) updates.refund_amount = parseFloat(refund_amount);

            // Traiter le remboursement Stripe si demandé
            if (process_refund && status === 'refunded') {
                const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
                if (!secretKey) {
                    return res.status(500).json({ error: 'STRIPE_SECRET_KEY non configuré' });
                }

                // Récupérer la commande liée pour le payment_intent
                const { data: returnData, error: retErr } = await sb
                    .from('returns')
                    .select('order_id, refund_amount, orders(stripe_session_id, total)')
                    .eq('id', id)
                    .single();

                if (retErr || !returnData) {
                    return res.status(404).json({ error: 'Retour introuvable' });
                }

                const stripe = new Stripe(secretKey);
                const sessionId = returnData.orders?.stripe_session_id;

                if (sessionId) {
                    try {
                        const session = await stripe.checkout.sessions.retrieve(sessionId);
                        const paymentIntentId = session.payment_intent;

                        if (paymentIntentId) {
                            const amount = refund_amount
                                ? Math.round(parseFloat(refund_amount) * 100)
                                : undefined; // undefined = remboursement total

                            const refund = await stripe.refunds.create({
                                payment_intent: paymentIntentId,
                                ...(amount ? { amount } : {})
                            });

                            updates.stripe_refund_id = refund.id;
                            updates.refund_amount = refund.amount / 100;
                        }
                    } catch (stripeErr) {
                        console.error('[returns] Stripe refund error:', stripeErr.message);
                        return res.status(500).json({ error: 'Erreur remboursement Stripe: ' + stripeErr.message });
                    }
                } else {
                    return res.status(400).json({ error: 'Pas de session Stripe liée à cette commande' });
                }
            }

            const { data, error } = await sb
                .from('returns')
                .update(updates)
                .eq('id', id)
                .select('id, status, refund_amount, stripe_refund_id, admin_notes')
                .single();

            if (error) throw error;

            await logAdminAction({
                adminId: admin.userId, action: 'update', entityType: 'return',
                entityId: String(id), details: updates, req
            });

            return res.status(200).json(data);
        } catch (err) {
            console.error('[admin/returns PATCH]', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
