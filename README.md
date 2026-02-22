# MuscleHouse

## Branch Status

The e-commerce platform implementation lives on branch **`copilot/implement-ecommerce-platform`** (open draft PR #1). That branch is already pushed to origin — the only reason `git fetch origin` fails with *Permission denied (publickey)* is that the local Git remote is configured to use **SSH** (`git@github.com:…`) instead of **HTTPS**.

---

## How to access the implementation branch

### Option A — re-clone via HTTPS (simplest)

```bash
git clone https://github.com/Cyberhghost/musclehouse.git
cd musclehouse
git fetch origin
git checkout copilot/implement-ecommerce-platform
```

### Option B — switch your existing clone to HTTPS

```bash
# inside your existing clone:
git remote set-url origin https://github.com/Cyberhghost/musclehouse.git
git fetch origin
git checkout copilot/implement-ecommerce-platform
```

### Option C — add an SSH key to GitHub

1. Generate a key (if you don't have one):  
   `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Copy the public key:  
   `cat ~/.ssh/id_ed25519.pub`
3. Add it at **GitHub → Settings → SSH and GPG keys → New SSH key**.
4. Then:
   ```bash
   git fetch origin
   git checkout copilot/implement-ecommerce-platform
   ```

---

## What is on that branch?

Full greenfield implementation of the Muscle House DZ storefront (CDC v2.0):

- **Stack:** Next.js 15 (App Router, TypeScript), PostgreSQL + Prisma ORM, PM2 cluster
- **14 REST API endpoints** — public catalogue/orders + JWT-protected admin CRUD
- **Public pages (French, mobile-first):** home/hero, catalogue, product detail, cart+checkout, contact, order tracking
- **Admin panel:** dashboard, products/categories CRUD with image upload, orders with status transitions, per-wilaya shipping fee config, delivery API config
- **Auth:** bcrypt + HttpOnly JWT cookies; `JWT_SECRET` required at startup
- **15 passing tests:** shipping calculator, JWT helpers, order-status flow
- **Deployment:** `ecosystem.config.js` (PM2), `sitemap.ts`, `robots.ts`, `next.config.js`

See [PR #1](https://github.com/Cyberhghost/musclehouse/pull/1) for the full description.

---

## Quick-start after checkout

```bash
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, …
npm install
npx prisma migrate dev
npx prisma db seed          # seeds 48 wilayas + shipping fees
npm run dev                 # http://localhost:3000
```
