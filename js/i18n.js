// ============================
// ÉCLAT - Système Multilingue (FR, EN, ES, DE)
// ============================

const TRANSLATIONS = {
    fr: {
        // Nav
        nav_home: 'Accueil',
        nav_products: 'Produits',
        nav_bestsellers: 'Best-sellers',
        nav_reviews: 'Avis',
        nav_story: 'Notre histoire',
        nav_loyalty: 'Avantages',
        nav_guide: 'Guide Beaut\u00e9',
        nav_packs: 'Coffrets',
        nav_guarantees: 'Garanties',
        nav_about: '\u00c0 propos',
        nav_account: 'Mon compte',

        // Hero
        hero_tag: '\u2728 Plus de 500 soins s\u00e9lectionn\u00e9s',
        hero_title: 'Votre beaut\u00e9,',
        hero_title_em: 'sublim\u00e9e par la science.',
        hero_desc: 'Technologies professionnelles et soins premium s\u00e9lectionn\u00e9s pour leur efficacit\u00e9 prouv\u00e9e. Livraison suivie, retours gratuits 30j.',
        hero_cta1: '\uD83D\uDD2C Trouver ma routine',
        hero_cta2: '\u2728 Composer ma routine',
        hero_stat1: '500+',
        hero_stat2: '4.8',
        hero_stat3: '30j',
        brands_bar_title: 'Ils nous font confiance — Nos marques partenaires',

        // Trust
        trust1_title: 'Livraison suivie',
        trust1_desc: '7-14 jours ouvrés en Europe',
        trust2_title: 'Paiement sécurisé',
        trust2_desc: 'Stripe • CB • PayPal',
        trust3_title: 'Retours gratuits',
        trust3_desc: '30 jours pour changer d\'avis',
        trust4_title: 'Éco-responsable',
        trust4_desc: 'Emballages recyclés',

        // Products
        section_products_tag: 'Notre sélection',
        section_products_title: 'Produits tendance',
        section_products_desc: 'Chaque produit est sélectionné pour son efficacité prouvée et sa qualité premium.',
        filter_all: 'Tous',
        filter_face: 'Visage',
        filter_care: 'Sérums & Soins',
        filter_body: 'Corps',
        filter_hair: 'Cheveux',
        filter_nails: 'Ongles',
        filter_men: 'Homme',
        filter_tools: 'Outils',
        filter_aroma: 'Bien-être',
        filter_accessories: 'Accessoires',
        filter_brands: 'Grandes Marques',
        filter_perfumes: 'Parfums',
        btn_add_cart: 'Ajouter au panier',
        btn_quick_view: 'Aperçu rapide',
        badge_new: 'Nouveau',
        badge_promo: 'Promo',
        badge_lancement: 'Prix de lancement',
        badge_bestseller: 'Best-seller',
        reviews_count: 'avis',
        btn_add_short: '+ Ajouter',
        load_more: 'Voir plus',
        toast_added: '{name} ajouté au panier !',
        newsletter_success: 'Merci ! Votre code promo -10% : BIENVENUE10',
        newsletter_error: 'Une erreur est survenue. Veuillez réessayer.',

        // Bestsellers
        section_best_tag: 'Les plus aimés',
        section_best_title: 'Nos best-sellers',

        // Garanties
        section_reviews_tag: 'Nos garanties',
        section_reviews_title: 'Des engagements concrets',
        section_reviews_desc: 'Pas de promesses en l\'air \u2014 des garanties v\u00e9rifiables.',

        // Newsletter
        newsletter_title: '-10% sur votre première commande',
        newsletter_desc: 'Inscrivez-vous à notre newsletter et recevez nos conseils beauté + un code promo exclusif.',
        newsletter_btn: 'S\'inscrire',
        newsletter_placeholder: 'Votre adresse email',

        // Cart
        cart_title: 'Votre panier',
        cart_empty: 'Votre panier est vide',
        cart_discover: 'Découvrir nos produits',
        cart_subtotal: 'Sous-total',
        cart_shipping: 'Livraison',
        cart_checkout: 'Commander',
        cart_secure: 'Paiement 100% sécurisé',
        cart_free_shipping: 'Gratuite',
        cart_shipping_remaining: 'Plus que {amount} pour la livraison gratuite',
        cart_cross_sell: 'Complétez votre routine',

        // Banner
        banner_text: 'Livraison offerte dès 29€ • Satisfait ou remboursé 30j • Paiement sécurisé',

        // Footer
        footer_shop: 'Boutique',
        footer_help: 'Service Client',
        footer_resources: 'Ressources',
        footer_legal: 'Légal',
        footer_rights: '© 2026 ÉCLAT. Tous droits réservés.',

        // Cookie
        cookie_text: 'Ce site utilise uniquement des cookies fonctionnels (panier, préférences). Aucun cookie publicitaire.',
        cookie_accept: 'Accepter',
        cookie_refuse: 'Refuser',

        // Shipping countries
        ship_worldwide: 'Livraison internationale disponible',

        // Checkout
        checkout_title: 'Finaliser ma commande',
        checkout_secure_nav: 'Paiement sécurisé',
        checkout_summary: 'Récapitulatif',
        checkout_subtotal: 'Sous-total',
        checkout_shipping: 'Livraison',
        checkout_total: 'Total',
        checkout_free: 'Gratuite',
        checkout_info: 'Informations de livraison',
        checkout_firstname: 'Prénom',
        checkout_lastname: 'Nom',
        checkout_email: 'Email',
        checkout_phone: 'Téléphone',
        checkout_address: 'Adresse',
        checkout_zip: 'Code postal',
        checkout_city: 'Ville',
        checkout_country: 'Pays',
        checkout_shipping_method: 'Mode de livraison',
        checkout_relay: 'Livraison standard - Gratuite',
        checkout_relay_desc: '7-14 jours ouvrés (livraison suivie)',
        checkout_home: 'Domicile - 3,90\u20ac',
        checkout_home_desc: '7-14 jours ouvrés (livraison suivie)',
        checkout_express: 'Livraison express - 7,90\u20ac',
        checkout_express_desc: '5-10 jours ouvrés (expédition prioritaire)',
        checkout_pay: 'Payer maintenant',
        checkout_secure: 'Paiement 100% sécurisé par Stripe. Vos données bancaires ne sont jamais stockées sur nos serveurs.',
        checkout_back: 'Retour à la boutique',
        checkout_empty: 'Votre panier est vide.',
        checkout_redirect: 'Redirection vers le paiement...',
        checkout_error: 'Erreur lors de la création du paiement',
        checkout_error_prefix: 'Erreur',
        checkout_error_stripe: 'Vérifiez que Stripe est bien configuré.',

        // Success
        success_title: 'Merci pour votre commande !',
        success_subtitle: 'Votre paiement a été accepté. Vous allez recevoir un email de confirmation avec le détail de votre commande et votre numéro de suivi.',
        success_next_steps: 'Prochaines étapes',
        success_step1_title: 'Confirmation par email',
        success_step1_desc: 'Vous recevrez un récapitulatif dans les minutes qui suivent',
        success_step2_title: 'Préparation',
        success_step2_desc: 'Votre commande est préparée et expédiée sous 1-3 jours ouvrés',
        success_step3_title: 'Livraison',
        success_step3_desc: 'Suivi par email et SMS dès l\'expédition',
        success_back: 'Retour à la boutique',
        success_contact: 'Un problème ? Contactez-nous à',

        // Bundles
        bundle_section_title: 'Économisez avec nos coffrets',
        bundle_eclat_name: 'Routine Éclat',
        bundle_antiage_name: 'Routine Anti-Âge',
        bundle_glow_name: 'Routine Glow',
        bundle_eclat_products: 'Ice Roller Cryo + Sérum Vitamine C 20% + Gua Sha Quartz Rose',
        bundle_antiage_products: 'Masque LED Pro 7 Couleurs + Sérum Vitamine C 20% + Masque Collagène Lifting',
        bundle_glow_products: 'Sérum Vitamine C 20% + Huile Rose Musquée + Patchs Yeux Collagène',
        bundle_save: 'Économisez',
        bundle_free_shipping: 'Livraison offerte',
        bundle_add: 'Ajouter au panier',
        bundle_match_text: 'Ces produits forment un coffret !',
        bundle_converted_toast: 'Coffret appliqué !',
        bundle_added_toast: 'Coffret ajouté au panier !',
        bundle_prefix: 'Coffret',

        // Trust badges
        trust_shipping: '\ud83d\ude9a Livraison offerte d\u00e8s 29\u20ac',
        trust_refund: '\ud83d\udd04 30j rembours\u00e9',
        trust_modal_shipping: 'Livraison offerte d\u00e8s 29\u20ac',
        trust_modal_refund: 'Satisfait ou rembours\u00e9 30j',
        trust_modal_secure: 'Paiement s\u00e9curis\u00e9',
        popup_code_toast: 'Code BIENVENUE10 activ\u00e9 ! V\u00e9rifiez votre email.',
        btn_details: 'D\u00e9tails',
        btn_full_details: 'Voir la fiche compl\u00e8te',

        // Categories section
        cat_section_tag: 'Explorer',
        cat_section_title: 'Nos univers beaut\u00e9',
        cat_visage: 'Soins visage',
        cat_visage_desc: 'S\u00e9rums, masques, nettoyants',
        cat_cheveux: 'Cheveux',
        cat_cheveux_desc: 'Brosses, s\u00e9rums, accessoires',
        cat_corps: 'Corps & Bien-\u00eatre',
        cat_corps_desc: 'Gommages, huiles, massage',
        cat_homme: 'Homme',
        cat_homme_desc: 'Grooming, barbe, skincare',
        cat_ongles: 'Ongles',
        cat_outils: 'Outils beaut\u00e9',
        cat_bienetre: 'Bien-\u00eatre',
        cat_accessoires: 'Accessoires',

        // AI section
        ai_section_tag: '\u2728 Intelligence Beaut\u00e9',
        ai_section_title: 'S\u00e9lectionn\u00e9 pour vous',
        ai_section_desc: 'Nos recommandations personnalis\u00e9es par notre IA beaut\u00e9.',
        ai_section_link: 'Faire mon diagnostic \u2192',

        // Diagnostic CTA
        diag_cta_title: 'D\u00e9couvrez votre routine id\u00e9ale',
        diag_cta_desc: 'R\u00e9pondez \u00e0 4 questions en 2 minutes. Notre IA cr\u00e9e une routine personnalis\u00e9e pour votre type de peau.',
        diag_cta_btn: 'Trouver ma routine \u2192',
        diag_routine_btn: '\u2728 Trouver ma routine id\u00e9ale \u2192',

        // Bestsellers
        section_best_desc: 'Une s\u00e9lection de produits que nous recommandons. Les best-sellers appara\u00eetront ici automatiquement d\u00e8s les premi\u00e8res commandes.',

        // Routine composer
        routine_tag: '\u2728 Composez votre routine',
        routine_title: 'Votre routine personnalis\u00e9e sur mesure',
        routine_desc: 'R\u00e9pondez \u00e0 quelques questions, puis choisissez vos produits \u00e0 chaque \u00e9tape. L\u2019IA personnalise les conseils selon votre profil.',
        routine_step1: '1. Nettoyage',
        routine_step1_desc: 'Brosses soniques, scrubbers, vapeur',
        routine_step2: '2. Soin cibl\u00e9',
        routine_step2_desc: 'S\u00e9rums, patchs, masques actifs',
        routine_step3: '3. Outils beaut\u00e9',
        routine_step3_desc: 'LED, Gua Sha, rollers, EMS',
        routine_step4: '4. Hydratation',
        routine_step4_desc: 'Huiles, cr\u00e8mes, brumes',
        routine_subtext: '2 minutes, 4 questions. L\'IA cr\u00e9e votre routine sur mesure.',

        // Unique section
        unique_tag: 'Ce qui nous rend uniques',
        unique_title: 'Ce qu\'aucun autre site ne fait',
        unique_ai_title: 'IA personnalis\u00e9e',
        unique_ai_desc: 'Diagnostic peau, recommandations, explication de chaque ingr\u00e9dient par l\'IA',
        unique_cbs_title: 'Clean Beauty Score',
        unique_cbs_desc: 'Chaque composition INCI analys\u00e9e. Score de s\u00e9curit\u00e9 transparent.',
        unique_loyalty_title: 'Fid\u00e9lit\u00e9 gamifi\u00e9e',
        unique_loyalty_desc: '4 tiers, coffre du jour, d\u00e9fis, badges. Pas un simple programme \u00e0 points.',
        unique_trans_title: 'Transparence totale',
        unique_trans_desc: 'Prix justes, d\u00e9lais r\u00e9els (7-14j), z\u00e9ro faux avis, z\u00e9ro marketing trompeur.',

        // Chatbot upgrade
        chat_upgrade_title: 'Passez en mode IA',
        chat_upgrade_text: 'Atteignez 200 \u00c9clats pour d\u00e9bloquer votre conseill\u00e8re beaut\u00e9 IA personnelle.',
        chat_upgrade_count: 'Vous avez',
        chat_upgrade_eclats: '\u00c9clats.',

        // Loyalty bar
        loyalty_bar_remaining: 'Encore',
        loyalty_bar_unlock: 'd\u00e9bloquez :',
        loyalty_bar_eclats: '\u00c9clats',
        loyalty_bar_fomo: 'Vos \u00c9clats valent double aujourd\'hui !',
        loyalty_bar_fomo_expire: 'Expire dans',
        loyalty_bar_fomo_cta: 'En profiter \u2192',

        // Floating CTA
        floating_cta: '\u2728 Mon diagnostic gratuit',

        // Footer
        footer_tagline: 'Beaut\u00e9 & Wellness Premium',
        footer_description: 'Des soins s\u00e9lectionn\u00e9s pour leur efficacit\u00e9 prouv\u00e9e. Programme fid\u00e9lit\u00e9 \u00c9clats, livraison suivie, satisfait ou rembours\u00e9.',
        footer_diag_link: 'Mon diagnostic beaut\u00e9 gratuit \u2192',
        footer_pay_label: 'Paiement 100% s\u00e9curis\u00e9',
        footer_trust_ssl: 'Paiement<br>s\u00e9curis\u00e9 SSL',
        footer_trust_ship: 'Livraison<br>suivie France',
        footer_trust_refund: 'Satisfait ou<br>rembours\u00e9 30j',
        footer_trust_support: 'Support client<br>7j/7',
        footer_trust_eu: 'Conforme<br>r\u00e9glementation UE',

        // Footer links
        fl_all: 'Tous les produits',
        fl_best: 'Best-sellers',
        fl_face: 'Soins visage',
        fl_body: 'Soins corps',
        fl_sets: 'Coffrets',
        fl_ship: 'Livraison',
        fl_returns: 'Retours',
        fl_track: 'Suivi de commande',
        fl_support: 'Support & Tickets',
        fl_blog: 'Blog Beaut\u00e9',
        fl_guide: 'Guide Scientifique',
        fl_diag: 'Diagnostic IA',
        fl_routine: 'Routine Builder',
        fl_cgv: 'CGV',
        fl_legal: 'Mentions l\u00e9gales',
        fl_privacy: 'Confidentialit\u00e9',
        fl_retract: 'Droit de r\u00e9tractation',
        fl_cookies: 'G\u00e9rer les cookies',

        // Hero perks
        hero_perk_ship: '\uD83D\uDE9A Livraison offerte d\u00e8s 29\u20ac',
        hero_perk_return: '\uD83D\uDD04 Retours 30j',
        hero_perk_diag: '\u2728 Diagnostic personnalis\u00e9',

        // Trust bar
        tb_ship: '\uD83D\uDE9A Livraison suivie 7-14j',
        tb_pay: '\uD83D\uDD12 Paiement Stripe s\u00e9curis\u00e9',
        tb_return: '\u21BA Retours 30 jours',
        tb_diag: '\u2728 Diagnostic personnalis\u00e9',
        tb_eu: '\uD83C\uddEB\uD83C\udDF7 Entreprise fran\u00e7aise',

        // Account page - Personalization
        acc_title: 'Mon compte',
        acc_tab_overview: 'Tableau de bord',
        acc_tab_profile: 'Mon profil',
        acc_tab_preferences: 'Mes pr\u00e9f\u00e9rences',
        acc_tab_orders: 'Mes commandes',
        acc_tab_loyalty: 'Mes \u00c9clats',
        acc_tab_referral: 'Parrainage',
        acc_tab_privacy: 'Mes donn\u00e9es (RGPD)',
        acc_tab_display: 'Affichage',
        acc_logout: 'D\u00e9connexion',

        // Dashboard
        acc_welcome: 'Bonjour',
        acc_member_since: 'Membre depuis',
        acc_days: 'jours',
        acc_stat_eclats: '\u00c9clats',
        acc_stat_orders: 'Commandes',
        acc_stat_spent: 'D\u00e9pens\u00e9',
        acc_stat_streak: 'Streak',
        acc_stat_member: 'Anciennet\u00e9',
        acc_next_tier: 'Palier suivant',
        acc_next_tier_in: 'dans',
        acc_tier_max: 'Palier maximum atteint !',

        // Profile
        acc_my_info: 'Mes informations',
        acc_firstname: 'Pr\u00e9nom',
        acc_lastname: 'Nom',
        acc_email: 'Email',
        acc_phone: 'T\u00e9l\u00e9phone',
        acc_save: 'Enregistrer',
        acc_change_pwd: 'Changer le mot de passe',
        acc_pwd_desc: 'Un email de r\u00e9initialisation sera envoy\u00e9 \u00e0 votre adresse.',
        acc_pwd_btn: 'Envoyer le lien',

        // Preferences
        acc_prefs_title: 'Mes pr\u00e9f\u00e9rences beaut\u00e9',
        acc_prefs_desc: 'Personnalisez votre exp\u00e9rience pour recevoir des recommandations adapt\u00e9es.',
        acc_skin_type: 'Type de peau',
        acc_skin_normal: 'Normale',
        acc_skin_dry: 'S\u00e8che',
        acc_skin_oily: 'Grasse',
        acc_skin_combination: 'Mixte',
        acc_skin_sensitive: 'Sensible',
        acc_concern: 'Pr\u00e9occupation principale',
        acc_concern_acne: 'Acn\u00e9',
        acc_concern_aging: 'Anti-\u00e2ge',
        acc_concern_hydration: 'Hydratation',
        acc_concern_radiance: '\u00c9clat',
        acc_concern_dark_spots: 'Taches',
        acc_age_range: 'Tranche d\'\u00e2ge',
        acc_gender_pref: 'Produits pour',
        acc_gender_all: 'Tous',
        acc_gender_femme: 'Femme',
        acc_gender_homme: 'Homme',
        acc_categories: 'Cat\u00e9gories pr\u00e9f\u00e9r\u00e9es',
        acc_cat_visage: 'Visage',
        acc_cat_corps: 'Corps',
        acc_cat_cheveux: 'Cheveux',
        acc_cat_ongles: 'Ongles',
        acc_cat_outils: 'Outils',
        acc_cat_bienetre: 'Bien-\u00eatre',
        acc_newsletter_prefs: 'Pr\u00e9f\u00e9rences newsletter',
        acc_nl_new_products: 'Nouveaut\u00e9s',
        acc_nl_promotions: 'Promotions',
        acc_nl_beauty_tips: 'Conseils beaut\u00e9',
        acc_nl_loyalty: 'Fid\u00e9lit\u00e9 & r\u00e9compenses',
        acc_prefs_saved: 'Pr\u00e9f\u00e9rences enregistr\u00e9es !',

        // Display settings
        acc_display_title: 'Affichage & personnalisation',
        acc_theme: 'Th\u00e8me visuel',
        acc_theme_eclat: '\u00c9clat',
        acc_theme_nuit: 'Nuit',
        acc_theme_rose: 'Ros\u00e9',
        acc_theme_nature: 'Nature',
        acc_theme_auto: 'Auto',
        acc_language: 'Langue',
        acc_density: 'Densit\u00e9 d\'affichage',
        acc_density_compact: 'Compact',
        acc_density_normal: 'Normal',
        acc_density_spacious: 'A\u00e9r\u00e9',

        // Orders
        acc_orders_title: 'Mes commandes',
        acc_orders_none: 'Aucune commande pour le moment.',
        acc_orders_track: 'Suivre le colis',

        // Referral
        acc_referral_title: 'Parrainage',
        acc_referral_desc: 'Partagez votre code. Votre filleul re\u00e7oit 50 \u00c9clats de bienvenue, et vous gagnez 100 \u00c9clats !',
        acc_referral_copy: 'Copier le code',
        acc_referral_copied: 'Copi\u00e9 !',

        // RGPD
        acc_privacy_title: 'Mes donn\u00e9es personnelles',
        acc_privacy_desc: 'Conform\u00e9ment au RGPD et \u00e0 la loi Informatique et Libert\u00e9s, vous disposez d\'un droit d\'acc\u00e8s, de rectification, de suppression et de portabilit\u00e9 de vos donn\u00e9es.',
        acc_export_title: 'Exporter mes donn\u00e9es',
        acc_export_desc: 'T\u00e9l\u00e9chargez un fichier contenant toutes vos donn\u00e9es personnelles.',
        acc_export_btn: 'T\u00e9l\u00e9charger mes donn\u00e9es',
        acc_delete_title: 'Supprimer mon compte',
        acc_delete_desc: 'Vos donn\u00e9es seront supprim\u00e9es. Les donn\u00e9es de facturation sont conserv\u00e9es 10 ans (obligation l\u00e9gale).',
        acc_delete_warn: 'Cette action est irr\u00e9versible.',
        acc_delete_btn: 'Supprimer mes donn\u00e9es'
    }
};

