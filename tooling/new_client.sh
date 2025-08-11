#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: ./tooling/new_client.sh <slug>" >&2
  exit 1
fi

SLUG="$1"
SRC="apps/order-mobile"
DST="apps/${SLUG}-mobile"

if [ ! -d "$SRC" ]; then
  echo "❌ Source app not found at $SRC" >&2
  exit 1
fi

echo "➡️  Creating ${DST} from ${SRC} ..."
cp -R "$SRC" "$DST"

# Reset envs
rm -f "$DST/.env.local" "$DST/.env.staging" "$DST/.env.production" 2>/dev/null || true

# Write a per-client .env.example defaulting to Clerk
cat > "$DST/.env.example" <<'ENV'
# --- Supabase (Cloud per client) ---
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# --- Auth provider ---
# For client apps we default to Clerk (change to 'mock' only for local dev without Clerk)
VITE_AUTH_PROVIDER=clerk

# --- Clerk (required when VITE_AUTH_PROVIDER=clerk) ---
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
ENV

# Optional: rename package.json "name" using jq if available
if command -v jq >/dev/null 2>&1; then
  tmp="$DST/package.json.tmp"
  jq '.name = "@order-app/'"$SLUG"'-mobile"' "$DST/package.json" > "$tmp" && mv "$tmp" "$DST/package.json"
fi

echo "✅ Created $DST"
echo "Next steps:"
echo "  1) Create Supabase Cloud (staging/prod) projects for '${SLUG}'."
echo "  2) Create a Clerk instance for '${SLUG}' (Dev + Prod)."
echo "  3) Copy .env.example to .env.local, fill values, and set VITE_AUTH_PROVIDER=clerk."
echo "  4) Run the app: npm run -w apps/${SLUG}-mobile dev"


