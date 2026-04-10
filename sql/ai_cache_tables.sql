-- ================================================
-- Tables de cache pour les fonctionnalités IA
-- Phase 5 : Intelligence Ingrédients & Clean Beauty
-- ================================================

-- Cache des explications d'ingrédients (api/ingredient-explain.js)
CREATE TABLE IF NOT EXISTS ingredient_explanations (
    ingredient TEXT NOT NULL,
    lang VARCHAR(5) NOT NULL DEFAULT 'fr',
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (ingredient, lang)
);

-- Cache du diagnostic IA personnalisé (api/diagnostic-ai.js)
CREATE TABLE IF NOT EXISTS diagnostic_cache (
    cache_key TEXT NOT NULL,
    lang VARCHAR(5) NOT NULL DEFAULT 'fr',
    analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cache_key, lang)
);

-- Cache des recommandations produit IA (api/product-recommendation.js)
CREATE TABLE IF NOT EXISTS recommendation_cache (
    cache_key TEXT NOT NULL,
    lang VARCHAR(5) NOT NULL DEFAULT 'fr',
    recommendation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cache_key, lang)
);

-- Index pour nettoyage périodique (optionnel)
CREATE INDEX IF NOT EXISTS idx_ingredient_exp_created ON ingredient_explanations(created_at);
CREATE INDEX IF NOT EXISTS idx_diagnostic_cache_created ON diagnostic_cache(created_at);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_created ON recommendation_cache(created_at);

-- RLS : ces tables sont accessibles via service_role uniquement (API serverless)
-- Pas besoin de policies RLS car les API utilisent service_role_key
ALTER TABLE ingredient_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_cache ENABLE ROW LEVEL SECURITY;
