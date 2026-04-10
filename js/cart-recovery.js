// ============================
// ÉCLAT — Récupération Panier Abandonné (Client-side)
// Détecte quand un utilisateur a un panier rempli mais ne commande pas
// Envoie un rappel après 30min d'inactivité si email connu
// ============================

(function() {
    'use strict';

    var IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    var RECOVERY_COOLDOWN = 24 * 60 * 60 * 1000; // 1 envoi par 24h max
    var STORAGE_KEY = 'eclat_cart_recovery';
    var idleTimer = null;

    function getRecoveryState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) { return {}; }
    }

    function setRecoveryState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // Obtenir l'email de l'utilisateur connecté
    function getUserEmail() {
        // Depuis auth Supabase
        if (typeof window._supabaseClient !== 'undefined') {
            var session = window._supabaseClient.auth.session && window._supabaseClient.auth.session();
            if (session && session.user) return session.user.email;
        }
        // Depuis le localStorage auth
        try {
            var authData = localStorage.getItem('eclat_auth');
            if (authData) {
                var parsed = JSON.parse(authData);
                if (parsed.email) return parsed.email;
            }
        } catch (e) {}
        // Depuis newsletter signup
        var state = getRecoveryState();
        return state.email || null;
    }

    // Capturer l'email quand il est entré (newsletter, checkout, etc.)
    function captureEmail() {
        document.addEventListener('submit', function(e) {
            var form = e.target;
            var emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                var state = getRecoveryState();
                state.email = emailInput.value;
                setRecoveryState(state);
            }
        });
    }

    // Vérifier si on peut envoyer un rappel
    function canSendRecovery() {
        var state = getRecoveryState();
        if (!state.lastSent) return true;
        return (Date.now() - state.lastSent) > RECOVERY_COOLDOWN;
    }

    // Envoyer le rappel panier abandonné
    function sendRecovery() {
        if (typeof cart === 'undefined' || cart.isEmpty()) return;
        var email = getUserEmail();
        if (!email) return;
        if (!canSendRecovery()) return;

        var items = cart.items.map(function(item) {
            return {
                name: item.name,
                price: item.price,
                qty: item.qty,
                image: item.image
            };
        });
        var total = cart.getTotal();

        fetch('/api/abandoned-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, items: items, total: total })
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            if (data.success) {
                var state = getRecoveryState();
                state.lastSent = Date.now();
                setRecoveryState(state);
            }
        }).catch(function() {});
    }

    // Réinitialiser le timer d'inactivité
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (typeof cart === 'undefined' || cart.isEmpty()) return;
        idleTimer = setTimeout(sendRecovery, IDLE_TIMEOUT);
    }

    // Détecter la sortie de page (beforeunload)
    function onBeforeUnload() {
        if (typeof cart === 'undefined' || cart.isEmpty()) return;
        if (!getUserEmail()) return;
        if (!canSendRecovery()) return;

        // Envoyer via sendBeacon pour fiabilité
        var items = cart.items.map(function(item) {
            return { name: item.name, price: item.price, qty: item.qty, image: item.image };
        });
        var total = cart.getTotal();
        var data = JSON.stringify({ email: getUserEmail(), items: items, total: total });

        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/abandoned-cart', new Blob([data], { type: 'application/json' }));
            var state = getRecoveryState();
            state.lastSent = Date.now();
            setRecoveryState(state);
        }
    }

    // Initialisation
    function init() {
        captureEmail();

        // Écouter les événements utilisateur pour reset timer
        ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'].forEach(function(evt) {
            document.addEventListener(evt, resetIdleTimer, { passive: true });
        });

        // Écouter les changements de panier
        if (typeof cart !== 'undefined' && cart.onChange) {
            cart.onChange(resetIdleTimer);
        }

        // Avant de quitter la page
        window.addEventListener('beforeunload', onBeforeUnload);

        // Démarrer le timer initial
        setTimeout(resetIdleTimer, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
