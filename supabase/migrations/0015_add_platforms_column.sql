-- Add platforms column to menu_items table
-- This will track which platforms each item should be visible on
ALTER TABLE public.menu_items
ADD COLUMN platforms jsonb DEFAULT '[]';

-- Update existing items to be visible on all platforms by default
UPDATE public.menu_items
SET platforms = '["Display Menu", "Mobile App", "Other"]'
WHERE platforms = '[]';
