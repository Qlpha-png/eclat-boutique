# Plan Personnalisation Compte ECLAT - Genere 11/04/2026

## ETAT ACTUEL (deja implemente)

### Onglets account.html existants :
1. Tableau de bord (overview, eclats, streak, progress)
2. Mon profil (prenom, nom, email, telephone)
3. Mes commandes (depuis Supabase)
4. Mes Eclats (checkin, coffre, defis, badges, leaderboard, redemption)
5. **Mes preferences** [NOUVEAU] : type peau, preoccupation, age, genre, categories, newsletter
6. Parrainage (code referral)
7. **Affichage** [NOUVEAU] : theme (5), langue (4), densite (3)
8. Mes donnees RGPD (export + suppression)

### SQL a executer : sql/beauty_preferences.sql
Ajoute : skin_type, main_concern, age_range, gender_pref, fav_categories, nl_*

---

## PHASE SUIVANTE - Sprint 1 (maximum d'impact)

### 1. Profil beaute enrichi (tab-beautyprofile)
Centraliser TOUTES les infos beaute client. Sources :
- Diagnostic (localStorage eclat_diagnostic) -> sync vers Supabase
- Preferences visiteur (localStorage eclat_prefs)
- Edition manuelle depuis le compte

Champs supplementaires a ajouter a profiles :
- interest_pref VARCHAR(20) : visage/corps/cheveux/ongles/bienetre
- budget_pref VARCHAR(10) : low/medium/high
- banned_ingredients TEXT[] : allergies/preferences
- beauty_goals TEXT[] : objectifs multiples
- diagnostic_completed_at TIMESTAMPTZ

UX : boutons pill toggle (comme diagnostic), pas des selects

### 2. Dashboard enrichi
- Greeting temporel (Bonjour/Bon apres-midi/Bonsoir + prenom)
- Widget "Ma peau" : mini-resume skin_type + concern avec icones
- Widget Wishlist preview : 3 premieres images miniatures
- Widget "Vus recemment" : 4 produits
- Rappel coffre/check-in si pas fait

### 3. Homepage personnalisee
- "Bon retour, [prenom]" dans le hero si connecte
- Section "Pour vous" : 8 produits selon profil beaute
- Alerte wishlist restock

---

## PHASE SUIVANTE - Sprint 2 (forte valeur percue)

### 4. Routine AM/PM (tab-routine)
Table user_routines : user_id, slot_key (am_cleanser, am_serum, etc.), product_id
8 slots : 4 AM + 4 PM, drag & drop depuis historique achat
Badge "Routine complete" si 8 slots remplis

### 5. Commandes enrichies
- Timeline statut (Payee > Preparation > Expediee > Livree)
- Detail expandable (produits de la commande)
- Bouton "Racheter" sur commandes livrees

### 6. Wishlist dans le compte
Apercu compact avec badges "En promo" / "De retour en stock"

---

## PHASE SUIVANTE - Sprint 3 (differenciation)

### 7. Gamification enrichie
- Progress bar tier segmentee (4 zones colorees)
- Timeline achievements chronologique
- Streak 7 dots (comme GitHub contributions)
- Badge showcase avec popup details + rarete

### 8. Celebrations
- Anniversaire client : bandeau dore + 50 Eclats
- Anniversaire inscription : badge + Eclats
- Milestones achat : 1ere/5eme/10eme commande

### 9. Conseils saisonniers
48 combinaisons pre-ecrites (4 saisons x 4 skin types x 3 concerns)
Zero cout API, tout statique

---

## PHASE SUIVANTE - Sprint 4 (premium)

### 10. Journal de peau (Prestige+ uniquement)
Table skin_diary : mood/hydration/clarity (1-5) + notes + products_used
Graphique evolution 4 semaines (SVG inline, zero librairie)

### 11. "Mon impact ECLAT"
Widget contributions : avis laisses, amis parraines, anciennete, top %

---

## NOUVELLES TABLES SUPABASE NECESSAIRES

1. addresses (carnet adresses livraison)
2. user_routines (routine AM/PM)
3. skin_diary (journal peau, Prestige+)

## NOUVELLES APIs NECESSAIRES

1. api/beauty-profile.js (GET + PATCH)
2. api/routine.js (GET + PUT + DELETE)
3. api/skin-diary.js (GET + POST)
4. api/addresses.js (CRUD)

## APIs A MODIFIER

1. api/product-recommendation.js : utiliser profil beaute complet
2. api/chat.js : injecter profil beaute dans system prompt
3. api/diagnostic-ai.js : pre-remplir si profil existe
