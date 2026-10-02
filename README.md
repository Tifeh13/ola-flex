# OLAFLEX

![OLAFLEX Logo](public/olaflex-logo.png)

Premium luxury watches and statement timepieces. Time Beyond Ordinary.

Live site: https://ola-flex.vercel.app/

## Tech Stack

- React 19 + Vite + Tailwind CSS
- Framer Motion for animations
- Express.js API (runs as a Vercel serverless function via `api/index.js`)
- Turso (libSQL) database, with a local SQLite file fallback in development
- Cloudinary for image uploads

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in your Turso + Cloudinary credentials
npm run dev            # runs API (port 3001) + Vite dev server
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | API + frontend with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run seed` | Seed the database (creates the admin user) |

## Admin Panel

The store is managed at `/admin`:

- Login is **client-side** — a single hardcoded account (username `admin`) with a password that can be changed from the sidebar (stored in the browser's localStorage).
- Products added in the admin appear on the storefront automatically.

## Environment Variables

See [.env.example](.env.example). Required for production:

- `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` — Turso database (https://turso.tech)
- `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_UPLOAD_PRESET` — image uploads
- `PORT` / `NODE_ENV` — local development only

## Deployment

Pushing to `main` deploys to Vercel:

- `vercel.json` rewrites all `/api/*` requests to the Express app in `api/index.js`
- Everything else serves the SPA (`index.html`)
- `VITE_*` variables must be set in Vercel's environment settings — they are baked into the build
