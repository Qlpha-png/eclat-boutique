// ============================
// ÉCLAT - Recherche & Filtres Avancés v2
// Pagination intégrée, compatible app.js
// ============================

document.addEventListener('DOMContentLoaded', function() {

    var productsSection = document.querySelector('.products-section .container');
    if (!productsSection) return;

    var filterArea = document.querySelector('.category-filter');
    if (!filterArea) return;

    // Mapping produit → préoccupations peau (15 originaux + CJ via product.concerns)
    var CONCERN_MAP = {
        1:['acne','aging','glow'], 2:['glow','aging'], 3:['acne','pores'], 4:['acne','pores'],
        5:['puffiness','redness'], 6:['puffiness','redness'], 7:['hydration','pores'],
        8:['glow','aging','dark-spots'], 9:['puffiness','hydration'], 10:['aging','hydration'],
        11:['aging','hydration','scars'], 12:['aging'], 13:['relaxation','hydration'],
        14:['relaxation'], 15:['relaxation','aging']
    };

    var FL = {
        fr: { search: 'Rechercher un produit...', price: 'Prix', allPrices: 'Tous les prix', under15: 'Moins de 15\u20ac', f1525: '15\u20ac - 25\u20ac', f2540: '25\u20ac - 40\u20ac', over40: 'Plus de 40\u20ac', rating: 'Note minimum', allRatings: 'Toutes les notes', sort: 'Trier par', popular: 'Popularit\u00e9', priceAsc: 'Prix croissant', priceDesc: 'Prix d\u00e9croissant', bestRating: 'Meilleures notes', mostReviews: "Plus d'avis", newest: 'Nouveaut\u00e9s', products: 'produits', product: 'produit', concern: 'Pr\u00e9occupation', allConcerns: 'Toutes', reset: 'R\u00e9initialiser' },
        en: { search: 'Search a product...', price: 'Price', allPrices: 'All prices', under15: 'Under 15\u20ac', f1525: '15\u20ac - 25\u20ac', f2540: '25\u20ac - 40\u20ac', over40: 'Over 40\u20ac', rating: 'Min rating', allRatings: 'All ratings', sort: 'Sort by', popular: 'Popularity', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', bestRating: 'Best rated', mostReviews: 'Most reviews', newest: 'Newest', products: 'products', product: 'product', concern: 'Concern', allConcerns: 'All', reset: 'Reset' },
        es: { search: 'Buscar producto...', price: 'Precio', allPrices: 'Todos los precios', under15: 'Menos de 15\u20ac', f1525: '15\u20ac - 25\u20ac', f2540: '25\u20ac - 40\u20ac', over40: 'M\u00e1s de 40\u20ac', rating: 'Nota m\u00ednima', allRatings: 'Todas las notas', sort: 'Ordenar', popular: 'Popularidad', priceAsc: 'Precio ascendente', priceDesc: 'Precio descendente', bestRating: 'Mejor valorados', mostReviews: 'M\u00e1s opiniones', newest: 'Novedades', products: 'productos', product: 'producto', concern: 'Preocupaci\u00f3n', allConcerns: 'Todas', reset: 'Reiniciar' },
        de: { search: 'Produkt suchen...', price: 'Preis', allPrices: 'Alle Preise', under15: 'Unter 15\u20ac', f1525: '15\u20ac - 25\u20ac', f2540: '25\u20ac - 40\u20ac', over40: '\u00dcber 40\u20ac', rating: 'Mindestbewertung', allRatings: 'Alle Bewertungen', sort: 'Sortieren', popular: 'Beliebtheit', priceAsc: 'Preis aufsteigend', priceDesc: 'Preis absteigend', bestRating: 'Bestbewertet', mostReviews: 'Meiste Bewertungen', newest: 'Neuheiten', products: 'Produkte', product: 'Produkt', concern: 'Hautproblem', allConcerns: 'Alle', reset: 'Zur\u00fccksetzen' }
    };
    function fl() { return FL[(typeof currentLang !== 'undefined') ? currentLang : 'fr'] || FL.fr; }

    var CONCERN_LABELS = {
        fr: { acne: 'Acn\u00e9', aging: 'Anti-\u00e2ge', glow: '\u00c9clat', hydration: 'Hydratation', pores: 'Pores', puffiness: 'Poches & cernes', relaxation: 'Bien-\u00eatre' },
        en: { acne: 'Acne', aging: 'Anti-aging', glow: 'Glow', hydration: 'Hydration', pores: 'Pores', puffiness: 'Puffiness', relaxation: 'Wellness' },
        es: { acne: 'Acn\u00e9', aging: 'Anti-edad', glow: 'Luminosidad', hydration: 'Hidrataci\u00f3n', pores: 'Poros', puffiness: 'Ojeras', relaxation: 'Bienestar' },
        de: { acne: 'Akne', aging: 'Anti-Aging', glow: 'Glow', hydration: 'Feuchtigkeit', pores: 'Poren', puffiness: 'Schwellungen', relaxation: 'Wellness' }
    };

    // Container pour les filtres
    var searchHTML = document.createElement('div');
    searchHTML.className = 'advanced-filters';

    function buildFiltersHTML() {
        var f = fl();
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        var cl = CONCERN_LABELS[lang] || CONCERN_LABELS.fr;
        return '<div class="search-bar">' +
            '<svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
            '<input type="text" id="productSearch" placeholder="' + f.search + '" autocomplete="off">' +
            '<span class="search-count" id="searchCount"></span>' +
        '</div>' +
        '<div class="filter-row">' +
            '<div class="filter-group">' +
                '<label>' + f.price + '</label>' +
                '<select id="filterPrice"><option value="all">' + f.allPrices + '</option><option value="0-15">' + f.under15 + '</option><option value="15-25">' + f.f1525 + '</option><option value="25-40">' + f.f2540 + '</option><option value="40+">' + f.over40 + '</option></select>' +
            '</div>' +
            '<div class="filter-group">' +
                '<label>' + f.rating + '</label>' +
                '<select id="filterRating"><option value="0">' + f.allRatings + '</option><option value="4.5">4.5+ \u2605</option><option value="4.7">4.7+ \u2605</option><option value="4.8">4.8+ \u2605</option><option value="4.9">4.9+ \u2605</option></select>' +
            '</div>' +
            '<div class="filter-group">' +
                '<label>' + f.concern + '</label>' +
                '<select id="filterConcern"><option value="all">' + f.allConcerns + '</option>' +
                    '<option value="acne">' + cl.acne + '</option>' +
                    '<option value="aging">' + cl.aging + '</option>' +
                    '<option value="glow">' + cl.glow + '</option>' +
                    '<option value="hydration">' + cl.hydration + '</option>' +
                    '<option value="pores">' + cl.pores + '</option>' +
                    '<option value="puffiness">' + cl.puffiness + '</option>' +
                    '<option value="relaxation">' + cl.relaxation + '</option>' +
                '</select>' +
            '</div>' +
            '<div class="filter-group">' +
                '<label>' + f.sort + '</label>' +
                '<select id="filterSort"><option value="popular">' + f.popular + '</option><option value="price-asc">' + f.priceAsc + '</option><option value="price-desc">' + f.priceDesc + '</option><option value="rating">' + f.bestRating + '</option><option value="reviews">' + f.mostReviews + '</option><option value="new">' + f.newest + '</option></select>' +
            '</div>' +
        '</div>';
    }
    searchHTML.innerHTML = buildFiltersHTML();

    // Rebuild on language change
    var origSetLang = window.setLanguage;
    if (origSetLang) {
        window.setLanguage = function(lang) {
            origSetLang(lang);
            searchHTML.innerHTML = buildFiltersHTML();
            bindFilterEvents();
            setTimeout(function() {
                if (typeof translateProducts === 'function') translateProducts();
            }, 100);
        };
    }
    filterArea.after(searchHTML);

    // --- Unified filter function ---
    function applyFilters() {
        var searchEl = document.getElementById('productSearch');
        var priceEl = document.getElementById('filterPrice');
        var ratingEl = document.getElementById('filterRating');
        var sortEl = document.getElementById('filterSort');
        var concernEl = document.getElementById('filterConcern');

        var searchTerm = searchEl ? searchEl.value.toLowerCase().trim() : '';
        var priceRange = priceEl ? priceEl.value : 'all';
        var minRating = ratingEl ? parseFloat(ratingEl.value) : 0;
        var sortBy = sortEl ? sortEl.value : 'popular';
        var concernFilter = concernEl ? concernEl.value : 'all';

        // Get active category
        var activeCat = 'all';
        var activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) activeCat = activeBtn.dataset.category || 'all';

        // Check if any advanced filter is active
        var hasAdvancedFilter = searchTerm || priceRange !== 'all' || minRating > 0 || concernFilter !== 'all' || sortBy !== 'popular';

        // If no advanced filter → let app.js handle via renderProducts
        if (!hasAdvancedFilter) {
            if (typeof window.renderProducts === 'function') {
                window.renderProducts(activeCat);
            }
            return;
        }

        var filtered = PRODUCTS.filter(function(product) {
            // Category filter
            if (activeCat !== 'all' && product.category !== activeCat) return false;

            // Text search
            if (searchTerm) {
                var searchIn = (product.name + ' ' + product.description + ' ' + product.category + ' ' + (product.subcategory || '')).toLowerCase();
                if (searchIn.indexOf(searchTerm) === -1) return false;
            }

            // Price filter
            if (priceRange !== 'all') {
                if (priceRange === '0-15' && product.price >= 15) return false;
                if (priceRange === '15-25' && (product.price < 15 || product.price >= 25)) return false;
                if (priceRange === '25-40' && (product.price < 25 || product.price >= 40)) return false;
                if (priceRange === '40+' && product.price < 40) return false;
            }

            // Rating filter
            if (minRating > 0 && product.rating < minRating) return false;

            // Concern filter
            if (concernFilter !== 'all') {
                var concerns = CONCERN_MAP[product.id] || product.concerns || [];
                if (concerns.indexOf(concernFilter) === -1) return false;
            }

            return true;
        });

        // Sort
        switch (sortBy) {
            case 'price-asc': filtered.sort(function(a, b) { return a.price - b.price; }); break;
            case 'price-desc': filtered.sort(function(a, b) { return b.price - a.price; }); break;
            case 'rating': filtered.sort(function(a, b) { return b.rating - a.rating; }); break;
            case 'reviews': filtered.sort(function(a, b) { return b.reviews - a.reviews; }); break;
            case 'new': filtered.sort(function(a, b) { return (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0); }); break;
            default: filtered.sort(function(a, b) { return b.reviews - a.reviews; });
        }

        // Use app.js unified pagination
        if (typeof window._renderProductPage === 'function') {
            window._renderProductPage(filtered);
        }
    }

    // Event listeners
    function bindFilterEvents() {
        var searchEl = document.getElementById('productSearch');
        var priceEl = document.getElementById('filterPrice');
        var ratingEl = document.getElementById('filterRating');
        var sortEl = document.getElementById('filterSort');
        var concernEl = document.getElementById('filterConcern');

        // Debounced search
        var searchTimer = null;
        if (searchEl) {
            searchEl.addEventListener('input', function() {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(applyFilters, 300);
            });
        }
        if (priceEl) priceEl.addEventListener('change', applyFilters);
        if (ratingEl) ratingEl.addEventListener('change', applyFilters);
        if (sortEl) sortEl.addEventListener('change', applyFilters);
        if (concernEl) concernEl.addEventListener('change', applyFilters);
    }
    bindFilterEvents();

    // Connect category buttons → reset filters on category change
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Category change already handled by app.js
            // But if advanced filters are active, apply them
            setTimeout(function() {
                var hasAny = (document.getElementById('productSearch') && document.getElementById('productSearch').value) ||
                    (document.getElementById('filterPrice') && document.getElementById('filterPrice').value !== 'all') ||
                    (document.getElementById('filterRating') && parseFloat(document.getElementById('filterRating').value) > 0) ||
                    (document.getElementById('filterConcern') && document.getElementById('filterConcern').value !== 'all') ||
                    (document.getElementById('filterSort') && document.getElementById('filterSort').value !== 'popular');
                if (hasAny) applyFilters();
            }, 100);
        });
    });

    // Expose for external use
    window.applyFilters = applyFilters;
});
