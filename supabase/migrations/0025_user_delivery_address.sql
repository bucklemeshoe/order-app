-- Add delivery_address to user profile
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS delivery_address text;
