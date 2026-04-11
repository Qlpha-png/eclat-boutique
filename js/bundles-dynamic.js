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

            // Éclats — même taux que produits individuels (1 Éclat/€) + bonus coffret 50%
            var baseEclats = Math.floor(bun.price);
            var bonusEclats = Math.floor(baseEclats * 0.5);
            var totalEclats = baseEclats + bonusEclats;

            html += '<div class="bundle-eclats-badge">';
            html += '<span class="bundle-eclats-icon">\u2728</span>';
            html += '<span class="bundle-eclats-value">+' + totalEclats + ' \u00c9clats</span>';
            html += '<span class="bundle-eclats-bonus">(' + baseEclats + ' + ' + bonusEclats + ' bonus)</span>';
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
                // Livraison offerte seulement si coffret >= 29€ (seuil réel app.js)
                if (bun.price >= 29) {
                    html += ' \u2022 Livraison offerte';
                }
                html += '</div>';
            }

            // Valeur Éclats gagnés (1 Éclat = 0,06€)
            var eclatValue = 0.06;
            var rewardValue = (totalEclats * eclatValue).toFixed(2).replace('.', ',');
            html += '<div class="bundle-eclats-price">';
            html += '\u2728 = ' + rewardValue + '\u00a0\u20ac de r\u00e9compenses fid\u00e9lit\u00e9';
            html += '</div>';

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

    // Carousel with lateral arrows
    function initCarousel() {
        var section = document.querySelector('.bundles-section');
        if (!section) return;

        var grid = section.querySelector('.bundles-grid');
        if (!grid) return;

        // Remove old nav in header if exists
        var oldNav = section.querySelector('.bundles-carousel-nav');
        if (oldNav) oldNav.remove();

        // Wrap grid in carousel wrapper if not already
        if (!grid.parentElement.classList.contains('bundles-carousel-wrapper')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'bundles-carousel-wrapper';
            grid.parentElement.insertBefore(wrapper, grid);
            wrapper.appendChild(grid);

            // Add lateral arrows
            var leftArrow = document.createElement('button');
            leftArrow.className = 'bundles-arrow bundles-arrow--left bundles-arrow--hidden';
            leftArrow.setAttribute('data-action', 'scroll-bundles');
            leftArrow.setAttribute('data-dir', '-1');
            leftArrow.setAttribute('aria-label', 'Coffrets pr\u00e9c\u00e9dents');
            leftArrow.innerHTML = '\u2039';

            var rightArrow = document.createElement('button');
            rightArrow.className = 'bundles-arrow bundles-arrow--right';
            rightArrow.setAttribute('data-action', 'scroll-bundles');
            rightArrow.setAttribute('data-dir', '1');
            rightArrow.setAttribute('aria-label', 'Coffrets suivants');
            rightArrow.innerHTML = '\u203A';

            wrapper.appendChild(leftArrow);
            wrapper.appendChild(rightArrow);

            // Add dots indicator
            var cards = grid.querySelectorAll('.bundle-card-dynamic');
            if (cards.length > 1) {
                var dotsDiv = document.createElement('div');
                dotsDiv.className = 'bundles-dots';
                for (var d = 0; d < cards.length; d++) {
                    var dot = document.createElement('button');
                    dot.className = 'bundles-dot' + (d === 0 ? ' bundles-dot--active' : '');
                    dot.setAttribute('data-action', 'scroll-bundle-dot');
                    dot.setAttribute('data-index', d);
                    dot.setAttribute('aria-label', 'Coffret ' + (d + 1));
                    dotsDiv.appendChild(dot);
                }
                wrapper.appendChild(dotsDiv);
            }
        }

        // Update arrow visibility on scroll
        updateArrows(grid);
        grid.addEventListener('scroll', function() { updateArrows(grid); });
        window.addEventListener('resize', function() { updateArrows(grid); });
    }

    function updateArrows(grid) {
        var wrapper = grid.parentElement;
        if (!wrapper) return;
        var leftBtn = wrapper.querySelector('.bundles-arrow--left');
        var rightBtn = wrapper.querySelector('.bundles-arrow--right');
        if (!leftBtn || !rightBtn) return;

        var scrollLeft = grid.scrollLeft;
        var maxScroll = grid.scrollWidth - grid.clientWidth;

        // Left arrow: hidden if at start
        if (scrollLeft <= 10) {
            leftBtn.classList.add('bundles-arrow--hidden');
        } else {
            leftBtn.classList.remove('bundles-arrow--hidden');
        }

        // Right arrow: hidden if at end
        if (scrollLeft >= maxScroll - 10) {
            rightBtn.classList.add('bundles-arrow--hidden');
        } else {
            rightBtn.classList.remove('bundles-arrow--hidden');
        }

        // Update dots
        var dots = wrapper.querySelectorAll('.bundles-dot');
        if (dots.length > 0) {
            var cards = grid.querySelectorAll('.bundle-card-dynamic');
            var cardW = cards.length > 0 ? cards[0].offsetWidth + 20 : 320; // width + gap
            var activeIndex = Math.round(scrollLeft / cardW);
            if (activeIndex >= dots.length) activeIndex = dots.length - 1;
            if (activeIndex < 0) activeIndex = 0;
            for (var di = 0; di < dots.length; di++) {
                if (di === activeIndex) {
                    dots[di].classList.add('bundles-dot--active');
                } else {
                    dots[di].classList.remove('bundles-dot--active');
                }
            }
        }
    }

    // Scroll handler — smooth scroll one card width
    document.addEventListener('click', function(e) {
        // Arrow click
        var arrowTarget = e.target.closest('[data-action="scroll-bundles"]');
        if (arrowTarget) {
            var dir = parseInt(arrowTarget.getAttribute('data-dir'), 10);
            var grid = document.querySelector('.bundles-grid');
            if (grid) {
                grid.scrollBy({ left: dir * 320, behavior: 'smooth' });
            }
            return;
        }
        // Dot click
        var dotTarget = e.target.closest('[data-action="scroll-bundle-dot"]');
        if (dotTarget) {
            var idx = parseInt(dotTarget.getAttribute('data-index'), 10);
            var grid2 = document.querySelector('.bundles-grid');
            if (grid2) {
                var cards = grid2.querySelectorAll('.bundle-card-dynamic');
                if (cards[idx]) {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }
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
