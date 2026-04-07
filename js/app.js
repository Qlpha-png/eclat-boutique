// ============================
// ECLAT - Main Application
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const productsGrid = document.getElementById('productsGrid');
    const bestsellerShowcase = document.getElementById('bestsellerShowcase');
    const modalOverlay = document.getElementById('modalOverlay');
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');
    const newsletterForm = document.getElementById('newsletterForm');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // --- Navbar scroll effect ---
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile menu ---
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Product Rendering ---
    function renderProducts(category = 'all') {
        let filtered;
        if (category === 'all') {
            // Marques en premier, puis produits ÉCLAT — la confiance d'abord
            const brands = PRODUCTS.filter(p => p.category === 'marques');
            const eclat = PRODUCTS.filter(p => p.category !== 'marques');
            filtered = [...brands, ...eclat];
        } else {
            filtered = PRODUCTS.filter(p => p.category === category);
        }

        productsGrid.innerHTML = filtered.map(product => `
            <div class="product-card fade-in" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge badge-${product.badge}">${
                        product.badge === 'new' ? t('badge_new') :
                        product.badge === 'promo' ? t('badge_promo') :
                        product.badge === 'lancement' ? t('badge_lancement') :
                        product.badge === 'marque' ? (product.name.split(' — ')[0] || 'Marque') : t('badge_bestseller')
                    }</span>` : ''}
                    <button class="product-quick-view" onclick="openModal(${product.id})">${t('btn_quick_view')}</button>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '&#9733;' : ''}
                        ${product.reviews > 0 ? `<span class="count">(${product.reviews.toLocaleString('fr-FR')} ${t('reviews_count')})</span>` : ''}
                    </div>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Ajouter au panier</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Trigger fade-in animations
        requestAnimationFrame(() => {
            document.querySelectorAll('.product-card.fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 80);
            });
        });
    }

    function getCategoryLabel(cat) {
        const labels = {
            visage: 'Soins visage',
            soin: 'Skincare',
            corps: 'Corps & fitness',
            outils: 'Outils beaut\u00e9',
            aromatherapie: 'Bien-\u00eatre',
            parfums: 'Parfumerie',
            marques: 'Marque officielle \u2713'
        };
        return labels[cat] || cat;
    }

    // --- Bestsellers ---
    function renderBestsellers() {
        const bestsellers = PRODUCTS
            .filter(p => p.bestseller)
            .sort((a, b) => a.bestsellerRank - b.bestsellerRank);

        bestsellerShowcase.innerHTML = bestsellers.map(product => `
            <div class="bestseller-card fade-in">
                <div class="bestseller-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="bestseller-rank">#${product.bestsellerRank}</div>
                </div>
                <div class="bestseller-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}
                        <span class="count">${product.rating}/5</span>
                    </div>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions" style="margin-top:12px">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Ajouter au panier</button>
                        <button class="btn btn-outline btn-sm" onclick="openModal(${product.id})">D\u00e9tails</button>
                    </div>
                </div>
            </div>
        `).join('');

        requestAnimationFrame(() => {
            document.querySelectorAll('.bestseller-card.fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 150);
            });
        });
    }

    // --- Category Filter ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });

    // --- Modal ---
    window.openModal = function(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        modalContent.innerHTML = `
            <div class="modal-grid">
                <div class="modal-image"><img src="${product.image}" alt="${product.name}"></div>
                <div class="modal-details">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h2 class="product-name">${product.name}</h2>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}
                        <span class="count">${product.rating}/5</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <ul class="modal-features">
                        ${product.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <button class="btn btn-primary btn-full" onclick="addToCart(${product.id}); closeModal();">
                        Ajouter au panier - ${formatPrice(product.price)}
                    </button>
                </div>
            </div>
        `;

        modalOverlay.classList.add('active');
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        modalOverlay.classList.remove('active');
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // --- Cart UI ---
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', () => {
        closeCart();
        closeModal();
    });

    function renderCart() {
        cartCount.textContent = cart.getCount();

        if (cart.isEmpty()) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            // Remove existing cart items but keep empty message
            cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
            return;
        }

        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';

        const itemsHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `).join('');

        // Remove old cart items
        cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
        // Insert new ones
        cartEmpty.insertAdjacentHTML('afterend', itemsHTML);

        const total = cart.getTotal();
        cartSubtotal.textContent = formatPrice(total);

        const shippingEl = document.getElementById('cartShipping');
        if (total >= 49) {
            shippingEl.textContent = t('cart_free_shipping');
            shippingEl.style.color = '#4caf50';
            shippingEl.style.fontWeight = '600';
        } else {
            shippingEl.textContent = t('cart_shipping_remaining').replace('{amount}', formatPrice(49 - total));
            shippingEl.style.color = '';
            shippingEl.style.fontWeight = '';
        }

        // Cross-sell suggestions
        renderCrossSell();
    }

    function renderCrossSell() {
        let csContainer = document.getElementById('cartCrossSell');
        if (!csContainer) {
            csContainer = document.createElement('div');
            csContainer.id = 'cartCrossSell';
            csContainer.className = 'cart-cross-sell';
            const cartFooterEl = document.getElementById('cartFooter');
            if (cartFooterEl) cartFooterEl.appendChild(csContainer);
        }

        if (cart.isEmpty() || typeof getCrossSellProducts !== 'function') {
            csContainer.style.display = 'none';
            return;
        }

        const suggestions = getCrossSellProducts(cart.items);
        if (suggestions.length === 0) {
            csContainer.style.display = 'none';
            return;
        }

        csContainer.style.display = 'block';
        csContainer.innerHTML = `
            <h4>${t('cart_cross_sell')}</h4>
            ${suggestions.map(p => `
                <div class="cross-sell-item">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="cross-sell-info">
                        <div class="cs-name">${p.name}</div>
                        <div class="cs-price">${formatPrice(p.price)}</div>
                    </div>
                    <button class="cross-sell-add" onclick="addToCart(${p.id})">${t('btn_add_short')}</button>
                </div>
            `).join('')}
        `;
    }

    // --- Cart Actions (global) ---
    window.addToCart = function(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
            cart.add(product);
            showToast(t('toast_added').replace('{name}', product.name));
        }
    };

    window.removeFromCart = function(productId) {
        cart.remove(productId);
    };

    window.updateCartQty = function(productId, qty) {
        if (qty < 1) {
            cart.remove(productId);
        } else {
            cart.updateQty(productId, qty);
        }
    };

    cart.onChange(() => renderCart());

    // --- Checkout ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.isEmpty()) return;
        window.location.href = 'pages/checkout.html';
    });

    // --- Newsletter ---
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        const email = emailInput.value;
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;

        try {
            const resp = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, lang: currentLang || 'fr' })
            });
            const data = await resp.json();
            if (data.success) {
                showToast(t('newsletter_success'));
            } else {
                showToast(t('newsletter_success'));
            }
        } catch (err) {
            showToast(t('newsletter_success'));
        }

        newsletterForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
    });

    // --- Toast Notification ---
    function showToast(message, type = '') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.showToast = showToast;

    // --- Price formatter ---
    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + ' \u20ac';
    }

    window.formatPrice = formatPrice;

    // --- Scroll animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.02, rootMargin: '50px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        const cookieChoice = localStorage.getItem('eclat_cookies');
        if (cookieChoice) {
            cookieBanner.classList.add('hidden');
        }
        document.getElementById('cookieAccept')?.addEventListener('click', () => {
            localStorage.setItem('eclat_cookies', 'accepted');
            cookieBanner.classList.add('hidden');
        });
        document.getElementById('cookieRefuse')?.addEventListener('click', () => {
            localStorage.setItem('eclat_cookies', 'refused');
            cookieBanner.classList.add('hidden');
        });
    }

    // --- Initialize ---
    renderProducts();
    renderBestsellers();
    renderCart();
});
