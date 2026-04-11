// ============================
// MAISON ÉCLAT — Bouton Signaler un Problème / Bug
// Flottant en bas-gauche, modal accessible, stockage Supabase
// ============================

(function() {
    'use strict';

    // ── Sécurité XSS ──
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ── Config ──
    var API_URL = '/api/bug-report';
    var MAX_DESC_LENGTH = 3000;
    var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

    // ── Injection CSS ──
    function injectStyles() {
        if (document.getElementById('bugReportStyles')) return;
        var style = document.createElement('style');
        style.id = 'bugReportStyles';
        style.textContent = [
            // Bouton flottant
            '#bugReportBtn {',
            '  position: fixed; bottom: 24px; left: 24px; z-index: 7500;',
            '  width: 44px; height: 44px; border-radius: 50%;',
            '  background: var(--color-primary, #2d2926); color: #fff;',
            '  border: 2px solid var(--color-secondary, #c9a87c);',
            '  cursor: pointer; display: flex; align-items: center; justify-content: center;',
            '  box-shadow: 0 3px 12px rgba(0,0,0,0.2);',
            '  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;',
            '  font-size: 0; line-height: 1; padding: 0;',
            '}',
            '#bugReportBtn:hover, #bugReportBtn:focus-visible {',
            '  transform: scale(1.1);',
            '  box-shadow: 0 4px 20px rgba(0,0,0,0.3);',
            '  background: var(--color-secondary, #c9a87c);',
            '  outline: none;',
            '}',
            '#bugReportBtn svg { width: 20px; height: 20px; fill: currentColor; pointer-events: none; }',
            // Tooltip
            '#bugReportBtn .br-tooltip {',
            '  position: absolute; left: 52px; top: 50%; transform: translateY(-50%);',
            '  background: var(--color-primary, #2d2926); color: #fff;',
            '  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem;',
            '  white-space: nowrap; pointer-events: none;',
            '  opacity: 0; transition: opacity 0.2s;',
            '}',
            '#bugReportBtn:hover .br-tooltip, #bugReportBtn:focus-visible .br-tooltip { opacity: 1; }',
            // Overlay
            '#bugReportOverlay {',
            '  position: fixed; inset: 0; z-index: 9950;',
            '  background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);',
            '  opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;',
            '}',
            '#bugReportOverlay.open { opacity: 1; visibility: visible; }',
            // Modal
            '#bugReportModal {',
            '  position: fixed; bottom: 80px; left: 24px; z-index: 9960;',
            '  width: 380px; max-width: calc(100vw - 32px);',
            '  max-height: calc(100vh - 100px); overflow-y: auto;',
            '  background: var(--color-white, #fff); border-radius: 16px;',
            '  box-shadow: 0 12px 48px rgba(0,0,0,0.2);',
            '  font-family: var(--font-body, "Inter", sans-serif);',
            '  opacity: 0; visibility: hidden; transform: translateY(20px) scale(0.95);',
            '  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
            '}',
            '#bugReportModal.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }',
            // Header
            '.br-header {',
            '  background: var(--color-primary, #2d2926); color: #fff;',
            '  padding: 16px 20px; border-radius: 16px 16px 0 0;',
            '  display: flex; justify-content: space-between; align-items: center;',
            '}',
            '.br-header-title { font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }',
            '.br-header-title svg { width: 18px; height: 18px; fill: var(--color-secondary, #c9a87c); }',
            '.br-close {',
            '  color: #fff; font-size: 1.4rem; cursor: pointer;',
            '  background: none; border: none; padding: 0; line-height: 1;',
            '  transition: opacity 0.2s;',
            '}',
            '.br-close:hover { opacity: 0.7; }',
            // Body
            '.br-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }',
            // Form elements
            '.br-field { display: flex; flex-direction: column; gap: 6px; }',
            '.br-label {',
            '  font-size: 0.8rem; font-weight: 600;',
            '  color: var(--color-text, #2d2926); text-transform: uppercase;',
            '  letter-spacing: 0.5px;',
            '}',
            '.br-label .br-optional { font-weight: 400; text-transform: none; color: var(--color-text-light, #888); font-size: 0.75rem; }',
            '.br-select, .br-input, .br-textarea {',
            '  padding: 10px 14px; border: 1px solid var(--color-border, #e0dcd7);',
            '  border-radius: 10px; font-size: 0.85rem; font-family: inherit;',
            '  background: var(--color-bg, #faf8f5); color: var(--color-text, #2d2926);',
            '  transition: border-color 0.2s; outline: none;',
            '}',
            '.br-select:focus, .br-input:focus, .br-textarea:focus {',
            '  border-color: var(--color-secondary, #c9a87c);',
            '}',
            '.br-textarea { resize: vertical; min-height: 100px; max-height: 200px; line-height: 1.5; }',
            '.br-char-count { font-size: 0.7rem; color: var(--color-text-light, #888); text-align: right; }',
            '.br-char-count.warn { color: #c0392b; }',
            // File input
            '.br-file-wrap {',
            '  position: relative; display: flex; align-items: center; gap: 10px;',
            '}',
            '.br-file-label {',
            '  display: flex; align-items: center; gap: 6px;',
            '  padding: 8px 14px; border: 1px dashed var(--color-border, #e0dcd7);',
            '  border-radius: 10px; font-size: 0.8rem; cursor: pointer;',
            '  color: var(--color-text-light, #888); transition: border-color 0.2s;',
            '  background: var(--color-bg, #faf8f5);',
            '}',
            '.br-file-label:hover { border-color: var(--color-secondary, #c9a87c); }',
            '.br-file-label svg { width: 16px; height: 16px; fill: currentColor; }',
            '.br-file-input { position: absolute; width: 0; height: 0; opacity: 0; }',
            '.br-file-name { font-size: 0.75rem; color: var(--color-text, #2d2926); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
            '.br-file-remove {',
            '  background: none; border: none; color: #c0392b; cursor: pointer;',
            '  font-size: 1rem; line-height: 1; padding: 2px;',
            '}',
            // Page info
            '.br-page-info {',
            '  font-size: 0.7rem; color: var(--color-text-light, #888);',
            '  background: var(--color-bg-alt, #f3efe9); padding: 8px 12px;',
            '  border-radius: 8px;',
            '}',
            // Submit
            '.br-submit {',
            '  width: 100%; padding: 12px; border: none; border-radius: 10px;',
            '  background: var(--color-primary, #2d2926); color: #fff;',
            '  font-size: 0.9rem; font-weight: 600; cursor: pointer;',
            '  transition: background 0.2s, transform 0.1s;',
            '  font-family: inherit;',
            '}',
            '.br-submit:hover:not(:disabled) { background: var(--color-secondary, #c9a87c); }',
            '.br-submit:active:not(:disabled) { transform: scale(0.98); }',
            '.br-submit:disabled { opacity: 0.5; cursor: not-allowed; }',
            // Success
            '.br-success {',
            '  text-align: center; padding: 30px 20px;',
            '}',
            '.br-success-icon { font-size: 2.5rem; margin-bottom: 12px; }',
            '.br-success-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary, #2d2926); }',
            '.br-success-msg { font-size: 0.85rem; color: var(--color-text-light, #888); line-height: 1.5; }',
            '.br-success-ref { font-family: monospace; font-weight: 700; color: var(--color-secondary, #c9a87c); }',
            // Error
            '.br-error {',
            '  font-size: 0.8rem; color: #c0392b; padding: 8px 12px;',
            '  background: #fdf0ef; border-radius: 8px; display: none;',
            '}',
            // Mobile
            '@media (max-width: 480px) {',
            '  #bugReportModal { left: 8px; right: 8px; bottom: 72px; width: auto; }',
            '  #bugReportBtn { bottom: 18px; left: 18px; width: 40px; height: 40px; }',
            '  #bugReportBtn svg { width: 18px; height: 18px; }',
            '}',
            // Avec floating CTA visible, decaler le bouton vers le haut
            '.floating-cta[style*="flex"] ~ #bugReportBtn,',
            '.floating-cta:not([style*="none"]) ~ #bugReportBtn {',
            '  bottom: 80px;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // ── SVG Icons (CSS-only, aucune dépendance) ──
    var ICONS = {
        bug: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10.34 2 9 3.34 9 5h6c0-1.66-1.34-3-3-3zM20 9h-2.06c-.06-.33-.15-.66-.27-.97L19.5 6.2 18.09 4.8 16.26 6.63A5.49 5.49 0 0 0 12 5a5.49 5.49 0 0 0-4.26 1.63L5.91 4.8 4.5 6.2l1.83 1.83c-.12.31-.21.64-.27.97H4v2h2.02c0 .17-.02.34-.02.5V12H4v2h2v.5c0 .17.02.34.02.5H4v2h2.06c.73 2.28 2.84 3.95 5.36 3.99h.01.01c2.52-.04 4.63-1.71 5.36-3.99H19v-2h-2.02c.01-.16.02-.33.02-.5V14h2v-2h-2v-1.5c0-.16-.01-.33-.02-.5H19V9zm-4 6.5c0 2.21-1.79 4-4 4s-4-1.79-4-4v-4c0-2.21 1.79-4 4-4s4 1.79 4 4v4zM10 12h4v2h-4v-2zm0-3h4v2h-4V9z"/></svg>',
        camera: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>'
    };

    // ── Détecter l'email utilisateur si connecté ──
    function getUserEmail() {
        try {
            if (window.EclatAuth && window.EclatAuth.user) {
                return window.EclatAuth.user.email || '';
            }
            var session = localStorage.getItem('eclat_session');
            if (session) {
                var parsed = JSON.parse(session);
                return (parsed.user && parsed.user.email) || '';
            }
        } catch (e) {}
        return '';
    }

    // ── Créer le DOM ──
    function createUI() {
        // Bouton flottant
        var btn = document.createElement('button');
        btn.id = 'bugReportBtn';
        btn.setAttribute('aria-label', 'Signaler un problème');
        btn.setAttribute('title', 'Signaler un problème');
        btn.setAttribute('type', 'button');
        btn.innerHTML = ICONS.bug + '<span class="br-tooltip">Signaler un problème</span>';
        document.body.appendChild(btn);

        // Overlay
        var overlay = document.createElement('div');
        overlay.id = 'bugReportOverlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);

        // Modal
        var modal = document.createElement('div');
        modal.id = 'bugReportModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Signaler un problème');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = buildFormHTML();
        document.body.appendChild(modal);

        return { btn: btn, overlay: overlay, modal: modal };
    }

    function buildFormHTML() {
        var email = escapeHTML(getUserEmail());
        var page = escapeHTML(window.location.pathname + window.location.search);

        return [
            '<div class="br-header">',
            '  <span class="br-header-title">' + ICONS.bug + ' Signaler un problème</span>',
            '  <button class="br-close" aria-label="Fermer" type="button">&times;</button>',
            '</div>',
            '<div class="br-body" id="brFormBody">',
            '  <div class="br-field">',
            '    <label class="br-label" for="brType">Type de signalement</label>',
            '    <select class="br-select" id="brType" required>',
            '      <option value="bug">Bug / Erreur</option>',
            '      <option value="suggestion">Suggestion</option>',
            '      <option value="question">Question</option>',
            '    </select>',
            '  </div>',
            '  <div class="br-field">',
            '    <label class="br-label" for="brDesc">Description</label>',
            '    <textarea class="br-textarea" id="brDesc" placeholder="Décrivez le problème rencontré..." required maxlength="' + MAX_DESC_LENGTH + '"></textarea>',
            '    <span class="br-char-count" id="brCharCount">0 / ' + MAX_DESC_LENGTH + '</span>',
            '  </div>',
            '  <div class="br-field">',
            '    <label class="br-label" for="brEmail">Email <span class="br-optional">(optionnel)</span></label>',
            '    <input class="br-input" id="brEmail" type="email" placeholder="votre@email.com" value="' + email + '">',
            '  </div>',
            '  <div class="br-field">',
            '    <label class="br-label">Capture d\'écran <span class="br-optional">(optionnel, max 5 Mo)</span></label>',
            '    <div class="br-file-wrap" id="brFileWrap">',
            '      <label class="br-file-label" for="brFile" tabindex="0" role="button" aria-label="Joindre une capture d\'écran">',
            '        ' + ICONS.camera + ' Joindre une image',
            '      </label>',
            '      <input class="br-file-input" id="brFile" type="file" accept="image/*">',
            '      <span class="br-file-name" id="brFileName"></span>',
            '    </div>',
            '  </div>',
            '  <div class="br-page-info">Page : ' + page + '</div>',
            '  <div class="br-error" id="brError" role="alert"></div>',
            '  <button class="br-submit" id="brSubmit" type="button">Envoyer le signalement</button>',
            '</div>'
        ].join('\n');
    }

    function buildSuccessHTML(ref) {
        return [
            '<div class="br-header">',
            '  <span class="br-header-title">' + ICONS.bug + ' Signalement envoyé</span>',
            '  <button class="br-close" aria-label="Fermer" type="button">&times;</button>',
            '</div>',
            '<div class="br-success">',
            '  <div class="br-success-icon" aria-hidden="true">&#10004;&#65039;</div>',
            '  <div class="br-success-title">Merci pour votre signalement !</div>',
            '  <div class="br-success-msg">',
            '    Votre retour nous aide à améliorer Maison Éclat.<br>',
            ref ? '    Référence : <span class="br-success-ref">' + escapeHTML(ref) + '</span>' : '',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    // ── Logique modale ──
    var els = null;
    var isOpen = false;
    var fileData = null;

    function openModal() {
        if (isOpen) return;
        isOpen = true;
        // Rafraîchir le formulaire
        els.modal.innerHTML = buildFormHTML();
        els.modal.classList.add('open');
        els.overlay.classList.add('open');
        bindFormEvents();
        // Focus sur le premier champ
        var firstField = els.modal.querySelector('#brType');
        if (firstField) firstField.focus();
        // Trap focus
        document.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        if (!isOpen) return;
        isOpen = false;
        fileData = null;
        els.modal.classList.remove('open');
        els.overlay.classList.remove('open');
        document.removeEventListener('keydown', trapFocus);
        // Remettre le focus sur le bouton
        els.btn.focus();
    }

    function trapFocus(e) {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key !== 'Tab') return;

        var focusable = els.modal.querySelectorAll(
            'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function bindFormEvents() {
        // Close button
        var closeBtn = els.modal.querySelector('.br-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Character count
        var desc = els.modal.querySelector('#brDesc');
        var charCount = els.modal.querySelector('#brCharCount');
        if (desc && charCount) {
            desc.addEventListener('input', function() {
                var len = desc.value.length;
                charCount.textContent = len + ' / ' + MAX_DESC_LENGTH;
                charCount.classList.toggle('warn', len > MAX_DESC_LENGTH * 0.9);
            });
        }

        // File input
        var fileInput = els.modal.querySelector('#brFile');
        var fileName = els.modal.querySelector('#brFileName');
        var fileWrap = els.modal.querySelector('#brFileWrap');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                var file = fileInput.files[0];
                if (!file) { fileData = null; fileName.textContent = ''; return; }

                if (file.size > MAX_FILE_SIZE) {
                    showError('Fichier trop volumineux (max 5 Mo).');
                    fileInput.value = '';
                    fileData = null;
                    fileName.textContent = '';
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    showError('Seules les images sont acceptées.');
                    fileInput.value = '';
                    fileData = null;
                    fileName.textContent = '';
                    return;
                }

                fileName.textContent = file.name;
                // Convertir en base64
                var reader = new FileReader();
                reader.onload = function(ev) {
                    fileData = ev.target.result;
                };
                reader.readAsDataURL(file);

                // Ajouter bouton supprimer
                var existing = fileWrap.querySelector('.br-file-remove');
                if (!existing) {
                    var removeBtn = document.createElement('button');
                    removeBtn.className = 'br-file-remove';
                    removeBtn.type = 'button';
                    removeBtn.setAttribute('aria-label', 'Supprimer la capture');
                    removeBtn.textContent = '\u00D7';
                    removeBtn.addEventListener('click', function() {
                        fileInput.value = '';
                        fileData = null;
                        fileName.textContent = '';
                        removeBtn.remove();
                    });
                    fileWrap.appendChild(removeBtn);
                }
            });

            // Permettre activation avec Enter/Space sur le label
            var fileLabel = els.modal.querySelector('.br-file-label');
            if (fileLabel) {
                fileLabel.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInput.click();
                    }
                });
            }
        }

        // Submit
        var submitBtn = els.modal.querySelector('#brSubmit');
        if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    }

    function showError(msg) {
        var errEl = els.modal.querySelector('#brError');
        if (errEl) {
            errEl.textContent = msg;
            errEl.style.display = 'block';
            setTimeout(function() { errEl.style.display = 'none'; }, 5000);
        }
    }

    async function handleSubmit() {
        var desc = (els.modal.querySelector('#brDesc') || {}).value || '';
        var type = (els.modal.querySelector('#brType') || {}).value || 'bug';
        var email = (els.modal.querySelector('#brEmail') || {}).value || '';
        var submitBtn = els.modal.querySelector('#brSubmit');

        // Validation
        desc = desc.trim();
        if (!desc) {
            showError('Veuillez décrire le problème.');
            els.modal.querySelector('#brDesc').focus();
            return;
        }
        if (desc.length < 10) {
            showError('Description trop courte (10 caractères minimum).');
            els.modal.querySelector('#brDesc').focus();
            return;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Adresse email invalide.');
            els.modal.querySelector('#brEmail').focus();
            return;
        }

        // Envoyer
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        try {
            var body = {
                type: type,
                description: desc,
                email: email || null,
                page: window.location.pathname + window.location.search,
                userAgent: navigator.userAgent,
                screenSize: window.innerWidth + 'x' + window.innerHeight,
                timestamp: new Date().toISOString()
            };

            // Ajouter la capture si présente (en base64)
            if (fileData) {
                body.screenshot = fileData;
            }

            var resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            var data = await resp.json();

            if (resp.ok && data.success) {
                els.modal.innerHTML = buildSuccessHTML(data.ref || '');
                // Re-bind close
                var closeBtn = els.modal.querySelector('.br-close');
                if (closeBtn) closeBtn.addEventListener('click', closeModal);
                // Auto-fermer après 4s
                setTimeout(closeModal, 4000);
            } else {
                showError(data.error || 'Une erreur est survenue. Réessayez.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer le signalement';
            }
        } catch (err) {
            console.error('[BugReport] Erreur:', err);
            showError('Erreur réseau. Vérifiez votre connexion.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le signalement';
        }
    }

    // ── Initialisation ──
    function init() {
        injectStyles();
        els = createUI();

        // Toggle modal
        els.btn.addEventListener('click', function() {
            if (isOpen) closeModal();
            else openModal();
        });

        // Fermer via overlay
        els.overlay.addEventListener('click', closeModal);
    }

    // Attendre le DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
