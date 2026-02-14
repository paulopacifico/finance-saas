DO $$
BEGIN
  IF to_regclass('public.finance_saas') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'finance_saas'
        AND policyname = 'finance_saas_service_role_all'
    ) THEN
      EXECUTE '
        CREATE POLICY finance_saas_service_role_all ON public.finance_saas
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true)
      ';
    END IF;
  END IF;
END
$$;
