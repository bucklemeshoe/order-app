-- Add collection time fields to orders table
-- These fields will track the estimated preparation time and when the order will be ready

ALTER TABLE public.orders
ADD COLUMN collection_time_minutes integer,
ADD COLUMN estimated_ready_at timestamptz;

-- Add comments to explain the fields
COMMENT ON COLUMN public.orders.collection_time_minutes IS 'Number of minutes estimated for order preparation (15, 30, or 45)';
COMMENT ON COLUMN public.orders.estimated_ready_at IS 'Calculated timestamp when order should be ready for collection';
