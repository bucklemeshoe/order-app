-- ============================================================
-- Migration 0027: Yoco Payment Integration
-- ============================================================
-- Creates payment_credentials table for secure secret key storage.
-- Extends orders table with payment link metadata columns.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Payment credentials table (isolated from app_settings)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_credentials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider    text NOT NULL UNIQUE,                 -- 'yoco', 'snapscan', etc.
  secret_key  text,                                 -- encrypted at rest by Supabase
  public_key  text,
  environment text NOT NULL DEFAULT 'test',          -- 'test' | 'live'
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: only admins can access payment_credentials
ALTER TABLE public.payment_credentials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "payment_credentials_admin_select" ON public.payment_credentials;
DROP POLICY IF EXISTS "payment_credentials_admin_insert" ON public.payment_credentials;
DROP POLICY IF EXISTS "payment_credentials_admin_update" ON public.payment_credentials;

CREATE POLICY "payment_credentials_admin_select"
  ON public.payment_credentials FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "payment_credentials_admin_insert"
  ON public.payment_credentials FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "payment_credentials_admin_update"
  ON public.payment_credentials FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────────────────────────
-- 2. Extend orders table with payment link metadata
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_link          text,
  ADD COLUMN IF NOT EXISTS payment_provider      text,
  ADD COLUMN IF NOT EXISTS payment_provider_id   text,
  ADD COLUMN IF NOT EXISTS payment_requested_at  timestamptz,
  ADD COLUMN IF NOT EXISTS payment_paid_at       timestamptz;
