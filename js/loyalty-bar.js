// ============================
// ÉCLAT — Barre de progression fidélité + FOMO
// Affiche la progression vers le prochain palier + promo urgente
// ============================

(function() {
    'use strict';

    var TIERS = [
        { name: 'Éclat', min: 0, color: '#c9a87c' },
        { name: 'Lumière', min: 200, color: '#e8d5b5', perk: 'IA beauté' },
        { name: 'Prestige', min: 500, color: '#d4af37', perk: 'IA experte + 50 msg' },
        { name: 'Diamant', min: 1000, color: '#b9f2ff', perk: 'IA illimitée + VIP' }
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

        bar.innerHTML = '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
                '<span style="font-size:0.75rem;color:var(--color-secondary);font-weight:600;">' + currentTier.name + ' \u2192 ' + nextTier.name + streakText + '</span>' +
                '<span style="font-size:0.72rem;color:var(--color-text-light);">' + eclats + '/' + nextTier.min + ' \u00c9clats</span>' +
            '</div>' +
            '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">' +
                '<div id="loyaltyProgress" style="height:100%;background:linear-gradient(90deg,' + currentTier.color + ',' + (nextTier.color) + ');border-radius:3px;width:0%;transition:width 1.5s ease;"></div>' +
            '</div>' +
            '<div style="font-size:0.68rem;color:var(--color-text-light);margin-top:3px;">Encore ' + remaining + ' \u00c9clats \u2192 d\u00e9bloquez : <strong style="color:var(--color-secondary);">' + (nextTier.perk || nextTier.name) + '</strong></div>' +
        '</div>' +
        '<button id="loyaltyBarClose" style="background:none;border:none;color:var(--color-text-light);cursor:pointer;font-size:1.1rem;padding:4px 8px;">\u00d7</button>';

        document.body.appendChild(bar);

        // Animer l'entrée
        setTimeout(function() {
            bar.style.transform = 'translateY(0)';
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

        fomo.innerHTML = '\u2728 Vos \u00c9clats valent double aujourd\u0027hui ! <strong style="color:var(--color-secondary, #c9a87c);">Expire dans ' + hours + 'h' + String(mins).padStart(2, '0') + '</strong> \u2014 <a href="index.html#products" style="color:var(--color-secondary, #c9a87c);text-decoration:underline;font-weight:700;">En profiter \u2192</a> ' +
            '<button onclick="this.parentElement.style.transform=\'translateY(-100%)\';localStorage.setItem(\'' + fomoKey + '\',1);" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.1rem;position:absolute;right:12px;top:50%;transform:translateY(-50%);">\u00d7</button>';

        document.body.appendChild(fomo);
        setTimeout(function() { fomo.style.transform = 'translateY(0)'; }, 3000);
    }

    function getMultiplier(streak) {
        if (streak >= 6) return '3.0';
        if (streak >= 3) return '2.0';
        if (streak >= 2) return '1.5';
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
