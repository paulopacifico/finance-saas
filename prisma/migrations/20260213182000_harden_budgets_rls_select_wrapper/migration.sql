DROP POLICY IF EXISTS budgets_select_owner ON public.budgets;
DROP POLICY IF EXISTS budgets_insert_owner ON public.budgets;
DROP POLICY IF EXISTS budgets_update_owner ON public.budgets;
DROP POLICY IF EXISTS budgets_delete_owner ON public.budgets;

CREATE POLICY budgets_select_owner ON public.budgets
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY budgets_insert_owner ON public.budgets
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY budgets_update_owner ON public.budgets
  FOR UPDATE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY budgets_delete_owner ON public.budgets
  FOR DELETE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));
