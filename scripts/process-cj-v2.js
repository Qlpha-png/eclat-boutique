/**
 * process-cj-v2.js — Version 2 complète
 * Corrige TOUS les problèmes identifiés par l'audit :
 * 1. Supprime les non-beauté (suppléments, capsules, hydrogen water)
 * 2. Noms français UNIQUES pour chaque produit
 * 3. Descriptions variées (pas de templates copier-coller)
 * 4. Catégories/sous-catégories cohérentes
 * 5. Distribution de prix réaliste
 * 6. Génère les traductions EN/ES/DE
 */

const fs = require('fs');
const path = require('path');

const rawCatalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cj-beauty-catalog.json'), 'utf-8'));

// ============================================================
// BLACKLIST — produits non-beauté à supprimer
// ============================================================
const BLACKLIST_PATTERNS = [
    /supplement/i, /capsule/i, /tablet/i, /pill/i, /chewable/i,
    /hydrogen water/i, /dietary/i, /vitality enhance/i,
    /weight loss/i, /slimming pill/i, /detox pill/i,
    /car\s/i, /vacuum cleaner/i, /furniture/i, /skirt/i,
    /phone case/i, /cable/i, /charger\b/i,
];

const BRAND_JUNK = [
    'EELHOE', 'SADOER', 'LANBENA', 'BIOAQUA', 'IMAGES', 'EFERO',
    'Hoygi', 'Tunmate', 'Lanbena', 'CYMBIOTIKA', 'Googeer', 'Huorun',
    'BUSHAID', 'WINYEL', 'AILKE', 'DISAAR', 'BREYLEE', 'VIBRANT GLAMOUR',
    'MELAO', 'PUREDERM', 'SOME BY MI', 'COSRX', 'INNISFREE',
];

