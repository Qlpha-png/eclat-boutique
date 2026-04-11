/**
 * /api/push-daily — Cron Vercel quotidien (9h)
 * Envoie push notifications :
 *   1. Rappel streak (ne pas perdre la série)
 *   2. Coffre quotidien (rappel d'ouverture)
 *   3. Baisse de prix wishlist
 *   4. Retour en stock (produits alertés)
 *   5. Commandes expédiées (suivi)
 *
 * Sécurisé par CRON_SECRET
 * Si web-push non disponible, skip gracieux
 *
 * ============================================================
 * SQL SCHEMA — push_subscriptions
 * ============================================================
 * CREATE TABLE push_subscriptions (
 *   id BIGSERIAL PRIMARY KEY,
 *   user_id UUID NOT NULL REFERENCES auth.users(id),
 *   endpoint TEXT NOT NULL UNIQUE,
 *   keys_p256dh TEXT NOT NULL,
 *   keys_auth TEXT NOT NULL,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * CREATE INDEX idx_push_subs_user ON push_subscriptions(user_id);
 *
 * ============================================================
 * SQL SCHEMA — profiles
 * ============================================================
 * CREATE TABLE profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id),
 *   first_name TEXT,
 *   email TEXT,
 *   streak_count INTEGER DEFAULT 0,
 *   last_checkin DATE,
 *   eclats INTEGER DEFAULT 0,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * ============================================================
 * SQL SCHEMA — orders
 * ============================================================
 * CREATE TABLE orders (
 *   id BIGSERIAL PRIMARY KEY,
 *   customer_id BIGINT REFERENCES customers(id),
 *   email TEXT,
 *   status TEXT NOT NULL DEFAULT 'pending',
 *   tracking_number TEXT,
 *   shipped_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * ============================================================
 * SQL SCHEMA — wishlists
 * ============================================================
 * CREATE TABLE wishlists (
 *   id BIGSERIAL PRIMARY KEY,
 *   customer_id BIGINT NOT NULL REFERENCES customers(id),
 *   product_id BIGINT NOT NULL REFERENCES products(id),
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(customer_id, product_id)
 * );
 *
 * ============================================================
 * SQL SCHEMA — stock_alerts
 * ============================================================
 * CREATE TABLE stock_alerts (
 *   id BIGSERIAL PRIMARY KEY,
 *   email TEXT NOT NULL,
 *   product_id BIGINT NOT NULL REFERENCES products(id),
 *   notified BOOLEAN NOT NULL DEFAULT FALSE,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   notified_at TIMESTAMPTZ,
 *   UNIQUE(email, product_id)
 * );
 * ============================================================
 */

const { getSupabase } = require('./_middleware/auth');

// Tentative de chargement web-push — skip gracieux si non disponible
var webpush = null;
try {
    webpush = require('web-push');
} catch (e) {
    console.warn('[push-daily] web-push non disponible, notifications push désactivées');
}

var CRON_SECRET = process.env.CRON_SECRET || '';
var VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
var VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
var VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:contact@maison-eclat.shop';

