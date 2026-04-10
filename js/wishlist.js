(function() {
    'use strict';

    // ============================
    // ECLAT Beaute — Wishlist
    // Guest: localStorage | Auth: Supabase /api/wishlist sync
    // ============================

    var STORAGE_KEY = 'eclat_wishlist';

    // ---- localStorage helpers ----

    function getLocal() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveLocal(ids) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (e) { /* quota exceeded — silent */ }
    }

    // ---- Auth helpers ----

    function getAuthToken() {
        try {
            var session = JSON.parse(localStorage.getItem('sb-session'));
            return (session && session.access_token) ? session.access_token : null;
        } catch (e) {
            return null;
        }
    }

    function authHeaders() {
        var token = getAuthToken();
        if (!token) return null;
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    }

    // ---- Supabase API (best-effort, non-blocking) ----

    function apiGet() {
        var headers = authHeaders();
        if (!headers) return Promise.resolve(null);
        return fetch('/api/wishlist', {
            method: 'GET',
            headers: headers
        }).then(function(r) {
            return r.ok ? r.json() : null;
        }).catch(function() {
            return null;
        });
    }

    function apiPost(productId) {
        var headers = authHeaders();
        if (!headers) return;
        fetch('/api/wishlist', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ productId: productId })
        }).catch(function() {});
    }

    function apiDelete(productId) {
        var headers = authHeaders();
        if (!headers) return;
        fetch('/api/wishlist', {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({ productId: productId })
        }).catch(function() {});
    }

    function apiBulkPost(ids) {
        var headers = authHeaders();
        if (!headers) return;
        fetch('/api/wishlist', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ productIds: ids, bulk: true })
        }).catch(function() {});
    }

    // ---- UI helpers ----

    function dispatchChange() {
        var evt;
        try {
            evt = new CustomEvent('eclat:wishlist:change', {
                detail: { items: getLocal(), count: getLocal().length }
            });
        } catch (e) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent('eclat:wishlist:change', true, true, {
                items: getLocal(),
                count: getLocal().length
            });
        }
        document.dispatchEvent(evt);
    }

    function updateHeartIcons() {
        var hearts = document.querySelectorAll('.wishlist-heart[data-product-id]');
        for (var i = 0; i < hearts.length; i++) {
            var pid = hearts[i].getAttribute('data-product-id');
            if (Wishlist.has(pid)) {
                hearts[i].classList.add('active');
            } else {
                hearts[i].classList.remove('active');
            }
        }
    }

    function updateBadge() {
        var badge = document.getElementById('wishlistCount');
        if (!badge) return;
        var c = Wishlist.getCount();
        badge.textContent = c > 0 ? c : '';
        badge.style.display = c > 0 ? 'inline-flex' : 'none';
    }

    function showToast(msg) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg);
            return;
        }
        var el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
            'background:#2d2926;color:#fff;padding:10px 24px;border-radius:8px;' +
            'font-size:0.85rem;z-index:99999;opacity:0;transition:opacity 0.3s;';
        document.body.appendChild(el);
        requestAnimationFrame(function() { el.style.opacity = '1'; });
        setTimeout(function() {
            el.style.opacity = '0';
            setTimeout(function() { el.remove(); }, 300);
        }, 2500);
    }

    // ---- Core Wishlist object ----

    var Wishlist = {

        toggle: function(productId) {
            productId = String(productId);
            var ids = getLocal();
            var idx = ids.indexOf(productId);
            var added;

            if (idx === -1) {
                ids.push(productId);
                added = true;
                apiPost(productId);
                showToast('Ajout\u00e9 aux favoris \u2764');
            } else {
                ids.splice(idx, 1);
                added = false;
                apiDelete(productId);
                showToast('Retir\u00e9 des favoris');
            }

            saveLocal(ids);
            updateHeartIcons();
            updateBadge();
            dispatchChange();
            return added;
        },

        has: function(productId) {
            return getLocal().indexOf(String(productId)) !== -1;
        },

        getAll: function() {
            return getLocal();
        },

        getCount: function() {
            return getLocal().length;
        },

        sync: function() {
            // Merge localStorage wishlist into server on login
            var localIds = getLocal();
            return apiGet().then(function(data) {
                var serverIds = [];
                if (data && data.items && data.items.length > 0) {
                    for (var i = 0; i < data.items.length; i++) {
                        serverIds.push(String(data.items[i].product_id));
                    }
                }

                // Union merge: local + server, deduplicated
                var merged = localIds.slice();
                for (var j = 0; j < serverIds.length; j++) {
                    if (merged.indexOf(serverIds[j]) === -1) {
                        merged.push(serverIds[j]);
                    }
                }

                saveLocal(merged);

                // Push the full merged set back to server
                if (merged.length > 0) {
                    apiBulkPost(merged);
                }

                updateHeartIcons();
                updateBadge();
                dispatchChange();

                return merged;
            }).catch(function() {
                return localIds;
            });
        },

        // Generate heart icon HTML for product cards
        heartHTML: function(productId, size) {
            size = size || 22;
            var active = Wishlist.has(productId) ? ' active' : '';
            return '<button class="wishlist-heart' + active + '" data-product-id="' + productId + '" ' +
                'onclick="event.stopPropagation();Wishlist.toggle(' + productId + ');" ' +
                'aria-label="Ajouter aux favoris" ' +
                'style="background:rgba(255,255,255,.85);border:none;border-radius:50%;width:' + (size + 12) + 'px;height:' + (size + 12) + 'px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;padding:0;">' +
                '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="#2d2926" stroke-width="2">' +
                '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' +
                '</svg></button>';
        },

        // Re-expose UI updaters for external use
        updateHearts: updateHeartIcons,
        updateBadge: updateBadge
    };

    // ---- Init ----

    function init() {
        updateHeartIcons();
        updateBadge();

        // If user is authenticated, run a sync
        if (getAuthToken()) {
            Wishlist.sync();
        }
    }

    // Expose globally
    window.Wishlist = Wishlist;

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
