// ============================
// ÉCLAT — Génération Facture HTML
// GET /api/invoice?orderId=XXX — Retourne une facture HTML imprimable
// Conforme Art. 289 CGI (France) — Mentions obligatoires
// ============================

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    // Auth check - Supabase JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

        // Récupérer la commande
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single();

        if (orderError || !order) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }

        // Numéro de facture
        const invoiceNum = 'FAC-' + new Date(order.created_at).getFullYear() + '-' + String(order.id).padStart(6, '0');
        const orderDate = new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

        // Calculs
        const subtotal = order.total;
        const shipping = subtotal >= 29 ? 0 : 3.90;
        const totalTTC = subtotal + shipping;
        // Micro-entreprise = pas de TVA (Art. 293 B du CGI)
        const tvaNote = 'TVA non applicable, art. 293 B du CGI';

        // Adresse client
        const addr = order.shipping_details || order.customer_details || {};
        const customerName = addr.name || user.user_metadata?.full_name || user.email;
        const customerAddr = addr.address ?
            [addr.address.line1, addr.address.line2, addr.address.postal_code + ' ' + addr.address.city, addr.address.country].filter(Boolean).join('<br>') :
            '';

        // Items
        const itemsHTML = (order.order_items || []).map(function(item) {
            const qty = item.quantity || 1;
            const unitPrice = item.price || item.unit_amount / 100;
            const lineTotal = unitPrice * qty;
            return `<tr>
                <td style="padding:10px 12px;border-bottom:1px solid #e8e4de;">${item.product_name || item.description || 'Produit'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e8e4de;text-align:center;">${qty}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e8e4de;text-align:right;">${unitPrice.toFixed(2).replace('.', ',')} &euro;</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e8e4de;text-align:right;font-weight:600;">${lineTotal.toFixed(2).replace('.', ',')} &euro;</td>
            </tr>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Facture ${invoiceNum} — ÉCLAT</title>
<style>
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2d2926; background: #fff; margin: 0; padding: 40px; font-size: 14px; line-height: 1.6; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
    .logo { font-family: Georgia, serif; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #2d2926; }
    .logo-sub { font-size: 11px; color: #6b6560; letter-spacing: 1px; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-family: Georgia, serif; font-size: 24px; color: #c9a87c; margin: 0 0 8px; }
    .invoice-meta p { margin: 2px 0; font-size: 13px; color: #6b6560; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address-block { flex: 1; }
    .address-block h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #c9a87c; margin: 0 0 8px; }
    .address-block p { margin: 0; font-size: 13px; color: #2d2926; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { background: #2d2926; color: #fff; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:first-child { text-align: left; border-radius: 6px 0 0 0; }
    thead th:last-child { text-align: right; border-radius: 0 6px 0 0; }
    .totals { display: flex; justify-content: flex-end; margin-top: 16px; }
    .totals-table { width: 280px; }
    .totals-table .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .totals-table .row.total { border-top: 2px solid #2d2926; padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: 700; }
    .footer-note { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8e4de; font-size: 11px; color: #6b6560; text-align: center; }
    .stamp { display: inline-block; border: 2px solid #4caf50; color: #4caf50; padding: 6px 20px; border-radius: 4px; font-weight: 700; font-size: 14px; transform: rotate(-5deg); margin-top: 16px; }
    @media print { body { padding: 0; } .no-print { display: none; } }
</style>
</head>
<body>

<div class="no-print" style="text-align:center;margin-bottom:24px;">
    <button onclick="window.print()" style="padding:12px 32px;background:#2d2926;color:#fff;border:none;border-radius:24px;font-size:14px;cursor:pointer;font-weight:600;">Imprimer / T&eacute;l&eacute;charger PDF</button>
</div>

<div class="invoice-header">
    <div>
        <div class="logo">&Eacute;CLAT</div>
        <div class="logo-sub">Beaut&eacute; &amp; Wellness Premium</div>
    </div>
    <div class="invoice-meta">
        <h2>FACTURE</h2>
        <p><strong>${invoiceNum}</strong></p>
        <p>Date : ${orderDate}</p>
        <p>Commande : #${order.id}</p>
        ${order.status === 'paid' || order.status === 'delivered' ? '<div class="stamp">PAY&Eacute;E</div>' : ''}
    </div>
</div>

<div class="addresses">
    <div class="address-block">
        <h4>Vendeur</h4>
        <p><strong>Maison &Eacute;clat</strong></p>
        <p>Kevin — Micro-entreprise</p>
        <p>SIRET : [En cours d'immatriculation]</p>
        <p>contact@maison-eclat.shop</p>
        <p>maison-eclat.shop</p>
    </div>
    <div class="address-block" style="text-align:right;">
        <h4>Client</h4>
        <p><strong>${customerName}</strong></p>
        <p>${customerAddr || user.email}</p>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th style="text-align:left;">D&eacute;signation</th>
            <th style="text-align:center;">Qt&eacute;</th>
            <th style="text-align:right;">Prix unit. HT</th>
            <th style="text-align:right;">Total HT</th>
        </tr>
    </thead>
    <tbody>
        ${itemsHTML}
    </tbody>
</table>

<div class="totals">
    <div class="totals-table">
        <div class="row"><span>Sous-total HT</span><strong>${subtotal.toFixed(2).replace('.', ',')} &euro;</strong></div>
        <div class="row"><span>Livraison</span><strong>${shipping === 0 ? 'Offerte' : shipping.toFixed(2).replace('.', ',') + ' €'}</strong></div>
        <div class="row"><span>TVA</span><em style="font-size:11px;">Non applicable</em></div>
        <div class="row total"><span>TOTAL TTC</span><strong>${totalTTC.toFixed(2).replace('.', ',')} &euro;</strong></div>
    </div>
</div>

<div class="footer-note">
    <p><strong>${tvaNote}</strong></p>
    <p>Maison &Eacute;clat &mdash; Micro-entreprise immatricul&eacute;e en France</p>
    <p>Conditions de paiement : paiement imm&eacute;diat par carte bancaire via Stripe</p>
    <p>En cas de retard de paiement : p&eacute;nalit&eacute; de 3x le taux d'int&eacute;r&ecirc;t l&eacute;gal + indemnit&eacute; forfaitaire de 40&euro;</p>
    <p style="margin-top:16px;">&copy; ${new Date().getFullYear()} &Eacute;CLAT &mdash; maison-eclat.shop</p>
</div>

</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);

    } catch (err) {
        return res.status(500).json({ error: 'Erreur serveur', message: err.message });
    }
};
