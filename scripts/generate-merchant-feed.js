// ============================
// Google Merchant Center — Product Feed Generator
// Generates merchant-feed.xml from js/products.js
// Run: node scripts/generate-merchant-feed.js
// Auto-run on Vercel build via npm run build
// ============================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://maison-eclat.shop';
const BRAND = 'Maison Éclat';
const CURRENCY = 'EUR';
const COUNTRY = 'FR';

// Google product category mapping
const GOOGLE_CATEGORIES = {
    visage: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Care',
    soin: 'Health & Beauty > Personal Care > Cosmetics > Skin Care',
    corps: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Body Care',
    cheveux: 'Health & Beauty > Personal Care > Hair Care',
    ongles: 'Health & Beauty > Personal Care > Cosmetics > Nail Care',
    homme: 'Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Care',
    aromatherapie: 'Health & Beauty > Personal Care > Aromatherapy',
    accessoire: 'Health & Beauty > Personal Care > Cosmetics > Makeup Tools & Accessories',
    outils: 'Health & Beauty > Personal Care > Cosmetics > Makeup Tools & Accessories'
};

// Category labels FR
const CATEGORY_FR = {
    visage: 'Soins Visage',
    soin: 'Sérums & Soins',
    corps: 'Soins Corps',
    cheveux: 'Cheveux',
    ongles: 'Ongles',
    homme: 'Homme',
    aromatherapie: 'Bien-être',
    accessoire: 'Accessoires',
    outils: 'Outils Beauté'
};

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateDescription(product) {
    var cat = CATEGORY_FR[product.category] || product.category;
    var desc = product.name + ' — ' + cat + ' par ' + BRAND + '.';
    if (product.concerns && product.concerns.length > 0) {
        var concerns = product.concerns.map(function(c) {
            var map = { hydratation: 'hydratation', eclat: 'éclat', 'anti-age': 'anti-âge', rides: 'anti-rides', fermete: 'fermeté', acne: 'anti-acné', pores: 'pores', sensible: 'peau sensible' };
            return map[c] || c;
        });
        desc += ' Idéal pour : ' + concerns.join(', ') + '.';
    }
    desc += ' Livraison France offerte dès 29€. Satisfait ou remboursé 14 jours.';
    return desc;
}

function getProductUrl(product) {
    // Products 1-15 use prod_xxx format, 146+ use numeric ID
    return SITE_URL + '/pages/product.html?id=' + product.id;
}

function getImageUrl(product) {
    // Use our image proxy for optimized WebP
    return SITE_URL + '/api/img?url=' + encodeURIComponent(product.image) + '&w=800&q=80';
}

// Products excluded from Google Shopping feed (policy violations)
var EXCLUDED_IDS = [
    127,                                          // Huile Démaquillante N°2 — flagged "intérêts sexuels"
    184, 199, 200, 201, 203, 204, 205, 206,      // Soin Anti-Vergetures — flagged "bouleversements personnels"
    207, 208, 209, 210, 211                       // Soin Anti-Vergetures (suite)
];

