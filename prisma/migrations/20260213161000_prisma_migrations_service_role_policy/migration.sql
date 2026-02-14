CREATE POLICY prisma_migrations_service_role_all ON public._prisma_migrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
