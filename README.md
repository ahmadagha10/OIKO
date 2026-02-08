# OIKO - Premium Custom Streetwear

E-commerce platform built with Next.js 16, deployed on Cloudflare Workers.

## Prerequisites

- Node.js 22+
- npm
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database
- A [Cloudflare](https://cloudflare.com) account (Workers Paid plan for deployment)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/ahmadagha10/OIKO.git
cd OIKO
npm install --legacy-peer-deps
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (generate with `openssl rand -base64 48`) |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3000` for dev, your domain for production |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name for image uploads |
| `CLOUDINARY_CLOUD_NAME` | No | Same as above (server-side) |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key for emails |
| `EMAIL_FROM` | No | Sender email address |

### 3. Seed the database

```bash
npm run seed
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed MongoDB with product data |
| `npm run preview` | Build for Cloudflare and test locally (port 8787) |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run cf-build` | Build for Cloudflare without deploying |

## Deployment to Cloudflare Workers

### First-time setup

1. **Install Wrangler and log in:**

```bash
npx wrangler login
```

2. **Set production secrets:**

```bash
wrangler secret put MONGODB_URI
wrangler secret put JWT_SECRET
wrangler secret put EMAIL_FROM
wrangler secret put RESEND_API_KEY
wrangler secret put CLOUDINARY_CLOUD_NAME
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
```

Each command prompts you to paste the value.

3. **Create `.env.production`** for build-time variables:

```bash
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

4. **Deploy:**

```bash
npm run deploy
```

### Custom domain

Edit `wrangler.toml` to set your domain:

```toml
routes = [
  { pattern = "yourdomain.com", custom_domain = true },
  { pattern = "www.yourdomain.com", custom_domain = true },
]
```

The domain must be added to your Cloudflare account with DNS managed by Cloudflare.

### CI/CD with GitHub Actions

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that auto-deploys on push to `main`.

Add these secrets to your GitHub repo (`Settings > Secrets > Actions`):

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Found in Cloudflare dashboard sidebar |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |

### Local preview (Miniflare)

Test the Cloudflare build locally before deploying:

```bash
npm run preview
```

This builds the app with `@opennextjs/cloudflare` and runs it locally via Miniflare at http://localhost:8787.

## Architecture

- **Framework:** Next.js 16 (App Router)
- **Runtime:** Cloudflare Workers via `@opennextjs/cloudflare`
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT with bcryptjs
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion
- **File Uploads:** Cloudinary
- **Email:** Resend

See `CLAUDE.md` for detailed architecture documentation.
