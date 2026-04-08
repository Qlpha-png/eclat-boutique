/**
 * ÉCLAT Boutique — Module d'authentification Clerk
 * Gère l'initialisation Clerk, la session utilisateur, et l'UI navbar
 */

(function() {
    'use strict';

    // Clerk publishable key (public, safe to embed)
    var CLERK_PK = 'pk_test_Y2xhc3NpYy10YXBpci00OC5jbGVyay5hY2NvdW50cy5kZXYk';

    // État global auth
    window.auth = {
        _clerk: null,
        _ready: false,
        _readyCallbacks: [],

        /** Vérifie si l'utilisateur est connecté */
        isSignedIn: function() {
            return this._clerk && this._clerk.user ? true : false;
        },

        /** Retourne l'utilisateur Clerk ou null */
        getUser: function() {
            return this._clerk && this._clerk.user ? this._clerk.user : null;
        },

        /** Retourne le token JWT pour les appels API authentifiés */
        getToken: async function() {
            if (!this._clerk || !this._clerk.session) return null;
            try {
                return await this._clerk.session.getToken();
            } catch (e) {
                console.error('[auth] getToken error:', e);
                return null;
            }
        },

        /** Ouvre le modal de connexion Clerk */
        signIn: function() {
            if (this._clerk) this._clerk.openSignIn();
        },

        /** Ouvre le modal d'inscription Clerk */
        signUp: function() {
            if (this._clerk) this._clerk.openSignUp();
        },

        /** Déconnecte l'utilisateur */
        signOut: async function() {
            if (this._clerk) {
                await this._clerk.signOut();
                window.location.reload();
            }
        },

        /** Vérifie si l'utilisateur est admin (via metadata Clerk) */
        isAdmin: function() {
            var user = this.getUser();
            if (!user) return false;
            var meta = user.publicMetadata || {};
            return meta.role === 'admin';
        },

        /** Exécute un callback quand Clerk est prêt */
        onReady: function(cb) {
            if (this._ready) {
                cb(this);
            } else {
                this._readyCallbacks.push(cb);
            }
        },

        /** Notifie tous les callbacks enregistrés */
        _notifyReady: function() {
            this._ready = true;
            for (var i = 0; i < this._readyCallbacks.length; i++) {
                try { this._readyCallbacks[i](this); } catch(e) { console.error(e); }
            }
            this._readyCallbacks = [];
        }
    };

    /**
     * Injecte le bouton compte dans la navbar
     */
    function renderAccountButton() {
        var nav = document.querySelector('.nav-actions') || document.querySelector('.nav-container');
        if (!nav) return;

        // Vérifie qu'on n'a pas déjà injecté le bouton
        if (document.getElementById('accountBtn')) return;

        var btn = document.createElement('button');
        btn.id = 'accountBtn';
        btn.className = 'nav-icon-btn';
        btn.setAttribute('aria-label', typeof t === 'function' ? t('account_login') || 'Mon compte' : 'Mon compte');
        btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:8px;position:relative;display:flex;align-items:center;gap:6px;color:inherit;font-family:inherit;font-size:0.85rem;';

        if (auth.isSignedIn()) {
            var user = auth.getUser();
            var initial = (user.firstName || user.emailAddresses[0].emailAddress || '?')[0].toUpperCase();
            btn.innerHTML = '<span style="width:32px;height:32px;border-radius:50%;background:var(--color-secondary,#c9a87c);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.85rem;">' + initial + '</span>';
            btn.onclick = function(e) {
                e.stopPropagation();
                toggleAccountDropdown();
            };
        } else {
            btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            btn.onclick = function() {
                auth.signIn();
            };
        }

        // Insérer avant le bouton panier
        var cartBtn = nav.querySelector('.cart-toggle') || nav.querySelector('[onclick*="cart"]');
        if (cartBtn) {
            cartBtn.parentNode.insertBefore(btn, cartBtn);
        } else {
            nav.appendChild(btn);
        }
    }

    /**
     * Dropdown menu pour utilisateur connecté
     */
    function toggleAccountDropdown() {
        var existing = document.getElementById('accountDropdown');
        if (existing) {
            existing.remove();
            return;
        }

        var btn = document.getElementById('accountBtn');
        if (!btn) return;

        var user = auth.getUser();
        var name = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0];

        // Déterminer le chemin relatif vers /pages/
        var isInPages = window.location.pathname.includes('/pages/');
        var prefix = isInPages ? '' : 'pages/';

        var dropdown = document.createElement('div');
        dropdown.id = 'accountDropdown';
        dropdown.style.cssText = 'position:absolute;top:100%;right:0;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);padding:8px 0;min-width:200px;z-index:10000;border:1px solid rgba(0,0,0,0.08);';

        var items = [
            { icon: '👤', label: typeof t === 'function' ? t('account_profile') || 'Mon profil' : 'Mon profil', href: prefix + 'account.html' },
            { icon: '📦', label: typeof t === 'function' ? t('account_orders') || 'Mes commandes' : 'Mes commandes', href: prefix + 'account.html#commandes' },
            { icon: '⭐', label: typeof t === 'function' ? t('account_loyalty') || 'Ma fidélité' : 'Ma fidélité', href: prefix + 'account.html#fidelite' }
        ];

        if (auth.isAdmin()) {
            items.push({ icon: '⚙️', label: 'Dashboard Admin', href: prefix + 'admin.html' });
        }

        var html = '<div style="padding:12px 16px;border-bottom:1px solid #eee;"><strong style="font-size:0.9rem;">' + name + '</strong></div>';
        for (var i = 0; i < items.length; i++) {
            html += '<a href="' + items[i].href + '" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:#333;font-size:0.85rem;transition:background 0.15s;" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'transparent\'">' + items[i].icon + ' ' + items[i].label + '</a>';
        }
        html += '<div style="border-top:1px solid #eee;margin-top:4px;padding-top:4px;"><a href="#" id="logoutLink" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:#e74c3c;font-size:0.85rem;" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'transparent\'">🚪 ' + (typeof t === 'function' ? t('account_logout') || 'Déconnexion' : 'Déconnexion') + '</a></div>';

        dropdown.innerHTML = html;

        // Position relative au bouton
        btn.style.position = 'relative';
        btn.appendChild(dropdown);

        // Logout handler
        setTimeout(function() {
            var logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.onclick = function(e) {
                    e.preventDefault();
                    auth.signOut();
                };
            }
        }, 0);

        // Fermer au clic extérieur
        var closeHandler = function(e) {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(function() {
            document.addEventListener('click', closeHandler);
        }, 10);
    }

    /**
     * Initialise Clerk quand le script CDN est chargé
     */
    function initClerk() {
        if (typeof window.Clerk === 'undefined') {
            // Le script CDN n'est pas encore chargé, réessayer
            setTimeout(initClerk, 100);
            return;
        }

        var clerkInstance = window.Clerk;

        clerkInstance.load({
            appearance: {
                variables: {
                    colorPrimary: '#c9a87c',
                    colorText: '#2d2926',
                    colorBackground: '#faf8f5',
                    colorInputBackground: '#ffffff',
                    colorInputText: '#2d2926',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            localization: getClerkLocale()
        }).then(function() {
            auth._clerk = clerkInstance;
            renderAccountButton();
            auth._notifyReady();

            // Écouter les changements de session
            clerkInstance.addListener(function() {
                renderAccountButton();
            });

            // Daily login pour le streak (si connecté)
            if (auth.isSignedIn()) {
                recordDailyLogin();
            }
        }).catch(function(err) {
            console.error('[auth] Clerk init error:', err);
            auth._notifyReady(); // Notifier quand même pour ne pas bloquer l'app
        });
    }

    /**
     * Retourne la localisation Clerk selon la langue du site
     * Le CDN Clerk nécessite un objet de traduction explicite
     */
    function getClerkLocale() {
        var lang = window.currentLang || document.documentElement.lang || 'fr';
        var translations = {
            'fr': {
                signIn: { start: { title: 'Connexion', subtitle: 'pour continuer sur Maison ÉCLAT', actionText: 'Pas encore de compte ?', actionLink: 'Inscription' },
                    password: { title: 'Entrez votre mot de passe', subtitle: '', actionText: 'Utiliser une autre méthode', actionLink: '' } },
                signUp: { start: { title: 'Inscription', subtitle: 'pour continuer sur Maison ÉCLAT', actionText: 'Déjà un compte ?', actionLink: 'Connexion' } },
                userButton: { action__signOut: 'Déconnexion', action__manageAccount: 'Gérer le compte' },
                userProfile: { start: { headerTitle__account: 'Compte', headerTitle__security: 'Sécurité' } },
                formFieldLabel__emailAddress: 'Adresse email',
                formFieldLabel__username: 'Nom d\'utilisateur',
                formFieldLabel__password: 'Mot de passe',
                formFieldLabel__firstName: 'Prénom',
                formFieldLabel__lastName: 'Nom',
                formButtonPrimary: 'Continuer',
                socialButtonsBlockButton: 'Continuer avec {{provider}}',
                dividerText: 'ou',
                footerActionLink__useAnotherMethod: 'Utiliser une autre méthode'
            },
            'en': undefined,
            'es': {
                signIn: { start: { title: 'Iniciar sesión', subtitle: 'para continuar en Maison ÉCLAT', actionText: '¿No tienes cuenta?', actionLink: 'Regístrate' } },
                signUp: { start: { title: 'Registro', subtitle: 'para continuar en Maison ÉCLAT', actionText: '¿Ya tienes cuenta?', actionLink: 'Iniciar sesión' } },
                formFieldLabel__emailAddress: 'Correo electrónico',
                formFieldLabel__password: 'Contraseña',
                formFieldLabel__firstName: 'Nombre',
                formFieldLabel__lastName: 'Apellido',
                formButtonPrimary: 'Continuar',
                socialButtonsBlockButton: 'Continuar con {{provider}}',
                dividerText: 'o'
            },
            'de': {
                signIn: { start: { title: 'Anmelden', subtitle: 'um bei Maison ÉCLAT fortzufahren', actionText: 'Kein Konto?', actionLink: 'Registrieren' } },
                signUp: { start: { title: 'Registrieren', subtitle: 'um bei Maison ÉCLAT fortzufahren', actionText: 'Bereits ein Konto?', actionLink: 'Anmelden' } },
                formFieldLabel__emailAddress: 'E-Mail-Adresse',
                formFieldLabel__password: 'Passwort',
                formFieldLabel__firstName: 'Vorname',
                formFieldLabel__lastName: 'Nachname',
                formButtonPrimary: 'Weiter',
                socialButtonsBlockButton: 'Weiter mit {{provider}}',
                dividerText: 'oder'
            }
        };
        return translations[lang];
    }

    /**
     * Enregistre le login quotidien pour le système de streak
     */
    function recordDailyLogin() {
        var lastLogin = localStorage.getItem('eclat_last_login');
        var today = new Date().toISOString().split('T')[0];
        if (lastLogin === today) return; // Déjà enregistré aujourd'hui

        localStorage.setItem('eclat_last_login', today);

        // Appel API pour enregistrer le login (sera créé en Phase 3)
        auth.getToken().then(function(token) {
            if (!token) return;
            fetch('/api/gamification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ action: 'daily-login' })
            }).catch(function() {}); // Silencieux si l'API n'existe pas encore
        });
    }

    // Lancer l'initialisation au DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClerk);
    } else {
        initClerk();
    }
})();
