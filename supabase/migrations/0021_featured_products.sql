-- Add is_featured flag to menu_items table
ALTER TABLE menu_items 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Allow reading the new column for everyone
-- It is already fully handled since properties are queried with `SELECT *`
