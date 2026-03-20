-- Replace menu data with correct variants from menu-items.md
-- Clear existing data and insert with proper size/price combinations

DELETE FROM public.menu_items;

INSERT INTO public.menu_items (name, description, price, category, image_url, is_active, variants) VALUES

-- Coffee
('Golden Hour (Butterscotch)', 'Signature butterscotch coffee', 55.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 55.00}]'::jsonb),
('Drip Coffee', 'Fresh drip coffee', 35.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 35.00}, {"id": "tall", "name": "Tall", "price": 40.00}]'::jsonb),
('Espresso', 'Rich and bold espresso shot', 25.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 25.00}, {"id": "tall", "name": "Tall", "price": 28.00}]'::jsonb),
('Cafe Mocha', 'Espresso with chocolate and steamed milk', 40.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 40.00}, {"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),
('Cortado', 'Espresso with warm milk', 35.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 35.00}]'::jsonb),
('Americano', 'Espresso with hot water', 30.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 30.00}, {"id": "tall", "name": "Tall", "price": 33.00}]'::jsonb),
('Cappuccino', 'Equal parts espresso, steamed milk, and foam', 35.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 35.00}, {"id": "tall", "name": "Tall", "price": 40.00}]'::jsonb),
('Flat White', 'Espresso with microfoam milk', 35.00, 'Coffee', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 35.00}]'::jsonb),

-- Lattes
('Cafe Latte', 'Espresso with steamed milk and light foam', 35.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 35.00}, {"id": "tall", "name": "Tall", "price": 40.00}]'::jsonb),
('Chai Latte', 'Spiced tea latte with steamed milk', 40.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 40.00}, {"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),
('Ice Latte Tall', 'Chilled espresso with cold milk', 45.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),
('Ice Chocolate Latte', 'Iced chocolate coffee latte', 55.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 55.00}]'::jsonb),
('Ice Mocha Tall', 'Iced mocha coffee', 50.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 50.00}]'::jsonb),
('Ice Spanish Latte', 'Iced Spanish-style latte', 45.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),
('Ice Rose Spanish Latte', 'Iced rose-flavored Spanish latte', 45.00, 'Lattes', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),

-- Hot or Cold
('Red Espresso', 'Red bush espresso alternative', 40.00, 'Hot or Cold', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 40.00}, {"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),
('Ice Golden Hour (Butterscotch)', 'Iced signature butterscotch', 69.00, 'Hot or Cold', '/placeholder.svg', true, 
 '[{"id": "tall", "name": "Tall", "price": 69.00}]'::jsonb),
('Hot Chocolate', 'Rich hot chocolate drink', 40.00, 'Hot or Cold', '/placeholder.svg', true, 
 '[{"id": "short", "name": "Short", "price": 40.00}, {"id": "tall", "name": "Tall", "price": 45.00}]'::jsonb),

-- Milkshakes & Smoothies
('Date Smoothie', 'Healthy date smoothie', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 75.00}]'::jsonb),
('Go Green Smoothie', 'Green vegetable and fruit smoothie', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 75.00}]'::jsonb),
('Goldenhour Shake (no coffee)', 'Butterscotch shake without coffee', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 75.00}]'::jsonb),
('Strawberry Shake', 'Fresh strawberry milkshake', 59.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 59.00}]'::jsonb),
('Coffee Shake', 'Coffee-flavored milkshake', 65.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 65.00}]'::jsonb),
('Chocolate Shake', 'Rich chocolate milkshake', 59.00, 'Milkshakes & Smoothies', '/placeholder.svg', true, 
 '[{"id": "500ml", "name": "500ml", "price": 59.00}]'::jsonb),

-- Specialty
('Green Gold Karak', 'Spicy Dubai-inspired blend with date. Available Fridays, Saturdays & Sundays takeaway only', 45.00, 'Specialty', '/placeholder.svg', true, 
 '[{"id": "250ml", "name": "250ml", "price": 45.00}]'::jsonb),

-- Combos
('Combo Short Cappuccino + Chicken Mayo Bagel', 'Short cappuccino with chicken mayo bagel', 70.00, 'Combos', '/placeholder.svg', true, 
 '[{"id": "combo", "name": "One Size", "price": 70.00}]'::jsonb),
('Combo Short Cappuccino + 3 Koeksisters', 'Short cappuccino with 3 koeksisters', 50.00, 'Combos', '/placeholder.svg', true, 
 '[{"id": "combo", "name": "One Size", "price": 50.00}]'::jsonb),

-- Extras
('Vanilla Syrup', 'Add vanilla syrup to any drink', 11.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 11.00}]'::jsonb),
('Hazelnut Syrup', 'Add hazelnut syrup to any drink', 11.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 11.00}]'::jsonb),
('Decaf Shot', 'Add decaf shot to any drink', 12.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 12.00}]'::jsonb),
('Almond Milk', 'Add almond milk to any drink', 11.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 11.00}]'::jsonb),
('Oat Milk', 'Add oat milk to any drink', 11.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 11.00}]'::jsonb),
('Extra Cream', 'Add extra cream to any drink', 11.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 11.00}]'::jsonb),
('Extra Shot', 'Add extra espresso shot', 12.00, 'Extras', '/placeholder.svg', true, 
 '[{"id": "add", "name": "Add", "price": 12.00}]'::jsonb),

-- Drinks
('Salaam Cola', 'Refreshing cola drink', 18.00, 'Drinks', '/placeholder.svg', true, 
 '[{"id": "bottle", "name": "Bottle", "price": 18.00}]'::jsonb),
('Bashews', 'Local carbonated drink', 15.00, 'Drinks', '/placeholder.svg', true, 
 '[{"id": "can", "name": "Can", "price": 15.00}]'::jsonb),
('Sparkling Water 500ml', 'Sparkling water', 18.00, 'Drinks', '/placeholder.svg', true, 
 '[{"id": "bottle", "name": "Bottle", "price": 18.00}]'::jsonb),
('Still Water 500ml', 'Still water', 15.00, 'Drinks', '/placeholder.svg', true, 
 '[{"id": "bottle", "name": "Bottle", "price": 15.00}]'::jsonb);
