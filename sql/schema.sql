-- ============================
-- ÉCLAT — Schéma base de données complet
-- À exécuter dans Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================

-- =============================
-- EXTENSIONS
-- =============================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================
-- TABLES PRODUITS & CATALOGUE
-- =============================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('cj', 'bigbuy', 'manual', 'other')),
    api_url TEXT,
    api_key_env VARCHAR(50), -- nom de la variable d'env (pas la clé elle-même)
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    old_price DECIMAL(10,2),
    description TEXT,
    features TEXT[], -- array de features
    specs JSONB DEFAULT '{}', -- spécifications techniques
    ingredients TEXT,
    how_to TEXT,
    image_url TEXT,
    images TEXT[] DEFAULT '{}', -- images additionnelles
    badge VARCHAR(20) CHECK (badge IN ('new', 'best', 'promo', 'lancement', NULL)),
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    bestseller BOOLEAN DEFAULT FALSE,
    bestseller_rank INTEGER,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_suppliers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    supplier_sku VARCHAR(100),
    supplier_variant_id VARCHAR(100),
    cost_price DECIMAL(10,2),
    UNIQUE(product_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS bundles (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_products (
    bundle_id INTEGER NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (bundle_id, product_id)
);

-- =============================
-- TABLES INVENTAIRE
-- =============================

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    last_synced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    session_id VARCHAR(200), -- Stripe checkout session
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'confirmed', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================
-- TABLES UTILISATEURS
-- =============================

CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auth_id UUID UNIQUE, -- lien vers Supabase Auth
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(200),
    phone VARCHAR(30),
    tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES customers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Domicile',
    name VARCHAR(200) NOT NULL,
    line1 VARCHAR(300) NOT NULL,
    line2 VARCHAR(300),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'FR',
    phone VARCHAR(30),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (customer_id, product_id)
);

-- =============================
-- TABLES COMMANDES
-- =============================

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    stripe_session_id VARCHAR(200) UNIQUE,
    stripe_payment_intent VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    status VARCHAR(30) DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    promo_code VARCHAR(50),
    shipping_address JSONB,
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    carrier VARCHAR(50),
    fulfillment_status VARCHAR(30) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'auto_fulfilled', 'manual', 'failed')),
    fulfillment_id VARCHAR(200), -- ID commande fournisseur
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    image_url TEXT
);

-- =============================
-- TABLES RETOURS (RMA)
-- =============================

CREATE TABLE IF NOT EXISTS returns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('defective', 'wrong_item', 'not_satisfied', 'damaged', 'other')),
    description TEXT,
    status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'received', 'refunded', 'rejected')),
    refund_amount DECIMAL(10,2),
    stripe_refund_id VARCHAR(200),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================
-- TABLES AVIS CLIENTS
-- =============================

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    body TEXT,
    photos TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE, -- TRUE si lié à un achat réel
    approved BOOLEAN DEFAULT FALSE, -- modération admin
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================
-- TABLES MARKETING
-- =============================

CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10,2) NOT NULL, -- 10 = -10% ou -10€
    min_order DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER, -- NULL = illimité
    uses_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    lang VARCHAR(5) DEFAULT 'fr',
    source VARCHAR(50) DEFAULT 'website',
    subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_sequences (
    id SERIAL PRIMARY KEY,
    trigger_event VARCHAR(50) NOT NULL, -- 'signup', 'purchase', 'abandoned_cart', 'inactive_30d'
    delay_hours INTEGER NOT NULL DEFAULT 0, -- heures après le trigger
    subject VARCHAR(200) NOT NULL,
    template VARCHAR(50) NOT NULL, -- clé du template email
    active BOOLEAN DEFAULT TRUE
);

-- =============================
-- TABLES AFFILIATION
-- =============================

CREATE TABLE IF NOT EXISTS affiliates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    ref_code VARCHAR(30) UNIQUE NOT NULL,
    commission_rate DECIMAL(4,2) DEFAULT 10.00, -- pourcentage
    total_earned DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id SERIAL PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_total DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================
-- TABLES SYSTÈME
-- =============================

CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(200) PRIMARY KEY, -- stripe event ID
    type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'send_email', 'sync_stock', 'fulfill_order'
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================
-- INDEX POUR PERFORMANCE
-- =============================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth ON customers(auth_id);
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON job_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(type);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires ON stock_reservations(expires_at) WHERE status = 'active';

-- =============================
-- TRIGGERS AUTO-UPDATE
-- =============================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_products_updated BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_customers_updated BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_orders_updated BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_returns_updated BEFORE UPDATE ON returns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_inventory_updated BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================
-- FONCTION : Mettre à jour review_count et rating d'un produit
-- =============================

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products SET
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND approved = TRUE),
        rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND approved = TRUE), 0)
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_review_rating AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =============================
-- ROW LEVEL SECURITY (RLS)
-- =============================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Customers: un utilisateur ne voit que ses propres données
CREATE POLICY customers_own ON customers
    FOR ALL USING (auth_id = auth.uid());

-- Addresses: un utilisateur ne voit que ses propres adresses
CREATE POLICY addresses_own ON addresses
    FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Wishlists: un utilisateur ne voit que sa propre wishlist
CREATE POLICY wishlists_own ON wishlists
    FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Reviews: tout le monde peut lire les avis approuvés, seul l'auteur peut modifier
CREATE POLICY reviews_read ON reviews
    FOR SELECT USING (approved = TRUE);
CREATE POLICY reviews_own ON reviews
    FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Products: lecture publique
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_read ON products FOR SELECT USING (TRUE);

-- Orders: un utilisateur ne voit que ses propres commandes
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_own ON orders
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
