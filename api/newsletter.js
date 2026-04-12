// ============================
// ÉCLAT - Newsletter Double Opt-in (CNIL/RGPD compliant)
// Step 1: POST → save email (confirmed=false) → send confirmation email
// Step 2: GET ?action=confirm&token=TOKEN → confirm → send welcome email
// ============================

const crypto = require('crypto');
const { applyRateLimit } = require('./_middleware/rateLimit');
const { getSupabase } = require('./_middleware/auth');
const { generateUnsubToken } = require('./unsubscribe');

const SITE = 'https://maison-eclat.shop';
const GOLD = '#c9a87c';
const DARK = '#2d2926';
const BG = '#faf8f5';

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // --- GET: Confirmation link clicked ---
    if (req.method === 'GET') {
        return handleConfirmation(req, res);
    }

    // --- POST: New subscription ---
    if (req.method === 'POST') {
        if (applyRateLimit(req, res, 'contact')) return;
        return handleSubscribe(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
};

// =============================================
// POST — Step 1: Save email + send confirmation
// =============================================
async function handleSubscribe(req, res) {
    const { email, lang } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

    // Check if already confirmed subscriber
    try {
        const sb = getSupabase();
        const { data: existing } = await sb
            .from('newsletter_subscribers')
            .select('confirmed, subscribed')
            .eq('email', normalizedEmail)
            .single();

        if (existing && existing.confirmed && existing.subscribed) {
            return res.status(200).json({ success: true, message: 'Déjà inscrit(e)' });
        }

        // Generate secure confirmation token
        const confirmationToken = crypto.randomUUID();

        // Upsert: insert or update with new token
        const { error: upsertError } = await sb
            .from('newsletter_subscribers')
            .upsert({
                email: normalizedEmail,
                confirmed: false,
                subscribed: true,
                confirmation_token: confirmationToken,
                lang: lang || 'fr',
                created_at: existing ? undefined : new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });

        if (upsertError) throw upsertError;

        // Send confirmation email
        if (!resendApiKey) {
            return res.status(200).json({
                success: true,
                mode: 'no-email',
                message: 'Email enregistré (envoi désactivé — RESEND_API_KEY manquante)'
            });
        }

        const confirmUrl = `${SITE}/api/newsletter?action=confirm&token=${confirmationToken}`;
        const t = CONFIRMATION_TRANSLATIONS[lang] || CONFIRMATION_TRANSLATIONS.fr;
        const html = buildConfirmationEmail(t, confirmUrl);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'Maison Éclat <contact@maison-eclat.shop>',
                to: normalizedEmail,
                subject: t.subject,
                html
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, emailId: data.id });
        } else {
            return res.status(200).json({ success: false, error: data.message });
        }
    } catch (err) {
        console.error('[newsletter] subscribe error:', err.message);
        return res.status(200).json({ success: false, error: 'Erreur serveur' });
    }
}

