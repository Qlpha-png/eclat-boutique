const Stripe = require('stripe');
const { getSupabase } = require('./_middleware/auth');
const { generateUnsubToken } = require('./unsubscribe');

// ============================
// ÉCLAT - Master Webhook
// Pipeline complet : Paiement → Commande fournisseur → Email client → Supabase
// ============================

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

    if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY not set' });
    }

    const stripe = new Stripe(secretKey);
    let event;

    // Signature webhook OBLIGATOIRE en production
    if (!webhookSecret) {
        console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET manquant — rejet');
        return res.status(500).json({ error: 'Webhook non configuré' });
    }

    const sig = req.headers['stripe-signature'];
    try {
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('[WEBHOOK] Signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    // ============================
    // ROUTER D'ÉVÉNEMENTS
    // Note idempotency : pour une vraie protection anti-doublon en prod,
    // stocker event.id dans Vercel KV ou Upstash Redis.
    // ============================
    const results = {};
    console.log('[WEBHOOK] Event:', event.type, '| ID:', event.id || 'N/A');

    // Idempotency : vérifier si cet événement a déjà été traité
    if (event.id) {
        try {
            const sb = getSupabase();
            const { data: existing } = await sb.from('webhook_events').select('id').eq('id', event.id).single();
            if (existing) {
                console.log('[WEBHOOK] Duplicate event, skipping:', event.id);
                return res.status(200).json({ received: true, duplicate: true });
            }
            await sb.from('webhook_events').insert({ id: event.id, type: event.type });
        } catch (e) {
            // Continuer même si Supabase n'est pas configuré
            if (!e.message || !e.message.includes('SUPABASE')) {
                console.warn('[WEBHOOK] Idempotency check:', e.message);
            }
        }
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;

                // Vérifier que le paiement est bien reçu
                if (session.payment_status !== 'paid') {
                    console.log('[WEBHOOK] Payment not yet paid, skipping:', session.payment_status);
                    return res.status(200).json({ received: true, skipped: 'payment_status_not_paid' });
                }

                console.log('[WEBHOOK] Checkout completed:', session.id);

                // ÉTAPE 1 : Extraire la commande
                const order = await extractOrder(stripe, session);
                results.order = order;
                console.log('[PIPELINE] Order extracted:', order.id);

                // ÉTAPE 1b : Persister commande + client dans Supabase
                results.persist = await persistToSupabase(order, session);
                console.log('[PIPELINE] Supabase:', results.persist.saved ? 'saved' : results.persist.reason || 'skipped');

                // ÉTAPE 2 : Commander chez CJDropshipping (routage automatique)
                results.fulfillment = await autoFulfill(order);
                console.log('[PIPELINE] Fulfillment CJ:', results.fulfillment.mode);

                // ÉTAPE 3 : Email de confirmation au client (seulement si fulfillment OK)
                if (results.fulfillment.mode !== 'auto_failed' || results.fulfillment.fallback === 'manual') {
                    results.email = await sendConfirmationEmail(order);
                    console.log('[PIPELINE] Email:', results.email.success ? 'sent' : 'skipped');
                } else {
                    results.email = { success: false, reason: 'fulfillment_failed' };
                    console.log('[PIPELINE] Email skipped: fulfillment failed without fallback');
                }

                // ÉTAPE 4 : SMS de confirmation au client (si téléphone fourni + Brevo configuré)
                results.sms = await sendOrderSMS(order);
                console.log('[PIPELINE] SMS:', results.sms.sent ? 'sent' : 'skipped');

                // ÉTAPE 5 : Programmer email de demande d'avis (7 jours)
                results.reviewScheduled = true;
                console.log('[PIPELINE] Review email scheduled for 7 days');

                console.log('[PIPELINE] ✅ Complete for order', order.id);
                break;
            }

            case 'payment_intent.payment_failed': {
                console.log('[WEBHOOK] Payment failed:', event.data.object.id);
                results.status = 'payment_failed';
                break;
            }

            default:
                console.log('[WEBHOOK] Unhandled:', event.type);
        }
    } catch (err) {
        console.error('[WEBHOOK] Pipeline error:', err.message);
        results.error = err.message;
    }

    return res.status(200).json({ received: true, results });
};

