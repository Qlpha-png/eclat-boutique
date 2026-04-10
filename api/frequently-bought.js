/**
 * GET /api/frequently-bought?productId=X — Produits fréquemment achetés ensemble
 * Retourne le top 3 des co-occurrences d'achat
 * Fallback : produits aléatoires de la même catégorie si < 3 résultats
 * Cache 24h via table co_occurrence_cache
 *
 * SQL Schema:
 * CREATE TABLE co_occurrence_cache (
 *   id          BIGSERIAL PRIMARY KEY,
 *   product_id  INTEGER NOT NULL UNIQUE,
 *   results     JSONB NOT NULL DEFAULT '[]',
 *   cached_at   TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 * CREATE INDEX idx_co_occurrence_product ON co_occurrence_cache(product_id);
 *
 * -- Table order_items (référence, déjà existante)
 * -- CREATE TABLE order_items (
 * --   id          BIGSERIAL PRIMARY KEY,
 * --   order_id    BIGINT NOT NULL REFERENCES orders(id),
 * --   product_id  INTEGER NOT NULL,
 * --   quantity    INTEGER NOT NULL DEFAULT 1,
 * --   price       NUMERIC(10,2) NOT NULL
 * -- );
 *
 * -- Table products (référence, déjà existante)
 * -- CREATE TABLE products (
 * --   id          SERIAL PRIMARY KEY,
 * --   name        TEXT NOT NULL,
 * --   category    TEXT,
 * --   price       NUMERIC(10,2),
 * --   image_url   TEXT,
 * --   active      BOOLEAN DEFAULT true
 * -- );
 */

const { createClient } = require('@supabase/supabase-js');

var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop'
];

var CACHE_DURATION_HOURS = 24;
var TOP_RESULTS = 3;