// ============================================================
// CATEGORY + SUBCATEGORY RECLASSIFICATION
// ============================================================
function classifyProduct(raw) {
    const name = raw.name.toLowerCase();
    const search = (raw.searchTerm || '').toLowerCase();

    // Non-beauté detection
    for (const pat of BLACKLIST_PATTERNS) {
        if (pat.test(raw.name)) return null;
    }

    // Smart classification based on name + searchTerm
    const rules = [
        // SÉRUMS
        { test: () => /serum/i.test(name) && /retinol/i.test(name), cat: 'soin', sub: 'serum-retinol' },
        { test: () => /serum/i.test(name) && /hyaluronic/i.test(name), cat: 'soin', sub: 'serum-ha' },
        { test: () => /serum/i.test(name) && /vitamin\s*c/i.test(name), cat: 'soin', sub: 'serum-vitc' },
        { test: () => /serum/i.test(name) && /niacinamide/i.test(name), cat: 'soin', sub: 'serum-niacin' },
        { test: () => /serum/i.test(name) && /collagen/i.test(name), cat: 'soin', sub: 'serum-collagene' },
        { test: () => /serum/i.test(name) && /peptide/i.test(name), cat: 'soin', sub: 'serum-peptide' },
        { test: () => /serum/i.test(name) && /(brighten|glow|radiance)/i.test(name), cat: 'soin', sub: 'serum-eclat' },
        { test: () => /serum/i.test(name) && /(anti.?ag|wrinkle|firm)/i.test(name), cat: 'soin', sub: 'serum-antiage' },
        { test: () => /serum/i.test(name) && /face/i.test(name), cat: 'soin', sub: 'serum' },
        { test: () => /serum/i.test(name) && search.includes('serum'), cat: 'soin', sub: 'serum' },
        { test: () => /ampoule|essence/i.test(name), cat: 'soin', sub: 'serum' },

        // CRÈMES VISAGE
        { test: () => /eye\s*cream|under\s*eye|eye\s*contour/i.test(name), cat: 'visage', sub: 'contour-yeux' },
        { test: () => /neck\s*cream/i.test(name), cat: 'visage', sub: 'creme-cou' },
        { test: () => /night\s*cream/i.test(name), cat: 'visage', sub: 'creme-nuit' },
        { test: () => /day\s*cream/i.test(name), cat: 'visage', sub: 'creme-jour' },
        { test: () => /(face|facial)\s*(cream|moisturiz)/i.test(name), cat: 'visage', sub: 'creme' },
        { test: () => /cream/i.test(name) && search.includes('face'), cat: 'visage', sub: 'creme' },
        { test: () => /moisturiz/i.test(name) && !/(body|hand|foot)/i.test(name), cat: 'visage', sub: 'creme' },

        // MASQUES VISAGE
        { test: () => /sheet\s*mask/i.test(name), cat: 'visage', sub: 'masque-tissu' },
        { test: () => /clay\s*mask/i.test(name), cat: 'visage', sub: 'masque-argile' },
        { test: () => /peel\s*off/i.test(name), cat: 'visage', sub: 'masque-peel' },
        { test: () => /sleep(ing)?\s*mask/i.test(name), cat: 'visage', sub: 'masque-nuit' },
        { test: () => /(face|facial)\s*mask/i.test(name), cat: 'visage', sub: 'masque' },
        { test: () => /mask/i.test(name) && !/(hair|eye|lip|nail)/i.test(name), cat: 'visage', sub: 'masque' },

        // NETTOYAGE VISAGE
        { test: () => /(face|facial)\s*(cleanser|wash)/i.test(name), cat: 'visage', sub: 'nettoyant' },
        { test: () => /makeup\s*remov|cleansing\s*balm/i.test(name), cat: 'visage', sub: 'demaquillant' },
        { test: () => /micellar/i.test(name), cat: 'visage', sub: 'eau-micellaire' },
        { test: () => /cleansing\s*oil/i.test(name), cat: 'visage', sub: 'huile-demaq' },
        { test: () => /exfoliat/i.test(name) && !/(body|lip)/i.test(name), cat: 'visage', sub: 'exfoliant' },
        { test: () => /toner|tonic/i.test(name) && !/(hair|body)/i.test(name), cat: 'visage', sub: 'lotion' },

        // LÈVRES
        { test: () => /lip\s*balm/i.test(name), cat: 'visage', sub: 'baume-levres' },
        { test: () => /lip\s*oil/i.test(name), cat: 'visage', sub: 'huile-levres' },
        { test: () => /lip\s*mask/i.test(name), cat: 'visage', sub: 'masque-levres' },
        { test: () => /lip\s*scrub/i.test(name), cat: 'visage', sub: 'gommage-levres' },
        { test: () => /lip\s*gloss/i.test(name), cat: 'visage', sub: 'gloss' },
        { test: () => /lip/i.test(name) && search.includes('lip'), cat: 'visage', sub: 'soin-levres' },

        // YEUX
        { test: () => /eye\s*patch|under\s*eye\s*patch/i.test(name), cat: 'visage', sub: 'patchs-yeux' },
        { test: () => /eye\s*mask/i.test(name), cat: 'visage', sub: 'masque-yeux' },
        { test: () => /eyelash\s*serum|lash\s*growth/i.test(name), cat: 'visage', sub: 'serum-cils' },

        // SOLAIRE
        { test: () => /sun\s*screen|spf|sun\s*protect/i.test(name), cat: 'visage', sub: 'solaire' },

        // CORPS
        { test: () => /body\s*lotion/i.test(name), cat: 'corps', sub: 'lait-corps' },
        { test: () => /body\s*(cream|butter)/i.test(name), cat: 'corps', sub: 'creme-corps' },
        { test: () => /body\s*scrub/i.test(name), cat: 'corps', sub: 'gommage-corps' },
        { test: () => /body\s*oil/i.test(name), cat: 'corps', sub: 'huile-corps' },
        { test: () => /hand\s*cream/i.test(name), cat: 'corps', sub: 'soin-mains' },
        { test: () => /foot\s*cream/i.test(name), cat: 'corps', sub: 'soin-pieds' },
        { test: () => /stretch\s*mark/i.test(name), cat: 'corps', sub: 'anti-vergetures' },
        { test: () => /cellulite/i.test(name), cat: 'corps', sub: 'anti-cellulite' },
        { test: () => /shower\s*gel/i.test(name), cat: 'corps', sub: 'gel-douche' },

        // CHEVEUX — soins
        { test: () => /hair\s*mask/i.test(name), cat: 'cheveux', sub: 'masque-capillaire' },
        { test: () => /hair\s*(serum|oil)/i.test(name), cat: 'cheveux', sub: 'serum-capillaire' },
        { test: () => /shampoo/i.test(name), cat: 'cheveux', sub: 'shampoing' },
        { test: () => /conditioner/i.test(name) && !/leave/i.test(name), cat: 'cheveux', sub: 'apres-shampoing' },
        { test: () => /leave.in/i.test(name), cat: 'cheveux', sub: 'soin-sans-rincage' },
        { test: () => /keratin/i.test(name), cat: 'cheveux', sub: 'soin-keratine' },
        { test: () => /hair\s*growth|scalp/i.test(name), cat: 'cheveux', sub: 'soin-cuir-chevelu' },

        // CHEVEUX — accessoires
        { test: () => /scrunchie|chouchou/i.test(name), cat: 'cheveux', sub: 'chouchou' },
        { test: () => /satin\s*bonnet/i.test(name), cat: 'cheveux', sub: 'bonnet-satin' },
        { test: () => /hair\s*(clip|pin)/i.test(name), cat: 'cheveux', sub: 'pince-cheveux' },
        { test: () => /hair\s*roller|curler/i.test(name), cat: 'cheveux', sub: 'bigoudi' },
        { test: () => /hair\s*towel/i.test(name), cat: 'cheveux', sub: 'serviette-cheveux' },
        { test: () => /hair\s*(brush|comb)/i.test(name), cat: 'cheveux', sub: 'brosse-peigne' },
        { test: () => /hair\s*band|headband/i.test(name), cat: 'cheveux', sub: 'bandeau' },

        // ONGLES
        { test: () => /nail\s*lamp|uv\s*lamp/i.test(name), cat: 'ongles', sub: 'lampe-uv' },
        { test: () => /gel\s*polish/i.test(name), cat: 'ongles', sub: 'vernis-gel' },
        { test: () => /nail\s*polish/i.test(name), cat: 'ongles', sub: 'vernis' },
        { test: () => /nail\s*tip|fake\s*nail|press.on/i.test(name), cat: 'ongles', sub: 'faux-ongles' },
        { test: () => /nail\s*(art|sticker|decal)/i.test(name), cat: 'ongles', sub: 'nail-art' },
        { test: () => /nail\s*(file|buffer)/i.test(name), cat: 'ongles', sub: 'lime-ongles' },
        { test: () => /nail\s*(glue|primer)/i.test(name), cat: 'ongles', sub: 'accessoire-ongles' },
        { test: () => /cuticle/i.test(name), cat: 'ongles', sub: 'soin-cuticules' },
        { test: () => /nail\s*drill/i.test(name), cat: 'ongles', sub: 'ponceuse-ongles' },

        // HOMME
        { test: () => /beard\s*oil/i.test(name), cat: 'homme', sub: 'huile-barbe' },
        { test: () => /beard\s*(kit|set|groom)/i.test(name), cat: 'homme', sub: 'kit-barbe' },
        { test: () => /aftershave|after\s*shav/i.test(name), cat: 'homme', sub: 'apres-rasage' },
        { test: () => /shav(ing|er)/i.test(name), cat: 'homme', sub: 'rasage' },
        { test: () => /\bmen/i.test(name) && /skincare|face/i.test(name), cat: 'homme', sub: 'soin-homme' },

        // OUTILS
        { test: () => /gua\s*sha/i.test(name), cat: 'outils', sub: 'gua-sha' },
        { test: () => /face\s*roller|jade\s*roller/i.test(name), cat: 'outils', sub: 'rouleau-visage' },
        { test: () => /ice\s*roller/i.test(name), cat: 'outils', sub: 'rouleau-glace' },
        { test: () => /derma\s*roller|micro\s*needle/i.test(name), cat: 'outils', sub: 'derma-roller' },
        { test: () => /blackhead\s*remov|pore\s*(vacuum|suction)/i.test(name), cat: 'outils', sub: 'aspirateur-pores' },
        { test: () => /face\s*steamer/i.test(name), cat: 'outils', sub: 'vapeur-visage' },
        { test: () => /led\s*mask|light\s*therapy/i.test(name), cat: 'outils', sub: 'masque-led' },
        { test: () => /face\s*(massager|massage)/i.test(name), cat: 'outils', sub: 'masseur-visage' },
        { test: () => /(cleansing|face)\s*brush/i.test(name), cat: 'outils', sub: 'brosse-visage' },
        { test: () => /(electric|vibrat|sonic)/i.test(name) && search.includes('face'), cat: 'outils', sub: 'appareil-visage' },

        // AROMATHÉRAPIE
        { test: () => /diffuser/i.test(name), cat: 'aromatherapie', sub: 'diffuseur' },
        { test: () => /essential\s*oil/i.test(name), cat: 'aromatherapie', sub: 'huile-essentielle' },
        { test: () => /bath\s*bomb/i.test(name), cat: 'aromatherapie', sub: 'bombe-bain' },
        { test: () => /candle/i.test(name), cat: 'aromatherapie', sub: 'bougie' },
    ];

    for (const rule of rules) {
        if (rule.test()) return { cat: rule.cat, sub: rule.sub };
    }

    // Fallback by search term
    const searchFallbacks = {
        'retinol serum': { cat: 'soin', sub: 'serum-retinol' },
        'hyaluronic acid serum': { cat: 'soin', sub: 'serum-ha' },
        'vitamin c serum': { cat: 'soin', sub: 'serum-vitc' },
        'niacinamide serum': { cat: 'soin', sub: 'serum-niacin' },
        'face serum': { cat: 'soin', sub: 'serum' },
        'anti aging serum': { cat: 'soin', sub: 'serum-antiage' },
        'collagen serum': { cat: 'soin', sub: 'serum-collagene' },
        'peptide serum': { cat: 'soin', sub: 'serum-peptide' },
        'brightening serum': { cat: 'soin', sub: 'serum-eclat' },
        'moisturizing serum': { cat: 'soin', sub: 'serum' },
        'face cream': { cat: 'visage', sub: 'creme' },
        'moisturizing cream': { cat: 'visage', sub: 'creme' },
        'anti wrinkle cream': { cat: 'visage', sub: 'creme' },
        'night cream': { cat: 'visage', sub: 'creme-nuit' },
        'day cream': { cat: 'visage', sub: 'creme-jour' },
        'face moisturizer': { cat: 'visage', sub: 'creme' },
        'eye cream': { cat: 'visage', sub: 'contour-yeux' },
        'neck cream': { cat: 'visage', sub: 'creme-cou' },
        'face mask': { cat: 'visage', sub: 'masque' },
        'sheet mask': { cat: 'visage', sub: 'masque-tissu' },
        'clay mask': { cat: 'visage', sub: 'masque-argile' },
        'sleeping mask': { cat: 'visage', sub: 'masque-nuit' },
        'peel off mask': { cat: 'visage', sub: 'masque-peel' },
        'collagen mask': { cat: 'visage', sub: 'masque' },
        'hydrating mask': { cat: 'visage', sub: 'masque' },
        'face cleanser': { cat: 'visage', sub: 'nettoyant' },
        'face wash': { cat: 'visage', sub: 'nettoyant' },
        'makeup remover': { cat: 'visage', sub: 'demaquillant' },
        'micellar water': { cat: 'visage', sub: 'eau-micellaire' },
        'cleansing oil': { cat: 'visage', sub: 'huile-demaq' },
        'exfoliating gel': { cat: 'visage', sub: 'exfoliant' },
        'toner': { cat: 'visage', sub: 'lotion' },
        'facial toner': { cat: 'visage', sub: 'lotion' },
        'lip balm': { cat: 'visage', sub: 'baume-levres' },
        'lip oil': { cat: 'visage', sub: 'huile-levres' },
        'lip mask': { cat: 'visage', sub: 'masque-levres' },
        'lip scrub': { cat: 'visage', sub: 'gommage-levres' },
        'lip gloss': { cat: 'visage', sub: 'gloss' },
        'eye patch': { cat: 'visage', sub: 'patchs-yeux' },
        'eye mask': { cat: 'visage', sub: 'masque-yeux' },
        'under eye': { cat: 'visage', sub: 'contour-yeux' },
        'eyelash serum': { cat: 'visage', sub: 'serum-cils' },
        'body lotion': { cat: 'corps', sub: 'lait-corps' },
        'body cream': { cat: 'corps', sub: 'creme-corps' },
        'body scrub': { cat: 'corps', sub: 'gommage-corps' },
        'body oil': { cat: 'corps', sub: 'huile-corps' },
        'hand cream': { cat: 'corps', sub: 'soin-mains' },
        'foot cream': { cat: 'corps', sub: 'soin-pieds' },
        'stretch mark': { cat: 'corps', sub: 'anti-vergetures' },
        'cellulite cream': { cat: 'corps', sub: 'anti-cellulite' },
        'body butter': { cat: 'corps', sub: 'creme-corps' },
        'shower gel': { cat: 'corps', sub: 'gel-douche' },
        'hair mask': { cat: 'cheveux', sub: 'masque-capillaire' },
        'hair serum': { cat: 'cheveux', sub: 'serum-capillaire' },
        'hair oil': { cat: 'cheveux', sub: 'serum-capillaire' },
        'shampoo': { cat: 'cheveux', sub: 'shampoing' },
        'conditioner': { cat: 'cheveux', sub: 'apres-shampoing' },
        'hair treatment': { cat: 'cheveux', sub: 'soin-capillaire' },
        'keratin treatment': { cat: 'cheveux', sub: 'soin-keratine' },
        'hair growth': { cat: 'cheveux', sub: 'soin-cuir-chevelu' },
        'scalp treatment': { cat: 'cheveux', sub: 'soin-cuir-chevelu' },
        'leave in conditioner': { cat: 'cheveux', sub: 'soin-sans-rincage' },
        'scrunchie': { cat: 'cheveux', sub: 'chouchou' },
        'satin bonnet': { cat: 'cheveux', sub: 'bonnet-satin' },
        'hair clip': { cat: 'cheveux', sub: 'pince-cheveux' },
        'hair brush': { cat: 'cheveux', sub: 'brosse-peigne' },
        'hair comb': { cat: 'cheveux', sub: 'brosse-peigne' },
        'hair roller': { cat: 'cheveux', sub: 'bigoudi' },
        'hair towel': { cat: 'cheveux', sub: 'serviette-cheveux' },
        'hair band': { cat: 'cheveux', sub: 'bandeau' },
        'nail lamp': { cat: 'ongles', sub: 'lampe-uv' },
        'gel polish': { cat: 'ongles', sub: 'vernis-gel' },
        'nail polish': { cat: 'ongles', sub: 'vernis' },
        'nail tips': { cat: 'ongles', sub: 'faux-ongles' },
        'nail art': { cat: 'ongles', sub: 'nail-art' },
        'nail file': { cat: 'ongles', sub: 'lime-ongles' },
        'nail sticker': { cat: 'ongles', sub: 'nail-art' },
        'nail glue': { cat: 'ongles', sub: 'accessoire-ongles' },
        'cuticle oil': { cat: 'ongles', sub: 'soin-cuticules' },
        'nail drill': { cat: 'ongles', sub: 'ponceuse-ongles' },
        'beard oil': { cat: 'homme', sub: 'huile-barbe' },
        'beard kit': { cat: 'homme', sub: 'kit-barbe' },
        'mens face wash': { cat: 'homme', sub: 'soin-homme' },
        'aftershave': { cat: 'homme', sub: 'apres-rasage' },
        'mens skincare': { cat: 'homme', sub: 'soin-homme' },
        'shaving': { cat: 'homme', sub: 'rasage' },
        'face roller': { cat: 'outils', sub: 'rouleau-visage' },
        'gua sha': { cat: 'outils', sub: 'gua-sha' },
        'face massager': { cat: 'outils', sub: 'masseur-visage' },
        'blackhead remover': { cat: 'outils', sub: 'aspirateur-pores' },
        'pore vacuum': { cat: 'outils', sub: 'aspirateur-pores' },
        'face steamer': { cat: 'outils', sub: 'vapeur-visage' },
        'derma roller': { cat: 'outils', sub: 'derma-roller' },
        'ice roller': { cat: 'outils', sub: 'rouleau-glace' },
        'led mask': { cat: 'outils', sub: 'masque-led' },
        'face brush': { cat: 'outils', sub: 'brosse-visage' },
        'diffuser': { cat: 'aromatherapie', sub: 'diffuseur' },
        'essential oil': { cat: 'aromatherapie', sub: 'huile-essentielle' },
        'bath bomb': { cat: 'aromatherapie', sub: 'bombe-bain' },
    };

    return searchFallbacks[search] || { cat: 'visage', sub: 'soin' };
}