// Lazy-loaded translations for non-French languages
// Loaded on demand via loadLanguage() below
const _LAZY_LANGS = ['en', 'es', 'de'];
const _LOADED_LANGS = { fr: true };

function _getLangFileUrl(lang) {
    // Determine base path relative to current page
    var scripts = document.querySelectorAll('script[src*="i18n.js"]');
    var basePath = 'js/';
    if (scripts.length) {
        var src = scripts[0].getAttribute('src');
        basePath = src.substring(0, src.lastIndexOf('/') + 1);
    }
    return basePath + 'i18n-' + lang + '.js';
}

function loadLanguage(lang, callback) {
    if (_LOADED_LANGS[lang] || _LAZY_LANGS.indexOf(lang) === -1) {
        if (callback) callback();
        return;
    }
    // Check if already loaded via global
    var globalKey = 'ECLAT_I18N_' + lang.toUpperCase();
    if (window[globalKey]) {
        TRANSLATIONS[lang] = window[globalKey];
        _LOADED_LANGS[lang] = true;
        if (callback) callback();
        return;
    }
    // Load the script
    var script = document.createElement('script');
    script.src = _getLangFileUrl(lang);
    script.onload = function() {
        if (window[globalKey]) {
            TRANSLATIONS[lang] = window[globalKey];
            _LOADED_LANGS[lang] = true;
        }
        if (callback) callback();
    };
    script.onerror = function() {
        console.error('[i18n] Failed to load translations for: ' + lang);
        if (callback) callback();
    };
    document.head.appendChild(script);
}

