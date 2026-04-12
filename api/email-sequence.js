/**
 * /api/email-sequence — Cron Vercel (toutes les heures)
 * Traite les sequences email : bienvenue (J3/J7), review request (J+7),
 * anniversaire (-15%), re-engagement (30j inactif)
 *
 * Securise par CRON_SECRET
 * Verifie le statut newsletter_subscribers.unsubscribed avant chaque envoi
 *
 * =============================================================================
 * SQL SCHEMA
 * =============================================================================
 *
 * CREATE TABLE IF NOT EXISTS email_sequences (
 *   id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   email         TEXT NOT NULL,
 *   sequence_type TEXT NOT NULL,          -- 'welcome_j3', 'welcome_j7', 'review_request', 'birthday', 'reengagement'
 *   step          INTEGER DEFAULT 1,
 *   scheduled_at  TIMESTAMPTZ NOT NULL,
 *   sent_at       TIMESTAMPTZ,
 *   status        TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
 *   metadata      JSONB DEFAULT '{}',
 *   created_at    TIMESTAMPTZ DEFAULT now()
 * );
 *
 * CREATE INDEX idx_email_seq_pending ON email_sequences (status, scheduled_at)
 *   WHERE status = 'pending';
 * CREATE INDEX idx_email_seq_email ON email_sequences (email, sequence_type);
 *
 * -- newsletter_subscribers (already exists)
 * -- CREATE TABLE newsletter_subscribers (
 * --   id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 * --   email        TEXT UNIQUE NOT NULL,
 * --   subscribed   BOOLEAN DEFAULT true,
 * --   unsubscribed BOOLEAN DEFAULT false,
 * --   created_at   TIMESTAMPTZ DEFAULT now()
 * -- );
 *
 * -- orders (already exists)
 * -- CREATE TABLE orders (
 * --   id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 * --   customer_email  TEXT NOT NULL,
 * --   status          TEXT DEFAULT 'pending',
 * --   created_at      TIMESTAMPTZ DEFAULT now(),
 * --   order_items     JSONB DEFAULT '[]'
 * -- );
 *
 * -- profiles (already exists)
 * -- CREATE TABLE profiles (
 * --   user_id    UUID PRIMARY KEY,
 * --   email      TEXT,
 * --   full_name  TEXT,
 * --   birthday   DATE,
 * --   eclats     INTEGER DEFAULT 0
 * -- );
 *
 * =============================================================================
 */

var { createClient } = require('@supabase/supabase-js');

var RESEND_KEY = process.env.RESEND_API_KEY || '';
var EMAIL_FROM = 'Maison \u00c9clat <contact@maison-eclat.shop>';
var SITE_URL = 'https://maison-eclat.shop';

var GOLD = '#c9a87c';
var DARK = '#2d2926';
var BG = '#faf8f5';
var FOOTER_BG = '#f3efe9';

var supabase = null;

