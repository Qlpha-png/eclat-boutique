/**
 * /api/email-sequence — Cron Vercel (toutes les heures)
 * Traite les séquences email : bienvenue, review request, anniversaire, ré-engagement
 * Sécurisé par CRON_SECRET
 */
const { getSupabase } = require('./_middleware/auth');

var RESEND_KEY = process.env.RESEND_API_KEY || '';
var CRON_SECRET = process.env.CRON_SECRET || '';
var EMAIL_FROM = 'ÉCLAT Beauté <contact@maison-eclat.shop>';
var SITE_URL = 'https://maison-eclat.shop';

module.exports = async function handler(req, res) {
    // Vérifier auth cron
    if (req.headers.authorization !== 'Bearer ' + CRON_SECRET && CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

    var sb = getSupabase();
    var results = { welcome: 0, reviewRequest: 0, birthday: 0, reengagement: 0, errors: 0 };

    try {
        // 1. SÉQUENCE BIENVENUE (signup J0/J3/J7)
        var { data: sequences } = await sb
            .from('email_sequences')
            .select('*')
            .eq('trigger_event', 'signup')
            .eq('active', true)
            .order('delay_hours');

        if (sequences && sequences.length > 0) {
            // Trouver les clients inscrits récemment sans email envoyé
            var { data: recentCustomers } = await sb
                .from('customers')
                .select('id, email, first_name, created_at')
                .gte('created_at', new Date(Date.now() - 8 * 24 * 3600000).toISOString())
                .limit(50);

            for (var i = 0; recentCustomers && i < recentCustomers.length; i++) {
                var cust = recentCustomers[i];
                var hoursAgo = (Date.now() - new Date(cust.created_at).getTime()) / 3600000;

                for (var s = 0; s < sequences.length; s++) {
                    var seq = sequences[s];
                    if (hoursAgo >= seq.delay_hours && hoursAgo < seq.delay_hours + 2) {
                        // Check si déjà envoyé
                        var { data: sent } = await sb
                            .from('email_log')
                            .select('id')
                            .eq('customer_id', cust.id)
                            .eq('template', seq.template)
                            .limit(1);

                        if (!sent || sent.length === 0) {
                            var ok = await sendEmail(cust.email, seq.subject, getTemplate(seq.template, cust));
                            if (ok) {
                                await logEmail(sb, cust.id, seq.template);
                                results.welcome++;
                            } else { results.errors++; }
                        }
                    }
                }
            }
        }

        // 2. REVIEW REQUEST (J+7 après commande)
        var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString();
        var eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600000).toISOString();
        var { data: recentOrders } = await sb
            .from('orders')
            .select('id, customer_id, email, created_at')
            .gte('created_at', eightDaysAgo)
            .lte('created_at', sevenDaysAgo)
            .in('status', ['confirmed', 'shipped', 'delivered'])
            .limit(50);

        for (var o = 0; recentOrders && o < recentOrders.length; o++) {
            var order = recentOrders[o];
            if (!order.customer_id) continue;

            var { data: alreadySent } = await sb
                .from('email_log')
                .select('id')
                .eq('customer_id', order.customer_id)
                .eq('template', 'review_request_' + order.id)
                .limit(1);

            if (!alreadySent || alreadySent.length === 0) {
                var { data: items } = await sb
                    .from('order_items')
                    .select('product_name, product_id')
                    .eq('order_id', order.id)
                    .limit(3);

                var productName = items && items[0] ? items[0].product_name : 'votre produit';
                var productId = items && items[0] ? items[0].product_id : 1;

                var ok2 = await sendEmail(order.email,
                    'Comment trouvez-vous ' + productName + ' ? (+15 Éclats)',
                    getReviewRequestTemplate(productName, productId));
                if (ok2) {
                    await logEmail(sb, order.customer_id, 'review_request_' + order.id);
                    results.reviewRequest++;
                } else { results.errors++; }
            }
        }

        // 3. ANNIVERSAIRE
        var today = new Date();
        var monthDay = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        var { data: birthdayCustomers } = await sb
            .from('customers')
            .select('id, email, first_name, birthday')
            .not('birthday', 'is', null)
            .limit(200);

        for (var b = 0; birthdayCustomers && b < birthdayCustomers.length; b++) {
            var bc = birthdayCustomers[b];
            if (!bc.birthday) continue;
            var bdParts = bc.birthday.split('-');
            var bdMonthDay = bdParts[1] + '-' + bdParts[2];
            if (bdMonthDay !== monthDay) continue;

            var yearKey = 'birthday_' + today.getFullYear();
            var { data: bSent } = await sb
                .from('email_log')
                .select('id')
                .eq('customer_id', bc.id)
                .eq('template', yearKey)
                .limit(1);

            if (!bSent || bSent.length === 0) {
                var ok3 = await sendEmail(bc.email,
                    'Joyeux anniversaire ' + (bc.first_name || '') + ' ! -15% pour vous',
                    getBirthdayTemplate(bc.first_name));
                if (ok3) {
                    await logEmail(sb, bc.id, yearKey);
                    results.birthday++;
                } else { results.errors++; }
            }
        }

        // 4. RÉ-ENGAGEMENT (30j inactif)
        var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();
        var thirtyOneDaysAgo = new Date(Date.now() - 31 * 24 * 3600000).toISOString();
        var { data: inactiveCustomers } = await sb
            .from('customers')
            .select('id, email, first_name')
            .lte('last_login', thirtyDaysAgo)
            .gte('last_login', thirtyOneDaysAgo)
            .limit(30);

        for (var r = 0; inactiveCustomers && r < inactiveCustomers.length; r++) {
            var ic = inactiveCustomers[r];
            var { data: rSent } = await sb
                .from('email_log')
                .select('id')
                .eq('customer_id', ic.id)
                .eq('template', 'reengagement_30d')
                .gte('created_at', thirtyDaysAgo)
                .limit(1);

            if (!rSent || rSent.length === 0) {
                var ok4 = await sendEmail(ic.email,
                    (ic.first_name || 'Cher(e) client(e)') + ', vos Éclats vous attendent !',
                    getReengagementTemplate(ic.first_name));
                if (ok4) {
                    await logEmail(sb, ic.id, 'reengagement_30d');
                    results.reengagement++;
                } else { results.errors++; }
            }
        }

        return res.status(200).json({ ok: true, results: results });
    } catch (err) {
        console.error('[email-sequence]', err.message);
        return res.status(500).json({ error: err.message });
    }
};

