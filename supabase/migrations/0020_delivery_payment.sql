-- ============================================================
-- Migration 0020: Delivery & Payment Support
-- ============================================================
-- Extends orders table with delivery and payment fields.
-- Adds customer self-update policy for payment confirmation.
-- Seeds new settings for delivery and payment configuration.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Add delivery & payment columns to orders
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type        text NOT NULL DEFAULT 'collection',
  ADD COLUMN IF NOT EXISTS delivery_address  text,
  ADD COLUMN IF NOT EXISTS delivery_notes    text,
  ADD COLUMN IF NOT EXISTS customer_phone    text,
  ADD COLUMN IF NOT EXISTS payment_method    text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS payment_status    text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS delivery_fee      numeric(10,2) DEFAULT 0;

-- ────────────────────────────────────────────────────────────
-- 2. RLS: Allow customers to update payment_status on own orders
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "orders_update_payment_own" ON public.orders;

CREATE POLICY "orders_update_payment_own"
  ON public.orders FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 3. Seed delivery & payment settings
-- ────────────────────────────────────────────────────────────

INSERT INTO public.app_settings (key, value) VALUES
  ('delivery_enabled',   '"false"'),
  ('delivery_fee',       '"0"'),
  ('yoco_enabled',       '"false"'),
  ('yoco_payment_link',  '""'),
  ('snapscan_enabled',   '"false"'),
  ('snapscan_link',      '""')
ON CONFLICT (key) DO NOTHING;
