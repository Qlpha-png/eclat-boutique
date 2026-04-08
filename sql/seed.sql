-- ============================
-- ÉCLAT — Données initiales (seed)
-- Importe les 15 produits, 3 coffrets, catégories et fournisseurs
-- ============================

-- =============================
-- CATÉGORIES
-- =============================
INSERT INTO categories (name, slug, description, position) VALUES
    ('Soins visage', 'visage', 'Appareils et outils pour le visage', 1),
    ('Skincare', 'soin', 'Sérums, masques et traitements', 2),
    ('Bien-être', 'aromatherapie', 'Aromathérapie et relaxation', 3),
    ('Outils beauté', 'outils', 'Accessoires et outils', 4)
ON CONFLICT (slug) DO NOTHING;

-- =============================
-- FOURNISSEURS
-- =============================
INSERT INTO suppliers (name, type, api_url, api_key_env) VALUES
    ('CJ Dropshipping', 'cj', 'https://developers.cjdropshipping.com/api2.0/v1', 'CJ_API_KEY'),
    ('BigBuy', 'bigbuy', 'https://api.bigbuy.eu', 'BIGBUY_API_KEY')
ON CONFLICT DO NOTHING;

-- =============================
-- PRODUITS
-- =============================
INSERT INTO products (id, name, slug, category_id, price, description, features, specs, ingredients, how_to, image_url, badge, rating, review_count, bestseller, bestseller_rank) VALUES

-- SOINS VISAGE
(1, 'Masque LED Pro 7 Couleurs', 'masque-led-pro-7-couleurs',
    (SELECT id FROM categories WHERE slug='visage'), 39.90,
    'Le soin en institut, chez vous. 7 longueurs d''onde ciblées : rouge anti-âge, bleue anti-acné, verte anti-taches. Résultats visibles dès 14 jours d''utilisation régulière.',
    ARRAY['7 longueurs d''onde thérapeutiques', 'Timer automatique 15 min', 'Rechargeable USB', 'Silicone hypoallergénique', 'Certifié CE', 'Résultats en 14 jours'],
    '{"puissance":"10-30 mW/cm²","longueurs":"415nm, 520nm, 590nm, 630nm, 660nm, 850nm, 940nm","batterie":"Li-ion 1200mAh, 5 séances/charge","poids":"180g","materiau":"Silicone médical + LED SMD"}'::jsonb,
    'Silicone médical hypoallergénique, LED SMD haute efficacité, circuit imprimé sans BPA',
    '1. Nettoyez le visage et appliquez votre sérum. 2. Posez le masque et choisissez la couleur (rouge: anti-âge, bleu: anti-acné, vert: teint). 3. Séance de 15 min, 3-4x/semaine. 4. Résultats visibles dès 14 jours.',
    'https://oss-cf.cjdropshipping.com/product/2025/12/02/07/52018798-4e16-43fe-8e02-f280acf86442_trans.jpeg',
    'best', 4.9, 0, TRUE, 1),

(2, 'Gua Sha Quartz Rose Cristal', 'gua-sha-quartz-rose-cristal',
    (SELECT id FROM categories WHERE slug='visage'), 9.90,
    'Le geste beauté ancestral en quartz rose véritable. Forme cœur ergonomique qui épouse les contours du visage. Stimule la circulation, dégonfle, sculpte l''ovale naturellement.',
    ARRAY['Quartz rose véritable', 'Forme cœur ergonomique', 'Stimule la circulation', 'Dégonfle le visage', 'Sculpte l''ovale', 'Chaque pierre est unique'],
    '{"materiau":"Quartz rose naturel, grade A","dimensions":"10 x 6 cm","poids":"65g","entretien":"Rincer à l''eau tiède après usage"}'::jsonb,
    'Quartz rose 100% naturel (SiO₂ + traces Ti, Mn)',
    '1. Appliquez huile ou sérum sur le visage. 2. Mouvements du centre vers l''extérieur, toujours vers le haut. 3. Cou → menton → joues → front. 4. 5 min/jour suffisent.',
    'https://cf.cjdropshipping.com/quick/product/d127bcab-55c6-49be-aa47-0b10f0711d0e.jpg',
    'best', 4.8, 0, TRUE, 2),

(5, 'Ice Roller Cryo Visage', 'ice-roller-cryo-visage',
    (SELECT id FROM categories WHERE slug='visage'), 7.90,
    'Le geste viral du matin. Moule à glace + roller : remplissez, congelez, massez. Dégonfle les poches, resserre les pores, apaise les rougeurs en 2 min.',
    ARRAY['Moule à glace intégré', 'Tête rotative 360°', 'Dégonfle en 2 min', 'Resserre les pores', 'Soulage les rougeurs', 'Réutilisable à l''infini'],
    '{"materiau":"ABS + gel cryo","temperature":"-5°C à -10°C congelé","rotation":"360° multi-axe","poids":"95g"}'::jsonb,
    'Gel cryogénique non toxique, ABS alimentaire, acier inoxydable',
    '1. Remplissez le moule d''eau. 2. Congelez 4-6h. 3. Massez le visage en mouvements ascendants, 2 min. 4. Idéal le matin au réveil.',
    'https://cf.cjdropshipping.com/quick/product/1f301f02-d17b-4315-a4b0-33a9c64f2bbd.jpg',
    'best', 4.8, 0, TRUE, 3),

