// ============================
// ECLAT Beaute — Mega Menu Professionnel v2
// Desktop: full-width hover dropdown with categories + featured
// Mobile: accordion with expand/collapse subcategories
// Pattern: IIFE, 'use strict', var/function only
// ============================
(function() {
    'use strict';

    // ---------- Category Data ----------

    var CATEGORIES = [
        {
            key: 'soins-visage',
            label: 'Soins Visage',
            icon: '\u2728',
            subs: [
                { text: 'S\u00e9rums', slug: 'serums' },
                { text: 'Masques', slug: 'masques' },
                { text: 'Nettoyants', slug: 'nettoyants' },
                { text: 'Masques LED', slug: 'masques-led' },
                { text: 'Gua Sha & Rollers', slug: 'gua-sha-rollers' }
            ]
        },
        {
            key: 'cheveux',
            label: 'Cheveux',
            icon: '\uD83D\uDC87',
            subs: [
                { text: 'Brosses', slug: 'brosses' },
                { text: 'S\u00e9rums capillaires', slug: 'serums-capillaires' },
                { text: 'Accessoires cheveux', slug: 'accessoires-cheveux' },
                { text: 'Masques cheveux', slug: 'masques-cheveux' }
            ]
        },
        {
            key: 'corps-bien-etre',
            label: 'Corps & Bien-\u00eatre',
            icon: '\uD83E\uDDF4',
            subs: [
                { text: 'Gommages', slug: 'gommages' },
                { text: 'Huiles corps', slug: 'huiles-corps' },
                { text: 'Cr\u00e8mes hydratantes', slug: 'cremes-hydratantes' },
                { text: 'Anti-cellulite', slug: 'anti-cellulite' }
            ]
        },
        {
            key: 'homme',
            label: 'Homme',
            icon: '\uD83E\uDDD4',
            subs: [
                { text: 'Grooming', slug: 'grooming' },
                { text: 'Kit barbe', slug: 'kit-barbe' },
                { text: 'Skincare homme', slug: 'skincare-homme' }
            ]
        },
        {
            key: 'maquillage-outils',
            label: 'Maquillage & Outils',
            icon: '\uD83D\uDC84',
            subs: [
                { text: 'Pinceaux', slug: 'pinceaux' },
                { text: '\u00c9ponges', slug: 'eponges' },
                { text: 'Outils beaut\u00e9', slug: 'outils-beaute' }
            ]
        },
        {
            key: 'ongles',
            label: 'Ongles',
            icon: '\uD83D\uDC85',
            subs: [
                { text: 'Vernis', slug: 'vernis' },
                { text: 'Outils ongles', slug: 'outils-ongles' },
                { text: 'Nail art', slug: 'nail-art' },
                { text: 'Lampes UV/LED', slug: 'lampes-uv-led' }
            ]
        },
        {
            key: 'bien-etre',
            label: 'Bien-\u00eatre',
            icon: '\uD83E\uDDD8',
            subs: [
                { text: 'Aromath\u00e9rapie', slug: 'aromatherapie' },
                { text: 'Massage', slug: 'massage' },
                { text: 'Diffuseurs', slug: 'diffuseurs' },
                { text: 'Bombes bain', slug: 'bombes-bain' }
            ]
        },
        {
            key: 'accessoires',
            label: 'Accessoires',
            icon: '\uD83D\uDCBC',
            subs: [
                { text: 'Miroirs LED', slug: 'miroirs-led' },
                { text: 'Rangement', slug: 'rangement' },
                { text: 'Trousses', slug: 'trousses' }
            ]
        },
        {
            key: 'coffrets',
            label: 'Coffrets',
            icon: '\uD83C\uDF81',
            subs: [
                { text: 'Gift sets', slug: 'gift-sets' },
                { text: 'Bundles', slug: 'bundles' },
                { text: 'Coffrets d\u00e9couverte', slug: 'coffrets-decouverte' }
            ]
        }
    ];

    var FEATURED = {
        badge: 'Coup de c\u0153ur',
        name: 'Coffret Rituel \u00c9clat',
        price: '49,90\u00a0\u20ac',
        img: 'https://cf.cjdropshipping.com/quick/product/a1ae3177-fe09-43ca-8969-57c5a5475d07.jpg',
        href: '/pages/category.html?cat=coffrets&sub=gift-sets',
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

            if (text === 'boutique' || text === 'produits' || href === '#produits' || href === '#boutique') {
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
