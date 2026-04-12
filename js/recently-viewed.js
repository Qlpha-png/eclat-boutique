(function() {
    'use strict';

    // ============================
    // Maison Eclat — Produits vus recemment
    // localStorage, max 8, dedup par id, newest first
    // Horizontal scrollable row + scroll arrows
    // CSS injected by JS — no separate file needed
    // ============================

    var STORAGE_KEY = 'eclat_recently_viewed';
    var MAX_ITEMS = 8;
    var MIN_TO_SHOW = 2;
    var CSS_INJECTED = false;

    // ---- CSS injection ----

    function injectCSS() {
        if (CSS_INJECTED) return;
        CSS_INJECTED = true;

        var css = '' +
            '.rv-section {' +
                'position: relative;' +
                'padding: 32px 0;' +
                'max-width: 1200px;' +
                'margin: 0 auto;' +
            '}' +
            '.rv-section .rv-heading {' +
                'font-family: var(--font-display, Georgia, serif);' +
                'font-size: 1.3rem;' +
                'font-weight: 600;' +
                'color: var(--color-text, #2d2926);' +
                'margin: 0 0 18px 0;' +
                'text-align: left;' +
            '}' +
            '.rv-scroll-wrapper {' +
                'position: relative;' +
            '}' +
            '.rv-track {' +
                'display: flex;' +
                'gap: 14px;' +
                'overflow-x: auto;' +
                'overflow-y: hidden;' +
                'padding: 4px 4px 12px 4px;' +
                '-webkit-overflow-scrolling: touch;' +
                'scrollbar-width: thin;' +
                'scrollbar-color: var(--color-border, #e8e4de) transparent;' +
                'scroll-behavior: smooth;' +
            '}' +
            '.rv-track::-webkit-scrollbar {' +
                'height: 6px;' +
            '}' +
            '.rv-track::-webkit-scrollbar-track {' +
                'background: transparent;' +
            '}' +
            '.rv-track::-webkit-scrollbar-thumb {' +
                'background: var(--color-border, #e8e4de);' +
                'border-radius: 3px;' +
            '}' +
            '.rv-arrow {' +
                'position: absolute;' +
                'top: 50%;' +
                'transform: translateY(-50%);' +
                'width: 36px;' +
                'height: 36px;' +
                'border-radius: 50%;' +
                'background: var(--color-white, #fff);' +
                'border: 1px solid var(--color-border, #e8e4de);' +
                'box-shadow: 0 2px 8px rgba(45,41,38,0.08);' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'cursor: pointer;' +
                'z-index: 2;' +
                'font-size: 1rem;' +
                'color: var(--color-text, #2d2926);' +
                'transition: all 0.2s ease;' +
                'padding: 0;' +
                'line-height: 1;' +
            '}' +
            '.rv-arrow:hover {' +
                'background: var(--color-bg-alt, #f3efe9);' +
                'border-color: var(--color-secondary, #c9a87c);' +
                'color: var(--color-secondary, #c9a87c);' +
            '}' +
            '.rv-arrow--left {' +
                'left: -8px;' +
            '}' +
            '.rv-arrow--right {' +
                'right: -8px;' +
            '}' +
            '.rv-arrow[disabled] {' +
                'opacity: 0;' +
                'pointer-events: none;' +
            '}' +
            '.rv-card {' +
                'flex: 0 0 auto;' +
                'width: 150px;' +
                'text-decoration: none;' +
                'color: inherit;' +
                'border-radius: var(--radius-md, 12px);' +
                'overflow: hidden;' +
                'border: 1px solid var(--color-border, #e8e4de);' +
                'background: var(--color-white, #fff);' +
                'transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;' +
                'display: block;' +
            '}' +
            '.rv-card:hover {' +
                'transform: translateY(-3px);' +
                'box-shadow: 0 4px 16px rgba(45,41,38,0.1);' +
                'border-color: var(--color-secondary, #c9a87c);' +
            '}' +
            '.rv-card-img {' +
                'width: 100%;' +
                'height: 120px;' +
                'overflow: hidden;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'background: var(--color-bg-alt, #f3efe9);' +
                'padding: 8px;' +
            '}' +
            '.rv-card-img img {' +
                'max-width: 100%;' +
                'max-height: 100%;' +
                'object-fit: contain;' +
            '}' +
            '.rv-card-body {' +
                'padding: 8px 10px 10px;' +
            '}' +
            '.rv-card-name {' +
                'font-family: var(--font-body, sans-serif);' +
                'font-size: 0.78rem;' +
                'font-weight: 600;' +
                'white-space: nowrap;' +
                'overflow: hidden;' +
                'text-overflow: ellipsis;' +
                'color: var(--color-text, #2d2926);' +
                'line-height: 1.3;' +
            '}' +
            '.rv-card-price {' +
                'font-size: 0.85rem;' +
                'font-weight: 700;' +
                'color: var(--color-secondary, #c9a87c);' +
                'margin-top: 4px;' +
            '}' +
            '@media (max-width: 768px) {' +
                '.rv-arrow { display: none; }' +
                '.rv-section { padding: 24px 0; }' +
            '}';

        var style = document.createElement('style');
        style.setAttribute('data-rv', '1');
        style.textContent = css;
        document.head.appendChild(style);
    }

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

    // ---- Determine if we are in /pages/ subfolder ----

    function isInsidePages() {
        return window.location.pathname.indexOf('/pages/') !== -1 ||
               window.location.pathname.indexOf('\\pages\\') !== -1;
    }

    // ---- Build a single product card HTML ----

    function cardHTML(product) {
        var href = 'pages/product.html?id=' + encodeURIComponent(product.id);
        if (isInsidePages()) {
            href = 'product.html?id=' + encodeURIComponent(product.id);
        }

        var priceStr = Number(product.price).toFixed(2).replace('.', ',') + ' \u20ac';

        return '<a href="' + href + '" class="rv-card">' +
                '<div class="rv-card-img">' +
                    '<img src="' + escapeHTML(product.image) + '" ' +
                        'alt="' + escapeHTML(product.name) + '" ' +
                        'loading="lazy" ' +
                        'width="120" height="120">' +
                '</div>' +
                '<div class="rv-card-body">' +
                    '<div class="rv-card-name">' + escapeHTML(product.name) + '</div>' +
                    '<div class="rv-card-price">' + priceStr + '</div>' +
                '</div>' +
            '</a>';
    }

    // ---- Build the full section HTML (returns string) ----

    function buildSectionHTML(excludeId) {
        var items = getStored();

        // Optionally exclude the currently viewed product
        if (excludeId !== undefined && excludeId !== null) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                if (String(items[i].id) !== String(excludeId)) {
                    filtered.push(items[i]);
                }
            }
            items = filtered;
        }

        if (items.length < MIN_TO_SHOW) return '';

        var uid = 'rv-' + Date.now();

        var html = '<div class="rv-section" id="' + uid + '">';
        html += '<h2 class="rv-heading">Vus r\u00e9cemment</h2>';
        html += '<div class="rv-scroll-wrapper">';
        html += '<button class="rv-arrow rv-arrow--left" data-rv-dir="left" aria-label="D\u00e9filer vers la gauche">\u2039</button>';
        html += '<div class="rv-track" data-rv-track="1">';

        for (var j = 0; j < items.length; j++) {
            html += cardHTML(items[j]);
        }

        html += '</div>';
        html += '<button class="rv-arrow rv-arrow--right" data-rv-dir="right" aria-label="D\u00e9filer vers la droite">\u203a</button>';
        html += '</div>';
        html += '</div>';

        return html;
    }

    // ---- Bind scroll arrows for a given section element ----

    function bindArrows(sectionEl) {
        if (!sectionEl) return;

        var track = sectionEl.querySelector('[data-rv-track]');
        var leftBtn = sectionEl.querySelector('.rv-arrow--left');
        var rightBtn = sectionEl.querySelector('.rv-arrow--right');

        if (!track || !leftBtn || !rightBtn) return;

        var scrollAmount = 320;

        function updateArrowState() {
            var scrollLeft = Math.round(track.scrollLeft);
            var maxScroll = track.scrollWidth - track.clientWidth;
            leftBtn.disabled = scrollLeft <= 1;
            rightBtn.disabled = scrollLeft >= maxScroll - 1;
        }

        leftBtn.addEventListener('click', function() {
            track.scrollLeft = track.scrollLeft - scrollAmount;
        });

        rightBtn.addEventListener('click', function() {
            track.scrollLeft = track.scrollLeft + scrollAmount;
        });

        track.addEventListener('scroll', updateArrowState);
        updateArrowState();

        // Re-check on resize
        window.addEventListener('resize', updateArrowState);
    }

    // ---- Read current product from page DOM or window.currentProduct ----

    function readCurrentProduct() {
        // Priority 1: window.currentProduct (set by product page script)
        if (window.currentProduct && window.currentProduct.id) {
            return window.currentProduct;
        }

        // Priority 2: window.PRODUCTS array + URL param
        var params;
        try { params = new URLSearchParams(window.location.search); } catch (e) { return null; }
        var pid = parseInt(params.get('id'), 10);
        if (!pid || isNaN(pid)) return null;

        if (window.PRODUCTS && window.PRODUCTS.length) {
            for (var i = 0; i < window.PRODUCTS.length; i++) {
                if (window.PRODUCTS[i].id === pid) {
                    return window.PRODUCTS[i];
                }
            }
        }

        // Priority 3: scrape from DOM
        var nameEl = document.querySelector('.pp-name');
        var imgEl = document.querySelector('.pp-image img');
        var priceEl = document.querySelector('.pp-price');
        var catEl = document.querySelector('.pp-category');

        if (nameEl && priceEl) {
            var priceText = priceEl.textContent.replace(/[^\d,\.]/g, '').replace(',', '.');
            return {
                id: pid,
                name: nameEl.textContent.trim(),
                image: imgEl ? imgEl.getAttribute('src') : '',
                price: parseFloat(priceText) || 0,
                category: catEl ? catEl.textContent.trim() : ''
            };
        }

        return null;
    }

    // ---- Detect page type ----

    function isProductPage() {
        return window.location.pathname.indexOf('product.html') !== -1;
    }

    function isHomepage() {
        var path = window.location.pathname;
        return path === '/' ||
               path.indexOf('index.html') !== -1 ||
               path.charAt(path.length - 1) === '/' && path.indexOf('/pages/') === -1;
    }

    // ---- Insert section into the page ----

    function insertOnHomepage() {
        // If a manual container already exists and has been populated, skip auto-insert
        var manual = document.getElementById('recentlyViewedHome');
        if (manual && manual.innerHTML.trim() !== '') return;

        var items = getStored();
        if (items.length < MIN_TO_SHOW) return;

        var sectionHTML = buildSectionHTML();
        if (!sectionHTML) return;

        injectCSS();

        // If the manual container exists but is empty, use it
        if (manual) {
            manual.innerHTML = sectionHTML;
            manual.style.display = 'block';
            bindArrows(manual.querySelector('.rv-section'));
            return;
        }

        // Otherwise, insert before the footer
        var footer = document.querySelector('footer.footer') || document.querySelector('footer');
        if (footer) {
            var wrapper = document.createElement('div');
            wrapper.className = 'container';
            wrapper.style.padding = '0 24px';
            wrapper.innerHTML = sectionHTML;
            footer.parentNode.insertBefore(wrapper, footer);
            bindArrows(wrapper.querySelector('.rv-section'));
        }
    }

    function insertOnProductPage(currentProductId) {
        var items = getStored();

        // Filter out current product for display
        var displayItems = [];
        for (var i = 0; i < items.length; i++) {
            if (String(items[i].id) !== String(currentProductId)) {
                displayItems.push(items[i]);
            }
        }

        if (displayItems.length < MIN_TO_SHOW) return;

        var sectionHTML = buildSectionHTML(currentProductId);
        if (!sectionHTML) return;

        injectCSS();

        // Insert after the cross-sell section or after ppInfo
        var crossSell = document.getElementById('ppCrossSell');
        var target = crossSell || document.querySelector('.pp-grid');

        if (target) {
            var wrapper = document.createElement('div');
            wrapper.style.cssText = 'max-width:800px;margin:0 auto;';
            wrapper.innerHTML = sectionHTML;
            target.parentNode.insertBefore(wrapper, target.nextSibling);
            bindArrows(wrapper.querySelector('.rv-section'));
        }
    }

    // ---- Core API ----

    var RecentlyViewed = {

        /**
         * Add a product to the recently viewed list.
         * Deduplicates by id, newest first, max 8.
         */
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
                price: Number(product.price) || 0,
                category: product.category || ''
            });

            // Cap at MAX_ITEMS
            if (filtered.length > MAX_ITEMS) {
                filtered = filtered.slice(0, MAX_ITEMS);
            }

            saveStored(filtered);
        },

        /**
         * Alias for add — exposed as addProduct.
         */
        addProduct: function(product) {
            return RecentlyViewed.add(product);
        },

        /**
         * Get all stored recently viewed products.
         */
        getAll: function() {
            return getStored();
        },

        /**
         * Alias for getAll — exposed as getViewed.
         */
        getViewed: function() {
            return getStored();
        },

        /**
         * Render into a specific container by ID (legacy support).
         */
        render: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container) return;

            var items = getStored();
            if (items.length < MIN_TO_SHOW) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }

            injectCSS();

            var sectionHTML = buildSectionHTML();
            container.innerHTML = sectionHTML;
            container.style.display = 'block';

            bindArrows(container.querySelector('.rv-section'));
        },

        /**
         * Return the section HTML string (used by product page and homepage inline scripts).
         * Optionally exclude a product by id.
         */
        renderSection: function(excludeId) {
            injectCSS();
            return buildSectionHTML(excludeId);
        },

        /**
         * Initialize: track current product on product pages,
         * auto-insert the section on homepage and product pages.
         */
        init: function() {
            injectCSS();

            if (isProductPage()) {
                // Track the current product
                var product = readCurrentProduct();
                if (product) {
                    RecentlyViewed.add(product);
                }

                // Don't auto-insert on product page — the inline script handles it
                // (via RecentlyViewed.renderSection), but as fallback:
                var existingRV = document.querySelector('.rv-section');
                if (!existingRV) {
                    insertOnProductPage(product ? product.id : null);
                } else {
                    // Bind arrows on any existing section
                    bindArrows(existingRV);
                }
            } else if (isHomepage()) {
                insertOnHomepage();
            }

            // Bind arrows on any sections rendered by external scripts
            var allSections = document.querySelectorAll('.rv-section');
            for (var i = 0; i < allSections.length; i++) {
                // Check if arrows are already bound
                if (!allSections[i].getAttribute('data-rv-bound')) {
                    bindArrows(allSections[i]);
                    allSections[i].setAttribute('data-rv-bound', '1');
                }
            }
        }
    };

    // ---- Expose globally ----

    window.RecentlyViewed = RecentlyViewed;

    // Required public API
    window.EclatRecentlyViewed = {
        init: RecentlyViewed.init,
        getViewed: RecentlyViewed.getViewed,
        addProduct: RecentlyViewed.addProduct
    };

    // ---- Auto-init on DOM ready ----

    function onReady() {
        // Small delay to let other scripts (products.js, product page inline) run first
        setTimeout(function() {
            RecentlyViewed.init();
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

})();
