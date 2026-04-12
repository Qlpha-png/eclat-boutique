// ============================================================================
// Maison Eclat — Base de donnees INCI ingredients
// Clean Beauty Score — Transparence ingredientielle
// Sources : EWG Skin Deep, CIR (Cosmetic Ingredient Review), INCIDecoder
// ============================================================================

(function () {
    'use strict';

    var db = {

        // =================================================================
        // 1. VITAMINES & ANTIOXYDANTS
        // =================================================================

        "Ethyl Ascorbic Acid": {
            safety: "excellent",
            score: 95,
            category: "antioxidant",
            origin: "synthetic",
            description_fr: "Forme stabilisee de Vitamine C hydrosoluble et liposoluble. Puissant antioxydant qui illumine le teint, attenue les taches pigmentaires et stimule la production de collagene sans l'instabilite de l'acide ascorbique pur.",
            description_en: "Stabilized form of Vitamin C that is both water- and oil-soluble. Powerful antioxidant that brightens skin tone, fades dark spots and stimulates collagen production without the instability of pure ascorbic acid.",
            ewg_score: 1
        },

        "Tocopherol": {
            safety: "excellent",
            score: 97,
            category: "antioxidant",
            origin: "natural",
            description_fr: "Vitamine E naturelle — antioxydant puissant qui neutralise les radicaux libres et protege les membranes cellulaires. Nourrit, apaise et accelere la cicatrisation cutanee.",
            description_en: "Natural Vitamin E — powerful antioxidant that neutralizes free radicals and protects cell membranes. Nourishes, soothes and accelerates skin healing.",
            ewg_score: 1
        },

        "Retinol": {
            safety: "good",
            score: 73,
            category: "active",
            origin: "synthetic",
            description_fr: "Vitamine A pure — reference anti-age. Accelere le renouvellement cellulaire, reduit rides et taches. Peut causer irritation et photosensibilite ; a eviter pendant la grossesse.",
            description_en: "Pure Vitamin A — gold standard for anti-aging. Accelerates cell turnover, reduces wrinkles and dark spots. May cause irritation and photosensitivity; avoid during pregnancy.",
            ewg_score: 4
        },

        "Niacinamide": {
            safety: "excellent",
            score: 96,
            category: "antioxidant",
            origin: "synthetic",
            description_fr: "Vitamine B3 — actif polyvalent qui reduit les pores dilates, unifie le teint, renforce la barriere cutanee et regule le sebum. Anti-inflammatoire prouve, compatible avec tous types de peau.",
            description_en: "Vitamin B3 — versatile active that minimizes enlarged pores, evens skin tone, strengthens the moisture barrier and regulates sebum. Proven anti-inflammatory, suitable for all skin types.",
            ewg_score: 1
        },

        "Ascorbic Acid": {
            safety: "excellent",
            score: 94,
            category: "antioxidant",
            origin: "synthetic",
            description_fr: "Vitamine C pure (acide L-ascorbique) — antioxydant de reference. Eclaircit le teint, stimule le collagene et protege contre les dommages UV. Instable a l'air et a la lumiere, necessite un pH acide.",
            description_en: "Pure Vitamin C (L-ascorbic acid) — the reference antioxidant. Brightens skin, stimulates collagen and protects against UV damage. Unstable in air and light, requires acidic pH.",
            ewg_score: 1
        },

        "Tocopheryl Acetate": {
            safety: "excellent",
            score: 95,
            category: "antioxidant",
            origin: "synthetic",
            description_fr: "Forme esterifiee stabilisee de la Vitamine E. Protege contre le stress oxydatif, les UV et la pollution. Plus stable que le tocopherol pur dans les formulations.",
            description_en: "Stabilized ester form of Vitamin E. Protects against oxidative stress, UV rays and pollution. More stable than pure tocopherol in formulations.",
            ewg_score: 1
        },

        "Panthenol": {
            safety: "excellent",
            score: 97,
            category: "humectant",
            origin: "synthetic",
            description_fr: "Provitamine B5 — humectant puissant qui hydrate en profondeur et apaise les irritations. Accelere la reparation cutanee et renforce la barriere de la peau. Tres bien tolere, meme par les peaux les plus sensibles.",
            description_en: "Provitamin B5 — powerful humectant that deeply hydrates and soothes irritation. Accelerates skin repair and strengthens the skin barrier. Very well tolerated, even by the most sensitive skin.",
            ewg_score: 1
        },

        "Ubiquinone": {
            safety: "excellent",
            score: 93,
            category: "antioxidant",
            origin: "synthetic",
            description_fr: "Coenzyme Q10 — antioxydant cellulaire naturellement present dans la peau, dont le taux decline avec l'age. Energise les cellules, reduit les rides et protege contre le stress oxydatif.",
            description_en: "Coenzyme Q10 — cellular antioxidant naturally present in skin, whose levels decline with age. Energizes cells, reduces wrinkles and protects against oxidative stress.",
            ewg_score: 1
        },

        // =================================================================
        // 2. HYDRATATION & SOIN
        // =================================================================

        "Hyaluronic Acid": {
            safety: "excellent",
            score: 98,
            category: "humectant",
            origin: "bio-derived",
            description_fr: "Acide hyaluronique — molecule naturelle capable de retenir jusqu'a 1000 fois son poids en eau. Hydrate intensement, repulpe la peau et lisse les ridules. Produit par fermentation bacterienne.",
            description_en: "Hyaluronic acid — a natural molecule that can hold up to 1000 times its weight in water. Intensely hydrates, plumps skin and smooths fine lines. Produced by bacterial fermentation.",
            ewg_score: 1
        },

        "Glycerin": {
            safety: "excellent",
            score: 98,
            category: "humectant",
            origin: "natural",
            description_fr: "Glycerine vegetale — humectant naturel de reference qui attire et retient l'eau dans la couche corneenne. Renforce la barriere cutanee et ameliore la souplesse de la peau.",
            description_en: "Vegetable glycerin — the reference natural humectant that attracts and retains water in the stratum corneum. Strengthens the skin barrier and improves skin suppleness.",
            ewg_score: 1
        },

        "Squalane": {
            safety: "excellent",
            score: 98,
            category: "emollient",
            origin: "natural",
            description_fr: "Squalane — derive de l'olive ou de la canne a sucre, identique au squalene naturellement present dans le sebum. Emollient leger, non comedogene, hydrate sans obstruer les pores.",
            description_en: "Squalane — derived from olive or sugarcane, identical to squalene naturally found in sebum. Lightweight emollient, non-comedogenic, moisturizes without clogging pores.",
            ewg_score: 1
        },

        "Aloe Barbadensis Leaf Extract": {
            safety: "excellent",
            score: 97,
            category: "humectant",
            origin: "natural",
            description_fr: "Extrait de feuille d'Aloe Vera — apaise, hydrate et calme les inflammations. Reconnu depuis l'Antiquite pour ses proprietes cicatrisantes et regenerantes.",
            description_en: "Aloe Vera leaf extract — soothes, hydrates and calms inflammation. Recognized since antiquity for its healing and regenerating properties.",
            ewg_score: 1
        },

        "Sodium Hyaluronate": {
            safety: "excellent",
            score: 97,
            category: "humectant",
            origin: "bio-derived",
            description_fr: "Sel de sodium de l'acide hyaluronique — molecule plus petite qui penetre plus profondement dans la peau. Hydrate les couches inferieures de l'epiderme pour un effet repulpant durable.",
            description_en: "Sodium salt of hyaluronic acid — smaller molecule that penetrates deeper into skin. Hydrates the lower layers of the epidermis for a lasting plumping effect.",
            ewg_score: 1
        },

        "Ceramide NP": {
            safety: "excellent",
            score: 96,
            category: "emollient",
            origin: "bio-derived",
            description_fr: "Ceramide NP — lipide bio-identique a ceux naturellement presents dans la peau. Repare et renforce la barriere cutanee, retient l'hydratation et protege contre les agressions exterieures.",
            description_en: "Ceramide NP — bio-identical lipid matching those naturally found in skin. Repairs and strengthens the skin barrier, retains hydration and protects against environmental damage.",
            ewg_score: 1
        },

        "Butyrospermum Parkii Butter": {
            safety: "excellent",
            score: 98,
            category: "emollient",
            origin: "natural",
            description_fr: "Beurre de Karite — riche en vitamines A, E et acides gras essentiels. Nourrit intensement, protege et repare la barriere cutanee. Tresor de la cosmetique africaine.",
            description_en: "Shea Butter — rich in vitamins A, E and essential fatty acids. Intensely nourishes, protects and repairs the skin barrier. A treasure of African cosmetics.",
            ewg_score: 1
        },

        "Simmondsia Chinensis Seed Oil": {
            safety: "excellent",
            score: 97,
            category: "emollient",
            origin: "natural",
            description_fr: "Huile de Jojoba — cire liquide biomimetique dont la composition est tres proche du sebum humain. Regule la production de sebum, nourrit sans graisser et convient a tous types de peau.",
            description_en: "Jojoba Oil — biomimetic liquid wax whose composition closely resembles human sebum. Regulates sebum production, nourishes without greasiness and suits all skin types.",
            ewg_score: 1
        },

        // =================================================================
        // 3. PEPTIDES & ANTI-AGE
        // =================================================================

        "Palmitoyl Tripeptide-1": {
            safety: "excellent",
            score: 93,
            category: "peptide",
            origin: "synthetic",
            description_fr: "Peptide de synthese biomimetique qui imite un fragment du collagene. Stimule la production de collagene, d'elastine et d'acide hyaluronique pour une action anti-rides prouvee cliniquement.",
            description_en: "Biomimetic synthetic peptide that mimics a collagen fragment. Stimulates production of collagen, elastin and hyaluronic acid for clinically proven anti-wrinkle action.",
            ewg_score: 1
        },

        "Acetyl Hexapeptide-8": {
            safety: "excellent",
            score: 93,
            category: "peptide",
            origin: "synthetic",
            description_fr: "Argireline — peptide qui reduit les micro-contractions musculaires du visage pour lisser les rides d'expression. Surnomme \"Botox topique\" pour son action sur les rides du front et du contour des yeux.",
            description_en: "Argireline — peptide that reduces facial micro-muscle contractions to smooth expression lines. Nicknamed \"topical Botox\" for its action on forehead and eye contour wrinkles.",
            ewg_score: 1
        },

        "Palmitoyl Pentapeptide-4": {
            safety: "excellent",
            score: 92,
            category: "peptide",
            origin: "synthetic",
            description_fr: "Matrixyl — peptide anti-age de reference. Stimule la synthese du collagene de types I et III, de la fibronectine et de l'acide hyaluronique. Efficacite prouvee par de nombreuses etudes cliniques.",
            description_en: "Matrixyl — the reference anti-aging peptide. Stimulates synthesis of collagen types I and III, fibronectin and hyaluronic acid. Efficacy proven by numerous clinical studies.",
            ewg_score: 1
        },

        "Adenosine": {
            safety: "excellent",
            score: 95,
            category: "active",
            origin: "bio-derived",
            description_fr: "Adenosine — molecule naturellement presente dans le corps, reconnue par l'Union Europeenne comme actif anti-rides. Lisse les ridules, ameliore l'elasticite et apaise les inflammations.",
            description_en: "Adenosine — molecule naturally found in the body, recognized by the European Union as an anti-wrinkle active. Smooths fine lines, improves elasticity and soothes inflammation.",
            ewg_score: 1
        },

        "Bakuchiol": {
            safety: "excellent",
            score: 92,
            category: "active",
            origin: "natural",
            description_fr: "Bakuchiol — alternative vegetale au retinol extraite des graines de Psoralea corylifolia. Anti-age, antioxydant et anti-inflammatoire sans photosensibilite ni irritation. Compatible avec la grossesse.",
            description_en: "Bakuchiol — plant-based retinol alternative extracted from Psoralea corylifolia seeds. Anti-aging, antioxidant and anti-inflammatory without photosensitivity or irritation. Pregnancy-safe.",
            ewg_score: 1
        },

        // =================================================================
        // 4. EXFOLIANTS & ACIDES
        // =================================================================

        "Salicylic Acid": {
            safety: "good",
            score: 82,
            category: "exfoliant",
            origin: "synthetic",
            description_fr: "Acide salicylique (BHA) — seul exfoliant liposoluble capable de penetrer dans les pores. Anti-inflammatoire et antibacterien, c'est l'actif de reference contre l'acne et les points noirs.",
            description_en: "Salicylic acid (BHA) — the only oil-soluble exfoliant able to penetrate inside pores. Anti-inflammatory and antibacterial, it is the go-to active against acne and blackheads.",
            ewg_score: 3
        },

        "Glycolic Acid": {
            safety: "good",
            score: 80,
            category: "exfoliant",
            origin: "synthetic",
            description_fr: "Acide glycolique (AHA) — le plus petit AHA, donc le plus penetrant. Exfolie la couche corneenne, lisse le grain de peau et estompe les taches. Peut irriter a forte concentration.",
            description_en: "Glycolic acid (AHA) — the smallest AHA, therefore the most penetrating. Exfoliates the stratum corneum, smooths skin texture and fades dark spots. Can irritate at high concentrations.",
            ewg_score: 4
        },

        "Lactic Acid": {
            safety: "good",
            score: 83,
            category: "exfoliant",
            origin: "natural",
            description_fr: "Acide lactique (AHA) — exfoliant doux derive du lait ou de la betterave. Exfolie tout en hydratant grace a ses proprietes humectantes. Ideal pour les peaux sensibles ou seches.",
            description_en: "Lactic acid (AHA) — gentle exfoliant derived from milk or beet. Exfoliates while hydrating thanks to its humectant properties. Ideal for sensitive or dry skin.",
            ewg_score: 3
        },

        "Mandelic Acid": {
            safety: "good",
            score: 85,
            category: "exfoliant",
            origin: "natural",
            description_fr: "Acide mandelique (AHA) — derive de l'amande amere, sa grosse molecule penetre lentement, ce qui le rend tres bien tolere. Ideal pour les peaux sensibles, foncees ou sujettes a l'hyperpigmentation.",
            description_en: "Mandelic acid (AHA) — derived from bitter almonds, its large molecule penetrates slowly, making it very well tolerated. Ideal for sensitive, dark or hyperpigmentation-prone skin.",
            ewg_score: 2
        },

        "Gluconolactone": {
            safety: "good",
            score: 87,
            category: "exfoliant",
            origin: "bio-derived",
            description_fr: "Gluconolactone (PHA) — polyhydroxy-acide de nouvelle generation. Exfolie en douceur tout en hydratant et en protegeant la peau. Plus doux que les AHA, convient aux peaux sensibles et rosacee.",
            description_en: "Gluconolactone (PHA) — next-generation polyhydroxy acid. Gently exfoliates while hydrating and protecting the skin. Gentler than AHAs, suitable for sensitive skin and rosacea.",
            ewg_score: 1
        },

        // =================================================================
        // 5. EXTRAITS VEGETAUX
        // =================================================================

        "Camellia Sinensis Leaf Extract": {
            safety: "excellent",
            score: 96,
            category: "antioxidant",
            origin: "natural",
            description_fr: "Extrait de The Vert — riche en catechines (EGCG), parmi les antioxydants les plus puissants. Protege contre les radicaux libres, la pollution et le photo-vieillissement.",
            description_en: "Green Tea Extract — rich in catechins (EGCG), among the most powerful antioxidants. Protects against free radicals, pollution and photo-aging.",
            ewg_score: 1
        },

        "Centella Asiatica Extract": {
            safety: "excellent",
            score: 97,
            category: "active",
            origin: "natural",
            description_fr: "Centella Asiatica (Cica) — plante medicinal asiatique aux puissantes proprietes reparatrices. Apaise, reduit les rougeurs, stimule la production de collagene et accelere la cicatrisation.",
            description_en: "Centella Asiatica (Cica) — Asian medicinal plant with powerful repairing properties. Soothes, reduces redness, stimulates collagen production and accelerates healing.",
            ewg_score: 1
        },

        "Rosmarinus Officinalis Leaf Extract": {
            safety: "excellent",
            score: 94,
            category: "antioxidant",
            origin: "natural",
            description_fr: "Extrait de Romarin — riche en acide rosmarinique et carnosique, antioxydants naturels puissants. Protege les formulations contre l'oxydation, tonifie et purifie la peau.",
            description_en: "Rosemary Extract — rich in rosmarinic and carnosic acid, powerful natural antioxidants. Protects formulations from oxidation, tones and purifies the skin.",
            ewg_score: 1
        },

        "Matricaria Chamomilla Extract": {
            safety: "excellent",
            score: 96,
            category: "active",
            origin: "natural",
            description_fr: "Extrait de Camomille — contient du bisabolol et de l'apigenine, de puissants anti-inflammatoires naturels. Apaise les rougeurs, les irritations et les peaux reactives.",
            description_en: "Chamomile Extract — contains bisabolol and apigenin, powerful natural anti-inflammatories. Calms redness, irritation and reactive skin.",
            ewg_score: 1
        },

        "Glycyrrhiza Glabra Root Extract": {
            safety: "excellent",
            score: 95,
            category: "active",
            origin: "natural",
            description_fr: "Extrait de Reglisse — contient de la glabridine, un puissant agent depigmentant naturel. Eclaircit les taches, apaise les inflammations et inhibe la tyrosinase sans irritation.",
            description_en: "Licorice Root Extract — contains glabridin, a powerful natural depigmenting agent. Brightens dark spots, soothes inflammation and inhibits tyrosinase without irritation.",
            ewg_score: 1
        },

        "Melaleuca Alternifolia Leaf Oil": {
            safety: "moderate",
            score: 72,
            category: "active",
            origin: "natural",
            description_fr: "Huile essentielle d'Arbre a The — antibacterien et antifongique puissant, efficace contre l'acne. Doit etre utilise dilue car irritant a l'etat pur. Allergene possible.",
            description_en: "Tea Tree Essential Oil — powerful antibacterial and antifungal, effective against acne. Must be used diluted as it is irritating undiluted. Possible allergen.",
            ewg_score: 4
        },

        "Argania Spinosa Kernel Oil": {
            safety: "excellent",
            score: 97,
            category: "emollient",
            origin: "natural",
            description_fr: "Huile d'Argan — tresor marocain riche en vitamine E, acide oleique et acide linoleique. Nourrit, repare et protege la peau et les cheveux. Anti-age et emolliente.",
            description_en: "Argan Oil — Moroccan treasure rich in vitamin E, oleic acid and linoleic acid. Nourishes, repairs and protects skin and hair. Anti-aging and emollient.",
            ewg_score: 1
        },

        "Rosa Canina Seed Oil": {
            safety: "excellent",
            score: 98,
            category: "emollient",
            origin: "natural",
            description_fr: "Huile de Rose Musquee — riche en acides gras omega 3, 6 et 9 et en tretinoine naturelle. Regenere la peau, attenue cicatrices, vergetures et taches pigmentaires.",
            description_en: "Rosehip Seed Oil — rich in omega 3, 6 and 9 fatty acids and natural tretinoin. Regenerates skin, fades scars, stretch marks and dark spots.",
            ewg_score: 1
        },

        // =================================================================
        // 6. MINERAUX & UV
        // =================================================================

        "Zinc Oxide": {
            safety: "excellent",
            score: 88,
            category: "uv_filter",
            origin: "mineral",
            description_fr: "Oxyde de zinc — filtre UV mineral a large spectre UVA/UVB. Apaisant et antibacterien, c'est le filtre solaire le plus sur pour les peaux sensibles et les bebes.",
            description_en: "Zinc oxide — broad-spectrum UVA/UVB mineral sunscreen filter. Soothing and antibacterial, it is the safest sunscreen filter for sensitive skin and babies.",
            ewg_score: 2
        },

        "Titanium Dioxide": {
            safety: "good",
            score: 75,
            category: "uv_filter",
            origin: "mineral",
            description_fr: "Dioxyde de titane — filtre UV mineral physique qui reflechit les rayons UVA/UVB. Bien tolere en application topique, mais les formes nanoparticulaires font l'objet de debats.",
            description_en: "Titanium dioxide — physical mineral UV filter that reflects UVA/UVB rays. Well tolerated topically, but nanoparticle forms are subject to debate.",
            ewg_score: 2
        },

        "Iron Oxides": {
            safety: "excellent",
            score: 90,
            category: "colorant",
            origin: "mineral",
            description_fr: "Oxydes de fer (CI 77491, 77492, 77499) — pigments mineraux naturels fournissant les teintes jaune, rouge et noire. Coloration sure et stable, largement utilises en maquillage.",
            description_en: "Iron oxides (CI 77491, 77492, 77499) — natural mineral pigments providing yellow, red and black shades. Safe and stable coloring, widely used in makeup.",
            ewg_score: 1
        },

        "Mica": {
            safety: "good",
            score: 82,
            category: "colorant",
            origin: "mineral",
            description_fr: "Mica — mineral naturel silicate qui confere un fini nacre et lumineux aux produits de maquillage. Sur pour la peau, mais des preoccupations ethiques existent concernant l'approvisionnement minier.",
            description_en: "Mica — natural silicate mineral that gives a pearly, luminous finish to makeup products. Safe for skin, but ethical concerns exist regarding mining sourcing.",
            ewg_score: 3
        },

        // =================================================================
        // 7. CONSERVATEURS & STABILISANTS
        // =================================================================

        "Phenoxyethanol": {
            safety: "good",
            score: 78,
            category: "preservative",
            origin: "synthetic",
            description_fr: "Phenoxyethanol — conservateur cosmetique courant, alternative aux parabenes. Limite a 1% par la reglementation europeenne. Bien tolere aux concentrations reglementaires, rare allergene.",
            description_en: "Phenoxyethanol — common cosmetic preservative, parabens alternative. Limited to 1% by EU regulation. Well tolerated at regulatory concentrations, rare allergen.",
            ewg_score: 4
        },

        "Sodium Benzoate": {
            safety: "good",
            score: 80,
            category: "preservative",
            origin: "synthetic",
            description_fr: "Benzoate de sodium — sel de l'acide benzoique, conservateur egalement utilise dans l'industrie alimentaire. Considere comme l'un des conservateurs les plus doux pour les formulations cosmetiques.",
            description_en: "Sodium benzoate — salt of benzoic acid, preservative also used in the food industry. Considered one of the gentlest preservatives for cosmetic formulations.",
            ewg_score: 3
        },

        "Potassium Sorbate": {
            safety: "good",
            score: 85,
            category: "preservative",
            origin: "synthetic",
            description_fr: "Sorbate de potassium — conservateur doux egalement autorise dans l'alimentaire. Inhibe les moisissures et les levures. Bien tolere, faible potentiel allergique.",
            description_en: "Potassium sorbate — gentle preservative also approved for food use. Inhibits mold and yeast. Well tolerated, low allergy potential.",
            ewg_score: 3
        },

        "Ethylhexylglycerin": {
            safety: "good",
            score: 84,
            category: "preservative",
            origin: "synthetic",
            description_fr: "Ethylhexylglycerin — derive de la glycerine utilise comme booster de conservateur et deodorant. Alternative douce aux parabenes avec une bonne tolerance cutanee.",
            description_en: "Ethylhexylglycerin — glycerin derivative used as preservative booster and deodorant. Gentle alternative to parabens with good skin tolerance.",
            ewg_score: 1
        },

        "Citric Acid": {
            safety: "excellent",
            score: 90,
            category: "active",
            origin: "natural",
            description_fr: "Acide citrique — derive des agrumes, utilise principalement pour ajuster le pH des formulations. Antioxydant leger, exfoliant doux a haute concentration. Ingredient de reference en cosmetique.",
            description_en: "Citric acid — derived from citrus fruit, used primarily to adjust formulation pH. Mild antioxidant, gentle exfoliant at high concentrations. A staple cosmetic ingredient.",
            ewg_score: 2
        },

        "Disodium EDTA": {
            safety: "good",
            score: 78,
            category: "preservative",
            origin: "synthetic",
            description_fr: "EDTA disodique — agent chelateur qui piege les ions metalliques pour stabiliser les formulations et ameliorer l'efficacite des conservateurs. Debats en cours sur sa faible biodegradabilite.",
            description_en: "Disodium EDTA — chelating agent that traps metal ions to stabilize formulations and enhance preservative efficacy. Ongoing debates about its low biodegradability.",
            ewg_score: 1
        },

        // =================================================================
        // 8. TENSIOACTIFS & EMULSIFIANTS
        // =================================================================

        "Sodium Lauryl Sulfate": {
            safety: "moderate",
            score: 35,
            category: "surfactant",
            origin: "synthetic",
            description_fr: "SLS — tensioactif anionique puissant qui produit une mousse abondante mais peut dessecher et irriter la peau en detruisant la barriere lipidique. A eviter sur les peaux sensibles, atopiques ou seches.",
            description_en: "SLS — powerful anionic surfactant that produces abundant foam but can dry out and irritate skin by destroying the lipid barrier. Avoid on sensitive, atopic or dry skin.",
            ewg_score: 5
        },

        "Coco-Glucoside": {
            safety: "excellent",
            score: 93,
            category: "surfactant",
            origin: "natural",
            description_fr: "Coco-glucoside — tensioactif non-ionique derive de l'huile de coco et du glucose. Ultra-doux, biodegradable, ideal pour les formules destinees aux peaux sensibles et aux bebes.",
            description_en: "Coco-glucoside — non-ionic surfactant derived from coconut oil and glucose. Ultra-gentle, biodegradable, ideal for formulas aimed at sensitive skin and babies.",
            ewg_score: 1
        },

        "Cetearyl Alcohol": {
            safety: "excellent",
            score: 93,
            category: "emulsifier",
            origin: "natural",
            description_fr: "Alcool cetearylique — alcool gras (non desechant, contrairement aux alcools simples). Emollient qui adoucit, epaissit et stabilise les emulsions creme. Tres bien tolere par toutes les peaux.",
            description_en: "Cetearyl alcohol — fatty alcohol (non-drying, unlike simple alcohols). Emollient that softens, thickens and stabilizes cream emulsions. Very well tolerated by all skin types.",
            ewg_score: 1
        },

        "Polysorbate 20": {
            safety: "good",
            score: 76,
            category: "emulsifier",
            origin: "synthetic",
            description_fr: "Polysorbate 20 — emulsifiant et solubilisant doux derive du sorbitol et de l'acide laurique. Utilise pour incorporer les huiles essentielles dans les phases aqueuses. Peut contenir des traces de 1,4-dioxane.",
            description_en: "Polysorbate 20 — gentle emulsifier and solubilizer derived from sorbitol and lauric acid. Used to incorporate essential oils into aqueous phases. May contain traces of 1,4-dioxane.",
            ewg_score: 3
        },

        // =================================================================
        // 9. FRAGRANCES & AUTRES
        // =================================================================

        "Parfum": {
            safety: "moderate",
            score: 40,
            category: "fragrance",
            origin: "synthetic",
            description_fr: "Parfum/Fragrance — melange non divulgue pouvant contenir des dizaines de molecules odorantes. Premiere cause d'allergie cosmetique. L'absence de transparence pose un probleme pour les consommateurs sensibles.",
            description_en: "Parfum/Fragrance — undisclosed mixture that may contain dozens of scent molecules. Leading cause of cosmetic allergy. The lack of transparency is problematic for sensitive consumers.",
            ewg_score: 8
        },

        "Limonene": {
            safety: "moderate",
            score: 62,
            category: "fragrance",
            origin: "natural",
            description_fr: "Limonene — terpene aromatique present dans les agrumes. Allergene a declaration obligatoire en Union Europeenne. Peut s'oxyder au contact de l'air et devenir plus irritant.",
            description_en: "Limonene — aromatic terpene found in citrus fruits. Allergen with mandatory disclosure in the European Union. Can oxidize on air contact and become more irritating.",
            ewg_score: 6
        },

        "Linalool": {
            safety: "moderate",
            score: 65,
            category: "fragrance",
            origin: "natural",
            description_fr: "Linalool — compose aromatique present dans la lavande, le bois de rose et le basilic. Allergene a declaration obligatoire en UE. Risque modere de sensibilisation cutanee.",
            description_en: "Linalool — aromatic compound found in lavender, rosewood and basil. Allergen with mandatory disclosure in EU. Moderate risk of skin sensitization.",
            ewg_score: 5
        },

        "CI 77891": {
            safety: "good",
            score: 75,
            category: "colorant",
            origin: "mineral",
            description_fr: "CI 77891 (Dioxyde de titane) — pigment blanc mineral utilise comme opacifiant et colorant dans le maquillage, les cremes solaires et les dentifrices. Memes considerations que le Titanium Dioxide.",
            description_en: "CI 77891 (Titanium Dioxide) — white mineral pigment used as opacifier and colorant in makeup, sunscreens and toothpaste. Same considerations as Titanium Dioxide.",
            ewg_score: 2
        }
    };

    // =====================================================================
    // Helper : case-insensitive ingredient lookup
    // =====================================================================

    var lookupMap = {};

    // Build a case-insensitive lookup map plus common aliases
    var aliases = {
        "fragrance":                   "Parfum",
        "vitamin c":                   "Ascorbic Acid",
        "vitamin e":                   "Tocopherol",
        "vitamin b3":                  "Niacinamide",
        "vitamin b5":                  "Panthenol",
        "vitamin a":                   "Retinol",
        "coenzyme q10":                "Ubiquinone",
        "coq10":                       "Ubiquinone",
        "ha":                          "Hyaluronic Acid",
        "hyaluronate":                 "Sodium Hyaluronate",
        "shea butter":                 "Butyrospermum Parkii Butter",
        "beurre de karite":            "Butyrospermum Parkii Butter",
        "jojoba oil":                  "Simmondsia Chinensis Seed Oil",
        "huile de jojoba":             "Simmondsia Chinensis Seed Oil",
        "argan oil":                   "Argania Spinosa Kernel Oil",
        "huile d'argan":               "Argania Spinosa Kernel Oil",
        "rosehip oil":                 "Rosa Canina Seed Oil",
        "huile de rose musquee":       "Rosa Canina Seed Oil",
        "green tea":                   "Camellia Sinensis Leaf Extract",
        "the vert":                    "Camellia Sinensis Leaf Extract",
        "chamomile":                   "Matricaria Chamomilla Extract",
        "camomille":                   "Matricaria Chamomilla Extract",
        "rosemary":                    "Rosmarinus Officinalis Leaf Extract",
        "romarin":                     "Rosmarinus Officinalis Leaf Extract",
        "licorice root":               "Glycyrrhiza Glabra Root Extract",
        "reglisse":                    "Glycyrrhiza Glabra Root Extract",
        "tea tree":                    "Melaleuca Alternifolia Leaf Oil",
        "arbre a the":                 "Melaleuca Alternifolia Leaf Oil",
        "centella":                    "Centella Asiatica Extract",
        "cica":                        "Centella Asiatica Extract",
        "matrixyl":                    "Palmitoyl Pentapeptide-4",
        "argireline":                  "Acetyl Hexapeptide-8",
        "sls":                         "Sodium Lauryl Sulfate",
        "bha":                         "Salicylic Acid",
        "aha":                         "Glycolic Acid",
        "pha":                         "Gluconolactone",
        "edta":                        "Disodium EDTA",
        "titanium dioxide":            "Titanium Dioxide",
        "zinc oxide":                  "Zinc Oxide"
    };

    // Populate lookupMap with all ingredient names (lowercased)
    var keys = Object.keys(db);
    var i, key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        lookupMap[key.toLowerCase()] = db[key];
    }

    // Populate lookupMap with aliases
    var aliasKeys = Object.keys(aliases);
    for (i = 0; i < aliasKeys.length; i++) {
        key = aliasKeys[i];
        if (db[aliases[key]]) {
            lookupMap[key.toLowerCase()] = db[aliases[key]];
        }
    }

    // =====================================================================
    // Expose globally
    // =====================================================================

    window.INGREDIENTS_DB = db;

    /**
     * Case-insensitive ingredient lookup.
     * Accepts INCI names, common names, and aliases (FR/EN).
     * Returns the ingredient data object or null if not found.
     *
     * @param {string} name - Ingredient name to look up
     * @returns {Object|null} Ingredient data or null
     */
    window.getIngredientInfo = function (name) {
        if (typeof name !== 'string' || name.trim() === '') {
            return null;
        }
        var normalized = name.trim().toLowerCase();
        return lookupMap[normalized] || null;
    };

})();
