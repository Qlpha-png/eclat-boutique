/**
 * process-cj-catalog.js
 * Transforme le catalogue brut CJ en 500+ produits complets pour products.js
 * Génère : noms FR, descriptions, caractéristiques, prix retail, catégories
 *
 * Usage: node scripts/process-cj-catalog.js
 */

const fs = require('fs');
const path = require('path');

// Load raw CJ catalog
const rawCatalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cj-beauty-catalog.json'), 'utf-8'));

// ============================================================
// 1. CATEGORY MAPPING (searchTerm → store category + subcategory)
// ============================================================
const CATEGORY_MAP = {
    // Sérums & Soins ciblés
    'retinol serum': { cat: 'soin', subcat: 'serum', concerns: ['anti-age', 'rides'] },
    'hyaluronic acid serum': { cat: 'soin', subcat: 'serum', concerns: ['hydratation', 'rides'] },
    'vitamin c serum': { cat: 'soin', subcat: 'serum', concerns: ['eclat', 'taches'] },
    'niacinamide serum': { cat: 'soin', subcat: 'serum', concerns: ['pores', 'acne'] },
    'anti aging serum': { cat: 'soin', subcat: 'serum', concerns: ['anti-age', 'rides'] },
    'collagen serum': { cat: 'soin', subcat: 'serum', concerns: ['fermete', 'anti-age'] },
    'peptide serum': { cat: 'soin', subcat: 'serum', concerns: ['fermete', 'anti-age'] },
    'brightening serum': { cat: 'soin', subcat: 'serum', concerns: ['eclat', 'taches'] },
    'moisturizing serum': { cat: 'soin', subcat: 'serum', concerns: ['hydratation'] },
    'face serum': { cat: 'soin', subcat: 'serum', concerns: ['hydratation', 'eclat'] },

    // Crèmes visage
    'face cream': { cat: 'visage', subcat: 'creme', concerns: ['hydratation'] },
    'moisturizing cream': { cat: 'visage', subcat: 'creme', concerns: ['hydratation', 'secheresse'] },
    'anti wrinkle cream': { cat: 'visage', subcat: 'creme', concerns: ['anti-age', 'rides'] },
    'night cream': { cat: 'visage', subcat: 'creme', concerns: ['reparation', 'anti-age'] },
    'day cream': { cat: 'visage', subcat: 'creme', concerns: ['hydratation', 'protection'] },
    'face moisturizer': { cat: 'visage', subcat: 'creme', concerns: ['hydratation'] },
    'eye cream': { cat: 'visage', subcat: 'contour-yeux', concerns: ['cernes', 'anti-age'] },
    'neck cream': { cat: 'visage', subcat: 'creme', concerns: ['fermete', 'anti-age'] },

    // Masques visage
    'face mask': { cat: 'visage', subcat: 'masque', concerns: ['hydratation', 'eclat'] },
    'sheet mask': { cat: 'visage', subcat: 'masque', concerns: ['hydratation', 'eclat'] },
    'clay mask': { cat: 'visage', subcat: 'masque', concerns: ['pores', 'acne'] },
    'sleeping mask': { cat: 'visage', subcat: 'masque', concerns: ['hydratation', 'reparation'] },
    'peel off mask': { cat: 'visage', subcat: 'masque', concerns: ['pores', 'points-noirs'] },
    'collagen mask': { cat: 'visage', subcat: 'masque', concerns: ['fermete', 'anti-age'] },
    'hydrating mask': { cat: 'visage', subcat: 'masque', concerns: ['hydratation', 'secheresse'] },

    // Nettoyage visage
    'face cleanser': { cat: 'visage', subcat: 'nettoyant', concerns: ['nettoyage', 'pores'] },
    'face wash': { cat: 'visage', subcat: 'nettoyant', concerns: ['nettoyage', 'acne'] },
    'makeup remover': { cat: 'visage', subcat: 'demaquillant', concerns: ['nettoyage'] },
    'micellar water': { cat: 'visage', subcat: 'demaquillant', concerns: ['nettoyage', 'sensibilite'] },
    'cleansing oil': { cat: 'visage', subcat: 'demaquillant', concerns: ['nettoyage', 'hydratation'] },
    'exfoliating gel': { cat: 'visage', subcat: 'exfoliant', concerns: ['eclat', 'pores'] },
    'toner': { cat: 'visage', subcat: 'lotion', concerns: ['pores', 'eclat'] },
    'facial toner': { cat: 'visage', subcat: 'lotion', concerns: ['pores', 'equilibre'] },

    // Corps
    'body lotion': { cat: 'corps', subcat: 'hydratant', concerns: ['hydratation', 'secheresse'] },
    'body cream': { cat: 'corps', subcat: 'hydratant', concerns: ['hydratation', 'fermete'] },
    'body scrub': { cat: 'corps', subcat: 'gommage', concerns: ['eclat', 'cellulite'] },
    'body oil': { cat: 'corps', subcat: 'huile', concerns: ['hydratation', 'eclat'] },
    'hand cream': { cat: 'corps', subcat: 'mains', concerns: ['hydratation', 'secheresse'] },
    'foot cream': { cat: 'corps', subcat: 'pieds', concerns: ['hydratation', 'reparation'] },
    'stretch mark': { cat: 'corps', subcat: 'soin-cible', concerns: ['vergetures', 'fermete'] },
    'cellulite cream': { cat: 'corps', subcat: 'soin-cible', concerns: ['cellulite', 'fermete'] },
    'body butter': { cat: 'corps', subcat: 'hydratant', concerns: ['hydratation', 'nutrition'] },
    'shower gel': { cat: 'corps', subcat: 'douche', concerns: ['nettoyage', 'hydratation'] },

    // Cheveux - soins
    'hair mask': { cat: 'cheveux', subcat: 'masque', concerns: ['reparation', 'hydratation'] },
    'hair serum': { cat: 'cheveux', subcat: 'serum', concerns: ['brillance', 'reparation'] },
    'hair oil': { cat: 'cheveux', subcat: 'huile', concerns: ['nutrition', 'brillance'] },
    'shampoo': { cat: 'cheveux', subcat: 'shampoing', concerns: ['nettoyage', 'volume'] },
    'conditioner': { cat: 'cheveux', subcat: 'apres-shampoing', concerns: ['hydratation', 'demeler'] },
    'hair treatment': { cat: 'cheveux', subcat: 'soin', concerns: ['reparation', 'force'] },
    'keratin treatment': { cat: 'cheveux', subcat: 'soin', concerns: ['lissage', 'reparation'] },
    'hair growth': { cat: 'cheveux', subcat: 'soin', concerns: ['pousse', 'fortifiant'] },
    'scalp treatment': { cat: 'cheveux', subcat: 'soin', concerns: ['cuir-chevelu', 'pellicules'] },
    'leave in conditioner': { cat: 'cheveux', subcat: 'soin', concerns: ['hydratation', 'protection'] },

    // Cheveux - accessoires
    'hair brush': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'hair comb': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'hair clip': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'scrunchie': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'hair towel': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'satin bonnet': { cat: 'cheveux', subcat: 'accessoire', concerns: ['protection'] },
    'hair band': { cat: 'cheveux', subcat: 'accessoire', concerns: [] },
    'hair roller': { cat: 'cheveux', subcat: 'accessoire', concerns: ['coiffure'] },

    // Ongles
    'nail lamp': { cat: 'ongles', subcat: 'appareil', concerns: [] },
    'gel polish': { cat: 'ongles', subcat: 'vernis', concerns: [] },
    'nail polish': { cat: 'ongles', subcat: 'vernis', concerns: [] },
    'nail tips': { cat: 'ongles', subcat: 'faux-ongles', concerns: [] },
    'nail art': { cat: 'ongles', subcat: 'decoration', concerns: [] },
    'nail file': { cat: 'ongles', subcat: 'outil', concerns: [] },
    'nail sticker': { cat: 'ongles', subcat: 'decoration', concerns: [] },
    'nail glue': { cat: 'ongles', subcat: 'accessoire', concerns: [] },
    'cuticle oil': { cat: 'ongles', subcat: 'soin', concerns: ['hydratation'] },
    'nail drill': { cat: 'ongles', subcat: 'appareil', concerns: [] },

    // Lèvres
    'lip balm': { cat: 'visage', subcat: 'levres', concerns: ['hydratation'] },
    'lip oil': { cat: 'visage', subcat: 'levres', concerns: ['hydratation', 'eclat'] },
    'lip mask': { cat: 'visage', subcat: 'levres', concerns: ['hydratation', 'reparation'] },
    'lip scrub': { cat: 'visage', subcat: 'levres', concerns: ['exfoliation', 'eclat'] },
    'lip gloss': { cat: 'visage', subcat: 'levres', concerns: ['eclat'] },

    // Yeux
    'eye patch': { cat: 'visage', subcat: 'contour-yeux', concerns: ['cernes', 'poches'] },
    'eye mask': { cat: 'visage', subcat: 'contour-yeux', concerns: ['cernes', 'fatigue'] },
    'under eye': { cat: 'visage', subcat: 'contour-yeux', concerns: ['cernes', 'rides'] },
    'eyelash serum': { cat: 'visage', subcat: 'cils', concerns: ['pousse', 'volume'] },

    // Homme
    'beard oil': { cat: 'homme', subcat: 'barbe', concerns: ['hydratation'] },
    'beard kit': { cat: 'homme', subcat: 'barbe', concerns: ['entretien'] },
    'mens face wash': { cat: 'homme', subcat: 'nettoyant', concerns: ['nettoyage'] },
    'aftershave': { cat: 'homme', subcat: 'rasage', concerns: ['apaisement'] },
    'mens skincare': { cat: 'homme', subcat: 'soin', concerns: ['hydratation'] },
    'shaving': { cat: 'homme', subcat: 'rasage', concerns: ['entretien'] },

    // Outils & appareils
    'face roller': { cat: 'outils', subcat: 'massage', concerns: ['anti-age', 'circulation'] },
    'gua sha': { cat: 'outils', subcat: 'massage', concerns: ['anti-age', 'drainage'] },
    'face massager': { cat: 'outils', subcat: 'massage', concerns: ['fermete', 'circulation'] },
    'blackhead remover': { cat: 'outils', subcat: 'nettoyage', concerns: ['points-noirs', 'pores'] },
    'pore vacuum': { cat: 'outils', subcat: 'nettoyage', concerns: ['pores', 'points-noirs'] },
    'face steamer': { cat: 'outils', subcat: 'soin', concerns: ['pores', 'hydratation'] },
    'derma roller': { cat: 'outils', subcat: 'soin', concerns: ['anti-age', 'cicatrices'] },
    'ice roller': { cat: 'outils', subcat: 'massage', concerns: ['poches', 'inflammation'] },
    'led mask': { cat: 'outils', subcat: 'appareil', concerns: ['acne', 'anti-age'] },
    'face brush': { cat: 'outils', subcat: 'nettoyage', concerns: ['nettoyage', 'pores'] },

    // Bien-être
    'essential oil': { cat: 'aromatherapie', subcat: 'huile', concerns: ['relaxation'] },
    'diffuser': { cat: 'aromatherapie', subcat: 'diffuseur', concerns: ['relaxation', 'ambiance'] },
    'bath bomb': { cat: 'aromatherapie', subcat: 'bain', concerns: ['relaxation', 'hydratation'] },
    'aromatherapy': { cat: 'aromatherapie', subcat: 'soin', concerns: ['relaxation'] },
    'massage oil': { cat: 'aromatherapie', subcat: 'huile', concerns: ['relaxation', 'detente'] },
    'candle': { cat: 'aromatherapie', subcat: 'ambiance', concerns: ['relaxation'] },

    // Accessoires maquillage
    'makeup brush': { cat: 'accessoire', subcat: 'pinceau', concerns: [] },
    'makeup sponge': { cat: 'accessoire', subcat: 'eponge', concerns: [] },
    'konjac sponge': { cat: 'accessoire', subcat: 'eponge', concerns: ['nettoyage'] },
    'cotton pad': { cat: 'accessoire', subcat: 'coton', concerns: [] },
    'makeup mirror': { cat: 'accessoire', subcat: 'miroir', concerns: [] },
    'makeup bag': { cat: 'accessoire', subcat: 'rangement', concerns: [] },
    'beauty blender': { cat: 'accessoire', subcat: 'eponge', concerns: [] },

    // Solaire
    'sunscreen': { cat: 'visage', subcat: 'solaire', concerns: ['protection', 'anti-age'] },
    'sun protection': { cat: 'visage', subcat: 'solaire', concerns: ['protection'] },
    'after sun': { cat: 'corps', subcat: 'solaire', concerns: ['reparation', 'apaisement'] },
};

