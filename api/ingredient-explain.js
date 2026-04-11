/**
 * POST /api/ingredient-explain — Explication IA d'un ingrédient
 * Claude Haiku — ~$0.001/appel, cache Supabase
 * Rate limit : 10/jour/user
 */
const { getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async function handler(req, res) {
    // CORS — production origins only
    var allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Vary', 'Origin');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Auth check — authenticated users get 'chat' limit, unauthenticated get stricter 'contact' limit
    var isAuthenticated = false;
    var authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            var sb = getSupabase();
            var token = authHeader.replace('Bearer ', '');
            var { data: { user }, error: authError } = await sb.auth.getUser(token);
            if (!authError && user) isAuthenticated = true;
        } catch (_) {}
    }
    // Stricter rate limit for unauthenticated requests (5 req/5min vs 10 req/min)
    if (applyRateLimit(req, res, isAuthenticated ? 'chat' : 'contact')) return;

    const { ingredient, lang } = req.body || {};
    if (!ingredient || typeof ingredient !== 'string') {
        return res.status(400).json({ error: 'ingredient requis' });
    }

    var safeLang = ['fr', 'en', 'es', 'de'].includes(lang) ? lang : 'fr';
    var cacheKey = ingredient.trim().toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿçæœ\s-]/gi, '');

    try {
        var sb = getSupabase();

        // Check cache first
        var { data: cached } = await sb
            .from('ingredient_explanations')
            .select('explanation')
            .eq('ingredient', cacheKey)
            .eq('lang', safeLang)
            .single();

        if (cached && cached.explanation) {
            return res.status(200).json({ explanation: cached.explanation, cached: true });
        }

        // Call Claude Haiku
        var apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
        if (!apiKey) {
            return res.status(503).json({ error: 'IA non disponible' });
        }

        var langNames = { fr: 'français', en: 'English', es: 'español', de: 'Deutsch' };
        var response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 200,
                messages: [{
                    role: 'user',
                    content: 'Explique cet ingrédient cosmétique en 2-3 phrases simples pour un consommateur. Mentionne : origine, bienfaits pour la peau, profil de sécurité. Langue : ' + langNames[safeLang] + '. Ingrédient : ' + ingredient
                }]
            })
        });

        if (!response.ok) {
            console.error('[ingredient-explain] API error:', response.status);
            return res.status(503).json({ error: 'IA temporairement indisponible' });
        }

        var data = await response.json();
        var explanation = data.content && data.content[0] ? data.content[0].text : '';

        if (!explanation) {
            return res.status(500).json({ error: 'Réponse vide' });
        }

        // Cache in Supabase
        await sb.from('ingredient_explanations').upsert({
            ingredient: cacheKey,
            lang: safeLang,
            explanation: explanation,
            created_at: new Date().toISOString()
        }, { onConflict: 'ingredient,lang' }).catch(function() {
            // Cache failure is non-critical — table may not exist yet
        });

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json({ explanation: explanation, cached: false });

    } catch (err) {
        console.error('[ingredient-explain]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
