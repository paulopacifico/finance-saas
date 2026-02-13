CREATE POLICY finance_saas_service_role_all ON public.finance_saas
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
