(function() {
    'use strict';

    // ============================
    // ECLAT Beaute — Produits vus recemment
    // localStorage, max 8, dedup par id, newest first
    // ============================

    var STORAGE_KEY = 'eclat_recently_viewed';
    var MAX_ITEMS = 8;

    // ---- localStorage helpers ----

    function getStored() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveStored(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) { /* quota exceeded — silent */ }
    }

    // ---- HTML escaping ----

    function escapeHTML(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---- Build a single product card ----

    function cardHTML(product) {
        var href = 'pages/product.html?id=' + encodeURIComponent(product.id);
        // If we are already inside /pages/, adjust the relative path
        if (window.location.pathname.indexOf('/pages/') !== -1) {
            href = 'product.html?id=' + encodeURIComponent(product.id);
        }

        var priceStr = Number(product.price).toFixed(2).replace('.', ',') + ' \u20ac';

        return '<a href="' + href + '" class="rv-card" style="' +
            'flex:0 0 auto;width:150px;text-decoration:none;color:inherit;' +
            'border-radius:12px;overflow:hidden;' +
            'border:1px solid var(--color-border,#e8e4de);' +
            'background:var(--color-bg-alt,#f3efe9);' +
            'transition:box-shadow 0.2s,transform 0.2s;' +
            '">' +
                '<div style="width:100%;aspect-ratio:1;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:8px;">' +
                    '<img src="' + escapeHTML(product.image) + '" ' +
                        'alt="' + escapeHTML(product.name) + '" ' +
                        'loading="lazy" ' +
                        'style="max-width:100%;max-height:100%;object-fit:contain;">' +
                '</div>' +
                '<div style="padding:8px 10px 10px;">' +
                    '<div style="' +
                        'font-family:var(--font-body,sans-serif);' +
                        'font-size:0.75rem;font-weight:600;' +
                        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
                        'color:var(--color-text,#2d2926);' +
                    '">' + escapeHTML(product.name) + '</div>' +
                    '<div style="' +
                        'font-size:0.8rem;font-weight:700;' +
                        'color:var(--color-primary,#2d2926);margin-top:3px;' +
                    '">' + priceStr + '</div>' +
                '</div>' +
            '</a>';
    }

    // ---- Core RecentlyViewed object ----

    var RecentlyViewed = {

        add: function(product) {
            if (!product || !product.id) return;

            var items = getStored();

            // Deduplicate: remove existing entry with same id
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                if (String(items[i].id) !== String(product.id)) {
                    filtered.push(items[i]);
                }
            }

            // Prepend the new/updated entry
            filtered.unshift({
                id: product.id,
                name: product.name || '',
                image: product.image || '',
                price: Number(product.price) || 0
            });

            // Cap at MAX_ITEMS
            if (filtered.length > MAX_ITEMS) {
                filtered = filtered.slice(0, MAX_ITEMS);
            }

            saveStored(filtered);
        },

        getAll: function() {
            return getStored();
        },

        render: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container) return;

            var items = getStored();
            if (items.length < 2) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }

            var html = '';
            html += '<h2 style="' +
                'font-family:var(--font-display,serif);' +
                'font-size:1.3rem;font-weight:600;' +
                'margin:0 0 16px 0;' +
                'color:var(--color-text,#2d2926);' +
            '">Vus r\u00e9cemment</h2>';

            html += '<div style="' +
                'display:flex;gap:14px;' +
                'overflow-x:auto;overflow-y:hidden;' +
                'padding-bottom:8px;' +
                '-webkit-overflow-scrolling:touch;' +
                'scrollbar-width:thin;' +
            '">';

            for (var i = 0; i < items.length; i++) {
                html += cardHTML(items[i]);
            }

            html += '</div>';

            container.innerHTML = html;
            container.style.display = 'block';
        }
    };

    // ---- Expose globally ----

    window.RecentlyViewed = RecentlyViewed;

    // ---- Auto-render on homepage if container exists ----

    function autoRender() {
        var el = document.getElementById('recently-viewed-container');
        if (el) {
            RecentlyViewed.render('recently-viewed-container');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoRender);
    } else {
        autoRender();
    }

})();
