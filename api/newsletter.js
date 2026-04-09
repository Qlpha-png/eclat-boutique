// ============================
// ÉCLAT - Newsletter Welcome Email
// Email éducatif professionnel + code BIENVENUE10
// ============================

const { applyRateLimit } = require('./_middleware/rateLimit');

module.exports = async (req, res) => {
    const allowedOrigins = ['https://eclat-boutique.vercel.app', 'https://maison-eclat.shop'];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (applyRateLimit(req, res, 'contact')) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, lang } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

    if (!resendApiKey) {
        return res.status(200).json({
            success: true,
            mode: 'no-email',
            message: 'Email enregistre (envoi desactive - RESEND_API_KEY manquante)'
        });
    }

    const t = (TRANSLATIONS[lang] || TRANSLATIONS.fr);
    const site = 'https://maison-eclat.shop';
    const gold = '#c9a87c';
    const dark = '#2d2926';
    const bg = '#faf8f5';

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="text-align:center;padding:32px 0 24px;">
    <h1 style="font-family:Georgia,serif;font-size:32px;color:${dark};letter-spacing:4px;margin:0;">ECLAT</h1>
    <p style="font-size:11px;color:${gold};letter-spacing:3px;margin:6px 0 0;text-transform:uppercase;">Maison de Beaute</p>
</td></tr>

<!-- WELCOME -->
<tr><td style="background:#fff;border-radius:12px 12px 0 0;padding:48px 40px 32px;border:1px solid #e8e4de;border-bottom:0;">
    <h2 style="font-family:Georgia,serif;color:${dark};font-size:24px;margin:0 0 16px;text-align:center;">${t.welcome}</h2>
    <p style="color:#6b6560;line-height:1.8;font-size:15px;text-align:center;margin:0;">${t.intro}</p>
</td></tr>

<!-- PROMO CODE -->
<tr><td style="background:linear-gradient(135deg,${dark} 0%,#1a1614 100%);padding:36px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-size:12px;color:${gold};text-transform:uppercase;letter-spacing:3px;">${t.code_label}</p>
    <p style="margin:0;font-size:40px;font-weight:700;color:#fff;letter-spacing:5px;font-family:Georgia,serif;">BIENVENUE10</p>
    <p style="margin:10px 0 0;font-size:15px;color:${gold};">${t.code_info}</p>
    <div style="margin-top:24px;">
        <a href="${site}" style="display:inline-block;background:${gold};color:#fff;padding:14px 48px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;">${t.cta_shop}</a>
    </div>
</td></tr>