function getSupabase() {
    if (!supabase) {
        var url = process.env.SUPABASE_URL;
        var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquantes');
        supabase = createClient(url, key);
    }
    return supabase;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

module.exports = async function handler(req, res) {
    // Verify cron secret (Vercel sends this automatically)
    var cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== 'Bearer ' + cronSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    var sb = getSupabase();
    var now = new Date().toISOString();
    var results = {
        processed: 0,
        welcomeCreated: 0,
        reviewCreated: 0,
        birthdayCreated: 0,
        reengagementCreated: 0,
        sent: 0,
        skipped: 0,
        errors: 0
    };

    try {
        // =====================================================================
        // PHASE 1 : Creer les jobs en attente
        // =====================================================================

        // --- 1a. WELCOME J3/J7 pour nouveaux abonnes newsletter ---
        // J0 est deja envoye par newsletter.js
        await createWelcomeSequences(sb, now, results);

        // --- 1b. REVIEW REQUEST J+7 post-achat ---
        await createReviewRequestSequences(sb, now, results);

        // --- 1c. ANNIVERSAIRE ---
        await createBirthdaySequences(sb, now, results);

        // --- 1d. RE-ENGAGEMENT 30j inactif ---
        await createReengagementSequences(sb, now, results);

        // =====================================================================
        // PHASE 2 : Traiter les jobs pending dont scheduled_at <= now
        // =====================================================================

        await processPendingJobs(sb, now, results);

        return res.status(200).json({ ok: true, timestamp: now, results: results });
    } catch (err) {
        console.error('[email-sequence] ERREUR GLOBALE:', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ============================================================================
// PHASE 1a : WELCOME J3 / J7
// ============================================================================

async function createWelcomeSequences(sb, now, results) {
    // RÈGLE KEVIN : Seulement les clients qui ont payé reçoivent les séquences
    // On cherche les commandes récentes (8 derniers jours) pour identifier les NOUVEAUX clients
    var eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600000).toISOString();

    var { data: recentOrders, error: ordErr } = await sb
        .from('orders')
        .select('customer_email, created_at')
        .in('status', ['paid', 'confirmed', 'shipped', 'delivered'])
        .gte('created_at', eightDaysAgo)
        .limit(100);

    if (ordErr || !recentOrders) return;

    // Dédupliquer par email — garder la première commande
    var seen = {};
    for (var i = 0; i < recentOrders.length; i++) {
        var order = recentOrders[i];
        if (!order.customer_email) continue;
        var email = order.customer_email.toLowerCase();
        if (seen[email]) continue;
        seen[email] = true;

        // Vérifier que c'est bien la PREMIÈRE commande (nouveau client)
        var { data: previousOrders } = await sb
            .from('orders')
            .select('id')
            .eq('customer_email', email)
            .in('status', ['paid', 'confirmed', 'shipped', 'delivered'])
            .lt('created_at', order.created_at)
            .limit(1);

        // Si ce n'est pas la première commande, pas de séquence welcome
        if (previousOrders && previousOrders.length > 0) continue;

        // Vérifier que l'email est aussi abonné newsletter (pas désabonné)
        var { data: subCheck } = await sb
            .from('newsletter_subscribers')
            .select('unsubscribed')
            .eq('email', email)
            .limit(1)
            .single();

        if (!subCheck || subCheck.unsubscribed === true) continue;

        var orderDate = new Date(order.created_at);
        var j3 = new Date(orderDate.getTime() + 3 * 24 * 3600000);
        var j7 = new Date(orderDate.getTime() + 7 * 24 * 3600000);

        // J3 : conseils beauté
        await ensureSequenceJob(sb, email, 'welcome_j3', 1, j3, {
            subscriber_email: email,
            subscribed_at: order.created_at
        }, results, 'welcomeCreated');

        // J7 : rappel code promo + best-sellers
        await ensureSequenceJob(sb, email, 'welcome_j7', 2, j7, {
            subscriber_email: email,
            subscribed_at: order.created_at
        }, results, 'welcomeCreated');
    }
}

// ============================================================================
// PHASE 1b : REVIEW REQUEST J+7
// ============================================================================

async function createReviewRequestSequences(sb, now, results) {
    // Commandes payees il y a 7 jours (+/- 2h de marge pour le cron)
    var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    var eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600000);

    var { data: orders, error: ordErr } = await sb
        .from('orders')
        .select('id, customer_email, status, created_at, order_items')
        .in('status', ['paid', 'confirmed', 'shipped', 'delivered'])
        .gte('created_at', eightDaysAgo.toISOString())
        .lte('created_at', sevenDaysAgo.toISOString())
        .limit(50);

    if (ordErr || !orders) return;

    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        if (!order.customer_email) continue;

        var items = order.order_items;
        var firstProduct = 'votre produit';
        var firstProductId = null;
        if (items && Array.isArray(items) && items.length > 0) {
            firstProduct = items[0].name || items[0].product_name || 'votre produit';
            firstProductId = items[0].product_id || items[0].id || null;
        }

        var scheduledAt = new Date(new Date(order.created_at).getTime() + 7 * 24 * 3600000);

        await ensureSequenceJob(sb, order.customer_email, 'review_request', 1, scheduledAt, {
            order_id: order.id,
            product_name: firstProduct,
            product_id: firstProductId,
            items: items
        }, results, 'reviewCreated');
    }
}

// ============================================================================
// PHASE 1c : ANNIVERSAIRE -15%
// ============================================================================

async function createBirthdaySequences(sb, now, results) {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var yearKey = today.getFullYear() + '-' + mm + '-' + dd;

    // Profils avec anniversaire aujourd'hui
    var { data: profiles, error: profErr } = await sb
        .from('profiles')
        .select('user_id, email, full_name, birthday, eclats')
        .not('birthday', 'is', null)
        .not('email', 'is', null)
        .limit(200);

    if (profErr || !profiles) return;

    for (var i = 0; i < profiles.length; i++) {
        var profile = profiles[i];
        if (!profile.birthday || !profile.email) continue;

        // birthday format : YYYY-MM-DD
        var parts = profile.birthday.split('-');
        if (parts.length < 3) continue;
        var bdMM = parts[1];
        var bdDD = parts[2];

        if (bdMM !== mm || bdDD !== dd) continue;

        // RÈGLE KEVIN : Seulement les clients qui ont payé
        var { data: hasOrder } = await sb
            .from('orders')
            .select('id')
            .eq('customer_email', profile.email.toLowerCase())
            .in('status', ['paid', 'confirmed', 'shipped', 'delivered'])
            .limit(1);

        if (!hasOrder || hasOrder.length === 0) continue;

        // Planifier pour maintenant (envoi immediat au prochain cron)
        var promoCode = 'ANNIV15-' + today.getFullYear();

        await ensureSequenceJob(sb, profile.email, 'birthday', 1, today, {
            full_name: profile.full_name,
            promo_code: promoCode,
            discount: 15,
            eclats: profile.eclats || 0,
            year: today.getFullYear()
        }, results, 'birthdayCreated');
    }
}

// ============================================================================
// PHASE 1d : RE-ENGAGEMENT 30j INACTIF
// ============================================================================

async function createReengagementSequences(sb, now, results) {
    // Profils dont le dernier achat/login date de 30+ jours
    var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();
    var thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 3600000).toISOString();

    // On cherche les profils qui ont un email et des eclats
    var { data: profiles, error: profErr } = await sb
        .from('profiles')
        .select('user_id, email, full_name, eclats')
        .not('email', 'is', null)
        .limit(200);

    if (profErr || !profiles) return;

    for (var i = 0; i < profiles.length; i++) {
        var profile = profiles[i];
        if (!profile.email) continue;

        // Verifier la derniere commande
        var { data: lastOrder } = await sb
            .from('orders')
            .select('created_at')
            .eq('customer_email', profile.email)
            .order('created_at', { ascending: false })
            .limit(1);

        var lastActivity = null;
        if (lastOrder && lastOrder.length > 0) {
            lastActivity = lastOrder[0].created_at;
        }

        if (!lastActivity) continue;

        var daysSinceActivity = (Date.now() - new Date(lastActivity).getTime()) / (24 * 3600000);

        // Entre 30 et 35 jours (fenetre pour eviter de re-envoyer)
        if (daysSinceActivity < 30 || daysSinceActivity > 35) continue;

        await ensureSequenceJob(sb, profile.email, 'reengagement', 1, new Date(), {
            full_name: profile.full_name,
            eclats: profile.eclats || 0,
            days_inactive: Math.floor(daysSinceActivity)
        }, results, 'reengagementCreated');
    }
}

