/**
 * POST /api/product-recommendation — Recommandation IA personnalisée
 * Claude 3 Haiku — explique pourquoi un produit convient au profil client
 * Cache Supabase par hash des inputs, rate limit 10 req/jour par IP
 *
 * SQL Schema:
 * CREATE TABLE recommendation_cache (
 *     id SERIAL PRIMARY KEY,
 *     input_hash VARCHAR(64) NOT NULL UNIQUE,
 *     recommendation TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * CREATE INDEX idx_recommendation_cache_hash ON recommendation_cache(input_hash);
 *
 * CREATE TABLE recommendation_rate_limit (
 *     id SERIAL PRIMARY KEY,
 *     identifier VARCHAR(255) NOT NULL,
 *     request_date DATE NOT NULL DEFAULT CURRENT_DATE,
 *     request_count INTEGER NOT NULL DEFAULT 1,
 *     UNIQUE(identifier, request_date)
 * );
 * CREATE INDEX idx_recommendation_rate_identifier ON recommendation_rate_limit(identifier, request_date);
 */
const { createClient } = require('@supabase/supabase-js');

var ALLOWED_ORIGINS = [
    'https://maison-eclat.shop',
    'https://www.maison-eclat.shop',
    'http://localhost:3000',
    'http://localhost:5173'
];

var MAX_REQUESTS_PER_DAY = 10;

var _supabase = null;

