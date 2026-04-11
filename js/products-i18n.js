// ============================
// ECLAT — Traduction produits 4 langues (FR/EN/ES/DE)
// Couvre les 15 produits ÉCLAT + 500 produits CJ
// Fichiers séparés : products-i18n-en.js, products-i18n-es.js, products-i18n-de.js
// ============================

var CATEGORY_TRANSLATIONS = {
    fr: {
        visage: 'Soins visage', soin: 'Sérums & Soins', corps: 'Soins corps',
        cheveux: 'Cheveux', ongles: 'Ongles', homme: 'Homme',
        outils: 'Outils beauté', aromatherapie: 'Bien-être', accessoire: 'Accessoires',
        coffrets: 'Coffrets', parfums: 'Parfumerie', marques: 'Marque officielle'
    },
    en: {
        visage: 'Face care', soin: 'Serums & Treatments', corps: 'Body care',
        cheveux: 'Hair', ongles: 'Nails', homme: 'Men',
        outils: 'Beauty tools', aromatherapie: 'Wellness', accessoire: 'Accessories',
        coffrets: 'Gift sets', parfums: 'Fragrance', marques: 'Official brand'
    },
    es: {
        visage: 'Cuidado facial', soin: 'Sérums y Tratamientos', corps: 'Cuidado corporal',
        cheveux: 'Cabello', ongles: 'Uñas', homme: 'Hombre',
        outils: 'Herramientas', aromatherapie: 'Bienestar', accessoire: 'Accesorios',
        coffrets: 'Cofres', parfums: 'Perfumería', marques: 'Marca oficial'
    },
    de: {
        visage: 'Gesichtspflege', soin: 'Seren & Behandlungen', corps: 'Körperpflege',
        cheveux: 'Haare', ongles: 'Nägel', homme: 'Herren',
        outils: 'Beauty-Tools', aromatherapie: 'Wellness', accessoire: 'Zubehör',
        coffrets: 'Geschenksets', parfums: 'Parfüm', marques: 'Offizielle Marke'
    }
};