// ============================================================================
// HELPER : Creer un job s'il n'existe pas deja
// ============================================================================

async function ensureSequenceJob(sb, email, sequenceType, step, scheduledAt, metadata, results, counterKey) {
    // Verifier doublon : meme email + meme type + meme metadata.year ou order_id
    var query = sb
        .from('email_sequences')
        .select('id')
        .eq('email', email.toLowerCase())
        .eq('sequence_type', sequenceType)
        .eq('step', step)
        .limit(1);

    // Affiner le doublon selon le type
    if (sequenceType === 'birthday' && metadata.year) {
        query = query.contains('metadata', { year: metadata.year });
    } else if (sequenceType === 'review_request' && metadata.order_id) {
        query = query.contains('metadata', { order_id: metadata.order_id });
    } else if (sequenceType === 'reengagement') {
        // Pas de re-engagement dans les 30 derniers jours
        var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();
        query = query.gte('created_at', thirtyDaysAgo);
    }

    var { data: existing } = await query;
    if (existing && existing.length > 0) return;

    var { error: insertErr } = await sb.from('email_sequences').insert({
        email: email.toLowerCase(),
        sequence_type: sequenceType,
        step: step,
        scheduled_at: scheduledAt instanceof Date ? scheduledAt.toISOString() : scheduledAt,
        status: 'pending',
        metadata: metadata || {}
    });

    if (!insertErr) {
        results[counterKey]++;
    }
}

