// ============================
// ÉCLAT — Social Share (zero external JS, zero tracking)
// ============================
var SocialShare = (function() {
    'use strict';

    function getShareData(customTitle, customUrl) {
        var title = customTitle || document.title;
        var url = customUrl || window.location.href;
        return { title: title, url: encodeURIComponent(url), rawUrl: url, rawTitle: title };
    }

    function renderButtons(options) {
        options = options || {};
        var d = getShareData(options.title, options.url);
        var size = options.size || 32;
        var btnStyle = 'display:inline-flex;align-items:center;justify-content:center;width:' + size + 'px;height:' + size + 'px;border-radius:50%;border:1px solid var(--color-border,#e8e4de);background:var(--color-white,#fff);cursor:pointer;transition:all 0.2s;text-decoration:none;font-size:' + (size * 0.45) + 'px;';

        var html = '<div class="social-share" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">';

        // WhatsApp
        html += '<a href="https://wa.me/?text=' + encodeURIComponent(d.rawTitle + ' ' + d.rawUrl) + '" target="_blank" rel="noopener" style="' + btnStyle + 'color:#25d366;" aria-label="Partager sur WhatsApp" title="WhatsApp">' +
            '<svg width="' + (size*0.5) + '" height="' + (size*0.5) + '" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
            '</a>';

        // Facebook
        html += '<a href="https://www.facebook.com/sharer/sharer.php?u=' + d.url + '" target="_blank" rel="noopener" style="' + btnStyle + 'color:#1877f2;" aria-label="Partager sur Facebook" title="Facebook">' +
            '<svg width="' + (size*0.5) + '" height="' + (size*0.5) + '" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
            '</a>';

        // X/Twitter
        html += '<a href="https://twitter.com/intent/tweet?url=' + d.url + '&text=' + encodeURIComponent(d.rawTitle) + '" target="_blank" rel="noopener" style="' + btnStyle + 'color:#000;" aria-label="Partager sur X" title="X (Twitter)">' +
            '<svg width="' + (size*0.45) + '" height="' + (size*0.45) + '" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
            '</a>';

        // Copy link
        html += '<button onclick="SocialShare.copyLink(\'' + d.rawUrl.replace(/'/g, "\\'") + '\')" style="' + btnStyle + 'color:var(--color-text-light,#6b6560);" aria-label="Copier le lien" title="Copier le lien">' +
            '<svg width="' + (size*0.45) + '" height="' + (size*0.45) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>' +
            '</button>';

        // Native share (mobile)
        if (typeof navigator !== 'undefined' && navigator.share) {
            html += '<button onclick="SocialShare.nativeShare(\'' + d.rawTitle.replace(/'/g, "\\'") + '\',\'' + d.rawUrl.replace(/'/g, "\\'") + '\')" style="' + btnStyle + 'color:var(--color-secondary,#c9a87c);" aria-label="Partager" title="Partager">' +
                '<svg width="' + (size*0.45) + '" height="' + (size*0.45) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
                '</button>';
        }

        html += '</div>';
        return html;
    }

    function copyLink(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function() { showToast('Lien copi\u00e9 !'); });
        } else {
            var input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('Lien copi\u00e9 !');
        }
    }

    function nativeShare(title, url) {
        navigator.share({ title: title, url: url }).catch(function() {});
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2d2926;color:#fff;padding:10px 24px;border-radius:8px;font-size:0.85rem;z-index:99999;animation:fadeUp 0.3s ease;';
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 2000);
    }

    return {
        renderButtons: renderButtons,
        copyLink: copyLink,
        nativeShare: nativeShare
    };
})();
