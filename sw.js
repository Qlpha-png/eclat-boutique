// ============================
// ÉCLAT — Service Worker v1
// Cache-first assets, network-first API/HTML
// ============================

var CACHE_NAME = 'eclat-v23';
var PRECACHE = [
    '/',
    '/css/style.css?v=10',
    '/css/themes.css?v=2',
    '/css/mega-menu.css?v=1',
    '/css/skeleton.css?v=1',
    '/css/animations.css?v=3',
    '/js/products.js?v=2',
    '/js/cart.js?v=2',
    '/js/i18n.js?v=6',
    '/js/app.js?v=5',
    '/js/homepage.js?v=8',
    '/js/routine-builder.js?v=3',
    '/js/bundles-dynamic.js?v=3',
    '/js/smart-features.js?v=3',
    '/js/chatbot.js?v=5',
    '/js/search.js?v=2',
    '/js/animations.js',
    '/js/mega-menu.js',
    '/js/wishlist.js?v=3',
    '/js/loyalty-bar.js?v=5',
    '/js/social-proof.js?v=3',
    '/js/clean-beauty.js?v=2',
    '/js/auth.js?v=3',
    '/pages/offline.html'
];

// Install — precache app shell
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

// Activate — clean old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Fetch — stratégie par route
self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);

    // Skip non-GET
    if (event.request.method !== 'GET') return;

    // Skip API calls, Stripe, analytics, Supabase, CJ CDN, CDN libs — network only
    if (url.pathname.startsWith('/api/') ||
        url.hostname.includes('stripe.com') ||
        url.hostname.includes('google-analytics') ||
        url.hostname.includes('googletagmanager') ||
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('cjdropshipping.com') ||
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('unsplash.com')) {
        return;
    }

    // Static assets (CSS, JS, fonts, images) — cache-first
    if (url.pathname.match(/\.(css|js|woff2?|ttf|eot|png|jpe?g|gif|svg|webp|avif|ico)$/) ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(event.request).then(function(cached) {
                if (cached) return cached;
                return fetch(event.request).then(function(response) {
                    if (response && response.status === 200) {
                        var clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                }).catch(function() {
                    return new Response('', { status: 408 });
                });
            })
        );
        return;
    }

    // HTML pages — network-first, fallback cache, then offline page
    if (event.request.headers.get('accept') &&
        event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request).then(function(response) {
                if (response && response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function() {
                return caches.match(event.request).then(function(cached) {
                    return cached || caches.match('/pages/offline.html');
                });
            })
        );
        return;
    }

    // Everything else — stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            var fetchPromise = fetch(event.request).then(function(response) {
                if (response && response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function() {
                return cached;
            });
            return cached || fetchPromise;
        })
    );
});

// ============================
// Push Notifications
// ============================
self.addEventListener('push', function(event) {
    var data = { title: 'ÉCLAT Beauté', body: 'Nouvelle notification', icon: '/images/icon-192.png', badge: '/images/icon-192.png' };
    try {
        if (event.data) data = Object.assign(data, event.data.json());
    } catch(e) {}

    var options = {
        body: data.body || '',
        icon: data.icon || '/images/icon-192.png',
        badge: data.badge || '/images/icon-192.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' },
        actions: data.actions || []
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'ÉCLAT Beauté', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || '/';

    // Handle action buttons
    if (event.action === 'open') url = event.notification.data.url || '/';
    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].url.includes(self.location.origin) && 'focus' in clientList[i]) {
                    clientList[i].navigate(url);
                    return clientList[i].focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
