-- ============================
-- ÉCLAT — Seed des 15 produits + 3 coffrets
-- À exécuter dans Supabase SQL Editor
-- ============================

-- Vider la table si déjà remplie (reset propre)
TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, slug, price, old_price, description, features, specs, ingredients, how_to, image_url, badge, rating, review_count, bestseller, bestseller_rank, active) VALUES

-- 1. Masque LED Pro 7 Couleurs
('Masque LED Pro 7 Couleurs', 'masque-led-pro-7-couleurs', 39.90, NULL,
 'Le soin en institut, chez vous. 7 longueurs d''onde ciblées : rouge anti-âge, bleue anti-acné, verte anti-taches. Résultats visibles dès 14 jours d''utilisation régulière.',
 ARRAY['7 longueurs d''onde thérapeutiques', 'Timer automatique 15 min', 'Rechargeable USB', 'Silicone hypoallergénique', 'Certifié CE', 'Résultats en 14 jours'],
 '{"puissance":"10-30 mW/cm²","longueurs":"415nm, 520nm, 590nm, 630nm, 660nm, 850nm, 940nm","batterie":"Li-ion 1200mAh, 5 séances/charge","poids":"180g","materiau":"Silicone médical + LED SMD"}',
 'Silicone médical hypoallergénique, LED SMD haute efficacité, circuit imprimé sans BPA',
 '1. Nettoyez le visage et appliquez votre sérum. 2. Posez le masque et choisissez la couleur. 3. Séance de 15 min, 3-4x/semaine. 4. Résultats visibles dès 14 jours.',
 'https://oss-cf.cjdropshipping.com/product/2025/12/02/07/52018798-4e16-43fe-8e02-f280acf86442_trans.jpeg',
 'best', 4.9, 0, TRUE, 1, TRUE),

-- 2. Gua Sha Quartz Rose
('Gua Sha Quartz Rose Cristal', 'gua-sha-quartz-rose-cristal', 9.90, NULL,
 'Le geste beauté ancestral en quartz rose véritable. Forme cœur ergonomique qui épouse les contours du visage. Stimule la circulation, dégonfle, sculpte l''ovale naturellement.',
 ARRAY['Quartz rose véritable', 'Forme cœur ergonomique', 'Stimule la circulation', 'Dégonfle le visage', 'Sculpte l''ovale', 'Chaque pierre est unique'],
 '{"materiau":"Quartz rose naturel, grade A","dimensions":"10 x 6 cm","poids":"65g","entretien":"Rincer à l''eau tiède après usage"}',
 'Quartz rose 100% naturel (SiO₂ + traces Ti, Mn)',
 '1. Appliquez huile ou sérum sur le visage. 2. Mouvements du centre vers l''extérieur, toujours vers le haut. 3. Cou → menton → joues → front. 4. 5 min/jour suffisent.',
 'https://cf.cjdropshipping.com/quick/product/d127bcab-55c6-49be-aa47-0b10f0711d0e.jpg',
 'best', 4.8, 0, TRUE, 2, TRUE),

-- 3. Scrubber Ultrasonique
('Scrubber Ultrasonique Visage', 'scrubber-ultrasonique-visage', 27.90, NULL,
 'Nettoyage professionnel en 3 minutes. 28 000 vibrations/sec. Désincruste les pores, exfolie en douceur, fait pénétrer vos sérums 5x mieux. Rechargeable USB.',
 ARRAY['28 000 vibrations/sec', '3 modes : nettoyage, lifting, absorption', 'Acier inoxydable médical', 'Rechargeable USB', 'Étanche IPX5', 'Résultats immédiats'],
 '{"frequence":"28 000 Hz","modes":"Nettoyage / Lifting / Absorption","batterie":"Li-ion, 2h d''autonomie","etancheite":"IPX5","materiau":"Acier inoxydable 304 médical"}',
 'Acier inoxydable 304 (qualité médicale), ABS sans BPA',
 '1. Humidifiez le visage. 2. Mode nettoyage : passez sur la zone T 2-3 min. 3. Mode absorption : appliquez sérum puis passez la spatule. 4. Nettoyez après usage.',
 'https://cf.cjdropshipping.com/72d34072-6284-455f-b849-2e220e4508a5.png',
 'lancement', 4.7, 0, FALSE, NULL, TRUE),