function generateFeed(products) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
    xml += '<channel>\n';
    xml += '  <title>' + escapeXml(BRAND + ' — Boutique Beauté') + '</title>\n';
    xml += '  <link>' + SITE_URL + '</link>\n';
    xml += '  <description>Boutique beauté clean France. Soins visage, cheveux, corps. Livraison offerte dès 29€.</description>\n';

    var excluded = 0;
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (!p.name || !p.price || !p.image) continue;
        if (EXCLUDED_IDS.indexOf(p.id) !== -1) { excluded++; continue; }

        var googleCat = GOOGLE_CATEGORIES[p.category] || GOOGLE_CATEGORIES.accessoire;

        xml += '  <item>\n';
        xml += '    <g:id>ECLAT-' + p.id + '</g:id>\n';
        xml += '    <g:title>' + escapeXml(p.name) + '</g:title>\n';
        xml += '    <g:description>' + escapeXml(generateDescription(p)) + '</g:description>\n';
        xml += '    <g:link>' + escapeXml(getProductUrl(p)) + '</g:link>\n';
        xml += '    <g:image_link>' + escapeXml(p.image) + '</g:image_link>\n';
        xml += '    <g:price>' + p.price.toFixed(2) + ' ' + CURRENCY + '</g:price>\n';

        if (p.oldPrice && p.oldPrice > p.price) {
            xml += '    <g:sale_price>' + p.price.toFixed(2) + ' ' + CURRENCY + '</g:sale_price>\n';
        }

        xml += '    <g:availability>in_stock</g:availability>\n';
        xml += '    <g:condition>new</g:condition>\n';
        xml += '    <g:brand>' + escapeXml(BRAND) + '</g:brand>\n';
        xml += '    <g:mpn>ECLAT-' + p.id + '</g:mpn>\n';
        xml += '    <g:google_product_category>' + escapeXml(googleCat) + '</g:google_product_category>\n';
        xml += '    <g:product_type>' + escapeXml(CATEGORY_FR[p.category] || 'Beauté') + '</g:product_type>\n';
        xml += '    <g:shipping>\n';
        xml += '      <g:country>' + COUNTRY + '</g:country>\n';
        xml += '      <g:service>Standard</g:service>\n';
        xml += '      <g:price>0.00 ' + CURRENCY + '</g:price>\n';
        xml += '    </g:shipping>\n';

        if (p.rating && p.reviews > 0) {
            xml += '    <g:custom_label_0>' + (p.rating >= 4.5 ? 'top-rated' : 'rated') + '</g:custom_label_0>\n';
        }
        if (p.bestseller) {
            xml += '    <g:custom_label_1>bestseller</g:custom_label_1>\n';
        }
        if (p.badge) {
            xml += '    <g:custom_label_2>' + escapeXml(String(p.badge).toLowerCase()) + '</g:custom_label_2>\n';
        }

        xml += '  </item>\n';
    }

    xml += '</channel>\n';
    xml += '</rss>';
    return xml;
}

// --- Sitemap produits ---
function generateProductSitemap(products) {
    var today = new Date().toISOString().split('T')[0];
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (!p.name || !p.price) continue;
        xml += '  <url>\n';
        xml += '    <loc>' + escapeXml(getProductUrl(p)) + '</loc>\n';
        xml += '    <lastmod>' + today + '</lastmod>\n';
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
    }

    // Category pages
    var categories = ['visage', 'soin', 'corps', 'cheveux', 'ongles', 'homme', 'aromatherapie', 'accessoire', 'outils'];
    for (var j = 0; j < categories.length; j++) {
        xml += '  <url>\n';
        xml += '    <loc>' + SITE_URL + '/pages/category.html?cat=' + categories[j] + '</loc>\n';
        xml += '    <lastmod>' + today + '</lastmod>\n';
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
}

// --- Main ---
function main() {
    var src = fs.readFileSync(path.join(ROOT, 'js/products.js'), 'utf8');
    var code = src.replace(/^[\s\S]*?const PRODUCTS\s*=\s*/, 'return ').replace(/;\s*$/, '');
    var products;
    try {
        products = new Function(code)();
    } catch (e) {
        console.error('Failed to parse products.js:', e.message);
        process.exit(1);
    }

    // Google Shopping feed
    var feed = generateFeed(products);
    fs.writeFileSync(path.join(ROOT, 'merchant-feed.xml'), feed, 'utf8');
    console.log('  ✓ merchant-feed.xml: ' + (products.length - EXCLUDED_IDS.length) + '/' + products.length + ' products (' + EXCLUDED_IDS.length + ' excluded), ' + (feed.length / 1024).toFixed(1) + 'KB');

    // Product sitemap
    var sitemap = generateProductSitemap(products);
    fs.writeFileSync(path.join(ROOT, 'sitemap-products.xml'), sitemap, 'utf8');
    console.log('  ✓ sitemap-products.xml: ' + products.length + ' products + 9 categories');
}

main();