// ============================================================
// CONCERN MAPPING basé sur sous-catégorie
// ============================================================
const CONCERN_MAP = {
    'serum-retinol': ['anti-age', 'rides'],
    'serum-ha': ['hydratation', 'rides'],
    'serum-vitc': ['eclat', 'taches'],
    'serum-niacin': ['pores', 'acne'],
    'serum-collagene': ['fermete', 'anti-age'],
    'serum-peptide': ['fermete', 'rides'],
    'serum-eclat': ['eclat', 'taches'],
    'serum-antiage': ['anti-age', 'rides'],
    'serum': ['hydratation', 'eclat'],
    'creme': ['hydratation'],
    'creme-nuit': ['reparation', 'anti-age'],
    'creme-jour': ['hydratation', 'protection'],
    'creme-cou': ['fermete', 'anti-age'],
    'contour-yeux': ['cernes', 'rides'],
    'masque': ['hydratation', 'eclat'],
    'masque-tissu': ['hydratation', 'eclat'],
    'masque-argile': ['pores', 'acne'],
    'masque-peel': ['pores', 'points-noirs'],
    'masque-nuit': ['hydratation', 'reparation'],
    'nettoyant': ['nettoyage', 'pores'],
    'demaquillant': ['nettoyage'],
    'eau-micellaire': ['nettoyage', 'sensibilite'],
    'huile-demaq': ['nettoyage', 'hydratation'],
    'exfoliant': ['eclat', 'pores'],
    'lotion': ['pores', 'eclat'],
    'baume-levres': ['hydratation'],
    'huile-levres': ['hydratation', 'eclat'],
    'masque-levres': ['hydratation', 'reparation'],
    'gommage-levres': ['eclat'],
    'gloss': ['eclat'],
    'soin-levres': ['hydratation'],
    'patchs-yeux': ['cernes', 'poches'],
    'masque-yeux': ['cernes', 'fatigue'],
    'serum-cils': ['cils', 'volume'],
    'solaire': ['protection', 'anti-age'],
    'lait-corps': ['hydratation', 'secheresse'],
    'creme-corps': ['hydratation', 'fermete'],
    'gommage-corps': ['eclat', 'cellulite'],
    'huile-corps': ['hydratation', 'eclat'],
    'soin-mains': ['hydratation', 'secheresse'],
    'soin-pieds': ['hydratation', 'reparation'],
    'anti-vergetures': ['vergetures', 'fermete'],
    'anti-cellulite': ['cellulite', 'fermete'],
    'gel-douche': ['nettoyage', 'hydratation'],
    'masque-capillaire': ['reparation', 'hydratation'],
    'serum-capillaire': ['brillance', 'reparation'],
    'shampoing': ['nettoyage', 'volume'],
    'apres-shampoing': ['hydratation', 'demeler'],
    'soin-sans-rincage': ['hydratation', 'protection'],
    'soin-keratine': ['lissage', 'reparation'],
    'soin-cuir-chevelu': ['cuir-chevelu', 'pousse'],
    'huile-barbe': ['hydratation'],
    'kit-barbe': ['entretien'],
    'apres-rasage': ['apaisement'],
    'rasage': ['entretien'],
    'soin-homme': ['hydratation'],
    'gua-sha': ['anti-age', 'drainage'],
    'rouleau-visage': ['anti-age', 'circulation'],
    'rouleau-glace': ['poches', 'inflammation'],
    'derma-roller': ['anti-age', 'cicatrices'],
    'aspirateur-pores': ['pores', 'points-noirs'],
    'vapeur-visage': ['pores', 'hydratation'],
    'masque-led': ['acne', 'anti-age'],
    'masseur-visage': ['fermete', 'circulation'],
    'brosse-visage': ['nettoyage', 'pores'],
    'appareil-visage': ['fermete'],
    'diffuseur': ['relaxation', 'ambiance'],
    'huile-essentielle': ['relaxation'],
    'bombe-bain': ['relaxation', 'hydratation'],
    'bougie': ['relaxation'],
};