// Traductions des 15 produits originaux ÉCLAT (inline — les CJ sont dans des fichiers séparés)
var PRODUCT_TRANSLATIONS = {
    en: {
        1: { name: 'LED Mask Pro 7 Colors', description: 'Professional spa treatment at home. 7 targeted wavelengths: red anti-aging, blue anti-acne, green anti-spots. Visible results in 14 days.' },
        2: { name: 'Rose Quartz Crystal Gua Sha', description: 'Ancestral beauty ritual in genuine rose quartz. Ergonomic heart shape following facial contours. Boosts circulation, depuffs, sculpts.' },
        3: { name: 'Ultrasonic Face Scrubber', description: 'Professional cleansing in 3 minutes. 28,000 vibrations/sec. Unclogs pores, gently exfoliates, helps serums penetrate 5x better.' },
        4: { name: 'Sonic Cleansing Brush', description: 'Affordable alternative to 200€ brushes. 5 interchangeable heads for complete cleansing. Waterproof, gentle on sensitive skin.' },
        5: { name: 'Cryo Ice Roller', description: 'Viral morning ritual. Fill, freeze, massage. Depuffs eye bags, tightens pores, soothes redness in 2 minutes.' },
        6: { name: 'V-Line EMS Sculpting Roller', description: 'K-beauty secret for a sculpted face. Electric roller with EMS micro-current. Professional lymphatic drainage effect.' },
        7: { name: 'Nano-Ion Facial Steamer', description: 'At-home spa experience. Nano-ionic steam gently opens pores. Deeply hydrates, preps skin for treatments.' },
        8: { name: 'Glow Serum Vitamin C 20%', description: '#1 skincare active worldwide. 20% stabilized Vitamin C for radiant complexion. Anti-wrinkle, anti-dark spot. Results in 21 days.' },
        9: { name: 'Hydrating Collagen Eye Patches', description: '60 collagen patches for a full month. Depuffs, fades dark circles, hydrates eye contour. Visible results from first use.' },
        10: { name: 'Collagen Lifting Mask', description: 'Viral TikTok lifting mask. Compact collagen adhering perfectly to the face. Instant tightening, plumps and smooths.' },
        11: { name: 'Precious Rosehip Oil', description: 'Pure rosehip oil deeply hydrating and regenerating. Rich in natural omegas, fades scars and fine lines.' },
        12: { name: 'Anti-Wrinkle Micro-Crystal Stickers', description: 'Micro-crystal patches smoothing wrinkles while you sleep. Concentrated hydrogel technology delivers actives deep.' },
        13: { name: 'Steam Eye Mask SPA', description: '12 self-heating masks for eye spa. Gentle 40°C warmth relieves screen fatigue and promotes sleep.' },
        14: { name: 'Ultrasonic Aroma Diffuser', description: 'Designer glass ultrasonic diffuser. Fine aromatic mist + ambient LED. Compatible with all essential oils.' },
        15: { name: 'Heatless Curls Kit', description: 'Perfect curls while sleeping, zero heat damage. Satin set with flexible octopus bar. All hair types.' },
    },
    es: {
        1: { name: 'Mascarilla LED Pro 7 Colores', description: 'Tratamiento spa profesional en casa. 7 longitudes de onda: rojo antiedad, azul antiacné, verde antimanchas. Resultados en 14 días.' },
        2: { name: 'Gua Sha Cuarzo Rosa Cristal', description: 'Ritual de belleza ancestral en cuarzo rosa auténtico. Forma corazón ergonómica. Estimula circulación, deshincha, esculpe.' },
        3: { name: 'Espátula Ultrasónica Facial', description: 'Limpieza profesional en 3 minutos. 28.000 vibraciones/seg. Desobstruye poros, exfolia, penetración 5x mejor.' },
        4: { name: 'Cepillo Limpiador Sónico', description: 'Alternativa asequible a cepillos de 200€+. 5 cabezales intercambiables. Waterproof, suave con pieles sensibles.' },
        5: { name: 'Ice Roller Cryo Facial', description: 'Ritual matutino viral. Llena, congela, masajea. Deshincha bolsas, cierra poros, calma rojeces en 2 minutos.' },
        6: { name: 'V-Line Roller Escultor EMS', description: 'Secreto K-beauty para rostro esculpido. Rodillo eléctrico V-Shape con microcorriente EMS. Drenaje linfático profesional.' },
        7: { name: 'Vaporizador Facial Nano-Ion', description: 'Spa en casa. Vapor nano-iónico que abre poros suavemente. Hidrata en profundidad, prepara para tratamientos.' },
        8: { name: 'Sérum Luminosidad Vitamina C 20%', description: 'Activo nº1 mundial en skincare. Vitamina C estabilizada 20%. Antiarrugas, antimanchas, estimula colágeno.' },
        9: { name: 'Parches Ojos Colágeno', description: '60 parches de colágeno para un mes completo. Deshincha bolsas, atenúa ojeras, hidrata contorno.' },
        10: { name: 'Mascarilla Colágeno Lifting', description: 'Mascarilla lifting viral TikTok. Colágeno compacto adherente. Efecto tensor inmediato, rellena y alisa.' },
        11: { name: 'Aceite Precioso Rosa Mosqueta', description: 'Aceite puro de rosa mosqueta hidratante y regenerante. Rico en omegas naturales, atenúa cicatrices.' },
        12: { name: 'Stickers Antiarrugas Micro-Crystal', description: 'Parches micro-cristales que alisan arrugas mientras duermes. Tecnología hidrogel concentrado.' },
        13: { name: 'Mascarilla Ojos Vapor SPA', description: '12 mascarillas de vapor autocalentables. Calor suave 40°C alivia fatiga de pantallas. Relajación total.' },
        14: { name: 'Difusor Aroma Ultrasónico', description: 'Difusor ultrasónico en vidrio de diseño. Bruma aromática + LED ambiental. Compatible todos los aceites.' },
        15: { name: 'Kit Rizos Sin Calor', description: 'Rizos perfectos durmiendo, sin dañar. Set de satén con barra flexible pulpo. Todos los tipos de cabello.' },
    },
    de: {
        1: { name: 'LED Maske Pro 7 Farben', description: 'Professionelle Spa-Behandlung zu Hause. 7 Wellenlängen: Rot Anti-Aging, Blau Anti-Akne, Grün Anti-Flecken. Ergebnisse in 14 Tagen.' },
        2: { name: 'Rosenquarz Gua Sha', description: 'Traditionelles Beauty-Ritual aus echtem Rosenquarz. Ergonomische Herzform. Fördert Durchblutung, wirkt abschwellend, formt Oval.' },
        3: { name: 'Ultraschall Gesichts-Scrubber', description: 'Professionelle Reinigung in 3 Minuten. 28.000 Vibrationen/Sek. Befreit Poren, lässt Seren 5x besser einziehen.' },
        4: { name: 'Sonic Reinigungsbürste', description: 'Erschwingliche Alternative zu 200€ Bürsten. 5 austauschbare Köpfe. Wasserdicht, sanft zu empfindlicher Haut.' },
        5: { name: 'Cryo Ice Roller Gesicht', description: 'Virales Morgenritual. Befüllen, einfrieren, massieren. Abschwellend, verfeinert Poren, beruhigt Rötungen.' },
        6: { name: 'V-Line EMS Skulptur-Roller', description: 'K-Beauty-Geheimnis für modelliertes Gesicht. Elektrischer V-Shape-Roller mit EMS-Mikrostrom.' },
        7: { name: 'Nano-Ion Gesichtsdampfer', description: 'Spa-Erlebnis zu Hause. Nano-ionischer Dampf öffnet Poren sanft. Tiefenhydratation, Vorbereitung für Pflege.' },
        8: { name: 'Glow Serum Vitamin C 20%', description: 'Weltweit beliebtester Skincare-Wirkstoff. 20% stabilisiertes Vitamin C für strahlenden Teint.' },
        9: { name: 'Kollagen-Augenpatches', description: '60 Kollagen-Patches für einen Monat. Abschwellend, mildert Augenringe, spendet Feuchtigkeit.' },
        10: { name: 'Kollagen Lifting-Maske', description: 'Virale TikTok Lifting-Maske. Kompaktes Kollagen, sofortiger Straffungseffekt, polstert und glättet.' },
        11: { name: 'Kostbares Hagebuttenöl', description: 'Reines Hagebuttenöl, tiefenwirksam hydratisierend und regenerierend. Reich an natürlichen Omegas.' },
        12: { name: 'Anti-Falten Mikro-Kristall Sticker', description: 'Mikro-Kristall-Patches glätten Falten im Schlaf. Konzentrierte Hydrogel-Technologie.' },
        13: { name: 'Dampf-Augenmaske SPA', description: '12 selbstwärmende Dampfmasken. Sanfte 40°C Wärme lindert Bildschirmmüdigkeit. Totale Entspannung.' },
        14: { name: 'Ultraschall Aroma-Diffuser', description: 'Design-Glas Ultraschall-Diffuser. Feiner Aromadunst + LED-Beleuchtung. Für alle ätherischen Öle.' },
        15: { name: 'Locken-Set ohne Hitze', description: 'Perfekte Locken im Schlaf, ohne Hitzeschäden. Satin-Set mit flexibler Stange. Alle Haartypen.' },
    }
};

