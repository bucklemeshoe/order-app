-- Fix category names to match admin format instead of lowercase
-- This ensures categories display properly in the admin interface

UPDATE public.menu_items 
SET category = CASE 
  WHEN category = 'coffee' THEN 'Coffee'
  WHEN category = 'pastry' THEN 'Pastries'
  WHEN category = 'food' THEN 'Food'
  WHEN category = 'tea' THEN 'Teas'
  WHEN category = 'cold' THEN 'Cold Drinks'
  ELSE category -- Keep any already correct categories
END
WHERE category IN ('coffee', 'pastry', 'food', 'tea', 'cold');
