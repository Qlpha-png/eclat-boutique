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
        routine_tag: '\u2728 Notre force : l\'IA',
        routine_title: 'Votre routine personnalis\u00e9e',
        routine_desc: 'L\'IA analyse votre peau et compose la routine id\u00e9ale. Unique en France.',
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
        tb_eu: '\uD83C\uddEB\uD83C\udDF7 Entreprise fran\u00e7aise'
    },

    en: {
        nav_home: 'Home',
        nav_products: 'Products',
        nav_bestsellers: 'Best-sellers',
        nav_reviews: 'Reviews',
        nav_story: 'Our story',
        nav_loyalty: 'Benefits',
        nav_guide: 'Beauty Guide',
        nav_packs: 'Bundles',
        nav_guarantees: 'Guarantees',
        nav_about: 'About us',
        nav_account: 'My account',

        hero_tag: '\u2728 500+ curated beauty products',
        hero_title: 'Your beauty,',
        hero_title_em: 'elevated by science.',
        hero_desc: 'Professional technologies and premium skincare selected for proven efficacy. Tracked shipping, free 30-day returns.',
        hero_cta1: '\uD83D\uDD2C Find my routine',
        hero_cta2: '\u2728 Build my routine',
        hero_stat1: '500+',
        hero_stat2: '4.8',
        hero_stat3: '30d',
        brands_bar_title: 'Trusted by the best — Our partner brands',

        trust1_title: 'Fast shipping',
        trust1_desc: '3-7 days across Europe',
        trust2_title: 'Secure payment',
        trust2_desc: 'Stripe • Card • PayPal',
        trust3_title: 'Free returns',
        trust3_desc: '30 days to change your mind',
        trust4_title: 'Eco-friendly',
        trust4_desc: 'Recycled packaging',

        section_products_tag: 'Our selection',
        section_products_title: 'Trending products',
        section_products_desc: 'Each product is selected for its proven effectiveness and premium quality.',
        filter_all: 'All',
        filter_face: 'Face',
        filter_care: 'Serums & Care',
        filter_body: 'Body',
        filter_hair: 'Hair',
        filter_nails: 'Nails',
        filter_men: 'Men',
        filter_tools: 'Tools',
        filter_aroma: 'Wellness',
        filter_accessories: 'Accessories',
        filter_brands: 'Top Brands',
        filter_perfumes: 'Perfumes',
        btn_add_cart: 'Add to cart',
        btn_quick_view: 'Quick view',
        badge_new: 'New',
        badge_promo: 'Sale',
        badge_lancement: 'Launch price',
        badge_bestseller: 'Best-seller',
        reviews_count: 'reviews',
        btn_add_short: '+ Add',
        toast_added: '{name} added to cart!',
        newsletter_success: 'Thank you! Your -10% promo code: BIENVENUE10',
        newsletter_error: 'An error occurred. Please try again.',

        section_best_tag: 'Most loved',
        section_best_title: 'Our best-sellers',

        section_reviews_tag: 'Customer reviews',
        section_reviews_title: 'They love ÉCLAT',
        section_reviews_desc: 'Our commitments to your satisfaction',

        newsletter_title: '-10% on your first order',
        newsletter_desc: 'Subscribe to our newsletter and get beauty tips + an exclusive promo code.',
        newsletter_btn: 'Subscribe',
        newsletter_placeholder: 'Your email address',

        cart_title: 'Your cart',
        cart_empty: 'Your cart is empty',
        cart_discover: 'Explore our products',
        cart_subtotal: 'Subtotal',
        cart_shipping: 'Shipping',
        cart_checkout: 'Checkout',
        cart_secure: '100% secure payment',
        cart_free_shipping: 'Free',
        cart_shipping_remaining: 'Only {amount} away from free shipping',
        cart_cross_sell: 'Complete your routine',

        banner_text: 'Free shipping over €29 • 30-day money-back guarantee • Secure payment',

        footer_shop: 'Shop',
        footer_help: 'Customer Service',
        footer_resources: 'Resources',
        footer_legal: 'Legal',
        footer_rights: '© 2026 ÉCLAT. All rights reserved.',

        cookie_text: 'This site only uses functional cookies (cart, preferences). No advertising or tracking cookies.',
        cookie_accept: 'Accept',
        cookie_refuse: 'Decline',

        ship_worldwide: 'International shipping available',

        // Checkout
        checkout_title: 'Complete your order',
        checkout_secure_nav: 'Secure payment',
        checkout_summary: 'Summary',
        checkout_subtotal: 'Subtotal',
        checkout_shipping: 'Shipping',
        checkout_total: 'Total',
        checkout_free: 'Free',
        checkout_info: 'Shipping information',
        checkout_firstname: 'First name',
        checkout_lastname: 'Last name',
        checkout_email: 'Email',
        checkout_phone: 'Phone',
        checkout_address: 'Address',
        checkout_zip: 'Zip code',
        checkout_city: 'City',
        checkout_country: 'Country',
        checkout_shipping_method: 'Shipping method',
        checkout_relay: 'Standard shipping - Free',
        checkout_relay_desc: '7-14 business days (tracked delivery)',
        checkout_home: 'Home delivery - \u20ac3.90',
        checkout_home_desc: '7-14 business days (tracked delivery)',
        checkout_express: 'Express shipping - \u20ac7.90',
        checkout_express_desc: '5-10 business days (priority shipping)',
        checkout_pay: 'Pay now',
        checkout_secure: '100% secure payment by Stripe. Your bank details are never stored on our servers.',
        checkout_back: 'Back to shop',
        checkout_empty: 'Your cart is empty.',
        checkout_redirect: 'Redirecting to payment...',
        checkout_error: 'Error creating payment',
        checkout_error_prefix: 'Error',
        checkout_error_stripe: 'Please check that Stripe is properly configured.',

        // Success
        success_title: 'Thank you for your order!',
        success_subtitle: 'Your payment has been accepted. You will receive a confirmation email with your order details and tracking number.',
        success_next_steps: 'Next steps',
        success_step1_title: 'Email confirmation',
        success_step1_desc: 'You will receive a summary within the next few minutes',
        success_step2_title: 'Preparation',
        success_step2_desc: 'Your order is being prepared and shipped within 1-3 business days',
        success_step3_title: 'Delivery',
        success_step3_desc: 'Tracking by email and SMS upon shipment',
        success_back: 'Back to shop',
        success_contact: 'Any issue? Contact us at',

        // Bundles
        bundle_section_title: 'Save with our bundles',
        bundle_eclat_name: 'Radiance Routine',
        bundle_antiage_name: 'Anti-Aging Routine',
        bundle_glow_name: 'Glow Routine',
        bundle_eclat_products: 'Ice Roller + Vitamin C Serum 20% + Rose Quartz Gua Sha',
        bundle_antiage_products: 'LED Pro Mask 7 Colors + Vitamin C Serum 20% + Collagen Lifting Mask',
        bundle_glow_products: 'Vitamin C Serum 20% + Rosehip Precious Oil + Collagen Eye Patches',
        bundle_save: 'Save',
        bundle_free_shipping: 'Free shipping',
        bundle_add: 'Add to cart',
        bundle_match_text: 'These products make a bundle!',
        bundle_converted_toast: 'Bundle applied!',
        bundle_added_toast: 'Bundle added to cart!',
        bundle_prefix: 'Bundle',

        // Trust badges
        trust_shipping: '\ud83d\ude9a Free shipping over \u20ac29',
        trust_refund: '\ud83d\udd04 30-day refund',
        trust_modal_shipping: 'Free shipping over \u20ac29',
        trust_modal_refund: '30-day money-back guarantee',
        trust_modal_secure: 'Secure payment',
        popup_code_toast: 'Code BIENVENUE10 activated! Check your email.',
        btn_details: 'Details',
        btn_full_details: 'View full details',

        // Categories section
        cat_section_tag: 'Explore',
        cat_section_title: 'Our beauty worlds',
        cat_visage: 'Face care',
        cat_visage_desc: 'Serums, masks, cleansers',
        cat_cheveux: 'Hair',
        cat_cheveux_desc: 'Brushes, serums, accessories',
        cat_corps: 'Body & Wellness',
        cat_corps_desc: 'Scrubs, oils, massage',
        cat_homme: 'Men',
        cat_homme_desc: 'Grooming, beard, skincare',
        cat_ongles: 'Nails',
        cat_outils: 'Beauty tools',
        cat_bienetre: 'Wellness',
        cat_accessoires: 'Accessories',

        // AI section
        ai_section_tag: '\u2728 Beauty Intelligence',
        ai_section_title: 'Selected for you',
        ai_section_desc: 'Personalized recommendations by our beauty AI.',
        ai_section_link: 'Take my diagnostic \u2192',

        // Diagnostic CTA
        diag_cta_title: 'Discover your ideal routine',
        diag_cta_desc: 'Answer 4 questions in 2 minutes. Our AI creates a personalized routine for your skin type.',
        diag_cta_btn: 'Find my routine \u2192',
        diag_routine_btn: '\u2728 Find my ideal routine \u2192',

        // Bestsellers
        section_best_desc: 'A selection of products we recommend. Best-sellers will appear here automatically after the first orders.',

        // Routine composer
        routine_tag: '\u2728 Our strength: AI',
        routine_title: 'Your personalized routine',
        routine_desc: 'AI analyzes your skin and creates the ideal routine. Unique in Europe.',
        routine_step1: '1. Cleansing',
        routine_step1_desc: 'Sonic brushes, scrubbers, steamers',
        routine_step2: '2. Targeted care',
        routine_step2_desc: 'Serums, patches, active masks',
        routine_step3: '3. Beauty tools',
        routine_step3_desc: 'LED, Gua Sha, rollers, EMS',
        routine_step4: '4. Hydration',
        routine_step4_desc: 'Oils, creams, mists',
        routine_subtext: '2 minutes, 4 questions. AI creates your custom routine.',

        // Unique section
        unique_tag: 'What makes us unique',
        unique_title: 'What no other site does',
        unique_ai_title: 'Personalized AI',
        unique_ai_desc: 'Skin diagnostic, recommendations, AI explanation of every ingredient',
        unique_cbs_title: 'Clean Beauty Score',
        unique_cbs_desc: 'Every INCI composition analyzed. Transparent safety score.',
        unique_loyalty_title: 'Gamified loyalty',
        unique_loyalty_desc: '4 tiers, daily chest, challenges, badges. Not just a basic points program.',
        unique_trans_title: 'Total transparency',
        unique_trans_desc: 'Fair prices, real delivery times (7-14d), zero fake reviews, zero misleading marketing.',

        // Chatbot upgrade
        chat_upgrade_title: 'Switch to AI mode',
        chat_upgrade_text: 'Reach 200 \u00c9clats to unlock your personal AI beauty advisor.',
        chat_upgrade_count: 'You have',
        chat_upgrade_eclats: '\u00c9clats.',

        // Loyalty bar
        loyalty_bar_remaining: 'Only',
        loyalty_bar_unlock: 'to unlock:',
        loyalty_bar_eclats: '\u00c9clats',
        loyalty_bar_fomo: 'Your \u00c9clats are worth double today!',
        loyalty_bar_fomo_expire: 'Expires in',
        loyalty_bar_fomo_cta: 'Shop now \u2192',

        // Floating CTA
        floating_cta: '\u2728 Free skin diagnostic',

        // Footer
        footer_tagline: 'Beauty & Wellness Premium',
        footer_description: 'Carefully selected skincare backed by science. \u00c9clats loyalty program, tracked shipping, satisfaction guaranteed.',
        footer_diag_link: 'Free beauty diagnostic \u2192',
        footer_pay_label: '100% secure payment',
        footer_trust_ssl: 'Secure<br>SSL payment',
        footer_trust_ship: 'Tracked<br>shipping EU',
        footer_trust_refund: 'Satisfied or<br>refunded 30d',
        footer_trust_support: 'Customer support<br>7/7',
        footer_trust_eu: 'EU regulation<br>compliant',

        // Footer links
        fl_all: 'All products',
        fl_best: 'Best-sellers',
        fl_face: 'Face care',
        fl_body: 'Body care',
        fl_sets: 'Bundles',
        fl_ship: 'Shipping',
        fl_returns: 'Returns',
        fl_track: 'Order tracking',
        fl_support: 'Support & Tickets',
        fl_blog: 'Beauty Blog',
        fl_guide: 'Science Guide',
        fl_diag: 'AI Diagnostic',
        fl_routine: 'Routine Builder',
        fl_cgv: 'Terms & Conditions',
        fl_legal: 'Legal notices',
        fl_privacy: 'Privacy policy',
        fl_retract: 'Right of withdrawal',
        fl_cookies: 'Manage cookies',

        // Hero perks
        hero_perk_ship: '\uD83D\uDE9A Free shipping over \u20ac29',
        hero_perk_return: '\uD83D\uDD04 30-day returns',
        hero_perk_diag: '\u2728 Personalized diagnostic',

        // Trust bar
        tb_ship: '\uD83D\uDE9A Tracked shipping 7-14 days',
        tb_pay: '\uD83D\uDD12 Secure Stripe payment',
        tb_return: '\u21BA 30-day returns',
        tb_diag: '\u2728 Personalized diagnostic',
        tb_eu: '\uD83C\uddEB\uD83C\udDF7 French company'
    },

    es: {
        nav_home: 'Inicio',
        nav_products: 'Productos',
        nav_bestsellers: 'Más vendidos',
        nav_reviews: 'Opiniones',
        nav_story: 'Nuestra historia',
        nav_loyalty: 'Ventajas',
        nav_guide: 'Gu\u00eda Belleza',
        nav_packs: 'Packs',
        nav_guarantees: 'Garant\u00edas',
        nav_about: 'Sobre nosotros',
        nav_account: 'Mi cuenta',

        hero_tag: '\u2728 M\u00e1s de 500 productos seleccionados',
        hero_title: 'Tu belleza,',
        hero_title_em: 'sublimada por la ciencia.',
        hero_desc: 'Tecnolog\u00edas profesionales y cuidados premium seleccionados por su eficacia probada. Env\u00edo con seguimiento, devoluci\u00f3n gratuita 30d.',
        hero_cta1: '\uD83D\uDD2C Encontrar mi rutina',
        hero_cta2: '\u2728 Crear mi rutina',
        hero_stat1: '500+',
        hero_stat2: '4.8',
        hero_stat3: '30d',
        brands_bar_title: 'Confían en nosotros — Nuestras marcas asociadas',

        trust1_title: 'Envío rápido',
        trust1_desc: '3-7 días en toda Europa',
        trust2_title: 'Pago seguro',
        trust2_desc: 'Stripe • Tarjeta • PayPal',
        trust3_title: 'Devoluciones gratis',
        trust3_desc: '30 días para cambiar de opinión',
        trust4_title: 'Eco-responsable',
        trust4_desc: 'Embalajes reciclados',

        section_products_tag: 'Nuestra selección',
        section_products_title: 'Productos tendencia',
        section_products_desc: 'Cada producto es seleccionado por su eficacia probada y su calidad premium.',
        filter_all: 'Todos',
        filter_face: 'Rostro',
        filter_care: 'Sérums & Cuidados',
        filter_body: 'Cuerpo',
        filter_hair: 'Cabello',
        filter_nails: 'Uñas',
        filter_men: 'Hombre',
        filter_tools: 'Herramientas',
        filter_aroma: 'Bienestar',
        filter_accessories: 'Accesorios',
        filter_brands: 'Grandes Marcas',
        filter_perfumes: 'Perfumes',
        btn_add_cart: 'Añadir al carrito',
        btn_quick_view: 'Vista rápida',
        badge_new: 'Nuevo',
        badge_promo: 'Oferta',
        badge_lancement: 'Precio de lanzamiento',
        badge_bestseller: 'Más vendido',
        reviews_count: 'opiniones',
        btn_add_short: '+ Añadir',
        toast_added: '¡{name} añadido al carrito!',
        newsletter_success: '¡Gracias! Tu código promo -10%: BIENVENUE10',
        newsletter_error: 'Se produjo un error. Inténtalo de nuevo.',

        section_best_tag: 'Los más amados',
        section_best_title: 'Nuestros más vendidos',

        section_reviews_tag: 'Opiniones de clientes',
        section_reviews_title: 'Les encanta ÉCLAT',
        section_reviews_desc: 'Nuestros compromisos para tu satisfacción',

        newsletter_title: '-10% en tu primer pedido',
        newsletter_desc: 'Suscríbete a nuestro boletín y recibe consejos de belleza + un código promocional exclusivo.',
        newsletter_btn: 'Suscribirse',
        newsletter_placeholder: 'Tu correo electrónico',

        cart_title: 'Tu carrito',
        cart_empty: 'Tu carrito está vacío',
        cart_discover: 'Explorar nuestros productos',
        cart_subtotal: 'Subtotal',
        cart_shipping: 'Envío',
        cart_checkout: 'Pedir',
        cart_secure: 'Pago 100% seguro',
        cart_free_shipping: 'Gratis',
        cart_shipping_remaining: 'Solo faltan {amount} para envío gratis',
        cart_cross_sell: 'Completa tu rutina',

        banner_text: 'Envío gratis a partir de 29€ • Satisfecho o reembolsado 30d • Pago seguro',

        footer_shop: 'Tienda',
        footer_help: 'Atención al Cliente',
        footer_resources: 'Recursos',
        footer_legal: 'Legal',
        footer_rights: '© 2026 ÉCLAT. Todos los derechos reservados.',

        cookie_text: 'Este sitio solo usa cookies funcionales (carrito, preferencias). Sin cookies publicitarias.',
        cookie_accept: 'Aceptar',
        cookie_refuse: 'Rechazar',

        ship_worldwide: 'Envío internacional disponible',

        // Checkout
        checkout_title: 'Finalizar mi pedido',
        checkout_secure_nav: 'Pago seguro',
        checkout_summary: 'Resumen',
        checkout_subtotal: 'Subtotal',
        checkout_shipping: 'Envío',
        checkout_total: 'Total',
        checkout_free: 'Gratis',
        checkout_info: 'Información de envío',
        checkout_firstname: 'Nombre',
        checkout_lastname: 'Apellido',
        checkout_email: 'Email',
        checkout_phone: 'Teléfono',
        checkout_address: 'Dirección',
        checkout_zip: 'Código postal',
        checkout_city: 'Ciudad',
        checkout_country: 'País',
        checkout_shipping_method: 'Método de envío',
        checkout_relay: 'Envío estándar - Gratis',
        checkout_relay_desc: '7-14 días laborables (envío con seguimiento)',
        checkout_home: 'A domicilio - 3,90\u20ac',
        checkout_home_desc: '7-14 días laborables (envío con seguimiento)',
        checkout_express: 'Envío express - 7,90\u20ac',
        checkout_express_desc: '5-10 días laborables (envío prioritario)',
        checkout_pay: 'Pagar ahora',
        checkout_secure: 'Pago 100% seguro con Stripe. Tus datos bancarios nunca se almacenan en nuestros servidores.',
        checkout_back: 'Volver a la tienda',
        checkout_empty: 'Tu carrito está vacío.',
        checkout_redirect: 'Redirigiendo al pago...',
        checkout_error: 'Error al crear el pago',
        checkout_error_prefix: 'Error',
        checkout_error_stripe: 'Verifica que Stripe esté bien configurado.',

        // Success
        success_title: '¡Gracias por tu pedido!',
        success_subtitle: 'Tu pago ha sido aceptado. Recibirás un email de confirmación con los detalles de tu pedido y tu número de seguimiento.',
        success_next_steps: 'Próximos pasos',
        success_step1_title: 'Confirmación por email',
        success_step1_desc: 'Recibirás un resumen en los próximos minutos',
        success_step2_title: 'Preparación',
        success_step2_desc: 'Tu pedido se prepara y envía en 1-3 días laborables',
        success_step3_title: 'Envío',
        success_step3_desc: 'Seguimiento por email y SMS tras el envío',
        success_back: 'Volver a la tienda',
        success_contact: '¿Algún problema? Contáctanos en',

        // Bundles
        bundle_section_title: 'Ahorra con nuestros packs',
        bundle_eclat_name: 'Rutina Luminosidad',
        bundle_antiage_name: 'Rutina Anti-Edad',
        bundle_glow_name: 'Rutina Glow',
        bundle_eclat_products: 'Ice Roller Cryo + Sérum Vitamina C 20% + Gua Sha Cuarzo Rosa',
        bundle_antiage_products: 'Máscara LED Pro 7 Colores + Sérum Vitamina C 20% + Mascarilla Colágeno Lifting',
        bundle_glow_products: 'Sérum Vitamina C 20% + Aceite Rosa Mosqueta + Parches Ojos Colágeno',
        bundle_save: 'Ahorra',
        bundle_free_shipping: 'Envío gratis',
        bundle_add: 'Añadir al carrito',
        bundle_match_text: '¡Estos productos forman un pack!',
        bundle_converted_toast: '¡Pack aplicado!',
        bundle_added_toast: '¡Pack añadido al carrito!',
        bundle_prefix: 'Pack',

        // Trust badges
        trust_shipping: '\ud83d\ude9a Env\u00edo gratis desde 29\u20ac',
        trust_refund: '\ud83d\udd04 30d reembolso',
        trust_modal_shipping: 'Env\u00edo gratis desde 29\u20ac',
        trust_modal_refund: 'Satisfecho o reembolsado 30d',
        trust_modal_secure: 'Pago seguro',
        popup_code_toast: '\u00a1C\u00f3digo BIENVENUE10 activado! Revisa tu email.',
        btn_details: 'Detalles',
        btn_full_details: 'Ver ficha completa',

        // Categories section
        cat_section_tag: 'Explorar',
        cat_section_title: 'Nuestros universos de belleza',
        cat_visage: 'Cuidado facial',
        cat_visage_desc: 'S\u00e9rums, mascarillas, limpiadores',
        cat_cheveux: 'Cabello',
        cat_cheveux_desc: 'Cepillos, s\u00e9rums, accesorios',
        cat_corps: 'Cuerpo y Bienestar',
        cat_corps_desc: 'Exfoliantes, aceites, masaje',
        cat_homme: 'Hombre',
        cat_homme_desc: 'Grooming, barba, skincare',
        cat_ongles: 'U\u00f1as',
        cat_outils: 'Herramientas de belleza',
        cat_bienetre: 'Bienestar',
        cat_accessoires: 'Accesorios',

        // AI section
        ai_section_tag: '\u2728 Inteligencia de Belleza',
        ai_section_title: 'Seleccionado para ti',
        ai_section_desc: 'Recomendaciones personalizadas por nuestra IA de belleza.',
        ai_section_link: 'Hacer mi diagn\u00f3stico \u2192',

        // Diagnostic CTA
        diag_cta_title: 'Descubre tu rutina ideal',
        diag_cta_desc: 'Responde 4 preguntas en 2 minutos. Nuestra IA crea una rutina personalizada para tu tipo de piel.',
        diag_cta_btn: 'Encontrar mi rutina \u2192',
        diag_routine_btn: '\u2728 Encontrar mi rutina ideal \u2192',

        // Bestsellers
        section_best_desc: 'Una selecci\u00f3n de productos que recomendamos. Los m\u00e1s vendidos aparecer\u00e1n aqu\u00ed autom\u00e1ticamente.',

        // Routine composer
        routine_tag: '\u2728 Nuestra fuerza: la IA',
        routine_title: 'Tu rutina personalizada',
        routine_desc: 'La IA analiza tu piel y crea la rutina ideal. \u00danico en Europa.',
        routine_step1: '1. Limpieza',
        routine_step1_desc: 'Cepillos s\u00f3nicos, scrubbers, vaporizadores',
        routine_step2: '2. Cuidado espec\u00edfico',
        routine_step2_desc: 'S\u00e9rums, parches, mascarillas activas',
        routine_step3: '3. Herramientas de belleza',
        routine_step3_desc: 'LED, Gua Sha, rodillos, EMS',
        routine_step4: '4. Hidrataci\u00f3n',
        routine_step4_desc: 'Aceites, cremas, brumas',
        routine_subtext: '2 minutos, 4 preguntas. La IA crea tu rutina a medida.',

        // Unique section
        unique_tag: 'Lo que nos hace \u00fanicos',
        unique_title: 'Lo que ning\u00fan otro sitio hace',
        unique_ai_title: 'IA personalizada',
        unique_ai_desc: 'Diagn\u00f3stico de piel, recomendaciones, explicaci\u00f3n de cada ingrediente por IA',
        unique_cbs_title: 'Clean Beauty Score',
        unique_cbs_desc: 'Cada composici\u00f3n INCI analizada. Puntuaci\u00f3n de seguridad transparente.',
        unique_loyalty_title: 'Fidelidad gamificada',
        unique_loyalty_desc: '4 niveles, cofre diario, desaf\u00edos, insignias. No es un simple programa de puntos.',
        unique_trans_title: 'Transparencia total',
        unique_trans_desc: 'Precios justos, plazos reales (7-14d), cero rese\u00f1as falsas, cero marketing enga\u00f1oso.',

        // Chatbot upgrade
        chat_upgrade_title: 'Activa el modo IA',
        chat_upgrade_text: 'Alcanza 200 \u00c9clats para desbloquear tu asesora de belleza IA personal.',
        chat_upgrade_count: 'Tienes',
        chat_upgrade_eclats: '\u00c9clats.',

        // Loyalty bar
        loyalty_bar_remaining: 'Faltan',
        loyalty_bar_unlock: 'para desbloquear:',
        loyalty_bar_eclats: '\u00c9clats',
        loyalty_bar_fomo: '\u00a1Tus \u00c9clats valen el doble hoy!',
        loyalty_bar_fomo_expire: 'Expira en',
        loyalty_bar_fomo_cta: 'Aprovecha \u2192',

        // Floating CTA
        floating_cta: '\u2728 Diagn\u00f3stico gratis',

        // Footer
        footer_tagline: 'Belleza & Bienestar Premium',
        footer_description: 'Productos seleccionados por su eficacia demostrada. Programa de fidelidad \u00c9clats, env\u00edo con seguimiento, satisfecho o reembolsado.',
        footer_diag_link: 'Diagn\u00f3stico de belleza gratis \u2192',
        footer_pay_label: 'Pago 100% seguro',
        footer_trust_ssl: 'Pago<br>seguro SSL',
        footer_trust_ship: 'Env\u00edo<br>con seguimiento',
        footer_trust_refund: 'Satisfecho o<br>reembolsado 30d',
        footer_trust_support: 'Atenci\u00f3n al cliente<br>7/7',
        footer_trust_eu: 'Conforme<br>normativa UE',

        // Footer links
        fl_all: 'Todos los productos',
        fl_best: 'M\u00e1s vendidos',
        fl_face: 'Cuidado facial',
        fl_body: 'Cuidado corporal',
        fl_sets: 'Packs',
        fl_ship: 'Env\u00edo',
        fl_returns: 'Devoluciones',
        fl_track: 'Seguimiento de pedido',
        fl_support: 'Soporte & Tickets',
        fl_blog: 'Blog Belleza',
        fl_guide: 'Gu\u00eda Cient\u00edfica',
        fl_diag: 'Diagn\u00f3stico IA',
        fl_routine: 'Creador de rutina',
        fl_cgv: 'Condiciones generales',
        fl_legal: 'Aviso legal',
        fl_privacy: 'Pol\u00edtica de privacidad',
        fl_retract: 'Derecho de desistimiento',
        fl_cookies: 'Gestionar cookies',

        // Hero perks
        hero_perk_ship: '\uD83D\uDE9A Env\u00edo gratis desde 29\u20ac',
        hero_perk_return: '\uD83D\uDD04 Devoluciones 30d',
        hero_perk_diag: '\u2728 Diagn\u00f3stico personalizado',

        // Trust bar
        tb_ship: '\uD83D\uDE9A Env\u00edo con seguimiento 7-14d',
        tb_pay: '\uD83D\uDD12 Pago seguro con Stripe',
        tb_return: '\u21BA Devoluciones 30 d\u00edas',
        tb_diag: '\u2728 Diagn\u00f3stico personalizado',
        tb_eu: '\uD83C\uddEB\uD83C\udDF7 Empresa francesa'
    },

    de: {
        nav_home: 'Startseite',
        nav_products: 'Produkte',
        nav_bestsellers: 'Bestseller',
        nav_reviews: 'Bewertungen',
        nav_story: 'Unsere Geschichte',
        nav_loyalty: 'Vorteile',
        nav_guide: 'Beauty-Guide',
        nav_packs: 'Sets',
        nav_guarantees: 'Garantien',
        nav_about: '\u00dcber uns',
        nav_account: 'Mein Konto',

        hero_tag: '\u2728 \u00dcber 500 ausgew\u00e4hlte Produkte',
        hero_title: 'Ihre Sch\u00f6nheit,',
        hero_title_em: 'veredelt durch Wissenschaft.',
        hero_desc: 'Professionelle Technologien und Premium-Pflege, ausgew\u00e4hlt f\u00fcr nachgewiesene Wirksamkeit. Versand mit Tracking, 30 Tage R\u00fcckgabe.',
        hero_cta1: '\uD83D\uDD2C Meine Routine finden',
        hero_cta2: '\u2728 Routine zusammenstellen',
        hero_stat1: '500+',
        hero_stat2: '4.8',
        hero_stat3: '30T',
        brands_bar_title: 'Vertrauenswürdig — Unsere Partnermarken',

        trust1_title: 'Schneller Versand',
        trust1_desc: '3-7 Tage in ganz Europa',
        trust2_title: 'Sichere Zahlung',
        trust2_desc: 'Stripe • Karte • PayPal',
        trust3_title: 'Kostenlose Rücksendung',
        trust3_desc: '30 Tage Rückgaberecht',
        trust4_title: 'Umweltfreundlich',
        trust4_desc: 'Recycelte Verpackung',

        section_products_tag: 'Unsere Auswahl',
        section_products_title: 'Trendprodukte',
        section_products_desc: 'Jedes Produkt wird nach nachgewiesener Wirksamkeit und Premium-Qualität ausgewählt.',
        filter_all: 'Alle',
        filter_face: 'Gesicht',
        filter_care: 'Seren & Pflege',
        filter_body: 'Körper',
        filter_hair: 'Haare',
        filter_nails: 'Nägel',
        filter_men: 'Herren',
        filter_tools: 'Werkzeuge',
        filter_aroma: 'Aromatherapie',
        filter_accessories: 'Zubehör',
        filter_brands: 'Top Marken',
        filter_perfumes: 'Parfüms',
        btn_add_cart: 'In den Warenkorb',
        btn_quick_view: 'Schnellansicht',
        badge_new: 'Neu',
        badge_promo: 'Angebot',
        badge_lancement: 'Einführungspreis',
        badge_bestseller: 'Bestseller',
        reviews_count: 'Bewertungen',
        btn_add_short: '+ Hinzufügen',
        toast_added: '{name} zum Warenkorb hinzugefügt!',
        newsletter_success: 'Danke! Ihr -10% Promo-Code: BIENVENUE10',
        newsletter_error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',

        section_best_tag: 'Am beliebtesten',
        section_best_title: 'Unsere Bestseller',

        section_reviews_tag: 'Kundenbewertungen',
        section_reviews_title: 'Sie lieben ÉCLAT',
        section_reviews_desc: 'Unsere Verpflichtungen für Ihre Zufriedenheit',

        newsletter_title: '-10% auf Ihre erste Bestellung',
        newsletter_desc: 'Abonnieren Sie unseren Newsletter und erhalten Sie Beauty-Tipps + einen exklusiven Promo-Code.',
        newsletter_btn: 'Abonnieren',
        newsletter_placeholder: 'Ihre E-Mail-Adresse',

        cart_title: 'Ihr Warenkorb',
        cart_empty: 'Ihr Warenkorb ist leer',
        cart_discover: 'Unsere Produkte entdecken',
        cart_subtotal: 'Zwischensumme',
        cart_shipping: 'Versand',
        cart_checkout: 'Bestellen',
        cart_secure: '100% sichere Zahlung',
        cart_free_shipping: 'Kostenlos',
        cart_shipping_remaining: 'Nur noch {amount} bis zum kostenlosen Versand',
        cart_cross_sell: 'Vervollständigen Sie Ihre Routine',

        banner_text: 'Kostenloser Versand ab 29€ • 30 Tage Geld-zurück • Sichere Zahlung',

        footer_shop: 'Shop',
        footer_help: 'Kundenservice',
        footer_resources: 'Ressourcen',
        footer_legal: 'Rechtliches',
        footer_rights: '© 2026 ÉCLAT. Alle Rechte vorbehalten.',

        cookie_text: 'Diese Seite verwendet nur funktionale Cookies (Warenkorb, Einstellungen). Keine Werbe-Cookies.',
        cookie_accept: 'Akzeptieren',
        cookie_refuse: 'Ablehnen',

        ship_worldwide: 'Internationaler Versand verfügbar',

        // Checkout
        checkout_title: 'Bestellung abschlie\u00dfen',
        checkout_secure_nav: 'Sichere Zahlung',
        checkout_summary: 'Zusammenfassung',
        checkout_subtotal: 'Zwischensumme',
        checkout_shipping: 'Versand',
        checkout_total: 'Gesamt',
        checkout_free: 'Kostenlos',
        checkout_info: 'Lieferinformationen',
        checkout_firstname: 'Vorname',
        checkout_lastname: 'Nachname',
        checkout_email: 'E-Mail',
        checkout_phone: 'Telefon',
        checkout_address: 'Adresse',
        checkout_zip: 'Postleitzahl',
        checkout_city: 'Stadt',
        checkout_country: 'Land',
        checkout_shipping_method: 'Versandart',
        checkout_relay: 'Standardversand - Kostenlos',
        checkout_relay_desc: '7-14 Werktage (Sendungsverfolgung)',
        checkout_home: 'Hauszustellung - 3,90\u20ac',
        checkout_home_desc: '7-14 Werktage (Sendungsverfolgung)',
        checkout_express: 'Expressversand - 7,90\u20ac',
        checkout_express_desc: '5-10 Werktage (Priorit\u00e4tsversand)',
        checkout_pay: 'Jetzt bezahlen',
        checkout_secure: '100% sichere Zahlung \u00fcber Stripe. Ihre Bankdaten werden niemals auf unseren Servern gespeichert.',
        checkout_back: 'Zur\u00fcck zum Shop',
        checkout_empty: 'Ihr Warenkorb ist leer.',
        checkout_redirect: 'Weiterleitung zur Zahlung...',
        checkout_error: 'Fehler bei der Zahlungserstellung',
        checkout_error_prefix: 'Fehler',
        checkout_error_stripe: 'Bitte \u00fcberpr\u00fcfen Sie, ob Stripe richtig konfiguriert ist.',

        // Success
        success_title: 'Vielen Dank f\u00fcr Ihre Bestellung!',
        success_subtitle: 'Ihre Zahlung wurde akzeptiert. Sie erhalten eine Best\u00e4tigungs-E-Mail mit Ihren Bestelldetails und Ihrer Sendungsverfolgungsnummer.',
        success_next_steps: 'N\u00e4chste Schritte',
        success_step1_title: 'Best\u00e4tigung per E-Mail',
        success_step1_desc: 'Sie erhalten eine Zusammenfassung in den n\u00e4chsten Minuten',
        success_step2_title: 'Vorbereitung',
        success_step2_desc: 'Ihre Bestellung wird vorbereitet und innerhalb von 1-3 Werktagen versandt',
        success_step3_title: 'Lieferung',
        success_step3_desc: 'Verfolgung per E-Mail und SMS nach dem Versand',
        success_back: 'Zur\u00fcck zum Shop',
        success_contact: 'Ein Problem? Kontaktieren Sie uns unter',

        // Bundles
        bundle_section_title: 'Sparen Sie mit unseren Sets',
        bundle_eclat_name: 'Strahlkraft-Routine',
        bundle_antiage_name: 'Anti-Aging-Routine',
        bundle_glow_name: 'Glow-Routine',
        bundle_eclat_products: 'Ice Roller Cryo + Vitamin C Serum 20% + Rosenquarz Gua Sha',
        bundle_antiage_products: 'LED Pro Maske 7 Farben + Vitamin C Serum 20% + Kollagen Lifting-Maske',
        bundle_glow_products: 'Vitamin C Serum 20% + Hagebuttenöl + Kollagen Augenpads',
        bundle_save: 'Sparen Sie',
        bundle_free_shipping: 'Kostenloser Versand',
        bundle_add: 'In den Warenkorb',
        bundle_match_text: 'Diese Produkte bilden ein Set!',
        bundle_converted_toast: 'Set angewendet!',
        bundle_added_toast: 'Set zum Warenkorb hinzugef\u00fcgt!',
        bundle_prefix: 'Set',

        // Trust badges
        trust_shipping: '\ud83d\ude9a Kostenloser Versand ab 29\u20ac',
        trust_refund: '\ud83d\udd04 30 Tage R\u00fcckgabe',
        trust_modal_shipping: 'Kostenloser Versand ab 29\u20ac',
        trust_modal_refund: '30 Tage Geld-zur\u00fcck-Garantie',
        trust_modal_secure: 'Sichere Zahlung',
        popup_code_toast: 'Code BIENVENUE10 aktiviert! Pr\u00fcfen Sie Ihre E-Mail.',
        btn_details: 'Details',
        btn_full_details: 'Alle Details ansehen',

        // Categories section
        cat_section_tag: 'Entdecken',
        cat_section_title: 'Unsere Beauty-Welten',
        cat_visage: 'Gesichtspflege',
        cat_visage_desc: 'Seren, Masken, Reinigung',
        cat_cheveux: 'Haare',
        cat_cheveux_desc: 'B\u00fcrsten, Seren, Zubeh\u00f6r',
        cat_corps: 'K\u00f6rper & Wohlbefinden',
        cat_corps_desc: 'Peelings, \u00d6le, Massage',
        cat_homme: 'M\u00e4nner',
        cat_homme_desc: 'Grooming, Bart, Hautpflege',
        cat_ongles: 'N\u00e4gel',
        cat_outils: 'Beauty-Tools',
        cat_bienetre: 'Wohlbefinden',
        cat_accessoires: 'Zubeh\u00f6r',

        // AI section
        ai_section_tag: '\u2728 Beauty-Intelligenz',
        ai_section_title: 'F\u00fcr Sie ausgew\u00e4hlt',
        ai_section_desc: 'Personalisierte Empfehlungen unserer Beauty-KI.',
        ai_section_link: 'Meine Diagnose machen \u2192',

        // Diagnostic CTA
        diag_cta_title: 'Entdecken Sie Ihre ideale Routine',
        diag_cta_desc: 'Beantworten Sie 4 Fragen in 2 Minuten. Unsere KI erstellt eine personalisierte Routine f\u00fcr Ihren Hauttyp.',
        diag_cta_btn: 'Meine Routine finden \u2192',
        diag_routine_btn: '\u2728 Meine ideale Routine finden \u2192',

        // Bestsellers
        section_best_desc: 'Eine Auswahl von Produkten, die wir empfehlen. Bestseller erscheinen hier automatisch nach den ersten Bestellungen.',

        // Routine composer
        routine_tag: '\u2728 Unsere St\u00e4rke: KI',
        routine_title: 'Ihre personalisierte Routine',
        routine_desc: 'KI analysiert Ihre Haut und erstellt die ideale Routine. Einzigartig in Europa.',
        routine_step1: '1. Reinigung',
        routine_step1_desc: 'Sonic-B\u00fcrsten, Scrubber, Dampf',
        routine_step2: '2. Gezielte Pflege',
        routine_step2_desc: 'Seren, Patches, aktive Masken',
        routine_step3: '3. Beauty-Tools',
        routine_step3_desc: 'LED, Gua Sha, Roller, EMS',
        routine_step4: '4. Feuchtigkeit',
        routine_step4_desc: '\u00d6le, Cremes, Sprays',
        routine_subtext: '2 Minuten, 4 Fragen. KI erstellt Ihre individuelle Routine.',

        // Unique section
        unique_tag: 'Was uns einzigartig macht',
        unique_title: 'Was keine andere Seite bietet',
        unique_ai_title: 'Personalisierte KI',
        unique_ai_desc: 'Hautdiagnose, Empfehlungen, KI-Erkl\u00e4rung jeder Zutat',
        unique_cbs_title: 'Clean Beauty Score',
        unique_cbs_desc: 'Jede INCI-Zusammensetzung analysiert. Transparenter Sicherheitsscore.',
        unique_loyalty_title: 'Gamifizierte Treue',
        unique_loyalty_desc: '4 Stufen, t\u00e4gliche Truhe, Herausforderungen, Abzeichen. Kein einfaches Punkteprogramm.',
        unique_trans_title: 'Totale Transparenz',
        unique_trans_desc: 'Faire Preise, echte Lieferzeiten (7-14T), keine Fake-Bewertungen, kein irref\u00fchrendes Marketing.',

        // Chatbot upgrade
        chat_upgrade_title: 'KI-Modus aktivieren',
        chat_upgrade_text: 'Erreichen Sie 200 \u00c9clats, um Ihre pers\u00f6nliche KI-Beauty-Beraterin freizuschalten.',
        chat_upgrade_count: 'Sie haben',
        chat_upgrade_eclats: '\u00c9clats.',

        // Loyalty bar
        loyalty_bar_remaining: 'Noch',
        loyalty_bar_unlock: 'um freizuschalten:',
        loyalty_bar_eclats: '\u00c9clats',
        loyalty_bar_fomo: 'Ihre \u00c9clats z\u00e4hlen heute doppelt!',
        loyalty_bar_fomo_expire: 'L\u00e4uft ab in',
        loyalty_bar_fomo_cta: 'Jetzt shoppen \u2192',

        // Floating CTA
        floating_cta: '\u2728 Gratis Hautdiagnose',

        // Footer
        footer_tagline: 'Beauty & Wellness Premium',
        footer_description: 'Sorgf\u00e4ltig ausgew\u00e4hlte Pflege mit nachgewiesener Wirksamkeit. \u00c9clats-Treueprogramm, verfolgte Lieferung, Zufriedenheitsgarantie.',
        footer_diag_link: 'Gratis Hautdiagnose \u2192',
        footer_pay_label: '100% sichere Zahlung',
        footer_trust_ssl: 'Sichere<br>SSL-Zahlung',
        footer_trust_ship: 'Verfolgte<br>Lieferung EU',
        footer_trust_refund: 'Zufrieden oder<br>Geld zur\u00fcck 30T',
        footer_trust_support: 'Kundensupport<br>7/7',
        footer_trust_eu: 'EU-Verordnung<br>konform',

        // Footer links
        fl_all: 'Alle Produkte',
        fl_best: 'Bestseller',
        fl_face: 'Gesichtspflege',
        fl_body: 'K\u00f6rperpflege',
        fl_sets: 'Sets',
        fl_ship: 'Versand',
        fl_returns: 'R\u00fccksendung',
        fl_track: 'Bestellverfolgung',
        fl_support: 'Support & Tickets',
        fl_blog: 'Beauty-Blog',
        fl_guide: 'Wissenschaftsguide',
        fl_diag: 'KI-Diagnose',
        fl_routine: 'Routine-Builder',
        fl_cgv: 'AGB',
        fl_legal: 'Impressum',
        fl_privacy: 'Datenschutz',
        fl_retract: 'Widerrufsrecht',
        fl_cookies: 'Cookies verwalten',

        // Hero perks
        hero_perk_ship: '\uD83D\uDE9A Kostenloser Versand ab 29\u20ac',
        hero_perk_return: '\uD83D\uDD04 30 Tage R\u00fcckgabe',
        hero_perk_diag: '\u2728 Personalisierte Diagnose',

        // Trust bar
        tb_ship: '\uD83D\uDE9A Versand mit Tracking 7-14T',
        tb_pay: '\uD83D\uDD12 Sichere Stripe-Zahlung',
        tb_return: '\u21BA 30 Tage R\u00fcckgabe',
        tb_diag: '\u2728 Personalisierte Diagnose',
        tb_eu: '\uD83C\uddEB\uD83C\udDF7 Franz\u00f6sisches Unternehmen'
    }
};

// Current language
let currentLang = localStorage.getItem('eclat_lang') || navigator.language?.slice(0, 2) || 'fr';
if (!TRANSLATIONS[currentLang]) currentLang = 'fr';

function t(key) {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['fr'][key] || key;
}

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('eclat_lang', lang);
    applyTranslations();
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
        '#routineStep1': 'routine_step1',
        '#routineStep1Desc': 'routine_step1_desc',
        '#routineStep2': 'routine_step2',
        '#routineStep2Desc': 'routine_step2_desc',
        '#routineStep3': 'routine_step3',
        '#routineStep3Desc': 'routine_step3_desc',
        '#routineStep4': 'routine_step4',
        '#routineStep4Desc': 'routine_step4_desc',
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

    applyTranslations();
});
