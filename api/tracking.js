// ============================
// ÉCLAT - Suivi de commande (Tracking API)
// GET /api/tracking?orderId=XXX ou ?trackingNumber=XXX
// Auth optionnel : Bearer token Supabase (si authentifié, vérifie propriétaire)
// Sans auth : recherche par email + orderId (query params)
// Utilise CJ Dropshipping API v2.0 pour les infos transporteur
// Cache 2h dans Supabase pour limiter les appels CJ
// Fallback 17track.net pour suivi externe international
// ============================

var { verifyAuth, getSupabase } = require('./_middleware/auth');
var { applyRateLimit } = require('./_middleware/rateLimit');

// CJDropshipping API
var CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

// Durée de cache tracking : 2 heures (en millisecondes)
var CACHE_TTL_MS = 2 * 60 * 60 * 1000;

// Origines autorisées pour CORS
var ALLOWED_ORIGINS = [
    'https://eclat-boutique.vercel.app',
    'https://maison-eclat.shop',
    'https://www.maison-eclat.shop'
];

// ============================
// Mapping statuts CJ → clé interne
// ============================
var STATUS_MAP = {
    'InfoReceived':     'prepared',
    'InTransit':        'in_transit',
    'OutForDelivery':   'out_for_delivery',
    'Delivered':        'delivered',
    'AttemptFail':      'attempt_failed',
    'Exception':        'exception',
    'Expired':          'expired',
    'Pending':          'ordered'
};

// ============================
// Libellés multilingues par statut
// ============================
var STATUS_LABELS = {
    ordered: {
        fr: 'Commande confirmée',
        en: 'Order confirmed',
        es: 'Pedido confirmado',
        de: 'Bestellung bestätigt'
    },
    prepared: {
        fr: 'Colis préparé',
        en: 'Package prepared',
        es: 'Paquete preparado',
        de: 'Paket vorbereitet'
    },
    shipped: {
        fr: 'Expédié',
        en: 'Shipped',
        es: 'Enviado',
        de: 'Versendet'
    },
    in_transit: {
        fr: 'En transit',
        en: 'In transit',
        es: 'En tránsito',
        de: 'Unterwegs'
    },
    out_for_delivery: {
        fr: 'En cours de livraison',
        en: 'Out for delivery',
        es: 'En reparto',
        de: 'Zustellung läuft'
    },
    delivered: {
        fr: 'Livré',
        en: 'Delivered',
        es: 'Entregado',
        de: 'Zugestellt'
    },
    attempt_failed: {
        fr: 'Tentative de livraison échouée',
        en: 'Delivery attempt failed',
        es: 'Intento de entrega fallido',
        de: 'Zustellversuch fehlgeschlagen'
    },
    exception: {
        fr: 'Incident de livraison',
        en: 'Delivery exception',
        es: 'Incidencia de envío',
        de: 'Lieferproblem'
    },
    expired: {
        fr: 'Suivi expiré',
        en: 'Tracking expired',
        es: 'Seguimiento expirado',
        de: 'Sendungsverfolgung abgelaufen'
    }
};

// ============================
// Descriptions d'événements → multilingues
// ============================
var EVENT_DESCRIPTIONS = {
    fr: {
        'picked_up':        'Colis pris en charge par le transporteur',
        'departed':         'Colis parti du centre de tri',
        'arrived':          'Colis arrivé au centre de tri',
        'customs':          'En cours de dédouanement',
        'customs_cleared':  'Dédouanement terminé',
        'out_for_delivery': 'En cours de livraison',
        'delivered':        'Colis livré',
        'attempt_failed':   'Tentative de livraison échouée',
        'info_received':    'Information reçue par le transporteur',
        'returned':         'Colis retourné à l\'expéditeur'
    },
    en: {
        'picked_up':        'Package picked up by carrier',
        'departed':         'Package departed sorting facility',
        'arrived':          'Package arrived at sorting facility',
        'customs':          'In customs clearance',
        'customs_cleared':  'Customs clearance completed',
        'out_for_delivery': 'Out for delivery',
        'delivered':        'Package delivered',
        'attempt_failed':   'Delivery attempt failed',
        'info_received':    'Shipment information received by carrier',
        'returned':         'Package returned to sender'
    },
    es: {
        'picked_up':        'Paquete recogido por el transportista',
        'departed':         'Paquete salió del centro de distribución',
        'arrived':          'Paquete llegó al centro de distribución',
        'customs':          'En proceso de aduanas',
        'customs_cleared':  'Despacho de aduanas completado',
        'out_for_delivery': 'En reparto',
        'delivered':        'Paquete entregado',
        'attempt_failed':   'Intento de entrega fallido',
        'info_received':    'Información de envío recibida por el transportista',
        'returned':         'Paquete devuelto al remitente'
    },
    de: {
        'picked_up':        'Paket vom Spediteur abgeholt',
        'departed':         'Paket hat Sortierzentrum verlassen',
        'arrived':          'Paket im Sortierzentrum angekommen',
        'customs':          'Wird verzollt',
        'customs_cleared':  'Zollabfertigung abgeschlossen',
        'out_for_delivery': 'Zustellung läuft',
        'delivered':        'Paket zugestellt',
        'attempt_failed':   'Zustellversuch fehlgeschlagen',
        'info_received':    'Sendungsinformation vom Spediteur empfangen',
        'returned':         'Paket an Absender zurückgesendet'
    }
};

