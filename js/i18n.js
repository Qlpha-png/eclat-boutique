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

        // Hero
        hero_tag: 'Nouvelle collection printemps 2026',
        hero_title: 'Votre rituel beauté',
        hero_title_em: 'réinventé',
        hero_desc: 'Découvrez nos outils et soins wellness sélectionnés par des experts. Technologie innovante, résultats visibles.',
        hero_cta1: 'Mon diagnostic gratuit',
        hero_cta2: 'Voir la collection',
        hero_stat1: 'Clientes satisfaites',
        hero_stat2: 'Note moyenne',
        hero_stat3: 'Livraison express',
        hero_floating_bestseller: 'Best-seller',
        hero_floating_tested: 'Dermatologiquement testé',
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
        filter_care: 'Soins',
        filter_tools: 'Outils',
        filter_aroma: 'Bien-être',
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

        // Bestsellers
        section_best_tag: 'Les plus aimés',
        section_best_title: 'Nos best-sellers',

        // Reviews
        section_reviews_tag: 'Avis clients',
        section_reviews_title: 'Elles adorent ÉCLAT',
        section_reviews_desc: 'Nos engagements pour votre satisfaction',

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
        banner_text: 'Livraison offerte dès 49€ d\'achat • Paiement sécurisé Stripe',

        // Footer
        footer_shop: 'Boutique',
        footer_help: 'Aide',
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
        success_contact: 'Un problème ? Contactez-nous à'
    },

    en: {
        nav_home: 'Home',
        nav_products: 'Products',
        nav_bestsellers: 'Best-sellers',
        nav_reviews: 'Reviews',
        nav_story: 'Our story',
        nav_loyalty: 'Benefits',

        hero_tag: 'New spring 2026 collection',
        hero_title: 'Your beauty ritual',
        hero_title_em: 'reinvented',
        hero_desc: 'Discover our wellness tools and skincare curated by experts. Innovative technology, visible results.',
        hero_cta1: 'My free skin diagnostic',
        hero_cta2: 'View collection',
        hero_stat1: 'Happy customers',
        hero_stat2: 'Average rating',
        hero_stat3: 'Express delivery',
        hero_floating_bestseller: 'Best-seller',
        hero_floating_tested: 'Dermatologically tested',
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
        filter_care: 'Skincare',
        filter_tools: 'Tools',
        filter_aroma: 'Wellness',
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

        banner_text: 'Free shipping over €49 • Secure payment via Stripe',

        footer_shop: 'Shop',
        footer_help: 'Help',
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
        success_contact: 'Any issue? Contact us at'
    },

    es: {
        nav_home: 'Inicio',
        nav_products: 'Productos',
        nav_bestsellers: 'Más vendidos',
        nav_reviews: 'Opiniones',
        nav_story: 'Nuestra historia',
        nav_loyalty: 'Ventajas',

        hero_tag: 'Nueva colección primavera 2026',
        hero_title: 'Tu ritual de belleza',
        hero_title_em: 'reinventado',
        hero_desc: 'Descubre nuestras herramientas y cuidados wellness seleccionados por expertos. Tecnología innovadora, resultados visibles.',
        hero_cta1: 'Mi diagnóstico gratis',
        hero_cta2: 'Ver la colección',
        hero_stat1: 'Clientas satisfechas',
        hero_stat2: 'Nota media',
        hero_stat3: 'Envío exprés',
        hero_floating_bestseller: 'Más vendido',
        hero_floating_tested: 'Dermatológicamente testado',
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
        filter_care: 'Cuidados',
        filter_tools: 'Herramientas',
        filter_aroma: 'Bienestar',
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

        banner_text: 'Envío gratis a partir de 49€ • Pago seguro con Stripe',

        footer_shop: 'Tienda',
        footer_help: 'Ayuda',
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
        success_contact: '¿Algún problema? Contáctanos en'
    },

    de: {
        nav_home: 'Startseite',
        nav_products: 'Produkte',
        nav_bestsellers: 'Bestseller',
        nav_reviews: 'Bewertungen',
        nav_story: 'Unsere Geschichte',
        nav_loyalty: 'Vorteile',

        hero_tag: 'Neue Frühlingskollektion 2026',
        hero_title: 'Ihr Beauty-Ritual',
        hero_title_em: 'neu erfunden',
        hero_desc: 'Entdecken Sie unsere von Experten ausgewählten Wellness-Tools und Hautpflege. Innovative Technologie, sichtbare Ergebnisse.',
        hero_cta1: 'Mein Gratis-Hautdiagnose',
        hero_cta2: 'Kollektion ansehen',
        hero_stat1: 'Zufriedene Kundinnen',
        hero_stat2: 'Durchschnittsbewertung',
        hero_stat3: 'Expresslieferung',
        hero_floating_bestseller: 'Bestseller',
        hero_floating_tested: 'Dermatologisch getestet',
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
        filter_care: 'Pflege',
        filter_tools: 'Werkzeuge',
        filter_aroma: 'Aromatherapie',
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

        banner_text: 'Kostenloser Versand ab 49€ • Sichere Zahlung über Stripe',

        footer_shop: 'Shop',
        footer_help: 'Hilfe',
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
        success_contact: 'Ein Problem? Kontaktieren Sie uns unter'
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

        // Nav links
        '.nav-links li:nth-child(1) a': 'nav_home',
        '.nav-links li:nth-child(2) a': 'nav_products',
        '.nav-links li:nth-child(3) a': 'nav_bestsellers',
        '.nav-links li:nth-child(4) a': 'nav_reviews',
        '.nav-links li:nth-child(5) a': 'nav_story',
        '.nav-links li:nth-child(6) a': 'nav_loyalty',

        // Hero — TOUT
        '.hero-tag': 'hero_tag',
        '.hero-content > p': 'hero_desc',
        '.hero-buttons .btn-primary': 'hero_cta1',
        '.hero-buttons .btn-outline': 'hero_cta2',

        // Floating cards
        '.floating-card.card-2 span:last-child': 'hero_floating_tested',

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
        '.filter-btn[data-category="outils"]': 'filter_tools',
        '.filter-btn[data-category="aromatherapie"]': 'filter_aroma',
        '.filter-btn[data-category="marques"]': 'filter_brands',
        '.filter-btn[data-category="parfums"]': 'filter_perfumes',

        // Bestsellers
        '.bestsellers-section .section-tag': 'section_best_tag',
        '.bestsellers-section .section-header h2': 'section_best_title',

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
        '.footer-grid .footer-col:nth-child(4) h4': 'footer_legal',
        '.footer-bottom p': 'footer_rights'
    };

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
        // Rebuild h1 content
        heroH1.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
                node.textContent = t('hero_title') + ' ';
            }
        });
        if (emEl) emEl.textContent = t('hero_title_em');
    }

    // Hero stats
    const stats = document.querySelectorAll('.hero-stats .stat:not(.live-stat)');
    const statKeys = ['hero_stat1', 'hero_stat2', 'hero_stat3'];
    stats.forEach((stat, i) => {
        if (statKeys[i]) {
            const span = stat.querySelector('span');
            if (span) span.textContent = t(statKeys[i]);
        }
    });

    // Floating card "Best-seller"
    const card1 = document.querySelector('.floating-card.card-1 span:last-child');
    if (card1) card1.textContent = t('hero_floating_bestseller');

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

    // Review count labels — "(3 247 avis)" → "(3 247 reviews)"
    document.querySelectorAll('.product-rating .count').forEach(el => {
        const match = el.textContent.match(/\(([\d\s.,]+)\s/);
        if (match) el.textContent = `(${match[1]} ${t('reviews_count')})`;
    });

    // Translate product names & descriptions if products-i18n.js is loaded
    if (typeof translateProducts === 'function') translateProducts();
}

// Auto-detect language on load
document.addEventListener('DOMContentLoaded', () => {
    // Create language selector
    const nav = document.querySelector('.nav-actions');
    if (nav && !document.getElementById('langSelector')) {
        const selector = document.createElement('select');
        selector.id = 'langSelector';
        selector.className = 'lang-selector';
        selector.innerHTML = `
            <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>FR</option>
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>EN</option>
            <option value="es" ${currentLang === 'es' ? 'selected' : ''}>ES</option>
            <option value="de" ${currentLang === 'de' ? 'selected' : ''}>DE</option>
        `;
        selector.addEventListener('change', (e) => setLanguage(e.target.value));
        nav.insertBefore(selector, nav.firstChild);
    }

    applyTranslations();
});