// =============================================
// GET — Step 2: Confirm token + send welcome
// =============================================
async function handleConfirmation(req, res) {
    const { action, token } = req.query;

    if (action !== 'confirm' || !token) {
        return res.status(400).send(htmlPage(
            'Lien invalide',
            'Ce lien de confirmation est incomplet ou invalide.',
            false
        ));
    }

    try {
        const sb = getSupabase();

        // Find subscriber by token
        const { data: subscriber, error: findError } = await sb
            .from('newsletter_subscribers')
            .select('email, confirmed, lang')
            .eq('confirmation_token', token)
            .single();

        if (findError || !subscriber) {
            return res.status(404).send(htmlPage(
                'Lien expiré ou invalide',
                'Ce lien de confirmation n\'est plus valide. Veuillez vous réinscrire à la newsletter.',
                false
            ));
        }

        if (subscriber.confirmed) {
            // Already confirmed — redirect silently
            return res.writeHead(302, { Location: `${SITE}/?confirmed=1` }).end();
        }

        // Mark as confirmed + clear token
        const { error: updateError } = await sb
            .from('newsletter_subscribers')
            .update({
                confirmed: true,
                confirmation_token: null,
                confirmed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('confirmation_token', token);

        if (updateError) throw updateError;

        // Send the actual welcome email with coupon
        const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
        if (resendApiKey) {
            const lang = subscriber.lang || 'fr';
            const t = WELCOME_TRANSLATIONS[lang] || WELCOME_TRANSLATIONS.fr;
            const welcomeHtml = buildWelcomeEmail(t, subscriber.email);

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Maison Éclat <contact@maison-eclat.shop>',
                    to: subscriber.email,
                    subject: t.subject,
                    html: welcomeHtml
                })
            });
        }

        // Redirect to site with confirmation flag
        return res.writeHead(302, { Location: `${SITE}/?confirmed=1` }).end();

    } catch (err) {
        console.error('[newsletter] confirm error:', err.message);
        return res.status(500).send(htmlPage(
            'Erreur',
            'Une erreur est survenue lors de la confirmation. Veuillez réessayer ou contacter contact@maison-eclat.shop.',
            false
        ));
    }
}

