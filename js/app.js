// ============================
// ECLAT - Main Application
// ============================

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

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
                <div class="product-image" onclick="openModal(${product.id})" style="cursor:pointer;position:relative;">
                    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    ${product.badge ? `<span class="product-badge badge-${product.badge}">${
                        product.badge === 'new' ? t('badge_new') :
                        product.badge === 'promo' ? t('badge_promo') :
                        product.badge === 'lancement' ? t('badge_lancement') :
                        product.badge === 'marque' ? (escapeHTML(product.name.split(' — ')[0]) || 'Marque') : t('badge_bestseller')
                    }</span>` : ''}
                    ${typeof Wishlist !== 'undefined' ? `<span style="position:absolute;top:8px;right:8px;z-index:2;">${Wishlist.heartHTML(product.id, 22)}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3 class="product-name"><a href="pages/product.html?id=${product.id}" style="color:inherit;text-decoration:none;" onclick="event.preventDefault();openModal(${product.id})">${escapeHTML(product.name)}</a></h3>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '&#9733;' : ''}
                        ${product.reviews > 0 ? `<span class="count">(${product.reviews.toLocaleString('fr-FR')} ${t('reviews_count')})</span>` : ''}
                    </div>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-trust">
                        <span class="trust-tag shipping">${t('trust_shipping')}</span>
                        <span class="trust-tag">${t('trust_refund')}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">${t('btn_add_cart')}</button>
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
                    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    <div class="bestseller-rank">#${product.bestsellerRank}</div>
                </div>
                <div class="bestseller-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3 class="product-name">${escapeHTML(product.name)}</h3>
                    <p class="product-desc">${escapeHTML(product.description)}</p>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}
                        <span class="count">${product.rating}/5</span>
                    </div>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions" style="margin-top:12px">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">${t('btn_add_cart')}</button>
                        <button class="btn btn-outline btn-sm" onclick="openModal(${product.id})">${t('btn_details')}</button>
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
    // Product → Guide mapping
    const productGuideMap = {
        1: { section: 'led', label: 'Luminothérapie LED' },
        2: { section: 'guasha', label: 'Gua Sha & Massage facial' },
        3: { section: 'ultrasons', label: 'Ultrasons cutanés' },
        4: { section: 'ultrasons', label: 'Nettoyage sonique' },
        5: { section: 'cryo', label: 'Cryothérapie cutanée' },
        6: { section: 'ems', label: 'EMS facial' },
        7: { section: 'led', label: 'Préparation de la peau' },
        8: { section: 'vitc', label: 'Vitamine C topique' },
        9: { section: 'collagene', label: 'Collagène' },
        10: { section: 'collagene', label: 'Collagène' },
        11: { section: 'rosehip', label: 'Huile de Rose Musquée' },
        12: { section: 'collagene', label: 'Collagène & Anti-rides' }
    };

    let modalTrigger = null;

    window.openModal = function(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        modalTrigger = document.activeElement;
        const guide = productGuideMap[product.id];
        const guideLink = guide ? `<a href="pages/guide-beaute.html#${guide.section}" class="modal-guide-link">Lire l'étude scientifique : ${guide.label} →</a>` : '';

        modalContent.innerHTML = `
            <div class="modal-grid">
                <div class="modal-image"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"></div>
                <div class="modal-details">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h2 class="product-name" id="modalTitle">${escapeHTML(product.name)}</h2>
                    <div class="product-rating">
                        ${'&#9733;'.repeat(Math.floor(product.rating))}
                        <span class="count">${product.rating}/5</span>
                    </div>
                    <p class="product-description">${escapeHTML(product.description)}</p>
                    ${guideLink}
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="modal-trust">
                        <div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#128666;</span> ${t('trust_modal_shipping')}</div>
                        <div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#128260;</span> ${t('trust_modal_refund')}</div>
                        <div class="modal-trust-item"><span class="trust-icon" aria-hidden="true">&#128274;</span> ${t('trust_modal_secure')}</div>
                    </div>
                    <ul class="modal-features">
                        ${product.features.map(f => `<li>${escapeHTML(f)}</li>`).join('')}
                    </ul>
                    <button class="btn btn-primary btn-full" onclick="addToCart(${product.id}); closeModal();">
                        ${t('btn_add_cart')} - ${formatPrice(product.price)}
                    </button>
                </div>
            </div>
        `;

        modalOverlay.classList.add('active');
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus the close button for accessibility
        setTimeout(() => modalClose.focus(), 100);
    };

    window.closeModal = function() {
        modalOverlay.classList.remove('active');
        productModal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalTrigger) { modalTrigger.focus(); modalTrigger = null; }
    };

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });

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

    // Auto-open cart if redirected from diagnostic quiz
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openCart') === '1') {
        setTimeout(() => { renderCart(); openCart(); }, 300);
        history.replaceState(null, '', window.location.pathname);
    }

    // Auto-open product modal if redirected from guide
    const openModalId = urlParams.get('produit');
    if (openModalId) {
        setTimeout(() => openModal(parseInt(openModalId)), 400);
        history.replaceState(null, '', window.location.pathname + window.location.hash);
    }

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
                <div class="cart-item-image"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${escapeHTML(item.name)}</div>
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

        // Free shipping progress bar
        const FREE_SHIPPING_THRESHOLD = 29;
        let shippingBar = document.getElementById('cartShippingProgress');
        if (!shippingBar) {
            shippingBar = document.createElement('div');
            shippingBar.id = 'cartShippingProgress';
            shippingBar.className = 'cart-shipping-progress';
            const subtotalEl = document.querySelector('.cart-subtotal');
            if (subtotalEl) subtotalEl.parentNode.insertBefore(shippingBar, subtotalEl);
        }
        const remaining = FREE_SHIPPING_THRESHOLD - total;
        const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
        if (remaining > 0) {
            shippingBar.innerHTML = `<p>Plus que <strong>${formatPrice(remaining)}</strong> pour la livraison offerte !</p><div class="shipping-bar"><div class="shipping-bar-fill" style="width:${pct}%"></div></div>`;
        } else {
            shippingBar.innerHTML = `<p><strong>&#10003; Livraison offerte !</strong></p><div class="shipping-bar"><div class="shipping-bar-fill" style="width:100%"></div></div>`;
        }

        // Cross-sell suggestions
        renderCrossSell();

        // Smart bundle detection
        checkBundleMatch();
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
                    <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}">
                    <div class="cross-sell-info">
                        <div class="cs-name">${escapeHTML(p.name)}</div>
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

    // --- Smart Bundle Detection ---
    function checkBundleMatch() {
        let container = document.getElementById('cartBundleSuggestion');
        if (!container) {
            container = document.createElement('div');
            container.id = 'cartBundleSuggestion';
            const shippingBar = document.getElementById('cartShippingProgress');
            if (shippingBar) {
                shippingBar.insertAdjacentElement('afterend', container);
            }
        }

        if (typeof BUNDLES === 'undefined' || cart.isEmpty()) {
            container.innerHTML = '';
            return;
        }

        const cartProductIds = cart.items
            .filter(item => typeof item.id === 'number')
            .map(item => item.id);

        const suggestions = [];
        BUNDLES.forEach(bundle => {
            if (cart.items.some(item => item.id === 'bundle-' + bundle.key)) return;
            if (!bundle.productIds.every(pid => cartProductIds.includes(pid))) return;

            const individualTotal = bundle.productIds.reduce((sum, pid) => {
                const p = PRODUCTS.find(pr => pr.id === pid);
                return sum + (p ? p.price : 0);
            }, 0);
            const savings = individualTotal - bundle.price;
            if (savings > 0) {
                suggestions.push({ bundle, savings, individualTotal });
            }
        });

        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = suggestions.map(s => {
            const bundleName = t('bundle_prefix') + ' ' + t('bundle_' + s.bundle.key + '_name');
            return `
            <div class="bundle-suggestion">
                <div class="bundle-suggestion-icon">&#127873;</div>
                <div class="bundle-suggestion-text">
                    <strong>${bundleName}</strong><br>
                    ${t('bundle_match_text')}
                    <span class="bundle-savings">${t('bundle_save')} ${formatPrice(s.savings)}</span>
                </div>
                <button class="btn btn-primary btn-sm bundle-convert-btn" onclick="convertToBundle('${s.bundle.key}')">
                    ${formatPrice(s.bundle.price)}
                </button>
            </div>`;
        }).join('');
    }

    window.convertToBundle = function(bundleKey) {
        const bundle = BUNDLES.find(b => b.key === bundleKey);
        if (!bundle) return;

        const individualTotal = bundle.productIds.reduce((sum, pid) => {
            const p = PRODUCTS.find(pr => pr.id === pid);
            return sum + (p ? p.price : 0);
        }, 0);
        const savings = individualTotal - bundle.price;

        bundle.productIds.forEach(pid => {
            const item = cart.items.find(i => i.id === pid);
            if (item) {
                if (item.qty > 1) {
                    item.qty -= 1;
                } else {
                    cart.items = cart.items.filter(i => i.id !== pid);
                }
            }
        });

        const bundleName = t('bundle_prefix') + ' ' + t('bundle_' + bundle.key + '_name');
        const firstProduct = PRODUCTS.find(p => p.id === bundle.productIds[0]);
        cart.items.push({
            id: 'bundle-' + bundle.key,
            name: bundleName,
            price: bundle.price,
            image: firstProduct ? firstProduct.image : '',
            qty: 1
        });

        cart.save();
        showToast(t('bundle_converted_toast') + ' -' + formatPrice(savings));
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
                showToast(t('newsletter_error'), 'error');
            }
        } catch (err) {
            showToast(t('newsletter_error'), 'error');
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
