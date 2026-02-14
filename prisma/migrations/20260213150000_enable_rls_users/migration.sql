ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_owner ON public.users
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()::text));

CREATE POLICY users_insert_owner ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()::text));

CREATE POLICY users_update_owner ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()::text))
  WITH CHECK (id = (SELECT auth.uid()::text));

CREATE POLICY users_delete_owner ON public.users
  FOR DELETE
  TO authenticated
  USING (id = (SELECT auth.uid()::text));
