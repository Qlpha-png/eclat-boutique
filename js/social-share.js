(function() {
    'use strict';

    // ============================
    // ECLAT Beaute — Social Share
    // Zero external JS, zero tracking
    // WhatsApp, Facebook, X/Twitter, Copy Link, Native Share
    // ============================

    var SITE_URL = 'https://maison-eclat.shop';
    var BTN_SIZE = 36;
    var POPUP_W  = 600;
    var POPUP_H  = 400;
    var CSS_ID   = 'eclat-social-share-css';

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

    // ---- Brand colours per platform ----

    var BRAND_COLORS = {
        whatsapp: '#25d366',
        facebook: '#1877f2',
        twitter:  '#000000',
        copy:     'var(--color-text-light, #6b6560)',
        native:   'var(--color-secondary, #c9a87c)'
    };

    // ---- Inject CSS (once) ----

    function injectCSS() {
        if (document.getElementById(CSS_ID)) return;
        var style = document.createElement('style');
        style.id = CSS_ID;
        style.textContent =
            '.eclat-share-wrap{display:flex;gap:8px;margin:16px 0;align-items:center;flex-wrap:wrap;}' +
            '.eclat-share-label{font-size:0.75rem;color:var(--color-text-light,#6b6560);margin-right:4px;font-weight:500;letter-spacing:0.3px;}' +
            '.eclat-share-btn{' +
                'display:inline-flex;align-items:center;justify-content:center;' +
                'width:' + BTN_SIZE + 'px;height:' + BTN_SIZE + 'px;' +
                'border-radius:50%;border:1px solid var(--color-border,#e8e4de);' +
                'background:var(--color-white,#fff);' +
                'cursor:pointer;padding:0;font-size:0;line-height:0;' +
                'transition:transform 0.15s ease,box-shadow 0.15s ease,border-color 0.15s ease;' +
                'text-decoration:none;' +
            '}' +
            '.eclat-share-btn:hover{' +
                'transform:scale(1.12);' +
                'box-shadow:0 2px 8px rgba(0,0,0,0.1);' +
                'border-color:var(--color-secondary,#c9a87c);' +
            '}' +
            '.eclat-share-btn:active{transform:scale(0.95);}' +
            '.eclat-share-toast{' +
                'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
                'background:#2d2926;color:#fff;padding:10px 24px;border-radius:8px;' +
                'font-size:0.85rem;z-index:99999;opacity:0;transition:opacity 0.3s;' +
                'pointer-events:none;' +
            '}';
        document.head.appendChild(style);
    }

    // ---- Toast ----

    function showToast(msg) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg);
            return;
        }
        var el = document.createElement('div');
        el.className = 'eclat-share-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        requestAnimationFrame(function() { el.style.opacity = '1'; });
        setTimeout(function() {
            el.style.opacity = '0';
            setTimeout(function() {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 300);
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
        input.style.cssText = 'position:fixed;left:-9999px;opacity:0;';
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

    // ---- Open popup (600x400) ----

    function openPopup(url) {
        var left = Math.round((screen.width - POPUP_W) / 2);
        var top  = Math.round((screen.height - POPUP_H) / 2);
        var features = 'width=' + POPUP_W + ',height=' + POPUP_H +
            ',left=' + left + ',top=' + top +
            ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes';
        window.open(url, 'eclat_share', features);
    }

    // ---- Build share URL helpers ----

    function whatsappURL(text) {
        return 'https://wa.me/?text=' + encodeURIComponent(text);
    }

    function facebookURL(pageUrl) {
        return 'https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl);
    }

    function twitterURL(pageUrl, text) {
        return 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) +
            '&text=' + encodeURIComponent(text);
    }

    // ---- Create a single button ----

    function createBtn(type, ariaLabel, title, color, icon, onClick) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'eclat-share-btn';
        btn.setAttribute('aria-label', ariaLabel);
        btn.setAttribute('title', title);
        btn.style.color = color;
        btn.innerHTML = icon;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            onClick();
        });
        return btn;
    }

    // ---- Build buttons container ----
    // opts: { title: string, url: string, size?: number }

    function buildButtonsDOM(opts) {
        var shareTitle = opts.title || document.title || '';
        var shareUrl   = opts.url   || window.location.href;
        var shareText  = shareTitle + ' ' + shareUrl;
        var hasNativeShare = (typeof navigator.share === 'function');

        var container = document.createElement('div');

        // "Partager" label
        var label = document.createElement('span');
        label.className = 'eclat-share-label';
        label.textContent = 'Partager';
        container.appendChild(label);

        // Buttons row
        var row = document.createElement('div');
        row.className = 'eclat-share-wrap';

        // WhatsApp
        row.appendChild(createBtn(
            'whatsapp', 'Partager sur WhatsApp', 'WhatsApp',
            BRAND_COLORS.whatsapp, ICONS.whatsapp,
            function() { openPopup(whatsappURL(shareText)); }
        ));

        // Facebook
        row.appendChild(createBtn(
            'facebook', 'Partager sur Facebook', 'Facebook',
            BRAND_COLORS.facebook, ICONS.facebook,
            function() { openPopup(facebookURL(shareUrl)); }
        ));

        // Twitter / X
        row.appendChild(createBtn(
            'twitter', 'Partager sur X', 'X (Twitter)',
            BRAND_COLORS.twitter, ICONS.twitter,
            function() { openPopup(twitterURL(shareUrl, shareTitle)); }
        ));

        // Copy link
        row.appendChild(createBtn(
            'copy', 'Copier le lien', 'Copier le lien',
            BRAND_COLORS.copy, ICONS.copy,
            function() { copyLink(shareUrl); }
        ));

        // Native share — only if browser supports it, otherwise hidden
        if (hasNativeShare) {
            row.appendChild(createBtn(
                'native', 'Partager', 'Partager',
                BRAND_COLORS.native, ICONS.native,
                function() { nativeShare(shareTitle, shareUrl); }
            ));
        }

        container.appendChild(row);
        return container;
    }

    // ---- renderButtons: returns HTML string (for inline embedding in product page) ----
    // opts: { title: string, url?: string, size?: number }

    function renderButtons(opts) {
        opts = opts || {};
        var shareTitle = opts.title || document.title || '';
        var shareUrl   = opts.url   || window.location.href;
        var id = 'eclat-share-' + Math.random().toString(36).substr(2, 8);

        // We return a placeholder div; after DOM update we populate it
        setTimeout(function() {
            var el = document.getElementById(id);
            if (!el) return;
            var dom = buildButtonsDOM({ title: shareTitle, url: shareUrl });
            el.appendChild(dom);
        }, 0);

        return '<div id="' + id + '"></div>';
    }

    // ---- Auto-insert on product pages ----

    function shareProduct() {
        var path = window.location.pathname;
        if (path.indexOf('product.html') === -1) return;

        // Look for pp-actions or pp-info (product page selectors)
        var anchor = document.querySelector('.pp-actions');
        if (!anchor) anchor = document.querySelector('.pp-info');
        if (!anchor) anchor = document.getElementById('ppInfo');
        if (!anchor) return;

        // Already inserted?
        if (anchor.parentNode && anchor.parentNode.querySelector('.eclat-share-product')) return;

        // Gather product info from page
        var nameEl = document.querySelector('.pp-name');
        var priceEl = document.querySelector('.pp-price');
        var productName = nameEl ? nameEl.textContent.trim() : '';
        var productPrice = priceEl ? priceEl.textContent.trim() : '';
        var shareTitle = productName;
        if (productPrice) {
            shareTitle += ' - ' + productPrice;
        }
        shareTitle += ' | \u00c9CLAT Beaut\u00e9';
        var shareUrl = window.location.href;

        var wrapper = document.createElement('div');
        wrapper.className = 'eclat-share-product';
        var dom = buildButtonsDOM({ title: shareTitle, url: shareUrl });
        wrapper.appendChild(dom);

        // Insert after the anchor element
        if (anchor.nextSibling) {
            anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
        } else {
            anchor.parentNode.appendChild(wrapper);
        }
    }

    // ---- Auto-insert on blog pages ----

    function shareArticle() {
        var path = window.location.pathname;
        if (path.indexOf('/blog/') === -1) return;

        // Find the article element
        var article = document.querySelector('article.article-page') ||
                      document.querySelector('article') ||
                      document.querySelector('.article-page');
        if (!article) return;

        // Already inserted?
        if (article.querySelector('.eclat-share-article')) return;

        // Get article title
        var h1 = article.querySelector('h1');
        var articleTitle = h1 ? h1.textContent.trim() : document.title;
        var shareUrl = window.location.href;

        var wrapper = document.createElement('div');
        wrapper.className = 'eclat-share-article';
        wrapper.style.cssText = 'margin-top:32px;padding-top:24px;border-top:1px solid var(--color-border,#e8e4de);';
        var dom = buildButtonsDOM({ title: articleTitle, url: shareUrl });
        wrapper.appendChild(dom);

        // Insert before article-nav if present, otherwise at the end of article
        var nav = article.querySelector('.article-nav');
        if (nav) {
            article.insertBefore(wrapper, nav);
        } else {
            article.appendChild(wrapper);
        }
    }

    // ---- Init ----

    function init() {
        injectCSS();

        // Auto-insert on product pages
        shareProduct();

        // Auto-insert on blog pages
        shareArticle();

        // Also handle any manual .social-share-container elements
        var containers = document.querySelectorAll('.social-share-container');
        for (var i = 0; i < containers.length; i++) {
            if (containers[i].getAttribute('data-eclat-share-init')) continue;
            containers[i].setAttribute('data-eclat-share-init', '1');

            var title = containers[i].getAttribute('data-title') || document.title || '';
            var url   = containers[i].getAttribute('data-url')   || window.location.href;
            var dom   = buildButtonsDOM({ title: title, url: url });
            containers[i].innerHTML = '';
            containers[i].appendChild(dom);
        }
    }

    // ---- Public API ----

    var EclatShare = {
        init: init,
        shareProduct: shareProduct,
        shareArticle: shareArticle,
        renderButtons: renderButtons,
        copyLink: copyLink,
        nativeShare: nativeShare
    };

    // Expose globally
    window.EclatShare = EclatShare;

    // Backward compatibility (product page uses SocialShare.renderButtons)
    window.SocialShare = EclatShare;

    // ---- Auto-init ----

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            EclatShare.init();
        });
    } else {
        EclatShare.init();
    }

})();