// ============================
// Carrier URL mapping — lien de suivi externe
// ============================
var CARRIER_URLS = {
    'yanwen':       'https://track.yanwen.com.cn/en/packages?trackingNumber=',
    'cainiao':      'https://global.cainiao.com/detail.htm?mailNoList=',
    '4px':          'https://track.4px.com/#/result/0/',
    'cne':          'https://www.cne.com/English/Tracking?tracking_number=',
    'ubi':          'https://www.ubilogistics.com/tracking/?trackno=',
    'yun':          'https://www.yuntrack.com/Track/Detail/',
    'postnl':       'https://postnl.post/track-and-trace/?B=',
    'dhl':          'https://www.dhl.com/fr-fr/home/suivi.html?tracking-id=',
    'colissimo':    'https://www.laposte.fr/outils/suivre-vos-envois?code=',
    'dpd':          'https://tracking.dpd.de/status/fr_FR/parcel/',
    'gls':          'https://gls-group.eu/FR/fr/suivi-colis?match=',
    'chronopost':   'https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=',
    'fedex':        'https://www.fedex.com/fedextrack/?trknbr=',
    'ups':          'https://www.ups.com/track?tracknum=',
    'usps':         'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    'royal_mail':   'https://www.royalmail.com/track-your-item#/tracking-results/',
    'correos':      'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=',
    'deutsche_post':'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode='
};

function getCarrierUrl(carrier, trackingNumber) {
    if (!carrier || !trackingNumber) return null;
    var key = carrier.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var name in CARRIER_URLS) {
        if (key.indexOf(name) !== -1) {
            return CARRIER_URLS[name] + trackingNumber;
        }
    }
    // Fallback : 17track (international)
    return 'https://t.17track.net/fr#nums=' + trackingNumber;
}

// ============================
// Appel CJ API — tracking events
// ============================
async function fetchCJTracking(trackingNumber, cjAccessToken) {
    try {
        var response = await fetch(CJ_API_BASE + '/logistic/getTrackInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': cjAccessToken
            },
            body: JSON.stringify({ trackNumber: trackingNumber })
        });

        var data = await response.json();

        if (data.result && data.data) {
            return {
                success: true,
                carrier: data.data.logisticName || null,
                rawStatus: data.data.status || null,
                events: (data.data.trackInfo || []).map(function(evt) {
                    return {
                        date: evt.date || evt.acceptTime || null,
                        rawStatus: evt.status || null,
                        location: evt.acceptAddress || evt.location || null,
                        description: evt.content || evt.desc || ''
                    };
                })
            };
        }

        return { success: false, error: data.message || 'No tracking data' };
    } catch (err) {
        console.error('[TRACKING] CJ API error:', err.message);
        return { success: false, error: err.message };
    }
}

// ============================
// Résoudre le statut global à partir des événements
// ============================
function resolveGlobalStatus(events, orderStatus) {
    if (!events || events.length === 0) {
        if (orderStatus === 'shipped') return 'shipped';
        if (orderStatus === 'delivered') return 'delivered';
        if (orderStatus === 'processing') return 'prepared';
        return 'ordered';
    }

    // Le dernier événement détermine le statut (tri descendant)
    var lastEvent = events[0];
    var rawStatus = (lastEvent.rawStatus || '').trim();
    var mapped = STATUS_MAP[rawStatus];

    if (mapped) return mapped;

    // Fallback : mots-clés dans la description
    var desc = (lastEvent.description || '').toLowerCase();
    if (desc.indexOf('deliver') !== -1 && desc.indexOf('out') !== -1) return 'out_for_delivery';
    if (desc.indexOf('deliver') !== -1 || desc.indexOf('livr') !== -1 || desc.indexOf('zugestellt') !== -1 || desc.indexOf('entregado') !== -1) return 'delivered';
    if (desc.indexOf('out for delivery') !== -1 || desc.indexOf('en cours de livraison') !== -1) return 'out_for_delivery';
    if (desc.indexOf('customs') !== -1 || desc.indexOf('douane') !== -1 || desc.indexOf('zoll') !== -1 || desc.indexOf('aduana') !== -1) return 'in_transit';
    if (desc.indexOf('transit') !== -1 || desc.indexOf('departed') !== -1 || desc.indexOf('arrived') !== -1) return 'in_transit';
    if (desc.indexOf('picked up') !== -1 || desc.indexOf('accepted') !== -1 || desc.indexOf('info received') !== -1) return 'shipped';

    return 'in_transit';
}

