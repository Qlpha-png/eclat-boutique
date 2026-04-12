// ============================
// Maison Eclat — Menu Produits v3
// Dropdown simple, fiable, basé sur les vrais produits
// ============================
(function() {
    'use strict';

    var CATEGORIES = [
        { key: 'visage', label: 'Soins Visage', icon: '\u2728', count: 159 },
        { key: 'soin', label: 'S\u00e9rums', icon: '\uD83E\uDDEA', count: 43 },
        { key: 'cheveux', label: 'Cheveux', icon: '\uD83D\uDC87', count: 84 },
        { key: 'outils', label: 'Outils Beaut\u00e9', icon: '\uD83D\uDC86', count: 64 },
        { key: 'corps', label: 'Corps', icon: '\uD83E\uDDF4', count: 36 },
        { key: 'homme', label: 'Homme', icon: '\uD83E\uDDD4', count: 43 },
        { key: 'ongles', label: 'Ongles', icon: '\uD83D\uDC85', count: 37 },
        { key: 'aromatherapie', label: 'Bien-\u00eatre', icon: '\uD83E\uDDD8', count: 32 },
        { key: 'accessoire', label: 'Accessoires', icon: '\uD83D\uDCBC', count: 19 }
    ];

    var dropdownEl = null;
    var triggerLink = null;
    var isOpen = false;
    var closeTimer = null;

    function injectCSS() {
        if (document.getElementById('eclat-prodmenu-css')) return;
        var style = document.createElement('style');
        style.id = 'eclat-prodmenu-css';
        style.textContent =
            '.prod-dropdown{' +
                'position:absolute;top:100%;left:0;min-width:240px;' +
                'background:var(--color-white,#fff);' +
                'border:1px solid var(--color-border,#e8e0d8);' +
                'border-radius:8px;' +
                'box-shadow:0 8px 32px rgba(0,0,0,0.12);' +
                'padding:8px 0;z-index:1050;' +
                'opacity:0;visibility:hidden;transform:translateY(-4px);' +
                'transition:opacity 0.2s,visibility 0.2s,transform 0.2s;' +
            '}' +
            '.prod-dropdown.open{opacity:1;visibility:visible;transform:translateY(0);}' +
            '.prod-dropdown a{' +
                'display:flex;align-items:center;gap:10px;' +
                'padding:10px 20px;font-size:0.9rem;' +
                'color:var(--color-primary,#2d2926);text-decoration:none;' +
                'transition:background 0.15s;' +
            '}' +
            '.prod-dropdown a:hover{background:var(--color-bg-alt,#faf5f0);}' +
            '.prod-dropdown a .pdi{font-size:1.1rem;width:24px;text-align:center;}' +
            '.prod-dropdown a .pdc{font-size:0.75rem;color:var(--color-text-light,#9a918a);margin-left:auto;}' +
            '.prod-dropdown .pd-sep{height:1px;background:var(--color-border,#e8e0d8);margin:6px 16px;}' +
            '.prod-dropdown .pd-all{font-weight:600;color:var(--color-secondary-text,#8b6f4e);}' +
            '@media(max-width:768px){' +
                '.prod-dropdown{position:fixed;top:60px;left:8px;right:8px;min-width:auto;}' +
            '}';
        document.head.appendChild(style);
    }

    function buildDropdown() {
        var el = document.createElement('div');
        el.className = 'prod-dropdown';
        var html = '';
        for (var i = 0; i < CATEGORIES.length; i++) {
            var c = CATEGORIES[i];
            html += '<a href="/pages/category.html?cat=' + c.key + '">' +
                '<span class="pdi">' + c.icon + '</span>' +
                '<span>' + c.label + '</span>' +
                '<span class="pdc">' + c.count + '</span>' +
                '</a>';
        }
        html += '<div class="pd-sep"></div>';
        html += '<a href="/pages/category.html" class="pd-all">' +
            '<span class="pdi">\uD83D\uDCE6</span>' +
            '<span>Tous les produits</span>' +
            '<span class="pdc">515</span>' +
            '</a>';
        el.innerHTML = html;
        return el;
    }

    function open() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        if (!dropdownEl || isOpen) return;
        dropdownEl.classList.add('open');
        isOpen = true;
    }

    function close() {
        if (!dropdownEl || !isOpen) return;
        dropdownEl.classList.remove('open');
        isOpen = false;
    }

    function delayClose() {
        closeTimer = setTimeout(close, 250);
    }

    function cancelClose() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }

    function init() {
        injectCSS();

        // Find "Produits" link in navbar — search all nav links
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
        var oldTrigger = triggerLink.parentElement;
        if (oldTrigger && oldTrigger.classList.contains('mega-menu-trigger')) {
            oldTrigger.classList.remove('mega-menu-trigger');
        }

        // Make trigger's parent relative for positioning
        var parentLi = triggerLink.parentElement;
        if (parentLi) parentLi.style.position = 'relative';

        // Prevent default navigation on click
        triggerLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isOpen) { close(); } else { open(); }
        });

        // Build and insert dropdown
        dropdownEl = buildDropdown();
        if (parentLi && parentLi.tagName === 'LI') {
            parentLi.appendChild(dropdownEl);
        } else {
            triggerLink.parentElement.appendChild(dropdownEl);
        }

        // Desktop hover
        if (parentLi) {
            parentLi.addEventListener('mouseenter', function() { cancelClose(); open(); });
            parentLi.addEventListener('mouseleave', delayClose);
        }
        dropdownEl.addEventListener('mouseenter', cancelClose);
        dropdownEl.addEventListener('mouseleave', delayClose);

        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!isOpen) return;
            if (dropdownEl.contains(e.target) || triggerLink.contains(e.target)) return;
            close();
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) close();
        });
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
