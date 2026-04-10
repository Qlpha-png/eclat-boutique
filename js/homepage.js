// ============================
// ÉCLAT — Homepage Dynamique
// Carousels, Hero Slider, Sections thématiques
// Style Amazon/Sephora — 100% vanilla JS
// ============================

(function() {
    'use strict';

    // --- Hero Slider ---
    // Images lifestyle Unsplash (gratuites, usage commercial)
    var heroImages = [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ];

    var heroSlides = [
        {
            tag: 'Lancement 2026',
            title: 'Votre beaut\u00e9,<br><em>sublim\u00e9e par la science.</em>',
            desc: '500+ soins s\u00e9lectionn\u00e9s. Chaque ingr\u00e9dient analys\u00e9. Livraison suivie en Europe.',
            btn1: { text: '\uD83D\uDD2C Trouver ma routine', href: 'pages/diagnostic.html' },
            btn2: { text: '\u2728 Composer ma routine', href: '#routine-composer' },
            bg: 'linear-gradient(135deg, #fff5f8 0%, #fce8ef 50%, #fdf5f0 100%)'
        },
        {
            tag: '-10% sur tout',
            title: 'Code <em>BIENVENUE10</em>',
            desc: 'Votre premi\u00e8re commande \u00e0 prix r\u00e9duit. Sans minimum d\'achat. Cumulable avec les coffrets.',
            btn1: { text: '\uD83C\uDF81 Voir les coffrets', href: '#packs' },
            btn2: { text: '\uD83D\uDED2 Voir la boutique', href: '#produits' },
            bg: 'linear-gradient(135deg, #f8f0e8 0%, #f0e4d4 50%, #faf5f0 100%)'
        },
        {
            tag: 'Diagnostic IA',
            title: 'Trouvez votre<br><em>routine id\u00e9ale</em>',
            desc: '4 questions, 2 minutes. Notre IA analyse votre peau et recommande les produits adapt\u00e9s.',
            btn1: { text: '\uD83E\uDDD2 Faire le diagnostic', href: 'pages/diagnostic.html' },
            btn2: { text: '\uD83D\uDCD6 Guide beaut\u00e9', href: 'pages/guide-beaute.html' },
            bg: 'linear-gradient(135deg, #f5f0f8 0%, #ece4f0 50%, #faf5fa 100%)'
        },
        {
            tag: 'Programme \u00c9clats',
            title: 'Chaque achat<br><em>vous r\u00e9compense</em>',
            desc: 'Gagnez des \u00c9clats \u00e0 chaque commande. 4 paliers, coffre du jour, d\u00e9fis hebdo.',
            btn1: { text: '\uD83D\uDC8E D\u00e9couvrir', href: 'pages/loyalty.html' },
            btn2: { text: '\uD83D\uDCDD Cr\u00e9er un compte', href: 'pages/register.html' },
            bg: 'linear-gradient(135deg, #fdf5f0 0%, #fce8e0 50%, #f5ebe4 100%)'
        }
    ];

    var currentSlide = 0;
    var slideInterval = null;

    function initHeroSlider() {
        var heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        // Inject slider dots
        var heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        var dotsHTML = '<div class="hero-dots" style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:10;">';
        for (var i = 0; i < heroSlides.length; i++) {
            dotsHTML += '<button class="hero-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '" style="width:12px;height:12px;border-radius:50%;border:2px solid var(--color-secondary);background:' + (i === 0 ? 'var(--color-secondary)' : 'transparent') + ';cursor:pointer;transition:all .3s;padding:0;" aria-label="Slide ' + (i + 1) + '"></button>';
        }
        dotsHTML += '</div>';
        heroSection.style.position = 'relative';
        heroSection.insertAdjacentHTML('beforeend', dotsHTML);

        // Dot click handlers
        var dots = heroSection.querySelectorAll('.hero-dot');
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-slide'));
                goToSlide(idx);
                resetAutoSlide();
            });
        });

        // Auto-slide every 6 seconds
        startAutoSlide();

        // Pause on hover
        heroSection.addEventListener('mouseenter', function() {
            if (slideInterval) clearInterval(slideInterval);
        });
        heroSection.addEventListener('mouseleave', function() {
            startAutoSlide();
        });
    }

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(function() {
            goToSlide((currentSlide + 1) % heroSlides.length);
        }, 6000);
    }

    function resetAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        startAutoSlide();
    }

    function goToSlide(idx) {
        var heroContent = document.querySelector('.hero-content');
        var heroSection = document.querySelector('.hero');
        if (!heroContent || !heroSection) return;

        currentSlide = idx;
        var slide = heroSlides[idx];

        // Fade out
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(10px)';

        setTimeout(function() {
            // Update content
            var tag = heroContent.querySelector('.hero-tag');
            var h1 = heroContent.querySelector('h1');
            var p = heroContent.querySelector('.hero-content > p');
            var btns = heroContent.querySelector('.hero-buttons');

            if (tag) tag.innerHTML = '\u2728 ' + slide.tag;
            if (h1) h1.innerHTML = slide.title;
            if (p) p.textContent = slide.desc;
            if (btns) {
                btns.innerHTML = '<a href="' + slide.btn1.href + '" class="btn ' + (slide.dark ? 'btn-secondary' : 'btn-primary') + '">' + slide.btn1.text + '</a>' +
                    '<a href="' + slide.btn2.href + '" class="btn ' + (slide.dark ? 'btn-outline-light' : 'btn-outline') + '">' + slide.btn2.text + '</a>';
            }

            // Colors — all slides now use light backgrounds
            heroContent.style.color = '';
            if (tag) tag.style.color = '';
            if (h1) h1.style.color = '';
            if (p) p.style.color = '';

            // Background
            heroSection.style.background = slide.bg;

            // Perks visibility
            var perks = heroContent.querySelector('.hero-perks');
            if (perks) {
                perks.style.display = idx === 0 ? '' : 'none';
            }

            // Fade in
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);

        // Update hero image (single lifestyle image, fade transition)
        var heroImg = document.getElementById('heroMainImg');
        if (heroImg && heroImages[idx]) {
            heroImg.style.opacity = '0';
            setTimeout(function() {
                heroImg.src = heroImages[idx];
                heroImg.onload = function() { heroImg.style.opacity = '1'; };
                // Fallback if image cached
                setTimeout(function() { heroImg.style.opacity = '1'; }, 200);
            }, 350);
        }

        // Update dots
        var dots = heroSection.querySelectorAll('.hero-dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === idx);
            dot.style.background = i === idx ? 'var(--color-secondary)' : 'transparent';
        });
    }

    // --- Product Carousels ---
    function createCarousel(containerId, products, options) {
        var container = document.getElementById(containerId);
        if (!container || !products || products.length === 0) return;

        var opts = options || {};
        var cardWidth = opts.cardWidth || 240;
        var gap = opts.gap || 16;

        var trackId = containerId + '-track';
        var html = '<div style="position:relative;overflow:hidden;">';
        html += '<div id="' + trackId + '" class="carousel-track" style="display:flex;gap:' + gap + 'px;overflow-x:auto;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:8px 0;">';

        for (var i = 0; i < products.length; i++) {
            var p = products[i];
            var pName = p.name;
            if (typeof ProductsI18n !== 'undefined' && typeof currentLang !== 'undefined' && currentLang !== 'fr') {
                var translated = ProductsI18n.get(p.id, currentLang);
                if (translated && translated.name) pName = translated.name;
            }
            var priceStr = p.price.toFixed(2).replace('.', ',') + ' \u20ac';
            var badgeHTML = '';
            if (p.badge === 'best') badgeHTML = '<span style="position:absolute;top:8px;left:8px;background:var(--color-secondary);color:#fff;font-size:.65rem;padding:3px 10px;border-radius:20px;font-weight:600;z-index:2;">Best-seller</span>';
            if (p.badge === 'new') badgeHTML = '<span style="position:absolute;top:8px;left:8px;background:#4caf50;color:#fff;font-size:.65rem;padding:3px 10px;border-radius:20px;font-weight:600;z-index:2;">Nouveau</span>';

            html += '<div class="carousel-card" style="min-width:' + cardWidth + 'px;max-width:' + cardWidth + 'px;background:var(--color-white,#fff);border-radius:var(--radius-md);border:1px solid var(--color-border);overflow:hidden;transition:all .3s;cursor:pointer;flex-shrink:0;" onclick="if(typeof openModal===\'function\')openModal(' + p.id + ');else window.location.href=\'pages/product.html?id=' + p.id + '\'">';
            html += '<div style="position:relative;height:200px;overflow:hidden;background:var(--color-bg-alt);">';
            html += badgeHTML;
            html += '<img src="' + p.image + '" alt="' + pName.replace(/"/g, '') + '" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">';
            html += '</div>';
            html += '<div style="padding:12px;">';
            html += '<div style="font-size:.75rem;color:var(--color-text-light);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">' + (p.category || '') + '</div>';
            html += '<div style="font-weight:600;font-size:.88rem;margin-bottom:6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + pName + '</div>';
            html += '<div style="color:var(--color-secondary);font-weight:700;font-size:1rem;">' + priceStr + '</div>';
            html += '</div></div>';
        }

        html += '</div>';

        // Arrow buttons
        html += '<button class="carousel-arrow carousel-prev" onclick="scrollCarousel(\'' + trackId + '\',-1)" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.95);box-shadow:0 2px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:1.2rem;z-index:5;transition:all .2s;">\u276E</button>';
        html += '<button class="carousel-arrow carousel-next" onclick="scrollCarousel(\'' + trackId + '\',1)" style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.95);box-shadow:0 2px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:1.2rem;z-index:5;transition:all .2s;">\u276F</button>';

        html += '</div>';

        container.innerHTML = html;

        // Hide arrows when track not scrollable
        var track = document.getElementById(trackId);
        if (track) {
            updateArrows(track, container);
            track.addEventListener('scroll', function() {
                updateArrows(track, container);
            });
        }
    }

    function updateArrows(track, container) {
        var prevBtn = container.querySelector('.carousel-prev');
        var nextBtn = container.querySelector('.carousel-next');
        if (!prevBtn || !nextBtn) return;

        prevBtn.style.opacity = track.scrollLeft <= 10 ? '0' : '1';
        prevBtn.style.pointerEvents = track.scrollLeft <= 10 ? 'none' : 'auto';

        var maxScroll = track.scrollWidth - track.clientWidth;
        nextBtn.style.opacity = track.scrollLeft >= maxScroll - 10 ? '0' : '1';
        nextBtn.style.pointerEvents = track.scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    }

    // Global scroll function
    window.scrollCarousel = function(trackId, direction) {
        var track = document.getElementById(trackId);
        if (!track) return;
        var scrollAmount = 260 * 2;
        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    // --- Build Themed Sections ---
    function buildHomepageSections() {
        if (typeof PRODUCTS === 'undefined') return;

        // Tendances = bestsellers (badge "best" or top rated, limited to real rated products for honesty)
        var tendances = PRODUCTS.filter(function(p) {
            return p.badge === 'best' || p.badge === 'promo';
        });
        if (tendances.length < 6) {
            // Fill with first products of popular categories
            var extras = PRODUCTS.filter(function(p) {
                return tendances.indexOf(p) === -1 && (p.category === 'visage' || p.category === 'outils');
            }).slice(0, 12 - tendances.length);
            tendances = tendances.concat(extras);
        }
        tendances = tendances.slice(0, 12);

        // Nouveautés = last 12 products by ID (most recently added)
        var nouveautes = PRODUCTS.slice().sort(function(a, b) { return b.id - a.id; }).slice(0, 12);

        // Soins visage
        var visage = PRODUCTS.filter(function(p) { return p.category === 'visage'; }).slice(0, 12);

        // Petit prix < 15€
        var petitPrix = PRODUCTS.filter(function(p) { return p.price < 15; }).slice(0, 12);

        // Homme
        var homme = PRODUCTS.filter(function(p) { return p.category === 'homme'; }).slice(0, 12);

        // Build sections
        var sectionsContainer = document.getElementById('homepageCarousels');
        if (!sectionsContainer) return;

        var sectionsHTML = '';

        // Tendances
        if (tendances.length >= 4) {
            sectionsHTML += '<section class="homepage-carousel-section anim-fade-up" style="padding:40px 0;">';
            sectionsHTML += '<div class="container">';
            sectionsHTML += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
            sectionsHTML += '<div><span class="section-tag">Populaire</span><h2 style="font-family:var(--font-display);font-size:1.5rem;">Tendances du moment</h2></div>';
            sectionsHTML += '<a href="#produits" style="font-size:.85rem;color:var(--color-secondary);font-weight:600;">Voir tout \u2192</a>';
            sectionsHTML += '</div>';
            sectionsHTML += '<div id="carouselTendances"></div>';
            sectionsHTML += '</div></section>';
        }

        // Nouveautés
        if (nouveautes.length >= 4) {
            sectionsHTML += '<section class="homepage-carousel-section anim-fade-up" style="padding:40px 0;background:var(--color-bg-alt);">';
            sectionsHTML += '<div class="container">';
            sectionsHTML += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
            sectionsHTML += '<div><span class="section-tag">Nouveaut\u00e9s</span><h2 style="font-family:var(--font-display);font-size:1.5rem;">Vient d\'arriver</h2></div>';
            sectionsHTML += '<a href="#produits" style="font-size:.85rem;color:var(--color-secondary);font-weight:600;">Voir tout \u2192</a>';
            sectionsHTML += '</div>';
            sectionsHTML += '<div id="carouselNouveautes"></div>';
            sectionsHTML += '</div></section>';
        }

        // Soins visage (most popular category)
        if (visage.length >= 4) {
            sectionsHTML += '<section class="homepage-carousel-section anim-fade-up" style="padding:40px 0;">';
            sectionsHTML += '<div class="container">';
            sectionsHTML += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
            sectionsHTML += '<div><span class="section-tag">Soins visage</span><h2 style="font-family:var(--font-display);font-size:1.5rem;">Les essentiels du visage</h2></div>';
            sectionsHTML += '<a href="pages/category.html?cat=visage" style="font-size:.85rem;color:var(--color-secondary);font-weight:600;">Voir la cat\u00e9gorie \u2192</a>';
            sectionsHTML += '</div>';
            sectionsHTML += '<div id="carouselVisage"></div>';
            sectionsHTML += '</div></section>';
        }

        // Petits prix
        if (petitPrix.length >= 4) {
            sectionsHTML += '<section class="homepage-carousel-section anim-fade-up" style="padding:40px 0;background:var(--color-bg-alt);">';
            sectionsHTML += '<div class="container">';
            sectionsHTML += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
            sectionsHTML += '<div><span class="section-tag">Bon plan</span><h2 style="font-family:var(--font-display);font-size:1.5rem;">Petits prix, grands r\u00e9sultats</h2></div>';
            sectionsHTML += '<a href="#produits" style="font-size:.85rem;color:var(--color-secondary);font-weight:600;">Voir tout \u2192</a>';
            sectionsHTML += '</div>';
            sectionsHTML += '<div id="carouselPetitPrix"></div>';
            sectionsHTML += '</div></section>';
        }

        // Homme
        if (homme.length >= 4) {
            sectionsHTML += '<section class="homepage-carousel-section anim-fade-up" style="padding:40px 0;">';
            sectionsHTML += '<div class="container">';
            sectionsHTML += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
            sectionsHTML += '<div><span class="section-tag">Pour lui</span><h2 style="font-family:var(--font-display);font-size:1.5rem;">Grooming &amp; soins homme</h2></div>';
            sectionsHTML += '<a href="pages/category.html?cat=homme" style="font-size:.85rem;color:var(--color-secondary);font-weight:600;">Voir la cat\u00e9gorie \u2192</a>';
            sectionsHTML += '</div>';
            sectionsHTML += '<div id="carouselHomme"></div>';
            sectionsHTML += '</div></section>';
        }

        sectionsContainer.innerHTML = sectionsHTML;

        // Render carousels
        if (tendances.length >= 4) createCarousel('carouselTendances', tendances);
        if (nouveautes.length >= 4) createCarousel('carouselNouveautes', nouveautes);
        if (visage.length >= 4) createCarousel('carouselVisage', visage);
        if (petitPrix.length >= 4) createCarousel('carouselPetitPrix', petitPrix);
        if (homme.length >= 4) createCarousel('carouselHomme', homme);
    }

    // --- Search Bar in Navbar ---
    function initSearchBar() {
        var navContainer = document.querySelector('.nav-container');
        if (!navContainer || document.getElementById('navSearchBar')) return;

        // Insert search bar after nav-links
        var navLinks = navContainer.querySelector('.nav-links');
        if (!navLinks) return;

        var searchHTML = '<div id="navSearchBar" class="nav-search" style="flex:1;max-width:400px;margin:0 24px;position:relative;">';
        searchHTML += '<input type="search" id="navSearchInput" placeholder="Rechercher un produit..." style="width:100%;padding:10px 40px 10px 16px;border:1px solid var(--color-border);border-radius:var(--radius-xl);font-size:.85rem;font-family:var(--font-body);background:var(--color-bg-alt);transition:all .3s;outline:none;" onfocus="this.style.borderColor=\'var(--color-secondary)\';this.style.boxShadow=\'0 0 0 3px rgba(201,168,124,.15)\'" onblur="this.style.borderColor=\'\';this.style.boxShadow=\'\'">';
        searchHTML += '<button onclick="executeNavSearch()" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:6px 12px;background:var(--color-secondary);border:none;border-radius:20px;cursor:pointer;color:var(--color-white,#fff);font-size:.8rem;font-weight:600;">\uD83D\uDD0D</button>';
        searchHTML += '<div id="navSearchResults" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--color-white,#fff);border:1px solid var(--color-border);border-radius:var(--radius-md);margin-top:4px;max-height:320px;overflow-y:auto;box-shadow:var(--shadow-lg);z-index:1000;"></div>';
        searchHTML += '</div>';

        navLinks.insertAdjacentHTML('afterend', searchHTML);

        // Live search
        var input = document.getElementById('navSearchInput');
        var resultsDiv = document.getElementById('navSearchResults');
        var debounceTimer = null;

        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            var query = this.value.trim().toLowerCase();
            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }
            debounceTimer = setTimeout(function() {
                searchProducts(query, resultsDiv);
            }, 200);
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeNavSearch();
            }
        });

        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#navSearchBar')) {
                resultsDiv.style.display = 'none';
            }
        });
    }

    function searchProducts(query, resultsDiv) {
        if (typeof PRODUCTS === 'undefined') return;

        var results = PRODUCTS.filter(function(p) {
            return p.name.toLowerCase().indexOf(query) !== -1 ||
                (p.category && p.category.toLowerCase().indexOf(query) !== -1);
        }).slice(0, 8);

        if (results.length === 0) {
            resultsDiv.innerHTML = '<div style="padding:16px;text-align:center;color:var(--color-text-light);font-size:.85rem;">Aucun r\u00e9sultat pour "' + query + '"</div>';
            resultsDiv.style.display = 'block';
            return;
        }

        var html = '';
        for (var i = 0; i < results.length; i++) {
            var p = results[i];
            var priceStr = p.price.toFixed(2).replace('.', ',') + ' \u20ac';
            html += '<a href="pages/product.html?id=' + p.id + '" style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--color-border);transition:background .2s;text-decoration:none;color:inherit;" onmouseover="this.style.background=\'var(--color-bg-alt)\'" onmouseout="this.style.background=\'\'">';
            html += '<img src="' + p.image + '" alt="" style="width:44px;height:44px;object-fit:cover;border-radius:8px;" loading="lazy" onerror="this.style.display=\'none\'">';
            html += '<div style="flex:1;min-width:0;">';
            html += '<div style="font-weight:600;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.name + '</div>';
            html += '<div style="font-size:.75rem;color:var(--color-text-light);">' + (p.category || '') + '</div>';
            html += '</div>';
            html += '<div style="font-weight:700;color:var(--color-secondary);font-size:.9rem;white-space:nowrap;">' + priceStr + '</div>';
            html += '</a>';
        }
        html += '<a href="#produits" style="display:block;text-align:center;padding:10px;font-size:.85rem;color:var(--color-secondary);font-weight:600;" onclick="document.getElementById(\'navSearchResults\').style.display=\'none\'">Voir tous les r\u00e9sultats \u2192</a>';

        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }

    window.executeNavSearch = function() {
        var input = document.getElementById('navSearchInput');
        if (!input || !input.value.trim()) return;
        var query = input.value.trim();
        document.getElementById('navSearchResults').style.display = 'none';
        // Scroll to products and trigger search
        var productsSection = document.getElementById('produits');
        if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
        // Trigger search.js if available
        setTimeout(function() {
            var searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input'));
            }
        }, 500);
    };

    // --- AI Personalization Section ---
    function initAIPersonalization() {
        if (typeof PRODUCTS === 'undefined') return;

        var section = document.getElementById('pourVous');
        var container = document.getElementById('aiRecommendations');
        if (!section || !container) return;

        // Check if user has diagnostic data or browsing history
        var diagnosticData = null;
        try { diagnosticData = JSON.parse(localStorage.getItem('eclat_diagnostic')); } catch(e) {}
        var recentlyViewed = [];
        try { recentlyViewed = JSON.parse(localStorage.getItem('eclat_recently_viewed')) || []; } catch(e) {}
        var userPrefs = null;
        try { userPrefs = JSON.parse(localStorage.getItem('eclat_preferences')); } catch(e) {}

        // If user has ANY data, show personalized section
        if (diagnosticData || recentlyViewed.length >= 2 || userPrefs) {
            section.style.display = '';

            var recommended = [];
            var reason = '';

            if (diagnosticData && diagnosticData.skinType) {
                // Recommend based on skin type
                reason = 'Bas\u00e9 sur votre diagnostic — peau ' + diagnosticData.skinType;
                var skinCategories = {
                    'seche': ['soin', 'corps'],
                    'grasse': ['visage', 'soin'],
                    'mixte': ['visage', 'soin', 'outils'],
                    'sensible': ['soin', 'aromatherapie'],
                    'normale': ['visage', 'outils', 'soin']
                };
                var cats = skinCategories[diagnosticData.skinType] || ['visage', 'soin'];
                recommended = PRODUCTS.filter(function(p) {
                    return cats.indexOf(p.category) !== -1;
                }).slice(0, 8);
            } else if (recentlyViewed.length >= 2) {
                // Recommend based on recently viewed categories
                reason = 'Bas\u00e9 sur vos recherches r\u00e9centes';
                var viewedIds = recentlyViewed.map(function(rv) { return rv.id; });
                var viewedCats = {};
                recentlyViewed.forEach(function(rv) {
                    var prod = PRODUCTS.find(function(p) { return p.id === rv.id; });
                    if (prod && prod.category) viewedCats[prod.category] = (viewedCats[prod.category] || 0) + 1;
                });
                var topCat = Object.keys(viewedCats).sort(function(a, b) { return viewedCats[b] - viewedCats[a]; })[0];
                if (topCat) {
                    recommended = PRODUCTS.filter(function(p) {
                        return p.category === topCat && viewedIds.indexOf(p.id) === -1;
                    }).slice(0, 8);
                }
            } else if (userPrefs) {
                reason = 'Selon vos pr\u00e9f\u00e9rences';
                var prefCat = userPrefs.interest || 'visage';
                recommended = PRODUCTS.filter(function(p) { return p.category === prefCat; }).slice(0, 8);
            }

            if (recommended.length >= 3) {
                var html = '<p style="font-size:.85rem;color:var(--color-text-light);margin-bottom:16px;">';
                html += '&#129302; ' + reason + '</p>';
                html += '<div id="carouselPourVous"></div>';
                container.innerHTML = html;
                createCarousel('carouselPourVous', recommended);
            } else {
                section.style.display = 'none';
            }
        } else {
            // No data — show CTA to start diagnostic
            section.style.display = '';
            container.innerHTML = '<div style="background:linear-gradient(135deg,var(--color-primary),var(--color-primary));border-radius:var(--radius-lg);padding:40px;text-align:center;color:var(--color-white,#fff);">' +
                '<div style="font-size:3rem;margin-bottom:12px;">&#129302;</div>' +
                '<h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:8px;">Votre espace personnalis\u00e9 vous attend</h3>' +
                '<p style="color:rgba(255,255,255,.7);font-size:.9rem;max-width:500px;margin:0 auto 20px;">Faites notre diagnostic IA gratuit en 2 minutes. Votre page d\'accueil s\'adaptera \u00e0 votre profil unique.</p>' +
                '<a href="pages/diagnostic.html" class="btn" style="background:var(--color-secondary);color:var(--color-white,#fff);padding:14px 32px;font-size:.95rem;">&#129302; Mon diagnostic gratuit &rarr;</a>' +
                '</div>';
        }
    }

    // --- Init ---
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for PRODUCTS to be defined
        var checkProducts = setInterval(function() {
            if (typeof PRODUCTS !== 'undefined') {
                clearInterval(checkProducts);
                initHeroSlider();
                initSearchBar();
                initAIPersonalization();
                buildHomepageSections();
            }
        }, 100);

        // Timeout after 5s
        setTimeout(function() {
            clearInterval(checkProducts);
        }, 5000);
    });

})();
