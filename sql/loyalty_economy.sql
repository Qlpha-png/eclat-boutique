-- ============================
-- ÉCLAT — Économie Éclats : tables fidélité avancée
-- À exécuter dans Supabase SQL Editor
-- Pré-requis : profiles, badges, user_badges existent déjà
-- ============================

-- ── Nouvelles colonnes sur profiles ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_chest_open DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referrals_this_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referrals_month VARCHAR(7) DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_messages_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_messages_date DATE;

-- ── Table transaction log Éclats ──
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('earn', 'spend')),
    source VARCHAR(30) NOT NULL,
    -- sources earn: purchase, checkin, chest, review, referral, challenge, birthday, bonus, badge
    -- sources spend: discount, shipping, ai_messages, promo_code, double_eclats
    reference_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_created ON loyalty_points(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_source ON loyalty_points(source);

-- ── Table Coffre du Jour historique ──
CREATE TABLE IF NOT EXISTS chest_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL,
    slots INTEGER NOT NULL,
    rewards JSONB NOT NULL, -- [{rarity, type, value, label}]
    total_eclats INTEGER DEFAULT 0,
    opened_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chest_history_user ON chest_history(user_id);

-- ── Table défis hebdomadaires ──
CREATE TABLE IF NOT EXISTS weekly_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_key VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '',
    condition_type VARCHAR(30) NOT NULL,
    condition_target INTEGER NOT NULL,
    reward_eclats INTEGER NOT NULL,
    active_from DATE NOT NULL,
    active_until DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_challenges_active ON weekly_challenges(active_from, active_until);

-- ── Progression défis par user ──
CREATE TABLE IF NOT EXISTS challenge_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON challenge_progress(user_id);

-- ── RLS sur les nouvelles tables ──
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE chest_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Users voient leurs propres données
CREATE POLICY "own_loyalty_points" ON loyalty_points FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "own_chest_history" ON chest_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "own_challenge_progress" ON challenge_progress FOR SELECT USING (user_id = auth.uid());
-- Défis lisibles par tous les authentifiés
CREATE POLICY "read_challenges" ON weekly_challenges FOR SELECT USING (auth.uid() IS NOT NULL);

-- ── Pool de défis initiaux ──
-- Note : les défis actifs sont générés dynamiquement par l'API, ceci est le pool de référence
-- La rotation se fait chaque lundi via api/loyalty/challenges.js
