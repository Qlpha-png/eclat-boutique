// ============================
// ÉCLAT — Défis hebdomadaires
// GET/POST /api/loyalty/challenges
// ============================

const { verifyAuth, getProfile, getSupabase } = require('../_middleware/auth');
const { applyRateLimit } = require('../_middleware/rateLimit');

// ══════════════════════════════════════════════════════════════
// ÉCONOMIE V2 — Défis rebalancés
// Défis GRATUITS (engagement) : 3-5 Éclats (ancien : 20-40)
// Défis ACHAT (dépense requise) : 8-15 Éclats (ancien : 20-50)
// Total hebdo max gratuit : ~10 Éclats = 0.60€/semaine
// Les gros gains viennent des ACHATS, pas des clics
// ══════════════════════════════════════════════════════════════
const CHALLENGE_POOL = [
    // ENGAGEMENT (gratuit, petits rewards = la carotte)
    { key: 'explorateur', title: 'Explorateur', description: 'Visitez 5 pages produits', icon: '\ud83d\udccd', condition_type: 'visit_pages', condition_target: 5, reward_eclats: 3 },
    { key: 'critique', title: 'Critique', description: 'Laissez 2 avis', icon: '\u2b50', condition_type: 'reviews', condition_target: 2, reward_eclats: 5 },
    { key: 'ambassadeur', title: 'Ambassadeur', description: 'Partagez 1 produit sur les r\u00e9seaux', icon: '\ud83d\udce3', condition_type: 'share', condition_target: 1, reward_eclats: 3 },
    { key: 'fidele', title: 'Fid\u00e8le', description: 'Check-in 5 jours cons\u00e9cutifs', icon: '\ud83d\udd25', condition_type: 'checkin_streak', condition_target: 5, reward_eclats: 5 },
    { key: 'photographe', title: 'Photographe', description: 'Postez 1 avis avec photo', icon: '\ud83d\udcf8', condition_type: 'review_photo', condition_target: 1, reward_eclats: 5 },
    // ACHAT (dépense requise = rewards justifiés par le CA)
    { key: 'panier_genereux', title: 'Panier G\u00e9n\u00e9reux', description: 'Commandez pour 50\u20ac+', icon: '\ud83d\uded2', condition_type: 'order_amount', condition_target: 50, reward_eclats: 10 },
    { key: 'collectionneur', title: 'Collectionneur', description: 'Achetez dans 2 cat\u00e9gories', icon: '\ud83c\udfc6', condition_type: 'categories', condition_target: 2, reward_eclats: 12 },
    { key: 'early_bird', title: 'Early Bird', description: 'Commandez avant 10h', icon: '\ud83c\udf05', condition_type: 'early_order', condition_target: 1, reward_eclats: 8 }
];

