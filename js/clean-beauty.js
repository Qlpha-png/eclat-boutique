// ============================
// ECLAT Beaute — Clean Beauty Score Algorithm
// Score 0-100 par produit base sur composition INCI
// Disclaimer : informatif, pas un avis medical
// ============================

var CleanBeauty = (function() {
    'use strict';

    // ─── Grade mapping ──────────────────────────────────
    var GRADE_MAP = [
        { min: 90, grade: 'A', label_fr: 'Excellent', label_en: 'Excellent', label_de: 'Ausgezeichnet', label_es: 'Excelente', color: '#22c55e' },
        { min: 75, grade: 'B', label_fr: 'Tres bien', label_en: 'Very good', label_de: 'Sehr gut', label_es: 'Muy bueno', color: '#84cc16' },
        { min: 60, grade: 'C', label_fr: 'Correct', label_en: 'Fair', label_de: 'Ausreichend', label_es: 'Aceptable', color: '#eab308' },
        { min: 0,  grade: 'D', label_fr: 'A ameliorer', label_en: 'Needs improvement', label_de: 'Verbesserungswuerdig', label_es: 'Por mejorar', color: '#ef4444' }
    ];

    // ─── Safety pill colors ─────────────────────────────
    var SAFETY_COLORS = {
        excellent: '#22c55e',
        good: '#84cc16',
        moderate: '#eab308',
        caution: '#ef4444'
    };

    // ─── Translations ───────────────────────────────────
    var LABELS = {
        fr: {
            title: 'Composition & Score Clean Beauty',
            disclaimer: 'Score informatif base sur la composition INCI. Ne constitue pas un avis medical.',
            natural: 'Origine naturelle',
            safety: 'Profil de securite',
            certs: 'Certifications',
            simplicity: 'Simplicite',
            safetyExcellent: 'Excellent',
            safetyGood: 'Bon',
            safetyModerate: 'Modere',
            safetyCaution: 'Precaution',
            safetyUnknown: 'Non reference',
            originNatural: 'Naturel',
            originSynthetic: 'Synthetique',
            originMineral: 'Mineral',
            originUnknown: 'Inconnu',
            unknownIngredient: 'Ingredient non reference dans notre base.',
            ingredientsLabel: 'Ingredients'
        },
        en: {
            title: 'Composition & Clean Beauty Score',
            disclaimer: 'Informational score based on INCI composition. Not medical advice.',
            natural: 'Natural origin',
            safety: 'Safety profile',
            certs: 'Certifications',
            simplicity: 'Simplicity',
            safetyExcellent: 'Excellent',
            safetyGood: 'Good',
            safetyModerate: 'Moderate',
            safetyCaution: 'Caution',
            safetyUnknown: 'Not referenced',
            originNatural: 'Natural',
            originSynthetic: 'Synthetic',
            originMineral: 'Mineral',
            originUnknown: 'Unknown',
            unknownIngredient: 'Ingredient not referenced in our database.',
            ingredientsLabel: 'Ingredients'
        },
        de: {
            title: 'Zusammensetzung & Clean Beauty Score',
            disclaimer: 'Informativer Score basierend auf der INCI-Zusammensetzung. Kein medizinischer Rat.',
            natural: 'Natuerlicher Ursprung',
            safety: 'Sicherheitsprofil',
            certs: 'Zertifizierungen',
            simplicity: 'Einfachheit',
            safetyExcellent: 'Ausgezeichnet',
            safetyGood: 'Gut',
            safetyModerate: 'Maessig',
            safetyCaution: 'Vorsicht',
            safetyUnknown: 'Nicht referenziert',
            originNatural: 'Natuerlich',
            originSynthetic: 'Synthetisch',
            originMineral: 'Mineralisch',
            originUnknown: 'Unbekannt',
            unknownIngredient: 'Zutat nicht in unserer Datenbank referenziert.',
            ingredientsLabel: 'Inhaltsstoffe'
        },
        es: {
            title: 'Composicion & Puntuacion Clean Beauty',
            disclaimer: 'Puntuacion informativa basada en la composicion INCI. No constituye un consejo medico.',
            natural: 'Origen natural',
            safety: 'Perfil de seguridad',
            certs: 'Certificaciones',
            simplicity: 'Simplicidad',
            safetyExcellent: 'Excelente',
            safetyGood: 'Bueno',
            safetyModerate: 'Moderado',
            safetyCaution: 'Precaucion',
            safetyUnknown: 'No referenciado',
            originNatural: 'Natural',
            originSynthetic: 'Sintetico',
            originMineral: 'Mineral',
            originUnknown: 'Desconocido',
            unknownIngredient: 'Ingrediente no referenciado en nuestra base de datos.',
            ingredientsLabel: 'Ingredientes'
        }
    };

    // ─── Detect current language ────────────────────────
    function getLang() {
        if (typeof currentLang !== 'undefined' && LABELS[currentLang]) return currentLang;
        var htmlLang = document.documentElement.lang || '';
        if (LABELS[htmlLang]) return htmlLang;
        return 'fr';
    }

    function t(key) {
        var lang = getLang();
        return (LABELS[lang] && LABELS[lang][key]) || (LABELS.fr[key]) || key;
    }

    // ─── Parse ingredients string into array ────────────
    function parseIngredients(ingredientStr) {
        if (!ingredientStr) return [];
        return ingredientStr.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
    }

    // ─── Find ingredient in DB (case-insensitive, strip parentheticals) ───
    function findIngredient(name) {
        if (!window.INGREDIENTS_DB) return null;
        var db = window.INGREDIENTS_DB;
        // Exact match
        if (db[name]) return db[name];
        // Normalized (strip parentheticals)
        var normalized = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
        if (db[normalized]) return db[normalized];
        // Case-insensitive search
        var keys = Object.keys(db);
        var lowerName = name.toLowerCase();
        var lowerNorm = normalized.toLowerCase();
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i].toLowerCase();
            if (k === lowerName || k === lowerNorm) {
                return db[keys[i]];
            }
        }
        return null;
    }

    // ─── Get ingredient description in current language ─
    function getDescription(info) {
        if (!info) return t('unknownIngredient');
        var lang = getLang();
        // Check for description_xx field
        if (lang === 'fr' && info.description_fr) return info.description_fr;
        if (lang === 'en' && info.description_en) return info.description_en;
        if (lang === 'de' && info.description_de) return info.description_de;
        if (lang === 'es' && info.description_es) return info.description_es;
        // Fallback chain: en -> fr
        return info.description_en || info.description_fr || t('unknownIngredient');
    }

    // ─── Safety label translation ───────────────────────
    function safetyLabel(safety) {
        if (safety === 'excellent') return t('safetyExcellent');
        if (safety === 'good') return t('safetyGood');
        if (safety === 'moderate') return t('safetyModerate');
        if (safety === 'caution') return t('safetyCaution');
        return t('safetyUnknown');
    }

    // ─── Origin label translation ───────────────────────
    function originLabel(origin) {
        if (origin === 'natural') return t('originNatural');
        if (origin === 'mineral') return t('originMineral');
        if (origin === 'synthetic') return t('originSynthetic');
        return t('originUnknown');
    }

    // ═══════════════════════════════════════════════════
    // getScore(product) — main scoring function
    // ═══════════════════════════════════════════════════

    function getScore(product) {
        var ingredientStr = product.ingredients || '';
        var parsed = parseIngredients(ingredientStr);
        if (parsed.length === 0) {
            return { score: 0, grade: 'D', breakdown: {}, ingredients: [] };
        }

        var total = parsed.length;
        var naturalCount = 0;
        var ewgSum = 0;
        var ingredientDetails = [];

        for (var i = 0; i < parsed.length; i++) {
            var name = parsed[i];
            var info = findIngredient(name);

            if (info) {
                var ewg = info.ewg_score || 1;
                ewgSum += ewg;
                if (info.origin === 'natural' || info.origin === 'mineral') {
                    naturalCount++;
                }
                ingredientDetails.push({
                    name: name,
                    found: true,
                    safety: info.safety,
                    score: info.score,
                    ewg_score: ewg,
                    category: info.category,
                    origin: info.origin,
                    color: SAFETY_COLORS[info.safety] || '#9ca3af',
                    description_fr: info.description_fr || '',
                    description_en: info.description_en || ''
                });
            } else {
                // Unknown ingredients get default "good" rating
                ewgSum += 3;
                ingredientDetails.push({
                    name: name,
                    found: false,
                    safety: 'good',
                    score: 75,
                    ewg_score: 3,
                    category: 'unknown',
                    origin: 'unknown',
                    color: SAFETY_COLORS.good,
                    description_fr: 'Ingredient non reference dans notre base.',
                    description_en: 'Ingredient not referenced in our database.'
                });
            }
        }

        // ── 1) Natural origin (40%) ─────────────────────
        // % of ingredients classified as natural or mineral
        var naturalPct = (naturalCount / total) * 100;
        var naturalScore = Math.min(100, naturalPct * 1.25);

        // ── 2) Safety profile (35%) ─────────────────────
        // Inverted average EWG score: lower EWG = higher safety score
        // EWG range 1-10, so inverted: (10 - avg) / 9 * 100
        var avgEwg = ewgSum / total;
        var safetyScore = Math.max(0, Math.min(100, ((10 - avgEwg) / 9) * 100));

        // ── 3) Certifications (15%) ─────────────────────
        // Check product.certifications array for: CE, cruelty-free, eco-packaging
        var certScore = 0;
        var certs = product.certifications || [];
        var certCount = 0;
        for (var c = 0; c < certs.length; c++) {
            var cert = (certs[c] || '').toLowerCase();
            if (cert.indexOf('ce') >= 0 || cert.indexOf('conforme') >= 0) certCount++;
            if (cert.indexOf('cruelty') >= 0 || cert.indexOf('vegan') >= 0 || cert.indexOf('leaping bunny') >= 0) certCount++;
            if (cert.indexOf('eco') >= 0 || cert.indexOf('recyclable') >= 0 || cert.indexOf('packaging') >= 0 || cert.indexOf('biodegradable') >= 0) certCount++;
        }
        // Each certification is worth 33.3 points, capped at 100
        certScore = Math.min(100, Math.round((certCount / 3) * 100));

        // ── 4) Simplicity (10%) ─────────────────────────
        // Bonus if < 10 ingredients
        var simplicityScore;
        if (total <= 5) {
            simplicityScore = 100;
        } else if (total <= 10) {
            simplicityScore = 90;
        } else if (total <= 15) {
            simplicityScore = 70;
        } else if (total <= 20) {
            simplicityScore = 50;
        } else {
            simplicityScore = 30;
        }

        // ── Final weighted score ────────────────────────
        var finalScore = Math.round(
            naturalScore * 0.40 +
            safetyScore * 0.35 +
            certScore * 0.15 +
            simplicityScore * 0.10
        );
        finalScore = Math.max(0, Math.min(100, finalScore));

        // ── Determine grade ─────────────────────────────
        var gradeInfo = GRADE_MAP[GRADE_MAP.length - 1];
        for (var g = 0; g < GRADE_MAP.length; g++) {
            if (finalScore >= GRADE_MAP[g].min) {
                gradeInfo = GRADE_MAP[g];
                break;
            }
        }

        return {
            score: finalScore,
            grade: gradeInfo.grade,
            color: gradeInfo.color,
            breakdown: {
                natural: Math.round(naturalScore),
                safety: Math.round(safetyScore),
                certifications: Math.round(certScore),
                simplicity: Math.round(simplicityScore),
                naturalPct: Math.round(naturalPct),
                avgEwg: Math.round(avgEwg * 10) / 10,
                totalIngredients: total,
                naturalCount: naturalCount
            },
            ingredients: ingredientDetails
        };
    }

    // ═══════════════════════════════════════════════════
    // renderSection(product) — returns { html, result }
    // ═══════════════════════════════════════════════════

    function renderSection(product) {
        var result = getScore(product);

        var html = '';
        html += '<div class="cb-section">';

        // ── Title ───────────────────────────────────────
        html += '<h2 class="cb-title" style="font-size:1.15rem;font-weight:700;margin-bottom:16px;">' + escapeHtml(t('title')) + '</h2>';

        // ── Score row: gauge + breakdown bars ───────────
        html += '<div class="cb-score-row" style="display:flex;align-items:center;gap:24px;margin:16px 0;flex-wrap:wrap;">';

        // Circular gauge (CSS-only with SVG)
        html += renderGauge(result, 100);

        // Breakdown bars
        html += '<div class="cb-breakdown" style="flex:1;min-width:200px;">';
        var bars = [
            { label: t('natural'), value: result.breakdown.natural, weight: '40%' },
            { label: t('safety'), value: result.breakdown.safety, weight: '35%' },
            { label: t('certs'), value: result.breakdown.certifications, weight: '15%' },
            { label: t('simplicity'), value: result.breakdown.simplicity, weight: '10%' }
        ];
        for (var b = 0; b < bars.length; b++) {
            var bar = bars[b];
            var barColor = bar.value >= 80 ? '#22c55e' : bar.value >= 60 ? '#eab308' : '#ef4444';
            html += '<div style="margin-bottom:8px;">';
            html += '<div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px;">';
            html += '<span>' + escapeHtml(bar.label) + ' <span style="opacity:0.5;">(' + bar.weight + ')</span></span>';
            html += '<span style="font-weight:600;">' + bar.value + '/100</span>';
            html += '</div>';
            html += '<div style="height:6px;background:#e8e4de;border-radius:3px;overflow:hidden;">';
            html += '<div style="height:100%;width:' + bar.value + '%;background:' + barColor + ';border-radius:3px;transition:width 1s ease;"></div>';
            html += '</div></div>';
        }
        html += '</div>'; // .cb-breakdown
        html += '</div>'; // .cb-score-row

        // ── Ingredients pills ───────────────────────────
        html += '<div class="cb-ingredients-label" style="font-size:0.85rem;font-weight:600;margin:16px 0 8px 0;">' + escapeHtml(t('ingredientsLabel')) + ' (' + result.ingredients.length + ')</div>';
        html += renderIngredients(result);

        // ── Disclaimer ──────────────────────────────────
        html += '<p class="cb-disclaimer" style="font-size:0.72rem;color:var(--color-text-light,#6b6560);margin-top:14px;font-style:italic;">' + escapeHtml(t('disclaimer')) + '</p>';

        // ── Hidden tooltip container ────────────────────
        html += '<div id="cbTooltip" class="cb-tooltip" style="display:none;position:fixed;z-index:9999;max-width:320px;padding:16px;background:var(--color-white,#fff);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);font-size:0.85rem;line-height:1.5;border:1px solid var(--color-border,#e8e4de);"></div>';

        html += '</div>'; // .cb-section

        return { html: html, result: result };
    }

    // ─── Render circular gauge (CSS-only SVG) ───────────
    function renderGauge(result, size) {
        size = size || 100;
        var pct = result.score;
        var circumference = 2 * Math.PI * 36;
        var offset = circumference - (pct / 100) * circumference;
        var lang = getLang();
        var gradeInfo = null;
        for (var g = 0; g < GRADE_MAP.length; g++) {
            if (pct >= GRADE_MAP[g].min) {
                gradeInfo = GRADE_MAP[g];
                break;
            }
        }
        if (!gradeInfo) gradeInfo = GRADE_MAP[GRADE_MAP.length - 1];
        var label = gradeInfo['label_' + lang] || gradeInfo.label_fr;

        var html = '';
        html += '<div class="cb-gauge" style="width:' + size + 'px;height:' + size + 'px;position:relative;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">';
        html += '<svg viewBox="0 0 80 80" style="transform:rotate(-90deg);width:100%;height:100%;position:absolute;">';
        html += '<circle cx="40" cy="40" r="36" fill="none" stroke="#e8e4de" stroke-width="5"/>';
        html += '<circle cx="40" cy="40" r="36" fill="none" stroke="' + result.color + '" stroke-width="5" ';
        html += 'stroke-dasharray="' + circumference.toFixed(2) + '" stroke-dashoffset="' + offset.toFixed(2) + '" stroke-linecap="round" ';
        html += 'style="transition:stroke-dashoffset 1s ease;"/>';
        html += '</svg>';
        html += '<div style="text-align:center;position:relative;z-index:1;">';
        html += '<div style="font-size:' + Math.round(size * 0.28) + 'px;font-weight:800;color:' + result.color + ';">' + result.grade + '</div>';
        html += '<div style="font-size:' + Math.round(size * 0.14) + 'px;font-weight:600;color:var(--color-text,#2d2926);">' + pct + '<span style="font-size:0.7em;opacity:0.6;">/100</span></div>';
        html += '<div style="font-size:' + Math.round(size * 0.10) + 'px;color:var(--color-text-light,#6b6560);margin-top:2px;">' + escapeHtml(label) + '</div>';
        html += '</div></div>';

        return html;
    }

    // ─── Render ingredients as colored pills ────────────
    function renderIngredients(result) {
        var html = '<div class="cb-ingredients-list" style="display:flex;flex-wrap:wrap;gap:8px;">';
        for (var i = 0; i < result.ingredients.length; i++) {
            var ing = result.ingredients[i];
            var originIcon = ing.origin === 'natural' ? '\uD83C\uDF3F' : ing.origin === 'mineral' ? '\uD83D\uDC8E' : '\uD83E\uDDEA';
            html += '<button class="cb-pill" data-idx="' + i + '" type="button" style="';
            html += 'display:inline-flex;align-items:center;gap:6px;padding:6px 12px;';
            html += 'border-radius:20px;font-size:0.8rem;cursor:pointer;';
            html += 'background:rgba(' + hexToRgb(ing.color) + ',0.1);';
            html += 'border:1px solid ' + ing.color + ';color:var(--color-text,#2d2926);';
            html += 'transition:all 0.2s;font-family:inherit;">';
            html += '<span style="width:8px;height:8px;border-radius:50%;background:' + ing.color + ';flex-shrink:0;"></span>';
            html += originIcon + ' ' + escapeHtml(ing.name);
            html += '</button>';
        }
        html += '</div>';
        return html;
    }

    // ═══════════════════════════════════════════════════
    // bindTooltips(result) — click events on pills
    // ═══════════════════════════════════════════════════

    function bindTooltips(result) {
        var pills = document.querySelectorAll('.cb-pill');
        var tooltip = document.getElementById('cbTooltip');
        if (!tooltip || !pills.length) return;

        for (var p = 0; p < pills.length; p++) {
            (function(pill) {
                pill.addEventListener('click', function(e) {
                    var idx = parseInt(this.getAttribute('data-idx'), 10);
                    var ing = result.ingredients[idx];
                    if (!ing) return;

                    var desc = getDescription(ing);
                    var safetyText = safetyLabel(ing.safety);
                    var originText = originLabel(ing.origin);
                    var originIcon = ing.origin === 'natural' ? '\uD83C\uDF3F' : ing.origin === 'mineral' ? '\uD83D\uDC8E' : '\uD83E\uDDEA';

                    var tooltipHtml = '';
                    tooltipHtml += '<div style="font-weight:700;font-size:0.95rem;margin-bottom:8px;">' + escapeHtml(ing.name) + '</div>';
                    tooltipHtml += '<div style="display:flex;gap:8px;margin-bottom:10px;font-size:0.78rem;flex-wrap:wrap;">';
                    tooltipHtml += '<span style="padding:3px 10px;border-radius:10px;background:rgba(' + hexToRgb(ing.color) + ',0.15);color:' + ing.color + ';font-weight:600;">' + escapeHtml(safetyText) + '</span>';
                    tooltipHtml += '<span style="padding:3px 10px;border-radius:10px;background:var(--color-bg-alt,#f3efe9);">' + originIcon + ' ' + escapeHtml(originText) + '</span>';
                    if (ing.ewg_score) {
                        tooltipHtml += '<span style="padding:3px 10px;border-radius:10px;background:var(--color-bg-alt,#f3efe9);font-size:0.72rem;">EWG ' + ing.ewg_score + '/10</span>';
                    }
                    tooltipHtml += '</div>';
                    tooltipHtml += '<div style="color:var(--color-text,#2d2926);line-height:1.6;">' + escapeHtml(desc) + '</div>';

                    tooltip.innerHTML = tooltipHtml;

                    // Position tooltip near the pill
                    var rect = pill.getBoundingClientRect();
                    tooltip.style.display = 'block';
                    var tooltipRect = tooltip.getBoundingClientRect();

                    // Prefer below the pill, but flip above if near bottom
                    var top = rect.bottom + 8;
                    if (top + tooltipRect.height > window.innerHeight - 16) {
                        top = rect.top - tooltipRect.height - 8;
                    }
                    var left = Math.max(8, Math.min(rect.left, window.innerWidth - 340));

                    tooltip.style.top = top + 'px';
                    tooltip.style.left = left + 'px';

                    e.stopPropagation();
                });
            })(pills[p]);
        }

        // Close tooltip on outside click
        document.addEventListener('click', function() {
            if (tooltip) tooltip.style.display = 'none';
        });
    }

    // ═══════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════

    function hexToRgb(hex) {
        hex = (hex || '#9ca3af').replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16) || 0;
        var g = parseInt(hex.substring(2, 4), 16) || 0;
        var b = parseInt(hex.substring(4, 6), 16) || 0;
        return r + ',' + g + ',' + b;
    }

    function escapeHtml(str) {
        if (!str) return '';
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function escapeAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ═══════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════

    return {
        getScore: getScore,
        renderSection: renderSection,
        renderGauge: renderGauge,
        renderIngredients: renderIngredients,
        bindTooltips: bindTooltips,
        SAFETY_COLORS: SAFETY_COLORS
    };
})();

// Expose globally
window.CleanBeauty = CleanBeauty;
