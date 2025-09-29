-- Replace menu data with new comprehensive menu items
-- Clear existing data and insert new menu from menu-items.md

-- Delete all existing menu items
DELETE FROM public.menu_items;

-- Insert new comprehensive menu data
INSERT INTO public.menu_items (name, description, price, category, image_url, is_active) VALUES

-- Coffee
('Golden Hour (Butterscotch)', 'Signature butterscotch coffee - Tall only', 55.00, 'Coffee', '/placeholder.svg', true),
('Drip Coffee', 'Fresh drip coffee', 35.00, 'Coffee', '/placeholder.svg', true),
('Espresso', 'Rich and bold espresso shot', 25.00, 'Coffee', '/placeholder.svg', true),
('Cafe Mocha', 'Espresso with chocolate and steamed milk', 40.00, 'Coffee', '/placeholder.svg', true),
('Cortado', 'Espresso with warm milk - Short only', 35.00, 'Coffee', '/placeholder.svg', true),
('Americano', 'Espresso with hot water', 30.00, 'Coffee', '/placeholder.svg', true),
('Cappuccino', 'Equal parts espresso, steamed milk, and foam', 35.00, 'Coffee', '/placeholder.svg', true),
('Flat White', 'Espresso with microfoam milk - Short only', 35.00, 'Coffee', '/placeholder.svg', true),

-- Lattes
('Cafe Latte', 'Espresso with steamed milk and light foam', 35.00, 'Lattes', '/placeholder.svg', true),
('Chai Latte', 'Spiced tea latte with steamed milk', 40.00, 'Lattes', '/placeholder.svg', true),
('Ice Latte Tall', 'Chilled espresso with cold milk - Tall only', 45.00, 'Lattes', '/placeholder.svg', true),
('Ice Chocolate Latte', 'Iced chocolate coffee latte - Tall only', 55.00, 'Lattes', '/placeholder.svg', true),
('Ice Mocha Tall', 'Iced mocha coffee - Tall only', 50.00, 'Lattes', '/placeholder.svg', true),
('Ice Spanish Latte', 'Iced Spanish-style latte - Tall only', 45.00, 'Lattes', '/placeholder.svg', true),
('Ice Rose Spanish Latte', 'Iced rose-flavored Spanish latte - Tall only', 45.00, 'Lattes', '/placeholder.svg', true),

-- Hot or Cold
('Red Espresso', 'Red bush espresso alternative', 40.00, 'Hot or Cold', '/placeholder.svg', true),
('Ice Golden Hour (Butterscotch)', 'Iced signature butterscotch - Tall only', 69.00, 'Hot or Cold', '/placeholder.svg', true),
('Hot Chocolate', 'Rich hot chocolate drink', 40.00, 'Hot or Cold', '/placeholder.svg', true),

-- Milkshakes & Smoothies
('Date Smoothie', 'Healthy date smoothie - 500ml', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),
('Go Green Smoothie', 'Green vegetable and fruit smoothie - 500ml', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),
('Goldenhour Shake (no coffee)', 'Butterscotch shake without coffee - 500ml', 75.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),
('Strawberry Shake', 'Fresh strawberry milkshake - 500ml', 59.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),
('Coffee Shake', 'Coffee-flavored milkshake - 500ml', 65.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),
('Chocolate Shake', 'Rich chocolate milkshake - 500ml', 59.00, 'Milkshakes & Smoothies', '/placeholder.svg', true),

-- Specialty
('Green Gold Karak', 'Spicy Dubai-inspired blend with date - 250ml. Available Fridays, Saturdays & Sundays takeaway only', 45.00, 'Specialty', '/placeholder.svg', true),

-- Combos
('Combo Short Cappuccino + Chicken Mayo Bagel', 'Short cappuccino with chicken mayo bagel', 70.00, 'Combos', '/placeholder.svg', true),
('Combo Short Cappuccino + 3 Koeksisters', 'Short cappuccino with 3 koeksisters', 50.00, 'Combos', '/placeholder.svg', true),

-- Extras
('Vanilla Syrup', 'Add vanilla syrup to any drink', 11.00, 'Extras', '/placeholder.svg', true),
('Hazelnut Syrup', 'Add hazelnut syrup to any drink', 11.00, 'Extras', '/placeholder.svg', true),
('Decaf Shot', 'Add decaf shot to any drink', 12.00, 'Extras', '/placeholder.svg', true),
('Almond Milk', 'Add almond milk to any drink', 11.00, 'Extras', '/placeholder.svg', true),
('Oat Milk', 'Add oat milk to any drink', 11.00, 'Extras', '/placeholder.svg', true),
('Extra Cream', 'Add extra cream to any drink', 11.00, 'Extras', '/placeholder.svg', true),
('Extra Shot', 'Add extra espresso shot', 12.00, 'Extras', '/placeholder.svg', true),

-- Drinks
('Salaam Cola', 'Refreshing cola drink - Bottle', 18.00, 'Drinks', '/placeholder.svg', true),
('Bashews', 'Local carbonated drink - Can', 15.00, 'Drinks', '/placeholder.svg', true),
('Sparkling Water 500ml', 'Sparkling water - 500ml bottle', 18.00, 'Drinks', '/placeholder.svg', true),
('Still Water 500ml', 'Still water - 500ml bottle', 15.00, 'Drinks', '/placeholder.svg', true);
