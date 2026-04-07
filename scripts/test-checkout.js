// ============================
// ECLAT - Test Checkout Pipeline
// Cree une session Stripe Checkout en mode test
// Usage : node scripts/test-checkout.js
// Prerequis : STRIPE_SECRET_KEY (sk_test_...) en variable d'environnement
// ============================

const Stripe = require('stripe');

// ----------------------------
// Configuration
// ----------------------------
const SECRET_KEY = (process.env.STRIPE_SECRET_KEY || '').trim();

if (!SECRET_KEY) {
    console.error('\n[ERREUR] STRIPE_SECRET_KEY non definie.');
    console.error('Lancez avec :');
    console.error('  STRIPE_SECRET_KEY=sk_test_xxx node scripts/test-checkout.js\n');
    process.exit(1);
}

if (!SECRET_KEY.startsWith('sk_test_')) {
    console.error('\n[ERREUR] Ce script utilise UNIQUEMENT des cles de test (sk_test_...).');
    console.error('Ne JAMAIS utiliser une cle live (sk_live_...) pour les tests.\n');
    process.exit(1);
}

const stripe = new Stripe(SECRET_KEY);

// ----------------------------
// Produit de test : Masque LED Pro 7 Couleurs
// Correspond au produit id:1 dans products.js
// ----------------------------
const TEST_ITEMS = [
    {
        name: 'Masque LED Pro 7 Couleurs',
        price: 49.90,   // EUR
        qty: 1,
    },
];

// Frais de livraison domicile (Colissimo)
const SHIPPING_COST = 3.90;

// Email de test
const CUSTOMER_EMAIL = 'test-eclat@example.com';

// Adresse de livraison fictive (France)
const FAKE_SHIPPING = {
    firstName: 'Marie',
    lastName: 'Dupont',
    phone: '+33612345678',
    address: '12 Rue de la Paix',
    zipcode: '75002',
    city: 'Paris',
    country: 'FR',
};

// ----------------------------
// Creer la session Checkout
// ----------------------------
async function createTestCheckoutSession() {
    console.log('='.repeat(50));
    console.log('  ECLAT - Test Checkout Pipeline');
    console.log('='.repeat(50));
    console.log();

    // Construire les line_items exactement comme le fait api/create-checkout-session.js
    const line_items = TEST_ITEMS.map(item => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Stripe attend des centimes
        },
        quantity: item.qty,
    }));

    // Ajouter les frais de livraison comme line_item (meme logique que le serveur)
    if (SHIPPING_COST > 0) {
        line_items.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: 'Frais de livraison',
                },
                unit_amount: Math.round(SHIPPING_COST * 100),
            },
            quantity: 1,
        });
    }

    // Calculer le total attendu
    const subtotal = TEST_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = subtotal + SHIPPING_COST;

    console.log('[COMMANDE DE TEST]');
    TEST_ITEMS.forEach(item => {
        console.log(`  ${item.name}  x${item.qty}  ${item.price.toFixed(2)} EUR`);
    });
    console.log(`  Livraison (Colissimo)       ${SHIPPING_COST.toFixed(2)} EUR`);
    console.log(`  -----------------------------------------`);
    console.log(`  TOTAL                       ${total.toFixed(2)} EUR`);
    console.log();

    console.log('[CLIENT TEST]');
    console.log(`  ${FAKE_SHIPPING.firstName} ${FAKE_SHIPPING.lastName}`);
    console.log(`  ${FAKE_SHIPPING.address}`);
    console.log(`  ${FAKE_SHIPPING.zipcode} ${FAKE_SHIPPING.city}, ${FAKE_SHIPPING.country}`);
    console.log(`  Email: ${CUSTOMER_EMAIL}`);
    console.log(`  Tel:   ${FAKE_SHIPPING.phone}`);
    console.log();

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: 'https://eclat-boutique.vercel.app/pages/success.html',
            cancel_url: 'https://eclat-boutique.vercel.app/pages/checkout.html',
            locale: 'fr',
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE', 'GB'],
            },
            customer_email: CUSTOMER_EMAIL,
        });

        console.log('[SESSION CREEE]');
        console.log(`  Session ID : ${session.id}`);
        console.log(`  Status     : ${session.status}`);
        console.log(`  Expire     : ${new Date(session.expires_at * 1000).toLocaleString('fr-FR')}`);
        console.log();
        console.log('='.repeat(50));
        console.log('  OUVRIR CE LIEN POUR PAYER :');
        console.log();
        console.log(`  ${session.url}`);
        console.log();
        console.log('='.repeat(50));
        console.log();

        // ----------------------------
        // Cartes de test Stripe
        // ----------------------------
        console.log('[CARTES DE TEST STRIPE]');
        console.log('  Paiement reussi :  4242 4242 4242 4242');
        console.log('  Refus generique :  4000 0000 0000 0002');
        console.log('  Auth 3D Secure  :  4000 0025 0000 3155');
        console.log('  Fonds insuf.    :  4000 0000 0000 9995');
        console.log();
        console.log('  Date exp : n\'importe quelle date future (ex: 12/30)');
        console.log('  CVC      : n\'importe quels 3 chiffres (ex: 123)');
        console.log();

        return session;
    } catch (error) {
        console.error('[ERREUR STRIPE]');
        console.error(`  Type    : ${error.type || 'unknown'}`);
        console.error(`  Code    : ${error.code || 'unknown'}`);
        console.error(`  Message : ${error.message}`);
        process.exit(1);
    }
}