// ============================================================================
// PHASE 2 : Traiter les jobs pending
// ============================================================================

async function processPendingJobs(sb, now, results) {
    var { data: jobs, error: jobErr } = await sb
        .from('email_sequences')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })
        .limit(50);

    if (jobErr || !jobs || jobs.length === 0) return;

    for (var i = 0; i < jobs.length; i++) {
        var job = jobs[i];
        results.processed++;

        // IMPORTANT : Verifier desabonnement newsletter
        var isUnsubscribed = await checkUnsubscribed(sb, job.email);
        if (isUnsubscribed) {
            await sb.from('email_sequences')
                .update({ status: 'cancelled', sent_at: now })
                .eq('id', job.id);
            results.skipped++;
            continue;
        }

        // Generer le contenu email selon le type
        var emailContent = buildEmailContent(job);
        if (!emailContent) {
            await sb.from('email_sequences')
                .update({ status: 'failed', metadata: Object.assign({}, job.metadata, { error: 'template_inconnu' }) })
                .eq('id', job.id);
            results.errors++;
            continue;
        }

        // Envoyer via Resend
        var sent = await sendViaResend(job.email, emailContent.subject, emailContent.html);

        if (sent) {
            await sb.from('email_sequences')
                .update({ status: 'sent', sent_at: new Date().toISOString() })
                .eq('id', job.id);
            results.sent++;
        } else {
            await sb.from('email_sequences')
                .update({ status: 'failed', metadata: Object.assign({}, job.metadata, { error: 'resend_failed' }) })
                .eq('id', job.id);
            results.errors++;
        }
    }
}

// ============================================================================
// Verification desabonnement
// ============================================================================

async function checkUnsubscribed(sb, email) {
    var { data: sub } = await sb
        .from('newsletter_subscribers')
        .select('unsubscribed')
        .eq('email', email.toLowerCase())
        .limit(1)
        .single();

    // Si pas dans la table OU unsubscribed = true => on n'envoie pas
    if (!sub) return true;
    if (sub.unsubscribed === true) return true;
    return false;
}

// ============================================================================
// Construction du contenu email
// ============================================================================

function buildEmailContent(job) {
    var meta = job.metadata || {};

    switch (job.sequence_type) {
        case 'welcome_j3':
            return buildWelcomeJ3(meta);
        case 'welcome_j7':
            return buildWelcomeJ7(meta);
        case 'review_request':
            return buildReviewRequest(meta);
        case 'birthday':
            return buildBirthday(meta);
        case 'reengagement':
            return buildReengagement(meta);
        default:
            return null;
    }
}