-- 4. Brosse Nettoyante Sonic
('Brosse Nettoyante Sonic', 'brosse-nettoyante-sonic', 22.90, NULL,
 'L''alternative accessible aux brosses à 200€+. 5 têtes interchangeables pour un nettoyage complet. Waterproof, douce pour les peaux sensibles.',
 ARRAY['5 têtes interchangeables', 'Waterproof', 'Nettoyage en profondeur', 'Douce pour peaux sensibles', 'Rechargeable', 'Longue autonomie'],
 '{"tetes":"5 (nettoyage, exfoliation, massage, éponge, silicone)","vitesse":"2 vitesses réglables","batterie":"Li-ion, 60 jours d''autonomie","etancheite":"IPX7"}',
 'Silicone alimentaire, nylon Dupont, ABS sans BPA',
 '1. Humidifiez la tête et le visage. 2. Appliquez nettoyant. 3. Mouvements circulaires doux, 30 sec/zone. 4. Rincez la tête après usage.',
 'https://cf.cjdropshipping.com/17633376/13ee1260-c238-42cd-a876-6d29b5ec41e7.jpg',
 'lancement', 4.6, 0, FALSE, NULL, TRUE),

-- 5. Ice Roller Cryo
('Ice Roller Cryo Visage', 'ice-roller-cryo-visage', 7.90, NULL,
 'Le geste viral du matin. Moule à glace + roller : remplissez, congelez, massez. Dégonfle les poches, resserre les pores, apaise les rougeurs en 2 min.',
 ARRAY['Moule à glace intégré', 'Tête rotative 360°', 'Dégonfle en 2 min', 'Resserre les pores', 'Soulage les rougeurs', 'Réutilisable à l''infini'],
 '{"materiau":"ABS + gel cryo","temperature":"-5°C à -10°C congelé","rotation":"360° multi-axe","poids":"95g"}',
 'Gel cryogénique non toxique, ABS alimentaire, acier inoxydable',
 '1. Remplissez le moule d''eau. 2. Congelez 4-6h. 3. Massez le visage en mouvements ascendants, 2 min. 4. Idéal le matin au réveil.',
 'https://cf.cjdropshipping.com/quick/product/1f301f02-d17b-4315-a4b0-33a9c64f2bbd.jpg',
 'best', 4.8, 0, TRUE, 3, TRUE),

-- 6. V-Line Roller EMS
('V-Line Roller Sculptant EMS', 'v-line-roller-sculptant-ems', 18.90, NULL,
 'Le secret K-beauty pour un visage sculpté. Roller électrique V-Shape avec micro-courant EMS. Reproduit le drainage lymphatique professionnel. Tonifie et affine.',
 ARRAY['EMS micro-courant', 'Design V-Shape', 'Drainage lymphatique', 'Tonifie et affine', 'Rechargeable', 'Résultats en 2-4 sem'],
 '{"technologie":"EMS micro-courant 350µA","modes":"5 niveaux d''intensité","batterie":"Li-ion USB, 30 jours","poids":"48g"}',
 'ABS médical, électrodes acier inoxydable 316L',
 '1. Appliquez gel conducteur ou sérum. 2. Placez le roller sur la mâchoire. 3. Remontez vers les oreilles, 5 min/côté. 4. Nettoyez après usage.',
 'https://oss-cf.cjdropshipping.com/product/2026/01/27/06/d5042d2a-775f-4b09-9e0a-f6c65549314c_trans.jpeg',
 'new', 4.7, 0, FALSE, NULL, TRUE),