<!-- BRAND STORY -->
<tr><td style="background:#fff;padding:40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${dark};font-size:18px;margin:0 0 16px;text-align:center;">${t.story_title}</h3>
    <p style="color:#6b6560;line-height:1.8;font-size:14px;margin:0 0 16px;text-align:center;">${t.story_text}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
    <tr>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#127807;</p>
            <p style="font-size:12px;color:${dark};font-weight:600;margin:8px 0 4px;">${t.value_1_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_1_text}</p>
        </td>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#128300;</p>
            <p style="font-size:12px;color:${dark};font-weight:600;margin:8px 0 4px;">${t.value_2_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_2_text}</p>
        </td>
        <td width="33%" style="text-align:center;padding:12px 8px;">
            <p style="font-size:24px;margin:0;">&#10084;&#65039;</p>
            <p style="font-size:12px;color:${dark};font-weight:600;margin:8px 0 4px;">${t.value_3_title}</p>
            <p style="font-size:11px;color:#6b6560;margin:0;line-height:1.5;">${t.value_3_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- SKINCARE TIP -->
<tr><td style="background:${bg};padding:36px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="48" style="vertical-align:top;padding-right:16px;">
            <div style="width:48px;height:48px;border-radius:50%;background:${gold};text-align:center;line-height:48px;font-size:22px;">&#128161;</div>
        </td>
        <td style="vertical-align:top;">
            <h3 style="font-family:Georgia,serif;color:${dark};font-size:16px;margin:0 0 10px;">${t.tip_title}</h3>
            <p style="color:#6b6560;line-height:1.8;font-size:13px;margin:0;">${t.tip_text}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- BESTSELLERS -->
<tr><td style="background:#fff;padding:40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${dark};font-size:18px;margin:0 0 8px;text-align:center;">${t.bestsellers_title}</h3>
    <p style="color:#6b6560;font-size:13px;text-align:center;margin:0 0 24px;">${t.bestsellers_subtitle}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${bg};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#129520;</p>
                <p style="font-size:13px;color:${dark};font-weight:600;margin:0 0 4px;">${t.product_1_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_1_desc}</p>
                <p style="font-size:14px;color:${gold};font-weight:700;margin:0;">44,90 &euro;</p>
            </div>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${bg};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#128142;</p>
                <p style="font-size:13px;color:${dark};font-weight:600;margin:0 0 4px;">${t.product_2_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_2_desc}</p>
                <p style="font-size:14px;color:${gold};font-weight:700;margin:0;">24,90 &euro;</p>
            </div>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <div style="background:${bg};border-radius:12px;padding:20px 12px;">
                <p style="font-size:28px;margin:0 0 8px;">&#10024;</p>
                <p style="font-size:13px;color:${dark};font-weight:600;margin:0 0 4px;">${t.product_3_name}</p>
                <p style="font-size:11px;color:#6b6560;margin:0 0 6px;">${t.product_3_desc}</p>
                <p style="font-size:14px;color:${gold};font-weight:700;margin:0;">27,90 &euro;</p>
            </div>
        </td>
    </tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
        <a href="${site}#produits" style="display:inline-block;background:${dark};color:#fff;padding:12px 36px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">${t.cta_products}</a>
    </div>
</td></tr>

<!-- DIAGNOSTIC CTA -->
<tr><td style="background:linear-gradient(135deg,#f8f0e8 0%,#f5ebe0 100%);padding:36px 40px;text-align:center;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${dark};font-size:18px;margin:0 0 10px;">${t.diag_title}</h3>
    <p style="color:#6b6560;font-size:13px;line-height:1.7;margin:0 0 20px;">${t.diag_text}</p>
    <a href="${site}/pages/diagnostic.html" style="display:inline-block;background:${gold};color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">${t.diag_cta}</a>
</td></tr>

<!-- WHAT YOU'LL RECEIVE -->
<tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <h3 style="font-family:Georgia,serif;color:${dark};font-size:16px;margin:0 0 16px;text-align:center;">${t.benefits_title}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${gold};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${dark};">${t.benefit_1_title}</strong> — ${t.benefit_1_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${gold};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${dark};">${t.benefit_2_title}</strong> — ${t.benefit_2_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${gold};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${dark};">${t.benefit_3_title}</strong> — ${t.benefit_3_text}</p></td>
            </tr></table>
        </td>
    </tr>
    <tr>
        <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="color:${gold};font-size:16px;">&#10003;</span></td>
                <td style="padding-left:10px;"><p style="margin:0;font-size:13px;color:#6b6560;line-height:1.6;"><strong style="color:${dark};">${t.benefit_4_title}</strong> — ${t.benefit_4_text}</p></td>
            </tr></table>
        </td>
    </tr>
    </table>
</td></tr>

<!-- SOCIAL PROOF -->
<tr><td style="background:${bg};padding:32px 40px;text-align:center;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;">
    <p style="font-family:Georgia,serif;font-style:italic;color:${dark};font-size:15px;line-height:1.7;margin:0 0 12px;">"${t.testimonial}"</p>
    <p style="font-size:12px;color:${gold};margin:0;">&#9733;&#9733;&#9733;&#9733;&#9733; — ${t.testimonial_author}</p>
</td></tr>

<!-- GUARANTEES -->
<tr><td style="background:#fff;padding:32px 40px;border-left:1px solid #e8e4de;border-right:1px solid #e8e4de;border-radius:0 0 12px 12px;border-bottom:1px solid #e8e4de;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128274;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_1}</p>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128230;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_2}</p>
        </td>
        <td width="33%" style="text-align:center;padding:8px;">
            <p style="font-size:20px;margin:0 0 6px;">&#128260;</p>
            <p style="font-size:11px;color:#6b6560;margin:0;">${t.guarantee_3}</p>
        </td>
    </tr>
    </table>
</td></tr>

<!-- FOOTER -->
<tr><td style="text-align:center;padding:32px 24px;">
    <p style="font-size:12px;color:${gold};letter-spacing:3px;margin:0 0 12px;">ECLAT</p>
    <p style="font-size:11px;color:#6b6560;margin:0 0 8px;">
        <a href="${site}/pages/faq.html" style="color:#6b6560;text-decoration:underline;">FAQ</a> &nbsp;|&nbsp;
        <a href="${site}/pages/cgv.html" style="color:#6b6560;text-decoration:underline;">CGV</a> &nbsp;|&nbsp;
        <a href="${site}/pages/confidentialite.html" style="color:#6b6560;text-decoration:underline;">RGPD</a> &nbsp;|&nbsp;
        <a href="${site}/pages/contact.html" style="color:#6b6560;text-decoration:underline;">Contact</a>
    </p>
    <p style="font-size:11px;color:#b8b0a8;margin:8px 0 0;">
        <a href="mailto:contact@maison-eclat.shop?subject=Desabonnement%20newsletter" style="color:#b8b0a8;text-decoration:underline;">${t.unsubscribe}</a>
    </p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'ÉCLAT Beauté <contact@maison-eclat.shop>',
                to: email,
                subject: t.subject,
                html
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, emailId: data.id });
        } else {
            return res.status(200).json({ success: false, error: data.message });
        }
    } catch (err) {
        return res.status(200).json({ success: false, error: err.message });
    }
};

