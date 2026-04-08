/**
 * ÉCLAT Boutique — Migration de base de données
 * Endpoint protégé admin : POST /api/migrate
 * Crée toutes les tables nécessaires dans Neon (PostgreSQL)
 */

const { getDB } = require('./db');

const MIGRATIONS = [
    // 1. Users (synced from Clerk)
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        name TEXT,
        phone TEXT,
        avatar_url TEXT,
        beauty_prefs JSONB DEFAULT '{}'::jsonb,
        lang TEXT DEFAULT 'fr',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 2. Addresses
    `CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        label TEXT DEFAULT 'Domicile',
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        line1 TEXT NOT NULL,
        line2 TEXT,
        city TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        country TEXT DEFAULT 'FR',
        phone TEXT,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 3. Orders
    `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        stripe_session_id TEXT UNIQUE,
        order_ref TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'confirmed',
        subtotal INTEGER NOT NULL,
        shipping_cost INTEGER DEFAULT 0,
        discount INTEGER DEFAULT 0,
        total INTEGER NOT NULL,
        currency TEXT DEFAULT 'eur',
        shipping_address JSONB DEFAULT '{}'::jsonb,
        tracking_number TEXT,
        carrier TEXT,
        lang TEXT DEFAULT 'fr',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 4. Order items
    `CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_name TEXT NOT NULL,
        product_id TEXT,
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        total INTEGER NOT NULL
    )`,

    // 5. Loyalty accounts
    `CREATE TABLE IF NOT EXISTS loyalty_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        points_balance INTEGER DEFAULT 0,
        total_points_earned INTEGER DEFAULT 0,
        total_spent INTEGER DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        tier TEXT DEFAULT 'bronze',
        referral_code TEXT UNIQUE,
        streak_days INTEGER DEFAULT 0,
        last_login_date TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 6. Loyalty transactions
    `CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id SERIAL PRIMARY KEY,
        loyalty_account_id INTEGER NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        points INTEGER NOT NULL,
        description TEXT,
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 7. Rewards catalog
    `CREATE TABLE IF NOT EXISTS rewards (
        id SERIAL PRIMARY KEY,
        name_fr TEXT NOT NULL,
        name_en TEXT,
        name_es TEXT,
        name_de TEXT,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        points_cost INTEGER NOT NULL,
        tier_required TEXT DEFAULT 'bronze',
        is_active BOOLEAN DEFAULT TRUE,
        stock INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 8. Achievements / badges
    `CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        name_fr TEXT NOT NULL,
        name_en TEXT,
        name_es TEXT,
        name_de TEXT,
        description_fr TEXT,
        description_en TEXT,
        description_es TEXT,
        description_de TEXT,
        icon TEXT DEFAULT '🏆',
        points_reward INTEGER DEFAULT 0,
        condition_type TEXT NOT NULL,
        condition_value INTEGER NOT NULL
    )`,

    // 9. User achievements
    `CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
        unlocked_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, achievement_id)
    )`,

    // 10. Referrals
    `CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        points_awarded INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 11. Gamification plays
    `CREATE TABLE IF NOT EXISTS gamification_plays (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game_type TEXT NOT NULL,
        result JSONB DEFAULT '{}'::jsonb,
        points_won INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 12. Admin settings
    `CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Indexes for performance
    `CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(order_ref)`,
    `CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_accounts(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_loyalty_referral ON loyalty_accounts(referral_code)`,
    `CREATE INDEX IF NOT EXISTS idx_loyalty_tx_account ON loyalty_transactions(loyalty_account_id)`,
    `CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification_plays(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id)`,

    // Seed default achievements
    `INSERT INTO achievements (key, name_fr, name_en, name_es, name_de, description_fr, description_en, description_es, description_de, icon, points_reward, condition_type, condition_value) VALUES
        ('first_order', 'Première commande', 'First Order', 'Primer pedido', 'Erste Bestellung', 'Passez votre première commande', 'Place your first order', 'Realiza tu primer pedido', 'Geben Sie Ihre erste Bestellung auf', '🎉', 10, 'orders_count', 1),
        ('orders_3', 'Client fidèle', 'Loyal Customer', 'Cliente fiel', 'Treuer Kunde', '3 commandes passées', '3 orders placed', '3 pedidos realizados', '3 Bestellungen aufgegeben', '🛍️', 25, 'orders_count', 3),
        ('orders_10', 'Super client', 'Super Customer', 'Súper cliente', 'Superkunde', '10 commandes passées', '10 orders placed', '10 pedidos realizados', '10 Bestellungen aufgegeben', '👑', 50, 'orders_count', 10),
        ('spent_100', 'Centenaire', 'Centurion', 'Centenario', 'Zenturio', '100€ dépensés au total', '€100 spent total', '100€ gastados en total', '100€ insgesamt ausgegeben', '💰', 20, 'total_spent', 10000),
        ('spent_500', 'Investisseur beauté', 'Beauty Investor', 'Inversor de belleza', 'Beauty-Investor', '500€ dépensés au total', '€500 spent total', '500€ gastados en total', '500€ insgesamt ausgegeben', '💎', 50, 'total_spent', 50000),
        ('streak_7', 'Semaine parfaite', 'Perfect Week', 'Semana perfecta', 'Perfekte Woche', '7 jours de connexion consécutifs', '7 consecutive login days', '7 días consecutivos de conexión', '7 aufeinanderfolgende Login-Tage', '🔥', 10, 'streak_days', 7),
        ('streak_30', 'Mois parfait', 'Perfect Month', 'Mes perfecto', 'Perfekter Monat', '30 jours de connexion consécutifs', '30 consecutive login days', '30 días consecutivos de conexión', '30 aufeinanderfolgende Login-Tage', '⚡', 50, 'streak_days', 30),
        ('first_referral', 'Ambassadeur', 'Ambassador', 'Embajador', 'Botschafter', 'Parrainez votre premier ami', 'Refer your first friend', 'Recomiende a su primer amigo', 'Empfehlen Sie Ihren ersten Freund', '🤝', 20, 'referrals_count', 1),
        ('referrals_5', 'Influenceur', 'Influencer', 'Influencer', 'Influencer', '5 parrainages réussis', '5 successful referrals', '5 recomendaciones exitosas', '5 erfolgreiche Empfehlungen', '⭐', 100, 'referrals_count', 5),
        ('tier_silver', 'Palier Argent', 'Silver Tier', 'Nivel Plata', 'Silber-Stufe', 'Atteindre le palier Argent', 'Reach Silver tier', 'Alcanzar el nivel Plata', 'Silber-Stufe erreichen', '🥈', 0, 'tier', 2),
        ('tier_gold', 'Palier Or', 'Gold Tier', 'Nivel Oro', 'Gold-Stufe', 'Atteindre le palier Or', 'Reach Gold tier', 'Alcanzar el nivel Oro', 'Gold-Stufe erreichen', '🥇', 0, 'tier', 3),
        ('tier_platinum', 'Palier Platine', 'Platinum Tier', 'Nivel Platino', 'Platin-Stufe', 'Atteindre le palier Platine', 'Reach Platinum tier', 'Alcanzar el nivel Platino', 'Platin-Stufe erreichen', '💠', 0, 'tier', 4)
    ON CONFLICT (key) DO NOTHING`,

    // Seed default rewards
    `INSERT INTO rewards (name_fr, name_en, name_es, name_de, type, value, points_cost, tier_required) VALUES
        ('Remise 5€', '€5 Discount', 'Descuento 5€', '5€ Rabatt', 'discount', '500', 50, 'bronze'),
        ('Remise 10€', '€10 Discount', 'Descuento 10€', '10€ Rabatt', 'discount', '1000', 100, 'silver'),
        ('Livraison gratuite', 'Free Shipping', 'Envío gratis', 'Kostenloser Versand', 'free_shipping', '0', 75, 'bronze'),
        ('Remise 15€', '€15 Discount', 'Descuento 15€', '15€ Rabatt', 'discount', '1500', 150, 'gold'),
        ('Remise 20€', '€20 Discount', 'Descuento 20€', '20€ Rabatt', 'discount', '2000', 200, 'platinum')
    ON CONFLICT DO NOTHING`
];

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = getDB();
        const results = [];

        for (const sql of MIGRATIONS) {
            try {
                await db.execute(sql);
                results.push({ sql: sql.substring(0, 60) + '...', status: 'ok' });
            } catch (err) {
                results.push({ sql: sql.substring(0, 60) + '...', status: 'error', error: err.message });
            }
        }

        const errors = results.filter(r => r.status === 'error');

        return res.status(errors.length > 0 ? 207 : 200).json({
            message: `Migration completed: ${results.length - errors.length}/${results.length} successful`,
            results
        });
    } catch (err) {
        return res.status(500).json({ error: 'Migration failed: ' + err.message });
    }
};