function getSupabase() {
    if (!_supabase) {
        var url = process.env.SUPABASE_URL;
        var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Vary', 'Origin');
}

function hashInputs(productName, skinType, concern, lang) {
    var raw = [
        (productName || '').toLowerCase().trim(),
        (skinType || '').toLowerCase().trim(),
        (concern || '').toLowerCase().trim(),
        (lang || 'fr').toLowerCase().trim()
    ].join('|');

    // Simple hash — djb2 algorithm
    var hash = 5381;
    for (var i = 0; i < raw.length; i++) {
        hash = ((hash << 5) + hash) + raw.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return 'rec_' + Math.abs(hash).toString(36);
}

function getClientIdentifier(req) {
    var ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    // Prendre la première IP si liste
    if (ip.indexOf(',') !== -1) {
        ip = ip.split(',')[0].trim();
    }
    return ip;
}

function getFallbackMessage(skinType, concern) {
    var messages = {
        seche: {
            default: 'Ce produit contient des actifs hydratants qui aident a restaurer la barriere cutanee, ideal pour les peaux seches en quete de confort et de souplesse.',
            rides: 'Les ingredients hydratants de ce produit comblent les ridules liees a la deshydratation, un atout precieux pour votre type de peau seche.',
            acne: 'Ce produit allie hydratation et ingredients purifiants, une combinaison adaptee aux peaux seches sujettes aux imperfections.'
        },
        grasse: {
            default: 'Ce produit aide a reguler le sebum tout en maintenant une hydratation legere, parfait pour les peaux grasses.',
            acne: 'Les actifs purifiants de ce produit ciblent les imperfections liees a l\'exces de sebum, adaptes a votre type de peau grasse.',
            pores: 'Ce produit contient des ingredients qui resserrent les pores et matifient, ideal pour votre peau grasse.'
        },
        mixte: {
            default: 'Ce produit offre un equilibre entre hydratation et regulation du sebum, adapte aux besoins varies de votre peau mixte.',
            rides: 'Les actifs de ce produit hydratent les zones seches tout en controlant les zones grasses, une approche anti-age adaptee a la peau mixte.'
        },
        sensible: {
            default: 'Ce produit contient des ingredients apaisants et doux, formules pour respecter la sensibilite de votre peau.',
            rougeurs: 'Les actifs calmants de ce produit aident a reduire les rougeurs et l\'inconfort, essentiels pour votre peau sensible.'
        }
    };

    var skinKey = (skinType || '').toLowerCase().trim();
    var concernKey = (concern || '').toLowerCase().trim();
    var skinMessages = messages[skinKey] || messages['mixte'];
    return skinMessages[concernKey] || skinMessages['default'] || 'Ce produit est formule avec des ingredients actifs qui repondent aux besoins specifiques de votre type de peau. Ses composants ont ete selectionnes pour cibler votre preoccupation principale et ameliorer visiblement la qualite de votre peau.';
}

async function checkRateLimit(sb, identifier) {
    var today = new Date().toISOString().split('T')[0];

    var { data, error } = await sb
        .from('recommendation_rate_limit')
        .select('request_count')
        .eq('identifier', identifier)
        .eq('request_date', today)
        .single();

    if (error || !data) {
        // Pas encore de requete aujourd'hui
        return { allowed: true, count: 0 };
    }

    return {
        allowed: data.request_count < MAX_REQUESTS_PER_DAY,
        count: data.request_count
    };
}

async function incrementRateLimit(sb, identifier) {
    var today = new Date().toISOString().split('T')[0];

    var { error } = await sb.rpc('increment_recommendation_rate', {
        p_identifier: identifier,
        p_date: today
    });

    // Fallback si la RPC n'existe pas : upsert manuel
    if (error) {
        await sb
            .from('recommendation_rate_limit')
            .upsert({
                identifier: identifier,
                request_date: today,
                request_count: 1
            }, { onConflict: 'identifier,request_date' })
            .then(function() {
                return sb
                    .from('recommendation_rate_limit')
                    .update({ request_count: sb.rpc ? undefined : 1 })
                    .eq('identifier', identifier)
                    .eq('request_date', today);
            })
            .catch(function() {});

        // Safe upsert via Supabase client (NO raw SQL — prevent injection)
        await sb.from('recommendation_rate_limit').upsert({
            identifier: String(identifier).replace(/[^a-zA-Z0-9.:_-]/g, '').substring(0, 45),
            request_date: today,
            request_count: 1
        }, { onConflict: 'identifier,request_date', ignoreDuplicates: false }).catch(function() {});
    }
}

module.exports = async function handler(req, res) {
    setCors(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    var body = req.body || {};
    var productName = body.productName;
    var productDescription = body.productDescription;
    var productIngredients = body.productIngredients;
    var skinType = body.skinType;
    var concern = body.concern;
    var lang = body.lang;

    if (!productName || !skinType || !concern) {
        return res.status(400).json({ error: 'productName, skinType et concern requis' });
    }

    var safeLang = ['fr', 'en', 'es', 'de'].includes(lang) ? lang : 'fr';

    try {
        var sb = getSupabase();

        // --- Rate limit par IP (10 req/jour) ---
        var identifier = getClientIdentifier(req);
        var rateCheck = await checkRateLimit(sb, identifier);
        if (!rateCheck.allowed) {
            return res.status(429).json({
                error: 'Limite de recommandations atteinte (10/jour)',
                remaining: 0
            });
        }

        // --- Check cache ---
        var inputHash = hashInputs(productName, skinType, concern, safeLang);

        var { data: cached } = await sb
            .from('recommendation_cache')
            .select('recommendation')
            .eq('input_hash', inputHash)
            .single();

        if (cached && cached.recommendation) {
            return res.status(200).json({
                recommendation: cached.recommendation,
                cached: true
            });
        }

        // --- Appel Claude API ---
        var apiKey = (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '').trim();

        if (!apiKey) {
            // Fallback sans IA : message generique base sur le profil
            var fallback = getFallbackMessage(skinType, concern);
            return res.status(200).json({
                recommendation: fallback,
                cached: false,
                fallback: true
            });
        }

        var prompt = 'Based on this user\'s skin profile (type: ' + skinType +
            ', concern: ' + concern +
            '), explain in 2-3 sentences why this product (name: ' + productName +
            ', ingredients: ' + (productIngredients || 'non specifies').substring(0, 300) +
            ') would benefit them. Be specific and scientific.';

        if (safeLang === 'fr') {
            prompt += ' Reponds en francais.';
        } else if (safeLang === 'es') {
            prompt += ' Respond in Spanish.';
        } else if (safeLang === 'de') {
            prompt += ' Respond in German.';
        }

        var response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 250,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            console.error('[product-recommendation] API error:', response.status);
            // Fallback en cas d'erreur API
            var fallbackOnError = getFallbackMessage(skinType, concern);
            return res.status(200).json({
                recommendation: fallbackOnError,
                cached: false,
                fallback: true
            });
        }

        var data = await response.json();
        var recommendation = data.content && data.content[0] ? data.content[0].text : '';

        if (!recommendation) {
            return res.status(500).json({ error: 'Reponse vide de l\'IA' });
        }

        // --- Stocker en cache ---
        await sb.from('recommendation_cache').upsert({
            input_hash: inputHash,
            recommendation: recommendation,
            created_at: new Date().toISOString()
        }, { onConflict: 'input_hash' }).catch(function() {});

        // --- Incrementer le rate limit ---
        await incrementRateLimit(sb, identifier).catch(function() {});

        return res.status(200).json({
            recommendation: recommendation,
            cached: false
        });

    } catch (err) {
        console.error('[product-recommendation]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