// ============================================================
// 2. RETAIL PRICE CALCULATOR
// ============================================================
function calculateRetailPrice(wholesaleUSD) {
    // Convert USD to EUR (approx rate)
    const wholesaleEUR = wholesaleUSD * 0.92;

    let markup;
    if (wholesaleEUR < 0.50) markup = 9.90;  // Fixed minimum
    else if (wholesaleEUR < 1) markup = Math.max(wholesaleEUR * 7, 5.90);
    else if (wholesaleEUR < 2) markup = Math.max(wholesaleEUR * 5, 7.90);
    else if (wholesaleEUR < 4) markup = Math.max(wholesaleEUR * 4, 9.90);
    else if (wholesaleEUR < 8) markup = Math.max(wholesaleEUR * 3, 14.90);
    else if (wholesaleEUR < 15) markup = Math.max(wholesaleEUR * 2.5, 19.90);
    else if (wholesaleEUR < 25) markup = Math.max(wholesaleEUR * 2.2, 29.90);
    else markup = Math.max(wholesaleEUR * 2, 39.90);

    // Round to .90 (beauty standard)
    const base = Math.floor(markup);
    let rounded;
    if (base < 5) rounded = 4.90;
    else if (base < 7) rounded = 6.90;
    else if (base < 9) rounded = 8.90;
    else if (base < 12) rounded = 9.90;
    else if (base < 14) rounded = 12.90;
    else if (base < 17) rounded = 14.90;
    else if (base < 20) rounded = 17.90;
    else if (base < 23) rounded = 19.90;
    else if (base < 27) rounded = 24.90;
    else if (base < 32) rounded = 29.90;
    else if (base < 37) rounded = 34.90;
    else if (base < 42) rounded = 39.90;
    else if (base < 50) rounded = 44.90;
    else if (base < 60) rounded = 54.90;
    else rounded = 59.90;

    // Cap max at 59.90€
    return Math.min(rounded, 59.90);
}

// ============================================================
// 3. FRENCH NAME GENERATOR
// ============================================================
const TERM_TRANSLATIONS = {
    'serum': 'Sérum', 'cream': 'Crème', 'mask': 'Masque', 'oil': 'Huile',
    'lotion': 'Lotion', 'gel': 'Gel', 'balm': 'Baume', 'scrub': 'Gommage',
    'cleanser': 'Nettoyant', 'toner': 'Lotion Tonique', 'moisturizer': 'Hydratant',
    'shampoo': 'Shampoing', 'conditioner': 'Après-Shampoing', 'brush': 'Brosse',
    'roller': 'Rouleau', 'sponge': 'Éponge', 'mirror': 'Miroir', 'lamp': 'Lampe',
    'polish': 'Vernis', 'glue': 'Colle', 'sticker': 'Sticker', 'file': 'Lime',
    'drill': 'Ponceuse', 'towel': 'Serviette', 'comb': 'Peigne', 'clip': 'Pince',
    'band': 'Bandeau', 'bonnet': 'Bonnet', 'gloss': 'Gloss', 'spray': 'Spray',
    'patch': 'Patch', 'diffuser': 'Diffuseur', 'bomb': 'Bombe',

    // Ingredients
    'retinol': 'Rétinol', 'hyaluronic': 'Hyaluronique', 'vitamin': 'Vitamine',
    'niacinamide': 'Niacinamide', 'collagen': 'Collagène', 'peptide': 'Peptide',
    'keratin': 'Kératine', 'glycolic': 'Glycolique', 'salicylic': 'Salicylique',
    'kojic': 'Kojique', 'turmeric': 'Curcuma', 'charcoal': 'Charbon',
    'aloe': 'Aloé', 'argan': 'Argan', 'coconut': 'Coco', 'tea tree': 'Arbre à Thé',
    'rosemary': 'Romarin', 'lavender': 'Lavande', 'rose': 'Rose',
    'honey': 'Miel', 'avocado': 'Avocat', 'jojoba': 'Jojoba', 'shea': 'Karité',
    'ginseng': 'Ginseng', 'snail': 'Bave d\'Escargot', 'rice': 'Riz',
    'centella': 'Centella', 'green tea': 'Thé Vert', 'caffeine': 'Caféine',
    'cucumber': 'Concombre', 'chamomile': 'Camomille', 'sakura': 'Sakura',

    // Qualifiers
    'brightening': 'Éclat', 'hydrating': 'Hydratant', 'moisturizing': 'Nourrissant',
    'anti aging': 'Anti-Âge', 'anti wrinkle': 'Anti-Rides', 'firming': 'Raffermissant',
    'repairing': 'Réparateur', 'soothing': 'Apaisant', 'purifying': 'Purifiant',
    'exfoliating': 'Exfoliant', 'nourishing': 'Nutritif', 'revitalizing': 'Revitalisant',
    'whitening': 'Éclat', 'deep cleansing': 'Nettoyage Profond', 'pore minimizing': 'Pores Resserrés',

    // Product types
    'gua sha': 'Gua Sha', 'derma roller': 'Derma Roller', 'ice roller': 'Ice Roller',
    'LED': 'LED', 'UV': 'UV', 'USB': 'USB',
};

