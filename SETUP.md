# Guide de configuration ÉCLAT — Infrastructure Scale

## Services gratuits à configurer

### 1. Supabase (Base de données + Auth)
1. Crée un compte sur https://supabase.com
2. Crée un nouveau projet (région: EU West)
3. Va dans **SQL Editor** et exécute `sql/schema.sql`
4. Puis exécute `sql/seed.sql`
5. Dans **Settings > API**, copie :
   - `URL` → variable d'env `SUPABASE_URL`
   - `anon key` → variable d'env `SUPABASE_ANON_KEY`
   - `service_role key` → variable d'env `SUPABASE_SERVICE_KEY`

### 2. Upstash Redis (Cache + Jobs)
1. Crée un compte sur https://upstash.com
2. Crée une base Redis (région: EU West)
3. Copie :
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Google Analytics 4
1. Va sur https://analytics.google.com
2. Crée une propriété GA4
3. Copie le `Measurement ID` (G-XXXXXXX)
4. Ajoute dans index.html (déjà préparé, remplace GA_MEASUREMENT_ID)

### 4. Variables d'environnement Vercel
Dans ton dashboard Vercel > Settings > Environment Variables, ajoute :

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

Les variables existantes (STRIPE_SECRET_KEY, etc.) restent inchangées.

## APIs v2 disponibles

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/v2/products` | GET | Non | Liste produits (pagination, filtres) |
| `/api/v2/products?id=1` | GET | Non | Détail produit + avis |
| `/api/v2/auth?action=signup` | POST | Non | Inscription |
| `/api/v2/auth?action=login` | POST | Non | Connexion |
| `/api/v2/auth?action=profile` | GET | Bearer token | Profil complet |
| `/api/v2/orders` | GET | Bearer token | Mes commandes |
| `/api/v2/reviews?product_id=1` | GET | Non | Avis d'un produit |
| `/api/v2/reviews` | POST | Bearer token | Poster un avis |
| `/api/v2/returns` | POST | Bearer token | Demander un retour |
| `/api/v2/affiliates?action=register` | POST | Non | S'inscrire affilié |
| `/api/v2/affiliates?action=dashboard` | GET | Bearer token | Stats affilié |
| `/api/v2/admin?resource=stats` | GET | Admin key | Dashboard stats |
| `/api/v2/admin?resource=products` | CRUD | Admin key | Gestion produits |
| `/api/v2/admin?resource=orders` | GET/PUT | Admin key | Gestion commandes |
| `/api/v2/admin?resource=reviews` | GET/PUT/DEL | Admin key | Modération avis |
| `/api/v2/jobs` | GET | Cron secret | Traiter jobs en attente |

## Migration depuis les APIs v1

Les APIs v1 (`/api/create-checkout-session`, `/api/webhook`, etc.) continuent de fonctionner.
Les APIs v2 ajoutent la couche base de données. La migration est progressive :
- Le frontend utilise d'abord les APIs v1 (pas de changement)
- Quand Supabase est configuré, les APIs v2 prennent le relais
- Les produits.js hardcodés restent le fallback si la DB n'est pas connectée