async function sendEmail(to, subject, html) {
    if (!RESEND_KEY) return false;
    try {
        var r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + RESEND_KEY },
            body: JSON.stringify({ from: EMAIL_FROM, to: to, subject: subject, html: html })
        });
        return r.ok;
    } catch(e) { return false; }
}

async function logEmail(sb, customerId, template) {
    await sb.from('email_log').insert({
        customer_id: customerId,
        template: template,
        created_at: new Date().toISOString()
    }).catch(function() {});
}

function emailWrap(content) {
    return '<!DOCTYPE html><html><body style="font-family:\'Helvetica Neue\',Arial,sans-serif;background:#faf8f5;margin:0;padding:0;">' +
        '<div style="max-width:600px;margin:0 auto;padding:32px 24px;">' +
        '<div style="text-align:center;margin-bottom:24px;"><h1 style="font-family:Georgia,serif;font-size:28px;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1></div>' +
        '<div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e4de;">' + content + '</div>' +
        '<div style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af;">' +
        '<a href="' + SITE_URL + '/api/unsubscribe?email=UNSUB" style="color:#9ca3af;">Se d\u00e9sabonner</a>' +
        '</div></div></body></html>';
}

function getTemplate(template, customer) {
    var name = customer.first_name || 'cher(e) client(e)';
    if (template === 'welcome') {
        return emailWrap(
            '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Bienvenue ' + name + ' !</h2>' +
            '<p style="color:#6b6560;line-height:1.7;">Nous sommes ravis de vous accueillir chez \u00c9CLAT.</p>' +
            '<p style="color:#6b6560;line-height:1.7;">Pour c\u00e9l\u00e9brer votre arriv\u00e9e, voici votre code de bienvenue :</p>' +
            '<div style="text-align:center;margin:24px 0;padding:20px;background:#faf8f5;border-radius:8px;">' +
            '<div style="font-size:24px;font-weight:700;color:#c9a87c;letter-spacing:3px;">BIENVENUE10</div>' +
            '<div style="font-size:14px;color:#6b6560;margin-top:4px;">-10% sur votre premi\u00e8re commande</div></div>' +
            '<a href="' + SITE_URL + '" style="display:block;text-align:center;background:#2d2926;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">D\u00e9couvrir la boutique</a>'
        );
    }
    if (template === 'education_routine') {
        return emailWrap(
            '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">3 erreurs skincare \u00e0 \u00e9viter</h2>' +
            '<p style="color:#6b6560;line-height:1.7;">Bonjour ' + name + ',</p>' +
            '<p style="color:#6b6560;line-height:1.7;">Beaucoup de personnes commettent ces erreurs dans leur routine beaut\u00e9 :</p>' +
            '<ol style="color:#6b6560;line-height:2;">' +
            '<li><strong>Ne pas nettoyer le soir</strong> \u2014 le s\u00e9bum et la pollution s\'accumulent</li>' +
            '<li><strong>Sauter le SPF</strong> \u2014 m\u00eame en hiver, les UV abiment la peau</li>' +
            '<li><strong>Trop de produits</strong> \u2014 une routine simple est plus efficace</li></ol>' +
            '<p style="color:#6b6560;line-height:1.7;">Faites notre diagnostic beaut\u00e9 gratuit pour une routine sur-mesure :</p>' +
            '<a href="' + SITE_URL + '/pages/diagnostic.html" style="display:block;text-align:center;background:#c9a87c;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Mon diagnostic gratuit</a>'
        );
    }
    if (template === 'offer_reminder') {
        return emailWrap(
            '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Votre code expire bient\u00f4t !</h2>' +
            '<p style="color:#6b6560;line-height:1.7;">Bonjour ' + name + ',</p>' +
            '<p style="color:#6b6560;line-height:1.7;">Votre code <strong>BIENVENUE10</strong> (-10%) expire dans quelques jours. Profitez-en !</p>' +
            '<a href="' + SITE_URL + '" style="display:block;text-align:center;background:#2d2926;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Utiliser mon code</a>'
        );
    }
    return emailWrap('<p>Message \u00c9CLAT</p>');
}

