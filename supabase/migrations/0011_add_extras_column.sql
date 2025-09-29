-- Add extras column to menu_items table
ALTER TABLE public.menu_items
ADD COLUMN extras jsonb DEFAULT '[]';

-- Update the column to have a default empty array for existing records
UPDATE public.menu_items
SET extras = '[]'
WHERE extras IS NULL;
