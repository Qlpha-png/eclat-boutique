/**
 * POST /api/product-recommendation — "Pourquoi ce produit pour vous" IA
 * Claude Haiku — recommandation personnalisée basée sur le diagnostic
 * Cache par quizHash + productId
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'public')) return;

    var { productName, productDescription, productIngredients, skinType, concern, lang } = req.body || {};
    if (!productName || !skinType || !concern) {
        return res.status(400).json({ error: 'productName, skinType et concern requis' });
    }

    var safeLang = ['fr', 'en', 'es', 'de'].includes(lang) ? lang : 'fr';
    var cacheKey = [skinType, concern, productName.toLowerCase().replace(/[^a-z0-9]/g, '')].join('_');

    try {
        var sb = getSupabase();

        // Check cache
        var { data: cached } = await sb
            .from('recommendation_cache')
            .select('recommendation')
            .eq('cache_key', cacheKey)
            .eq('lang', safeLang)
            .single();

        if (cached && cached.recommendation) {
            return res.status(200).json({ recommendation: cached.recommendation, cached: true });
        }

        // Call Claude Haiku
        var apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
        if (!apiKey) {
            return res.status(503).json({ error: 'IA non disponible' });
        }

        var langNames = { fr: 'français', en: 'English', es: 'español', de: 'Deutsch' };
        var prompt = `Tu es une experte beauté. Un client avec ce profil :
- Type de peau : ${skinType}
- Préoccupation : ${concern}

Regarde ce produit :
- Nom : ${productName}
- Description : ${(productDescription || '').substring(0, 200)}
- Ingrédients : ${(productIngredients || '').substring(0, 200)}

Explique en 2-3 phrases POURQUOI ce produit est adapté à ce profil client spécifique.
Mentionne quels ingrédients ou propriétés correspondent à ses besoins.
Sois spécifique, pas générique. Langue : ${langNames[safeLang]}.`;

        var response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 250,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            console.error('[product-recommendation] API error:', response.status);
            return res.status(503).json({ error: 'IA temporairement indisponible' });
        }

        var data = await response.json();
        var recommendation = data.content && data.content[0] ? data.content[0].text : '';

        if (!recommendation) {
            return res.status(500).json({ error: 'Réponse vide' });
        }

        // Cache
        await sb.from('recommendation_cache').upsert({
            cache_key: cacheKey,
            lang: safeLang,
            recommendation: recommendation,
            created_at: new Date().toISOString()
        }, { onConflict: 'cache_key,lang' }).catch(function() {});

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json({ recommendation: recommendation, cached: false });

    } catch (err) {
        console.error('[product-recommendation]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
