// ============================
// ÉCLAT — Job Queue Worker v2
// Traite les jobs en background : emails, sync stock, fulfillment
// Appelé par Vercel Cron (ou manuellement)
// GET /api/v2/jobs — Process pending jobs
// ============================

const { getSupabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
    // Cron jobs Vercel envoient un header Authorization
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization?.replace('Bearer ', '');

    if (cronSecret && authHeader !== cronSecret && authHeader !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    try {
        // Récupérer les jobs en attente (max 10 par exécution)
        const { data: jobs, error } = await supabase
            .from('job_queue')
            .select('*')
            .eq('status', 'pending')
            .lte('scheduled_at', new Date().toISOString())
            .lt('attempts', 3)
            .order('scheduled_at', { ascending: true })
            .limit(10);

        if (error || !jobs || jobs.length === 0) {
            return res.status(200).json({ processed: 0, message: 'No pending jobs' });
        }

        let processed = 0;
        let failed = 0;

        for (const job of jobs) {
            // Marquer comme "processing"
            await supabase.from('job_queue')
                .update({ status: 'processing', attempts: job.attempts + 1 })
                .eq('id', job.id);

            try {
                await processJob(job, supabase);
                await supabase.from('job_queue')
                    .update({ status: 'completed', completed_at: new Date().toISOString() })
                    .eq('id', job.id);
                processed++;
            } catch (jobErr) {
                const newStatus = job.attempts + 1 >= job.max_attempts ? 'failed' : 'pending';
                await supabase.from('job_queue')
                    .update({ status: newStatus, error: jobErr.message })
                    .eq('id', job.id);
                failed++;
            }
        }

        return res.status(200).json({ processed, failed, total: jobs.length });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

async function processJob(job, supabase) {
    switch (job.type) {
        case 'send_email':
            return await sendEmailJob(job.payload);

        case 'send_sms':
            return await sendSMSJob(job.payload);

        case 'sync_stock':
            return await syncStockJob(job.payload, supabase);

        case 'request_review':
            return await requestReviewJob(job.payload);

        case 'fulfill_order':
            return await fulfillOrderJob(job.payload, supabase);

        case 'expire_reservations':
            return await expireReservationsJob(supabase);

        default:
            throw new Error(`Unknown job type: ${job.type}`);
    }
}

async function sendEmailJob(payload) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) throw new Error('RESEND_API_KEY not configured');

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
            from: 'ÉCLAT Beauté <contact@maison-eclat.shop>',
            to: payload.to,
            subject: payload.subject,
            html: payload.html
        })
    });

    if (!response.ok) throw new Error(`Email failed: ${response.status}`);
}

async function sendSMSJob(payload) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) throw new Error('BREVO_API_KEY not configured');

    const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
        },
        body: JSON.stringify({
            type: 'transactional',
            unicodeEnabled: true,
            sender: 'MaisonEclat',
            recipient: payload.phone,
            content: payload.message
        })
    });

    if (!response.ok) throw new Error(`SMS failed: ${response.status}`);
}

async function syncStockJob(payload, supabase) {
    const cjApiKey = process.env.CJ_API_KEY;
    if (!cjApiKey) return;

    // Récupérer les produits avec leur SKU fournisseur
    const { data: mappings } = await supabase
        .from('product_suppliers')
        .select('product_id, supplier_sku')
        .eq('supplier_id', 1); // CJ

    for (const mapping of (mappings || [])) {
        try {
            // Appeler l'API CJ pour vérifier le stock
            const tokenResp = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: '', password: '', apiKey: cjApiKey })
            });
            // Note: implémentation complète à adapter selon l'API CJ réelle
        } catch (e) {
            console.error(`Stock sync failed for product ${mapping.product_id}:`, e.message);
        }
    }
}

async function requestReviewJob(payload) {
    // Envoyer un email de demande d'avis
    return await sendEmailJob({
        to: payload.email,
        subject: 'Comment trouvez-vous vos produits ÉCLAT ?',
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h1 style="font-family:Georgia,serif;color:#2d2926;">ÉCLAT</h1>
            <h2>Votre avis compte !</h2>
            <p>Bonjour ${payload.name || ''},</p>
            <p>Cela fait 14 jours que vous avez reçu votre commande. Comment trouvez-vous vos produits ?</p>
            <p>Votre avis aide d'autres clients à faire le bon choix.</p>
            <a href="https://maison-eclat.shop/pages/account.html#reviews" style="display:inline-block;background:#2d2926;color:#fff;padding:14px 32px;border-radius:30px;text-decoration:none;font-weight:600;">Laisser un avis</a>
            <p style="margin-top:24px;color:#999;font-size:0.85rem;">En remerciement, recevez -10% sur votre prochaine commande avec le code <strong>MERCI10</strong></p>
        </div>`
    });
}

async function fulfillOrderJob(payload, supabase) {
    // Logique de fulfillment auto (délégué à l'API fulfillment existante)
    const response = await fetch(`${payload.base_url}/api/fulfillment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`
        },
        body: JSON.stringify({ order_id: payload.order_id })
    });

    if (!response.ok) throw new Error(`Fulfillment failed: ${response.status}`);
}

async function expireReservationsJob(supabase) {
    // Expirer les réservations de stock dépassées
    const { data: expired } = await supabase
        .from('stock_reservations')
        .select('product_id, quantity')
        .eq('status', 'active')
        .lt('expires_at', new Date().toISOString());

    for (const reservation of (expired || [])) {
        // Libérer le stock réservé
        await supabase.rpc('release_stock', {
            p_product_id: reservation.product_id,
            p_quantity: reservation.quantity
        });
    }

    // Marquer comme expirées
    await supabase
        .from('stock_reservations')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('expires_at', new Date().toISOString());
}
