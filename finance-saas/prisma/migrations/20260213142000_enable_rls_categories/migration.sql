ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select_owner ON public.categories
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY categories_insert_owner ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY categories_update_owner ON public.categories
  FOR UPDATE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY categories_delete_owner ON public.categories
  FOR DELETE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));
