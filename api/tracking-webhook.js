// ============================
// ÉCLAT - Webhook suivi CJDropshipping
// POST /api/tracking-webhook
// Appelé par CJ quand le statut de suivi change, ou par un cron
// Met à jour la commande dans Supabase + envoie email via Resend
// ============================

var { getSupabase } = require('./_middleware/auth');

// Statuts CJ qui déclenchent un email au client
var EMAIL_TRIGGERS = ['InTransit', 'OutForDelivery', 'Delivered'];

// Mapping statut CJ → statut interne orders.status
var CJ_TO_ORDER_STATUS = {
    'InfoReceived':   'processing',
    'InTransit':      'shipped',
    'OutForDelivery': 'shipped',
    'Delivered':      'delivered',
    'AttemptFail':    'shipped',
    'Exception':      'shipped',
    'Expired':        'shipped'
};

// Progression des statuts (pour empêcher retour en arrière)
var STATUS_ORDER = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

// ============================
// Traductions email par langue (FR, EN, ES, DE)
// ============================
var EMAIL_TRANSLATIONS = {
    fr: {
        shipped_subject: 'Votre colis ÉCLAT est en route !',
        shipped_title: 'Votre colis est expédié',
        shipped_text: 'Bonne nouvelle ! Votre commande a été expédiée et est en route vers vous.',
        in_transit_subject: 'Votre colis ÉCLAT est en transit',
        in_transit_title: 'Votre colis est en transit',
        in_transit_text: 'Votre colis est en route et progresse vers vous. Vous pouvez suivre son avancement en temps réel.',
        delivered_subject: 'Votre colis ÉCLAT a été livré !',
        delivered_title: 'Colis livré',
        delivered_text: 'Votre commande a été livrée avec succès. Nous espérons que vous adorerez vos produits !',
        tracking_label: 'Numéro de suivi',
        track_btn: 'Suivre mon colis',
        help_text: 'Un problème ? Contactez-nous à',
        review_text: 'Partagez votre expérience et gagnez des Éclats !',
        order_label: 'Commande'
    },
    en: {
        shipped_subject: 'Your ÉCLAT package is on its way!',
        shipped_title: 'Your package has been shipped',
        shipped_text: 'Great news! Your order has been shipped and is on its way to you.',
        in_transit_subject: 'Your ÉCLAT package is in transit',
        in_transit_title: 'Your package is in transit',
        in_transit_text: 'Your package is on its way and progressing towards you. Track it in real time.',
        delivered_subject: 'Your ÉCLAT package has been delivered!',
        delivered_title: 'Package delivered',
        delivered_text: 'Your order has been successfully delivered. We hope you love your products!',
        tracking_label: 'Tracking number',
        track_btn: 'Track my package',
        help_text: 'Any issues? Contact us at',
        review_text: 'Share your experience and earn Éclats points!',
        order_label: 'Order'
    },
    es: {
        shipped_subject: '¡Tu paquete ÉCLAT está en camino!',
        shipped_title: 'Tu paquete ha sido enviado',
        shipped_text: '¡Buenas noticias! Tu pedido ha sido enviado y está en camino.',
        in_transit_subject: 'Tu paquete ÉCLAT está en tránsito',
        in_transit_title: 'Tu paquete está en tránsito',
        in_transit_text: 'Tu paquete está en camino y avanzando hacia ti. Puedes seguirlo en tiempo real.',
        delivered_subject: '¡Tu paquete ÉCLAT ha sido entregado!',
        delivered_title: 'Paquete entregado',
        delivered_text: 'Tu pedido ha sido entregado con éxito. ¡Esperamos que te encanten tus productos!',
        tracking_label: 'Número de seguimiento',
        track_btn: 'Seguir mi paquete',
        help_text: '¿Algún problema? Contáctanos en',
        review_text: '¡Comparte tu experiencia y gana puntos Éclats!',
        order_label: 'Pedido'
    },
    de: {
        shipped_subject: 'Dein ÉCLAT-Paket ist unterwegs!',
        shipped_title: 'Dein Paket wurde versendet',
        shipped_text: 'Gute Nachrichten! Deine Bestellung wurde versendet und ist unterwegs zu dir.',
        in_transit_subject: 'Dein ÉCLAT-Paket ist unterwegs',
        in_transit_title: 'Dein Paket ist unterwegs',
        in_transit_text: 'Dein Paket ist auf dem Weg zu dir. Verfolge es in Echtzeit.',
        delivered_subject: 'Dein ÉCLAT-Paket wurde zugestellt!',
        delivered_title: 'Paket zugestellt',
        delivered_text: 'Deine Bestellung wurde erfolgreich zugestellt. Wir hoffen, du liebst deine Produkte!',
        tracking_label: 'Sendungsnummer',
        track_btn: 'Mein Paket verfolgen',
        help_text: 'Ein Problem? Kontaktiere uns unter',
        review_text: 'Teile deine Erfahrung und verdiene Éclats-Punkte!',
        order_label: 'Bestellung'
    }
};

