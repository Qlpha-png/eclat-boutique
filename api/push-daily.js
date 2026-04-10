/**
 * /api/push-daily — Cron Vercel quotidien (9h)
 * Envoie push notifications : streak, coffre, retour en stock, baisse prix wishlist
 * Sécurisé par CRON_SECRET
 */
const { getSupabase } = require('./_middleware/auth');
var webpush = require('web-push');

var CRON_SECRET = process.env.CRON_SECRET || '';
var VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
var VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
var VAPID_EMAIL = 'mailto:contact@maison-eclat.shop';

module.exports = async function handler(req, res) {
    if (req.headers.authorization !== 'Bearer ' + CRON_SECRET && CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

    if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
        return res.status(200).json({ ok: false, message: 'VAPID keys non configurées' });
    }

    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
    var sb = getSupabase();
    var results = { streak: 0, chest: 0, stock: 0, priceDrop: 0, errors: 0, cleaned: 0 };

    try {
        // 1. RAPPEL STREAK (users avec streak actif qui n'ont pas ouvert le coffre aujourd'hui)
        var today = new Date().toISOString().split('T')[0];
        var { data: activeStreaks } = await sb
            .from('daily_rewards')
            .select('customer_id')
            .gte('streak_count', 2)
            .lt('last_claim', today)
            .limit(100);

        if (activeStreaks && activeStreaks.length > 0) {
            var streakUserIds = activeStreaks.map(function(s) { return s.customer_id; });

            // Get customer auth_ids from customer_ids
            var { data: streakCustomers } = await sb
                .from('customers')
                .select('id, auth_id')
                .in('id', streakUserIds);

            if (streakCustomers) {
                var authIds = streakCustomers.map(function(c) { return c.auth_id; }).filter(Boolean);
                for (var si = 0; si < authIds.length; si++) {
                    var sent = await sendPushToUser(sb, authIds[si], {
                        title: 'Votre coffre du jour vous attend !',
                        body: 'Ne perdez pas votre série ! Ouvrez le coffre pour gagner des Éclats.',
                        url: '/#coffre',
                        icon: '/images/icon-192.png'
                    });
                    if (sent) results.streak++; else results.errors++;
                }
            }
        }

        // 2. ALERTES RETOUR EN STOCK
        var { data: stockAlerts } = await sb
            .from('stock_alerts')
            .select('email, product_id')
            .eq('notified', false)
            .limit(50);

        if (stockAlerts && stockAlerts.length > 0) {
            var productIds = stockAlerts.map(function(a) { return a.product_id; });
            var uniqueProductIds = productIds.filter(function(v, i, s) { return s.indexOf(v) === i; });

            var { data: inventory } = await sb
                .from('inventory')
                .select('product_id, quantity')
                .in('product_id', uniqueProductIds)
                .gt('quantity', 0);

            if (inventory) {
                var inStockIds = inventory.map(function(inv) { return inv.product_id; });

                for (var sa = 0; sa < stockAlerts.length; sa++) {
                    if (inStockIds.indexOf(stockAlerts[sa].product_id) !== -1) {
                        // Get product name
                        var { data: prod } = await sb
                            .from('products')
                            .select('name')
                            .eq('id', stockAlerts[sa].product_id)
                            .single();

                        var prodName = prod ? prod.name : 'Un produit';

                        // Find user by email and send push
                        var { data: alertCust } = await sb
                            .from('customers')
                            .select('auth_id')
                            .eq('email', stockAlerts[sa].email)
                            .single();

                        if (alertCust && alertCust.auth_id) {
                            var sent2 = await sendPushToUser(sb, alertCust.auth_id, {
                                title: prodName + ' est de retour !',
                                body: 'Bonne nouvelle ! Ce produit est à nouveau disponible.',
                                url: '/pages/product.html?id=' + stockAlerts[sa].product_id,
                                icon: '/images/icon-192.png'
                            });
                            if (sent2) results.stock++;
                        }

                        // Mark as notified
                        await sb.from('stock_alerts')
                            .update({ notified: true })
                            .eq('email', stockAlerts[sa].email)
                            .eq('product_id', stockAlerts[sa].product_id);
                    }
                }
            }
        }

        // 3. BAISSE DE PRIX WISHLIST
        var { data: priceDrops } = await sb
            .from('products')
            .select('id, name, price, compare_at_price')
            .not('compare_at_price', 'is', null)
            .gt('compare_at_price', 0)
            .limit(50);

        if (priceDrops) {
            for (var pd = 0; pd < priceDrops.length; pd++) {
                var product = priceDrops[pd];
                if (product.price >= product.compare_at_price) continue;

                var discount = Math.round((1 - product.price / product.compare_at_price) * 100);

                // Find users with this in wishlist
                var { data: wishUsers } = await sb
                    .from('wishlists')
                    .select('customer_id')
                    .eq('product_id', product.id)
                    .limit(50);

                if (!wishUsers || wishUsers.length === 0) continue;

                var wishCustIds = wishUsers.map(function(w) { return w.customer_id; });
                var { data: wishCustomers } = await sb
                    .from('customers')
                    .select('id, auth_id')
                    .in('id', wishCustIds);

                if (wishCustomers) {
                    for (var wc = 0; wc < wishCustomers.length; wc++) {
                        if (!wishCustomers[wc].auth_id) continue;
                        var sent3 = await sendPushToUser(sb, wishCustomers[wc].auth_id, {
                            title: '-' + discount + '% sur ' + product.name,
                            body: 'Un produit de votre wishlist est en promo !',
                            url: '/pages/product.html?id=' + product.id,
                            icon: '/images/icon-192.png'
                        });
                        if (sent3) results.priceDrop++;
                    }
                }
            }
        }

        return res.status(200).json({ ok: true, results: results });
    } catch (err) {
        console.error('[push-daily]', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Envoie une push notification à un user via toutes ses subscriptions
 */
async function sendPushToUser(sb, userId, payload) {
    var { data: subs } = await sb
        .from('push_subscriptions')
        .select('endpoint, keys_p256dh, keys_auth')
        .eq('user_id', userId);

    if (!subs || subs.length === 0) return false;
    var anySent = false;

    for (var i = 0; i < subs.length; i++) {
        var subscription = {
            endpoint: subs[i].endpoint,
            keys: { p256dh: subs[i].keys_p256dh, auth: subs[i].keys_auth }
        };
        try {
            await webpush.sendNotification(subscription, JSON.stringify(payload));
            anySent = true;
        } catch (err) {
            // 410 Gone = subscription expired, clean up
            if (err.statusCode === 410 || err.statusCode === 404) {
                await sb.from('push_subscriptions').delete().eq('endpoint', subs[i].endpoint).catch(function() {});
            }
        }
    }
    return anySent;
}
