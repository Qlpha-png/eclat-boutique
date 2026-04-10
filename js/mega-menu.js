// ============================
// ECLAT Beaute — Mega Menu Professionnel
// Desktop: hover dropdowns | Mobile: accordion
// Inject dynamically, inline styles, no CSS deps
// ============================
(function() {
    'use strict';

    var BOUTIQUE_COLS = [
        { key: 'visage', label: 'Visage', icon: '\u2728', links: [
            { text: 'Masques LED', href: '/pages/category.html?cat=visage&sub=masques-led' },
            { text: 'Gua Sha & Rollers', href: '/pages/category.html?cat=visage&sub=gua-sha-rollers' },
            { text: 'Nettoyage', href: '/pages/category.html?cat=visage&sub=nettoyage' },
            { text: 'EMS & Micro-courant', href: '/pages/category.html?cat=visage&sub=ems-micro-courant' },
            { text: 'S\u00e9rums & Cr\u00e8mes', href: '/pages/category.html?cat=visage&sub=serums-cremes' }
        ]},
        { key: 'corps', label: 'Corps', icon: '\ud83e\uddf4', links: [
            { text: 'Gommages', href: '/pages/category.html?cat=corps&sub=gommages' },
            { text: 'Cr\u00e8mes hydratantes', href: '/pages/category.html?cat=corps&sub=cremes-hydratantes' },
            { text: 'Huiles corps', href: '/pages/category.html?cat=corps&sub=huiles-corps' },
            { text: 'Anti-cellulite', href: '/pages/category.html?cat=corps&sub=anti-cellulite' }
        ]},
        { key: 'cheveux', label: 'Cheveux', icon: '\ud83d\udc87', links: [
            { text: 'S\u00e9rums capillaires', href: '/pages/category.html?cat=cheveux&sub=serums-capillaires' },
            { text: 'Masques cheveux', href: '/pages/category.html?cat=cheveux&sub=masques-cheveux' },
            { text: 'Brosses & Accessoires', href: '/pages/category.html?cat=cheveux&sub=brosses-accessoires' },
            { text: 'Protecteur chaleur', href: '/pages/category.html?cat=cheveux&sub=protecteur-chaleur' }
        ]},
        { key: 'ongles', label: 'Ongles', icon: '\ud83d\udc85', links: [
            { text: 'Lampes UV/LED', href: '/pages/category.html?cat=ongles&sub=lampes-uv-led' },
            { text: 'Gel semi-permanent', href: '/pages/category.html?cat=ongles&sub=gel-semi-permanent' },
            { text: 'Nail art', href: '/pages/category.html?cat=ongles&sub=nail-art' },
            { text: 'Kits complets', href: '/pages/category.html?cat=ongles&sub=kits-complets' }
        ]},
        { key: 'homme', label: 'Homme', icon: '\ud83e\uddd4', links: [
            { text: 'Kit barbe', href: '/pages/category.html?cat=homme&sub=kit-barbe' },
            { text: 'Skincare homme', href: '/pages/category.html?cat=homme&sub=skincare-homme' },
            { text: 'Grooming', href: '/pages/category.html?cat=homme&sub=grooming' }
        ]},
        { key: 'bienetre', label: 'Bien-\u00eatre', icon: '\ud83e\uddd8', links: [
            { text: 'Huiles essentielles', href: '/pages/category.html?cat=bienetre&sub=huiles-essentielles' },
            { text: 'Diffuseurs', href: '/pages/category.html?cat=bienetre&sub=diffuseurs' },
            { text: 'Bombes bain', href: '/pages/category.html?cat=bienetre&sub=bombes-bain' },
            { text: 'Relaxation', href: '/pages/category.html?cat=bienetre&sub=relaxation' }
        ]},
        { key: 'accessoires', label: 'Accessoires', icon: '\ud83c\udf81', links: [
            { text: 'Coffrets cadeaux', href: '/pages/category.html?cat=accessoires&sub=coffrets' },
            { text: 'Trousses & rangement', href: '/pages/category.html?cat=accessoires&sub=trousses' },
            { text: 'Miroirs LED', href: '/pages/category.html?cat=accessoires&sub=miroirs-led' }
        ]}
    ];

    var BEAUTE_LINKS = [
        { text: '\ud83d\udcca Diagnostic Beaut\u00e9', href: '/pages/diagnostic.html', desc: 'Trouvez votre routine id\u00e9ale' },
        { text: '\ud83e\uddea Guide scientifique', href: '/pages/guide-beaute.html', desc: 'Ingr\u00e9dients & principes actifs' },
        { text: '\ud83e\uddf4 Routine Builder', href: '/pages/routine-builder.html', desc: 'Construisez votre routine pas \u00e0 pas' },
        { text: '\ud83d\udcdd Blog Beaut\u00e9', href: '/pages/blog.html', desc: 'Tendances, astuces et conseils' }
    ];

    // ---------- Style injection (all inline, no CSS file needed) ----------

    var PANEL_STYLES = {
        panel: 'position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(8px);' +
            'width:min(820px,92vw);background:#fff;border-radius:14px;' +
            'box-shadow:0 16px 48px rgba(0,0,0,0.13),0 2px 8px rgba(0,0,0,0.06);' +
            'padding:28px 24px 20px;opacity:0;visibility:hidden;pointer-events:none;' +
            'transition:opacity 0.25s ease,transform 0.25s ease,visibility 0.25s;z-index:1050;',
        panelOpen: 'opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0);',
        grid: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(135px,1fr));gap:18px;',
        colTitle: 'display:flex;align-items:center;gap:5px;font-weight:600;font-size:0.88rem;' +
            'color:#2d2926;text-decoration:none;margin-bottom:8px;padding-bottom:6px;' +
            'border-bottom:1px solid #eee;',
        colTitleHover: 'color:#c9a87c;',
        subLink: 'display:block;padding:3px 0;font-size:0.8rem;color:#777;text-decoration:none;' +
            'transition:color 0.18s;line-height:1.6;',
        subLinkHover: 'color:#c9a87c;',
        beauteGrid: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;',
        beauteCard: 'display:block;padding:14px 16px;border-radius:10px;text-decoration:none;' +
            'background:linear-gradient(135deg,rgba(201,168,124,0.06),rgba(201,168,124,0.02));' +
            'border:1px solid rgba(201,168,124,0.15);transition:border-color 0.2s,box-shadow 0.2s;',
        beauteCardHover: 'border-color:rgba(201,168,124,0.4);box-shadow:0 2px 12px rgba(201,168,124,0.1);',
        beauteTitle: 'font-weight:600;font-size:0.88rem;color:#2d2926;margin-bottom:3px;',
        beauteDesc: 'font-size:0.78rem;color:#999;line-height:1.4;',
        // Mobile accordion
        mobilePanel: 'position:static;transform:none;width:100%;box-shadow:none;border-radius:0;' +
            'padding:0;max-height:0;overflow:hidden;transition:max-height 0.35s ease;' +
            'opacity:1;visibility:visible;pointer-events:auto;',
        mobilePanelOpen: 'max-height:2000px;',
        mobileGrid: 'display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 8px;'
    };

    // ---------- Helpers ----------

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function applyHoverStyle(el, normalCSS, hoverCSS) {
        el.addEventListener('mouseenter', function() {
            var parts = hoverCSS.split(';');
            for (var i = 0; i < parts.length; i++) {
                var kv = parts[i].split(':');
                if (kv.length === 2) el.style[kv[0].trim()] = kv[1].trim();
            }
        });
        el.addEventListener('mouseleave', function() {
            el.style.cssText = normalCSS;
        });
    }

    // ---------- Build panels ----------

    function buildBoutiquePanel() {
        var panel = document.createElement('div');
        panel.className = 'eclat-mega-panel eclat-mega-boutique';
        panel.setAttribute('data-mega', 'boutique');
        panel.style.cssText = PANEL_STYLES.panel;

        var grid = document.createElement('div');
        grid.style.cssText = PANEL_STYLES.grid;

        for (var c = 0; c < BOUTIQUE_COLS.length; c++) {
            var col = BOUTIQUE_COLS[c];
            var colDiv = document.createElement('div');

            var title = document.createElement('a');
            title.href = '/pages/category.html?cat=' + col.key;
            title.style.cssText = PANEL_STYLES.colTitle;
            title.innerHTML = '<span style="font-size:1.05rem;">' + col.icon + '</span> ' + col.label;
            applyHoverStyle(title, PANEL_STYLES.colTitle, PANEL_STYLES.colTitleHover);
            colDiv.appendChild(title);

            var ul = document.createElement('ul');
            ul.style.cssText = 'list-style:none;padding:0;margin:0;';
            for (var l = 0; l < col.links.length; l++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = col.links[l].href;
                a.textContent = col.links[l].text;
                a.style.cssText = PANEL_STYLES.subLink;
                applyHoverStyle(a, PANEL_STYLES.subLink, PANEL_STYLES.subLinkHover);
                li.appendChild(a);
                ul.appendChild(li);
            }
            colDiv.appendChild(ul);
            grid.appendChild(colDiv);
        }

        panel.appendChild(grid);
        return panel;
    }

    function buildBeautePanel() {
        var panel = document.createElement('div');
        panel.className = 'eclat-mega-panel eclat-mega-beaute';
        panel.setAttribute('data-mega', 'beaute');
        panel.style.cssText = PANEL_STYLES.panel;

        var grid = document.createElement('div');
        grid.style.cssText = PANEL_STYLES.beauteGrid;

        for (var i = 0; i < BEAUTE_LINKS.length; i++) {
            var item = BEAUTE_LINKS[i];
            var card = document.createElement('a');
            card.href = item.href;
            card.style.cssText = PANEL_STYLES.beauteCard;
            applyHoverStyle(card, PANEL_STYLES.beauteCard, PANEL_STYLES.beauteCardHover);

            var titleDiv = document.createElement('div');
            titleDiv.style.cssText = PANEL_STYLES.beauteTitle;
            titleDiv.textContent = item.text;

            var descDiv = document.createElement('div');
            descDiv.style.cssText = PANEL_STYLES.beauteDesc;
            descDiv.textContent = item.desc;

            card.appendChild(titleDiv);
            card.appendChild(descDiv);
            grid.appendChild(card);
        }

        panel.appendChild(grid);
        return panel;
    }

    // ---------- Core logic ----------

    var openPanel = null;
    var hideTimer = null;

    function closeAllPanels() {
        var panels = document.querySelectorAll('.eclat-mega-panel');
        for (var i = 0; i < panels.length; i++) {
            if (isMobile()) {
                panels[i].style.maxHeight = '0';
            } else {
                panels[i].style.cssText = PANEL_STYLES.panel;
            }
        }
        openPanel = null;
    }

    function openPanelFor(panel) {
        closeAllPanels();
        if (isMobile()) {
            panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
        } else {
            panel.style.cssText = PANEL_STYLES.panel + PANEL_STYLES.panelOpen;
        }
        openPanel = panel;
    }

    function togglePanelMobile(panel) {
        if (openPanel === panel) {
            closeAllPanels();
        } else {
            openPanelFor(panel);
        }
    }

    function attachDesktopHover(li, panel) {
        li.addEventListener('mouseenter', function() {
            clearTimeout(hideTimer);
            if (!isMobile()) openPanelFor(panel);
        });
        li.addEventListener('mouseleave', function() {
            if (!isMobile()) {
                hideTimer = setTimeout(function() { closeAllPanels(); }, 220);
            }
        });
        panel.addEventListener('mouseenter', function() {
            clearTimeout(hideTimer);
        });
        panel.addEventListener('mouseleave', function() {
            if (!isMobile()) {
                hideTimer = setTimeout(function() { closeAllPanels(); }, 220);
            }
        });
    }

    function attachMobileTap(link, panel) {
        link.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                togglePanelMobile(panel);
            }
        });
    }

    function applyMobileStyles() {
        var panels = document.querySelectorAll('.eclat-mega-panel');
        for (var i = 0; i < panels.length; i++) {
            if (isMobile()) {
                panels[i].style.cssText = PANEL_STYLES.mobilePanel;
                var innerGrid = panels[i].firstElementChild;
                if (innerGrid) innerGrid.style.cssText = PANEL_STYLES.mobileGrid;
            } else {
                panels[i].style.cssText = PANEL_STYLES.panel;
                var innerGrid2 = panels[i].firstElementChild;
                if (innerGrid2) {
                    var mega = panels[i].getAttribute('data-mega');
                    innerGrid2.style.cssText = (mega === 'beaute') ? PANEL_STYLES.beauteGrid : PANEL_STYLES.grid;
                }
            }
        }
        openPanel = null;
    }

    // ---------- Init ----------

    function init() {
        var navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        var items = navLinks.querySelectorAll('li');
        var boutiqueItem = null;
        var beauteItem = null;

        for (var i = 0; i < items.length; i++) {
            var a = items[i].querySelector('a');
            if (!a) continue;
            var text = a.textContent.trim().toLowerCase();
            var href = (a.getAttribute('href') || '').toLowerCase();

            if (text === 'produits' || text === 'boutique' || href === '#produits') {
                boutiqueItem = items[i];
            }
            if (text === 'beaut\u00e9' || text === 'beaute' || href === '#beaute'
                || href.indexOf('diagnostic') !== -1 || href.indexOf('guide') !== -1) {
                beauteItem = items[i];
            }
        }

        // Build and attach boutique panel
        if (boutiqueItem) {
            boutiqueItem.style.position = 'relative';
            var boutiquePanel = buildBoutiquePanel();
            boutiqueItem.appendChild(boutiquePanel);
            attachDesktopHover(boutiqueItem, boutiquePanel);
            attachMobileTap(boutiqueItem.querySelector('a'), boutiquePanel);
        }

        // Build and attach beaute panel (if link exists)
        if (beauteItem && beauteItem !== boutiqueItem) {
            beauteItem.style.position = 'relative';
            var beautePanel = buildBeautePanel();
            beauteItem.appendChild(beautePanel);
            attachDesktopHover(beauteItem, beautePanel);
            attachMobileTap(beauteItem.querySelector('a'), beautePanel);
        }

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!openPanel) return;
            var clickedInside = false;
            var panels = document.querySelectorAll('.eclat-mega-panel');
            for (var p = 0; p < panels.length; p++) {
                if (panels[p].contains(e.target) || panels[p].parentElement.contains(e.target)) {
                    clickedInside = true;
                    break;
                }
            }
            if (!clickedInside) closeAllPanels();
        });

        // Responsive switch
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(applyMobileStyles, 150);
        });

        // Apply initial mobile styles if needed
        if (isMobile()) applyMobileStyles();
    }

    // ---------- Expose & auto-init ----------

    window.MegaMenu = {
        init: init
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
