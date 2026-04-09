/**
 * POST /api/chat — Chatbot IA beauté ÉCLAT
 * Accès contrôlé par palier Éclats + limite 5% CA
 * Utilise Claude Haiku (~0.001€/message)
 */
const { verifyAuth, getProfile, getSupabase } = require('./_middleware/auth');
const { applyRateLimit } = require('./_middleware/rateLimit');

const SYSTEM_PROMPT = `Tu es "Éclat", l'assistante beauté IA de la boutique en ligne ÉCLAT (maison-eclat.shop).

RÈGLES ABSOLUES :
- Tu ne parles QUE de beauté, skincare, cosmétiques, routines beauté et produits ÉCLAT
- Si le client parle d'autre chose → redirige poliment : "Je suis spécialisée beauté ! Posez-moi une question sur votre peau ou nos produits."
- Tes réponses font MAX 3 phrases courtes et utiles
- Recommande les produits ÉCLAT quand c'est pertinent (avec prix)
- Sois chaleureuse, experte et bienveillante — comme une amie dermatologue
- Parle dans la langue du client
- N'invente JAMAIS de produit qui n'est pas dans le catalogue

CATALOGUE ÉCLAT :
- Masque LED Pro 7 Couleurs (39.90€) — rouge anti-âge, bleue anti-acné, verte anti-rougeurs
- Sérum Vitamine C 20% (14.90€) — antioxydant, éclat, anti-taches
- Gua Sha Quartz Rose (9.90€) — drainage lymphatique, microcirculation +400%
- Ice Roller Cryo (7.90€) — dégonfle cernes, apaise rougeurs
- Scrubber Ultrasonique (27.90€) — nettoyage profond pores, exfoliation douce
- Brosse Nettoyante Sonic (22.90€) — nettoyage quotidien, 8000 vibrations/min
- V-Line Roller EMS (18.90€) — micro-courants, tonifie ovale et mâchoire
- Facial Steamer Nano-Ion (24.90€) — vapeur chaude, ouvre pores, hydrate
- Huile Précieuse Rose Musquée (14.90€) — régénère, nourrit, cicatrise
- Patchs Yeux Collagène (9.90€) — hydrate contour yeux, anti-cernes
- Masque Collagène Lifting (12.90€) — effet tenseur immédiat
- Stickers Anti-Rides Micro-Crystal (8.90€) — lisse pendant le sommeil
- Masque Yeux Vapeur SPA (9.90€) — relaxe, décongestionne
- Diffuseur Arôme Ultrasonique (24.90€) — aromathérapie, humidifie
- Kit Boucles Sans Chaleur (9.90€) — boucles naturelles sans dommage

COFFRETS :
- Coffret Routine Éclat (29.90€) — Ice Roller + Sérum Vitamine C + Gua Sha
- Coffret Routine Anti-Âge (59.90€) — Masque LED + Sérum + Masque Collagène
- Coffret Routine Glow (34.90€) — Sérum + Huile Rose + Patchs Yeux`;

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (applyRateLimit(req, res, 'chat')) return;

    const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
    if (!apiKey) {
        return res.status(503).json({ error: 'IA non disponible pour le moment' });
    }

    const { message, lang, history } = req.body || {};
    if (!message || typeof message !== 'string' || message.length > 500) {
        return res.status(400).json({ error: 'Message invalide (max 500 caractères)' });
    }

    // ── Auth check ──
    const authResult = await verifyAuth(req);
    if (!authResult) {
        return res.status(401).json({ error: 'connect', upgrade: 'login' });
    }

    // ── Profil + palier ──
    const profile = await getProfile(authResult.userId);
    if (!profile) {
        return res.status(403).json({ error: 'Profil introuvable', upgrade: 'login' });
    }

    const eclats = profile.eclats || 0;
    const tier = getTier(eclats);

    if (tier.level < 1) {
        return res.status(403).json({
            error: 'ia_locked',
            upgrade: 'eclats',
            current: eclats,
            needed: 200,
            tierName: 'Lumière'
        });
    }

    // ── Limites mensuelles ──
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let monthUsed = 0;
    let aiTotal = profile.ai_credits_used || 0;

    // Reset monthly counter if new month
    if (profile.ai_month !== currentMonth) {
        monthUsed = 0;
    } else {
        monthUsed = profile.ai_messages_month || 0;
    }

    if (tier.monthlyLimit && monthUsed >= tier.monthlyLimit) {
        return res.status(429).json({
            error: 'limit',
            upgrade: 'tier',
            limit: tier.monthlyLimit,
            used: monthUsed,
            nextTier: tier.nextTierName
        });
    }

    // ── Limite 5% CA ──
    const totalSpent = parseFloat(profile.total_spent) || 0;
    const costPerMsg = 0.001;
    if (totalSpent > 0 && (aiTotal * costPerMsg) >= (totalSpent * 0.05)) {
        return res.status(429).json({
            error: 'budget',
            upgrade: 'purchase'
        });
    }

    // ── Appel Anthropic API ──
    const messages = [];
    if (Array.isArray(history)) {
        history.slice(-6).forEach(function(h) {
            if (h.role && h.content) {
                messages.push({ role: h.role, content: String(h.content).substring(0, 500) });
            }
        });
    }
    messages.push({ role: 'user', content: message });

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: tier.model,
                max_tokens: tier.maxTokens,
                system: SYSTEM_PROMPT + '\n\nLangue du client : ' + (lang || 'fr'),
                messages: messages
            })
        });

        if (!response.ok) {
            const errBody = await response.text().catch(function() { return ''; });
            console.error('[chat] Anthropic', response.status, errBody);
            return res.status(502).json({ error: 'Erreur IA temporaire, réessayez' });
        }

        const data = await response.json();
        const reply = (data.content && data.content[0] && data.content[0].text) || 'Désolée, réessayez.';

        // ── Mettre à jour les compteurs ──
        try {
            const sb = getSupabase();
            await sb.from('profiles').update({
                ai_credits_used: aiTotal + 1,
                ai_messages_month: monthUsed + 1,
                ai_month: currentMonth
            }).eq('id', authResult.userId);
        } catch (e) {
            console.warn('[chat] Usage tracking:', e.message);
        }

        return res.status(200).json({
            reply: reply,
            tier: tier.name,
            usage: {
                used: monthUsed + 1,
                limit: tier.monthlyLimit || null
            }
        });
    } catch (err) {
        console.error('[chat] Error:', err.message);
        return res.status(500).json({ error: 'Erreur interne' });
    }
};

function getTier(eclats) {
    if (eclats >= 1000) return { name: 'Diamant', level: 3, monthlyLimit: null, nextTierName: null, model: 'claude-sonnet-4-5-20241022', maxTokens: 300 };
    if (eclats >= 500) return { name: 'Prestige', level: 2, monthlyLimit: 50, nextTierName: 'Diamant', model: 'claude-haiku-4-5-20251001', maxTokens: 200 };
    if (eclats >= 200) return { name: 'Lumière', level: 1, monthlyLimit: 20, nextTierName: 'Prestige', model: 'claude-haiku-4-5-20251001', maxTokens: 150 };
    return { name: 'Éclat', level: 0, monthlyLimit: 0, nextTierName: 'Lumière', model: null, maxTokens: 0 };
}
