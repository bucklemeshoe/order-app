-- Add tags column to menu_items table
-- This will store an array of tag strings for each menu item
ALTER TABLE public.menu_items
ADD COLUMN tags jsonb DEFAULT '[]'::jsonb;