function translateProductName(englishName, searchTerm, category) {
    let name = englishName;

    // Clean up common CJ naming patterns
    name = name.replace(/\b(EELHOE|Hoygi|Tunmate|Lanbena|LANBENA|BIOAQUA|IMAGES|EFERO)\b/gi, '').trim();
    name = name.replace(/\s+/g, ' ').trim();

    // If name is too long, truncate intelligently
    if (name.length > 100) {
        name = name.split(/[-,;]/).slice(0, 2).join(' ').trim();
    }

    // Try to create a clean French name
    const nameLower = name.toLowerCase();
    let frenchName = '';

    // Detect product type from name
    const typeDetectors = [
        { pattern: /serum/i, fr: 'Sérum' },
        { pattern: /cream|creme/i, fr: 'Crème' },
        { pattern: /mask/i, fr: 'Masque' },
        { pattern: /oil(?!\s*free)/i, fr: 'Huile' },
        { pattern: /lotion/i, fr: 'Lotion' },
        { pattern: /gel\b/i, fr: 'Gel' },
        { pattern: /balm/i, fr: 'Baume' },
        { pattern: /scrub/i, fr: 'Gommage' },
        { pattern: /cleanser|wash\b/i, fr: 'Nettoyant' },
        { pattern: /toner/i, fr: 'Lotion Tonique' },
        { pattern: /shampoo/i, fr: 'Shampoing' },
        { pattern: /conditioner/i, fr: 'Après-Shampoing' },
        { pattern: /brush/i, fr: 'Brosse' },
        { pattern: /roller/i, fr: 'Rouleau' },
        { pattern: /sponge/i, fr: 'Éponge' },
        { pattern: /mirror/i, fr: 'Miroir' },
        { pattern: /lamp/i, fr: 'Lampe' },
        { pattern: /polish/i, fr: 'Vernis' },
        { pattern: /nail\s*tip|fake\s*nail/i, fr: 'Faux Ongles' },
        { pattern: /nail\s*drill/i, fr: 'Ponceuse à Ongles' },
        { pattern: /nail\s*file/i, fr: 'Lime à Ongles' },
        { pattern: /nail\s*sticker/i, fr: 'Stickers Ongles' },
        { pattern: /nail\s*glue/i, fr: 'Colle à Ongles' },
        { pattern: /cuticle/i, fr: 'Soin Cuticules' },
        { pattern: /gloss/i, fr: 'Gloss' },
        { pattern: /lip\s*scrub/i, fr: 'Gommage Lèvres' },
        { pattern: /lip\s*mask/i, fr: 'Masque Lèvres' },
        { pattern: /eye\s*patch/i, fr: 'Patchs Yeux' },
        { pattern: /eye\s*mask/i, fr: 'Masque Yeux' },
        { pattern: /eyelash/i, fr: 'Sérum Cils' },
        { pattern: /beard\s*oil/i, fr: 'Huile à Barbe' },
        { pattern: /beard\s*kit|beard\s*set/i, fr: 'Kit Barbe' },
        { pattern: /aftershave/i, fr: 'Après-Rasage' },
        { pattern: /shaving/i, fr: 'Rasage' },
        { pattern: /diffuser/i, fr: 'Diffuseur' },
        { pattern: /bath\s*bomb/i, fr: 'Bombe de Bain' },
        { pattern: /gua\s*sha/i, fr: 'Gua Sha' },
        { pattern: /derma\s*roller/i, fr: 'Derma Roller' },
        { pattern: /ice\s*roller/i, fr: 'Ice Roller' },
        { pattern: /pore\s*vacuum|blackhead\s*remover|suction/i, fr: 'Aspirateur Points Noirs' },
        { pattern: /steamer/i, fr: 'Vapeur Facial' },
        { pattern: /hair\s*towel/i, fr: 'Serviette Cheveux' },
        { pattern: /scrunchie/i, fr: 'Chouchou' },
        { pattern: /hair\s*clip/i, fr: 'Pince à Cheveux' },
        { pattern: /hair\s*comb/i, fr: 'Peigne' },
        { pattern: /hair\s*band|headband/i, fr: 'Bandeau' },
        { pattern: /bonnet/i, fr: 'Bonnet en Satin' },
        { pattern: /hair\s*roller/i, fr: 'Bigoudi' },
        { pattern: /spray/i, fr: 'Spray' },
        { pattern: /patch/i, fr: 'Patchs' },
        { pattern: /towel/i, fr: 'Serviette' },
        { pattern: /soap/i, fr: 'Savon' },
        { pattern: /powder/i, fr: 'Poudre' },
        { pattern: /essence/i, fr: 'Essence' },
        { pattern: /ampoule/i, fr: 'Ampoule' },
        { pattern: /mist/i, fr: 'Brume' },
        { pattern: /butter/i, fr: 'Beurre' },
    ];

    let productType = '';
    for (const detector of typeDetectors) {
        if (detector.pattern.test(nameLower)) {
            productType = detector.fr;
            break;
        }
    }

    // Detect key ingredients/qualifiers from name
    const qualifierDetectors = [
        { pattern: /retinol/i, fr: 'Rétinol' },
        { pattern: /hyaluronic/i, fr: 'Acide Hyaluronique' },
        { pattern: /vitamin\s*c/i, fr: 'Vitamine C' },
        { pattern: /vitamin\s*e/i, fr: 'Vitamine E' },
        { pattern: /niacinamide/i, fr: 'Niacinamide' },
        { pattern: /collagen/i, fr: 'Collagène' },
        { pattern: /peptide/i, fr: 'Peptide' },
        { pattern: /keratin/i, fr: 'Kératine' },
        { pattern: /glycolic/i, fr: 'Acide Glycolique' },
        { pattern: /salicylic/i, fr: 'Acide Salicylique' },
        { pattern: /kojic/i, fr: 'Acide Kojique' },
        { pattern: /turmeric/i, fr: 'Curcuma' },
        { pattern: /charcoal/i, fr: 'Charbon Actif' },
        { pattern: /aloe\s*vera/i, fr: 'Aloe Vera' },
        { pattern: /argan/i, fr: 'Argan' },
        { pattern: /coconut/i, fr: 'Coco' },
        { pattern: /tea\s*tree/i, fr: 'Arbre à Thé' },
        { pattern: /rosemary/i, fr: 'Romarin' },
        { pattern: /lavender/i, fr: 'Lavande' },
        { pattern: /rose\b/i, fr: 'Rose' },
        { pattern: /honey/i, fr: 'Miel' },
        { pattern: /avocado/i, fr: 'Avocat' },
        { pattern: /jojoba/i, fr: 'Jojoba' },
        { pattern: /shea/i, fr: 'Karité' },
        { pattern: /ginseng/i, fr: 'Ginseng' },
        { pattern: /snail/i, fr: 'Bave d\'Escargot' },
        { pattern: /rice/i, fr: 'Riz' },
        { pattern: /centella/i, fr: 'Centella' },
        { pattern: /green\s*tea/i, fr: 'Thé Vert' },
        { pattern: /caffeine/i, fr: 'Caféine' },
        { pattern: /cucumber/i, fr: 'Concombre' },
        { pattern: /chamomile/i, fr: 'Camomille' },
        { pattern: /sakura|cherry\s*blossom/i, fr: 'Fleur de Cerisier' },
        { pattern: /gold/i, fr: 'Or 24K' },
        { pattern: /pearl/i, fr: 'Perle' },
        { pattern: /bamboo/i, fr: 'Bambou' },
        { pattern: /egg/i, fr: 'Œuf' },
        { pattern: /propolis/i, fr: 'Propolis' },
        { pattern: /mugwort/i, fr: 'Armoise' },
        { pattern: /cica/i, fr: 'Cica' },
        { pattern: /AHA|BHA/i, fr: match => match[0].toUpperCase() },
        { pattern: /SPF\s*\d+/i, fr: match => match[0] },
        { pattern: /\d+ml/i, fr: match => match[0] },
        { pattern: /\d+g\b/i, fr: match => match[0] },
    ];

    const qualifiers = [];
    for (const q of qualifierDetectors) {
        if (q.pattern.test(name)) {
            if (typeof q.fr === 'function') {
                qualifiers.push(q.fr(name.match(q.pattern)));
            } else {
                qualifiers.push(q.fr);
            }
        }
    }

    // Detect action qualifiers
    const actionDetectors = [
        { pattern: /brighten|radiance|glow/i, fr: 'Éclat' },
        { pattern: /hydrat|moistur/i, fr: 'Hydratant' },
        { pattern: /anti[\s-]*ag/i, fr: 'Anti-Âge' },
        { pattern: /anti[\s-]*wrinkle/i, fr: 'Anti-Rides' },
        { pattern: /firm/i, fr: 'Raffermissant' },
        { pattern: /repair/i, fr: 'Réparateur' },
        { pattern: /sooth/i, fr: 'Apaisant' },
        { pattern: /purif|pore/i, fr: 'Purifiant' },
        { pattern: /exfoliat/i, fr: 'Exfoliant' },
        { pattern: /nourish/i, fr: 'Nourrissant' },
        { pattern: /revital/i, fr: 'Revitalisant' },
        { pattern: /deep\s*cleans/i, fr: 'Nettoyage Profond' },
        { pattern: /whiten|lighten/i, fr: 'Éclat' },
        { pattern: /slim|sculpt/i, fr: 'Sculptant' },
        { pattern: /detox/i, fr: 'Détox' },
        { pattern: /gentle/i, fr: 'Doux' },
        { pattern: /organic/i, fr: 'Bio' },
        { pattern: /natural/i, fr: 'Naturel' },
        { pattern: /vegan/i, fr: 'Végan' },
    ];

    const actions = [];
    for (const a of actionDetectors) {
        if (a.pattern.test(name)) {
            actions.push(a.fr);
        }
    }

    // Build French name
    if (productType) {
        const mainQualifier = qualifiers.length > 0 ? qualifiers[0] : (actions.length > 0 ? actions[0] : '');
        const secondQualifier = qualifiers.length > 1 ? qualifiers[1] : (actions.length > 1 ? actions[1] : '');

        if (mainQualifier && secondQualifier) {
            frenchName = `${productType} ${mainQualifier} & ${secondQualifier}`;
        } else if (mainQualifier) {
            frenchName = `${productType} ${mainQualifier}`;
        } else {
            // Use category-based fallback name
            const catNames = {
                'soin': 'Professionnel', 'visage': 'Visage', 'corps': 'Corps',
                'cheveux': 'Cheveux', 'ongles': 'Ongles', 'homme': 'Homme',
                'outils': 'Professionnel', 'aromatherapie': 'Bien-Être', 'accessoire': 'Beauté'
            };
            frenchName = `${productType} ${catNames[category] || 'Beauté'}`;
        }
    } else {
        // Fallback: use cleaned English name
        frenchName = name.split(/[-,;]/)[0].trim();
        if (frenchName.length > 60) frenchName = frenchName.slice(0, 57) + '...';
    }

    // Add size if present in original name
    const sizeMatch = name.match(/(\d+\s*(?:ml|g|oz|pcs|pieces|pack))/i);
    if (sizeMatch && !frenchName.includes(sizeMatch[1])) {
        frenchName += ` ${sizeMatch[1]}`;
    }

    return frenchName.trim();
}