// ============================
// Mapping pays → langue pour les emails
// ============================
var COUNTRY_LANG = {
    FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr',
    ES: 'es', MX: 'es', AR: 'es', CO: 'es',
    DE: 'de', AT: 'de',
    GB: 'en', US: 'en', CA: 'en', AU: 'en', IE: 'en', NZ: 'en'
};

// ============================
// API ENDPOINT — POST /api/tracking-webhook
// ============================
module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── Sécurité webhook : vérifier la clé CJ ──
    var cjWebhookKey = process.env.CJ_WEBHOOK_KEY || '';
    if (!cjWebhookKey) {
        console.error('[TRACKING-WH] CJ_WEBHOOK_KEY not configured');
        return res.status(500).json({ error: 'Service indisponible' });
    }
    var providedKey = req.headers['x-cj-webhook-key'] || req.query.key || '';
    if (providedKey !== cjWebhookKey) {
        console.error('[TRACKING-WH] Invalid webhook key');
        return res.status(403).json({ error: 'Non autorisé' });
    }

    // ── Parser le body ──
    var body = req.body || {};
    var trackingNumber = body.trackNumber || body.trackingNumber || body.tracking_number || '';
    var status = body.status || body.logisticStatus || '';
    var carrier = body.logisticName || body.carrier || '';
    var events = body.trackInfo || body.events || [];
    var cjOrderId = body.orderId || body.cj_order_id || '';

    if (!trackingNumber && !cjOrderId) {
        return res.status(400).json({ error: 'trackingNumber or cj_order_id required' });
    }

    console.log('[TRACKING-WH] Update received:', trackingNumber || cjOrderId, '→', status);

    // ── Supabase ──
    var sb;
    try {
        sb = getSupabase();
    } catch (e) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    try {
        // 1. Trouver la commande par numéro de suivi ou cj_order_id
        var order = null;
        var findError = null;

        if (trackingNumber) {
            var result1 = await sb
                .from('orders')
                .select('id, email, status, notes, shipping_address, created_at, tracking_number, carrier')
                .eq('tracking_number', trackingNumber)
                .single();
            order = result1.data;
            findError = result1.error;
        }

        if (!order && cjOrderId) {
            var result2 = await sb
                .from('orders')
                .select('id, email, status, notes, shipping_address, created_at, tracking_number, carrier')
                .eq('cj_order_id', cjOrderId)
                .single();
            order = result2.data;
            findError = result2.error;
        }

        if (findError || !order) {
            console.warn('[TRACKING-WH] Order not found for:', trackingNumber || cjOrderId);
            return res.status(404).json({ error: 'Order not found for this tracking number' });
        }

        // 2. Construire le payload de mise à jour
        var updatePayload = {
            updated_at: new Date().toISOString()
        };

        // Mettre à jour le carrier si fourni
        if (carrier) {
            updatePayload.carrier = carrier;
        }

        // Mettre à jour le tracking_number si pas encore défini
        if (trackingNumber && !order.tracking_number) {
            updatePayload.tracking_number = trackingNumber;
        }

        // 3. Mettre à jour le statut (seulement si progression, pas de retour en arrière)
        var newOrderStatus = CJ_TO_ORDER_STATUS[status] || null;
        var currentIdx = STATUS_ORDER.indexOf(order.status);
        var newIdx = STATUS_ORDER.indexOf(newOrderStatus);

        if (newOrderStatus && newIdx > currentIdx) {
            updatePayload.status = newOrderStatus;
        }

        // 4. Mettre à jour le cache tracking avec les nouveaux événements
        if (events && events.length > 0) {
            updatePayload.tracking_cache = {
                events: events.map(function(evt) {
                    return {
                        date: evt.date || evt.acceptTime || null,
                        rawStatus: evt.status || null,
                        location: evt.acceptAddress || evt.location || null,
                        description: evt.content || evt.desc || ''
                    };
                }),
                carrier: carrier || order.carrier || null
            };
            updatePayload.tracking_cache_at = new Date().toISOString();
        }

        // 5. Sauvegarder la mise à jour dans Supabase
        var updateResult = await sb
            .from('orders')
            .update(updatePayload)
            .eq('id', order.id);

        if (updateResult.error) {
            console.error('[TRACKING-WH] Update error:', updateResult.error.message);
            return res.status(500).json({ error: 'Failed to update order' });
        }

        console.log('[TRACKING-WH] Order updated:', order.id, '→', updatePayload.status || '(no status change)');

        // 6. Envoyer email de notification pour les événements clés
        var shouldEmail = false;
        var emailType = null;

        if (status === 'InTransit' && order.status !== 'shipped' && order.status !== 'delivered') {
            shouldEmail = true;
            emailType = 'shipped';
        } else if (status === 'OutForDelivery' && order.status !== 'delivered') {
            shouldEmail = true;
            emailType = 'in_transit';
        } else if (status === 'Delivered' && order.status !== 'delivered') {
            shouldEmail = true;
            emailType = 'delivered';
        }

        var emailResult = { sent: false, reason: 'no_trigger' };

        if (shouldEmail && order.email) {
            emailResult = await sendTrackingEmail(order, trackingNumber || order.tracking_number, carrier || order.carrier, emailType);
            console.log('[TRACKING-WH] Email:', emailType, emailResult.sent ? 'sent' : 'failed');
        }

        return res.status(200).json({
            received: true,
            orderId: order.id,
            statusUpdated: !!updatePayload.status,
            newStatus: updatePayload.status || null,
            emailSent: emailResult.sent,
            emailType: emailType
        });

    } catch (error) {
        console.error('[TRACKING-WH] Error:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

// ============================
// Envoi email de notification suivi (via Resend)
// ============================
async function sendTrackingEmail(order, trackingNumber, carrier, emailType) {
    var resendApiKey = process.env.RESEND_API_KEY || '';
    if (!resendApiKey || !order.email) {
        return { sent: false, reason: 'No API key or email' };
    }

    // Détecter la langue du client
    var lang = detectClientLang(order);
    var t = EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.fr;

    // Sélectionner le sujet/titre/texte selon le type
    var subject, title, text;
    if (emailType === 'delivered') {
        subject = t.delivered_subject;
        title = t.delivered_title;
        text = t.delivered_text;
    } else if (emailType === 'in_transit') {
        subject = t.in_transit_subject;
        title = t.in_transit_title;
        text = t.in_transit_text;
    } else {
        subject = t.shipped_subject;
        title = t.shipped_title;
        text = t.shipped_text;
    }

    var trackingUrl = 'https://maison-eclat.shop/pages/tracking.html?order=' + encodeURIComponent(order.id) + '&lang=' + lang;
    var orderRef = order.notes || order.id || '';
    if (orderRef.length > 16) orderRef = orderRef.substring(0, 12) + '...';

    // Couleurs ÉCLAT
    var gold = '#c9a87c';
    var dark = '#2d2926';
    var bg = '#faf8f5';
    var cardBg = '#ffffff';
    var border = '#e8e4de';

    // Icônes email par type
    var icon = '&#128666;';
    if (emailType === 'delivered') icon = '&#9989;';
    if (emailType === 'in_transit') icon = '&#9992;&#65039;';

    var html = '<!DOCTYPE html>'
        + '<html lang="' + lang + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>' + escHtmlAttr(subject) + '</title></head>'
        + '<body style="margin:0;padding:0;background:' + bg + ';font-family:\'Helvetica Neue\',Arial,sans-serif;">'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + bg + ';">'
        + '<tr><td align="center" style="padding:24px 16px;">'
        + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

        // Header logo
        + '<tr><td style="padding:32px 0;text-align:center;">'
        + '<a href="https://maison-eclat.shop" style="text-decoration:none;">'
        + '<h1 style="font-family:Georgia,serif;font-size:36px;color:' + dark + ';letter-spacing:6px;margin:0;">&#201;CLAT</h1>'
        + '<p style="font-size:11px;color:' + gold + ';letter-spacing:4px;margin:4px 0 0;text-transform:uppercase;">Maison de Beaut&#233;</p>'
        + '</a></td></tr>'

        // Card principale
        + '<tr><td style="background:' + cardBg + ';border-radius:16px;border:1px solid ' + border + ';padding:40px 32px;text-align:center;">'

        // Icône + titre
        + '<div style="font-size:48px;margin-bottom:16px;">' + icon + '</div>'
        + '<h2 style="font-family:Georgia,serif;font-size:24px;color:' + dark + ';margin:0 0 12px;">' + escHtmlAttr(title) + '</h2>'
        + '<p style="color:#6b6560;font-size:15px;line-height:1.6;margin:0 0 24px;">' + escHtmlAttr(text) + '</p>'

        // Référence commande
        + '<div style="background:' + bg + ';border-radius:12px;padding:16px;margin:0 0 16px;">'
        + '<p style="margin:0 0 4px;font-size:12px;color:#6b6560;">' + escHtmlAttr(t.order_label) + '</p>'
        + '<p style="margin:0;font-size:15px;font-weight:600;color:' + dark + ';">' + escHtmlAttr(orderRef) + '</p>'
        + '</div>'

        // Numéro de suivi
        + (trackingNumber
            ? '<div style="background:' + bg + ';border-radius:12px;padding:16px;margin:0 0 24px;">'
              + '<p style="margin:0 0 4px;font-size:12px;color:#6b6560;">' + escHtmlAttr(t.tracking_label) + '</p>'
              + '<p style="margin:0;font-size:18px;font-weight:700;color:' + dark + ';letter-spacing:1px;font-family:Courier New,monospace;">' + escHtmlAttr(trackingNumber) + '</p>'
              + (carrier ? '<p style="margin:6px 0 0;font-size:12px;color:#6b6560;">' + escHtmlAttr(carrier) + '</p>' : '')
              + '</div>'
            : '')

        // Bouton CTA
        + '<a href="' + trackingUrl + '" style="display:inline-block;background:' + gold + ';color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">'
        + escHtmlAttr(t.track_btn) + '</a>'

        // Incitation avis (seulement pour livré)
        + (emailType === 'delivered'
            ? '<div style="margin-top:24px;padding-top:20px;border-top:1px solid ' + border + ';">'
              + '<p style="font-size:14px;color:#6b6560;margin:0;">&#11088; ' + escHtmlAttr(t.review_text) + '</p>'
              + '</div>'
            : '')

        + '</td></tr>'

        // Footer
        + '<tr><td style="padding:24px 0;text-align:center;">'
        + '<p style="font-size:13px;color:#999;margin:0 0 8px;">' + escHtmlAttr(t.help_text) + ' <a href="mailto:contact@maison-eclat.shop" style="color:' + gold + ';">contact@maison-eclat.shop</a></p>'
        + '<p style="font-size:11px;color:#bbb;margin:0;">&copy; 2026 &Eacute;CLAT &mdash; Maison &Eacute;clat. Tous droits r&eacute;serv&eacute;s.</p>'
        + '</td></tr>'

        + '</table></td></tr></table></body></html>';

    try {
        var response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + resendApiKey
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM || 'ÉCLAT Beauté <noreply@maison-eclat.shop>',
                to: order.email,
                subject: subject,
                html: html
            })
        });

        var resData = await response.json().catch(function() { return {}; });

        if (!response.ok) {
            console.error('[TRACKING-WH] Resend error:', response.status, JSON.stringify(resData));
        }

        return { sent: response.ok, detail: resData };
    } catch (err) {
        console.error('[TRACKING-WH] Email send error:', err.message);
        return { sent: false, error: err.message };
    }
}

// ============================
// Échapper HTML pour attributs email
// ============================
function escHtmlAttr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================
// Détecter la langue du client depuis le pays de livraison
// ============================
function detectClientLang(order) {
    var country = '';
    if (order.shipping_address) {
        try {
            var addr = typeof order.shipping_address === 'string'
                ? JSON.parse(order.shipping_address)
                : order.shipping_address;
            country = ((addr.address && addr.address.country) || addr.country || '').toUpperCase();
        } catch (e) {
            country = '';
        }
    }

    return COUNTRY_LANG[country] || 'fr';
}
