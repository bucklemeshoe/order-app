-- ============================================================
-- Migration 0029: Add archived column to orders
-- ============================================================
-- Soft-delete mechanism: archived orders are hidden from the
-- active admin dashboard but remain queryable for history.
-- ============================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

-- Index for fast filtering on the dashboard
CREATE INDEX IF NOT EXISTS idx_orders_archived ON public.orders (archived);