function setCors(req, res) {
    var origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

function isCacheValid(cachedAt) {
    var cacheDate = new Date(cachedAt);
    var now = new Date();
    var diffHours = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60);
    return diffHours < CACHE_DURATION_HOURS;
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });

    var supabase = getSupabase();

    // ========== Mode "top bestsellers" : GET /api/frequently-bought?top=6 ==========
    var topN = parseInt(req.query.top);
    if (topN && !isNaN(topN) && topN > 0 && topN <= 20) {
        try {
            // Requête : top N produits les plus commandés (par quantité totale)
            var { data: topProducts, error: topErr } = await supabase
                .rpc('get_bestsellers', { limit_count: topN });

            if (topErr || !topProducts || topProducts.length === 0) {
                // Fallback SQL direct si la fonction RPC n'existe pas
                var { data: topDirect, error: topDirectErr } = await supabase
                    .from('order_items')
                    .select('product_id, quantity')
                    .order('quantity', { ascending: false });

                if (!topDirectErr && topDirect && topDirect.length > 0) {
                    // Agrégation côté client
                    var counts = {};
                    topDirect.forEach(function(item) {
                        counts[item.product_id] = (counts[item.product_id] || 0) + item.quantity;
                    });
                    var sorted = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; }).slice(0, topN);
                    var bestsellers = sorted.map(function(pid) { return { product_id: parseInt(pid), total_sold: counts[pid] }; });
                    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
                    return res.status(200).json({ bestsellers: bestsellers, source: 'orders' });
                }
                // Aucune commande = pas de bestsellers
                return res.status(200).json({ bestsellers: [], source: 'none' });
            }

            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
            return res.status(200).json({ bestsellers: topProducts, source: 'rpc' });
        } catch(e) {
            return res.status(200).json({ bestsellers: [], source: 'error' });
        }
    }

    // ========== Mode co-occurrence : GET /api/frequently-bought?productId=X ==========
    var productId = parseInt(req.query.productId);
    if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: 'productId ou top requis' });
    }

    try {
        // ========== 1. Vérifier le cache (24h) ==========
        var { data: cached, error: cacheErr } = await supabase
            .from('co_occurrence_cache')
            .select('results, cached_at')
            .eq('product_id', productId)
            .single();

        if (!cacheErr && cached && isCacheValid(cached.cached_at)) {
            var cachedResults = cached.results || [];
            if (cachedResults.length >= TOP_RESULTS) {
                res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
                return res.status(200).json({
                    productId: productId,
                    frequently_bought: cachedResults.slice(0, TOP_RESULTS),
                    source: 'cache'
                });
            }
        }

        // ========== 2. Calculer les co-occurrences depuis order_items ==========
        // Étape A : trouver toutes les commandes contenant ce produit
        var { data: orderEntries, error: oeErr } = await supabase
            .from('order_items')
            .select('order_id')
            .eq('product_id', productId);

        if (oeErr) throw oeErr;

        var coOccurrences = [];

        if (orderEntries && orderEntries.length > 0) {
            var orderIds = [];
            for (var i = 0; i < orderEntries.length; i++) {
                orderIds.push(orderEntries[i].order_id);
            }

            // Étape B : trouver tous les autres produits dans ces commandes
            var { data: coItems, error: coErr } = await supabase
                .from('order_items')
                .select('product_id')
                .in('order_id', orderIds)
                .neq('product_id', productId);

            if (coErr) throw coErr;

            if (coItems && coItems.length > 0) {
                // Compter les occurrences par product_id
                var countMap = {};
                for (var c = 0; c < coItems.length; c++) {
                    var pid = coItems[c].product_id;
                    countMap[pid] = (countMap[pid] || 0) + 1;
                }

                // Trier par nombre d'occurrences décroissant
                var sorted = Object.keys(countMap).map(function(key) {
                    return { product_id: parseInt(key), count: countMap[key] };
                });
                sorted.sort(function(a, b) {
                    return b.count - a.count;
                });

                coOccurrences = sorted.slice(0, TOP_RESULTS);
            }
        }

        // ========== 3. Fallback : produits de la même catégorie si < 3 résultats ==========
        if (coOccurrences.length < TOP_RESULTS) {
            var existingIds = coOccurrences.map(function(item) {
                return item.product_id;
            });
            existingIds.push(productId); // Exclure le produit lui-même

            // Récupérer la catégorie du produit actuel
            var { data: currentProduct, error: cpErr } = await supabase
                .from('products')
                .select('category')
                .eq('id', productId)
                .single();

            if (!cpErr && currentProduct && currentProduct.category) {
                var needed = TOP_RESULTS - coOccurrences.length;

                var { data: fallbackProducts, error: fbErr } = await supabase
                    .from('products')
                    .select('id')
                    .eq('category', currentProduct.category)
                    .eq('active', true)
                    .not('id', 'in', '(' + existingIds.join(',') + ')')
                    .limit(needed);

                if (!fbErr && fallbackProducts && fallbackProducts.length > 0) {
                    for (var f = 0; f < fallbackProducts.length; f++) {
                        coOccurrences.push({
                            product_id: fallbackProducts[f].id,
                            count: 0
                        });
                    }
                }
            }
        }

        // ========== 4. Mettre en cache les résultats ==========
        var cachePayload = coOccurrences.map(function(item) {
            return { product_id: item.product_id, count: item.count };
        });

        await supabase
            .from('co_occurrence_cache')
            .upsert({
                product_id: productId,
                results: cachePayload,
                cached_at: new Date().toISOString()
            }, { onConflict: 'product_id' })
            .then(function() {})
            .catch(function(err) {
                console.error('[frequently-bought] Cache write error:', err.message);
            });

        // ========== 5. Réponse ==========
        var resultIds = coOccurrences.map(function(item) {
            return item.product_id;
        });

        var source = 'data';
        if (coOccurrences.length > 0 && coOccurrences[coOccurrences.length - 1].count === 0) {
            source = 'mixed'; // Certains résultats viennent du fallback
        }
        if (coOccurrences.length > 0 && coOccurrences[0].count === 0) {
            source = 'fallback'; // Tous les résultats viennent du fallback
        }

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
        return res.status(200).json({
            productId: productId,
            frequently_bought: resultIds,
            source: source
        });

    } catch (err) {
        console.error('[frequently-bought]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