// ============================
// Calculer date de livraison estimée
// ============================
function estimateDelivery(orderCreatedAt, shippingCountry) {
    var orderDate = new Date(orderCreatedAt);
    var minDays = 7;
    var maxDays = 14;

    var country = (shippingCountry || '').toUpperCase();
    if (country === 'FR' || country === 'BE' || country === 'LU') {
        minDays = 7; maxDays = 14;
    } else if (country === 'DE' || country === 'AT' || country === 'CH') {
        minDays = 7; maxDays = 14;
    } else if (country === 'ES' || country === 'PT' || country === 'IT') {
        minDays = 10; maxDays = 18;
    } else if (country === 'GB' || country === 'NL' || country === 'IE') {
        minDays = 8; maxDays = 16;
    } else {
        minDays = 12; maxDays = 25;
    }

    var minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + minDays);
    var maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + maxDays);

    return {
        min: minDate.toISOString().split('T')[0],
        max: maxDate.toISOString().split('T')[0]
    };
}

// ============================
// Extraire le pays de livraison
// ============================
function extractShippingCountry(order) {
    var country = 'FR';
    if (order.shipping_address) {
        try {
            var addr = typeof order.shipping_address === 'string'
                ? JSON.parse(order.shipping_address)
                : order.shipping_address;
            country = (addr.address && addr.address.country) || addr.country || 'FR';
        } catch (e) {
            country = 'FR';
        }
    }
    return country.toUpperCase();
}

// ============================
// Détecter le type d'événement à partir de la description
// ============================
function detectEventType(description) {
    if (!description) return null;
    var desc = description.toLowerCase();

    if (desc.indexOf('deliver') !== -1 && desc.indexOf('out') !== -1) return 'out_for_delivery';
    if (desc.indexOf('deliver') !== -1 || desc.indexOf('livr') !== -1) return 'delivered';
    if (desc.indexOf('customs') !== -1 && desc.indexOf('clear') !== -1) return 'customs_cleared';
    if (desc.indexOf('customs') !== -1 || desc.indexOf('douane') !== -1 || desc.indexOf('zoll') !== -1) return 'customs';
    if (desc.indexOf('depart') !== -1) return 'departed';
    if (desc.indexOf('arriv') !== -1) return 'arrived';
    if (desc.indexOf('picked') !== -1 || desc.indexOf('accepted') !== -1) return 'picked_up';
    if (desc.indexOf('attempt') !== -1 || desc.indexOf('fail') !== -1) return 'attempt_failed';
    if (desc.indexOf('return') !== -1) return 'returned';
    if (desc.indexOf('info') !== -1 && desc.indexOf('received') !== -1) return 'info_received';

    return null;
}