-- 7. Facial Steamer Nano-Ion
('Facial Steamer Nano-Ion', 'facial-steamer-nano-ion', 24.90, NULL,
 'Le spa à domicile. Vapeur nano-ionique qui ouvre les pores en douceur. Hydrate en profondeur, prépare la peau aux soins. Portable et rechargeable.',
 ARRAY['Vapeur nano-ionique', 'Hydratation profonde', 'Ouvre les pores', 'Portable rechargeable', 'Prépare aux soins', 'Design compact'],
 '{"technologie":"Nano-ionisation ultrasonique","particules":"0,3 µm (pénétration profonde)","reservoir":"30 ml","autonomie":"15 min de vapeur continue"}',
 'ABS haute température, céramique piézoélectrique, réservoir PP alimentaire',
 '1. Remplissez le réservoir d''eau distillée. 2. Visage à 20 cm, 5-10 min. 3. La vapeur ouvre les pores et prépare la peau. 4. Appliquez sérum immédiatement après.',
 'https://cf.cjdropshipping.com/8a1f321f-85ce-4c02-8147-658196e8dbfb.jpg',
 'new', 4.7, 0, FALSE, NULL, TRUE),

-- 8. Sérum Vitamine C 20%
('Sérum Éclat Vitamine C 20%', 'serum-eclat-vitamine-c-20', 14.90, NULL,
 'L''actif n°1 en skincare mondial. Vitamine C stabilisée 20% pour un teint éclatant. Anti-rides, anti-taches, booste le collagène. Résultats visibles en 21 jours.',
 ARRAY['Vitamine C stabilisée 20%', 'Anti-rides + anti-taches', 'Booste le collagène', 'Flacon 30ml', 'Tous types de peau', 'Résultats en 21 jours'],
 '{"concentration":"Vitamine C 20% (acide éthyl ascorbique)","ph":"5.0-6.0 (compatible peau)","contenance":"30 ml","conservation":"12 mois après ouverture"}',
 'Aqua, Ethyl Ascorbic Acid (20%), Hyaluronic Acid, Glycerin, Niacinamide, Tocopherol (Vit E), Ferulic Acid, Aloe Barbadensis Leaf Extract',
 '1. Sur peau propre et légèrement humide. 2. 4-5 gouttes, tapotez sur visage et cou. 3. Attendez 1-2 min. 4. Appliquez hydratant puis SPF le matin.',
 'https://cf.cjdropshipping.com/quick/product/a1ae3177-fe09-43ca-8969-57c5a5475d07.jpg',
 'best', 4.9, 0, TRUE, 4, TRUE),

-- 9. Patchs Yeux Collagène
('Patchs Yeux Collagène Hydratants', 'patchs-yeux-collagene-hydratants', 9.90, NULL,
 '60 patchs collagène pour 1 mois de soins. Dégonfle les poches, estompe les cernes, hydrate le contour des yeux. Résultat visible dès la 1ère pose.',
 ARRAY['Collagène marin concentré', 'Acide hyaluronique', '60 patchs (1 mois)', 'Effet frais immédiat', 'Résultat 1ère pose', 'Peaux sensibles OK'],
 '{"contenu":"60 patchs (30 paires)","duree_pose":"20-30 min","conservation":"Pot hermétique, 6 mois après ouverture"}',
 'Aqua, Hydrolyzed Collagen, Sodium Hyaluronate, Gold (CI 77480), Glycerin, Retinyl Palmitate, Aloe Barbadensis',
 '1. Nettoyez le contour des yeux. 2. Appliquez un patch sous chaque œil. 3. Laissez poser 20-30 min. 4. Retirez et tapotez le sérum restant.',
 'https://oss-cf.cjdropshipping.com/product/2026/03/31/02/9c7f9271-bd54-4456-82b2-d811972cdff3.jpg',
 'lancement', 4.7, 0, FALSE, NULL, TRUE),

