// ============================
// ÉCLAT — Clean Beauty Score Algorithm
// Score 0-100 par produit basé sur composition
// Disclaimer : informatif, pas un avis médical
// ============================

var CleanBeauty = (function() {
    'use strict';

    var GRADE_MAP = [
        { min: 90, grade: 'A', label_fr: 'Excellent', label_en: 'Excellent', color: '#22c55e' },
        { min: 75, grade: 'B', label_fr: 'Très bien', label_en: 'Very good', color: '#84cc16' },
        { min: 60, grade: 'C', label_fr: 'Correct', label_en: 'Fair', color: '#eab308' },
        { min: 0,  grade: 'D', label_fr: 'À améliorer', label_en: 'Needs improvement', color: '#ef4444' }
    ];

    var SAFETY_COLORS = {
        excellent: '#22c55e',
        good: '#84cc16',
        moderate: '#eab308',
        caution: '#ef4444'
    };

    // Parse ingredients string into array
    function parseIngredients(ingredientStr) {
        if (!ingredientStr) return [];
        return ingredientStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    }

    // Find ingredient in DB (fuzzy match)
    function findIngredient(name) {
        if (!window.INGREDIENTS_DB) return null;
        // Exact match
        if (INGREDIENTS_DB[name]) return INGREDIENTS_DB[name];
        // Normalize and search
        var normalized = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
        if (INGREDIENTS_DB[normalized]) return INGREDIENTS_DB[normalized];
        // Partial match
        var keys = Object.keys(INGREDIENTS_DB);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].toLowerCase() === name.toLowerCase() ||
                keys[i].toLowerCase() === normalized.toLowerCase()) {
                return INGREDIENTS_DB[keys[i]];
            }
        }
        return null;
    }

    // Compute Clean Beauty Score for a product
    function getScore(product) {
        var ingredientStr = product.ingredients || '';
        var parsed = parseIngredients(ingredientStr);
        if (parsed.length === 0) return { score: 0, grade: 'D', breakdown: {}, ingredients: [] };

        var total = parsed.length;
        var naturalCount = 0;
        var safetySum = 0;
        var knownCount = 0;
        var ingredientDetails = [];

        for (var i = 0; i < parsed.length; i++) {
            var name = parsed[i];
            var info = findIngredient(name);
            if (info) {
                knownCount++;
                safetySum += info.score;
                if (info.origin === 'natural' || info.origin === 'mineral') {
                    naturalCount++;
                }
                ingredientDetails.push({
                    name: name,
                    found: true,
                    safety: info.safety,
                    score: info.score,
                    category: info.category,
                    origin: info.origin,
                    color: SAFETY_COLORS[info.safety] || '#9ca3af',
                    fr: info.fr,
                    en: info.en
                });
            } else {
                ingredientDetails.push({
                    name: name,
                    found: false,
                    safety: 'unknown',
                    score: 70,
                    category: 'unknown',
                    origin: 'unknown',
                    color: '#9ca3af',
                    fr: 'Ingrédient non référencé dans notre base.',
                    en: 'Ingredient not referenced in our database.'
                });
                safetySum += 70;
                knownCount++;
            }
        }

        // Scoring weights
        var naturalPct = (naturalCount / total) * 100;
        var avgSafety = knownCount > 0 ? (safetySum / knownCount) : 50;

        // 40% natural origin
        var naturalScore = Math.min(100, naturalPct * 1.2);
        // 35% safety profile
        var safetyScore = avgSafety;
        // 15% certifications (check product features)
        var certScore = 50;
        var features = (product.features || []).join(' ').toLowerCase();
        if (features.indexOf('certifi') >= 0 || features.indexOf('ce') >= 0) certScore += 20;
        if (features.indexOf('hypoallerg') >= 0 || features.indexOf('sensible') >= 0) certScore += 15;
        if (features.indexOf('sans bpa') >= 0 || features.indexOf('bpa') >= 0) certScore += 15;
        certScore = Math.min(100, certScore);
        // 10% simplicity bonus (fewer = better, up to 8)
        var simplicityScore = total <= 3 ? 100 : total <= 6 ? 90 : total <= 10 ? 75 : 60;

        var finalScore = Math.round(
            naturalScore * 0.40 +
            safetyScore * 0.35 +
            certScore * 0.15 +
            simplicityScore * 0.10
        );
        finalScore = Math.max(0, Math.min(100, finalScore));

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
            label_fr: gradeInfo.label_fr,
            label_en: gradeInfo.label_en,
            color: gradeInfo.color,
            breakdown: {
                natural: Math.round(naturalScore),
                safety: Math.round(safetyScore),
                certifications: Math.round(certScore),
                simplicity: Math.round(simplicityScore),
                naturalPct: Math.round(naturalPct),
                totalIngredients: total,
                knownIngredients: knownCount
            },
            ingredients: ingredientDetails
        };
    }

    // Render circular gauge (CSS-only, returns HTML string)
    function renderGauge(result, size) {
        size = size || 80;
        var pct = result.score;
        var circumference = 2 * Math.PI * 36;
        var offset = circumference - (pct / 100) * circumference;
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        var label = lang === 'fr' ? result.label_fr : result.label_en;

        return '<div class="cb-gauge" style="width:' + size + 'px;height:' + size + 'px;position:relative;display:inline-flex;align-items:center;justify-content:center;">' +
            '<svg viewBox="0 0 80 80" style="transform:rotate(-90deg);width:100%;height:100%;position:absolute;">' +
            '<circle cx="40" cy="40" r="36" fill="none" stroke="#e8e4de" stroke-width="6"/>' +
            '<circle cx="40" cy="40" r="36" fill="none" stroke="' + result.color + '" stroke-width="6" ' +
            'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" ' +
            'style="transition:stroke-dashoffset 1s ease;"/>' +
            '</svg>' +
            '<div style="text-align:center;position:relative;z-index:1;">' +
            '<div style="font-size:' + (size * 0.25) + 'px;font-weight:700;color:' + result.color + ';">' + result.grade + '</div>' +
            '<div style="font-size:' + (size * 0.13) + 'px;color:var(--color-text-light,#6b6560);">' + pct + '/100</div>' +
            '</div></div>';
    }

    // Render ingredient pill list (returns HTML string)
    function renderIngredients(result) {
        var html = '<div class="cb-ingredients-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">';
        for (var i = 0; i < result.ingredients.length; i++) {
            var ing = result.ingredients[i];
            var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
            var desc = lang === 'fr' ? ing.fr : ing.en;
            var originLabel = ing.origin === 'natural' ? '🌿' : ing.origin === 'mineral' ? '💎' : '🧪';
            html += '<button class="cb-pill" data-idx="' + i + '" style="' +
                'display:inline-flex;align-items:center;gap:6px;padding:6px 12px;' +
                'border-radius:20px;font-size:0.8rem;cursor:pointer;' +
                'background:rgba(' + hexToRgb(ing.color) + ',0.1);' +
                'border:1px solid ' + ing.color + ';color:var(--color-text,#2d2926);' +
                'transition:all 0.2s;font-family:inherit;"' +
                ' title="' + escapeAttr(desc) + '">' +
                '<span style="width:8px;height:8px;border-radius:50%;background:' + ing.color + ';flex-shrink:0;"></span>' +
                originLabel + ' ' + escapeHtml(ing.name) +
                '</button>';
        }
        html += '</div>';
        return html;
    }

    // Render full section for product page
    function renderSection(product) {
        var result = getScore(product);
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        var titles = {
            fr: { composition: 'Composition & Score Clean Beauty', disclaimer: 'Score informatif basé sur la composition INCI. Ne constitue pas un avis médical.', natural: 'Naturel', safety: 'Sécurité', certs: 'Certifications', simple: 'Simplicité' },
            en: { composition: 'Composition & Clean Beauty Score', disclaimer: 'Informational score based on INCI composition. Not medical advice.', natural: 'Natural', safety: 'Safety', certs: 'Certifications', simple: 'Simplicity' }
        };
        var t = titles[lang] || titles.fr;

        var html = '<div class="pp-section cb-section">';
        html += '<h2>' + t.composition + '</h2>';

        // Score + breakdown row
        html += '<div style="display:flex;align-items:center;gap:24px;margin:16px 0;flex-wrap:wrap;">';
        html += renderGauge(result, 90);
        html += '<div style="flex:1;min-width:200px;">';
        // Breakdown bars
        var bars = [
            { label: t.natural, value: result.breakdown.natural, pct: result.breakdown.naturalPct + '% ' + t.natural.toLowerCase() },
            { label: t.safety, value: result.breakdown.safety },
            { label: t.certs, value: result.breakdown.certifications },
            { label: t.simple, value: result.breakdown.simplicity }
        ];
        for (var b = 0; b < bars.length; b++) {
            var bar = bars[b];
            var barColor = bar.value >= 80 ? '#22c55e' : bar.value >= 60 ? '#eab308' : '#ef4444';
            html += '<div style="margin-bottom:6px;">';
            html += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:2px;">';
            html += '<span>' + bar.label + '</span><span style="font-weight:600;">' + bar.value + '</span></div>';
            html += '<div style="height:4px;background:#e8e4de;border-radius:2px;overflow:hidden;">';
            html += '<div style="height:100%;width:' + bar.value + '%;background:' + barColor + ';border-radius:2px;transition:width 1s ease;"></div>';
            html += '</div></div>';
        }
        html += '</div></div>';

        // Ingredients
        html += renderIngredients(result);

        // Disclaimer
        html += '<p style="font-size:0.72rem;color:var(--color-text-light);margin-top:12px;font-style:italic;">' + t.disclaimer + '</p>';

        // Tooltip container
        html += '<div id="cbTooltip" class="cb-tooltip" style="display:none;position:fixed;z-index:9999;max-width:320px;padding:16px;background:var(--color-white,#fff);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);font-size:0.85rem;line-height:1.5;border:1px solid var(--color-border,#e8e4de);"></div>';

        html += '</div>';
        return { html: html, result: result };
    }

    // Bind tooltip events after rendering
    function bindTooltips(result) {
        var pills = document.querySelectorAll('.cb-pill');
        var tooltip = document.getElementById('cbTooltip');
        if (!tooltip) return;

        pills.forEach(function(pill) {
            pill.addEventListener('click', function(e) {
                var idx = parseInt(this.getAttribute('data-idx'));
                var ing = result.ingredients[idx];
                if (!ing) return;
                var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
                var desc = lang === 'fr' ? ing.fr : ing.en;
                var originLabel = ing.origin === 'natural' ? 'Naturel 🌿' : ing.origin === 'mineral' ? 'Minéral 💎' : 'Synthétique 🧪';
                var safetyLabel = ing.safety === 'excellent' ? 'Excellent' : ing.safety === 'good' ? 'Bon' : ing.safety === 'moderate' ? 'Modéré' : 'Inconnu';

                tooltip.innerHTML =
                    '<div style="font-weight:700;margin-bottom:6px;">' + escapeHtml(ing.name) + '</div>' +
                    '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:0.78rem;">' +
                    '<span style="padding:2px 8px;border-radius:10px;background:rgba(' + hexToRgb(ing.color) + ',0.15);color:' + ing.color + ';font-weight:600;">' + safetyLabel + '</span>' +
                    '<span style="padding:2px 8px;border-radius:10px;background:var(--color-bg-alt,#f3efe9);">' + originLabel + '</span>' +
                    '</div>' +
                    '<div>' + escapeHtml(desc) + '</div>';

                var rect = this.getBoundingClientRect();
                tooltip.style.display = 'block';
                tooltip.style.top = (rect.bottom + 8) + 'px';
                tooltip.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 340)) + 'px';

                e.stopPropagation();
            });
        });

        document.addEventListener('click', function() {
            tooltip.style.display = 'none';
        });
    }

    // Helpers
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        return r + ',' + g + ',' + b;
    }
    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
    function escapeAttr(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    return {
        getScore: getScore,
        renderSection: renderSection,
        renderGauge: renderGauge,
        renderIngredients: renderIngredients,
        bindTooltips: bindTooltips,
        SAFETY_COLORS: SAFETY_COLORS
    };
})();
