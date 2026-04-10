(function() {
    'use strict';

    // ============================
    // ECLAT Beaute — Social Share
    // Zero external JS, zero tracking
    // WhatsApp, Facebook, X/Twitter, Copy Link, Native Share
    // ============================

    // ---- ECLAT theme colours ----
    var COLORS = {
        whatsapp:  '#25d366',
        facebook:  '#1877f2',
        twitter:   '#000000',
        copy:      '#6b6560',
        native:    '#c9a87c',
        bg:        'var(--color-white,#fff)',
        border:    'var(--color-border,#e8e4de)'
    };

    var BTN_SIZE = 32;

    // ---- SVG icons (inline, no external deps) ----

    var ICONS = {
        whatsapp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
            '</svg>',

        facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' +
            '</svg>',

        twitter: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' +
            '</svg>',

        copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>' +
            '<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>' +
            '</svg>',

        native: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>' +
            '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>' +
            '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' +
            '</svg>'
    };

    // ---- Shared inline styles ----

    function btnStyle(color) {
        return 'display:inline-flex;align-items:center;justify-content:center;' +
            'width:' + BTN_SIZE + 'px;height:' + BTN_SIZE + 'px;' +
            'border-radius:50%;border:1px solid ' + COLORS.border + ';' +
            'background:' + COLORS.bg + ';color:' + color + ';' +
            'cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;' +
            'text-decoration:none;padding:0;font-size:0;line-height:0;';
    }

    var HOVER_CSS_ID = 'eclat-social-share-styles';

    function injectStyles() {
        if (document.getElementById(HOVER_CSS_ID)) return;
        var style = document.createElement('style');
        style.id = HOVER_CSS_ID;
        style.textContent =
            '.eclat-share-btn:hover{transform:scale(1.12);box-shadow:0 2px 8px rgba(0,0,0,0.12);}' +
            '.eclat-share-btn:active{transform:scale(0.95);}';
        document.head.appendChild(style);
    }

    // ---- Toast helper (reuses site toast if available) ----

    function showToast(msg) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg);
            return;
        }
        var el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
            'background:#2d2926;color:#fff;padding:10px 24px;border-radius:8px;' +
            'font-size:0.85rem;z-index:99999;opacity:0;transition:opacity 0.3s;';
        document.body.appendChild(el);
        requestAnimationFrame(function() { el.style.opacity = '1'; });
        setTimeout(function() {
            el.style.opacity = '0';
            setTimeout(function() { el.remove(); }, 300);
        }, 2500);
    }

    // ---- Copy to clipboard ----

    function copyLink(url) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() {
                showToast('Lien copi\u00e9 !');
            }).catch(function() {
                fallbackCopy(url);
            });
        } else {
            fallbackCopy(url);
        }
    }

    function fallbackCopy(url) {
        var input = document.createElement('input');
        input.value = url;
        input.style.cssText = 'position:fixed;left:-9999px;';
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); } catch (e) { /* silent */ }
        document.body.removeChild(input);
        showToast('Lien copi\u00e9 !');
    }

    // ---- Native share ----

    function nativeShare(title, url) {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function() {});
        }
    }

    // ---- Detect mobile (rough check for native share priority) ----

    function isMobile() {
        return /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
    }

    // ---- Build share buttons for a container ----

    function buildButtons(container) {
        var pageTitle = container.getAttribute('data-title') || document.title || '';
        var pageUrl   = container.getAttribute('data-url')   || window.location.href;
        var encodedUrl   = encodeURIComponent(pageUrl);
        var encodedText  = encodeURIComponent(pageTitle + ' ' + pageUrl);
        var encodedTitle = encodeURIComponent(pageTitle);

        // On mobile with native share support, show only the native share button
        var hasNativeShare = (typeof navigator !== 'undefined' && typeof navigator.share === 'function');
        var useMobileNative = hasNativeShare && isMobile();

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

        if (useMobileNative) {
            // Single native share button replaces all others on mobile
            var nBtn = document.createElement('button');
            nBtn.className = 'eclat-share-btn';
            nBtn.setAttribute('type', 'button');
            nBtn.setAttribute('aria-label', 'Partager');
            nBtn.setAttribute('title', 'Partager');
            nBtn.style.cssText = btnStyle(COLORS.native);
            nBtn.innerHTML = ICONS.native;
            nBtn.addEventListener('click', function() {
                nativeShare(pageTitle, pageUrl);
            });
            wrapper.appendChild(nBtn);
        } else {
            // WhatsApp
            var waLink = document.createElement('a');
            waLink.href = 'https://wa.me/?text=' + encodedText;
            waLink.target = '_blank';
            waLink.rel = 'noopener noreferrer';
            waLink.className = 'eclat-share-btn';
            waLink.setAttribute('aria-label', 'Partager sur WhatsApp');
            waLink.setAttribute('title', 'WhatsApp');
            waLink.style.cssText = btnStyle(COLORS.whatsapp);
            waLink.innerHTML = ICONS.whatsapp;
            wrapper.appendChild(waLink);

            // Facebook
            var fbLink = document.createElement('a');
            fbLink.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
            fbLink.target = '_blank';
            fbLink.rel = 'noopener noreferrer';
            fbLink.className = 'eclat-share-btn';
            fbLink.setAttribute('aria-label', 'Partager sur Facebook');
            fbLink.setAttribute('title', 'Facebook');
            fbLink.style.cssText = btnStyle(COLORS.facebook);
            fbLink.innerHTML = ICONS.facebook;
            wrapper.appendChild(fbLink);

            // X / Twitter
            var twLink = document.createElement('a');
            twLink.href = 'https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodedTitle;
            twLink.target = '_blank';
            twLink.rel = 'noopener noreferrer';
            twLink.className = 'eclat-share-btn';
            twLink.setAttribute('aria-label', 'Partager sur X');
            twLink.setAttribute('title', 'X (Twitter)');
            twLink.style.cssText = btnStyle(COLORS.twitter);
            twLink.innerHTML = ICONS.twitter;
            wrapper.appendChild(twLink);

            // Copy link
            var cpBtn = document.createElement('button');
            cpBtn.className = 'eclat-share-btn';
            cpBtn.setAttribute('type', 'button');
            cpBtn.setAttribute('aria-label', 'Copier le lien');
            cpBtn.setAttribute('title', 'Copier le lien');
            cpBtn.style.cssText = btnStyle(COLORS.copy);
            cpBtn.innerHTML = ICONS.copy;
            cpBtn.addEventListener('click', function() {
                copyLink(pageUrl);
            });
            wrapper.appendChild(cpBtn);

            // Native share fallback on desktop if browser supports it
            if (hasNativeShare) {
                var nBtn2 = document.createElement('button');
                nBtn2.className = 'eclat-share-btn';
                nBtn2.setAttribute('type', 'button');
                nBtn2.setAttribute('aria-label', 'Partager');
                nBtn2.setAttribute('title', 'Partager');
                nBtn2.style.cssText = btnStyle(COLORS.native);
                nBtn2.innerHTML = ICONS.native;
                nBtn2.addEventListener('click', function() {
                    nativeShare(pageTitle, pageUrl);
                });
                wrapper.appendChild(nBtn2);
            }
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
    }

    // ---- SocialShare public API ----

    var SocialShare = {

        init: function() {
            injectStyles();

            var containers = document.querySelectorAll('.social-share-container');
            for (var i = 0; i < containers.length; i++) {
                buildButtons(containers[i]);
            }
        },

        // Expose utilities for manual use
        copyLink: copyLink,
        nativeShare: nativeShare
    };

    // ---- Expose globally ----

    window.SocialShare = SocialShare;

    // ---- Auto-init on DOMContentLoaded ----

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            SocialShare.init();
        });
    } else {
        SocialShare.init();
    }

})();
