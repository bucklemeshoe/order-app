-- ============================================================
-- Migration 0019: Production Schema
-- ============================================================
-- Transforms the prototype schema into production-ready state:
-- 1. Fix users.id → UUID (for Supabase Auth compatibility)
-- 2. Create order_items table
-- 3. Add total_amount / tax_amount to orders
-- 4. Create atomic order number sequence
-- 5. Drop unused columns and extensions
-- 6. Standardise app_settings
-- 7. Re-enable RLS with proper policies
-- 8. Create admin check helper
-- 9. Create user-sync trigger for auth.users
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. Clean up existing wide-open policies
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users read own profile"   ON public.users;
DROP POLICY IF EXISTS "users insert own profile" ON public.users;
DROP POLICY IF EXISTS "users update own profile" ON public.users;
DROP POLICY IF EXISTS "orders select own"        ON public.orders;
DROP POLICY IF EXISTS "orders insert own"        ON public.orders;
DROP POLICY IF EXISTS "menu public read"         ON public.menu_items;
DROP POLICY IF EXISTS "menu public insert"       ON public.menu_items;
DROP POLICY IF EXISTS "menu public update"       ON public.menu_items;
DROP POLICY IF EXISTS "menu public delete"       ON public.menu_items;
DROP POLICY IF EXISTS "Settings are public read" ON public.app_settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON public.app_settings;

-- ────────────────────────────────────────────────────────────
-- 1. Fix users.id back to UUID for Supabase Auth
-- ────────────────────────────────────────────────────────────

-- Drop FK on orders first
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Clear any non-UUID demo data
DELETE FROM public.orders WHERE user_id NOT SIMILAR TO
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
DELETE FROM public.users WHERE id NOT SIMILAR TO
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

-- Change types back to UUID
ALTER TABLE public.users  ALTER COLUMN id      TYPE uuid USING id::uuid;
ALTER TABLE public.orders ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Re-add FK
ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add role column to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer';

-- ────────────────────────────────────────────────────────────
-- 2. Add total_amount and tax_amount to orders
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS total_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS tax_amount   numeric(10,2);

-- ────────────────────────────────────────────────────────────
-- 3. Drop unused columns on orders
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  DROP COLUMN IF EXISTS share_location,
  DROP COLUMN IF EXISTS current_location;

-- ────────────────────────────────────────────────────────────
-- 4. Atomic order number sequence
-- ────────────────────────────────────────────────────────────

-- Find the max existing order number to seed the sequence
DO $$
DECLARE
  max_num integer;
BEGIN
  SELECT COALESCE(MAX(order_number), 1000) INTO max_num FROM public.orders;
  EXECUTE format('CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH %s INCREMENT BY 1', max_num + 1);
END
$$;

-- Set default on orders.order_number to use the sequence
ALTER TABLE public.orders
  ALTER COLUMN order_number SET DEFAULT nextval('public.order_number_seq');

-- ────────────────────────────────────────────────────────────
-- 5. Create order_items table
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.order_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  name       text NOT NULL,
  price      numeric(10,2) NOT NULL,
  quantity   integer NOT NULL DEFAULT 1,
  extras     jsonb DEFAULT '[]'::jsonb,
  variant    jsonb
);

-- Index for fast lookups by order
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);

-- ────────────────────────────────────────────────────────────
-- 6. Admin check helper function
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- 7. Auth trigger: sync auth.users → public.users
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_app_meta_data ->> 'user_role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name  = COALESCE(EXCLUDED.name, public.users.name);
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 8. Re-enable RLS on all tables
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings  ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 9. RLS Policies
-- ────────────────────────────────────────────────────────────

-- ── Users ──
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── Orders ──
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ── Order Items ──
CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ── Order Events ──
CREATE POLICY "order_events_select"
  ON public.order_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_events.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_events_insert_admin"
  ON public.order_events FOR INSERT
  WITH CHECK (public.is_admin());

-- ── Menu Items (public read, admin write) ──
CREATE POLICY "menu_select_public"
  ON public.menu_items FOR SELECT
  USING (true);

CREATE POLICY "menu_insert_admin"
  ON public.menu_items FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "menu_update_admin"
  ON public.menu_items FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "menu_delete_admin"
  ON public.menu_items FOR DELETE
  USING (public.is_admin());

-- ── App Settings (public read, admin write) ──
CREATE POLICY "settings_select_public"
  ON public.app_settings FOR SELECT
  USING (true);

CREATE POLICY "settings_update_admin"
  ON public.app_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "settings_insert_admin"
  ON public.app_settings FOR INSERT
  WITH CHECK (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 10. Standardise app_settings
-- ────────────────────────────────────────────────────────────

-- Fix tax rate to 15% (South Africa)
UPDATE public.app_settings SET value = '0.15' WHERE key = 'tax_rate';

-- Remove the prototype order counter (now using sequence)
DELETE FROM public.app_settings WHERE key IN ('current_order_number', 'order_number_start');

-- ────────────────────────────────────────────────────────────
-- 11. Drop PostGIS (unused)
-- ────────────────────────────────────────────────────────────

DROP EXTENSION IF EXISTS postgis CASCADE;
