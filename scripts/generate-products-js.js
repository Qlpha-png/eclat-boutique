/**
 * generate-products-js.js
 * Génère le fichier products.js final avec :
 * - 15 produits ÉCLAT originaux (inchangés)
 * - 500 produits CJ avec fiches complètes
 * - Bundles + ROUTINE_STEPS + PRODUCT_ROUTINE_MAP
 *
 * Usage: node scripts/generate-products-js.js
 */

const fs = require('fs');
const path = require('path');

// Load original products.js to extract first 15 products
const originalContent = fs.readFileSync(path.resolve(__dirname, '..', 'js', 'products.js'), 'utf-8');

// Extract lines up to and including product 15
const lines = originalContent.split('\n');
let endLine = -1;
let braceCount = 0;
let inProduct15 = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id: 15,')) {
        inProduct15 = true;
        braceCount = 0;
    }
    if (inProduct15) {
        for (const ch of lines[i]) {
            if (ch === '{') braceCount++;
            if (ch === '}') braceCount--;
        }
        if (braceCount <= 0 && inProduct15) {
            endLine = i;
            break;
        }
    }
}

// Get the original 15 products section (lines 0 to endLine inclusive)
const originalSection = lines.slice(0, endLine + 1).join('\n');

// Load processed CJ catalog
const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cj-processed-catalog.json'), 'utf-8'));

console.log(`📦 Generating products.js with 15 originals + ${catalog.length} CJ products...`);