// --- WELCOME J3 : Conseils beaute + valeur ---
function buildWelcomeJ3(meta) {
    var body = '' +
        '<h2 style="font-family:Georgia,serif;color:' + DARK + ';font-size:22px;margin:0 0 16px;">3 secrets pour une peau \u00e9clatante</h2>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;line-height:1.8;font-size:15px;">Bienvenue dans la communaut\u00e9 \u00c9CLAT ! Voici nos meilleurs conseils pour r\u00e9v\u00e9ler votre \u00e9clat naturel :</p>' +
        '<div style="margin:24px 0;">' +
            '<div style="padding:16px 20px;background:' + BG + ';border-radius:10px;margin-bottom:12px;border-left:4px solid ' + GOLD + ';">' +
                '<strong style="color:' + DARK + ';">1. Le double nettoyage</strong>' +
                '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;margin:6px 0 0;font-size:14px;line-height:1.6;">Huile + mousse le soir pour une peau parfaitement propre sans l\u2019agresser.</p>' +
            '</div>' +
            '<div style="padding:16px 20px;background:' + BG + ';border-radius:10px;margin-bottom:12px;border-left:4px solid ' + GOLD + ';">' +
                '<strong style="color:' + DARK + ';">2. L\u2019ordre d\u2019application</strong>' +
                '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;margin:6px 0 0;font-size:14px;line-height:1.6;">Du plus l\u00e9ger au plus riche : s\u00e9rum \u2192 cr\u00e8me \u2192 huile. L\u2019absorption est maximale.</p>' +
            '</div>' +
            '<div style="padding:16px 20px;background:' + BG + ';border-radius:10px;margin-bottom:12px;border-left:4px solid ' + GOLD + ';">' +
                '<strong style="color:' + DARK + ';">3. SPF chaque matin</strong>' +
                '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;margin:6px 0 0;font-size:14px;line-height:1.6;">M\u00eame en hiver ! Les UV causent 80% du vieillissement visible de la peau.</p>' +
            '</div>' +
        '</div>' +
        '<div style="text-align:center;margin:28px 0 8px;">' +
            '<a href="' + SITE_URL + '/pages/diagnostic.html" style="display:inline-block;background:' + GOLD + ';color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">Faire mon diagnostic beaut\u00e9 gratuit</a>' +
        '</div>';

    return {
        subject: '3 secrets pour une peau \u00e9clatante',
        html: emailWrap(body, meta.subscriber_email)
    };
}

// --- WELCOME J7 : Rappel promo + best-sellers ---
function buildWelcomeJ7(meta) {
    var body = '' +
        '<h2 style="font-family:Georgia,serif;color:' + DARK + ';font-size:22px;margin:0 0 16px;">Votre code -10% expire bient\u00f4t !</h2>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;line-height:1.8;font-size:15px;">N\u2019oubliez pas : votre code de bienvenue est toujours actif. Profitez-en avant qu\u2019il ne soit trop tard !</p>' +
        '<div style="text-align:center;margin:28px 0;padding:24px;background:' + DARK + ';border-radius:12px;">' +
            '<p style="margin:0 0 6px;font-size:12px;color:' + GOLD + ';text-transform:uppercase;letter-spacing:3px;">Votre code exclusif</p>' +
            '<p style="margin:0;font-size:36px;font-weight:700;color:#fff;letter-spacing:4px;font-family:Georgia,serif;">BIENVENUE10</p>' +
            '<p style="margin:10px 0 0;font-size:14px;color:' + GOLD + ';">-10% sur votre premi\u00e8re commande</p>' +
        '</div>' +
        '<h3 style="font-family:Georgia,serif;color:' + DARK + ';font-size:18px;margin:28px 0 16px;text-align:center;">Nos best-sellers</h3>' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
            '<td width="33%" style="text-align:center;padding:8px;">' +
                '<div style="background:' + BG + ';border-radius:12px;padding:20px 10px;">' +
                    '<div style="font-size:28px;margin-bottom:8px;">&#129520;</div>' +
                    '<p style="font-size:13px;color:' + DARK + ';font-weight:600;margin:0 0 4px;">Masque LED Pro</p>' +
                    '<p style="font-size:14px;color:' + GOLD + ';font-weight:700;margin:0;">44,90 \u20ac</p>' +
                '</div>' +
            '</td>' +
            '<td width="33%" style="text-align:center;padding:8px;">' +
                '<div style="background:' + BG + ';border-radius:12px;padding:20px 10px;">' +
                    '<div style="font-size:28px;margin-bottom:8px;">&#128142;</div>' +
                    '<p style="font-size:13px;color:' + DARK + ';font-weight:600;margin:0 0 4px;">Jade Roller</p>' +
                    '<p style="font-size:14px;color:' + GOLD + ';font-weight:700;margin:0;">24,90 \u20ac</p>' +
                '</div>' +
            '</td>' +
            '<td width="33%" style="text-align:center;padding:8px;">' +
                '<div style="background:' + BG + ';border-radius:12px;padding:20px 10px;">' +
                    '<div style="font-size:28px;margin-bottom:8px;">&#10024;</div>' +
                    '<p style="font-size:13px;color:' + DARK + ';font-weight:600;margin:0 0 4px;">S\u00e9rum Vit. C</p>' +
                    '<p style="font-size:14px;color:' + GOLD + ';font-weight:700;margin:0;">27,90 \u20ac</p>' +
                '</div>' +
            '</td>' +
        '</tr></table>' +
        '<div style="text-align:center;margin:28px 0 8px;">' +
            '<a href="' + SITE_URL + '#produits" style="display:inline-block;background:' + DARK + ';color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">D\u00e9couvrir la boutique</a>' +
        '</div>';

    return {
        subject: 'Votre code -10% expire bient\u00f4t !',
        html: emailWrap(body, meta.subscriber_email)
    };
}

