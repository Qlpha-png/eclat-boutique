// ============================
// ECLAT - Product Data
// ============================

const PRODUCTS = [
    {
        id: 1,
        name: "Masque LED Professionnel",
        category: "visage",
        price: 59.90,
        oldPrice: 89.90,
        emoji: "\u{1F31F}",
        badge: "best",
        rating: 4.9,
        reviews: 2847,
        description: "Masque LED 7 couleurs pour traiter acn\u00e9, rides et teint terne. Technologie phototh\u00e9rapie utilis\u00e9e en institut, maintenant chez vous.",
        features: [
            "7 longueurs d'onde LED",
            "Timer automatique 15 min",
            "Rechargeable USB-C",
            "Silicone m\u00e9dical hypoallerg\u00e9nique",
            "R\u00e9sultats visibles en 2-3 semaines"
        ],
        bestseller: true,
        bestsellerRank: 1
    },
    {
        id: 2,
        name: "Set Coiffure 7-en-1 Pro",
        category: "outils",
        price: 44.90,
        oldPrice: 69.90,
        emoji: "\u{1F4AB}",
        badge: "promo",
        rating: 4.8,
        reviews: 1923,
        description: "Lisseur, boucleur, onduleur et plus encore. Un seul outil pour tous vos styles. C\u00e9ramique tourmaline pour des cheveux brillants sans dommage.",
        features: [
            "7 embouts interchangeables",
            "Chauffage rapide 30 secondes",
            "Temp\u00e9rature r\u00e9glable 80-230\u00b0C",
            "Rev\u00eatement c\u00e9ramique tourmaline",
            "Arr\u00eat automatique s\u00e9curit\u00e9"
        ],
        bestseller: true,
        bestsellerRank: 2
    },
    {
        id: 3,
        name: "Roller Quartz Rose",
        category: "visage",
        price: 22.90,
        oldPrice: null,
        emoji: "\u{1F48E}",
        badge: "new",
        rating: 4.7,
        reviews: 1456,
        description: "Roller facial en quartz rose v\u00e9ritable. Stimule la circulation, r\u00e9duit les poches et aide \u00e0 l'absorption des s\u00e9rums.",
        features: [
            "Quartz rose naturel certifi\u00e9",
            "Double embout (visage + yeux)",
            "\u00c9crin velours inclus",
            "Pierre fra\u00eeche naturellement",
            "Rituel Gua Sha inclus"
        ],
        bestseller: true,
        bestsellerRank: 3
    },
    {
        id: 4,
        name: "S\u00e9rum Vitamine C 20%",
        category: "visage",
        price: 27.90,
        oldPrice: 34.90,
        emoji: "\u{1F34A}",
        badge: "promo",
        rating: 4.8,
        reviews: 2103,
        description: "S\u00e9rum concentr\u00e9 en vitamine C pure (acide L-ascorbique 20%). \u00c9claircit le teint, r\u00e9duit les taches et booste le collag\u00e8ne.",
        features: [
            "Vitamine C pure 20%",
            "Acide hyaluronique inclus",
            "Flacon airless anti-oxydation",
            "V\u00e9gan et cruelty-free",
            "Fabriqu\u00e9 en France"
        ],
        bestseller: false
    },
    {
        id: 5,
        name: "Patches Microneedle Anti-Acn\u00e9",
        category: "visage",
        price: 14.90,
        oldPrice: null,
        emoji: "\u{2728}",
        badge: "new",
        rating: 4.6,
        reviews: 987,
        description: "Patches dissolvants avec micro-aiguilles d'acide salicylique. Ciblent les imperfections pendant la nuit pour une peau nette au r\u00e9veil.",
        features: [
            "Micro-aiguilles dissolvantes",
            "Acide salicylique + niacinamide",
            "9 patches par bo\u00eete",
            "R\u00e9sultats d\u00e8s le lendemain",
            "Hypoallerg\u00e9nique"
        ],
        bestseller: false
    },
    {
        id: 6,
        name: "Masseur Facial \u00c9lectrique",
        category: "visage",
        price: 34.90,
        oldPrice: 49.90,
        emoji: "\u{1F9D6}",
        badge: null,
        rating: 4.7,
        reviews: 1342,
        description: "Masseur facial \u00e0 micro-courants et vibrations soniques. Tonifie, raffermit et sculpte l'ovale du visage naturellement.",
        features: [
            "Micro-courants EMS",
            "3 niveaux d'intensit\u00e9",
            "T\u00eate en alliage de zinc",
            "Rechargeable (2h = 30 jours)",
            "Mode contour yeux d\u00e9di\u00e9"
        ],
        bestseller: false
    },
    {
        id: 7,
        name: "Lampe Aromath\u00e9rapie Crystal",
        category: "aromatherapie",
        price: 39.90,
        oldPrice: null,
        emoji: "\u{1F56F}\uFE0F",
        badge: "new",
        rating: 4.5,
        reviews: 756,
        description: "Diffuseur d'huiles essentielles avec lampe LED cristal. Cr\u00e9e une ambiance zen tout en purifiant l'air de votre int\u00e9rieur.",
        features: [
            "Diffusion ultrasonique silencieuse",
            "LED 7 couleurs",
            "Timer 1h / 3h / 6h",
            "R\u00e9servoir 300ml",
            "Arr\u00eat automatique"
        ],
        bestseller: false
    },
    {
        id: 8,
        name: "Gua Sha Jade V\u00e9ritable",
        category: "visage",
        price: 19.90,
        oldPrice: 24.90,
        emoji: "\u{1F33F}",
        badge: null,
        rating: 4.8,
        reviews: 1876,
        description: "Pierre de Gua Sha en jade n\u00e9ph\u00e9rite authentique. Technique ancestrale chinoise pour drainer, d\u00e9congestionner et illuminer le visage.",
        features: [
            "Jade n\u00e9ph\u00e9rite certifi\u00e9",
            "Forme ergonomique multi-zones",
            "Guide de massage inclus",
            "Pochette en lin offerte",
            "Pierre unique, chaque pi\u00e8ce est diff\u00e9rente"
        ],
        bestseller: false
    },
    {
        id: 9,
        name: "Brume Hydratante Rose & HA",
        category: "corps",
        price: 18.90,
        oldPrice: null,
        emoji: "\u{1F339}",
        badge: null,
        rating: 4.6,
        reviews: 634,
        description: "Brume visage et corps \u00e0 l'eau de rose de Damas et acide hyaluronique. Hydrate et rafra\u00eechit instantan\u00e9ment \u00e0 tout moment de la journ\u00e9e.",
        features: [
            "Eau de rose de Damas bio",
            "Acide hyaluronique 3 poids mol\u00e9culaires",
            "Format voyage 100ml",
            "Brume ultra-fine",
            "Sans alcool, sans parfum synth\u00e9tique"
        ],
        bestseller: false
    },
    {
        id: 10,
        name: "Coffret Huiles Essentielles",
        category: "aromatherapie",
        price: 29.90,
        oldPrice: 39.90,
        emoji: "\u{1F33B}",
        badge: "promo",
        rating: 4.7,
        reviews: 1102,
        description: "Coffret de 6 huiles essentielles bio : lavande, eucalyptus, tea tree, citron, menthe poivr\u00e9e, orange douce. Certifi\u00e9es HEBBD.",
        features: [
            "6 huiles essentielles bio",
            "Certifi\u00e9es HEBBD",
            "Flacons verre ambr\u00e9 10ml",
            "Guide d'utilisation inclus",
            "Coffret bois recycl\u00e9"
        ],
        bestseller: false
    },
    {
        id: 11,
        name: "Bande de R\u00e9sistance Set Pro",
        category: "corps",
        price: 24.90,
        oldPrice: null,
        emoji: "\u{1F4AA}",
        badge: null,
        rating: 4.5,
        reviews: 543,
        description: "Set de 5 bandes de r\u00e9sistance en latex naturel. 5 niveaux pour un entra\u00eenement complet \u00e0 la maison. Id\u00e9al yoga, pilates et renforcement.",
        features: [
            "5 niveaux de r\u00e9sistance",
            "Latex naturel premium",
            "Sac de transport inclus",
            "Guide exercices PDF",
            "Anti-d\u00e9rapant"
        ],
        bestseller: false
    },
    {
        id: 12,
        name: "Bougie Massage 3 Beurres",
        category: "aromatherapie",
        price: 21.90,
        oldPrice: null,
        emoji: "\u{1F9F4}",
        badge: "new",
        rating: 4.8,
        reviews: 421,
        description: "Bougie de massage aux 3 beurres (karit\u00e9, cacao, mangue). Se transforme en huile de massage ti\u00e8de et nourrissante pour la peau.",
        features: [
            "3 beurres naturels bio",
            "Parfum fleur d'oranger",
            "Cire v\u00e9g\u00e9tale de soja",
            "M\u00e8che coton naturel",
            "Dur\u00e9e 40h environ"
        ],
        bestseller: false
    }
];
