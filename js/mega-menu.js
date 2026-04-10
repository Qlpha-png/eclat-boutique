// ============================
// ÉCLAT — Mega Menu Professionnel
// Dropdown catégories, mobile accordion
// ============================
(function() {
    'use strict';

    var CATEGORIES = [
        { key: 'visage', label: 'Soins Visage', icon: '\u2728', subs: ['Masques LED', 'Gua Sha', 'Scrubbers', 'Sérums'] },
        { key: 'corps', label: 'Soins Corps', icon: '\ud83e\uddf4', subs: ['Gommages', 'Huiles', 'Anti-cellulite', 'Massage'] },
        { key: 'cheveux', label: 'Cheveux', icon: '\ud83d\udc87', subs: ['Brosses', 'Sérums capillaires', 'Accessoires coiffure'] },
        { key: 'ongles', label: 'Ongles', icon: '\ud83d\udc85', subs: ['Vernis', 'Nail art', 'Lampes UV', 'Outils'] },
        { key: 'homme', label: 'Homme', icon: '\ud83e\uddd4', subs: ['Grooming', 'Barbe', 'Skincare homme'] },
        { key: 'bienetre', label: 'Bien-être', icon: '\ud83e\uddd8', subs: ['Aromathérapie', 'Massage', 'Relaxation'] },
        { key: 'coffrets', label: 'Coffrets', icon: '\ud83c\udf81', subs: ['Gift sets', 'Routines', 'Découverte'] }
    ];

    function createMegaMenu() {
        // Find nav-links
        var navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        // Find or create Boutique link
        var boutiqueItem = null;
        var links = navLinks.querySelectorAll('li');
        for (var i = 0; i < links.length; i++) {
            var a = links[i].querySelector('a');
            if (a && (a.textContent.trim() === 'Produits' || a.getAttribute('href') === '#produits')) {
                boutiqueItem = links[i];
                break;
            }
        }
        if (!boutiqueItem) return;

        // Create mega menu dropdown
        boutiqueItem.style.position = 'relative';
        boutiqueItem.classList.add('has-mega-menu');

        var mega = document.createElement('div');
        mega.className = 'mega-menu';
        mega.innerHTML = '<div class="mega-grid">' + CATEGORIES.map(function(cat) {
            return '<div class="mega-col">' +
                '<a href="/pages/category.html?cat=' + cat.key + '" class="mega-cat-title">' +
                '<span class="mega-icon">' + cat.icon + '</span> ' + cat.label + '</a>' +
                '<ul class="mega-subs">' + cat.subs.map(function(sub) {
                    return '<li><a href="/pages/category.html?cat=' + cat.key + '&sub=' + encodeURIComponent(sub.toLowerCase()) + '">' + sub + '</a></li>';
                }).join('') + '</ul>' +
                '</div>';
        }).join('') + '</div>' +
        '<div class="mega-footer">' +
            '<a href="/pages/diagnostic.html" class="mega-cta">Mon diagnostic beauté gratuit \u2192</a>' +
            '<a href="/#products" class="mega-all">Voir tous les produits</a>' +
        '</div>';

        boutiqueItem.appendChild(mega);

        // Desktop hover
        var hideTimeout;
        boutiqueItem.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
            mega.classList.add('open');
        });
        boutiqueItem.addEventListener('mouseleave', function() {
            hideTimeout = setTimeout(function() { mega.classList.remove('open'); }, 200);
        });

        // Mobile click toggle
        var boutiqueLink = boutiqueItem.querySelector('a');
        boutiqueLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                mega.classList.toggle('open-mobile');
            }
        });
    }

    // Inject mega menu CSS
    var style = document.createElement('style');
    style.textContent = [
        '.has-mega-menu{position:relative}',
        '.mega-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%);width:min(800px,95vw);background:#fff;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.12);padding:24px;opacity:0;visibility:hidden;transition:all .25s ease;z-index:1001;pointer-events:none}',
        '.mega-menu.open{opacity:1;visibility:visible;pointer-events:auto}',
        '.mega-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:20px}',
        '.mega-col{}',
        '.mega-cat-title{display:flex;align-items:center;gap:6px;font-weight:600;font-size:.9rem;color:var(--color-primary);text-decoration:none;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--color-border)}',
        '.mega-cat-title:hover{color:var(--color-secondary)}',
        '.mega-icon{font-size:1.1rem}',
        '.mega-subs{list-style:none;padding:0}',
        '.mega-subs li a{display:block;padding:4px 0;font-size:.82rem;color:var(--color-text-light);text-decoration:none;transition:color .2s}',
        '.mega-subs li a:hover{color:var(--color-secondary)}',
        '.mega-footer{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid var(--color-border)}',
        '.mega-cta{background:var(--color-primary);color:#fff;padding:8px 20px;border-radius:20px;font-size:.82rem;font-weight:600;text-decoration:none;transition:background .2s}',
        '.mega-cta:hover{background:var(--color-secondary)}',
        '.mega-all{font-size:.82rem;color:var(--color-secondary);text-decoration:none;font-weight:500}',
        '@media(max-width:768px){',
        '.mega-menu{position:static;transform:none;width:100%;box-shadow:none;border-radius:0;padding:12px 0;display:none;border-top:1px solid var(--color-border)}',
        '.mega-menu.open-mobile{display:block;opacity:1;visibility:visible;pointer-events:auto}',
        '.mega-grid{grid-template-columns:1fr 1fr;gap:12px}',
        '.mega-footer{flex-direction:column;gap:8px;text-align:center}',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMegaMenu);
    } else {
        createMegaMenu();
    }
})();