const TRANSLATIONS = {
    fr: {
        subject: 'Bienvenue chez ÉCLAT — Votre code -10% + guide beauté offert',
        welcome: 'Bienvenue dans l\'univers ÉCLAT',
        intro: 'Vous venez de rejoindre une communauté de passionnées qui prennent soin d\'elles avec des produits sélectionnés par des experts. Merci pour votre confiance.',
        code_label: 'Votre cadeau de bienvenue',
        code_info: '-10% sur votre première commande',
        cta_shop: 'Utiliser mon code',
        story_title: 'Pourquoi ÉCLAT ?',
        story_text: 'Chez ÉCLAT, chaque produit est rigoureusement sélectionné pour son efficacité prouvée. Nous collaborons avec 16 marques de référence pour vous offrir le meilleur de la beauté, à prix accessible.',
        value_1_title: 'Cruelty-free',
        value_1_text: 'Aucun test sur les animaux',
        value_2_title: 'Efficacité prouvée',
        value_2_text: 'Ingrédients actifs certifiés',
        value_3_title: 'Expert sélection',
        value_3_text: '16 marques de confiance',
        tip_title: 'Conseil du jour : L\'ordre d\'application compte !',
        tip_text: 'Appliquez toujours vos soins du plus léger au plus riche : <strong>1. Nettoyant</strong> → <strong>2. Tonique</strong> → <strong>3. Sérum</strong> → <strong>4. Crème hydratante</strong> → <strong>5. SPF le matin</strong>. Cette règle simple maximise l\'absorption et l\'efficacité de chaque produit.',
        bestsellers_title: 'Nos best-sellers',
        bestsellers_subtitle: 'Les produits préférés de notre communauté',
        product_1_name: 'Masque LED Pro',
        product_1_desc: '7 couleurs thérapeutiques',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'Le duo iconique',
        product_3_name: 'Sérum Vitamine C',
        product_3_desc: 'Résultats en 21 jours',
        cta_products: 'Voir tous les produits',
        diag_title: 'Pas sûre par où commencer ?',
        diag_text: 'Répondez à 4 questions simples et recevez une routine personnalisée adaptée à votre type de peau et vos objectifs.',
        diag_cta: 'Faire mon diagnostic gratuit',
        benefits_title: 'Ce que vous allez recevoir',
        benefit_1_title: 'Guides beauté exclusifs',
        benefit_1_text: 'routines, astuces et tutoriels par type de peau',
        benefit_2_title: 'Offres en avant-première',
        benefit_2_text: 'accès aux ventes privées avant tout le monde',
        benefit_3_title: 'Nouveautés et tendances',
        benefit_3_text: 'soyez la première informée de nos lancements',
        benefit_4_title: 'Codes promo exclusifs',
        benefit_4_text: 'réductions réservées à notre communauté newsletter',
        testimonial: 'Le masque LED a transformé ma peau en 3 semaines. Je recommande ÉCLAT à toutes mes amies !',
        testimonial_author: 'Marie L., cliente vérifiée',
        guarantee_1: 'Paiement 100% sécurisé',
        guarantee_2: 'Livraison suivie en Europe',
        guarantee_3: 'Retours gratuits 30 jours',
        unsubscribe: 'Se désabonner'
    },
    en: {
        subject: 'Welcome to ÉCLAT — Your -10% code + free beauty guide',
        welcome: 'Welcome to the ÉCLAT universe',
        intro: 'You\'ve just joined a community of beauty enthusiasts who trust expertly curated products. Thank you for being here.',
        code_label: 'Your welcome gift',
        code_info: '-10% on your first order',
        cta_shop: 'Use my code',
        story_title: 'Why ÉCLAT?',
        story_text: 'At ÉCLAT, every product is rigorously selected for proven effectiveness. We partner with 16 trusted brands to bring you the best in beauty, at accessible prices.',
        value_1_title: 'Cruelty-free',
        value_1_text: 'Never tested on animals',
        value_2_title: 'Proven results',
        value_2_text: 'Certified active ingredients',
        value_3_title: 'Expert curation',
        value_3_text: '16 trusted brands',
        tip_title: 'Today\'s tip: Application order matters!',
        tip_text: 'Always apply skincare from lightest to richest: <strong>1. Cleanser</strong> → <strong>2. Toner</strong> → <strong>3. Serum</strong> → <strong>4. Moisturizer</strong> → <strong>5. SPF in the morning</strong>. This simple rule maximizes absorption and effectiveness.',
        bestsellers_title: 'Our best-sellers',
        bestsellers_subtitle: 'Our community\'s favorite products',
        product_1_name: 'LED Mask Pro',
        product_1_desc: '7 therapeutic colours',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'The iconic duo',
        product_3_name: 'Vitamin C Serum',
        product_3_desc: 'Results in 21 days',
        cta_products: 'See all products',
        diag_title: 'Not sure where to start?',
        diag_text: 'Answer 4 simple questions and receive a personalized routine tailored to your skin type and goals.',
        diag_cta: 'Take my free diagnostic',
        benefits_title: 'What you\'ll receive',
        benefit_1_title: 'Exclusive beauty guides',
        benefit_1_text: 'routines, tips and tutorials by skin type',
        benefit_2_title: 'Early-access offers',
        benefit_2_text: 'access private sales before everyone',
        benefit_3_title: 'New launches & trends',
        benefit_3_text: 'be the first to know about new products',
        benefit_4_title: 'Exclusive promo codes',
        benefit_4_text: 'discounts reserved for our newsletter community',
        testimonial: 'The LED mask transformed my skin in 3 weeks. I recommend ÉCLAT to all my friends!',
        testimonial_author: 'Marie L., verified customer',
        guarantee_1: '100% secure payment',
        guarantee_2: 'Tracked delivery in Europe',
        guarantee_3: 'Free returns within 30 days',
        unsubscribe: 'Unsubscribe'
    },
    es: {
        subject: 'Bienvenido/a a ÉCLAT — Tu código -10% + guía de belleza',
        welcome: 'Bienvenido/a al universo ÉCLAT',
        intro: 'Te has unido a una comunidad de apasionadas de la belleza que confían en productos seleccionados por expertos. Gracias por tu confianza.',
        code_label: 'Tu regalo de bienvenida',
        code_info: '-10% en tu primer pedido',
        cta_shop: 'Usar mi código',
        story_title: '¿Por qué ÉCLAT?',
        story_text: 'En ÉCLAT, cada producto es rigurosamente seleccionado por su eficacia probada. Colaboramos con 16 marcas de referencia para ofrecerte lo mejor en belleza, a precios accesibles.',
        value_1_title: 'Cruelty-free',
        value_1_text: 'Sin pruebas en animales',
        value_2_title: 'Eficacia probada',
        value_2_text: 'Ingredientes activos certificados',
        value_3_title: 'Selección experta',
        value_3_text: '16 marcas de confianza',
        tip_title: 'Consejo del día: ¡El orden importa!',
        tip_text: 'Aplica siempre tus productos del más ligero al más rico: <strong>1. Limpiador</strong> → <strong>2. Tónico</strong> → <strong>3. Sérum</strong> → <strong>4. Crema hidratante</strong> → <strong>5. SPF por la mañana</strong>.',
        bestsellers_title: 'Nuestros más vendidos',
        bestsellers_subtitle: 'Los favoritos de nuestra comunidad',
        product_1_name: 'Mascarilla LED Pro',
        product_1_desc: '7 colores terapéuticos',
        product_2_name: 'Jade Roller y Gua Sha',
        product_2_desc: 'El dúo icónico',
        product_3_name: 'Sérum Vitamina C',
        product_3_desc: 'Resultados en 21 días',
        cta_products: 'Ver todos los productos',
        diag_title: '¿No sabes por dónde empezar?',
        diag_text: 'Responde 4 preguntas simples y recibe una rutina personalizada para tu tipo de piel.',
        diag_cta: 'Hacer mi diagnóstico gratis',
        benefits_title: 'Lo que recibirás',
        benefit_1_title: 'Guías de belleza exclusivas',
        benefit_1_text: 'rutinas, trucos y tutoriales por tipo de piel',
        benefit_2_title: 'Ofertas en primicia',
        benefit_2_text: 'acceso a ventas privadas antes que nadie',
        benefit_3_title: 'Novedades y tendencias',
        benefit_3_text: 'sé la primera en conocer nuestros lanzamientos',
        benefit_4_title: 'Códigos promo exclusivos',
        benefit_4_text: 'descuentos reservados a nuestra comunidad',
        testimonial: 'La mascarilla LED transformó mi piel en 3 semanas. ¡Recomiendo ÉCLAT a todas mis amigas!',
        testimonial_author: 'Marie L., clienta verificada',
        guarantee_1: 'Pago 100% seguro',
        guarantee_2: 'Envío con seguimiento',
        guarantee_3: 'Devoluciones gratis 30 días',
        unsubscribe: 'Darse de baja'
    },
    de: {
        subject: 'Willkommen bei ÉCLAT — Ihr -10% Code + Beauty-Guide',
        welcome: 'Willkommen im ÉCLAT-Universum',
        intro: 'Sie sind einer Community von Beauty-Begeisterten beigetreten, die auf von Experten ausgewählte Produkte vertrauen. Danke für Ihr Vertrauen.',
        code_label: 'Ihr Willkommensgeschenk',
        code_info: '-10% auf Ihre erste Bestellung',
        cta_shop: 'Code einlösen',
        story_title: 'Warum ÉCLAT?',
        story_text: 'Bei ÉCLAT wird jedes Produkt sorgfältig auf nachgewiesene Wirksamkeit geprüft. Wir arbeiten mit 16 Referenzmarken zusammen, um Ihnen das Beste der Beauty-Welt zu bieten.',
        value_1_title: 'Cruelty-free',
        value_1_text: 'Keine Tierversuche',
        value_2_title: 'Bewiesene Wirkung',
        value_2_text: 'Zertifizierte Wirkstoffe',
        value_3_title: 'Experten-Auswahl',
        value_3_text: '16 vertrauenswürdige Marken',
        tip_title: 'Tipp des Tages: Die Reihenfolge zählt!',
        tip_text: 'Tragen Sie Pflege immer vom Leichtesten zum Reichhaltigsten auf: <strong>1. Reinigung</strong> → <strong>2. Toner</strong> → <strong>3. Serum</strong> → <strong>4. Feuchtigkeitscreme</strong> → <strong>5. SPF am Morgen</strong>.',
        bestsellers_title: 'Unsere Bestseller',
        bestsellers_subtitle: 'Die Lieblingsprodukte unserer Community',
        product_1_name: 'LED-Maske Pro',
        product_1_desc: '7 therapeutische Farben',
        product_2_name: 'Jade Roller & Gua Sha',
        product_2_desc: 'Das ikonische Duo',
        product_3_name: 'Vitamin C Serum',
        product_3_desc: 'Ergebnisse in 21 Tagen',
        cta_products: 'Alle Produkte sehen',
        diag_title: 'Nicht sicher, wo Sie anfangen sollen?',
        diag_text: 'Beantworten Sie 4 einfache Fragen und erhalten Sie eine personalisierte Routine für Ihren Hauttyp.',
        diag_cta: 'Kostenlose Hautdiagnose',
        benefits_title: 'Was Sie erhalten werden',
        benefit_1_title: 'Exklusive Beauty-Guides',
        benefit_1_text: 'Routinen, Tipps und Tutorials nach Hauttyp',
        benefit_2_title: 'Vorab-Angebote',
        benefit_2_text: 'Zugang zu Private Sales vor allen anderen',
        benefit_3_title: 'Neuheiten & Trends',
        benefit_3_text: 'erfahren Sie als Erste von unseren Launches',
        benefit_4_title: 'Exklusive Promo-Codes',
        benefit_4_text: 'Rabatte nur für unsere Newsletter-Community',
        testimonial: 'Die LED-Maske hat meine Haut in 3 Wochen verwandelt. Ich empfehle ÉCLAT all meinen Freundinnen!',
        testimonial_author: 'Marie L., verifizierte Kundin',
        guarantee_1: '100% sichere Zahlung',
        guarantee_2: 'Verfolgter Versand in Europa',
        guarantee_3: '30 Tage kostenlose Rückgabe',
        unsubscribe: 'Abbestellen'
    }
};
