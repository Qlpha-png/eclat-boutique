// ============================
// ECLAT Beaute — Clean Beauty Score Algorithm
// Score 0-100 par produit base sur composition INCI
// Fonctionne avec window.INGREDIENTS_DB (ingredients-db.js)
// Disclaimer : informatif, pas un avis medical ou dermatologique
// ============================

(function() {
    'use strict';

    // ─── Grade mapping ──────────────────────────────────
    var GRADES = [
        { min: 95,  grade: 'A+', label: 'Excellent',     color: '#2d8a4e' },
        { min: 85,  grade: 'A',  label: 'Très bon',      color: '#4caf50' },
        { min: 70,  grade: 'B',  label: 'Bon',           color: '#8bc34a' },
        { min: 55,  grade: 'C',  label: 'Acceptable',    color: '#ff9800' },
        { min: 0,   grade: 'D',  label: 'À améliorer',   color: '#f44336' }
    ];

    // ─── Safety classification thresholds ────────────────
    var SAFETY_LABELS = {
        excellent: { min: 90,  label: 'excellent' },
        good:      { min: 70,  label: 'good' },
        moderate:  { min: 50,  label: 'moderate' },
        caution:   { min: 0,   label: 'caution' }
    };

    // ─── Disclaimer translations ────────────────────────
    var DISCLAIMERS = {
        fr: 'Score basé sur la composition INCI déclarée. Ne constitue pas un avis médical ou dermatologique.',
        en: 'Score based on the declared INCI composition. This does not constitute medical or dermatological advice.',
        es: 'Puntuación basada en la composición INCI declarada. No constituye un consejo médico o dermatológico.',
        de: 'Bewertung basierend auf der deklarierten INCI-Zusammensetzung. Stellt keine medizinische oder dermatologische Beratung dar.'
    };

    // ═══════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════

    function clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    function roundScore(value) {
        return Math.round(clamp(value, 0, 100));
    }

    /**
     * Parse ingredients from product object.
     * Accepts product.ingredients (comma-separated string) or product.ingredients_list (array).
     */
    function parseIngredients(product) {
        if (product.ingredients_list && product.ingredients_list.length) {
            var list = [];
            for (var i = 0; i < product.ingredients_list.length; i++) {
                var trimmed = (product.ingredients_list[i] || '').replace(/^\s+|\s+$/g, '');
                if (trimmed.length > 0) {
                    list.push(trimmed);
                }
            }
            return list;
        }
        if (product.ingredients && typeof product.ingredients === 'string') {
            var parts = product.ingredients.split(',');
            var result = [];
            for (var j = 0; j < parts.length; j++) {
                var part = parts[j].replace(/^\s+|\s+$/g, '');
                if (part.length > 0) {
                    result.push(part);
                }
            }
            return result;
        }
        return [];
    }

    /**
     * Look up an ingredient in window.INGREDIENTS_DB.
     * Case-insensitive, also strips parenthetical content for matching.
     */
    function findInDB(name) {
        var db = window.INGREDIENTS_DB;
        if (!db) return null;

        // Exact match
        if (db[name]) return db[name];

        // Strip parentheticals: "Tocopherol (Vitamin E)" -> "Tocopherol"
        var normalized = name.replace(/\s*\([^)]*\)\s*/g, '').replace(/^\s+|\s+$/g, '');
        if (normalized !== name && db[normalized]) return db[normalized];

        // Case-insensitive search
        var lowerName = name.toLowerCase();
        var lowerNorm = normalized.toLowerCase();
        var keys = Object.keys(db);
        for (var i = 0; i < keys.length; i++) {
            var keyLower = keys[i].toLowerCase();
            if (keyLower === lowerName || keyLower === lowerNorm) {
                return db[keys[i]];
            }
        }

        return null;
    }

    /**
     * Classify a numeric safety score into a safety label.
     */
    function classifySafety(score) {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'moderate';
        return 'caution';
    }

    /**
     * Determine grade info from a final score.
     */
    function getGradeInfo(score) {
        for (var i = 0; i < GRADES.length; i++) {
            if (score >= GRADES[i].min) {
                return GRADES[i];
            }
        }
        return GRADES[GRADES.length - 1];
    }

    // ═══════════════════════════════════════════════════
    // getCleanBeautyScore(product) — main scoring function
    // ═══════════════════════════════════════════════════

    function getCleanBeautyScore(product) {
        if (!product) {
            product = {};
        }

        var ingredientNames = parseIngredients(product);
        var total = ingredientNames.length;

        // Edge case: no ingredients
        if (total === 0) {
            var emptyGrade = getGradeInfo(0);
            return {
                score: 0,
                grade: emptyGrade.grade,
                label: emptyGrade.label,
                color: emptyGrade.color,
                breakdown: {
                    natural_origin: { score: 0, weight: 0.40, detail: '0/0 ingrédients naturels' },
                    safety_profile: { score: 0, weight: 0.35, detail: 'Score sécurité moyen: 0' },
                    simplicity: { score: 100, weight: 0.15, detail: '0 ingrédients' },
                    certifications: { score: 0, weight: 0.10, detail: 'Aucune certification détectée' }
                },
                ingredients_analyzed: [],
                unknown_count: 0
            };
        }

        // ── Analyze each ingredient ─────────────────────
        var naturalCount = 0;
        var safetyScoreSum = 0;
        var knownSafetyCount = 0;
        var unknownCount = 0;
        var ingredientsAnalyzed = [];

        for (var i = 0; i < ingredientNames.length; i++) {
            var name = ingredientNames[i];
            var dbEntry = findInDB(name);

            if (dbEntry) {
                var entryScore = typeof dbEntry.score === 'number' ? dbEntry.score : 75;
                var entryOrigin = dbEntry.origin || 'unknown';
                var entrySafety = dbEntry.safety || classifySafety(entryScore);

                // Count natural or bio-derived ingredients
                if (entryOrigin === 'natural' || entryOrigin === 'bio-derived') {
                    naturalCount++;
                }

                safetyScoreSum += entryScore;
                knownSafetyCount++;

                ingredientsAnalyzed.push({
                    name: name,
                    safety: entrySafety,
                    origin: entryOrigin,
                    score: entryScore
                });
            } else {
                unknownCount++;
                ingredientsAnalyzed.push({
                    name: name,
                    safety: 'unknown',
                    origin: 'unknown',
                    score: 0
                });
            }
        }

        // ── 1) Natural Origin (40%) ─────────────────────
        // Percentage of ingredients that are natural or bio-derived.
        // 100% natural = score 100
        var naturalOriginScore = total > 0 ? roundScore((naturalCount / total) * 100) : 0;

        // ── 2) Safety Profile (35%) ─────────────────────
        // Average safety score of all known ingredients from INGREDIENTS_DB[name].score
        var avgSafety = knownSafetyCount > 0 ? (safetyScoreSum / knownSafetyCount) : 0;
        var safetyProfileScore = roundScore(avgSafety);

        // ── 3) Simplicity (15%) ─────────────────────────
        // Fewer ingredients is better
        var simplicityScore;
        if (total <= 5) {
            simplicityScore = 100;
        } else if (total <= 10) {
            simplicityScore = 80;
        } else if (total <= 15) {
            simplicityScore = 60;
        } else if (total <= 20) {
            simplicityScore = 40;
        } else {
            simplicityScore = 20;
        }

        // ── 4) Certifications (10%) ─────────────────────
        // Check product properties: cruelty_free, eco_packaging, vegan
        var certPoints = 0;
        var certDetails = [];
        if (product.cruelty_free) {
            certPoints += 33;
            certDetails.push('Cruelty-free');
        }
        if (product.eco_packaging) {
            certPoints += 33;
            certDetails.push('Eco-packaging');
        }
        if (product.vegan) {
            certPoints += 34;
            certDetails.push('Vegan');
        }
        var certificationsScore = roundScore(certPoints);
        var certDetailStr = certDetails.length > 0
            ? certDetails.join(', ')
            : 'Aucune certification détectée';

        // ── Final weighted score ────────────────────────
        var finalScore = roundScore(
            naturalOriginScore * 0.40 +
            safetyProfileScore * 0.35 +
            simplicityScore * 0.15 +
            certificationsScore * 0.10
        );

        // ── Determine grade ─────────────────────────────
        var gradeInfo = getGradeInfo(finalScore);

        return {
            score: finalScore,
            grade: gradeInfo.grade,
            label: gradeInfo.label,
            color: gradeInfo.color,
            breakdown: {
                natural_origin: {
                    score: naturalOriginScore,
                    weight: 0.40,
                    detail: naturalCount + '/' + total + ' ingrédients naturels'
                },
                safety_profile: {
                    score: safetyProfileScore,
                    weight: 0.35,
                    detail: 'Score sécurité moyen: ' + (knownSafetyCount > 0 ? Math.round(avgSafety * 10) / 10 : 0)
                },
                simplicity: {
                    score: simplicityScore,
                    weight: 0.15,
                    detail: total + ' ingrédients'
                },
                certifications: {
                    score: certificationsScore,
                    weight: 0.10,
                    detail: certDetailStr
                }
            },
            ingredients_analyzed: ingredientsAnalyzed,
            unknown_count: unknownCount
        };
    }

    // ═══════════════════════════════════════════════════
    // renderCleanBeautyBadge(container, score) — CSS-only circular gauge
    // ═══════════════════════════════════════════════════

    /**
     * Render a Clean Beauty Score badge into a container element.
     * @param {HTMLElement|string} container — DOM element or CSS selector
     * @param {object} scoreResult — result from getCleanBeautyScore()
     *   If a number is passed, it is treated as a raw score and graded automatically.
     */
    function renderCleanBeautyBadge(container, scoreResult) {
        // Resolve container
        var el;
        if (typeof container === 'string') {
            el = document.querySelector(container);
        } else {
            el = container;
        }
        if (!el) return;

        // Accept either a full result object or a raw number
        var score, grade, label, color;
        if (typeof scoreResult === 'number') {
            score = roundScore(scoreResult);
            var info = getGradeInfo(score);
            grade = info.grade;
            label = info.label;
            color = info.color;
        } else if (scoreResult && typeof scoreResult === 'object') {
            score = scoreResult.score || 0;
            grade = scoreResult.grade || 'D';
            label = scoreResult.label || 'À améliorer';
            color = scoreResult.color || '#f44336';
        } else {
            return;
        }

        // Determine size from container data attribute or default
        // data-size="product-page" -> 100px, anything else -> 60px
        var sizeAttr = el.getAttribute('data-size');
        var diameter = (sizeAttr === 'product-page' || sizeAttr === 'large') ? 100 : 60;
        var isLarge = diameter === 100;

        // Build the percentage for the conic-gradient
        var pct = clamp(score, 0, 100);
        var gradientAngle = (pct / 100) * 360;

        // Font sizes scale with diameter
        var gradeFontSize = isLarge ? '22px' : '14px';
        var scoreFontSize = isLarge ? '11px' : '8px';
        var labelFontSize = isLarge ? '9px' : '0';

        // Build badge HTML
        var html = '';
        html += '<div class="cb-badge" style="';
        html += 'position:relative;';
        html += 'display:inline-flex;';
        html += 'align-items:center;';
        html += 'justify-content:center;';
        html += 'width:' + diameter + 'px;';
        html += 'height:' + diameter + 'px;';
        html += 'border-radius:50%;';
        html += 'background:conic-gradient(' + color + ' 0deg,' + color + ' ' + gradientAngle + 'deg,#e8e4de ' + gradientAngle + 'deg,#e8e4de 360deg);';
        html += 'font-family:inherit;';
        html += '">';

        // Inner circle (white center)
        var innerDiameter = Math.round(diameter * 0.78);
        html += '<div class="cb-badge-inner" style="';
        html += 'position:absolute;';
        html += 'width:' + innerDiameter + 'px;';
        html += 'height:' + innerDiameter + 'px;';
        html += 'border-radius:50%;';
        html += 'background:#fff;';
        html += 'display:flex;';
        html += 'flex-direction:column;';
        html += 'align-items:center;';
        html += 'justify-content:center;';
        html += 'text-align:center;';
        html += 'line-height:1.15;';
        html += '">';

        // Grade letter
        html += '<span class="cb-badge-grade" style="';
        html += 'font-size:' + gradeFontSize + ';';
        html += 'font-weight:800;';
        html += 'color:' + color + ';';
        html += 'line-height:1;';
        html += '">' + escapeHtml(grade) + '</span>';

        // Score number
        html += '<span class="cb-badge-score" style="';
        html += 'font-size:' + scoreFontSize + ';';
        html += 'font-weight:600;';
        html += 'color:#2d2926;';
        html += 'line-height:1;';
        html += 'margin-top:1px;';
        html += '">' + score + '/100</span>';

        // Label (only on large badges)
        if (isLarge) {
            html += '<span class="cb-badge-label" style="';
            html += 'font-size:' + labelFontSize + ';';
            html += 'color:#6b6560;';
            html += 'line-height:1;';
            html += 'margin-top:2px;';
            html += 'max-width:' + Math.round(innerDiameter * 0.85) + 'px;';
            html += 'overflow:hidden;';
            html += 'text-overflow:ellipsis;';
            html += 'white-space:nowrap;';
            html += '">' + escapeHtml(label) + '</span>';
        }

        html += '</div>'; // .cb-badge-inner
        html += '</div>'; // .cb-badge

        el.innerHTML = html;
    }

    // ═══════════════════════════════════════════════════
    // getDisclaimer(lang) — return localized disclaimer
    // ═══════════════════════════════════════════════════

    function getDisclaimer(lang) {
        if (lang && DISCLAIMERS[lang]) {
            return DISCLAIMERS[lang];
        }
        // Try to detect current language
        if (typeof currentLang !== 'undefined' && DISCLAIMERS[currentLang]) {
            return DISCLAIMERS[currentLang];
        }
        var htmlLang = '';
        try {
            htmlLang = document.documentElement.lang || '';
        } catch (e) {
            // Not in a browser environment
        }
        if (htmlLang && DISCLAIMERS[htmlLang]) {
            return DISCLAIMERS[htmlLang];
        }
        return DISCLAIMERS.fr;
    }

    // ─── Utility: escape HTML for safe rendering ────────
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ═══════════════════════════════════════════════════
    // renderSection(product) — full product page section
    // ═══════════════════════════════════════════════════

    function renderSection(product) {
        var result = getCleanBeautyScore(product);
        var html = '<div class="pp-section"><h2>Composition & Clean Beauty Score</h2>';

        // Score badge + breakdown row
        html += '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;">';

        // Badge container
        html += '<div id="cbBadgeContainer" data-size="product-page" style="flex-shrink:0;"></div>';

        // Breakdown
        html += '<div style="flex:1;min-width:200px;">';
        html += '<div style="font-size:1.1rem;font-weight:700;color:' + result.color + ';margin-bottom:8px;">' + escapeHtml(result.label) + ' (' + result.score + '/100)</div>';
        if (result.breakdown) {
            var bk = result.breakdown;
            var rows = [
                { label: 'Origine naturelle', data: bk.natural_origin },
                { label: 'Profil s\u00e9curit\u00e9', data: bk.safety_profile },
                { label: 'Simplicit\u00e9', data: bk.simplicity },
                { label: 'Certifications', data: bk.certifications }
            ];
            for (var r = 0; r < rows.length; r++) {
                if (!rows[r].data) continue;
                var pct = Math.round(rows[r].data.score * rows[r].data.weight * 100) / 100;
                html += '<div style="margin-bottom:6px;">';
                html += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:2px;">';
                html += '<span>' + rows[r].label + '</span>';
                html += '<span style="color:var(--color-text-light);">' + escapeHtml(rows[r].data.detail) + '</span>';
                html += '</div>';
                html += '<div style="height:4px;background:var(--color-border);border-radius:2px;overflow:hidden;">';
                html += '<div style="height:100%;width:' + Math.min(rows[r].data.score, 100) + '%;background:' + result.color + ';border-radius:2px;"></div>';
                html += '</div></div>';
            }
        }
        html += '</div></div>';

        // Ingredients list as clickable pills
        if (result.ingredients_analyzed && result.ingredients_analyzed.length > 0) {
            html += '<div style="margin-top:16px;"><div style="font-size:0.85rem;font-weight:600;margin-bottom:8px;">Ingr\u00e9dients analys\u00e9s :</div>';
            html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
            var safetyColors = { excellent: '#2d8a4e', good: '#4caf50', moderate: '#ff9800', caution: '#f44336' };
            for (var i = 0; i < result.ingredients_analyzed.length; i++) {
                var ing = result.ingredients_analyzed[i];
                var sc = safetyColors[ing.safety] || '#999';
                html += '<span class="cb-pill" data-cb-idx="' + i + '" style="font-size:0.75rem;padding:4px 10px;' +
                    'border-radius:12px;cursor:pointer;transition:all 0.2s;border:1px solid ' + sc + ';color:' + sc + ';' +
                    'background:rgba(' + hexToRgb(sc) + ',0.08);">' + escapeHtml(ing.name) + '</span>';
            }
            html += '</div></div>';
        }

        // Unknown ingredients
        if (result.unknown_count > 0) {
            html += '<div style="font-size:0.78rem;color:var(--color-text-light);margin-top:8px;">' + result.unknown_count + ' ingr\u00e9dient(s) non r\u00e9f\u00e9renc\u00e9(s)</div>';
        }

        // Raw ingredients text
        if (product.ingredients) {
            html += '<div style="margin-top:12px;"><details><summary style="font-size:0.82rem;cursor:pointer;color:var(--color-secondary);font-weight:600;">Voir la composition compl\u00e8te (INCI)</summary>';
            html += '<div class="pp-ingredients" style="margin-top:8px;">' + escapeHtml(product.ingredients) + '</div>';
            html += '</details></div>';
        }

        // Disclaimer
        html += '<div style="font-size:0.72rem;color:var(--color-text-light);margin-top:12px;font-style:italic;">' + escapeHtml(getDisclaimer()) + '</div>';

        html += '</div>';

        return { html: html, result: result };
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        return r + ',' + g + ',' + b;
    }

    function bindTooltips(result) {
        if (!result || !result.ingredients_analyzed) return;

        // Render the badge now that DOM is ready
        var badgeEl = document.getElementById('cbBadgeContainer');
        if (badgeEl) renderCleanBeautyBadge(badgeEl, result);

        // Bind pill click tooltips
        var pills = document.querySelectorAll('.cb-pill[data-cb-idx]');
        for (var i = 0; i < pills.length; i++) {
            (function(pill) {
                pill.addEventListener('click', function(e) {
                    var idx = parseInt(pill.getAttribute('data-cb-idx'), 10);
                    var ing = result.ingredients_analyzed[idx];
                    if (!ing) return;

                    // Remove any existing tooltip
                    var existing = document.querySelector('.cb-tooltip');
                    if (existing) existing.remove();

                    // Get full info from DB
                    var info = (typeof window.getIngredientInfo === 'function') ? window.getIngredientInfo(ing.name) : null;

                    var tooltip = document.createElement('div');
                    tooltip.className = 'cb-tooltip';
                    tooltip.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--color-white,#fff);border:1px solid var(--color-border);border-radius:12px;padding:20px;max-width:360px;width:90%;z-index:10001;box-shadow:0 8px 32px rgba(0,0,0,0.15);';

                    var safetyLabels = { excellent: 'Excellent', good: 'Bon', moderate: 'Mod\u00e9r\u00e9', caution: 'Attention' };
                    var safetyColors = { excellent: '#2d8a4e', good: '#4caf50', moderate: '#ff9800', caution: '#f44336' };
                    var originLabels = { natural: 'Naturel', synthetic: 'Synth\u00e9tique', mineral: 'Min\u00e9ral', 'bio-derived': 'Bio-d\u00e9riv\u00e9' };

                    var ttHtml = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
                    ttHtml += '<strong style="font-size:1rem;">' + escapeHtml(ing.name) + '</strong>';
                    ttHtml += '<button onclick="this.closest(\'.cb-tooltip\').remove()" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--color-text-light);">\u00d7</button>';
                    ttHtml += '</div>';
                    ttHtml += '<div style="display:flex;gap:8px;margin-bottom:10px;">';
                    ttHtml += '<span style="font-size:0.75rem;padding:3px 8px;border-radius:10px;background:' + (safetyColors[ing.safety] || '#999') + ';color:#fff;">' + (safetyLabels[ing.safety] || ing.safety) + '</span>';
                    if (ing.origin) ttHtml += '<span style="font-size:0.75rem;padding:3px 8px;border-radius:10px;background:var(--color-bg-alt);color:var(--color-text);">' + (originLabels[ing.origin] || ing.origin) + '</span>';
                    ttHtml += '<span style="font-size:0.75rem;padding:3px 8px;border-radius:10px;background:var(--color-bg-alt);color:var(--color-text);">' + ing.score + '/100</span>';
                    ttHtml += '</div>';

                    if (info && info.description_fr) {
                        ttHtml += '<p style="font-size:0.85rem;color:var(--color-text);line-height:1.6;margin:0;">' + escapeHtml(info.description_fr) + '</p>';
                    }
                    if (info && info.category) {
                        ttHtml += '<div style="font-size:0.75rem;color:var(--color-text-light);margin-top:8px;">Cat\u00e9gorie : ' + escapeHtml(info.category) + '</div>';
                    }

                    tooltip.innerHTML = ttHtml;

                    // Backdrop
                    var backdrop = document.createElement('div');
                    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:10000;';
                    backdrop.onclick = function() { backdrop.remove(); tooltip.remove(); };

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);
                });
            })(pills[i]);
        }
    }

    // ═══════════════════════════════════════════════════
    // Expose public API
    // ═══════════════════════════════════════════════════

    window.CleanBeauty = {
        getScore: getCleanBeautyScore,
        renderBadge: renderCleanBeautyBadge,
        renderSection: renderSection,
        bindTooltips: bindTooltips,
        getDisclaimer: getDisclaimer
    };

    // Also expose renderBadge at window level for convenience
    window.renderCleanBeautyBadge = renderCleanBeautyBadge;

})();
