DROP POLICY IF EXISTS accounts_select_owner ON public.accounts;
DROP POLICY IF EXISTS accounts_insert_owner ON public.accounts;
DROP POLICY IF EXISTS accounts_update_owner ON public.accounts;
DROP POLICY IF EXISTS accounts_delete_owner ON public.accounts;

CREATE POLICY accounts_select_owner ON public.accounts
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY accounts_insert_owner ON public.accounts
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY accounts_update_owner ON public.accounts
  FOR UPDATE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY accounts_delete_owner ON public.accounts
  FOR DELETE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));