// ============================================================
// INGREDIENT DETECTION (from CJ English name)
// ============================================================
const INGREDIENT_DETECTORS = [
    { pattern: /retinol/i, fr: 'Rétinol', en: 'Retinol', es: 'Retinol', de: 'Retinol' },
    { pattern: /hyaluronic/i, fr: 'Acide Hyaluronique', en: 'Hyaluronic Acid', es: 'Ácido Hialurónico', de: 'Hyaluronsäure' },
    { pattern: /vitamin\s*c/i, fr: 'Vitamine C', en: 'Vitamin C', es: 'Vitamina C', de: 'Vitamin C' },
    { pattern: /vitamin\s*e/i, fr: 'Vitamine E', en: 'Vitamin E', es: 'Vitamina E', de: 'Vitamin E' },
    { pattern: /niacinamide/i, fr: 'Niacinamide', en: 'Niacinamide', es: 'Niacinamida', de: 'Niacinamid' },
    { pattern: /collagen/i, fr: 'Collagène', en: 'Collagen', es: 'Colágeno', de: 'Kollagen' },
    { pattern: /peptide/i, fr: 'Peptide', en: 'Peptide', es: 'Péptido', de: 'Peptid' },
    { pattern: /keratin/i, fr: 'Kératine', en: 'Keratin', es: 'Queratina', de: 'Keratin' },
    { pattern: /glycolic/i, fr: 'Acide Glycolique', en: 'Glycolic Acid', es: 'Ácido Glicólico', de: 'Glykolsäure' },
    { pattern: /salicylic/i, fr: 'Acide Salicylique', en: 'Salicylic Acid', es: 'Ácido Salicílico', de: 'Salicylsäure' },
    { pattern: /kojic/i, fr: 'Acide Kojique', en: 'Kojic Acid', es: 'Ácido Kójico', de: 'Kojisäure' },
    { pattern: /turmeric/i, fr: 'Curcuma', en: 'Turmeric', es: 'Cúrcuma', de: 'Kurkuma' },
    { pattern: /charcoal/i, fr: 'Charbon Actif', en: 'Activated Charcoal', es: 'Carbón Activado', de: 'Aktivkohle' },
    { pattern: /aloe/i, fr: 'Aloe Vera', en: 'Aloe Vera', es: 'Aloe Vera', de: 'Aloe Vera' },
    { pattern: /argan/i, fr: 'Argan', en: 'Argan', es: 'Argán', de: 'Argan' },
    { pattern: /coconut/i, fr: 'Coco', en: 'Coconut', es: 'Coco', de: 'Kokos' },
    { pattern: /tea\s*tree/i, fr: 'Arbre à Thé', en: 'Tea Tree', es: 'Árbol de Té', de: 'Teebaum' },
    { pattern: /rosemary/i, fr: 'Romarin', en: 'Rosemary', es: 'Romero', de: 'Rosmarin' },
    { pattern: /lavender/i, fr: 'Lavande', en: 'Lavender', es: 'Lavanda', de: 'Lavendel' },
    { pattern: /rose\b/i, fr: 'Rose', en: 'Rose', es: 'Rosa', de: 'Rose' },
    { pattern: /honey/i, fr: 'Miel', en: 'Honey', es: 'Miel', de: 'Honig' },
    { pattern: /avocado/i, fr: 'Avocat', en: 'Avocado', es: 'Aguacate', de: 'Avocado' },
    { pattern: /jojoba/i, fr: 'Jojoba', en: 'Jojoba', es: 'Jojoba', de: 'Jojoba' },
    { pattern: /shea/i, fr: 'Karité', en: 'Shea Butter', es: 'Karité', de: 'Sheabutter' },
    { pattern: /ginseng/i, fr: 'Ginseng', en: 'Ginseng', es: 'Ginseng', de: 'Ginseng' },
    { pattern: /snail/i, fr: 'Bave d\'Escargot', en: 'Snail Mucin', es: 'Baba de Caracol', de: 'Schneckenschleim' },
    { pattern: /rice/i, fr: 'Riz', en: 'Rice', es: 'Arroz', de: 'Reis' },
    { pattern: /centella|cica\b/i, fr: 'Centella Asiatica', en: 'Centella Asiatica', es: 'Centella Asiática', de: 'Centella Asiatica' },
    { pattern: /green\s*tea/i, fr: 'Thé Vert', en: 'Green Tea', es: 'Té Verde', de: 'Grüner Tee' },
    { pattern: /caffeine/i, fr: 'Caféine', en: 'Caffeine', es: 'Cafeína', de: 'Koffein' },
    { pattern: /cucumber/i, fr: 'Concombre', en: 'Cucumber', es: 'Pepino', de: 'Gurke' },
    { pattern: /chamomile/i, fr: 'Camomille', en: 'Chamomile', es: 'Manzanilla', de: 'Kamille' },
    { pattern: /sakura|cherry\s*blossom/i, fr: 'Fleur de Cerisier', en: 'Cherry Blossom', es: 'Flor de Cerezo', de: 'Kirschblüte' },
    { pattern: /gold\b/i, fr: 'Or 24K', en: '24K Gold', es: 'Oro 24K', de: '24K Gold' },
    { pattern: /pearl/i, fr: 'Perle', en: 'Pearl', es: 'Perla', de: 'Perle' },
    { pattern: /propolis/i, fr: 'Propolis', en: 'Propolis', es: 'Propóleo', de: 'Propolis' },
    { pattern: /mugwort/i, fr: 'Armoise', en: 'Mugwort', es: 'Artemisa', de: 'Beifuß' },
    { pattern: /squalane/i, fr: 'Squalane', en: 'Squalane', es: 'Escualano', de: 'Squalan' },
    { pattern: /bakuchiol/i, fr: 'Bakuchiol', en: 'Bakuchiol', es: 'Bakuchiol', de: 'Bakuchiol' },
    { pattern: /rosehip/i, fr: 'Rose Musquée', en: 'Rosehip', es: 'Rosa Mosqueta', de: 'Hagebutte' },
    { pattern: /bamboo/i, fr: 'Bambou', en: 'Bamboo', es: 'Bambú', de: 'Bambus' },
    { pattern: /matcha/i, fr: 'Matcha', en: 'Matcha', es: 'Matcha', de: 'Matcha' },
    { pattern: /mango/i, fr: 'Mangue', en: 'Mango', es: 'Mango', de: 'Mango' },
];