/**
 * getProductText(productId, field, lang)
 * Fonction centrale de traduction produit.
 * Cherche dans : i18n fichier externe > PRODUCT_TRANSLATIONS inline > produit FR original
 */
function getProductText(productId, field, lang) {
    if (!lang) lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';

    // FR = toujours l'original products.js
    if (lang === 'fr') {
        if (typeof PRODUCTS !== 'undefined') {
            var p = PRODUCTS.find(function(prod) { return prod.id === productId; });
            if (p && p[field]) return p[field];
        }
        return '';
    }

    // Chercher dans le fichier i18n externe chargé (EN/ES/DE)
    var extData = null;
    if (lang === 'en' && typeof PRODUCT_I18N_EN !== 'undefined') extData = PRODUCT_I18N_EN;
    else if (lang === 'es' && typeof PRODUCT_I18N_ES !== 'undefined') extData = PRODUCT_I18N_ES;
    else if (lang === 'de' && typeof PRODUCT_I18N_DE !== 'undefined') extData = PRODUCT_I18N_DE;

    if (extData && extData[productId] && extData[productId][field]) {
        return extData[productId][field];
    }

    // Fallback : PRODUCT_TRANSLATIONS inline (15 originaux)
    if (PRODUCT_TRANSLATIONS[lang] && PRODUCT_TRANSLATIONS[lang][productId]) {
        var tr = PRODUCT_TRANSLATIONS[lang][productId];
        if (tr[field]) return tr[field];
    }

    // Fallback final : FR original
    if (typeof PRODUCTS !== 'undefined') {
        var p2 = PRODUCTS.find(function(prod) { return prod.id === productId; });
        if (p2 && p2[field]) return p2[field];
    }

    return '';
}

/**
 * getCategoryText(categoryKey, lang)
 */
function getCategoryText(categoryKey, lang) {
    if (!lang) lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
    return (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang][categoryKey]) ||
           (CATEGORY_TRANSLATIONS.fr && CATEGORY_TRANSLATIONS.fr[categoryKey]) ||
           categoryKey;
}

/**
 * translateProducts()
 * Met à jour le DOM avec les traductions (appelé après changement de langue)
 */
function translateProducts() {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';

    // Traduit les cartes produit sur la page actuelle
    document.querySelectorAll('.product-card, .cat-card, [data-product-id]').forEach(function(card) {
        var id = parseInt(card.dataset.id || card.dataset.productId);
        if (!id) return;

        var nameEl = card.querySelector('.product-name, .cat-card-name, .pp-name');
        if (nameEl) nameEl.textContent = getProductText(id, 'name', lang);

        var descEl = card.querySelector('.product-description, .cat-card-desc, .pp-desc');
        if (descEl) descEl.textContent = getProductText(id, 'description', lang);
    });

    // Traduit les labels de catégorie
    document.querySelectorAll('[data-category-key]').forEach(function(el) {
        var key = el.dataset.categoryKey;
        el.textContent = getCategoryText(key, lang);
    });
}

// Override setLanguage pour traduire les produits aussi
// Charge dynamiquement le fichier i18n si pas encore chargé (lazy-loading)
(function() {
    var _origSetLang = typeof setLanguage === 'function' ? setLanguage : null;
    if (_origSetLang) {
        window.setLanguage = function(lang) {
            _origSetLang(lang);
            if (typeof window._loadProductI18n === 'function') {
                window._loadProductI18n(lang, function() {
                    setTimeout(translateProducts, 100);
                });
            } else {
                setTimeout(translateProducts, 100);
            }
        };
    }
})();

// Traduire au chargement si pas FR
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(translateProducts, 500);
});
