-- Add position column to menu_items table for ordering within categories
ALTER TABLE public.menu_items
ADD COLUMN position integer DEFAULT 0;

-- Update existing items with sequential positions within each category
WITH numbered_items AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY name) - 1 AS new_position
  FROM public.menu_items
)
UPDATE public.menu_items 
SET position = numbered_items.new_position
FROM numbered_items 
WHERE public.menu_items.id = numbered_items.id;
