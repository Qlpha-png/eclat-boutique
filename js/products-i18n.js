// ============================
// ECLAT - Traduction des produits (15 produits ECLAT)
// Noms, descriptions et categories traduits dans 4 langues
// ============================

const CATEGORY_TRANSLATIONS = {
    fr: {
        visage: "Soins visage",
        soin: "Skincare",
        outils: "Outils beaute",
        aromatherapie: "Bien-etre"
    },
    en: {
        visage: "Face care",
        soin: "Skincare",
        outils: "Beauty tools",
        aromatherapie: "Wellness"
    },
    es: {
        visage: "Cuidado facial",
        soin: "Skincare",
        outils: "Herramientas de belleza",
        aromatherapie: "Bienestar"
    },
    de: {
        visage: "Gesichtspflege",
        soin: "Skincare",
        outils: "Beauty-Tools",
        aromatherapie: "Wellness"
    }
};

const PRODUCT_TRANSLATIONS = {
    en: {
        1: {
            name: "LED Mask Pro 7 Colors",
            description: "Professional spa treatment at home. 7 targeted wavelengths: red anti-aging, blue anti-acne, green anti-spots. Clinically proven results in 14 days of regular use."
        },
        2: {
            name: "Rose Quartz Crystal Gua Sha",
            description: "The ancestral beauty ritual in genuine rose quartz. Ergonomic heart shape that follows facial contours. Boosts circulation, depuffs, naturally sculpts the jawline."
        },
        3: {
            name: "Ultrasonic Face Scrubber",
            description: "Professional cleansing in 3 minutes. 28,000 vibrations/sec. Unclogs pores, gently exfoliates, helps serums penetrate 5x better. USB rechargeable."
        },
        4: {
            name: "Sonic Cleansing Brush",
            description: "The affordable alternative to brushes costing 200+. 5 interchangeable heads for a complete cleanse. Waterproof, gentle on sensitive skin."
        },
        5: {
            name: "Cryo Ice Roller for Face",
            description: "The viral morning ritual. Ice mold + roller: fill, freeze, massage. Depuffs eye bags, tightens pores, soothes redness in 2 minutes."
        },
        6: {
            name: "V-Line EMS Sculpting Roller",
            description: "The K-beauty secret for a sculpted face. Electric V-Shape roller with EMS micro-current. Replicates professional lymphatic drainage. Tones and slims."
        },
        7: {
            name: "Nano-Ion Facial Steamer",
            description: "The at-home spa experience. Nano-ionic steam that gently opens pores. Deeply hydrates, preps skin for treatments. Portable and rechargeable."
        },
        8: {
            name: "Glow Serum Vitamin C 20%",
            description: "The #1 active ingredient in skincare worldwide. 20% stabilized Vitamin C for a radiant complexion. Anti-wrinkle, anti-dark spot, boosts collagen. Visible results in 21 days."
        },
        9: {
            name: "Hydrating Collagen Eye Patches",
            description: "60 collagen patches for a full month of care. Depuffs eye bags, fades dark circles, hydrates the eye contour. Visible results from the very first use."
        },
        10: {
            name: "Collagen Lifting Mask",
            description: "The lifting mask that went viral on TikTok. Compact collagen that adheres perfectly to the face. Instant tightening effect, plumps and smooths. 4 masks per box."
        },
        11: {
            name: "Precious Rosehip Oil",
            description: "Pure rosehip oil that deeply hydrates and regenerates. Rich in natural omegas, it fades scars and fine lines. The ideal nighttime treatment."
        },
        12: {
            name: "Anti-Wrinkle Micro-Crystal Stickers",
            description: "Micro-crystal patches that smooth wrinkles while you sleep. Concentrated hydrogel technology delivers actives deep into the skin. Wake up to results."
        },
        13: {
            name: "Steam Eye Mask SPA",
            description: "12 self-heating steam masks for an eye spa. Gentle warmth at 40C relieves screen fatigue and promotes sleep. Total relaxation."
        },
        14: {
            name: "Ultrasonic Aroma Diffuser",
            description: "Designer glass ultrasonic diffuser. Fine aromatic mist + ambient LED lighting. Compatible with all essential oils. The ultimate wellness decor piece."
        },
        15: {
            name: "Heatless Curls Kit",
            description: "Perfect curls while sleeping, zero heat damage. Satin set with flexible octopus bar. All hair types, all lengths. Zero damage, 100% results."
        }
    },
    es: {
        1: {
            name: "Mascarilla LED Pro 7 Colores",
            description: "Tratamiento de spa profesional en casa. 7 longitudes de onda: rojo antiedad, azul antiacne, verde antimanchas. Resultados visibles en 14 dias de uso regular."
        },
        2: {
            name: "Gua Sha Cristal Cuarzo Rosa",
            description: "El ritual de belleza ancestral en cuarzo rosa autentico. Forma corazon ergonomica que se adapta a los contornos del rostro. Estimula la circulacion, deshincha, esculpe el ovalo."
        },
        3: {
            name: "Espatula Ultrasonica Facial",
            description: "Limpieza profesional en 3 minutos. 28.000 vibraciones/seg. Desobstruye poros, exfolia suavemente, ayuda a que los serums penetren 5 veces mejor. Recargable USB."
        },
        4: {
            name: "Cepillo Limpiador Sonico",
            description: "La alternativa asequible a los cepillos de mas de 200. 5 cabezales intercambiables para una limpieza completa. Waterproof, suave con pieles sensibles."
        },
        5: {
            name: "Ice Roller Cryo Facial",
            description: "El ritual matutino viral. Molde de hielo + rodillo: llena, congela, masajea. Deshincha bolsas, cierra poros, calma rojeces en 2 minutos."
        },
        6: {
            name: "V-Line Roller Escultor EMS",
            description: "El secreto K-beauty para un rostro esculpido. Rodillo electrico V-Shape con microcorriente EMS. Reproduce el drenaje linfatico profesional. Tonifica y afina."
        },
        7: {
            name: "Vaporizador Facial Nano-Ion",
            description: "El spa en casa. Vapor nano-ionico que abre los poros suavemente. Hidrata en profundidad, prepara la piel para tratamientos. Portatil y recargable."
        },
        8: {
            name: "Serum Luminosidad Vitamina C 20%",
            description: "El activo n.1 en skincare mundial. Vitamina C estabilizada al 20% para una tez radiante. Antiarrugas, antimanchas, estimula el colageno. Resultados visibles en 21 dias."
        },
        9: {
            name: "Parches Ojos Colageno Hidratantes",
            description: "60 parches de colageno para un mes completo de cuidado. Deshincha bolsas, atenua ojeras, hidrata el contorno de ojos. Resultado visible desde la primera aplicacion."
        },
        10: {
            name: "Mascarilla Colageno Lifting",
            description: "La mascarilla lifting que exploto en TikTok. Colageno compacto que se adhiere perfectamente al rostro. Efecto tensor inmediato, rellena y alisa. 4 mascarillas por caja."
        },
        11: {
            name: "Aceite Precioso Rosa Mosqueta",
            description: "Aceite puro de rosa mosqueta que hidrata y regenera en profundidad. Rico en omegas naturales, atenua cicatrices y lineas finas. El tratamiento nocturno ideal."
        },
        12: {
            name: "Stickers Antiarrugas Micro-Crystal",
            description: "Parches micro-cristales que alisan las arrugas mientras duermes. Tecnologia hidrogel concentrado que libera activos en profundidad. Resultado al despertar."
        },
        13: {
            name: "Mascarilla Ojos Vapor SPA",
            description: "12 mascarillas de vapor autocalentables para un spa de ojos. Calor suave a 40C que alivia la fatiga de pantallas y favorece el sueno. Relajacion total."
        },
        14: {
            name: "Difusor Aroma Ultrasonico",
            description: "Difusor ultrasonico en vidrio de diseno. Bruma aromatica fina + LED ambiental. Compatible con todos los aceites esenciales. El objeto deco bienestar por excelencia."
        },
        15: {
            name: "Kit Rizos Sin Calor",
            description: "Rizos perfectos durmiendo, sin danar el cabello. Set de saten con barra flexible pulpo. Todos los tipos de cabello, todas las longitudes. Cero dano, 100% resultados."
        }
    },
    de: {
        1: {
            name: "LED Maske Pro 7 Farben",
            description: "Professionelle Spa-Behandlung zu Hause. 7 gezielte Wellenlaengen: Rot Anti-Aging, Blau Anti-Akne, Gruen Anti-Flecken. Sichtbare Ergebnisse in 14 Tagen bei regelmaessiger Anwendung."
        },
        2: {
            name: "Rosenquarz-Kristall Gua Sha",
            description: "Das traditionelle Schoenheitsritual aus echtem Rosenquarz. Ergonomische Herzform, die sich den Gesichtskonturen anpasst. Foerdert die Durchblutung, wirkt abschwellend, formt das Gesichtsoval."
        },
        3: {
            name: "Ultraschall Gesichts-Scrubber",
            description: "Professionelle Reinigung in 3 Minuten. 28.000 Vibrationen/Sek. Befreit Poren, peelt sanft, laesst Seren 5x besser einziehen. USB-aufladbar."
        },
        4: {
            name: "Sonic Reinigungsbuerste",
            description: "Die erschwingliche Alternative zu Buersten ueber 200 Euro. 5 austauschbare Koepfe fuer eine vollstaendige Reinigung. Wasserdicht, sanft zu empfindlicher Haut."
        },
        5: {
            name: "Cryo Ice Roller fuers Gesicht",
            description: "Das virale Morgenritual. Eisform + Roller: befuellen, einfrieren, massieren. Wirkt abschwellend, verfeinert Poren, beruhigt Roetungen in 2 Minuten."
        },
        6: {
            name: "V-Line EMS Skulptur-Roller",
            description: "Das K-Beauty-Geheimnis fuer ein modelliertes Gesicht. Elektrischer V-Shape-Roller mit EMS-Mikrostrom. Reproduziert professionelle Lymphdrainage. Strafft und verfeinert."
        },
        7: {
            name: "Nano-Ion Gesichtsdampfer",
            description: "Das Spa-Erlebnis zu Hause. Nano-ionischer Dampf oeffnet sanft die Poren. Tiefenhydratation, bereitet die Haut auf Pflege vor. Tragbar und aufladbar."
        },
        8: {
            name: "Glow Serum Vitamin C 20%",
            description: "Der weltweit beliebteste Skincare-Wirkstoff. 20% stabilisiertes Vitamin C fuer einen strahlenden Teint. Anti-Falten, gegen Pigmentflecken, foerdert Kollagen. Sichtbare Ergebnisse in 21 Tagen."
        },
        9: {
            name: "Feuchtigkeitsspendende Kollagen-Augenpatches",
            description: "60 Kollagen-Patches fuer einen vollen Monat Pflege. Abschwellend, mildert Augenringe, spendet Feuchtigkeit. Sichtbares Ergebnis ab der ersten Anwendung."
        },
        10: {
            name: "Kollagen Lifting-Maske",
            description: "Die Lifting-Maske, die auf TikTok viral ging. Kompaktes Kollagen, das perfekt am Gesicht haftet. Sofortiger Straffungseffekt, polstert und glaettet. 4 Masken pro Box."
        },
        11: {
            name: "Kostbares Hagebuttenoel",
            description: "Reines Hagebuttenoel, das tiefenwirksam hydratisiert und regeneriert. Reich an natuerlichen Omegas, mildert Narben und feine Linien. Die ideale Nachtpflege."
        },
        12: {
            name: "Anti-Falten Mikro-Kristall Sticker",
            description: "Mikro-Kristall-Patches, die Falten im Schlaf glaetten. Konzentrierte Hydrogel-Technologie liefert Wirkstoffe in die Tiefe. Ergebnis beim Aufwachen."
        },
        13: {
            name: "Dampf-Augenmaske SPA",
            description: "12 selbstwaermende Dampfmasken fuer ein Augen-Spa. Sanfte Waerme bei 40 Grad lindert Bildschirmmuedigkeit und foerdert den Schlaf. Totale Entspannung."
        },
        14: {
            name: "Ultraschall Aroma-Diffuser",
            description: "Ultraschall-Diffuser aus Design-Glas. Feiner Aromadunst + stimmungsvolle LED-Beleuchtung. Kompatibel mit allen aetherischen Oelen. Das ultimative Wellness-Deko-Objekt."
        },
        15: {
            name: "Locken-Set ohne Hitze",
            description: "Perfekte Locken im Schlaf, ohne Hitzeschaeden. Satin-Set mit flexibler Oktopus-Stange. Alle Haartypen, alle Laengen. Null Haarschaeden, 100% Ergebnis."
        }
    }
};

