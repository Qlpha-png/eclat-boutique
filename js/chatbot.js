// ============================
// ÉCLAT - Assistant Beauté Intelligent
// Chatbot hybride : mots-clés (gratuit) + IA Claude (palier Lumière+)
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // ── Sécurité XSS ──
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ── Mode IA : activé si utilisateur connecté avec palier >= Lumière ──
    var aiMode = false;
    var aiHistory = [];
    var aiTier = null;
    var aiUsage = { used: 0, limit: null };

    // ── Réponses avec suggestions de suivi (mode basique) ──
    const KB = {
        fr: {
            greeting: 'Bonjour ! Je suis votre conseillère beauté ÉCLAT. Quel est votre besoin aujourd\'hui ?',
            suggestions: ['J\'ai de l\'acné', 'Anti-rides', 'Teint terne', 'Cernes & poches', 'Peau sèche', 'Infos livraison'],
            responses: {
                // --- PROBLÈMES DE PEAU ---
                acne: {
                    match: ['acné', 'bouton', 'imperfection', 'point noir', 'pore', 'sébum', 'peau grasse'],
                    answer: '<strong>Routine anti-acné ÉCLAT :</strong><br><br>1. <strong>Brosse Nettoyante Sonic</strong> (22,90€) — nettoyage profond sans agresser<br>2. <strong>Scrubber Ultrasonique</strong> (27,90€) — désincruste les pores en douceur<br>3. <strong>Masque LED Pro</strong> (39,90€) — lumière bleue anti-bactérienne<br><br><a href="pages/guide-beaute.html#led" style="color:var(--color-secondary-text);">Lire l\'étude clinique →</a>',
                    followUp: ['Ajouter le Masque LED', 'Comment utiliser le LED ?', 'Faire le diagnostic']
                },
                wrinkles: {
                    match: ['ride', 'anti-âge', 'vieillir', 'fermet', 'relâch', 'lifting'],
                    answer: '<strong>Routine anti-âge ÉCLAT :</strong><br><br>1. <strong>Sérum Vitamine C 20%</strong> (14,90€) — stimule le collagène<br>2. <strong>Masque LED Pro</strong> (39,90€) — lumière rouge régénérante<br>3. <strong>Stickers Anti-Rides Nuit</strong> (8,90€) — lisse pendant le sommeil<br><br><a href="pages/guide-beaute.html#vitc" style="color:var(--color-secondary-text);">Voir l\'étude Vitamine C →</a>',
                    followUp: ['Ajouter le Sérum', 'Voir les Stickers', 'Faire le diagnostic']
                },
                hydration: {
                    match: ['sèche', 'sec ', 'déshydrat', 'hydrat', 'tiraille', 'confort'],
                    answer: '<strong>Routine hydratation intense :</strong><br><br>1. <strong>Facial Steamer Nano-Ion</strong> (24,90€) — ouvre les pores, prépare la peau<br>2. <strong>Huile Précieuse Rose Musquée</strong> (14,90€) — nourrit en profondeur<br>3. <strong>Patchs Yeux Collagène</strong> (9,90€) — hydratation ciblée contour des yeux<br><br><a href="pages/guide-beaute.html#rosehip" style="color:var(--color-secondary-text);">La science de la Rose Musquée →</a>',
                    followUp: ['Ajouter le Steamer', 'Voir l\'Huile Rose', 'Faire le diagnostic']
                },
                darkcircles: {
                    match: ['cerne', 'poche', 'yeux gonfl', 'contour des yeux', 'fatigué', 'oeil'],
                    answer: '<strong>Solution cernes & poches :</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7,90€) — dégonfle instantanément<br>2. <strong>Patchs Yeux Collagène</strong> (9,90€) — hydrate + lisse le contour<br>3. <strong>Masque Yeux Vapeur SPA</strong> (9,90€) — relaxe et décongestionne<br><br>Total : seulement <strong>27,70€</strong> pour une routine complète !<br><a href="pages/guide-beaute.html#cryo" style="color:var(--color-secondary-text);">La science de la cryothérapie →</a>',
                    followUp: ['Ajouter l\'Ice Roller', 'Voir les Patchs', 'Faire le diagnostic']
                },
                glow: {
                    match: ['terne', 'éclat', 'lumineux', 'luminos', 'teint', 'glow', 'bright', 'tache', 'pigment'],
                    answer: '<strong>Routine éclat & luminosité :</strong><br><br>1. <strong>Sérum Vitamine C 20%</strong> (14,90€) — antioxydant, anti-taches<br>2. <strong>Gua Sha Quartz Rose</strong> (9,90€) — booste la microcirculation<br>3. <strong>Masque Collagène Lifting</strong> (12,90€) — coup d\'éclat immédiat<br><br><a href="pages/guide-beaute.html#guasha" style="color:var(--color-secondary-text);">Étude : Gua Sha +400% microcirculation →</a>',
                    followUp: ['Ajouter le Gua Sha', 'Voir le Sérum', 'Faire le diagnostic']
                },
                firming: {
                    match: ['rafferm', 'ovale', 'mâchoire', 'double menton', 'tonif', 'sculpt'],
                    answer: '<strong>Routine raffermissante :</strong><br><br>1. <strong>V-Line Roller EMS</strong> (18,90€) — micro-courants tonifiants<br>2. <strong>Gua Sha Quartz Rose</strong> (9,90€) — sculpte l\'ovale du visage<br>3. <strong>Masque LED Pro</strong> (39,90€) — lumière rouge pour la fermeté<br><br><a href="pages/guide-beaute.html#ems" style="color:var(--color-secondary-text);">Étude : EMS +18,6% épaisseur musculaire →</a>',
                    followUp: ['Ajouter le V-Line', 'Comment ça marche ?', 'Faire le diagnostic']
                },
                sensitivity: {
                    match: ['sensib', 'réactiv', 'rougeur', 'irritat', 'doux', 'douce', 'apais'],
                    answer: '<strong>Pour les peaux sensibles :</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7,90€) — apaise les rougeurs par le froid<br>2. <strong>Huile Précieuse Rose Musquée</strong> (14,90€) — régénère sans irriter<br>3. <strong>Facial Steamer Nano-Ion</strong> (24,90€) — vapeur douce, pas de friction<br><br>Tous nos outils sont <strong>non invasifs</strong> et adaptés aux peaux réactives.',
                    followUp: ['Ajouter l\'Ice Roller', 'Voir l\'Huile Rose', 'Faire le diagnostic']
                },

                // --- PRODUITS SPÉCIFIQUES ---
                led: {
                    match: ['masque led', 'led', 'lumière', 'luminothérapie', 'couleur'],
                    answer: '<strong>Masque LED Pro — Mode d\'emploi :</strong><br><br>1. Nettoyez votre visage, appliquez un sérum<br>2. Choisissez votre couleur :<br>• <strong>Rouge</strong> : anti-âge, stimule le collagène<br>• <strong>Bleu</strong> : anti-acné, antibactérien<br>• <strong>Vert</strong> : uniformise le teint<br>• <strong>Jaune</strong> : réduit les rougeurs<br>3. 15 min, 3-4x/semaine<br><br>Résultats cliniques dès <strong>14 jours</strong> (étude sur 136 volontaires).<br><a href="pages/guide-beaute.html#led" style="color:var(--color-secondary-text);">Voir l\'étude PubMed →</a>',
                    followUp: ['Ajouter le Masque LED', 'Anti-âge', 'Anti-acné']
                },
                guasha: {
                    match: ['gua sha', 'jade roller', 'rouleau', 'quartz', 'massage visage'],
                    answer: '<strong>Gua Sha Quartz Rose — Mode d\'emploi :</strong><br><br>1. Appliquez une huile ou un sérum<br>2. Mouvements du centre vers l\'extérieur, toujours <strong>vers le haut</strong><br>3. Cou → menton → joues → front → tempes<br>4. <strong>5 minutes/jour</strong> suffisent<br><br>Étude : augmente la microcirculation de <strong>+400%</strong>.<br><a href="pages/guide-beaute.html#guasha" style="color:var(--color-secondary-text);">Voir l\'étude PubMed →</a>',
                    followUp: ['Ajouter le Gua Sha', 'Routine éclat', 'Routine raffermissante']
                },
                vitaminc: {
                    match: ['vitamine c', 'sérum vitamine', 'sérum éclat'],
                    answer: '<strong>Sérum Vitamine C 20% — Conseils :</strong><br><br>• Appliquez le <strong>matin</strong> avant votre crème<br>• 3-4 gouttes suffisent pour tout le visage<br>• Conservez au frais et à l\'abri de la lumière<br>• Résultats visibles en <strong>21 jours</strong><br><br>20% d\'acide ascorbique stabilisé — concentration optimale selon les études.<br><a href="pages/guide-beaute.html#vitc" style="color:var(--color-secondary-text);">Voir l\'étude PubMed →</a>',
                    followUp: ['Ajouter le Sérum', 'Routine éclat', 'Routine anti-âge']
                },

                // --- COMMANDES & LOGISTIQUE ---
                routine: {
                    match: ['routine', 'diagnostic', 'conseil', 'recommand', 'quel produit', 'quoi choisir', 'besoin'],
                    answer: 'Le plus simple : faites notre <strong>Diagnostic Beauté gratuit</strong> ! En 4 questions, je vous crée une routine personnalisée selon votre type de peau.<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Commencer le diagnostic (2 min)</a>',
                    followUp: ['J\'ai de l\'acné', 'Anti-rides', 'Teint terne', 'Peau sèche']
                },
                shipping: {
                    match: ['livraison', 'délai', 'expédi', 'combien de temps', 'envoi', 'colis'],
                    answer: 'Nous livrons dans toute l\'<strong>Europe</strong> :<br><br>• <strong>Standard</strong> : 7-14 jours ouvrés — <strong>gratuit dès 29€</strong><br>• <strong>Express</strong> : 5-10 jours ouvrés — 7,90€<br>• Suivi de commande inclus<br>• Pas de frais de douane dans l\'UE',
                    followUp: ['Retours ?', 'Paiement ?', 'Où est mon colis ?']
                },
                returns: {
                    match: ['retour', 'rembours', 'échange', 'renvoy', 'satisfait'],
                    answer: 'Vous disposez de <strong>14 jours</strong> pour exercer votre droit de rétractation (conformément au Code de la consommation) :<br><br>• Frais de retour <strong>à votre charge</strong><br>• Remboursement sous <strong>5 jours ouvrés</strong><br>• Produit endommagé ? Envoyez une photo, on remplace sans frais<br><br><a href="pages/retours.html" style="color:var(--color-secondary-text);">Politique de retours complète →</a>',
                    followUp: ['Livraison ?', 'Garantie ?', 'Contact']
                },
                bestseller: {
                    match: ['best-seller', 'best seller', 'populaire', 'meilleur', 'top vente'],
                    answer: 'Nos 3 best-sellers :<br><br>1. <strong>Masque LED Pro 7 Couleurs</strong> (39,90€) — anti-âge + anti-acné<br>2. <strong>Gua Sha Quartz Rose</strong> (9,90€) — drainage + éclat<br>3. <strong>Ice Roller Cryo</strong> (7,90€) — anti-poches, anti-rougeurs<br><br>Tous validés par des études cliniques.',
                    followUp: ['Voir le Masque LED', 'Voir le Gua Sha', 'Faire le diagnostic']
                },
                payment: {
                    match: ['paiement', 'payer', 'carte', 'paypal', 'stripe', 'sécur'],
                    answer: 'Paiement <strong>100% sécurisé</strong> via Stripe :<br><br>• Carte bancaire (Visa, Mastercard, CB)<br>• PayPal<br>• Vos données bancaires ne passent <strong>jamais</strong> par nos serveurs<br>• Cryptage SSL 256-bit',
                    followUp: ['Livraison ?', 'Code promo ?', 'Commander']
                },
                tracking: {
                    match: ['suivi', 'suivre', 'où est mon colis', 'numéro de suivi', 'tracking'],
                    answer: 'Vous recevrez un <strong>email avec votre numéro de suivi</strong> dès l\'expédition (sous 1-3 jours ouvrés).<br><br>Pas reçu après 3 jours ? Vérifiez vos spams ou contactez-nous à <strong>contact@maison-eclat.shop</strong>.',
                    followUp: ['Livraison ?', 'Retours ?', 'Contact']
                },
                promo: {
                    match: ['code promo', 'réduction', 'coupon', 'promotion', 'remise', 'bienvenue', 'restez'],
                    answer: 'Nos codes actifs :<br><br>• <strong>BIENVENUE10</strong> : -10% sur votre 1ère commande<br>• <strong>RESTEZ15</strong> : -15% (newsletter exclusive)<br><br>Inscrivez-vous à la newsletter en bas de page pour recevoir vos codes. Ils s\'appliquent sur la page de paiement Stripe.',
                    followUp: ['Comment commander ?', 'Best-sellers ?', 'Livraison ?']
                },
                order: {
                    match: ['commande', 'commander', 'comment acheter', 'acheter', 'panier'],
                    answer: 'C\'est simple :<br><br>1. Ajoutez vos produits au panier<br>2. Cliquez sur <strong>Commander</strong><br>3. Réglez en toute sécurité via Stripe<br><br>Pas besoin de créer un compte ! Livraison gratuite dès 29€.',
                    followUp: ['Paiement ?', 'Code promo ?', 'Best-sellers ?']
                },
                cancel: {
                    match: ['annuler', 'modifier', 'annulation', 'changer ma commande'],
                    answer: 'Contactez-nous dans les <strong>2 heures</strong> suivant votre achat à <strong>contact@maison-eclat.shop</strong> — nous ferons le maximum pour modifier ou annuler votre commande.',
                    followUp: ['Retours ?', 'Contact', 'Suivi de commande']
                },
                guarantee: {
                    match: ['garantie', 'défectueux', 'cassé', 'abîmé', 'endommagé', 'qualité'],
                    answer: 'Tous nos appareils électroniques : <strong>garantie légale de 2 ans</strong>.<br><br>Produit endommagé à la réception ? Envoyez une photo à contact@maison-eclat.shop → remplacement ou remboursement <strong>sans frais de retour</strong>.',
                    followUp: ['Retours ?', 'Contact', 'Livraison ?']
                },
                contact: {
                    match: ['contact', 'email', 'téléphone', 'joindre', 'aide'],
                    answer: 'Contactez-nous :<br><br>• Email : <strong>contact@maison-eclat.shop</strong> (réponse sous 24h)<br>• Instagram : @eclat.beaute<br><br>Nous répondons 7j/7 !<br><a href="pages/contact.html" style="color:var(--color-secondary-text);">Page contact →</a>',
                    followUp: ['Livraison ?', 'Retours ?', 'Parler à un humain']
                },
                human: {
                    match: ['humain', 'agent', 'personne', 'vrai personne', 'parler à quelqu', 'support humain', 'un humain'],
                    answer: 'Je vous redirige vers notre équipe ! 🙋<br><br>• <strong>Email :</strong> <a href="mailto:contact@maison-eclat.shop" style="color:var(--color-secondary-text);">contact@maison-eclat.shop</a> (réponse sous 24h)<br>• <strong>Formulaire :</strong> <a href="pages/contact.html" style="color:var(--color-secondary-text);">Page contact →</a><br>• <strong>Instagram :</strong> @eclat.beaute (DMs ouverts)<br><br>Notre équipe vous répondra personnellement !',
                    followUp: ['FAQ', 'Livraison ?', 'Retours ?']
                },
                price: {
                    match: ['prix', 'cher', 'coût', 'budget', 'pas cher', 'abordable', 'combien'],
                    answer: 'Nos prix :<br><br>• À partir de <strong>7,90€</strong> (Ice Roller, Masque Yeux SPA)<br>• Jusqu\'à <strong>39,90€</strong> (Masque LED Pro)<br>• Livraison <strong>gratuite dès 29€</strong><br><br>Des coffrets existent pour économiser !',
                    followUp: ['Best-sellers ?', 'Code promo ?', 'Voir les coffrets']
                },
                bundles: {
                    match: ['coffret', 'pack', 'ensemble', 'lot', 'routine complète'],
                    answer: '<strong>Nos 3 coffrets :</strong><br><br>1. <strong>Coffret Routine Éclat</strong> — Ice Roller + Sérum VitC + Gua Sha → <strong>24,90€</strong> au lieu de 32,70€<br>2. <strong>Coffret Routine Anti-Âge</strong> — LED + Sérum VitC + Masque Collagène → <strong>49,90€</strong> au lieu de 67,70€<br>3. <strong>Coffret Routine Glow</strong> — Sérum VitC + Huile Rose + Patchs Yeux → <strong>29,90€</strong> au lieu de 39,70€<br><br>Ajoutez les produits un par un : le panier détecte le coffret automatiquement !',
                    followUp: ['Coffret Éclat', 'Coffret Anti-Âge', 'Coffret Glow']
                },
                customs: {
                    match: ['douane', 'taxe', 'frais supplémentaire', 'hors france', 'suisse'],
                    answer: 'Pas de frais de douane au sein de l\'<strong>Union européenne</strong>.<br><br>Pour la Suisse, des frais de dédouanement peuvent s\'appliquer selon la réglementation locale.<br><a href="pages/faq.html" style="color:var(--color-secondary-text);">Plus d\'infos dans la FAQ →</a>',
                    followUp: ['Livraison ?', 'Paiement ?', 'Contact']
                },
                cruelty: {
                    match: ['cruelty', 'animaux', 'vegan', 'test animal', 'éthique'],
                    answer: 'Conformément à la réglementation européenne (Règlement CE 1223/2009), <strong>les tests cosmétiques sur animaux sont interdits dans l\'UE</strong>. Nos fournisseurs sont tenus de respecter cette législation. Pour chaque produit, consultez le <strong>Clean Beauty Score</strong> qui analyse la composition INCI en détail.',
                    followUp: ['Nos garanties', 'Clean Beauty Score', 'Faire le diagnostic']
                },
                science: {
                    match: ['science', 'étude', 'preuve', 'clinique', 'pubmed', 'recherche'],
                    answer: 'Chaque technologie ÉCLAT est validée par des <strong>études publiées dans des revues à comité de lecture</strong> (PubMed).<br><br>Notre Guide Beauté Scientifique regroupe 15 études sur nos 8 technologies.<br><br><a href="pages/guide-beaute.html" style="color:var(--color-secondary-text);font-weight:600;">→ Lire le Guide Scientifique</a>',
                    followUp: ['Masque LED', 'Gua Sha', 'Vitamine C']
                },
                fallback: 'Je ne suis pas sûre de comprendre votre question. Voici comment je peux vous aider :<br><br>• <strong>Peau</strong> : acné, rides, cernes, éclat, hydratation, sensibilité<br>• <strong>Produits</strong> : LED, Gua Sha, Vitamine C, best-sellers<br>• <strong>Commande</strong> : livraison, suivi, retours, codes promo<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Diagnostic beauté gratuit</a> | <a href="pages/faq.html" style="color:var(--color-secondary-text);font-weight:600;">FAQ complète</a>'
            }
        },
        en: {
            greeting: 'Hello! I\'m your Maison \u00c9clat beauty advisor. What can I help you with today?',
            suggestions: ['I have acne', 'Anti-aging', 'Dull skin', 'Dark circles', 'Dry skin', 'Shipping info'],
            responses: {
                acne: { match: ['acne', 'breakout', 'pimple', 'blackhead', 'pore', 'oily'], answer: '<strong>ÉCLAT anti-acne routine:</strong><br><br>1. <strong>Sonic Cleansing Brush</strong> (22.90€) — deep cleanse<br>2. <strong>Ultrasonic Scrubber</strong> (27.90€) — gentle pore extraction<br>3. <strong>LED Mask Pro</strong> (39.90€) — blue light kills bacteria<br><br><a href="pages/guide-beaute.html#led" style="color:var(--color-secondary-text);">Read the clinical study →</a>', followUp: ['Add LED Mask', 'How does LED work?', 'Take the quiz'] },
                wrinkles: { match: ['wrinkle', 'anti-aging', 'aging', 'firm', 'collagen', 'lifting'], answer: '<strong>ÉCLAT anti-aging routine:</strong><br><br>1. <strong>Vitamin C Serum 20%</strong> (14.90€) — collagen boost<br>2. <strong>LED Mask Pro</strong> (39.90€) — red light therapy<br>3. <strong>Night Anti-Wrinkle Stickers</strong> (8.90€) — smooths overnight<br><br><a href="pages/guide-beaute.html#vitc" style="color:var(--color-secondary-text);">See Vitamin C study →</a>', followUp: ['Add Serum', 'See Stickers', 'Take the quiz'] },
                hydration: { match: ['dry', 'dehydrat', 'hydrat', 'tight', 'moisture'], answer: '<strong>Intense hydration routine:</strong><br><br>1. <strong>Facial Steamer Nano-Ion</strong> (24.90€) — opens pores, preps skin<br>2. <strong>Rosehip Oil</strong> (14.90€) — deep nourishment<br>3. <strong>Collagen Eye Patches</strong> (9.90€) — targeted hydration<br><br><a href="pages/guide-beaute.html#rosehip" style="color:var(--color-secondary-text);">The science of Rosehip →</a>', followUp: ['Add Steamer', 'See Rosehip Oil', 'Take the quiz'] },
                darkcircles: { match: ['dark circle', 'puffy', 'eye bag', 'under eye', 'tired'], answer: '<strong>Dark circles & puffiness solution:</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7.90€) — instant de-puff<br>2. <strong>Collagen Eye Patches</strong> (9.90€) — hydrate + smooth<br>3. <strong>Steam Eye Mask SPA</strong> (9.90€) — relax + decongest<br><br>Total: only <strong>27.70€</strong>!', followUp: ['Add Ice Roller', 'See Patches', 'Take the quiz'] },
                glow: { match: ['dull', 'glow', 'bright', 'radianc', 'dark spot', 'pigment', 'uneven'], answer: '<strong>Glow & radiance routine:</strong><br><br>1. <strong>Vitamin C Serum 20%</strong> (14.90€) — antioxidant, brightening<br>2. <strong>Rose Quartz Gua Sha</strong> (9.90€) — boosts microcirculation<br>3. <strong>Collagen Lifting Mask</strong> (12.90€) — instant glow<br><br><a href="pages/guide-beaute.html#guasha" style="color:var(--color-secondary-text);">Study: Gua Sha +400% circulation →</a>', followUp: ['Add Gua Sha', 'See Serum', 'Take the quiz'] },
                firming: { match: ['firm', 'jawline', 'double chin', 'tone', 'sculpt', 'sag'], answer: '<strong>Firming routine:</strong><br><br>1. <strong>V-Line EMS Roller</strong> (18.90€) — microcurrent toning<br>2. <strong>Rose Quartz Gua Sha</strong> (9.90€) — sculpts facial contour<br>3. <strong>LED Mask Pro</strong> (39.90€) — red light for firmness<br><br><a href="pages/guide-beaute.html#ems" style="color:var(--color-secondary-text);">Study: EMS +18.6% muscle thickness →</a>', followUp: ['Add V-Line', 'How does it work?', 'Take the quiz'] },
                sensitivity: { match: ['sensitiv', 'reactiv', 'redness', 'irritat', 'gentle', 'calm'], answer: '<strong>For sensitive skin:</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7.90€) — soothes redness with cold<br>2. <strong>Rosehip Oil</strong> (14.90€) — regenerates without irritation<br>3. <strong>Facial Steamer Nano-Ion</strong> (24.90€) — gentle steam, no friction<br><br>All non-invasive, suitable for reactive skin.', followUp: ['Add Ice Roller', 'See Rosehip Oil', 'Take the quiz'] },
                routine: { match: ['routine', 'diagnostic', 'advice', 'recommend', 'which product', 'what should'], answer: 'Take our <strong>Free Beauty Diagnostic</strong>! In 4 questions, I\'ll create your personalized routine.<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Start diagnostic (2 min)</a>', followUp: ['I have acne', 'Anti-aging', 'Dull skin', 'Dry skin'] },
                shipping: { match: ['shipping', 'delivery', 'how long', 'ship', 'send'], answer: 'We ship across <strong>Europe</strong>:<br><br>• <strong>Standard</strong>: 7-14 business days — free from 29€<br>• <strong>Express</strong>: 5-10 business days — 7.90€<br>• Tracking included<br>• No customs fees within the EU', followUp: ['Returns?', 'Payment?', 'Track my order'] },
                returns: { match: ['return', 'refund', 'exchange', 'send back'], answer: '<strong>14 days</strong> to return products (as per consumer law):<br><br>• Return shipping at your expense<br>• Refund within 5 business days<br>• Damaged? Send a photo, we replace at no cost', followUp: ['Shipping?', 'Warranty?', 'Contact'] },
                bestseller: { match: ['best-seller', 'popular', 'best', 'top sell'], answer: 'Our top 3 best-sellers:<br><br>1. <strong>LED Mask Pro 7 Colors</strong> (39.90€)<br>2. <strong>Rose Quartz Gua Sha</strong> (9.90€)<br>3. <strong>Ice Roller Cryo</strong> (7.90€)<br><br>All backed by clinical studies.', followUp: ['See LED Mask', 'See Gua Sha', 'Take the quiz'] },
                payment: { match: ['payment', 'pay', 'card', 'paypal', 'secure'], answer: '100% secure payment via Stripe:<br><br>• Credit card (Visa, Mastercard)<br>• PayPal<br>• Bank data never stored on our servers<br>• SSL 256-bit encryption', followUp: ['Shipping?', 'Promo code?', 'How to order'] },
                promo: { match: ['promo', 'discount', 'coupon', 'promotion', 'welcome'], answer: 'Active codes:<br><br>• <strong>BIENVENUE10</strong>: -10% first order<br>• <strong>RESTEZ15</strong>: -15% (newsletter exclusive)<br><br>Subscribe to the newsletter for your codes!', followUp: ['How to order?', 'Best-sellers?', 'Shipping?'] },
                contact: { match: ['contact', 'email', 'phone', 'reach', 'help', 'support'], answer: 'Contact us:<br><br>• Email: <strong>contact@maison-eclat.shop</strong> (reply within 24h)<br>• Instagram: @eclat.beaute<br><br>We respond 7 days a week!', followUp: ['Shipping?', 'Returns?', 'Talk to a human'] },
                human: { match: ['human', 'agent', 'real person', 'talk to someone', 'human support'], answer: 'I\'ll connect you with our team! 🙋<br><br>• <strong>Email:</strong> <a href="mailto:contact@maison-eclat.shop" style="color:var(--color-secondary-text);">contact@maison-eclat.shop</a> (reply within 24h)<br>• <strong>Form:</strong> <a href="pages/contact.html" style="color:var(--color-secondary-text);">Contact page →</a><br>• <strong>Instagram:</strong> @eclat.beaute (DMs open)<br><br>Our team will answer you personally!', followUp: ['FAQ', 'Shipping?', 'Returns?'] },
                led: { match: ['led mask', 'led', 'light therapy'], answer: '<strong>LED Mask Pro instructions:</strong><br><br>1. Cleanse face + serum<br>2. Choose color: Red (anti-aging), Blue (anti-acne), Green (even tone), Yellow (redness)<br>3. 15 min, 3-4x/week<br><br>Clinical results in <strong>14 days</strong>.', followUp: ['Add LED Mask', 'Anti-aging', 'Anti-acne'] },
                guasha: { match: ['gua sha', 'jade roller', 'quartz', 'face massage'], answer: '<strong>Gua Sha instructions:</strong><br><br>1. Apply oil or serum<br>2. Stroke center to outward, always <strong>upward</strong><br>3. 5 minutes/day is enough<br><br>Study: increases microcirculation by <strong>+400%</strong>.', followUp: ['Add Gua Sha', 'Glow routine', 'Firming routine'] },
                science: { match: ['science', 'study', 'proof', 'clinical', 'pubmed', 'research'], answer: 'Every ÉCLAT technology is backed by <strong>peer-reviewed studies</strong> (PubMed).<br><br><a href="pages/guide-beaute.html" style="color:var(--color-secondary-text);font-weight:600;">→ Read our Science Guide (15 studies)</a>', followUp: ['LED Mask', 'Gua Sha', 'Vitamin C'] },
                price: { match: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'how much', 'budget'], answer: 'Our prices:<br><br>• From <strong>7.90€</strong> (Ice Roller, Eye Mask SPA)<br>• Up to <strong>39.90€</strong> (LED Mask Pro)<br>• <strong>Free shipping</strong> from 29€<br><br>Save with our bundles!', followUp: ['Best-sellers?', 'Promo code?', 'See bundles'] },
                bundles: { match: ['bundle', 'set', 'pack', 'combo', 'routine set'], answer: '<strong>Our 3 bundles:</strong><br><br>1. <strong>Radiance Bundle</strong> — Ice Roller + Vitamin C Serum + Gua Sha → <strong>24.90€</strong> instead of 32.70€<br>2. <strong>Anti-Aging Bundle</strong> — LED Mask + Vitamin C Serum + Collagen Mask → <strong>49.90€</strong> instead of 67.70€<br>3. <strong>Glow Bundle</strong> — Vitamin C Serum + Rosehip Oil + Eye Patches → <strong>29.90€</strong> instead of 39.70€<br><br>Add products individually — the cart detects bundles automatically!', followUp: ['Radiance', 'Anti-Aging', 'Take the quiz'] },
                fallback: 'I\'m not sure I understand. I can help with:<br><br>• <strong>Skin</strong>: acne, wrinkles, dark circles, glow, hydration<br>• <strong>Products</strong>: LED, Gua Sha, Vitamin C, best-sellers<br>• <strong>Orders</strong>: shipping, tracking, returns, promo codes<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Free beauty diagnostic</a>'
            }
        },
        es: {
            greeting: '¡Hola! Soy tu asesora de belleza ÉCLAT. ¿En qué puedo ayudarte hoy?',
            suggestions: ['Tengo acné', 'Anti-arrugas', 'Piel apagada', 'Ojeras', 'Piel seca', 'Info de envío'],
            responses: {
                acne: { match: ['acné', 'grano', 'imperfección', 'punto negro', 'poro', 'grasa'], answer: '<strong>Rutina anti-acné ÉCLAT:</strong><br><br>1. <strong>Cepillo Sónico</strong> (22,90€) — limpieza profunda<br>2. <strong>Scrubber Ultrasónico</strong> (27,90€) — extracción suave<br>3. <strong>Mascarilla LED Pro</strong> (39,90€) — luz azul antibacteriana<br><br><a href="pages/guide-beaute.html#led" style="color:var(--color-secondary-text);">Ver estudio clínico →</a>', followUp: ['Añadir Mascarilla LED', '¿Cómo funciona?', 'Hacer el diagnóstico'] },
                wrinkles: { match: ['arruga', 'anti-edad', 'envejecimiento', 'firmeza', 'colágeno', 'lifting'], answer: '<strong>Rutina anti-edad ÉCLAT:</strong><br><br>1. <strong>Sérum Vitamina C 20%</strong> (14,90€)<br>2. <strong>Mascarilla LED Pro</strong> (39,90€) — luz roja<br>3. <strong>Stickers Anti-Arrugas</strong> (8,90€)', followUp: ['Añadir Sérum', 'Ver Stickers', 'Diagnóstico'] },
                hydration: { match: ['seca', 'deshidrat', 'hidrat', 'tirante'], answer: '<strong>Rutina hidratación:</strong><br><br>1. <strong>Steamer Facial Nano-Ion</strong> (24,90€)<br>2. <strong>Aceite Rosa Mosqueta</strong> (14,90€)<br>3. <strong>Parches Ojos Colágeno</strong> (9,90€)', followUp: ['Añadir Steamer', 'Ver Aceite Rosa', 'Diagnóstico'] },
                darkcircles: { match: ['ojera', 'bolsa', 'ojos hinchados', 'contorno', 'cansad'], answer: '<strong>Solución ojeras y bolsas:</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7,90€)<br>2. <strong>Parches Ojos Colágeno</strong> (9,90€)<br>3. <strong>Mascarilla Ojos Vapor</strong> (9,90€)<br><br>Total: ¡solo <strong>27,70€</strong>!', followUp: ['Añadir Ice Roller', 'Ver Parches', 'Diagnóstico'] },
                glow: { match: ['apagad', 'luminosidad', 'brillo', 'mancha', 'pigment', 'tono'], answer: '<strong>Rutina luminosidad:</strong><br><br>1. <strong>Sérum Vitamina C 20%</strong> (14,90€)<br>2. <strong>Gua Sha Cuarzo Rosa</strong> (9,90€)<br>3. <strong>Mascarilla Colágeno Lifting</strong> (12,90€)', followUp: ['Añadir Gua Sha', 'Ver Sérum', 'Diagnóstico'] },
                routine: { match: ['rutina', 'diagnóstico', 'consejo', 'recomendar', 'qué producto'], answer: 'Haz nuestro <strong>Diagnóstico de Belleza gratuito</strong>. En 4 preguntas, te creo una rutina personalizada.<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Empezar diagnóstico (2 min)</a>', followUp: ['Tengo acné', 'Anti-arrugas', 'Piel apagada'] },
                shipping: { match: ['envío', 'entrega', 'cuánto tarda', 'enviar'], answer: 'Enviamos a toda <strong>Europa</strong>:<br><br>• <strong>Estándar</strong>: 7-14 días — gratis desde 29€<br>• <strong>Express</strong>: 5-10 días — 7,90€<br>• Seguimiento incluido', followUp: ['Devoluciones?', 'Pago?', 'Seguimiento'] },
                returns: { match: ['devolución', 'reembolso', 'devolver'], answer: '<strong>14 días</strong> de derecho de desistimiento (conforme a la ley). Gastos de envío de devolución a cargo del cliente. Reembolso en 5 días.', followUp: ['Envío?', 'Garantía?', 'Contacto'] },
                bestseller: { match: ['más vendido', 'popular', 'mejor', 'top'], answer: 'Top 3 más vendidos:<br><br>1. <strong>Mascarilla LED Pro</strong> (39,90€)<br>2. <strong>Gua Sha Cuarzo Rosa</strong> (9,90€)<br>3. <strong>Ice Roller Cryo</strong> (7,90€)', followUp: ['Ver LED', 'Ver Gua Sha', 'Diagnóstico'] },
                promo: { match: ['código', 'descuento', 'cupón', 'promoción'], answer: 'Códigos activos:<br><br>• <strong>BIENVENUE10</strong>: -10% primer pedido<br>• <strong>RESTEZ15</strong>: -15% (newsletter)', followUp: ['¿Cómo pedir?', 'Más vendidos?', 'Envío?'] },
                contact: { match: ['contacto', 'email', 'teléfono', 'ayuda'], answer: 'Contáctanos:<br><br>• Email: <strong>contact@maison-eclat.shop</strong> (respuesta en 24h)<br>• Instagram: @eclat.beaute', followUp: ['Envío?', 'Devoluciones?', 'Hablar con alguien'] },
                human: { match: ['humano', 'agente', 'persona real', 'hablar con alguien', 'soporte humano'], answer: '¡Te conecto con nuestro equipo! 🙋<br><br>• <strong>Email:</strong> <a href="mailto:contact@maison-eclat.shop" style="color:var(--color-secondary-text);">contact@maison-eclat.shop</a><br>• <strong>Formulario:</strong> <a href="pages/contact.html" style="color:var(--color-secondary-text);">Página de contacto →</a>', followUp: ['FAQ', 'Envío?', 'Devoluciones?'] },
                payment: { match: ['pago', 'pagar', 'tarjeta', 'paypal', 'seguro'], answer: 'Pago 100% seguro vía Stripe: tarjeta (Visa, Mastercard), PayPal. Datos nunca almacenados.', followUp: ['Envío?', 'Código?', 'Pedir'] },
                price: { match: ['precio', 'caro', 'barato', 'cuánto', 'presupuesto'], answer: 'Nuestros precios:<br><br>• Desde <strong>7,90€</strong> (Ice Roller, Mascarilla Ojos SPA)<br>• Hasta <strong>39,90€</strong> (Mascarilla LED Pro)<br>• Envío <strong>gratis</strong> desde 29€<br><br>¡Ahorra con nuestros packs!', followUp: ['Más vendidos?', 'Código?', 'Ver packs'] },
                bundles: { match: ['pack', 'conjunto', 'lote', 'rutina completa'], answer: '<strong>Nuestros 3 packs:</strong><br><br>1. <strong>Pack Luminosidad</strong> — Ice Roller + Sérum VitC + Gua Sha → <strong>24,90€</strong> en vez de 32,70€<br>2. <strong>Pack Anti-Edad</strong> — LED + Sérum VitC + Mascarilla Colágeno → <strong>49,90€</strong> en vez de 67,70€<br>3. <strong>Pack Glow</strong> — Sérum VitC + Aceite Rosa + Parches Ojos → <strong>29,90€</strong> en vez de 39,70€<br><br>¡Añade productos sueltos y el carrito detecta el pack!', followUp: ['Luminosidad', 'Anti-Edad', 'Diagnóstico'] },
                fallback: 'No estoy segura de entender. Puedo ayudarte con:<br><br>• <strong>Piel</strong>: acné, arrugas, ojeras, luminosidad, hidratación<br>• <strong>Productos</strong>: LED, Gua Sha, Vitamina C<br>• <strong>Pedidos</strong>: envío, devoluciones, códigos promo<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Diagnóstico gratis</a>'
            }
        },
        de: {
            greeting: 'Hallo! Ich bin Ihre Maison \u00c9clat Beauty-Beraterin. Wie kann ich Ihnen heute helfen?',
            suggestions: ['Ich habe Akne', 'Anti-Falten', 'Fahler Teint', 'Augenringe', 'Trockene Haut', 'Versandinfos'],
            responses: {
                acne: { match: ['akne', 'pickel', 'unreinheit', 'mitesser', 'pore', 'fettig'], answer: '<strong>ÉCLAT Anti-Akne-Routine:</strong><br><br>1. <strong>Sonic-Reinigungsbürste</strong> (22,90€)<br>2. <strong>Ultraschall-Scrubber</strong> (27,90€)<br>3. <strong>LED-Maske Pro</strong> (39,90€) — Blaulicht antibakteriell<br><br><a href="pages/guide-beaute.html#led" style="color:var(--color-secondary-text);">Klinische Studie lesen →</a>', followUp: ['LED-Maske hinzufügen', 'Wie funktioniert LED?', 'Diagnose starten'] },
                wrinkles: { match: ['falten', 'anti-aging', 'altern', 'straffung', 'kollagen', 'lifting'], answer: '<strong>ÉCLAT Anti-Aging-Routine:</strong><br><br>1. <strong>Vitamin C Serum 20%</strong> (14,90€)<br>2. <strong>LED-Maske Pro</strong> (39,90€) — Rotlicht<br>3. <strong>Anti-Falten-Sticker Nacht</strong> (8,90€)', followUp: ['Serum hinzufügen', 'Sticker ansehen', 'Diagnose'] },
                hydration: { match: ['trocken', 'dehydr', 'feucht', 'spannt'], answer: '<strong>Feuchtigkeitsroutine:</strong><br><br>1. <strong>Facial Steamer Nano-Ion</strong> (24,90€)<br>2. <strong>Hagebuttenöl</strong> (14,90€)<br>3. <strong>Kollagen-Augenpads</strong> (9,90€)', followUp: ['Steamer hinzufügen', 'Hagebuttenöl', 'Diagnose'] },
                darkcircles: { match: ['augenring', 'schwellung', 'geschwollen', 'augen', 'müde'], answer: '<strong>Augenringe & Schwellungen:</strong><br><br>1. <strong>Ice Roller Cryo</strong> (7,90€)<br>2. <strong>Kollagen-Augenpads</strong> (9,90€)<br>3. <strong>Dampf-Augenmaske SPA</strong> (9,90€)<br><br>Gesamt: nur <strong>27,70€</strong>!', followUp: ['Ice Roller hinzufügen', 'Augenpads', 'Diagnose'] },
                glow: { match: ['fahl', 'strahlen', 'glanz', 'flecken', 'pigment', 'teint'], answer: '<strong>Strahlkraft-Routine:</strong><br><br>1. <strong>Vitamin C Serum 20%</strong> (14,90€)<br>2. <strong>Rosenquarz Gua Sha</strong> (9,90€)<br>3. <strong>Kollagen Lifting-Maske</strong> (12,90€)', followUp: ['Gua Sha hinzufügen', 'Serum ansehen', 'Diagnose'] },
                routine: { match: ['routine', 'empfehlung', 'welches produkt', 'diagnose', 'was soll ich'], answer: 'Machen Sie unsere <strong>kostenlose Hautdiagnose</strong>! In 4 Fragen erstelle ich Ihre persönliche Routine.<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Diagnose starten (2 Min)</a>', followUp: ['Akne', 'Anti-Falten', 'Fahler Teint'] },
                shipping: { match: ['versand', 'lieferung', 'wie lange', 'senden'], answer: 'Versand in ganz <strong>Europa</strong>:<br><br>• <strong>Standard</strong>: 7-14 Werktage — ab 29€ kostenlos<br>• <strong>Express</strong>: 5-10 Werktage — 7,90€<br>• Sendungsverfolgung inklusive', followUp: ['Rückgabe?', 'Zahlung?', 'Sendungsverfolgung'] },
                returns: { match: ['rückgabe', 'erstattung', 'zurückgeben', 'umtausch'], answer: '<strong>14 Tage</strong> Widerrufsrecht. Rücksendekosten trägt der Kunde. Erstattung in 5 Werktagen.', followUp: ['Versand?', 'Garantie?', 'Kontakt'] },
                bestseller: { match: ['bestseller', 'beliebt', 'beste', 'top'], answer: 'Top 3 Bestseller:<br><br>1. <strong>LED-Maske Pro</strong> (39,90€)<br>2. <strong>Rosenquarz Gua Sha</strong> (9,90€)<br>3. <strong>Ice Roller Cryo</strong> (7,90€)', followUp: ['LED ansehen', 'Gua Sha ansehen', 'Diagnose'] },
                promo: { match: ['gutschein', 'rabatt', 'code', 'aktion'], answer: 'Aktive Codes:<br><br>• <strong>BIENVENUE10</strong>: -10% erste Bestellung<br>• <strong>RESTEZ15</strong>: -15% (Newsletter)', followUp: ['Wie bestellen?', 'Bestseller?', 'Versand?'] },
                contact: { match: ['kontakt', 'email', 'telefon', 'hilfe'], answer: 'Kontakt:<br><br>• E-Mail: <strong>contact@maison-eclat.shop</strong> (Antwort in 24h)<br>• Instagram: @eclat.beaute', followUp: ['Versand?', 'Rückgabe?', 'Mit einem Menschen sprechen'] },
                human: { match: ['mensch', 'mitarbeiter', 'echte person', 'jemanden sprechen', 'menschlicher support'], answer: 'Ich verbinde Sie mit unserem Team! 🙋<br><br>• <strong>E-Mail:</strong> <a href="mailto:contact@maison-eclat.shop" style="color:var(--color-secondary-text);">contact@maison-eclat.shop</a><br>• <strong>Formular:</strong> <a href="pages/contact.html" style="color:var(--color-secondary-text);">Kontaktseite →</a>', followUp: ['FAQ', 'Versand?', 'Rückgabe?'] },
                payment: { match: ['zahlung', 'bezahlen', 'karte', 'paypal', 'sicher'], answer: '100% sichere Zahlung über Stripe: Kreditkarte (Visa, Mastercard), PayPal. Bankdaten nie gespeichert.', followUp: ['Versand?', 'Code?', 'Bestellen'] },
                price: { match: ['preis', 'teuer', 'günstig', 'kosten', 'wieviel', 'budget'], answer: 'Unsere Preise:<br><br>• Ab <strong>7,90€</strong> (Ice Roller, Dampf-Augenmaske)<br>• Bis <strong>39,90€</strong> (LED-Maske Pro)<br>• <strong>Kostenloser Versand</strong> ab 29€<br><br>Sparen Sie mit unseren Sets!', followUp: ['Bestseller?', 'Rabattcode?', 'Sets ansehen'] },
                bundles: { match: ['set', 'paket', 'bündel', 'routine-set', 'kombination'], answer: '<strong>Unsere 3 Sets:</strong><br><br>1. <strong>Strahlkraft-Set</strong> — Ice Roller + Vitamin C Serum + Gua Sha → <strong>24,90€</strong> statt 32,70€<br>2. <strong>Anti-Aging-Set</strong> — LED-Maske + Vitamin C Serum + Kollagen-Maske → <strong>49,90€</strong> statt 67,70€<br>3. <strong>Glow-Set</strong> — Vitamin C Serum + Hagebuttenöl + Augenpads → <strong>29,90€</strong> statt 39,70€<br><br>Produkte einzeln hinzufügen — der Warenkorb erkennt Sets automatisch!', followUp: ['Strahlkraft', 'Anti-Aging', 'Diagnose'] },
                fallback: 'Ich bin nicht sicher, ob ich verstehe. Ich kann helfen mit:<br><br>• <strong>Haut</strong>: Akne, Falten, Augenringe, Strahlkraft, Feuchtigkeit<br>• <strong>Produkte</strong>: LED, Gua Sha, Vitamin C<br>• <strong>Bestellung</strong>: Versand, Rückgaben, Promo-Codes<br><br><a href="pages/diagnostic.html" style="color:var(--color-secondary-text);font-weight:600;">→ Kostenlose Diagnose</a>'
            }
        }
    };

    function getResponse(message, lang) {
        const kb = KB[lang] || KB.fr;
        const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        for (const [key, data] of Object.entries(kb.responses)) {
            if (key === 'fallback') continue;
            if (data.match && data.match.some(word => msg.includes(word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
                return { answer: data.answer, followUp: data.followUp || [] };
            }
        }

        // Fallback FR matching for all languages
        if (lang !== 'fr') {
            for (const [key, data] of Object.entries(KB.fr.responses)) {
                if (key === 'fallback') continue;
                if (data.match && data.match.some(word => msg.includes(word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
                    return { answer: data.answer, followUp: data.followUp || [] };
                }
            }
        }

        return { answer: kb.responses.fallback, followUp: [] };
    }

    // Create chat widget
    const widget = document.createElement('div');
    widget.id = 'eclatChat';
    widget.innerHTML = `
        <div class="chat-bubble" id="chatBubble">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </div>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar" id="chatAvatar">E</div>
                    <div>
                        <strong id="chatTitle">Conseill&egrave;re &Eacute;CLAT</strong>
                        <span class="chat-status" id="chatStatus">En ligne</span>
                    </div>
                </div>
                <button class="chat-close" id="chatClose">&times;</button>
            </div>
            <div id="chatAiBadge" style="display:none;padding:6px 16px;background:linear-gradient(135deg,#1a1520,#2d1f3d);text-align:center;font-size:0.7rem;color:var(--color-secondary,#c9a87c);letter-spacing:0.5px;border-bottom:1px solid rgba(201,168,124,0.2);">
                <span id="chatTierBadge"></span>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-suggestions" id="chatSuggestions"></div>
            <div class="chat-input-area">
                <input type="text" id="chatInput" placeholder="Posez votre question..." autocomplete="off">
                <button id="chatSend">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatSuggestions = document.getElementById('chatSuggestions');

    let isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        chatWindow.classList.toggle('open', isOpen);
        chatBubble.classList.toggle('hidden', isOpen);
        if (isOpen && chatMessages.children.length === 0) {
            initChat();
        }
    }

    function initChat() {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
        const kb = KB[lang] || KB.fr;

        // Traduire le titre et statut du chatbot
        var chatTitles = { fr: 'Conseillère ÉCLAT', en: 'ÉCLAT Advisor', es: 'Asesora ÉCLAT', de: 'ÉCLAT Beraterin' };
        var chatStatuses = { fr: 'En ligne', en: 'Online', es: 'En línea', de: 'Online' };
        var titleEl = document.getElementById('chatTitle');
        var statusEl = document.getElementById('chatStatus');
        if (titleEl) titleEl.textContent = chatTitles[lang] || chatTitles.fr;
        if (statusEl) statusEl.textContent = chatStatuses[lang] || chatStatuses.fr;

        // Vérifier si l'utilisateur a accès au mode IA
        checkAiAccess();

        if (aiMode) {
            const aiGreetings = {
                fr: 'Bonjour ! Je suis votre <strong>conseillère beauté IA</strong> personnelle. Posez-moi n\'importe quelle question sur votre peau, vos routines ou nos produits !',
                en: 'Hello! I\'m your personal <strong>AI beauty advisor</strong>. Ask me anything about your skin, routines, or our products!',
                es: '&iexcl;Hola! Soy tu <strong>asesora de belleza IA</strong> personal. &iexcl;Preg&uacute;ntame lo que quieras sobre tu piel, rutinas o productos!',
                de: 'Hallo! Ich bin Ihre pers&ouml;nliche <strong>KI-Beautyberaterin</strong>. Fragen Sie mich alles &uuml;ber Ihre Haut, Routinen oder unsere Produkte!'
            };
            addMessage(aiGreetings[lang] || aiGreetings.fr, 'bot');
            showSuggestions(['Ma routine du soir', 'J\'ai la peau sèche', 'Quel produit pour les rides ?', 'Mon diagnostic beauté']);
        } else {
            addMessage(kb.greeting, 'bot');
            showSuggestions(kb.suggestions);

            // Montrer l'upgrade prompt si connecté mais palier insuffisant
            if (window.auth && window.auth.isSignedIn() && !aiMode) {
                const profile = window.auth.getProfile();
                const eclats = (profile && profile.eclats) || 0;
                if (eclats < 200) {
                    var upgradeTexts = {
                        fr: { title: 'Passez en mode IA', text: 'Atteignez 200 \u00c9clats pour d\u00e9bloquer votre conseill\u00e8re beaut\u00e9 IA personnelle.', have: 'Vous avez' },
                        en: { title: 'Switch to AI mode', text: 'Reach 200 \u00c9clats to unlock your personal AI beauty advisor.', have: 'You have' },
                        es: { title: 'Activa el modo IA', text: 'Alcanza 200 \u00c9clats para desbloquear tu asesora de belleza IA personal.', have: 'Tienes' },
                        de: { title: 'KI-Modus aktivieren', text: 'Erreichen Sie 200 \u00c9clats, um Ihre pers\u00f6nliche KI-Beauty-Beraterin freizuschalten.', have: 'Sie haben' }
                    };
                    var ut = upgradeTexts[lang] || upgradeTexts.fr;
                    setTimeout(() => {
                        addMessage('<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:1px solid rgba(201,168,124,0.3);border-radius:10px;padding:12px;margin:-4px 0;font-size:0.82rem;">' +
                            '<strong style="color:var(--color-secondary,#c9a87c);">' + ut.title + '</strong><br>' +
                            '<span style="color:var(--color-text-light,#6b6560);">' + ut.text + ' ' +
                            ut.have + ' <strong style="color:var(--color-secondary,#c9a87c);">' + eclats + '/200</strong> \u00c9clats.</span>' +
                        '</div>', 'bot');
                    }, 1500);
                }
            }
        }

        const placeholders = {
            fr: aiMode ? 'Posez votre question beauté...' : 'Décrivez votre besoin...',
            en: aiMode ? 'Ask your beauty question...' : 'Describe your need...',
            es: aiMode ? 'Haz tu pregunta de belleza...' : 'Describe tu necesidad...',
            de: aiMode ? 'Stellen Sie Ihre Beauty-Frage...' : 'Beschreiben Sie Ihr Anliegen...'
        };
        chatInput.placeholder = placeholders[lang] || placeholders.fr;
    }

    function checkAiAccess() {
        aiMode = false;
        if (!window.auth || !window.auth.isSignedIn()) return;

        const profile = window.auth.getProfile();
        if (!profile) return;

        const eclats = profile.eclats || 0;
        if (eclats >= 200) {
            aiMode = true;
            aiTier = eclats >= 1000 ? 'Diamant' : eclats >= 500 ? 'Prestige' : 'Lumière';

            // Afficher le badge IA
            const badge = document.getElementById('chatAiBadge');
            const tierBadge = document.getElementById('chatTierBadge');
            const avatar = document.getElementById('chatAvatar');
            const status = document.getElementById('chatStatus');

            if (badge) {
                badge.style.display = 'block';
                tierBadge.innerHTML = '\u2728 Mode IA &bull; Palier ' + aiTier;
            }
            if (avatar) {
                avatar.style.background = 'linear-gradient(135deg,var(--color-secondary,#c9a87c),var(--color-accent,#e8d5b5))';
                avatar.innerHTML = '\u2728';
            }
            if (status) status.textContent = 'IA active';
        }
    }

    function sanitizeChatHtml(str) {
        // DOM-based sanitizer: parse HTML, remove dangerous elements/attributes, keep safe formatting
        var parser = new DOMParser();
        var doc = parser.parseFromString('<div>' + str + '</div>', 'text/html');
        var root = doc.body.firstChild;

        // Remove dangerous elements
        var dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'link', 'meta', 'base', 'svg', 'math'];
        dangerousTags.forEach(function(tag) {
            var els = root.querySelectorAll(tag);
            for (var i = 0; i < els.length; i++) els[i].remove();
        });

        // Remove dangerous attributes from all elements
        var allEls = root.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
            var el = allEls[i];
            var attrs = Array.from(el.attributes);
            for (var j = 0; j < attrs.length; j++) {
                var name = attrs[j].name.toLowerCase();
                // Remove event handlers and dangerous attributes
                if (name.startsWith('on') || name === 'srcdoc' || name === 'formaction') {
                    el.removeAttribute(attrs[j].name);
                }
                // Sanitize href/src — only allow https and relative
                if (name === 'href' || name === 'src') {
                    var val = (attrs[j].value || '').trim().toLowerCase();
                    if (val.startsWith('javascript:') || val.startsWith('data:') || val.startsWith('vbscript:')) {
                        el.removeAttribute(attrs[j].name);
                    }
                }
            }
            // Force external links to open safely
            if (el.tagName === 'A' && el.getAttribute('href')) {
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }
        }

        return root.innerHTML;
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg chat-${sender}`;
        if (sender === 'user') {
            msg.textContent = text; // User messages: ALWAYS textContent (anti-XSS)
        } else {
            msg.innerHTML = sanitizeChatHtml(text); // Bot messages: sanitized HTML
        }
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            chatSuggestions.innerHTML = '';
            return;
        }
        chatSuggestions.innerHTML = suggestions.map(s => {
            var tmp = document.createElement('span');
            tmp.textContent = s;
            return '<button class="chat-suggestion">' + tmp.innerHTML + '</button>';
        }).join('');
        chatSuggestions.querySelectorAll('.chat-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                chatInput.value = btn.textContent;
                sendMessage();
            });
        });
    }

    function sendMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;

        addMessage(msg, 'user');
        chatInput.value = '';
        chatSuggestions.innerHTML = '';

        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'chat-msg chat-bot chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (aiMode) {
            // ── Mode IA : appel API ──
            sendToAI(msg, typing);
        } else {
            // ── Mode basique : mots-clés ──
            setTimeout(() => {
                typing.remove();
                const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
                const result = getResponse(msg, lang);
                addMessage(result.answer, 'bot');
                showSuggestions(result.followUp);
            }, 600 + Math.random() * 400);
        }
    }

    async function sendToAI(msg, typingEl) {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';

        // Ajouter au historique
        aiHistory.push({ role: 'user', content: msg });

        try {
            const token = window.auth && window.auth._session ? window.auth._session.access_token : '';
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    message: msg,
                    lang: lang,
                    history: aiHistory.slice(-6)
                })
            });

            typingEl.remove();

            const data = await res.json();

            if (!res.ok) {
                handleAiError(data, lang);
                return;
            }

            // Réponse IA
            addMessage(data.reply, 'bot');
            aiHistory.push({ role: 'assistant', content: data.reply });

            // Afficher usage
            if (data.usage && data.usage.limit) {
                aiUsage = data.usage;
                const tierBadge = document.getElementById('chatTierBadge');
                if (tierBadge) {
                    tierBadge.innerHTML = '\u2728 ' + escapeHTML(String(data.tier)) + ' &bull; ' + parseInt(data.usage.used) + '/' + parseInt(data.usage.limit) + ' msg';
                }
            }

            // Suggestions contextuelles IA
            showSuggestions(['Recommande-moi un produit', 'Ma routine complète', 'Autre question']);

        } catch (err) {
            typingEl.remove();
            // Fallback sur mots-clés si API down
            const lang2 = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
            const result = getResponse(msg, lang2);
            addMessage(result.answer, 'bot');
            showSuggestions(result.followUp);
        }
    }

    function handleAiError(data, lang) {
        if (data.upgrade === 'login') {
            addMessage('<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:1px solid rgba(201,168,124,0.3);border-radius:10px;padding:12px;font-size:0.82rem;">' +
                '<strong style="color:var(--color-secondary,#c9a87c);">Connectez-vous</strong><br>' +
                '<span style="color:var(--color-text-light,#6b6560);">Cr\u00e9ez un compte gratuit pour acc\u00e9der \u00e0 votre conseill\u00e8re beaut\u00e9 IA.</span><br>' +
                '<a href="pages/register.html" style="color:var(--color-secondary,#c9a87c);font-weight:600;font-size:0.8rem;">Cr\u00e9er mon compte \u2192</a></div>', 'bot');
            aiMode = false;
            return;
        }
        if (data.upgrade === 'eclats') {
            addMessage('<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:1px solid rgba(201,168,124,0.3);border-radius:10px;padding:12px;font-size:0.82rem;">' +
                '<strong style="color:var(--color-secondary,#c9a87c);">D\u00e9bloquez l\'IA beauté</strong><br>' +
                '<span style="color:var(--color-text-light,#6b6560);">Encore ' + (data.needed - data.current) + ' \u00c9clats pour atteindre le palier ' + data.tierName + ' et acc\u00e9der \u00e0 l\'IA.</span></div>', 'bot');
            aiMode = false;
            return;
        }
        if (data.upgrade === 'tier') {
            addMessage('<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:1px solid rgba(201,168,124,0.3);border-radius:10px;padding:12px;font-size:0.82rem;">' +
                '<strong style="color:var(--color-secondary,#c9a87c);">Limite mensuelle atteinte</strong><br>' +
                '<span style="color:var(--color-text-light,#6b6560);">' + data.used + '/' + data.limit + ' messages utilis\u00e9s ce mois. ' +
                'Passez au palier <strong style="color:var(--color-secondary,#c9a87c);">' + (data.nextTier || 'sup\u00e9rieur') + '</strong> pour plus de messages !</span></div>', 'bot');
            aiMode = false;
            // Fallback sur mots-clés
            const result = getResponse(aiHistory[aiHistory.length - 1]?.content || '', 'fr');
            addMessage(result.answer, 'bot');
            return;
        }
        if (data.upgrade === 'purchase') {
            addMessage('<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:1px solid rgba(201,168,124,0.3);border-radius:10px;padding:12px;font-size:0.82rem;">' +
                '<strong style="color:var(--color-secondary,#c9a87c);">Budget IA atteint</strong><br>' +
                '<span style="color:var(--color-text-light,#6b6560);">Faites un achat pour d\u00e9bloquer plus de conversations IA !</span><br>' +
                '<a href="index.html" style="color:var(--color-secondary,#c9a87c);font-weight:600;font-size:0.8rem;">Voir nos produits \u2192</a></div>', 'bot');
            aiMode = false;
            return;
        }
        // Erreur générique
        addMessage('D\u00e9sol\u00e9e, une erreur est survenue. Laissez-moi vous aider autrement !', 'bot');
        const result = getResponse(aiHistory[aiHistory.length - 1]?.content || '', 'fr');
        if (result.answer) addMessage(result.answer, 'bot');
    }

    chatBubble.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Auto-open after 45 seconds
    setTimeout(() => {
        if (!isOpen && !localStorage.getItem('eclat_chat_dismissed')) {
            toggleChat();
        }
    }, 45000);
});