module.exports = async function handler(req, res) {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (applyRateLimit(req, res, 'public')) return;

    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Non authentifi\u00e9' });

    const sb = getSupabase();

    // GET : défis actifs + progression
    if (req.method === 'GET') {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Vérifier si on doit générer les défis de la semaine
            await ensureWeeklyChallenges(sb, today);

            // Récupérer défis actifs
            const { data: challenges } = await sb
                .from('weekly_challenges')
                .select('*')
                .lte('active_from', today)
                .gte('active_until', today)
                .order('active_from', { ascending: false })
                .limit(2);

            if (!challenges || challenges.length === 0) {
                return res.status(200).json({ challenges: [] });
            }

            // Récupérer progression
            const { data: progressData } = await sb
                .from('challenge_progress')
                .select('challenge_id, progress, completed, completed_at')
                .eq('user_id', user.userId)
                .in('challenge_id', challenges.map(c => c.id));

            const progressMap = {};
            if (progressData) {
                for (const p of progressData) {
                    progressMap[p.challenge_id] = p;
                }
            }

            const result = challenges.map(c => ({
                id: c.id,
                key: c.challenge_key,
                title: c.title,
                description: c.description,
                icon: c.icon,
                target: c.condition_target,
                reward: c.reward_eclats,
                expires: c.active_until,
                progress: progressMap[c.id]?.progress || 0,
                completed: progressMap[c.id]?.completed || false,
                completed_at: progressMap[c.id]?.completed_at || null
            }));

            return res.status(200).json({ challenges: result });
        } catch (err) {
            console.error('[challenges GET]', err.message);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // POST : mettre à jour la progression d'un défi
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { challenge_id, increment } = req.body || {};
    if (!challenge_id) return res.status(400).json({ error: 'challenge_id requis' });

    try {
        const today = new Date().toISOString().split('T')[0];

        // Vérifier que le défi existe et est actif
        const { data: challenge } = await sb
            .from('weekly_challenges')
            .select('*')
            .eq('id', challenge_id)
            .lte('active_from', today)
            .gte('active_until', today)
            .single();

        if (!challenge) {
            return res.status(404).json({ error: 'D\u00e9fi introuvable ou expir\u00e9' });
        }

        // Upsert progression
        const { data: existing } = await sb
            .from('challenge_progress')
            .select('*')
            .eq('user_id', user.userId)
            .eq('challenge_id', challenge_id)
            .single();

        if (existing && existing.completed) {
            return res.status(200).json({ success: false, already_completed: true });
        }

        const newProgress = Math.min(
            (existing?.progress || 0) + (increment || 1),
            challenge.condition_target
        );
        const justCompleted = newProgress >= challenge.condition_target;

        if (existing) {
            await sb.from('challenge_progress').update({
                progress: newProgress,
                completed: justCompleted,
                completed_at: justCompleted ? new Date().toISOString() : null
            }).eq('id', existing.id);
        } else {
            await sb.from('challenge_progress').insert({
                user_id: user.userId,
                challenge_id,
                progress: newProgress,
                completed: justCompleted,
                completed_at: justCompleted ? new Date().toISOString() : null
            });
        }

        // Si complété, créditer les Éclats
        let eclatsEarned = 0;
        if (justCompleted && (!existing || !existing.completed)) {
            const profile = await getProfile(user.userId);
            eclatsEarned = challenge.reward_eclats;

            await sb.from('profiles').update({
                eclats: (profile.eclats || 0) + eclatsEarned
            }).eq('id', user.userId);

            await sb.from('loyalty_points').insert({
                user_id: user.userId,
                amount: eclatsEarned,
                type: 'earn',
                source: 'challenge',
                reference_id: challenge_id,
                metadata: { challenge_key: challenge.challenge_key, title: challenge.title }
            });
        }

        return res.status(200).json({
            success: true,
            progress: newProgress,
            target: challenge.condition_target,
            completed: justCompleted,
            eclats_earned: eclatsEarned
        });
    } catch (err) {
        console.error('[challenges POST]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Rotation automatique : génère 2 défis si aucun actif cette semaine
async function ensureWeeklyChallenges(sb, today) {
    const { data: active } = await sb
        .from('weekly_challenges')
        .select('id')
        .lte('active_from', today)
        .gte('active_until', today)
        .limit(1);

    if (active && active.length > 0) return; // Défis déjà actifs

    // Calculer lundi et dimanche de cette semaine
    const now = new Date(today);
    const dayOfWeek = now.getUTCDay();
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    const activeFrom = monday.toISOString().split('T')[0];
    const activeUntil = sunday.toISOString().split('T')[0];

    // Choisir 2 défis aléatoires
    const shuffled = [...CHALLENGE_POOL].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);

    const rows = selected.map(c => ({
        challenge_key: c.key,
        title: c.title,
        description: c.description,
        icon: c.icon,
        condition_type: c.condition_type,
        condition_target: c.condition_target,
        reward_eclats: c.reward_eclats,
        active_from: activeFrom,
        active_until: activeUntil
    }));

    await sb.from('weekly_challenges').insert(rows);
    console.log('[challenges] Generated', selected.map(c => c.key).join(', '), 'for week', activeFrom);
}

module.exports.CHALLENGE_POOL = CHALLENGE_POOL;
