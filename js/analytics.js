// ============================
// ÉCLAT — Analytics & Event Tracking
// Auto-loads GA4 with RGPD cookie consent
// Compatible GA4 + Facebook Pixel (si configurés)
// Fonctionne sans trackers (no-op si non configurés)
// ============================

var GA_ID = 'G-4FKZ0GTSG9';
var GADS_ID = 'AW-18084546055';
var GADS_CONVERSION_LABEL = 'AW-18084546055/nV6xCP2-3ZocEIeMsa9D';

const Analytics = {
    _gaLoaded: false,

    // Load GA4 + Google Ads script if cookie consent for analytics is granted
    _loadGA() {
        if (this._gaLoaded) return;
        // Check cookie consent from localStorage (set by cookie-consent.js)
        var consent = null;
        try { consent = JSON.parse(localStorage.getItem('eclat_cookie_consent')); } catch(e) {}
        if (!consent || !consent.analytics) return;

        this._gaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_ID, { anonymize_ip: true });
        gtag('config', GADS_ID);
        window.gtag = gtag;
    },

    // Initialize — called once on page load
    init() {
        // Load GA4 if consent given
        this._loadGA();

        // Listen for future consent changes
        document.addEventListener('eclat:cookieconsent', function(e) {
            if (e && e.detail && e.detail.analytics && !Analytics._gaLoaded) {
                Analytics._loadGA();
                Analytics.pageView();
            }
        });

        // Track page view
        this.pageView();

        // Track affiliate clicks
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            localStorage.setItem('eclat_ref', ref);
            fetch('/api/v2/affiliates?action=track&ref=' + encodeURIComponent(ref)).catch(() => {});
        }
    },

    // --- Core tracking methods ---

    pageView() {
        this._ga('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
        this._fb('PageView');
    },

    // item_id must match Merchant Center feed g:id format (ECLAT-xxx)
    _feedId(id) { return 'ECLAT-' + id; },

    viewProduct(product) {
        this._ga('event', 'view_item', {
            currency: 'EUR',
            value: product.price,
            items: [{ item_id: this._feedId(product.id), item_name: product.name, price: product.price, item_category: product.category }]
        });
        this._fb('ViewContent', { content_ids: [product.id], content_type: 'product', value: product.price, currency: 'EUR' });
    },

    addToCart(product, qty) {
        this._ga('event', 'add_to_cart', {
            currency: 'EUR',
            value: product.price * (qty || 1),
            items: [{ item_id: this._feedId(product.id), item_name: product.name, price: product.price, quantity: qty || 1 }]
        });
        this._fb('AddToCart', { content_ids: [product.id], content_type: 'product', value: product.price, currency: 'EUR' });
    },

    removeFromCart(product) {
        this._ga('event', 'remove_from_cart', {
            currency: 'EUR',
            items: [{ item_id: this._feedId(product.id), item_name: product.name, price: product.price }]
        });
    },

    beginCheckout(items, total) {
        var self = this;
        this._ga('event', 'begin_checkout', {
            currency: 'EUR',
            value: total,
            items: items.map(i => ({ item_id: self._feedId(i.id), item_name: i.name, price: i.price, quantity: i.qty }))
        });
        this._fb('InitiateCheckout', { value: total, currency: 'EUR', num_items: items.length });
    },

    purchase(orderId, total, items) {
        var self = this;
        this._ga('event', 'purchase', {
            transaction_id: orderId,
            currency: 'EUR',
            value: total,
            items: items.map(i => ({ item_id: self._feedId(i.id), item_name: i.name, price: i.price, quantity: i.qty }))
        });
        this._fb('Purchase', { value: total, currency: 'EUR', content_ids: items.map(i => i.id) });
    },

    // Google Ads conversion tracking with enhanced conversions — fired on success page
    async gadsConversion(transactionId, value, email) {
        var convData = {
            send_to: GADS_CONVERSION_LABEL,
            value: value || 0,
            currency: 'EUR',
            transaction_id: transactionId || ''
        };
        // Enhanced conversions: send SHA256-hashed email for better attribution
        if (email) {
            try {
                var hash = await this._sha256(email.trim().toLowerCase());
                convData.user_data = { sha256_email_address: hash };
            } catch(e) {}
        }
        this._ga('event', 'conversion', convData);
    },

    // SHA256 hash via Web Crypto API (for enhanced conversions)
    async _sha256(str) {
        var buf = new TextEncoder().encode(str);
        var hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    },

    search(query) {
        this._ga('event', 'search', { search_term: query });
        this._fb('Search', { search_string: query });
    },

    signup(method) {
        this._ga('event', 'sign_up', { method: method || 'email' });
        this._fb('CompleteRegistration');
    },

    login(method) {
        this._ga('event', 'login', { method: method || 'email' });
    },

    // --- Internal helpers ---

    _ga(command, eventName, params) {
        if (typeof gtag === 'function') {
            gtag(command, eventName, params);
        }
    },

    _fb(eventName, params) {
        if (typeof fbq === 'function') {
            fbq('track', eventName, params);
        }
    }
};

// Auto-init
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
}

// Export for use in other scripts
if (typeof window !== 'undefined') window.Analytics = Analytics;
