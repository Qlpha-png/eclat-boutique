// ============================
// ÉCLAT — Système de thèmes visuels
// 5 thèmes : Éclat, Nuit, Rosé, Nature, Auto
// Persiste dans localStorage
// ============================

(function() {
    'use strict';

    var THEMES = [
        { key: 'eclat', label: 'Éclat', icon: '✨' },
        { key: 'nuit', label: 'Nuit', icon: '🌙' },
        { key: 'rose', label: 'Rosé', icon: '🌸' },
        { key: 'nature', label: 'Nature', icon: '🌿' },
        { key: 'auto', label: 'Auto', icon: '⚙️' }
    ];

    var STORAGE_KEY = 'eclat_theme';

    // Apply theme immediately (before DOM ready to avoid flash)
    function applyTheme(theme) {
        if (theme === 'eclat') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem(STORAGE_KEY, theme);

        // Update active dots if they exist
        document.querySelectorAll('.theme-dot').forEach(function(dot) {
            dot.classList.toggle('active', dot.getAttribute('data-theme-val') === theme);
        });
    }

    // Get saved theme or default
    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'rose';
    }

    // Apply immediately
    applyTheme(getSavedTheme());

    // Create theme switcher in footer or wherever #themeSwitcherSlot exists
    function createSwitcher(container) {
        var current = getSavedTheme();
        var html = THEMES.map(function(t) {
            return '<button class="theme-dot' + (t.key === current ? ' active' : '') + '" data-theme-val="' + t.key + '" title="' + t.label + '" aria-label="Thème ' + t.label + '"></button>';
        }).join('');
        container.innerHTML = html;
        container.querySelectorAll('.theme-dot').forEach(function(dot) {
            dot.addEventListener('click', function() {
                applyTheme(this.getAttribute('data-theme-val'));
            });
        });
    }

    // Init when DOM ready
    function init() {
        // Look for explicit slot
        var slot = document.getElementById('themeSwitcherSlot');
        if (slot) {
            createSwitcher(slot);
        }

        // Also inject in footer if it exists and no slot
        if (!slot) {
            var footer = document.querySelector('.footer-bottom') || document.querySelector('.footer');
            if (footer) {
                var wrapper = document.createElement('div');
                wrapper.className = 'theme-switcher';
                wrapper.id = 'themeSwitcherSlot';
                wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:12px;';
                var label = document.createElement('span');
                label.textContent = 'Thème :';
                label.style.cssText = 'font-size:0.75rem;color:inherit;opacity:0.7;margin-right:4px;';
                wrapper.prepend(label);
                createSwitcher(wrapper);
                wrapper.prepend(label);

                var footerBottom = footer.querySelector('.footer-bottom');
                if (footerBottom) {
                    footerBottom.appendChild(wrapper);
                } else {
                    footer.appendChild(wrapper);
                }
            }
        }

        // Also add to account settings if on account page
        var profileForm = document.getElementById('profileForm');
        if (profileForm) {
            var themeGroup = document.createElement('div');
            themeGroup.className = 'form-group';
            themeGroup.style.marginTop = '16px';
            themeGroup.innerHTML = '<label>Thème visuel</label><div class="theme-switcher" id="profileThemeSwitcher" style="margin-top:8px;"></div>';
            profileForm.parentNode.insertBefore(themeGroup, profileForm.nextSibling);
            createSwitcher(document.getElementById('profileThemeSwitcher'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for external use
    window.eclat_setTheme = applyTheme;
    window.eclat_getTheme = getSavedTheme;
})();