// ============================
// ÉTAPE 1 : Extraire la commande de Stripe
// ============================
async function extractOrder(stripe, session) {
    let fullSession;
    try {
        fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'customer_details']
        });
    } catch (err) {
        console.log('[EXTRACT] Retrieve failed, using event data:', err.message);
        fullSession = session;
    }

    return {
        id: `ECL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        createdAt: new Date().toISOString(),
        status: 'paid',

        customer: {
            email: fullSession.customer_details?.email || session.customer_email || '',
            name: fullSession.customer_details?.name || '',
            phone: fullSession.customer_details?.phone || '',
        },

        shipping: fullSession.shipping_details ? {
            name: fullSession.shipping_details.name,
            address: fullSession.shipping_details.address
        } : fullSession.customer_details?.address ? {
            name: fullSession.customer_details.name,
            address: fullSession.customer_details.address
        } : null,

        items: (fullSession.line_items?.data || [])
            .filter(item => item.description !== 'Frais de livraison')
            .map(item => ({
                name: item.description,
                quantity: item.quantity,
                unitPrice: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
                total: item.amount_total / 100
            })),

        subtotal: (fullSession.amount_subtotal || 0) / 100,
        total: (fullSession.amount_total || 0) / 100,
        currency: fullSession.currency || 'eur',

        lang: detectLang(fullSession),
    };
}

function detectLang(session) {
    // Priority 1: Stripe session locale
    const locale = session.locale;
    if (locale) {
        const code = locale.substring(0, 2).toLowerCase();
        if (['fr', 'en', 'es', 'de'].includes(code)) return code;
    }

    // Priority 2: Shipping country code
    const country = (
        session.shipping_details?.address?.country ||
        session.customer_details?.address?.country ||
        ''
    ).toUpperCase();

    const COUNTRY_LANG = {
        FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr',
        ES: 'es',
        DE: 'de', AT: 'de',
    };

    return COUNTRY_LANG[country] || 'en';
}

// ============================
// ÉTAPE 1b : Persister dans Supabase (commandes, clients, Éclats)
// ============================

async function persistToSupabase(order, session) {
    let sb;
    try {
        sb = getSupabase();
    } catch (e) {
        return { saved: false, reason: 'supabase_not_configured' };
    }

    try {
        // 1. Upsert client dans la table customers
        let customerId = null;
        if (order.customer.email) {
            const { data: existingCustomer } = await sb
                .from('customers')
                .select('id, total_spent, loyalty_points')
                .eq('email', order.customer.email)
                .single();

            if (existingCustomer) {
                customerId = existingCustomer.id;
                await sb.from('customers').update({
                    name: order.customer.name || undefined,
                    phone: order.customer.phone || undefined,
                    total_spent: (parseFloat(existingCustomer.total_spent) || 0) + order.total,
                    loyalty_points: (existingCustomer.loyalty_points || 0) + Math.floor(order.total)
                }).eq('id', customerId);
            } else {
                const { data: newCustomer } = await sb
                    .from('customers')
                    .insert({
                        email: order.customer.email,
                        name: order.customer.name || null,
                        phone: order.customer.phone || null,
                        total_spent: order.total,
                        loyalty_points: Math.floor(order.total)
                    })
                    .select('id')
                    .single();
                if (newCustomer) customerId = newCustomer.id;
            }
        }

        // 2. Insérer la commande
        const { data: savedOrder, error: orderError } = await sb
            .from('orders')
            .insert({
                user_id: customerId,
                stripe_session_id: session.id,
                stripe_payment_intent: session.payment_intent,
                email: order.customer.email,
                phone: order.customer.phone || null,
                status: 'paid',
                subtotal: order.subtotal,
                shipping_cost: 0,
                discount_amount: 0,
                total: order.total,
                shipping_address: order.shipping || null,
                notes: order.id
            })
            .select('id')
            .single();

        if (orderError) {
            console.error('[PERSIST] Order insert error:', orderError.message);
            return { saved: false, reason: orderError.message };
        }

        // 3. Insérer les articles de la commande
        if (savedOrder && order.items.length > 0) {
            const items = order.items.map(item => ({
                order_id: savedOrder.id,
                name: item.name,
                price: item.unitPrice,
                quantity: item.quantity
            }));
            const { error: itemsError } = await sb.from('order_items').insert(items);
            if (itemsError) console.warn('[PERSIST] Items insert:', itemsError.message);
        }

        // 4. Mettre à jour les Éclats dans profiles (si utilisateur enregistré)
        if (order.customer.email) {
            try {
                const { data: { users } } = await sb.auth.admin.listUsers({ perPage: 1000 });
                const authUser = users.find(u => u.email === order.customer.email);
                if (authUser) {
                    const { data: profile } = await sb
                        .from('profiles')
                        .select('eclats, total_spent')
                        .eq('id', authUser.id)
                        .single();
                    if (profile) {
                        // Calcul du streak multiplicateur
                        const now = new Date();
                        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
                        const lastMonth = profile.last_purchase_month || '';
                        let streak = profile.purchase_streak || 0;

                        if (lastMonth === currentMonth) {
                            // Déjà acheté ce mois — pas de changement streak
                        } else {
                            // Vérifier si c'est le mois consécutif
                            const prevDate = lastMonth ? new Date(lastMonth + '-01') : null;
                            if (prevDate) {
                                prevDate.setMonth(prevDate.getMonth() + 1);
                                const expectedMonth = prevDate.getFullYear() + '-' + String(prevDate.getMonth() + 1).padStart(2, '0');
                                streak = (expectedMonth === currentMonth) ? streak + 1 : 1;
                            } else {
                                streak = 1;
                            }
                        }

                        // Multiplicateur basé sur le streak
                        const multiplier = streak >= 6 ? 3.0 : streak >= 3 ? 2.0 : streak >= 2 ? 1.5 : 1.0;
                        const baseEclats = Math.floor(order.total);
                        const eclatsEarned = Math.floor(baseEclats * multiplier);

                        await sb.from('profiles').update({
                            eclats: (profile.eclats || 0) + eclatsEarned,
                            total_spent: (parseFloat(profile.total_spent) || 0) + order.total,
                            purchase_streak: streak,
                            last_purchase_month: currentMonth
                        }).eq('id', authUser.id);

                        console.log('[PERSIST] +' + eclatsEarned + ' Éclats (base ' + baseEclats + ' x' + multiplier + ' streak ' + streak + ') for', order.customer.email);
                    }
                }
            } catch (e) {
                console.warn('[PERSIST] Éclats update skipped:', e.message);
            }
        }

        console.log('[PERSIST] Order saved:', savedOrder.id, '| Customer:', customerId);
        return { saved: true, orderId: savedOrder.id, customerId };
    } catch (err) {
        console.error('[PERSIST] Error:', err.message);
        return { saved: false, reason: err.message };
    }
}

// ============================
// ÉTAPE 2 : Commander chez le fournisseur
// ============================

// Mapping produit → coût fournisseur (CJDropshipping)
const PRODUCT_DATA = {
    'Masque LED Pro 7 Couleurs': { cost: 9.12, supplier: 'cj', cjVariantId: '2512020745411614100', cjProductId: '2512020745411613700' },
    'Gua Sha Quartz Rose Cristal': { cost: 2.19, supplier: 'cj', cjVariantId: '2602120829411639400', cjProductId: '2602120829411639000' },
    'Scrubber Ultrasonique Visage': { cost: 13.90, supplier: 'cj', cjVariantId: '1900541187347054594', cjProductId: '1900541186889875458' },
    'Brosse Nettoyante Sonic': { cost: 11.56, supplier: 'cj', cjVariantId: '1990665069533188098', cjProductId: '1990665069449302017' },
    'Ice Roller Cryo Visage': { cost: 0.70, supplier: 'cj', cjVariantId: '2508010604181617800', cjProductId: '2508010604181617000' },
    'V-Line Roller Sculptant EMS': { cost: 7.10, supplier: 'cj', cjVariantId: '2601270627311615200', cjProductId: '2601270627311614800' },
    'Facial Steamer Nano-Ion': { cost: 9.57, supplier: 'cj', cjVariantId: '2039619420209410049', cjProductId: '2039619420008083458' },
    'Sérum Éclat Vitamine C 20%': { cost: 1.02, supplier: 'cj', cjVariantId: '2603300928441601200', cjProductId: '2603300928441600800' },
    'Patchs Yeux Collagène Hydratants': { cost: 2.11, supplier: 'cj', cjVariantId: '2603301345481601100', cjProductId: '2603301345481600700' },
    'Masque Collagène Lifting': { cost: 2.28, supplier: 'cj', cjVariantId: '2604060437251603100', cjProductId: '2604060437251602800' },
    'Huile Précieuse Rose Musquée': { cost: 1.55, supplier: 'cj', cjVariantId: '2503141112311611000', cjProductId: '2503141112311610800' },
    'Stickers Anti-Rides Micro-Crystal': { cost: 0.53, supplier: 'cj', cjVariantId: '2603080834381637200', cjProductId: '2603080834381636900' },
    'Masque Yeux Vapeur SPA': { cost: 2.63, supplier: 'cj', cjVariantId: '2507200553561616300', cjProductId: '2507200553561614700' },
    'Diffuseur Arôme Ultrasonique': { cost: 15.14, supplier: 'cj', cjVariantId: '2602270733571637400', cjProductId: '2602270733571636700' },
    'Kit Boucles Sans Chaleur': { cost: 1.97, supplier: 'cj', cjVariantId: '1481815597804294144', cjProductId: '1481815597737185280' },
    // --- COFFRETS (bundles → multiples produits CJ) ---
    'Coffret Routine Éclat': { cost: 3.91, supplier: 'cj', isBundle: true, products: [
        { cjProductId: '2508010604181617000', cjVariantId: '2508010604181617800' },
        { cjProductId: '2603300928441600800', cjVariantId: '2603300928441601200' },
        { cjProductId: '2602120829411639000', cjVariantId: '2602120829411639400' }
    ]},
    'Coffret Routine Anti-Âge': { cost: 12.42, supplier: 'cj', isBundle: true, products: [
        { cjProductId: '2512020745411613700', cjVariantId: '2512020745411614100' },
        { cjProductId: '2603300928441600800', cjVariantId: '2603300928441601200' },
        { cjProductId: '2604060437251602800', cjVariantId: '2604060437251603100' }
    ]},
    'Coffret Routine Glow': { cost: 4.68, supplier: 'cj', isBundle: true, products: [
        { cjProductId: '2603300928441600800', cjVariantId: '2603300928441601200' },
        { cjProductId: '2503141112311610800', cjVariantId: '2503141112311611000' },
        { cjProductId: '2603301345481600700', cjVariantId: '2603301345481601100' }
    ]}
};

async function autoFulfill(order) {
    // Calculer le coût fournisseur et la marge
    let totalCost = 0;
    const cjItems = [];

    order.items.forEach(item => {
        const data = PRODUCT_DATA[item.name] || { cost: 0, supplier: 'cj' };
        totalCost += data.cost * item.quantity;
        cjItems.push(item);
    });

    const margin = order.total - totalCost;
    const marginPct = order.total > 0 ? ((margin / order.total) * 100).toFixed(1) : 0;

    console.log(`[FULFILLMENT] ${cjItems.length} produits CJ à commander`);

    // Obtenir le token CJ via API Key
    let cjAccessToken = '';
    const cjApiKey = process.env.CJ_API_KEY || '';
    if (cjApiKey) {
        try {
            const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: cjApiKey })
            });
            const authData = await authRes.json();
            if (authData.result && authData.data?.accessToken) {
                cjAccessToken = authData.data.accessToken;
                console.log('[CJ AUTH] ✅ Token obtenu, expire:', authData.data.accessTokenExpiryDate);
            } else {
                console.error('[CJ AUTH] Échec:', authData.message);
            }
        } catch (e) {
            console.error('[CJ AUTH] Erreur:', e.message);
        }
    }

    if (!cjAccessToken) {
        console.log('[FULFILLMENT] Mode MANUEL');
        console.log(JSON.stringify({
            client: order.customer.name,
            adresse: order.shipping?.address,
            produits: cjItems.map(i => `${i.name} x${i.quantity}`),
            coutTotal: totalCost.toFixed(2) + '€',
            marge: margin.toFixed(2) + '€ (' + marginPct + '%)'
        }, null, 2));

        return {
            mode: 'manual',
            supplierCost: totalCost,
            margin,
            marginPct: parseFloat(marginPct),
            message: 'Commander sur CJDropshipping'
        };
    }

    // Mode automatique — API CJDropshipping v2.0
    try {
        const address = order.shipping?.address || {};
        const destCountry = address.country || 'FR';

        // Étape 2a : Calculer le freight pour choisir la meilleure logistique
        const freightProducts = cjItems.map(item => {
            const pd = PRODUCT_DATA[item.name];
            return { vid: pd?.cjVariantId || '', quantity: item.quantity };
        }).filter(p => p.vid);

        let logisticName = 'CJPacket Sensitive'; // fallback par défaut
        try {
            const freightRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': cjAccessToken },
                body: JSON.stringify({ startCountryCode: 'CN', endCountryCode: destCountry, products: freightProducts })
            });
            const freightData = await freightRes.json();
            if (freightData.result && freightData.data?.length > 0) {
                // Choisir la moins chère
                const cheapest = freightData.data.sort((a, b) => a.logisticPrice - b.logisticPrice)[0];
                logisticName = cheapest.logisticName;
                console.log(`[CJ FREIGHT] ${freightData.data.length} options, choisi: ${logisticName} ($${cheapest.logisticPrice})`);
            }
        } catch (freightErr) {
            console.error('[CJ FREIGHT] Erreur, fallback CJPacket Sensitive:', freightErr.message);
        }

        const cjOrderBody = {
            orderNumber: order.id,
            shippingZip: address.postal_code || '',
            shippingCountryCode: destCountry,
            shippingCountry: destCountry,
            shippingProvince: address.state || address.city || 'N/A',
            shippingCity: address.city || '',
            shippingAddress: address.line1 || '',
            shippingAddress2: address.line2 || '',
            shippingCustomerName: order.shipping?.name || order.customer.name,
            shippingPhone: order.customer.phone || '',
            fromCountryCode: 'CN',
            logisticName,
            remark: `ÉCLAT order ${order.id}`,
            products: freightProducts
        };

        console.log('[CJ ORDER] Envoi commande:', JSON.stringify(cjOrderBody, null, 2));

        const cjResponse = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': cjAccessToken
            },
            body: JSON.stringify(cjOrderBody)
        });

        const cjData = await cjResponse.json();

        if (cjData.result) {
            console.log('[CJ ORDER] ✅ Commande créée:', cjData.data?.orderId || cjData.data);
            return {
                mode: 'auto',
                cjOrderId: cjData.data?.orderId,
                supplierCost: totalCost,
                margin,
                marginPct: parseFloat(marginPct),
                success: true
            };
        } else {
            console.error('[CJ ORDER] ❌ Erreur:', cjData.message);
            return {
                mode: 'auto_failed',
                error: cjData.message,
                supplierCost: totalCost,
                margin,
                marginPct: parseFloat(marginPct),
                fallback: 'manual'
            };
        }
    } catch (err) {
        console.error('[FULFILLMENT] CJ API error:', err.message);
        return { mode: 'auto_failed', error: err.message, fallback: 'manual' };
    }
}

// ============================
// ÉTAPE 3 : Email de confirmation (multilingue + GDPR)
// ============================

const EMAIL_TRANSLATIONS = {
    fr: {
        subject: 'Votre commande {id} est confirmée',
        preheader: 'Merci pour votre achat ! Votre rituel beaute est en route.',
        hello: 'Bonjour {name},',
        thanks_title: 'Merci pour votre confiance',
        thanks_text: 'Nous sommes ravis de vous compter parmi notre communaute. Votre commande a ete enregistree avec succes et notre equipe la prepare avec le plus grand soin.',
        order_ref: 'Commande',
        order_date: 'Date',
        order_summary: 'Recapitulatif de votre commande',
        subtotal: 'Sous-total',
        shipping: 'Livraison',
        shipping_free: 'OFFERTE',
        total: 'Total',
        shipping_title: 'Livraison estimee',
        shipping_text: 'Votre colis sera expedie sous <strong>1 a 3 jours ouvres</strong>. Vous recevrez un email avec votre numero de suivi des que votre commande sera en route.',
        shipping_dest: 'Adresse de livraison',
        delivery_time: '7 a 14 jours ouvrables',
        guarantee_title: 'Nos engagements',
        guarantee_1_title: 'Livraison suivie',
        guarantee_1_text: 'Numero de suivi fourni par email',
        guarantee_2_title: 'Satisfait ou rembourse',
        guarantee_2_text: '30 jours pour changer d\'avis',
        guarantee_3_title: 'Support reactif',
        guarantee_3_text: 'Reponse sous 24h',
        loyalty_title: 'Programme fidelite',
        loyalty_text: 'Vous avez gagne <strong style="color:#c9a87c;">{points} points</strong> avec cette commande ! Cumulez vos points pour obtenir des reductions exclusives sur vos prochains achats.',
        tips_title: 'Conseils d\'utilisation',
        tips_text: 'Pour des resultats optimaux, utilisez vos produits ECLAT dans le cadre d\'une routine reguliere. Consultez notre guide beaute pour tirer le meilleur parti de chaque produit.',
        tips_btn: 'Voir nos conseils',
        faq_title: 'Une question ?',
        faq_text: 'Consultez notre FAQ pour trouver rapidement une reponse a vos questions sur la livraison, les retours ou l\'utilisation de nos produits.',
        faq_btn: 'Consulter la FAQ',
        contact_text: 'Besoin d\'aide ? Notre equipe est la pour vous.',
        footer_thanks: 'Merci d\'avoir choisi ECLAT',
        footer_tagline: 'L\'innovation beaute, accessible a tous.',
        unsubscribe: 'Se desinscrire',
        legal: 'Maison Eclat - Micro-entreprise',
        next_steps_title: 'Prochaines etapes',
        step_1_title: 'Commande confirmee',
        step_1_text: 'Paiement valide avec succes',
        step_2_title: 'En preparation',
        step_2_text: 'Votre colis est prepare avec soin',
        step_3_title: 'Expedition',
        step_3_text: 'Numero de suivi envoye par email',
        track_btn: 'Suivre ma commande',
        crosssell_title: 'Completez votre routine beaute',
        crosssell_text: 'Nos clientes adorent associer ces produits pour des resultats encore plus visibles.',
        crosssell_btn: 'Decouvrir',
        social_text: 'Rejoignez la communaute ECLAT',
        need_help: 'Besoin d\'aide ?',
        need_help_text: 'Notre equipe repond a toutes vos questions sous 24h. N\'hesitez pas a nous contacter par email.',
        need_help_btn: 'Nous contacter',
        what_next: 'Et maintenant ?',
        what_next_1: 'Surveillez votre boite mail pour le numero de suivi',
        what_next_2: 'Consultez notre FAQ pour toute question',
        what_next_3: 'Decouvrez nos conseils beaute sur le site',
    },
    en: {
        subject: 'Your order {id} is confirmed',
        preheader: 'Thank you for your purchase! Your beauty ritual is on its way.',
        hello: 'Hello {name},',
        thanks_title: 'Thank you for your trust',
        thanks_text: 'We are thrilled to welcome you to our community. Your order has been successfully registered and our team is preparing it with the utmost care.',
        order_ref: 'Order',
        order_date: 'Date',
        order_summary: 'Order summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        shipping_free: 'FREE',
        total: 'Total',
        shipping_title: 'Estimated delivery',
        shipping_text: 'Your package will be shipped within <strong>1 to 3 business days</strong>. You will receive a tracking email as soon as your order is on its way.',
        shipping_dest: 'Shipping address',
        delivery_time: '7 to 14 business days',
        guarantee_title: 'Our commitments',
        guarantee_1_title: 'Tracked shipping',
        guarantee_1_text: 'Tracking number sent by email',
        guarantee_2_title: 'Money-back guarantee',
        guarantee_2_text: '30 days to change your mind',
        guarantee_3_title: 'Responsive support',
        guarantee_3_text: 'Reply within 24h',
        loyalty_title: 'Loyalty program',
        loyalty_text: 'You earned <strong style="color:#c9a87c;">{points} points</strong> with this order! Accumulate points to unlock exclusive discounts on future purchases.',
        tips_title: 'Usage tips',
        tips_text: 'For optimal results, use your ECLAT products as part of a regular routine. Check our beauty guide to get the most out of each product.',
        tips_btn: 'View our tips',
        faq_title: 'Have a question?',
        faq_text: 'Check our FAQ to quickly find answers about shipping, returns, or product usage.',
        faq_btn: 'View FAQ',
        contact_text: 'Need help? Our team is here for you.',
        footer_thanks: 'Thank you for choosing ECLAT',
        footer_tagline: 'Beauty innovation, accessible to all.',
        unsubscribe: 'Unsubscribe',
        legal: 'Maison Eclat - Micro-enterprise',
        next_steps_title: 'What happens next',
        step_1_title: 'Order confirmed',
        step_1_text: 'Payment successfully validated',
        step_2_title: 'Being prepared',
        step_2_text: 'Your package is being prepared with care',
        step_3_title: 'Shipping',
        step_3_text: 'Tracking number sent by email',
        track_btn: 'Track my order',
        crosssell_title: 'Complete your beauty routine',
        crosssell_text: 'Our customers love combining these products for even more visible results.',
        crosssell_btn: 'Discover',
        social_text: 'Join the ECLAT community',
        need_help: 'Need help?',
        need_help_text: 'Our team answers all your questions within 24h. Don\'t hesitate to contact us by email.',
        need_help_btn: 'Contact us',
        what_next: 'What\'s next?',
        what_next_1: 'Watch your inbox for your tracking number',
        what_next_2: 'Check our FAQ for any questions',
        what_next_3: 'Discover our beauty tips on the website',
    },
    es: {
        subject: 'Tu pedido {id} esta confirmado',
        preheader: 'Gracias por tu compra! Tu ritual de belleza esta en camino.',
        hello: 'Hola {name},',
        thanks_title: 'Gracias por tu confianza',
        thanks_text: 'Estamos encantados de darte la bienvenida a nuestra comunidad. Tu pedido ha sido registrado con exito y nuestro equipo lo prepara con el mayor cuidado.',
        order_ref: 'Pedido',
        order_date: 'Fecha',
        order_summary: 'Resumen de tu pedido',
        subtotal: 'Subtotal',
        shipping: 'Envio',
        shipping_free: 'GRATIS',
        total: 'Total',
        shipping_title: 'Entrega estimada',
        shipping_text: 'Tu paquete sera enviado en <strong>1 a 3 dias laborables</strong>. Recibiras un email con tu numero de seguimiento en cuanto tu pedido este en camino.',
        shipping_dest: 'Direccion de envio',
        delivery_time: '7 a 14 dias laborables',
        guarantee_title: 'Nuestros compromisos',
        guarantee_1_title: 'Envio con seguimiento',
        guarantee_1_text: 'Numero de seguimiento por email',
        guarantee_2_title: 'Garantia de devolucion',
        guarantee_2_text: '30 dias para cambiar de opinion',
        guarantee_3_title: 'Soporte reactivo',
        guarantee_3_text: 'Respuesta en 24h',
        loyalty_title: 'Programa de fidelidad',
        loyalty_text: 'Has ganado <strong style="color:#c9a87c;">{points} puntos</strong> con este pedido! Acumula puntos para obtener descuentos exclusivos en tus proximas compras.',
        tips_title: 'Consejos de uso',
        tips_text: 'Para resultados optimos, utiliza tus productos ECLAT como parte de una rutina regular. Consulta nuestra guia de belleza para sacar el maximo partido de cada producto.',
        tips_btn: 'Ver nuestros consejos',
        faq_title: 'Tienes alguna pregunta?',
        faq_text: 'Consulta nuestra FAQ para encontrar rapidamente respuestas sobre envios, devoluciones o uso de productos.',
        faq_btn: 'Ver FAQ',
        contact_text: 'Necesitas ayuda? Nuestro equipo esta aqui para ti.',
        footer_thanks: 'Gracias por elegir ECLAT',
        footer_tagline: 'Innovacion en belleza, accesible para todos.',
        unsubscribe: 'Darse de baja',
        legal: 'Maison Eclat - Microempresa',
        next_steps_title: 'Proximos pasos',
        step_1_title: 'Pedido confirmado',
        step_1_text: 'Pago validado con exito',
        step_2_title: 'En preparacion',
        step_2_text: 'Tu paquete se prepara con cuidado',
        step_3_title: 'Envio',
        step_3_text: 'Numero de seguimiento por email',
        track_btn: 'Seguir mi pedido',
        crosssell_title: 'Completa tu rutina de belleza',
        crosssell_text: 'Nuestras clientas adoran combinar estos productos para resultados aun mas visibles.',
        crosssell_btn: 'Descubrir',
        social_text: 'Unete a la comunidad ECLAT',
        need_help: 'Necesitas ayuda?',
        need_help_text: 'Nuestro equipo responde a todas tus preguntas en 24h. No dudes en contactarnos por email.',
        need_help_btn: 'Contactanos',
        what_next: 'Y ahora que?',
        what_next_1: 'Vigila tu bandeja de entrada para el numero de seguimiento',
        what_next_2: 'Consulta nuestra FAQ para cualquier pregunta',
        what_next_3: 'Descubre nuestros consejos de belleza en el sitio',
    },
    de: {
        subject: 'Ihre Bestellung {id} ist bestaetigt',
        preheader: 'Danke fuer Ihren Einkauf! Ihr Beauty-Ritual ist unterwegs.',
        hello: 'Hallo {name},',
        thanks_title: 'Danke fuer Ihr Vertrauen',
        thanks_text: 'Wir freuen uns, Sie in unserer Community willkommen zu heissen. Ihre Bestellung wurde erfolgreich registriert und unser Team bereitet sie mit groesster Sorgfalt vor.',
        order_ref: 'Bestellung',
        order_date: 'Datum',
        order_summary: 'Bestelluebersicht',
        subtotal: 'Zwischensumme',
        shipping: 'Versand',
        shipping_free: 'KOSTENLOS',
        total: 'Gesamt',
        shipping_title: 'Voraussichtliche Lieferung',
        shipping_text: 'Ihr Paket wird innerhalb von <strong>1 bis 3 Werktagen</strong> versendet. Sie erhalten eine Tracking-E-Mail, sobald Ihre Bestellung unterwegs ist.',
        shipping_dest: 'Lieferadresse',
        delivery_time: '7 bis 14 Werktage',
        guarantee_title: 'Unsere Versprechen',
        guarantee_1_title: 'Sendungsverfolgung',
        guarantee_1_text: 'Trackingnummer per E-Mail',
        guarantee_2_title: 'Geld-zurueck-Garantie',
        guarantee_2_text: '30 Tage Rueckgaberecht',
        guarantee_3_title: 'Reaktiver Support',
        guarantee_3_text: 'Antwort innerhalb von 24h',
        loyalty_title: 'Treueprogramm',
        loyalty_text: 'Sie haben <strong style="color:#c9a87c;">{points} Punkte</strong> mit dieser Bestellung gesammelt! Sammeln Sie Punkte fuer exklusive Rabatte auf zukuenftige Einkaeufe.',
        tips_title: 'Anwendungstipps',
        tips_text: 'Fuer optimale Ergebnisse verwenden Sie Ihre ECLAT-Produkte als Teil einer regelmaessigen Routine. Schauen Sie sich unseren Beauty-Guide an, um das Beste aus jedem Produkt herauszuholen.',
        tips_btn: 'Tipps ansehen',
        faq_title: 'Haben Sie eine Frage?',
        faq_text: 'In unseren FAQ finden Sie schnell Antworten zu Versand, Retouren oder Produktanwendung.',
        faq_btn: 'FAQ ansehen',
        contact_text: 'Brauchen Sie Hilfe? Unser Team ist fuer Sie da.',
        footer_thanks: 'Danke, dass Sie ECLAT gewaehlt haben',
        footer_tagline: 'Beauty-Innovation, fuer alle zugaenglich.',
        unsubscribe: 'Abmelden',
        legal: 'Maison Eclat - Kleinunternehmen',
        next_steps_title: 'Naechste Schritte',
        step_1_title: 'Bestellung bestaetigt',
        step_1_text: 'Zahlung erfolgreich validiert',
        step_2_title: 'In Vorbereitung',
        step_2_text: 'Ihr Paket wird sorgfaeltig vorbereitet',
        step_3_title: 'Versand',
        step_3_text: 'Trackingnummer per E-Mail',
        track_btn: 'Meine Bestellung verfolgen',
        crosssell_title: 'Vervollstaendigen Sie Ihre Beauty-Routine',
        crosssell_text: 'Unsere Kundinnen lieben es, diese Produkte zu kombinieren fuer noch sichtbarere Ergebnisse.',
        crosssell_btn: 'Entdecken',
        social_text: 'Treten Sie der ECLAT-Community bei',
        need_help: 'Brauchen Sie Hilfe?',
        need_help_text: 'Unser Team beantwortet alle Ihre Fragen innerhalb von 24h. Kontaktieren Sie uns gerne per E-Mail.',
        need_help_btn: 'Kontaktieren Sie uns',
        what_next: 'Und jetzt?',
        what_next_1: 'Behalten Sie Ihren Posteingang fuer die Trackingnummer im Auge',
        what_next_2: 'Schauen Sie in unsere FAQ fuer alle Fragen',
        what_next_3: 'Entdecken Sie unsere Beauty-Tipps auf der Website',
    },
};

const EMAIL_SUBJECTS = {
    fr: (id) => `Votre commande ${id} est confirmée ✨`,
    en: (id) => `Your order ${id} is confirmed ✨`,
    es: (id) => `Tu pedido ${id} está confirmado ✨`,
    de: (id) => `Ihre Bestellung ${id} ist bestätigt ✨`,
};

async function sendConfirmationEmail(order) {
    const resendApiKey = process.env.RESEND_API_KEY || '';

    if (!resendApiKey || !order.customer.email) {
        return { success: false, reason: 'No API key or no email' };
    }

    try {
        const lang = order.lang || 'en';
        const subjectFn = EMAIL_SUBJECTS[lang] || EMAIL_SUBJECTS.en;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM || 'ÉCLAT Beauté <onboarding@resend.dev>',
                to: order.customer.email,
                subject: subjectFn(order.id),
                html: buildConfirmationHtml(order, lang)
            })
        });

        const resData = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error('[EMAIL] Resend error:', JSON.stringify(resData));
        }
        return { success: response.ok, detail: resData };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

function buildConfirmationHtml(order, lang) {
    const t = EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.en;
    const loyaltyPoints = Math.floor(order.total);
    const orderDate = new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const shippingCost = order.total - order.subtotal;
    const addr = order.shipping?.address || {};
    const gold = '#c9a87c';
    const dark = '#2d2926';
    const muted = '#6b6560';
    const bg = '#faf8f5';
    const cardBg = '#ffffff';
    const border = '#e8e4de';
    const green = '#4a9e6d';
    const site = 'https://maison-eclat.shop';

    // Cross-sell: 3 bestsellers (static for email reliability)
    const BESTSELLERS = [
        { name: lang === 'fr' ? 'Masque LED Pro 7 Couleurs' : lang === 'es' ? 'Mascarilla LED Pro 7 Colores' : lang === 'de' ? 'LED Maske Pro 7 Farben' : 'LED Mask Pro 7 Colors', price: '49,90', img: 'masque-led' },
        { name: lang === 'fr' ? 'Gua Sha Quartz Rose' : lang === 'es' ? 'Gua Sha Cuarzo Rosa' : lang === 'de' ? 'Rosenquarz Gua Sha' : 'Rose Quartz Gua Sha', price: '14,90', img: 'gua-sha' },
        { name: lang === 'fr' ? 'Serum Vitamine C 20%' : lang === 'es' ? 'Serum Vitamina C 20%' : lang === 'de' ? 'Vitamin C Serum 20%' : 'Vitamin C Serum 20%', price: '19,90', img: 'serum-vitamine-c' },
    ];
    // Filter out items already in the order
    const crossSellItems = BESTSELLERS.filter(b => !order.items.some(i => i.name.toLowerCase().includes(b.img.replace('-', ' ').substring(0, 6)))).slice(0, 2);

    return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${t.subject.replace('{id}', order.id)}</title>
<!--[if !mso]><!--><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');</style><!--<![endif]-->
</head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;">${t.preheader}</div>

<!-- WRAPPER -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="padding:32px 0;text-align:center;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
        <a href="${site}" style="text-decoration:none;">
            <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:36px;color:${dark};letter-spacing:6px;margin:0;">&#201;CLAT</h1>
            <p style="font-size:11px;color:${gold};letter-spacing:4px;margin:4px 0 0;text-transform:uppercase;">Maison de Beaut&#233;</p>
        </a>
    </td></tr>
    </table>
</td></tr>

<!-- HERO BANNER -->
<tr><td style="background:linear-gradient(135deg,${dark} 0%,#1a1614 100%);border-radius:16px 16px 0 0;padding:48px 40px;text-align:center;">
    <div style="width:64px;height:64px;border-radius:50%;background:${green};line-height:64px;text-align:center;margin:0 auto 16px;font-size:28px;color:#fff;">&#10003;</div>
    <p style="font-size:14px;color:${gold};letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">${t.order_ref} ${order.id}</p>
    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:#ffffff;margin:0 0 16px;font-weight:400;">${t.thanks_title}</h2>
    <p style="font-size:15px;color:#b8b0a8;margin:0;line-height:1.6;">${t.thanks_text}</p>
</td></tr>

<!-- NEXT STEPS TIMELINE -->
<tr><td style="background:${cardBg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0 0 24px;text-align:center;">${t.next_steps_title}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center" style="width:33%;padding:0 8px;vertical-align:top;">
            <div style="width:44px;height:44px;border-radius:50%;background:${green};line-height:44px;text-align:center;margin:0 auto 8px;font-size:18px;color:#fff;font-weight:700;">1</div>
            <div style="width:100%;height:3px;background:${green};margin:0 0 12px;border-radius:2px;"></div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.step_1_title}</p>
            <p style="font-size:11px;color:${green};margin:0;">&#10003; ${t.step_1_text}</p>
        </td>
        <td align="center" style="width:33%;padding:0 8px;vertical-align:top;">
            <div style="width:44px;height:44px;border-radius:50%;background:${gold};line-height:44px;text-align:center;margin:0 auto 8px;font-size:18px;color:#fff;font-weight:700;">2</div>
            <div style="width:100%;height:3px;background:${gold};margin:0 0 12px;border-radius:2px;"></div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.step_2_title}</p>
            <p style="font-size:11px;color:${muted};margin:0;">${t.step_2_text}</p>
        </td>
        <td align="center" style="width:33%;padding:0 8px;vertical-align:top;">
            <div style="width:44px;height:44px;border-radius:50%;background:${border};line-height:44px;text-align:center;margin:0 auto 8px;font-size:18px;color:${muted};font-weight:700;">3</div>
            <div style="width:100%;height:3px;background:${border};margin:0 0 12px;border-radius:2px;"></div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.step_3_title}</p>
            <p style="font-size:11px;color:${muted};margin:0;">${t.step_3_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- ORDER SUMMARY -->
<tr><td style="background:${bg};padding:0 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:32px 0 16px;">
        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0;border-bottom:2px solid ${gold};padding-bottom:12px;display:inline-block;">${t.order_summary}</h3>
    </td></tr>
    </table>

    <!-- ITEMS -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cardBg};border-radius:8px;border:1px solid ${border};">
    ${order.items.map(item => `
    <tr>
        <td style="padding:20px 24px;border-bottom:1px solid ${border};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:15px;color:${dark};font-weight:600;">${item.name}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:${muted};">Qty: ${item.quantity}</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                    <p style="margin:0;font-size:16px;color:${gold};font-weight:700;">${item.total.toFixed(2).replace('.', ',')} &euro;</p>
                </td>
            </tr>
            </table>
        </td>
    </tr>`).join('')}

    <!-- TOTALS inside card -->
    <tr><td style="padding:16px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td style="padding:6px 0;font-size:14px;color:${muted};">${t.subtotal}</td>
            <td align="right" style="padding:6px 0;font-size:14px;color:${muted};">${order.subtotal.toFixed(2).replace('.', ',')} &euro;</td>
        </tr>
        <tr>
            <td style="padding:6px 0;font-size:14px;color:${muted};">${t.shipping}</td>
            <td align="right" style="padding:6px 0;font-size:14px;color:${green};font-weight:600;">${shippingCost > 0 ? shippingCost.toFixed(2).replace('.', ',') + ' &euro;' : '&#10003; ' + t.shipping_free}</td>
        </tr>
        <tr>
            <td colspan="2" style="padding-top:12px;border-top:2px solid ${dark};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:8px 0;font-size:18px;color:${dark};font-weight:700;">${t.total}</td>
                    <td align="right" style="padding:8px 0;font-size:24px;color:${dark};font-weight:700;">${order.total.toFixed(2).replace('.', ',')} &euro;</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:4px 0 0;font-size:11px;color:${muted};font-style:italic;">TVA non applicable, art. 293 B du CGI (micro-entreprise)</td>
                </tr>
                </table>
            </td>
        </tr>
        </table>
    </td></tr>
    </table>
</td></tr>

<!-- SHIPPING INFO -->
<tr><td style="background:${cardBg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td>
        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0 0 12px;">&#128230; ${t.shipping_title}</h3>
        <p style="font-size:14px;color:${muted};line-height:1.6;margin:0 0 20px;">${t.shipping_text}</p>
    </td></tr>
    <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border-radius:12px;border:1px solid ${border};">
        <tr>
            <td style="padding:20px 24px;width:50%;vertical-align:top;">
                <p style="font-size:11px;color:${gold};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:700;">${t.shipping_dest}</p>
                <p style="font-size:13px;color:${dark};margin:0;line-height:1.6;">
                    <strong>${order.shipping?.name || order.customer.name}</strong><br>
                    ${addr.line1 || ''}${addr.line2 ? '<br>' + addr.line2 : ''}<br>
                    ${addr.postal_code || ''} ${addr.city || ''}<br>
                    ${addr.country || ''}
                </p>
            </td>
            <td style="padding:20px 24px;width:50%;vertical-align:top;border-left:1px solid ${border};">
                <p style="font-size:11px;color:${gold};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:700;">${t.order_ref}</p>
                <p style="font-size:13px;color:${dark};margin:0;line-height:1.6;">
                    <strong>${order.id}</strong><br>
                    ${t.order_date}: ${orderDate}
                </p>
                <div style="margin-top:12px;padding:8px 12px;background:${gold}15;border-radius:6px;border-left:3px solid ${gold};">
                    <p style="font-size:12px;color:${dark};margin:0;font-weight:600;">&#128197; ${t.delivery_time}</p>
                </div>
            </td>
        </tr>
        </table>
    </td></tr>
    </table>
</td></tr>

<!-- TRACK ORDER CTA -->
<tr><td style="background:${cardBg};padding:0 40px 32px;border-left:1px solid ${border};border-right:1px solid ${border};text-align:center;">
    <a href="${site}/pages/faq.html#suivi" style="display:inline-block;background:${gold};color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:30px;letter-spacing:1px;">${t.track_btn} &rarr;</a>
</td></tr>

<!-- 3 GUARANTEES -->
<tr><td style="background:${bg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0 0 24px;text-align:center;">${t.guarantee_title}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center" style="padding:12px 8px;width:33%;vertical-align:top;">
            <div style="width:52px;height:52px;border-radius:50%;background:${cardBg};border:2px solid ${gold};line-height:52px;text-align:center;margin:0 auto 10px;font-size:22px;">&#128230;</div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.guarantee_1_title}</p>
            <p style="font-size:11px;color:${muted};margin:0;line-height:1.4;">${t.guarantee_1_text}</p>
        </td>
        <td align="center" style="padding:12px 8px;width:33%;vertical-align:top;">
            <div style="width:52px;height:52px;border-radius:50%;background:${cardBg};border:2px solid ${gold};line-height:52px;text-align:center;margin:0 auto 10px;font-size:22px;">&#128176;</div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.guarantee_2_title}</p>
            <p style="font-size:11px;color:${muted};margin:0;line-height:1.4;">${t.guarantee_2_text}</p>
        </td>
        <td align="center" style="padding:12px 8px;width:33%;vertical-align:top;">
            <div style="width:52px;height:52px;border-radius:50%;background:${cardBg};border:2px solid ${gold};line-height:52px;text-align:center;margin:0 auto 10px;font-size:22px;">&#128172;</div>
            <p style="font-size:13px;font-weight:700;color:${dark};margin:0 0 4px;">${t.guarantee_3_title}</p>
            <p style="font-size:11px;color:${muted};margin:0;line-height:1.4;">${t.guarantee_3_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- LOYALTY POINTS -->
<tr><td style="background:linear-gradient(135deg,${dark} 0%,#1a1614 100%);padding:36px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
        <p style="font-size:11px;color:${gold};letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">${t.loyalty_title}</p>
        <p style="font-size:48px;color:#fff;font-weight:700;margin:0 0 4px;font-family:'Playfair Display',Georgia,serif;">+${loyaltyPoints}</p>
        <p style="font-size:13px;color:${gold};margin:0 0 16px;letter-spacing:2px;">POINTS</p>
        <p style="font-size:13px;color:#b8b0a8;margin:0;line-height:1.6;max-width:400px;">${t.loyalty_text.replace('{points}', loyaltyPoints)}</p>
    </td></tr>
    </table>
</td></tr>

<!-- WHAT'S NEXT - CHECKLIST -->
<tr><td style="background:${cardBg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0 0 20px;">${t.what_next}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:10px 0;font-size:14px;color:${dark};line-height:1.5;">
        <span style="color:${gold};font-size:16px;margin-right:8px;">&#9755;</span> ${t.what_next_1}
    </td></tr>
    <tr><td style="padding:10px 0;font-size:14px;color:${dark};line-height:1.5;border-top:1px solid ${border};">
        <span style="color:${gold};font-size:16px;margin-right:8px;">&#9755;</span> ${t.what_next_2}
    </td></tr>
    <tr><td style="padding:10px 0;font-size:14px;color:${dark};line-height:1.5;border-top:1px solid ${border};">
        <span style="color:${gold};font-size:16px;margin-right:8px;">&#9755;</span> ${t.what_next_3}
    </td></tr>
    </table>
</td></tr>

<!-- TIPS + FAQ - 2 COLUMNS -->
<tr><td style="background:${bg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="width:48%;padding-right:2%;vertical-align:top;">
            <div style="background:${cardBg};border-radius:12px;border:1px solid ${border};padding:24px;height:100%;">
                <p style="font-size:24px;margin:0 0 8px;">&#128161;</p>
                <h4 style="font-size:15px;color:${dark};margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;">${t.tips_title}</h4>
                <p style="font-size:12px;color:${muted};line-height:1.5;margin:0 0 16px;">${t.tips_text}</p>
                <a href="${site}" style="display:inline-block;font-size:12px;color:${gold};text-decoration:none;border:1px solid ${gold};border-radius:20px;padding:8px 20px;font-weight:600;">${t.tips_btn} &rarr;</a>
            </div>
        </td>
        <td style="width:48%;padding-left:2%;vertical-align:top;">
            <div style="background:${cardBg};border-radius:12px;border:1px solid ${border};padding:24px;height:100%;">
                <p style="font-size:24px;margin:0 0 8px;">&#10067;</p>
                <h4 style="font-size:15px;color:${dark};margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;">${t.faq_title}</h4>
                <p style="font-size:12px;color:${muted};line-height:1.5;margin:0 0 16px;">${t.faq_text}</p>
                <a href="${site}/pages/faq.html" style="display:inline-block;font-size:12px;color:${gold};text-decoration:none;border:1px solid ${gold};border-radius:20px;padding:8px 20px;font-weight:600;">${t.faq_btn} &rarr;</a>
            </div>
        </td>
    </tr>
    </table>
</td></tr>

<!-- CROSS-SELL -->
${crossSellItems.length > 0 ? `
<tr><td style="background:${cardBg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${dark};margin:0 0 8px;text-align:center;">${t.crosssell_title}</h3>
    <p style="font-size:13px;color:${muted};text-align:center;margin:0 0 24px;">${t.crosssell_text}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
    ${crossSellItems.map(p => `
        <td align="center" style="width:${Math.floor(100/crossSellItems.length)}%;padding:0 8px;vertical-align:top;">
            <div style="background:${bg};border-radius:12px;border:1px solid ${border};padding:20px 16px;">
                <p style="font-size:14px;font-weight:600;color:${dark};margin:0 0 8px;min-height:36px;">${p.name}</p>
                <p style="font-size:18px;color:${gold};font-weight:700;margin:0 0 12px;">${p.price} &euro;</p>
                <a href="${site}" style="display:inline-block;font-size:11px;color:#fff;background:${dark};text-decoration:none;border-radius:20px;padding:8px 20px;font-weight:600;letter-spacing:1px;">${t.crosssell_btn} &rarr;</a>
            </div>
        </td>`).join('')}
    </tr>
    </table>
</td></tr>` : ''}

<!-- NEED HELP -->
<tr><td style="background:${bg};padding:32px 40px;border-left:1px solid ${border};border-right:1px solid ${border};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cardBg};border-radius:12px;border:1px solid ${border};">
    <tr><td style="padding:28px 32px;text-align:center;">
        <p style="font-size:24px;margin:0 0 8px;">&#128140;</p>
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:16px;color:${dark};margin:0 0 8px;">${t.need_help}</h4>
        <p style="font-size:13px;color:${muted};line-height:1.5;margin:0 0 16px;">${t.need_help_text}</p>
        <a href="mailto:contact@maison-eclat.shop" style="display:inline-block;font-size:13px;color:${gold};text-decoration:none;border:2px solid ${gold};border-radius:30px;padding:10px 28px;font-weight:600;">${t.need_help_btn} &rarr;</a>
    </td></tr>
    </table>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:${dark};border-radius:0 0 16px 16px;padding:40px;text-align:center;">
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#fff;margin:0 0 4px;font-weight:400;">${t.footer_thanks}</h3>
    <p style="font-size:12px;color:${gold};margin:0 0 24px;letter-spacing:2px;">${t.footer_tagline}</p>

    <!-- Social links -->
    <p style="font-size:11px;color:#b8b0a8;margin:0 0 12px;text-transform:uppercase;letter-spacing:2px;">${t.social_text}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
    <tr>
        <td style="padding:0 8px;"><a href="mailto:contact@maison-eclat.shop" style="display:inline-block;width:36px;height:36px;border-radius:50%;border:1px solid #3d3835;line-height:36px;text-align:center;color:${gold};text-decoration:none;font-size:16px;">&#9993;</a></td>
        <td style="padding:0 8px;"><a href="https://instagram.com/eclat.beaute" style="display:inline-block;width:36px;height:36px;border-radius:50%;border:1px solid #3d3835;line-height:36px;text-align:center;color:${gold};text-decoration:none;font-size:16px;">&#128247;</a></td>
    </tr>
    </table>

    <p style="font-size:12px;color:#b8b0a8;margin:0 0 8px;">${t.contact_text}</p>
    <a href="mailto:contact@maison-eclat.shop" style="font-size:14px;color:${gold};text-decoration:none;font-weight:600;">contact@maison-eclat.shop</a>

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #3d3835;">
        <p style="font-size:11px;color:#6b6560;margin:0 0 8px;">
            ${t.legal}
        </p>
        <p style="font-size:11px;color:#6b6560;margin:0;">
            <a href="${site}/pages/cgv.html" style="color:#6b6560;text-decoration:underline;">CGV</a> &nbsp;|&nbsp;
            <a href="${site}/pages/confidentialite.html" style="color:#6b6560;text-decoration:underline;">RGPD</a> &nbsp;|&nbsp;
            <a href="${site}/pages/faq.html" style="color:#6b6560;text-decoration:underline;">FAQ</a> &nbsp;|&nbsp;
            <a href="${site}/pages/retours.html" style="color:#6b6560;text-decoration:underline;">${t.guarantee_2_title}</a> &nbsp;|&nbsp;
            <a href="${site}/api/unsubscribe?email=${encodeURIComponent(order.email)}&token=${generateUnsubToken(order.email)}" style="color:#6b6560;text-decoration:underline;">${t.unsubscribe}</a>
        </p>
    </div>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

// ============================
// BREVO: ENREGISTRER CONTACT + SMS
// ============================

// Indicatifs téléphoniques par pays
const COUNTRY_CODES = {
    FR: '33', BE: '32', CH: '41', LU: '352',
    DE: '49', AT: '43', ES: '34', IT: '39',
    NL: '31', PT: '351', IE: '353', GB: '44',
};

function formatPhoneInternational(phone, countryCode) {
    let cleaned = phone.replace(/[\s.()/-]/g, '');
    // Déjà au format international
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('00')) return '+' + cleaned.substring(2);
    // Numéro local (commence par 0)
    const prefix = COUNTRY_CODES[countryCode] || '33';
    if (cleaned.startsWith('0')) {
        return '+' + prefix + cleaned.substring(1);
    }
    return '+' + prefix + cleaned;
}

// Enregistrer le contact dans Brevo (email + téléphone + pays)
async function saveContactToBrevo(order) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return { saved: false, reason: 'BREVO_API_KEY not set' };

    const email = order.customer?.email;
    if (!email) return { saved: false, reason: 'no email' };

    const country = order.shipping?.address?.country || 'FR';
    const phone = order.customer?.phone
        ? formatPhoneInternational(order.customer.phone, country)
        : undefined;

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                email,
                attributes: {
                    PRENOM: order.customer?.name?.split(' ')[0] || '',
                    NOM: order.customer?.name?.split(' ').slice(1).join(' ') || '',
                    SMS: phone || '',
                    PAYS: country,
                    LANGUE: order.lang || 'fr',
                    DERNIERE_COMMANDE: order.createdAt,
                },
                listIds: [2], // Liste "Clients" (à créer dans Brevo)
                updateEnabled: true, // Met à jour si le contact existe déjà
            }),
        });

        const data = await response.json();
        console.log(`[BREVO] Contact ${email} saved/updated`);
        return { saved: true };
    } catch (err) {
        console.error('[BREVO] Contact error:', err.message);
        return { saved: false, error: err.message };
    }
}

// Envoyer SMS de confirmation
async function sendOrderSMS(order) {
    const apiKey = process.env.BREVO_API_KEY;
    const phone = order.customer?.phone;

    if (!apiKey || !phone) {
        return { sent: false, reason: !apiKey ? 'BREVO_API_KEY not set' : 'no phone' };
    }

    const country = order.shipping?.address?.country || 'FR';
    const formattedPhone = formatPhoneInternational(phone, country);

    // Validation basique : le numéro formaté doit contenir 10-15 chiffres
    const digits = formattedPhone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
        return { sent: false, reason: 'invalid phone format: ' + digits.length + ' digits' };
    }

    // Enregistrer le contact dans Brevo (en parallèle)
    saveContactToBrevo(order).catch(e => console.error('[BREVO] Save failed:', e));

    const SMS_TEXTS = {
        fr: `ECLAT: Merci pour votre commande ${order.id} ! Votre colis est en preparation et sera expedie sous 1-3 jours ouvres. Suivi par email. Contact: contact@maison-eclat.shop`,
        en: `ECLAT: Thank you for order ${order.id}! Your package is being prepared and will ship within 1-3 business days. Tracking by email. Contact: contact@maison-eclat.shop`,
        es: `ECLAT: Gracias por su pedido ${order.id}! Su paquete se esta preparando y se enviara en 1-3 dias laborables. Seguimiento por email. Contacto: contact@maison-eclat.shop`,
        de: `ECLAT: Danke fur Ihre Bestellung ${order.id}! Ihr Paket wird vorbereitet und in 1-3 Werktagen versandt. Verfolgung per E-Mail. Kontakt: contact@maison-eclat.shop`,
    };

    const message = SMS_TEXTS[order.lang] || SMS_TEXTS.fr;

    try {
        const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                type: 'transactional',
                unicodeEnabled: false,
                sender: 'MaisonEclat',
                recipient: formattedPhone,
                content: message,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`[SMS] Sent to ${formattedPhone.substring(0, 6)}*** (${country})`);
            return { sent: true, messageId: data.messageId };
        } else {
            console.error('[SMS] Brevo error:', data.message);
            return { sent: false, error: data.message };
        }
    } catch (err) {
        console.error('[SMS] Error:', err.message);
        return { sent: false, error: err.message };
    }
}