// --- REVIEW REQUEST J+7 ---
function buildReviewRequest(meta) {
    var productName = meta.product_name || 'votre produit';
    var productId = meta.product_id;
    var reviewUrl = SITE_URL + '/pages/product.html' + (productId ? '?id=' + productId + '#ppReviews' : '#ppReviews');

    var body = '' +
        '<h2 style="font-family:Georgia,serif;color:' + DARK + ';font-size:22px;margin:0 0 16px;">Comment trouvez-vous ' + escapeHtml(productName) + ' ?</h2>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;line-height:1.8;font-size:15px;">Vous avez re\u00e7u <strong>' + escapeHtml(productName) + '</strong> il y a une semaine. Votre avis est pr\u00e9cieux pour nous et pour la communaut\u00e9 !</p>' +
        '<div style="text-align:center;margin:24px 0;padding:20px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">' +
            '<div style="font-size:16px;color:#16a34a;font-weight:600;">+15 \u00c9clats pour votre avis</div>' +
            '<div style="font-size:13px;color:#16a34a;margin-top:4px;">+10 \u00c9clats bonus avec une photo</div>' +
        '</div>' +
        '<div style="text-align:center;margin:28px 0 8px;">' +
            '<a href="' + reviewUrl + '" style="display:inline-block;background:' + GOLD + ';color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">Laisser mon avis</a>' +
        '</div>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#9ca3af;font-size:13px;text-align:center;margin-top:16px;">Cela ne prend que 2 minutes et aide les autres clientes \u00e0 faire leur choix.</p>';

    return {
        subject: 'Comment trouvez-vous ' + productName + ' ? (+15 \u00c9clats)',
        html: emailWrap(body)
    };
}

