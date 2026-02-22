# Muscle House DZ

Plateforme e-commerce premium pour compléments alimentaires sportifs en Algérie.

## Stack Technique

- **Frontend/Backend**: Next.js 15 (App Router, TypeScript)
- **Base de données**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: JWT (HttpOnly cookies)
- **Production**: PM2

## Prérequis

- Node.js 18+
- PostgreSQL 14+
- PM2 (`npm install -g pm2`)

## Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd musclehouse
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs:

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@localhost:5432/musclehouse` |
| `JWT_SECRET` | Clé secrète JWT (min 32 chars) | `your-very-long-secret-key-here` |
| `NEXTAUTH_SECRET` | Secret NextAuth | `another-secret` |
| `NEXTAUTH_URL` | URL de l'application | `https://musclehouse.dz` |
| `ADMIN_EMAIL` | Email admin | `admin@musclehouse.dz` |
| `ADMIN_PASSWORD` | Mot de passe admin | (texte clair, ou utiliser ADMIN_PASSWORD_HASH) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe | (recommandé en production) |
| `DELIVERY_API_URL` | URL API transporteur | `https://api.livraison.dz` |
| `DELIVERY_API_KEY` | Clé API transporteur | `your-api-key` |
| `DELIVERY_WEBHOOK_SECRET` | Secret webhook transporteur | `webhook-secret` |

### 4. Base de données

```bash
# Créer la base de données
createdb musclehouse

# Appliquer les migrations
npx prisma migrate deploy

# Seed (48 wilayas + données initiales)
npx prisma db seed
```

### 5. Build

```bash
npm run build
```

### 6. Démarrage (Production avec PM2)

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Développement

```bash
# Mode développement
npm run dev

# Tests
npm test

# Prisma Studio (interface DB)
npx prisma studio
```

## Structure du Projet

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx          # Accueil
│   │   ├── catalogue/        # Catalogue produits
│   │   ├── produit/[id]/     # Détail produit
│   │   ├── panier/           # Panier + commande
│   │   ├── contact/          # Contact
│   │   └── suivi/            # Suivi commande
│   ├── admin/                # Panel admin (protégé)
│   │   ├── page.tsx          # Tableau de bord
│   │   ├── produits/         # CRUD produits
│   │   ├── categories/       # CRUD catégories
│   │   ├── commandes/        # Gestion commandes
│   │   ├── livraison/        # Frais de livraison
│   │   └── config-livraison/ # Config API livraison
│   └── api/                  # Routes API REST
├── components/               # Composants réutilisables
├── context/                  # Cart context
└── lib/                      # Utilitaires (prisma, auth, shipping)
prisma/
├── schema.prisma             # Schéma base de données
└── seed.ts                   # Seed 48 wilayas
```

## Admin Panel

Accès: `/admin/login`

| Section | URL | Description |
|---------|-----|-------------|
| Tableau de bord | `/admin` | Statistiques et commandes récentes |
| Produits | `/admin/produits` | Ajouter/modifier/supprimer produits |
| Catégories | `/admin/categories` | Gestion des catégories |
| Commandes | `/admin/commandes` | Gestion et suivi des commandes |
| Livraison | `/admin/livraison` | Frais par wilaya |
| Config API | `/admin/config-livraison` | Configuration API transporteur |

## API REST

### Publique
- `GET /api/products` — Liste des produits actifs
- `GET /api/products/[id]` — Détail produit
- `GET /api/categories` — Liste des catégories
- `POST /api/orders` — Créer une commande
- `GET /api/shipping` — Frais de livraison
- `GET /api/tracking/[trackingNumber]` — Suivre une commande

### Admin (JWT requis)
- `POST /api/auth/login` — Connexion admin
- `POST /api/products` — Créer produit
- `PUT /api/products/[id]` — Modifier produit
- `DELETE /api/products/[id]` — Supprimer produit
- `GET /api/orders` — Liste commandes
- `PUT /api/orders/[id]/status` — Changer statut commande
- `PUT /api/shipping` — Modifier frais livraison
- `PUT /api/delivery-config` — Config API transporteur

### Webhook
- `POST /api/orders/webhook` — Mise à jour statut depuis transporteur

## Intégration API Transporteur

### Configuration

Dans l'admin (`/admin/config-livraison`), configurer:
- **URL API**: Point d'entrée de votre transporteur
- **Clé API**: Votre clé d'authentification

### Flux automatique

1. Commande créée → statut `pending`
2. Admin confirme → statut `confirmed` → **appel API transporteur** → réception numéro de suivi → statut `shipped`
3. Webhook transporteur → mise à jour automatique des statuts (`out_for_delivery`, `delivered`)

### Format Webhook (POST /api/orders/webhook)

```json
{
  "reference": "order-uuid",
  "tracking_number": "TRK123456",
  "status": "out_for_delivery"
}
```

Statuts acceptés: `shipped`, `out_for_delivery`, `delivered`, `cancelled`

Sécuriser avec: `DELIVERY_WEBHOOK_SECRET` env var (Bearer token)

## Déploiement Hostinger/Linux

```bash
# 1. Upload du projet
git pull origin main

# 2. Install + build
npm ci
npx prisma migrate deploy
npm run build

# 3. Restart PM2
pm2 restart musclehouse

# 4. Nginx (reverse proxy)
# Configurer nginx pour proxier port 3000 vers domaine
# Ajouter SSL avec Certbot
```

### Config Nginx exemple

```nginx
server {
    server_name musclehouse.dz www.musclehouse.dz;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/musclehouse.dz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/musclehouse.dz/privkey.pem;
}
```

## Tests

```bash
npm test
```

Tests inclus:
- Calcul des frais de livraison (shipping.test.ts)
- Utilitaires d'authentification JWT (auth.test.ts)  
- Flux des statuts de commande (order-status.test.ts)

## Licence

© 2024 Muscle House DZ - Tous droits réservés
