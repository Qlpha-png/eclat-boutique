// ============================
// ÉCLAT - Test Pipeline Webhook (GRATUIT)
// Simule un événement checkout.session.completed signé
// et l'envoie au webhook de production pour tester le pipeline complet
// ============================

const crypto = require('crypto');
const https = require('https');

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_2bTL9cm5oYj46odWk7btMf2dJWcwK7V2';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://maison-eclat.shop/api/webhook';

// Simuler un événement checkout.session.completed
const fakeEvent = {
    id: 'evt_test_' + Date.now(),
    object: 'event',
    type: 'checkout.session.completed',
    data: {
        object: {
            id: 'cs_test_' + Date.now(),
            object: 'checkout.session',
            payment_intent: 'pi_test_' + Date.now(),
            payment_status: 'paid',
            status: 'complete',
            mode: 'payment',
            currency: 'eur',
            amount_subtotal: 4990,
            amount_total: 5380,
            locale: process.env.TEST_LANG || null,
            customer_email: 'test@maison-eclat.shop',
            customer_details: {
                email: 'test@maison-eclat.shop',
                name: process.env.TEST_NAME || 'Client Test (TEST)',
                phone: '+33600000000',
                address: {
                    line1: process.env.TEST_ADDR || '12 Rue de Test',
                    line2: '',
                    city: process.env.TEST_CITY || 'Paris',
                    state: process.env.TEST_STATE || '',
                    postal_code: process.env.TEST_ZIP || '75001',
                    country: process.env.TEST_COUNTRY || 'FR'
                }
            },
            shipping_details: {
                name: process.env.TEST_NAME || 'Client Test (TEST)',
                address: {
                    line1: process.env.TEST_ADDR || '12 Rue de Test',
                    line2: '',
                    city: process.env.TEST_CITY || 'Paris',
                    state: process.env.TEST_STATE || '',
                    postal_code: process.env.TEST_ZIP || '75001',
                    country: process.env.TEST_COUNTRY || 'FR'
                }
            },
            line_items: {
                data: [
                    {
                        description: 'Masque LED Pro 7 Couleurs',
                        quantity: 1,
                        amount_total: 4990,
                        price: { unit_amount: 4990 }
                    },
                    {
                        description: 'Frais de livraison',
                        quantity: 1,
                        amount_total: 390,
                        price: { unit_amount: 390 }
                    }
                ]
            }
        }
    }
};

// Signer l'événement comme Stripe le ferait
const payload = JSON.stringify(fakeEvent);
const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = `${timestamp}.${payload}`;
const signature = crypto.createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');
const stripeSignature = `t=${timestamp},v1=${signature}`;

console.log('='.repeat(55));
console.log('  ÉCLAT - Test Pipeline Webhook');
console.log('='.repeat(55));
console.log();
console.log('[EVENT]', fakeEvent.type);
console.log('[SESSION]', fakeEvent.data.object.id);
console.log('[CLIENT]', fakeEvent.data.object.customer_details.name);
console.log('[EMAIL]', fakeEvent.data.object.customer_email);
console.log('[TOTAL]', (fakeEvent.data.object.amount_total / 100).toFixed(2), 'EUR');
console.log('[PRODUIT] Masque LED Pro 7 Couleurs x1');
console.log();

// Envoyer au webhook
const url = new URL(WEBHOOK_URL);
const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
        'Content-Length': Buffer.byteLength(payload)
    }
};

console.log(`[ENVOI] POST ${WEBHOOK_URL}`);
console.log(`[SIGNATURE] ${stripeSignature.substring(0, 50)}...`);
console.log();

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`[REPONSE] Status: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));

            if (json.received && json.results) {
                console.log();
                console.log('='.repeat(55));
                if (json.results.order) {
                    console.log(`  COMMANDE: ${json.results.order.id}`);
                    console.log(`  CLIENT: ${json.results.order.customer?.name}`);
                    console.log(`  TOTAL: ${json.results.order.total} EUR`);
                }
                if (json.results.fulfillment) {
                    console.log(`  CJ MODE: ${json.results.fulfillment.mode}`);
                    if (json.results.fulfillment.margin) {
                        console.log(`  MARGE: ${json.results.fulfillment.margin.toFixed(2)} EUR (${json.results.fulfillment.marginPct}%)`);
                    }
                    if (json.results.fulfillment.cjOrderId) {
                        console.log(`  CJ ORDER ID: ${json.results.fulfillment.cjOrderId}`);
                    }
                }
                if (json.results.email) {
                    console.log(`  EMAIL: ${json.results.email.success ? 'ENVOYÉ' : 'ÉCHOUÉ - ' + (json.results.email.reason || json.results.email.error)}`);
                }
                if (json.results.error) {
                    console.log(`  ERREUR: ${json.results.error}`);
                }
                console.log('='.repeat(55));
            }
        } catch (e) {
            console.log('Raw:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`[ERREUR] ${e.message}`);
});

req.write(payload);
req.end();
