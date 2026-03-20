-- Enable Supabase Realtime on the orders table so both the
-- admin dashboard and customer app receive live updates.

-- Set replica identity to FULL so UPDATE payloads include the
-- old row (needed for client-side user_id filtering).
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Add the orders table to the supabase_realtime publication.
-- The publication may already exist, so we use ALTER .. ADD TABLE.
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
