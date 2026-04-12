/**
 * fetch-cj-images.js
 * Recherche les vrais produits CJ par catégorie + mot-clé
 * Valide la pertinence avant d'accepter un résultat
 * Usage: node scripts/fetch-cj-images.js
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
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            if (!process.env[key]) process.env[key] = value;
        }
    } catch { }
}
loadEnv();

const CJ_EMAIL = process.env.CJ_EMAIL;
const CJ_API_KEY = process.env.CJ_API_KEY;

if (!CJ_EMAIL || !CJ_API_KEY) {
    console.error('Missing CJ_EMAIL or CJ_API_KEY in .env.local');
    process.exit(1);
}

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
                catch { reject(new Error('Invalid JSON: ' + data.slice(0, 200))); }
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
    if (!res.data || !res.data.accessToken) {
        console.error('Auth failed:', JSON.stringify(res));
        process.exit(1);
    }
    console.log('✅ CJ Auth OK');
    return res.data.accessToken;
}

async function searchProducts(token, query, pageSize = 20) {
    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?productNameEn=${encodeURIComponent(query)}&pageNum=1&pageSize=${pageSize}`;
    const res = await fetchJSON(url, {
        headers: { 'CJ-Access-Token': token }
    });
    if (!res.data || !res.data.list) return [];
    return res.data.list.map(p => ({
        pid: p.pid,
        name: (p.productNameEn || p.productName || '').toLowerCase(),
        nameOriginal: p.productNameEn || p.productName || '',
        image: p.productImage || '',
        images: p.productImageSet || [],
        price: parseFloat(p.sellPrice) || 0,
        category: (p.categoryName || '').toLowerCase()
    }));
}

// Validate result relevance: at least 2 keywords must match the product name
function isRelevant(product, keywords) {
    const name = product.name + ' ' + product.category;
    let matches = 0;
    for (const kw of keywords) {
        if (name.includes(kw.toLowerCase())) matches++;
    }
    return matches >= 2;
}

// Each item: id, queries (try in order), keywords (for validation)
const SEARCH_MAP = [
    { id: 16, queries: ['retinol serum', 'retinol face serum', 'anti aging retinol'], keywords: ['retinol', 'serum', 'face', 'skin'] },
    { id: 17, queries: ['hyaluronic acid serum', 'hyaluronic serum face'], keywords: ['hyaluronic', 'serum', 'acid', 'face'] },
    { id: 18, queries: ['niacinamide serum', 'niacinamide face serum'], keywords: ['niacinamide', 'serum', 'face', 'pore'] },
    { id: 19, queries: ['bakuchiol serum', 'plant retinol serum', 'natural anti aging serum'], keywords: ['serum', 'face', 'anti', 'aging', 'plant', 'bakuchiol'] },
    { id: 20, queries: ['serum set skincare', 'face serum gift set'], keywords: ['serum', 'set', 'face', 'skin', 'care'] },
    { id: 21, queries: ['coffee body scrub', 'coffee scrub exfoliating'], keywords: ['coffee', 'scrub', 'body', 'exfoliat'] },
    { id: 22, queries: ['exfoliating glove', 'kessa glove', 'bath glove exfoliating'], keywords: ['glove', 'exfoliat', 'bath', 'kessa', 'scrub'] },
    { id: 23, queries: ['hand cream', 'hand cream shea butter', 'moisturizing hand cream'], keywords: ['hand', 'cream', 'moistur', 'shea'] },
    { id: 24, queries: ['foot cream', 'foot cream urea', 'cracked heel cream'], keywords: ['foot', 'cream', 'heel', 'repair', 'urea'] },
    { id: 25, queries: ['stretch mark oil', 'anti stretch mark oil', 'body oil pregnancy'], keywords: ['stretch', 'mark', 'oil', 'body', 'skin'] },
    { id: 26, queries: ['silicone cupping', 'anti cellulite cups', 'vacuum cupping set'], keywords: ['cupping', 'cup', 'cellulite', 'silicone', 'vacuum', 'massage'] },
    { id: 27, queries: ['eye cream', 'under eye cream caffeine', 'dark circle eye cream'], keywords: ['eye', 'cream', 'dark', 'circle', 'caffeine'] },
    { id: 28, queries: ['lip balm', 'natural lip balm', 'moisturizing lip balm'], keywords: ['lip', 'balm', 'moistur', 'chapstick'] },
    { id: 29, queries: ['nail lamp 48w', 'UV LED nail lamp', 'gel nail lamp'], keywords: ['nail', 'lamp', 'UV', 'LED', 'gel', 'curing'] },
    { id: 30, queries: ['gel nail polish set', 'nude gel polish set', 'semi permanent gel set'], keywords: ['gel', 'nail', 'polish', 'set', 'color', 'nude'] },
    { id: 31, queries: ['nail tips 500', 'fake nails almond', 'nail capsules'], keywords: ['nail', 'tip', 'fake', 'almond', 'capsule', '500'] },
    { id: 32, queries: ['nail art brush set', 'nail dotting tool', 'nail art kit'], keywords: ['nail', 'art', 'brush', 'dotting', 'tool', 'kit'] },
    { id: 33, queries: ['nail file set', 'nail file professional', 'double sided nail file'], keywords: ['nail', 'file', 'set', 'professional', 'buffer'] },
    { id: 34, queries: ['keratin hair serum', 'hair serum smooth', 'hair repair serum'], keywords: ['hair', 'serum', 'keratin', 'smooth', 'repair', 'oil'] },
    { id: 35, queries: ['keratin hair mask', 'hair mask repair', 'deep conditioning mask'], keywords: ['hair', 'mask', 'keratin', 'repair', 'condition'] },
    { id: 36, queries: ['heat protectant spray', 'thermal hair spray', 'hair heat protection'], keywords: ['heat', 'spray', 'hair', 'protect', 'thermal'] },
    { id: 37, queries: ['satin scrunchies', 'silk scrunchies set', 'hair scrunchie satin'], keywords: ['scrunchie', 'satin', 'silk', 'hair', 'elastic'] },
    { id: 38, queries: ['satin bonnet', 'sleep bonnet hair', 'silk bonnet night'], keywords: ['bonnet', 'satin', 'silk', 'sleep', 'hair', 'night', 'cap'] },
    { id: 39, queries: ['beard grooming kit', 'beard oil comb set', 'beard care kit men'], keywords: ['beard', 'kit', 'oil', 'comb', 'groom', 'men'] },
    { id: 40, queries: ['charcoal face wash men', 'mens face cleanser', 'activated charcoal cleanser'], keywords: ['charcoal', 'face', 'clean', 'wash', 'men'] },
    { id: 41, queries: ['essential oil set', 'aromatherapy oil set', 'essential oil gift'], keywords: ['essential', 'oil', 'set', 'aroma', 'gift'] },
    { id: 42, queries: ['bath bombs set', 'bath bomb gift set', 'fizzy bath bombs'], keywords: ['bath', 'bomb', 'set', 'fizzy', 'gift'] },
    { id: 43, queries: ['vitamin c sheet mask', 'face mask sheet pack', 'facial mask vitamin'], keywords: ['mask', 'sheet', 'face', 'vitamin', 'facial'] },
    { id: 44, queries: ['pimple patches', 'acne patches hydrocolloid', 'acne spot treatment'], keywords: ['pimple', 'patch', 'acne', 'spot', 'hydrocolloid'] },
    { id: 45, queries: ['blackhead remover vacuum', 'pore cleaner vacuum', 'blackhead vacuum suction'], keywords: ['blackhead', 'remover', 'vacuum', 'pore', 'suction'] },
    { id: 46, queries: ['reusable cotton pads', 'bamboo cotton rounds', 'makeup remover pads reusable'], keywords: ['reusable', 'cotton', 'pad', 'bamboo', 'makeup', 'remover'] },
    { id: 47, queries: ['konjac sponge', 'konjac facial sponge', 'natural face sponge'], keywords: ['konjac', 'sponge', 'face', 'natural', 'clean'] },
    { id: 48, queries: ['LED makeup mirror', 'vanity mirror LED light', 'magnifying mirror LED'], keywords: ['mirror', 'LED', 'makeup', 'vanity', 'magnif', 'light'] },
    { id: 49, queries: ['makeup brush set', 'makeup brushes 12', 'professional brush set'], keywords: ['makeup', 'brush', 'set', 'professional', 'powder'] },
    { id: 50, queries: ['microfiber hair towel', 'hair turban towel', 'quick dry hair towel'], keywords: ['hair', 'towel', 'turban', 'microfiber', 'dry', 'wrap'] },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    console.log('🔑 Authenticating with CJ...');
    const token = await getAccessToken();

    const results = {};
    let found = 0;
    let notFound = 0;

    for (const item of SEARCH_MAP) {
        let matched = null;

        for (const query of item.queries) {
            console.log(`\n🔍 [ID ${item.id}] Trying: "${query}"`);
            try {
                const products = await searchProducts(token, query, 20);

                // Find the first relevant result
                for (const p of products) {
                    if (isRelevant(p, item.keywords) && p.image) {
                        matched = p;
                        break;
                    }
                }

                if (matched) {
                    console.log(`   ✅ MATCH: "${matched.nameOriginal}" — $${matched.price}`);
                    console.log(`   📷 ${matched.image}`);
                    break;
                } else {
                    console.log(`   ⚠️  ${products.length} results, none relevant`);
                }
            } catch (err) {
                console.log(`   ❌ Error: ${err.message}`);
            }
            await sleep(1100); // Rate limit
        }

        if (matched) {
            results[item.id] = {
                name: matched.nameOriginal,
                image: matched.image,
                images: matched.images.slice(0, 5),
                price: matched.price,
                pid: matched.pid
            };
            found++;
        } else {
            results[item.id] = null;
            notFound++;
            console.log(`   ❌ NO MATCH for product ID ${item.id}`);
        }

        await sleep(1100);
    }

    // Write results
    const outPath = path.resolve(__dirname, 'cj-images-results.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`\n📁 Results saved to ${outPath}`);
    console.log(`\n📊 TOTAL: ${found} found / ${notFound} not found / ${SEARCH_MAP.length} total`);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
