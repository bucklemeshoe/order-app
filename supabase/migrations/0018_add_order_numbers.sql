-- Add order numbering system
-- This adds a simple sequential order number while preserving UUIDs for internal use

-- Add order_number column to orders table
ALTER TABLE public.orders
ADD COLUMN order_number integer;

-- Create a unique index on order_number to ensure no duplicates
CREATE UNIQUE INDEX orders_order_number_idx ON public.orders (order_number);

-- Add comment to explain the field
COMMENT ON COLUMN public.orders.order_number IS 'Simple sequential order number displayed to users and admin (e.g., 1001, 1002, etc.)';

-- Add order_number_start setting to app_settings for configurable starting number
INSERT INTO public.app_settings (key, value, description) 
VALUES (
  'order_number_start', 
  '1001', 
  'Starting number for the order numbering sequence'
) ON CONFLICT (key) DO NOTHING;

-- Add current_order_number setting to track the next number to assign
INSERT INTO public.app_settings (key, value, description) 
VALUES (
  'current_order_number', 
  '1001', 
  'Current order number counter - next order will use this number then increment'
) ON CONFLICT (key) DO NOTHING;