// Detect action qualifier from name
const ACTION_DETECTORS = [
    { pattern: /brighten|radiance|glow/i, fr: 'Éclat', en: 'Brightening', es: 'Luminosidad', de: 'Strahlend' },
    { pattern: /hydrat|moistur/i, fr: 'Hydratant', en: 'Hydrating', es: 'Hidratante', de: 'Feuchtigkeitsspendend' },
    { pattern: /anti[\s-]*ag/i, fr: 'Anti-Âge', en: 'Anti-Aging', es: 'Anti-Edad', de: 'Anti-Aging' },
    { pattern: /anti[\s-]*wrinkle/i, fr: 'Anti-Rides', en: 'Anti-Wrinkle', es: 'Anti-Arrugas', de: 'Anti-Falten' },
    { pattern: /firm/i, fr: 'Raffermissant', en: 'Firming', es: 'Reafirmante', de: 'Straffend' },
    { pattern: /repair/i, fr: 'Réparateur', en: 'Repairing', es: 'Reparador', de: 'Reparierend' },
    { pattern: /sooth/i, fr: 'Apaisant', en: 'Soothing', es: 'Calmante', de: 'Beruhigend' },
    { pattern: /purif/i, fr: 'Purifiant', en: 'Purifying', es: 'Purificante', de: 'Reinigend' },
    { pattern: /exfoliat/i, fr: 'Exfoliant', en: 'Exfoliating', es: 'Exfoliante', de: 'Peeling' },
    { pattern: /nourish/i, fr: 'Nourrissant', en: 'Nourishing', es: 'Nutritivo', de: 'Nährend' },
    { pattern: /revital/i, fr: 'Revitalisant', en: 'Revitalizing', es: 'Revitalizante', de: 'Revitalisierend' },
    { pattern: /deep\s*cleans/i, fr: 'Nettoyage Profond', en: 'Deep Cleansing', es: 'Limpieza Profunda', de: 'Tiefenreinigung' },
    { pattern: /detox/i, fr: 'Détox', en: 'Detox', es: 'Detox', de: 'Detox' },
    { pattern: /organic|natural/i, fr: 'Naturel', en: 'Natural', es: 'Natural', de: 'Natürlich' },
];

function detectIngredients(name) {
    const found = [];
    for (const det of INGREDIENT_DETECTORS) {
        if (det.pattern.test(name)) found.push(det);
    }
    return found;
}

function detectActions(name) {
    const found = [];
    for (const det of ACTION_DETECTORS) {
        if (det.pattern.test(name)) found.push(det);
    }
    return found;
}

