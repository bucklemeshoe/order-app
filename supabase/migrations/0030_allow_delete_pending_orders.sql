-- Allow customers to delete their own orders if they are still awaiting payment
DROP POLICY IF EXISTS "orders_delete_own_pending" ON public.orders;
CREATE POLICY "orders_delete_own_pending"
  ON public.orders FOR DELETE
  USING (user_id = auth.uid() AND status = 'awaiting_payment');
