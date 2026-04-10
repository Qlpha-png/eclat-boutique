// ============================
// ÉCLAT — Préférences visiteur
// Mini-quiz inline discret, personnalisation
// ============================
(function() {
    'use strict';

    var STORAGE_KEY = 'eclat_prefs';

    window.EclatPrefs = {
        get: function() {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
            catch(e) { return null; }
        },

        save: function(prefs) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        },

        hasPrefs: function() {
            return this.get() !== null;
        },

        /**
         * Affiche le mini-quiz inline (non intrusif)
         * Se place dans un conteneur donné ou en bas de page
         */
        showQuiz: function(containerId) {
            if (this.hasPrefs()) return;

            var container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML =
                '<div class="prefs-quiz anim-fade-up">' +
                '<div class="prefs-quiz-inner">' +
                '<p class="prefs-title">Personnalisez votre exp\u00e9rience</p>' +
                '<p class="prefs-sub">2 questions pour vous montrer les produits qui vous correspondent.</p>' +
                '<div class="prefs-options">' +
                '<div class="prefs-group">' +
                '<span class="prefs-label">Je suis</span>' +
                '<div class="prefs-btns" id="prefsGender">' +
                '<button data-val="femme" class="prefs-btn">Femme</button>' +
                '<button data-val="homme" class="prefs-btn">Homme</button>' +
                '<button data-val="unisex" class="prefs-btn">Non sp\u00e9cifi\u00e9</button>' +
                '</div></div>' +
                '<div class="prefs-group">' +
                '<span class="prefs-label">Mon int\u00e9r\u00eat principal</span>' +
                '<div class="prefs-btns" id="prefsInterest">' +
                '<button data-val="visage" class="prefs-btn">Visage</button>' +
                '<button data-val="corps" class="prefs-btn">Corps</button>' +
                '<button data-val="cheveux" class="prefs-btn">Cheveux</button>' +
                '<button data-val="ongles" class="prefs-btn">Ongles</button>' +
                '<button data-val="bienetre" class="prefs-btn">Bien-\u00eatre</button>' +
                '</div></div>' +
                '</div>' +
                '<button id="prefsSave" class="prefs-save" disabled>Valider</button>' +
                '</div></div>';

            container.style.display = 'block';

            var gender = null, interest = null;

            function updateSaveBtn() {
                document.getElementById('prefsSave').disabled = !(gender && interest);
            }

            container.querySelectorAll('#prefsGender .prefs-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    container.querySelectorAll('#prefsGender .prefs-btn').forEach(function(b) { b.classList.remove('selected'); });
                    this.classList.add('selected');
                    gender = this.dataset.val;
                    updateSaveBtn();
                });
            });

            container.querySelectorAll('#prefsInterest .prefs-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    container.querySelectorAll('#prefsInterest .prefs-btn').forEach(function(b) { b.classList.remove('selected'); });
                    this.classList.add('selected');
                    interest = this.dataset.val;
                    updateSaveBtn();
                });
            });

            document.getElementById('prefsSave').addEventListener('click', function() {
                if (gender && interest) {
                    EclatPrefs.save({ gender: gender, interest: interest, date: new Date().toISOString() });
                    container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--color-secondary);font-weight:600;">Merci ! Votre exp\u00e9rience est personnalis\u00e9e.</div>';
                    setTimeout(function() { container.style.display = 'none'; }, 2000);
                }
            });
        }
    };

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
        '.prefs-quiz{max-width:600px;margin:20px auto;padding:0 16px}',
        '.prefs-quiz-inner{background:linear-gradient(135deg,rgba(201,168,124,.08),rgba(201,168,124,.02));border:1px solid rgba(201,168,124,.2);border-radius:16px;padding:24px;text-align:center}',
        '.prefs-title{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:4px}',
        '.prefs-sub{font-size:.85rem;color:var(--color-text-light);margin-bottom:16px}',
        '.prefs-options{display:flex;flex-direction:column;gap:12px}',
        '.prefs-group{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}',
        '.prefs-label{font-size:.85rem;font-weight:600;min-width:120px;text-align:right}',
        '.prefs-btns{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}',
        '.prefs-btn{padding:6px 16px;border:1px solid var(--color-border);border-radius:20px;font-size:.8rem;cursor:pointer;background:#fff;color:var(--color-text);transition:all .2s;font-family:inherit}',
        '.prefs-btn:hover{border-color:var(--color-secondary);color:var(--color-secondary)}',
        '.prefs-btn.selected{background:var(--color-primary);color:#fff;border-color:var(--color-primary)}',
        '.prefs-save{margin-top:16px;padding:10px 32px;background:var(--color-primary);color:#fff;border:none;border-radius:20px;font-weight:600;font-size:.85rem;cursor:pointer;transition:all .2s;font-family:inherit}',
        '.prefs-save:disabled{opacity:.4;cursor:default}',
        '.prefs-save:not(:disabled):hover{background:var(--color-secondary)}',
        '@media(max-width:768px){.prefs-group{flex-direction:column;gap:6px}.prefs-label{text-align:center;min-width:auto}}'
    ].join('\n');
    document.head.appendChild(style);
})();