// ============================================================
// 4. DESCRIPTION & CONTENT GENERATORS
// ============================================================
const DESCRIPTIONS = {
    soin: {
        serum: [
            'Ce sérum concentré en actifs pénètre en profondeur pour cibler vos préoccupations cutanées. Sa texture légère et non grasse s\'absorbe rapidement, laissant la peau douce et visiblement transformée. Formulé pour une utilisation quotidienne, il s\'intègre facilement dans votre routine beauté matin et soir.',
            'Sérum haute performance enrichi en principes actifs puissants. Sa formule innovante agit en profondeur pour révéler l\'éclat naturel de votre peau. Application après application, redécouvrez une peau plus lisse, plus ferme et visiblement plus jeune.',
            'Concentré d\'actifs ciblés pour une peau transformée. Ce sérum allie efficacité et sensorialité avec sa texture soyeuse qui fond sur la peau. Résultats visibles dès les premières semaines d\'utilisation régulière.',
        ],
        default: [
            'Soin expert formulé pour répondre aux besoins spécifiques de votre peau. Sa composition soigneusement élaborée allie actifs performants et textures sensorielles pour une expérience beauté complète au quotidien.',
        ]
    },
    visage: {
        creme: [
            'Crème visage onctueuse qui enveloppe la peau d\'un voile de douceur. Enrichie en actifs hydratants et protecteurs, elle nourrit en profondeur tout en créant un bouclier contre les agressions extérieures. Votre peau retrouve confort et éclat toute la journée.',
            'Soin hydratant quotidien à la texture fondante. Cette crème pénètre rapidement sans laisser de film gras, offrant une hydratation intense et durable. Idéale comme base de maquillage ou en soin de nuit.',
        ],
        masque: [
            'Masque visage intense pour un moment de soin privilégié. En seulement 15 à 20 minutes, votre peau bénéficie d\'un bain d\'actifs concentrés. Résultat immédiat : un teint frais, reposé et visiblement plus lumineux.',
            'Offrez à votre peau une pause régénérante avec ce masque enrichi en actifs. Sa formule gorgée de principes actifs travaille en profondeur pour un résultat visible dès la première utilisation.',
        ],
        nettoyant: [
            'Nettoyant doux mais efficace qui élimine impuretés, excès de sébum et résidus de maquillage sans agresser la peau. Sa formule respecte l\'équilibre naturel du film hydrolipidique pour une peau propre, fraîche et confortable.',
        ],
        demaquillant: [
            'Démaquillant efficace qui dissout le maquillage, même waterproof, en douceur. Sa formule respectueuse de la peau nettoie sans tiraillement ni irritation, laissant un fini frais et confortable.',
        ],
        lotion: [
            'Lotion tonique qui complète le nettoyage et prépare la peau à recevoir vos soins. Elle resserre les pores, rééquilibre le pH et apporte une première dose d\'hydratation pour une peau parfaitement réceptive.',
        ],
        exfoliant: [
            'Exfoliant délicat qui élimine les cellules mortes et affine le grain de peau. Sa texture fondante offre un gommage efficace mais respectueux, révélant une peau plus lisse et lumineuse.',
        ],
        'contour-yeux': [
            'Soin ciblé pour la zone délicate du contour des yeux. Sa formule ultra-légère cible cernes, poches et ridules avec précision. Texture fondante qui pénètre instantanément sans migrer dans les yeux.',
        ],
        levres: [
            'Soin lèvres nourrissant qui hydrate, protège et sublime vos lèvres au quotidien. Sa formule fondante enveloppe les lèvres d\'un film protecteur tout en les réparant en profondeur.',
        ],
        cils: [
            'Sérum cils fortifiant qui nourrit et renforce vos cils naturels. Utilisé quotidiennement, il favorise l\'apparence de cils plus longs, plus épais et en meilleure santé.',
        ],
        solaire: [
            'Protection solaire légère qui protège votre peau des rayons UV tout en l\'hydratant. Sa texture non grasse s\'intègre parfaitement dans votre routine quotidienne sans laisser de traces blanches.',
        ],
        default: [
            'Soin visage formulé pour prendre soin de votre peau au quotidien. Sa composition équilibrée répond aux besoins essentiels de votre peau pour un teint sain et lumineux.',
        ]
    },
    corps: {
        hydratant: [
            'Soin corps genereux qui enveloppe la peau d\'une hydratation intense et longue durée. Sa texture fondante pénètre rapidement sans effet collant, laissant la peau douce, souple et délicatement parfumée.',
        ],
        gommage: [
            'Gommage corps aux particules exfoliantes naturelles qui élimine les cellules mortes et stimule le renouvellement cellulaire. La peau est instantanément plus douce, plus lisse et prête à absorber vos soins.',
        ],
        huile: [
            'Huile corps nourrissante à la texture sèche qui pénètre instantanément. Elle nourrit intensément, assouplit et sublime la peau d\'un éclat satiné naturel. Idéale en massage ou après la douche.',
        ],
        'soin-cible': [
            'Soin corps ciblé pour traiter les zones qui en ont le plus besoin. Sa formule concentrée en actifs agit efficacement pour des résultats visibles avec une utilisation régulière.',
        ],
        mains: [
            'Crème mains nourrissante qui hydrate en profondeur sans laisser de film gras. Enrichie en actifs réparateurs, elle protège vos mains des agressions quotidiennes.',
        ],
        pieds: [
            'Soin pieds réparateur qui hydrate et adoucit les pieds les plus secs et abîmés. Sa formule riche en actifs émollients agit sur les callosités et crevasses.',
        ],
        douche: [
            'Gel douche onctueux qui nettoie en douceur tout en respectant l\'hydratation naturelle de la peau. Sa mousse généreuse laisse la peau propre, douce et délicatement parfumée.',
        ],
        default: [
            'Soin corps qui prend soin de votre peau au quotidien. Sa formule nourrissante et protectrice laisse la peau douce, souple et hydratée.',
        ]
    },
    cheveux: {
        shampoing: [
            'Shampoing doux qui nettoie en profondeur sans agresser le cuir chevelu. Sa formule équilibrée élimine les impuretés et l\'excès de sébum tout en préservant l\'hydratation naturelle des cheveux.',
        ],
        'apres-shampoing': [
            'Après-shampoing démêlant qui nourrit et protège les cheveux de la racine aux pointes. Il facilite le coiffage, réduit les frisottis et apporte brillance et douceur.',
        ],
        masque: [
            'Masque capillaire intense qui répare en profondeur les cheveux abîmés. Laissez poser 5 à 10 minutes pour des cheveux visiblement plus forts, plus brillants et plus souples.',
        ],
        serum: [
            'Sérum capillaire sans rinçage qui protège et sublime les cheveux. Sa formule légère apporte brillance, discipline les frisottis et protège des agressions thermiques.',
        ],
        huile: [
            'Huile capillaire nourrissante qui pénètre en profondeur pour réparer et fortifier. Utilisée en soin avant-shampoing ou en finition, elle apporte éclat et douceur.',
        ],
        soin: [
            'Soin capillaire professionnel qui renforce et revitalise les cheveux fragilisés. Sa formule enrichie en actifs réparateurs redonne force et vitalité à votre chevelure.',
        ],
        accessoire: [
            'Accessoire cheveux de qualité premium pour sublimer votre coiffure au quotidien. Conçu pour un confort optimal et une tenue parfaite tout au long de la journée.',
        ],
        default: [
            'Soin cheveux formulé pour répondre aux besoins spécifiques de votre chevelure. Sa composition experte nourrit, protège et sublime vos cheveux.',
        ]
    },
    ongles: {
        vernis: [
            'Vernis à ongles longue tenue qui offre une couleur intense et une brillance miroir. Sa formule résistante aux éclats assure une manucure impeccable pendant des jours.',
        ],
        'faux-ongles': [
            'Capsules ongles de qualité professionnelle pour une manucure parfaite à domicile. Faciles à poser et à personnaliser, elles offrent un résultat salon à petit prix.',
        ],
        appareil: [
            'Appareil professionnel pour ongles qui vous permet de réaliser des manucures dignes d\'un salon à la maison. Performant et simple d\'utilisation, il est votre allié beauté.',
        ],
        decoration: [
            'Kit de décoration ongles pour exprimer votre créativité. Des designs tendance aux classiques indémodables, créez des nail arts uniques et professionnels.',
        ],
        outil: [
            'Outil manucure de qualité professionnelle pour un entretien des ongles précis et efficace. Ergonomique et durable, il est indispensable dans votre kit beauté.',
        ],
        soin: [
            'Soin ongles nourrissant qui fortifie et protège vos ongles naturels. Sa formule enrichie en huiles et vitamines repare les ongles fragilisés.',
        ],
        accessoire: [
            'Accessoire manucure essentiel pour une routine ongles complète. Qualité professionnelle pour des résultats impeccables à la maison.',
        ],
        default: [
            'Produit ongles de qualité pour une manucure professionnelle à domicile. Résultats salon garantis.',
        ]
    },
    homme: {
        barbe: [
            'Soin barbe premium pour une barbe douce, disciplinée et en pleine santé. Sa formule enrichie en huiles naturelles nourrit le poil et hydrate la peau dessous.',
        ],
        rasage: [
            'Produit de rasage qui assure un rasage confortable et précis. Sa formule protectrice et apaisante prévient les irritations et laisse la peau douce et fraîche.',
        ],
        nettoyant: [
            'Nettoyant visage homme formulé spécifiquement pour la peau masculine. Élimine impuretés et excès de sébum sans dessécher, pour une peau nette et fraîche.',
        ],
        soin: [
            'Soin visage homme qui hydrate et protège la peau au quotidien. Sa texture légère et non grasse convient parfaitement à la peau masculine.',
        ],
        default: [
            'Produit grooming homme de qualité pour un entretien quotidien simple et efficace.',
        ]
    },
    outils: {
        massage: [
            'Outil de massage facial qui stimule la circulation sanguine et le drainage lymphatique. Utilisé régulièrement, il aide à réduire les poches, raffermir la peau et révéler un teint plus lumineux.',
        ],
        nettoyage: [
            'Appareil de nettoyage facial qui élimine en profondeur impuretés, points noirs et excès de sébum. Technologie douce mais efficace pour des pores visiblement resserrés.',
        ],
        soin: [
            'Outil de soin beauté professionnel pour des traitements efficaces à domicile. Technologie avancée pour des résultats visibles dès les premières utilisations.',
        ],
        appareil: [
            'Appareil beauté innovant qui combine technologie avancée et facilité d\'utilisation. Résultats professionnels à domicile pour une peau transformée.',
        ],
        default: [
            'Outil beauté de qualité professionnelle pour des soins efficaces à la maison.',
        ]
    },
    aromatherapie: {
        huile: [
            'Huile essentielle pure et naturelle pour votre bien-être au quotidien. Utilisée en diffusion, massage ou bain, elle apporte ses bienfaits relaxants et apaisants.',
        ],
        diffuseur: [
            'Diffuseur d\'huiles essentielles qui transforme votre intérieur en un havre de paix. Diffusion ultrasonique silencieuse et design élégant qui s\'intègre à toute décoration.',
        ],
        bain: [
            'Bombe de bain effervescente qui transforme votre bain en un moment de pur bien-être. Couleurs, parfums et actifs hydratants pour une expérience sensorielle complète.',
        ],
        default: [
            'Produit bien-être qui vous offre un moment de détente et de relaxation au quotidien.',
        ]
    },
    accessoire: {
        pinceau: [
            'Pinceau maquillage aux fibres douces et denses pour une application précise et uniforme. Manche ergonomique et poils synthétiques de qualité professionnelle.',
        ],
        eponge: [
            'Éponge de maquillage ultra-douce pour un teint parfait et naturel. Sa forme ergonomique atteint toutes les zones du visage pour un résultat sans traces.',
        ],
        miroir: [
            'Miroir de maquillage qui vous offre une vision claire et précise pour un maquillage impeccable. Design élégant et pratique pour votre coiffeuse.',
        ],
        rangement: [
            'Accessoire de rangement beauté pour organiser votre collection de maquillage et soins. Design pratique et élégant qui s\'intègre à votre espace beauté.',
        ],
        default: [
            'Accessoire beauté indispensable pour une routine maquillage et soin complète et efficace.',
        ]
    },
};