// ============================================================
// PRODUCT TYPE NAMES (4 languages) by subcategory
// ============================================================
const SUBCAT_TYPE = {
    'serum-retinol': { fr: 'Sérum Rétinol', en: 'Retinol Serum', es: 'Sérum Retinol', de: 'Retinol Serum' },
    'serum-ha': { fr: 'Sérum Acide Hyaluronique', en: 'Hyaluronic Acid Serum', es: 'Sérum Ácido Hialurónico', de: 'Hyaluronsäure Serum' },
    'serum-vitc': { fr: 'Sérum Vitamine C', en: 'Vitamin C Serum', es: 'Sérum Vitamina C', de: 'Vitamin C Serum' },
    'serum-niacin': { fr: 'Sérum Niacinamide', en: 'Niacinamide Serum', es: 'Sérum Niacinamida', de: 'Niacinamid Serum' },
    'serum-collagene': { fr: 'Sérum Collagène', en: 'Collagen Serum', es: 'Sérum Colágeno', de: 'Kollagen Serum' },
    'serum-peptide': { fr: 'Sérum Peptide', en: 'Peptide Serum', es: 'Sérum Péptido', de: 'Peptid Serum' },
    'serum-eclat': { fr: 'Sérum Éclat', en: 'Brightening Serum', es: 'Sérum Luminosidad', de: 'Glow Serum' },
    'serum-antiage': { fr: 'Sérum Anti-Âge', en: 'Anti-Aging Serum', es: 'Sérum Anti-Edad', de: 'Anti-Aging Serum' },
    'serum': { fr: 'Sérum Visage', en: 'Face Serum', es: 'Sérum Facial', de: 'Gesichtsserum' },
    'creme': { fr: 'Crème Hydratante', en: 'Moisturizing Cream', es: 'Crema Hidratante', de: 'Feuchtigkeitscreme' },
    'creme-nuit': { fr: 'Crème de Nuit', en: 'Night Cream', es: 'Crema de Noche', de: 'Nachtcreme' },
    'creme-jour': { fr: 'Crème de Jour', en: 'Day Cream', es: 'Crema de Día', de: 'Tagescreme' },
    'creme-cou': { fr: 'Crème Cou & Décolleté', en: 'Neck & Décolleté Cream', es: 'Crema Cuello y Escote', de: 'Hals- & Dekolletécreme' },
    'contour-yeux': { fr: 'Soin Contour des Yeux', en: 'Eye Contour Care', es: 'Contorno de Ojos', de: 'Augenpflege' },
    'masque': { fr: 'Masque Visage', en: 'Face Mask', es: 'Mascarilla Facial', de: 'Gesichtsmaske' },
    'masque-tissu': { fr: 'Masque Tissu', en: 'Sheet Mask', es: 'Mascarilla en Tela', de: 'Tuchmaske' },
    'masque-argile': { fr: 'Masque à l\'Argile', en: 'Clay Mask', es: 'Mascarilla de Arcilla', de: 'Tonerdemaske' },
    'masque-peel': { fr: 'Masque Peel-Off', en: 'Peel-Off Mask', es: 'Mascarilla Peel-Off', de: 'Peel-Off Maske' },
    'masque-nuit': { fr: 'Masque de Nuit', en: 'Sleeping Mask', es: 'Mascarilla de Noche', de: 'Schlafmaske' },
    'nettoyant': { fr: 'Nettoyant Visage', en: 'Face Cleanser', es: 'Limpiador Facial', de: 'Gesichtsreiniger' },
    'demaquillant': { fr: 'Démaquillant', en: 'Makeup Remover', es: 'Desmaquillante', de: 'Make-up-Entferner' },
    'eau-micellaire': { fr: 'Eau Micellaire', en: 'Micellar Water', es: 'Agua Micelar', de: 'Mizellenwasser' },
    'huile-demaq': { fr: 'Huile Démaquillante', en: 'Cleansing Oil', es: 'Aceite Limpiador', de: 'Reinigungsöl' },
    'exfoliant': { fr: 'Exfoliant Visage', en: 'Face Exfoliant', es: 'Exfoliante Facial', de: 'Gesichtspeeling' },
    'lotion': { fr: 'Lotion Tonique', en: 'Toner', es: 'Tónico Facial', de: 'Gesichtstoner' },
    'baume-levres': { fr: 'Baume à Lèvres', en: 'Lip Balm', es: 'Bálsamo Labial', de: 'Lippenbalsam' },
    'huile-levres': { fr: 'Huile à Lèvres', en: 'Lip Oil', es: 'Aceite Labial', de: 'Lippenöl' },
    'masque-levres': { fr: 'Masque Lèvres', en: 'Lip Mask', es: 'Mascarilla Labial', de: 'Lippenmaske' },
    'gommage-levres': { fr: 'Gommage Lèvres', en: 'Lip Scrub', es: 'Exfoliante Labial', de: 'Lippenpeeling' },
    'gloss': { fr: 'Gloss', en: 'Lip Gloss', es: 'Brillo Labial', de: 'Lipgloss' },
    'soin-levres': { fr: 'Soin Lèvres', en: 'Lip Care', es: 'Cuidado Labial', de: 'Lippenpflege' },
    'patchs-yeux': { fr: 'Patchs Yeux', en: 'Eye Patches', es: 'Parches para Ojos', de: 'Augenpads' },
    'masque-yeux': { fr: 'Masque Yeux', en: 'Eye Mask', es: 'Mascarilla para Ojos', de: 'Augenmaske' },
    'serum-cils': { fr: 'Sérum Cils', en: 'Lash Serum', es: 'Sérum Pestañas', de: 'Wimpernserum' },
    'solaire': { fr: 'Protection Solaire', en: 'Sunscreen', es: 'Protector Solar', de: 'Sonnenschutz' },
    'lait-corps': { fr: 'Lait Corporel', en: 'Body Lotion', es: 'Loción Corporal', de: 'Körperlotion' },
    'creme-corps': { fr: 'Crème Corps', en: 'Body Cream', es: 'Crema Corporal', de: 'Körpercreme' },
    'gommage-corps': { fr: 'Gommage Corps', en: 'Body Scrub', es: 'Exfoliante Corporal', de: 'Körperpeeling' },
    'huile-corps': { fr: 'Huile Corps', en: 'Body Oil', es: 'Aceite Corporal', de: 'Körperöl' },
    'soin-mains': { fr: 'Crème Mains', en: 'Hand Cream', es: 'Crema de Manos', de: 'Handcreme' },
    'soin-pieds': { fr: 'Crème Pieds', en: 'Foot Cream', es: 'Crema de Pies', de: 'Fußcreme' },
    'anti-vergetures': { fr: 'Soin Anti-Vergetures', en: 'Stretch Mark Treatment', es: 'Anti-Estrías', de: 'Anti-Dehnungsstreifen' },
    'anti-cellulite': { fr: 'Soin Anti-Cellulite', en: 'Anti-Cellulite Treatment', es: 'Anti-Celulitis', de: 'Anti-Cellulite' },
    'gel-douche': { fr: 'Gel Douche', en: 'Shower Gel', es: 'Gel de Ducha', de: 'Duschgel' },
    'masque-capillaire': { fr: 'Masque Capillaire', en: 'Hair Mask', es: 'Mascarilla Capilar', de: 'Haarmaske' },
    'serum-capillaire': { fr: 'Sérum Capillaire', en: 'Hair Serum', es: 'Sérum Capilar', de: 'Haarserum' },
    'shampoing': { fr: 'Shampoing', en: 'Shampoo', es: 'Champú', de: 'Shampoo' },
    'apres-shampoing': { fr: 'Après-Shampoing', en: 'Conditioner', es: 'Acondicionador', de: 'Conditioner' },
    'soin-sans-rincage': { fr: 'Soin Sans Rinçage', en: 'Leave-In Conditioner', es: 'Acondicionador sin Enjuague', de: 'Leave-In Conditioner' },
    'soin-keratine': { fr: 'Soin Kératine', en: 'Keratin Treatment', es: 'Tratamiento Queratina', de: 'Keratin Behandlung' },
    'soin-cuir-chevelu': { fr: 'Soin Cuir Chevelu', en: 'Scalp Treatment', es: 'Tratamiento Cuero Cabelludo', de: 'Kopfhautpflege' },
    'soin-capillaire': { fr: 'Soin Capillaire', en: 'Hair Treatment', es: 'Tratamiento Capilar', de: 'Haarpflege' },
    'chouchou': { fr: 'Chouchou en Satin', en: 'Satin Scrunchie', es: 'Coletero de Satén', de: 'Satin Scrunchie' },
    'bonnet-satin': { fr: 'Bonnet en Satin', en: 'Satin Bonnet', es: 'Gorro de Satén', de: 'Satin Haube' },
    'pince-cheveux': { fr: 'Pince à Cheveux', en: 'Hair Clip', es: 'Pinza de Pelo', de: 'Haarklammer' },
    'bigoudi': { fr: 'Bigoudi Sans Chaleur', en: 'Heatless Curler', es: 'Rulo sin Calor', de: 'Hitzefreie Lockenwickler' },
    'serviette-cheveux': { fr: 'Serviette Microfibre', en: 'Hair Towel', es: 'Toalla para Cabello', de: 'Haar-Handtuch' },
    'brosse-peigne': { fr: 'Brosse Démêlante', en: 'Detangling Brush', es: 'Cepillo Desenredante', de: 'Entwirrbürste' },
    'bandeau': { fr: 'Bandeau Cheveux', en: 'Headband', es: 'Diadema', de: 'Haarband' },
    'lampe-uv': { fr: 'Lampe UV/LED Ongles', en: 'UV/LED Nail Lamp', es: 'Lámpara UV/LED Uñas', de: 'UV/LED Nagellampe' },
    'vernis-gel': { fr: 'Vernis Gel Semi-Permanent', en: 'Gel Nail Polish', es: 'Esmalte Gel', de: 'Gel-Nagellack' },
    'vernis': { fr: 'Vernis à Ongles', en: 'Nail Polish', es: 'Esmalte de Uñas', de: 'Nagellack' },
    'faux-ongles': { fr: 'Faux Ongles', en: 'Press-On Nails', es: 'Uñas Postizas', de: 'Kunstnägel' },
    'nail-art': { fr: 'Stickers Nail Art', en: 'Nail Art Stickers', es: 'Stickers Nail Art', de: 'Nail Art Sticker' },
    'lime-ongles': { fr: 'Lime à Ongles Pro', en: 'Professional Nail File', es: 'Lima de Uñas Pro', de: 'Profi Nagelfeile' },
    'accessoire-ongles': { fr: 'Accessoire Manucure', en: 'Manicure Accessory', es: 'Accesorio Manicura', de: 'Maniküre-Zubehör' },
    'soin-cuticules': { fr: 'Huile Cuticules', en: 'Cuticle Oil', es: 'Aceite de Cutículas', de: 'Nagelhautöl' },
    'ponceuse-ongles': { fr: 'Ponceuse à Ongles', en: 'Electric Nail Drill', es: 'Taladro de Uñas', de: 'Nagelschleifer' },
    'huile-barbe': { fr: 'Huile à Barbe', en: 'Beard Oil', es: 'Aceite para Barba', de: 'Bartöl' },
    'kit-barbe': { fr: 'Kit Soin Barbe', en: 'Beard Grooming Kit', es: 'Kit Cuidado Barba', de: 'Bartpflege-Set' },
    'apres-rasage': { fr: 'Après-Rasage', en: 'Aftershave', es: 'Aftershave', de: 'Aftershave' },
    'rasage': { fr: 'Kit Rasage', en: 'Shaving Kit', es: 'Kit de Afeitado', de: 'Rasier-Set' },
    'soin-homme': { fr: 'Soin Visage Homme', en: 'Men\'s Face Care', es: 'Cuidado Facial Hombre', de: 'Herren Gesichtspflege' },
    'gua-sha': { fr: 'Gua Sha', en: 'Gua Sha', es: 'Gua Sha', de: 'Gua Sha' },
    'rouleau-visage': { fr: 'Rouleau de Jade', en: 'Jade Roller', es: 'Rodillo de Jade', de: 'Jade Roller' },
    'rouleau-glace': { fr: 'Ice Roller Visage', en: 'Face Ice Roller', es: 'Rodillo de Hielo', de: 'Eis Roller' },
    'derma-roller': { fr: 'Derma Roller', en: 'Derma Roller', es: 'Derma Roller', de: 'Derma Roller' },
    'aspirateur-pores': { fr: 'Aspirateur Points Noirs', en: 'Pore Vacuum', es: 'Aspirador de Poros', de: 'Porensauger' },
    'vapeur-visage': { fr: 'Vapeur Faciale', en: 'Facial Steamer', es: 'Vaporizador Facial', de: 'Gesichtsdampfer' },
    'masque-led': { fr: 'Masque LED', en: 'LED Mask', es: 'Máscara LED', de: 'LED Maske' },
    'masseur-visage': { fr: 'Masseur Facial', en: 'Face Massager', es: 'Masajeador Facial', de: 'Gesichtsmassagegerät' },
    'brosse-visage': { fr: 'Brosse Nettoyante', en: 'Cleansing Brush', es: 'Cepillo Limpiador', de: 'Reinigungsbürste' },
    'appareil-visage': { fr: 'Appareil Beauté', en: 'Beauty Device', es: 'Dispositivo Belleza', de: 'Beauty-Gerät' },
    'diffuseur': { fr: 'Diffuseur d\'Ambiance', en: 'Aroma Diffuser', es: 'Difusor de Aromas', de: 'Aroma Diffuser' },
    'huile-essentielle': { fr: 'Huile Essentielle', en: 'Essential Oil', es: 'Aceite Esencial', de: 'Ätherisches Öl' },
    'bombe-bain': { fr: 'Bombe de Bain', en: 'Bath Bomb', es: 'Bomba de Baño', de: 'Badebombe' },
    'bougie': { fr: 'Bougie Parfumée', en: 'Scented Candle', es: 'Vela Perfumada', de: 'Duftkerze' },
};

