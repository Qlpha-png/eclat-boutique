// ============================
// ECLAT Beaute — Base de donnees ingredients INCI
// Sources : EWG Skin Deep, CIR (Cosmetic Ingredient Review), INCIDecoder
// Format : safety | score | category | origin | description_fr | description_en | ewg_score
// ============================

var INGREDIENTS_DB = {

    // ═══════════════════════════════════════════════════
    // SOLVANTS / BASE
    // ═══════════════════════════════════════════════════

    "Aqua": {
        safety: "excellent",
        score: 100,
        category: "solvent",
        origin: "natural",
        description_fr: "Eau purifiee — base universelle de toute formulation cosmetique. Totalement sure.",
        description_en: "Purified water — universal base for all cosmetic formulations. Completely safe.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // VITAMINES
    // ═══════════════════════════════════════════════════

    "Retinol": {
        safety: "moderate",
        score: 73,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Vitamine A pure — gold standard anti-age. Accelere le renouvellement cellulaire, reduit rides et taches. Peut etre irritant, eviter pendant la grossesse.",
        description_en: "Pure Vitamin A — gold standard for anti-aging. Accelerates cell renewal, reduces wrinkles and dark spots. Can be irritating, avoid during pregnancy.",
        ewg_score: 4
    },
    "Niacinamide": {
        safety: "excellent",
        score: 96,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Vitamine B3 — reduit les pores, unifie le teint, renforce la barriere cutanee. Actif polyvalent anti-inflammatoire.",
        description_en: "Vitamin B3 — minimizes pores, evens skin tone, strengthens skin barrier. Multi-tasking anti-inflammatory active.",
        ewg_score: 1
    },
    "Tocopherol": {
        safety: "excellent",
        score: 97,
        category: "vitamin",
        origin: "natural",
        description_fr: "Vitamine E naturelle — antioxydant puissant qui protege les cellules. Nourrit, apaise, accelere la cicatrisation.",
        description_en: "Natural Vitamin E — powerful antioxidant that protects cells. Nourishes, soothes, accelerates healing.",
        ewg_score: 1
    },
    "Ascorbic Acid": {
        safety: "excellent",
        score: 94,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Vitamine C pure (acide L-ascorbique). Antioxydant puissant, eclaircit le teint, stimule le collagene. Instable a l'air libre.",
        description_en: "Pure Vitamin C (L-ascorbic acid). Powerful antioxidant, brightens skin, stimulates collagen. Unstable when exposed to air.",
        ewg_score: 1
    },
    "Ethyl Ascorbic Acid": {
        safety: "excellent",
        score: 95,
        category: "antioxidant",
        origin: "synthetic",
        description_fr: "Forme stabilisee de Vitamine C. Puissant antioxydant qui illumine le teint et reduit les taches.",
        description_en: "Stabilized form of Vitamin C. Powerful antioxidant that brightens skin and reduces dark spots.",
        ewg_score: 1
    },
    "Panthenol": {
        safety: "excellent",
        score: 97,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Provitamine B5 — hydrate en profondeur, apaise les irritations, accelere la reparation cutanee. Tres bien tolere.",
        description_en: "Provitamin B5 — deeply hydrates, soothes irritation, accelerates skin repair. Very well tolerated.",
        ewg_score: 1
    },
    "Tocopheryl Acetate": {
        safety: "excellent",
        score: 95,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Forme stabilisee de Vitamine E. Antioxydant, protege contre les UV et la pollution. Plus stable que le tocopherol pur.",
        description_en: "Stabilized form of Vitamin E. Antioxidant, protects against UV and pollution. More stable than pure tocopherol.",
        ewg_score: 1
    },
    "Retinyl Palmitate": {
        safety: "good",
        score: 78,
        category: "vitamin",
        origin: "synthetic",
        description_fr: "Forme douce de retinol (Vitamine A). Stimule le renouvellement cellulaire avec moins d'irritation que le retinol pur.",
        description_en: "Gentle form of retinol (Vitamin A). Stimulates cell renewal with less irritation than pure retinol.",
        ewg_score: 4
    },

    // ═══════════════════════════════════════════════════
    // ACIDES
    // ═══════════════════════════════════════════════════

    "Hyaluronic Acid": {
        safety: "excellent",
        score: 98,
        category: "humectant",
        origin: "synthetic",
        description_fr: "Acide hyaluronique — retient jusqu'a 1000x son poids en eau. Hydrate, repulpe et lisse les ridules.",
        description_en: "Hyaluronic acid — holds up to 1000x its weight in water. Hydrates, plumps and smooths fine lines.",
        ewg_score: 1
    },
    "Sodium Hyaluronate": {
        safety: "excellent",
        score: 97,
        category: "humectant",
        origin: "synthetic",
        description_fr: "Sel de sodium de l'acide hyaluronique. Molecule plus petite pour une penetration plus profonde.",
        description_en: "Sodium salt of hyaluronic acid. Smaller molecule for deeper penetration.",
        ewg_score: 1
    },
    "Salicylic Acid": {
        safety: "good",
        score: 82,
        category: "active",
        origin: "synthetic",
        description_fr: "Acide salicylique (BHA) — exfoliant qui penetre les pores, anti-inflammatoire. Ideal pour peaux grasses et acneiques.",
        description_en: "Salicylic acid (BHA) — exfoliant that penetrates pores, anti-inflammatory. Ideal for oily and acne-prone skin.",
        ewg_score: 3
    },
    "Glycolic Acid": {
        safety: "good",
        score: 80,
        category: "active",
        origin: "synthetic",
        description_fr: "Acide glycolique (AHA) — exfoliant chimique le plus efficace. Lisse le grain de peau, estompe les taches. Peut etre irritant a forte concentration.",
        description_en: "Glycolic acid (AHA) — most effective chemical exfoliant. Smooths skin texture, fades dark spots. Can be irritating at high concentrations.",
        ewg_score: 4
    },
    "Lactic Acid": {
        safety: "good",
        score: 83,
        category: "active",
        origin: "natural",
        description_fr: "Acide lactique (AHA) — exfoliant doux derive du lait. Hydrate tout en exfoliant. Ideal pour peaux sensibles.",
        description_en: "Lactic acid (AHA) — gentle milk-derived exfoliant. Hydrates while exfoliating. Ideal for sensitive skin.",
        ewg_score: 3
    },
    "Mandelic Acid": {
        safety: "good",
        score: 85,
        category: "active",
        origin: "natural",
        description_fr: "Acide mandelique (AHA) — derive de l'amande amere. Exfoliant doux a grosses molecules, ideal peaux sensibles et foncees.",
        description_en: "Mandelic acid (AHA) — derived from bitter almonds. Gentle large-molecule exfoliant, ideal for sensitive and dark skin.",
        ewg_score: 2
    },
    "Ferulic Acid": {
        safety: "excellent",
        score: 95,
        category: "antioxidant",
        origin: "natural",
        description_fr: "Acide ferulique — booste l'efficacite des vitamines C et E de 8x. Antioxydant et photoprotecteur naturel.",
        description_en: "Ferulic acid — boosts vitamin C and E efficacy by 8x. Antioxidant and natural photoprotector.",
        ewg_score: 1
    },
    "Stearic Acid": {
        safety: "excellent",
        score: 92,
        category: "emollient",
        origin: "natural",
        description_fr: "Acide stearique — acide gras naturel. Emollient, stabilise les emulsions, adoucit la peau.",
        description_en: "Stearic acid — natural fatty acid. Emollient, stabilizes emulsions, softens skin.",
        ewg_score: 1
    },
    "Citric Acid": {
        safety: "excellent",
        score: 90,
        category: "active",
        origin: "natural",
        description_fr: "Acide citrique — ajuste le pH des formulations. Exfoliant leger, antioxydant naturel derive des agrumes.",
        description_en: "Citric acid — adjusts formulation pH. Mild exfoliant, natural antioxidant derived from citrus.",
        ewg_score: 2
    },

    // ═══════════════════════════════════════════════════
    // ACTIFS
    // ═══════════════════════════════════════════════════

    "Hydrolyzed Collagen": {
        safety: "excellent",
        score: 94,
        category: "active",
        origin: "natural",
        description_fr: "Collagene hydrolyse — peptides qui repulpent et raffermissent la peau. Ameliore l'elasticite.",
        description_en: "Hydrolyzed collagen — peptides that plump and firm skin. Improves elasticity.",
        ewg_score: 1
    },
    "Palmitoyl Tripeptide-1": {
        safety: "excellent",
        score: 93,
        category: "active",
        origin: "synthetic",
        description_fr: "Peptide de synthese — stimule la production de collagene et d'acide hyaluronique. Anti-rides prouve cliniquement.",
        description_en: "Synthetic peptide — stimulates collagen and hyaluronic acid production. Clinically proven anti-wrinkle.",
        ewg_score: 1
    },
    "Acetyl Hexapeptide-8": {
        safety: "excellent",
        score: 93,
        category: "active",
        origin: "synthetic",
        description_fr: "Argireline — peptide qui detend les micro-contractions musculaires pour lisser les rides d'expression.",
        description_en: "Argireline — peptide that relaxes micro-muscle contractions to smooth expression lines.",
        ewg_score: 1
    },
    "Ceramide NP": {
        safety: "excellent",
        score: 96,
        category: "active",
        origin: "synthetic",
        description_fr: "Ceramide NP — lipide identique a la peau. Repare et renforce la barriere cutanee, retient l'hydratation.",
        description_en: "Ceramide NP — skin-identical lipid. Repairs and strengthens the skin barrier, retains moisture.",
        ewg_score: 1
    },
    "Allantoin": {
        safety: "excellent",
        score: 97,
        category: "active",
        origin: "synthetic",
        description_fr: "Allantoine — apaise les irritations, accelere la regeneration cellulaire. Tres bien tolere, meme sur peaux ultra-sensibles.",
        description_en: "Allantoin — soothes irritation, accelerates cell regeneration. Very well tolerated, even on ultra-sensitive skin.",
        ewg_score: 1
    },
    "Centella Asiatica Extract": {
        safety: "excellent",
        score: 97,
        category: "active",
        origin: "natural",
        description_fr: "Centella Asiatica (Cica) — repare, apaise, anti-inflammatoire. Stimule la production de collagene naturel.",
        description_en: "Centella Asiatica (Cica) — repairs, soothes, anti-inflammatory. Stimulates natural collagen production.",
        ewg_score: 1
    },
    "Arbutin": {
        safety: "good",
        score: 88,
        category: "active",
        origin: "natural",
        description_fr: "Arbutine — derive de la busserole. Inhibe la tyrosinase pour eclaircir les taches pigmentaires sans irritation.",
        description_en: "Arbutin — derived from bearberry. Inhibits tyrosinase to lighten pigmentation spots without irritation.",
        ewg_score: 1
    },
    "Alpha-Arbutin": {
        safety: "good",
        score: 89,
        category: "active",
        origin: "synthetic",
        description_fr: "Alpha-arbutine — forme plus stable et efficace de l'arbutine. Agent depigmentant doux et sur.",
        description_en: "Alpha-arbutin — more stable and effective form of arbutin. Gentle and safe depigmenting agent.",
        ewg_score: 1
    },
    "Adenosine": {
        safety: "excellent",
        score: 95,
        category: "active",
        origin: "synthetic",
        description_fr: "Adenosine — anti-rides prouve cliniquement. Lisse les ridules, ameliore l'elasticite. Reconnu par l'UE.",
        description_en: "Adenosine — clinically proven anti-wrinkle. Smooths fine lines, improves elasticity. EU-recognized.",
        ewg_score: 1
    },
    "Bakuchiol": {
        safety: "excellent",
        score: 92,
        category: "active",
        origin: "natural",
        description_fr: "Bakuchiol — alternative vegetale au retinol. Anti-age, antioxydant, sans irritation. Compatible grossesse.",
        description_en: "Bakuchiol — plant-based retinol alternative. Anti-aging, antioxidant, non-irritating. Pregnancy-safe.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // NATURELS / EXTRAITS VEGETAUX
    // ═══════════════════════════════════════════════════

    "Aloe Barbadensis Leaf Extract": {
        safety: "excellent",
        score: 98,
        category: "active",
        origin: "natural",
        description_fr: "Extrait d'Aloe Vera — apaise, hydrate, anti-inflammatoire. Proprietes cicatrisantes reconnues depuis l'Antiquite.",
        description_en: "Aloe Vera extract — soothes, hydrates, anti-inflammatory. Healing properties recognized since antiquity.",
        ewg_score: 1
    },
    "Rosa Canina Seed Oil": {
        safety: "excellent",
        score: 99,
        category: "emollient",
        origin: "natural",
        description_fr: "Huile de Rose Musquee — riche en omega 3, 6, 9. Regenere, attenue cicatrices et vergetures.",
        description_en: "Rosehip Seed Oil — rich in omega 3, 6, 9. Regenerates, fades scars and stretch marks.",
        ewg_score: 1
    },
    "Simmondsia Chinensis Seed Oil": {
        safety: "excellent",
        score: 97,
        category: "emollient",
        origin: "natural",
        description_fr: "Huile de Jojoba — cire liquide biomimetique proche du sebum humain. Regule la production de sebum, nourrit sans graisser.",
        description_en: "Jojoba Oil — biomimetic liquid wax close to human sebum. Regulates sebum production, nourishes without greasiness.",
        ewg_score: 1
    },
    "Melaleuca Alternifolia Leaf Oil": {
        safety: "moderate",
        score: 72,
        category: "active",
        origin: "natural",
        description_fr: "Huile essentielle d'Arbre a The — antibacterien et antifongique puissant. Peut etre irritant pur, utiliser dilue.",
        description_en: "Tea Tree Essential Oil — powerful antibacterial and antifungal. Can be irritating undiluted, use diluted.",
        ewg_score: 4
    },
    "Camellia Sinensis Leaf Extract": {
        safety: "excellent",
        score: 96,
        category: "antioxidant",
        origin: "natural",
        description_fr: "Extrait de The Vert — riche en catechines (EGCG). Antioxydant puissant, protege contre les radicaux libres et la pollution.",
        description_en: "Green Tea Extract — rich in catechins (EGCG). Powerful antioxidant, protects against free radicals and pollution.",
        ewg_score: 1
    },
    "Squalane": {
        safety: "excellent",
        score: 98,
        category: "emollient",
        origin: "natural",
        description_fr: "Squalane — derive de l'olive ou de la canne a sucre. Emollient leger, identique au sebum. Hydrate sans obstruer les pores.",
        description_en: "Squalane — derived from olive or sugarcane. Lightweight emollient, identical to sebum. Moisturizes without clogging pores.",
        ewg_score: 1
    },
    "Butyrospermum Parkii Butter": {
        safety: "excellent",
        score: 98,
        category: "emollient",
        origin: "natural",
        description_fr: "Beurre de Karite — riche en vitamines A, E, F. Nourrit intensement, protege et repare la barriere cutanee.",
        description_en: "Shea Butter — rich in vitamins A, E, F. Intensely nourishes, protects and repairs the skin barrier.",
        ewg_score: 1
    },
    "Argania Spinosa Kernel Oil": {
        safety: "excellent",
        score: 97,
        category: "emollient",
        origin: "natural",
        description_fr: "Huile d'Argan — tresor marocain riche en vitamine E et acides gras. Anti-age, nourrit peau et cheveux.",
        description_en: "Argan Oil — Moroccan treasure rich in vitamin E and fatty acids. Anti-aging, nourishes skin and hair.",
        ewg_score: 1
    },
    "Chamomilla Recutita Extract": {
        safety: "excellent",
        score: 96,
        category: "active",
        origin: "natural",
        description_fr: "Extrait de Camomille — apaisant, anti-inflammatoire, antioxydant. Ideal pour les peaux sensibles et reactives.",
        description_en: "Chamomile Extract — soothing, anti-inflammatory, antioxidant. Ideal for sensitive and reactive skin.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // HUMECTANTS
    // ═══════════════════════════════════════════════════

    "Glycerin": {
        safety: "excellent",
        score: 98,
        category: "humectant",
        origin: "natural",
        description_fr: "Glycerine vegetale — humectant naturel qui attire l'eau dans la peau. Protege la barriere cutanee.",
        description_en: "Vegetable glycerin — natural humectant that draws water into skin. Protects the skin barrier.",
        ewg_score: 1
    },
    "Propylene Glycol": {
        safety: "moderate",
        score: 68,
        category: "humectant",
        origin: "synthetic",
        description_fr: "Propylene glycol — humectant et solvant synthetique. Peut causer des irritations chez les peaux sensibles a forte concentration.",
        description_en: "Propylene glycol — synthetic humectant and solvent. Can cause irritation on sensitive skin at high concentrations.",
        ewg_score: 3
    },
    "Butylene Glycol": {
        safety: "good",
        score: 82,
        category: "humectant",
        origin: "synthetic",
        description_fr: "Butylene glycol — humectant synthetique leger. Ameliore la penetration des actifs, texture legere.",
        description_en: "Butylene glycol — lightweight synthetic humectant. Enhances active ingredient penetration, light texture.",
        ewg_score: 1
    },
    "Urea": {
        safety: "excellent",
        score: 90,
        category: "humectant",
        origin: "synthetic",
        description_fr: "Uree — facteur naturel d'hydratation (NMF). Humectant puissant, exfoliant doux a haute concentration.",
        description_en: "Urea — natural moisturizing factor (NMF). Powerful humectant, gentle exfoliant at high concentrations.",
        ewg_score: 1
    },
    "Betaine": {
        safety: "excellent",
        score: 94,
        category: "humectant",
        origin: "natural",
        description_fr: "Betaine — derive de la betterave sucriere. Humectant naturel, anti-irritant, protege contre la deshydratation.",
        description_en: "Betaine — derived from sugar beet. Natural humectant, anti-irritant, protects against dehydration.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // CONSERVATEURS
    // ═══════════════════════════════════════════════════

    "Phenoxyethanol": {
        safety: "moderate",
        score: 65,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Phenoxyethanol — conservateur cosmetique courant. Limite a 1% en UE. Peut etre irritant a forte dose.",
        description_en: "Phenoxyethanol — common cosmetic preservative. Limited to 1% in EU. Can be irritating at high doses.",
        ewg_score: 4
    },
    "Benzisothiazolinone": {
        safety: "caution",
        score: 40,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Benzisothiazolinone (BIT) — conservateur puissant mais allergisant reconnu. Interdit dans les produits sans rincage en UE.",
        description_en: "Benzisothiazolinone (BIT) — powerful preservative but known allergen. Banned in EU leave-on products.",
        ewg_score: 7
    },
    "Sodium Benzoate": {
        safety: "good",
        score: 80,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Benzoate de sodium — conservateur derive de l'acide benzoique. Considere comme l'un des conservateurs les plus surs.",
        description_en: "Sodium benzoate — preservative derived from benzoic acid. Considered one of the safest preservatives.",
        ewg_score: 3
    },
    "Potassium Sorbate": {
        safety: "good",
        score: 85,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Sorbate de potassium — conservateur doux aussi utilise en alimentaire. Bien tolere, faible risque allergique.",
        description_en: "Potassium sorbate — gentle preservative also used in food. Well tolerated, low allergy risk.",
        ewg_score: 3
    },
    "Ethylhexylglycerin": {
        safety: "good",
        score: 84,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Ethylhexylglycerin — booster de conservateur, deodorant. Alternative douce aux parabenes. Bonne tolerance cutanee.",
        description_en: "Ethylhexylglycerin — preservative booster, deodorant. Gentle alternative to parabens. Good skin tolerance.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // TENSIOACTIFS
    // ═══════════════════════════════════════════════════

    "Sodium Lauryl Sulfate": {
        safety: "caution",
        score: 35,
        category: "surfactant",
        origin: "synthetic",
        description_fr: "SLS — tensioactif agressif qui peut dessecher et irriter la peau. Detruit la barriere lipidique. A eviter sur peaux sensibles.",
        description_en: "SLS — harsh surfactant that can dry and irritate skin. Destroys lipid barrier. Avoid on sensitive skin.",
        ewg_score: 5
    },
    "Sodium Laureth Sulfate": {
        safety: "moderate",
        score: 55,
        category: "surfactant",
        origin: "synthetic",
        description_fr: "SLES — tensioactif moins agressif que le SLS mais peut contenir des traces de 1,4-dioxane. Moussant courant.",
        description_en: "SLES — less harsh than SLS but may contain traces of 1,4-dioxane. Common foaming agent.",
        ewg_score: 4
    },
    "Cocamidopropyl Betaine": {
        safety: "good",
        score: 80,
        category: "surfactant",
        origin: "natural",
        description_fr: "Cocamidopropyl betaine — tensioactif doux derive de l'huile de coco. Moussant leger, bien tolere.",
        description_en: "Cocamidopropyl betaine — gentle surfactant derived from coconut oil. Light foam, well tolerated.",
        ewg_score: 4
    },
    "Decyl Glucoside": {
        safety: "excellent",
        score: 92,
        category: "surfactant",
        origin: "natural",
        description_fr: "Decyl glucoside — tensioactif ultra-doux derive du sucre et de la noix de coco. Biodegradable, ideal peaux sensibles.",
        description_en: "Decyl glucoside — ultra-gentle surfactant derived from sugar and coconut. Biodegradable, ideal for sensitive skin.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // EMOLLIENTS / OCCLUSIFS
    // ═══════════════════════════════════════════════════

    "Dimethicone": {
        safety: "good",
        score: 78,
        category: "emollient",
        origin: "synthetic",
        description_fr: "Dimethicone — silicone qui lisse et protege la peau. Occlusif, donne un toucher soyeux. Non comedogene.",
        description_en: "Dimethicone — silicone that smooths and protects skin. Occlusive, gives silky feel. Non-comedogenic.",
        ewg_score: 3
    },
    "Cyclopentasiloxane": {
        safety: "moderate",
        score: 65,
        category: "emollient",
        origin: "synthetic",
        description_fr: "Cyclomethicone (D5) — silicone volatile qui s'evapore. Donne un toucher sec. Debats environnementaux en cours.",
        description_en: "Cyclomethicone (D5) — volatile silicone that evaporates. Gives dry touch. Ongoing environmental debates.",
        ewg_score: 3
    },
    "Cetearyl Alcohol": {
        safety: "excellent",
        score: 93,
        category: "emollient",
        origin: "natural",
        description_fr: "Alcool cetearylique — alcool gras (non desechant). Emollient, epaississant, adoucit et stabilise les formulations.",
        description_en: "Cetearyl alcohol — fatty alcohol (non-drying). Emollient, thickener, softens and stabilizes formulations.",
        ewg_score: 1
    },
    "Caprylic/Capric Triglyceride": {
        safety: "excellent",
        score: 95,
        category: "emollient",
        origin: "natural",
        description_fr: "Triglyceride d'acide caprylique/caprique — derive de l'huile de coco. Emollient leger, hydrate sans graisser.",
        description_en: "Caprylic/capric triglyceride — derived from coconut oil. Lightweight emollient, hydrates without greasiness.",
        ewg_score: 1
    },
    "Isopropyl Myristate": {
        safety: "moderate",
        score: 62,
        category: "emollient",
        origin: "synthetic",
        description_fr: "Myristate d'isopropyle — emollient synthetique, ameliore la penetration. Potentiellement comedogene.",
        description_en: "Isopropyl myristate — synthetic emollient, enhances penetration. Potentially comedogenic.",
        ewg_score: 3
    },

    // ═══════════════════════════════════════════════════
    // MINERAUX / FILTRES
    // ═══════════════════════════════════════════════════

    "Titanium Dioxide": {
        safety: "good",
        score: 75,
        category: "mineral",
        origin: "mineral",
        description_fr: "Dioxyde de titane — filtre UV mineral physique. Protege contre UVA/UVB. Debats sur les nanoparticules.",
        description_en: "Titanium dioxide — physical mineral UV filter. Protects against UVA/UVB. Debates on nanoparticles.",
        ewg_score: 2
    },
    "Zinc Oxide": {
        safety: "excellent",
        score: 88,
        category: "mineral",
        origin: "mineral",
        description_fr: "Oxyde de zinc — filtre UV mineral a large spectre. Apaisant, antibacterien, ideal peaux sensibles et bebe.",
        description_en: "Zinc oxide — broad-spectrum mineral UV filter. Soothing, antibacterial, ideal for sensitive skin and babies.",
        ewg_score: 2
    },
    "Mica": {
        safety: "good",
        score: 82,
        category: "mineral",
        origin: "mineral",
        description_fr: "Mica — mineral naturel qui donne un fini nacre et lumineux. Utilise en maquillage et soins. Attention sourcing ethique.",
        description_en: "Mica — natural mineral that gives pearly, luminous finish. Used in makeup and skincare. Ethical sourcing concerns.",
        ewg_score: 3
    },
    "Iron Oxides": {
        safety: "excellent",
        score: 90,
        category: "mineral",
        origin: "mineral",
        description_fr: "Oxydes de fer — pigments mineraux (CI 77491, 77492, 77499). Colorants surs utilises en maquillage.",
        description_en: "Iron oxides — mineral pigments (CI 77491, 77492, 77499). Safe colorants used in makeup.",
        ewg_score: 1
    },
    "Kaolin": {
        safety: "excellent",
        score: 94,
        category: "mineral",
        origin: "mineral",
        description_fr: "Kaolin — argile blanche douce. Absorbe l'exces de sebum sans dessecher. Ideal pour masques purifiants.",
        description_en: "Kaolin — gentle white clay. Absorbs excess sebum without drying. Ideal for purifying masks.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // FRAGRANCES
    // ═══════════════════════════════════════════════════

    "Parfum": {
        safety: "caution",
        score: 40,
        category: "fragrance",
        origin: "synthetic",
        description_fr: "Parfum/Fragrance — melange non divulgue de molecules odorantes. Peut contenir des allergenes. Premiere cause d'allergie cosmetique.",
        description_en: "Parfum/Fragrance — undisclosed mix of scent molecules. May contain allergens. Leading cause of cosmetic allergy.",
        ewg_score: 8
    },
    "Linalool": {
        safety: "moderate",
        score: 65,
        category: "fragrance",
        origin: "natural",
        description_fr: "Linalool — compose aromatique naturel (lavande). Allergene a declaration obligatoire en UE. Risque modere.",
        description_en: "Linalool — natural aromatic compound (lavender). Mandatory allergen disclosure in EU. Moderate risk.",
        ewg_score: 5
    },
    "Limonene": {
        safety: "moderate",
        score: 62,
        category: "fragrance",
        origin: "natural",
        description_fr: "Limonene — compose aromatique des agrumes. Allergene a declaration obligatoire en UE. Peut s'oxyder et devenir irritant.",
        description_en: "Limonene — citrus aromatic compound. Mandatory allergen disclosure in EU. Can oxidize and become irritating.",
        ewg_score: 6
    },

    // ═══════════════════════════════════════════════════
    // EPAISSISSANTS / STABILISANTS
    // ═══════════════════════════════════════════════════

    "Carbomer": {
        safety: "excellent",
        score: 90,
        category: "thickener",
        origin: "synthetic",
        description_fr: "Carbomer — polymere epaississant synthetique. Donne la texture gel. Inerte, non irritant, largement utilise.",
        description_en: "Carbomer — synthetic thickening polymer. Creates gel texture. Inert, non-irritating, widely used.",
        ewg_score: 1
    },
    "Xanthan Gum": {
        safety: "excellent",
        score: 95,
        category: "thickener",
        origin: "natural",
        description_fr: "Gomme xanthane — epaississant naturel produit par fermentation. Stabilise les emulsions, texture agreable.",
        description_en: "Xanthan gum — natural thickener produced by fermentation. Stabilizes emulsions, pleasant texture.",
        ewg_score: 1
    },
    "Hydroxyethylcellulose": {
        safety: "excellent",
        score: 92,
        category: "thickener",
        origin: "natural",
        description_fr: "Hydroxyethylcellulose — derive de cellulose vegetale. Epaississant et stabilisant naturel, tres bien tolere.",
        description_en: "Hydroxyethylcellulose — derived from plant cellulose. Natural thickener and stabilizer, very well tolerated.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // ANTIOXYDANTS
    // ═══════════════════════════════════════════════════

    "Resveratrol": {
        safety: "excellent",
        score: 94,
        category: "antioxidant",
        origin: "natural",
        description_fr: "Resveratrol — polyphenol du raisin. Antioxydant puissant, anti-age, protege contre le stress oxydatif.",
        description_en: "Resveratrol — grape polyphenol. Powerful antioxidant, anti-aging, protects against oxidative stress.",
        ewg_score: 1
    },
    "Ubiquinone": {
        safety: "excellent",
        score: 93,
        category: "antioxidant",
        origin: "synthetic",
        description_fr: "Coenzyme Q10 — antioxydant cellulaire qui decline avec l'age. Energise les cellules, reduit les rides.",
        description_en: "Coenzyme Q10 — cellular antioxidant that declines with age. Energizes cells, reduces wrinkles.",
        ewg_score: 1
    },

    // ═══════════════════════════════════════════════════
    // SOLVANTS
    // ═══════════════════════════════════════════════════

    "Alcohol Denat.": {
        safety: "moderate",
        score: 55,
        category: "solvent",
        origin: "synthetic",
        description_fr: "Alcool denature — solvant qui seche vite. Desechant et irritant a forte concentration. Detruit la barriere cutanee.",
        description_en: "Denatured alcohol — fast-drying solvent. Drying and irritating at high concentrations. Destroys skin barrier.",
        ewg_score: 4
    },
    "Isopropyl Alcohol": {
        safety: "moderate",
        score: 50,
        category: "solvent",
        origin: "synthetic",
        description_fr: "Alcool isopropylique — solvant desinfectant. Tres desechant, irritant. A eviter dans les soins quotidiens.",
        description_en: "Isopropyl alcohol — disinfecting solvent. Very drying, irritating. Avoid in daily skincare.",
        ewg_score: 4
    },
    "Ceteareth-20": {
        safety: "moderate",
        score: 60,
        category: "emollient",
        origin: "synthetic",
        description_fr: "Ceteareth-20 — emulsifiant ethoxyle. Peut contenir des traces de 1,4-dioxane. Irritation possible.",
        description_en: "Ceteareth-20 — ethoxylated emulsifier. May contain traces of 1,4-dioxane. Possible irritation.",
        ewg_score: 4
    },

    // ═══════════════════════════════════════════════════
    // DIVERS
    // ═══════════════════════════════════════════════════

    "Acrylates/C10-30 Alkyl Acrylate Crosspolymer": {
        safety: "good",
        score: 83,
        category: "thickener",
        origin: "synthetic",
        description_fr: "Polymere acrylique reticule — epaississant et stabilisant d'emulsion. Inerte, non absorbable par la peau.",
        description_en: "Cross-linked acrylic polymer — emulsion thickener and stabilizer. Inert, not absorbed by skin.",
        ewg_score: 1
    },
    "Disodium EDTA": {
        safety: "good",
        score: 78,
        category: "preservative",
        origin: "synthetic",
        description_fr: "EDTA disodique — agent chelateur qui stabilise les formulations. Ameliore l'efficacite des conservateurs. Debats sur biodegradabilite.",
        description_en: "Disodium EDTA — chelating agent that stabilizes formulations. Enhances preservative efficacy. Biodegradability debates.",
        ewg_score: 1
    },
    "Sodium PCA": {
        safety: "excellent",
        score: 95,
        category: "humectant",
        origin: "synthetic",
        description_fr: "PCA de sodium — composant naturel du NMF (facteur naturel d'hydratation). Humectant puissant et bien tolere.",
        description_en: "Sodium PCA — natural component of NMF (natural moisturizing factor). Powerful and well-tolerated humectant.",
        ewg_score: 1
    },
    "Aloe Barbadensis Leaf Juice": {
        safety: "excellent",
        score: 97,
        category: "active",
        origin: "natural",
        description_fr: "Jus de feuille d'Aloe Vera — hydratant, apaisant, cicatrisant. Plus concentre que l'extrait.",
        description_en: "Aloe Vera leaf juice — hydrating, soothing, healing. More concentrated than extract.",
        ewg_score: 1
    },
    "Sodium Hydroxide": {
        safety: "moderate",
        score: 58,
        category: "solvent",
        origin: "synthetic",
        description_fr: "Hydroxyde de sodium (soude) — ajuste le pH des formulations. Corrosif pur mais totalement sur aux faibles concentrations cosmetiques.",
        description_en: "Sodium hydroxide (lye) — adjusts formulation pH. Corrosive pure but completely safe at low cosmetic concentrations.",
        ewg_score: 3
    },
    "Triethanolamine": {
        safety: "moderate",
        score: 55,
        category: "solvent",
        origin: "synthetic",
        description_fr: "Triethanolamine (TEA) — ajusteur de pH et emulsifiant. Peut former des nitrosamines. Limite en concentration par l'UE.",
        description_en: "Triethanolamine (TEA) — pH adjuster and emulsifier. Can form nitrosamines. Concentration limited by EU.",
        ewg_score: 5
    },
    "BHT": {
        safety: "caution",
        score: 42,
        category: "preservative",
        origin: "synthetic",
        description_fr: "Hydroxytoluene butyle — antioxydant synthetique controversie. Perturbateur endocrinien suspecte selon certaines etudes.",
        description_en: "Butylated hydroxytoluene — controversial synthetic antioxidant. Suspected endocrine disruptor according to some studies.",
        ewg_score: 6
    },
    "Methylisothiazolinone": {
        safety: "caution",
        score: 30,
        category: "preservative",
        origin: "synthetic",
        description_fr: "MIT — conservateur hautement allergisant. Interdit dans les cosmetiques sans rincage en UE depuis 2016. A eviter.",
        description_en: "MIT — highly sensitizing preservative. Banned in EU leave-on cosmetics since 2016. Avoid.",
        ewg_score: 7
    }
};

// Expose globally
window.INGREDIENTS_DB = INGREDIENTS_DB;