module.exports = async function handler(req, res) {
    // Auth cron
    if (!CRON_SECRET) {
        console.error('[push-daily] CRON_SECRET not configured');
        return res.status(500).json({ error: 'Service indisponible' });
    }
    if (req.headers.authorization !== 'Bearer ' + CRON_SECRET) {
        return res.status(403).json({ error: 'Non autorisé' });
    }
    if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

    // Si web-push pas dispo, skip gracieux
    if (!webpush) {
        return res.status(200).json({
            ok: false,
            message: 'web-push non installé. Notifications push ignorées.',
            hint: 'npm install web-push'
        });
    }

    if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
        return res.status(200).json({
            ok: false,
            message: 'VAPID keys non configurées (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)'
        });
    }

    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

    var sb = getSupabase();
    var results = {
        streak: 0,
        chest: 0,
        wishlistPriceDrop: 0,
        backInStock: 0,
        shipped: 0,
        errors: 0,
        cleaned: 0
    };

    try {
        var today = new Date().toISOString().split('T')[0];

        // ================================================================
        // 1. RAPPEL STREAK — users avec streak actif qui n'ont pas check-in aujourd'hui
        // ================================================================
        try {
            var { data: activeStreaks } = await sb
                .from('daily_rewards')
                .select('customer_id')
                .gte('streak_count', 2)
                .lt('last_claim', today)
                .limit(100);

            if (activeStreaks && activeStreaks.length > 0) {
                var streakUserIds = activeStreaks.map(function(s) { return s.customer_id; });

                var { data: streakCustomers } = await sb
                    .from('customers')
                    .select('id, auth_id')
                    .in('id', streakUserIds);

                if (streakCustomers) {
                    for (var si = 0; si < streakCustomers.length; si++) {
                        if (!streakCustomers[si].auth_id) continue;

                        // Trouver le streak count pour le message personnalisé
                        var streakData = null;
                        for (var sd = 0; sd < activeStreaks.length; sd++) {
                            if (activeStreaks[sd].customer_id === streakCustomers[si].id) {
                                streakData = activeStreaks[sd];
                                break;
                            }
                        }

                        var sent = await sendPushToUser(sb, streakCustomers[si].auth_id, {
                            title: 'Ne perdez pas votre série !',
                            body: 'Ouvrez votre coffre du jour pour maintenir votre streak et gagner des Éclats.',
                            url: '/#coffre',
                            icon: '/images/icon-192.png',
                            badge: '/images/badge-72.png',
                            tag: 'streak-reminder'
                        }, results);
                        if (sent) results.streak++;
                    }
                }
            }
        } catch (streakErr) {
            console.error('[push-daily] streak error:', streakErr.message);
            results.errors++;
        }

        // ================================================================
        // 2. COFFRE QUOTIDIEN — rappel pour les users fidèles qui n'ont pas encore ouvert
        // ================================================================
        try {
            var { data: chestEligible } = await sb
                .from('daily_rewards')
                .select('customer_id')
                .lt('last_claim', today)
                .limit(100);

            // Exclure ceux déjà notifiés pour le streak (on ne spamme pas)
            var streakNotifiedIds = {};
            if (activeStreaks) {
                for (var sn = 0; sn < activeStreaks.length; sn++) {
                    streakNotifiedIds[activeStreaks[sn].customer_id] = true;
                }
            }

            if (chestEligible && chestEligible.length > 0) {
                var chestCustIds = [];
                for (var ce = 0; ce < chestEligible.length; ce++) {
                    if (!streakNotifiedIds[chestEligible[ce].customer_id]) {
                        chestCustIds.push(chestEligible[ce].customer_id);
                    }
                }

                if (chestCustIds.length > 0) {
                    var { data: chestCustomers } = await sb
                        .from('customers')
                        .select('id, auth_id')
                        .in('id', chestCustIds);

                    if (chestCustomers) {
                        for (var ci = 0; ci < chestCustomers.length; ci++) {
                            if (!chestCustomers[ci].auth_id) continue;
                            var sent2 = await sendPushToUser(sb, chestCustomers[ci].auth_id, {
                                title: 'Votre coffre du jour vous attend !',
                                body: 'Ouvrez-le pour gagner des Éclats, des réductions ou des surprises.',
                                url: '/#coffre',
                                icon: '/images/icon-192.png',
                                badge: '/images/badge-72.png',
                                tag: 'daily-chest'
                            }, results);
                            if (sent2) results.chest++;
                        }
                    }
                }
            }
        } catch (chestErr) {
            console.error('[push-daily] chest error:', chestErr.message);
            results.errors++;
        }

        // ================================================================
        // 3. BAISSE DE PRIX WISHLIST — produits en promo dans les wishlists
        // ================================================================
        try {
            var { data: priceDropProducts } = await sb
                .from('products')
                .select('id, name, price, compare_at_price')
                .not('compare_at_price', 'is', null)
                .gt('compare_at_price', 0)
                .limit(50);

            if (priceDropProducts) {
                for (var pd = 0; pd < priceDropProducts.length; pd++) {
                    var dropProduct = priceDropProducts[pd];
                    if (dropProduct.price >= dropProduct.compare_at_price) continue;

                    var discount = Math.round((1 - dropProduct.price / dropProduct.compare_at_price) * 100);
                    if (discount < 5) continue; // Ignorer les micro-réductions

                    // Trouver les users qui ont ce produit en wishlist
                    var { data: wishUsers } = await sb
                        .from('wishlists')
                        .select('customer_id')
                        .eq('product_id', dropProduct.id)
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
                                title: '-' + discount + '% sur ' + dropProduct.name,
                                body: 'Un produit de votre wishlist est en promotion ! Ne ratez pas cette offre.',
                                url: '/pages/product.html?id=' + dropProduct.id,
                                icon: '/images/icon-192.png',
                                badge: '/images/badge-72.png',
                                tag: 'wishlist-price-drop-' + dropProduct.id
                            }, results);
                            if (sent3) results.wishlistPriceDrop++;
                        }
                    }
                }
            }
        } catch (wishErr) {
            console.error('[push-daily] wishlist price drop error:', wishErr.message);
            results.errors++;
        }

        // ================================================================
        // 4. RETOUR EN STOCK — produits alertés qui sont revenus
        // ================================================================
        try {
            var { data: stockAlerts } = await sb
                .from('stock_alerts')
                .select('id, email, product_id')
                .eq('notified', false)
                .limit(100);

            if (stockAlerts && stockAlerts.length > 0) {
                // Product IDs uniques
                var alertProductMap = {};
                for (var ap = 0; ap < stockAlerts.length; ap++) {
                    alertProductMap[stockAlerts[ap].product_id] = true;
                }
                var alertProductIds = Object.keys(alertProductMap).map(function(k) { return Number(k); });

                var { data: inStockProducts } = await sb
                    .from('products')
                    .select('id, name, stock')
                    .in('id', alertProductIds)
                    .gt('stock', 0);

                if (inStockProducts && inStockProducts.length > 0) {
                    var inStockMap = {};
                    for (var isp = 0; isp < inStockProducts.length; isp++) {
                        inStockMap[inStockProducts[isp].id] = inStockProducts[isp];
                    }

                    for (var sa = 0; sa < stockAlerts.length; sa++) {
                        var alertItem = stockAlerts[sa];
                        var stockProduct = inStockMap[alertItem.product_id];
                        if (!stockProduct) continue;

                        // Trouver le user par email pour push
                        var { data: alertCust } = await sb
                            .from('customers')
                            .select('auth_id')
                            .eq('email', alertItem.email)
                            .single();

                        if (alertCust && alertCust.auth_id) {
                            var sent4 = await sendPushToUser(sb, alertCust.auth_id, {
                                title: stockProduct.name + ' est de retour !',
                                body: 'Ce produit est à nouveau disponible. Commandez avant rupture !',
                                url: '/pages/product.html?id=' + stockProduct.id,
                                icon: '/images/icon-192.png',
                                badge: '/images/badge-72.png',
                                tag: 'back-in-stock-' + stockProduct.id
                            }, results);
                            if (sent4) results.backInStock++;
                        }
                    }
                }
            }
        } catch (stockErr) {
            console.error('[push-daily] back-in-stock error:', stockErr.message);
            results.errors++;
        }

        // ================================================================
        // 5. COMMANDES EXPÉDIÉES — notifier les clients dont la commande vient d'être expédiée
        // ================================================================
        try {
            var yesterday = new Date(Date.now() - 24 * 3600000).toISOString();
            var { data: shippedOrders } = await sb
                .from('orders')
                .select('id, customer_id, tracking_number, shipped_at')
                .eq('status', 'shipped')
                .gte('shipped_at', yesterday)
                .limit(50);

            if (shippedOrders && shippedOrders.length > 0) {
                for (var so = 0; so < shippedOrders.length; so++) {
                    var order = shippedOrders[so];
                    if (!order.customer_id) continue;

                    var { data: orderCust } = await sb
                        .from('customers')
                        .select('auth_id')
                        .eq('id', order.customer_id)
                        .single();

                    if (orderCust && orderCust.auth_id) {
                        var trackingMsg = order.tracking_number
                            ? 'Numéro de suivi : ' + order.tracking_number
                            : 'Suivez votre commande dans votre espace client.';

                        var sent5 = await sendPushToUser(sb, orderCust.auth_id, {
                            title: 'Votre commande #' + order.id + ' est expédiée !',
                            body: trackingMsg,
                            url: '/pages/account.html#commandes',
                            icon: '/images/icon-192.png',
                            badge: '/images/badge-72.png',
                            tag: 'order-shipped-' + order.id
                        }, results);
                        if (sent5) results.shipped++;
                    }
                }
            }
        } catch (orderErr) {
            console.error('[push-daily] shipped orders error:', orderErr.message);
            results.errors++;
        }

        return res.status(200).json({ ok: true, results: results });

    } catch (err) {
        console.error('[push-daily]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Envoie une push notification à un user via toutes ses subscriptions
 * Nettoie les subscriptions expirées (410/404)
 */
async function sendPushToUser(sb, userId, payload, results) {
    try {
        var { data: subs } = await sb
            .from('push_subscriptions')
            .select('endpoint, keys_p256dh, keys_auth')
            .eq('user_id', userId);

        if (!subs || subs.length === 0) return false;
        var anySent = false;

        for (var i = 0; i < subs.length; i++) {
            var subscription = {
                endpoint: subs[i].endpoint,
                keys: {
                    p256dh: subs[i].keys_p256dh,
                    auth: subs[i].keys_auth
                }
            };
            try {
                await webpush.sendNotification(subscription, JSON.stringify(payload));
                anySent = true;
            } catch (pushErr) {
                // 410 Gone ou 404 = subscription expirée, nettoyer
                if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                    await sb.from('push_subscriptions')
                        .delete()
                        .eq('endpoint', subs[i].endpoint)
                        .catch(function() {});
                    if (results) results.cleaned++;
                } else {
                    console.error('[push-daily] push error for endpoint:', subs[i].endpoint, pushErr.statusCode || pushErr.message);
                    if (results) results.errors++;
                }
            }
        }
        return anySent;
    } catch (err) {
        console.error('[push-daily] sendPushToUser error:', err.message);
        return false;
    }
}
