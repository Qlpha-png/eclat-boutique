// ============================
// ECLAT Beaute — Web Push Notifications
// Respectful UX: no prompt on first visit
// Custom banner, VAPID, service worker
// ============================
(function() {
    'use strict';

    var STORAGE_DECLINED = 'eclat_push_declined';
    var STORAGE_SUBSCRIBED = 'eclat_push_subscribed';
    var VISIT_KEY = 'eclat_push_visits';
    var BANNER_ID = 'eclatPushBanner';

    // ---------- Visit tracking ----------

    var visitCount = 0;
    try {
        visitCount = parseInt(localStorage.getItem(VISIT_KEY), 10) || 0;
        visitCount++;
        localStorage.setItem(VISIT_KEY, String(visitCount));
    } catch (e) {
        // localStorage blocked
    }

    // ---------- Helpers ----------

    function isSupported() {
        return ('serviceWorker' in navigator)
            && ('PushManager' in window)
            && ('Notification' in window);
    }

    function isDeclined() {
        try { return localStorage.getItem(STORAGE_DECLINED) === '1'; }
        catch (e) { return false; }
    }

    function isSubscribed() {
        try { return localStorage.getItem(STORAGE_SUBSCRIBED) === '1'; }
        catch (e) { return false; }
    }

    function markDeclined() {
        try { localStorage.setItem(STORAGE_DECLINED, '1'); } catch (e) {}
    }

    function markSubscribed() {
        try { localStorage.setItem(STORAGE_SUBSCRIBED, '1'); } catch (e) {}
    }

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        var rawData = atob(base64);
        var outputArray = new Uint8Array(rawData.length);
        for (var i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // ---------- VAPID key resolution ----------

    function getVapidKey(callback) {
        // Prefer global config
        if (window.VAPID_PUBLIC_KEY) {
            callback(window.VAPID_PUBLIC_KEY);
            return;
        }

        // Fetch from server
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/push-config', true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    var key = data.vapidPublicKey || data.publicKey || data.key || null;
                    callback(key);
                } catch (e) {
                    callback(null);
                }
            } else {
                callback(null);
            }
        };
        xhr.onerror = function() { callback(null); };
        xhr.ontimeout = function() { callback(null); };
        xhr.send();
    }

    // ---------- Subscribe logic ----------

    function doSubscribe(onDone) {
        if (!isSupported()) {
            if (onDone) onDone(false);
            return;
        }

        getVapidKey(function(vapidKey) {
            if (!vapidKey) {
                if (onDone) onDone(false);
                return;
            }

            Notification.requestPermission().then(function(permission) {
                if (permission !== 'granted') {
                    markDeclined();
                    if (onDone) onDone(false);
                    return;
                }

                navigator.serviceWorker.ready.then(function(registration) {
                    var subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(vapidKey)
                    };

                    registration.pushManager.subscribe(subscribeOptions).then(function(subscription) {
                        var subJSON = subscription.toJSON();

                        // Send subscription to backend
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/api/push-subscribe', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.timeout = 8000;

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                markSubscribed();
                                if (onDone) onDone(true);
                            } else {
                                if (onDone) onDone(false);
                            }
                        };
                        xhr.onerror = function() { if (onDone) onDone(false); };
                        xhr.ontimeout = function() { if (onDone) onDone(false); };

                        xhr.send(JSON.stringify({
                            endpoint: subJSON.endpoint,
                            keys: subJSON.keys
                        }));

                    }).catch(function() {
                        if (onDone) onDone(false);
                    });
                }).catch(function() {
                    if (onDone) onDone(false);
                });

            }).catch(function() {
                if (onDone) onDone(false);
            });
        });
    }

    // ---------- Auto-subscribe if already granted ----------

    function tryAutoSubscribe() {
        if (!isSupported()) return;
        if (isSubscribed()) return;
        if (isDeclined()) return;

        try {
            if (Notification.permission === 'granted') {
                doSubscribe(function() {});
            }
        } catch (e) {
            // permission check failed
        }
    }

    // ---------- Banner UI ----------

    function removeBanner() {
        var existing = document.getElementById(BANNER_ID);
        if (existing && existing.parentNode) {
            existing.style.transform = 'translateY(120%)';
            existing.style.opacity = '0';
            setTimeout(function() {
                if (existing.parentNode) existing.parentNode.removeChild(existing);
            }, 350);
        }
    }

    function showBanner() {
        // Guard: don't double-show
        if (document.getElementById(BANNER_ID)) return;
        if (isDeclined() || isSubscribed()) return;
        if (!isSupported()) return;

        try {
            if (Notification.permission === 'denied') return;
        } catch (e) { return; }

        // Inject keyframe animation
        if (!document.getElementById('eclat-push-anim')) {
            var animStyle = document.createElement('style');
            animStyle.id = 'eclat-push-anim';
            animStyle.textContent = '@keyframes eclatPushSlideUp{' +
                '0%{transform:translateY(100%);opacity:0}' +
                '100%{transform:translateY(0);opacity:1}}';
            document.head.appendChild(animStyle);
        }

        var banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);' +
            'z-index:10000;background:var(--color-primary);' +
            'color:var(--color-white);padding:18px 22px;border-radius:14px;' +
            'box-shadow:0 10px 40px rgba(0,0,0,0.2),0 2px 8px rgba(0,0,0,0.08);' +
            'display:flex;align-items:center;gap:16px;max-width:460px;width:calc(100% - 32px);' +
            'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;' +
            'animation:eclatPushSlideUp 0.45s ease forwards;' +
            'transition:transform 0.35s ease,opacity 0.35s ease;';

        // Content
        var content = document.createElement('div');
        content.style.cssText = 'flex:1;min-width:0;';

        var heading = document.createElement('div');
        heading.style.cssText = 'font-weight:600;font-size:0.92rem;margin-bottom:3px;';
        heading.textContent = '\ud83d\udd14 Recevez vos alertes beaut\u00e9';

        var desc = document.createElement('div');
        desc.style.cssText = 'font-size:0.78rem;opacity:0.75;line-height:1.4;';
        desc.textContent = 'Promos exclusives, retours en stock, rappels fid\u00e9lit\u00e9';

        content.appendChild(heading);
        content.appendChild(desc);

        // Accept button
        var acceptBtn = document.createElement('button');
        acceptBtn.type = 'button';
        acceptBtn.style.cssText = 'background:var(--color-secondary);color:var(--color-white,#fff);border:none;padding:10px 18px;' +
            'border-radius:10px;font-weight:600;font-size:0.82rem;cursor:pointer;' +
            'white-space:nowrap;transition:background 0.2s;font-family:inherit;';
        acceptBtn.textContent = 'Oui, m\'alerter';

        acceptBtn.addEventListener('mouseenter', function() {
            acceptBtn.style.background = 'var(--color-accent)';
        });
        acceptBtn.addEventListener('mouseleave', function() {
            acceptBtn.style.background = 'var(--color-secondary)';
        });

        // Decline button
        var declineBtn = document.createElement('button');
        declineBtn.type = 'button';
        declineBtn.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.2);' +
            'color:rgba(255,255,255,0.7);padding:10px 14px;border-radius:10px;' +
            'font-size:0.78rem;cursor:pointer;white-space:nowrap;transition:all 0.2s;' +
            'font-family:inherit;';
        declineBtn.textContent = 'Non merci';

        declineBtn.addEventListener('mouseenter', function() {
            declineBtn.style.borderColor = 'rgba(255,255,255,0.4)';
            declineBtn.style.color = '#fff';
        });
        declineBtn.addEventListener('mouseleave', function() {
            declineBtn.style.borderColor = 'rgba(255,255,255,0.2)';
            declineBtn.style.color = 'rgba(255,255,255,0.7)';
        });

        // Event handlers
        acceptBtn.addEventListener('click', function() {
            acceptBtn.textContent = '\u2026';
            acceptBtn.style.pointerEvents = 'none';
            doSubscribe(function(success) {
                if (success) {
                    heading.textContent = '\u2705 Notifications activ\u00e9es !';
                    desc.textContent = '';
                    acceptBtn.style.display = 'none';
                    declineBtn.style.display = 'none';
                    setTimeout(removeBanner, 2000);
                    // Notify other components
                    try {
                        if (window.showToast) window.showToast('Notifications activ\u00e9es !');
                    } catch (e) {}
                } else {
                    acceptBtn.textContent = 'Oui, m\'alerter';
                    acceptBtn.style.pointerEvents = 'auto';
                }
            });
        });

        declineBtn.addEventListener('click', function() {
            markDeclined();
            removeBanner();
        });

        // Assemble
        banner.appendChild(content);
        banner.appendChild(acceptBtn);
        banner.appendChild(declineBtn);

        document.body.appendChild(banner);

        // Auto-dismiss after 20s
        setTimeout(function() {
            if (document.getElementById(BANNER_ID)) {
                removeBanner();
            }
        }, 20000);
    }

    // ---------- Trigger conditions ----------

    function shouldShowBanner() {
        if (!isSupported()) return false;
        if (isSubscribed()) return false;
        if (isDeclined()) return false;

        try {
            if (Notification.permission === 'denied') return false;
            if (Notification.permission === 'granted') return false; // auto-subscribe handles this
        } catch (e) {
            return false;
        }

        return true;
    }

    function maybeShowBanner() {
        if (!shouldShowBanner()) return;

        // Condition: 2nd visit or more
        if (visitCount >= 2) {
            showBanner();
        }
        // Otherwise wait for cart action trigger
    }

    // ---------- Cart action listener ----------

    function listenForCartAction() {
        if (!shouldShowBanner()) return;

        document.addEventListener('eclat:cart:change', function onCartChange() {
            document.removeEventListener('eclat:cart:change', onCartChange);
            // Small delay so it doesn't interfere with the cart UX
            setTimeout(function() {
                if (shouldShowBanner()) {
                    showBanner();
                }
            }, 1500);
        });
    }

    // ---------- Init ----------

    function init() {
        if (!isSupported()) return;

        // Auto-subscribe if permission already granted
        tryAutoSubscribe();

        // Show banner after delay (not immediately — respectful UX)
        setTimeout(function() {
            maybeShowBanner();
        }, 3500);

        // Listen for significant actions (add to cart)
        listenForCartAction();
    }

    // ---------- Expose ----------

    window.EclatPush = {
        init: init,
        showBanner: showBanner,
        subscribe: doSubscribe,
        isSupported: isSupported,
        isSubscribed: isSubscribed
    };

    // ---------- Auto-init ----------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else if (document.readyState === 'interactive') {
        init();
    } else {
        // complete — delay slightly
        setTimeout(init, 100);
    }
})();