// --- BIRTHDAY -15% ---
function buildBirthday(meta) {
    var name = meta.full_name || '';
    var firstName = name.split(' ')[0] || '';
    var promoCode = meta.promo_code || 'ANNIV15';
    var eclats = meta.eclats || 0;

    var body = '' +
        '<div style="text-align:center;margin-bottom:24px;">' +
            '<div style="font-size:48px;margin-bottom:8px;">\ud83c\udf82</div>' +
            '<h2 style="font-family:Georgia,serif;color:' + DARK + ';font-size:24px;margin:0;">Joyeux anniversaire' + (firstName ? ' ' + escapeHtml(firstName) : '') + ' !</h2>' +
        '</div>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;line-height:1.8;font-size:15px;text-align:center;">Toute l\u2019\u00e9quipe \u00c9CLAT vous souhaite un merveilleux anniversaire ! Pour c\u00e9l\u00e9brer ce jour sp\u00e9cial, voici un cadeau rien que pour vous :</p>' +
        '<div style="text-align:center;margin:28px 0;padding:28px;background:linear-gradient(135deg,' + DARK + ' 0%,#1a1614 100%);border-radius:12px;">' +
            '<p style="margin:0 0 6px;font-size:12px;color:' + GOLD + ';text-transform:uppercase;letter-spacing:3px;">Votre cadeau anniversaire</p>' +
            '<p style="margin:0;font-size:40px;font-weight:700;color:#fff;letter-spacing:4px;font-family:Georgia,serif;">' + escapeHtml(promoCode) + '</p>' +
            '<p style="margin:10px 0 0;font-size:16px;color:' + GOLD + ';">-15% sur toute la boutique</p>' +
            '<p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">Valable 30 jours</p>' +
        '</div>' +
        (eclats > 0
            ? '<div style="text-align:center;padding:16px;background:' + BG + ';border-radius:10px;margin:20px 0;">' +
                '<p style="margin:0;font-size:14px;color:#6b6560;">Vous avez aussi <strong style="color:' + GOLD + ';">' + eclats + ' \u00c9clats</strong> de fid\u00e9lit\u00e9 \u00e0 utiliser !</p>' +
              '</div>'
            : '') +
        '<div style="text-align:center;margin:28px 0 8px;">' +
            '<a href="' + SITE_URL + '" style="display:inline-block;background:' + GOLD + ';color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">Se faire plaisir</a>' +
        '</div>';

    return {
        subject: 'Joyeux anniversaire' + (firstName ? ' ' + firstName : '') + ' ! -15% pour vous',
        html: emailWrap(body)
    };
}

// --- RE-ENGAGEMENT 30j ---
function buildReengagement(meta) {
    var name = meta.full_name || '';
    var firstName = name.split(' ')[0] || '';
    var displayName = firstName || 'Cher(e) client(e)';
    var eclats = meta.eclats || 0;
    var daysInactive = meta.days_inactive || 30;

    var body = '' +
        '<h2 style="font-family:Georgia,serif;color:' + DARK + ';font-size:22px;margin:0 0 16px;text-align:center;">' + escapeHtml(displayName) + ', vous nous manquez !</h2>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#6b6560;line-height:1.8;font-size:15px;text-align:center;">Cela fait ' + daysInactive + ' jours que nous ne vous avons pas vu(e). Votre programme de fid\u00e9lit\u00e9 vous attend !</p>' +
        (eclats > 0
            ? '<div style="text-align:center;margin:24px 0;padding:24px;background:linear-gradient(135deg,' + DARK + ' 0%,#1a1614 100%);border-radius:12px;">' +
                '<p style="margin:0 0 4px;font-size:12px;color:' + GOLD + ';text-transform:uppercase;letter-spacing:2px;">Votre solde \u00c9clats</p>' +
                '<p style="margin:0;font-size:42px;font-weight:700;color:#fff;font-family:Georgia,serif;">' + eclats + '</p>' +
                '<p style="margin:6px 0 0;font-size:13px;color:' + GOLD + ';">\u00c9clats de fid\u00e9lit\u00e9 \u00e0 utiliser</p>' +
              '</div>'
            : '') +
        '<div style="text-align:center;margin:24px 0;padding:20px;background:#fef3c7;border-radius:12px;border:1px solid #fde68a;">' +
            '<div style="font-size:18px;font-weight:700;color:#92400e;">Points \u00d7 2 pendant 48h</div>' +
            '<div style="font-size:13px;color:#92400e;margin-top:6px;">Chaque euro d\u00e9pens\u00e9 = 2 \u00c9clats au lieu de 1</div>' +
        '</div>' +
        '<div style="text-align:center;margin:28px 0 8px;">' +
            '<a href="' + SITE_URL + '" style="display:inline-block;background:' + DARK + ';color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">Revenir \u00e0 la boutique</a>' +
        '</div>' +
        '<p style="font-family:Inter,Arial,sans-serif;color:#9ca3af;font-size:13px;text-align:center;margin-top:16px;">Des nouveaut\u00e9s vous attendent depuis votre derni\u00e8re visite !</p>';

    return {
        subject: displayName + ', vos \u00c9clats vous attendent !',
        html: emailWrap(body)
    };
}