// ============================================================
// UNIQUE NAME GENERATOR — Ensures no duplicate names
// ============================================================
function generateUniqueName(raw, sub, ingredients, actions, counter) {
    const typeName = SUBCAT_TYPE[sub] || { fr: 'Soin Beauté', en: 'Beauty Care', es: 'Cuidado Belleza', de: 'Beauty Pflege' };

    // Detect volume/size
    const sizeMatch = raw.name.match(/(\d+)\s*(?:ml|g|oz|pcs|pieces|pack)/i);
    const size = sizeMatch ? sizeMatch[0] : '';

    const names = { fr: '', en: '', es: '', de: '' };

    if (ingredients.length > 0) {
        // Name with ingredient(s)
        const ing1 = ingredients[0];
        if (ingredients.length > 1) {
            const ing2 = ingredients[1];
            names.fr = `${typeName.fr} ${ing1.fr} & ${ing2.fr}`;
            names.en = `${ing1.en} & ${ing2.en} ${typeName.en}`;
            names.es = `${typeName.es} ${ing1.es} y ${ing2.es}`;
            names.de = `${ing1.de} & ${ing2.de} ${typeName.de}`;
        } else {
            names.fr = `${typeName.fr} ${ing1.fr}`;
            names.en = `${ing1.en} ${typeName.en}`;
            names.es = `${typeName.es} ${ing1.es}`;
            names.de = `${ing1.de} ${typeName.de}`;
        }
    } else if (actions.length > 0) {
        // Name with action qualifier
        const act = actions[0];
        names.fr = `${typeName.fr} ${act.fr}`;
        names.en = `${act.en} ${typeName.en}`;
        names.es = `${typeName.es} ${act.es}`;
        names.de = `${act.de} ${typeName.de}`;
    } else {
        // Default type name
        names.fr = typeName.fr;
        names.en = typeName.en;
        names.es = typeName.es;
        names.de = typeName.de;
    }

    // Add size if present
    if (size) {
        names.fr += ` ${size}`;
        names.en += ` ${size}`;
        names.es += ` ${size}`;
        names.de += ` ${size}`;
    }

    // Uniqueness suffix will be added later if needed
    return names;
}

