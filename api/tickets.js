// ============================
// ÉCLAT — Système de Tickets SAV
// CRUD tickets avec statut, priorité, historique
// ============================

const { createClient } = require('@supabase/supabase-js');

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Table SQL à créer :
// CREATE TABLE IF NOT EXISTS support_tickets (
//   id SERIAL PRIMARY KEY,
//   ticket_ref VARCHAR(20) UNIQUE NOT NULL,
//   user_id UUID REFERENCES auth.users(id),
//   email VARCHAR(255) NOT NULL,
//   name VARCHAR(255),
//   category VARCHAR(50) NOT NULL, -- order, product, return, delivery, payment, other
//   subject VARCHAR(255) NOT NULL,
//   status VARCHAR(20) DEFAULT 'open', -- open, in_progress, waiting_customer, resolved, closed
//   priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
//   order_id VARCHAR(100),
//   messages JSONB DEFAULT '[]'::jsonb,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW(),
//   resolved_at TIMESTAMPTZ
// );
// CREATE INDEX idx_tickets_user ON support_tickets(user_id);
// CREATE INDEX idx_tickets_status ON support_tickets(status);
// CREATE INDEX idx_tickets_ref ON support_tickets(ticket_ref);

function generateTicketRef() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var ref = 'TK-';
    for (var i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
}

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    // Auth
    const authHeader = req.headers.authorization;
    let userId = null;
    let userEmail = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
            userId = user.id;
            userEmail = user.email;
        }
    }

    try {
        // GET — Liste des tickets de l'utilisateur
        if (req.method === 'GET') {
            if (!userId) return res.status(401).json({ error: 'Connexion requise' });

            const { ticketRef } = req.query;

            // Détail d'un ticket
            if (ticketRef) {
                const { data, error } = await supabase
                    .from('support_tickets')
                    .select('*')
                    .eq('ticket_ref', ticketRef)
                    .eq('user_id', userId)
                    .single();

                if (error || !data) return res.status(404).json({ error: 'Ticket introuvable' });
                return res.status(200).json({ ticket: data });
            }

            // Liste des tickets
            const { data, error } = await supabase
                .from('support_tickets')
                .select('id, ticket_ref, category, subject, status, priority, created_at, updated_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) return res.status(500).json({ error: 'Erreur serveur' });
            return res.status(200).json({ tickets: data || [] });
        }

        // POST — Créer un nouveau ticket
        if (req.method === 'POST') {
            const { category, subject, message, email, name, orderId } = req.body;

            if (!subject || !message || !category) {
                return res.status(400).json({ error: 'Champs requis : category, subject, message' });
            }

            const validCategories = ['order', 'product', 'return', 'delivery', 'payment', 'other'];
            if (validCategories.indexOf(category) === -1) {
                return res.status(400).json({ error: 'Catégorie invalide' });
            }

            if (!userId && !email) {
                return res.status(400).json({ error: 'Email requis si non connecté' });
            }

            const ticketEmail = userEmail || email;
            const ticketRef = generateTicketRef();
            const now = new Date().toISOString();

            const messages = [{
                from: 'customer',
                name: name || 'Client',
                message: message,
                date: now
            }];

            // Auto-priorité basée sur catégorie
            let priority = 'normal';
            if (category === 'payment') priority = 'high';
            if (category === 'return' || category === 'delivery') priority = 'normal';

            const { data, error } = await supabase
                .from('support_tickets')
                .insert({
                    ticket_ref: ticketRef,
                    user_id: userId,
                    email: ticketEmail,
                    name: name || null,
                    category: category,
                    subject: subject.substring(0, 255),
                    status: 'open',
                    priority: priority,
                    order_id: orderId || null,
                    messages: messages,
                    created_at: now,
                    updated_at: now
                })
                .select()
                .single();

            if (error) {
                // Si le ref existe déjà (rare), réessayer
                if (error.code === '23505') {
                    return res.status(500).json({ error: 'Erreur, veuillez réessayer' });
                }
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            // Envoyer email de confirmation au client
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + resendKey },
                    body: JSON.stringify({
                        from: 'ÉCLAT Support <contact@maison-eclat.shop>',
                        to: ticketEmail,
                        subject: 'Ticket ' + ticketRef + ' créé — ÉCLAT Support',
                        html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">' +
                            '<h1 style="font-family:Georgia,serif;color:#2d2926;letter-spacing:3px;">ÉCLAT</h1>' +
                            '<p>Bonjour,</p>' +
                            '<p>Votre demande a bien été enregistrée sous la référence <strong>' + ticketRef + '</strong>.</p>' +
                            '<p>Catégorie : ' + escapeHtml(category) + '</p>' +
                            '<p>Sujet : ' + escapeHtml(subject) + '</p>' +
                            '<p>Nous vous répondrons sous 24h maximum.</p>' +
                            '<p style="color:#c9a87c;font-weight:600;">L\'équipe ÉCLAT</p></div>'
                    })
                }).catch(function() {});
            }

            // Notifier l'admin
            const contactRecipient = process.env.CONTACT_RECIPIENT;
            if (resendKey && contactRecipient) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + resendKey },
                    body: JSON.stringify({
                        from: 'ÉCLAT System <contact@maison-eclat.shop>',
                        to: contactRecipient,
                        subject: '[TICKET ' + priority.toUpperCase() + '] ' + ticketRef + ' — ' + subject,
                        html: '<p><strong>Nouveau ticket SAV</strong></p>' +
                            '<p>Ref: ' + ticketRef + '</p>' +
                            '<p>Client: ' + ticketEmail + '</p>' +
                            '<p>Catégorie: ' + escapeHtml(category) + '</p>' +
                            '<p>Message: ' + escapeHtml(message.substring(0, 500)) + '</p>'
                    })
                }).catch(function() {});
            }

            return res.status(201).json({
                success: true,
                ticket: { ticket_ref: ticketRef, status: 'open', category: category }
            });
        }

        // PATCH — Ajouter un message à un ticket existant
        if (req.method === 'PATCH') {
            if (!userId) return res.status(401).json({ error: 'Connexion requise' });

            const { ticketRef, message } = req.body;
            if (!ticketRef || !message) {
                return res.status(400).json({ error: 'ticketRef et message requis' });
            }

            // Récupérer le ticket
            const { data: ticket, error: fetchError } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('ticket_ref', ticketRef)
                .eq('user_id', userId)
                .single();

            if (fetchError || !ticket) return res.status(404).json({ error: 'Ticket introuvable' });

            if (ticket.status === 'closed' || ticket.status === 'resolved') {
                return res.status(400).json({ error: 'Ce ticket est fermé' });
            }

            const now = new Date().toISOString();
            const updatedMessages = [...(ticket.messages || []), {
                from: 'customer',
                message: message,
                date: now
            }];

            const { error: updateError } = await supabase
                .from('support_tickets')
                .update({
                    messages: updatedMessages,
                    status: 'open',
                    updated_at: now
                })
                .eq('id', ticket.id);

            if (updateError) return res.status(500).json({ error: 'Erreur serveur' });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error('[tickets]', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
