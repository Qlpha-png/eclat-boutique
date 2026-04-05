// ============================
// ÉCLAT - Product Data
// ============================

const PRODUCTS = [
    {
        id: 1,
        name: "Masque LED 7 Couleurs",
        category: "visage",
        price: 39.90,
        oldPrice: 59.90,
        image: "images/products/masque-led.jpg",
        badge: "best",
        rating: 4.9,
        reviews: 2847,
        description: "Votre soin en institut, chez vous. Ce masque LED professionnel utilise 7 longueurs d'onde pour traiter l'acné, lisser les rides et redonner de l'éclat à votre peau. Résultats visibles dès 2 semaines.",
        features: [
            "7 longueurs d'onde ciblées",
            "Timer automatique 15 min",
            "Rechargeable USB-C",
            "Silicone souple ultra-confort",
            "Résultats prouvés en 14 jours"
        ],
        bestseller: true,
        bestsellerRank: 1
    },
    {
        id: 2,
        name: "Jade Roller Facial",
        category: "visage",
        price: 19.90,
        oldPrice: 29.90,
        image: "images/products/jade-roller.jpg",
        badge: "promo",
        rating: 4.8,
        reviews: 1923,
        description: "Le geste beauté du matin qui change tout. Ce roller en jade véritable stimule la circulation, dégonfle le visage et aide vos sérums à pénétrer 2x mieux. Votre peau vous dira merci.",
        features: [
            "Jade naturel certifié",
            "Double embout visage + yeux",
            "Écrin velours offert",
            "Pierre naturellement fraîche",
            "Guide rituel beauté inclus"
        ],
        bestseller: true,
        bestsellerRank: 2
    },
    {
        id: 3,
        name: "Gua Sha Quartz Rose",
        category: "visage",
        price: 17.90,
        oldPrice: null,
        image: "images/products/gua-sha.jpg",
        badge: "new",
        rating: 4.7,
        reviews: 1456,
        description: "L'outil ancestral qui sculpte votre visage naturellement. Ce Gua Sha en quartz rose draine, décongestionne et redessine l'ovale. 5 minutes par jour pour un effet lifting visible.",
        features: [
            "Quartz rose naturel",
            "Forme ergonomique multi-zones",
            "Guide de massage offert",
            "Pochette en lin incluse",
            "Chaque pierre est unique"
        ],
        bestseller: true,
        bestsellerRank: 3
    },
    {
        id: 4,
        name: "Sérum Vitamine C Pure",
        category: "visage",
        price: 24.90,
        oldPrice: 34.90,
        image: "images/products/serum-vitamine-c.jpg",
        badge: "promo",
        rating: 4.8,
        reviews: 2103,
        description: "Le secret d'un teint lumineux. Ce sérum concentré en vitamine C pure à 20% efface les taches, booste le collagène et révèle l'éclat naturel de votre peau en quelques semaines.",
        features: [
            "Vitamine C pure 20%",
            "Acide hyaluronique inclus",
            "Flacon pipette anti-oxydation",
            "Végan et cruelty-free",
            "Résultats en 3 semaines"
        ],
        bestseller: false
    },
    {
        id: 5,
        name: "Patchs Yeux Anti-Cernes Or",
        category: "visage",
        price: 12.90,
        oldPrice: null,
        image: "images/products/patchs-yeux.jpg",
        badge: "new",
        rating: 4.6,
        reviews: 987,
        description: "Fini les yeux fatigués. Ces patchs infusés au collagène et à l'or 24K dégonflent les poches, estompent les cernes et hydratent le contour des yeux en 20 minutes chrono.",
        features: [
            "Collagène + Or 24K",
            "Acide hyaluronique",
            "30 paires par boîte",
            "Effet frais immédiat",
            "Résultat visible dès la 1ère pose"
        ],
        bestseller: false
    },
    {
        id: 6,
        name: "Derma Roller Pro 0.5mm",
        category: "visage",
        price: 22.90,
        oldPrice: 32.90,
        image: "images/products/derma-roller.jpg",
        badge: null,
        rating: 4.7,
        reviews: 1342,
        description: "Le micro-needling professionnel à domicile. Stimule la production naturelle de collagène, réduit les cicatrices et affine le grain de peau. Vos sérums pénètrent 300% mieux.",
        features: [
            "540 micro-aiguilles titane",
            "0.5mm — idéal débutant",
            "Manche ergonomique",
            "Étui de protection inclus",
            "Compatible tous types de peau"
        ],
        bestseller: false
    },
    {
        id: 7,
        name: "Diffuseur Nuage de Pluie",
        category: "aromatherapie",
        price: 29.90,
        oldPrice: null,
        image: "images/products/diffuseur.jpg",
        badge: "new",
        rating: 4.5,
        reviews: 756,
        description: "Bien plus qu'un diffuseur. Ce nuage de pluie crée une ambiance zen avec ses gouttes d'eau apaisantes et sa lumière douce. Ajoutez vos huiles essentielles pour un moment de pure détente.",
        features: [
            "Effet pluie relaxant",
            "LED 7 couleurs d'ambiance",
            "Silencieux — idéal chambre",
            "Réservoir 300ml",
            "Arrêt automatique sécurité"
        ],
        bestseller: false
    },
    {
        id: 8,
        name: "Huile Visage Rose Musquée",
        category: "visage",
        price: 19.90,
        oldPrice: 24.90,
        image: "images/products/huile-rose.jpg",
        badge: null,
        rating: 4.8,
        reviews: 1876,
        description: "L'huile miracle des peaux exigeantes. La rose musquée régénère, atténue les cicatrices et nourrit en profondeur. Votre peau retrouve sa souplesse et son éclat naturel.",
        features: [
            "100% huile de rose musquée",
            "Pressée à froid",
            "Flacon pipette 30ml",
            "Convient peaux sensibles",
            "Anti-rides naturel puissant"
        ],
        bestseller: false
    },
    {
        id: 9,
        name: "Brosse Nettoyante Visage",
        category: "visage",
        price: 21.90,
        oldPrice: null,
        image: "images/products/brosse-visage.jpg",
        badge: null,
        rating: 4.6,
        reviews: 634,
        description: "Un nettoyage en profondeur tout en douceur. Cette brosse en silicone retire 99% des impuretés et résidus de maquillage. Votre peau respire, vos pores se resserrent.",
        features: [
            "Silicone ultra-doux",
            "Vibrations soniques",
            "Rechargeable USB",
            "Étanche — utilisable sous la douche",
            "Nettoie 6x mieux qu'à la main"
        ],
        bestseller: false
    },
    {
        id: 10,
        name: "Set Pinceaux Maquillage Pro",
        category: "outils",
        price: 24.90,
        oldPrice: 39.90,
        image: "images/products/pinceaux.jpg",
        badge: "promo",
        rating: 4.7,
        reviews: 1102,
        description: "13 pinceaux professionnels pour un maquillage impeccable. Fibres ultra-douces qui ne perdent pas leurs poils. Du teint aux yeux, chaque pinceau a sa mission.",
        features: [
            "13 pinceaux professionnels",
            "Fibres synthétiques premium",
            "Manches en bois naturel",
            "Pochette de rangement incluse",
            "Ne perdent pas leurs poils"
        ],
        bestseller: false
    },
    {
        id: 11,
        name: "Bandeau Spa Microfibre",
        category: "outils",
        price: 9.90,
        oldPrice: null,
        image: "images/products/bandeau-spa.jpg",
        badge: null,
        rating: 4.5,
        reviews: 543,
        description: "Le petit accessoire indispensable. Ce bandeau ultra-doux maintient vos cheveux pendant vos routines beauté. Confortable, absorbant, et tellement mignon.",
        features: [
            "Microfibre ultra-douce",
            "Élastique ajustable",
            "Lavable en machine",
            "Sèche rapidement",
            "Taille unique"
        ],
        bestseller: false
    },
    {
        id: 12,
        name: "Éponge Konjac Naturelle",
        category: "visage",
        price: 8.90,
        oldPrice: null,
        image: "images/products/eponge-konjac.jpg",
        badge: "new",
        rating: 4.8,
        reviews: 421,
        description: "100% naturelle, 0% chimique. Cette éponge de racine de konjac nettoie en douceur, exfolie naturellement et convient même aux peaux les plus sensibles. Biodégradable.",
        features: [
            "100% racine de konjac",
            "Exfoliation naturelle douce",
            "Convient peaux sensibles",
            "Biodégradable",
            "Durée de vie 2-3 mois"
        ],
        bestseller: false
    }
];