// Current language
let currentLang = localStorage.getItem('eclat_lang') || navigator.language?.slice(0, 2) || 'fr';
if (!['fr', 'en', 'es', 'de'].includes(currentLang)) currentLang = 'fr';

// Expose globally for other modules
window.currentLang = currentLang;

function t(key) {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['fr'][key] || key;
}

function setLanguage(lang) {
    if (['fr', 'en', 'es', 'de'].indexOf(lang) === -1) return;
    currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem('eclat_lang', lang);
    // If translations not yet loaded, load them first
    if (!TRANSLATIONS[lang]) {
        loadLanguage(lang, function() {
            applyTranslations();
        });
    } else {
        applyTranslations();
    }
}

function applyTranslations() {
    // Traduction directe par sélecteur CSS — pas besoin de data-i18n
    const map = {
        // Top banner
        '.top-banner p': 'banner_text',

        // Nav links (4 items: Produits, Coffrets, Garanties, Guide)
        '.nav-links li:nth-child(1) a': 'nav_products',
        '.nav-links li:nth-child(2) a': 'nav_packs',
        '.nav-links li:nth-child(3) a': 'nav_guarantees',
        '.nav-links li:nth-child(4) a': 'nav_guide',
        '.nav-links li:nth-child(5) a': 'nav_about',
        '.nav-links li:nth-child(6) a': 'nav_account',

        // Hero — TOUT
        '.hero-tag': 'hero_tag',
        '.hero-content > p': 'hero_desc',
        '.hero-buttons .btn-primary': 'hero_cta1',
        '.hero-buttons .btn-outline': 'hero_cta2',
        // Brands bar
        '.brands-bar-title': 'brands_bar_title',

        // Trust badges
        '.badge-grid .badge-item:nth-child(1) h4': 'trust1_title',
        '.badge-grid .badge-item:nth-child(1) p': 'trust1_desc',
        '.badge-grid .badge-item:nth-child(2) h4': 'trust2_title',
        '.badge-grid .badge-item:nth-child(2) p': 'trust2_desc',
        '.badge-grid .badge-item:nth-child(3) h4': 'trust3_title',
        '.badge-grid .badge-item:nth-child(3) p': 'trust3_desc',
        '.badge-grid .badge-item:nth-child(4) h4': 'trust4_title',
        '.badge-grid .badge-item:nth-child(4) p': 'trust4_desc',

        // Products section
        '.products-section .section-tag': 'section_products_tag',
        '.products-section .section-header h2': 'section_products_title',
        '.products-section .section-header p': 'section_products_desc',

        // Filters
        '.filter-btn[data-category="all"]': 'filter_all',
        '.filter-btn[data-category="visage"]': 'filter_face',
        '.filter-btn[data-category="soin"]': 'filter_care',
        '.filter-btn[data-category="corps"]': 'filter_body',
        '.filter-btn[data-category="cheveux"]': 'filter_hair',
        '.filter-btn[data-category="ongles"]': 'filter_nails',
        '.filter-btn[data-category="homme"]': 'filter_men',
        '.filter-btn[data-category="outils"]': 'filter_tools',
        '.filter-btn[data-category="aromatherapie"]': 'filter_aroma',
        '.filter-btn[data-category="accessoire"]': 'filter_accessories',
        '.filter-btn[data-category="marques"]': 'filter_brands',
        '.filter-btn[data-category="parfums"]': 'filter_perfumes',

        // Categories section
        '#catSectionTag': 'cat_section_tag',
        '#catSectionTitle': 'cat_section_title',
        '[data-cat-name="visage"]': 'cat_visage',
        '[data-cat-desc="visage"]': 'cat_visage_desc',
        '[data-cat-name="cheveux"]': 'cat_cheveux',
        '[data-cat-desc="cheveux"]': 'cat_cheveux_desc',
        '[data-cat-name="corps"]': 'cat_corps',
        '[data-cat-desc="corps"]': 'cat_corps_desc',
        '[data-cat-name="homme"]': 'cat_homme',
        '[data-cat-desc="homme"]': 'cat_homme_desc',
        '[data-cat-label="ongles"]': 'cat_ongles',
        '[data-cat-label="outils"]': 'cat_outils',
        '[data-cat-label="bienetre"]': 'cat_bienetre',
        '[data-cat-label="accessoires"]': 'cat_accessoires',

        // AI personalization section
        '.ai-personalization .section-tag': 'ai_section_tag',
        '.ai-personalization .section-header h2': 'ai_section_title',
        '#aiSectionDesc': 'ai_section_desc',
        '#aiSectionLink': 'ai_section_link',

        // Diagnostic CTA
        '#diagCTATitle': 'diag_cta_title',
        '#diagCTADesc': 'diag_cta_desc',
        '#diagCTABtn': 'diag_cta_btn',
        '#routineDiagBtn': 'diag_routine_btn',

        // Routine composer
        '#routineTag': 'routine_tag',
        '#routineTitle': 'routine_title',
        '#routineDesc': 'routine_desc',
        // Old routine step IDs removed — steps are now rendered dynamically by routine-builder.js
        '#routineSubtext': 'routine_subtext',

        // Unique section
        '#uniqueTag': 'unique_tag',
        '#uniqueTitle': 'unique_title',
        '#uniqueAiTitle': 'unique_ai_title',
        '#uniqueAiDesc': 'unique_ai_desc',
        '#uniqueCbsTitle': 'unique_cbs_title',
        '#uniqueCbsDesc': 'unique_cbs_desc',
        '#uniqueLoyaltyTitle': 'unique_loyalty_title',
        '#uniqueLoyaltyDesc': 'unique_loyalty_desc',
        '#uniqueTransTitle': 'unique_trans_title',
        '#uniqueTransDesc': 'unique_trans_desc',

        // Bestsellers
        '.bestsellers-section .section-tag': 'section_best_tag',
        '.bestsellers-section .section-header h2': 'section_best_title',
        '#bestsellerDesc': 'section_best_desc',

        // Reviews
        '.reviews-section .section-tag': 'section_reviews_tag',
        '.reviews-section .section-header h2': 'section_reviews_title',
        '.reviews-section .section-header p': 'section_reviews_desc',

        // Newsletter
        '.newsletter-box h2': 'newsletter_title',
        '.newsletter-box p': 'newsletter_desc',
        '.newsletter-form .btn-primary': 'newsletter_btn',

        // Cart sidebar
        '.cart-header h3': 'cart_title',
        '.cart-empty p': 'cart_empty',
        '.cart-empty .btn': 'cart_discover',
        '#checkoutBtn': 'cart_checkout',
        '.cart-secure': 'cart_secure',

        // Cookie
        '.cookie-content > p': 'cookie_text',
        '#cookieAccept': 'cookie_accept',
        '#cookieRefuse': 'cookie_refuse',

        // Footer
        '.footer-grid .footer-col:nth-child(2) h4': 'footer_shop',
        '.footer-grid .footer-col:nth-child(3) h4': 'footer_help',
        '.footer-grid .footer-col:nth-child(4) h4': 'footer_resources',
        '.footer-grid .footer-col:nth-child(5) h4': 'footer_legal',
        '.footer-bottom p': 'footer_rights',
        '#footerTagline': 'footer_tagline',
        '#footerDesc': 'footer_description',
        '#footerDiagLink': 'footer_diag_link',
        '#footerPayLabel': 'footer_pay_label',

        // Footer links
        '#fl_all': 'fl_all',
        '#fl_best': 'fl_best',
        '#fl_face': 'fl_face',
        '#fl_body': 'fl_body',
        '#fl_sets': 'fl_sets',
        '#fl_ship': 'fl_ship',
        '#fl_returns': 'fl_returns',
        '#fl_track': 'fl_track',
        '#fl_support': 'fl_support',
        '#fl_blog': 'fl_blog',
        '#fl_guide': 'fl_guide',
        '#fl_diag': 'fl_diag',
        '#fl_routine': 'fl_routine',
        '#fl_cgv': 'fl_cgv',
        '#fl_legal': 'fl_legal',
        '#fl_privacy': 'fl_privacy',
        '#fl_retract': 'fl_retract',
        '#cookieFooterLink': 'fl_cookies',

        // Hero perks
        '#heroPerkShip': 'hero_perk_ship',
        '#heroPerkReturn': 'hero_perk_return',
        '#heroPerkDiag': 'hero_perk_diag',

        // Trust bar
        '#tbShip': 'tb_ship',
        '#tbPay': 'tb_pay',
        '#tbReturn': 'tb_return',
        '#tbDiag': 'tb_diag',
        '#tbEu': 'tb_eu'
    };

    // innerHTML-based translations (trust badges have <br>)
    var htmlMap = {
        '#trustSsl': 'footer_trust_ssl',
        '#trustShip': 'footer_trust_ship',
        '#trustRefund': 'footer_trust_refund',
        '#trustSupport': 'footer_trust_support',
        '#trustEu': 'footer_trust_eu'
    };
    Object.entries(htmlMap).forEach(function(entry) {
        var el = document.querySelector(entry[0]);
        if (el) { var val = t(entry[1]); if (val) el.innerHTML = val; }
    });

    Object.entries(map).forEach(([selector, key]) => {
        const el = document.querySelector(selector);
        if (el) {
            const val = t(key);
            if (val) el.textContent = val;
        }
    });

    // Placeholder input
    const nlInput = document.querySelector('.newsletter-form input[type="email"]');
    if (nlInput) nlInput.placeholder = t('newsletter_placeholder');

    // Hero title (h1 with em child) — structure complexe
    const heroH1 = document.querySelector('.hero-content h1');
    if (heroH1) {
        const emEl = heroH1.querySelector('em');
        // Rebuild h1: "Title<br><em>Subtitle</em>"
        heroH1.innerHTML = t('hero_title') + '<br><em>' + t('hero_title_em') + '</em>';
    }

    // Hero stats — new format: stat-number + label span
    const stats = document.querySelectorAll('.hero-stats .stat:not(.live-stat)');
    const statKeys = ['hero_stat1', 'hero_stat2', 'hero_stat3'];
    const statLabels = {
        fr: ['Produits premium', 'Note moyenne', 'Satisfait ou rembours\u00e9'],
        en: ['Premium products', 'Average rating', 'Satisfied or refunded'],
        es: ['Productos premium', 'Nota media', 'Satisfecho o reembolsado'],
        de: ['Premium-Produkte', 'Durchschnittsbewertung', 'Zufrieden oder Geld zur\u00fcck']
    };
    var labels = statLabels[currentLang] || statLabels.fr;
    stats.forEach((stat, i) => {
        if (statKeys[i]) {
            var numEl = stat.querySelector('.stat-number');
            if (numEl) numEl.textContent = t(statKeys[i]);
            // Update label span (last child text node)
            var spans = stat.querySelectorAll('span');
            if (spans.length > 1) spans[spans.length - 1].textContent = labels[i];
            else if (spans.length === 1 && !numEl) spans[0].textContent = t(statKeys[i]);
        }
    });

    // Update HTML lang
    document.documentElement.lang = currentLang;

    // Re-render product buttons with translated text
    document.querySelectorAll('.product-actions .btn-primary').forEach(btn => {
        if (btn.onclick) btn.textContent = t('btn_add_cart');
    });
    document.querySelectorAll('.product-quick-view').forEach(btn => {
        btn.textContent = t('btn_quick_view');
    });

    // Product badges
    document.querySelectorAll('.product-badge').forEach(badge => {
        if (badge.classList.contains('badge-best') || badge.classList.contains('badge-bestseller')) badge.textContent = t('badge_bestseller');
        else if (badge.classList.contains('badge-new')) badge.textContent = t('badge_new');
        else if (badge.classList.contains('badge-promo')) badge.textContent = t('badge_promo');
        else if (badge.classList.contains('badge-lancement')) badge.textContent = t('badge_lancement');
    });

    // Trust badges on product cards
    document.querySelectorAll('.trust-tag.shipping').forEach(el => { el.textContent = t('trust_shipping'); });
    document.querySelectorAll('.trust-tag:not(.shipping)').forEach(el => { el.textContent = t('trust_refund'); });

    // Review count labels — "(3 247 avis)" → "(3 247 reviews)"
    document.querySelectorAll('.product-rating .count').forEach(el => {
        const match = el.textContent.match(/\(([\d\s.,]+)\s/);
        if (match) el.textContent = `(${match[1]} ${t('reviews_count')})`;
    });

    // Translate product names & descriptions if products-i18n.js is loaded
    if (typeof translateProducts === 'function') translateProducts();

    // Translate bundles section
    const bundleTitle = document.querySelector('.bundles-section h2');
    if (bundleTitle) bundleTitle.textContent = t('bundle_section_title');
    const bundleKeys = ['eclat', 'antiage', 'glow'];
    document.querySelectorAll('.bundle-card').forEach((card, i) => {
        if (!bundleKeys[i]) return;
        const key = bundleKeys[i];
        const nameEl = card.querySelector('.bundle-name');
        if (nameEl) nameEl.textContent = t('bundle_' + key + '_name');
        const prodEl = card.querySelector('.bundle-products');
        if (prodEl) prodEl.textContent = t('bundle_' + key + '_products');
        const savEl = card.querySelector('.bundle-savings');
        if (savEl) {
            const priceMatch = savEl.textContent.match(/[\d,]+\s*€/);
            const price = priceMatch ? priceMatch[0] : '';
            savEl.textContent = t('bundle_save') + ' ' + price + ' \u2022 ' + t('bundle_free_shipping');
        }
        const btnEl = card.querySelector('.btn');
        if (btnEl) btnEl.textContent = t('bundle_add');
    });

    // Floating CTA
    var floatingCta = document.getElementById('floatingCTA');
    if (floatingCta) floatingCta.innerHTML = t('floating_cta');

    // Update language selector toggle button
    var langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        var codeEl = langToggle.querySelector('.lang-code');
        if (codeEl) codeEl.textContent = currentLang.toUpperCase();
        // Update active state in dropdown
        document.querySelectorAll('.lang-dropdown button').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }
}

