// ============================
// ÉCLAT — Barre de progression fidélité + FOMO
// Affiche la progression vers le prochain palier + promo urgente
// ============================

(function() {
    'use strict';

    // V3 — Tiers rehaussés (doit correspondre à profile.js)
    var TIERS = [
        { name: 'Éclat', min: 0, color: '#c9a87c' },
        { name: 'Lumière', min: 300, color: '#e8d5b5', perk: 'IA beauté' },
        { name: 'Prestige', min: 750, color: '#d4af37', perk: 'IA experte + 50 msg' },
        { name: 'Diamant', min: 1500, color: '#b9f2ff', perk: 'IA illimitée + VIP' }
    ];

    function init() {
        if (!window.auth || !window.auth.isSignedIn()) return;

        var profile = window.auth.getProfile();
        if (!profile) return;

        var eclats = profile.eclats || 0;
        var streak = profile.purchase_streak || 0;

        // Widget header (Éclats dans la navbar)
        var widget = document.getElementById('navLoyaltyWidget');
        if (widget) {
            document.getElementById('lwEclats').textContent = eclats;
            widget.style.display = 'flex';
        }

        // Trouver le palier actuel et suivant
        var currentTier = TIERS[0];
        var nextTier = TIERS[1];
        for (var i = TIERS.length - 1; i >= 0; i--) {
            if (eclats >= TIERS[i].min) {
                currentTier = TIERS[i];
                nextTier = TIERS[i + 1] || null;
                break;
            }
        }

        // Ne rien afficher si Diamant
        if (!nextTier) return;

        var remaining = nextTier.min - eclats;
        var progress = ((eclats - currentTier.min) / (nextTier.min - currentTier.min)) * 100;

        // Créer la barre flottante
        var bar = document.createElement('div');
        bar.id = 'loyaltyBar';
        bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:7000;background:var(--color-primary);border-top:1px solid var(--color-border);padding:10px 20px;display:flex;align-items:center;gap:16px;font-family:Inter,sans-serif;transform:translateY(100%);transition:transform 0.5s ease;';

        var streakText = streak >= 2 ? ' <span style="color:#f1c40f;font-size:0.7rem;">x' + getMultiplier(streak) + ' streak</span>' : '';

        // i18n
        var lang = (typeof currentLang !== 'undefined' ? currentLang : localStorage.getItem('eclat_lang')) || 'fr';
        var barTexts = {
            fr: { remaining: 'Encore', unlock: 'd\u00e9bloquez :', eclats: '\u00c9clats' },
            en: { remaining: 'Only', unlock: 'to unlock:', eclats: '\u00c9clats' },
            es: { remaining: 'Faltan', unlock: 'para desbloquear:', eclats: '\u00c9clats' },
            de: { remaining: 'Noch', unlock: 'um freizuschalten:', eclats: '\u00c9clats' }
        };
        var perkTexts = {
            fr: { 'IA beauté': 'IA beaut\u00e9', 'IA experte + 50 msg': 'IA experte + 50 msg', 'IA illimitée + VIP': 'IA illimit\u00e9e + VIP' },
            en: { 'IA beauté': 'Beauty AI', 'IA experte + 50 msg': 'Expert AI + 50 msg', 'IA illimitée + VIP': 'Unlimited AI + VIP' },
            es: { 'IA beauté': 'IA de belleza', 'IA experte + 50 msg': 'IA experta + 50 msg', 'IA illimitée + VIP': 'IA ilimitada + VIP' },
            de: { 'IA beauté': 'Beauty-KI', 'IA experte + 50 msg': 'Experten-KI + 50 Msg', 'IA illimitée + VIP': 'Unbegrenzte KI + VIP' }
        };
        var bt = barTexts[lang] || barTexts.fr;
        var pt = perkTexts[lang] || perkTexts.fr;
        var perkLabel = pt[nextTier.perk] || nextTier.perk || nextTier.name;

        bar.innerHTML = '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
                '<span style="font-size:0.75rem;color:var(--color-secondary);font-weight:600;">' + currentTier.name + ' \u2192 ' + nextTier.name + streakText + '</span>' +
                '<span style="font-size:0.72rem;color:var(--color-text-light);">' + eclats + '/' + nextTier.min + ' ' + bt.eclats + '</span>' +
            '</div>' +
            '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">' +
                '<div id="loyaltyProgress" style="height:100%;background:linear-gradient(90deg,' + currentTier.color + ',' + (nextTier.color) + ');border-radius:3px;width:0%;transition:width 1.5s ease;"></div>' +
            '</div>' +
            '<div style="font-size:0.68rem;color:var(--color-text-light);margin-top:3px;">' + bt.remaining + ' ' + remaining + ' ' + bt.eclats + ' \u2192 ' + bt.unlock + ' <strong style="color:var(--color-secondary);">' + perkLabel + '</strong></div>' +
        '</div>' +
        '<button id="loyaltyBarClose" style="background:none;border:none;color:var(--color-text-light);cursor:pointer;font-size:1.1rem;padding:4px 8px;">\u00d7</button>';

        document.body.appendChild(bar);

        // Animer l'entrée + décaler le chatbot vers le haut
        setTimeout(function() {
            bar.style.transform = 'translateY(0)';
            // Décaler le chatbot au-dessus de la barre
            var chatEl = document.getElementById('eclatChat');
            if (chatEl) chatEl.style.bottom = '64px';
        }, 2000);

        // Animer la barre de progression
        setTimeout(function() {
            var prog = document.getElementById('loyaltyProgress');
            if (prog) prog.style.width = Math.min(progress, 100) + '%';
        }, 2500);

        // Fermer (persiste pour la session — revient le lendemain)
        var barDismissKey = 'eclat_bar_dismissed_' + new Date().toDateString();
        if (localStorage.getItem(barDismissKey)) {
            bar.remove();
            return;
        }
        document.getElementById('loyaltyBarClose').addEventListener('click', function() {
            bar.style.transform = 'translateY(100%)';
            localStorage.setItem(barDismissKey, '1');
            // Remettre le chatbot à sa position normale
            var chatEl = document.getElementById('eclatChat');
            if (chatEl) chatEl.style.bottom = '24px';
            setTimeout(function() { bar.remove(); }, 500);
        });

        // ── FOMO : Promo avec compte à rebours ──
        showFomoIfApplicable(eclats);
    }

    function showFomoIfApplicable(eclats) {
        // N'afficher le FOMO que si le client a un code non utilisé ou une offre spéciale
        var fomoKey = 'eclat_fomo_' + new Date().toDateString();
        if (localStorage.getItem(fomoKey)) return;

        // Afficher seulement pour les clients actifs (qui ont des Éclats)
        if (eclats < 10) return;

        // Créer un bandeau FOMO subtil en haut
        var fomo = document.createElement('div');
        fomo.id = 'fomoBar';
        fomo.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:7500;background:var(--color-primary, #2d2926);padding:10px 20px;text-align:center;font-family:Inter,sans-serif;font-size:0.82rem;color:var(--color-white, #ffffff);font-weight:600;transform:translateY(-100%);transition:transform 0.4s ease;letter-spacing:0.3px;';

        // Expiration à minuit
        var now = new Date();
        var midnight = new Date(now);
        midnight.setHours(23, 59, 59, 999);
        var remaining = midnight - now;
        var hours = Math.floor(remaining / 3600000);
        var mins = Math.floor((remaining % 3600000) / 60000);

        var fomoLang = (typeof currentLang !== 'undefined' ? currentLang : localStorage.getItem('eclat_lang')) || 'fr';
        var fomoTexts = {
            fr: { msg: '\u2728 Vos \u00c9clats valent double aujourd\'hui !', expire: 'Expire dans', cta: 'En profiter \u2192' },
            en: { msg: '\u2728 Your \u00c9clats are worth double today!', expire: 'Expires in', cta: 'Shop now \u2192' },
            es: { msg: '\u2728 \u00a1Tus \u00c9clats valen el doble hoy!', expire: 'Expira en', cta: 'Aprovecha \u2192' },
            de: { msg: '\u2728 Ihre \u00c9clats z\u00e4hlen heute doppelt!', expire: 'L\u00e4uft ab in', cta: 'Jetzt shoppen \u2192' }
        };
        var ft = fomoTexts[fomoLang] || fomoTexts.fr;
        fomo.innerHTML = ft.msg + ' <strong style="color:var(--color-secondary, #c9a87c);">' + ft.expire + ' ' + hours + 'h' + String(mins).padStart(2, '0') + '</strong> \u2014 <a href="index.html#products" style="color:var(--color-secondary, #c9a87c);text-decoration:underline;font-weight:700;">' + ft.cta + '</a> ' +
            '<button data-action="dismiss-fomo" data-storage-key="' + fomoKey + '" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.1rem;position:absolute;right:12px;top:50%;transform:translateY(-50%);">\u00d7</button>';

        document.body.appendChild(fomo);
        setTimeout(function() { fomo.style.transform = 'translateY(0)'; }, 3000);
    }

    // V3 — Multiplicateurs streak (doit correspondre à checkin.js)
    function getMultiplier(streak) {
        if (streak >= 30) return '1.3';
        if (streak >= 21) return '1.2';
        if (streak >= 14) return '1.15';
        if (streak >= 7) return '1.1';
        return '1.0';
    }

    // Attendre que auth soit prêt
    function waitAndInit() {
        if (window.auth && window.auth._ready) { init(); return; }
        if (window.auth && window.auth.onReady) { window.auth.onReady(init); return; }
        setTimeout(waitAndInit, 200);
    }

    // Ne pas afficher sur les pages admin, login, register
    var path = window.location.pathname;
    if (!path.includes('admin') && !path.includes('login') && !path.includes('register')) {
        waitAndInit();
    }
})();
