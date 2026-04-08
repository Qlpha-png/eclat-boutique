// ============================
// ECLAT - Initialization (extracted from inline scripts)
// ============================

// --- Real welcome offer timer (7 days from first visit) ---
(function() {
    var firstVisit = localStorage.getItem('eclat_first_visit');
    if (!firstVisit) {
        firstVisit = Date.now();
        localStorage.setItem('eclat_first_visit', firstVisit);
    }
    var expiry = parseInt(firstVisit) + 7 * 24 * 60 * 60 * 1000; // 7 days
    var banner = document.querySelector('.top-banner p');
    if (!banner) return;

    function updateTimer() {
        var now = Date.now();
        var remaining = expiry - now;
        if (remaining <= 0) {
            // Offer expired — remove the code mention
            return;
        }
        var days = Math.floor(remaining / (24*60*60*1000));
        var hours = Math.floor((remaining % (24*60*60*1000)) / (60*60*1000));
        var timerEl = document.getElementById('welcomeTimer');
        if (timerEl) {
            timerEl.textContent = days + 'j ' + hours + 'h';
        }
    }

    // Add timer to the popup code display
    var popupCode = document.querySelector('.popup-code');
    if (popupCode && (expiry - Date.now()) > 0) {
        var timerSpan = document.createElement('div');
        timerSpan.style.cssText = 'font-size:0.75rem;color:var(--color-text-light);margin-top:6px;';
        timerSpan.innerHTML = 'Expire dans <strong id="welcomeTimer"></strong>';
        popupCode.insertAdjacentElement('afterend', timerSpan);
        updateTimer();
        setInterval(updateTimer, 60000);
    }
})();

// --- Abandoned cart trigger (sends email if user provided email + has cart) ---
(function() {
    // Check every 5 minutes if user has items + email but hasn't ordered
    var cartEmail = localStorage.getItem('eclat_cart_email');
    var abandonSent = localStorage.getItem('eclat_abandon_sent');

    // Capture email from newsletter signup for later abandon cart use
    document.addEventListener('submit', function(e) {
        var input = e.target.querySelector('input[type="email"]');
        if (input && input.value) {
            localStorage.setItem('eclat_cart_email', input.value);
        }
    }, true);

    // On page unload, if cart has items and we have email, schedule abandon email
    window.addEventListener('beforeunload', function() {
        var email = localStorage.getItem('eclat_cart_email');
        var cartData = localStorage.getItem('eclat_cart');
        if (!email || !cartData || abandonSent) return;
        try {
            var items = JSON.parse(cartData);
            if (items.length === 0) return;
            // Use sendBeacon for reliable delivery
            var total = items.reduce(function(s,i){return s+i.price*i.qty;},0);
            navigator.sendBeacon('/api/abandoned-cart', JSON.stringify({
                email: email,
                items: items,
                total: total
            }));
            localStorage.setItem('eclat_abandon_sent', '1');
        } catch(e) {}
    });
})();

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
