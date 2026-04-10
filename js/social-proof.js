// ============================
// ÉCLAT — Social Proof Notifications
// DÉSACTIVÉ : Directive Omnibus interdit les faux achats
// Sera réactivé avec des VRAIS achats depuis l'API quand on aura des clients
// ============================

(function() {
    'use strict';

    // DÉSACTIVÉ tant qu'il n'y a pas de vrais clients
    // Les fausses notifications d'achat sont illégales (Directive Omnibus EU 2019/2161)
    return;

    // Ne pas afficher sur admin, checkout, success
    var path = window.location.pathname;
    if (path.includes('admin') || path.includes('checkout') || path.includes('success') || path.includes('login') || path.includes('register')) return;

    // Session check : ne pas spammer
    var KEY = 'eclat_sp_last';
    var last = parseInt(sessionStorage.getItem(KEY) || '0');
    if (Date.now() - last < 120000) return; // 2min cooldown entre sessions

    var PRENOMS = ['Marie', 'Sophie', 'Camille', 'Emma', 'Léa', 'Chloé', 'Julie', 'Sarah', 'Laura', 'Clara', 'Inès', 'Manon', 'Alice', 'Jade', 'Lina', 'Nadia', 'Yasmine', 'Amira', 'Fatima', 'Noémie'];

    var VILLES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Nice', 'Lille', 'Strasbourg', 'Rennes', 'Montpellier', 'Grenoble'];

    var PRODUITS = [
        { name: 'Masque LED Pro 7 Couleurs', price: '39,90' },
        { name: 'Sérum Vitamine C 20%', price: '14,90' },
        { name: 'Gua Sha Quartz Rose', price: '9,90' },
        { name: 'Ice Roller Cryo', price: '7,90' },
        { name: 'Scrubber Ultrasonique', price: '27,90' },
        { name: 'Brosse Nettoyante Sonic', price: '22,90' },
        { name: 'Coffret Routine Éclat', price: '29,90' },
        { name: 'V-Line Roller EMS', price: '18,90' },
        { name: 'Facial Steamer Nano-Ion', price: '24,90' },
        { name: 'Coffret Routine Anti-Âge', price: '59,90' }
    ];

    var TEMPLATES = [
        function(p, v, pr) { return p + ' de ' + v + ' vient d\'acheter <strong>' + pr.name + '</strong>'; },
        function(p, v, pr) { return p + ' (' + v + ') a commandé le <strong>' + pr.name + '</strong>'; },
        function(p, v, pr) { return 'Achat vérifié : ' + p + ' a choisi <strong>' + pr.name + '</strong>'; }
    ];

    function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function randomMinutes() { return Math.floor(Math.random() * 45) + 2; }

    function createNotif() {
        var prenom = random(PRENOMS);
        var ville = random(VILLES);
        var produit = random(PRODUITS);
        var template = random(TEMPLATES);
        var mins = randomMinutes();

        var el = document.createElement('div');
        el.className = 'sp-notif';
        el.innerHTML = '<div class="sp-icon">🛒</div>' +
            '<div class="sp-content">' +
                '<div class="sp-text">' + template(prenom, ville, produit) + '</div>' +
                '<div class="sp-time">Il y a ' + mins + ' min · ' + produit.price + ' €</div>' +
            '</div>' +
            '<button class="sp-close" onclick="this.parentElement.remove()" aria-label="Fermer">&times;</button>';

        document.body.appendChild(el);

        // Animate in
        requestAnimationFrame(function() {
            el.classList.add('visible');
        });

        // Auto-dismiss after 6s
        setTimeout(function() {
            el.classList.remove('visible');
            el.classList.add('hiding');
            setTimeout(function() { el.remove(); }, 400);
        }, 6000);

        sessionStorage.setItem(KEY, Date.now().toString());
    }

    // Inject CSS
    var style = document.createElement('style');
    style.textContent = '.sp-notif{position:fixed;bottom:24px;left:24px;z-index:8000;background:var(--color-white,#fff);border:1px solid var(--color-border,#e8e4de);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,0.1);transform:translateX(-120%);transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);font-family:Inter,-apple-system,sans-serif;}' +
        '.sp-notif.visible{transform:translateX(0);}' +
        '.sp-notif.hiding{transform:translateX(-120%);}' +
        '.sp-icon{font-size:24px;flex-shrink:0;}' +
        '.sp-text{font-size:0.82rem;color:var(--color-text,#2d2926);line-height:1.4;}' +
        '.sp-text strong{color:var(--color-secondary,#c9a87c);}' +
        '.sp-time{font-size:0.7rem;color:var(--color-text-light,#6b6560);margin-top:2px;}' +
        '.sp-close{position:absolute;top:4px;right:8px;background:none;border:none;color:var(--color-text-light,#6b6560);font-size:14px;cursor:pointer;padding:2px;line-height:1;}' +
        '@media(max-width:480px){.sp-notif{left:8px;right:8px;max-width:none;bottom:80px;}}';
    document.head.appendChild(style);

    // Premier affichage après 15-25s, puis toutes les 45-90s (max 3 par session)
    var count = 0;
    var maxPerSession = 3;

    function scheduleNext() {
        if (count >= maxPerSession) return;
        var delay = count === 0 ? (15000 + Math.random() * 10000) : (45000 + Math.random() * 45000);
        setTimeout(function() {
            createNotif();
            count++;
            scheduleNext();
        }, delay);
    }

    scheduleNext();
})();
