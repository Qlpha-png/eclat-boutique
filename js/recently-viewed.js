// ============================
// ÉCLAT — Produits Vus Récemment (localStorage, max 8)
// ============================
var RecentlyViewed = (function() {
    'use strict';

    var STORAGE_KEY = 'eclat_recent';
    var MAX_ITEMS = 8;

    function getAll() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch(e) { return []; }
    }

    function add(product) {
        if (!product || !product.id) return;
        var items = getAll();
        // Remove if already exists (will re-add at front)
        items = items.filter(function(p) { return p.id !== product.id; });
        items.unshift({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price
        });
        if (items.length > MAX_ITEMS) items = items.slice(0, MAX_ITEMS);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch(e) {}
    }

    function renderSection(excludeId) {
        var items = getAll();
        if (excludeId) items = items.filter(function(p) { return p.id !== Number(excludeId); });
        if (items.length < 2) return '';

        var html = '<div class="rv-section" style="margin-top:32px;">';
        html += '<h2 style="font-family:var(--font-display,serif);font-size:1.3rem;margin-bottom:16px;">Vus r\u00e9cemment</h2>';
        html += '<div style="display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;">';
        for (var i = 0; i < items.length; i++) {
            var p = items[i];
            html += '<a href="' + (window.location.pathname.indexOf('pages/') >= 0 ? '' : 'pages/') + 'product.html?id=' + p.id + '" style="flex-shrink:0;width:140px;text-decoration:none;color:inherit;">';
            html += '<div style="background:var(--color-bg-alt,#f3efe9);border-radius:12px;overflow:hidden;border:1px solid var(--color-border,#e8e4de);transition:all 0.2s;">';
            html += '<img src="' + escapeHTMLRV(p.image) + '" alt="' + escapeHTMLRV(p.name) + '" style="width:100%;aspect-ratio:1;object-fit:contain;padding:8px;" loading="lazy">';
            html += '<div style="padding:8px 10px;">';
            html += '<div style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHTMLRV(p.name) + '</div>';
            html += '<div style="font-size:0.8rem;font-weight:700;color:var(--color-primary,#2d2926);margin-top:2px;">' + p.price.toFixed(2).replace('.', ',') + ' \u20ac</div>';
            html += '</div></div></a>';
        }
        html += '</div></div>';
        return html;
    }

    function escapeHTMLRV(str) {
        if (!str) return '';
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    return {
        add: add,
        getAll: getAll,
        renderSection: renderSection
    };
})();
