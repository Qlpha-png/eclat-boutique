// ============================
// ÉCLAT — Base de données ingrédients & matériaux
// Données : EWG Skin Deep, CIR, INCIDecoder
// ============================

var INGREDIENTS_DB = {

    // ═══════════════════════════════════════════════════
    // INGRÉDIENTS COSMÉTIQUES (INCI)
    // ═══════════════════════════════════════════════════

    "Aqua": {
        safety: "excellent", score: 100, ewg: 1,
        category: "solvent", origin: "natural",
        fr: "Eau purifiée — base universelle de toute formulation cosmétique. Totalement sûre.",
        en: "Purified water — universal base for all cosmetic formulations. Completely safe."
    },
    "Ethyl Ascorbic Acid": {
        safety: "excellent", score: 95, ewg: 1,
        category: "antioxidant", origin: "synthetic",
        fr: "Forme stabilisée de Vitamine C à 20%. Puissant antioxydant qui stimule la production de collagène, éclaircit le teint et protège des radicaux libres. Études cliniques prouvées.",
        en: "Stabilized form of Vitamin C at 20%. Powerful antioxidant that boosts collagen production, brightens skin tone and protects against free radicals."
    },
    "Hyaluronic Acid": {
        safety: "excellent", score: 98, ewg: 1,
        category: "humectant", origin: "synthetic",
        fr: "Acide hyaluronique — retient jusqu'à 1000x son poids en eau. Hydrate, repulpe et lisse les ridules. Naturellement présent dans la peau.",
        en: "Hyaluronic acid — holds up to 1000x its weight in water. Hydrates, plumps and smooths fine lines. Naturally present in skin."
    },
    "Sodium Hyaluronate": {
        safety: "excellent", score: 97, ewg: 1,
        category: "humectant", origin: "synthetic",
        fr: "Sel de sodium de l'acide hyaluronique. Molécule plus petite = pénétration plus profonde. Hydratation longue durée.",
        en: "Sodium salt of hyaluronic acid. Smaller molecule = deeper penetration. Long-lasting hydration."
    },
    "Glycerin": {
        safety: "excellent", score: 98, ewg: 1,
        category: "humectant", origin: "natural",
        fr: "Glycérine végétale — humectant naturel qui attire l'eau dans la peau. Protège la barrière cutanée. Ingrédient le plus utilisé en cosmétique après l'eau.",
        en: "Vegetable glycerin — natural humectant that draws water into skin. Protects skin barrier. Most used cosmetic ingredient after water."
    },
    "Niacinamide": {
        safety: "excellent", score: 96, ewg: 1,
        category: "active", origin: "synthetic",
        fr: "Vitamine B3 — réduit les pores, uniformise le teint, renforce la barrière cutanée, anti-inflammatoire. L'actif polyvalent par excellence.",
        en: "Vitamin B3 — minimizes pores, evens skin tone, strengthens skin barrier, anti-inflammatory. The ultimate multi-tasking active."
    },
    "Tocopherol": {
        safety: "excellent", score: 97, ewg: 1,
        category: "antioxidant", origin: "natural",
        fr: "Vitamine E naturelle — antioxydant puissant qui protège les cellules. Nourrit, apaise, accélère la cicatrisation.",
        en: "Natural Vitamin E — powerful antioxidant that protects cells. Nourishes, soothes, accelerates healing."
    },
    "Ferulic Acid": {
        safety: "excellent", score: 95, ewg: 1,
        category: "antioxidant", origin: "natural",
        fr: "Acide férulique — booste l'efficacité des vitamines C et E de 8x (étude Duke University). Antioxydant et protecteur solaire naturel.",
        en: "Ferulic acid — boosts vitamin C and E efficacy by 8x (Duke University study). Antioxidant and natural sun protector."
    },
    "Aloe Barbadensis Leaf Extract": {
        safety: "excellent", score: 98, ewg: 1,
        category: "soothing", origin: "natural",
        fr: "Extrait d'Aloe Vera — apaise, hydrate, anti-inflammatoire. Utilisé depuis l'Antiquité pour ses propriétés cicatrisantes.",
        en: "Aloe Vera extract — soothes, hydrates, anti-inflammatory. Used since antiquity for its healing properties."
    },
    "Hydrolyzed Collagen": {
        safety: "excellent", score: 94, ewg: 1,
        category: "anti-aging", origin: "natural",
        fr: "Collagène marin hydrolysé — peptides qui repulpent et raffermissent la peau. Améliore l'élasticité et réduit les rides.",
        en: "Hydrolyzed marine collagen — peptides that plump and firm skin. Improves elasticity and reduces wrinkles."
    },
    "Retinyl Palmitate": {
        safety: "good", score: 82, ewg: 4,
        category: "anti-aging", origin: "synthetic",
        fr: "Forme douce de Vitamine A (rétinol). Stimule le renouvellement cellulaire, lisse les rides. Plus doux que le rétinol pur.",
        en: "Gentle form of Vitamin A (retinol). Stimulates cell renewal, smooths wrinkles. Gentler than pure retinol."
    },
    "Retinol": {
        safety: "good", score: 80, ewg: 4,
        category: "anti-aging", origin: "synthetic",
        fr: "Vitamine A pure — le gold standard anti-âge. Accélère le renouvellement cellulaire, réduit rides et taches. Peut être irritant au début.",
        en: "Pure Vitamin A — the gold standard for anti-aging. Accelerates cell renewal, reduces wrinkles and dark spots. Can be irritating initially."
    },
    "Gold (CI 77480)": {
        safety: "excellent", score: 90, ewg: 1,
        category: "luxe", origin: "mineral",
        fr: "Or colloïdal — propriétés antioxydantes, améliore la microcirculation. Ingrédient premium utilisé en cosmétique de luxe.",
        en: "Colloidal gold — antioxidant properties, improves microcirculation. Premium ingredient used in luxury cosmetics."
    },
    "Centella Asiatica Extract": {
        safety: "excellent", score: 97, ewg: 1,
        category: "soothing", origin: "natural",
        fr: "Centella Asiatica (Cica) — star de la K-beauty. Répare, apaise, anti-inflammatoire. Stimule la production de collagène naturel.",
        en: "Centella Asiatica (Cica) — K-beauty star ingredient. Repairs, soothes, anti-inflammatory. Stimulates natural collagen production."
    },
    "Adenosine": {
        safety: "excellent", score: 95, ewg: 1,
        category: "anti-aging", origin: "synthetic",
        fr: "Adénosine — anti-rides prouvé cliniquement. Lisse les ridules, améliore l'élasticité. Reconnu par l'UE comme actif anti-âge.",
        en: "Adenosine — clinically proven anti-wrinkle. Smooths fine lines, improves elasticity. EU-recognized anti-aging active."
    },
    "Allantoin": {
        safety: "excellent", score: 97, ewg: 1,
        category: "soothing", origin: "synthetic",
        fr: "Allantoïne — apaise les irritations, accélère la régénération cellulaire. Très bien toléré, même sur peaux ultra-sensibles.",
        en: "Allantoin — soothes irritation, accelerates cell regeneration. Very well tolerated, even on ultra-sensitive skin."
    },
    "Hydrolyzed Hyaluronic Acid": {
        safety: "excellent", score: 97, ewg: 1,
        category: "humectant", origin: "synthetic",
        fr: "Acide hyaluronique fragmenté en micro-aiguilles. Pénètre plus profondément que l'HA classique pour une hydratation intense.",
        en: "Hyaluronic acid fragmented into micro-needles. Penetrates deeper than standard HA for intense hydration."
    },
    "Acetyl Hexapeptide-8": {
        safety: "excellent", score: 93, ewg: 1,
        category: "anti-aging", origin: "synthetic",
        fr: "Argireline — le 'Botox en crème'. Peptide qui détend les micro-contractions musculaires pour lisser les rides d'expression.",
        en: "Argireline — 'Botox in a cream'. Peptide that relaxes micro-muscle contractions to smooth expression lines."
    },
    "Rosa Canina Seed Oil": {
        safety: "excellent", score: 99, ewg: 1,
        category: "emollient", origin: "natural",
        fr: "Huile de Rose Musquée pure — trésor naturel riche en oméga 3, 6 et 9. Régénère, atténue cicatrices et vergetures, anti-rides naturel.",
        en: "Pure Rosehip Oil — natural treasure rich in omega 3, 6 and 9. Regenerates, fades scars and stretch marks, natural anti-wrinkle."
    },

    // ═══════════════════════════════════════════════════
    // MATÉRIAUX APPAREILS & OUTILS
    // ═══════════════════════════════════════════════════

    "Silicone médical hypoallergénique": {
        safety: "excellent", score: 96, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Silicone de grade médical — hypoallergénique, utilisé en chirurgie et prothèses. Contact peau sûr et durable.",
        en: "Medical-grade silicone — hypoallergenic, used in surgery and prosthetics. Safe and durable skin contact."
    },
    "Silicone alimentaire": {
        safety: "excellent", score: 95, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Silicone de qualité alimentaire — sans BPA, approuvé FDA pour le contact alimentaire et cutané.",
        en: "Food-grade silicone — BPA-free, FDA-approved for food and skin contact."
    },
    "LED SMD haute efficacité": {
        safety: "excellent", score: 94, ewg: 1,
        category: "technology", origin: "synthetic",
        fr: "Diodes LED à montage en surface — lumière thérapeutique sans UV. Technologie utilisée en dermatologie professionnelle.",
        en: "Surface-mounted LED diodes — therapeutic light without UV. Technology used in professional dermatology."
    },
    "Quartz rose 100% naturel (SiO₂ + traces Ti, Mn)": {
        safety: "excellent", score: 100, ewg: 1,
        category: "mineral", origin: "natural",
        fr: "Quartz rose naturel — minéral pur (dioxyde de silicium). Utilisé en lithothérapie depuis des millénaires. Inerte et non toxique.",
        en: "Natural rose quartz — pure mineral (silicon dioxide). Used in crystal therapy for millennia. Inert and non-toxic."
    },
    "Acier inoxydable 304 (qualité médicale)": {
        safety: "excellent", score: 96, ewg: 1,
        category: "material", origin: "mineral",
        fr: "Acier inox 304 — grade médical utilisé en instruments chirurgicaux. Résistant à la corrosion, hypoallergénique.",
        en: "304 stainless steel — medical grade used in surgical instruments. Corrosion-resistant, hypoallergenic."
    },
    "Acier inoxydable": {
        safety: "excellent", score: 95, ewg: 1,
        category: "material", origin: "mineral",
        fr: "Acier inoxydable — alliage résistant à la corrosion. Contact peau sûr, facile à nettoyer.",
        en: "Stainless steel — corrosion-resistant alloy. Safe skin contact, easy to clean."
    },
    "ABS sans BPA": {
        safety: "excellent", score: 92, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Plastique ABS sans bisphénol A — résistant, léger, approuvé pour le contact cutané. Standard industrie cosmétique.",
        en: "BPA-free ABS plastic — durable, lightweight, approved for skin contact. Cosmetic industry standard."
    },
    "ABS médical": {
        safety: "excellent", score: 93, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "ABS de grade médical — plastique premium utilisé dans les dispositifs médicaux. Sans phtalates ni BPA.",
        en: "Medical-grade ABS — premium plastic used in medical devices. Phthalate and BPA-free."
    },
    "ABS alimentaire": {
        safety: "excellent", score: 92, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "ABS de qualité alimentaire — approuvé pour le contact avec les aliments et la peau. Sans substances nocives.",
        en: "Food-grade ABS — approved for food and skin contact. Free of harmful substances."
    },
    "ABS haute température": {
        safety: "excellent", score: 91, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "ABS résistant haute température — plastique technique pour appareils à vapeur. Sans dégazage nocif.",
        en: "High-temperature ABS — technical plastic for steam devices. No harmful off-gassing."
    },
    "Gel cryogénique non toxique": {
        safety: "excellent", score: 93, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Gel de refroidissement non toxique — conserve le froid longtemps. Scellé, aucun contact direct avec la peau.",
        en: "Non-toxic cooling gel — retains cold for long periods. Sealed, no direct skin contact."
    },
    "Nylon Dupont": {
        safety: "excellent", score: 90, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Nylon Dupont — fibre synthétique premium pour brossage doux. Ultra-souple, n'irrite pas la peau.",
        en: "Dupont nylon — premium synthetic fiber for gentle brushing. Ultra-soft, non-irritating to skin."
    },
    "électrodes acier inoxydable 316L": {
        safety: "excellent", score: 97, ewg: 1,
        category: "material", origin: "mineral",
        fr: "Acier 316L — le meilleur grade pour implants médicaux et bijoux hypoallergéniques. Zéro nickel libéré.",
        en: "316L steel — the best grade for medical implants and hypoallergenic jewelry. Zero nickel release."
    },
    "Céramique piézoélectrique": {
        safety: "excellent", score: 94, ewg: 1,
        category: "technology", origin: "mineral",
        fr: "Céramique piézoélectrique — génère des vibrations ultrasoniques. Technologie utilisée en médecine et industrie.",
        en: "Piezoelectric ceramic — generates ultrasonic vibrations. Technology used in medicine and industry."
    },
    "PP alimentaire": {
        safety: "excellent", score: 93, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Polypropylène alimentaire — plastique le plus sûr (code recyclage 5). Résistant à la chaleur, sans BPA.",
        en: "Food-grade polypropylene — safest plastic (recycling code 5). Heat-resistant, BPA-free."
    },
    "Verre borosilicate": {
        safety: "excellent", score: 99, ewg: 1,
        category: "material", origin: "mineral",
        fr: "Verre borosilicate — même verre que Pyrex. Résistant thermiquement, chimiquement inerte. Matériau premium.",
        en: "Borosilicate glass — same glass as Pyrex. Thermally resistant, chemically inert. Premium material."
    },
    "Poudre de fer": {
        safety: "excellent", score: 88, ewg: 1,
        category: "thermal", origin: "mineral",
        fr: "Poudre de fer — réagit avec l'oxygène pour produire une chaleur douce et constante. Contenue dans un sachet scellé, aucun contact peau.",
        en: "Iron powder — reacts with oxygen to produce gentle, constant heat. Contained in a sealed pouch, no skin contact."
    },
    "Charbon actif": {
        safety: "excellent", score: 95, ewg: 1,
        category: "purifying", origin: "natural",
        fr: "Charbon actif — purifiant naturel qui absorbe les impuretés. Utilisé en médecine, cosmétique et filtration d'eau.",
        en: "Activated charcoal — natural purifier that absorbs impurities. Used in medicine, cosmetics and water filtration."
    },
    "Parfum lavande naturelle": {
        safety: "good", score: 85, ewg: 3,
        category: "fragrance", origin: "natural",
        fr: "Essence naturelle de lavande — aromathérapie relaxante. Peut provoquer des réactions chez les peaux très sensibles aux huiles essentielles.",
        en: "Natural lavender essence — relaxing aromatherapy. May cause reactions in skin very sensitive to essential oils."
    },
    "Satin polyester (anti-frizz)": {
        safety: "excellent", score: 91, ewg: 1,
        category: "textile", origin: "synthetic",
        fr: "Satin polyester — surface lisse qui réduit la friction et les frisottis. N'absorbe pas l'hydratation des cheveux.",
        en: "Polyester satin — smooth surface that reduces friction and frizz. Doesn't absorb hair moisture."
    },
    "Mousse à mémoire de forme": {
        safety: "excellent", score: 90, ewg: 1,
        category: "material", origin: "synthetic",
        fr: "Mousse viscoélastique — s'adapte à la forme de la tête pour un confort optimal pendant le sommeil.",
        en: "Memory foam — conforms to head shape for optimal comfort during sleep."
    },
    "circuit imprimé sans BPA": {
        safety: "excellent", score: 90, ewg: 1,
        category: "technology", origin: "synthetic",
        fr: "Circuit électronique sans bisphénol A — composant technique protégé, aucun contact direct avec la peau.",
        en: "BPA-free printed circuit board — protected technical component, no direct skin contact."
    },
    "Fil métallique flexible": {
        safety: "excellent", score: 89, ewg: 1,
        category: "material", origin: "mineral",
        fr: "Fil métallique gainé — flexible et résistant, enrobé pour éviter tout contact métal-cheveux.",
        en: "Coated metal wire — flexible and durable, coated to prevent metal-hair contact."
    }
};
