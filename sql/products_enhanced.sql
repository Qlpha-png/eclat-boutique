-- ================================================
-- Enrichissement table products pour catalogue 500+
-- Phase 10 : Catalogue dynamique & multi-fournisseurs
-- ================================================

-- Nouvelles colonnes (ALTER TABLE si elles n'existent pas)
DO $$ BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);
    ALTER TABLE products ADD COLUMN IF NOT EXISTS concerns TEXT[] DEFAULT '{}';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'unisex';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS clean_beauty_score INTEGER;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT FALSE;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS bestseller_rank INTEGER;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS seasonal VARCHAR(20) DEFAULT 'all';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS tagline VARCHAR(300);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Index pour filtrage rapide
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(trending) WHERE is_active = true AND trending = true;
CREATE INDEX IF NOT EXISTS idx_products_score ON products(clean_beauty_score DESC NULLS LAST) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(bestseller_rank ASC NULLS LAST) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_concerns ON products USING GIN(concerns) WHERE is_active = true;

-- Index full-text search
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_desc_trgm ON products USING GIN(description gin_trgm_ops);
