CREATE POLICY transactions_select_owner ON public.transactions
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY transactions_insert_owner ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY transactions_update_owner ON public.transactions
  FOR UPDATE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY transactions_delete_owner ON public.transactions
  FOR DELETE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));
