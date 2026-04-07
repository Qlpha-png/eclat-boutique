// ============================
// ÉCLAT - Assistant IA Beauté
// Chatbot intelligent multilingue intégré
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // Base de connaissances multilingue
    const KB = {
        fr: {
            greeting: 'Bonjour ! Je suis votre assistante beauté ÉCLAT. Comment puis-je vous aider ?',
            suggestions: ['Quelle routine pour moi ?', 'Infos livraison', 'Comment retourner un produit ?', 'Quel est votre best-seller ?'],
            responses: {
                routine: { match: ['routine', 'diagnostic', 'peau', 'conseil', 'recommand', 'quel produit'], answer: 'Je vous recommande de faire notre <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Diagnostic Beauté gratuit</a> ! En 4 questions, je vous crée une routine personnalisée selon votre type de peau et vos besoins.' },
                shipping: { match: ['livraison', 'délai', 'expédi', 'combien de temps', 'shipping', 'envoi', 'colis'], answer: 'Nous livrons dans toute l\'Europe :<br>• <strong>Standard</strong> : 7-14 jours ouvrés, gratuit dès 49€<br>• <strong>Express</strong> : 5-10 jours ouvrés, 7,90€<br>Suivi de commande inclus !' },
                returns: { match: ['retour', 'rembours', 'échange', 'renvoy', 'satisfait'], answer: 'Vous avez <strong>30 jours</strong> pour retourner vos produits (double du minimum légal). Les retours sont <strong>gratuits</strong> — nous vous envoyons une étiquette prépayée. Remboursement sous 5 jours.' },
                bestseller: { match: ['best-seller', 'best seller', 'populaire', 'meilleur', 'top', 'recommand'], answer: 'Nos 3 best-sellers :<br>1. <strong>Masque LED Pro</strong> (49,90€) — 7 couleurs thérapeutiques<br>2. <strong>Gua Sha Quartz Rose</strong> (14,90€) — quartz véritable<br>3. <strong>Sérum Vitamine C 20%</strong> (19,90€) — résultats en 21 jours' },
                payment: { match: ['paiement', 'payer', 'carte', 'paypal', 'stripe', 'sécur'], answer: 'Paiement 100% sécurisé via Stripe :<br>• Carte bancaire (Visa, Mastercard, CB)<br>• PayPal<br>Vos données bancaires ne sont jamais stockées sur nos serveurs.' },
                brands: { match: ['marque', 'cerave', 'ordinary', 'garnier', 'bioderma', 'nuxe', 'cosrx', 'laneige'], answer: 'Nous proposons 16 grandes marques : CeraVe, The Ordinary, La Roche-Posay, Bioderma, Garnier, Nuxe, COSRX, Laneige, Avène, Vichy, Eucerin, SVR, Embryolisse, Erborian, BIODANCE, Beauty of Joseon. Toutes en croissance, aucune en déclin !' },
                loyalty: { match: ['fidélit', 'point', 'récompens', 'parrain'], answer: 'Nous récompensons nos clientes fidèles avec des <strong>codes promo exclusifs</strong> envoyés par email après chaque achat ! Inscrivez-vous à notre <strong>newsletter</strong> pour recevoir un code -10% sur votre première commande (BIENVENUE10).' },
                acne: { match: ['acné', 'bouton', 'imperfection', 'point noir', 'pore'], answer: 'Pour l\'acné, je recommande :<br>1. <strong>CeraVe Gel Moussant</strong> (11,90€) — nettoyage doux<br>2. <strong>The Ordinary Niacinamide 10%</strong> (9,90€) — réduit les pores<br>3. <strong>Garnier Patchs Anti-Boutons</strong> (8,90€) — traitement ciblé<br>Total : 30,70€ pour une routine complète !' },
                wrinkles: { match: ['ride', 'anti-âge', 'vieillir', 'fermet', 'collagène'], answer: 'Pour l\'anti-âge, je recommande :<br>1. <strong>Sérum Vitamine C 20%</strong> (27,90€) — boost collagène<br>2. <strong>Masque LED Pro</strong> (44,90€) — lumière rouge anti-âge<br>3. <strong>Stickers Anti-Rides Nuit</strong> (17,90€) — lisse pendant le sommeil<br>Ou faites notre <a href="pages/diagnostic.html" style="color:var(--color-secondary);">diagnostic gratuit</a> !' },
                contact: { match: ['contact', 'email', 'téléphone', 'joindre', 'aide'], answer: 'Vous pouvez nous contacter :<br>• Email : contact@maison-eclat.shop (réponse sous 24h)<br>• Instagram : @eclat.beaute<br>Nous répondons 7j/7 !' },
                price: { match: ['prix', 'cher', 'coût', 'budget', 'pas cher', 'abordable'], answer: 'Nos prix vont de <strong>7,90€</strong> (Garnier Eau Micellaire) à <strong>44,90€</strong> (Masque LED Pro). Livraison gratuite dès 49€. On a des produits pour tous les budgets !' },
                order: { match: ['commande', 'commander', 'comment acheter', 'acheter'], answer: 'C\'est simple ! Ajoutez vos produits au panier, cliquez sur <strong>Commander</strong>, puis réglez en toute sécurité via Stripe. Pas besoin de créer un compte !<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">Voir la FAQ complète</a>' },
                cancel: { match: ['annuler', 'modifier', 'annulation', 'changer ma commande'], answer: 'Contactez-nous dans les <strong>2 heures</strong> suivant votre achat à <strong>contact@maison-eclat.shop</strong> et nous ferons le maximum pour modifier ou annuler votre commande.' },
                tracking: { match: ['suivi', 'suivre', 'où est mon colis', 'numéro de suivi', 'tracking'], answer: 'Vous recevrez un <strong>email avec votre numéro de suivi</strong> dès l\'expédition de votre colis (sous 1-3 jours ouvrés). Si vous ne l\'avez pas reçu sous 3 jours, vérifiez vos spams ou contactez-nous.' },
                promo: { match: ['code promo', 'réduction', 'coupon', 'promotion', 'remise', 'bienvenue'], answer: 'Inscrivez-vous à notre <strong>newsletter</strong> en bas de page pour recevoir votre code <strong>BIENVENUE10</strong> (-10% sur votre 1ère commande). Le code s\'applique directement sur la page de paiement Stripe !' },
                guarantee: { match: ['garantie', 'défectueux', 'cassé', 'abîmé', 'endommagé', 'qualité'], answer: 'Tous nos appareils électroniques ont une <strong>garantie légale de 2 ans</strong>. Produit endommagé à la réception ? Envoyez-nous une photo à contact@maison-eclat.shop, nous envoyons un remplacement ou un remboursement <strong>sans frais de retour</strong>.' },
                customs: { match: ['douane', 'taxe', 'frais supplémentaire', 'hors france'], answer: 'Pas de frais de douane au sein de l\'<strong>Union européenne</strong>. Pour la Suisse, des frais de dédouanement peuvent s\'appliquer selon la réglementation locale.<br><a href="pages/faq.html" style="color:var(--color-secondary);">Plus d\'infos dans la FAQ</a>' },
                led: { match: ['masque led', 'led', 'lumière', 'luminothérapie', 'couleur'], answer: '<strong>Mode d\'emploi du Masque LED :</strong><br>1. Nettoyez votre visage + sérum<br>2. Choisissez votre couleur :<br>• <strong>Rouge</strong> : anti-âge, collagène<br>• <strong>Bleu</strong> : anti-acné<br>• <strong>Vert</strong> : teint uniforme<br>3. Séance de 15 min, 3-4x/semaine<br>Résultats visibles dès <strong>14 jours</strong> !' },
                guasha: { match: ['gua sha', 'jade roller', 'rouleau', 'quartz', 'massage visage'], answer: '<strong>Comment utiliser le Gua Sha :</strong><br>1. Appliquez une huile ou un sérum<br>2. Mouvements de l\'intérieur vers l\'extérieur, toujours <strong>vers le haut</strong><br>3. Commencez par le cou → menton → joues → front<br><strong>5 minutes/jour</strong> suffisent pour le drainage lymphatique !' },
                vitaminc: { match: ['vitamine c', 'sérum vitamine', 'éclat du teint', 'taches'], answer: 'Notre <strong>Sérum Vitamine C 20%</strong> (27,90€) utilise une forme stabilisée bien tolérée. Conseil : faites un test sur le poignet 24h avant. Appliquez le matin avant votre crème pour un teint lumineux. Résultats visibles en <strong>21 jours</strong> !' },
                cruelty: { match: ['cruelty', 'animaux', 'vegan', 'test animal', 'éthique'], answer: '<strong>Aucun test sur les animaux</strong>, jamais. Tous nos produits et fournisseurs respectent une politique stricte cruelty-free, à chaque étape de la fabrication.' },
                fallback: 'Je ne suis pas sûre de comprendre. Voici comment je peux vous aider :<br>• <strong>Produits</strong> : routine, best-sellers, par problème de peau<br>• <strong>Commande</strong> : livraison, suivi, retours, codes promo<br>• <strong>Conseils</strong> : masque LED, gua sha, vitamine C<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">Consulter la FAQ complète</a> | <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Diagnostic gratuit</a>'
            }
        },
        en: {
            greeting: 'Hello! I\'m your ÉCLAT beauty assistant. How can I help you?',
            suggestions: ['What routine for me?', 'Shipping info', 'How to return?', 'Your best-seller?'],
            responses: {
                routine: { match: ['routine', 'diagnostic', 'skin', 'advice', 'recommend', 'which product'], answer: 'I recommend taking our <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Free Beauty Diagnostic</a>! In 4 questions, I\'ll create a personalized routine for your skin type.' },
                shipping: { match: ['shipping', 'delivery', 'how long', 'ship', 'send'], answer: 'We ship across Europe:<br>• <strong>Standard</strong>: 7-14 business days, free from 49€<br>• <strong>Express</strong>: 5-10 business days, 7.90€<br>Order tracking included!' },
                returns: { match: ['return', 'refund', 'exchange', 'send back'], answer: 'You have <strong>30 days</strong> to return products (double the legal minimum). Returns are <strong>free</strong> — we send a prepaid label. Refund within 5 business days.' },
                bestseller: { match: ['best-seller', 'popular', 'best', 'top', 'recommend'], answer: 'Our top 3 best-sellers:<br>1. <strong>LED Mask Pro</strong> (49.90€) — 7 therapeutic colours<br>2. <strong>Rose Quartz Gua Sha</strong> (14.90€) — genuine quartz<br>3. <strong>Vitamin C Serum 20%</strong> (19.90€) — results in 21 days' },
                payment: { match: ['payment', 'pay', 'card', 'paypal', 'secure'], answer: '100% secure payment via Stripe:<br>• Credit card (Visa, Mastercard)<br>• PayPal<br>Your bank data is never stored on our servers.' },
                brands: { match: ['brand', 'cerave', 'ordinary', 'garnier', 'bioderma', 'nuxe', 'cosrx', 'laneige'], answer: 'We carry 16 top brands: CeraVe, The Ordinary, La Roche-Posay, Bioderma, Garnier, Nuxe, COSRX, Laneige, Avène, Vichy, Eucerin, SVR, Embryolisse, Erborian, BIODANCE, Beauty of Joseon.' },
                loyalty: { match: ['loyalty', 'points', 'reward', 'referral'], answer: 'We reward our loyal customers with <strong>exclusive promo codes</strong> sent by email after each purchase! Subscribe to our <strong>newsletter</strong> to get a -10% code on your first order (BIENVENUE10).' },
                acne: { match: ['acne', 'breakout', 'pimple', 'blackhead', 'pore'], answer: 'For acne, I recommend:<br>1. <strong>CeraVe Foaming Cleanser</strong> (11.90€) — gentle cleansing<br>2. <strong>The Ordinary Niacinamide 10%</strong> (9.90€) — pore control<br>3. <strong>Garnier Anti-Blemish Patches</strong> (8.90€) — targeted treatment<br>Total: 30.70€ for a complete routine!' },
                wrinkles: { match: ['wrinkle', 'anti-aging', 'aging', 'firm', 'collagen'], answer: 'For anti-aging, I recommend:<br>1. <strong>Vitamin C Serum 20%</strong> (27.90€) — collagen boost<br>2. <strong>LED Mask Pro</strong> (44.90€) — red light therapy<br>3. <strong>Night Anti-Wrinkle Stickers</strong> (17.90€) — smooths while you sleep<br>Or take our <a href="pages/diagnostic.html" style="color:var(--color-secondary);">free diagnostic</a>!' },
                contact: { match: ['contact', 'email', 'phone', 'reach', 'help'], answer: 'You can reach us:<br>• Email: contact@maison-eclat.shop (reply within 24h)<br>• Instagram: @eclat.beaute<br>We respond 7 days a week!' },
                price: { match: ['price', 'cost', 'expensive', 'cheap', 'budget', 'affordable'], answer: 'Our prices range from <strong>7.90€</strong> (Garnier Micellar Water) to <strong>44.90€</strong> (LED Mask Pro). Free shipping from 49€. We have products for every budget!' },
                order: { match: ['order', 'how to buy', 'purchase', 'checkout'], answer: 'Simply add products to your cart, click <strong>Order</strong>, then pay securely via Stripe. No account needed!<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">See full FAQ</a>' },
                cancel: { match: ['cancel', 'modify', 'change order'], answer: 'Contact us within <strong>2 hours</strong> of your purchase at <strong>contact@maison-eclat.shop</strong> and we\'ll do our best to modify or cancel your order.' },
                tracking: { match: ['track', 'where is my', 'tracking number', 'parcel'], answer: 'You\'ll receive a <strong>tracking email</strong> once your package ships (within 1-3 business days). If you haven\'t received it after 3 days, check your spam folder or contact us.' },
                promo: { match: ['promo code', 'discount', 'coupon', 'promotion', 'welcome'], answer: 'Subscribe to our <strong>newsletter</strong> at the bottom of the page to get your <strong>BIENVENUE10</strong> code (-10% on your first order). Enter it at Stripe checkout!' },
                guarantee: { match: ['warranty', 'defective', 'broken', 'damaged', 'quality'], answer: 'All electronic devices come with a <strong>2-year legal warranty</strong>. Received a damaged product? Send us a photo at contact@maison-eclat.shop — we\'ll replace or refund <strong>at no extra cost</strong>.' },
                led: { match: ['led mask', 'led', 'light therapy', 'color'], answer: '<strong>LED Mask instructions:</strong><br>1. Cleanse face + apply serum<br>2. Choose your color: Red (anti-aging), Blue (anti-acne), Green (even tone)<br>3. 15 min session, 3-4x/week<br>Visible results in <strong>14 days</strong>!' },
                guasha: { match: ['gua sha', 'jade roller', 'face massage', 'quartz'], answer: '<strong>How to use the Gua Sha:</strong><br>1. Apply oil or serum<br>2. Stroke from center outward, always <strong>upward</strong><br>3. Start at neck → chin → cheeks → forehead<br><strong>5 minutes/day</strong> is all you need!' },
                fallback: 'I\'m not sure I understand. Here\'s how I can help:<br>• <strong>Products</strong>: routine, best-sellers, skin concerns<br>• <strong>Orders</strong>: shipping, tracking, returns, promo codes<br>• <strong>Tips</strong>: LED mask, gua sha, vitamin C<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">Full FAQ</a> | <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Free diagnostic</a>'
            }
        },
        es: {
            greeting: 'Hola! Soy tu asistente de belleza ÉCLAT. ¿Cómo puedo ayudarte?',
            suggestions: ['¿Qué rutina para mí?', 'Info de envío', '¿Cómo devolver?', '¿Tu más vendido?'],
            responses: {
                routine: { match: ['rutina', 'diagnóstico', 'piel', 'consejo', 'recomendar'], answer: 'Te recomiendo hacer nuestro <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Diagnóstico de Belleza gratuito</a>. En 4 preguntas te creo una rutina personalizada.' },
                shipping: { match: ['envío', 'entrega', 'cuánto tarda', 'enviar'], answer: 'Enviamos a toda Europa:<br>• <strong>Estándar</strong>: 7-14 días laborables, gratis desde 49€<br>• <strong>Express</strong>: 5-10 días laborables, 7,90€<br>Seguimiento incluido!' },
                returns: { match: ['devolución', 'reembolso', 'devolver'], answer: 'Tienes <strong>30 días</strong> para devolver los productos. Las devoluciones son <strong>gratuitas</strong>. Reembolso en 5 días hábiles.' },
                bestseller: { match: ['más vendido', 'popular', 'mejor', 'top', 'recomendar'], answer: 'Nuestros 3 más vendidos:<br>1. <strong>Mascarilla LED Pro</strong> (49,90€) — 7 colores terapéuticos<br>2. <strong>Gua Sha Cuarzo Rosa</strong> (14,90€) — cuarzo genuino<br>3. <strong>Sérum Vitamina C 20%</strong> (19,90€) — resultados en 21 días' },
                payment: { match: ['pago', 'pagar', 'tarjeta', 'paypal', 'seguro'], answer: 'Pago 100% seguro vía Stripe:<br>• Tarjeta (Visa, Mastercard)<br>• PayPal<br>Tus datos bancarios nunca se almacenan en nuestros servidores.' },
                brands: { match: ['marca', 'cerave', 'ordinary', 'garnier', 'bioderma', 'nuxe', 'cosrx', 'laneige'], answer: 'Ofrecemos 16 marcas top: CeraVe, The Ordinary, La Roche-Posay, Bioderma, Garnier, Nuxe, COSRX, Laneige, Avène, Vichy, Eucerin, SVR, Embryolisse, Erborian, BIODANCE, Beauty of Joseon.' },
                loyalty: { match: ['fidelidad', 'puntos', 'recompensa', 'referido'], answer: 'Recompensamos a nuestras clientas fieles con <strong>códigos promo exclusivos</strong> enviados por email después de cada compra. ¡Suscríbete a nuestro <strong>newsletter</strong> para recibir un código -10% en tu primer pedido (BIENVENUE10)!' },
                acne: { match: ['acné', 'grano', 'imperfección', 'punto negro', 'poro'], answer: 'Para el acné, recomiendo:<br>1. <strong>CeraVe Gel Limpiador</strong> (11,90€)<br>2. <strong>The Ordinary Niacinamide 10%</strong> (9,90€)<br>3. <strong>Garnier Parches Anti-Granos</strong> (8,90€)<br>¡Total: 30,70€ para una rutina completa!' },
                wrinkles: { match: ['arruga', 'anti-edad', 'envejecimiento', 'firmeza', 'colágeno'], answer: 'Para anti-edad, recomiendo:<br>1. <strong>Sérum Vitamina C 20%</strong> (27,90€)<br>2. <strong>Mascarilla LED Pro</strong> (44,90€)<br>3. <strong>Stickers Nocturnos Anti-Arrugas</strong> (17,90€)<br>O haz nuestro <a href="pages/diagnostic.html" style="color:var(--color-secondary);">diagnóstico gratuito</a>!' },
                contact: { match: ['contacto', 'email', 'teléfono', 'ayuda'], answer: 'Puedes contactarnos:<br>• Email: contact@maison-eclat.shop (respuesta en 24h)<br>• Instagram: @eclat.beaute<br>¡Respondemos los 7 días de la semana!' },
                price: { match: ['precio', 'caro', 'barato', 'presupuesto', 'coste'], answer: 'Nuestros precios van desde <strong>7,90€</strong> (Garnier Agua Micelar) hasta <strong>44,90€</strong> (Mascarilla LED Pro). Envío gratis desde 49€. ¡Tenemos productos para todos los presupuestos!' },
                order: { match: ['pedido', 'cómo comprar', 'comprar'], answer: '¡Es fácil! Añade productos al carrito, haz clic en <strong>Pedir</strong> y paga de forma segura con Stripe. ¡No necesitas crear una cuenta!' },
                promo: { match: ['código', 'descuento', 'cupón', 'promoción', 'bienvenida'], answer: 'Suscríbete a nuestro <strong>newsletter</strong> para recibir tu código <strong>BIENVENUE10</strong> (-10% en tu primer pedido). ¡Introdúcelo en el checkout de Stripe!' },
                tracking: { match: ['seguimiento', 'dónde está mi', 'rastreo'], answer: 'Recibirás un <strong>email con tu número de seguimiento</strong> cuando tu paquete sea enviado (1-3 días laborables). Si no lo recibes en 3 días, revisa tu carpeta de spam.' },
                guarantee: { match: ['garantía', 'defectuoso', 'roto', 'dañado'], answer: 'Todos nuestros dispositivos electrónicos tienen <strong>2 años de garantía legal</strong>. ¿Producto dañado? Envíanos una foto a contact@maison-eclat.shop — reemplazamos o reembolsamos <strong>sin costes adicionales</strong>.' },
                led: { match: ['mascarilla led', 'led', 'luz', 'fototerapia'], answer: '<strong>Instrucciones Mascarilla LED:</strong><br>1. Limpia el rostro + sérum<br>2. Elige tu color: Rojo (anti-edad), Azul (anti-acné), Verde (tono uniforme)<br>3. 15 min, 3-4x/semana<br>¡Resultados visibles en <strong>14 días</strong>!' },
                fallback: 'No estoy segura de entender. Puedo ayudarte con:<br>• <strong>Productos</strong>: rutina, más vendidos, problemas de piel<br>• <strong>Pedidos</strong>: envío, seguimiento, devoluciones, códigos promo<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">FAQ completa</a> | <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Diagnóstico gratis</a>'
            }
        },
        de: {
            greeting: 'Hallo! Ich bin Ihre ÉCLAT Beauty-Assistentin. Wie kann ich Ihnen helfen?',
            suggestions: ['Welche Routine für mich?', 'Versandinfos', 'Wie kann ich zurückgeben?', 'Ihr Bestseller?'],
            responses: {
                routine: { match: ['routine', 'haut', 'empfehlung', 'welches produkt'], answer: 'Machen Sie unsere <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Kostenlose Hautdiagnose</a>! In 4 Fragen erstelle ich Ihre persönliche Routine.' },
                shipping: { match: ['versand', 'lieferung', 'wie lange', 'senden'], answer: 'Wir liefern in ganz Europa:<br>• <strong>Standard</strong>: 7-14 Werktage, ab 49€ kostenlos<br>• <strong>Express</strong>: 5-10 Werktage, 7,90€<br>Sendungsverfolgung inklusive!' },
                returns: { match: ['rückgabe', 'erstattung', 'zurückgeben'], answer: 'Sie haben <strong>30 Tage</strong> Rückgaberecht. Rücksendungen sind <strong>kostenlos</strong>. Erstattung innerhalb von 5 Werktagen.' },
                bestseller: { match: ['bestseller', 'beliebt', 'beste', 'top', 'empfehlung'], answer: 'Unsere Top 3 Bestseller:<br>1. <strong>LED-Maske Pro</strong> (49,90€) — 7 therapeutische Farben<br>2. <strong>Rosenquarz Gua Sha</strong> (14,90€) — echter Quarz<br>3. <strong>Vitamin C Serum 20%</strong> (19,90€) — Ergebnisse in 21 Tagen' },
                payment: { match: ['zahlung', 'bezahlen', 'karte', 'paypal', 'sicher'], answer: '100% sichere Zahlung über Stripe:<br>• Kreditkarte (Visa, Mastercard)<br>• PayPal<br>Ihre Bankdaten werden niemals auf unseren Servern gespeichert.' },
                brands: { match: ['marke', 'cerave', 'ordinary', 'garnier', 'bioderma', 'nuxe', 'cosrx', 'laneige'], answer: 'Wir führen 16 Top-Marken: CeraVe, The Ordinary, La Roche-Posay, Bioderma, Garnier, Nuxe, COSRX, Laneige, Avène, Vichy, Eucerin, SVR, Embryolisse, Erborian, BIODANCE, Beauty of Joseon.' },
                loyalty: { match: ['treue', 'punkte', 'belohnung', 'empfehlen'], answer: 'Wir belohnen unsere treuen Kundinnen mit <strong>exklusiven Promo-Codes</strong> per E-Mail nach jedem Kauf! Abonnieren Sie unseren <strong>Newsletter</strong> für einen -10% Code auf Ihre erste Bestellung (BIENVENUE10).' },
                acne: { match: ['akne', 'pickel', 'unreinheit', 'mitesser', 'pore'], answer: 'Gegen Akne empfehle ich:<br>1. <strong>CeraVe Schäumendes Reinigungsgel</strong> (11,90€)<br>2. <strong>The Ordinary Niacinamide 10%</strong> (9,90€)<br>3. <strong>Garnier Anti-Pickel-Patches</strong> (8,90€)<br>Gesamt: 30,70€ für eine komplette Routine!' },
                wrinkles: { match: ['falten', 'anti-aging', 'altern', 'straffung', 'kollagen'], answer: 'Gegen Falten empfehle ich:<br>1. <strong>Vitamin C Serum 20%</strong> (27,90€) — Kollagen-Boost<br>2. <strong>LED-Maske Pro</strong> (44,90€) — Rotlichttherapie<br>3. <strong>Nacht-Anti-Falten-Sticker</strong> (17,90€)<br>Oder machen Sie unsere <a href="pages/diagnostic.html" style="color:var(--color-secondary);">kostenlose Diagnose</a>!' },
                contact: { match: ['kontakt', 'email', 'telefon', 'erreichen', 'hilfe'], answer: 'Sie können uns erreichen:<br>• E-Mail: contact@maison-eclat.shop (Antwort innerhalb 24h)<br>• Instagram: @eclat.beaute<br>Wir antworten 7 Tage die Woche!' },
                price: { match: ['preis', 'teuer', 'günstig', 'kosten', 'budget'], answer: 'Unsere Preise reichen von <strong>7,90€</strong> (Garnier Mizellenwasser) bis <strong>44,90€</strong> (LED-Maske Pro). Kostenloser Versand ab 49€. Wir haben Produkte für jedes Budget!' },
                order: { match: ['bestellen', 'wie kaufen', 'einkaufen', 'bestellung'], answer: 'Ganz einfach! Produkte in den Warenkorb, auf <strong>Bestellen</strong> klicken und sicher über Stripe bezahlen. Kein Konto nötig!' },
                promo: { match: ['gutschein', 'rabatt', 'code', 'aktion', 'willkommen'], answer: 'Abonnieren Sie unseren <strong>Newsletter</strong> und erhalten Sie Ihren Code <strong>BIENVENUE10</strong> (-10% auf Ihre erste Bestellung). Geben Sie ihn beim Stripe-Checkout ein!' },
                tracking: { match: ['sendungsverfolgung', 'wo ist mein', 'tracking'], answer: 'Sie erhalten eine <strong>Tracking-E-Mail</strong> sobald Ihr Paket versendet wird (1-3 Werktage). Prüfen Sie Ihren Spam-Ordner, falls Sie nach 3 Tagen nichts erhalten.' },
                guarantee: { match: ['garantie', 'defekt', 'kaputt', 'beschädigt'], answer: 'Alle elektronischen Geräte haben eine <strong>2-jährige gesetzliche Garantie</strong>. Beschädigtes Produkt? Senden Sie ein Foto an contact@maison-eclat.shop — wir ersetzen oder erstatten <strong>ohne Zusatzkosten</strong>.' },
                led: { match: ['led-maske', 'led', 'lichttherapie', 'farbe'], answer: '<strong>LED-Maske Anleitung:</strong><br>1. Gesicht reinigen + Serum<br>2. Farbe wählen: Rot (Anti-Aging), Blau (Anti-Akne), Grün (gleichmäßiger Teint)<br>3. 15 Min, 3-4x/Woche<br>Sichtbare Ergebnisse in <strong>14 Tagen</strong>!' },
                fallback: 'Ich bin nicht sicher, ob ich verstehe. So kann ich helfen:<br>• <strong>Produkte</strong>: Routine, Bestseller, Hautprobleme<br>• <strong>Bestellung</strong>: Versand, Tracking, Rückgaben, Promo-Codes<br><a href="pages/faq.html" style="color:var(--color-secondary);font-weight:600;">Komplette FAQ</a> | <a href="pages/diagnostic.html" style="color:var(--color-secondary);font-weight:600;">Kostenlose Diagnose</a>'
            }
        }
    };

    function getResponse(message, lang) {
        const kb = KB[lang] || KB.fr;
        const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        for (const [key, data] of Object.entries(kb.responses)) {
            if (key === 'fallback') continue;
            if (data.match && data.match.some(word => msg.includes(word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
                return data.answer;
            }
        }

        // Check FR responses as fallback for all languages
        if (lang !== 'fr') {
            for (const [key, data] of Object.entries(KB.fr.responses)) {
                if (key === 'fallback') continue;
                if (data.match && data.match.some(word => msg.includes(word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
                    return data.answer;
                }
            }
        }

        return kb.responses.fallback;
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
                    <div class="chat-avatar">E</div>
                    <div>
                        <strong>Assistante ÉCLAT</strong>
                        <span class="chat-status">En ligne</span>
                    </div>
                </div>
                <button class="chat-close" id="chatClose">&times;</button>
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
        addMessage(kb.greeting, 'bot');
        showSuggestions(kb.suggestions);

        // Update placeholder
        const placeholders = { fr: 'Posez votre question...', en: 'Ask your question...', es: 'Haz tu pregunta...', de: 'Stellen Sie Ihre Frage...' };
        chatInput.placeholder = placeholders[lang] || placeholders.fr;
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg chat-${sender}`;
        msg.innerHTML = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showSuggestions(suggestions) {
        chatSuggestions.innerHTML = suggestions.map(s =>
            `<button class="chat-suggestion" onclick="document.getElementById('chatInput').value='${s}';document.getElementById('chatSend').click();">${s}</button>`
        ).join('');
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

        setTimeout(() => {
            typing.remove();
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
            const response = getResponse(msg, lang);
            addMessage(response, 'bot');
        }, 800 + Math.random() * 600);
    }

    chatBubble.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Auto-open after 60 seconds if not interacted
    setTimeout(() => {
        if (!isOpen && !localStorage.getItem('eclat_chat_dismissed')) {
            toggleChat();
        }
    }, 60000);
});
