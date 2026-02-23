ALTER POLICY transactions_select_owner ON public.transactions
  USING ("userId" = (SELECT auth.uid()::text));

ALTER POLICY transactions_insert_owner ON public.transactions
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

ALTER POLICY transactions_update_owner ON public.transactions
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

ALTER POLICY transactions_delete_owner ON public.transactions
  USING ("userId" = (SELECT auth.uid()::text));
