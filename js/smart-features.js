// ============================
// ÉCLAT - Smart Features (FOMO, Cross-sell, Exit Intent, Progress Bar)
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. BARRE DE PROGRESSION LIVRAISON GRATUITE
    // =============================
    function createShippingProgressBar() {
        const bar = document.createElement('div');
        bar.id = 'shippingProgress';
        bar.className = 'shipping-progress-bar';
        bar.innerHTML = `
            <div class="spb-inner">
                <div class="spb-text" id="spbText"></div>
                <div class="spb-track">
                    <div class="spb-fill" id="spbFill"></div>
                </div>
            </div>
        `;
        return bar;
    }

    function updateShippingProgress() {
        const total = cart.getTotal();
        const threshold = 49;
        const fill = document.getElementById('spbFill');
        const text = document.getElementById('spbText');
        if (!fill || !text) return;

        const progress = Math.min(100, (total / threshold) * 100);
        fill.style.width = progress + '%';

        if (total >= threshold) {
            const freeShipTexts = {
                fr: '🎉 <strong>Bravo !</strong> Votre livraison est offerte !',
                en: '🎉 <strong>Congrats!</strong> Free shipping unlocked!',
                es: '🎉 <strong>¡Bravo!</strong> ¡Envío gratis desbloqueado!',
                de: '🎉 <strong>Super!</strong> Kostenloser Versand freigeschaltet!'
            };
            text.innerHTML = (typeof currentLang !== 'undefined' && freeShipTexts[currentLang]) || freeShipTexts.fr;
            fill.style.background = 'var(--color-success, #4caf50)';
        } else {
            const remaining = (threshold - total).toFixed(2).replace('.', ',');
            const shippingTexts = {
                fr: `🚚 Plus que <strong>${remaining} €</strong> pour la livraison gratuite !`,
                en: `🚚 Only <strong>${remaining} €</strong> away from free shipping!`,
                es: `🚚 Solo faltan <strong>${remaining} €</strong> para envío gratis!`,
                de: `🚚 Nur noch <strong>${remaining} €</strong> bis zum kostenlosen Versand!`
            };
            text.innerHTML = (typeof currentLang !== 'undefined' && shippingTexts[currentLang]) || shippingTexts.fr;
            fill.style.background = 'var(--color-secondary)';
        }
    }

    // Inject shipping bar into cart sidebar
    const cartFooter = document.getElementById('cartFooter');
    if (cartFooter) {
        const bar = createShippingProgressBar();
        cartFooter.insertBefore(bar, cartFooter.firstChild);
    }

    cart.onChange(() => updateShippingProgress());
    updateShippingProgress();

    // =============================
    // 2. FOMO - STOCK LIMITÉ + ACHETEURS RÉCENTS
    // =============================
    // Stock indicators removed — was simulated fake urgency (pratique commerciale trompeuse)

    // Social proof popup supprimé — utilisait des faux noms/villes (pratique commerciale trompeuse Art. L121-1)
    // Sera réactivé avec de vraies données quand le site aura des commandes réelles

    // =============================
    // 3. CROSS-SELL / UPSELL
    // =============================
    const crossSellMap = {
        1: [8, 3],    // Masque LED Pro → Sérum Vit C, Scrubber
        2: [5, 6],    // Gua Sha Quartz Rose → Ice Roller, V-Line Roller
        3: [8, 4],    // Scrubber Ultrasonique → Sérum Vit C, Brosse Sonic
        4: [3, 8],    // Brosse Sonic → Scrubber, Sérum Vit C
        5: [2, 9],    // Ice Roller Cryo → Gua Sha, Patchs Yeux
        6: [2, 5],    // V-Line Roller EMS → Gua Sha, Ice Roller
        7: [1, 10],   // Facial Steamer → Masque LED, Masque Collagène
        8: [11, 9],   // Sérum Éclat Vit C → Huile Rose, Patchs Yeux
        9: [8, 12],   // Patchs Yeux Collagène → Sérum Vit C, Stickers Anti-Rides
        10: [8, 7],   // Masque Collagène Lifting → Sérum Vit C, Facial Steamer
        11: [8, 10],  // Huile Rose Musquée → Sérum Vit C, Masque Collagène
        12: [9, 11],  // Stickers Anti-Rides → Patchs Yeux, Huile Rose
        13: [14, 7],  // Masque Yeux Vapeur → Diffuseur Arôme, Facial Steamer
        14: [13, 15], // Diffuseur Arôme → Masque Yeux, Kit Boucles
        15: [2, 5]    // Kit Boucles → Gua Sha, Ice Roller
    };

    window.getCrossSellProducts = function(cartItems) {
        const cartIds = cartItems.map(item => item.id);
        const suggestions = new Set();

        cartIds.forEach(id => {
            const related = crossSellMap[id] || [];
            related.forEach(relId => {
                if (!cartIds.includes(relId)) suggestions.add(relId);
            });
        });

        return Array.from(suggestions)
            .slice(0, 2)
            .map(id => PRODUCTS.find(p => p.id === id))
            .filter(Boolean);
    };

    // =============================
    // 4. EXIT INTENT POPUP
    // =============================
    let exitIntentShown = localStorage.getItem('eclat_exit_intent');

    function showExitIntent() {
        if (exitIntentShown) return;
        exitIntentShown = true;
        localStorage.setItem('eclat_exit_intent', Date.now());

        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        const exitTexts = {
            fr: { title: 'Attendez !', sub: 'Ne partez pas les mains vides...', offer: '-15% sur votre commande', with: 'avec le code', copied: 'Copié ! ✓', expire: '⏰ Expire dans 24h', cta: 'En profiter maintenant' },
            en: { title: 'Wait!', sub: 'Don\'t leave empty-handed...', offer: '-15% off your order', with: 'with code', copied: 'Copied! ✓', expire: '⏰ Expires in 24h', cta: 'Shop now' },
            es: { title: '¡Espera!', sub: 'No te vayas con las manos vacías...', offer: '-15% en tu pedido', with: 'con el código', copied: '¡Copiado! ✓', expire: '⏰ Expira en 24h', cta: 'Aprovéchalo ahora' },
            de: { title: 'Warten Sie!', sub: 'Gehen Sie nicht mit leeren Händen...', offer: '-15% auf Ihre Bestellung', with: 'mit dem Code', copied: 'Kopiert! ✓', expire: '⏰ Läuft in 24h ab', cta: 'Jetzt einlösen' }
        };
        const xt = exitTexts[lang] || exitTexts.fr;

        const overlay = document.createElement('div');
        overlay.className = 'exit-intent-overlay';
        overlay.innerHTML = `
            <div class="exit-intent-modal">
                <button class="exit-intent-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="eim-content">
                    <div class="eim-icon">🎁</div>
                    <h2>${xt.title}</h2>
                    <p>${xt.sub}</p>
                    <div class="eim-offer">
                        <strong>${xt.offer}</strong>
                        <p>${xt.with}</p>
                        <div class="eim-code" onclick="navigator.clipboard.writeText('RESTEZ15'); this.innerHTML='${xt.copied}'">RESTEZ15</div>
                    </div>
                    <p class="eim-expire">${xt.expire}</p>
                    <a href="#produits" class="btn btn-primary btn-full" onclick="this.closest('.exit-intent-overlay').remove()">${xt.cta}</a>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));
    }

    document.addEventListener('mouseout', (e) => {
        if (e.clientY < 5 && !exitIntentShown) {
            showExitIntent();
        }
    });

    // =============================
    // 5. PRODUITS "RÉCEMMENT VUS"
    // =============================
    window.trackProductView = function(productId) {
        let viewed = JSON.parse(localStorage.getItem('eclat_recently_viewed')) || [];
        viewed = viewed.filter(id => id !== productId);
        viewed.unshift(productId);
        viewed = viewed.slice(0, 6);
        localStorage.setItem('eclat_recently_viewed', JSON.stringify(viewed));
    };

    // =============================
    // 6. ROUTINE BUILDER — "Complétez votre routine"
    // Psychologie : Zeigarnik Effect + Goal Gradient
    // =============================
    function renderRoutineBuilder() {
        const container = document.getElementById('routineBuilder');
        if (!container) return;

        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        const cartIds = (typeof cart !== 'undefined' && cart.items) ? cart.items.map(i => i.id) : [];

        if (cartIds.length === 0) {
            container.innerHTML = '';
            return;
        }

        // Determine which routine steps are covered
        const coveredSteps = new Set();
        cartIds.forEach(id => {
            const step = PRODUCT_ROUTINE_MAP[id];
            if (step) coveredSteps.add(step);
        });

        if (coveredSteps.size === 0) {
            container.innerHTML = '';
            return;
        }

        const titles = {
            fr: 'Complétez votre routine',
            en: 'Complete your routine',
            es: 'Completa tu rutina',
            de: 'Vervollständigen Sie Ihre Routine'
        };

        const addTexts = {
            fr: 'Ajouter',
            en: 'Add',
            es: 'Añadir',
            de: 'Hinzufügen'
        };

        const totalSteps = ROUTINE_STEPS.length;
        const completed = coveredSteps.size;
        const pct = Math.round((completed / totalSteps) * 100);

        let html = `
            <div class="routine-builder">
                <div class="rb-header">
                    <strong>${titles[lang] || titles.fr}</strong>
                    <span class="rb-progress-text">${completed}/${totalSteps}</span>
                </div>
                <div class="rb-bar"><div class="rb-fill" style="width:${pct}%"></div></div>
                <div class="rb-steps">`;

        ROUTINE_STEPS.forEach(step => {
            const done = coveredSteps.has(step.key);
            const label = step[lang] || step.fr;

            if (done) {
                html += `<div class="rb-step done"><span class="rb-icon">✓</span><span class="rb-label">${label}</span></div>`;
            } else {
                // Find cheapest product for this step
                const candidates = PRODUCTS.filter(p => PRODUCT_ROUTINE_MAP[p.id] === step.key && !cartIds.includes(p.id));
                if (candidates.length > 0) {
                    const best = candidates.sort((a, b) => a.price - b.price)[0];
                    html += `<div class="rb-step missing" onclick="addToCart(${best.id}); renderRoutineBuilder();">
                        <span class="rb-icon">${step.icon}</span>
                        <span class="rb-label">${label}</span>
                        <span class="rb-suggest">${best.name.split(' ').slice(0, 3).join(' ')} — ${best.price.toFixed(2).replace('.', ',')}€</span>
                        <span class="rb-add">+ ${addTexts[lang] || addTexts.fr}</span>
                    </div>`;
                }
            }
        });

        html += '</div></div>';
        container.innerHTML = html;
    }

    // Inject routine builder container into cart sidebar
    const cartItemsDiv = document.getElementById('cartItems');
    if (cartItemsDiv) {
        const rbDiv = document.createElement('div');
        rbDiv.id = 'routineBuilder';
        cartItemsDiv.parentNode.insertBefore(rbDiv, cartItemsDiv.nextSibling);
    }

    cart.onChange(() => renderRoutineBuilder());

    // =============================
    // 7. RÉCOMPENSES PANIER MULTI-PALIERS
    // Psychologie : Goal Gradient + Loss Aversion
    // =============================
    function updateCartRewards() {
        const total = cart.getTotal();
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';

        const tiers = [
            { min: 49, fr: '🚚 Livraison gratuite', en: '🚚 Free shipping', es: '🚚 Envío gratis', de: '🚚 Kostenloser Versand' },
            { min: 69, fr: '🎁 Échantillon offert', en: '🎁 Free sample', es: '🎁 Muestra gratis', de: '🎁 Gratisprobe' },
            { min: 99, fr: '💎 -5% sur la commande', en: '💎 -5% off order', es: '💎 -5% en el pedido', de: '💎 -5% auf Bestellung' },
        ];

        const rewardsEl = document.getElementById('cartRewards');
        if (!rewardsEl) return;
        if (total === 0) { rewardsEl.innerHTML = ''; return; }

        const nextLabel = { fr: 'Plus que', en: 'Only', es: 'Solo faltan', de: 'Nur noch' };

        let html = '<div class="cart-rewards">';
        tiers.forEach(tier => {
            const unlocked = total >= tier.min;
            const label = tier[lang] || tier.fr;
            if (unlocked) {
                html += `<div class="cr-tier unlocked">✓ ${label}</div>`;
            } else {
                const remaining = (tier.min - total).toFixed(2).replace('.', ',');
                html += `<div class="cr-tier locked">${label} — ${nextLabel[lang] || nextLabel.fr} <strong>${remaining}€</strong></div>`;
            }
        });
        html += '</div>';
        rewardsEl.innerHTML = html;
    }

    // Inject rewards container
    if (cartFooter) {
        const rewardsDiv = document.createElement('div');
        rewardsDiv.id = 'cartRewards';
        cartFooter.insertBefore(rewardsDiv, cartFooter.firstChild);
    }

    cart.onChange(() => updateCartRewards());
    updateCartRewards();

    // =============================
    // 8. PRODUITS VUS RÉCEMMENT — Affichage
    // Psychologie : Mere Exposure Effect
    // =============================
    function renderRecentlyViewed() {
        const section = document.getElementById('recentlyViewedSection');
        if (!section) return;

        const viewed = JSON.parse(localStorage.getItem('eclat_recently_viewed')) || [];
        if (viewed.length < 2) { section.style.display = 'none'; return; }

        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        const titles = {
            fr: 'Vus récemment',
            en: 'Recently viewed',
            es: 'Vistos recientemente',
            de: 'Kürzlich angesehen'
        };

        const products = viewed
            .map(id => PRODUCTS.find(p => p.id === id))
            .filter(Boolean)
            .slice(0, 4);

        if (products.length < 2) { section.style.display = 'none'; return; }

        section.style.display = '';
        section.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>${titles[lang] || titles.fr}</h2>
                </div>
                <div class="recently-viewed-grid">
                    ${products.map(p => `
                        <div class="rv-card" onclick="openModal(${p.id})">
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <div class="rv-info">
                                <span class="rv-name">${p.name}</span>
                                <strong class="rv-price">${p.price.toFixed(2).replace('.', ',')} €</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Create recently viewed section before footer
    const footer = document.querySelector('footer');
    if (footer) {
        const rvSection = document.createElement('section');
        rvSection.id = 'recentlyViewedSection';
        rvSection.className = 'recently-viewed-section';
        rvSection.style.display = 'none';
        footer.parentNode.insertBefore(rvSection, footer);
        renderRecentlyViewed();
    }
});
