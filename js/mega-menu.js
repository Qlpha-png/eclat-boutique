// ============================
// Maison Eclat — Mega Menu Produits v5
// Full-width dropdown — fixed position, display toggle
// ============================
(function() {
    'use strict';

    var CATEGORIES = [
        {
            key: 'visage', label: 'Soins Visage', icon: '\u2728', count: 159,
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
            key: 'soin', label: 'S\u00e9rums', icon: '\uD83E\uDDEA', count: 43,
            subs: [
                { text: 'S\u00e9rums visage', slug: 'serum' },
                { text: 'S\u00e9rums \u00e9clat', slug: 'serum-eclat' },
                { text: 'Anti-\u00e2ge', slug: 'serum-antiage' },
                { text: 'Collag\u00e8ne', slug: 'serum-collagene' },
                { text: 'Peptides', slug: 'serum-peptide' }
            ]
        },
        {
            key: 'cheveux', label: 'Cheveux', icon: '\uD83D\uDC87', count: 84,
            subs: [
                { text: 'Shampoings', slug: 'shampoing' },
                { text: 'Apr\u00e8s-shampoings', slug: 'apres-shampoing' },
                { text: 'Cuir chevelu', slug: 'soin-cuir-chevelu' },
                { text: 'Sans rin\u00e7age', slug: 'soin-sans-rincage' },
                { text: 'K\u00e9ratine', slug: 'soin-keratine' },
                { text: 'Masques capillaires', slug: 'masque-capillaire' },
                { text: 'S\u00e9rums capillaires', slug: 'serum-capillaire' },
                { text: 'Bigoudis', slug: 'bigoudi' }
            ]
        },
        {
            key: 'outils', label: 'Outils Beaut\u00e9', icon: '\uD83D\uDC86', count: 64,
            subs: [
                { text: 'Gua Sha', slug: 'gua-sha' },
                { text: 'Aspirateurs pores', slug: 'aspirateur-pores' },
                { text: 'Derma rollers', slug: 'derma-roller' },
                { text: 'Rouleaux glace', slug: 'rouleau-glace' },
                { text: 'Appareils visage', slug: 'appareil-visage' }
            ]
        },
        {
            key: 'corps', label: 'Corps', icon: '\uD83E\uDDF4', count: 36,
            subs: [
                { text: 'Laits corps', slug: 'lait-corps' },
                { text: 'Anti-vergetures', slug: 'anti-vergetures' },
                { text: 'Gommages', slug: 'gommage-corps' },
                { text: 'Gels douche', slug: 'gel-douche' }
            ]
        },
        {
            key: 'homme', label: 'Homme', icon: '\uD83E\uDDD4', count: 43,
            subs: [
                { text: 'Rasage', slug: 'rasage' },
                { text: 'Kits barbe', slug: 'kit-barbe' },
                { text: 'Apr\u00e8s-rasage', slug: 'apres-rasage' },
                { text: 'Soins homme', slug: 'soin-homme' }
            ]
        },
        {
            key: 'ongles', label: 'Ongles', icon: '\uD83D\uDC85', count: 37,
            subs: [
                { text: 'Lampes UV', slug: 'lampe-uv' },
                { text: 'Vernis', slug: 'vernis' },
                { text: 'Faux ongles', slug: 'faux-ongles' },
                { text: 'Nail art', slug: 'nail-art' }
            ]
        },
        {
            key: 'aromatherapie', label: 'Bien-\u00eatre', icon: '\uD83E\uDDD8', count: 32,
            subs: [
                { text: 'Diffuseurs', slug: 'diffuseur' },
                { text: 'Bombes de bain', slug: 'bombe-bain' },
                { text: 'Huiles essentielles', slug: 'huile-essentielle' }
            ]
        },
        {
            key: 'accessoire', label: 'Accessoires', icon: '\uD83D\uDCBC', count: 19,
            subs: [
                { text: 'Bonnets satin', slug: 'bonnet-satin' },
                { text: 'Chouchous', slug: 'chouchou' }
            ]
        }
    ];

    var megaEl = null;
    var overlayEl = null;
    var triggerLink = null;
    var parentLi = null;
    var isOpen = false;
    var closeTimer = null;

    function injectCSS() {
        if (document.getElementById('eclat-mega-css-v9')) return;
        // Remove any old mega CSS tags
        var oldTags = document.querySelectorAll('style[id^="eclat-mega-css"]');
        for (var i = 0; i < oldTags.length; i++) oldTags[i].remove();
        var s = document.createElement('style');
        s.id = 'eclat-mega-css-v9';
        s.textContent = [
            // Overlay
            '#eclat-mega-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9998;background:rgba(0,0,0,0.18);display:none;pointer-events:auto;}',
            // Container — fixed, centered below navbar, with invisible bridge on top to prevent hover gap
            '#eclat-mega-panel{position:fixed;top:0;left:50%;z-index:9999;width:920px;max-width:calc(100vw - 24px);transform:translateX(-50%);background:#fff;border:1px solid #e8e0d8;border-radius:0 0 14px 14px;box-shadow:0 12px 48px rgba(0,0,0,0.14);padding:24px 28px 20px;display:none;}',
            '#eclat-mega-panel::before{content:"";position:absolute;top:-20px;left:0;right:0;height:20px;}',
            // Hamburger icon on Produits link via ::after (immune to i18n text replacement)
            'a.eclat-mega-trigger::after{content:"\\2630";display:inline-block;margin-left:4px;font-size:0.7em;vertical-align:1px;line-height:1;transition:opacity .2s;}',
            'a.eclat-mega-trigger.eclat-mega-open::after{content:"\\2715";font-size:0.65em;}',
            // Grid
            '#eclat-mega-panel .mg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px 28px;}',
            // Category block
            '#eclat-mega-panel .mg-cat{padding:8px 0;}',
            '#eclat-mega-panel .mg-head{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;text-decoration:none;color:#2d2926;font-weight:700;font-size:0.9rem;transition:background .15s;}',
            '#eclat-mega-panel .mg-head:hover{background:#faf5f0;}',
            '#eclat-mega-panel .mg-icon{font-size:1.15rem;width:22px;text-align:center;}',
            '#eclat-mega-panel .mg-count{font-size:0.7rem;color:#9a918a;font-weight:400;margin-left:2px;}',
            // Sub links
            '#eclat-mega-panel .mg-subs{list-style:none;margin:2px 0 0;padding:0 0 0 30px;}',
            '#eclat-mega-panel .mg-subs li{margin:0;}',
            '#eclat-mega-panel .mg-subs a{display:block;padding:3px 8px;font-size:0.82rem;color:#6b6560;text-decoration:none;border-radius:4px;transition:color .15s,background .15s;}',
            '#eclat-mega-panel .mg-subs a:hover{color:#2d2926;background:#faf5f0;}',
            // Footer
            '#eclat-mega-panel .mg-foot{margin-top:14px;padding-top:12px;border-top:1px solid #e8e0d8;text-align:center;}',
            '#eclat-mega-panel .mg-foot a{display:inline-flex;align-items:center;gap:8px;padding:8px 24px;font-size:0.9rem;font-weight:600;color:#fff;background:#2d2926;text-decoration:none;border-radius:8px;transition:opacity .15s;}',
            '#eclat-mega-panel .mg-foot a:hover{opacity:0.85;}',
            // Mobile
            '@media(max-width:768px){#eclat-mega-panel{left:8px;right:8px;width:auto;max-height:calc(100vh - 72px);overflow-y:auto;transform:none;border-radius:0 0 12px 12px;}#eclat-mega-panel .mg-grid{grid-template-columns:1fr 1fr;gap:0 16px;}}',
            '@media(max-width:480px){#eclat-mega-panel .mg-grid{grid-template-columns:1fr;}}'
        ].join('\n');
        document.head.appendChild(s);
    }

    function esc(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function buildPanel() {
        // Overlay
        var overlay = document.createElement('div');
        overlay.id = 'eclat-mega-overlay';
        overlay.addEventListener('click', close);
        document.body.appendChild(overlay);

        // Panel
        var panel = document.createElement('div');
        panel.id = 'eclat-mega-panel';

        var html = '<div class="mg-grid">';
        for (var i = 0; i < CATEGORIES.length; i++) {
            var c = CATEGORIES[i];
            html += '<div class="mg-cat">';
            html += '<a href="/pages/category.html?cat=' + esc(c.key) + '" class="mg-head">';
            html += '<span class="mg-icon">' + c.icon + '</span>';
            html += '<span>' + esc(c.label) + '</span>';
            html += '<span class="mg-count">(' + c.count + ')</span>';
            html += '</a>';
            if (c.subs && c.subs.length > 0) {
                html += '<ul class="mg-subs">';
                for (var j = 0; j < c.subs.length; j++) {
                    html += '<li><a href="/pages/category.html?cat=' + esc(c.key) + '&sub=' + esc(c.subs[j].slug) + '">' + esc(c.subs[j].text) + '</a></li>';
                }
                html += '</ul>';
            }
            html += '</div>';
        }
        html += '</div>';
        html += '<div class="mg-foot">';
        html += '<a href="/pages/category.html">\uD83D\uDCE6 Voir les 515 produits</a>';
        html += '</div>';

        panel.innerHTML = html;
        document.body.appendChild(panel);

        return { panel: panel, overlay: overlay };
    }

    function positionPanel() {
        if (!megaEl || !triggerLink) return;
        var nav = triggerLink.closest('header') || triggerLink.closest('nav');
        if (nav) {
            var rect = nav.getBoundingClientRect();
            megaEl.style.top = rect.bottom + 'px';
            // Overlay starts below navbar so it doesn't intercept hover on nav links
            if (overlayEl) overlayEl.style.top = rect.bottom + 'px';
        }
    }

    function cancelClose() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }

    function open() {
        cancelClose();
        if (!megaEl || isOpen) return;
        positionPanel();
        megaEl.style.display = 'block';
        if (overlayEl) overlayEl.style.display = 'block';
        if (triggerLink) triggerLink.classList.add('eclat-mega-open');
        isOpen = true;
    }

    function close() {
        cancelClose();
        if (!megaEl || !isOpen) return;
        megaEl.style.display = 'none';
        if (overlayEl) overlayEl.style.display = 'none';
        if (triggerLink) triggerLink.classList.remove('eclat-mega-open');
        isOpen = false;
    }

    function scheduleClose() {
        cancelClose();
        closeTimer = setTimeout(function() {
            if (megaEl && megaEl.matches(':hover')) return;
            if (parentLi && parentLi.matches(':hover')) return;
            close();
        }, 500);
    }

    function init() {
        injectCSS();

        // Find "Produits" link in navbar
        var links = document.querySelectorAll('nav a, .navbar a, header a');
        for (var i = 0; i < links.length; i++) {
            var text = links[i].textContent.trim();
            if (text === 'Produits' || text === 'Products') {
                triggerLink = links[i];
                break;
            }
        }
        if (!triggerLink) return;

        // Remove old mega-menu elements if present
        var oldMenu = document.querySelector('.mega-menu');
        if (oldMenu) oldMenu.remove();
        var oldDrop = document.querySelector('.prod-dropdown');
        if (oldDrop) oldDrop.remove();
        var oldWrap = document.querySelector('.mega-wrap');
        if (oldWrap) oldWrap.remove();
        var oldOverlay = document.querySelector('.mega-overlay');
        if (oldOverlay) oldOverlay.remove();
        var oldPanel = document.getElementById('eclat-mega-panel');
        if (oldPanel) oldPanel.remove();
        var oldOv = document.getElementById('eclat-mega-overlay');
        if (oldOv) oldOv.remove();

        parentLi = triggerLink.parentElement;
        if (parentLi && parentLi.classList.contains('mega-menu-trigger')) {
            parentLi.classList.remove('mega-menu-trigger');
        }

        // Add chevron class to Produits link (CSS ::after handles the arrow)
        triggerLink.classList.add('eclat-mega-trigger');

        // Prevent default navigation on Produits
        triggerLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen) { close(); } else { open(); }
        });

        // Build panel (appended to body, not navbar)
        var built = buildPanel();
        megaEl = built.panel;
        overlayEl = built.overlay;

        // Desktop hover — cancelClose on both sides to prevent trembling
        if (parentLi) {
            parentLi.addEventListener('mouseenter', function() { cancelClose(); open(); });
            parentLi.addEventListener('mouseleave', scheduleClose);
        }
        megaEl.addEventListener('mouseenter', cancelClose);
        megaEl.addEventListener('mouseleave', scheduleClose);

        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!isOpen) return;
            if (megaEl.contains(e.target) || triggerLink.contains(e.target)) return;
            close();
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) close();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