function getDescription(cat, subcat) {
    const catDescs = DESCRIPTIONS[cat] || DESCRIPTIONS.visage;
    const pool = catDescs[subcat] || catDescs.default || DESCRIPTIONS.visage.default;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// 5. FEATURES GENERATOR
// ============================================================
function getFeatures(cat, subcat, name) {
    const featureSets = {
        soin: {
            serum: [
                'Formule concentrée en actifs puissants',
                'Texture légère absorption rapide',
                'Compatible avec tous les types de peau',
                'Résultats visibles en 2 à 4 semaines',
                'Sans parabènes ni silicones'
            ],
        },
        visage: {
            creme: [
                'Hydratation intense longue durée 24h',
                'Texture fondante non grasse',
                'Peut servir de base de maquillage',
                'Convient aux peaux sensibles',
                'Testé dermatologiquement'
            ],
            masque: [
                'Action intense en 15-20 minutes',
                'Résultat visible dès la 1ère utilisation',
                'Actifs concentrés haute performance',
                'Utilisation 2 à 3 fois par semaine',
                'Compatible tous types de peau'
            ],
            nettoyant: [
                'Nettoyage en profondeur sans agression',
                'Respecte le film hydrolipidique',
                'Élimine 99% des impuretés',
                'Convient à un usage quotidien',
                'Formule douce pH neutre'
            ],
            demaquillant: [
                'Élimine le maquillage même waterproof',
                'Formule douce sans alcool',
                'Ne pique pas les yeux',
                'Compatible peaux sensibles',
                'Laisse la peau propre et fraîche'
            ],
            levres: [
                'Hydratation intense et durable',
                'Formule nourrissante et protectrice',
                'Texture fondante agréable',
                'Peut se porter sous le rouge à lèvres',
                'Répare les lèvres gercées'
            ],
            'contour-yeux': [
                'Formule ultra-légère spéciale contour des yeux',
                'Cible cernes, poches et ridules',
                'Ne migre pas dans les yeux',
                'Applicateur précision',
                'Résultats anti-fatigue visibles'
            ],
        },
        corps: {
            hydratant: [
                'Hydratation intense et longue durée',
                'Texture fondante non collante',
                'Pénètre rapidement sans traces',
                'Peau douce et soyeuse',
                'Parfum délicat et naturel'
            ],
            gommage: [
                'Grains exfoliants naturels',
                'Élimine cellules mortes et impuretés',
                'Stimule le renouvellement cellulaire',
                'Peau lisse et lumineuse',
                'Utilisation 1 à 2 fois par semaine'
            ],
        },
        cheveux: {
            shampoing: [
                'Mousse onctueuse nettoyage doux',
                'Respecte le cuir chevelu',
                'Cheveux propres et légers',
                'Sans sulfates agressifs',
                'Parfum longue durée'
            ],
            masque: [
                'Réparation en profondeur',
                'Temps de pose 5-10 minutes',
                'Cheveux visiblement plus forts',
                'Apporte brillance et souplesse',
                'Soin hebdomadaire intensif'
            ],
            accessoire: [
                'Matériaux de qualité premium',
                'Design ergonomique confortable',
                'Doux pour les cheveux',
                'Léger et facile à transporter',
                'Résistant et durable'
            ],
        },
        ongles: {
            vernis: [
                'Couleur intense et couvrante',
                'Tenue longue durée',
                'Séchage rapide',
                'Application facile et uniforme',
                'Finition brillante ou mate'
            ],
            appareil: [
                'Technologie professionnelle',
                'Plusieurs niveaux de puissance',
                'Timer intégré',
                'Compact et portable',
                'Garantie qualité'
            ],
            'faux-ongles': [
                '24 pièces tailles assorties',
                'Faciles à poser soi-même',
                'Résultat salon à domicile',
                'Design tendance',
                'Inclut colle ou adhésif'
            ],
        },
        homme: {
            barbe: [
                'Formule spéciale poils de barbe',
                'Hydrate peau et poils',
                'Parfum masculin subtil',
                'Barbe douce et disciplinée',
                'Ingrédients naturels'
            ],
            rasage: [
                'Rasage confortable et précis',
                'Prévient les irritations',
                'Formule apaisante',
                'Convient peaux sensibles',
                'Fraîcheur longue durée'
            ],
        },
        outils: {
            massage: [
                'Pierre naturelle / matériau de qualité',
                'Design ergonomique prise en main facile',
                'Stimule circulation sanguine',
                'Aide au drainage lymphatique',
                'Rituel beauté anti-âge'
            ],
            nettoyage: [
                'Aspiration puissante mais douce',
                'Plusieurs niveaux d\'intensité',
                'Têtes interchangeables incluses',
                'Rechargeable USB',
                'Résultats visibles immédiatement'
            ],
        },
        aromatherapie: {
            diffuseur: [
                'Diffusion ultrasonique silencieuse',
                'LED d\'ambiance multicolore',
                'Arrêt automatique sécurité',
                'Couvre 15-30m²',
                'Design élégant décoratif'
            ],
            bain: [
                'Effervescence colorée et parfumée',
                'Actifs hydratants pour la peau',
                'Parfum relaxant longue durée',
                'Ingrédients naturels',
                'Idéal cadeau bien-être'
            ],
        },
        accessoire: {
            pinceau: [
                'Fibres synthétiques ultra-douces',
                'Application précise et uniforme',
                'Facile à nettoyer',
                'Manche ergonomique antidérapant',
                'Qualité professionnelle'
            ],
        },
    };

    const catFeats = featureSets[cat] || {};
    return catFeats[subcat] || catFeats[Object.keys(catFeats)[0]] || [
        'Qualité premium vérifiée',
        'Formulé avec des actifs performants',
        'Résultats visibles rapidement',
        'Convient à toutes les peaux',
        'Marque spécialiste beauté'
    ];
}

// ============================================================
// 6. SPECS GENERATOR
// ============================================================
function getSpecs(cat, subcat, price, name) {
    const baseSpecs = {};

    // Detect volume/weight from name
    const volMatch = name.match(/(\d+)\s*ml/i);
    const weightMatch = name.match(/(\d+)\s*g\b/i);
    const pcsMatch = name.match(/(\d+)\s*(?:pcs|pieces|pack)/i);

    if (cat === 'soin' || cat === 'visage' || cat === 'corps') {
        baseSpecs['Type'] = subcat === 'serum' ? 'Sérum' : subcat === 'creme' ? 'Crème' : subcat === 'masque' ? 'Masque' : 'Soin';
        baseSpecs['Contenance'] = volMatch ? `${volMatch[1]} ml` : weightMatch ? `${weightMatch[1]} g` : '30 ml';
        baseSpecs['Type de peau'] = 'Tous types';
        baseSpecs['Utilisation'] = subcat === 'masque' ? '2-3 fois/semaine' : 'Matin et/ou soir';
        baseSpecs['Texture'] = subcat === 'serum' ? 'Fluide légère' : subcat === 'creme' ? 'Onctueuse' : 'Variable';
    } else if (cat === 'cheveux') {
        baseSpecs['Type'] = subcat === 'shampoing' ? 'Shampoing' : subcat === 'masque' ? 'Masque capillaire' : 'Soin capillaire';
        baseSpecs['Contenance'] = volMatch ? `${volMatch[1]} ml` : '250 ml';
        baseSpecs['Type de cheveux'] = 'Tous types';
        if (subcat !== 'accessoire') {
            baseSpecs['Utilisation'] = subcat === 'masque' ? '1-2 fois/semaine' : 'À chaque lavage';
        }
    } else if (cat === 'ongles') {
        baseSpecs['Type'] = subcat === 'vernis' ? 'Vernis gel' : subcat === 'appareil' ? 'Appareil manucure' : 'Accessoire ongles';
        if (pcsMatch) baseSpecs['Quantité'] = `${pcsMatch[1]} pièces`;
        if (subcat === 'appareil') {
            baseSpecs['Alimentation'] = 'USB rechargeable';
            baseSpecs['Puissance'] = '36-48W';
        }
    } else if (cat === 'homme') {
        baseSpecs['Type'] = subcat === 'barbe' ? 'Soin barbe' : 'Soin homme';
        baseSpecs['Contenance'] = volMatch ? `${volMatch[1]} ml` : '50 ml';
        baseSpecs['Type de peau'] = 'Tous types';
    } else if (cat === 'outils') {
        baseSpecs['Type'] = 'Appareil beauté';
        baseSpecs['Matériau'] = /jade|quartz|stone/i.test(name) ? 'Pierre naturelle' : /steel|metal/i.test(name) ? 'Acier inoxydable' : 'ABS de qualité';
        if (/recharg|usb|battery/i.test(name)) baseSpecs['Alimentation'] = 'USB rechargeable';
    } else if (cat === 'aromatherapie') {
        baseSpecs['Type'] = subcat === 'diffuseur' ? 'Diffuseur ultrasonique' : subcat === 'bain' ? 'Bombe de bain' : 'Huile essentielle';
        if (subcat === 'diffuseur') {
            baseSpecs['Capacité'] = '300 ml';
            baseSpecs['Surface'] = '15-30 m²';
            baseSpecs['Alimentation'] = 'USB';
        }
    }

    baseSpecs['Marque'] = 'ÉCLAT Sélection';

    return baseSpecs;
}

// ============================================================
// 7. INGREDIENTS GENERATOR
// ============================================================
function getIngredients(cat, subcat, name) {
    // Skip tools, accessories, etc.
    if (['outils', 'accessoire'].includes(cat)) return '';
    if (['accessoire', 'appareil', 'outil', 'decoration', 'faux-ongles'].includes(subcat)) return '';

    const ingredientSets = {
        soin_serum: 'Aqua, Glycerin, Propanediol, Niacinamide, Sodium Hyaluronate, Panthenol, Allantoin, Betaine, Carbomer, Tocopheryl Acetate, Phenoxyethanol, Ethylhexylglycerin',
        visage_creme: 'Aqua, Cetearyl Alcohol, Glycerin, Caprylic/Capric Triglyceride, Shea Butter, Dimethicone, Ceteareth-20, Tocopheryl Acetate, Panthenol, Carbomer, Phenoxyethanol, Parfum',
        visage_masque: 'Aqua, Glycerin, Butylene Glycol, Trehalose, Sodium Hyaluronate, Betaine, Allantoin, Panthenol, Cellulose, Phenoxyethanol, Parfum',
        visage_nettoyant: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Sodium Chloride, Citric Acid, Phenoxyethanol, Parfum',
        corps_hydratant: 'Aqua, Glycerin, Cetearyl Alcohol, Helianthus Annuus Seed Oil, Shea Butter, Dimethicone, Glyceryl Stearate, Ceteareth-20, Panthenol, Tocopheryl Acetate, Phenoxyethanol, Parfum',
        cheveux_shampoing: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Glycol Distearate, Parfum, Panthenol, Guar Hydroxypropyltrimonium Chloride, Citric Acid, Phenoxyethanol',
        cheveux_masque: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Hydrolyzed Keratin, Panthenol, Argania Spinosa Kernel Oil, Dimethicone, Phenoxyethanol, Parfum',
        ongles_vernis: 'Butyl Acetate, Ethyl Acetate, Nitrocellulose, Acetyl Tributyl Citrate, Isopropyl Alcohol, Adipic Acid/Neopentyl Glycol/Trimellitic Anhydride Copolymer, Stearalkonium Bentonite',
        homme_barbe: 'Argania Spinosa Kernel Oil, Simmondsia Chinensis Seed Oil, Prunus Amygdalus Dulcis Oil, Tocopheryl Acetate, Parfum',
        aromatherapie_huile: 'Huile essentielle pure 100% naturelle',
        levres: 'Cera Alba, Butyrospermum Parkii Butter, Ricinus Communis Seed Oil, Copernicia Cerifera Wax, Tocopheryl Acetate, Parfum',
    };

    // Add ingredient-specific additions based on product name
    let baseKey = `${cat}_${subcat}`;
    let base = ingredientSets[baseKey] || ingredientSets[`${cat}_${Object.keys(ingredientSets).find(k => k.startsWith(cat + '_'))?.split('_')[1] || ''}`] || '';

    if (!base) return '';

    // Add specific ingredients based on product name keywords
    const additions = [];
    if (/retinol/i.test(name)) additions.push('Retinol');
    if (/hyaluronic/i.test(name)) additions.push('Sodium Hyaluronate');
    if (/vitamin\s*c/i.test(name)) additions.push('Ascorbyl Glucoside');
    if (/niacinamide/i.test(name)) additions.push('Niacinamide');
    if (/collagen/i.test(name)) additions.push('Hydrolyzed Collagen');
    if (/keratin/i.test(name)) additions.push('Hydrolyzed Keratin');
    if (/aloe/i.test(name)) additions.push('Aloe Barbadensis Leaf Extract');
    if (/argan/i.test(name)) additions.push('Argania Spinosa Kernel Oil');
    if (/tea\s*tree/i.test(name)) additions.push('Melaleuca Alternifolia Leaf Oil');
    if (/rosemary/i.test(name)) additions.push('Rosmarinus Officinalis Extract');
    if (/honey/i.test(name)) additions.push('Mel Extract');
    if (/ginseng/i.test(name)) additions.push('Panax Ginseng Root Extract');
    if (/snail/i.test(name)) additions.push('Snail Secretion Filtrate');
    if (/green\s*tea/i.test(name)) additions.push('Camellia Sinensis Leaf Extract');
    if (/caffeine/i.test(name)) additions.push('Caffeine');
    if (/centella|cica/i.test(name)) additions.push('Centella Asiatica Extract');
    if (/rice/i.test(name)) additions.push('Oryza Sativa Bran Extract');
    if (/charcoal/i.test(name)) additions.push('Charcoal Powder');
    if (/turmeric/i.test(name)) additions.push('Curcuma Longa Root Extract');
    if (/glycolic/i.test(name)) additions.push('Glycolic Acid');
    if (/salicylic/i.test(name)) additions.push('Salicylic Acid');

    if (additions.length > 0) {
        return additions.join(', ') + ', ' + base;
    }
    return base;
}

// ============================================================
// 8. HOW-TO GENERATOR
// ============================================================
function getHowTo(cat, subcat) {
    const howtos = {
        soin_serum: '1. Nettoyez votre visage avec un nettoyant doux\\n2. Appliquez 3-4 gouttes de sérum sur le visage et le cou\\n3. Tapotez délicatement du bout des doigts pour favoriser la pénétration\\n4. Attendez 1-2 minutes puis appliquez votre crème hydratante\\n5. Utilisez matin et/ou soir pour des résultats optimaux',
        visage_creme: '1. Sur une peau propre et tonifiée, prélevez une noisette de crème\\n2. Appliquez par petites touches sur le front, les joues, le nez et le menton\\n3. Étalez en mouvements ascendants du centre vers l\'extérieur\\n4. N\'oubliez pas le cou et le décolleté\\n5. Laissez pénétrer avant d\'appliquer votre maquillage',
        visage_masque: '1. Appliquez sur un visage propre et sec en couche uniforme\\n2. Laissez poser 15 à 20 minutes\\n3. Rincez à l\'eau tiède en massant doucement\\n4. Terminez par votre sérum et crème habituels\\n5. Utilisez 2 à 3 fois par semaine',
        visage_nettoyant: '1. Mouillez votre visage à l\'eau tiède\\n2. Prélevez une petite quantité de produit\\n3. Faites mousser entre vos mains puis massez le visage en cercles\\n4. Insistez sur la zone T (front, nez, menton)\\n5. Rincez abondamment et séchez en tapotant',
        visage_demaquillant: '1. Imbibez un coton de produit démaquillant\\n2. Appliquez sur le visage en mouvements doux\\n3. Pour les yeux, laissez poser quelques secondes avant d\'essuyer\\n4. Répétez jusqu\'à ce que le coton soit propre\\n5. Terminez par un rinçage ou une lotion tonique',
        visage_levres: '1. Appliquez une fine couche sur les lèvres propres et sèches\\n2. Pour un soin intensif, appliquez une couche épaisse avant le coucher\\n3. Peut se porter sous le rouge à lèvres comme base\\n4. Réappliquez aussi souvent que nécessaire\\n5. Pour le gommage : massez doucement puis rincez',
        corps_hydratant: '1. Appliquez après la douche sur une peau légèrement humide\\n2. Massez en mouvements circulaires des pieds vers le haut\\n3. Insistez sur les zones sèches (coudes, genoux, talons)\\n4. Laissez absorber quelques minutes avant de vous habiller\\n5. Utilisez quotidiennement pour une peau souple',
        corps_gommage: '1. Sous la douche, mouillez la peau\\n2. Prélevez une quantité généreuse de gommage\\n3. Massez en mouvements circulaires sur tout le corps\\n4. Insistez sur coudes, genoux et zones rugueuses\\n5. Rincez abondamment et appliquez votre hydratant',
        cheveux_shampoing: '1. Mouillez abondamment vos cheveux\\n2. Appliquez une noisette de shampoing sur le cuir chevelu\\n3. Massez du bout des doigts en mouvements circulaires\\n4. Laissez poser 1-2 minutes\\n5. Rincez soigneusement et répétez si nécessaire',
        cheveux_masque: '1. Après le shampoing, essorez légèrement les cheveux\\n2. Appliquez le masque sur les longueurs et pointes\\n3. Peignez pour répartir uniformément\\n4. Laissez poser 5 à 10 minutes\\n5. Rincez abondamment à l\'eau tiède',
        ongles_vernis: '1. Préparez vos ongles : limez, repoussez les cuticules\\n2. Appliquez une couche de base coat\\n3. Appliquez 2 fines couches de vernis en laissant sécher entre chaque\\n4. Terminez par un top coat pour la brillance et la tenue\\n5. Pour le gel : catalysez sous lampe UV/LED entre chaque couche',
        homme_barbe: '1. Après le nettoyage du visage, séchez la barbe\\n2. Déposez 3-4 gouttes d\'huile dans la paume\\n3. Frottez vos mains et massez dans le sens du poil\\n4. Peignez pour répartir uniformément\\n5. Utilisez quotidiennement pour de meilleurs résultats',
        outils_massage: '1. Appliquez votre sérum ou huile visage habituel\\n2. Commencez par le centre du visage vers l\'extérieur\\n3. Utilisez des mouvements ascendants sur le cou et la mâchoire\\n4. Insistez doucement sur les zones de tension\\n5. Nettoyez l\'outil après chaque utilisation',
        outils_nettoyage: '1. Nettoyez votre visage à l\'eau tiède pour ouvrir les pores\\n2. Choisissez la tête adaptée à la zone à traiter\\n3. Passez l\'appareil sur la peau en mouvements lents\\n4. Ne restez pas plus de 3 secondes au même endroit\\n5. Appliquez une lotion apaisante après utilisation',
        aromatherapie_diffuseur: '1. Remplissez le réservoir d\'eau jusqu\'au niveau indiqué\\n2. Ajoutez 3-5 gouttes d\'huile essentielle\\n3. Replacez le couvercle et allumez\\n4. Profitez pendant 30 minutes à 1 heure\\n5. Nettoyez régulièrement pour maintenir les performances',
    };

    const key = `${cat}_${subcat}`;
    return howtos[key] || howtos[`${cat}_${Object.keys(howtos).find(k => k.startsWith(cat + '_'))?.split('_')[1] || ''}`] ||
        '1. Lire attentivement les instructions sur l\'emballage\\n2. Effectuer un test de tolérance sur une petite zone\\n3. Appliquer selon les recommandations du produit\\n4. Utiliser régulièrement pour des résultats optimaux\\n5. Conserver à l\'abri de la chaleur et de la lumière';
}

// ============================================================
// 9. BADGE GENERATOR
// ============================================================
function getBadge(price, searchTerm, index) {
    if (index < 20) return 'Bestseller';
    if (price <= 6.90) return 'Petit prix';
    if (/new|2024|2025|2026/i.test(searchTerm)) return 'Nouveau';
    if (/set|kit|pack/i.test(searchTerm)) return 'Pack';

    const badges = ['Tendance', 'Top ventes', 'Coup de cœur', 'Nouveau', 'Exclusif'];
    return badges[index % badges.length];
}

// ============================================================
// 10. RATING GENERATOR (realistic distribution)
// ============================================================
function getRating() {
    // Weighted random: mostly 4.0-4.8 (realistic for beauty products)
    const weights = [
        { min: 3.8, max: 4.0, weight: 10 },
        { min: 4.0, max: 4.3, weight: 25 },
        { min: 4.3, max: 4.5, weight: 30 },
        { min: 4.5, max: 4.7, weight: 25 },
        { min: 4.7, max: 4.9, weight: 10 },
    ];

    const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * totalWeight;
    for (const w of weights) {
        r -= w.weight;
        if (r <= 0) {
            return +(w.min + Math.random() * (w.max - w.min)).toFixed(1);
        }
    }
    return 4.3;
}

function getReviews() {
    // Weighted: most products have 15-150 reviews
    return Math.floor(Math.random() * 180) + 12;
}

// ============================================================
// 11. GENDER ASSIGNMENT
// ============================================================
function getGender(cat, name) {
    if (cat === 'homme') return 'homme';
    if (/\bmen\b|\bhomme\b|\bbeard\b|\bshav/i.test(name)) return 'homme';
    if (/\bwomen\b|\bfemme\b|\blady\b|\bgirl/i.test(name)) return 'femme';
    return 'unisex';
}

// ============================================================
// MAIN PROCESSING
// ============================================================
console.log(`\n🔄 Processing ${rawCatalog.length} raw CJ products...\n`);

// Step 1: Filter out bad products
const filtered = rawCatalog.filter(p => {
    // Remove products with absurd prices
    if (p.price > 50 || p.price <= 0) return false;
    // Remove products without images
    if (!p.image) return false;
    // Remove products with very short names (probably junk)
    if (!p.name || p.name.length < 5) return false;
    return true;
});

console.log(`✅ After filtering: ${filtered.length} products (removed ${rawCatalog.length - filtered.length} bad entries)`);

// Step 2: Deduplicate by similar names (within same category)
const seen = new Set();
const deduped = filtered.filter(p => {
    // Create a simplified key from the name
    const key = p.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

console.log(`✅ After dedup: ${deduped.length} products`);

// Step 3: Select top 500 (prioritize diversity across categories)
// Sort by search term diversity first
const byCat = {};
deduped.forEach(p => {
    const mapping = CATEGORY_MAP[p.searchTerm] || { cat: 'visage', subcat: 'soin', concerns: [] };
    const cat = mapping.cat;
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(p);
});

console.log('\n📂 Products by category:');
Object.entries(byCat).sort((a, b) => b[1].length - a[1].length).forEach(([cat, products]) => {
    console.log(`   ${cat}: ${products.length}`);
});

// Take proportional selection from each category, up to 500
const TARGET = 500;
const selected = [];
const catCounts = {};

// First pass: take products proportionally
const totalAvailable = deduped.length;
Object.entries(byCat).forEach(([cat, products]) => {
    const proportion = Math.max(Math.round((products.length / totalAvailable) * TARGET), 5);
    const take = Math.min(proportion, products.length);
    catCounts[cat] = take;
    selected.push(...products.slice(0, take));
});

// If we have less than 500, add more from largest categories
while (selected.length < TARGET && selected.length < deduped.length) {
    for (const [cat, products] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)) {
        if (selected.length >= TARGET) break;
        const currentCount = catCounts[cat] || 0;
        if (currentCount < products.length) {
            selected.push(products[currentCount]);
            catCounts[cat] = currentCount + 1;
        }
    }
}

// Trim to exactly 500
const finalProducts = selected.slice(0, TARGET);
console.log(`\n✅ Selected ${finalProducts.length} products for catalog`);

// Step 4: Transform into complete product objects
// Keep original 15 products (IDs 1-15) — they already have full data
const START_ID = 16; // New products start at ID 16

const processedProducts = finalProducts.map((raw, index) => {
    const id = START_ID + index;
    const mapping = CATEGORY_MAP[raw.searchTerm] || { cat: 'visage', subcat: 'soin', concerns: [] };
    const { cat, subcat, concerns } = mapping;

    const retailPrice = calculateRetailPrice(raw.price);
    const frenchName = translateProductName(raw.name, raw.searchTerm, cat);

    return {
        id,
        name: frenchName,
        category: cat,
        subcategory: subcat,
        price: retailPrice,
        image: raw.image,
        images: raw.images && raw.images.length > 0 ? raw.images.slice(0, 4) : [raw.image],
        badge: getBadge(retailPrice, raw.searchTerm, index),
        rating: getRating(),
        reviews: getReviews(),
        description: getDescription(cat, subcat),
        features: getFeatures(cat, subcat, raw.name),
        specs: getSpecs(cat, subcat, retailPrice, raw.name),
        ingredients: getIngredients(cat, subcat, raw.name),
        howTo: getHowTo(cat, subcat),
        bestseller: index < 30,
        supplier: 'cj',
        cjProductId: raw.pid,
        cjSku: raw.sku || '',
        cjPrice: raw.price,
        concerns: concerns,
        gender: getGender(cat, raw.name),
    };
});

// Step 5: Save processed catalog
const outPath = path.resolve(__dirname, 'cj-processed-catalog.json');
fs.writeFileSync(outPath, JSON.stringify(processedProducts, null, 2));
console.log(`\n📁 Saved ${processedProducts.length} processed products to ${outPath}`);

// Stats
const catStats = {};
processedProducts.forEach(p => {
    catStats[p.category] = (catStats[p.category] || 0) + 1;
});

console.log('\n📊 Final catalog stats:');
console.log(`   Total products: ${processedProducts.length}`);
console.log(`   Price range: ${Math.min(...processedProducts.map(p => p.price)).toFixed(2)}€ - ${Math.max(...processedProducts.map(p => p.price)).toFixed(2)}€`);
console.log(`   Average price: ${(processedProducts.reduce((s, p) => s + p.price, 0) / processedProducts.length).toFixed(2)}€`);
console.log('\n📂 Category distribution:');
Object.entries(catStats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} (${((count/processedProducts.length)*100).toFixed(1)}%)`);
});

console.log('\n✅ Processing complete! Next: generate products.js');
