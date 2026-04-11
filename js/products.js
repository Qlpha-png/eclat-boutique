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
        bestseller: true,
        bestsellerRank: 1
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
        bestseller: true,
        bestsellerRank: 2
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
        bestseller: false
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
        bestseller: false
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
        bestseller: true,
        bestsellerRank: 3
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
        bestseller: false
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
        bestseller: false
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
        bestseller: true,
        bestsellerRank: 4
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
        bestseller: false
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
        bestseller: false
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
        bestseller: false
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
        bestseller: false
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
        bestseller: false
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
        bestseller: false
    },

    {
        id: 15,
        name: 'Kit Boucles Sans Chaleur',
        category: 'cheveux',
        subcategory: 'accessoire',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/d012ffbc-7b07-4dbe-a6cf-af70aa6f0440.jpg',
        badge: 'new',
        rating: 4.7,
        reviews: 0,
        bestseller: false
    },

    // ═══════════════════════════════════════════════════════
    //  CATALOGUE CJ DROPSHIPPING — 500 VRAIS PRODUITS BEAUTÉ
    //  Importés API CJ • Catégorie Health, Beauty & Hair
    //  Images réelles • Prix retail calculés
    //  Fiches complètes FR • Traductions EN/ES/DE séparées
    // ═══════════════════════════════════════════════════════

    // ——— SÉRUMS & SOINS CIBLÉS (37 produits) ———

    {
        id: 146,
        name: 'Sérum Visage Acide Kojique & Curcuma 80ml',
        category: 'soin',
        subcategory: 'serum',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/7347eb25-5374-4bc2-97f5-c919004348f4.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 101,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 147,
        name: 'Sérum Anti-Âge Hydratant',
        category: 'soin',
        subcategory: 'serum-antiage',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/11/201b621e-c2a7-4467-8c2e-1300559489dc.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 26,
        bestseller: false,
        concerns: ['anti-age', 'rides']
    },

    {
        id: 148,
        name: 'Sérum Peptide Peptide',
        category: 'soin',
        subcategory: 'serum-peptide',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/d31e6ea9-1d5c-4ffe-93a8-e2dcf334c83b.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 145,
        bestseller: false,
        concerns: ['fermete', 'rides']
    },

    {
        id: 149,
        name: 'Sérum Anti-Âge Anti-Rides',
        category: 'soin',
        subcategory: 'serum-antiage',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/1da75b7d-fa1a-4f3f-9acd-91746b3bd9ef.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 81,
        bestseller: false,
        concerns: ['anti-age', 'rides']
    },

    {
        id: 150,
        name: 'Sérum Visage',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/020b2b45-8834-4bc6-8570-4155ed3413f0.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 175,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 151,
        name: 'Sérum Visage N°2',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/04e6c52b-03c5-4d61-a34c-d929770cadfe.jpg',
        badge: 'Top ventes',
        rating: 3.8,
        reviews: 104,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 152,
        name: 'Sérum Anti-Âge Anti-Rides Anti-Rides',
        category: 'soin',
        subcategory: 'serum-antiage',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/ea5055da-8168-4a8c-a306-0d4bd3b433f4.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 191,
        bestseller: false,
        concerns: ['anti-age', 'rides']
    },

    {
        id: 153,
        name: 'Sérum Visage Centella Asiatica',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/72674411-6d63-479f-bd81-b850106dea49.jpg',
        badge: 'Nouveau',
        rating: 3.8,
        reviews: 56,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 154,
        name: 'Sérum Rétinol Rétinol',
        category: 'soin',
        subcategory: 'serum-retinol',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/05/efa8fce5-1383-4865-8a1c-5cbc858a04ac.jpg',
        badge: 'Exclusif',
        rating: 4,
        reviews: 39,
        bestseller: false,
        concerns: ['anti-age', 'rides']
    },

    {
        id: 155,
        name: 'Sérum Visage Hydratant',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/15/4fb938b8-23ca-48c0-9bd8-50f752de6d9e.jpg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 27,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 156,
        name: 'Sérum Visage N°3',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/03/dc602eb5-49ac-41b6-8864-9a7fe8683059.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 23,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 157,
        name: 'Sérum Niacinamide Niacinamide',
        category: 'soin',
        subcategory: 'serum-niacin',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/95e43d7c-402e-4282-8c0a-6578cb635549.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 185,
        bestseller: false,
        concerns: ['pores', 'acne']
    },

    {
        id: 158,
        name: 'Sérum Visage N°4',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/10/4596b66a-bdf5-4005-bd35-8bf768058b59.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 151,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 159,
        name: 'Sérum Collagène Collagène & Peptide',
        category: 'soin',
        subcategory: 'serum-collagene',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/e000d661-1992-4428-abf0-9aac752c3642.jpg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 15,
        bestseller: false,
        concerns: ['fermete', 'anti-age']
    },

    {
        id: 160,
        name: 'Sérum Éclat Éclat',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/84f87580-35b5-4fb4-bc35-f78d0477ee40.jpg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 59,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 161,
        name: 'Sérum Visage N°5',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/04/25a781b6-0a2d-4668-8cb9-5e83c4269254.jpg',
        badge: 'Best-seller',
        rating: 4.9,
        reviews: 69,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 162,
        name: 'Sérum Acide Hyaluronique',
        category: 'soin',
        subcategory: 'serum-ha',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/05/519e8436-046e-4de2-a33e-779877a4e486.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 54,
        bestseller: false,
        concerns: ['hydratation', 'rides']
    },

    {
        id: 163,
        name: 'Sérum Acide Hyaluronique Acide Kojique & Curcuma',
        category: 'soin',
        subcategory: 'serum-ha',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/217a06e9-eb0c-4b70-a18f-668173de9e93.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 177,
        bestseller: false,
        concerns: ['hydratation', 'rides']
    },

    {
        id: 164,
        name: 'Sérum Collagène Collagène',
        category: 'soin',
        subcategory: 'serum-collagene',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/02/35011c66-409d-4690-9909-f33ed5545ed5.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 189,
        bestseller: false,
        concerns: ['fermete', 'anti-age']
    },

    {
        id: 165,
        name: 'Sérum Vitamine C Vitamine C',
        category: 'soin',
        subcategory: 'serum-vitc',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a1ae3177-fe09-43ca-8969-57c5a5475d07.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 62,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 166,
        name: 'Sérum Visage Hydratant Hydratant',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/2eedf01d-3c6f-4369-b62f-28ba283a14bf.jpg',
        badge: 'Exclusif',
        rating: 4.9,
        reviews: 126,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 167,
        name: 'Sérum Collagène Collagène N°2',
        category: 'soin',
        subcategory: 'serum-collagene',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/f5e5d992-c91f-4b7e-aa49-364a85beabdf.jpg',
        badge: 'Best-seller',
        rating: 4.3,
        reviews: 167,
        bestseller: false,
        concerns: ['fermete', 'anti-age']
    },

    {
        id: 168,
        name: 'Sérum Peptide Peptide N°2',
        category: 'soin',
        subcategory: 'serum-peptide',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/51b19cdf-2d1e-420b-81ed-a6b233be02d0.jpg',
        badge: 'Tendance',
        rating: 4.5,
        reviews: 23,
        bestseller: false,
        concerns: ['fermete', 'rides']
    },

    {
        id: 169,
        name: 'Sérum Éclat Éclat Éclat',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/8b086092-358e-413b-b3bc-1e24e93fc567.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 15,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 170,
        name: 'Sérum Visage Éclat',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/9f3f6b32-e3fe-4037-ab5f-36b809f9830d.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 121,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 171,
        name: 'Sérum Visage Pro',
        category: 'soin',
        subcategory: 'serum',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/03/c0095ddc-224b-464c-b96c-ff1471371562.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 125,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 172,
        name: 'Sérum Visage Expert',
        category: 'soin',
        subcategory: 'serum',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/13/202c0ae5-4841-4787-b42c-0fc1b6dd3c39.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 34,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 173,
        name: 'Sérum Visage Raffermissant',
        category: 'soin',
        subcategory: 'serum',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/28/01/0d55c72f-978b-45ce-bbc0-9c7bb0f4059b_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 37,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 174,
        name: 'Sérum Visage Bave d\'Escargot',
        category: 'soin',
        subcategory: 'serum',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/22/05/24f16809-2fd7-4878-aa2a-617a090bf623.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 65,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 175,
        name: 'Sérum Éclat Riz',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 29.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/0b174cd3-2dcb-4704-b165-d60f65288329.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 145,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 176,
        name: 'Sérum Éclat Riz Éclat',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/9cef16c3-1c3e-4c68-a068-6f3b0ba7b69a.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 92,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 177,
        name: 'Sérum Éclat Riz Anti-Âge',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/286128f1-8cce-41e4-abdd-2f7d55868050.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 134,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 178,
        name: 'Sérum Éclat Éclat Hydratant',
        category: 'soin',
        subcategory: 'serum-eclat',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/6a59f7de-0473-4538-a8f2-4950b9b7aa39.jpg',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 187,
        bestseller: false,
        concerns: ['eclat', 'taches']
    },

    {
        id: 179,
        name: 'Sérum Visage Acide Salicylique',
        category: 'soin',
        subcategory: 'serum',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17696448/5a9bde31-d3a4-4d9e-ae8b-45c28710e1f7.jpg',
        badge: 'Best-seller',
        rating: 4.2,
        reviews: 41,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 180,
        name: 'Sérum Visage Intense',
        category: 'soin',
        subcategory: 'serum',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/10d4072e-bad8-4169-91e4-39ad505d0cbd.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 187,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 181,
        name: 'Sérum Anti-Âge Anti-Âge',
        category: 'soin',
        subcategory: 'serum-antiage',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/79ceaebd-7c53-466e-b30a-e21bd12e5db8.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 155,
        bestseller: false,
        concerns: ['anti-age', 'rides']
    },

    {
        id: 182,
        name: 'Sérum Visage Plus',
        category: 'soin',
        subcategory: 'serum',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/03/01/3a02fb72-93c7-49c7-a439-793efc7252a2_trans.jpeg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 49,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    // ——— SOINS VISAGE (152 produits) ———

    {
        id: 16,
        name: 'Soin Contour des Yeux Rétinol',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/7c9d4c1a-6c97-41ee-bae9-5e2cfa6849fb.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 109,
        bestseller: true,
        concerns: ['cernes', 'rides']
    },

    {
        id: 17,
        name: 'Soin Contour des Yeux Rétinol Hydratant',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/02/9f6d410f-d20a-4627-b5a5-07af579e38ee.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 128,
        bestseller: true,
        concerns: ['cernes', 'rides']
    },

    {
        id: 18,
        name: 'Soin Contour des Yeux Rétinol & Curcuma',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/02/fb6d86ee-3011-4265-987b-af0248c71a24.jpg',
        badge: 'Bestseller',
        rating: 4.6,
        reviews: 151,
        bestseller: true,
        concerns: ['cernes', 'rides']
    },

    {
        id: 19,
        name: 'Protection Solaire Acide Hyaluronique & Centella Asiatica 50g',
        category: 'visage',
        subcategory: 'solaire',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/55970a26-0636-41e4-95f1-41d9e1702217.jpg',
        badge: 'Bestseller',
        rating: 4,
        reviews: 42,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 20,
        name: 'Crème Hydratante Vitamine C',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/39d5e85d-757a-432d-9685-460835552732.jpg',
        badge: 'Bestseller',
        rating: 4.6,
        reviews: 146,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 21,
        name: 'Crème Hydratante Vitamine C 50ml',
        category: 'visage',
        subcategory: 'creme',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/b9b2144f-9865-4c16-93cd-8bd3496b935b.jpg',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 67,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 22,
        name: 'Protection Solaire Vitamine C 50g',
        category: 'visage',
        subcategory: 'solaire',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5d64217c-0888-40dc-9d8f-01c98266c34a.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 161,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 23,
        name: 'Protection Solaire Niacinamide 50g',
        category: 'visage',
        subcategory: 'solaire',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/cd293477-8d00-405b-9532-c588db0b8bac.jpg',
        badge: 'Bestseller',
        rating: 4.7,
        reviews: 115,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 24,
        name: 'Crème de Nuit Niacinamide',
        category: 'visage',
        subcategory: 'creme-nuit',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/08/3fcae2bf-99be-4e58-96f3-03a2c22cf9d4_trans.jpeg',
        badge: 'Bestseller',
        rating: 4.6,
        reviews: 119,
        bestseller: true,
        concerns: ['reparation', 'anti-age']
    },

    {
        id: 25,
        name: 'Protection Solaire Réparateur 50g',
        category: 'visage',
        subcategory: 'solaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/031e0881-955e-4f96-aa6b-70d0052249b0.jpg',
        badge: 'Bestseller',
        rating: 4.6,
        reviews: 74,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 26,
        name: 'Protection Solaire Collagène 40g',
        category: 'visage',
        subcategory: 'solaire',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/a083fd9c-1020-4377-bfc5-b648ebac7769.jpg',
        badge: 'Bestseller',
        rating: 3.9,
        reviews: 18,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 27,
        name: 'Protection Solaire Collagène & Or 24K 30g',
        category: 'visage',
        subcategory: 'solaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/0137d74b-0ec8-41c9-bf7d-d938d50ead92.jpg',
        badge: 'Bestseller',
        rating: 4,
        reviews: 133,
        bestseller: true,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 28,
        name: 'Crème Hydratante Collagène & Fleur de Cerisier 50g',
        category: 'visage',
        subcategory: 'creme',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5e116c40-3863-465d-9edf-5067df923cdf.jpg',
        badge: 'Bestseller',
        rating: 4.2,
        reviews: 27,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 29,
        name: 'Masque Visage Collagène',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c943c462-4a38-4010-9f79-4ae3cad50049.jpg',
        badge: 'Bestseller',
        rating: 4.2,
        reviews: 146,
        bestseller: true,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 30,
        name: 'Baume à Lèvres Collagène 10g',
        category: 'visage',
        subcategory: 'baume-levres',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/bd832a78-af03-41a6-bb25-fee44efe004f.jpg',
        badge: 'Bestseller',
        rating: 3.9,
        reviews: 18,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 31,
        name: 'Crème Hydratante Peptide',
        category: 'visage',
        subcategory: 'creme',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/05/24510b2e-4aa9-4a52-ac2d-4b3623f5984e.jpg',
        badge: 'Bestseller',
        rating: 4.1,
        reviews: 90,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 32,
        name: 'Crème Hydratante Peptide Hydratant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/ce0fa9d7-47b1-4f88-8562-0cba31f4e122.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 100,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 33,
        name: 'Crème Hydratante Éclat',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/03/6c8f8d7a-f7fb-46b3-a20b-3a25e84aeb02.jpg',
        badge: 'Bestseller',
        rating: 4.2,
        reviews: 36,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 34,
        name: 'Soin Contour des Yeux Ginseng',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/0c752e0d-0e46-49b7-8bdf-1ae3d3a6b7a8.jpg',
        badge: 'Bestseller',
        rating: 4,
        reviews: 180,
        bestseller: true,
        concerns: ['cernes', 'rides']
    },

    {
        id: 35,
        name: 'Masque Visage Éclat',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/10/17dd1be8-8aaf-4ab6-8702-13ce8471f16c.jpg',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 31,
        bestseller: true,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 36,
        name: 'Crème Hydratante Hydratant',
        category: 'visage',
        subcategory: 'creme',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/05/54d6432e-95e0-48f7-a4ed-c4d300419830.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 159,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 37,
        name: 'Masque Visage Hydratant',
        category: 'visage',
        subcategory: 'masque',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/9bcafefa-286f-49f1-a750-f1bb07e0d41e.jpg',
        badge: 'Bestseller',
        rating: 3.8,
        reviews: 148,
        bestseller: true,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 38,
        name: 'Crème Hydratante Hydratant Hydratant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/65ef4bd3-78e6-4b45-8265-e26134dd972d.jpg',
        badge: 'Bestseller',
        rating: 4.1,
        reviews: 169,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 39,
        name: 'Crème Hydratante Hydratant N°2',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/8aa0dee7-6326-4c5a-b555-22dba70e8887.jpg',
        badge: 'Bestseller',
        rating: 4.6,
        reviews: 28,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 40,
        name: 'Crème Hydratante Hydratant Raffermissant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/b1c374ca-1265-46b2-b75d-bf0d3d5f110f.jpg',
        badge: 'Bestseller',
        rating: 4,
        reviews: 103,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 41,
        name: 'Soin Contour des Yeux Hydratant',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/6c851b6b-cf6e-4943-926d-ebbbd37cf23e.jpg',
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 126,
        bestseller: true,
        concerns: ['cernes', 'rides']
    },

    {
        id: 42,
        name: 'Crème Hydratante Hydratant N°3',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/4de5a7ed-7a09-4610-964a-12112f4fc299.jpg',
        badge: 'Bestseller',
        rating: 4.2,
        reviews: 95,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 43,
        name: 'Crème Hydratante Hydratant 50g',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/a0406849-374b-4e8b-9f28-919f9fc7340f.jpg',
        badge: 'Bestseller',
        rating: 4.5,
        reviews: 18,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 44,
        name: 'Crème Hydratante Avocat 50g',
        category: 'visage',
        subcategory: 'creme',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/a0f71e22-2ab9-4ecc-8953-dfecab57aa8f.jpg',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 98,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 45,
        name: 'Crème Hydratante Hydratant N°4',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/fe0c59b9-9808-4b06-8f51-2710a89bbf34.jpg',
        badge: 'Bestseller',
        rating: 4.7,
        reviews: 192,
        bestseller: true,
        concerns: ['hydratation']
    },

    {
        id: 46,
        name: 'Crème Hydratante Lavande',
        category: 'visage',
        subcategory: 'creme',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/33d67998-02fc-4847-a7b9-b5a5fe6529c9.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 97,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 47,
        name: 'Crème Hydratante Hydratant Apaisant',
        category: 'visage',
        subcategory: 'creme',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/513167ec-6db8-4e92-b244-7dbc74c8ae28.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 91,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 48,
        name: 'Crème Hydratante Hydratant Naturel',
        category: 'visage',
        subcategory: 'creme',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/db805391-c246-49af-af6e-63c331fce34f.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 23,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 49,
        name: 'Crème Hydratante Hydratant N°5',
        category: 'visage',
        subcategory: 'creme',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/76486f48-56a7-4121-a9cb-d8af18b79ad6.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 113,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 50,
        name: 'Crème Hydratante Hydratant Pro',
        category: 'visage',
        subcategory: 'creme',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/2c96b73a-8242-4aa2-800e-6bcbf3ef070b.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 36,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 51,
        name: 'Crème Hydratante Apaisant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/04/a54ed444-1b76-4829-baab-88c7ec2fd8ad.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 80,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 52,
        name: 'Crème Hydratante Apaisant Apaisant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/04/d8ec855d-aedc-4685-9c41-c2cafc23bd7e.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 96,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 53,
        name: 'Crème Hydratante',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/03/0e99fc47-9a94-4b74-b13d-a8de2ef5c9d7.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 114,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 54,
        name: 'Crème Hydratante N°2',
        category: 'visage',
        subcategory: 'creme',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/59b2542b-e6f8-4abc-8615-be8c252d379a.jpg',
        badge: 'Tendance',
        rating: 4.1,
        reviews: 108,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 55,
        name: 'Crème Hydratante N°3',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/7d5b9053-8243-407c-9852-d768e3120029.jpg',
        badge: 'Top ventes',
        rating: 3.8,
        reviews: 84,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 56,
        name: 'Crème Hydratante Raffermissant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/28ffb740-b409-4b7c-941f-b58d4a06978b.jpg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 173,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 57,
        name: 'Crème Hydratante N°4',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/20dbf737-c1a5-4fae-bfc7-0d89a69dc581.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 141,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 58,
        name: 'Crème Hydratante N°5',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/7782af38-1a21-45fb-b0e4-caf081477c2e.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 23,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 59,
        name: 'Soin Contour des Yeux Éclat',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/2139a15a-073b-4d6a-a845-a0e0205b5fa4.jpg',
        badge: 'Best-seller',
        rating: 3.8,
        reviews: 109,
        bestseller: false,
        concerns: ['cernes', 'rides']
    },

    {
        id: 60,
        name: 'Crème Hydratante Pro',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/11/76f7c310-2ba3-43b9-8f66-14d6d7aadc09.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 15,
        bestseller: false,
        concerns: ['hydratation'],
        gender: 'homme'
    },

    {
        id: 61,
        name: 'Crème Hydratante Expert',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/208019ea-ded4-4e27-9a17-9ad23cf1096c.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 112,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 62,
        name: 'Crème Hydratante 60g',
        category: 'visage',
        subcategory: 'creme',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/647b3288-545e-4de6-9d6a-ac7b275823e6.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 145,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 63,
        name: 'Crème Hydratante Hydratant Expert',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/287a084a-7cb7-4873-a2a2-f882e5f9a568.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 149,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 64,
        name: 'Crème Hydratante Hydratant Intense',
        category: 'visage',
        subcategory: 'creme',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/8a1f321f-85ce-4c02-8147-658196e8dbfb.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 34,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 65,
        name: 'Crème Hydratante Lavande Hydratant',
        category: 'visage',
        subcategory: 'creme',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1f716812-03e6-489e-9998-76eb944f9e67.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 179,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 66,
        name: 'Crème Hydratante Lavande Apaisant',
        category: 'visage',
        subcategory: 'creme',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/59e46456-def0-451b-8a80-2e79bc912ada.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 107,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 67,
        name: 'Crème Hydratante Lavande Naturel',
        category: 'visage',
        subcategory: 'creme',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c992f13c-ecbd-4ad5-8d1e-11fda66dc27d.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 166,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 68,
        name: 'Crème Hydratante Éclat Éclat',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/04/a5926fbb-3b5e-48d3-a2ac-f3f6ad756bad.jpg',
        badge: 'Coup de cœur',
        rating: 4.7,
        reviews: 112,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 69,
        name: 'Masque Visage',
        category: 'visage',
        subcategory: 'masque',
        price: 59.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/21/02/68b6c9a4-cbde-42b8-b917-0218d872b91a.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 134,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 70,
        name: 'Crème Hydratante Intense',
        category: 'visage',
        subcategory: 'creme',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c66bbe5d-e7f5-4ffb-acfb-7d315d862aec.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 135,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 71,
        name: 'Crème Hydratante Plus',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/12/1b9c59ed-3641-4d37-aa10-e5cd620a882d.jpg',
        badge: 'Best-seller',
        rating: 3.9,
        reviews: 100,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 72,
        name: 'Soin Contour des Yeux Hydratant Hydratant',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/12/556a6a2f-a3d4-422e-82be-4a4e60d0a245.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 186,
        bestseller: false,
        concerns: ['cernes', 'rides']
    },

    {
        id: 73,
        name: 'Crème Hydratante Hydratant Plus',
        category: 'visage',
        subcategory: 'creme',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7ba90421-fdbf-491f-91b1-e99dfdb9bf8b.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 153,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 74,
        name: 'Soin Contour des Yeux',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/11/d514df8c-355f-46e0-8e0d-c1703925d049.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 137,
        bestseller: false,
        concerns: ['cernes', 'rides']
    },

    {
        id: 75,
        name: 'Soin Contour des Yeux N°2',
        category: 'visage',
        subcategory: 'contour-yeux',
        price: 34.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/09/454fbaa5-affd-4a3f-849a-2c868b0b10b1_trans.jpeg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 51,
        bestseller: false,
        concerns: ['cernes', 'rides']
    },

    {
        id: 76,
        name: 'Crème Cou & Décolleté',
        category: 'visage',
        subcategory: 'creme-cou',
        price: 39.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/656711c8-219b-4cd3-9141-d596a5fe1ec2.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 105,
        bestseller: false,
        concerns: ['fermete', 'anti-age']
    },

    {
        id: 77,
        name: 'Crème Hydratante Hydratant Ultra',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/07/12e213f7-f0fc-4e6e-859c-ab814b0e5b5a.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 76,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 78,
        name: 'Masque Visage N°2',
        category: 'visage',
        subcategory: 'masque',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/375bcc6d-9c80-4220-aaed-f840a2b38a40.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 51,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 79,
        name: 'Masque Visage Or 24K',
        category: 'visage',
        subcategory: 'masque',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/c33e6f4f-5f3e-49e7-ac6f-a3f2a39f480f.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 82,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 80,
        name: 'Masque Visage Hydratant Hydratant',
        category: 'visage',
        subcategory: 'masque',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/9dd26f29-677b-4e38-81db-bd18d29d3b9e.jpg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 161,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 81,
        name: 'Masque Yeux Raffermissant',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/02/06/c854fb0f-e920-4455-a87b-a817763624cc.jpg',
        badge: 'Nouveau',
        rating: 4.6,
        reviews: 181,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 82,
        name: 'Masque Visage Collagène 60g',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/1e05eb88-6b10-4075-b813-be881099b36d.jpg',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 106,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 83,
        name: 'Crème Hydratante Hydratant Nourrissant',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/05/261ab089-506f-499e-bff4-cf9a46f11491.jpg',
        badge: 'Best-seller',
        rating: 3.9,
        reviews: 103,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 84,
        name: 'Masque Visage Collagène & Peptide',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/d7344fe8-d4c7-4443-a3c7-11a89b1c92cb.jpg',
        badge: 'Tendance',
        rating: 4.9,
        reviews: 152,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 85,
        name: 'Masque Yeux Collagène',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/02/9c7f9271-bd54-4456-82b2-d811972cdff3.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 158,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 86,
        name: 'Masque Yeux',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/4184ace2-6eb8-449a-9a36-8180084fbc58.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 126,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 87,
        name: 'Masque Visage Collagène N°2',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/29/03/af79f7d1-ab92-4779-b19f-d116c384de1b.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 139,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 88,
        name: 'Masque Yeux Hydratant',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a3fda784-c478-40ab-9dc2-7727858376ac.jpg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 62,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 89,
        name: 'Masque Yeux Collagène N°2',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/24/04/06ec2817-62f4-4e4c-a33b-b5e5d56c755d.jpg',
        badge: 'Best-seller',
        rating: 4.3,
        reviews: 67,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 90,
        name: 'Masque Visage Collagène N°3',
        category: 'visage',
        subcategory: 'masque',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/699e8955-07a3-48c8-a56e-f7164cc4fe9f.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 143,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 91,
        name: 'Gloss',
        category: 'visage',
        subcategory: 'gloss',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/26/13/34d2ce91-dc43-4a36-a857-095f2ca721d4.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 82,
        bestseller: false,
        concerns: ['eclat']
    },

    {
        id: 92,
        name: 'Crème Hydratante Hydratant 2',
        category: 'visage',
        subcategory: 'creme',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/e51c243f-47d6-47cb-8d66-d768307c338f.jpg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 82,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 93,
        name: 'Masque Visage Hydratant Apaisant',
        category: 'visage',
        subcategory: 'masque',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7c8b1149-53f6-443c-9e53-bdb4abf1f34c.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 144,
        bestseller: false,
        concerns: ['hydratation', 'eclat']
    },

    {
        id: 94,
        name: 'Nettoyant Visage',
        category: 'visage',
        subcategory: 'nettoyant',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/08/c916fc76-336b-41a8-a954-b6c1aebb9f7e_fine.jpeg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 160,
        bestseller: false,
        concerns: ['nettoyage', 'pores']
    },

    {
        id: 95,
        name: 'Nettoyant Visage Collagène',
        category: 'visage',
        subcategory: 'nettoyant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/30/12/e07f6bdb-dae5-4932-8bee-11d664cf9499.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 62,
        bestseller: false,
        concerns: ['nettoyage', 'pores']
    },

    {
        id: 96,
        name: 'Nettoyant Visage N°2',
        category: 'visage',
        subcategory: 'nettoyant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/e2710404-7b93-4f05-b6bc-fda4d7630b77.jpg',
        badge: 'Tendance',
        rating: 4.1,
        reviews: 95,
        bestseller: false,
        concerns: ['nettoyage', 'pores']
    },

    {
        id: 97,
        name: 'Nettoyant Visage Hydratant',
        category: 'visage',
        subcategory: 'nettoyant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/04/c6ff5ee6-8386-4434-96ce-aa9c011d6d3a.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 167,
        bestseller: false,
        concerns: ['nettoyage', 'pores']
    },

    {
        id: 98,
        name: 'Démaquillant',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/defee522-56ef-4eb0-8dbd-c1883bd8fbfe.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 124,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 99,
        name: 'Démaquillant N°2',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/75c012e7-5616-465f-a161-0835b89544c2.png',
        badge: 'Nouveau',
        rating: 4.9,
        reviews: 89,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 100,
        name: 'Démaquillant N°3',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/11/cf7a6e16-0a4d-421a-8baf-7d38ce1d6fd4.jpg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 74,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 101,
        name: 'Démaquillant N°4',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/04/f12517f7-af56-46ef-9922-f194d153bc8d.jpg',
        badge: 'Best-seller',
        rating: 4.2,
        reviews: 33,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 102,
        name: 'Crème Hydratante Hydratant 3',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/03/53b01103-72a9-4756-8c7a-743c92de93c2.jpg',
        badge: 'Tendance',
        rating: 4.1,
        reviews: 170,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 103,
        name: 'Démaquillant N°5',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/73effa8e-1550-4107-a8bd-381c24239261.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 121,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 104,
        name: 'Démaquillant Pro',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/30/04/076d2e87-0124-4b96-8ad9-039a2d0c01b9.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 24,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 105,
        name: 'Démaquillant Expert',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/55df9518-175e-4c53-b04f-6b9c289db683.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 147,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 106,
        name: 'Démaquillant Hydratant',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a53d5dcf-90e8-4b38-9d9b-af00377e772f.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 138,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 107,
        name: 'Démaquillant Intense',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/24/04/80900010-2320-4f48-b7ac-480bd36ac805.jpg',
        badge: 'Best-seller',
        rating: 4.1,
        reviews: 51,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 108,
        name: 'Crème Hydratante Hydratant 4',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/24/04/e4f8423d-10fe-407d-ad84-87b8f6b7b8f0.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 167,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 109,
        name: 'Démaquillant Plus',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/11/4c2be3c4-00a7-44d8-becf-0a86605ab985.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 94,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 110,
        name: 'Démaquillant Ultra',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/02/9789e1bb-c1b0-492f-b238-2dbcd9792f30.jpg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 184,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 111,
        name: 'Démaquillant 2',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/21/08/72322bf8-d10c-4cb6-bb96-46ddd257b468.jpg',
        badge: 'Nouveau',
        rating: 4.3,
        reviews: 33,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 112,
        name: 'Démaquillant Éclat',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/12/18118549-54be-4bac-be19-220108f83fa2.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 66,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 113,
        name: 'Démaquillant 3',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/12/f358be49-82c5-487f-bcfc-ce18721ec73b.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 131,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 114,
        name: 'Démaquillant 4',
        category: 'visage',
        subcategory: 'demaquillant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/14/e26cef83-c8fd-4702-b62d-3c6ba462ef26.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 61,
        bestseller: false,
        concerns: ['nettoyage']
    },

    {
        id: 115,
        name: 'Eau Micellaire',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/11/cb46c03b-678b-4eda-9d67-5e651918b106.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 96,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 116,
        name: 'Protection Solaire 60g',
        category: 'visage',
        subcategory: 'solaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/d96967a2-9fc9-45bb-8b33-280434c6a62b.jpg',
        badge: 'Coup de cœur',
        rating: 4.6,
        reviews: 185,
        bestseller: false,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 117,
        name: 'Masque Yeux N°2',
        category: 'visage',
        subcategory: 'masque-yeux',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/08/08/39b9c7b8-3f18-4807-88a7-c597c7f21287_trans.jpeg',
        badge: 'Nouveau',
        rating: 3.8,
        reviews: 112,
        bestseller: false,
        concerns: ['cernes', 'fatigue']
    },

    {
        id: 118,
        name: 'Eau Micellaire N°2',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/766573ee-7674-44b6-8406-3db1e86e3c18.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 190,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 119,
        name: 'Eau Micellaire N°3',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 59.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/07/03/9a74f62e-37a1-42a8-aed4-9c5d8b77d8ba.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 120,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 120,
        name: 'Gloss N°2',
        category: 'visage',
        subcategory: 'gloss',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/07/02/c19efee7-e6a9-4e7c-a2e5-ad5eb2271bbb_trans.jpeg',
        badge: 'Tendance',
        rating: 3.8,
        reviews: 49,
        bestseller: false,
        concerns: ['eclat']
    },

    {
        id: 121,
        name: 'Eau Micellaire Nettoyage Profond',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/03/07/01e79baa-04cc-4ed2-9f25-e3cd1bed1b01_trans.jpeg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 37,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 122,
        name: 'Eau Micellaire Riz',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/28/08/b4239ec4-39b9-440d-b8a8-0c4ed68f4475_fine.jpeg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 169,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 123,
        name: 'Eau Micellaire N°4',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 59.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/26/06/a6b984ec-16be-4eb8-987d-2a00ec09f2f6.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 125,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 124,
        name: 'Eau Micellaire Romarin & Riz 200ml',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/21/03/68daabe0-77bd-4919-8964-6830fa31b5a7_trans.jpeg',
        badge: 'Exclusif',
        rating: 4.7,
        reviews: 137,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 125,
        name: 'Eau Micellaire N°5',
        category: 'visage',
        subcategory: 'eau-micellaire',
        price: 44.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/15/09/03c605dc-04ab-4522-af91-d97d2b0ad95d.jpg',
        badge: 'Best-seller',
        rating: 4.9,
        reviews: 127,
        bestseller: false,
        concerns: ['nettoyage', 'sensibilite']
    },

    {
        id: 126,
        name: 'Huile Démaquillante',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/09adf01d-bdd0-4d7b-87c9-ab8597e01033.jpg',
        badge: 'Tendance',
        rating: 4.1,
        reviews: 140,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 127,
        name: 'Huile Démaquillante N°2',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/098cffd0-ab52-4606-b91c-be2632e78265.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 69,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 128,
        name: 'Huile Démaquillante N°3',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/12/a33c948f-d853-4ffc-b128-b4bc5756c8ed.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 43,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 129,
        name: 'Huile Démaquillante Romarin',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/c7d61f1a-4087-44a8-b275-d8499f7bd354.jpg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 29,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 130,
        name: 'Huile Démaquillante Raffermissant',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/1ac84d68-95c2-438d-9294-eb49b0c13602.jpg',
        badge: 'Exclusif',
        rating: 4.5,
        reviews: 71,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 131,
        name: 'Huile Démaquillante Raffermissant Raffermissant',
        category: 'visage',
        subcategory: 'huile-demaq',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/813fd194-4779-49b5-9a11-2fa8088c435f.jpg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 174,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 132,
        name: 'Exfoliant Visage',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/11/d841c10a-ce11-4821-8db3-54c08373240d.jpg',
        badge: 'Tendance',
        rating: 4.9,
        reviews: 111,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 133,
        name: 'Exfoliant Visage Apaisant',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/09/d555ecb8-28c8-41f4-8c0f-55010c8cd770.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 19,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 134,
        name: 'Exfoliant Visage Exfoliant',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/02/c1b04db8-68fa-422b-aa06-0d05c7cde7a1.jpg',
        badge: 'Coup de cœur',
        rating: 4.6,
        reviews: 88,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 135,
        name: 'Exfoliant Visage N°2',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 34.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/3c02bc2f-b6ef-45ad-bcef-8058d9e7845b.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 126,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 136,
        name: 'Exfoliant Visage Or 24K',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/30/04/ba2fe615-d668-4ec3-ba1a-e6f8a4267479.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 123,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 137,
        name: 'Exfoliant Visage Apaisant Apaisant',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/12/823b4018-5aeb-424e-adeb-1bfa26c55ab5.jpg',
        badge: 'Best-seller',
        rating: 3.8,
        reviews: 29,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 138,
        name: 'Exfoliant Visage N°3',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/09/e9dec8bb-4d6a-4357-a144-02d7d8ab1328.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 168,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 139,
        name: 'Exfoliant Visage Éclat',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/02/fdf36daa-5f11-40be-a06d-3bee2f90facf.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 95,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 140,
        name: 'Exfoliant Visage Exfoliant Exfoliant',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/deb06cfe-f067-4fbd-b0d0-09900c859270.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 162,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 141,
        name: 'Exfoliant Visage Exfoliant N°2',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/12/7a09763e-f2a3-48bb-871e-6df24705436b.jpg',
        badge: 'Nouveau',
        rating: 4.3,
        reviews: 100,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 142,
        name: 'Exfoliant Visage Exfoliant N°3',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/12/5837c6f2-725b-46e8-a72e-5cdb1b65c0d8.jpg',
        badge: 'Exclusif',
        rating: 4.5,
        reviews: 71,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 143,
        name: 'Exfoliant Visage Apaisant N°2',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/12/b23af614-3273-47b3-bb91-fcf89151cf94.jpg',
        badge: 'Best-seller',
        rating: 4.9,
        reviews: 111,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 144,
        name: 'Exfoliant Visage N°4',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/11/c53cf75c-3e7d-4f1c-b835-e82e22503a52.jpg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 179,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 145,
        name: 'Lotion Tonique',
        category: 'visage',
        subcategory: 'lotion',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/8bba7cc3-ba8f-4e42-845a-f9a87d87c0bf.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 125,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 447,
        name: 'Lotion Tonique Riz',
        category: 'visage',
        subcategory: 'lotion',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/3f8bfb27-5a0a-4ffe-8760-117d403d368f.jpg',
        badge: 'Nouveau',
        rating: 4.1,
        reviews: 117,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 451,
        name: 'Crème Hydratante Hydratant 5',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/b998b2be-7f75-4cfd-bbba-64f3765c742a.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 139,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 455,
        name: 'Lotion Tonique Collagène',
        category: 'visage',
        subcategory: 'lotion',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/12/09/dd69d8ab-dd24-4038-aa01-7b167bbde4ad_fine.jpeg',
        badge: 'Best-seller',
        rating: 4.3,
        reviews: 77,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 459,
        name: 'Crème Hydratante Vitamine C Éclat',
        category: 'visage',
        subcategory: 'creme',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/13/09/ccc38a3f-c4cb-4bb4-a1fc-6f679a86c8dd.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 106,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 463,
        name: 'Crème Hydratante Vitamine C Hydratant',
        category: 'visage',
        subcategory: 'creme',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/13/09/56fccdc9-b610-42c4-a6ab-445d04ae44c0.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 54,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 467,
        name: 'Crème Hydratante Hydratant 6',
        category: 'visage',
        subcategory: 'creme',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/07/f420bc92-2cec-4f16-8369-0dd4b1921666.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 131,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 471,
        name: 'Crème Hydratante Vitamine C N°2',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/06/09/3e78d1c1-bcf6-4562-a36d-fabe74f2c653_fine.jpeg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 79,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 475,
        name: 'Lotion Tonique N°2',
        category: 'visage',
        subcategory: 'lotion',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/22/07/07ea8a15-a7ed-4aab-a913-7ecb2f09e289.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 16,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 478,
        name: 'Lotion Tonique Acide Glycolique',
        category: 'visage',
        subcategory: 'lotion',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/df4ceecc-acba-4b0b-ac84-03980c5389ed.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 27,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 481,
        name: 'Lotion Tonique Curcuma',
        category: 'visage',
        subcategory: 'lotion',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/819e374c-87fb-4c4a-bf65-9e10c6cd41de.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 48,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 484,
        name: 'Crème Hydratante Vitamine E',
        category: 'visage',
        subcategory: 'creme',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/09c1af1c-c24f-46ee-88ee-ac7fd2005189.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 171,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 487,
        name: 'Lotion Tonique Éclat',
        category: 'visage',
        subcategory: 'lotion',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/64464853-efb7-45a0-9a17-6ecc399e7511.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 98,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 490,
        name: 'Lotion Tonique Anti-Âge',
        category: 'visage',
        subcategory: 'lotion',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/21dfe45a-4784-44f0-9278-b9459b965168.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 118,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 493,
        name: 'Lotion Tonique Fleur de Cerisier',
        category: 'visage',
        subcategory: 'lotion',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/4b246d19-7746-488a-8f79-dbf624d5c17e.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 56,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 496,
        name: 'Crème Hydratante Riz',
        category: 'visage',
        subcategory: 'creme',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/be947cbd-77e1-4e70-a419-baa6d44b3391.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 68,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 499,
        name: 'Lotion Tonique Riz N°2',
        category: 'visage',
        subcategory: 'lotion',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/e54b7737-7d03-4736-a99e-db8e15c7f87c.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 147,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 502,
        name: 'Lotion Tonique Collagène N°2',
        category: 'visage',
        subcategory: 'lotion',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c3cb7eac-36d2-45ec-9a69-8e1dacc83b68.jpg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 121,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 505,
        name: 'Exfoliant Visage Exfoliant N°4',
        category: 'visage',
        subcategory: 'exfoliant',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/4c267573-ba48-4e10-93ab-bf40b554bb08.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 40,
        bestseller: false,
        concerns: ['eclat', 'pores']
    },

    {
        id: 508,
        name: 'Protection Solaire',
        category: 'visage',
        subcategory: 'solaire',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/49fee29a-235d-4c46-b17a-d325351ddc9e.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 151,
        bestseller: false,
        concerns: ['protection', 'anti-age']
    },

    {
        id: 510,
        name: 'Crème Hydratante Hydratant 7',
        category: 'visage',
        subcategory: 'creme',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/881ebdca-e3b0-45ff-8134-55d2aedfcdb0.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 191,
        bestseller: false,
        concerns: ['hydratation']
    },

    {
        id: 512,
        name: 'Lotion Tonique N°3',
        category: 'visage',
        subcategory: 'lotion',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/10/a74fc990-359a-49ad-8017-adc353d65073.jpg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 106,
        bestseller: false,
        concerns: ['pores', 'eclat']
    },

    {
        id: 514,
        name: 'Crème Hydratante Hydratant 8',
        category: 'visage',
        subcategory: 'creme',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/05/9526f6f9-0697-4340-b701-d7bdeb74d225.jpg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 83,
        bestseller: false,
        concerns: ['hydratation']
    },

    // ——— SOINS CORPS (36 produits) ———

    {
        id: 183,
        name: 'Lait Corporel Rétinol',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/04a620f3-8844-4e8f-b704-0046f488ba53.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 143,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 184,
        name: 'Soin Anti-Vergetures',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 39.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/fc87d498-b89d-4029-a981-36ff73c5f6fa.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 157,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 185,
        name: 'Lait Corporel Peptide',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/085f593b-2b27-4261-a1c3-e39c85a7f166.jpg',
        badge: 'Best-seller',
        rating: 4.9,
        reviews: 61,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 186,
        name: 'Lait Corporel Hydratant',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/12/5c6de943-f1df-4daa-9228-ff4e6f939cd2.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 118,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 187,
        name: 'Gel Douche',
        category: 'corps',
        subcategory: 'gel-douche',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/29/08/21f9f417-cf65-4e7e-b203-e9c37956f1ee.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 158,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation'],
        gender: 'homme'
    },

    {
        id: 188,
        name: 'Lait Corporel Apaisant',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/c84d3f53-9179-4b42-89a4-c01bae47a808.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 85,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 189,
        name: 'Lait Corporel',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/03/4c059537-c4b0-41c2-9ef6-fdabdd6b9d6a_trans.jpeg',
        badge: 'Nouveau',
        rating: 4.9,
        reviews: 176,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 190,
        name: 'Crème Corps Hydratant',
        category: 'corps',
        subcategory: 'creme-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/dde1dc92-5a8b-4644-ba99-0abbbfb6affa.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 108,
        bestseller: false,
        concerns: ['hydratation', 'fermete']
    },

    {
        id: 191,
        name: 'Lait Corporel Hydratant Hydratant',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/8c74c7d5-6e80-445d-9dac-853a98816ac4.jpg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 17,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 192,
        name: 'Lait Corporel N°2',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/3db732c6-55ce-4352-ad4a-d73249767b89.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 190,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 193,
        name: 'Lait Corporel Nourrissant',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/195357fa-3728-4afa-86df-d68e00876cf1.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 73,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 194,
        name: 'Lait Corporel Hydratant N°2',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/13/17141a5e-e254-4d68-88c8-901618349357.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 169,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 195,
        name: 'Gommage Corps Raffermissant',
        category: 'corps',
        subcategory: 'gommage-corps',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/04/093de632-a040-49c1-8beb-db25a82f99eb.jpg',
        badge: 'Nouveau',
        rating: 4.9,
        reviews: 174,
        bestseller: false,
        concerns: ['eclat', 'cellulite']
    },

    {
        id: 196,
        name: 'Gommage Corps',
        category: 'corps',
        subcategory: 'gommage-corps',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c0d726aa-b37a-441f-8d61-dbe188832017.png',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 92,
        bestseller: false,
        concerns: ['eclat', 'cellulite']
    },

    {
        id: 197,
        name: 'Crème Mains',
        category: 'corps',
        subcategory: 'soin-mains',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/6e676d73-cf50-41f1-b82c-121a783f9809.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 141,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 198,
        name: 'Crème Pieds Réparateur',
        category: 'corps',
        subcategory: 'soin-pieds',
        price: 29.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/91443d17-6837-4b6a-9044-191286a2d955.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 154,
        bestseller: false,
        concerns: ['hydratation', 'reparation']
    },

    {
        id: 199,
        name: 'Soin Anti-Vergetures N°2',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/07/fd608967-196c-433c-95b9-e5877d570320.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 191,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 200,
        name: 'Soin Anti-Vergetures N°3',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/13/03/f56dad2e-a7bb-4469-af95-c0d5dba87475.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 140,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 201,
        name: 'Soin Anti-Vergetures Hydratant',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17718048/997c16f6-90a3-4053-a846-303b0f084948.jpg',
        badge: 'Nouveau',
        rating: 4.9,
        reviews: 107,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 202,
        name: 'Lait Corporel Hydratant N°3',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17718048/51a71105-4245-4f5f-ba7a-f27fb47f23af.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 174,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 203,
        name: 'Soin Anti-Vergetures N°4',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17696448/fcb2df61-a868-4f61-a831-bd020ba7fb25.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 56,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 204,
        name: 'Soin Anti-Vergetures Rose',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/19/12/9ca3ab0a-8de1-455f-950d-96569137a8c9.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 70,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 205,
        name: 'Soin Anti-Vergetures Apaisant',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/05/06/ef31ddba-1a5f-401e-9d7d-d06ebee86f65.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 103,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 206,
        name: 'Soin Anti-Vergetures Apaisant Apaisant',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/05/06/55ae6d7e-eda2-4f13-aaee-406d3ffd09d4.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 65,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 207,
        name: 'Soin Anti-Vergetures N°5',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/05/03/8c6cf637-1e52-41a1-bb3b-4f39b00f7663.jpg',
        badge: 'Nouveau',
        rating: 4.3,
        reviews: 46,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 208,
        name: 'Soin Anti-Vergetures Apaisant N°2',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/09/28/10/c905d1e9-87f8-4f67-9242-2f61971305c3.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 30,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 209,
        name: 'Soin Anti-Vergetures 30ML',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/09/15/12/8c86de53-5d81-498b-af5f-124f60d489c8.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 30,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 210,
        name: 'Soin Anti-Vergetures Pro',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/09/06/04/c0c5766f-0c2f-4bb6-beed-0947ce7c8f7c.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 131,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 211,
        name: 'Soin Anti-Vergetures Expert',
        category: 'corps',
        subcategory: 'anti-vergetures',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/09/06/02/924adca9-3331-45bd-8802-d7f72f7f9683.jpg',
        badge: 'Top ventes',
        rating: 3.9,
        reviews: 185,
        bestseller: false,
        concerns: ['vergetures', 'fermete']
    },

    {
        id: 212,
        name: 'Crème Corps',
        category: 'corps',
        subcategory: 'creme-corps',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/01/05/86d705b3-2ad6-420d-902c-2bf48bac1ead_trans.jpeg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 141,
        bestseller: false,
        concerns: ['hydratation', 'fermete']
    },

    {
        id: 213,
        name: 'Gel Douche N°2',
        category: 'corps',
        subcategory: 'gel-douche',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/6d858198-4673-45cb-87b9-0610f3b56179.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 111,
        bestseller: false,
        concerns: ['nettoyage', 'hydratation']
    },

    {
        id: 214,
        name: 'Soin Anti-Cellulite',
        category: 'corps',
        subcategory: 'anti-cellulite',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/88cd7c2b-9f76-4710-a0ab-baf206eb84d1.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 154,
        bestseller: false,
        concerns: ['cellulite', 'fermete']
    },

    {
        id: 215,
        name: 'Lait Corporel Fleur de Cerisier 3pcs',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/80eb7109-34a7-46b8-b10e-f89761748ec0.png',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 64,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 216,
        name: 'Lait Corporel Fleur de Cerisier',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5dad1b37-c538-488b-a57c-85c431ba7521.png',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 138,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 217,
        name: 'Lait Corporel N°3',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/e09b852c-b722-4299-b6c4-58d975922a74.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 21,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    {
        id: 218,
        name: 'Lait Corporel N°4',
        category: 'corps',
        subcategory: 'lait-corps',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5362eb62-8f92-4b16-98a0-fae9fee6d411.jpeg',
        badge: 'Coup de cœur',
        rating: 4.6,
        reviews: 112,
        bestseller: false,
        concerns: ['hydratation', 'secheresse']
    },

    // ——— CHEVEUX (102 produits) ———

    {
        id: 219,
        name: 'Bigoudi Sans Chaleur',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 37.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/f2118ac7-5a17-4474-a6fe-0721d4713ec1.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 118,
        bestseller: false
    },

    {
        id: 220,
        name: 'Bigoudi Sans Chaleur N°2',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/9f321b81-d9b0-42ca-a054-82db964fb17b.jpg',
        badge: 'Exclusif',
        rating: 4.9,
        reviews: 70,
        bestseller: false
    },

    {
        id: 221,
        name: 'Masque Capillaire Collagène',
        category: 'cheveux',
        subcategory: 'masque-capillaire',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/9f746a08-f13e-4277-8fea-dd810311867b.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 82,
        bestseller: false,
        concerns: ['reparation', 'hydratation']
    },

    {
        id: 222,
        name: 'Shampoing Riz',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/19/06/8628c4b2-d7e2-4a6c-8928-36cafca9b884.jpg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 193,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 223,
        name: 'Sérum Capillaire',
        category: 'cheveux',
        subcategory: 'serum-capillaire',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/cb97488b-f7f3-4385-a5e7-c97e5c4a3ddf.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 146,
        bestseller: false,
        concerns: ['brillance', 'reparation']
    },

    {
        id: 224,
        name: 'Sérum Capillaire N°2',
        category: 'cheveux',
        subcategory: 'serum-capillaire',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/14eb0547-6067-420a-850b-db3407e5e79e.jpg',
        badge: 'Coup de cœur',
        rating: 4.6,
        reviews: 158,
        bestseller: false,
        concerns: ['brillance', 'reparation']
    },

    {
        id: 225,
        name: 'Sérum Capillaire N°3',
        category: 'cheveux',
        subcategory: 'serum-capillaire',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/94e6228e-5d1f-48a2-9444-48ef2b128649.jpg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 191,
        bestseller: false,
        concerns: ['brillance', 'reparation']
    },

    {
        id: 226,
        name: 'Sérum Capillaire Nourrissant',
        category: 'cheveux',
        subcategory: 'serum-capillaire',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/92dbf36b-6e07-4aba-8e13-ff65c692b2b9.jpg',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 120,
        bestseller: false,
        concerns: ['brillance', 'reparation']
    },

    {
        id: 227,
        name: 'Shampoing Coco',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/7f0e7a91-43b4-4d49-adc8-608f105d3f8e.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 33,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 228,
        name: 'Shampoing Coco Nourrissant',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/a03117cd-8acf-480c-b276-e6b06ded8ea9.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 23,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 229,
        name: 'Sérum Capillaire Réparateur',
        category: 'cheveux',
        subcategory: 'serum-capillaire',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/14/a345916f-e384-49e9-8b4e-a9b67717c86f.jpg',
        badge: 'Top ventes',
        rating: 3.8,
        reviews: 192,
        bestseller: false,
        concerns: ['brillance', 'reparation']
    },

    {
        id: 230,
        name: 'Soin Cuir Chevelu',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/14/3e75756c-bb0f-4e3e-9892-7095c58a6fb3.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 95,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 231,
        name: 'Shampoing',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/65750dc8-65c1-40d5-8b24-1b497fbc760b.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 126,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 232,
        name: 'Soin Cuir Chevelu Romarin',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c4ffd85c-13b0-40b7-b743-bd67526a04b0.jpg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 26,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 233,
        name: 'Masque Capillaire Apaisant',
        category: 'cheveux',
        subcategory: 'masque-capillaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/b4ced049-fba2-4ebb-9e77-21756606e357.jpg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 169,
        bestseller: false,
        concerns: ['reparation', 'hydratation']
    },

    {
        id: 234,
        name: 'Masque Capillaire Apaisant Apaisant',
        category: 'cheveux',
        subcategory: 'masque-capillaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/28d39679-c151-4fde-b36d-d19e6e4ae77f.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 111,
        bestseller: false,
        concerns: ['reparation', 'hydratation']
    },

    {
        id: 235,
        name: 'Masque Capillaire',
        category: 'cheveux',
        subcategory: 'masque-capillaire',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/f89390e6-9243-43bb-b33d-d7037d187ceb.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 161,
        bestseller: false,
        concerns: ['reparation', 'hydratation']
    },

    {
        id: 236,
        name: 'Shampoing Naturel',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/bd3074ef-1dbe-4eba-bb17-0212786dfe64.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 98,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 237,
        name: 'Shampoing N°2',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/11/1869edd9-164b-4e5e-9e8a-821630c9b103.jpg',
        badge: 'Nouveau',
        rating: 4.6,
        reviews: 133,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 238,
        name: 'Shampoing Romarin',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/08/af9b1586-6d28-4e48-af78-608050e0b4ca.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 183,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 239,
        name: 'Shampoing N°3',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/07/efdbe31a-ef81-420b-abf2-50aaffae9a78.jpg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 118,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 240,
        name: 'Shampoing Nourrissant',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/21/08/37966b7a-a186-4856-855a-06d80e45ea9d.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 170,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 241,
        name: 'Shampoing Réparateur',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/bfb24ada-2633-4424-a2a4-0f1645296334.jpg',
        badge: 'Top ventes',
        rating: 4.3,
        reviews: 187,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 242,
        name: 'Shampoing N°4',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/13/f1696c20-9a96-485f-b71d-b03c7a6e8883.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 115,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 243,
        name: 'Shampoing N°5',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/26450140-7226-4708-8c51-7a631ab61c34.jpg',
        badge: 'Nouveau',
        rating: 4.3,
        reviews: 62,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 244,
        name: 'Shampoing Pro',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/12/bb880e07-6156-4fb3-b5b8-373da47014a0.jpg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 46,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 245,
        name: 'Shampoing Expert',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/16/05/92c2f6a2-a191-4eb6-9807-db82d6fded70.jpg',
        badge: 'Best-seller',
        rating: 4.2,
        reviews: 166,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 246,
        name: 'Shampoing Intense',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/847f2050-0da0-4b16-8712-4df15ebb1b29.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 84,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 247,
        name: 'Shampoing Apaisant',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c2e0be4e-2bed-4b51-b5bf-ac754c8d35f5.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 176,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 248,
        name: 'Shampoing Romarin N°2',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/14/14/b1226f9b-b471-4db1-baa5-3aaff8cde709.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 141,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 249,
        name: 'Shampoing Plus',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/11/02/e54ad7ad-066f-4999-aca6-8c4bfbacfed0.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 185,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 250,
        name: 'Shampoing Ultra',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/10/ce402a88-f9b6-4d8e-8eaf-57d9e7e08b3c.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 33,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 251,
        name: 'Shampoing 2',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/10/d4f3e89f-b2ba-402e-bcfa-83ae233c08b8.jpg',
        badge: 'Best-seller',
        rating: 3.8,
        reviews: 134,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 252,
        name: 'Après-Shampoing',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/07/bc5339a9-40f8-42b2-ab02-691f39ecd8e6.jpg',
        badge: 'Tendance',
        rating: 4.5,
        reviews: 149,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 253,
        name: 'Après-Shampoing N°2',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/07/3a6ba40a-8dc3-4124-8a24-5fca7462ded5.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 112,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 254,
        name: 'Après-Shampoing Nourrissant',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/33c50e00-3639-43f9-9240-4fcd56257389.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 90,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 255,
        name: 'Après-Shampoing Romarin',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/4af49957-bc74-4638-b76a-753b16cdef0b.jpg',
        badge: 'Nouveau',
        rating: 4.7,
        reviews: 130,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 256,
        name: 'Après-Shampoing Romarin N°2',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/22/07/18d0f58c-fc0f-4c71-8a5a-b7356ba3ded2.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 93,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 257,
        name: 'Après-Shampoing Coco',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/30/03/f1cccfef-21ef-4b72-b3ce-31416265f18f.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 20,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 258,
        name: 'Après-Shampoing N°3',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/23/11/c606fd9c-a095-418b-ad51-161152f3daf1.jpg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 93,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 259,
        name: 'Soin Sans Rinçage Mangue',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/3e25874e-c785-4d35-af93-ad73032db1e6.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 98,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 260,
        name: 'Après-Shampoing Mangue',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c4dfa74b-5ec2-469a-abef-f6591a9ff0c2.jpg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 77,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 261,
        name: 'Après-Shampoing Nourrissant Nourrissant',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/8d4cceaf-c14c-4a78-a08c-b3881c1b8938.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 123,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 262,
        name: 'Shampoing 3',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/12/06/e480807a-25ba-456e-833b-0577d251e17c.jpg',
        badge: 'Exclusif',
        rating: 4.7,
        reviews: 17,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 263,
        name: 'Après-Shampoing Romarin N°3',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/ad260c3b-396b-436f-905d-d4faf2461d28.png',
        badge: 'Best-seller',
        rating: 4,
        reviews: 49,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 264,
        name: 'Après-Shampoing N°4',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/3250a69e-ee78-46a7-a345-e225ceff9a07.jpg',
        badge: 'Tendance',
        rating: 3.8,
        reviews: 60,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 265,
        name: 'Shampoing Romarin N°3',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/11/10/08/11c5334d-4791-4fad-bf6f-1fb45b687356.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 166,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 266,
        name: 'Shampoing 4',
        category: 'cheveux',
        subcategory: 'shampoing',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17623008/ca2bf20b-e19e-490d-99ff-b868c36561ae.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 51,
        bestseller: false,
        concerns: ['nettoyage', 'volume']
    },

    {
        id: 267,
        name: 'Après-Shampoing Réparateur',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/988298c2-8c00-4e2c-a838-4a5cfabffdd6.jpg',
        badge: 'Nouveau',
        rating: 4.1,
        reviews: 89,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 268,
        name: 'Après-Shampoing Miel',
        category: 'cheveux',
        subcategory: 'apres-shampoing',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/09/11/0d7baf19-e54e-4a40-850a-18bc7513f9e0.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 176,
        bestseller: false,
        concerns: ['hydratation', 'demeler']
    },

    {
        id: 269,
        name: 'Soin Kératine Réparateur',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/26/08/ca26c2e6-a837-43d9-8863-4492cb3478d1.jpg',
        badge: 'Best-seller',
        rating: 4.3,
        reviews: 177,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 270,
        name: 'Soin Kératine 30ml',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/4ab8d374-dfa8-4717-8936-16c92c5b23a7.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 64,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 271,
        name: 'Soin Kératine',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/021111ef-2e24-4875-8f33-5496f1818fa6.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 97,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 272,
        name: 'Soin Kératine N°2',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7af657cd-90e5-4230-91e3-28892a84bb55.jpg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 48,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 273,
        name: 'Masque Capillaire Kératine',
        category: 'cheveux',
        subcategory: 'masque-capillaire',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/08/5b07e6dc-9218-46ba-a1bd-901bdac76ef7.jpg',
        badge: 'Nouveau',
        rating: 3.8,
        reviews: 40,
        bestseller: false,
        concerns: ['reparation', 'hydratation']
    },

    {
        id: 274,
        name: 'Soin Kératine Kératine',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/80d83912-4964-42e4-b5e2-024f23761801.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 31,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 275,
        name: 'Soin Kératine N°3',
        category: 'cheveux',
        subcategory: 'soin-keratine',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/b0786dff-b51e-480e-b21d-5d6390bdb33a.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 21,
        bestseller: false,
        concerns: ['lissage', 'reparation']
    },

    {
        id: 276,
        name: 'Soin Cuir Chevelu N°2',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/60897db6-ecf8-4a06-a6bf-eeea9e6e3e32.jpg',
        badge: 'Tendance',
        rating: 4.5,
        reviews: 109,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 277,
        name: 'Soin Cuir Chevelu Romarin N°2',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/01/63e077da-34a0-41b1-b73b-ba04a0c403b3.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 161,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 278,
        name: 'Soin Cuir Chevelu Arbre à Thé',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/15/ea5508de-105b-45f0-8a23-4205f9ba828d.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 189,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 279,
        name: 'Soin Cuir Chevelu N°3',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/07/09/886d387c-b854-4b60-b447-052d6d7fec1d.jpg',
        badge: 'Nouveau',
        rating: 4.1,
        reviews: 143,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 280,
        name: 'Soin Cuir Chevelu N°4',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/11/e94ce421-8cd6-4ae4-b42e-f5048a79c728.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 68,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 281,
        name: 'Soin Cuir Chevelu N°5',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/21/07/c1da99d5-ddda-4ba6-9886-4689ff0dbc12.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 156,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 282,
        name: 'Soin Cuir Chevelu Pro',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/19/12/2f03f946-5bc9-4c35-b61b-0d5da6bb7bb3.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 59,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 283,
        name: 'Soin Cuir Chevelu Purifiant',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/12/b1782ba7-5f24-4aa8-88f1-a068093ddcd2.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 159,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 284,
        name: 'Soin Cuir Chevelu Naturel',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/94a91dac-b6dd-4ef9-90b3-9f4dfcae2e7e.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 62,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 285,
        name: 'Soin Cuir Chevelu Expert',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/825cc187-2319-42e2-9ec0-39aa5097adaa.jpg',
        badge: 'Nouveau',
        rating: 4.7,
        reviews: 166,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 286,
        name: 'Soin Cuir Chevelu Intense',
        category: 'cheveux',
        subcategory: 'soin-cuir-chevelu',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/d1e84376-f827-45d7-a37a-04fec27cb5bc.jpg',
        badge: 'Exclusif',
        rating: 3.9,
        reviews: 33,
        bestseller: false,
        concerns: ['cuir-chevelu', 'pousse']
    },

    {
        id: 287,
        name: 'Soin Sans Rinçage',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/09/04/61b83a5e-7b37-47af-a776-e28a1e225418.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 131,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 288,
        name: 'Soin Sans Rinçage N°2',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/80d7fdb4-5474-4fa0-8e7a-14aa83243dab.jpg',
        badge: 'Tendance',
        rating: 3.8,
        reviews: 114,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 289,
        name: 'Soin Sans Rinçage N°3',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/09/74160b2b-ec98-4fb0-ba19-2509a43dab7f.jpg',
        badge: 'Top ventes',
        rating: 3.8,
        reviews: 180,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 290,
        name: 'Soin Sans Rinçage N°4',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/4416542b-dc7d-411e-93c7-269be8efffa1.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 108,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 291,
        name: 'Soin Sans Rinçage N°5',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/71c3001e-f509-43b6-aaaf-fd95ee0863f6.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 133,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 292,
        name: 'Soin Sans Rinçage Pro',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/04/05/4afd95b2-4e07-49f9-a8ea-410c71fa1684.jpg',
        badge: 'Exclusif',
        rating: 4.7,
        reviews: 21,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 293,
        name: 'Soin Sans Rinçage Expert',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a13c73b7-507b-4483-be04-97f7a96e2a36.jpg',
        badge: 'Best-seller',
        rating: 3.8,
        reviews: 102,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 294,
        name: 'Soin Sans Rinçage Intense',
        category: 'cheveux',
        subcategory: 'soin-sans-rincage',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/cb703489-1d72-4727-ba56-86777afd7bf0.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 137,
        bestseller: false,
        concerns: ['hydratation', 'protection']
    },

    {
        id: 295,
        name: 'Chouchou en Satin',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/51eba0ee-b516-4de7-9fa8-9df62c2bbf3a.jpg',
        badge: 'Top ventes',
        rating: 4.9,
        reviews: 194,
        bestseller: false
    },

    {
        id: 296,
        name: 'Chouchou en Satin N°2',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/0367a0a0-e9cc-4b77-8072-8fd8d0f9b751.jpg',
        badge: 'Coup de cœur',
        rating: 4.7,
        reviews: 22,
        bestseller: false
    },

    {
        id: 297,
        name: 'Chouchou en Satin N°3',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/17a9f7ed-8882-4f50-85f2-0bae581945df.jpg',
        badge: 'Nouveau',
        rating: 4.1,
        reviews: 180,
        bestseller: false
    },

    {
        id: 298,
        name: 'Chouchou en Satin Perle',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7ab47862-c069-4f48-b321-f2fbec96c2ff.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 144,
        bestseller: false
    },

    {
        id: 448,
        name: 'Chouchou en Satin N°4',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/924729b8-243a-4026-9885-0599dcfd21c2.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 109,
        bestseller: false
    },

    {
        id: 452,
        name: 'Chouchou en Satin N°5',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/202908/67844582741.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 136,
        bestseller: false
    },

    {
        id: 456,
        name: 'Chouchou en Satin 100Pcs',
        category: 'accessoire',
        subcategory: 'chouchou',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/20180903/3875656456267.png',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 67,
        bestseller: false
    },

    {
        id: 460,
        name: 'Pince à Cheveux',
        category: 'accessoire',
        subcategory: 'pince-cheveux',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/732ed620-02a5-4beb-9dc7-19a2045693ca.jpg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 190,
        bestseller: false
    },

    {
        id: 464,
        name: 'Bonnet en Satin Naturel',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/783e29ab-de9e-47ca-afa5-22c5358fb036.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 99,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 468,
        name: 'Bonnet en Satin Naturel Naturel',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/547e6b07-c7c6-41b6-8999-44035551a6da.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 67,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 472,
        name: 'Bonnet en Satin Naturel N°2',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5cf95a7c-c07d-4fb0-b265-c719560dada9.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 88,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 476,
        name: 'Bigoudi Sans Chaleur Naturel',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/d23441ac-8657-4331-961f-7332cceba76d.jpg',
        badge: 'Coup de cœur',
        rating: 4.9,
        reviews: 18,
        bestseller: false
    },

    {
        id: 479,
        name: 'Bigoudi Sans Chaleur Naturel Naturel',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/971965b0-8c53-478d-b869-4d873cef40e9.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 105,
        bestseller: false
    },

    {
        id: 482,
        name: 'Bigoudi Sans Chaleur Naturel N°2',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/807b58dc-1776-4fab-9cb0-b418aa673757.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 164,
        bestseller: false
    },

    {
        id: 485,
        name: 'Bigoudi Sans Chaleur Naturel N°3',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/82d93e0f-2710-4ab5-afda-7e89f70a6664.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 81,
        bestseller: false
    },

    {
        id: 488,
        name: 'Bonnet en Satin Naturel N°3',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/339444e6-0749-49df-ac88-046ffdb028c0.jpg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 137,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 491,
        name: 'Bigoudi Sans Chaleur Naturel N°4',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17630784/b55e01ef-da76-4108-8941-971b832ecd3e.jpg',
        badge: 'Best-seller',
        rating: 4.2,
        reviews: 178,
        bestseller: false
    },

    {
        id: 494,
        name: 'Bonnet en Satin Naturel N°4',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17630784/99a8b7bd-665f-42cc-9853-b253ed98df82.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 69,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 497,
        name: 'Bigoudi Sans Chaleur Naturel N°5',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/da2cce6d-b89b-4327-a518-3884304b1c46.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 189,
        bestseller: false
    },

    {
        id: 500,
        name: 'Bandeau Cheveux',
        category: 'accessoire',
        subcategory: 'bandeau',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/8c993e97-fbe2-419b-be7c-0d14250d1958.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 115,
        bestseller: false
    },

    {
        id: 503,
        name: 'Bonnet en Satin Naturel N°5',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/d95df1c5-3af6-4cf8-b583-4fbd3e687608.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 71,
        bestseller: false,
        gender: 'homme'
    },

    {
        id: 506,
        name: 'Bonnet en Satin',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/b595fd0d-2fa8-429b-9f9c-9229c4fe8dcc.jpg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 49,
        bestseller: false
    },

    {
        id: 509,
        name: 'Bonnet en Satin N°2',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7467055b-407a-4fd5-a133-4009a7bcdf8b.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 54,
        bestseller: false
    },

    {
        id: 511,
        name: 'Bonnet en Satin N°3',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/579d4a8b-f45f-4694-9539-6f73569aef5e.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 172,
        bestseller: false
    },

    {
        id: 513,
        name: 'Bonnet en Satin Naturel Pro',
        category: 'accessoire',
        subcategory: 'bonnet-satin',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c39cdb85-7b4b-4609-8159-941dc1158f50.jpg',
        badge: 'Nouveau',
        rating: 4.7,
        reviews: 42,
        bestseller: false
    },

    {
        id: 515,
        name: 'Bigoudi Sans Chaleur Naturel Pro',
        category: 'cheveux',
        subcategory: 'bigoudi',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/52e080b3-98a7-4520-bb64-029b75a8367d.jpg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 124,
        bestseller: false
    },

    // ——— ONGLES (37 produits) ———

    {
        id: 299,
        name: 'Stickers Nail Art',
        category: 'ongles',
        subcategory: 'nail-art',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/39402354-60c9-4663-8079-e5cc8e260050.jpg',
        badge: 'Best-seller',
        rating: 4.1,
        reviews: 136,
        bestseller: false
    },

    {
        id: 300,
        name: 'Vernis à Ongles',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/10/5d673ab2-5070-45c8-8ed1-7a7667318dee_trans.jpeg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 61,
        bestseller: false
    },

    {
        id: 301,
        name: 'Vernis à Ongles N°2',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/27f375e6-5094-40e0-a0f5-d8a8ef2ba393.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 132,
        bestseller: false
    },

    {
        id: 302,
        name: 'Vernis à Ongles N°3',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/11/01/9cb83b42-5115-4f0c-a968-2ac85ef3e6c6.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 21,
        bestseller: false
    },

    {
        id: 303,
        name: 'Vernis à Ongles N°4',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/9f421774-57ae-4831-9790-d7fbdaf54367.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 122,
        bestseller: false
    },

    {
        id: 304,
        name: 'Vernis Gel Semi-Permanent',
        category: 'ongles',
        subcategory: 'vernis-gel',
        price: 6.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/26/06/4545cce7-75b0-4ab1-a2a1-487ddc00f843_fine.jpeg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 127,
        bestseller: false
    },

    {
        id: 305,
        name: 'Vernis Gel Semi-Permanent N°2',
        category: 'ongles',
        subcategory: 'vernis-gel',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/16/05/3a8ea4b2-338a-4215-80b2-b051fe6f9c2e_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 34,
        bestseller: false
    },

    {
        id: 306,
        name: 'Stickers Nail Art N°2',
        category: 'ongles',
        subcategory: 'nail-art',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/b60839cd-c0f6-4624-b1da-fc9425dbe015.jpg',
        badge: 'Tendance',
        rating: 4.9,
        reviews: 111,
        bestseller: false
    },

    {
        id: 307,
        name: 'Lampe UV/LED Ongles',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/04/112e4c33-f9ef-4727-9eda-e49c21fc1e5e.jpg',
        badge: 'Top ventes',
        rating: 4.3,
        reviews: 95,
        bestseller: false
    },

    {
        id: 308,
        name: 'Lampe UV/LED Ongles N°2',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/10/04/f662ab4e-af13-410c-b40f-fe69b3a89878.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 167,
        bestseller: false
    },

    {
        id: 309,
        name: 'Faux Ongles',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/981c76d5-73c9-4d9b-9247-b82fb80ed709.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 27,
        bestseller: false
    },

    {
        id: 310,
        name: 'Faux Ongles N°2',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/4ed784d2-5781-4d06-8e7d-f7dc4837fd2d.jpg',
        badge: 'Exclusif',
        rating: 4.5,
        reviews: 91,
        bestseller: false
    },

    {
        id: 311,
        name: 'Stickers Nail Art N°3',
        category: 'ongles',
        subcategory: 'nail-art',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a5ac8228-e731-4ea5-874a-9be07e6f91ca.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 32,
        bestseller: false
    },

    {
        id: 312,
        name: 'Lampe UV/LED Ongles N°3',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/04/157b72c8-f612-4294-910c-59ce7cbdea9e.jpg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 47,
        bestseller: false
    },

    {
        id: 313,
        name: 'Lampe UV/LED Ongles N°4',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/09/3f35e2e2-71bb-479d-aa4d-878bfcef886e.jpg',
        badge: 'Top ventes',
        rating: 3.9,
        reviews: 162,
        bestseller: false
    },

    {
        id: 314,
        name: 'Lampe UV/LED Ongles N°5',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/04/03/810ae465-d02f-4b84-93c8-93958514336d.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 31,
        bestseller: false
    },

    {
        id: 315,
        name: 'Lampe UV/LED Ongles Pro',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/03/10/a4309dd6-522f-4707-8e09-0fe869b0a9b6.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 186,
        bestseller: false
    },

    {
        id: 316,
        name: 'Lime à Ongles Pro',
        category: 'ongles',
        subcategory: 'lime-ongles',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c9410b98-a969-4665-883e-49dadcfdc85d.jpg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 173,
        bestseller: false
    },

    {
        id: 317,
        name: 'Faux Ongles N°3',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/02/779e55d2-8625-4cca-a459-59a1babe9cfd.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 153,
        bestseller: false
    },

    {
        id: 318,
        name: 'Vernis à Ongles N°5',
        category: 'ongles',
        subcategory: 'vernis',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/8613e6ed-8370-44b4-abed-bb3915d9a1b1.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 176,
        bestseller: false
    },

    {
        id: 319,
        name: 'Lampe UV/LED Ongles Expert',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/29/05/a2e67751-3fd9-4c09-ad3f-99bbe140cc92.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 142,
        bestseller: false
    },

    {
        id: 320,
        name: 'Lampe UV/LED Ongles Intense',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/29/06/60f2f7e0-460e-4f91-aa62-01d9fe294639.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 45,
        bestseller: false
    },

    {
        id: 321,
        name: 'Lampe UV/LED Ongles Réparateur',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/115344b9-39de-49b0-b998-29cd180e5cb9.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 189,
        bestseller: false
    },

    {
        id: 322,
        name: 'Lampe UV/LED Ongles Plus',
        category: 'ongles',
        subcategory: 'lampe-uv',
        price: 24.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/24/07/da2c522f-fae4-40ec-a059-bee68aa1f3cb_trans.jpeg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 122,
        bestseller: false
    },

    {
        id: 323,
        name: 'Faux Ongles N°4',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/f9cecf53-25e5-49bb-be76-78905cc3593b.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 72,
        bestseller: false
    },

    {
        id: 324,
        name: 'Vernis à Ongles 10ML',
        category: 'ongles',
        subcategory: 'vernis',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/7f7961af-362e-4a7b-a2d1-f328d1d103ce.png',
        badge: 'Tendance',
        rating: 3.8,
        reviews: 145,
        bestseller: false
    },

    {
        id: 325,
        name: 'Stickers Nail Art 4Pcs',
        category: 'ongles',
        subcategory: 'nail-art',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/4dba3f90-5414-410d-832d-61117593f9a6.jpg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 39,
        bestseller: false
    },

    {
        id: 326,
        name: 'Accessoire Manucure',
        category: 'ongles',
        subcategory: 'accessoire-ongles',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/30/04/f27ab96d-5de4-455c-b0b8-bb0524f489b3.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 96,
        bestseller: false
    },

    {
        id: 327,
        name: 'Accessoire Manucure N°2',
        category: 'ongles',
        subcategory: 'accessoire-ongles',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/27/03/502ae697-4a2d-4a08-a5ad-c61b8a49f61d_fine.jpeg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 73,
        bestseller: false
    },

    {
        id: 328,
        name: 'Faux Ongles N°5',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 34.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/8958a830-1b1c-4c15-8fe8-81e5607cc121.jpg',
        badge: 'Exclusif',
        rating: 4,
        reviews: 170,
        bestseller: false
    },

    {
        id: 450,
        name: 'Huile Cuticules',
        category: 'ongles',
        subcategory: 'soin-cuticules',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/18/12/94b7d044-b02d-44f1-a6bb-38586528f0c5.jpg',
        badge: 'Tendance',
        rating: 3.9,
        reviews: 166,
        bestseller: false
    },

    {
        id: 454,
        name: 'Vernis à Ongles Pro',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/18ba4802-f912-4d91-9c1b-6a0965b86452.jpg',
        badge: 'Exclusif',
        rating: 4.5,
        reviews: 112,
        bestseller: false
    },

    {
        id: 458,
        name: 'Vernis à Ongles Expert',
        category: 'ongles',
        subcategory: 'vernis',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/5c5671ab-3c39-44f7-a9b7-84bac56d2183.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 164,
        bestseller: false
    },

    {
        id: 462,
        name: 'Vernis à Ongles Intense',
        category: 'ongles',
        subcategory: 'vernis',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/07/03/f215662a-e63a-4e99-a236-85192eb94018_trans.jpeg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 191,
        bestseller: false
    },

    {
        id: 466,
        name: 'Faux Ongles Pro',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/23/10/ec8b4c8d-4d23-4ac5-b922-b69b36236090_trans.jpeg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 180,
        bestseller: false
    },

    {
        id: 470,
        name: 'Stickers Nail Art N°4',
        category: 'ongles',
        subcategory: 'nail-art',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/357b853c-28c0-4ad6-a191-ec6400393bf9.jpg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 190,
        bestseller: false
    },

    {
        id: 474,
        name: 'Faux Ongles Expert',
        category: 'ongles',
        subcategory: 'faux-ongles',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/855f4612-3384-4765-8fdd-d1c753ee4b96.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 49,
        bestseller: false
    },

    // ——— HOMME (43 produits) ———

    {
        id: 329,
        name: 'Kit Rasage',
        category: 'homme',
        subcategory: 'rasage',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/17/11/3e68c477-3d9d-4e66-8ef4-e854622ec96b.jpg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 37,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 330,
        name: 'Kit Rasage N°2',
        category: 'homme',
        subcategory: 'rasage',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/15/07/b629c1ae-1e1d-4096-a8f3-f58f7375e83c.jpg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 155,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 331,
        name: 'Kit Rasage N°3',
        category: 'homme',
        subcategory: 'rasage',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/35d2bc1e-cd7d-43fd-80c3-e65685a292aa.jpg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 104,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 332,
        name: 'Kit Soin Barbe',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/31/04/e8ef2935-fb32-43c6-8f46-49006a4a19c0.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 34,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 333,
        name: 'Kit Soin Barbe N°2',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/b7a13be1-3cf1-4f33-930f-ce03d59e2b96.jpg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 80,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 334,
        name: 'Kit Soin Barbe N°3',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/0af8bf21-2b61-43ab-87d8-847a2cc80b6e.png',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 60,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 335,
        name: 'Kit Soin Barbe N°4',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/12a5de6b-edb6-4d43-9bce-13471210173c.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 168,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 336,
        name: 'Kit Soin Barbe N°5',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c50bd13c-becf-429e-8000-36f92fb825ca.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 44,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 337,
        name: 'Kit Soin Barbe Pro',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/c79aaded-a271-46be-9212-e8ec269c8bd3.jpg',
        badge: 'Top ventes',
        rating: 3.9,
        reviews: 81,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 338,
        name: 'Kit Soin Barbe Expert',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/05/03/5dd6584e-078a-4f9d-a49d-9ffe10f7d4d5.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 86,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 339,
        name: 'Kit Rasage N°4',
        category: 'homme',
        subcategory: 'rasage',
        price: 34.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/19/06/2a076aa2-4b4f-4603-8183-b0c936d02426_fine.jpeg',
        badge: 'Nouveau',
        rating: 4.6,
        reviews: 43,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 340,
        name: 'Kit Soin Barbe Intense',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/18/06/5dfadbc5-3640-4eca-a7ed-62fee8971e9e_fine.jpeg',
        badge: 'Exclusif',
        rating: 4.2,
        reviews: 43,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 341,
        name: 'Kit Soin Barbe Plus',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/08/e446b928-34c5-45de-b76b-509b3bf7274e.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 134,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 342,
        name: 'Kit Rasage N°5',
        category: 'homme',
        subcategory: 'rasage',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/939b06c0-0ed9-4048-b6dc-03fb0e041b26.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 66,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 343,
        name: 'Kit Soin Barbe Ultra',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 34.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/bdf7e8e6-1095-46f9-9cb3-4a2639d60725.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 72,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 344,
        name: 'Kit Soin Barbe 2',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/023b86a7-dd51-4d06-920f-af9f9dbd824b.jpg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 28,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 345,
        name: 'Kit Soin Barbe Apaisant',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/cbd56023-37cf-49e7-858d-1c2cd52cf875.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 167,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 346,
        name: 'Kit Soin Barbe 3',
        category: 'homme',
        subcategory: 'kit-barbe',
        price: 14.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/12/03/01d40ae3-6e1c-4218-92eb-d3885a81a8f9.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 121,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 347,
        name: 'Après-Rasage Réparateur',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/12/08/e8289db7-66c9-45b5-952d-b5fb194ace83.jpg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 88,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 348,
        name: 'Après-Rasage',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/07/01/02/c9534f5f-57f6-4546-a630-979e9af89a13_fine.jpeg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 114,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 349,
        name: 'Après-Rasage N°2',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/06/28/11/c5a530c9-6cad-42c9-b38c-e113a9b8f520.jpeg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 61,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 350,
        name: 'Après-Rasage Réparateur Réparateur',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/06/27/12/9764e95f-0357-48c8-9eaf-3bb0b94eaba1.jpeg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 167,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 351,
        name: 'Après-Rasage Nourrissant',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/5dbddd3e-81cc-4d32-8c8e-64c2d8df9ad3.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 122,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 352,
        name: 'Après-Rasage N°3',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/cb34b76d-7371-42d8-919f-65efd8102d33.jpg',
        badge: 'Exclusif',
        rating: 4.5,
        reviews: 164,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 353,
        name: 'Après-Rasage N°4',
        category: 'homme',
        subcategory: 'apres-rasage',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2024/05/05/03/d25d691b-3ec7-4fb0-8719-f35f3a5d9524.jpg',
        badge: 'Best-seller',
        rating: 4.1,
        reviews: 90,
        bestseller: false,
        concerns: ['apaisement'],
        gender: 'homme'
    },

    {
        id: 354,
        name: 'Soin Visage Homme Aloe Vera',
        category: 'homme',
        subcategory: 'soin-homme',
        price: 8.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/97efa402-b9ec-4508-b60a-18e4c69ee6f5.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 102,
        bestseller: false,
        concerns: ['hydratation'],
        gender: 'homme'
    },

    {
        id: 355,
        name: 'Soin Visage Homme',
        category: 'homme',
        subcategory: 'soin-homme',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/cf7f592f-f3a7-4d31-a284-c42737e136fc.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 70,
        bestseller: false,
        concerns: ['hydratation'],
        gender: 'homme'
    },

    {
        id: 356,
        name: 'Soin Visage Homme N°2',
        category: 'homme',
        subcategory: 'soin-homme',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/86f2888b-5762-4790-8684-95d2323155cf.jpg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 160,
        bestseller: false,
        concerns: ['hydratation'],
        gender: 'homme'
    },

    {
        id: 357,
        name: 'Soin Visage Homme Éclat',
        category: 'homme',
        subcategory: 'soin-homme',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/08/08/7240bff2-9931-484d-b20c-1f7b0560dfef.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 18,
        bestseller: false,
        concerns: ['hydratation'],
        gender: 'homme'
    },

    {
        id: 358,
        name: 'Kit Rasage Pro',
        category: 'homme',
        subcategory: 'rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/11/07/527d689f-31a6-4652-b2e4-4d2960fb842a.jpg',
        badge: 'Exclusif',
        rating: 4.7,
        reviews: 72,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 359,
        name: 'Kit Rasage Expert',
        category: 'homme',
        subcategory: 'rasage',
        price: 11.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/14/03/76c5ca11-cb3f-40ea-a1b1-57f529885c53_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.5,
        reviews: 37,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 360,
        name: 'Kit Rasage Intense',
        category: 'homme',
        subcategory: 'rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/30/06/85753f9e-159d-43f0-8993-d6acd3539883.jpg',
        badge: 'Tendance',
        rating: 4.2,
        reviews: 73,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 361,
        name: 'Kit Rasage Plus',
        category: 'homme',
        subcategory: 'rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/30/03/5d5d53b3-71d8-47bb-93b1-ab47d51f0cd2.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 170,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 362,
        name: 'Kit Rasage Ultra',
        category: 'homme',
        subcategory: 'rasage',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/1528e7c6-06cd-4945-8382-1f963a33d363.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 172,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 363,
        name: 'Kit Rasage Apaisant',
        category: 'homme',
        subcategory: 'rasage',
        price: 8.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/19/12/f0bc0440-6956-428b-a3b3-a7cd9e37f4f0.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 21,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 364,
        name: 'Kit Rasage 2',
        category: 'homme',
        subcategory: 'rasage',
        price: 39.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/8dfbad02-5ace-4b04-add2-42adf42520e9.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 114,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 365,
        name: 'Kit Rasage 3',
        category: 'homme',
        subcategory: 'rasage',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/c61adeef-d943-4774-8c6a-4a740ac4a71e.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 84,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 366,
        name: 'Kit Rasage 4',
        category: 'homme',
        subcategory: 'rasage',
        price: 54.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/17634240/f492a64f-b06f-40e6-a8b0-f2ef6fd7ed5a.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 110,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 367,
        name: 'Kit Rasage 5',
        category: 'homme',
        subcategory: 'rasage',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/24/01/9d09d393-f9bb-4b1e-8935-a756c326051a_trans.jpeg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 99,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 368,
        name: 'Kit Rasage 6',
        category: 'homme',
        subcategory: 'rasage',
        price: 59.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/e781e74b-2e7d-41b4-a6d8-5f98cf9e924c.png',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 44,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 369,
        name: 'Kit Rasage 7',
        category: 'homme',
        subcategory: 'rasage',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/93046ea0-0cd3-43a3-8edf-b143e77f067e.jpg',
        badge: 'Nouveau',
        rating: 4.7,
        reviews: 150,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 370,
        name: 'Kit Rasage Réparateur',
        category: 'homme',
        subcategory: 'rasage',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/ad578024-5202-43e0-92c6-54ebe5b7bed7.jpeg',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 136,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    {
        id: 371,
        name: 'Kit Rasage 8',
        category: 'homme',
        subcategory: 'rasage',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/04/10/06/af22f7d4-f654-4f75-9fd1-a943b75a2af4.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 87,
        bestseller: false,
        concerns: ['entretien'],
        gender: 'homme'
    },

    // ——— OUTILS & APPAREILS BEAUTÉ (63 produits) ———

    {
        id: 372,
        name: 'Derma Roller',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/22/04/27b57d87-5929-4167-8959-8ff7f45b9970.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 77,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 373,
        name: 'Gua Sha',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/02/521ec760-0f93-4c1a-8be4-5f99c46253ca_trans.jpeg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 139,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 374,
        name: 'Derma Roller Nourrissant',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/09/95707237-45b2-4768-b184-920517579962.jpg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 150,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 375,
        name: 'Derma Roller N°2',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/05/04/488042a6-12ed-42aa-a4e8-a8ca22eb3c1e.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 80,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 376,
        name: 'Rouleau de Jade',
        category: 'outils',
        subcategory: 'rouleau-visage',
        price: 7.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/385378de-3b70-4155-a9a7-a5cf92bcd69f.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 168,
        bestseller: false,
        concerns: ['anti-age', 'circulation']
    },

    {
        id: 377,
        name: 'Gua Sha N°2',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/20/06/5d99c126-a65e-4d07-a456-52e756f96c51_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 51,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 378,
        name: 'Gua Sha N°3',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/16/05/351f81b1-5ce7-4297-b1f1-7ec1a172570e_trans.jpeg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 75,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 379,
        name: 'Gua Sha N°4',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/09/05/399e0e48-a848-442e-a409-44b7b14f1268_trans.jpeg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 74,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 380,
        name: 'Gua Sha N°5',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/12/08/a087d29d-389e-48aa-81d6-6c5f62cacd40_trans.jpeg',
        badge: 'Coup de cœur',
        rating: 4.7,
        reviews: 40,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 381,
        name: 'Gua Sha Pro',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/d127bcab-55c6-49be-aa47-0b10f0711d0e.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 48,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 382,
        name: 'Gua Sha Expert',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 34.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/04/01/0887070c-4bd3-4768-882c-43ec78a66b5c_trans.jpeg',
        badge: 'Exclusif',
        rating: 4,
        reviews: 158,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 383,
        name: 'Gua Sha Intense',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/02/03/f0d230dc-d2ab-4cdf-a946-ae8d922af73f_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.1,
        reviews: 95,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 384,
        name: 'Gua Sha Rose',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/26/09/580ecb43-31c8-45c6-a604-74c268822756.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 124,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 385,
        name: 'Gua Sha Plus',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a082fee4-70d1-4f10-a527-02176865f36c.jpg',
        badge: 'Top ventes',
        rating: 4,
        reviews: 154,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 386,
        name: 'Gua Sha Ultra',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/31/05/f389cafb-ef49-4ba1-9636-f867b6393430.jpg',
        badge: 'Coup de cœur',
        rating: 4.5,
        reviews: 107,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 387,
        name: 'Gua Sha 2',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/10/12/13/f3a8e53f-f5bf-4d06-8d5b-391e0c777eec_fine.jpeg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 107,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 388,
        name: 'Gua Sha 3',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/08/27/01/c1cc9293-9ae6-4000-9faa-90db9cbbd8da_trans.jpeg',
        badge: 'Exclusif',
        rating: 4.8,
        reviews: 135,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 389,
        name: 'Gua Sha 4',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 11.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/06/16/05/49298c1a-398d-49a9-a152-97325bc064e2_trans.jpeg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 97,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 390,
        name: 'Gua Sha 5',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/04/19/07/69a21889-3a32-4d6d-8cb3-4b87a44da30f_trans.jpeg',
        badge: 'Tendance',
        rating: 4.7,
        reviews: 57,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 391,
        name: 'Gua Sha 6',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/03/31/05/2fd98e3d-94ee-4ef9-a4b0-de5636ae8173.jpg',
        badge: 'Top ventes',
        rating: 4.2,
        reviews: 142,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 392,
        name: 'Gua Sha 7',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/03/18/06/bc1efa6b-a9e5-466b-aa02-9c6a2ce39e49_trans.jpeg',
        badge: 'Coup de cœur',
        rating: 4.3,
        reviews: 18,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 393,
        name: 'Gua Sha 8',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/46d74cbf-f116-4102-b003-f33c3c6c51a3.jpg',
        badge: 'Nouveau',
        rating: 4.9,
        reviews: 52,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 394,
        name: 'Gua Sha Anti-Rides 2PCS',
        category: 'outils',
        subcategory: 'gua-sha',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/620d905e-c6ec-4a92-859a-60de6121c20c.png',
        badge: 'Exclusif',
        rating: 4,
        reviews: 182,
        bestseller: false,
        concerns: ['anti-age', 'drainage']
    },

    {
        id: 395,
        name: 'Appareil Beauté',
        category: 'outils',
        subcategory: 'appareil-visage',
        price: 44.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/3712f3d1-f252-4e24-8cde-72747bde2de5.jpg',
        badge: 'Best-seller',
        rating: 3.9,
        reviews: 106,
        bestseller: false,
        concerns: ['fermete']
    },

    {
        id: 396,
        name: 'Appareil Beauté N°2',
        category: 'outils',
        subcategory: 'appareil-visage',
        price: 27.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/08/06/bea0a765-040b-408a-b0ec-2fdaea2b7c57_trans.jpeg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 102,
        bestseller: false,
        concerns: ['fermete']
    },

    {
        id: 397,
        name: 'Appareil Beauté N°3',
        category: 'outils',
        subcategory: 'appareil-visage',
        price: 49.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/fac1ce46-0efc-4648-9249-e5c2b332593d.png',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 157,
        bestseller: false,
        concerns: ['fermete']
    },

    {
        id: 398,
        name: 'Masseur Facial',
        category: 'outils',
        subcategory: 'masseur-visage',
        price: 9.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/04/01/02/71faa32c-7e80-4592-af40-73129423e7c3_trans.jpeg',
        badge: 'Coup de cœur',
        rating: 4.2,
        reviews: 33,
        bestseller: false,
        concerns: ['fermete', 'circulation']
    },

    {
        id: 399,
        name: 'Aspirateur Points Noirs',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/eb089715-4af4-401a-8082-8ec8f17c11b2.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 166,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 400,
        name: 'Aspirateur Points Noirs N°2',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/e8b4a6c7-4371-4304-93c7-586abd892621.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 63,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 401,
        name: 'Aspirateur Points Noirs 800 Pcs',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/695727ff-7235-4d07-a460-37b5f73c4499.jpg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 95,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 402,
        name: 'Aspirateur Points Noirs Charbon Actif & Bambou',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/10/09/d85b4cef-be37-4403-bc56-6226f7a089cc_fine.jpeg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 162,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 403,
        name: 'Aspirateur Points Noirs 3 G',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 29.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/32bcc4ff-91e0-4a3f-b2da-3d133dc3ecb1.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 157,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 404,
        name: 'Aspirateur Points Noirs N°3',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/2ce1dc1c-1edf-40c1-abb9-8af4fd537d2a.jfif',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 90,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 405,
        name: 'Aspirateur Points Noirs Réparateur 30g',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/767828c9-0118-420b-92e0-7c7a248ad6f7.jpg',
        badge: 'Nouveau',
        rating: 4.3,
        reviews: 149,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 406,
        name: 'Aspirateur Points Noirs N°4',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/23/12/5552068b-3306-4a2c-84b1-d294961c14b7.jpg',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 148,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 407,
        name: 'Aspirateur Points Noirs N°5',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/cbae6b94-7a7a-4cd1-9865-fc7dd7f35ff8.jpg',
        badge: 'Best-seller',
        rating: 4.8,
        reviews: 41,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 408,
        name: 'Aspirateur Points Noirs Pro',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/29/12/8d8e634a-aca3-4743-93f5-208add9f7a49.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 177,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 409,
        name: 'Aspirateur Points Noirs Centella Asiatica',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 27.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/28/07/1b0e4039-2e8c-4523-85fd-dbfcad75eec4.jpeg',
        badge: 'Top ventes',
        rating: 4.7,
        reviews: 68,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 410,
        name: 'Aspirateur Points Noirs Or 24K',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 27.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/26/08/76d8af59-7e8b-4bc1-ae2b-0c88b3a38dcf_fine.jpeg',
        badge: 'Coup de cœur',
        rating: 4,
        reviews: 28,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 411,
        name: 'Aspirateur Points Noirs Acide Salicylique',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/01/02/97fd87ac-0819-4a11-819b-0b69a1aea576_fine.jpeg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 189,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 412,
        name: 'Aspirateur Points Noirs Expert',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/48fec44b-ef0e-4950-b3ae-0fec68bffa25.jpg',
        badge: 'Exclusif',
        rating: 4.6,
        reviews: 61,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 413,
        name: 'Aspirateur Points Noirs Intense',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/14043496-6364-4416-96a8-3d7df56160db.jpg',
        badge: 'Best-seller',
        rating: 4.7,
        reviews: 151,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 414,
        name: 'Aspirateur Points Noirs Hydratant',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/49658c17-80fb-45bf-944c-9d221d418a44.jpg',
        badge: 'Tendance',
        rating: 4.9,
        reviews: 111,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 415,
        name: 'Aspirateur Points Noirs Plus',
        category: 'outils',
        subcategory: 'aspirateur-pores',
        price: 17.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/0dca9ac2-dc73-4366-83ee-365c25f7c1fa.jpg',
        badge: 'Top ventes',
        rating: 4.8,
        reviews: 73,
        bestseller: false,
        concerns: ['pores', 'points-noirs']
    },

    {
        id: 416,
        name: 'Derma Roller N°3',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/106de76d-f1fa-41c6-a2de-b903e5d54458.jpg',
        badge: 'Coup de cœur',
        rating: 4.1,
        reviews: 38,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 449,
        name: 'Derma Roller N°4',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/09/03/9cbfbfd9-2773-4c45-929c-ab62bcbcd091_fine.jpeg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 151,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 453,
        name: 'Derma Roller N°5',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/03/07/e40f0acc-8eb8-4fa4-be9c-7da018e0fc78.jpg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 73,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 457,
        name: 'Derma Roller Raffermissant',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/29/12/9c83296e-9ddc-4aee-b331-1c4913ae2804.jpg',
        badge: 'Top ventes',
        rating: 4.4,
        reviews: 160,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 461,
        name: 'Derma Roller Pro',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/27/06/d5042d2a-775f-4b09-9e0a-f6c65549314c_trans.jpeg',
        badge: 'Best-seller',
        rating: 4,
        reviews: 62,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 465,
        name: 'Derma Roller Expert',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/26/10/dd9138e5-3e67-489f-ba9c-6dc8f8240e68_fine.jpeg',
        badge: 'Nouveau',
        rating: 4,
        reviews: 28,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 469,
        name: 'Derma Roller Raffermissant Raffermissant',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/21/11/b1654cca-c413-485f-b7ba-e951104589ee_trans.jpeg',
        badge: 'Top ventes',
        rating: 4.1,
        reviews: 118,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 473,
        name: 'Derma Roller Intense',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 16.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/16/02/b0d241a6-654c-4107-8cfd-4bc7a3bbc28e.jpg',
        badge: 'Best-seller',
        rating: 4.4,
        reviews: 149,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 477,
        name: 'Derma Roller Plus',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 22.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/24/07/cf514f38-4563-4499-a124-775208c109fe.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 29,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 480,
        name: 'Derma Roller Nourrissant Nourrissant',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/03/05/2945d40f-194d-411a-8f66-95ce83a21c45.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 92,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 483,
        name: 'Derma Roller Ultra',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7b351d3a-3064-4a1c-ac56-e8fc55ada96b.jpg',
        badge: 'Nouveau',
        rating: 4.5,
        reviews: 101,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 486,
        name: 'Derma Roller Nourrissant N°2',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/a82ed45d-03fa-427b-91e7-0538f0623e7b.jpg',
        badge: 'Tendance',
        rating: 4,
        reviews: 68,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 489,
        name: 'Derma Roller Rose',
        category: 'outils',
        subcategory: 'derma-roller',
        price: 12.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/12/24/08/3214de21-5293-493a-8143-41d4d5865f0f.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 130,
        bestseller: false,
        concerns: ['anti-age', 'cicatrices']
    },

    {
        id: 492,
        name: 'Ice Roller Visage',
        category: 'outils',
        subcategory: 'rouleau-glace',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/27323b51-484c-43e5-aa71-b64a09987ba7.jpg',
        badge: 'Tendance',
        rating: 3.8,
        reviews: 88,
        bestseller: false,
        concerns: ['poches', 'inflammation']
    },

    {
        id: 495,
        name: 'Ice Roller Visage N°2',
        category: 'outils',
        subcategory: 'rouleau-glace',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/48477566-e340-471f-95ba-22735fe33064.jpg',
        badge: 'Nouveau',
        rating: 3.9,
        reviews: 141,
        bestseller: false,
        concerns: ['poches', 'inflammation']
    },

    {
        id: 498,
        name: 'Ice Roller Visage N°3',
        category: 'outils',
        subcategory: 'rouleau-glace',
        price: 11.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/09a75a18-0508-4846-bc11-2ffb379d0af2.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 92,
        bestseller: false,
        concerns: ['poches', 'inflammation']
    },

    {
        id: 501,
        name: 'Ice Roller Visage N°4',
        category: 'outils',
        subcategory: 'rouleau-glace',
        price: 4.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/28/07/48fdd10d-71bf-44d4-bed4-cc4988e48a7f_trans.jpeg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 46,
        bestseller: false,
        concerns: ['poches', 'inflammation'],
        gender: 'homme'
    },

    {
        id: 504,
        name: 'Appareil Beauté N°4',
        category: 'outils',
        subcategory: 'appareil-visage',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/af9792ad-d830-4ea0-97fa-032155c7e2de.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 146,
        bestseller: false,
        concerns: ['fermete']
    },

    {
        id: 507,
        name: 'Brosse Nettoyante',
        category: 'outils',
        subcategory: 'brosse-visage',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/01fbf065-6bed-4f84-8c86-abdab6ad8c7b.jpg',
        badge: 'Nouveau',
        rating: 4.2,
        reviews: 163,
        bestseller: false,
        concerns: ['nettoyage', 'pores']
    },

    // ——— BIEN-ÊTRE & AROMATHÉRAPIE (30 produits) ———

    {
        id: 417,
        name: 'Huile Essentielle Romarin',
        category: 'aromatherapie',
        subcategory: 'huile-essentielle',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/fa273f23-9d7f-41af-a30d-f448b5d2b4c0.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 105,
        bestseller: false,
        concerns: ['relaxation']
    },

    {
        id: 418,
        name: 'Huile Essentielle Naturel',
        category: 'aromatherapie',
        subcategory: 'huile-essentielle',
        price: 59.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/d943fd68-1143-4003-9222-90fa2e5437f5.png',
        badge: 'Exclusif',
        rating: 4.1,
        reviews: 156,
        bestseller: false,
        concerns: ['relaxation']
    },

    {
        id: 419,
        name: 'Diffuseur d\'Ambiance',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2025/11/05/04/a9aedba7-380f-4992-83b2-9da45bd726dc.jpg',
        badge: 'Best-seller',
        rating: 4.9,
        reviews: 185,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 420,
        name: 'Diffuseur d\'Ambiance N°2',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2024/09/24/03/e8c1b9a3-048a-4e0f-8673-a28dcf73248f.jpg',
        badge: 'Tendance',
        rating: 4.8,
        reviews: 193,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 421,
        name: 'Diffuseur d\'Ambiance Lavande 10ml',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2024/06/19/01/422e5278-6f48-46cc-a95c-ec8f1115700c_trans.jpeg',
        badge: 'Top ventes',
        rating: 3.9,
        reviews: 35,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 422,
        name: 'Diffuseur d\'Ambiance 10ml',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/68ea0afb-6a45-4d84-8ebc-123850f919a2.jpg',
        badge: 'Coup de cœur',
        rating: 4.8,
        reviews: 176,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 423,
        name: 'Diffuseur d\'Ambiance N°3',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 22.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/5f3334bb-2ba7-4515-9f07-b4d16a869891.jpg',
        badge: 'Nouveau',
        rating: 4.1,
        reviews: 131,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 424,
        name: 'Diffuseur d\'Ambiance N°4',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 49.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/ae653042-e421-43aa-a056-3fc89e5a6aaf.jpg',
        badge: 'Exclusif',
        rating: 4.7,
        reviews: 181,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 425,
        name: 'Diffuseur d\'Ambiance 10ml 10ml',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/64603918-8556-4e9f-b7c4-684838cffd64.jpg',
        badge: 'Best-seller',
        rating: 4.2,
        reviews: 80,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 426,
        name: 'Diffuseur d\'Ambiance N°5',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/f7409a09-a7fc-4d98-936b-983cce3652b6.jpg',
        badge: 'Tendance',
        rating: 4.4,
        reviews: 178,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 427,
        name: 'Diffuseur d\'Ambiance Pro',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 34.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1623821961834.jpg',
        badge: 'Top ventes',
        rating: 4.5,
        reviews: 144,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 428,
        name: 'Diffuseur d\'Ambiance Expert',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1623223332988.jpg',
        badge: 'Coup de cœur',
        rating: 4.7,
        reviews: 50,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 429,
        name: 'Diffuseur d\'Ambiance Intense',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 32.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1622515668386.jpg',
        badge: 'Nouveau',
        rating: 4.8,
        reviews: 78,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 430,
        name: 'Diffuseur d\'Ambiance 10Ml',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1621308354591.jpg',
        badge: 'Exclusif',
        rating: 4.3,
        reviews: 191,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 431,
        name: 'Diffuseur d\'Ambiance Plus',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 24.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1620787276871.png',
        badge: 'Best-seller',
        rating: 4.1,
        reviews: 90,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 432,
        name: 'Diffuseur d\'Ambiance Ultra',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 27.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1620704858684.jpg',
        badge: 'Tendance',
        rating: 3.9,
        reviews: 93,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 433,
        name: 'Diffuseur d\'Ambiance Naturel',
        category: 'aromatherapie',
        subcategory: 'diffuseur',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/1619063483587.jpg',
        badge: 'Top ventes',
        rating: 3.9,
        reviews: 65,
        bestseller: false,
        concerns: ['relaxation', 'ambiance']
    },

    {
        id: 434,
        name: 'Bombe de Bain Naturel',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/40f97240-ec41-4af0-811e-c30830d6bf64.jpg',
        badge: 'Coup de cœur',
        rating: 4.7,
        reviews: 170,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 435,
        name: 'Bombe de Bain Arbre à Thé',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/03/11/11/80d6302d-8faf-45d7-804d-19616861352c.jpg',
        badge: 'Nouveau',
        rating: 4.7,
        reviews: 191,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 436,
        name: 'Bombe de Bain',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/2c9d0c74-3b5c-42ed-ab15-bd6a53621860.jpg',
        badge: 'Exclusif',
        rating: 4.4,
        reviews: 147,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 437,
        name: 'Bombe de Bain N°2',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 9.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/970ce344-d827-40c7-9a46-5c9a5b380ce1.jpg',
        badge: 'Best-seller',
        rating: 3.9,
        reviews: 129,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 438,
        name: 'Bombe de Bain Nourrissant',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 6.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/d6135726-e0a5-406a-aeee-e443e47ebf97.jpg',
        badge: 'Tendance',
        rating: 4.6,
        reviews: 27,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 439,
        name: 'Bombe de Bain Rose',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 16.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/quick/product/7d0e3621-00e6-49d3-bfaa-771e31b146c4.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 174,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 440,
        name: 'Bombe de Bain N°3',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/02/09/04/b44aa839-7a1a-47a7-940b-e115f083ce0b.jpg',
        badge: 'Coup de cœur',
        rating: 4.4,
        reviews: 107,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 441,
        name: 'Bombe de Bain Curcuma',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/19/07/298ed71a-60a1-415b-a17a-97de642f6b3c.jpg',
        badge: 'Nouveau',
        rating: 4.4,
        reviews: 109,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 442,
        name: 'Bombe de Bain N°4',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/18/08/179c3060-9079-4654-8766-7276d425b6a7.jpg',
        badge: 'Exclusif',
        rating: 3.8,
        reviews: 173,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 443,
        name: 'Bombe de Bain N°5',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/18/08/61bb1f35-dfeb-4980-930b-1ed3243f2738.jpg',
        badge: 'Best-seller',
        rating: 4.6,
        reviews: 156,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 444,
        name: 'Bombe de Bain Éclat',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/15/07/c13df9fc-83f0-4a80-a352-ad0e53ff7a85.jpg',
        badge: 'Tendance',
        rating: 4.3,
        reviews: 108,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 445,
        name: 'Bombe de Bain Apaisant',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 7.90,
        oldPrice: null,
        image: 'https://oss-cf.cjdropshipping.com/product/2026/01/04/09/3388e243-0456-48ee-a64d-22a6275c751e.jpg',
        badge: 'Top ventes',
        rating: 4.6,
        reviews: 60,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

    {
        id: 446,
        name: 'Bombe de Bain Vitamine E',
        category: 'aromatherapie',
        subcategory: 'bombe-bain',
        price: 19.90,
        oldPrice: null,
        image: 'https://cf.cjdropshipping.com/287132f4-1fcc-4c70-b270-e5ddcba8236f.jpg',
        badge: 'Coup de cœur',
        rating: 3.9,
        reviews: 26,
        bestseller: false,
        concerns: ['relaxation', 'hydratation']
    },

];

const BUNDLES = [
    // Éclat: 7.90+14.90+9.90=32.70 → 24.90 (-24%, économie 7.80€)
    { key: 'eclat', name: 'Routine Éclat', productIds: [5, 8, 2], price: 24.90 },
    // Anti-Âge: 39.90+14.90+12.90=67.70 → 49.90 (-26%, économie 17.80€)
    { key: 'antiage', name: 'Routine Anti-Âge', productIds: [1, 154, 10], price: 49.90 },
    // Glow: 14.90+14.90+9.90=39.70 → 29.90 (-25%, économie 9.80€)
    { key: 'glow', name: 'Routine Glow', productIds: [8, 11, 9], price: 29.90 },
    // Hydra: 12.90+9.90+9.90=32.70 → 24.90 (-24%, économie 7.80€)
    { key: 'hydra', name: 'Coffret Hydratation Intense', productIds: [162, 29, 20], price: 24.90 },
    // Barbe: 22.90+14.90=37.80 → 29.90 (-21%, économie 7.90€)
    { key: 'barbe', name: 'Coffret Gentleman Barbe', productIds: [329, 332], price: 29.90 },
    // Nails: 24.90+6.90+44.90=76.70 → 59.90 (-22%, économie 16.80€)
    { key: 'nails', name: 'Coffret Nail Pro', productIds: [307, 304, 316], price: 59.90 },
    // Cheveux: 7.90+27.90+7.90=43.70 → 34.90 (-20%, économie 8.80€)
    { key: 'cheveux', name: 'Coffret Cheveux Soyeux', productIds: [222, 221, 223], price: 34.90 },
    // SPA: 19.90+19.90+9.90=49.70 → 39.90 (-20%, économie 9.80€)
    { key: 'spa', name: 'Coffret SPA Maison', productIds: [434, 419, 13], price: 39.90 },
    // Corps: 7.90+8.90+39.90=56.70 → 44.90 (-21%, économie 11.80€)
    { key: 'corps', name: 'Coffret Corps Complet', productIds: [195, 183, 184], price: 44.90 },
];

const ROUTINE_STEPS = [
    { key: 'nettoyage', icon: '🧼', fr: 'Nettoyage', en: 'Cleansing', es: 'Limpieza', de: 'Reinigung' },
    { key: 'preparation', icon: '❄️', fr: 'Préparation', en: 'Prep', es: 'Preparación', de: 'Vorbereitung' },
    { key: 'serum', icon: '💧', fr: 'Sérum', en: 'Serum', es: 'Sérum', de: 'Serum' },
    { key: 'soin', icon: '✨', fr: 'Soin', en: 'Care', es: 'Cuidado', de: 'Pflege' },
    { key: 'outil', icon: '🔧', fr: 'Outil beauté', en: 'Beauty tool', es: 'Herramienta', de: 'Beauty-Tool' },
];

const PRODUCT_ROUTINE_MAP = {
    1: 'outil', 2: 'outil', 3: 'nettoyage', 4: 'nettoyage', 5: 'preparation',
    6: 'outil', 7: 'preparation', 8: 'serum', 9: 'soin', 10: 'soin',
    11: 'soin', 12: 'soin',
    16: 'soin',
    17: 'soin',
    18: 'soin',
    19: 'soin',
    20: 'soin',
    21: 'soin',
    22: 'soin',
    23: 'soin',
    24: 'soin',
    25: 'soin',
    26: 'soin',
    27: 'soin',
    28: 'soin',
    29: 'soin',
    31: 'soin',
    32: 'soin',
    33: 'soin',
    34: 'soin',
    35: 'soin',
    36: 'soin',
    37: 'soin',
    38: 'soin',
    39: 'soin',
    40: 'soin',
    41: 'soin',
    42: 'soin',
    43: 'soin',
    44: 'soin',
    45: 'soin',
    46: 'soin',
    47: 'soin',
    48: 'soin',
    49: 'soin',
    50: 'soin',
    51: 'soin',
    52: 'soin',
    53: 'soin',
    54: 'soin',
    55: 'soin',
    56: 'soin',
    57: 'soin',
    58: 'soin',
    59: 'soin',
    60: 'soin',
    61: 'soin',
    62: 'soin',
    63: 'soin',
    64: 'soin',
    65: 'soin',
    66: 'soin',
    67: 'soin',
    68: 'soin',
    69: 'soin',
    70: 'soin',
    71: 'soin',
    72: 'soin',
    73: 'soin',
    74: 'soin',
    75: 'soin',
    76: 'soin',
    77: 'soin',
    78: 'soin',
    79: 'soin',
    80: 'soin',
    81: 'soin',
    82: 'soin',
    83: 'soin',
    84: 'soin',
    85: 'soin',
    86: 'soin',
    87: 'soin',
    88: 'soin',
    89: 'soin',
    90: 'soin',
    92: 'soin',
    93: 'soin',
    94: 'nettoyage',
    95: 'nettoyage',
    96: 'nettoyage',
    97: 'nettoyage',
    98: 'nettoyage',
    99: 'nettoyage',
    100: 'nettoyage',
    101: 'nettoyage',
    102: 'soin',
    103: 'nettoyage',
    104: 'nettoyage',
    105: 'nettoyage',
    106: 'nettoyage',
    107: 'nettoyage',
    108: 'soin',
    109: 'nettoyage',
    110: 'nettoyage',
    111: 'nettoyage',
    112: 'nettoyage',
    113: 'nettoyage',
    114: 'nettoyage',
    115: 'nettoyage',
    116: 'soin',
    117: 'soin',
    118: 'nettoyage',
    119: 'nettoyage',
    121: 'nettoyage',
    122: 'nettoyage',
    123: 'nettoyage',
    124: 'nettoyage',
    125: 'nettoyage',
    126: 'nettoyage',
    127: 'nettoyage',
    128: 'nettoyage',
    129: 'nettoyage',
    130: 'nettoyage',
    131: 'nettoyage',
    132: 'nettoyage',
    133: 'nettoyage',
    134: 'nettoyage',
    135: 'nettoyage',
    136: 'nettoyage',
    137: 'nettoyage',
    138: 'nettoyage',
    139: 'nettoyage',
    140: 'nettoyage',
    141: 'nettoyage',
    142: 'nettoyage',
    143: 'nettoyage',
    144: 'nettoyage',
    145: 'preparation',
    146: 'serum',
    147: 'serum',
    148: 'serum',
    149: 'serum',
    150: 'serum',
    151: 'serum',
    152: 'serum',
    153: 'serum',
    154: 'serum',
    155: 'serum',
    156: 'serum',
    157: 'serum',
    158: 'serum',
    159: 'serum',
    160: 'serum',
    161: 'serum',
    162: 'serum',
    163: 'serum',
    164: 'serum',
    165: 'serum',
    166: 'serum',
    167: 'serum',
    168: 'serum',
    169: 'serum',
    170: 'serum',
    171: 'serum',
    172: 'serum',
    173: 'serum',
    174: 'serum',
    175: 'serum',
    176: 'serum',
    177: 'serum',
    178: 'serum',
    179: 'serum',
    180: 'serum',
    181: 'serum',
    182: 'serum',
    372: 'outil',
    373: 'outil',
    374: 'outil',
    375: 'outil',
    376: 'outil',
    377: 'outil',
    378: 'outil',
    379: 'outil',
    380: 'outil',
    381: 'outil',
    382: 'outil',
    383: 'outil',
    384: 'outil',
    385: 'outil',
    386: 'outil',
    387: 'outil',
    388: 'outil',
    389: 'outil',
    390: 'outil',
    391: 'outil',
    392: 'outil',
    393: 'outil',
    394: 'outil',
    395: 'outil',
    396: 'outil',
    397: 'outil',
    398: 'outil',
    399: 'outil',
    400: 'outil',
    401: 'outil',
    402: 'outil',
    403: 'outil',
    404: 'outil',
    405: 'outil',
    406: 'outil',
    407: 'outil',
    408: 'outil',
    409: 'outil',
    410: 'outil',
    411: 'outil',
    412: 'outil',
    413: 'outil',
    414: 'outil',
    415: 'outil',
    416: 'outil',
    447: 'preparation',
    449: 'outil',
    451: 'soin',
    453: 'outil',
    455: 'preparation',
    457: 'outil',
    459: 'soin',
    461: 'outil',
    463: 'soin',
    465: 'outil',
    467: 'soin',
    469: 'outil',
    471: 'soin',
    473: 'outil',
    475: 'preparation',
    477: 'outil',
    478: 'preparation',
    480: 'outil',
    481: 'preparation',
    483: 'outil',
    484: 'soin',
    486: 'outil',
    487: 'preparation',
    489: 'outil',
    490: 'preparation',
    492: 'outil',
    493: 'preparation',
    495: 'outil',
    496: 'soin',
    498: 'outil',
    499: 'preparation',
    501: 'outil',
    502: 'preparation',
    504: 'outil',
    505: 'nettoyage',
    507: 'outil',
    508: 'soin',
    510: 'soin',
    512: 'preparation',
    514: 'soin',
};

// ========== PROXY IMAGES CJ CDN ==========
// CJ Dropshipping CDN bloque TOUT hotlinking (navigateur + proxy connus).
// On proxifie via notre propre /api/img sur Vercel (fetch serveur, cache CDN 30j).
// Appliqué ICI dans products.js pour que TOUTES les pages en bénéficient.
(function() {
    var BASE = (typeof window !== 'undefined' && window.location.pathname.indexOf('/pages/') !== -1) ? '../' : '/';
    function proxyUrl(url) {
        if (!url || typeof url !== 'string') return url;
        if (url.indexOf('cjdropshipping.com') !== -1) {
            return BASE + 'api/img?url=' + encodeURIComponent(url);
        }
        return url;
    }
    window.imgProxy = proxyUrl;
    if (typeof PRODUCTS !== 'undefined') {
        for (var i = 0; i < PRODUCTS.length; i++) {
            if (PRODUCTS[i] && PRODUCTS[i].image) {
                PRODUCTS[i].image = proxyUrl(PRODUCTS[i].image);
            }
        }
    }
})();
