-- Link menu items to relevant extras
-- Coffee items get milk options, syrups, and shots

-- Update coffee items to include relevant extras
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Hazelnut Syrup", "Decaf Shot", "Almond Milk", "Oat Milk", "Extra Cream", "Extra Shot"]'
WHERE category = 'Coffee' AND name NOT LIKE '%Golden Hour%';

-- Golden Hour only gets non-coffee extras
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Hazelnut Syrup", "Almond Milk", "Oat Milk", "Extra Cream"]'
WHERE category = 'Coffee' AND name LIKE '%Golden Hour%';

-- Lattes get milk options, syrups, and shots
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Hazelnut Syrup", "Decaf Shot", "Almond Milk", "Oat Milk", "Extra Cream", "Extra Shot"]'
WHERE category = 'Lattes';

-- Hot or Cold drinks get milk options and syrups
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Hazelnut Syrup", "Almond Milk", "Oat Milk", "Extra Cream"]'
WHERE category = 'Hot or Cold';

-- Milkshakes get syrups and milk options (no shots or cream)
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Hazelnut Syrup", "Almond Milk", "Oat Milk"]'
WHERE category = 'Milkshakes & Smoothies';

-- Specialty drinks get limited extras
UPDATE public.menu_items 
SET extras = '["Vanilla Syrup", "Almond Milk", "Oat Milk"]'
WHERE category = 'Specialty';
