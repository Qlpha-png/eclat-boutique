-- ================================================
-- Tables pour email automation & alertes stock
-- Phase 8 : Email Automation & Rétention
-- ================================================

-- Log des emails envoyés (anti-doublon)
CREATE TABLE IF NOT EXISTS email_log (
    id SERIAL PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    template VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_customer ON email_log(customer_id, template);

-- Alertes retour en stock
CREATE TABLE IF NOT EXISTS stock_alerts (
    email VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (email, product_id)
);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON stock_alerts(product_id, notified);

-- RLS
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