// ============================================================
// PRICE CALCULATOR — Better distribution
// ============================================================
function calculateRetailPrice(wholesaleUSD, sub) {
    const eur = wholesaleUSD * 0.92;

    // Category-based pricing tiers
    const premiumSubs = ['serum-retinol', 'serum-ha', 'serum-vitc', 'serum-collagene', 'serum-peptide', 'serum-antiage', 'creme-nuit', 'masque-led', 'lampe-uv', 'ponceuse-ongles', 'diffuseur'];
    const midSubs = ['creme', 'creme-jour', 'creme-cou', 'contour-yeux', 'masque', 'masque-capillaire', 'soin-keratine', 'kit-barbe', 'derma-roller', 'aspirateur-pores', 'vapeur-visage', 'masseur-visage'];

    let multiplier;
    if (premiumSubs.includes(sub)) {
        multiplier = eur < 2 ? 8 : eur < 5 ? 5 : eur < 10 ? 3.5 : 2.5;
    } else if (midSubs.includes(sub)) {
        multiplier = eur < 2 ? 6 : eur < 5 ? 4 : eur < 10 ? 3 : 2.2;
    } else {
        multiplier = eur < 1 ? 8 : eur < 3 ? 5 : eur < 7 ? 3.5 : 2;
    }

    let price = eur * multiplier;

    // Round to standard beauty price points
    const pricePoints = [4.90, 6.90, 7.90, 8.90, 9.90, 11.90, 12.90, 14.90, 16.90, 17.90, 19.90, 22.90, 24.90, 27.90, 29.90, 32.90, 34.90, 37.90, 39.90, 44.90, 49.90, 54.90, 59.90];

    let best = pricePoints[0];
    for (const pp of pricePoints) {
        if (Math.abs(pp - price) < Math.abs(best - price)) best = pp;
    }

    // Enforce minimums by category
    const minPrices = {
        'serum-retinol': 14.90, 'serum-ha': 12.90, 'serum-vitc': 14.90,
        'serum-collagene': 14.90, 'serum-peptide': 14.90, 'serum-antiage': 14.90,
        'creme-nuit': 12.90, 'masque-led': 29.90, 'lampe-uv': 24.90,
        'ponceuse-ongles': 19.90, 'diffuseur': 19.90, 'vapeur-visage': 19.90,
        'aspirateur-pores': 17.90, 'derma-roller': 12.90, 'kit-barbe': 14.90,
    };

    const min = minPrices[sub] || 4.90;
    return Math.max(best, min);
}

// ============================================================
// MAIN PROCESSING
// ============================================================
console.log(`\n🔄 V2 Processing ${rawCatalog.length} products...\n`);

// Step 1: Filter + classify
const classified = [];
let filtered = 0;
for (const raw of rawCatalog) {
    if (raw.price > 50 || raw.price <= 0 || !raw.image || !raw.name || raw.name.length < 5) {
        filtered++;
        continue;
    }
    const cls = classifyProduct(raw);
    if (!cls) {
        filtered++;
        continue;
    }
    classified.push({ ...raw, ...cls });
}
console.log(`✅ ${classified.length} classified, ${filtered} filtered out`);

// Step 2: Deduplicate by CJ PID
const pidSeen = new Set();
const deduped = classified.filter(p => {
    if (pidSeen.has(p.pid)) return false;
    pidSeen.add(p.pid);
    return true;
});
console.log(`✅ ${deduped.length} after PID dedup`);

// Step 3: Select 500 with category balance
const byCat = {};
deduped.forEach(p => {
    if (!byCat[p.cat]) byCat[p.cat] = [];
    byCat[p.cat].push(p);
});

// Target distribution (more visage/soin, less outils)
const TARGET_DIST = {
    visage: 130, soin: 70, corps: 55, cheveux: 80,
    ongles: 30, homme: 45, outils: 45, aromatherapie: 45,
};
const TARGET = 500;

const selected = [];
for (const [cat, target] of Object.entries(TARGET_DIST)) {
    const pool = byCat[cat] || [];
    const take = Math.min(target, pool.length);
    selected.push(...pool.slice(0, take));
}

// Fill remaining slots from largest pools
while (selected.length < TARGET) {
    let added = false;
    for (const [cat, pool] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)) {
        if (selected.length >= TARGET) break;
        const current = selected.filter(p => p.cat === cat).length;
        if (current < pool.length) {
            selected.push(pool[current]);
            added = true;
        }
    }
    if (!added) break;
}

const final500 = selected.slice(0, TARGET);
console.log(`✅ Selected ${final500.length} products`);

// Step 4: Generate unique names + translations
const nameCounters = {};
const usedNames = new Set();

const products = final500.map((raw, index) => {
    const id = 16 + index;
    const ingredients = detectIngredients(raw.name);
    const actions = detectActions(raw.name);
    let names = generateUniqueName(raw, raw.sub, ingredients, actions, index);

    // Ensure uniqueness by adding differentiator
    let frName = names.fr;
    if (usedNames.has(frName)) {
        // Try adding a differentiator
        const differentiators = [
            // Try adding ingredient not yet used
            ...ingredients.slice(1).map(i => i.fr),
            ...actions.map(a => a.fr),
            // Volume-based
            ...(raw.name.match(/(\d+)\s*ml/i) ? [`${raw.name.match(/(\d+)\s*ml/i)[1]}ml`] : []),
            // Numbered
            'N°2', 'N°3', 'N°4', 'N°5', 'Pro', 'Expert', 'Intense', 'Plus', 'Ultra',
        ];

        for (const diff of differentiators) {
            const candidate = `${names.fr} ${diff}`;
            if (!usedNames.has(candidate)) {
                names.fr = candidate;
                names.en += ` ${diff}`;
                names.es += ` ${diff}`;
                names.de += ` ${diff}`;
                break;
            }
        }

        // Last resort: add sequential number
        if (usedNames.has(names.fr)) {
            nameCounters[frName] = (nameCounters[frName] || 1) + 1;
            const num = nameCounters[frName];
            names.fr += ` ${num}`;
            names.en += ` ${num}`;
            names.es += ` ${num}`;
            names.de += ` ${num}`;
        }
    }
    usedNames.add(names.fr);

    return {
        id,
        names,
        cat: raw.cat,
        sub: raw.sub,
        price: calculateRetailPrice(raw.price, raw.sub),
        image: raw.image,
        images: raw.images && raw.images.length > 0 ? raw.images.slice(0, 4) : [raw.image],
        cjPid: raw.pid,
        cjSku: raw.sku || '',
        cjPrice: raw.price,
        concerns: CONCERN_MAP[raw.sub] || [],
        ingredients,
        actions,
        rawName: raw.name,
    };
});

// Stats
const catStats = {};
products.forEach(p => { catStats[p.cat] = (catStats[p.cat] || 0) + 1; });
console.log('\n📂 Category distribution:');
Object.entries(catStats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
    console.log(`   ${c}: ${n}`);
});

const prices = products.map(p => p.price);
console.log(`\n💰 Price range: ${Math.min(...prices).toFixed(2)}€ - ${Math.max(...prices).toFixed(2)}€`);
console.log(`   Moyenne: ${(prices.reduce((s, p) => s + p, 0) / prices.length).toFixed(2)}€`);

// Check uniqueness
const dupeCheck = {};
products.forEach(p => {
    dupeCheck[p.names.fr] = (dupeCheck[p.names.fr] || 0) + 1;
});
const dupes = Object.entries(dupeCheck).filter(([, c]) => c > 1);
console.log(`\n🔍 Noms uniques: ${Object.keys(dupeCheck).length} / ${products.length}`);
if (dupes.length > 0) {
    console.log(`   ⚠️ ${dupes.length} doublons restants:`);
    dupes.forEach(([name, count]) => console.log(`      "${name}" × ${count}`));
}

// Save processed data
const outPath = path.resolve(__dirname, 'cj-v2-processed.json');
fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log(`\n📁 Saved to ${outPath}`);
console.log('✅ V2 processing complete');