(8, 'Sérum Éclat Vitamine C 20%', 'serum-eclat-vitamine-c-20',
    (SELECT id FROM categories WHERE slug='soin'), 14.90,
    'L''actif n°1 en skincare mondial. Vitamine C stabilisée 20% pour un teint éclatant. Anti-rides, anti-taches, booste le collagène. Résultats visibles en 21 jours.',
    ARRAY['Vitamine C stabilisée 20%', 'Anti-rides + anti-taches', 'Booste le collagène', 'Flacon 30ml', 'Tous types de peau', 'Résultats en 21 jours'],
    '{"concentration":"Vitamine C 20% (acide éthyl ascorbique)","ph":"5.0-6.0 (compatible peau)","contenance":"30 ml","conservation":"12 mois après ouverture"}'::jsonb,
    'Aqua, Ethyl Ascorbic Acid (20%), Hyaluronic Acid, Glycerin, Niacinamide, Tocopherol (Vit E), Ferulic Acid, Aloe Barbadensis Leaf Extract',
    '1. Sur peau propre et légèrement humide. 2. 4-5 gouttes, tapotez sur visage et cou. 3. Attendez 1-2 min. 4. Appliquez hydratant puis SPF le matin.',
    'https://cf.cjdropshipping.com/quick/product/a1ae3177-fe09-43ca-8969-57c5a5475d07.jpg',
    'best', 4.9, 0, TRUE, 4)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    specs = EXCLUDED.specs,
    ingredients = EXCLUDED.ingredients,
    how_to = EXCLUDED.how_to,
    image_url = EXCLUDED.image_url;

-- Remaining products (3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 15)
-- will be inserted by the migration API script from products.js

-- =============================
-- PRODUCT → SUPPLIER MAPPING
-- =============================
INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, supplier_variant_id, cost_price) VALUES
    (1, 1, '2512020745411613700', '2512020745411614100', 9.12),
    (2, 1, '2602120829411639000', '2602120829411639400', 2.19),
    (3, 1, '1900541186889875458', '1900541187347054594', 13.90),
    (4, 1, '1990665069449302017', '1990665069533188098', 8.50),
    (5, 1, '2508010604181617000', '2508010604181617800', 1.85),
    (6, 1, '2601270627311614800', '2601270627311615200', 6.20),
    (7, 1, '2039619420008083458', '2039619420209410049', 10.50),
    (8, 1, '2603300928441600800', '2603300928441601200', 3.40),
    (9, 1, '2603301345481600700', '2603301345481601100', 2.80),
    (10, 1, '2604060437251602800', '2604060437251603100', 4.20),
    (11, 1, '2503141112311610800', '2503141112311611000', 3.10),
    (12, 1, '2603080834381636900', '2603080834381637200', 2.50),
    (13, 1, '2507200553561614700', '2507200553561616300', 2.30),
    (14, 1, '2602270733571636700', '2602270733571637400', 12.80),
    (15, 1, '1481815597737185280', '1481815597804294144', 2.10)
ON CONFLICT DO NOTHING;

-- =============================
-- COFFRETS
-- =============================
INSERT INTO bundles (key, name, price) VALUES
    ('eclat', 'Coffret Routine Éclat', 24.90),
    ('antiage', 'Coffret Routine Anti-Âge', 49.90),
    ('glow', 'Coffret Routine Glow', 29.90)
ON CONFLICT (key) DO NOTHING;

INSERT INTO bundle_products (bundle_id, product_id) VALUES
    ((SELECT id FROM bundles WHERE key='eclat'), 5),
    ((SELECT id FROM bundles WHERE key='eclat'), 8),
    ((SELECT id FROM bundles WHERE key='eclat'), 2),
    ((SELECT id FROM bundles WHERE key='antiage'), 1),
    ((SELECT id FROM bundles WHERE key='antiage'), 8),
    ((SELECT id FROM bundles WHERE key='antiage'), 10),
    ((SELECT id FROM bundles WHERE key='glow'), 8),
    ((SELECT id FROM bundles WHERE key='glow'), 11),
    ((SELECT id FROM bundles WHERE key='glow'), 9)
ON CONFLICT DO NOTHING;

-- =============================
-- INVENTAIRE INITIAL (stock illimité pour le dropshipping)
-- =============================
INSERT INTO inventory (product_id, stock_quantity, low_stock_threshold)
SELECT id, 999, 5 FROM products
ON CONFLICT (product_id) DO NOTHING;

-- =============================
-- CODES PROMO
-- =============================
INSERT INTO promo_codes (code, type, value, min_order, active) VALUES
    ('BIENVENUE10', 'percentage', 10, 0, TRUE),
    ('RESTEZ15', 'percentage', 15, 0, TRUE),
    ('REVIENS10', 'percentage', 10, 0, TRUE)
ON CONFLICT (code) DO NOTHING;

-- =============================
-- SÉQUENCES EMAIL AUTOMATIQUES
-- =============================
INSERT INTO email_sequences (trigger_event, delay_hours, subject, template) VALUES
    ('signup', 0, 'Bienvenue chez ÉCLAT — Votre code -10%', 'welcome'),
    ('signup', 72, 'Guide : 5 étapes pour une peau éclatante', 'education_routine'),
    ('signup', 168, 'Votre offre expire bientôt', 'offer_reminder'),
    ('purchase', 24, 'Merci pour votre commande !', 'post_purchase'),
    ('purchase', 336, 'Comment trouvez-vous vos produits ?', 'review_request'),
    ('purchase', 720, 'Complétez votre routine — nouveautés', 'cross_sell_30d'),
    ('abandoned_cart', 1, 'Vous avez oublié quelque chose...', 'abandoned_1h'),
    ('abandoned_cart', 24, 'Votre panier vous attend', 'abandoned_24h'),
    ('abandoned_cart', 72, 'Dernière chance — -10% sur votre panier', 'abandoned_72h'),
    ('inactive_30d', 0, 'Ça fait longtemps ! -15% pour vous', 'reactivation_30d'),
    ('inactive_60d', 0, 'Vous nous manquez — offre exclusive', 'reactivation_60d')
ON CONFLICT DO NOTHING;
