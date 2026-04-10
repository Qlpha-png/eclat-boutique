// ============================
// ÉCLAT — Service Worker v1
// Cache-first assets, network-first API/HTML
// ============================

var CACHE_NAME = 'eclat-v1';
var PRECACHE = [
    '/',
    '/css/style.css',
    '/css/themes.css',
    '/js/products.js',
    '/js/cart.js',
    '/js/i18n.js',
    '/js/app.js',
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

    // Skip API calls, Stripe, analytics, Supabase — network only
    if (url.pathname.startsWith('/api/') ||
        url.hostname.includes('stripe.com') ||
        url.hostname.includes('google-analytics') ||
        url.hostname.includes('googletagmanager') ||
        url.hostname.includes('supabase.co')) {
        return;
    }

    // Static assets (CSS, JS, fonts, images) — cache-first
    if (url.pathname.match(/\.(css|js|woff2?|ttf|eot|png|jpe?g|gif|svg|webp|avif|ico)$/) ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cjdropshipping.com')) {
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