// =============================================
// Confirmation Email Template (Step 1)
// =============================================
function buildConfirmationEmail(t, confirmUrl) {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="text-align:center;padding:32px 0 24px;">
    <h1 style="font-family:Georgia,serif;font-size:32px;color:${DARK};letter-spacing:4px;margin:0;">ECLAT</h1>
    <p style="font-size:11px;color:${GOLD};letter-spacing:3px;margin:6px 0 0;text-transform:uppercase;">Maison de Beaute</p>
</td></tr>

<!-- CONFIRMATION MESSAGE -->
<tr><td style="background:#fff;border-radius:12px;padding:48px 40px;border:1px solid #e8e4de;text-align:center;">
    <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${GOLD},#d4b88a);margin:0 auto 24px;text-align:center;line-height:64px;font-size:28px;">&#9993;</div>
    <h2 style="font-family:Georgia,serif;color:${DARK};font-size:24px;margin:0 0 16px;">${t.title}</h2>
    <p style="color:#6b6560;line-height:1.8;font-size:15px;margin:0 0 8px;">${t.intro}</p>
    <p style="color:#6b6560;line-height:1.8;font-size:14px;margin:0 0 32px;">${t.instruction}</p>
    <div style="margin:0 0 32px;">
        <a href="${confirmUrl}" style="display:inline-block;background:${DARK};color:#fff;padding:16px 48px;border-radius:30px;text-decoration:none;font-weight:600;font-size:16px;letter-spacing:0.5px;">${t.cta}</a>
    </div>
    <p style="color:#b8b0a8;font-size:12px;line-height:1.6;margin:0;">${t.fallback}</p>
    <p style="color:#b8b0a8;font-size:11px;word-break:break-all;margin:8px 0 0;"><a href="${confirmUrl}" style="color:${GOLD};">${confirmUrl}</a></p>
</td></tr>

<!-- WHAT YOU'LL GET -->
<tr><td style="text-align:center;padding:24px 40px;">
    <p style="color:#6b6560;font-size:13px;line-height:1.7;margin:0;">${t.preview}</p>
</td></tr>

<!-- FOOTER -->
<tr><td style="text-align:center;padding:16px 24px 32px;">
    <p style="font-size:12px;color:${GOLD};letter-spacing:3px;margin:0 0 8px;">ECLAT</p>
    <p style="font-size:11px;color:#b8b0a8;margin:0;">${t.footer}</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// =============================================
// Welcome Email Template (Step 2 — after confirmation)
// =============================================
function buildWelcomeEmail(t, email) {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="text-align:center;padding:32px 0 24px;">
    <h1 style="font-family:Georgia,serif;font-size:32px;color:${DARK};letter-spacing:4px;margin:0;">ECLAT</h1>
    <p style="font-size:11px;color:${GOLD};letter-spacing:3px;margin:6px 0 0;text-transform:uppercase;">Maison de Beaute</p>
</td></tr>

<!-- WELCOME -->
<tr><td style="background:#fff;border-radius:12px 12px 0 0;padding:48px 40px 32px;border:1px solid #e8e4de;border-bottom:0;">
    <h2 style="font-family:Georgia,serif;color:${DARK};font-size:24px;margin:0 0 16px;text-align:center;">${t.welcome}</h2>
    <p style="color:#6b6560;line-height:1.8;font-size:15px;text-align:center;margin:0;">${t.intro}</p>
</td></tr>

<!-- PROMO CODE -->
<tr><td style="background:linear-gradient(135deg,${DARK} 0%,#1a1614 100%);padding:36px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-size:12px;color:${GOLD};text-transform:uppercase;letter-spacing:3px;">${t.code_label}</p>
    <p style="margin:0;font-size:40px;font-weight:700;color:#fff;letter-spacing:5px;font-family:Georgia,serif;">BIENVENUE10</p>
    <p style="margin:10px 0 0;font-size:15px;color:${GOLD};">${t.code_info}</p>
    <div style="margin-top:24px;">
        <a href="${SITE}" style="display:inline-block;background:${GOLD};color:#fff;padding:14px 48px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">${t.cta_shop}</a>
    </div>
</td></tr>

<!-- BRAND STORY -->
<tr><td style="background:#fff;padding:40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${DARK};font-size:18px;margin:0 0 16px;text-align:center;">${t.story_title}</h3>
    <p style="color:#6b6560;line-height:1.8;font-size:14px;margin:0 0 16px;text-align:center;">${t.story_text}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
    <tr>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#127807;</p>
            <p style="font-size:12px;color:${DARK};font-weight:600;margin:8px 0 4px;">${t.value_1_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_1_text}</p>
        </td>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#128300;</p>
            <p style="font-size:12px;color:${DARK};font-weight:600;margin:8px 0 4px;">${t.value_2_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_2_text}</p>
        </td>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#10084;&#65039;</p>
            <p style="font-size:12px;color:${DARK};font-weight:600;margin:8px 0 4px;">${t.value_3_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_3_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- SKINCARE TIP -->
<tr><td style="background:${BG};padding:36px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="48" style="vertical-align:top;padding-right:16px;">
            <div style="width:48px;height:48px;border-radius:50%;background:${GOLD};text-align:center;line-height:48px;font-size:22px;">&#128161;</div>
        </td>
        <td style="vertical-align:top;">
            <h3 style="font-family:Georgia,serif;color:${DARK};font-size:16px;margin:0 0 10px;">${t.tip_title}</h3>
            <p style="color:#6b6560;line-height:1.8;font-size:13px;margin:0;">${t.tip_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- BESTSELLERS -->
<tr><td style="background:#fff;padding:40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${DARK};font-size:18px;margin:0 0 8px;text-align:center;">${t.bestsellers_title}</h3>
    <p style="color:#6b6560;font-size:13px;text-align:center;margin:0 0 24px;">${t.bestsellers_subtitle}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${BG};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#129520;</p>
                <p style="font-size:13px;color:${DARK};font-weight:600;margin:0 0 4px;">${t.product_1_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_1_desc}</p>
                <p style="font-size:14px;color:${GOLD};font-weight:700;margin:0;">44,90 &euro;</p>
            </div>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${BG};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#128142;</p>
                <p style="font-size:13px;color:${DARK};font-weight:600;margin:0 0 4px;">${t.product_2_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_2_desc}</p>
                <p style="font-size:14px;color:${GOLD};font-weight:700;margin:0;">24,90 &euro;</p>
            </div>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${BG};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#10024;</p>
                <p style="font-size:13px;color:${DARK};font-weight:600;margin:0 0 4px;">${t.product_3_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_3_desc}</p>
                <p style="font-size:14px;color:${GOLD};font-weight:700;margin:0;">27,90 &euro;</p>
            </div>
        </td>
    </tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
        <a href="${SITE}pages/category.html" style="display:inline-block;background:${DARK};color:#fff;padding:12px 36px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">${t.cta_products}</a>
    </div>
</td></tr>

<!-- DIAGNOSTIC CTA -->
<tr><td style="background:linear-gradient(135deg,#f8f0e8 0%,#f5ebe0 100%);padding:36px 40px;text-align:center;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${DARK};font-size:18px;margin:0 0 10px;">${t.diag_title}</h3>
    <p style="color:#6b6560;font-size:13px;line-height:1.7;margin:0 0 20px;">${t.diag_text}</p>
    <a href="${SITE}/pages/diagnostic.html" style="display:inline-block;background:${GOLD};color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">${t.diag_cta}</a>
</td></tr>

<!-- WHAT YOU'LL RECEIVE -->
<tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${DARK};font-size:16px;margin:0 0 16px;text-align:center;">${t.benefits_title}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${GOLD};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${DARK};">${t.benefit_1_title}</strong> — ${t.benefit_1_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${GOLD};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${DARK};">${t.benefit_2_title}</strong> — ${t.benefit_2_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${GOLD};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${DARK};">${t.benefit_3_title}</strong> — ${t.benefit_3_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${GOLD};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${DARK};">${t.benefit_4_title}</strong> — ${t.benefit_4_text}</p></td>
            </tr></table>
        </td>
    </tr>
    </table>
</td></tr>

<!-- SOCIAL PROOF -->
<tr><td style="background:${BG};padding:32px 40px;text-align:center;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <p style="font-family:Georgia,serif;font-style:italic;color:${DARK};font-size:15px;line-height:1.7;margin:0 0 12px;">"${t.testimonial}"</p>
    <p style="font-size:12px;color:${GOLD};margin:0;">&#9733;&#9733;&#9733;&#9733;&#9733; — ${t.testimonial_author}</p>
</td></tr>

<!-- GUARANTEES -->
<tr><td style="background:#fff;padding:32px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;border-radius:0 0 12px 12px;border-bottom:1px solid #e8e4de;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128274;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_1}</p>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128230;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_2}</p>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128260;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_3}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- FOOTER -->
<tr><td style="text-align:center;padding:32px 24px;">
    <p style="font-size:12px;color:${GOLD};letter-spacing:3px;margin:0 0 12px;">ECLAT</p>
    <p style="font-size:11px;color:#6b6560;margin:0 0 8px;">
        <a href="${SITE}/pages/faq.html" style="color:#6b6560;text-decoration:underline;">FAQ</a> &nbsp;|&nbsp;
        <a href="${SITE}/pages/cgv.html" style="color:#6b6560;text-decoration:underline;">CGV</a> &nbsp;|&nbsp;
        <a href="${SITE}/pages/confidentialite.html" style="color:#6b6560;text-decoration:underline;">RGPD</a> &nbsp;|&nbsp;
        <a href="${SITE}/pages/contact.html" style="color:#6b6560;text-decoration:underline;">Contact</a>
    </p>
    <p style="font-size:11px;color:#b8b0a8;margin:8px 0 0;">
        <a href="${SITE}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${generateUnsubToken(email)}" style="color:#b8b0a8;text-decoration:underline;">${t.unsubscribe}</a>
    </p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// =============================================
// HTML page for confirmation results (shown in browser)
// =============================================
function htmlPage(title, message, success) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} - ECLAT</title>
<style>
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f5;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.card{background:#fff;border-radius:16px;padding:48px 40px;text-align:center;max-width:480px;border:1px solid #e8e4de;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
h1{font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;margin-bottom:8px;}
h2{font-size:20px;color:${success ? '#4caf50' : '#e74c3c'};margin-bottom:16px;}
p{color:#6b6560;line-height:1.7;margin-bottom:24px;}
a{display:inline-block;background:#2d2926;color:#fff;padding:14px 32px;border-radius:30px;text-decoration:none;font-weight:600;}
a:hover{opacity:0.85;}
</style></head><body>
<div class="card">
<h1>ECLAT</h1>
<h2>${title}</h2>
<p>${message}</p>
<a href="${SITE}">Retour a la boutique</a>
</div></body></html>`;
}

// =============================================
// Translations — Confirmation Email (Step 1)
// =============================================
const CONFIRMATION_TRANSLATIONS = {
    fr: {
        subject: 'Confirmez votre inscription — Maison ÉCLAT',
        title: 'Confirmez votre inscription',
        intro: 'Confirmez votre inscription à la newsletter Maison ÉCLAT.',
        instruction: 'Cliquez sur le bouton ci-dessous pour valider votre adresse email et recevoir votre code -10%.',
        cta: 'Confirmer mon inscription',
        fallback: 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :',
        preview: 'En confirmant, vous recevrez : votre code BIENVENUE10 (-10%), des guides beauté exclusifs, des offres en avant-première et des conseils personnalisés.',
        footer: 'Si vous n\'avez pas demandé cette inscription, ignorez simplement cet email.'
    },
    en: {
        subject: 'Confirm your subscription — Maison ÉCLAT',
        title: 'Confirm your subscription',
        intro: 'Confirm your subscription to the Maison ÉCLAT newsletter.',
        instruction: 'Click the button below to validate your email address and receive your -10% code.',
        cta: 'Confirm my subscription',
        fallback: 'If the button doesn\'t work, copy this link into your browser:',
        preview: 'By confirming, you\'ll receive: your BIENVENUE10 code (-10%), exclusive beauty guides, early-access offers and personalized tips.',
        footer: 'If you didn\'t request this subscription, simply ignore this email.'
    },
    es: {
        subject: 'Confirma tu suscripción — Maison ÉCLAT',
        title: 'Confirma tu suscripción',
        intro: 'Confirma tu suscripción al newsletter de Maison ÉCLAT.',
        instruction: 'Haz clic en el botón de abajo para validar tu email y recibir tu código -10%.',
        cta: 'Confirmar mi suscripción',
        fallback: 'Si el botón no funciona, copia este enlace en tu navegador:',
        preview: 'Al confirmar, recibirás: tu código BIENVENUE10 (-10%), guías de belleza exclusivas, ofertas anticipadas y consejos personalizados.',
        footer: 'Si no solicitaste esta suscripción, simplemente ignora este email.'
    },
    de: {
        subject: 'Bestätigen Sie Ihre Anmeldung — Maison ÉCLAT',
        title: 'Bestätigen Sie Ihre Anmeldung',
        intro: 'Bestätigen Sie Ihre Anmeldung zum Maison ÉCLAT Newsletter.',
        instruction: 'Klicken Sie auf den Button unten, um Ihre E-Mail-Adresse zu bestätigen und Ihren -10% Code zu erhalten.',
        cta: 'Anmeldung bestätigen',
        fallback: 'Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:',
        preview: 'Nach der Bestätigung erhalten Sie: Ihren BIENVENUE10 Code (-10%), exklusive Beauty-Guides, Vorab-Angebote und personalisierte Tipps.',
        footer: 'Falls Sie diese Anmeldung nicht angefordert haben, ignorieren Sie diese E-Mail einfach.'
    }
};

// =============================================
// Translations — Welcome Email (Step 2)
// =============================================
const WELCOME_TRANSLATIONS = {
    fr: {
        subject: 'Bienvenue chez ÉCLAT — Votre code -10% + guide beauté offert',
        welcome: 'Bienvenue dans l\'univers ÉCLAT',
        intro: 'Vous venez de rejoindre une communauté de passionnées qui prennent soin d\'elles avec des produits sélectionnés par des experts. Merci pour votre confiance.',
        code_label: 'Votre cadeau de bienvenue',
        code_info: '-10% sur votre première commande',
        cta_shop: 'Utiliser mon code',
        story_title: 'Pourquoi ÉCLAT ?',
        story_text: 'Chez ÉCLAT, chaque produit est rigoureusement sélectionné pour son efficacité prouvée. Nous collaborons avec 16 marques de référence pour vous offrir le meilleur de la beauté, à prix accessible.',
        value_1_title: 'Transparence totale',
        value_1_text: 'Composition INCI analys\u00e9e',
        value_2_title: 'Efficacit\u00e9 prouv\u00e9e',
        value_2_text: 'S\u00e9lection rigoureuse',
        value_3_title: 'Expert sélection',
        value_3_text: '16 marques de confiance',
        tip_title: 'Conseil du jour : L\'ordre d\'application compte !',
        tip_text: 'Appliquez toujours vos soins du plus léger au plus riche : <strong>1. Nettoyant</strong> → <strong>2. Tonique</strong> → <strong>3. Sérum</strong> → <strong>4. Crème hydratante</strong> → <strong>5. SPF le matin</strong>. Cette règle simple maximise l\'absorption et l\'efficacité de chaque produit.',
        bestsellers_title: 'Nos best-sellers',
        bestsellers_subtitle: 'Les produits préférés de notre communauté',
        product_1_name: 'Masque LED Pro',
        product_1_desc: '7 couleurs thérapeutiques',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'Le duo iconique',
        product_3_name: 'Sérum Vitamine C',
        product_3_desc: 'Résultats en 21 jours',
        cta_products: 'Voir tous les produits',
        diag_title: 'Pas sûre par où commencer ?',
        diag_text: 'Répondez à 4 questions simples et recevez une routine personnalisée adaptée à votre type de peau et vos objectifs.',
        diag_cta: 'Faire mon diagnostic gratuit',
        benefits_title: 'Ce que vous allez recevoir',
        benefit_1_title: 'Guides beauté exclusifs',
        benefit_1_text: 'routines, astuces et tutoriels par type de peau',
        benefit_2_title: 'Offres en avant-première',
        benefit_2_text: 'accès aux ventes privées avant tout le monde',
        benefit_3_title: 'Nouveautés et tendances',
        benefit_3_text: 'soyez la première informée de nos lancements',
        benefit_4_title: 'Codes promo exclusifs',
        benefit_4_text: 'réductions réservées à notre communauté newsletter',
        testimonial: 'Le masque LED a transformé ma peau en 3 semaines. Je recommande ÉCLAT à toutes mes amies !',
        testimonial_author: 'Marie L., cliente vérifiée',
        guarantee_1: 'Paiement 100% sécurisé',
        guarantee_2: 'Livraison suivie en Europe',
        guarantee_3: 'R\u00e9tractation 14 jours',
        unsubscribe: 'Se désabonner'
    },
    en: {
        subject: 'Welcome to ÉCLAT — Your -10% code + free beauty guide',
        welcome: 'Welcome to the ÉCLAT universe',
        intro: 'You\'ve just joined a community of beauty enthusiasts who trust expertly curated products. Thank you for being here.',
        code_label: 'Your welcome gift',
        code_info: '-10% on your first order',
        cta_shop: 'Use my code',
        story_title: 'Why ÉCLAT?',
        story_text: 'At ÉCLAT, every product is rigorously selected for proven effectiveness. We partner with 16 trusted brands to bring you the best in beauty, at accessible prices.',
        value_1_title: 'Full transparency',
        value_1_text: 'INCI composition analyzed',
        value_2_title: 'Proven results',
        value_2_text: 'Rigorous selection',
        value_3_title: 'Expert curation',
        value_3_text: '16 trusted brands',
        tip_title: 'Today\'s tip: Application order matters!',
        tip_text: 'Always apply skincare from lightest to richest: <strong>1. Cleanser</strong> → <strong>2. Toner</strong> → <strong>3. Serum</strong> → <strong>4. Moisturizer</strong> → <strong>5. SPF in the morning</strong>. This simple rule maximizes absorption and effectiveness.',
        bestsellers_title: 'Our best-sellers',
        bestsellers_subtitle: 'Our community\'s favorite products',
        product_1_name: 'LED Mask Pro',
        product_1_desc: '7 therapeutic colours',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'The iconic duo',
        product_3_name: 'Vitamin C Serum',
        product_3_desc: 'Results in 21 days',
        cta_products: 'See all products',
        diag_title: 'Not sure where to start?',
        diag_text: 'Answer 4 simple questions and receive a personalized routine tailored to your skin type and goals.',
        diag_cta: 'Take my free diagnostic',
        benefits_title: 'What you\'ll receive',
        benefit_1_title: 'Exclusive beauty guides',
        benefit_1_text: 'routines, tips and tutorials by skin type',
        benefit_2_title: 'Early-access offers',
        benefit_2_text: 'access private sales before everyone',
        benefit_3_title: 'New launches & trends',
        benefit_3_text: 'be the first to know about new products',
        benefit_4_title: 'Exclusive promo codes',
        benefit_4_text: 'discounts reserved for our newsletter community',
        testimonial: 'The LED mask transformed my skin in 3 weeks. I recommend ÉCLAT to all my friends!',
        testimonial_author: 'Marie L., verified customer',
        guarantee_1: '100% secure payment',
        guarantee_2: 'Tracked delivery in Europe',
        guarantee_3: '14-day withdrawal right',
        unsubscribe: 'Unsubscribe'
    },
    es: {
        subject: 'Bienvenido/a a ÉCLAT — Tu código -10% + guía de belleza',
        welcome: 'Bienvenido/a al universo ÉCLAT',
        intro: 'Te has unido a una comunidad de apasionadas de la belleza que confían en productos seleccionados por expertos. Gracias por tu confianza.',
        code_label: 'Tu regalo de bienvenida',
        code_info: '-10% en tu primer pedido',
        cta_shop: 'Usar mi código',
        story_title: '¿Por qué ÉCLAT?',
        story_text: 'En ÉCLAT, cada producto es rigurosamente seleccionado por su eficacia probada. Colaboramos con 16 marcas de referencia para ofrecerte lo mejor en belleza, a precios accesibles.',
        value_1_title: 'Transparencia total',
        value_1_text: 'Composici\u00f3n INCI analizada',
        value_2_title: 'Eficacia probada',
        value_2_text: 'Selecci\u00f3n rigurosa',
        value_3_title: 'Selección experta',
        value_3_text: '16 marcas de confianza',
        tip_title: 'Consejo del día: ¡El orden importa!',
        tip_text: 'Aplica siempre tus productos del más ligero al más rico: <strong>1. Limpiador</strong> → <strong>2. Tónico</strong> → <strong>3. Sérum</strong> → <strong>4. Crema hidratante</strong> → <strong>5. SPF por la mañana</strong>.',
        bestsellers_title: 'Nuestros más vendidos',
        bestsellers_subtitle: 'Los favoritos de nuestra comunidad',
        product_1_name: 'Mascarilla LED Pro',
        product_1_desc: '7 colores terapéuticos',
        product_2_name: 'Jade Roller y Gua Sha',
        product_2_desc: 'El dúo icónico',
        product_3_name: 'Sérum Vitamina C',
        product_3_desc: 'Resultados en 21 días',
        cta_products: 'Ver todos los productos',
        diag_title: '¿No sabes por dónde empezar?',
        diag_text: 'Responde 4 preguntas simples y recibe una rutina personalizada para tu tipo de piel.',
        diag_cta: 'Hacer mi diagnóstico gratis',
        benefits_title: 'Lo que recibirás',
        benefit_1_title: 'Guías de belleza exclusivas',
        benefit_1_text: 'rutinas, trucos y tutoriales por tipo de piel',
        benefit_2_title: 'Ofertas en primicia',
        benefit_2_text: 'acceso a ventas privadas antes que nadie',
        benefit_3_title: 'Novedades y tendencias',
        benefit_3_text: 'sé la primera en conocer nuestros lanzamientos',
        benefit_4_title: 'Códigos promo exclusivos',
        benefit_4_text: 'descuentos reservados a nuestra comunidad',
        testimonial: 'La mascarilla LED transformó mi piel en 3 semanas. ¡Recomiendo ÉCLAT a todas mis amigas!',
        testimonial_author: 'Marie L., clienta verificada',
        guarantee_1: 'Pago 100% seguro',
        guarantee_2: 'Envío con seguimiento',
        guarantee_3: 'Desistimiento 14 d\u00edas',
        unsubscribe: 'Darse de baja'
    },
    de: {
        subject: 'Willkommen bei ÉCLAT — Ihr -10% Code + Beauty-Guide',
        welcome: 'Willkommen im ÉCLAT-Universum',
        intro: 'Sie sind einer Community von Beauty-Begeisterten beigetreten, die auf von Experten ausgewählte Produkte vertrauen. Danke für Ihr Vertrauen.',
        code_label: 'Ihr Willkommensgeschenk',
        code_info: '-10% auf Ihre erste Bestellung',
        cta_shop: 'Code einlösen',
        story_title: 'Warum ÉCLAT?',
        story_text: 'Bei ÉCLAT wird jedes Produkt sorgfältig auf nachgewiesene Wirksamkeit geprüft. Wir arbeiten mit 16 Referenzmarken zusammen, um Ihnen das Beste der Beauty-Welt zu bieten.',
        value_1_title: 'Volle Transparenz',
        value_1_text: 'INCI-Zusammensetzung analysiert',
        value_2_title: 'Bewiesene Wirkung',
        value_2_text: 'Strenge Auswahl',
        value_3_title: 'Experten-Auswahl',
        value_3_text: '16 vertrauenswürdige Marken',
        tip_title: 'Tipp des Tages: Die Reihenfolge zählt!',
        tip_text: 'Tragen Sie Pflege immer vom Leichtesten zum Reichhaltigsten auf: <strong>1. Reinigung</strong> → <strong>2. Toner</strong> → <strong>3. Serum</strong> → <strong>4. Feuchtigkeitscreme</strong> → <strong>5. SPF am Morgen</strong>.',
        bestsellers_title: 'Unsere Bestseller',
        bestsellers_subtitle: 'Die Lieblingsprodukte unserer Community',
        product_1_name: 'LED-Maske Pro',
        product_1_desc: '7 therapeutische Farben',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'Das ikonische Duo',
        product_3_name: 'Vitamin C Serum',
        product_3_desc: 'Ergebnisse in 21 Tagen',
        cta_products: 'Alle Produkte sehen',
        diag_title: 'Nicht sicher, wo Sie anfangen sollen?',
        diag_text: 'Beantworten Sie 4 einfache Fragen und erhalten Sie eine personalisierte Routine für Ihren Hauttyp.',
        diag_cta: 'Kostenlose Hautdiagnose',
        benefits_title: 'Was Sie erhalten werden',
        benefit_1_title: 'Exklusive Beauty-Guides',
        benefit_1_text: 'Routinen, Tipps und Tutorials nach Hauttyp',
        benefit_2_title: 'Vorab-Angebote',
        benefit_2_text: 'Zugang zu Private Sales vor allen anderen',
        benefit_3_title: 'Neuheiten & Trends',
        benefit_3_text: 'erfahren Sie als Erste von unseren Launches',
        benefit_4_title: 'Exklusive Promo-Codes',
        benefit_4_text: 'Rabatte nur für unsere Newsletter-Community',
        testimonial: 'Die LED-Maske hat meine Haut in 3 Wochen verwandelt. Ich empfehle ÉCLAT all meinen Freundinnen!',
        testimonial_author: 'Marie L., verifizierte Kundin',
        guarantee_1: '100% sichere Zahlung',
        guarantee_2: 'Verfolgter Versand in Europa',
        guarantee_3: '14 Tage Widerrufsrecht',
        unsubscribe: 'Abbestellen'
    }
};
