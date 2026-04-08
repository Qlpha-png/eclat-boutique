// ============================
// ÉCLAT — Analytics & Event Tracking
// Compatible GA4 + Facebook Pixel (si configurés)
// Fonctionne sans trackers (no-op si non configurés)
// ============================

const Analytics = {
    // Initialize — called once on page load
    init() {
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

    viewProduct(product) {
        this._ga('event', 'view_item', {
            currency: 'EUR',
            value: product.price,
            items: [{ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category }]
        });
        this._fb('ViewContent', { content_ids: [product.id], content_type: 'product', value: product.price, currency: 'EUR' });
    },

    addToCart(product, qty) {
        this._ga('event', 'add_to_cart', {
            currency: 'EUR',
            value: product.price * (qty || 1),
            items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: qty || 1 }]
        });
        this._fb('AddToCart', { content_ids: [product.id], content_type: 'product', value: product.price, currency: 'EUR' });
    },

    removeFromCart(product) {
        this._ga('event', 'remove_from_cart', {
            currency: 'EUR',
            items: [{ item_id: product.id, item_name: product.name, price: product.price }]
        });
    },

    beginCheckout(items, total) {
        this._ga('event', 'begin_checkout', {
            currency: 'EUR',
            value: total,
            items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))
        });
        this._fb('InitiateCheckout', { value: total, currency: 'EUR', num_items: items.length });
    },

    purchase(orderId, total, items) {
        this._ga('event', 'purchase', {
            transaction_id: orderId,
            currency: 'EUR',
            value: total,
            items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))
        });
        this._fb('Purchase', { value: total, currency: 'EUR', content_ids: items.map(i => i.id) });
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
