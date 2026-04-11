// ============================
// ECLAT - Main Application v2
// Pagination 24 produits, filtres unifiés, performance optimisée
// ============================

var PRODUCTS_PER_PAGE = 24;
var _currentProductsPage = 1;
var _currentFilteredList = [];
var _currentCategory = 'all';

// Note: imgProxy() et le proxying CJ CDN sont dans products.js (chargé avant)

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getCategoryLabel(cat) {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
    if (typeof getCategoryText === 'function') {
        var txt = getCategoryText(cat, lang);
        if (txt && txt !== cat) return txt;
    }
    var labels = {
        visage: 'Soins visage', soin: 'S\u00e9rums & Soins', corps: 'Soins corps',
        cheveux: 'Cheveux', ongles: 'Ongles', homme: 'Homme',
        accessoire: 'Accessoires', outils: 'Outils beaut\u00e9',
        aromatherapie: 'Bien-\u00eatre', coffrets: 'Coffrets',
        parfums: 'Parfumerie', marques: 'Marque officielle \u2713'
    };
    return labels[cat] || cat;
}

// Expose globally
window.getCategoryLabel = getCategoryLabel;

document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Elements ---
    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var navLinks = document.getElementById('navLinks');
    var cartBtn = document.getElementById('cartBtn');
    var cartCount = document.getElementById('cartCount');
    var cartSidebar = document.getElementById('cartSidebar');
    var cartOverlay = document.getElementById('cartOverlay');
    var cartClose = document.getElementById('cartClose');
    var cartItems = document.getElementById('cartItems');
    var cartEmpty = document.getElementById('cartEmpty');
    var cartFooter = document.getElementById('cartFooter');
    var cartSubtotal = document.getElementById('cartSubtotal');
    var checkoutBtn = document.getElementById('checkoutBtn');
    var productsGrid = document.getElementById('productsGrid');
    var bestsellerShowcase = document.getElementById('bestsellerShowcase');
    var modalOverlay = document.getElementById('modalOverlay');
    var productModal = document.getElementById('productModal');
    var modalClose = document.getElementById('modalClose');
    var modalContent = document.getElementById('modalContent');
    var newsletterForm = document.getElementById('newsletterForm');
    var filterBtns = document.querySelectorAll('.filter-btn');

    // --- Navbar scroll effect ---
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile menu ---
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Render a single product card HTML ---
    function productCardHTML(product) {
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        var pName = (typeof getProductText === 'function') ? getProductText(product.id, 'name', lang) : product.name;
        if (!pName) pName = product.name;
        var badgeHTML = '';
        if (product.badge) {
            var badgeText = product.badge === 'new' ? t('badge_new') :
                product.badge === 'promo' ? t('badge_promo') :
                product.badge === 'lancement' ? t('badge_lancement') :
                product.badge === 'marque' ? (escapeHTML(product.name.split(' — ')[0]) || 'Marque') : t('badge_bestseller');
            badgeHTML = '<span class="product-badge badge-' + product.badge + '">' + badgeText + '</span>';
        }
        var wishHTML = (typeof Wishlist !== 'undefined') ? '<span style="position:absolute;top:8px;right:8px;z-index:2;">' + Wishlist.heartHTML(product.id, 22) + '</span>' : '';
        // Directive Omnibus : afficher les étoiles SEULEMENT si des vrais avis existent
        var starsHTML = '';
        var reviewsHTML = '';
        if (product.reviews > 0) {
            starsHTML = '&#9733;'.repeat(Math.floor(product.rating));
            if (product.rating % 1 >= 0.5) starsHTML += '&#9733;';
            reviewsHTML = '<span class="count">(' + product.reviews.toLocaleString('fr-FR') + ' ' + t('reviews_count') + ')</span>';
        }
        var oldPriceHTML = product.oldPrice ? '<span class="price-old">' + formatPrice(product.oldPrice) + '</span>' : '';

        return '<div class="product-card fade-in" data-id="' + product.id + '" data-product-id="' + product.id + '">' +
            '<div class="product-image" onclick="openModal(' + product.id + ')" style="cursor:pointer;position:relative;">' +
                '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(pName) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'has-fallback\');this.parentElement.innerHTML+=\'<div class=fallback-label>' + escapeHTML(pName) + '</div>\';">' +
                badgeHTML + wishHTML +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-category" data-category-key="' + escapeHTML(product.category) + '">' + getCategoryLabel(product.category) + '</div>' +
                '<h3 class="product-name"><a href="pages/product.html?id=' + product.id + '" style="color:inherit;text-decoration:none;" onclick="event.preventDefault();openModal(' + product.id + ')">' + escapeHTML(pName) + '</a></h3>' +
                '<div class="product-rating">' + starsHTML + ' ' + reviewsHTML + '</div>' +
                '<div class="product-price"><span class="price-current">' + formatPrice(product.price) + '</span> ' + oldPriceHTML + '</div>' +
                '<div class="product-trust"><span class="trust-tag shipping">' + t('trust_shipping') + '</span><span class="trust-tag">' + t('trust_refund') + '</span></div>' +
                '<div class="product-actions"><button class="btn btn-primary btn-sm" onclick="addToCart(' + product.id + ')">' + t('btn_add_cart') + '</button></div>' +
            '</div>' +
        '</div>';
    }

    // --- Expose card builder globally for search.js ---
    window._productCardHTML = productCardHTML;

    // --- Product Rendering with Pagination ---
    function renderProducts(category) {
        if (typeof category === 'undefined') category = _currentCategory;
        _currentCategory = category;
        _currentProductsPage = 1;

        var filtered;
        if (category === 'all') {
            filtered = PRODUCTS.slice();
        } else {
            filtered = PRODUCTS.filter(function(p) { return p.category === category; });
        }
        _currentFilteredList = filtered;

        renderPage(filtered, 1, true);
    }

    // Expose for search.js
    window.renderProducts = renderProducts;

    function renderPage(products, page, replace) {
        if (!productsGrid) return;
        var start = 0;
        var end = page * PRODUCTS_PER_PAGE;
        var visible = products.slice(start, end);
        var remaining = products.length - end;

        if (replace) {
            productsGrid.innerHTML = '';
        }

        var html = '';
        var startIdx = replace ? 0 : (page - 1) * PRODUCTS_PER_PAGE;
        var endIdx = Math.min(page * PRODUCTS_PER_PAGE, products.length);
        for (var i = startIdx; i < endIdx; i++) {
            html += productCardHTML(products[i]);
        }

        // Remove old load-more button
        var oldBtn = productsGrid.querySelector('.load-more-container');
        if (oldBtn) oldBtn.remove();

        if (replace) {
            productsGrid.innerHTML = html;
        } else {
            productsGrid.insertAdjacentHTML('beforeend', html);
        }

        // Count display
        var countText = products.length + ' ' + (products.length > 1 ? t('products_count') || 'produits' : t('product_count') || 'produit');
        var countEl = document.getElementById('searchCount');
        if (countEl) countEl.textContent = countText;

        // Load More button
        if (remaining > 0) {
            var loadMoreDiv = document.createElement('div');
            loadMoreDiv.className = 'load-more-container';
            loadMoreDiv.style.cssText = 'grid-column:1/-1;text-align:center;padding:32px 0;';
            var showCount = Math.min(PRODUCTS_PER_PAGE, remaining);
            var loadMoreLabel = t('load_more');
            if (loadMoreLabel === 'load_more') loadMoreLabel = 'Voir plus';
            loadMoreDiv.innerHTML = '<button class="btn btn-outline load-more-btn" id="loadMoreBtn">' +
                loadMoreLabel + ' (' + remaining + ' restants)' +
                '</button>' +
                '<p style="font-size:.8rem;color:var(--color-text-light);margin-top:8px;">' + countText + '</p>';
            productsGrid.appendChild(loadMoreDiv);

            document.getElementById('loadMoreBtn').addEventListener('click', function() {
                _currentProductsPage++;
                renderPage(_currentFilteredList, _currentProductsPage, false);
                // Animate new cards
                var newCards = productsGrid.querySelectorAll('.product-card.fade-in:not(.visible)');
                newCards.forEach(function(el, i) {
                    setTimeout(function() { el.classList.add('visible'); }, i * 40);
                });
            });
        } else if (products.length > PRODUCTS_PER_PAGE) {
            // Show total count at bottom
            var totalDiv = document.createElement('div');
            totalDiv.className = 'load-more-container';
            totalDiv.style.cssText = 'grid-column:1/-1;text-align:center;padding:16px 0;';
            totalDiv.innerHTML = '<p style="font-size:.85rem;color:var(--color-text-light);">' + countText + '</p>';
            productsGrid.appendChild(totalDiv);
        }

        // No results
        if (products.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 24px;color:var(--color-text-light);">' +
                '<div style="font-size:3rem;margin-bottom:16px;">&#128269;</div>' +
                '<h3 style="font-family:var(--font-display);margin-bottom:8px;">' + (t('no_results') || 'Aucun produit trouv\u00e9') + '</h3>' +
                '<p>' + (t('no_results_hint') || 'Essayez de modifier vos filtres.') + '</p></div>';
        }

        // Trigger fade-in for first batch only (not 515 at once!)
        requestAnimationFrame(function() {
            var cards = productsGrid.querySelectorAll('.product-card.fade-in:not(.visible)');
            cards.forEach(function(el, i) {
                setTimeout(function() { el.classList.add('visible'); }, i * 40);
            });
        });
    }

    // Expose renderPage for search.js
    window._renderProductPage = function(products) {
        _currentFilteredList = products;
        _currentProductsPage = 1;
        renderPage(products, 1, true);
    };

    // --- Bestsellers / Sélection (automatique : vrais bestsellers quand il y a des ventes) ---
    function renderBestsellers() {
        if (!bestsellerShowcase) return;

        // Phase 1 : essayer de charger les VRAIS bestsellers depuis l'API
        fetchRealBestsellers(function(realBestsellers) {
            var products;
            var isRealData = false;

            if (realBestsellers && realBestsellers.length >= 3) {
                // VRAIS bestsellers depuis les commandes
                products = realBestsellers;
                isRealData = true;
                // Mettre à jour les titres
                var tagEl = document.getElementById('bestsellerTag');
                var titleEl = document.getElementById('bestsellerTitle');
                var descEl = document.getElementById('bestsellerDesc');
                if (tagEl) tagEl.textContent = 'Les plus achet\u00e9s';
                if (titleEl) titleEl.textContent = 'Nos best-sellers';
                if (descEl) descEl.textContent = 'Les produits les plus command\u00e9s par nos clients.';
            } else {
                // Pas encore de ventes — montrer notre sélection éditoriale
                products = PRODUCTS
                    .filter(function(p) { return p.bestseller; })
                    .sort(function(a, b) { return (a.bestsellerRank || 999) - (b.bestsellerRank || 999); });
            }

            // Carousel compact horizontal — comme Amazon/Sephora
            var trackId = 'bs-track';
            var cardsHTML = products.map(function(product, idx) {
                var rank = isRealData ? (idx + 1) : (product.bestsellerRank || (idx + 1));
                var pName = (typeof getProductText === 'function') ? (getProductText(product.id, 'name', (typeof currentLang !== 'undefined' ? currentLang : 'fr')) || product.name) : product.name;
                return '<div style="min-width:220px;max-width:220px;flex-shrink:0;background:var(--color-white,#fff);border-radius:12px;border:1px solid var(--color-border,#e8e4de);overflow:hidden;cursor:pointer;transition:all .3s;" onclick="openModal(' + product.id + ')">' +
                    '<div style="position:relative;height:200px;overflow:hidden;background:linear-gradient(135deg,var(--color-bg-alt,#f3efe9),var(--color-accent,#e8d5b5));">' +
                        '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(pName) + '" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">' +
                        '<span style="position:absolute;top:8px;left:8px;background:var(--color-secondary,#c9a87c);color:var(--color-white,#fff);font-size:.7rem;padding:3px 10px;border-radius:20px;font-weight:700;">#' + rank + '</span>' +
                    '</div>' +
                    '<div style="padding:12px;">' +
                        '<div data-category-key="' + escapeHTML(product.category) + '" style="font-size:.72rem;color:var(--color-text-light,#6b6560);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">' + getCategoryLabel(product.category) + '</div>' +
                        '<div style="font-weight:600;font-size:.88rem;margin-bottom:6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + escapeHTML(pName) + '</div>' +
                        '<div style="color:var(--color-secondary,#c9a87c);font-weight:700;font-size:1rem;margin-bottom:8px;">' + formatPrice(product.price) + '</div>' +
                        '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();addToCart(' + product.id + ')" style="width:100%;font-size:.8rem;padding:8px 12px;">' + t('btn_add_cart') + '</button>' +
                    '</div>' +
                '</div>';
            }).join('');

            bestsellerShowcase.innerHTML =
                '<div style="position:relative;overflow:hidden;">' +
                    '<div id="' + trackId + '" style="display:flex;gap:16px;overflow-x:auto;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:8px 0;">' +
                        cardsHTML +
                    '</div>' +
                    '<button onclick="var t=document.getElementById(\'' + trackId + '\');if(t)t.scrollBy({left:-260,behavior:\'smooth\'})" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.95);box-shadow:0 2px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:1.1rem;z-index:5;">&#10094;</button>' +
                    '<button onclick="var t=document.getElementById(\'' + trackId + '\');if(t)t.scrollBy({left:260,behavior:\'smooth\'})" style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.95);box-shadow:0 2px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:1.1rem;z-index:5;">&#10095;</button>' +
                '</div>';
        });
    }

    // Charger les vrais bestsellers depuis l'API (basé sur les commandes réelles)
    function fetchRealBestsellers(callback) {
        try {
            fetch('/api/frequently-bought?top=6')
                .then(function(res) { return res.ok ? res.json() : null; })
                .then(function(data) {
                    if (data && data.bestsellers && data.bestsellers.length >= 3) {
                        // Mapper les IDs vers les produits
                        var mapped = data.bestsellers.map(function(bs) {
                            return PRODUCTS.find(function(p) { return p.id === bs.product_id; });
                        }).filter(Boolean);
                        callback(mapped.length >= 3 ? mapped : null);
                    } else {
                        callback(null);
                    }
                })
                .catch(function() { callback(null); });
        } catch(e) {
            callback(null);
        }
    }

    // --- Category Filter ---
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            _currentCategory = btn.dataset.category;
            // Reset advanced filters
            var searchEl = document.getElementById('productSearch');
            if (searchEl) searchEl.value = '';
            var priceEl = document.getElementById('filterPrice');
            if (priceEl) priceEl.value = 'all';
            var ratingEl = document.getElementById('filterRating');
            if (ratingEl) ratingEl.value = '0';
            var concernEl = document.getElementById('filterConcern');
            if (concernEl) concernEl.value = 'all';
            var sortEl = document.getElementById('filterSort');
            if (sortEl) sortEl.value = 'popular';
            applyAllFilters();
        });
    });

    // --- Sort, Price Range, Catalog Search (comme Amazon/Sephora) ---
    function applyAllFilters() {
        var filtered;
        if (_currentCategory === 'all') {
            filtered = PRODUCTS.slice();
        } else {
            filtered = PRODUCTS.filter(function(p) { return p.category === _currentCategory; });
        }

        // Price range filter
        var priceRange = document.getElementById('priceRange');
        if (priceRange && priceRange.value !== 'all') {
            var range = priceRange.value;
            filtered = filtered.filter(function(p) {
                if (range === '0-10') return p.price < 10;
                if (range === '10-20') return p.price >= 10 && p.price < 20;
                if (range === '20-50') return p.price >= 20 && p.price < 50;
                if (range === '50+') return p.price >= 50;
                return true;
            });
        }

        // Catalog search (inline)
        var catalogSearch = document.getElementById('catalogSearch');
        if (catalogSearch && catalogSearch.value.trim().length >= 2) {
            var q = catalogSearch.value.trim().toLowerCase();
            filtered = filtered.filter(function(p) {
                return p.name.toLowerCase().indexOf(q) !== -1 ||
                    (p.description && p.description.toLowerCase().indexOf(q) !== -1) ||
                    (p.category && p.category.toLowerCase().indexOf(q) !== -1);
            });
        }

        // Sort
        var sortEl = document.getElementById('productSort');
        var sortVal = sortEl ? sortEl.value : 'popular';
        if (sortVal === 'price-asc') {
            filtered.sort(function(a, b) { return a.price - b.price; });
        } else if (sortVal === 'price-desc') {
            filtered.sort(function(a, b) { return b.price - a.price; });
        } else if (sortVal === 'newest') {
            filtered.sort(function(a, b) { return b.id - a.id; });
        } else if (sortVal === 'name-asc') {
            filtered.sort(function(a, b) { return a.name.localeCompare(b.name); });
        } else {
            // Popular = bestsellers first, then by badge
            filtered.sort(function(a, b) {
                if (a.bestseller && !b.bestseller) return -1;
                if (!a.bestseller && b.bestseller) return 1;
                if (a.badge === 'best' && b.badge !== 'best') return -1;
                if (a.badge !== 'best' && b.badge === 'best') return 1;
                return 0;
            });
        }

        _currentFilteredList = filtered;
        _currentProductsPage = 1;
        renderPage(filtered, 1, true);
    }

    // Expose for external use
    window.applyAllFilters = applyAllFilters;

    // Bind sort/price/search controls
    var sortSelect = document.getElementById('productSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() { applyAllFilters(); });
    }
    var priceSelect = document.getElementById('priceRange');
    if (priceSelect) {
        priceSelect.addEventListener('change', function() { applyAllFilters(); });
    }
    var catalogSearchInput = document.getElementById('catalogSearch');
    if (catalogSearchInput) {
        var _catalogDebounce = null;
        catalogSearchInput.addEventListener('input', function() {
            clearTimeout(_catalogDebounce);
            _catalogDebounce = setTimeout(function() { applyAllFilters(); }, 250);
        });
    }

    // --- Modal ---
    var productGuideMap = {
        1: { section: 'led', label: 'Luminoth\u00e9rapie LED' },
        2: { section: 'guasha', label: 'Gua Sha & Massage facial' },
        3: { section: 'ultrasons', label: 'Ultrasons cutan\u00e9s' },
        4: { section: 'ultrasons', label: 'Nettoyage sonique' },
        5: { section: 'cryo', label: 'Cryoth\u00e9rapie cutan\u00e9e' },
        6: { section: 'ems', label: 'EMS facial' },
        7: { section: 'led', label: 'Pr\u00e9paration de la peau' },
        8: { section: 'vitc', label: 'Vitamine C topique' },
        9: { section: 'collagene', label: 'Collag\u00e8ne' },
        10: { section: 'collagene', label: 'Collag\u00e8ne' },
        11: { section: 'rosehip', label: 'Huile de Rose Musqu\u00e9e' },
        12: { section: 'collagene', label: 'Collag\u00e8ne & Anti-rides' }
    };

    var modalTrigger = null;

    window.openModal = function(productId) {
        var product = PRODUCTS.find(function(p) { return p.id === productId; });
        if (!product) return;

        modalTrigger = document.activeElement;
        var guide = productGuideMap[product.id];
        var guideLink = guide ? '<a href="pages/guide-beaute.html#' + guide.section + '" class="modal-guide-link">Lire l\'&eacute;tude scientifique : ' + guide.label + ' &rarr;</a>' : '';
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        var pName = (typeof getProductText === 'function') ? (getProductText(product.id, 'name', lang) || product.name) : product.name;
        var pDesc = (typeof getProductText === 'function') ? (getProductText(product.id, 'description', lang) || product.description) : product.description;
        var features = product.features || [];
        if (typeof getProductText === 'function' && lang !== 'fr') {
            var trFeatures = getProductText(product.id, 'features', lang);
            if (trFeatures && trFeatures.length) features = trFeatures;
        }

        modalContent.innerHTML =
            '<div class="modal-grid">' +
                '<div class="modal-image"><img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(pName) + '" referrerpolicy="no-referrer"></div>' +
                '<div class="modal-details">' +
                    '<div class="product-category" data-category-key="' + escapeHTML(product.category) + '">' + getCategoryLabel(product.category) + '</div>' +
                    '<h2 class="product-name" id="modalTitle">' + escapeHTML(pName) + '</h2>' +
                    (product.reviews > 0 ? '<div class="product-rating">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">' + product.rating + '/5 (' + product.reviews + ' avis)</span></div>' : '<div style="font-size:.85rem;color:var(--color-text-light);margin-bottom:8px;">Aucun avis pour le moment</div>') +
                    '<p class="product-description">' + escapeHTML(pDesc) + '</p>' +
                    guideLink +
                    '<div class="product-price"><span class="price-current">' + formatPrice(product.price) + '</span>' +
                        (product.oldPrice ? '<span class="price-old">' + formatPrice(product.oldPrice) + '</span>' : '') +
                    '</div>' +
                    '<div class="modal-trust">' +
                        '<div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#x1F69A;</span> ' + t('trust_modal_shipping') + '</div>' +
                        '<div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#x1F504;</span> ' + t('trust_modal_refund') + '</div>' +
                        '<div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#x1F512;</span> ' + t('trust_modal_secure') + '</div>' +
                    '</div>' +
                    '<ul class="modal-features">' +
                        features.map(function(f) { return '<li>' + escapeHTML(f) + '</li>'; }).join('') +
                    '</ul>' +
                    '<button class="btn btn-primary btn-full" onclick="addToCart(' + product.id + '); closeModal();">' +
                        t('btn_add_cart') + ' - ' + formatPrice(product.price) +
                    '</button>' +
                    '<a href="pages/product.html?id=' + product.id + '" class="btn btn-outline btn-full" style="margin-top:8px;">' + (t('btn_full_details') || 'Voir la fiche compl\u00e8te') + '</a>' +
                '</div>' +
            '</div>';

        modalOverlay.classList.add('active');
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(function() { if (modalClose) modalClose.focus(); }, 100);
    };

    window.closeModal = function() {
        modalOverlay.classList.remove('active');
        productModal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalTrigger) { modalTrigger.focus(); modalTrigger = null; }
    };

    // Escape key closes modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // --- Cart UI ---
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', () => {
        closeCart();
        closeModal();
    });

    // Auto-open cart if redirected from diagnostic quiz
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openCart') === '1') {
        setTimeout(() => { renderCart(); openCart(); }, 300);
        history.replaceState(null, '', window.location.pathname);
    }

    // Auto-open product modal if redirected from guide
    const openModalId = urlParams.get('produit');
    if (openModalId) {
        setTimeout(() => openModal(parseInt(openModalId)), 400);
        history.replaceState(null, '', window.location.pathname + window.location.hash);
    }

    function renderCart() {
        cartCount.textContent = cart.getCount();

        if (cart.isEmpty()) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            // Remove existing cart items but keep empty message
            cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
            return;
        }

        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';

        const itemsHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" referrerpolicy="no-referrer"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${escapeHTML(item.name)}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `).join('');

        // Remove old cart items
        cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
        // Insert new ones
        cartEmpty.insertAdjacentHTML('afterend', itemsHTML);

        const total = cart.getTotal();
        cartSubtotal.textContent = formatPrice(total);

        // Free shipping progress bar
        const FREE_SHIPPING_THRESHOLD = 29;
        let shippingBar = document.getElementById('cartShippingProgress');
        if (!shippingBar) {
            shippingBar = document.createElement('div');
            shippingBar.id = 'cartShippingProgress';
            shippingBar.className = 'cart-shipping-progress';
            const subtotalEl = document.querySelector('.cart-subtotal');
            if (subtotalEl) subtotalEl.parentNode.insertBefore(shippingBar, subtotalEl);
        }
        const remaining = FREE_SHIPPING_THRESHOLD - total;
        const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
        if (remaining > 0) {
            shippingBar.innerHTML = `<p>Plus que <strong>${formatPrice(remaining)}</strong> pour la livraison offerte !</p><div class="shipping-bar"><div class="shipping-bar-fill" style="width:${pct}%"></div></div>`;
        } else {
            shippingBar.innerHTML = `<p><strong>&#10003; Livraison offerte !</strong></p><div class="shipping-bar"><div class="shipping-bar-fill" style="width:100%"></div></div>`;
        }

        // Cross-sell suggestions
        renderCrossSell();

        // Smart bundle detection
        checkBundleMatch();
    }

    function renderCrossSell() {
        let csContainer = document.getElementById('cartCrossSell');
        if (!csContainer) {
            csContainer = document.createElement('div');
            csContainer.id = 'cartCrossSell';
            csContainer.className = 'cart-cross-sell';
            const cartFooterEl = document.getElementById('cartFooter');
            if (cartFooterEl) cartFooterEl.appendChild(csContainer);
        }

        if (cart.isEmpty() || typeof getCrossSellProducts !== 'function') {
            csContainer.style.display = 'none';
            return;
        }

        const suggestions = getCrossSellProducts(cart.items);
        if (suggestions.length === 0) {
            csContainer.style.display = 'none';
            return;
        }

        csContainer.style.display = 'block';
        csContainer.innerHTML = `
            <h4>${t('cart_cross_sell')}</h4>
            ${suggestions.map(p => `
                <div class="cross-sell-item">
                    <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" referrerpolicy="no-referrer">
                    <div class="cross-sell-info">
                        <div class="cs-name">${escapeHTML(p.name)}</div>
                        <div class="cs-price">${formatPrice(p.price)}</div>
                    </div>
                    <button class="cross-sell-add" onclick="addToCart(${p.id})">${t('btn_add_short')}</button>
                </div>
            `).join('')}
        `;
    }

    // --- Cart Actions (global) ---
    window.addToCart = function(productId) {
        var product = PRODUCTS.find(function(p) { return p.id === productId; });
        if (product) {
            cart.add(product);
            showToast(t('toast_added').replace('{name}', product.name));
        }
    };

    window.removeFromCart = function(productId) {
        cart.remove(productId);
    };

    window.updateCartQty = function(productId, qty) {
        if (qty < 1) {
            cart.remove(productId);
        } else {
            cart.updateQty(productId, qty);
        }
    };

    // --- Smart Bundle Detection ---
    function checkBundleMatch() {
        var container = document.getElementById('cartBundleSuggestion');
        if (!container) {
            container = document.createElement('div');
            container.id = 'cartBundleSuggestion';
            var shippingBar = document.getElementById('cartShippingProgress');
            if (shippingBar) shippingBar.insertAdjacentElement('afterend', container);
        }

        if (typeof BUNDLES === 'undefined' || cart.isEmpty()) {
            container.innerHTML = '';
            return;
        }

        var cartProductIds = cart.items
            .filter(function(item) { return typeof item.id === 'number'; })
            .map(function(item) { return item.id; });

        var suggestions = [];
        BUNDLES.forEach(function(bundle) {
            if (cart.items.some(function(item) { return item.id === 'bundle-' + bundle.key; })) return;
            if (!bundle.productIds.every(function(pid) { return cartProductIds.indexOf(pid) !== -1; })) return;
            var individualTotal = bundle.productIds.reduce(function(sum, pid) {
                var p = PRODUCTS.find(function(pr) { return pr.id === pid; });
                return sum + (p ? p.price : 0);
            }, 0);
            var savings = individualTotal - bundle.price;
            if (savings > 0) suggestions.push({ bundle: bundle, savings: savings, individualTotal: individualTotal });
        });

        if (suggestions.length === 0) { container.innerHTML = ''; return; }

        container.innerHTML = suggestions.map(function(s) {
            var bundleName = t('bundle_prefix') + ' ' + t('bundle_' + s.bundle.key + '_name');
            return '<div class="bundle-suggestion"><div class="bundle-suggestion-icon">&#127873;</div>' +
                '<div class="bundle-suggestion-text"><strong>' + bundleName + '</strong><br>' +
                t('bundle_match_text') + ' <span class="bundle-savings">' + t('bundle_save') + ' ' + formatPrice(s.savings) + '</span></div>' +
                '<button class="btn btn-primary btn-sm bundle-convert-btn" onclick="convertToBundle(\'' + s.bundle.key + '\')">' + formatPrice(s.bundle.price) + '</button></div>';
        }).join('');
    }

    window.convertToBundle = function(bundleKey) {
        var bundle = BUNDLES.find(function(b) { return b.key === bundleKey; });
        if (!bundle) return;
        var individualTotal = bundle.productIds.reduce(function(sum, pid) {
            var p = PRODUCTS.find(function(pr) { return pr.id === pid; });
            return sum + (p ? p.price : 0);
        }, 0);
        var savings = individualTotal - bundle.price;
        bundle.productIds.forEach(function(pid) {
            var item = cart.items.find(function(i) { return i.id === pid; });
            if (item) {
                if (item.qty > 1) item.qty -= 1;
                else cart.items = cart.items.filter(function(i) { return i.id !== pid; });
            }
        });
        var bundleName = t('bundle_prefix') + ' ' + t('bundle_' + bundle.key + '_name');
        var firstProduct = PRODUCTS.find(function(p) { return p.id === bundle.productIds[0]; });
        cart.items.push({ id: 'bundle-' + bundle.key, name: bundleName, price: bundle.price, image: firstProduct ? firstProduct.image : '', qty: 1 });
        cart.save();
        showToast(t('bundle_converted_toast') + ' -' + formatPrice(savings));
    };

    cart.onChange(function() { renderCart(); });

    // --- Checkout ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.isEmpty()) return;
            window.location.href = 'pages/checkout.html';
        });
    }

    // --- Newsletter ---
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var emailInput = newsletterForm.querySelector('input');
            var email = emailInput.value;
            var btn = newsletterForm.querySelector('button');
            var originalText = btn.textContent;
            btn.textContent = '...';
            btn.disabled = true;

            fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, lang: currentLang || 'fr' })
            }).then(function(resp) { return resp.json(); })
            .then(function(data) {
                showToast(data.success ? t('newsletter_success') : t('newsletter_error'));
            }).catch(function() {
                showToast(t('newsletter_error'), 'error');
            }).finally(function() {
                newsletterForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }

    // --- Toast Notification ---
    function showToast(message, type) {
        if (!type) type = '';
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.classList.add('show'); });
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    window.showToast = showToast;

    // --- Price formatter ---
    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + ' \u20ac';
    }

    window.formatPrice = formatPrice;

    // --- Scroll animations (IntersectionObserver — only for sections, not 500 cards) ---
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.02, rootMargin: '50px' });

    document.querySelectorAll('section.anim-fade-up, .fade-in:not(.product-card)').forEach(function(el) {
        observer.observe(el);
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Cookie Banner ---
    // REMPLACE par js/cookie-consent.js (bandeau granulaire CNIL)
    // L'ancien bandeau #cookieBanner est masque par cookie-consent.js

    // --- Initialize ---
    renderProducts();
    renderBestsellers();
    renderCart();
});
