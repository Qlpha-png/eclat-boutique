// ============================
// ECLAT - Initialization (extracted from inline scripts)
// ============================

// Bundle add-to-cart
window.addBundleToCart = function(bundleKey) {
    var bundle = BUNDLES.find(function(b) { return b.key === bundleKey; });
    if (!bundle) return;
    var bundleName = t('bundle_prefix') + ' ' + t('bundle_' + bundleKey + '_name');
    var firstProduct = PRODUCTS.find(function(p) { return p.id === bundle.productIds[0]; });
    var img = firstProduct ? firstProduct.image : '';
    var bundleId = 'bundle-' + bundle.key;
    var existing = cart.items.find(function(item) { return item.id === bundleId; });
    if (existing) {
        existing.qty += 1;
    } else {
        cart.items.push({
            id: bundleId,
            name: bundleName,
            price: bundle.price,
            image: img,
            qty: 1
        });
    }
    cart.save();
    if (window.showToast) showToast(t('bundle_added_toast'));
};

// Language selector
(function() {
    var btn = document.getElementById('langBtn');
    var dropdown = document.getElementById('langDropdown');
    var label = document.getElementById('langLabel');
    if (!btn || !dropdown) return;
    btn.addEventListener('click', function() {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    dropdown.querySelectorAll('button').forEach(function(b) {
        b.addEventListener('click', function() {
            var lang = b.dataset.lang;
            if (typeof setLanguage === 'function') setLanguage(lang);
            label.textContent = lang.toUpperCase();
            dropdown.style.display = 'none';
        });
    });
    document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
})();

// Email capture popup — appears after 8s, once per session
(function() {
    var popup = document.getElementById('emailPopup');
    var closeBtn = document.getElementById('emailPopupClose');
    var form = document.getElementById('popupNewsletterForm');
    if (!popup || localStorage.getItem('eclat_popup_closed')) return;

    setTimeout(function() { popup.classList.add('active'); }, 8000);

    closeBtn.addEventListener('click', function() {
        popup.classList.remove('active');
        localStorage.setItem('eclat_popup_closed', '1');
    });
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('active');
            localStorage.setItem('eclat_popup_closed', '1');
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = form.querySelector('input').value;
        var btn = form.querySelector('button');
        btn.textContent = '...';
        btn.disabled = true;
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, lang: window.currentLang || 'fr' })
            });
        } catch(err) {}
        popup.classList.remove('active');
        localStorage.setItem('eclat_popup_closed', '1');
        if (window.showToast) showToast(t('popup_code_toast'));
    });
})();

// Floating CTA button (appears on scroll past hero)
(function(){
    var cta = document.getElementById('floatingCTA');
    if (!cta) return;
    var shown = false;
    window.addEventListener('scroll', function(){
        if (window.scrollY > 600 && !shown) {
            cta.style.display = 'inline-flex';
            cta.style.animation = 'fadeIn 0.3s ease';
            shown = true;
        } else if (window.scrollY <= 400 && shown) {
            cta.style.display = 'none';
            shown = false;
        }
    });
})();
