// ============================
// ECLAT Beaute — Preferences Visiteur
// Mini quiz inline, sauvegarde localStorage
// Styled inline (no external CSS)
// ============================
(function() {
    'use strict';

    var STORAGE_KEY = 'eclat_prefs';

    // ---------- Inline styles ----------

    var STYLES = {
        wrapper: 'max-width:580px;margin:24px auto;padding:0 16px;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;',
        card: 'background:linear-gradient(135deg,rgba(201,168,124,0.07),rgba(255,255,255,0.95));' +
            'border:1px solid rgba(201,168,124,0.2);border-radius:16px;padding:28px 24px;text-align:center;',
        title: 'font-family:Playfair Display,Georgia,serif;font-size:1.15rem;font-weight:600;' +
            'color:#2d2926;margin:0 0 6px 0;',
        subtitle: 'font-size:0.84rem;color:#888;margin:0 0 20px 0;line-height:1.5;',
        group: 'margin-bottom:18px;',
        label: 'display:block;font-size:0.85rem;font-weight:600;color:#2d2926;margin-bottom:10px;',
        btnRow: 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;',
        btn: 'padding:8px 18px;border:1.5px solid #ddd;border-radius:22px;font-size:0.82rem;' +
            'cursor:pointer;background:#fff;color:#555;transition:all 0.2s;font-family:inherit;' +
            'outline:none;',
        btnHover: 'border-color:#c9a87c;color:#c9a87c;',
        btnSelected: 'background:#c9a87c;color:#fff;border-color:#c9a87c;',
        saveBtn: 'margin-top:20px;padding:11px 36px;background:#c9a87c;color:#fff;border:none;' +
            'border-radius:22px;font-weight:600;font-size:0.86rem;cursor:pointer;' +
            'transition:all 0.2s;font-family:inherit;opacity:0.4;pointer-events:none;',
        saveBtnActive: 'opacity:1;pointer-events:auto;',
        saveBtnHover: 'background:#b8956b;',
        success: 'text-align:center;padding:20px;color:#c9a87c;font-weight:600;font-size:0.95rem;'
    };

    // ---------- Quiz questions ----------

    var QUESTION_GENDER = {
        label: 'Vous cherchez des soins pour\u2026',
        id: 'eclatQuizGender',
        options: [
            { value: 'femme', text: 'Femme' },
            { value: 'homme', text: 'Homme' },
            { value: 'tous', text: 'Tous' }
        ]
    };

    var QUESTION_INTEREST = {
        label: 'Votre int\u00e9r\u00eat principal ?',
        id: 'eclatQuizInterest',
        options: [
            { value: 'visage', text: 'Visage' },
            { value: 'corps', text: 'Corps' },
            { value: 'cheveux', text: 'Cheveux' },
            { value: 'ongles', text: 'Ongles' },
            { value: 'bienetre', text: 'Bien-\u00eatre' }
        ]
    };

    // ---------- Module ----------

    var EclatPrefs = {

        hasPrefs: function() {
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return false;
                var parsed = JSON.parse(raw);
                return !!(parsed && parsed.gender && parsed.interest);
            } catch (e) {
                return false;
            }
        },

        getPrefs: function() {
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;
                var parsed = JSON.parse(raw);
                if (parsed && parsed.gender && parsed.interest) {
                    return { gender: parsed.gender, interest: parsed.interest };
                }
                return null;
            } catch (e) {
                return null;
            }
        },

        showQuiz: function(containerId) {
            var container;
            if (typeof containerId === 'string') {
                container = document.getElementById(containerId);
            } else if (containerId && containerId.nodeType) {
                container = containerId;
            }
            if (!container) return;

            // Don't show again if prefs already saved
            if (this.hasPrefs()) return;

            // State
            var gender = null;
            var interest = null;

            // Build DOM
            var wrapper = document.createElement('div');
            wrapper.style.cssText = STYLES.wrapper;

            var card = document.createElement('div');
            card.style.cssText = STYLES.card;

            var title = document.createElement('p');
            title.style.cssText = STYLES.title;
            title.textContent = 'Personnalisez votre exp\u00e9rience';

            var subtitle = document.createElement('p');
            subtitle.style.cssText = STYLES.subtitle;
            subtitle.textContent = '2 questions rapides pour vous montrer les produits qui vous correspondent.';

            card.appendChild(title);
            card.appendChild(subtitle);

            // Build question group
            function buildGroup(question, onSelect) {
                var group = document.createElement('div');
                group.style.cssText = STYLES.group;

                var lbl = document.createElement('span');
                lbl.style.cssText = STYLES.label;
                lbl.textContent = question.label;
                group.appendChild(lbl);

                var row = document.createElement('div');
                row.style.cssText = STYLES.btnRow;
                row.id = question.id;

                for (var i = 0; i < question.options.length; i++) {
                    (function(opt) {
                        var btn = document.createElement('button');
                        btn.type = 'button';
                        btn.style.cssText = STYLES.btn;
                        btn.textContent = opt.text;
                        btn.setAttribute('data-val', opt.value);

                        btn.addEventListener('mouseenter', function() {
                            if (!btn.getAttribute('data-selected')) {
                                btn.style.borderColor = '#c9a87c';
                                btn.style.color = '#c9a87c';
                            }
                        });
                        btn.addEventListener('mouseleave', function() {
                            if (!btn.getAttribute('data-selected')) {
                                btn.style.cssText = STYLES.btn;
                            }
                        });
                        btn.addEventListener('click', function() {
                            // Deselect siblings
                            var siblings = row.querySelectorAll('button');
                            for (var s = 0; s < siblings.length; s++) {
                                siblings[s].style.cssText = STYLES.btn;
                                siblings[s].removeAttribute('data-selected');
                            }
                            // Select this
                            btn.style.cssText = STYLES.btn + STYLES.btnSelected;
                            btn.setAttribute('data-selected', '1');
                            onSelect(opt.value);
                        });

                        row.appendChild(btn);
                    })(question.options[i]);
                }

                group.appendChild(row);
                return group;
            }

            card.appendChild(buildGroup(QUESTION_GENDER, function(val) {
                gender = val;
                updateSave();
            }));

            card.appendChild(buildGroup(QUESTION_INTEREST, function(val) {
                interest = val;
                updateSave();
            }));

            // Save button
            var saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.style.cssText = STYLES.saveBtn;
            saveBtn.textContent = 'Valider';

            function updateSave() {
                if (gender && interest) {
                    saveBtn.style.cssText = STYLES.saveBtn + STYLES.saveBtnActive;
                } else {
                    saveBtn.style.cssText = STYLES.saveBtn;
                }
            }

            saveBtn.addEventListener('mouseenter', function() {
                if (gender && interest) {
                    saveBtn.style.background = '#b8956b';
                }
            });
            saveBtn.addEventListener('mouseleave', function() {
                if (gender && interest) {
                    saveBtn.style.background = '#c9a87c';
                }
            });

            var self = this;
            saveBtn.addEventListener('click', function() {
                if (!gender || !interest) return;

                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        gender: gender,
                        interest: interest,
                        savedAt: new Date().toISOString()
                    }));
                } catch (e) {
                    // localStorage full or blocked, graceful fail
                }

                // Show success
                wrapper.innerHTML = '';
                var msg = document.createElement('div');
                msg.style.cssText = STYLES.success;
                msg.textContent = 'Merci ! Votre exp\u00e9rience est personnalis\u00e9e \u2728';
                wrapper.appendChild(msg);

                // Apply prefs immediately
                self.applyPrefs();

                // Fade out after 2.5s
                setTimeout(function() {
                    wrapper.style.transition = 'opacity 0.4s ease';
                    wrapper.style.opacity = '0';
                    setTimeout(function() {
                        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
                    }, 400);
                }, 2500);
            });

            card.appendChild(saveBtn);
            wrapper.appendChild(card);

            // Clear container and inject
            container.innerHTML = '';
            container.appendChild(wrapper);
            container.style.display = 'block';
        },

        applyPrefs: function() {
            var prefs = this.getPrefs();
            if (!prefs) return;

            // Set a default category filter based on interest
            // This dispatches a custom event so other components can react
            try {
                var event;
                if (typeof CustomEvent === 'function') {
                    event = new CustomEvent('eclat:prefs:applied', { detail: prefs });
                } else {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('eclat:prefs:applied', true, true, prefs);
                }
                document.dispatchEvent(event);
            } catch (e) {
                // CustomEvent not supported
            }

            // Auto-filter product grid if category buttons exist
            var filterBtns = document.querySelectorAll('[data-category]');
            if (filterBtns.length > 0) {
                for (var i = 0; i < filterBtns.length; i++) {
                    var cat = filterBtns[i].getAttribute('data-category');
                    if (cat && cat.toLowerCase() === prefs.interest.toLowerCase()) {
                        filterBtns[i].click();
                        break;
                    }
                }
            }
        }
    };

    // ---------- Expose ----------

    window.EclatPrefs = EclatPrefs;

    // ---------- Auto-init ----------

    function autoInit() {
        // If prefs already set, apply them
        if (EclatPrefs.hasPrefs()) {
            EclatPrefs.applyPrefs();
            return;
        }

        // Check if a quiz container exists on the page
        var container = document.getElementById('prefs-quiz-container')
            || document.getElementById('prefsQuiz')
            || document.getElementById('eclat-prefs');

        if (container) {
            EclatPrefs.showQuiz(container);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }
})();
