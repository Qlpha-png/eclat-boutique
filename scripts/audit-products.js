/**
 * AUDIT QUALITÉ — ÉCLAT BOUTIQUE — products.js
 * Vérifie 10 critères de qualité sur les 515 produits.
 * Usage : node scripts/audit-products.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Load products.js ---
const filePath = path.join(__dirname, '..', 'js', 'products.js');
let raw = fs.readFileSync(filePath, 'utf-8');

// Extract the PRODUCTS array by finding its boundaries
let PRODUCTS;
const syntaxErrors = [];
try {
    const startMarker = raw.indexOf('const PRODUCTS = [');
    if (startMarker === -1) throw new Error('PRODUCTS array not found');
    const bracketStart = raw.indexOf('[', startMarker);

    // Find the next const declaration after PRODUCTS to locate the end
    const bundlesIdx = raw.indexOf('const BUNDLES', bracketStart);
    const routineIdx = raw.indexOf('const ROUTINE_STEPS', bracketStart);
    const searchEnd = Math.min(
        bundlesIdx > 0 ? bundlesIdx : raw.length,
        routineIdx > 0 ? routineIdx : raw.length
    );
    // Find the last ]; before the next const
    const arrayEndIdx = raw.lastIndexOf('];', searchEnd);
    if (arrayEndIdx === -1) throw new Error('Could not find end of PRODUCTS array');

    let arrayStr = raw.substring(bracketStart, arrayEndIdx + 2);

    // Fix known syntax issues before eval:
    // 1. Remove malformed entries like { id: 15,, (incomplete objects)
    //    Pattern: { id: <number>,, followed by no other properties before next {
    const malformedPattern = /\{\s*id:\s*(\d+)\s*,\s*,/g;
    let match;
    while ((match = malformedPattern.exec(arrayStr)) !== null) {
        syntaxErrors.push(`Entrée malformée trouvée et retirée: { id: ${match[1]},, } (objet incomplet)`);
    }
    // Remove incomplete objects: { id: N,, ... up to the next { id: or ];
    arrayStr = arrayStr.replace(/\{\s*id:\s*\d+\s*,\s*,[\s\S]*?(?=\{\s*id:)/g, '');

    // 2. Fix double commas
    arrayStr = arrayStr.replace(/,,+/g, ',');

    // Write to temp file and require it (avoids eval issues with semicolons)
    const tmpFile = path.join(os.tmpdir(), 'eclat_audit_products_tmp.js');
    fs.writeFileSync(tmpFile, 'module.exports = ' + arrayStr);
    PRODUCTS = require(tmpFile);
    fs.unlinkSync(tmpFile);
    if (!Array.isArray(PRODUCTS)) throw new Error('Parsed result is not an array');
} catch (e) {
    console.error('ERREUR fatale:', e.message);
    process.exit(1);
}

console.log('='.repeat(80));
console.log('  AUDIT QUALITÉ — ÉCLAT BOUTIQUE — products.js');
console.log('  Date : ' + new Date().toISOString().slice(0, 10));
console.log('='.repeat(80));
console.log(`\nNombre total de produits chargés : ${PRODUCTS.length}\n`);

const issues = {};
function addIssue(category, product, detail) {
    if (!issues[category]) issues[category] = [];
    issues[category].push({ id: product.id, name: product.name, detail });
}

// ============================================================================
// 1. NOMS EN ANGLAIS OU CONTENANT DES MARQUES PARASITES
// ============================================================================
const junkBrands = [
    'EELHOE', 'LANBENA', 'BIOAQUA', 'VIBRANT GLAMOUR', 'SADOER',
    'OTVENA', 'BREYLEE', 'DISAAR', 'CYMBIOTIKA', 'BUSHAID',
    'GOOGEER', 'HUORUN', 'HUANNENG', 'AILKE', 'EFERO', 'ARTISCARE',
    'AUQUEST', 'BAIMISS', 'BEOTUA', 'BINGJU', 'DR.RASHEL', 'DR RASHEL',
    'FOCALLURE', 'HANDAIYAN', 'IMAGES', 'LAIKOU', 'MEIKING',
    'ROREC', 'SENANA', 'SERSANLOVE', 'TSLM', 'VENZEN', 'ZOZU',
    'HENG FANG', 'NOVO', 'O.TWO.O', 'MISS ROSE', 'PHOERA',
    'PUDAIER', 'CATKIN', 'ZEESEA', 'CARSLAN', 'MAYCHEER',
    'MIXIU', 'NICEFACE', 'POPFEEL', 'UCANBE', 'PERFECT DIARY'
];
const junkBrandsRegex = new RegExp(junkBrands.join('|'), 'i');

// English words commonly found in untranslated CJ product names
const englishWords = [
    'cream', 'serum', 'mask', 'face', 'skin', 'body', 'hair',
    'treatment', 'moisturizer', 'moisturizing', 'whitening', 'brightening',
    'anti-aging', 'anti aging', 'cleanser', 'toner', 'lotion',
    'essence', 'beauty', 'care', 'oil', 'gel', 'foam', 'spray',
    'scrub', 'peel', 'patch', 'eye', 'lip', 'hand', 'foot',
    'nail', 'makeup', 'remover', 'sunscreen', 'foundation',
    'concealer', 'powder', 'blush', 'lipstick', 'eyeshadow',
    'mascara', 'eyeliner', 'primer', 'setting', 'contour',
    'highlighter', 'bronzer', 'brush', 'sponge', 'tool',
    'device', 'machine', 'roller', 'massager', 'derma',
    'water', 'tablets', 'drops', 'supplement', 'hydrogen',
    'molecular', 'professional', 'organic', 'natural', 'collagen',
    'hyaluronic', 'vitamin', 'retinol', 'niacinamide', 'peptide',
    'the', 'and', 'for', 'with', 'deep', 'soft', 'set',
    'black', 'white', 'gold', 'silver', 'rose', 'green',
    'repair', 'lifting', 'firming', 'tightening', 'smoothing',
    'nourishing', 'hydrating', 'soothing', 'purifying', 'detox',
    'pore', 'acne', 'wrinkle', 'dark', 'spot', 'circle',
    'bag', 'fine', 'line', 'aging', 'mature', 'dry', 'oily',
    'sensitive', 'combination', 'normal', 'all', 'type', 'types',
    'new', 'hot', 'best', 'top', 'sale', 'mini', 'portable',
    'electric', 'rechargeable', 'wireless', 'led', 'infrared',
    'ultrasonic', 'micro', 'nano', 'pro', 'plus', 'max', 'ultra',
    'shampoo', 'conditioner', 'rinse', 'growth', 'loss',
    'dandruff', 'volume', 'shine', 'curl', 'straight',
    'color', 'dye', 'balm', 'wax', 'styling', 'hold',
    'super', 'keratin', 'biotin', 'argan', 'coconut'
];

// Check if a name is mostly English (3+ English words)
function countEnglishWords(name) {
    const words = name.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ\s-]/g, '').split(/[\s-]+/);
    let count = 0;
    const found = [];
    for (const w of words) {
        if (w.length < 3) continue; // skip tiny words
        if (englishWords.includes(w)) {
            count++;
            found.push(w);
        }
    }
    return { count, found };
}

for (const p of PRODUCTS) {
    // Check for junk brand names
    if (junkBrandsRegex.test(p.name)) {
        const match = p.name.match(junkBrandsRegex);
        addIssue('1_MARQUES_PARASITES', p, `Contient la marque "${match[0]}"`);
    }

    // Check for fully English names (3+ English words)
    const eng = countEnglishWords(p.name);
    if (eng.count >= 3) {
        addIssue('1_NOMS_ANGLAIS', p, `${eng.count} mots anglais détectés: [${eng.found.join(', ')}]`);
    }
}

// ============================================================================
// 2. NOM QUI NE CORRESPOND PAS À LA CATÉGORIE
// ============================================================================
const categoryKeywords = {
    visage: ['visage', 'facial', 'face', 'peau', 'crème', 'sérum', 'masque', 'patchs', 'contour', 'yeux', 'anti-rides', 'teint', 'démaquillant', 'nettoyant', 'gommage', 'peeling', 'tonique', 'lotion', 'spf', 'solaire'],
    soin: ['sérum', 'crème', 'huile', 'lotion', 'soin', 'baume', 'gel', 'mousse', 'lait', 'émulsion', 'essence', 'ampoule', 'concentré', 'masque', 'patch', 'exfoliant', 'gommage', 'rétinol', 'vitamine', 'acide', 'collagène', 'hyaluronique', 'niacinamide'],
    cheveux: ['cheveux', 'capillaire', 'shampoing', 'shampooing', 'après-shampoing', 'masque', 'huile', 'spray', 'sérum', 'baume', 'gel', 'mousse', 'laque', 'cire', 'kératine', 'biotine', 'argan', 'boucle', 'lissage', 'coloration'],
    corps: ['corps', 'body', 'peau', 'mains', 'pieds', 'ongles', 'cellulite', 'vergetures', 'amincissant', 'exfoliant', 'gommage', 'beurre', 'crème', 'lotion', 'huile'],
    maquillage: ['maquillage', 'fond de teint', 'mascara', 'rouge à lèvres', 'fard', 'eye-liner', 'blush', 'poudre', 'correcteur', 'primer', 'gloss', 'vernis'],
    outils: ['brosse', 'gua sha', 'rouleau', 'roller', 'miroir', 'pinceau', 'éponge', 'applicateur', 'appareil', 'masseur', 'led', 'ultrasonique', 'dermaroller', 'rasage', 'ventouse'],
    nettoyage: ['nettoyant', 'démaquillant', 'eau micellaire', 'mousse', 'gel', 'lait', 'tonique', 'lotion'],
};

// Specific name-category mismatches
for (const p of PRODUCTS) {
    const nameLow = p.name.toLowerCase();
    const cat = p.category;

    // "Crème" or skincare terms in "outils" category
    if (cat === 'outils' && /crème|sérum|lotion|huile|masque visage|soin|baume|gel nettoy/i.test(nameLow)) {
        addIssue('2_NOM_CATEGORIE_MISMATCH', p, `Nom "${p.name}" semble être un soin, pas un outil (catégorie: ${cat})`);
    }
    // "Brosse", "Roller", "Appareil" in "soin" category
    if (cat === 'soin' && /brosse|roller|appareil|masseur|gua sha|ventouse|scrubber/i.test(nameLow)) {
        addIssue('2_NOM_CATEGORIE_MISMATCH', p, `Nom "${p.name}" semble être un outil, pas un soin (catégorie: ${cat})`);
    }
    // Hair product in "visage" category
    if (cat === 'visage' && /cheveux|capillaire|shampoing|shampooing|kératine|boucle/i.test(nameLow)) {
        addIssue('2_NOM_CATEGORIE_MISMATCH', p, `Nom "${p.name}" semble être pour cheveux, pas visage (catégorie: ${cat})`);
    }
    // "Masque Visage" in "demaquillant" subcategory
    if (p.subcategory === 'demaquillant' && /masque|sérum|crème|huile/i.test(nameLow) && !/démaquill/i.test(nameLow)) {
        addIssue('2_NOM_CATEGORIE_MISMATCH', p, `Nom "${p.name}" dans sous-catégorie "demaquillant" mais ne semble pas être un démaquillant`);
    }
    // Detect totally unrelated names: hydrogen water in beauty store
    if (/hydrogen|molecular|water tablets|supplement|pills|capsules/i.test(nameLow)) {
        addIssue('2_PRODUIT_NON_BEAUTE', p, `Nom "${p.name}" ne semble pas être un produit de beauté`);
    }
}

// ============================================================================
// 3. NOMS TRÈS COURTS OU TROP GÉNÉRIQUES
// ============================================================================
const genericNames = [
    'crème visage', 'sérum visage', 'masque visage', 'huile visage',
    'crème corps', 'lotion corps', 'gel visage', 'soin visage',
    'soin cheveux', 'masque cheveux', 'crème', 'sérum', 'masque',
    'huile', 'lotion', 'baume', 'gel', 'mousse', 'spray',
    'brosse', 'roller', 'outil'
];

for (const p of PRODUCTS) {
    if (p.name.length < 10) {
        addIssue('3_NOM_TROP_COURT', p, `Nom "${p.name}" fait seulement ${p.name.length} caractères`);
    }
    if (p.name.length >= 10 && p.name.length < 15) {
        addIssue('3_NOM_COURT_WARNING', p, `Nom "${p.name}" est court (${p.name.length} caractères)`);
    }
    if (genericNames.includes(p.name.toLowerCase().trim())) {
        addIssue('3_NOM_GENERIQUE', p, `Nom "${p.name}" est trop générique`);
    }
}

// ============================================================================
// 4. NOMS EN DOUBLON
// ============================================================================
const nameCounts = {};
for (const p of PRODUCTS) {
    const key = p.name.toLowerCase().trim();
    if (!nameCounts[key]) nameCounts[key] = [];
    nameCounts[key].push(p.id);
}
for (const [name, ids] of Object.entries(nameCounts)) {
    if (ids.length > 1) {
        for (const id of ids) {
            const p = PRODUCTS.find(x => x.id === id);
            addIssue('4_NOM_DOUBLON', p, `Nom "${p.name}" apparaît ${ids.length}x (IDs: ${ids.join(', ')})`);
        }
    }
}

// ============================================================================
// 5. CHAMPS MANQUANTS OU VIDES
// ============================================================================
const requiredFields = ['id', 'name', 'category', 'price', 'image', 'description', 'features', 'specs'];
const importantFields = ['rating', 'reviews', 'howTo', 'ingredients', 'badge', 'supplier'];

for (const p of PRODUCTS) {
    for (const field of requiredFields) {
        if (p[field] === undefined || p[field] === null) {
            addIssue('5_CHAMP_MANQUANT_CRITIQUE', p, `Champ "${field}" manquant (undefined/null)`);
        } else if (typeof p[field] === 'string' && p[field].trim() === '') {
            addIssue('5_CHAMP_VIDE_CRITIQUE', p, `Champ "${field}" est vide`);
        } else if (Array.isArray(p[field]) && p[field].length === 0) {
            addIssue('5_CHAMP_VIDE_CRITIQUE', p, `Champ "${field}" est un tableau vide`);
        } else if (typeof p[field] === 'object' && !Array.isArray(p[field]) && Object.keys(p[field]).length === 0) {
            addIssue('5_CHAMP_VIDE_CRITIQUE', p, `Champ "${field}" est un objet vide`);
        }
    }
    for (const field of importantFields) {
        if (p[field] === undefined || p[field] === null) {
            addIssue('5_CHAMP_MANQUANT_SECONDAIRE', p, `Champ "${field}" manquant`);
        } else if (typeof p[field] === 'string' && p[field].trim() === '') {
            addIssue('5_CHAMP_VIDE_SECONDAIRE', p, `Champ "${field}" est vide`);
        }
    }
    // Check features array has reasonable content
    if (Array.isArray(p.features) && p.features.length > 0) {
        for (const f of p.features) {
            if (typeof f !== 'string' || f.trim() === '') {
                addIssue('5_FEATURE_VIDE', p, `Une feature est vide dans le tableau features`);
            }
        }
    }
}

// ============================================================================
// 6. DISTRIBUTION DES PRIX (sanity check)
// ============================================================================
const prices = PRODUCTS.map(p => p.price).filter(p => typeof p === 'number');
prices.sort((a, b) => a - b);

const priceStats = {
    min: prices[0],
    max: prices[prices.length - 1],
    median: prices[Math.floor(prices.length / 2)],
    mean: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
    under5: prices.filter(p => p < 5).length,
    range5to10: prices.filter(p => p >= 5 && p < 10).length,
    range10to20: prices.filter(p => p >= 10 && p < 20).length,
    range20to50: prices.filter(p => p >= 20 && p < 50).length,
    over50: prices.filter(p => p >= 50).length,
};

// Flag extremes
for (const p of PRODUCTS) {
    if (typeof p.price !== 'number') {
        addIssue('6_PRIX_INVALIDE', p, `Prix non numérique: ${p.price}`);
    } else if (p.price <= 0) {
        addIssue('6_PRIX_ZERO_NEGATIF', p, `Prix = ${p.price}`);
    } else if (p.price < 3) {
        addIssue('6_PRIX_TRES_BAS', p, `Prix = ${p.price}€ (suspect pour un produit beauté)`);
    } else if (p.price > 60) {
        addIssue('6_PRIX_TRES_ELEVE', p, `Prix = ${p.price}€ (au-delà de la gamme attendue)`);
    }
}

// ============================================================================
// 7. URLs D'IMAGES INVALIDES
// ============================================================================
const validImageDomains = [
    'cf.cjdropshipping.com',
    'oss-cf.cjdropshipping.com',
    'img.cjdropshipping.com',
    'cbu01.alicdn.com',
];
const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

for (const p of PRODUCTS) {
    if (!p.image || typeof p.image !== 'string') {
        addIssue('7_IMAGE_MANQUANTE', p, `Pas d'URL d'image`);
        continue;
    }

    const img = p.image.trim();

    // Check it starts with https
    if (!img.startsWith('https://')) {
        addIssue('7_IMAGE_PAS_HTTPS', p, `URL non HTTPS: ${img.substring(0, 80)}`);
    }

    // Check for known valid domains
    let validDomain = false;
    for (const domain of validImageDomains) {
        if (img.includes(domain)) { validDomain = true; break; }
    }
    if (!validDomain) {
        addIssue('7_IMAGE_DOMAINE_INCONNU', p, `Domaine d'image inconnu: ${img.substring(0, 80)}`);
    }

    // Check for placeholder / broken patterns
    if (/placeholder|default|no-image|missing|blank|sample/i.test(img)) {
        addIssue('7_IMAGE_PLACEHOLDER', p, `URL ressemble à un placeholder: ${img.substring(0, 80)}`);
    }

    // Check that URL has a valid image extension or is a CJ product path
    const urlPath = img.split('?')[0];
    const hasExt = validImageExtensions.some(ext => urlPath.toLowerCase().endsWith(ext));
    const isCjPath = /cjdropshipping\.com\/(quick\/)?product\//.test(img) || /cjdropshipping\.com\/[a-f0-9-]+\.(jpg|jpeg|png)/.test(img);
    if (!hasExt && !isCjPath) {
        addIssue('7_IMAGE_EXTENSION_DOUTEUSE', p, `Extension d'image non reconnue: ${img.substring(0, 80)}`);
    }

    // Check for duplicated images across products
}

// Check duplicate images
const imageCounts = {};
for (const p of PRODUCTS) {
    if (!p.image) continue;
    const key = p.image.trim();
    if (!imageCounts[key]) imageCounts[key] = [];
    imageCounts[key].push(p.id);
}
let duplicateImageCount = 0;
for (const [url, ids] of Object.entries(imageCounts)) {
    if (ids.length > 1) {
        duplicateImageCount += ids.length;
        // Only report first 5 to avoid spam
        if (duplicateImageCount <= 30) {
            for (const id of ids) {
                const p = PRODUCTS.find(x => x.id === id);
                addIssue('7_IMAGE_DOUBLON', p, `Image identique partagée avec ${ids.length - 1} autre(s) produit(s) (IDs: ${ids.join(', ')})`);
            }
        }
    }
}

// ============================================================================
// 8. CATÉGORIE / SOUS-CATÉGORIE INCOHÉRENTES
// ============================================================================
const validSubcategories = {
    visage: ['serum', 'creme', 'masque', 'demaquillant', 'contour-yeux', 'soin', 'nettoyant', 'exfoliant', 'tonique', 'solaire', 'anti-age', 'hydratant'],
    soin: ['serum', 'creme', 'masque', 'huile', 'lotion', 'exfoliant', 'hydratant', 'anti-age', 'eclaircissant', 'reparateur'],
    cheveux: ['shampoing', 'apres-shampoing', 'masque', 'huile', 'serum', 'soin', 'traitement', 'styling', 'coloration'],
    corps: ['creme', 'huile', 'lotion', 'exfoliant', 'beurre', 'gel', 'amincissant', 'soin'],
    maquillage: ['teint', 'levres', 'yeux', 'ongles', 'accessoire'],
    outils: ['massage', 'nettoyage', 'led', 'appareil', 'accessoire', 'brosse', 'roller'],
    nettoyage: ['demaquillant', 'nettoyant', 'tonique', 'exfoliant', 'micellaire'],
};

const allCategories = new Set();
const allSubcategories = new Set();

for (const p of PRODUCTS) {
    allCategories.add(p.category);
    if (p.subcategory) allSubcategories.add(p.subcategory);

    // Check if subcategory exists when it should
    if (p.id > 15 && !p.subcategory) {
        addIssue('8_SOUSCATEGORIE_MANQUANTE', p, `Pas de sous-catégorie définie (catégorie: ${p.category})`);
    }

    // Check description vs category coherence
    if (p.category === 'outils' && p.description && /sérum|crème hydratante|peau douce|anti-rides|concentré d'actifs/i.test(p.description) && !/outil|appareil|massage|brosse|roller/i.test(p.description)) {
        addIssue('8_DESCRIPTION_CATEGORIE_MISMATCH', p, `Description parle de soins mais catégorie = "outils"`);
    }
}

// ============================================================================
// 9. NOMS PARTIELLEMENT EN ANGLAIS (au moins 1 mot anglais détectable)
// ============================================================================
let partialEnglishCount = 0;
const partialEnglishExamples = [];

for (const p of PRODUCTS) {
    const eng = countEnglishWords(p.name);
    if (eng.count >= 1) {
        partialEnglishCount++;
        if (partialEnglishExamples.length < 30) {
            partialEnglishExamples.push({ id: p.id, name: p.name, words: eng.found, count: eng.count });
        }
    }
}

// ============================================================================
// 10. RATINGS HORS PLAGE 3.5-5.0
// ============================================================================
for (const p of PRODUCTS) {
    if (typeof p.rating !== 'number') {
        addIssue('10_RATING_INVALIDE', p, `Rating non numérique: ${p.rating}`);
    } else if (p.rating < 3.5) {
        addIssue('10_RATING_TROP_BAS', p, `Rating = ${p.rating} (< 3.5)`);
    } else if (p.rating > 5.0) {
        addIssue('10_RATING_TROP_HAUT', p, `Rating = ${p.rating} (> 5.0)`);
    }
}

// ============================================================================
// BONUS CHECKS
// ============================================================================

// B1: Duplicate IDs
const idCounts = {};
for (const p of PRODUCTS) {
    if (!idCounts[p.id]) idCounts[p.id] = 0;
    idCounts[p.id]++;
}
const duplicateIds = Object.entries(idCounts).filter(([_, c]) => c > 1);
if (duplicateIds.length > 0) {
    console.log('!! IDs EN DOUBLON :', duplicateIds.map(([id, c]) => `ID ${id} (${c}x)`).join(', '));
}

// B2: Duplicate descriptions (template-generated products often share descriptions)
const descCounts = {};
for (const p of PRODUCTS) {
    if (!p.description) continue;
    const key = p.description.trim().substring(0, 100);
    if (!descCounts[key]) descCounts[key] = [];
    descCounts[key].push(p.id);
}
const duplicateDescs = Object.entries(descCounts).filter(([_, ids]) => ids.length > 5);

// B3: Check for products with identical features arrays
const featureCounts = {};
for (const p of PRODUCTS) {
    if (!p.features || !Array.isArray(p.features)) continue;
    const key = JSON.stringify(p.features);
    if (!featureCounts[key]) featureCounts[key] = [];
    featureCounts[key].push(p.id);
}
const duplicateFeatures = Object.entries(featureCounts).filter(([_, ids]) => ids.length > 5);

// ============================================================================
// REPORT
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('  RÉSULTATS DE L\'AUDIT');
console.log('='.repeat(80));

// --- Issue categories summary ---
const categoryOrder = [
    '1_MARQUES_PARASITES', '1_NOMS_ANGLAIS',
    '2_NOM_CATEGORIE_MISMATCH', '2_PRODUIT_NON_BEAUTE',
    '3_NOM_TROP_COURT', '3_NOM_COURT_WARNING', '3_NOM_GENERIQUE',
    '4_NOM_DOUBLON',
    '5_CHAMP_MANQUANT_CRITIQUE', '5_CHAMP_VIDE_CRITIQUE', '5_CHAMP_MANQUANT_SECONDAIRE', '5_CHAMP_VIDE_SECONDAIRE', '5_FEATURE_VIDE',
    '6_PRIX_INVALIDE', '6_PRIX_ZERO_NEGATIF', '6_PRIX_TRES_BAS', '6_PRIX_TRES_ELEVE',
    '7_IMAGE_MANQUANTE', '7_IMAGE_PAS_HTTPS', '7_IMAGE_DOMAINE_INCONNU', '7_IMAGE_PLACEHOLDER', '7_IMAGE_EXTENSION_DOUTEUSE', '7_IMAGE_DOUBLON',
    '8_SOUSCATEGORIE_MANQUANTE', '8_DESCRIPTION_CATEGORIE_MISMATCH',
    '10_RATING_INVALIDE', '10_RATING_TROP_BAS', '10_RATING_TROP_HAUT',
];

const sectionTitles = {
    '1': '1. NOMS EN ANGLAIS OU MARQUES PARASITES',
    '2': '2. NOM / CATÉGORIE INCOHÉRENTS',
    '3': '3. NOMS TROP COURTS OU GÉNÉRIQUES',
    '4': '4. NOMS EN DOUBLON',
    '5': '5. CHAMPS MANQUANTS OU VIDES',
    '6': '6. DISTRIBUTION DES PRIX',
    '7': '7. IMAGES (URLs invalides ou en doublon)',
    '8': '8. CATÉGORIE / SOUS-CATÉGORIE INCOHÉRENTES',
    '10': '10. RATINGS HORS PLAGE 3.5-5.0',
};

let currentSection = '';
let totalIssues = 0;

for (const cat of categoryOrder) {
    const section = cat.split('_')[0];
    if (section !== currentSection) {
        currentSection = section;
        console.log('\n' + '-'.repeat(80));
        console.log(`  ${sectionTitles[section] || section}`);
        console.log('-'.repeat(80));
    }

    if (!issues[cat] || issues[cat].length === 0) continue;

    const list = issues[cat];
    totalIssues += list.length;
    const label = cat.split('_').slice(1).join('_');
    console.log(`\n  [${label}] : ${list.length} produit(s)`);

    // Show up to 10 examples
    const maxExamples = 10;
    for (let i = 0; i < Math.min(list.length, maxExamples); i++) {
        console.log(`    ID ${list[i].id} — ${list[i].detail}`);
    }
    if (list.length > maxExamples) {
        console.log(`    ... et ${list.length - maxExamples} autres`);
    }
}

// --- Section 6: Price distribution ---
console.log('\n' + '-'.repeat(80));
console.log('  6. DISTRIBUTION DES PRIX (statistiques)');
console.log('-'.repeat(80));
console.log(`  Min     : ${priceStats.min}€`);
console.log(`  Max     : ${priceStats.max}€`);
console.log(`  Médiane : ${priceStats.median}€`);
console.log(`  Moyenne : ${priceStats.mean}€`);
console.log(`  < 5€    : ${priceStats.under5} produits`);
console.log(`  5-10€   : ${priceStats.range5to10} produits`);
console.log(`  10-20€  : ${priceStats.range10to20} produits`);
console.log(`  20-50€  : ${priceStats.range20to50} produits`);
console.log(`  > 50€   : ${priceStats.over50} produits`);

// --- Section 9: Partial English ---
console.log('\n' + '-'.repeat(80));
console.log('  9. NOMS PARTIELLEMENT EN ANGLAIS');
console.log('-'.repeat(80));
console.log(`\n  Total : ${partialEnglishCount} produits sur ${PRODUCTS.length} (${(partialEnglishCount/PRODUCTS.length*100).toFixed(1)}%)`);
console.log(`\n  Exemples (max 30) :`);
for (const ex of partialEnglishExamples) {
    console.log(`    ID ${ex.id} — "${ex.name}" → [${ex.words.join(', ')}] (${ex.count} mot(s))`);
}

// --- Bonus: Duplicate descriptions ---
console.log('\n' + '-'.repeat(80));
console.log('  BONUS: DESCRIPTIONS DUPLIQUÉES (template-like)');
console.log('-'.repeat(80));
if (duplicateDescs.length > 0) {
    for (const [desc, ids] of duplicateDescs) {
        console.log(`\n  ${ids.length} produits partagent : "${desc}..."`);
        console.log(`    IDs (premiers 10) : ${ids.slice(0, 10).join(', ')}${ids.length > 10 ? ` ... (+${ids.length - 10} autres)` : ''}`);
    }
} else {
    console.log('  Aucune description dupliquée >5 fois.');
}

// --- Bonus: Duplicate features ---
console.log('\n' + '-'.repeat(80));
console.log('  BONUS: FEATURES DUPLIQUÉES (identiques entre produits)');
console.log('-'.repeat(80));
if (duplicateFeatures.length > 0) {
    for (const [feat, ids] of duplicateFeatures) {
        const features = JSON.parse(feat);
        console.log(`\n  ${ids.length} produits partagent les mêmes features :`);
        console.log(`    → "${features[0]}" + ${features.length - 1} autres`);
        console.log(`    IDs (premiers 10) : ${ids.slice(0, 10).join(', ')}${ids.length > 10 ? ` ... (+${ids.length - 10} autres)` : ''}`);
    }
} else {
    console.log('  Aucune duplication massive de features.');
}

// --- Bonus: Duplicate images count ---
console.log('\n' + '-'.repeat(80));
console.log('  BONUS: IMAGES DUPLIQUÉES');
console.log('-'.repeat(80));
const totalDupImgGroups = Object.values(imageCounts).filter(ids => ids.length > 1).length;
const totalDupImgProducts = Object.values(imageCounts).filter(ids => ids.length > 1).reduce((sum, ids) => sum + ids.length, 0);
console.log(`  ${totalDupImgGroups} URLs d'image partagées par ${totalDupImgProducts} produits au total`);

// --- Categories / Subcategories summary ---
console.log('\n' + '-'.repeat(80));
console.log('  RÉSUMÉ DES CATÉGORIES');
console.log('-'.repeat(80));
const catSummary = {};
for (const p of PRODUCTS) {
    if (!catSummary[p.category]) catSummary[p.category] = { count: 0, subcats: {} };
    catSummary[p.category].count++;
    if (p.subcategory) {
        if (!catSummary[p.category].subcats[p.subcategory]) catSummary[p.category].subcats[p.subcategory] = 0;
        catSummary[p.category].subcats[p.subcategory]++;
    }
}
for (const [cat, data] of Object.entries(catSummary).sort((a, b) => b[1].count - a[1].count)) {
    console.log(`\n  ${cat} : ${data.count} produits`);
    for (const [sub, count] of Object.entries(data.subcats).sort((a, b) => b[1] - a[1])) {
        console.log(`    └─ ${sub} : ${count}`);
    }
}

// --- Final summary ---
console.log('\n' + '='.repeat(80));
console.log('  RÉSUMÉ FINAL');
console.log('='.repeat(80));
console.log(`  Produits analysés : ${PRODUCTS.length}`);
console.log(`  Total anomalies   : ${totalIssues}`);
console.log(`  Noms anglais (partiels) : ${partialEnglishCount} (${(partialEnglishCount/PRODUCTS.length*100).toFixed(1)}%)`);

// Count unique products with at least 1 issue
const productsWithIssues = new Set();
for (const list of Object.values(issues)) {
    for (const item of list) {
        productsWithIssues.add(item.id);
    }
}
console.log(`  Produits avec ≥1 problème : ${productsWithIssues.size} (${(productsWithIssues.size/PRODUCTS.length*100).toFixed(1)}%)`);
console.log(`  Produits sans problème    : ${PRODUCTS.length - productsWithIssues.size}`);

const criticalCount = (issues['1_MARQUES_PARASITES']?.length || 0)
    + (issues['1_NOMS_ANGLAIS']?.length || 0)
    + (issues['2_PRODUIT_NON_BEAUTE']?.length || 0)
    + (issues['5_CHAMP_MANQUANT_CRITIQUE']?.length || 0)
    + (issues['5_CHAMP_VIDE_CRITIQUE']?.length || 0)
    + (issues['7_IMAGE_MANQUANTE']?.length || 0)
    + (issues['10_RATING_TROP_BAS']?.length || 0);

console.log(`\n  PROBLÈMES CRITIQUES (à corriger en priorité) : ${criticalCount}`);
console.log('='.repeat(80));
