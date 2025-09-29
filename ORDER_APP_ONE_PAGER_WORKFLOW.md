
# 🚀 Order App — Day‑to‑Day Dev Workflow (One‑Pager)

This is your quick reference for working in the **order-app** monorepo.

- Tech: **Ionic + React + Tailwind** (Capacitor‑ready), **Supabase**, **Clerk (per client)**.
- Structure: `apps/<client>-mobile` + shared `packages/*`.

## 📖 **Terminology:**
- **"Vanilla"** = The base/default instance of Order App (`apps/order-mobile` + `apps/admin`) - the foundational version with mock auth before client-specific customizations
- **Client Apps** = Customized versions for specific clients with Clerk auth (e.g., `apps/acme-mobile`, `apps/saiy-mobile`)

---

## 1) What goes where
**Shared (auto‑updates all apps):**
- `packages/core-ui` – reusable UI (Ionic wrappers: Button, Input, ListItem, Modal, Toast).
- `packages/core-theme` – Tailwind tokens mapped to Ionic CSS vars. Import in each app entry.
- `packages/core-lib` – hooks, utils, **Supabase client** (env‑only).

**Per‑client (app‑specific):**
- `apps/<client>-mobile` – routes, branding, feature toggles, any overrides.

> Rule of thumb: put 80–90% in `packages/*`. Only client‑specific differences live in `apps/<client>-mobile`.

---

## 2) Running locally
**Vanilla apps** (mock auth):
```bash
npm install
npm run dev:mobile  # runs apps/order-mobile (vanilla mobile)
npm run dev:admin   # runs apps/admin (vanilla admin)
```
Set local envs in `apps/order-mobile/.env.local` (vanilla mobile):
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
# No auth provider needed - vanilla uses mock auth only
```

Supabase local (optional):
```bash
npm run supabase:local:start
npm run supabase:local:reset
```

---

## 3) New client in 1 minute
```bash
./tooling/new_client.sh acme
cp apps/acme-mobile/.env.example apps/acme-mobile/.env.local
# Fill cloud Supabase + Clerk keys (defaults to VITE_AUTH_PROVIDER=clerk)
npm run -w apps/acme-mobile dev
```

> The script defaults new clients to **Clerk**; vanilla apps (`order-mobile` + `admin`) use **mock auth** for quick dev.

---

## 4) Auth modes
- Switch via `VITE_AUTH_PROVIDER`:
  - `mock` → uses `MockAuthProvider` (guest user), no Clerk needed.
  - `clerk` → wire `ClerkProvider` and set `VITE_CLERK_PUBLISHABLE_KEY`.
- Add Clerk later by flipping the env and wrapping providers in `main.tsx`.

---

## 5) Moving to Cloud (per client/app)
1. Create Supabase Cloud project(s): staging/prod.
2. Link and push schema:
   ```bash
   npm run supabase:link -- --project-ref <PROJECT_REF>
   npm run supabase:push
   npm run functions:deploy   # if using Edge Functions
   ```
3. In the app’s `.env.staging` / `.env.production`, set:
   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   VITE_AUTH_PROVIDER=clerk
   VITE_CLERK_PUBLISHABLE_KEY=...
   ```
4. Build/deploy using those envs.

> The Supabase client is **env‑only** and will throw if envs are missing to prevent prod→dev DB mistakes.

---

## 6) Updating all apps vs one app
- **Change in `packages/*`** → all client apps get it automatically.
- **Change in `apps/<client>-mobile`** → only that client is affected.
- For cross‑app UI updates: edit `packages/core-ui` then run each app’s dev/build to verify.

---

## 7) Ionic + Tailwind rules (consistency)
- Use **Ionic** for interactive components (nav, inputs, modals, toasts, pickers).
- Use **Tailwind** for layout/spacing/typography only.
- Scaffold every page with **IonPage → IonHeader → IonContent**.
- Spacing scale: 4/8/12/16/20/24/32/40/48. Type: H1 32, H2 24, H3 20, body 16.
- Tap targets ≥ 44px. Add loading/empty/error states.

Cursor prompt (paste per file):
```
Design pass on this screen. 
- Convert to Ionic components; keep Tailwind for layout/typography. 
- Normalize type/spacing, add loading/empty/error states. 
Return a diff-only patch.
```

---

## 8) Per‑client env checklist
`apps/<client>-mobile/.env.local` (defaults from script)
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AUTH_PROVIDER=clerk
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
```
> Keep `.env.local` out of Git. Commit `.env.example` only.

---

## 9) Common tasks
- **Create client:** `./tooling/new_client.sh <slug>` → fill envs → `npm run -w apps/<slug>-mobile dev`
- **Local DB:** `npm run supabase:local:start` → `npm run supabase:local:reset`
- **Push schema to Cloud:** `npm run supabase:link -- --project-ref <REF>` → `npm run supabase:push`
- **Functions:** `npm run functions:deploy`
- **Lint:** `npm run lint`

---

## 10) Quick troubleshooting
- **Env error on startup:** set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in the app’s `.env.local`.
- **Clerk screen blank:** ensure `VITE_AUTH_PROVIDER=clerk` and a valid `VITE_CLERK_PUBLISHABLE_KEY`.
- **Design inconsistent:** run “Design pass” prompt and ensure `@order-app/core-theme` is imported in app entry.
- **Client not seeing shared updates:** verify imports point to `@order-app/core-ui|lib|theme` (not local copies).

---

## 11) What not to do
- Don’t hardcode Supabase URLs/keys in code.
- Don’t edit shared code inside app folders; put it in `packages/*`.
- Don’t mix non‑Ionic input/nav components into mobile screens.

---

## 12) Ready for release?
- [ ] App runs on device; main flows tested
- [ ] Env files set for staging/prod
- [ ] Supabase migrations pushed; functions deployed
- [ ] Icons/splash/branding set per client
- [ ] Store listings prepared (copy/screenshots/privacy)

Happy shipping! ✨