// Apply product translations when language changes
function translateProducts() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';

    if (lang === 'fr') {
        // Restore original French names from PRODUCTS array
        if (typeof PRODUCTS !== 'undefined') {
            document.querySelectorAll('.product-card').forEach(card => {
                const id = parseInt(card.dataset.id);
                const product = PRODUCTS.find(p => p.id === id);
                if (product) {
                    const nameEl = card.querySelector('.product-name');
                    if (nameEl) nameEl.textContent = product.name;
                    const descEl = card.querySelector('.product-description');
                    if (descEl) descEl.textContent = product.description;
                }
            });
        }
    } else if (PRODUCT_TRANSLATIONS[lang]) {
        const translations = PRODUCT_TRANSLATIONS[lang];
        document.querySelectorAll('.product-card').forEach(card => {
            const id = parseInt(card.dataset.id);
            const trans = translations[id];
            if (trans) {
                const nameEl = card.querySelector('.product-name');
                if (nameEl && trans.name) nameEl.textContent = trans.name;
                const descEl = card.querySelector('.product-description');
                if (descEl && trans.description) descEl.textContent = trans.description;
            }
        });
    }

    // Translate category labels if present
    const catTranslations = CATEGORY_TRANSLATIONS[lang];
    if (catTranslations) {
        document.querySelectorAll('[data-category-key]').forEach(el => {
            const key = el.dataset.categoryKey;
            if (catTranslations[key]) {
                el.textContent = catTranslations[key];
            }
        });
    }
}

// Override setLanguage to also translate products
const originalSetLanguage = typeof setLanguage === 'function' ? setLanguage : null;
if (originalSetLanguage) {
    window.setLanguage = function(lang) {
        originalSetLanguage(lang);
        setTimeout(translateProducts, 100);
    };
}

// Also translate on initial load if not FR
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(translateProducts, 500);
});
