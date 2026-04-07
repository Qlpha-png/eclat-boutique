# ÉCLAT - Stratégie Fournisseurs & Automatisation

## STRATÉGIE EN 3 PHASES

### Phase 1 : Dropshipping EU (MAINTENANT)
**Objectif :** Valider le marché avec 0 stock, 0 risque

**Fournisseur principal : CJDropshipping**
- Gratuit, MOQ 0, entrepôts EU (France, Allemagne)
- Livraison 3-8 jours France
- Marge moyenne : 70-90%

**Fournisseur secondaire : Webdrop Market**
- Français, entrepôt France, livraison 24-48h
- Idéal pour l'option "Express" à 7,90€
- SAV en français

**Comment ça marche :**
1. Client commande sur maison-eclat.shop
2. Stripe capture le paiement → webhook déclenché
3. Commande apparaît dans le dashboard admin (/pages/admin.html)
4. Tu commandes chez CJ avec l'adresse du client
5. CJ expédie directement au client

### Phase 2 : Semi-automatisé (après 50+ commandes/mois)
**Objectif :** Réduire le temps de traitement à 2 min/commande

- Connecter l'API CJDropshipping au webhook Stripe
- Mapping automatique : produit ÉCLAT → SKU CJDropshipping
- Commande passée automatiquement chez CJ à chaque paiement
- Tracking automatique envoyé au client par email

**Prérequis :**
- Compte CJDropshipping vérifié + clé API
- Mapping des 12 produits (SKU CJ pour chaque)
- Service email transactionnel (Resend ou Brevo)

### Phase 3 : Marque propre (après 200+ commandes/mois)
**Objectif :** Marge maximale + branding exclusif + fidélisation

**Produits marque blanche ÉCLAT :**
- Sérum Vitamine C ÉCLAT (MOQ 100, ~3€/unité → vente 24,90€ = 88% marge)
- Huile Rose Musquée ÉCLAT (MOQ 50, ~4€/unité → vente 19,90€ = 80% marge)
- Patchs Yeux ÉCLAT (MOQ 200, ~1€/unité → vente 12,90€ = 92% marge)

**Fournisseurs marque blanche :**
- Europages.fr : "laboratoire cosmétique marque blanche France"
- Conformité EU cosmétique (EC 1223/2009) obligatoire
- Délai première commande : 4-8 semaines
- Budget packaging : ~500-1000€ pour le design

---

## PRIX D'ACHAT & MARGES

| Produit | Coût CJ | Prix vente | Marge € | Marge % |
|---------|---------|------------|---------|---------|
| Masque LED 7 Couleurs | ~20€ | 39,90€ | 19,90€ | 50% |
| Jade Roller Facial | ~3€ | 19,90€ | 16,90€ | 85% |
| Gua Sha Quartz Rose | ~2€ | 17,90€ | 15,90€ | 89% |
| Sérum Vitamine C | ~7€ | 24,90€ | 17,90€ | 72% |
| Patchs Yeux Or | ~2€ | 12,90€ | 10,90€ | 84% |
| Derma Roller Pro | ~4€ | 22,90€ | 18,90€ | 82% |
| Diffuseur Nuage | ~12€ | 29,90€ | 17,90€ | 60% |
| Huile Rose Musquée | ~5€ | 19,90€ | 14,90€ | 75% |
| Brosse Nettoyante | ~6€ | 21,90€ | 15,90€ | 73% |
| Set Pinceaux Pro | ~8€ | 24,90€ | 16,90€ | 68% |
| Bandeau Spa | ~1,50€ | 9,90€ | 8,40€ | 85% |
| Éponge Konjac | ~0,80€ | 8,90€ | 8,10€ | 91% |

**Marge moyenne pondérée : ~76%**

---

## AUTOMATISATION TECHNIQUE

### Webhook Stripe (/api/webhook)
- Écoute l'événement `checkout.session.completed`
- Extrait : email, nom, adresse, produits, montants
- Log la commande complète

### API Orders (/api/orders)
- GET /api/orders → liste les commandes Stripe récentes
- GET /api/orders?session_id=xxx → détails d'une commande
- Protégée par ADMIN_API_KEY

### Dashboard Admin (/pages/admin.html)
- Login : mot de passe `eclat2026` (à changer en prod)
- Vue CA, nombre commandes, panier moyen
- Liste des commandes avec statut
- Vue fournisseurs et marges
- Statut d'automatisation

### Variables Vercel à configurer :
```
STRIPE_SECRET_KEY=sk_live_xxx          # Clé Stripe live
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Signature webhook (optionnel en dev)
ADMIN_API_KEY=votre_cle_secrete        # Protège l'API orders
```

### Configurer le webhook Stripe :
1. Dashboard Stripe → Developers → Webhooks
2. Add endpoint : `https://maison-eclat.shop/api/webhook`
3. Events : `checkout.session.completed`
4. Copier le signing secret → STRIPE_WEBHOOK_SECRET sur Vercel

---

## ACTIONS IMMÉDIATES

### Semaine 1 :
- [ ] Créer compte CJDropshipping (gratuit)
- [ ] Demander devis EU warehouse pour les 12 produits
- [ ] Commander 1 exemplaire de chaque produit (test qualité)
- [ ] Configurer STRIPE_SECRET_KEY sur Vercel
- [ ] Configurer le webhook Stripe
- [ ] Tester le tunnel de commande complet

### Semaine 2 :
- [ ] Recevoir et tester les produits
- [ ] Prendre de vraies photos produits (remplacer les actuelles)
- [ ] Créer compte Webdrop Market (option express)
- [ ] Configurer un email transactionnel (Resend gratuit)

### Semaine 3 :
- [ ] Lancer les premières pubs (Instagram/TikTok)
- [ ] Activer le mapping automatique CJ si API disponible
- [ ] Créer les comptes réseaux sociaux @eclat.beaute

### Mois 2+ :
- [ ] Analyser les best-sellers réels
- [ ] Contacter labo marque blanche pour les top produits
- [ ] Développer packaging ÉCLAT
- [ ] Étendre le catalogue (15-20 produits)