-- 10. Masque Collagène Lifting
('Masque Collagène Lifting', 'masque-collagene-lifting', 12.90, NULL,
 'Le masque lifting qui a explosé TikTok. Collagène compact qui adhère parfaitement au visage. Effet tenseur immédiat, repulpe et lisse. 4 masques par boîte.',
 ARRAY['Collagène compact lifting', 'Effet tenseur immédiat', 'Repulpe et lisse', '4 masques/boîte', 'Adhère parfaitement', 'Usage hebdomadaire'],
 '{"contenu":"4 masques compacts","duree_pose":"15-20 min","type":"Hydrogel collagène compressé"}',
 'Hydrolyzed Collagen, Hyaluronic Acid, Niacinamide, Centella Asiatica Extract, Adenosine, Allantoin',
 '1. Nettoyez et tonifiez le visage. 2. Dépliez le masque et appliquez. 3. Laissez 15-20 min. 4. Retirez et massez le sérum restant. 1x/semaine.',
 'https://oss-cf.cjdropshipping.com/product/2026/04/06/04/f5e5d992-c91f-4b7e-aa49-364a85beabdf.jpg',
 'new', 4.9, 0, FALSE, NULL, TRUE),

-- 11. Huile Rose Musquée
('Huile Précieuse Rose Musquée', 'huile-precieuse-rose-musquee', 14.90, NULL,
 'Huile de rose musquée pure qui hydrate et régénère en profondeur. Riche en oméga naturels, elle atténue cicatrices et ridules. Le soin nocturne idéal.',
 ARRAY['Rose musquée pure', 'Hydrate en profondeur', 'Régénère la peau', 'Atténue cicatrices', 'Anti-rides naturel', 'Flacon 10ml concentré'],
 '{"purete":"100% huile de Rosa Canina","extraction":"Pression à froid","contenance":"10 ml","conservation":"6 mois après ouverture"}',
 'Rosa Canina Seed Oil (100%), Tocopherol (Vitamine E naturelle)',
 '1. Le soir, sur peau propre. 2. 3-4 gouttes dans la paume. 3. Chauffez entre les mains. 4. Pressez sur visage et cou. Idéal avant le sommeil.',
 'https://oss-cf.cjdropshipping.com/product/2025/03/14/11/6acfe7c3-723b-429c-8f1a-c5b37cbdf691.jpg',
 'lancement', 4.8, 0, FALSE, NULL, TRUE),

-- 12. Stickers Anti-Rides
('Stickers Anti-Rides Micro-Crystal', 'stickers-anti-rides-micro-crystal', 8.90, NULL,
 'Patchs micro-cristaux qui lissent les rides pendant le sommeil. Technologie hydrogel condensé qui délivre les actifs en profondeur. Résultat au réveil.',
 ARRAY['Micro-cristaux actifs', 'Technologie hydrogel', 'Résultat au réveil', 'Zones visage ciblées', 'Réutilisable', 'Sans chimie agressive'],
 '{"technologie":"Micro-cristaux d''acide hyaluronique","zones":"Front, contour yeux, sillon nasogénien","reutilisable":"Jusqu''à 3 utilisations/patch"}',
 'Hydrolyzed Hyaluronic Acid (micro-needles), Acetyl Hexapeptide-8 (Argireline), Retinol, Adenosine',
 '1. Nettoyez et séchez la zone. 2. Appliquez le patch sur la ride. 3. Pressez 30 sec. 4. Gardez toute la nuit. Résultat visible au réveil.',
 'https://oss-cf.cjdropshipping.com/product/2026/03/08/08/39b9c7b8-3f18-4807-88a7-c597c7f21287_trans.jpeg',
 'new', 4.6, 0, FALSE, NULL, TRUE),