function getReviewRequestTemplate(productName, productId) {
    return emailWrap(
        '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Comment trouvez-vous votre produit ?</h2>' +
        '<p style="color:#6b6560;line-height:1.7;">Vous avez re\u00e7u <strong>' + productName + '</strong> il y a une semaine. Nous aimerions conna\u00eetre votre avis !</p>' +
        '<div style="text-align:center;margin:24px 0;padding:16px;background:#f0fdf4;border-radius:8px;">' +
        '<div style="font-size:14px;color:#16a34a;font-weight:600;">+15 \u00c9clats pour votre avis (+10 bonus avec photo)</div></div>' +
        '<a href="' + SITE_URL + '/pages/product.html?id=' + productId + '#ppReviews" style="display:block;text-align:center;background:#c9a87c;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Laisser mon avis</a>'
    );
}

function getBirthdayTemplate(firstName) {
    return emailWrap(
        '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">Joyeux anniversaire ' + (firstName || '') + ' ! \ud83c\udf82</h2>' +
        '<p style="color:#6b6560;line-height:1.7;">Toute l\'\u00e9quipe \u00c9CLAT vous souhaite un merveilleux anniversaire !</p>' +
        '<p style="color:#6b6560;line-height:1.7;">Pour c\u00e9l\u00e9brer, voici un code exclusif :</p>' +
        '<div style="text-align:center;margin:24px 0;padding:20px;background:#faf8f5;border-radius:8px;">' +
        '<div style="font-size:24px;font-weight:700;color:#c9a87c;letter-spacing:3px;">ANNIV15</div>' +
        '<div style="font-size:14px;color:#6b6560;margin-top:4px;">-15% sur toute la boutique \u2014 valable 30 jours</div></div>' +
        '<a href="' + SITE_URL + '" style="display:block;text-align:center;background:#2d2926;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Se faire plaisir</a>'
    );
}

function getReengagementTemplate(firstName) {
    return emailWrap(
        '<h2 style="font-family:Georgia,serif;color:#2d2926;margin-top:0;">' + (firstName || 'Cher(e) client(e)') + ', vous nous manquez !</h2>' +
        '<p style="color:#6b6560;line-height:1.7;">Cela fait un moment que nous ne vous avons pas vu(e). Vos \u00c9clats de fid\u00e9lit\u00e9 vous attendent !</p>' +
        '<p style="color:#6b6560;line-height:1.7;">Pour votre retour, profitez de <strong>points doubles</strong> pendant 48h :</p>' +
        '<div style="text-align:center;margin:24px 0;padding:20px;background:#fef3c7;border-radius:8px;">' +
        '<div style="font-size:18px;font-weight:700;color:#92400e;">Points \u00d7 2 pendant 48h</div>' +
        '<div style="font-size:14px;color:#92400e;margin-top:4px;">Chaque euro = 2 \u00c9clats au lieu de 1</div></div>' +
        '<a href="' + SITE_URL + '" style="display:block;text-align:center;background:#c9a87c;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Revenir \u00e0 la boutique</a>'
    );
}
