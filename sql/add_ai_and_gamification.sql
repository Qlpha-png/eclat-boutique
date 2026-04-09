-- ============================
-- ÉCLAT — Colonnes IA + Gamification
-- À exécuter dans Supabase SQL Editor
-- ============================

-- ── Colonnes IA pour profiles ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_messages_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_month VARCHAR(7) DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0;

-- ── Gamification : badges ──
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '',
    category VARCHAR(30) NOT NULL CHECK (category IN ('achat', 'fidelite', 'social', 'beaute', 'special')),
    condition_type VARCHAR(30) NOT NULL, -- 'orders_count', 'total_spent', 'eclats', 'streak', 'referral', 'review', 'first_order', 'birthday'
    condition_value INTEGER DEFAULT 0,
    eclats_reward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges de base
INSERT INTO badges (key, name, description, icon, category, condition_type, condition_value, eclats_reward) VALUES
    -- Achats
    ('first_order', 'Première Commande', 'Votre tout premier achat ÉCLAT', '🛍️', 'achat', 'orders_count', 1, 25),
    ('regular_5', 'Habituée', '5 commandes passées', '💫', 'achat', 'orders_count', 5, 50),
    ('vip_10', 'VIP', '10 commandes passées', '👑', 'achat', 'orders_count', 10, 100),
    ('big_spender_100', 'Belle Dépense', '100€ dépensés au total', '💎', 'achat', 'total_spent', 100, 30),
    ('big_spender_500', 'Collectionneuse', '500€ dépensés au total', '🏆', 'achat', 'total_spent', 500, 75),
    -- Fidélité
    ('lumiere', 'Lumière', 'Palier Lumière atteint (200 Éclats)', '✨', 'fidelite', 'eclats', 200, 0),
    ('prestige', 'Prestige', 'Palier Prestige atteint (500 Éclats)', '🌟', 'fidelite', 'eclats', 500, 0),
    ('diamant', 'Diamant', 'Palier Diamant atteint (1000 Éclats)', '💎', 'fidelite', 'eclats', 1000, 0),
    ('streak_3', 'Routine Fidèle', '3 mois consécutifs avec un achat', '🔥', 'fidelite', 'streak', 3, 50),
    ('streak_6', 'Dévouée', '6 mois consécutifs avec un achat', '🔥', 'fidelite', 'streak', 6, 100),
    -- Social
    ('first_referral', 'Ambassadrice', 'Premier parrainage réussi', '🤝', 'social', 'referral', 1, 50),
    ('referral_5', 'Influenceuse ÉCLAT', '5 parrainages réussis', '📣', 'social', 'referral', 5, 100),
    ('first_review', 'Voix Entendue', 'Premier avis laissé', '⭐', 'social', 'review', 1, 15),
    ('reviewer_5', 'Critique Beauté', '5 avis laissés', '📝', 'social', 'review', 5, 40),
    -- Beauté
    ('full_routine', 'Routine Complète', 'Acheté un produit dans 3 catégories', '🧴', 'beaute', 'orders_count', 3, 30),
    ('coffret_lover', 'Fan de Coffrets', 'Acheté un coffret', '🎁', 'beaute', 'orders_count', 1, 20),
    -- Special
    ('birthday', 'Joyeux Anniversaire', 'Bonus anniversaire', '🎂', 'special', 'birthday', 0, 50),
    ('early_adopter', 'Pionnière', 'Parmi les 100 premières clientes', '🚀', 'special', 'orders_count', 1, 100)
ON CONFLICT (key) DO NOTHING;

-- Table des badges débloqués par utilisateur
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_key VARCHAR(50) NOT NULL REFERENCES badges(key) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    notified BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- ── Gamification : streaks d'achat ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purchase_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_purchase_month VARCHAR(7) DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday DATE;

-- ── Vue pour le classement (leaderboard) ──
CREATE OR REPLACE VIEW leaderboard AS
SELECT
    p.id,
    p.first_name,
    p.eclats,
    p.loyalty_tier,
    p.purchase_streak,
    (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = p.id) AS badge_count
FROM profiles p
WHERE p.role != 'admin'
ORDER BY p.eclats DESC
LIMIT 50;