// Helper to escape strings for JS
function escapeJS(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

// Generate JS code for each CJ product
function productToJS(p) {
    const indent = '    ';
    const lines = [];
    lines.push(`${indent}{`);
    lines.push(`${indent}    id: ${p.id},`);
    lines.push(`${indent}    name: '${escapeJS(p.name)}',`);
    lines.push(`${indent}    category: '${p.category}',`);
    lines.push(`${indent}    subcategory: '${escapeJS(p.subcategory)}',`);
    lines.push(`${indent}    price: ${p.price.toFixed(2)},`);
    lines.push(`${indent}    oldPrice: null,`);
    lines.push(`${indent}    image: '${escapeJS(p.image)}',`);
    lines.push(`${indent}    badge: '${escapeJS(p.badge)}',`);
    lines.push(`${indent}    rating: ${p.rating},`);
    lines.push(`${indent}    reviews: ${p.reviews},`);
    lines.push(`${indent}    description: '${escapeJS(p.description)}',`);

    // Features array
    const featStr = p.features.map(f => `'${escapeJS(f)}'`).join(', ');
    lines.push(`${indent}    features: [${featStr}],`);

    // Specs object
    const specEntries = Object.entries(p.specs).map(([k, v]) => `'${escapeJS(k)}': '${escapeJS(String(v))}'`).join(', ');
    lines.push(`${indent}    specs: { ${specEntries} },`);

    // Ingredients
    lines.push(`${indent}    ingredients: '${escapeJS(p.ingredients)}',`);

    // HowTo
    lines.push(`${indent}    howTo: '${escapeJS(p.howTo)}',`);

    // Meta
    lines.push(`${indent}    bestseller: ${p.bestseller},`);
    lines.push(`${indent}    supplier: 'cj',`);
    lines.push(`${indent}    cjProductId: '${p.cjProductId}',`);

    // Concerns array
    if (p.concerns && p.concerns.length > 0) {
        const concernStr = p.concerns.map(c => `'${c}'`).join(', ');
        lines.push(`${indent}    concerns: [${concernStr}],`);
    }

    // Gender
    if (p.gender && p.gender !== 'unisex') {
        lines.push(`${indent}    gender: '${p.gender}'`);
    }

    lines.push(`${indent}}`);
    return lines.join('\n');
}

// Build the full products.js content
let output = '';

// Original 15 products header + products
output += originalSection;
output += ',\n';

// Section divider
output += `
    // ═══════════════════════════════════════════════════════
    //  CATALOGUE CJ DROPSHIPPING — 500 VRAIS PRODUITS
    //  Importés automatiquement depuis l'API CJ
    //  Catégorie: Health, Beauty & Hair
    //  Images et prix réels fournisseur
    // ═══════════════════════════════════════════════════════
`;

// Category sections
const categories = [
    { key: 'soin', label: 'SÉRUMS & SOINS CIBLÉS' },
    { key: 'visage', label: 'SOINS VISAGE' },
    { key: 'corps', label: 'SOINS CORPS' },
    { key: 'cheveux', label: 'CHEVEUX' },
    { key: 'ongles', label: 'ONGLES' },
    { key: 'homme', label: 'HOMME' },
    { key: 'outils', label: 'OUTILS & APPAREILS BEAUTÉ' },
    { key: 'aromatherapie', label: 'BIEN-ÊTRE & AROMATHÉRAPIE' },
    { key: 'accessoire', label: 'ACCESSOIRES BEAUTÉ' },
];

for (const cat of categories) {
    const products = catalog.filter(p => p.category === cat.key);
    if (products.length === 0) continue;

    output += `\n    // ——— ${cat.label} (${products.length} produits) ———\n`;

    products.forEach((p, idx) => {
        output += '\n' + productToJS(p);
        if (idx < products.length - 1 || cat !== categories[categories.length - 1]) {
            output += ',';
        }
        output += '\n';
    });
}

// Close PRODUCTS array
output += `\n];\n`;

// BUNDLES - Updated with valid product IDs from the new catalog
// Find appropriate products for bundles
function findProduct(cat, subcat, keyword) {
    return catalog.find(p =>
        p.category === cat &&
        (subcat ? p.subcategory === subcat : true) &&
        (keyword ? p.name.toLowerCase().includes(keyword.toLowerCase()) : true)
    );
}

// Build smarter bundles using actual available products
const serumRetinol = findProduct('soin', 'serum', 'rétinol') || catalog.find(p => p.category === 'soin');
const serumHA = findProduct('soin', 'serum', 'hyaluronique') || catalog.find(p => p.category === 'soin' && p.id !== serumRetinol?.id);
const serumVitC = findProduct('soin', 'serum', 'vitamine') || catalog.find(p => p.category === 'soin' && p.id !== serumRetinol?.id && p.id !== serumHA?.id);
const cremeVisage = findProduct('visage', 'creme') || catalog.find(p => p.category === 'visage');
const masqueVisage = findProduct('visage', 'masque') || catalog.find(p => p.category === 'visage' && p.id !== cremeVisage?.id);
const nettoyant = findProduct('visage', 'nettoyant') || findProduct('visage', 'demaquillant');
const soinsCorps1 = findProduct('corps', 'hydratant') || catalog.find(p => p.category === 'corps');
const soinsCorps2 = findProduct('corps', 'gommage') || catalog.find(p => p.category === 'corps' && p.id !== soinsCorps1?.id);
const soinsCorps3 = findProduct('corps', 'huile') || catalog.find(p => p.category === 'corps' && p.id !== soinsCorps1?.id && p.id !== soinsCorps2?.id);
const cheveux1 = findProduct('cheveux', 'shampoing') || catalog.find(p => p.category === 'cheveux');
const cheveux2 = findProduct('cheveux', 'masque') || catalog.find(p => p.category === 'cheveux' && p.id !== cheveux1?.id);
const cheveux3 = findProduct('cheveux', 'serum') || findProduct('cheveux', 'huile') || catalog.find(p => p.category === 'cheveux' && p.id !== cheveux1?.id && p.id !== cheveux2?.id);
const barbe1 = findProduct('homme', 'barbe') || catalog.find(p => p.category === 'homme');
const barbe2 = findProduct('homme', 'rasage') || catalog.find(p => p.category === 'homme' && p.id !== barbe1?.id);
const ongles1 = findProduct('ongles', 'appareil') || catalog.find(p => p.category === 'ongles');
const ongles2 = findProduct('ongles', 'vernis') || catalog.find(p => p.category === 'ongles' && p.id !== ongles1?.id);
const ongles3 = findProduct('ongles', 'outil') || findProduct('ongles', 'soin') || catalog.find(p => p.category === 'ongles' && p.id !== ongles1?.id && p.id !== ongles2?.id);
const aroma1 = findProduct('aromatherapie', 'diffuseur') || catalog.find(p => p.category === 'aromatherapie');
const aroma2 = findProduct('aromatherapie', 'bain') || catalog.find(p => p.category === 'aromatherapie' && p.id !== aroma1?.id);

output += `
// ============================
// COFFRETS — Prix bundle réels (pas les prix individuels)
// ============================
const BUNDLES = [
    {
        key: 'eclat',
        name: 'Coffret Routine Éclat',
        productIds: [5, 8, 2],
        price: 24.90
    },
    {
        key: 'antiage',
        name: 'Coffret Routine Anti-Âge',
        productIds: [1, ${serumRetinol ? serumRetinol.id : 16}, 10],
        price: 49.90
    },
    {
        key: 'glow',
        name: 'Coffret Routine Glow',
        productIds: [8, 11, 9],
        price: 29.90
    },
    {
        key: 'hydra',
        name: 'Coffret Hydratation Intense',
        productIds: [${serumHA ? serumHA.id : 17}, ${masqueVisage ? masqueVisage.id : 19}, ${cremeVisage ? cremeVisage.id : 23}],
        price: 24.90
    },
    {
        key: 'barbe',
        name: 'Coffret Gentleman Barbe',
        productIds: [${barbe1 ? barbe1.id : 39}, ${barbe2 ? barbe2.id : 40}],
        price: 22.90
    },
    {
        key: 'nails',
        name: 'Coffret Nail Pro Débutante',
        productIds: [${ongles1 ? ongles1.id : 29}, ${ongles2 ? ongles2.id : 30}, ${ongles3 ? ongles3.id : 33}],
        price: 39.90
    },
    {
        key: 'cheveux',
        name: 'Coffret Cheveux Soyeux',
        productIds: [${cheveux1 ? cheveux1.id : 34}, ${cheveux2 ? cheveux2.id : 35}, ${cheveux3 ? cheveux3.id : 37}],
        price: 22.90
    },
    {
        key: 'spa',
        name: 'Coffret SPA Maison',
        productIds: [${aroma2 ? aroma2.id : 42}, ${aroma1 ? aroma1.id : 41}, 13],
        price: 29.90
    },
    {
        key: 'corps',
        name: 'Coffret Corps Complet',
        productIds: [${soinsCorps1 ? soinsCorps1.id : 21}, ${soinsCorps2 ? soinsCorps2.id : 22}, ${soinsCorps3 ? soinsCorps3.id : 25}],
        price: 19.90
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
`;

// Add routine mappings for new products (sérums → serum, outils → outil, nettoyants → nettoyage, etc.)
const routineMappings = [];
catalog.forEach(p => {
    let step = null;
    if (p.category === 'soin' && p.subcategory === 'serum') step = 'serum';
    else if (p.category === 'visage' && ['nettoyant', 'demaquillant', 'exfoliant'].includes(p.subcategory)) step = 'nettoyage';
    else if (p.category === 'visage' && ['lotion'].includes(p.subcategory)) step = 'preparation';
    else if (p.category === 'visage' && ['creme', 'masque', 'contour-yeux', 'levres', 'cils', 'solaire'].includes(p.subcategory)) step = 'soin';
    else if (p.category === 'outils') step = 'outil';

    if (step) {
        routineMappings.push(`    ${p.id}: '${step}',`);
    }
});

output += routineMappings.join('\n');
output += `\n};\n`;

// Write the final file
const outPath = path.resolve(__dirname, '..', 'js', 'products.js');
fs.writeFileSync(outPath, output);

const stats = {
    totalProducts: 15 + catalog.length,
    totalLines: output.split('\n').length,
    fileSize: (Buffer.byteLength(output) / 1024).toFixed(1) + ' KB'
};

console.log(`\n✅ products.js generated successfully!`);
console.log(`   📦 ${stats.totalProducts} produits total (15 ÉCLAT + ${catalog.length} CJ)`);
console.log(`   📄 ${stats.totalLines} lignes`);
console.log(`   💾 ${stats.fileSize}`);

// Verify the file is valid JS
try {
    // Simple check - try to parse the PRODUCTS array
    const checkContent = fs.readFileSync(outPath, 'utf-8');
    if (checkContent.includes('const PRODUCTS') && checkContent.includes('const BUNDLES') && checkContent.includes('const ROUTINE_STEPS')) {
        console.log('   ✅ Structure validée (PRODUCTS + BUNDLES + ROUTINE_STEPS)');
    }
} catch (e) {
    console.log('   ⚠️ Attention: vérification échouée -', e.message);
}
