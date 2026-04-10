// ============================
// ÉCLAT — Push Notifications + Smart Prompt
// Inscription, gestion, UX demande permission
// ============================
(function() {
    'use strict';

    var VAPID_PUBLIC = 'VAPID_PUBLIC_KEY_PLACEHOLDER'; // Remplacé par la vraie clé en production
    var STORAGE_KEY = 'eclat_push';
    var PROMPT_KEY = 'eclat_push_prompt';
    var VISIT_KEY = 'eclat_visit_count';

    // ——— Visite counter ———
    var visits = parseInt(localStorage.getItem(VISIT_KEY) || '0') + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    window.EclatPush = {
        /**
         * Vérifie si le navigateur supporte les push
         */
        isSupported: function() {
            return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
        },

        /**
         * Vérifie si déjà inscrit
         */
        isSubscribed: function() {
            return localStorage.getItem(STORAGE_KEY) === 'subscribed';
        },

        /**
         * S'inscrire aux push
         */
        subscribe: async function() {
            if (!this.isSupported()) return false;

            try {
                var permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    localStorage.setItem(PROMPT_KEY, 'denied');
                    return false;
                }

                var reg = await navigator.serviceWorker.ready;
                var sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)
                });

                var subJson = sub.toJSON();

                // Envoyer au serveur
                var token = localStorage.getItem('sb-session');
                if (token) {
                    try { token = JSON.parse(token).access_token; } catch(e) {}
                }

                var response = await fetch('/api/push-subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? 'Bearer ' + token : ''
                    },
                    body: JSON.stringify({
                        endpoint: subJson.endpoint,
                        keys: subJson.keys
                    })
                });

                if (response.ok) {
                    localStorage.setItem(STORAGE_KEY, 'subscribed');
                    localStorage.setItem(PROMPT_KEY, 'accepted');
                    return true;
                }
                return false;
            } catch (err) {
                console.error('[push] Subscribe error:', err);
                return false;
            }
        },

        /**
         * Se désinscrire
         */
        unsubscribe: async function() {
            try {
                var reg = await navigator.serviceWorker.ready;
                var sub = await reg.pushManager.getSubscription();
                if (sub) {
                    var endpoint = sub.endpoint;
                    await sub.unsubscribe();

                    var token = localStorage.getItem('sb-session');
                    if (token) {
                        try { token = JSON.parse(token).access_token; } catch(e) {}
                    }

                    fetch('/api/push-subscribe', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? 'Bearer ' + token : ''
                        },
                        body: JSON.stringify({ endpoint: endpoint })
                    }).catch(function() {});
                }

                localStorage.setItem(STORAGE_KEY, 'unsubscribed');
                return true;
            } catch(e) { return false; }
        },

        /**
         * Smart prompt — ne demande PAS au premier chargement
         * Trigger : 2ème visite OU action significative
         */
        maybeShowPrompt: function() {
            if (!this.isSupported()) return;
            if (this.isSubscribed()) return;
            if (Notification.permission === 'denied') return;

            var promptState = localStorage.getItem(PROMPT_KEY);
            if (promptState === 'accepted' || promptState === 'denied' || promptState === 'dismissed') return;

            // Ne pas montrer à la 1ère visite (hostile UX)
            if (visits < 2) return;

            // Afficher le banner custom
            this.showBanner();
        },

        /**
         * Affiche un banner élégant (pas le popup navigateur direct)
         */
        showBanner: function() {
            var self = this;

            var banner = document.createElement('div');
            banner.id = 'pushBanner';
            banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;' +
                'background:linear-gradient(135deg,#2d2926,#1a1714);color:#fff;padding:16px 24px;border-radius:12px;' +
                'box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;align-items:center;gap:16px;max-width:440px;width:calc(100% - 32px);' +
                'animation:pushSlideUp .4s ease;font-family:Inter,-apple-system,sans-serif;';

            banner.innerHTML =
                '<div style="flex:1">' +
                    '<div style="font-weight:600;font-size:14px;margin-bottom:4px;">Alertes beaut\u00e9 personnalis\u00e9es</div>' +
                    '<div style="font-size:12px;opacity:.8;line-height:1.4;">Promos, retour en stock, rappels fid\u00e9lit\u00e9</div>' +
                '</div>' +
                '<button id="pushAccept" style="background:#c9a87c;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;">Activer</button>' +
                '<button id="pushDismiss" style="background:none;border:none;color:#fff;opacity:.5;font-size:18px;cursor:pointer;padding:4px;">&times;</button>';

            // Animation CSS
            if (!document.getElementById('pushBannerStyle')) {
                var style = document.createElement('style');
                style.id = 'pushBannerStyle';
                style.textContent = '@keyframes pushSlideUp{from{transform:translateX(-50%) translateY(100px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}';
                document.head.appendChild(style);
            }

            document.body.appendChild(banner);

            document.getElementById('pushAccept').onclick = function() {
                self.subscribe().then(function(ok) {
                    if (ok && window.showToast) window.showToast('Notifications activ\u00e9es !');
                    banner.remove();
                });
            };

            document.getElementById('pushDismiss').onclick = function() {
                localStorage.setItem(PROMPT_KEY, 'dismissed');
                banner.remove();
            };

            // Auto-dismiss après 15s
            setTimeout(function() {
                if (document.getElementById('pushBanner')) banner.remove();
            }, 15000);
        },

        /**
         * Trigger après action significative (ajout panier, diagnostic fait)
         */
        triggerAfterAction: function() {
            if (!this.isSupported() || this.isSubscribed()) return;
            if (Notification.permission === 'denied') return;
            var promptState = localStorage.getItem(PROMPT_KEY);
            if (promptState === 'accepted' || promptState === 'denied') return;

            // Reset dismissed pour retenter après action
            this.showBanner();
        }
    };

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        var rawData = atob(base64);
        var array = new Uint8Array(rawData.length);
        for (var i = 0; i < rawData.length; i++) {
            array[i] = rawData.charCodeAt(i);
        }
        return array;
    }

    // Auto-init : montrer le prompt si conditions remplies (après 3s)
    if (document.readyState === 'complete') {
        setTimeout(function() { window.EclatPush.maybeShowPrompt(); }, 3000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(function() { window.EclatPush.maybeShowPrompt(); }, 3000);
        });
    }
})();