// ============================
// API ENDPOINT — GET /api/tracking
// ============================
module.exports = async function(req, res) {
    // ── CORS ──
    var origin = req.headers.origin || '';
    var allowedOrigin = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'public')) return;
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // ── Paramètres ──
    var orderId = req.query.orderId || '';
    var trackingNumber = req.query.trackingNumber || '';
    var email = req.query.email || '';
    var lang = req.query.lang || 'fr';
    if (['fr', 'en', 'es', 'de'].indexOf(lang) === -1) lang = 'fr';

    if (!orderId && !trackingNumber) {
        return res.status(400).json({ error: 'orderId or trackingNumber required' });
    }

    // ── Auth (optionnel) ──
    var authResult = null;
    var authHeader = req.headers.authorization || '';
    if (authHeader && authHeader.indexOf('Bearer ') === 0) {
        authResult = await verifyAuth(req);
    }

    // ── Supabase ──
    var sb;
    try {
        sb = getSupabase();
    } catch (e) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    try {
        // 1. Récupérer la commande
        var order = null;
        var orderError = null;

        if (orderId) {
            var result = await sb
                .from('orders')
                .select('id, user_id, email, status, tracking_number, carrier, tracking_url, fulfillment_status, shipping_address, notes, created_at, updated_at, tracking_cache, tracking_cache_at, cj_order_id')
                .eq('id', orderId)
                .single();
            order = result.data;
            orderError = result.error;
        } else if (trackingNumber) {
            var result2 = await sb
                .from('orders')
                .select('id, user_id, email, status, tracking_number, carrier, tracking_url, fulfillment_status, shipping_address, notes, created_at, updated_at, tracking_cache, tracking_cache_at, cj_order_id')
                .eq('tracking_number', trackingNumber)
                .single();
            order = result2.data;
            orderError = result2.error;
        }

        if (orderError || !order) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }

        // 2. Vérifier l'accès — auth OU email
        var hasAccess = false;

        if (authResult) {
            // Authentifié : vérifier que la commande appartient à l'utilisateur
            if (order.email === authResult.email) {
                hasAccess = true;
            } else if (order.user_id === authResult.userId) {
                hasAccess = true;
            } else {
                // Double-check via user_id
                var ownerCheck = await sb
                    .from('orders')
                    .select('id')
                    .eq('id', order.id)
                    .eq('user_id', authResult.userId)
                    .single();
                if (ownerCheck.data) hasAccess = true;
            }
        } else if (email) {
            // Non authentifié : vérifier via email
            if (order.email && order.email.toLowerCase() === email.toLowerCase()) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return res.status(403).json({ error: 'Accès non autorisé à cette commande' });
        }

        // 3. Pays de livraison
        var shippingCountry = extractShippingCountry(order);

        // 4. Vérifier le cache tracking (2h TTL)
        var now = Date.now();
        var cachedData = null;
        if (order.tracking_cache && order.tracking_cache_at) {
            var cacheAge = now - new Date(order.tracking_cache_at).getTime();
            if (cacheAge < CACHE_TTL_MS) {
                try {
                    cachedData = typeof order.tracking_cache === 'string'
                        ? JSON.parse(order.tracking_cache)
                        : order.tracking_cache;
                } catch (e) {
                    cachedData = null;
                }
            }
        }

        // 5. Si pas de cache valide et numéro de suivi disponible, appeler CJ API
        var trackingEvents = [];
        var carrier = order.carrier || null;

        if (cachedData) {
            trackingEvents = cachedData.events || [];
            carrier = cachedData.carrier || carrier;
        } else if (order.tracking_number) {
            var cjAccessToken = process.env.CJ_ACCESS_TOKEN || process.env.CJ_API_KEY || '';
            if (cjAccessToken) {
                var cjResult = await fetchCJTracking(order.tracking_number, cjAccessToken);
                if (cjResult.success) {
                    trackingEvents = cjResult.events;
                    if (cjResult.carrier) carrier = cjResult.carrier;

                    // Sauvegarder en cache
                    var cachePayload = {
                        events: trackingEvents,
                        carrier: carrier
                    };
                    await sb.from('orders').update({
                        tracking_cache: cachePayload,
                        tracking_cache_at: new Date().toISOString(),
                        carrier: carrier || order.carrier
                    }).eq('id', order.id);
                }
            }
        }

        // 6. Trier les événements (plus récent en premier)
        trackingEvents.sort(function(a, b) {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });

        // 7. Résoudre le statut global
        var globalStatus = resolveGlobalStatus(trackingEvents, order.status);

        // 8. Formater les événements (multilingue)
        var formattedEvents = trackingEvents.map(function(evt) {
            var desc = evt.description || '';
            var eventType = detectEventType(desc);

            var localizedDesc = desc;
            if (eventType && EVENT_DESCRIPTIONS[lang] && EVENT_DESCRIPTIONS[lang][eventType]) {
                localizedDesc = EVENT_DESCRIPTIONS[lang][eventType];
            }

            return {
                date: evt.date || null,
                status: eventType || 'update',
                location: evt.location || null,
                description: localizedDesc
            };
        });

        // 9. Lien de suivi externe (priorité : tracking_url stocké, puis carrier URL, puis 17track)
        var trackingUrl = order.tracking_url || getCarrierUrl(carrier, order.tracking_number);

        // 10. Livraison estimée
        var estimated = estimateDelivery(order.created_at, shippingCountry);

        // 11. Réponse JSON
        return res.status(200).json({
            orderId: order.id,
            orderRef: order.notes || order.id,
            orderDate: order.created_at,
            status: globalStatus,
            statusLabel: (STATUS_LABELS[globalStatus] || STATUS_LABELS.ordered)[lang],
            trackingNumber: order.tracking_number || null,
            trackingUrl: trackingUrl,
            carrier: carrier,
            estimatedDelivery: estimated,
            events: formattedEvents,
            cachedAt: order.tracking_cache_at || null
        });

    } catch (error) {
        console.error('[TRACKING] Error:', error.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
