// ============================
// ÉCLAT — Dynamic Bundles Renderer v1
// Renders ALL bundles from BUNDLES array with real product images
// Replaces static 3-bundle HTML with dynamic carousel
// ============================
(function() {
    'use strict';

    function getProduct(id) {
        if (typeof PRODUCTS === 'undefined') return null;
        for (var i = 0; i < PRODUCTS.length; i++) {
            if (PRODUCTS[i].id === id) return PRODUCTS[i];
        }
        return null;
    }

    function getImgUrl(url) {
        // Products may already be proxied (start with /api/img)
        if (!url) return '';
        if (url.indexOf('/api/') === 0) return url;
        if (typeof imgProxy === 'function') return imgProxy(url);
        return url;
    }

    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + '\u00a0\u20ac';
    }

    function escHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Icons per bundle theme
    var BUNDLE_ICONS = {
        eclat: '\u2728',
        antiage: '\uD83D\uDC51',
        glow: '\uD83C\uDF38',
        hydra: '\uD83D\uDCA7',
        barbe: '\uD83E\uDDD4',
        nails: '\uD83D\uDC85',
        cheveux: '\uD83D\uDC87',
        spa: '\uD83E\uDDD6',
        corps: '\uD83E\uDDD6\u200D\u2640\uFE0F'
    };

    // Featured bundles (shown larger)
    var FEATURED_KEYS = ['antiage', 'spa', 'cheveux'];

    function renderBundles() {
        var grid = document.querySelector('.bundles-grid');
        if (!grid || typeof BUNDLES === 'undefined' || typeof PRODUCTS === 'undefined') return;

        // Filter bundles to only those with available products
        var validBundles = [];
        for (var b = 0; b < BUNDLES.length; b++) {
            var bundle = BUNDLES[b];
            var products = [];
            var individualTotal = 0;
            var allFound = true;

            for (var p = 0; p < bundle.productIds.length; p++) {
                var prod = getProduct(bundle.productIds[p]);
                if (prod) {
                    products.push(prod);
                    individualTotal += prod.price;
                } else {
                    allFound = false;
                }
            }

            // Need at least 2 products found for a valid bundle
            if (products.length >= 2) {
                validBundles.push({
                    bundle: bundle,
                    products: products,
                    individualTotal: individualTotal,
                    savings: Math.max(0, individualTotal - bundle.price),
                    allFound: allFound
                });
            }
        }

        if (validBundles.length === 0) return;

        // Build HTML
        var html = '';

        for (var i = 0; i < validBundles.length; i++) {
            var vb = validBundles[i];
            var bun = vb.bundle;
            var isFeatured = FEATURED_KEYS.indexOf(bun.key) !== -1;
            var icon = BUNDLE_ICONS[bun.key] || '\uD83C\uDF81';

            // Try i18n name, fallback to bundle.name
            var bundleName = bun.name;
            if (typeof t === 'function') {
                var translated = t('bundle_' + bun.key + '_name');
                if (translated && translated !== 'bundle_' + bun.key + '_name') {
                    bundleName = translated;
                }
            }

            html += '<div class="bundle-card-dynamic' + (isFeatured ? ' bundle-card--featured' : '') + '">';

            // Product images row
            html += '<div class="bundle-images">';
            for (var j = 0; j < vb.products.length; j++) {
                var prod = vb.products[j];
                html += '<div class="bundle-img-thumb">';
                html += '<img src="' + getImgUrl(prod.image) + '" alt="' + escHTML(prod.name) + '" width="80" height="80" loading="lazy">';
                html += '</div>';
                if (j < vb.products.length - 1) {
                    html += '<span class="bundle-img-plus">+</span>';
                }
            }
            html += '</div>';

            // Bundle info
            html += '<div class="bundle-info">';
            html += '<div class="bundle-icon-dynamic">' + icon + '</div>';
            html += '<h3 class="bundle-name-dynamic">' + escHTML(bundleName) + '</h3>';

            // Product names list
            html += '<div class="bundle-product-list">';
            for (var k = 0; k < vb.products.length; k++) {
                html += '<span class="bundle-product-tag">' + escHTML(vb.products[k].name) + '</span>';
            }
            html += '</div>';

            // Pricing
            html += '<div class="bundle-pricing-dynamic">';
            if (vb.savings > 0.5) {
                html += '<span class="bundle-old">' + formatPrice(vb.individualTotal) + '</span>';
            }
            html += '<span class="bundle-current">' + formatPrice(bun.price) + '</span>';
            html += '</div>';

            if (vb.savings > 0.5) {
                var savePct = Math.round((vb.savings / vb.individualTotal) * 100);
                html += '<div class="bundle-savings-dynamic">';
                html += '\u00c9conomisez ' + formatPrice(vb.savings);
                html += ' <span class="bundle-pct">(-' + savePct + '%)</span>';
                html += ' \u2022 Livraison offerte';
                html += '</div>';
            }
            html += '</div>';

            // CTA
            html += '<button class="btn btn-primary btn-full bundle-cta-dynamic" data-action="add-bundle" data-bundle-key="' + bun.key + '">';
            html += '\uD83D\uDED2 Ajouter au panier';
            html += '</button>';

            html += '</div>';
        }

        grid.innerHTML = html;
        grid.classList.add('bundles-grid-dynamic');
    }

    // Carousel scroll functionality
    function initCarousel() {
        var section = document.querySelector('.bundles-section');
        if (!section) return;

        var grid = section.querySelector('.bundles-grid');
        if (!grid) return;

        // Add scroll arrows if content overflows
        var existingNav = section.querySelector('.bundles-carousel-nav');
        if (existingNav) existingNav.remove();

        var nav = document.createElement('div');
        nav.className = 'bundles-carousel-nav';
        nav.innerHTML = '<button class="bundles-arrow bundles-arrow-left" data-action="scroll-bundles" data-dir="-1" aria-label="Pr\u00e9c\u00e9dent">\u2190</button>'
            + '<button class="bundles-arrow bundles-arrow-right" data-action="scroll-bundles" data-dir="1" aria-label="Suivant">\u2192</button>';

        var header = section.querySelector('.section-header');
        if (header) header.appendChild(nav);
    }

    // Scroll handler
    document.addEventListener('click', function(e) {
        var target = e.target.closest('[data-action="scroll-bundles"]');
        if (!target) return;
        var dir = parseInt(target.getAttribute('data-dir'), 10);
        var grid = document.querySelector('.bundles-grid');
        if (grid) {
            grid.scrollBy({ left: dir * 340, behavior: 'smooth' });
        }
    });

    // Initialize
    function init() {
        if (typeof BUNDLES !== 'undefined' && typeof PRODUCTS !== 'undefined' && PRODUCTS.length > 0) {
            renderBundles();
            initCarousel();
        } else {
            var retries = 0;
            var interval = setInterval(function() {
                retries++;
                if (typeof BUNDLES !== 'undefined' && typeof PRODUCTS !== 'undefined' && PRODUCTS.length > 0) {
                    clearInterval(interval);
                    renderBundles();
                    initCarousel();
                }
                if (retries > 50) clearInterval(interval);
            }, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.BundlesDynamic = { render: renderBundles };
})();
