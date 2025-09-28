-- Add support for multiple variants (sizes/prices) per menu item
-- This allows items like "Short: R 35.00, Tall: R 40.00"

-- Add variants column to store size/price combinations as JSON
ALTER TABLE public.menu_items 
ADD COLUMN variants jsonb DEFAULT '[]'::jsonb;

-- Update existing items to use variants structure
-- For now, convert single price to default variant
UPDATE public.menu_items 
SET variants = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'name', 'Regular',
    'price', price
  )
)
WHERE variants = '[]'::jsonb;

-- The price column will be kept for backward compatibility and mobile app
-- It will represent the base/minimum price
