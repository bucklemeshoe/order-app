-- ============================================================
-- Migration 0028: Update Orders Status Check Constraint
-- ============================================================
-- Drops the old status check constraint from the orders table
-- and adds a new one that includes 'awaiting_payment', 'paid', 'out_for_delivery', and 'delivered'.
-- ============================================================

DO $$ 
DECLARE
  constraint_name text;
BEGIN
  -- Find the auto-generated check constraint name for the status column
  SELECT conname INTO constraint_name
  FROM pg_constraint c
  JOIN pg_class t ON c.conrelid = t.oid
  WHERE t.relname = 'orders' 
    AND c.contype = 'c' 
    AND pg_get_constraintdef(c.oid) LIKE '%status%';

  -- Drop the constraint if it exists
  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT ' || constraint_name;
  END IF;
END $$;

-- Add updated constraint with all valid statuses
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'awaiting_payment', 'paid', 'preparing', 'ready', 'collected', 'out_for_delivery', 'delivered', 'cancelled'));
