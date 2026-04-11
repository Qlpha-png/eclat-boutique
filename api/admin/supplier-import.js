/**
 * POST /api/admin/supplier-import — Importer un produit fournisseur → Supabase
 * Body : { supplier, supplierId, name, nameFr, description, descriptionFr, price, supplierPrice,
 *          category, subcategory, images, concerns, gender, tags }
 * Auth admin requis
 */
const { getSupabase, requireAdmin } = require('../_middleware/auth');

var SITE_URL = 'https://maison-eclat.shop';
var CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

module.exports = async function handler(req, res) {
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin || '';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.indexOf(origin) !== -1 ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    var admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Admin requis' });

    var sb = getSupabase();
    var body = req.body || {};

    // Validation
    if (!body.name || !body.price || !body.category) {
        return res.status(400).json({ error: 'name, price et category sont requis' });
    }

    try {
        // Auto-generate French description if not provided
        var descFr = body.descriptionFr || body.description || '';
        var nameFr = body.nameFr || body.name;

        if (!descFr && CLAUDE_API_KEY && body.name) {
            descFr = await generateDescription(body.name, body.category);
        }

        // Generate slug
        var slug = slugify(nameFr || body.name);

        // Calculate price (minimum 2.5x markup)
        var supplierPrice = parseFloat(body.supplierPrice) || 0;
        var sellPrice = parseFloat(body.price);
        if (supplierPrice > 0 && sellPrice < supplierPrice * 2.5) {
            sellPrice = Math.ceil(supplierPrice * 2.5 * 10) / 10; // Round up to .X0
        }

        // Prepare images array
        var images = [];
        if (Array.isArray(body.images)) {
            images = body.images.slice(0, 6);
        } else if (body.image) {
            images = [body.image];
        }

        // Insert product
        var productData = {
            name: nameFr,
            slug: slug,
            price: sellPrice,
            compare_at_price: body.compareAtPrice || null,
            tagline: body.tagline || '',
            description: descFr,
            category: body.category.toLowerCase(),
            subcategory: body.subcategory || null,
            images: images,
            badge: body.badge || null,
            is_active: false, // Désactivé par défaut → validation admin
            is_featured: false,
            concerns: Array.isArray(body.concerns) ? body.concerns : [],
            gender: body.gender || 'unisex',
            clean_beauty_score: body.cleanBeautyScore || null,
            trending: false,
            metadata: {
                supplier: body.supplier || 'manual',
                supplier_id: body.supplierId || null,
                supplier_price: supplierPrice,
                margin_percent: supplierPrice > 0 ? Math.round((1 - supplierPrice / sellPrice) * 100) : null,
                imported_at: new Date().toISOString(),
                tags: Array.isArray(body.tags) ? body.tags : []
            }
        };

        var { data: product, error } = await sb
            .from('products')
            .insert(productData)
            .select('id, name, slug, price')
            .single();

        if (error) throw error;

        // Add to inventory with 0 stock
        await sb.from('inventory').insert({
            product_id: product.id,
            quantity: 0,
            low_stock_threshold: 5
        }).catch(function() {});

        return res.status(201).json({
            ok: true,
            product: product,
            message: 'Produit importé (inactif). Activez-le dans le dashboard admin.'
        });
    } catch (err) {
        console.error('[supplier-import]', err.message);
        return res.status(500).json({ error: err.message });
    }
};

function slugify(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
}

async function generateDescription(productName, category) {
    if (!CLAUDE_API_KEY) return '';
    try {
        var r = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 200,
                messages: [{
                    role: 'user',
                    content: 'Écris une description produit e-commerce en français (2-3 phrases, ton premium) pour : "' + productName + '" (catégorie : ' + category + '). Pas de guillemets autour de la réponse.'
                }]
            })
        });
        var data = await r.json();
        return data.content && data.content[0] ? data.content[0].text : '';
    } catch(e) { return ''; }
}
