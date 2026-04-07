// ============================
// ÉCLAT - Recherche & Filtres Avancés
// Barre de recherche + filtres prix/type/note
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // Créer la barre de recherche et les filtres avancés
    const productsSection = document.querySelector('.products-section .container');
    if (!productsSection) return;

    const filterArea = document.querySelector('.category-filter');
    if (!filterArea) return;

    // Textes multilingues pour les filtres
    const FL = {
        fr: { search: 'Rechercher un produit...', price: 'Prix', allPrices: 'Tous les prix', under15: 'Moins de 15€', f1525: '15€ - 25€', f2540: '25€ - 40€', over40: 'Plus de 40€', rating: 'Note minimum', allRatings: 'Toutes les notes', sort: 'Trier par', popular: 'Popularité', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant', bestRating: 'Meilleures notes', mostReviews: "Plus d'avis", newest: 'Nouveautés', products: 'produits', product: 'produit' },
        en: { search: 'Search a product...', price: 'Price', allPrices: 'All prices', under15: 'Under 15€', f1525: '15€ - 25€', f2540: '25€ - 40€', over40: 'Over 40€', rating: 'Min rating', allRatings: 'All ratings', sort: 'Sort by', popular: 'Popularity', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', bestRating: 'Best rated', mostReviews: 'Most reviews', newest: 'Newest', products: 'products', product: 'product' },
        es: { search: 'Buscar producto...', price: 'Precio', allPrices: 'Todos los precios', under15: 'Menos de 15€', f1525: '15€ - 25€', f2540: '25€ - 40€', over40: 'Más de 40€', rating: 'Nota mínima', allRatings: 'Todas las notas', sort: 'Ordenar', popular: 'Popularidad', priceAsc: 'Precio ascendente', priceDesc: 'Precio descendente', bestRating: 'Mejor valorados', mostReviews: 'Más opiniones', newest: 'Novedades', products: 'productos', product: 'producto' },
        de: { search: 'Produkt suchen...', price: 'Preis', allPrices: 'Alle Preise', under15: 'Unter 15€', f1525: '15€ - 25€', f2540: '25€ - 40€', over40: 'Über 40€', rating: 'Mindestbewertung', allRatings: 'Alle Bewertungen', sort: 'Sortieren', popular: 'Beliebtheit', priceAsc: 'Preis aufsteigend', priceDesc: 'Preis absteigend', bestRating: 'Bestbewertet', mostReviews: 'Meiste Bewertungen', newest: 'Neuheiten', products: 'Produkte', product: 'Produkt' }
    };
    const fl = () => FL[(typeof currentLang !== 'undefined') ? currentLang : 'fr'] || FL.fr;

    // Injecter la barre de recherche + filtres avancés
    const searchHTML = document.createElement('div');
    searchHTML.className = 'advanced-filters';

    function buildFiltersHTML() {
        const f = fl();
        return `
        <div class="search-bar">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" id="productSearch" placeholder="${f.search}" autocomplete="off">
            <span class="search-count" id="searchCount"></span>
        </div>
        <div class="filter-row">
            <div class="filter-group">
                <label>${f.price}</label>
                <select id="filterPrice">
                    <option value="all">${f.allPrices}</option>
                    <option value="0-15">${f.under15}</option>
                    <option value="15-25">${f.f1525}</option>
                    <option value="25-40">${f.f2540}</option>
                    <option value="40+">${f.over40}</option>
                </select>
            </div>
            <div class="filter-group">
                <label>${f.rating}</label>
                <select id="filterRating">
                    <option value="0">${f.allRatings}</option>
                    <option value="4.5">4.5+ ★</option>
                    <option value="4.7">4.7+ ★</option>
                    <option value="4.8">4.8+ ★</option>
                    <option value="4.9">4.9+ ★</option>
                </select>
            </div>
            <div class="filter-group">
                <label>${f.sort}</label>
                <select id="filterSort">
                    <option value="popular">${f.popular}</option>
                    <option value="price-asc">${f.priceAsc}</option>
                    <option value="price-desc">${f.priceDesc}</option>
                    <option value="rating">${f.bestRating}</option>
                    <option value="reviews">${f.mostReviews}</option>
                    <option value="new">${f.newest}</option>
                </select>
            </div>
        </div>`;
    }
    searchHTML.innerHTML = buildFiltersHTML();

    // Rebuild filters when language changes
    const origSetLang = window.setLanguage;
    if (origSetLang) {
        window.setLanguage = function(lang) {
            origSetLang(lang);
            searchHTML.innerHTML = buildFiltersHTML();
            bindFilterEvents();
            setTimeout(() => { if (typeof translateProducts === 'function') translateProducts(); }, 100);
        };
    }
    filterArea.after(searchHTML);

    // Fonction de filtrage
    function applyFilters() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase().trim();
        const priceRange = document.getElementById('filterPrice').value;
        const minRating = parseFloat(document.getElementById('filterRating').value);
        const sortBy = document.getElementById('filterSort').value;

        let filtered = PRODUCTS.filter(product => {
            // Recherche texte
            if (searchTerm) {
                const searchIn = `${product.name} ${product.description} ${product.category}`.toLowerCase();
                if (!searchIn.includes(searchTerm)) return false;
            }

            // Filtre prix
            if (priceRange !== 'all') {
                if (priceRange === '0-15' && product.price >= 15) return false;
                if (priceRange === '15-25' && (product.price < 15 || product.price >= 25)) return false;
                if (priceRange === '25-40' && (product.price < 25 || product.price >= 40)) return false;
                if (priceRange === '40+' && product.price < 40) return false;
            }

            // Filtre note
            if (minRating > 0 && product.rating < minRating) return false;

            // Filtre catégorie active
            const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category;
            if (activeCategory && activeCategory !== 'all') {
                if (product.category !== activeCategory) return false;
            }

            return true;
        });

        // Tri
        switch (sortBy) {
            case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
            case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
            case 'reviews': filtered.sort((a, b) => b.reviews - a.reviews); break;
            case 'new': filtered.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
            default: // popular — par nombre d'avis
                filtered.sort((a, b) => b.reviews - a.reviews);
        }

        // Render
        renderFilteredProducts(filtered);

        // Count
        const countEl = document.getElementById('searchCount');
        if (searchTerm || priceRange !== 'all' || minRating > 0) {
            const f = fl();
            countEl.textContent = `${filtered.length} ${filtered.length > 1 ? f.products : f.product}`;
        } else {
            countEl.textContent = '';
        }
    }

    function renderFilteredProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        const catLabels = {
            fr: { visage: 'Soins visage', soin: 'Skincare', corps: 'Corps & fitness', outils: 'Outils beauté', aromatherapie: 'Bien-être' },
            en: { visage: 'Face care', soin: 'Skincare', corps: 'Body & fitness', outils: 'Beauty tools', aromatherapie: 'Wellness' },
            es: { visage: 'Cuidado facial', soin: 'Skincare', corps: 'Cuerpo', outils: 'Herramientas', aromatherapie: 'Bienestar' },
            de: { visage: 'Gesichtspflege', soin: 'Skincare', corps: 'Körper', outils: 'Beauty-Tools', aromatherapie: 'Wellness' }
        };
        const getCategoryLabel = (cat) => (catLabels[lang] || catLabels.fr)[cat] || cat;
        const reviewsWord = { fr: 'avis', en: 'reviews', es: 'opiniones', de: 'Bewertungen' }[lang] || 'avis';
        const addCartText = { fr: 'Ajouter au panier', en: 'Add to cart', es: 'Añadir al carrito', de: 'In den Warenkorb' }[lang] || 'Ajouter au panier';
        const quickViewText = { fr: 'Aperçu rapide', en: 'Quick view', es: 'Vista rápida', de: 'Schnellansicht' }[lang] || 'Aperçu rapide';

        grid.innerHTML = products.map(product => `
            <div class="product-card fade-in visible" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge badge-${product.badge}">${
                        product.badge === 'new' ? t('badge_new') :
                        product.badge === 'promo' ? t('badge_promo') :
                        product.badge === 'lancement' ? t('badge_lancement') : t('badge_bestseller')
                    }</span>` : ''}
                    <button class="product-quick-view" onclick="openModal(${product.id})">${quickViewText}</button>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''}
                        <span class="count">(${product.reviews.toLocaleString('fr-FR')} ${reviewsWord})</span>
                    </div>
                    <div class="product-price">
                        <span class="price-current">${product.price.toFixed(2).replace('.', ',')} €</span>
                        ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toFixed(2).replace('.', ',')} €</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">${addCartText}</button>
                    </div>
                </div>
            </div>
        `).join('');

        // No results
        if (products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 24px;color:var(--color-text-light);">
                    <div style="font-size:3rem;margin-bottom:16px;">🔍</div>
                    <h3 style="font-family:var(--font-display);margin-bottom:8px;">${{fr:'Aucun produit trouvé',en:'No products found',es:'Ningún producto encontrado',de:'Keine Produkte gefunden'}[lang]||'Aucun produit trouvé'}</h3>
                    <p>${{fr:'Essayez de modifier vos filtres ou votre recherche.',en:'Try adjusting your filters or search.',es:'Intenta modificar tus filtros o búsqueda.',de:'Versuchen Sie Ihre Filter oder Suche anzupassen.'}[lang]||''}</p>
                </div>
            `;
        }
    }

    // Event listeners
    function bindFilterEvents() {
        document.getElementById('productSearch')?.addEventListener('input', applyFilters);
        document.getElementById('filterPrice')?.addEventListener('change', applyFilters);
        document.getElementById('filterRating')?.addEventListener('change', applyFilters);
        document.getElementById('filterSort')?.addEventListener('change', applyFilters);
    }
    bindFilterEvents();

    // Connect category filter buttons to the advanced filter system
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(applyFilters, 50);
        });
    });
});
