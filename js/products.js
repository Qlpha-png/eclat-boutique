// ============================
// ÉCLAT — Catalogue Beauté 2026
// 15 produits ÉCLAT (marque propre)
// Fournisseur : CJDropshipping — 100% automatisé
// Images : photos réelles fournisseur
//
// STRATÉGIE PRIX : Prix de lancement agressifs pour 0-budget organique.
// Directive Omnibus EU 2019/2161 : pas de prix barrés sans historique 30j.
// PHASE 2 (après 30j de ventes) : remonter aux prix normaux + afficher oldPrice.
// Prix normaux prévus : LED 49.90, Gua Sha 14.90, Scrubber 34.90, Brosse 29.90,
// Ice Roller 12.90, V-Line 24.90, Steamer 29.90, VitC 19.90, Patchs 14.90,
// Collagène 16.90, Huile 19.90, Stickers 14.90, Yeux SPA 14.90,
// Diffuseur 39.90, Kit Boucles 12.90
// ============================

const PRODUCTS = [

    // ═══════════════════════════════════════════════════════
    //  SOINS VISAGE — Appareils & outils
    // ═══════════════════════════════════════════════════════

    {
        id: 1,
        name: "Masque LED Pro 7 Couleurs",
        category: "visage",
        price: 39.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2025/12/02/07/52018798-4e16-43fe-8e02-f280acf86442_trans.jpeg",
        badge: "best",
        rating: 4.9,
        reviews: 0,
        description: "Le soin en institut, chez vous. 7 longueurs d'onde ciblées : rouge anti-âge, bleue anti-acné, verte anti-taches. Résultats visibles dès 14 jours d'utilisation régulière.",
        features: ["7 longueurs d'onde thérapeutiques", "Timer automatique 15 min", "Rechargeable USB", "Silicone hypoallergénique", "Certifié CE", "Résultats en 14 jours"],
        bestseller: true,
        bestsellerRank: 1,
        supplier: 'cj',
        cjProductId: '2512020745411613700',
        cjVariantId: '2512020745411614100'
    },

    {
        id: 2,
        name: "Gua Sha Quartz Rose Cristal",
        category: "visage",
        price: 9.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/quick/product/d127bcab-55c6-49be-aa47-0b10f0711d0e.jpg",
        badge: "best",
        rating: 4.8,
        reviews: 0,
        description: "Le geste beauté ancestral en quartz rose véritable. Forme cœur ergonomique qui épouse les contours du visage. Stimule la circulation, dégonfle, sculpte l'ovale naturellement.",
        features: ["Quartz rose véritable", "Forme cœur ergonomique", "Stimule la circulation", "Dégonfle le visage", "Sculpte l'ovale", "Chaque pierre est unique"],
        bestseller: true,
        bestsellerRank: 2,
        supplier: 'cj',
        cjProductId: '2602120829411639000',
        cjVariantId: '2602120829411639400'
    },

    {
        id: 3,
        name: "Scrubber Ultrasonique Visage",
        category: "visage",
        price: 27.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/72d34072-6284-455f-b849-2e220e4508a5.png",
        badge: "lancement",
        rating: 4.7,
        reviews: 0,
        description: "Nettoyage professionnel en 3 minutes. 28 000 vibrations/sec. Désincruste les pores, exfolie en douceur, fait pénétrer vos sérums 5x mieux. Rechargeable USB.",
        features: ["28 000 vibrations/sec", "3 modes : nettoyage, lifting, absorption", "Acier inoxydable médical", "Rechargeable USB", "Étanche IPX5", "Résultats immédiats"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '1900541186889875458',
        cjVariantId: '1900541187347054594'
    },

    {
        id: 4,
        name: "Brosse Nettoyante Sonic",
        category: "visage",
        price: 22.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/17633376/13ee1260-c238-42cd-a876-6d29b5ec41e7.jpg",
        badge: "lancement",
        rating: 4.6,
        reviews: 0,
        description: "L'alternative accessible aux brosses à 200€+. 5 têtes interchangeables pour un nettoyage complet. Waterproof, douce pour les peaux sensibles.",
        features: ["5 têtes interchangeables", "Waterproof", "Nettoyage en profondeur", "Douce pour peaux sensibles", "Rechargeable", "Longue autonomie"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '1990665069449302017',
        cjVariantId: '1990665069533188098'
    },

    {
        id: 5,
        name: "Ice Roller Cryo Visage",
        category: "visage",
        price: 7.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/quick/product/1f301f02-d17b-4315-a4b0-33a9c64f2bbd.jpg",
        badge: "best",
        rating: 4.8,
        reviews: 0,
        description: "Le geste viral du matin. Moule à glace + roller : remplissez, congelez, massez. Dégonfle les poches, resserre les pores, apaise les rougeurs en 2 min.",
        features: ["Moule à glace intégré", "Tête rotative 360°", "Dégonfle en 2 min", "Resserre les pores", "Soulage les rougeurs", "Réutilisable à l'infini"],
        bestseller: true,
        bestsellerRank: 3,
        supplier: 'cj',
        cjProductId: '2508010604181617000',
        cjVariantId: '2508010604181617800'
    },

    {
        id: 6,
        name: "V-Line Roller Sculptant EMS",
        category: "visage",
        price: 18.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2026/01/27/06/d5042d2a-775f-4b09-9e0a-f6c65549314c_trans.jpeg",
        badge: "new",
        rating: 4.7,
        reviews: 0,
        description: "Le secret K-beauty pour un visage sculpté. Roller électrique V-Shape avec micro-courant EMS. Reproduit le drainage lymphatique professionnel. Tonifie et affine.",
        features: ["EMS micro-courant", "Design V-Shape", "Drainage lymphatique", "Tonifie et affine", "Rechargeable", "Résultats en 2-4 sem"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2601270627311614800',
        cjVariantId: '2601270627311615200'
    },

    {
        id: 7,
        name: "Facial Steamer Nano-Ion",
        category: "visage",
        price: 24.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/8a1f321f-85ce-4c02-8147-658196e8dbfb.jpg",
        badge: "new",
        rating: 4.7,
        reviews: 0,
        description: "Le spa à domicile. Vapeur nano-ionique qui ouvre les pores en douceur. Hydrate en profondeur, prépare la peau aux soins. Portable et rechargeable.",
        features: ["Vapeur nano-ionique", "Hydratation profonde", "Ouvre les pores", "Portable rechargeable", "Prépare aux soins", "Design compact"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2039619420008083458',
        cjVariantId: '2039619420209410049'
    },

    // ═══════════════════════════════════════════════════════
    //  SOINS PEAU — Sérums, masques, traitements
    // ═══════════════════════════════════════════════════════

    {
        id: 8,
        name: "Sérum Éclat Vitamine C 20%",
        category: "soin",
        price: 14.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/quick/product/a1ae3177-fe09-43ca-8969-57c5a5475d07.jpg",
        badge: "best",
        rating: 4.9,
        reviews: 0,
        description: "L'actif n°1 en skincare mondial. Vitamine C stabilisée 20% pour un teint éclatant. Anti-rides, anti-taches, booste le collagène. Résultats visibles en 21 jours.",
        features: ["Vitamine C stabilisée 20%", "Anti-rides + anti-taches", "Booste le collagène", "Flacon 30ml", "Tous types de peau", "Résultats en 21 jours"],
        bestseller: true,
        bestsellerRank: 4,
        supplier: 'cj',
        cjProductId: '2603300928441600800',
        cjVariantId: '2603300928441601200'
    },

    {
        id: 9,
        name: "Patchs Yeux Collagène Hydratants",
        category: "soin",
        price: 9.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2026/03/31/02/9c7f9271-bd54-4456-82b2-d811972cdff3.jpg",
        badge: "lancement",
        rating: 4.7,
        reviews: 0,
        description: "60 patchs collagène pour 1 mois de soins. Dégonfle les poches, estompe les cernes, hydrate le contour des yeux. Résultat visible dès la 1ère pose.",
        features: ["Collagène marin concentré", "Acide hyaluronique", "60 patchs (1 mois)", "Effet frais immédiat", "Résultat 1ère pose", "Peaux sensibles OK"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2603301345481600700',
        cjVariantId: '2603301345481601100'
    },

    {
        id: 10,
        name: "Masque Collagène Lifting",
        category: "soin",
        price: 12.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2026/04/06/04/f5e5d992-c91f-4b7e-aa49-364a85beabdf.jpg",
        badge: "new",
        rating: 4.9,
        reviews: 0,
        description: "Le masque lifting qui a explosé TikTok. Collagène compact qui adhère parfaitement au visage. Effet tenseur immédiat, repulpe et lisse. 4 masques par boîte.",
        features: ["Collagène compact lifting", "Effet tenseur immédiat", "Repulpe et lisse", "4 masques/boîte", "Adhère parfaitement", "Usage hebdomadaire"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2604060437251602800',
        cjVariantId: '2604060437251603100'
    },

    {
        id: 11,
        name: "Huile Précieuse Rose Musquée",
        category: "soin",
        price: 14.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2025/03/14/11/6acfe7c3-723b-429c-8f1a-c5b37cbdf691.jpg",
        badge: "lancement",
        rating: 4.8,
        reviews: 0,
        description: "Huile de rose musquée pure qui hydrate et régénère en profondeur. Riche en oméga naturels, elle atténue cicatrices et ridules. Le soin nocturne idéal.",
        features: ["Rose musquée pure", "Hydrate en profondeur", "Régénère la peau", "Atténue cicatrices", "Anti-rides naturel", "Flacon 10ml concentré"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2503141112311610800',
        cjVariantId: '2503141112311611000'
    },

    {
        id: 12,
        name: "Stickers Anti-Rides Micro-Crystal",
        category: "soin",
        price: 8.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2026/03/08/08/39b9c7b8-3f18-4807-88a7-c597c7f21287_trans.jpeg",
        badge: "new",
        rating: 4.6,
        reviews: 0,
        description: "Patchs micro-cristaux qui lissent les rides pendant le sommeil. Technologie hydrogel condensé qui délivre les actifs en profondeur. Résultat au réveil.",
        features: ["Micro-cristaux actifs", "Technologie hydrogel", "Résultat au réveil", "Zones visage ciblées", "Réutilisable", "Sans chimie agressive"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2603080834381636900',
        cjVariantId: '2603080834381637200'
    },

    // ═══════════════════════════════════════════════════════
    //  BIEN-ÊTRE & ACCESSOIRES
    // ═══════════════════════════════════════════════════════

    {
        id: 13,
        name: "Masque Yeux Vapeur SPA",
        category: "aromatherapie",
        price: 9.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/quick/product/f6d9a518-767e-454d-8560-7f7afab99bf4.jpg",
        badge: "new",
        rating: 4.8,
        reviews: 0,
        description: "12 masques vapeur auto-chauffants pour un spa des yeux. Chaleur douce à 40°C qui soulage la fatigue écrans et favorise l'endormissement. Relaxation totale.",
        features: ["Chaleur 40°C auto", "12 masques/boîte", "Soulage fatigue écrans", "Aide endormissement", "Usage unique hygiénique", "Relaxation SPA"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2507200553561614700',
        cjVariantId: '2507200553561616300'
    },

    {
        id: 14,
        name: "Diffuseur Arôme Ultrasonique",
        category: "aromatherapie",
        price: 29.90,
        oldPrice: null,
        image: "https://oss-cf.cjdropshipping.com/product/2026/02/27/07/025cd8ab-7062-4c21-a81f-7dc8d5d22dac.jpg",
        badge: "lancement",
        rating: 4.6,
        reviews: 0,
        description: "Diffuseur ultrasonique en verre design. Brume aromatique fine + LED d'ambiance. Compatible toutes huiles essentielles. L'objet déco bien-être par excellence.",
        features: ["Atomisation ultrasonique", "Design verre élégant", "LED d'ambiance", "Compatible huiles essentielles", "Ultra-silencieux", "Arrêt auto sécurité"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '2602270733571636700',
        cjVariantId: '2602270733571637400'
    },

    {
        id: 15,
        name: "Kit Boucles Sans Chaleur",
        category: "outils",
        price: 8.90,
        oldPrice: null,
        image: "https://cf.cjdropshipping.com/d012ffbc-7b07-4dbe-a6cf-af70aa6f0440.jpg",
        badge: "new",
        rating: 4.7,
        reviews: 0,
        description: "Boucles parfaites en dormant, sans abîmer vos cheveux. Set satin avec barre flexible octopus. Tous types de cheveux, toutes longueurs. Zéro dégât, 100% résultat.",
        features: ["Satin anti-frizz", "Boucles overnight", "Toutes longueurs", "Barre flexible octopus", "Zéro dégât cheveux", "3 couleurs dispo"],
        bestseller: false,
        supplier: 'cj',
        cjProductId: '1481815597737185280',
        cjVariantId: '1481815597804294144'
    }
];

// ============================
// ROUTINE BEAUTÉ — Mapping produit → étape
// Utilisé par le "Complétez votre routine" dans le panier
// ============================
const ROUTINE_STEPS = [
    { key: 'nettoyage', icon: '🧼', fr: 'Nettoyage', en: 'Cleansing', es: 'Limpieza', de: 'Reinigung' },
    { key: 'preparation', icon: '❄️', fr: 'Préparation', en: 'Prep', es: 'Preparación', de: 'Vorbereitung' },
    { key: 'serum', icon: '💧', fr: 'Sérum', en: 'Serum', es: 'Sérum', de: 'Serum' },
    { key: 'soin', icon: '✨', fr: 'Soin', en: 'Care', es: 'Cuidado', de: 'Pflege' },
    { key: 'outil', icon: '🔧', fr: 'Outil beauté', en: 'Beauty tool', es: 'Herramienta', de: 'Beauty-Tool' },
];

const PRODUCT_ROUTINE_MAP = {
    1: 'outil',        // Masque LED
    2: 'outil',        // Gua Sha
    3: 'nettoyage',    // Scrubber
    4: 'nettoyage',    // Brosse Sonic
    5: 'preparation',  // Ice Roller
    6: 'outil',        // V-Line EMS
    7: 'preparation',  // Facial Steamer
    8: 'serum',        // Sérum Vitamine C
    9: 'soin',         // Patchs Yeux
    10: 'soin',        // Masque Collagène
    11: 'soin',        // Huile Rose Musquée
    12: 'soin',        // Stickers Anti-Rides
    // 13, 14, 15 : bien-être / cheveux — pas dans la routine skincare
};
