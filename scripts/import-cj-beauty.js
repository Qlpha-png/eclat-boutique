/**
 * import-cj-beauty.js
 * Import 500+ VRAIS produits beauté depuis CJ Dropshipping
 * Utilise le filtre catégorie "Health, Beauty & Hair" pour ne récupérer
 * que des produits pertinents avec leurs vraies images.
 *
 * Usage: node scripts/import-cj-beauty.js
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

// Load .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '..', '.env.local');
        const contents = fs.readFileSync(envPath, 'utf-8');
        for (const line of contents.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.slice(0, eqIndex).trim();
            let value = trimmed.slice(eqIndex + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
                value = value.slice(1, -1);
            if (!process.env[key]) process.env[key] = value;
        }
    } catch { }
}
loadEnv();

const CJ_EMAIL = process.env.CJ_EMAIL;
const CJ_API_KEY = process.env.CJ_API_KEY;
if (!CJ_EMAIL || !CJ_API_KEY) { console.error('Missing CJ_EMAIL or CJ_API_KEY'); process.exit(1); }

function fetchJSON(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOpts = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
        };
        const req = https.request(reqOpts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { reject(new Error('Invalid JSON')); }
            });
        });
        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

async function getAccessToken() {
    const res = await fetchJSON('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
        method: 'POST',
        body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY })
    });
    if (!res.data?.accessToken) { console.error('Auth failed:', res.message); process.exit(1); }
    console.log('✅ CJ Auth OK');
    return res.data.accessToken;
}

// Search CJ with category filter for beauty products
async function searchBeauty(token, query, page = 1) {
    // categoryId for "Health, Beauty & Hair" from CJ website
    const categoryId = '2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902';
    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?productNameEn=${encodeURIComponent(query)}&categoryId=${categoryId}&pageNum=${page}&pageSize=20`;
    const res = await fetchJSON(url, { headers: { 'CJ-Access-Token': token } });
    if (!res.data?.list) return [];
    return res.data.list;
}

// List beauty products by browsing the category
async function listBeautyCategory(token, page = 1) {
    const categoryId = '2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902';
    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?categoryId=${categoryId}&pageNum=${page}&pageSize=20`;
    const res = await fetchJSON(url, { headers: { 'CJ-Access-Token': token } });
    return { list: res.data?.list || [], total: res.data?.total || 0 };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Beauty-related search terms organized by our store categories
const BEAUTY_SEARCHES = [
    // Skincare - Serums
    'retinol serum', 'hyaluronic acid serum', 'vitamin c serum', 'niacinamide serum',
    'anti aging serum', 'collagen serum', 'peptide serum', 'brightening serum',
    'moisturizing serum', 'face serum',
    // Skincare - Creams
    'face cream', 'moisturizing cream', 'anti wrinkle cream', 'night cream',
    'day cream', 'face moisturizer', 'eye cream', 'neck cream',
    // Skincare - Masks
    'face mask', 'sheet mask', 'clay mask', 'sleeping mask',
    'peel off mask', 'collagen mask', 'hydrating mask',
    // Skincare - Cleansing
    'face cleanser', 'face wash', 'makeup remover', 'micellar water',
    'cleansing oil', 'exfoliating gel', 'toner', 'facial toner',
    // Body care
    'body lotion', 'body cream', 'body scrub', 'body oil',
    'hand cream', 'foot cream', 'stretch mark', 'cellulite cream',
    'body butter', 'shower gel',
    // Hair care
    'hair mask', 'hair serum', 'hair oil', 'shampoo',
    'conditioner', 'hair treatment', 'keratin treatment', 'hair growth',
    'scalp treatment', 'leave in conditioner',
    // Hair tools & accessories
    'hair brush', 'hair comb', 'hair clip', 'scrunchie',
    'hair towel', 'satin bonnet', 'hair band', 'hair roller',
    // Nails
    'nail lamp', 'gel polish', 'nail polish', 'nail tips',
    'nail art', 'nail file', 'nail sticker', 'nail glue',
    'cuticle oil', 'nail drill',
    // Lip care
    'lip balm', 'lip oil', 'lip mask', 'lip scrub', 'lip gloss',
    // Eye care
    'eye patch', 'eye mask', 'under eye', 'eyelash serum',
    // Men grooming
    'beard oil', 'beard kit', 'mens face wash', 'aftershave',
    'mens skincare', 'shaving',
    // Tools & devices
    'face roller', 'gua sha', 'face massager', 'blackhead remover',
    'pore vacuum', 'face steamer', 'derma roller', 'ice roller',
    'led mask', 'face brush',
    // Wellness & aromatherapy
    'essential oil', 'diffuser', 'bath bomb', 'aromatherapy',
    'massage oil', 'candle',
    // Accessories
    'makeup brush', 'makeup sponge', 'konjac sponge', 'cotton pad',
    'makeup mirror', 'makeup bag', 'beauty blender',
    // Suncare
    'sunscreen', 'sun protection', 'after sun',
];

async function main() {
    console.log('🔑 Authenticating with CJ...');
    const token = await getAccessToken();

    const allProducts = new Map(); // pid -> product data (deduplicate)

    console.log(`\n📦 Searching ${BEAUTY_SEARCHES.length} beauty terms with category filter...\n`);

    for (let i = 0; i < BEAUTY_SEARCHES.length; i++) {
        const query = BEAUTY_SEARCHES[i];
        console.log(`[${i + 1}/${BEAUTY_SEARCHES.length}] 🔍 "${query}"`);

        try {
            const products = await searchBeauty(token, query);
            let added = 0;
            for (const p of products) {
                if (!allProducts.has(p.pid) && p.productImage) {
                    allProducts.set(p.pid, {
                        pid: p.pid,
                        sku: p.productSku || '',
                        name: p.productNameEn || p.productName || '',
                        nameCn: p.productName || '',
                        image: p.productImage,
                        images: (p.productImageSet || []).slice(0, 5),
                        price: parseFloat(p.sellPrice) || 0,
                        weight: p.productWeight || 0,
                        category: p.categoryName || '',
                        description: p.description || '',
                        variants: (p.variants || []).map(v => ({
                            vid: v.vid,
                            name: v.variantNameEn || v.variantName || '',
                            image: v.variantImage || '',
                            price: parseFloat(v.variantSellPrice) || 0
                        })),
                        searchTerm: query
                    });
                    added++;
                }
            }
            console.log(`   → ${products.length} results, ${added} new (total: ${allProducts.size})`);
        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
        }

        await sleep(1100); // Rate limit: 1 req/s

        // If we have enough, we can stop early
        if (allProducts.size >= 600) {
            console.log(`\n🎯 Reached ${allProducts.size} products, sufficient for 500+ catalog!`);
            break;
        }
    }

    // Convert to array and sort by relevance (products listed by more people first)
    const productList = Array.from(allProducts.values());

    // Save results
    const outPath = path.resolve(__dirname, 'cj-beauty-catalog.json');
    fs.writeFileSync(outPath, JSON.stringify(productList, null, 2));

    console.log(`\n📁 Saved ${productList.length} products to ${outPath}`);
    console.log(`📊 Price range: $${Math.min(...productList.map(p => p.price)).toFixed(2)} - $${Math.max(...productList.map(p => p.price)).toFixed(2)}`);
    console.log(`📷 Products with images: ${productList.filter(p => p.image).length}`);

    // Category breakdown
    const cats = {};
    productList.forEach(p => {
        const cat = p.searchTerm.split(' ')[0] || 'other';
        cats[cat] = (cats[cat] || 0) + 1;
    });
    console.log('\n📂 Breakdown by search term:');
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
    });
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