-- 13. Masque Yeux Vapeur SPA
('Masque Yeux Vapeur SPA', 'masque-yeux-vapeur-spa', 9.90, NULL,
 '12 masques vapeur auto-chauffants pour un spa des yeux. Chaleur douce à 40°C qui soulage la fatigue écrans et favorise l''endormissement. Relaxation totale.',
 ARRAY['Chaleur 40°C auto', '12 masques/boîte', 'Soulage fatigue écrans', 'Aide endormissement', 'Usage unique hygiénique', 'Relaxation SPA'],
 '{"contenu":"12 masques individuels","temperature":"40°C ± 2°C","duree":"15-20 min auto-chauffant","parfum":"Lavande apaisante"}',
 'Poudre de fer, charbon actif, eau purifiée, parfum lavande naturelle (tissu non-tissé coton)',
 '1. Ouvrez le sachet individuel. 2. La chaleur s''active en 30 sec. 3. Posez sur les yeux fermés. 4. Relaxez 15-20 min. Idéal avant le sommeil.',
 'https://cf.cjdropshipping.com/quick/product/f6d9a518-767e-454d-8560-7f7afab99bf4.jpg',
 'new', 4.8, 0, FALSE, NULL, TRUE),

-- 14. Diffuseur Arôme Ultrasonique
('Diffuseur Arôme Ultrasonique', 'diffuseur-arome-ultrasonique', 29.90, NULL,
 'Diffuseur ultrasonique en verre design. Brume aromatique fine + LED d''ambiance. Compatible toutes huiles essentielles. L''objet déco bien-être par excellence.',
 ARRAY['Atomisation ultrasonique', 'Design verre élégant', 'LED d''ambiance', 'Compatible huiles essentielles', 'Ultra-silencieux', 'Arrêt auto sécurité'],
 '{"capacite":"100 ml","couverture":"15-25 m²","bruit":"<30 dB","modes":"Continu / Intermittent / LED 7 couleurs","arret":"Auto quand vide"}',
 'Verre borosilicate, base céramique piézoélectrique, PP alimentaire',
 '1. Remplissez d''eau + 3-5 gouttes d''huile essentielle. 2. Choisissez le mode. 3. La brume se diffuse en silence. 4. Nettoyez le réservoir chaque semaine.',
 'https://oss-cf.cjdropshipping.com/product/2026/02/27/07/025cd8ab-7062-4c21-a81f-7dc8d5d22dac.jpg',
 'lancement', 4.6, 0, FALSE, NULL, TRUE),

-- 15. Kit Boucles Sans Chaleur
('Kit Boucles Sans Chaleur', 'kit-boucles-sans-chaleur', 8.90, NULL,
 'Boucles parfaites en dormant, sans abîmer vos cheveux. Set satin avec barre flexible octopus. Tous types de cheveux, toutes longueurs. Zéro dégât, 100% résultat.',
 ARRAY['Satin anti-frizz', 'Boucles overnight', 'Toutes longueurs', 'Barre flexible octopus', 'Zéro dégât cheveux', '3 couleurs dispo'],
 '{"materiau":"Satin 100% polyester, mousse mémoire","longueur":"90 cm (convient cheveux mi-longs à longs)","contenu":"1 barre + 2 pinces + 1 chouchou satin"}',
 'Satin polyester (anti-frizz), mousse à mémoire de forme, fil métallique flexible',
 '1. Cheveux légèrement humides ou secs. 2. Placez la barre sur le sommet. 3. Enroulez les mèches autour. 4. Fixez avec les pinces. 5. Dormez. Résultat au réveil.',
 'https://cf.cjdropshipping.com/d012ffbc-7b07-4dbe-a6cf-af70aa6f0440.jpg',
 'new', 4.7, 0, FALSE, NULL, TRUE);

-- ============================
-- COFFRETS (bundles)
-- ============================
-- Ajouter la colonne product_ids si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bundles' AND column_name = 'product_ids') THEN
        ALTER TABLE bundles ADD COLUMN product_ids INTEGER[] DEFAULT '{}';
    END IF;
END $$;

TRUNCATE bundles RESTART IDENTITY CASCADE;

INSERT INTO bundles (key, name, price, product_ids, active) VALUES
('eclat', 'Coffret Routine Éclat', 24.90, ARRAY[5, 8, 2], TRUE),
('antiage', 'Coffret Routine Anti-Âge', 49.90, ARRAY[1, 8, 10], TRUE),
('glow', 'Coffret Routine Glow', 29.90, ARRAY[8, 11, 9], TRUE);