// Auto-detect language on load
document.addEventListener('DOMContentLoaded', () => {
    // Create language selector with flags
    const nav = document.querySelector('.nav-actions');
    if (nav && !document.getElementById('langSelector')) {
        const FLAGS = { fr: '\ud83c\uddeb\ud83c\uddf7', en: '\ud83c\uddec\ud83c\udde7', es: '\ud83c\uddea\ud83c\uddf8', de: '\ud83c\udde9\ud83c\uddea' };
        const LANG_NAMES = { fr: 'Fran\u00e7ais', en: 'English', es: 'Espa\u00f1ol', de: 'Deutsch' };
        const wrapper = document.createElement('div');
        wrapper.id = 'langSelector';
        wrapper.className = 'lang-selector';
        wrapper.innerHTML = '<button type="button" class="lang-toggle" aria-label="Langue">' +
            '<svg class="lang-globe" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
            '<span class="lang-code">' + currentLang.toUpperCase() + '</span>' +
            '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>' +
        '</button>' +
        '<div class="lang-dropdown" style="display:none;">' +
            Object.keys(FLAGS).map(function(code) {
                return '<button type="button" data-lang="' + code + '"' + (code === currentLang ? ' class="active"' : '') + '>' +
                    '<span class="lang-flag">' + FLAGS[code] + '</span> ' +
                    '<span>' + LANG_NAMES[code] + '</span>' +
                '</button>';
            }).join('') +
        '</div>';
        // Toggle dropdown
        wrapper.querySelector('.lang-toggle').addEventListener('click', function(e) {
            e.stopPropagation();
            var dd = wrapper.querySelector('.lang-dropdown');
            dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        });
        // Select language
        wrapper.querySelectorAll('.lang-dropdown button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = this.dataset.lang;
                setLanguage(lang);
                wrapper.querySelector('.lang-code').textContent = lang.toUpperCase();
                wrapper.querySelector('.lang-dropdown').style.display = 'none';
                wrapper.querySelectorAll('.lang-dropdown button').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
            });
        });
        // Close on outside click
        document.addEventListener('click', function() {
            var dd = wrapper.querySelector('.lang-dropdown');
            if (dd) dd.style.display = 'none';
        });
        nav.insertBefore(wrapper, nav.firstChild);
    }

    // If user's saved language is not French, lazy-load translations first
    if (currentLang !== 'fr' && !TRANSLATIONS[currentLang]) {
        loadLanguage(currentLang, function() {
            applyTranslations();
        });
    } else {
        applyTranslations();
    }
});
