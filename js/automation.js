// ============================
// ÉCLAT - Client-side Automation
// Abandoned cart detection + newsletter email capture
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. CAPTURE EMAIL NEWSLETTER → localStorage
    // =============================
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
        const originalHandler = nlForm.onsubmit;
        nlForm.addEventListener('submit', (e) => {
            const emailInput = nlForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                localStorage.setItem('eclat_customer_email', emailInput.value);
            }
        });
    }

    // =============================
    // 2. ABANDONED CART DETECTION
    // =============================
    // Si le client a un email + panier non vide + quitte la page → déclencher email après 1h
    let abandonedCartSent = sessionStorage.getItem('eclat_abandon_sent');

    function checkAbandonedCart() {
        if (abandonedCartSent) return;

        const email = localStorage.getItem('eclat_customer_email');
        const cartData = JSON.parse(localStorage.getItem('eclat_cart') || '[]');

        if (!email || cartData.length === 0) return;

        // Marquer le timestamp du panier actif
        const lastCartUpdate = localStorage.getItem('eclat_cart_timestamp');
        if (!lastCartUpdate) {
            localStorage.setItem('eclat_cart_timestamp', Date.now());
            return;
        }

        const elapsed = Date.now() - parseInt(lastCartUpdate);
        const ONE_HOUR = 60 * 60 * 1000;

        // Si le panier a plus d'1h sans achat → envoyer email
        if (elapsed > ONE_HOUR) {
            sendAbandonedCartEmail(email, cartData);
        }
    }

    // Mettre à jour le timestamp quand le panier change
    if (typeof cart !== 'undefined') {
        cart.onChange(() => {
            localStorage.setItem('eclat_cart_timestamp', Date.now());
        });
    }

    async function sendAbandonedCartEmail(email, items) {
        if (abandonedCartSent) return;
        abandonedCartSent = true;
        sessionStorage.setItem('eclat_abandon_sent', 'true');

        const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        try {
            await fetch('/api/abandoned-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, items, total })
            });
        } catch (e) {
            // Silently fail - not critical
        }
    }

    // Vérifier toutes les 5 minutes
    checkAbandonedCart();
    setInterval(checkAbandonedCart, 5 * 60 * 1000);

    // =============================
    // 3. CAPTURE EMAIL AU CHECKOUT
    // =============================
    const checkoutEmail = document.getElementById('email');
    if (checkoutEmail) {
        checkoutEmail.addEventListener('change', () => {
            if (checkoutEmail.value) {
                localStorage.setItem('eclat_customer_email', checkoutEmail.value);
            }
        });
    }

    // =============================
    // 4. POST-PURCHASE: CLEAR TIMERS
    // =============================
    // Si on est sur la page success, nettoyer les marqueurs d'abandon
    if (window.location.pathname.includes('success')) {
        localStorage.removeItem('eclat_cart_timestamp');
        sessionStorage.removeItem('eclat_abandon_sent');
    }
});
