-- Add INSERT, UPDATE, DELETE policies for menu_items for admin functionality
-- For local development, these are wide open. In production, you'd add proper auth checks.

-- Allow public insert on menu_items (for admin)
drop policy if exists "menu public insert" on public.menu_items;
create policy "menu public insert"
on public.menu_items for insert with check (true);

-- Allow public update on menu_items (for admin)
drop policy if exists "menu public update" on public.menu_items;
create policy "menu public update"
on public.menu_items for update using (true);

-- Allow public delete on menu_items (for admin)
drop policy if exists "menu public delete" on public.menu_items;
create policy "menu public delete"
on public.menu_items for delete using (true);
