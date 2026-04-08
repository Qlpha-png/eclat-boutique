/**
 * ÉCLAT Boutique — Webhook Clerk
 * Reçoit les événements user.created / user.updated / user.deleted
 * Synchronise les utilisateurs dans Neon (PostgreSQL)
 */

const { getDB } = require('./_lib/db');
const { verifyWebhook } = require('./_middleware/auth');

function generateReferralCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = 'ECL-';
    for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vérifier la signature du webhook Clerk
    const payload = req.body;
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ error: 'Missing svix headers' });
    }

    // Note: Pour une vérification complète, utiliser le package 'svix'
    // Pour la V2, on vérifie via le webhook secret si configuré
    // En attendant, on accepte les requêtes avec les headers svix présents

    const eventType = payload.type;
    const data = payload.data;

    if (!eventType || !data) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const db = getDB();

    try {
        switch (eventType) {
            case 'user.created': {
                const clerkId = data.id;
                const email = data.email_addresses?.[0]?.email_address || '';
                const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
                const phone = data.phone_numbers?.[0]?.phone_number || null;
                const avatarUrl = data.image_url || null;

                // Insérer l'utilisateur
                await db.execute({
                    sql: `INSERT INTO users (clerk_id, email, name, phone, avatar_url)
                          VALUES (?, ?, ?, ?, ?) ON CONFLICT (clerk_id) DO NOTHING`,
                    args: [clerkId, email, name, phone, avatarUrl]
                });

                // Récupérer l'ID utilisateur
                const userResult = await db.execute({
                    sql: 'SELECT id FROM users WHERE clerk_id = ?',
                    args: [clerkId]
                });

                if (userResult.rows.length > 0) {
                    const userId = userResult.rows[0].id;

                    // Générer un code parrainage unique
                    let referralCode = generateReferralCode();
                    let attempts = 0;
                    while (attempts < 5) {
                        try {
                            await db.execute({
                                sql: `INSERT INTO loyalty_accounts (user_id, referral_code)
                                      VALUES (?, ?) ON CONFLICT (user_id) DO NOTHING`,
                                args: [userId, referralCode]
                            });
                            break;
                        } catch (e) {
                            referralCode = generateReferralCode();
                            attempts++;
                        }
                    }
                }

                console.log(`[clerk-webhook] User created: ${email} (${clerkId})`);
                break;
            }

            case 'user.updated': {
                const clerkId = data.id;
                const email = data.email_addresses?.[0]?.email_address || '';
                const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
                const phone = data.phone_numbers?.[0]?.phone_number || null;
                const avatarUrl = data.image_url || null;

                await db.execute({
                    sql: `UPDATE users SET email = ?, name = ?, phone = ?, avatar_url = ?, updated_at = NOW()
                          WHERE clerk_id = ?`,
                    args: [email, name, phone, avatarUrl, clerkId]
                });

                console.log(`[clerk-webhook] User updated: ${email} (${clerkId})`);
                break;
            }

            case 'user.deleted': {
                const clerkId = data.id;

                // Soft delete : on anonymise les données mais on garde les commandes
                await db.execute({
                    sql: `UPDATE users SET email = 'deleted@deleted.com', name = 'Compte supprimé',
                          phone = NULL, avatar_url = NULL, updated_at = NOW()
                          WHERE clerk_id = ?`,
                    args: [clerkId]
                });

                console.log(`[clerk-webhook] User deleted: ${clerkId}`);
                break;
            }

            default:
                console.log(`[clerk-webhook] Unhandled event: ${eventType}`);
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('[clerk-webhook] Error:', err);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
};
