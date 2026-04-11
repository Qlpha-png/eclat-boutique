-- ============================
-- ÉCLAT — Préférences beauté & newsletter
-- Migration pour account personalization
-- ============================

-- ── Colonnes préférences beauté sur profiles ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skin_type VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS main_concern VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_range VARCHAR(10);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender_pref VARCHAR(10) DEFAULT 'all';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fav_categories TEXT[] DEFAULT '{}';

-- ── Préférences newsletter ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nl_new_products BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nl_promotions BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nl_tips BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nl_loyalty BOOLEAN DEFAULT true;

-- ── RLS : les users ne peuvent modifier QUE leurs propres préférences ──
-- (déjà couvert par la policy existante dans security.sql : profiles_update_own)
-- Vérification : la policy existante autorise UPDATE sur profiles WHERE auth.uid() = id

-- ── Index pour requêtes de recommandation ──
CREATE INDEX IF NOT EXISTS idx_profiles_skin_type ON profiles(skin_type) WHERE skin_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_concern ON profiles(main_concern) WHERE main_concern IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender_pref) WHERE gender_pref IS NOT NULL;

-- ── Contraintes de validation (CHECK) ──
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS chk_skin_type
    CHECK (skin_type IS NULL OR skin_type IN ('normal', 'dry', 'oily', 'combination', 'sensitive'));
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS chk_main_concern
    CHECK (main_concern IS NULL OR main_concern IN ('acne', 'aging', 'hydration', 'radiance', 'dark_spots'));
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS chk_gender_pref
    CHECK (gender_pref IS NULL OR gender_pref IN ('all', 'femme', 'homme'));
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS chk_age_range
    CHECK (age_range IS NULL OR age_range IN ('18-25', '26-35', '36-45', '46-55', '56+'));
