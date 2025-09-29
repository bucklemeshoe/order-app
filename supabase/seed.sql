-- Menu data is now handled by migration 0008_replace_menu_data.sql
-- No additional seeding needed here

-- Add RLS policy for menu_items (public read)
DROP POLICY IF EXISTS "menu public read" ON public.menu_items;
CREATE POLICY "menu public read" ON public.menu_items FOR SELECT USING (true);