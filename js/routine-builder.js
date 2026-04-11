// ============================
// ÉCLAT — Routine Builder Dynamique v3
// Inspiré Typology : diagnostic express 6 questions + 7 étapes produits
// Personnalisation multi-facteurs (peau, objectif, âge, environnement, niveau, moment)
// Zéro inline handlers — data-action pattern
// ============================
(function() {
    'use strict';

    // ---- DIAGNOSTIC QUESTIONS ----
    var QUESTIONS = [
        {
            id: 'skinType',
            icon: '\uD83E\uDDD6',
            titleFr: 'Quel est votre type de peau ?',
            descFr: 'Observez votre peau le matin au r\u00e9veil, sans produit.',
            options: [
                { value: 'normale', label: 'Normale', icon: '\u2728', desc: '\u00c9quilibr\u00e9e, peu de probl\u00e8mes' },
                { value: 'mixte', label: 'Mixte', icon: '\uD83C\uDF13', desc: 'Grasse sur la zone T, s\u00e8che ailleurs' },
                { value: 'grasse', label: 'Grasse', icon: '\uD83D\uDCA7', desc: 'Brillances, pores dilat\u00e9s' },
                { value: 'seche', label: 'S\u00e8che', icon: '\uD83C\uDFDC\uFE0F', desc: 'Tiraillements, manque de confort' },
                { value: 'sensible', label: 'Sensible', icon: '\uD83C\uDF38', desc: 'Rougeurs, r\u00e9active au moindre changement' }
            ]
        },
        {
            id: 'concern',
            icon: '\uD83C\uDFAF',
            titleFr: 'Votre pr\u00e9occupation principale ?',
            descFr: 'Quel r\u00e9sultat recherchez-vous en priorit\u00e9 ?',
            options: [
                { value: 'antiage', label: 'Anti-\u00e2ge', icon: '\u23F3', desc: 'Rides, fermet\u00e9, \u00e9lasticit\u00e9' },
                { value: 'eclat', label: '\u00c9clat', icon: '\u2728', desc: 'Teint terne, manque de lumi\u00e8re' },
                { value: 'acne', label: 'Imperfections', icon: '\uD83D\uDEE1\uFE0F', desc: 'Boutons, points noirs, exc\u00e8s de s\u00e9bum' },
                { value: 'hydratation', label: 'Hydratation', icon: '\uD83D\uDCA6', desc: 'Peau d\u00e9shydrat\u00e9e, inconfort' },
                { value: 'taches', label: 'Anti-taches', icon: '\u2600\uFE0F', desc: 'Taches pigmentaires, teint irr\u00e9gulier' }
            ]
        },
        {
            id: 'age',
            icon: '\uD83C\uDF31',
            titleFr: 'Votre tranche d\u2019\u00e2ge ?',
            descFr: 'Les besoins de votre peau \u00e9voluent avec le temps.',
            options: [
                { value: '18-25', label: '18\u201325 ans', icon: '\uD83C\uDF31', desc: 'Pr\u00e9vention, hydratation, \u00e9quilibre' },
                { value: '25-35', label: '25\u201335 ans', icon: '\uD83C\uDF3F', desc: 'Protection, premi\u00e8res rides, \u00e9clat' },
                { value: '35-50', label: '35\u201350 ans', icon: '\uD83C\uDF3A', desc: 'Anti-\u00e2ge actif, fermet\u00e9, taches' },
                { value: '50+', label: '50 ans +', icon: '\uD83C\uDF39', desc: 'R\u00e9g\u00e9n\u00e9ration, nutrition intense' }
            ]
        },
        {
            id: 'environment',
            icon: '\uD83C\uDFD9\uFE0F',
            titleFr: 'Votre environnement quotidien ?',
            descFr: 'La pollution, le climat et le stress impactent votre peau.',
            options: [
                { value: 'ville', label: 'Ville / urbain', icon: '\uD83C\uDFD9\uFE0F', desc: 'Pollution, stress, \u00e9crans' },
                { value: 'campagne', label: 'Campagne', icon: '\uD83C\uDF33', desc: 'Air pur mais vent, soleil' },
                { value: 'mer', label: 'Bord de mer', icon: '\uD83C\uDF0A', desc: 'Embruns sal\u00e9s, humidit\u00e9, UV' },
                { value: 'bureau', label: 'Bureau / int\u00e9rieur', icon: '\uD83D\uDCBB', desc: 'Climatisation, lumi\u00e8re bleue, air sec' }
            ]
        },
        {
            id: 'level',
            icon: '\uD83D\uDCDA',
            titleFr: 'Votre niveau skincare ?',
            descFr: 'Pas de jugement ! On adapte la routine \u00e0 vos habitudes.',
            options: [
                { value: 'debutante', label: 'D\u00e9butant(e)', icon: '\uD83C\uDF1F', desc: 'Je d\u00e9bute, je veux simple et efficace' },
                { value: 'reguliere', label: 'R\u00e9guli\u00e8re', icon: '\uD83D\uDCAA', desc: 'J\u2019ai une routine, je veux l\u2019am\u00e9liorer' },
                { value: 'experte', label: 'Expert(e)', icon: '\uD83D\uDC51', desc: 'Je connais les actifs, je veux le top' }
            ]
        },
        {
            id: 'moment',
            icon: '\u23F0',
            titleFr: 'Quand pratiquez-vous votre routine ?',
            descFr: 'Les actifs ne sont pas les m\u00eames le matin et le soir.',
            options: [
                { value: 'matin', label: 'Le matin', icon: '\u2600\uFE0F', desc: 'Protection, hydratation, bonne mine' },
                { value: 'soir', label: 'Le soir', icon: '\uD83C\uDF19', desc: 'R\u00e9paration, actifs puissants, r\u00e9g\u00e9n\u00e9ration' },
                { value: 'both', label: 'Matin & soir', icon: '\uD83D\uDD04', desc: 'Routine compl\u00e8te, r\u00e9sultats optimaux' }
            ]
        }
    ];

    // ---- PRODUCT STEPS ----
    var PRODUCT_STEPS = [
        {
            id: 'nettoyage',
            icon: '\uD83E\uDDF4',
            titleFr: '1. Nettoyage',
            descFr: '\u00c9liminez impuret\u00e9s et exc\u00e8s de s\u00e9bum. La base indispensable.',
            productIds: [4, 3],
            time: '60 sec',
            tips: {
                grasse: 'Peau grasse : insistez sur la zone T avec le scrubber pour d\u00e9sincruster les pores.',
                seche: 'Peau s\u00e8che : pr\u00e9f\u00e9rez la brosse sonic en mode doux pour ne pas agresser.',
                sensible: 'Peau sensible : vitesse minimale, mouvements tr\u00e8s doux, max 30 secondes.',
                ville: 'En ville : le double nettoyage est essentiel pour \u00e9liminer pollution et particules fines.',
                _default: 'Matin et soir, 60 secondes suffisent. Sur peau humide, mouvements circulaires doux.'
            }
        },
        {
            id: 'preparation',
            icon: '\u2744\uFE0F',
            titleFr: '2. Pr\u00e9paration',
            descFr: 'Ouvrez les pores et pr\u00e9parez la peau \u00e0 absorber les actifs.',
            productIds: [7, 5],
            time: '2 min',
            tips: {
                grasse: 'Le steamer ouvre les pores pour mieux les nettoyer. L\u2019ice roller resserre apr\u00e8s.',
                seche: 'La vapeur hydrate en profondeur. Id\u00e9al avant un s\u00e9rum pour absorption maximale.',
                sensible: 'Pr\u00e9f\u00e9rez l\u2019ice roller : il apaise, d\u00e9gonfle et calme sans irritation.',
                matin: 'Le matin : ice roller 2 min pour d\u00e9gonfler et r\u00e9veiller la peau. Bonne mine garantie.',
                soir: 'Le soir : vapeur 5 min pour ouvrir les pores avant les actifs nocturnes.',
                _default: 'La vapeur am\u00e9liore la p\u00e9n\u00e9tration des s\u00e9rums de 50%. L\u2019ice roller d\u00e9gonfle en 2 min.'
            }
        },
        {
            id: 'serum',
            icon: '\uD83D\uDC8E',
            titleFr: '3. S\u00e9rum & Actifs',
            descFr: 'Le c\u0153ur de votre routine. Les actifs qui font la vraie diff\u00e9rence.',
            productIds: [8, 12],
            time: '30 sec',
            tips: {
                antiage: 'Anti-\u00e2ge : vitamine C 20% + micro-cristaux = combo anti-rides puissant.',
                eclat: '\u00c9clat : le s\u00e9rum vitamine C est l\u2019actif n\u00b01 pour un teint lumineux en 21 jours.',
                acne: 'Imperfections : la vitamine C r\u00e9gule le s\u00e9bum et att\u00e9nue les marques post-acn\u00e9.',
                taches: 'Anti-taches : la vitamine C inhibe la tyrosinase. R\u00e9sultats en 3-4 semaines.',
                '35-50': 'Apr\u00e8s 35 ans : la vitamine C est votre alli\u00e9e anti-oxydante n\u00b01.',
                '50+': '50+ : combinez s\u00e9rum + stickers pour une action anti-rides en profondeur.',
                _default: 'Appliquez du plus l\u00e9ger au plus \u00e9pais, toujours sur peau l\u00e9g\u00e8rement humide.'
            }
        },
        {
            id: 'yeux',
            icon: '\uD83D\uDC41\uFE0F',
            titleFr: '4. Contour des yeux',
            descFr: 'La peau du contour des yeux est 5x plus fine. Soin d\u00e9di\u00e9 essentiel.',
            productIds: [9, 13],
            time: '20 min',
            tips: {
                antiage: 'Les patchs collag\u00e8ne comblent les ridules. 20 min pour un effet repulpant.',
                bureau: 'Fatigue \u00e9cran : les patchs collag\u00e8ne soulagent la fatigue oculaire digitale.',
                '18-25': 'M\u00eame jeune, le contour des yeux est une zone fragile. Pr\u00e9vention = r\u00e9sultat.',
                _default: 'Patchs le matin pour d\u00e9gonfler, masque le soir pour relaxer. D\u00e8s la 1\u00e8re pose.'
            }
        },
        {
            id: 'masque',
            icon: '\u2728',
            titleFr: '5. Masque & Traitement',
            descFr: 'Soins intensifs pour booster les r\u00e9sultats. Votre moment cocooning.',
            productIds: [1, 10],
            time: '15 min',
            tips: {
                antiage: 'LED rouge (630nm) + masque collag\u00e8ne = stimulation collag\u00e8ne x2.',
                acne: 'LED bleue (415nm) tue 99% des bact\u00e9ries P. acnes. 15 min, 3x/semaine.',
                eclat: 'LED verte unifie le teint. Combinez avec le masque pour un glow imm\u00e9diat.',
                experte: 'Pro tip : alternez les longueurs d\u2019onde LED selon vos besoins du jour.',
                _default: '2-3 fois par semaine. Combinez LED + s\u00e9rum pour d\u00e9cupler les effets.'
            }
        },
        {
            id: 'massage',
            icon: '\uD83D\uDC86',
            titleFr: '6. Massage & Sculpting',
            descFr: 'Stimulez la circulation, drainez et sculptez l\u2019ovale naturellement.',
            productIds: [2, 6],
            time: '5 min',
            tips: {
                antiage: 'Le Gua Sha stimule la production de collag\u00e8ne. Le V-Line EMS tonifie.',
                soir: 'Le soir : id\u00e9al pour le massage car la peau se r\u00e9g\u00e9n\u00e8re la nuit.',
                debutante: 'D\u00e9butant : commencez par le Gua Sha, plus intuitif. 5 min = visible.',
                _default: 'Du centre vers l\u2019ext\u00e9rieur, mouvements ascendants. 5 min suffisent.'
            }
        },
        {
            id: 'hydratation',
            icon: '\uD83C\uDF3F',
            titleFr: '7. Hydratation & Protection',
            descFr: 'Scellez tous les actifs et prot\u00e9gez votre barri\u00e8re cutan\u00e9e.',
            productIds: [11],
            time: '30 sec',
            tips: {
                seche: 'Peau s\u00e8che : l\u2019huile de rose musqu\u00e9e est votre alli\u00e9e. Nutrition intense.',
                grasse: 'Peau grasse : 2-3 gouttes suffisent. L\u2019huile r\u00e9gule le s\u00e9bum.',
                matin: 'Le matin : huile l\u00e9g\u00e8re + SPF 30 par-dessus. Protection compl\u00e8te.',
                soir: 'Le soir : huile g\u00e9n\u00e9reuse en derni\u00e8re \u00e9tape. R\u00e9g\u00e9n\u00e9ration nocturne.',
                mer: 'Bord de mer : l\u2019huile restaure la barri\u00e8re cutan\u00e9e apr\u00e8s sel et vent.',
                _default: 'Le soir : huile pure. Le matin : terminez par un SPF 30+.'
            }
        }
    ];

    // ---- State ----
    var phase = 'diagnostic'; // 'diagnostic' | 'routine'
    var currentQuestion = 0;
    var activeProductStep = 0;
    var selectedProducts = {}; // { stepIndex: productId }
    var skinProfile = {}; // { skinType, concern, age, environment, level, moment }

    // ---- Helpers ----
    function getProduct(id) {
        if (typeof PRODUCTS === 'undefined') return null;
        for (var i = 0; i < PRODUCTS.length; i++) {
            if (PRODUCTS[i].id === id) return PRODUCTS[i];
        }
        return null;
    }

    function getImgUrl(url) {
        if (!url) return '';
        if (url.indexOf('/api/') === 0) return url;
        if (typeof imgProxy === 'function') return imgProxy(url);
        return url;
    }

    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + '\u00a0\u20ac';
    }

    function renderStars(rating) {
        var html = '';
        var full = Math.floor(rating);
        for (var i = 0; i < 5; i++) {
            html += (i < full) ? '\u2605' : '\u2606';
        }
        return html;
    }

    function escHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function answeredCount() {
        var n = 0;
        for (var i = 0; i < QUESTIONS.length; i++) {
            if (skinProfile[QUESTIONS[i].id]) n++;
        }
        return n;
    }

    function selectedCount() {
        var n = 0;
        for (var i = 0; i < PRODUCT_STEPS.length; i++) {
            if (selectedProducts.hasOwnProperty(i)) n++;
        }
        return n;
    }

    // Get personalized tip — checks concern, skinType, age, environment, level, moment, then _default
    function getTip(step) {
        if (!step.tips) return '';
        var keys = ['concern', 'skinType', 'age', 'environment', 'level', 'moment'];
        for (var i = 0; i < keys.length; i++) {
            var val = skinProfile[keys[i]];
            if (val && step.tips[val]) return step.tips[val];
        }
        return step.tips._default || '';
    }

    // Generate skin profile summary
    function getProfileSummary() {
        var labels = {
            normale: 'Normale', mixte: 'Mixte', grasse: 'Grasse', seche: 'S\u00e8che', sensible: 'Sensible',
            antiage: 'Anti-\u00e2ge', eclat: '\u00c9clat', acne: 'Anti-imperfections', hydratation: 'Hydratation', taches: 'Anti-taches',
            '18-25': '18-25 ans', '25-35': '25-35 ans', '35-50': '35-50 ans', '50+': '50+ ans',
            ville: 'Urbain', campagne: 'Campagne', mer: 'Bord de mer', bureau: 'Bureau',
            debutante: 'D\u00e9butant(e)', reguliere: 'R\u00e9guli\u00e8re', experte: 'Expert(e)',
            matin: 'Matin', soir: 'Soir', both: 'Matin & soir'
        };
        var parts = [];
        if (skinProfile.skinType) parts.push('Peau ' + (labels[skinProfile.skinType] || skinProfile.skinType).toLowerCase());
        if (skinProfile.concern) parts.push(labels[skinProfile.concern] || skinProfile.concern);
        if (skinProfile.age) parts.push(labels[skinProfile.age] || skinProfile.age);
        return parts.join(' \u2022 ');
    }

    // ============================
    // MAIN RENDER
    // ============================
    function render() {
        var container = document.getElementById('routineBuilder');
        if (!container || typeof PRODUCTS === 'undefined') return;

        if (phase === 'diagnostic') {
            renderDiagnostic(container);
        } else {
            renderRoutine(container);
        }
    }

    // ============================
    // PHASE 1 : DIAGNOSTIC
    // ============================
    function renderDiagnostic(container) {
        var q = QUESTIONS[currentQuestion];
        var answered = answeredCount();
        var pct = Math.round((answered / QUESTIONS.length) * 100);

        var html = '<div class="rb rb-diagnostic">';

        // Progress
        html += '<div class="rb-diag-progress">';
        html += '<div class="rb-diag-progress-bar" style="width:' + pct + '%"></div>';
        html += '<span class="rb-diag-progress-text">Question ' + (currentQuestion + 1) + '/' + QUESTIONS.length + '</span>';
        html += '</div>';

        // Dots navigation
        html += '<div class="rb-diag-dots">';
        for (var d = 0; d < QUESTIONS.length; d++) {
            var dotClass = 'rb-diag-dot';
            if (d === currentQuestion) dotClass += ' rb-diag-dot--active';
            if (skinProfile[QUESTIONS[d].id]) dotClass += ' rb-diag-dot--done';
            html += '<button class="' + dotClass + '" data-action="routine-goto-q" data-q="' + d + '" aria-label="Question ' + (d + 1) + '">';
            if (skinProfile[QUESTIONS[d].id]) html += '\u2713';
            else html += (d + 1);
            html += '</button>';
        }
        html += '</div>';

        // Question card
        html += '<div class="rb-diag-card">';
        html += '<div class="rb-diag-icon">' + q.icon + '</div>';
        html += '<h3 class="rb-diag-title">' + q.titleFr + '</h3>';
        html += '<p class="rb-diag-desc">' + q.descFr + '</p>';

        // Options grid
        var currentAnswer = skinProfile[q.id] || '';
        html += '<div class="rb-question-grid">';
        for (var i = 0; i < q.options.length; i++) {
            var opt = q.options[i];
            var isSel = (currentAnswer === opt.value);
            html += '<button class="rb-option' + (isSel ? ' rb-option--selected' : '') + '" ';
            html += 'data-action="routine-answer" data-question="' + q.id + '" data-value="' + opt.value + '">';
            html += '<span class="rb-option-icon">' + opt.icon + '</span>';
            html += '<span class="rb-option-label">' + opt.label + '</span>';
            html += '<span class="rb-option-desc">' + opt.desc + '</span>';
            if (isSel) html += '<span class="rb-option-check">\u2713</span>';
            html += '</button>';
        }
        html += '</div>';

        html += '</div>'; // .rb-diag-card

        // Navigation
        html += '<div class="rb-diag-nav">';
        if (currentQuestion > 0) {
            html += '<button class="rb-nav-btn" data-action="routine-goto-q" data-q="' + (currentQuestion - 1) + '">\u2190 Pr\u00e9c\u00e9dente</button>';
        } else {
            html += '<span></span>';
        }
        // Show "Voir ma routine" when all answered
        if (answered === QUESTIONS.length) {
            html += '<button class="rb-nav-btn rb-nav-next rb-nav-cta" data-action="routine-start-products">\u2728 Voir ma routine personnalis\u00e9e \u2192</button>';
        } else if (currentQuestion < QUESTIONS.length - 1) {
            html += '<button class="rb-nav-btn rb-nav-next" data-action="routine-goto-q" data-q="' + (currentQuestion + 1) + '">Suivante \u2192</button>';
        } else {
            html += '<span></span>';
        }
        html += '</div>';

        // Skip link
        html += '<div class="rb-diag-skip">';
        html += '<button class="rb-skip-link" data-action="routine-start-products">Passer le diagnostic \u2192</button>';
        html += '</div>';

        html += '</div>'; // .rb
        container.innerHTML = html;
    }

    // ============================
    // PHASE 2 : ROUTINE PRODUITS
    // ============================
    function renderRoutine(container) {
        var selected = selectedCount();
        var totalSteps = QUESTIONS.length + PRODUCT_STEPS.length;
        var completedTotal = answeredCount() + selected;
        var pct = Math.round((completedTotal / totalSteps) * 100);

        var html = '<div class="rb rb-routine">';

        // Profile summary banner
        var summary = getProfileSummary();
        if (summary) {
            html += '<div class="rb-profile-banner">';
            html += '<span class="rb-profile-label">\uD83C\uDFAF Votre profil :</span> ';
            html += '<span class="rb-profile-tags">' + summary + '</span>';
            html += '<button class="rb-profile-edit" data-action="routine-edit-profile">\u270F\uFE0F Modifier</button>';
            html += '</div>';
        }

        // Progress bar
        html += '<div class="rb-progress">';
        html += '<div class="rb-progress-bar" style="width:' + pct + '%"></div>';
        html += '<span class="rb-progress-text">' + selected + '/' + PRODUCT_STEPS.length + ' produits s\u00e9lectionn\u00e9s</span>';
        html += '</div>';

        // Timeline tabs (product steps only)
        html += '<div class="rb-timeline" role="tablist">';
        for (var s = 0; s < PRODUCT_STEPS.length; s++) {
            var step = PRODUCT_STEPS[s];
            var isActive = (s === activeProductStep);
            var isDone = selectedProducts.hasOwnProperty(s);

            html += '<button class="rb-tab' + (isActive ? ' rb-tab--active' : '') + (isDone ? ' rb-tab--done' : '') + '" ';
            html += 'data-action="routine-step" data-step="' + s + '" role="tab" aria-selected="' + isActive + '">';
            html += '<span class="rb-tab-icon">' + step.icon + '</span>';
            html += '<span class="rb-tab-label">' + step.titleFr + '</span>';
            html += '<span class="rb-tab-time">' + step.time + '</span>';
            if (isDone) html += '<span class="rb-tab-check">\u2713</span>';
            html += '</button>';
        }
        html += '</div>';

        // Active product step panel
        var cs = PRODUCT_STEPS[activeProductStep];
        html += '<div class="rb-panel" role="tabpanel">';

        // Step header
        html += '<div class="rb-panel-header">';
        html += '<h3 class="rb-panel-title">' + cs.titleFr + '</h3>';
        html += '<p class="rb-panel-desc">' + cs.descFr + '</p>';
        var tip = getTip(cs);
        if (tip) {
            var isPersonalized = (skinProfile.concern || skinProfile.skinType);
            html += '<span class="rb-panel-tip">' + (isPersonalized ? '\uD83C\uDFAF ' : '\uD83D\uDCA1 ') + tip + '</span>';
        }
        html += '</div>';

        // Products
        html += renderProducts(cs);

        // Step navigation
        html += '<div class="rb-nav">';
        if (activeProductStep > 0) {
            html += '<button class="rb-nav-btn" data-action="routine-step" data-step="' + (activeProductStep - 1) + '">\u2190 \u00c9tape pr\u00e9c\u00e9dente</button>';
        } else {
            html += '<button class="rb-nav-btn" data-action="routine-edit-profile">\u2190 Modifier mon profil</button>';
        }
        if (activeProductStep < PRODUCT_STEPS.length - 1) {
            html += '<button class="rb-nav-btn rb-nav-next" data-action="routine-step" data-step="' + (activeProductStep + 1) + '">\u00c9tape suivante \u2192</button>';
        } else {
            html += '<span></span>';
        }
        html += '</div>';
        html += '</div>'; // .rb-panel

        // Summary bar
        var totalProducts = 0;
        var totalPrice = 0;
        var thumbsHTML = '';
        for (var k = 0; k < PRODUCT_STEPS.length; k++) {
            if (selectedProducts.hasOwnProperty(k)) {
                var sp = getProduct(selectedProducts[k]);
                if (sp) {
                    totalProducts++;
                    totalPrice += sp.price;
                    thumbsHTML += '<div class="rb-summary-thumb"><img src="' + getImgUrl(sp.image) + '" alt="' + escHTML(sp.name) + '" width="44" height="44"></div>';
                }
            }
        }

        html += '<div class="rb-summary' + (totalProducts > 0 ? ' rb-summary--active' : '') + '">';
        if (totalProducts === 0) {
            html += '<div class="rb-summary-empty">';
            html += '<span>\uD83D\uDC46 Choisissez un produit \u00e0 chaque \u00e9tape pour composer votre routine</span>';
            html += '</div>';
        } else {
            html += '<div class="rb-summary-left">';
            html += '<div class="rb-summary-thumbs">' + thumbsHTML + '</div>';
            html += '<div class="rb-summary-info">';
            html += '<span class="rb-summary-count">Ma routine \u2014 ' + totalProducts + ' produit' + (totalProducts > 1 ? 's' : '') + '</span>';
            html += '<span class="rb-summary-total">' + formatPrice(totalPrice) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="rb-summary-right">';
            html += '<button class="btn btn-primary rb-add-all" data-action="routine-add-all">\uD83D\uDED2 Ajouter tout au panier</button>';
            html += '</div>';
        }
        html += '</div>';

        html += '</div>'; // .rb
        container.innerHTML = html;
    }

    // ---- Render products ----
    function renderProducts(step) {
        var html = '<div class="rb-products">';
        for (var p = 0; p < step.productIds.length; p++) {
            var product = getProduct(step.productIds[p]);
            if (!product) continue;
            var isSel = (selectedProducts[activeProductStep] === product.id);
            var imgUrl = getImgUrl(product.image);
            var pName = escHTML(product.name);

            html += '<div class="rb-card' + (isSel ? ' rb-card--selected' : '') + '">';
            html += '<a href="pages/product.html?id=' + product.id + '" class="rb-card-img">';
            html += '<img src="' + imgUrl + '" alt="' + pName + '" width="280" height="280" loading="lazy">';
            if (product.badge === 'best') html += '<span class="rb-card-badge">Best-seller</span>';
            else if (product.badge === 'new') html += '<span class="rb-card-badge rb-card-badge--new">Nouveau</span>';
            else if (product.badge === 'lancement') html += '<span class="rb-card-badge rb-card-badge--launch">Lancement</span>';
            html += '</a>';

            html += '<div class="rb-card-body">';
            html += '<h4 class="rb-card-name">' + pName + '</h4>';
            html += '<div class="rb-card-meta">';
            html += '<span class="rb-card-rating"><span class="rb-stars">' + renderStars(product.rating) + '</span> ' + product.rating + '</span>';
            html += '<span class="rb-card-price">' + formatPrice(product.price) + '</span>';
            html += '</div>';
            if (product.features && product.features[0]) {
                html += '<p class="rb-card-feature">\u2713 ' + escHTML(product.features[0]) + '</p>';
            }
            html += '</div>';

            html += '<div class="rb-card-actions">';
            html += '<button class="rb-select-btn' + (isSel ? ' rb-select-btn--active' : '') + '" data-action="routine-select" data-step="' + activeProductStep + '" data-pid="' + product.id + '">';
            html += isSel ? '\u2713 S\u00e9lectionn\u00e9' : 'Choisir pour ma routine';
            html += '</button>';
            html += '<button class="rb-cart-btn" data-action="add-to-cart" data-pid="' + product.id + '" title="Ajouter au panier">';
            html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>';
            html += '</button>';
            html += '</div>';

            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    // ============================
    // EVENT HANDLERS
    // ============================
    document.addEventListener('click', function(e) {
        var target = e.target.closest('[data-action]');
        if (!target) return;
        var action = target.getAttribute('data-action');

        // Navigate to question
        if (action === 'routine-goto-q') {
            var qIdx = parseInt(target.getAttribute('data-q'), 10);
            if (!isNaN(qIdx) && qIdx >= 0 && qIdx < QUESTIONS.length) {
                phase = 'diagnostic';
                currentQuestion = qIdx;
                render();
                scrollToBuilder();
            }
        }

        // Answer a question
        if (action === 'routine-answer') {
            e.preventDefault();
            var questionId = target.getAttribute('data-question');
            var value = target.getAttribute('data-value');
            if (questionId && value) {
                skinProfile[questionId] = value;
                // Save to localStorage for diagnostic page
                try { localStorage.setItem('eclat_skin_profile', JSON.stringify(skinProfile)); } catch(ex) {}
                render();
                // Auto-advance to next question or show CTA
                setTimeout(function() {
                    if (answeredCount() === QUESTIONS.length) {
                        // All answered — auto transition to routine
                        phase = 'routine';
                        activeProductStep = 0;
                        render();
                        scrollToBuilder();
                    } else if (currentQuestion < QUESTIONS.length - 1) {
                        currentQuestion++;
                        render();
                    }
                }, 450);
            }
        }

        // Start product phase
        if (action === 'routine-start-products') {
            e.preventDefault();
            phase = 'routine';
            activeProductStep = 0;
            render();
            scrollToBuilder();
        }

        // Edit profile (go back to diagnostic)
        if (action === 'routine-edit-profile') {
            e.preventDefault();
            phase = 'diagnostic';
            currentQuestion = 0;
            render();
            scrollToBuilder();
        }

        // Navigate product steps
        if (action === 'routine-step') {
            var stepNum = parseInt(target.getAttribute('data-step'), 10);
            if (!isNaN(stepNum) && stepNum >= 0 && stepNum < PRODUCT_STEPS.length && stepNum !== activeProductStep) {
                activeProductStep = stepNum;
                render();
                scrollToBuilder();
            }
        }

        // Select a product
        if (action === 'routine-select') {
            e.preventDefault();
            e.stopPropagation();
            var stepIdx = parseInt(target.getAttribute('data-step'), 10);
            var pid = parseInt(target.getAttribute('data-pid'), 10);
            if (!isNaN(stepIdx) && !isNaN(pid)) {
                if (selectedProducts[stepIdx] === pid) {
                    delete selectedProducts[stepIdx];
                } else {
                    selectedProducts[stepIdx] = pid;
                }
                render();
                // Auto-advance after selection
                if (selectedProducts.hasOwnProperty(stepIdx) && activeProductStep < PRODUCT_STEPS.length - 1) {
                    setTimeout(function() {
                        activeProductStep = stepIdx + 1;
                        render();
                    }, 600);
                }
            }
        }

        // Add all to cart
        if (action === 'routine-add-all') {
            e.preventDefault();
            var added = 0;
            for (var k = 0; k < PRODUCT_STEPS.length; k++) {
                if (selectedProducts.hasOwnProperty(k) && typeof window.addToCart === 'function') {
                    window.addToCart(selectedProducts[k]);
                    added++;
                }
            }
            if (added > 0 && typeof window.showToast === 'function') {
                window.showToast('\u2728 ' + added + ' produit' + (added > 1 ? 's' : '') + ' ajout\u00e9' + (added > 1 ? 's' : '') + ' au panier !');
            }
        }
    });

    function scrollToBuilder() {
        var section = document.getElementById('routine-composer');
        if (section) {
            var rect = section.getBoundingClientRect();
            if (rect.top < -50 || rect.top > 200) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // ---- Initialize ----
    function init() {
        // Restore saved profile — if complete, skip to routine phase
        try {
            var saved = localStorage.getItem('eclat_skin_profile');
            if (saved) {
                var parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    skinProfile = parsed;
                    // If all questions answered, go straight to routine
                    if (answeredCount() === QUESTIONS.length) {
                        phase = 'routine';
                    }
                }
            }
        } catch(ex) {}

        if (typeof PRODUCTS !== 'undefined' && PRODUCTS.length > 0) {
            render();
        } else {
            var retries = 0;
            var interval = setInterval(function() {
                retries++;
                if (typeof PRODUCTS !== 'undefined' && PRODUCTS.length > 0) {
                    clearInterval(interval);
                    render();
                }
                if (retries > 50) clearInterval(interval);
            }, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.RoutineBuilder = { render: render };
})();
