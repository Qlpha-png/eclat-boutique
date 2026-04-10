// ============================
// ÉCLAT — Wishlist (localStorage + Supabase sync)
// ============================
var Wishlist = (function() {
    'use strict';

    var STORAGE_KEY = 'eclat_wishlist';
    var listeners = [];

    function getLocal() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch(e) { return []; }
    }

    function saveLocal(ids) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch(e) {}
        notifyListeners();
    }

    function notifyListeners() {
        var ids = getLocal();
        for (var i = 0; i < listeners.length; i++) {
            try { listeners[i](ids); } catch(e) {}
        }
    }

    function onChange(fn) { listeners.push(fn); }

    function has(productId) {
        return getLocal().indexOf(Number(productId)) !== -1;
    }

    function toggle(productId) {
        productId = Number(productId);
        var ids = getLocal();
        var idx = ids.indexOf(productId);
        if (idx === -1) {
            ids.push(productId);
            syncAdd(productId);
        } else {
            ids.splice(idx, 1);
            syncRemove(productId);
        }
        saveLocal(ids);
        return idx === -1; // true = added
    }

    function getAll() { return getLocal(); }

    function count() { return getLocal().length; }

    // Supabase sync (best-effort, non-blocking)
    function getAuthToken() {
        try {
            var session = JSON.parse(localStorage.getItem('sb-session'));
            return session && session.access_token ? session.access_token : null;
        } catch(e) { return null; }
    }

    function syncAdd(productId) {
        var token = getAuthToken();
        if (!token) return;
        fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ productId: productId })
        }).catch(function() {});
    }

    function syncRemove(productId) {
        var token = getAuthToken();
        if (!token) return;
        fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ productId: productId })
        }).catch(function() {});
    }

    // Sync localStorage → Supabase au login
    function syncToServer() {
        var token = getAuthToken();
        if (!token) return;
        var ids = getLocal();
        if (ids.length === 0) return;
        fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ productIds: ids, bulk: true })
        }).catch(function() {});
    }

    // Load from server (on login)
    function syncFromServer() {
        var token = getAuthToken();
        if (!token) return;
        fetch('/api/wishlist', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function(data) {
            if (data && data.items && data.items.length > 0) {
                var local = getLocal();
                var serverIds = data.items.map(function(item) { return item.product_id; });
                // Merge: union of local + server
                var merged = local.slice();
                for (var i = 0; i < serverIds.length; i++) {
                    if (merged.indexOf(serverIds[i]) === -1) merged.push(serverIds[i]);
                }
                saveLocal(merged);
                // Push merged back to server
                if (merged.length > local.length) syncToServer();
            }
        })
        .catch(function() {});
    }

    // Render heart button HTML
    function heartHTML(productId, size) {
        size = size || 20;
        var filled = has(productId);
        return '<button class="wishlist-heart' + (filled ? ' active' : '') + '" data-wishlist-id="' + productId + '" ' +
            'onclick="event.stopPropagation();event.preventDefault();Wishlist.toggle(' + productId + ');Wishlist.updateHearts();" ' +
            'aria-label="' + (filled ? 'Retirer des favoris' : 'Ajouter aux favoris') + '" ' +
            'style="background:none;border:none;cursor:pointer;padding:4px;font-size:' + size + 'px;line-height:1;transition:transform 0.2s;">' +
            (filled ? '\u2764\uFE0F' : '\uD83E\uDD0D') +
            '</button>';
    }

    // Update all hearts on page
    function updateHearts() {
        var hearts = document.querySelectorAll('[data-wishlist-id]');
        for (var i = 0; i < hearts.length; i++) {
            var id = Number(hearts[i].getAttribute('data-wishlist-id'));
            var filled = has(id);
            hearts[i].classList.toggle('active', filled);
            hearts[i].innerHTML = filled ? '\u2764\uFE0F' : '\uD83E\uDD0D';
            hearts[i].setAttribute('aria-label', filled ? 'Retirer des favoris' : 'Ajouter aux favoris');
            // Pop animation
            hearts[i].style.transform = 'scale(1.3)';
            (function(el) {
                setTimeout(function() { el.style.transform = 'scale(1)'; }, 200);
            })(hearts[i]);
        }
        updateBadge();
    }

    // Update navbar badge
    function updateBadge() {
        var badge = document.getElementById('wishlistBadge');
        if (badge) {
            var c = count();
            badge.textContent = c;
            badge.style.display = c > 0 ? 'flex' : 'none';
        }
    }

    // Init
    function init() {
        updateBadge();
        // Sync from server if logged in
        if (getAuthToken()) {
            syncFromServer();
        }
    }

    return {
        toggle: toggle,
        has: has,
        getAll: getAll,
        count: count,
        heartHTML: heartHTML,
        updateHearts: updateHearts,
        updateBadge: updateBadge,
        onChange: onChange,
        syncToServer: syncToServer,
        syncFromServer: syncFromServer,
        init: init
    };
})();

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { Wishlist.init(); });
} else {
    Wishlist.init();
}
