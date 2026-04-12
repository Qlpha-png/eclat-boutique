// ============================
// ÉCLAT — Build Script: Minify CSS/JS
// Runs on Vercel deploy, minifies in-place
// ============================

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

const ROOT = path.resolve(__dirname, '..');

// Files to minify
const CSS_FILES = [
    'css/style.css',
    'css/themes.css',
    'css/animations.css',
    'css/mega-menu.css',
    'css/skeleton.css',
    'css/routine-builder.css'
];

const JS_FILES = [
    'js/app.js',
    'js/homepage.js',
    'js/i18n.js',
    'js/search.js',
    'js/cart.js',
    'js/init.js',
    'js/auth.js',
    'js/themes.js',
    'js/products.js',
    'js/push.js',
    'js/push-prompt.js',
    'js/recently-viewed.js',
    'js/social-share.js',
    'js/wishlist.js',
    'js/animations.js',
    'js/mega-menu.js',
    'js/social-proof.js',
    'js/chatbot.js',
    'js/routine-builder.js',
    'js/products-details.js',
    'js/cookie-consent.js',
    'js/bug-report.js',
    'js/loyalty-bar.js',
    'js/reward-wheel.js',
    'js/checkin.js',
    'js/preferences.js'
];

async function minifyCSS() {
    const cleancss = new CleanCSS({
        level: 2,
        compatibility: '*'
    });

    let totalSaved = 0;
    for (const file of CSS_FILES) {
        const filePath = path.join(ROOT, file);
        if (!fs.existsSync(filePath)) continue;

        const original = fs.readFileSync(filePath, 'utf8');
        const result = cleancss.minify(original);
        if (result.errors && result.errors.length) {
            console.error(`  ✗ ${file}: ${result.errors.join(', ')}`);
            continue;
        }

        const saved = original.length - result.styles.length;
        totalSaved += saved;
        fs.writeFileSync(filePath, result.styles);
        console.log(`  ✓ ${file}: ${(original.length/1024).toFixed(1)}KB → ${(result.styles.length/1024).toFixed(1)}KB (-${(saved/1024).toFixed(1)}KB)`);
    }
    console.log(`  CSS total saved: ${(totalSaved/1024).toFixed(1)}KB\n`);
}

async function minifyJS() {
    let totalSaved = 0;
    for (const file of JS_FILES) {
        const filePath = path.join(ROOT, file);
        if (!fs.existsSync(filePath)) continue;

        const original = fs.readFileSync(filePath, 'utf8');
        try {
            const result = await minify(original, {
                compress: {
                    drop_console: false,  // Keep console.log for debugging
                    passes: 2
                },
                mangle: true,
                format: {
                    comments: false
                }
            });

            if (result.code) {
                const saved = original.length - result.code.length;
                totalSaved += saved;
                fs.writeFileSync(filePath, result.code);
                console.log(`  ✓ ${file}: ${(original.length/1024).toFixed(1)}KB → ${(result.code.length/1024).toFixed(1)}KB (-${(saved/1024).toFixed(1)}KB)`);
            }
        } catch (err) {
            console.error(`  ✗ ${file}: ${err.message}`);
        }
    }
    console.log(`  JS total saved: ${(totalSaved/1024).toFixed(1)}KB\n`);
}

async function generateMerchantFeed() {
    try {
        require('./generate-merchant-feed');
    } catch (e) {
        console.error('  ✗ merchant-feed:', e.message);
    }
}

async function main() {
    console.log('ÉCLAT Build — Minifying assets...\n');
    console.log('CSS:');
    await minifyCSS();
    console.log('JS:');
    await minifyJS();
    console.log('Google Shopping:');
    await generateMerchantFeed();
    console.log('\nBuild complete ✓');
}

main().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
