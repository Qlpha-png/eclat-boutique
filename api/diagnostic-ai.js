/**
 * POST /api/diagnostic-ai — Diagnostic beauté personnalisé IA
 * Claude Haiku — analyse personnalisée après quiz
 * Cache par combinaison de réponses (~192 combos x 4 langues = 768 max)
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

    var { skinType, concern, budget, age, lang } = req.body || {};
    if (!skinType || !concern) {
        return res.status(400).json({ error: 'skinType et concern requis' });
    }

    var safeLang = ['fr', 'en', 'es', 'de'].includes(lang) ? lang : 'fr';
    var cacheKey = [skinType, concern, budget || 'any', age || 'any'].join('_').toLowerCase();

    // Product catalog for recommendation context
    var CATALOG = {
        'masque-led': { name: 'Masque LED Pro 7 Couleurs', price: '39,90€', for: ['acne', 'rides', 'eclat'] },
        'gua-sha': { name: 'Gua Sha Quartz Rose', price: '9,90€', for: ['eclat', 'rides', 'circulation'] },
        'serum-vitc': { name: 'Sérum Vitamine C 20%', price: '14,90€', for: ['eclat', 'rides', 'taches'] },
        'ice-roller': { name: 'Ice Roller Cryo', price: '7,90€', for: ['rougeurs', 'poches', 'pores'] },
        'scrubber': { name: 'Scrubber Ultrasonique', price: '27,90€', for: ['pores', 'points-noirs', 'teint'] },
        'collagene': { name: 'Masque Collagène Lifting', price: '12,90€', for: ['rides', 'fermeté', 'hydratation'] },
        'huile-rose': { name: 'Huile Rose Musquée', price: '14,90€', for: ['cicatrices', 'rides', 'hydratation'] },
        'patchs': { name: 'Patchs Yeux Collagène', price: '9,90€', for: ['cernes', 'poches', 'hydratation'] },
        'steamer': { name: 'Facial Steamer Nano-Ion', price: '24,90€', for: ['pores', 'hydratation', 'preparation'] },
        'stickers': { name: 'Stickers Anti-Rides', price: '8,90€', for: ['rides', 'ridules'] }
    };

    try {
        var sb = getSupabase();

        // Check cache
        var { data: cached } = await sb
            .from('diagnostic_cache')
            .select('analysis')
            .eq('cache_key', cacheKey)
            .eq('lang', safeLang)
            .single();

        if (cached && cached.analysis) {
            return res.status(200).json({ analysis: cached.analysis, cached: true });
        }

        // Call Claude Haiku
        var apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
        if (!apiKey) {
            return res.status(503).json({ error: 'IA non disponible' });
        }

        var langNames = { fr: 'français', en: 'English', es: 'español', de: 'Deutsch' };
        var prompt = `Tu es une experte beauté. Un client a fait un diagnostic :
- Type de peau : ${skinType}
- Préoccupation principale : ${concern}
- Budget : ${budget || 'non spécifié'}
- Tranche d'âge : ${age || 'non spécifié'}

Génère une analyse personnalisée en 4-5 phrases :
1. Valide son type de peau et ce que ça implique
2. Donne 1-2 conseils spécifiques pour sa préoccupation
3. Explique pourquoi une routine adaptée changera sa peau

Sois chaleureuse, experte, bienveillante. Langue : ${langNames[safeLang]}.
Ne recommande pas de produits spécifiques (le site s'en charge).`;

        var response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 400,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            console.error('[diagnostic-ai] API error:', response.status);
            return res.status(503).json({ error: 'IA temporairement indisponible' });
        }

        var data = await response.json();
        var analysis = data.content && data.content[0] ? data.content[0].text : '';

        if (!analysis) {
            return res.status(500).json({ error: 'Réponse vide' });
        }

        // Cache
        await sb.from('diagnostic_cache').upsert({
            cache_key: cacheKey,
            lang: safeLang,
            analysis: analysis,
            created_at: new Date().toISOString()
        }, { onConflict: 'cache_key,lang' }).catch(function() {});

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json({ analysis: analysis, cached: false });

    } catch (err) {
        console.error('[diagnostic-ai]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