// ----------------------------
// Verifier le resultat apres paiement
// ----------------------------
async function checkSession(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer_details', 'payment_intent'],
    });

    console.log('[RESULTAT SESSION]');
    console.log(`  Status paiement : ${session.payment_status}`);
    console.log(`  Client email    : ${session.customer_details?.email || 'N/A'}`);
    console.log(`  Client nom      : ${session.customer_details?.name || 'N/A'}`);
    console.log(`  Montant total   : ${(session.amount_total / 100).toFixed(2)} EUR`);

    if (session.shipping_details) {
        console.log(`  Adresse livr.   : ${JSON.stringify(session.shipping_details.address)}`);
    }

    console.log();
    console.log('[LINE ITEMS]');
    (session.line_items?.data || []).forEach(item => {
        console.log(`  ${item.description}  x${item.quantity}  ${(item.amount_total / 100).toFixed(2)} EUR`);
    });

    return session;
}

// ----------------------------
// Lancer
// ----------------------------
(async () => {
    const session = await createTestCheckoutSession();

    // Si on veut verifier une session existante (apres paiement) :
    // Decommentez la ligne suivante et remplacez l'ID :
    // await checkSession('cs_test_xxx');

    console.log('='.repeat(50));
    console.log('  TESTER LE WEBHOOK LOCALEMENT');
    console.log('='.repeat(50));
    console.log();
    console.log('1. Installer le CLI Stripe :');
    console.log('   https://docs.stripe.com/stripe-cli');
    console.log();
    console.log('2. Se connecter :');
    console.log('   stripe login');
    console.log();
    console.log('3. Rediriger les webhooks vers votre serveur local :');
    console.log('   stripe listen --forward-to localhost:3000/api/webhook');
    console.log();
    console.log('   Le CLI affichera un webhook signing secret (whsec_...).');
    console.log('   Ajoutez-le comme variable d\'environnement :');
    console.log('   STRIPE_WEBHOOK_SECRET=whsec_xxx');
    console.log();
    console.log('4. Dans un autre terminal, lancer le serveur local :');
    console.log('   node server.js');
    console.log('   (ou : npx vercel dev)');
    console.log();
    console.log('5. Ouvrir le lien de paiement ci-dessus et payer');
    console.log('   avec la carte test 4242 4242 4242 4242.');
    console.log();
    console.log('6. Le webhook checkout.session.completed sera recu.');
    console.log('   Le pipeline executera :');
    console.log('   - extractOrder()  : extraction des details de commande');
    console.log('   - autoFulfill()   : commande CJDropshipping (ou mode manuel)');
    console.log('   - sendConfirmationEmail() : email via Resend');
    console.log();
    console.log('7. OU declencher le webhook manuellement (sans payer) :');
    console.log('   stripe trigger checkout.session.completed');
    console.log();
    console.log('8. Pour verifier une session apres paiement :');
    console.log(`   Decommentez la ligne checkSession() dans ce script`);
    console.log(`   et relancez avec l'ID de session.`);
    console.log();
})();
