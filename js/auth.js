/**
 * ÉCLAT Boutique — Module d'authentification Supabase
 * Auto-charge le SDK Supabase, gère la session, l'UI navbar et le dropdown compte.
 * Inclus sur TOUTES les pages via <script src="/js/auth.js" defer></script>
 */

(function() {
    'use strict';

    // --- Sécurité XSS ---
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Config Supabase (public, safe to embed) ──
    var SUPABASE_URL = 'https://omysrhwpyexlcgwyiigq.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXNyaHdweWV4bGNnd3lpaWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzE5MjUsImV4cCI6MjA5MTI0NzkyNX0.SG-q9sE-jNgDm1rCezj84cNIUbphziDAnh6EtuGiIpM';

    // ── Traductions i18n ──
    var i18n = {
        fr: { my_account: 'Mon compte', profile: 'Mon profil', orders: 'Mes commandes', loyalty: 'Ma fidélité', favorites: 'Mes favoris', admin: 'Dashboard Admin', logout: 'Déconnexion', login: 'Se connecter' },
        en: { my_account: 'My account', profile: 'My profile', orders: 'My orders', loyalty: 'My rewards', favorites: 'My favorites', admin: 'Admin Dashboard', logout: 'Log out', login: 'Log in' },
        es: { my_account: 'Mi cuenta', profile: 'Mi perfil', orders: 'Mis pedidos', loyalty: 'Mi fidelidad', favorites: 'Mis favoritos', admin: 'Panel Admin', logout: 'Cerrar sesión', login: 'Iniciar sesión' },
        de: { my_account: 'Mein Konto', profile: 'Mein Profil', orders: 'Meine Bestellungen', loyalty: 'Meine Treue', favorites: 'Meine Favoriten', admin: 'Admin Dashboard', logout: 'Abmelden', login: 'Anmelden' }
    };

    function tr(key) {
        var lang = window.currentLang || document.documentElement.lang || 'fr';
        return (i18n[lang] || i18n.fr)[key] || i18n.fr[key] || key;
    }

    // ── État global auth ──
    window.auth = {
        _supabase: null,
        _session: null,
        _profile: null,
        _ready: false,
        _readyCallbacks: [],

        isSignedIn: function() {
            return !!this._session;
        },

        getUser: function() {
            return this._session ? this._session.user : null;
        },

        getProfile: function() {
            return this._profile;
        },

        getToken: async function() {
            if (!this._session) return null;
            return this._session.access_token;
        },

        signIn: function() {
            var isInPages = window.location.pathname.includes('/pages/');
            window.location.href = isInPages ? 'login.html' : 'pages/login.html';
        },

        signUp: function() {
            var isInPages = window.location.pathname.includes('/pages/');
            window.location.href = isInPages ? 'register.html' : 'pages/register.html';
        },

        signOut: async function() {
            if (this._supabase) {
                await this._supabase.auth.signOut();
                this._session = null;
                this._profile = null;
                window.location.reload();
            }
        },

        isAdmin: function() {
            return this._profile && this._profile.role === 'admin';
        },

        onReady: function(cb) {
            if (this._ready) {
                cb(this);
            } else {
                this._readyCallbacks.push(cb);
            }
        },

        _notifyReady: function() {
            this._ready = true;
            for (var i = 0; i < this._readyCallbacks.length; i++) {
                try { this._readyCallbacks[i](this); } catch(e) { console.error(e); }
            }
            this._readyCallbacks = [];
        }
    };

    // ── Charger le SDK Supabase depuis CDN ──
    function loadSupabaseSDK(callback) {
        if (window.supabase) { callback(); return; }
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = callback;
        script.onerror = function() {
            console.error('[auth] Impossible de charger le SDK Supabase');
            auth._notifyReady();
        };
        document.head.appendChild(script);
    }

    // ── Récupérer le profil via API serveur (bypass RLS) ──
    async function fetchProfile(userId) {
        if (!auth._session) return null;
        try {
            var resp = await fetch('/api/profile', {
                headers: { 'Authorization': 'Bearer ' + auth._session.access_token }
            });
            if (resp.ok) {
                return await resp.json();
            }
            return null;
        } catch (e) {
            console.error('[auth] fetchProfile error:', e);
            return null;
        }
    }

    // ── Bouton compte dans la navbar ──
    function renderAccountButton() {
        var nav = document.querySelector('.nav-actions') || document.querySelector('.nav-container');
        if (!nav) return;

        var existing = document.getElementById('accountBtn');
        if (existing) existing.remove();

        var btn = document.createElement('button');
        btn.id = 'accountBtn';
        btn.className = 'nav-icon-btn';
        btn.setAttribute('aria-label', tr('my_account'));
        btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:8px;position:relative;display:flex;align-items:center;gap:6px;color:inherit;font-family:inherit;font-size:0.85rem;';

        if (auth.isSignedIn()) {
            var profile = auth.getProfile();
            var user = auth.getUser();
            var displayName = (profile && profile.first_name) || (user.user_metadata && user.user_metadata.first_name) || user.email || '?';
            var initial = escapeHTML(displayName[0].toUpperCase());

            btn.innerHTML = '<span style="width:32px;height:32px;border-radius:50%;background:var(--color-secondary,#c9a87c);color:var(--color-primary,#2d2926);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.85rem;">' + initial + '</span>';
            btn.onclick = function(e) {
                e.stopPropagation();
                toggleAccountDropdown();
            };
        } else {
            btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            btn.onclick = function() { auth.signIn(); };
        }

        // Insert before wishlist/cart buttons (after language selector)
        var insertRef = nav.querySelector('.cart-btn') || nav.querySelector('#cartBtn') || nav.querySelector('.mobile-menu-btn');
        if (insertRef) {
            insertRef.parentNode.insertBefore(btn, insertRef);
        } else {
            nav.appendChild(btn);
        }
    }

    // ── Dropdown menu ──
    function toggleAccountDropdown() {
        var existing = document.getElementById('accountDropdown');
        if (existing) { existing.remove(); return; }

        var btn = document.getElementById('accountBtn');
        if (!btn) return;

        var profile = auth.getProfile();
        var user = auth.getUser();
        var rawName = (profile && profile.first_name) || (user.user_metadata && user.user_metadata.first_name) || user.email.split('@')[0];
        var name = escapeHTML(rawName);

        var isInPages = window.location.pathname.includes('/pages/');
        var prefix = isInPages ? '' : 'pages/';

        // Palier fidélité
        var tier = '';
        if (profile) {
            var tiers = { eclat: 'Éclat', lumiere: 'Lumière', prestige: 'Prestige', diamant: 'Diamant' };
            tier = tiers[profile.loyalty_tier] || 'Éclat';
        }

        var dropdown = document.createElement('div');
        dropdown.id = 'accountDropdown';
        dropdown.style.cssText = 'position:absolute;top:100%;right:0;background:var(--color-white,#fff);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);padding:8px 0;min-width:220px;z-index:9200;border:1px solid var(--color-border,#e8e4de);';

        var items = [
            { icon: '👤', label: tr('profile'), href: prefix + 'account.html' },
            { icon: '📦', label: tr('orders'), href: prefix + 'account.html#commandes' },
            { icon: '⭐', label: tr('loyalty'), href: prefix + 'account.html#fidelite' },
            { icon: '❤️', label: tr('favorites'), href: prefix + 'account.html#favoris' }
        ];

        if (auth.isAdmin()) {
            items.push({ icon: '⚙️', label: tr('admin'), href: prefix + 'admin.html' });
        }

        var html = '<div style="padding:12px 16px;border-bottom:1px solid var(--color-border,#e8e4de);">';
        html += '<strong style="font-size:0.9rem;">' + name + '</strong>';
        if (tier) {
            html += '<div style="font-size:0.75rem;color:var(--color-secondary,#c9a87c);margin-top:2px;">' + tier + (profile && profile.loyalty_points != null ? ' — ' + profile.loyalty_points + ' pts' : '') + '</div>';
        }
        html += '</div>';

        for (var i = 0; i < items.length; i++) {
            html += '<a href="' + items[i].href + '" class="hover-bg-alt" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:var(--color-primary,#2d2926);font-size:0.85rem;">' + items[i].icon + ' ' + items[i].label + '</a>';
        }
        html += '<div style="border-top:1px solid var(--color-border,#e8e4de);margin-top:4px;padding-top:4px;"><a href="#" id="logoutLink" class="hover-bg-alt" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:#e74c3c;font-size:0.85rem;">🚪 ' + tr('logout') + '</a></div>';

        dropdown.innerHTML = html;
        btn.style.position = 'relative';
        btn.appendChild(dropdown);

        setTimeout(function() {
            var logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.onclick = function(e) {
                    e.preventDefault();
                    auth.signOut();
                };
            }
        }, 0);

        var closeHandler = function(e) {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(function() { document.addEventListener('click', closeHandler); }, 10);
    }

    // ── Daily login pour streaks ──
    function recordDailyLogin() {
        var lastLogin = localStorage.getItem('eclat_last_login');
        var today = new Date().toISOString().split('T')[0];
        if (lastLogin === today) return;

        localStorage.setItem('eclat_last_login', today);

        auth.getToken().then(function(token) {
            if (!token) return;
            fetch('/api/gamification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ action: 'daily-login' })
            }).catch(function() {});
        });
    }

    // ── Initialisation ──
    function init() {
        if (!SUPABASE_ANON_KEY) {
            console.error('[auth] SUPABASE_ANON_KEY manquante — auth désactivé');
            auth._notifyReady();
            renderAccountButton();
            return;
        }

        loadSupabaseSDK(function() {
            try {
                auth._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

                // Écouter les changements d'auth
                auth._supabase.auth.onAuthStateChange(async function(event, session) {
                    auth._session = session;
                    if (session && session.user) {
                        auth._profile = await fetchProfile(session.user.id);
                    } else {
                        auth._profile = null;
                    }
                    renderAccountButton();

                    if (session && session.user) {
                        recordDailyLogin();
                    }
                });

                // Récupérer la session existante
                auth._supabase.auth.getSession().then(async function(res) {
                    auth._session = res.data.session;
                    if (auth._session && auth._session.user) {
                        auth._profile = await fetchProfile(auth._session.user.id);
                    }
                    renderAccountButton();
                    auth._notifyReady();

                    if (auth.isSignedIn()) {
                        recordDailyLogin();
                    }
                }).catch(function(err) {
                    console.error('[auth] getSession error:', err);
                    auth._notifyReady();
                });

                // Timeout de sécurité — toujours déclencher ready dans les 5s
                setTimeout(function() {
                    if (!auth._ready) {
                        console.error('[auth] Timeout — forçage ready');
                        auth._notifyReady();
                    }
                }, 5000);

            } catch (err) {
                console.error('[auth] Init error:', err);
                auth._notifyReady();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
