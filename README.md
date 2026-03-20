# Order App

A production-ready ordering system for small businesses. Customers browse and order from their phone, admins manage everything from a dashboard.

## Structure

```
order-app/
├── app/           # Next.js routes (/, /admin, /auth)
├── components/    # UI components (customer, admin, shared, ui)
├── lib/           # API layer, helpers, Supabase clients
├── hooks/         # Custom React hooks
├── store/         # Zustand cart store
├── styles/        # Global CSS
├── types/         # TypeScript types
├── public/        # Static assets, PWA manifest
├── supabase/      # Database migrations, config, edge functions
└── package.json
```

## Quick Start

```bash
# Start Supabase (requires Docker)
npx supabase start

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS v4, shadcn/ui, Zustand
- **Backend:** Supabase (Postgres, Auth, Realtime, RLS)
- **PWA:** Offline-ready with service worker

## Routes

| Route | Description |
|-------|-------------|
| `/` | Customer ordering app |
| `/auth/login` | Customer login / signup |
| `/admin` | Order management (real-time) |
| `/admin/menu` | Menu item CRUD |
| `/admin/settings` | Tax, hours, availability |
| `/admin/login` | Admin login |