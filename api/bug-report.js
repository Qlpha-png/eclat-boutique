// ============================
// MAISON ÉCLAT — API Bug Report / Signalement
// Stocke les signalements dans Supabase (table: bug_reports)
// ============================

const { createClient } = require('@supabase/supabase-js');
const { applyRateLimit } = require('./_middleware/rateLimit');

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ── Table SQL à créer dans Supabase ──
// CREATE TABLE IF NOT EXISTS bug_reports (
//   id SERIAL PRIMARY KEY,
//   ref VARCHAR(20) UNIQUE NOT NULL,
//   type VARCHAR(20) NOT NULL DEFAULT 'bug',  -- bug, suggestion, question
//   description TEXT NOT NULL,
//   email VARCHAR(255),
//   page VARCHAR(500),
//   user_agent TEXT,
//   screen_size VARCHAR(20),
//   screenshot_url TEXT,
//   status VARCHAR(20) DEFAULT 'new',  -- new, seen, in_progress, resolved, closed
//   admin_notes TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   resolved_at TIMESTAMPTZ
// );
// CREATE INDEX idx_bug_reports_status ON bug_reports(status);
// CREATE INDEX idx_bug_reports_type ON bug_reports(type);
// CREATE INDEX idx_bug_reports_ref ON bug_reports(ref);

function generateRef() {
    var prefix = 'BR-';
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var ref = prefix;
    for (var i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
}

// Valider les types autorisés
var VALID_TYPES = ['bug', 'suggestion', 'question'];

module.exports = async (req, res) => {
    // CORS
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'bugreport')) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { type, description, email, page, userAgent, screenSize, screenshot, timestamp } = req.body || {};

        // ── Validation ──
        if (!description || typeof description !== 'string' || description.trim().length < 10) {
            return res.status(400).json({ error: 'Description requise (10 caractères minimum).' });
        }

        if (description.length > 3000) {
            return res.status(400).json({ error: 'Description trop longue (3000 caractères max).' });
        }

        if (!VALID_TYPES.includes(type)) {
            return res.status(400).json({ error: 'Type invalide.' });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email invalide.' });
        }

        const ref = generateRef();

        // ── Stockage screenshot en Supabase Storage (si présent) ──
        let screenshotUrl = null;
        if (screenshot && typeof screenshot === 'string' && screenshot.startsWith('data:image/')) {
            try {
                // Extraire le contenu base64
                var parts = screenshot.split(',');
                if (parts.length === 2) {
                    var mimeMatch = parts[0].match(/data:(image\/\w+);base64/);
                    var mime = mimeMatch ? mimeMatch[1] : 'image/png';
                    var ext = mime.split('/')[1] || 'png';
                    var buffer = Buffer.from(parts[1], 'base64');

                    // Limite 5 Mo
                    if (buffer.length <= 5 * 1024 * 1024) {
                        var filePath = 'bug-reports/' + ref + '.' + ext;
                        var { error: uploadErr } = await supabase.storage
                            .from('uploads')
                            .upload(filePath, buffer, {
                                contentType: mime,
                                upsert: false
                            });

                        if (!uploadErr) {
                            var { data: urlData } = supabase.storage
                                .from('uploads')
                                .getPublicUrl(filePath);
                            screenshotUrl = urlData ? urlData.publicUrl : null;
                        } else {
                            console.warn('[BugReport] Upload screenshot error:', uploadErr.message);
                        }
                    }
                }
            } catch (uploadError) {
                console.warn('[BugReport] Screenshot processing error:', uploadError.message);
                // On continue sans la capture, ce n'est pas bloquant
            }
        }

        // ── Insérer dans Supabase ──
        const { data, error } = await supabase
            .from('bug_reports')
            .insert({
                ref: ref,
                type: escapeHtml(type),
                description: escapeHtml(description.trim()),
                email: email ? escapeHtml(email.trim()) : null,
                page: page ? escapeHtml(String(page).substring(0, 500)) : null,
                user_agent: userAgent ? String(userAgent).substring(0, 500) : null,
                screen_size: screenSize ? String(screenSize).substring(0, 20) : null,
                screenshot_url: screenshotUrl,
                status: 'new',
                created_at: timestamp || new Date().toISOString()
            })
            .select('ref')
            .single();

        if (error) {
            console.error('[BugReport] Supabase insert error:', error);
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement. Réessayez.' });
        }

        return res.status(200).json({
            success: true,
            ref: data.ref,
            message: 'Signalement enregistré.'
        });

    } catch (err) {
        console.error('[BugReport] Server error:', err);
        return res.status(500).json({ error: 'Erreur serveur. Réessayez plus tard.' });
    }
};
