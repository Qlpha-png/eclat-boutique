// ============================
// Maison Eclat — Mega Menu Professionnel v2
// Desktop: full-width hover dropdown with categories + featured
// Mobile: accordion with expand/collapse subcategories
// Pattern: IIFE, 'use strict', var/function only
// ============================
(function() {
    'use strict';

    // ---------- Category Data ----------

    var CATEGORIES = [
        {
            key: 'visage',
            label: 'Soins Visage',
            icon: '\u2728',
            subs: [
                { text: 'Cr\u00e8mes', slug: 'creme' },
                { text: 'D\u00e9maquillants', slug: 'demaquillant' },
                { text: 'Exfoliants', slug: 'exfoliant' },
                { text: 'Masques', slug: 'masque' },
                { text: 'Lotions', slug: 'lotion' },
                { text: 'Contour des yeux', slug: 'contour-yeux' },
                { text: 'Solaire', slug: 'solaire' },
                { text: 'Eau micellaire', slug: 'eau-micellaire' }
            ]
        },
        {
            key: 'soin',
            label: 'S\u00e9rums',
            icon: '\uD83E\uDDEA',
            subs: [
                { text: 'S\u00e9rums visage', slug: 'serum' },
                { text: 'S\u00e9rums \u00e9clat', slug: 'serum-eclat' },
                { text: 'S\u00e9rums anti-\u00e2ge', slug: 'serum-antiage' },
                { text: 'S\u00e9rums collag\u00e8ne', slug: 'serum-collagene' },
                { text: 'S\u00e9rums peptides', slug: 'serum-peptide' }
            ]
        },
        {
            key: 'cheveux',
            label: 'Cheveux',
            icon: '\uD83D\uDC87',
            subs: [
                { text: 'Shampoings', slug: 'shampoing' },
                { text: 'Apr\u00e8s-shampoings', slug: 'apres-shampoing' },
                { text: 'Soins cuir chevelu', slug: 'soin-cuir-chevelu' },
                { text: 'Soins sans rin\u00e7age', slug: 'soin-sans-rincage' },
                { text: 'Soins k\u00e9ratine', slug: 'soin-keratine' },
                { text: 'Masques capillaires', slug: 'masque-capillaire' },
                { text: 'S\u00e9rums capillaires', slug: 'serum-capillaire' },
                { text: 'Bigoudis', slug: 'bigoudi' }
            ]
        },
        {
            key: 'outils',
            label: 'Outils Beaut\u00e9',
            icon: '\uD83D\uDC86',
            subs: [
                { text: 'Gua Sha', slug: 'gua-sha' },
                { text: 'Aspirateurs pores', slug: 'aspirateur-pores' },
                { text: 'Derma rollers', slug: 'derma-roller' },
                { text: 'Rouleaux glace', slug: 'rouleau-glace' },
                { text: 'Appareils visage', slug: 'appareil-visage' }
            ]
        },
        {
            key: 'corps',
            label: 'Corps',
            icon: '\uD83E\uDDF4',
            subs: [
                { text: 'Laits corps', slug: 'lait-corps' },
                { text: 'Anti-vergetures', slug: 'anti-vergetures' },
                { text: 'Gommages corps', slug: 'gommage-corps' },
                { text: 'Gels douche', slug: 'gel-douche' },
                { text: 'Cr\u00e8mes corps', slug: 'creme-corps' }
            ]
        },
        {
            key: 'homme',
            label: 'Homme',
            icon: '\uD83E\uDDD4',
            subs: [
                { text: 'Rasage', slug: 'rasage' },
                { text: 'Kits barbe', slug: 'kit-barbe' },
                { text: 'Apr\u00e8s-rasage', slug: 'apres-rasage' },
                { text: 'Soins homme', slug: 'soin-homme' }
            ]
        },
        {
            key: 'ongles',
            label: 'Ongles',
            icon: '\uD83D\uDC85',
            subs: [
                { text: 'Lampes UV', slug: 'lampe-uv' },
                { text: 'Vernis', slug: 'vernis' },
                { text: 'Faux ongles', slug: 'faux-ongles' },
                { text: 'Nail art', slug: 'nail-art' }
            ]
        },
        {
            key: 'aromatherapie',
            label: 'Bien-\u00eatre',
            icon: '\uD83E\uDDD8',
            subs: [
                { text: 'Diffuseurs', slug: 'diffuseur' },
                { text: 'Bombes de bain', slug: 'bombe-bain' },
                { text: 'Huiles essentielles', slug: 'huile-essentielle' }
            ]
        },
        {
            key: 'accessoire',
            label: 'Accessoires',
            icon: '\uD83D\uDCBC',
            subs: [
                { text: 'Bonnets satin', slug: 'bonnet-satin' },
                { text: 'Chouchous', slug: 'chouchou' }
            ]
        }
    ];

    var FEATURED = {
        badge: 'Coup de c\u0153ur',
        name: 'Masque LED Pro 7 Couleurs',
        price: '39,90\u00a0\u20ac',
        img: '/api/img?url=' + encodeURIComponent('https://oss-cf.cjdropshipping.com/product/2025/12/02/07/52018798-4e16-43fe-8e02-f280acf86442_trans.jpeg'),
        href: '/pages/product.html?id=1',
        cta: 'D\u00e9couvrir'
    };

    // ---------- Helpers ----------

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function escapeAttr(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---------- Build HTML ----------

    function buildCategoryColumn(cat) {
        var html = '';
        html += '<div class="mega-menu-col" data-cat="' + escapeAttr(cat.key) + '">';
        html += '  <a href="/pages/category.html?cat=' + escapeAttr(cat.key) + '" class="mega-menu-col__header">';
        html += '    <span class="mega-menu-col__icon">' + cat.icon + '</span>';
        html += '    <span>' + escapeAttr(cat.label) + '</span>';
        html += '  </a>';
        html += '  <ul class="mega-menu-col__links">';
        for (var i = 0; i < cat.subs.length; i++) {
            var sub = cat.subs[i];
            html += '    <li><a href="/pages/category.html?cat=' + escapeAttr(cat.key) + '&sub=' + escapeAttr(sub.slug) + '">' + escapeAttr(sub.text) + '</a></li>';
        }
        html += '  </ul>';
        html += '  <a href="/pages/category.html?cat=' + escapeAttr(cat.key) + '" class="mega-menu-col__viewall">Tout voir &rarr;</a>';
        html += '</div>';
        return html;
    }

    function buildFeaturedSection() {
        var f = FEATURED;
        var html = '';
        html += '<div class="mega-menu-featured">';
        html += '  <span class="mega-menu-featured__badge">' + escapeAttr(f.badge) + '</span>';
        html += '  <img class="mega-menu-featured__img" src="' + escapeAttr(f.img) + '" alt="' + escapeAttr(f.name) + '" width="280" height="280" loading="lazy">';
        html += '  <div class="mega-menu-featured__content">';
        html += '    <div class="mega-menu-featured__name">' + escapeAttr(f.name) + '</div>';
        html += '    <div class="mega-menu-featured__price">' + escapeAttr(f.price) + '</div>';
        html += '    <a href="' + escapeAttr(f.href) + '" class="mega-menu-featured__cta">' + escapeAttr(f.cta) + '</a>';
        html += '  </div>';
        html += '</div>';
        return html;
    }

    function buildMegaMenuHTML() {
        var html = '';
        html += '<div class="mega-menu" id="megaMenu">';
        html += '  <div class="mega-menu-inner container">';
        html += '    <div class="mega-menu-categories">';
        for (var i = 0; i < CATEGORIES.length; i++) {
            html += buildCategoryColumn(CATEGORIES[i]);
        }
        html += '    </div>';
        html += buildFeaturedSection();
        html += '  </div>';
        html += '</div>';
        return html;
    }

    // ---------- State ----------

    var megaMenuEl = null;
    var triggerLi = null;
    var triggerLink = null;
    var closeTimer = null;
    var isOpen = false;

    // ---------- Open / Close ----------

    function openMenu() {
        if (!megaMenuEl) return;
        clearTimeout(closeTimer);
        megaMenuEl.classList.add('mega-menu--open');
        if (triggerLi) {
            triggerLi.classList.add('mega-menu-trigger--active');
        }
        isOpen = true;
    }

    function closeMenu() {
        if (!megaMenuEl) return;
        megaMenuEl.classList.remove('mega-menu--open');
        if (triggerLi) {
            triggerLi.classList.remove('mega-menu-trigger--active');
        }
        isOpen = false;
        // Also collapse any open mobile accordions
        if (isMobile()) {
            var expanded = megaMenuEl.querySelectorAll('.mega-menu-col--expanded');
            for (var i = 0; i < expanded.length; i++) {
                expanded[i].classList.remove('mega-menu-col--expanded');
            }
        }
    }

    function closeMenuDelayed() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function() {
            closeMenu();
        }, 200);
    }

    function cancelClose() {
        clearTimeout(closeTimer);
    }

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // ---------- Mobile Accordion ----------

    function handleCategoryClick(e) {
        if (!isMobile()) return;

        var header = e.target.closest('.mega-menu-col__header');
        if (!header) return;

        e.preventDefault();
        e.stopPropagation();

        var col = header.closest('.mega-menu-col');
        if (!col) return;

        var wasExpanded = col.classList.contains('mega-menu-col--expanded');

        // Collapse all other categories
        var allCols = megaMenuEl.querySelectorAll('.mega-menu-col');
        for (var i = 0; i < allCols.length; i++) {
            allCols[i].classList.remove('mega-menu-col--expanded');
        }

        // Toggle clicked category
        if (!wasExpanded) {
            col.classList.add('mega-menu-col--expanded');
        }
    }

    // ---------- Event Binding ----------

    function bindDesktopEvents() {
        if (!triggerLi || !megaMenuEl) return;

        triggerLi.addEventListener('mouseenter', function() {
            if (isMobile()) return;
            cancelClose();
            openMenu();
        });

        triggerLi.addEventListener('mouseleave', function() {
            if (isMobile()) return;
            closeMenuDelayed();
        });

        megaMenuEl.addEventListener('mouseenter', function() {
            if (isMobile()) return;
            cancelClose();
        });

        megaMenuEl.addEventListener('mouseleave', function() {
            if (isMobile()) return;
            closeMenuDelayed();
        });
    }

    function bindMobileEvents() {
        if (!triggerLink || !megaMenuEl) return;

        triggerLink.addEventListener('click', function(e) {
            if (!isMobile()) return;
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        megaMenuEl.addEventListener('click', handleCategoryClick);
    }

    function bindOutsideClick() {
        document.addEventListener('click', function(e) {
            if (!isOpen) return;
            if (!megaMenuEl) return;
            if (triggerLi && triggerLi.contains(e.target)) return;
            if (megaMenuEl.contains(e.target)) return;
            closeMenu();
        });
    }

    function bindKeyboard() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
                if (triggerLink) {
                    triggerLink.focus();
                }
            }
        });
    }

    function bindResize() {
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Close menu on orientation/mode change to reset state cleanly
                if (isOpen) {
                    closeMenu();
                }
            }, 200);
        });
    }

    // ---------- Find Trigger Link ----------

    function findBoutiqueTrigger() {
        var navLinks = document.getElementById('navLinks');
        if (!navLinks) return null;

        var items = navLinks.querySelectorAll('li');
        for (var i = 0; i < items.length; i++) {
            var a = items[i].querySelector('a');
            if (!a) continue;
            var text = a.textContent.trim().toLowerCase();
            var href = (a.getAttribute('href') || '').toLowerCase();

            if (text === 'boutique' || text === 'produits' || href.indexOf('category.html') !== -1 || href === '#boutique') {
                return items[i];
            }
        }
        return null;
    }

    // ---------- Inject Into DOM ----------

    function injectMegaMenu() {
        triggerLi = findBoutiqueTrigger();
        if (!triggerLi) return false;

        triggerLink = triggerLi.querySelector('a');
        triggerLi.classList.add('mega-menu-trigger');

        // Remove any previously injected mega menu
        var existing = document.getElementById('megaMenu');
        if (existing) {
            existing.parentNode.removeChild(existing);
        }

        // Build and inject the HTML
        var menuHTML = buildMegaMenuHTML();

        // On desktop, append to navbar; on mobile, append after trigger link inside li
        var navbar = document.querySelector('.navbar');
        if (navbar) {
            // Insert a wrapper div for the HTML
            var temp = document.createElement('div');
            temp.innerHTML = menuHTML;
            megaMenuEl = temp.firstElementChild;
            navbar.appendChild(megaMenuEl);
        } else {
            // Fallback: append to trigger li
            var temp2 = document.createElement('div');
            temp2.innerHTML = menuHTML;
            megaMenuEl = temp2.firstElementChild;
            triggerLi.appendChild(megaMenuEl);
        }

        return true;
    }

    // ---------- Init ----------

    function init() {
        var success = injectMegaMenu();
        if (!success) return;

        bindDesktopEvents();
        bindMobileEvents();
        bindOutsideClick();
        bindKeyboard();
        bindResize();
    }

    // ---------- Public API ----------

    window.MegaMenu = {
        init: init,
        open: openMenu,
        close: closeMenu
    };

    // ---------- Auto-init ----------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