// ============================================================================
// EMAIL TEMPLATE WRAPPER (branding ECLAT)
// ============================================================================

function emailWrap(content, recipientEmail) {
    var unsubEmail = recipientEmail ? encodeURIComponent(recipientEmail) : 'UNSUB_EMAIL';
    var unsubUrl = SITE_URL + '/api/unsubscribe?email=' + unsubEmail;

    return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:' + BG + ';font-family:Inter,\'Helvetica Neue\',Arial,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + BG + ';">' +
    '<tr><td align="center" style="padding:32px 16px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +

    // --- HEADER : barre sombre avec logo ---
    '<tr><td style="background:' + DARK + ';padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">' +
        '<h1 style="font-family:Georgia,serif;font-size:28px;color:#fff;letter-spacing:4px;margin:0;">\u00c9CLAT</h1>' +
        '<p style="font-size:11px;color:' + GOLD + ';letter-spacing:3px;margin:6px 0 0;text-transform:uppercase;">Maison de Beaut\u00e9</p>' +
    '</td></tr>' +

    // --- BODY : fond blanc ---
    '<tr><td style="background:#fff;padding:40px 36px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">' +
        content +
    '</td></tr>' +

    // --- FOOTER : fond clair #f3efe9 ---
    '<tr><td style="background:' + FOOTER_BG + ';padding:28px 36px;border-radius:0 0 12px 12px;border:1px solid #e8e4de;border-top:0;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
        '<tr><td style="text-align:center;">' +
            '<p style="font-family:Georgia,serif;font-size:14px;color:' + GOLD + ';letter-spacing:3px;margin:0 0 12px;">\u00c9CLAT</p>' +
            '<p style="font-size:11px;color:#6b6560;margin:0 0 8px;">' +
                '<a href="' + SITE_URL + '/pages/faq.html" style="color:#6b6560;text-decoration:underline;">FAQ</a> &nbsp;\u00b7&nbsp; ' +
                '<a href="' + SITE_URL + '/pages/cgv.html" style="color:#6b6560;text-decoration:underline;">CGV</a> &nbsp;\u00b7&nbsp; ' +
                '<a href="' + SITE_URL + '/pages/confidentialite.html" style="color:#6b6560;text-decoration:underline;">RGPD</a> &nbsp;\u00b7&nbsp; ' +
                '<a href="' + SITE_URL + '/pages/contact.html" style="color:#6b6560;text-decoration:underline;">Contact</a>' +
            '</p>' +
            '<p style="font-size:11px;color:#b8b0a8;margin:8px 0 0;">' +
                '<a href="' + unsubUrl + '" style="color:#b8b0a8;text-decoration:underline;">Se d\u00e9sabonner</a>' +
            '</p>' +
        '</td></tr>' +
        '</table>' +
    '</td></tr>' +

    '</table>' +
    '</td></tr></table>' +
    '</body></html>';
}

// ============================================================================
// ENVOI EMAIL VIA RESEND
// ============================================================================

async function sendViaResend(to, subject, html) {
    if (!RESEND_KEY) {
        console.warn('[email-sequence] RESEND_API_KEY manquante — email non envoye');
        return false;
    }

    try {
        var response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_KEY
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to: to,
                subject: subject,
                html: html
            })
        });

        if (!response.ok) {
            var errBody = await response.text().catch(function() { return ''; });
            console.error('[email-sequence] Resend error:', response.status, errBody);
        }

        return response.ok;
    } catch (err) {
        console.error('[email-sequence] Resend exception:', err.message);
        return false;
    }
}

// ============================================================================
// UTILITAIRE : echapper HTML
// ============================================================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
