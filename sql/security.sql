-- ============================
-- ÉCLAT — Sécurité Batch 1
-- RLS sur profiles + table admin_audit_log
-- ============================

-- 1. RLS sur profiles (les users ne voient que leur propre profil)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

-- Note : les API admin utilisent service_role_key qui bypass RLS → pas impactées

-- 2. Table admin_audit_log
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par admin et par date
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON admin_audit_log(entity_type, entity_id);

-- RLS sur audit_log : seuls les admins via service_role_key y accèdent
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
-- Pas de policy = aucun accès côté client, seul service_role_key peut lire/écrire
