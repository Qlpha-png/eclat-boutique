// ============================
// ECLAT -- Bandeau Cookie CNIL/RGPD Granulaire
// Conforme aux recommandations de la CNIL (consentement granulaire)
// 4 langues : FR, EN, ES, DE
// ============================

(function() {
    'use strict';

    // --- Design tokens ---
    var COLORS = {
        primary: 'var(--color-primary,#2d2926)',
        secondary: 'var(--color-secondary,#c9a87c)',
        bg: 'var(--color-bg,#faf8f5)',
        border: 'var(--color-border,#e8e4de)',
        white: 'var(--color-white,#ffffff)',
        textLight: 'var(--color-text-light,#6b6560)',
        success: '#2d7d46',
        overlay: 'rgba(0,0,0,0.45)'
    };

    var FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    var RADIUS = '12px';
    var STORAGE_KEY = 'eclat_cookie_prefs';
    var LAST_UPDATE = '2026-04-10';
    // CNIL: consentement valable 13 mois max = 13 * 30.44 jours
    var MAX_AGE_MS = 13 * 30.44 * 24 * 60 * 60 * 1000;

    // --- Traductions 4 langues ---
    var TEXTS = {
        fr: {
            bannerTitle: 'Gestion des cookies',
            bannerText: 'Nous utilisons des cookies pour assurer le bon fonctionnement du site, analyser le trafic et personnaliser votre experience. Conformement au RGPD et aux recommandations de la CNIL, vous pouvez choisir les cookies que vous acceptez.',
            acceptAll: 'Accepter tout',
            refuseAll: 'Refuser tout',
            customize: 'Personnaliser',
            save: 'Enregistrer mes choix',
            modalTitle: 'Parametres des cookies',
            modalIntro: 'Conformement au RGPD et aux recommandations de la CNIL, vous pouvez activer ou desactiver chaque categorie de cookies ci-dessous. Les cookies necessaires ne peuvent pas etre desactives car ils sont indispensables au fonctionnement du site.',
            privacyLink: 'Consulter notre politique de confidentialite',
            lastUpdate: 'Derniere mise a jour',
            footerLink: 'Gerer les cookies',
            catNecessary: 'Necessaires',
            catNecessaryDesc: 'Cookies indispensables au fonctionnement du site : panier, preferences de langue, jetons d\u2019authentification. Toujours actifs.',
            catAnalytics: 'Analytiques',
            catAnalyticsDesc: 'Nous permettent de mesurer l\u2019audience du site et d\u2019ameliorer nos services (Google Analytics 4 avec anonymisation IP).',
            catMarketing: 'Marketing',
            catMarketingDesc: 'Utilises pour le suivi des conversions et la preuve sociale (Facebook Pixel, notifications de ventes recentes).',
            alwaysOn: 'Toujours actif',
            on: 'Active',
            off: 'Desactive'
        },
        en: {
            bannerTitle: 'Cookie management',
            bannerText: 'We use cookies to ensure the proper functioning of the site, analyze traffic and personalize your experience. In accordance with the GDPR and CNIL recommendations, you can choose which cookies you accept.',
            acceptAll: 'Accept all',
            refuseAll: 'Refuse all',
            customize: 'Customize',
            save: 'Save my choices',
            modalTitle: 'Cookie settings',
            modalIntro: 'In accordance with the GDPR and CNIL recommendations, you can enable or disable each cookie category below. Necessary cookies cannot be disabled as they are essential for the site to function.',
            privacyLink: 'View our privacy policy',
            lastUpdate: 'Last updated',
            footerLink: 'Manage cookies',
            catNecessary: 'Necessary',
            catNecessaryDesc: 'Essential cookies for site operation: cart, language preferences, authentication tokens. Always active.',
            catAnalytics: 'Analytics',
            catAnalyticsDesc: 'Allow us to measure site audience and improve our services (Google Analytics 4 with IP anonymization).',
            catMarketing: 'Marketing',
            catMarketingDesc: 'Used for conversion tracking and social proof (Facebook Pixel, recent sales notifications).',
            alwaysOn: 'Always on',
            on: 'Enabled',
            off: 'Disabled'
        },
        es: {
            bannerTitle: 'Gestion de cookies',
            bannerText: 'Utilizamos cookies para garantizar el correcto funcionamiento del sitio, analizar el trafico y personalizar su experiencia. De conformidad con el RGPD y las recomendaciones de la CNIL, puede elegir las cookies que acepta.',
            acceptAll: 'Aceptar todo',
            refuseAll: 'Rechazar todo',
            customize: 'Personalizar',
            save: 'Guardar mis preferencias',
            modalTitle: 'Configuracion de cookies',
            modalIntro: 'De conformidad con el RGPD y las recomendaciones de la CNIL, puede activar o desactivar cada categoria de cookies a continuacion. Las cookies necesarias no se pueden desactivar ya que son esenciales para el funcionamiento del sitio.',
            privacyLink: 'Consultar nuestra politica de privacidad',
            lastUpdate: 'Ultima actualizacion',
            footerLink: 'Gestionar cookies',
            catNecessary: 'Necesarias',
            catNecessaryDesc: 'Cookies esenciales para el funcionamiento del sitio: carrito, preferencias de idioma, tokens de autenticacion. Siempre activas.',
            catAnalytics: 'Analiticas',
            catAnalyticsDesc: 'Nos permiten medir la audiencia del sitio y mejorar nuestros servicios (Google Analytics 4 con anonimizacion de IP).',
            catMarketing: 'Marketing',
            catMarketingDesc: 'Utilizadas para el seguimiento de conversiones y la prueba social (Facebook Pixel, notificaciones de ventas recientes).',
            alwaysOn: 'Siempre activa',
            on: 'Activada',
            off: 'Desactivada'
        },
        de: {
            bannerTitle: 'Cookie-Verwaltung',
            bannerText: 'Wir verwenden Cookies, um das ordnungsgemaesse Funktionieren der Website zu gewaehrleisten, den Datenverkehr zu analysieren und Ihr Erlebnis zu personalisieren. Gemaess der DSGVO und den Empfehlungen der CNIL koennen Sie waehlen, welche Cookies Sie akzeptieren.',
            acceptAll: 'Alle akzeptieren',
            refuseAll: 'Alle ablehnen',
            customize: 'Anpassen',
            save: 'Meine Auswahl speichern',
            modalTitle: 'Cookie-Einstellungen',
            modalIntro: 'Gemaess der DSGVO und den Empfehlungen der CNIL koennen Sie jede Cookie-Kategorie unten aktivieren oder deaktivieren. Notwendige Cookies koennen nicht deaktiviert werden, da sie fuer das Funktionieren der Website unerlasslich sind.',
            privacyLink: 'Unsere Datenschutzrichtlinie einsehen',
            lastUpdate: 'Letztes Update',
            footerLink: 'Cookies verwalten',
            catNecessary: 'Notwendig',
            catNecessaryDesc: 'Unverzichtbare Cookies fuer den Websitebetrieb: Warenkorb, Spracheinstellungen, Authentifizierungs-Token. Immer aktiv.',
            catAnalytics: 'Analytik',
            catAnalyticsDesc: 'Ermoeglichen es uns, die Besucherzahlen der Website zu messen und unsere Dienste zu verbessern (Google Analytics 4 mit IP-Anonymisierung).',
            catMarketing: 'Marketing',
            catMarketingDesc: 'Werden fuer Conversion-Tracking und Social Proof verwendet (Facebook Pixel, aktuelle Verkaufsbenachrichtigungen).',
            alwaysOn: 'Immer aktiv',
            on: 'Aktiviert',
            off: 'Deaktiviert'
        }
    };

    // --- Helpers ---

    function getLang() {
        // Use the site's global currentLang if available, else detect
        if (typeof currentLang !== 'undefined' && TEXTS[currentLang]) {
            return currentLang;
        }
        var stored = localStorage.getItem('eclat_lang');
        if (stored && TEXTS[stored]) return stored;
        var nav = (navigator.language || '').slice(0, 2);
        return TEXTS[nav] ? nav : 'fr';
    }

    function txt(key) {
        var lang = getLang();
        return TEXTS[lang][key] || TEXTS.fr[key] || key;
    }

    function createEl(tag, styles, attrs) {
        var el = document.createElement(tag);
        if (styles) {
            for (var k in styles) {
                if (styles.hasOwnProperty(k)) el.style[k] = styles[k];
            }
        }
        if (attrs) {
            for (var a in attrs) {
                if (attrs.hasOwnProperty(a)) el.setAttribute(a, attrs[a]);
            }
        }
        return el;
    }

    // --- Storage ---

    function getPrefs() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var prefs = JSON.parse(raw);
            // Check 13-month expiry
            if (prefs.timestamp && (Date.now() - prefs.timestamp > MAX_AGE_MS)) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return prefs;
        } catch (e) {
            return null;
        }
    }

    function savePrefs(analytics, marketing) {
        var prefs = {
            necessary: true,
            analytics: !!analytics,
            marketing: !!marketing,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        // Backward compat with old eclat_cookies key for GA loader in index.html
        if (prefs.analytics) {
            localStorage.setItem('eclat_cookies', 'accepted');
        } else {
            localStorage.setItem('eclat_cookies', 'refused');
        }
        applyConsent(prefs);
        return prefs;
    }

    function applyConsent(prefs) {
        // Fire custom event so other scripts can react
        var evt;
        try {
            evt = new CustomEvent('eclat:cookieconsent', { detail: prefs });
        } catch (e) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent('eclat:cookieconsent', true, true, prefs);
        }
        document.dispatchEvent(evt);
    }

    // --- Banner UI ---

    var bannerEl = null;
    var modalEl = null;
    var overlayEl = null;

    function buildBanner() {
        if (bannerEl) return;

        // Hide old cookie banner if present
        var oldBanner = document.getElementById('cookieBanner');
        if (oldBanner) {
            oldBanner.style.display = 'none';
        }

        // --- BANNER ---
        bannerEl = createEl('div', {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: COLORS.white,
            borderTop: '1px solid ' + COLORS.border,
            padding: '20px 24px',
            zIndex: '10000',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
            fontFamily: FONT,
            transform: 'translateY(100%)',
            transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            boxSizing: 'border-box'
        });
        bannerEl.setAttribute('role', 'dialog');
        bannerEl.setAttribute('aria-label', txt('bannerTitle'));
        bannerEl.id = 'eclatCookieBanner';

        var inner = createEl('div', {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px'
        });

        // Shield icon + text
        var textCol = createEl('div', {
            flex: '1 1 400px',
            minWidth: '0'
        });

        var title = createEl('div', {
            fontWeight: '600',
            fontSize: '15px',
            color: COLORS.primary,
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });
        title.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + COLORS.secondary + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' + txt('bannerTitle');

        var desc = createEl('p', {
            fontSize: '13px',
            lineHeight: '1.5',
            color: COLORS.textLight,
            margin: '0'
        });
        desc.textContent = txt('bannerText');

        textCol.appendChild(title);
        textCol.appendChild(desc);

        // Buttons
        var btnCol = createEl('div', {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            flexShrink: '0'
        });

        var btnBase = {
            padding: '10px 20px',
            borderRadius: RADIUS,
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            lineHeight: '1'
        };

        // Refuser tout
        var btnRefuse = createEl('button', Object.assign({}, btnBase, {
            background: 'transparent',
            color: COLORS.textLight,
            border: '1px solid ' + COLORS.border
        }));
        btnRefuse.textContent = txt('refuseAll');
        btnRefuse.onmouseover = function() { this.style.borderColor = COLORS.primary; this.style.color = COLORS.primary; };
        btnRefuse.onmouseout = function() { this.style.borderColor = COLORS.border; this.style.color = COLORS.textLight; };
        btnRefuse.onclick = function() {
            savePrefs(false, false);
            hideBanner();
        };

        // Personnaliser
        var btnCustom = createEl('button', Object.assign({}, btnBase, {
            background: 'transparent',
            color: COLORS.primary,
            border: '1px solid ' + COLORS.primary
        }));
        btnCustom.textContent = txt('customize');
        btnCustom.onmouseover = function() { this.style.background = COLORS.primary; this.style.color = COLORS.white; };
        btnCustom.onmouseout = function() { this.style.background = 'transparent'; this.style.color = COLORS.primary; };
        btnCustom.onclick = function() {
            showModal();
        };

        // Accepter tout
        var btnAccept = createEl('button', Object.assign({}, btnBase, {
            background: COLORS.primary,
            color: COLORS.white,
            border: '1px solid ' + COLORS.primary
        }));
        btnAccept.textContent = txt('acceptAll');
        btnAccept.onmouseover = function() { this.style.background = COLORS.secondary; this.style.borderColor = COLORS.secondary; };
        btnAccept.onmouseout = function() { this.style.background = COLORS.primary; this.style.borderColor = COLORS.primary; };
        btnAccept.onclick = function() {
            savePrefs(true, true);
            hideBanner();
        };

        btnCol.appendChild(btnRefuse);
        btnCol.appendChild(btnCustom);
        btnCol.appendChild(btnAccept);

        inner.appendChild(textCol);
        inner.appendChild(btnCol);
        bannerEl.appendChild(inner);

        document.body.appendChild(bannerEl);

        // Animate in
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                bannerEl.style.transform = 'translateY(0)';
            });
        });
    }

    function hideBanner() {
        if (!bannerEl) return;
        bannerEl.style.transform = 'translateY(100%)';
        setTimeout(function() {
            if (bannerEl && bannerEl.parentNode) {
                bannerEl.parentNode.removeChild(bannerEl);
            }
            bannerEl = null;
        }, 400);
    }

    // --- Modal UI ---

    function buildToggle(id, checked, disabled) {
        var wrap = createEl('div', {
            position: 'relative',
            width: '44px',
            height: '24px',
            flexShrink: '0'
        });

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;
        input.disabled = !!disabled;
        input.id = id;
        input.style.cssText = 'position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:' + (disabled ? 'not-allowed' : 'pointer') + ';z-index:2;';

        var track = createEl('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderRadius: '12px',
            background: checked ? (disabled ? COLORS.textLight : COLORS.secondary) : COLORS.border,
            transition: 'background 0.2s ease',
            opacity: disabled ? '0.6' : '1'
        });

        var knob = createEl('div', {
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: COLORS.white,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease'
        });

        if (!disabled) {
            input.onchange = function() {
                track.style.background = this.checked ? COLORS.secondary : COLORS.border;
                knob.style.left = this.checked ? '22px' : '2px';
            };
        }

        wrap.appendChild(input);
        wrap.appendChild(track);
        wrap.appendChild(knob);

        return wrap;
    }

    function buildCategoryRow(catKey, descKey, toggleId, checked, disabled) {
        var row = createEl('div', {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '16px 0',
            borderBottom: '1px solid ' + COLORS.border
        });

        var info = createEl('div', { flex: '1', minWidth: '0' });

        var catName = createEl('div', {
            fontWeight: '600',
            fontSize: '14px',
            color: COLORS.primary,
            marginBottom: '4px'
        });
        catName.textContent = txt(catKey);

        var catDesc = createEl('div', {
            fontSize: '12px',
            lineHeight: '1.5',
            color: COLORS.textLight
        });
        catDesc.textContent = txt(descKey);

        info.appendChild(catName);
        info.appendChild(catDesc);

        var rightCol = createEl('div', {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            paddingTop: '2px'
        });

        var toggle = buildToggle(toggleId, checked, disabled);
        rightCol.appendChild(toggle);

        if (disabled) {
            var badge = createEl('span', {
                fontSize: '10px',
                color: COLORS.textLight,
                fontStyle: 'italic',
                whiteSpace: 'nowrap'
            });
            badge.textContent = txt('alwaysOn');
            rightCol.appendChild(badge);
        }

        row.appendChild(info);
        row.appendChild(rightCol);

        return row;
    }

    function showModal() {
        if (modalEl) return;

        var prefs = getPrefs();
        var analyticsOn = prefs ? prefs.analytics : false;
        var marketingOn = prefs ? prefs.marketing : false;

        // Overlay
        overlayEl = createEl('div', {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: COLORS.overlay,
            zIndex: '10001',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        overlayEl.onclick = function() { hideModal(); };

        // Modal
        modalEl = createEl('div', {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.95)',
            background: COLORS.bg,
            borderRadius: RADIUS,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            zIndex: '10002',
            width: '90vw',
            maxWidth: '540px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: FONT,
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-label', txt('modalTitle'));

        // Header
        var header = createEl('div', {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid ' + COLORS.border
        });

        var modalTitle = createEl('h3', {
            margin: '0',
            fontSize: '18px',
            fontWeight: '700',
            color: COLORS.primary
        });
        modalTitle.textContent = txt('modalTitle');

        var closeBtn = createEl('button', {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: COLORS.textLight,
            padding: '0',
            lineHeight: '1',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
        });
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onmouseover = function() { this.style.background = COLORS.border; };
        closeBtn.onmouseout = function() { this.style.background = 'none'; };
        closeBtn.onclick = function() { hideModal(); };

        header.appendChild(modalTitle);
        header.appendChild(closeBtn);

        // Scrollable body
        var body = createEl('div', {
            padding: '16px 24px',
            overflowY: 'auto',
            flex: '1'
        });

        var intro = createEl('p', {
            fontSize: '13px',
            lineHeight: '1.6',
            color: COLORS.textLight,
            margin: '0 0 8px'
        });
        intro.textContent = txt('modalIntro');

        body.appendChild(intro);

        // Privacy policy link
        var pLink = createEl('a', {
            fontSize: '13px',
            color: COLORS.secondary,
            textDecoration: 'underline',
            display: 'inline-block',
            marginBottom: '16px'
        });
        pLink.href = '/pages/confidentialite.html';
        pLink.textContent = txt('privacyLink');
        body.appendChild(pLink);

        // Category rows
        body.appendChild(buildCategoryRow('catNecessary', 'catNecessaryDesc', 'ccToggleNecessary', true, true));
        body.appendChild(buildCategoryRow('catAnalytics', 'catAnalyticsDesc', 'ccToggleAnalytics', analyticsOn, false));
        body.appendChild(buildCategoryRow('catMarketing', 'catMarketingDesc', 'ccToggleMarketing', marketingOn, false));

        // Last update date
        var updateInfo = createEl('div', {
            fontSize: '11px',
            color: COLORS.textLight,
            marginTop: '16px',
            fontStyle: 'italic'
        });
        updateInfo.textContent = txt('lastUpdate') + ' : ' + LAST_UPDATE;
        body.appendChild(updateInfo);

        // Footer buttons
        var footer = createEl('div', {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '16px 24px',
            borderTop: '1px solid ' + COLORS.border,
            flexWrap: 'wrap'
        });

        var footerBtnBase = {
            padding: '10px 22px',
            borderRadius: RADIUS,
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
            lineHeight: '1'
        };

        var btnRefuseModal = createEl('button', Object.assign({}, footerBtnBase, {
            background: 'transparent',
            color: COLORS.textLight,
            border: '1px solid ' + COLORS.border
        }));
        btnRefuseModal.textContent = txt('refuseAll');
        btnRefuseModal.onmouseover = function() { this.style.borderColor = COLORS.primary; this.style.color = COLORS.primary; };
        btnRefuseModal.onmouseout = function() { this.style.borderColor = COLORS.border; this.style.color = COLORS.textLight; };
        btnRefuseModal.onclick = function() {
            savePrefs(false, false);
            hideModal();
            hideBanner();
        };

        var btnAcceptModal = createEl('button', Object.assign({}, footerBtnBase, {
            background: 'transparent',
            color: COLORS.primary,
            border: '1px solid ' + COLORS.primary
        }));
        btnAcceptModal.textContent = txt('acceptAll');
        btnAcceptModal.onmouseover = function() { this.style.background = COLORS.primary; this.style.color = COLORS.white; };
        btnAcceptModal.onmouseout = function() { this.style.background = 'transparent'; this.style.color = COLORS.primary; };
        btnAcceptModal.onclick = function() {
            savePrefs(true, true);
            hideModal();
            hideBanner();
        };

        var btnSave = createEl('button', Object.assign({}, footerBtnBase, {
            background: COLORS.primary,
            color: COLORS.white,
            border: '1px solid ' + COLORS.primary
        }));
        btnSave.textContent = txt('save');
        btnSave.onmouseover = function() { this.style.background = COLORS.secondary; this.style.borderColor = COLORS.secondary; };
        btnSave.onmouseout = function() { this.style.background = COLORS.primary; this.style.borderColor = COLORS.primary; };
        btnSave.onclick = function() {
            var a = document.getElementById('ccToggleAnalytics');
            var m = document.getElementById('ccToggleMarketing');
            savePrefs(a ? a.checked : false, m ? m.checked : false);
            hideModal();
            hideBanner();
        };

        footer.appendChild(btnRefuseModal);
        footer.appendChild(btnAcceptModal);
        footer.appendChild(btnSave);

        modalEl.appendChild(header);
        modalEl.appendChild(body);
        modalEl.appendChild(footer);

        document.body.appendChild(overlayEl);
        document.body.appendChild(modalEl);

        // Animate in
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                overlayEl.style.opacity = '1';
                modalEl.style.opacity = '1';
                modalEl.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Trap focus with Escape key
        var escHandler = function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                hideModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    function hideModal() {
        if (overlayEl) {
            overlayEl.style.opacity = '0';
        }
        if (modalEl) {
            modalEl.style.opacity = '0';
            modalEl.style.transform = 'translate(-50%, -50%) scale(0.95)';
        }
        setTimeout(function() {
            if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
            if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
            overlayEl = null;
            modalEl = null;
        }, 300);
    }

    // --- Footer link injection ---

    function injectFooterLink() {
        // Find the "Legal" footer column that contains confidentialite link
        var legalLinks = document.querySelectorAll('footer a[href*="confidentialite"]');
        if (legalLinks.length > 0) {
            var parentUl = legalLinks[0].closest('ul');
            if (parentUl) {
                var li = document.createElement('li');
                var a = createEl('a', {
                    cursor: 'pointer',
                    color: 'inherit',
                    textDecoration: 'none'
                });
                a.href = '#';
                a.id = 'cookieFooterLink';
                a.textContent = txt('footerLink');
                a.onclick = function(e) {
                    e.preventDefault();
                    window.CookieConsent.show();
                };
                li.appendChild(a);
                parentUl.appendChild(li);
            }
        }
    }

    // --- Public API ---

    window.CookieConsent = {
        hasConsent: function(category) {
            var prefs = getPrefs();
            if (!prefs) return false;
            if (category === 'necessary') return true;
            return !!prefs[category];
        },

        show: function() {
            // Remove existing elements first
            if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
            bannerEl = null;
            hideModal();
            buildBanner();
        },

        getPreferences: function() {
            return getPrefs();
        }
    };

    // --- Init ---

    function init() {
        // Hide old cookie banner
        var oldBanner = document.getElementById('cookieBanner');
        if (oldBanner) {
            oldBanner.style.display = 'none';
        }

        // Inject footer link
        injectFooterLink();

        // Check if preferences already exist and are not expired
        var prefs = getPrefs();
        if (prefs) {
            // Preferences exist, apply them silently (no banner)
            applyConsent(prefs);
            return;
        }

        // No preferences: show banner
        buildBanner();
    }

    // Run on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
