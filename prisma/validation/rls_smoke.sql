-- RLS smoke test for Supabase public schema.
-- Validates row isolation for anon/authenticated/service_role across:
-- categories, transactions, accounts, budgets.
--
-- Usage (psql):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/validation/rls_smoke.sql
--
-- Notes:
-- - Runs in a transaction and finishes with ROLLBACK.
-- - Throws EXCEPTION on first failed assertion.

BEGIN;

-- Seed deterministic users
INSERT INTO public.users (id, email, "createdAt", "updatedAt")
VALUES
  ('00000000-0000-0000-0000-0000000000aa', 'rls-a@test.local', now(), now()),
  ('00000000-0000-0000-0000-0000000000bb', 'rls-b@test.local', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Seed deterministic accounts
INSERT INTO public.accounts
(id, "userId", name, type, currency, "openingBalance", "currentBalance", "createdAt", "updatedAt")
VALUES
  ('acc_rls_a','00000000-0000-0000-0000-0000000000aa','A Chequing','CHEQUING','CAD',0,0,now(),now()),
  ('acc_rls_b','00000000-0000-0000-0000-0000000000bb','B Chequing','CHEQUING','CAD',0,0,now(),now())
ON CONFLICT (id) DO NOTHING;

-- Seed deterministic categories
INSERT INTO public.categories
(id, "userId", name, type, "createdAt", "updatedAt")
VALUES
  ('cat_rls_iso_a','00000000-0000-0000-0000-0000000000aa','RLS_ISO_A','EXPENSE',now(),now()),
  ('cat_rls_iso_b','00000000-0000-0000-0000-0000000000bb','RLS_ISO_B','EXPENSE',now(),now())
ON CONFLICT (id) DO NOTHING;

-- Seed deterministic budgets
INSERT INTO public.budgets
(id, "userId", name, period, "periodStart", "periodEnd", "limitAmount", currency, "createdAt", "updatedAt")
VALUES
  ('bud_rls_a','00000000-0000-0000-0000-0000000000aa','Budget A','MONTHLY',date_trunc('month',now()),date_trunc('month',now()) + interval '1 month',1000,'CAD',now(),now()),
  ('bud_rls_b','00000000-0000-0000-0000-0000000000bb','Budget B','MONTHLY',date_trunc('month',now()),date_trunc('month',now()) + interval '1 month',2000,'CAD',now(),now())
ON CONFLICT (id) DO NOTHING;

-- Seed deterministic transactions
INSERT INTO public.transactions
(id, "userId", "accountId", "categoryId", type, amount, currency, "transactionAt", "createdAt", "updatedAt")
VALUES
  ('tx_rls_a','00000000-0000-0000-0000-0000000000aa','acc_rls_a','cat_rls_iso_a','EXPENSE',10.00,'CAD',now(),now(),now()),
  ('tx_rls_b','00000000-0000-0000-0000-0000000000bb','acc_rls_b','cat_rls_iso_b','EXPENSE',20.00,'CAD',now(),now(),now())
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  c bigint;
BEGIN
  -- categories: anon sees nothing
  EXECUTE 'SET LOCAL ROLE anon';
  SELECT count(*) INTO c FROM public.categories WHERE id IN ('cat_rls_iso_a','cat_rls_iso_b');
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: categories anon expected 0, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  -- categories: auth A sees only own, cannot update/delete B, service sees all
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', true);
  SELECT count(*) INTO c FROM public.categories WHERE id IN ('cat_rls_iso_a','cat_rls_iso_b');
  IF c <> 1 THEN
    RAISE EXCEPTION 'RLS failed: categories auth A visible expected 1, got %', c;
  END IF;
  WITH upd AS (
    UPDATE public.categories SET name = name WHERE id = 'cat_rls_iso_b' RETURNING 1
  )
  SELECT count(*) INTO c FROM upd;
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: categories auth A update B expected 0, got %', c;
  END IF;
  WITH del AS (
    DELETE FROM public.categories WHERE id = 'cat_rls_iso_b' RETURNING 1
  )
  SELECT count(*) INTO c FROM del;
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: categories auth A delete B expected 0, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  EXECUTE 'SET LOCAL ROLE service_role';
  SELECT count(*) INTO c FROM public.categories WHERE id IN ('cat_rls_iso_a','cat_rls_iso_b');
  IF c <> 2 THEN
    RAISE EXCEPTION 'RLS failed: categories service_role expected 2, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  -- transactions: auth A sees own, cannot update B, service sees all
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', true);
  SELECT count(*) INTO c FROM public.transactions WHERE id IN ('tx_rls_a','tx_rls_b');
  IF c <> 1 THEN
    RAISE EXCEPTION 'RLS failed: transactions auth A visible expected 1, got %', c;
  END IF;
  WITH upd AS (
    UPDATE public.transactions SET amount = amount WHERE id = 'tx_rls_b' RETURNING 1
  )
  SELECT count(*) INTO c FROM upd;
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: transactions auth A update B expected 0, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  EXECUTE 'SET LOCAL ROLE service_role';
  SELECT count(*) INTO c FROM public.transactions WHERE id IN ('tx_rls_a','tx_rls_b');
  IF c <> 2 THEN
    RAISE EXCEPTION 'RLS failed: transactions service_role expected 2, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  -- accounts: auth A sees own, cannot delete B, service sees all
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', true);
  SELECT count(*) INTO c FROM public.accounts WHERE id IN ('acc_rls_a','acc_rls_b');
  IF c <> 1 THEN
    RAISE EXCEPTION 'RLS failed: accounts auth A visible expected 1, got %', c;
  END IF;
  WITH del AS (
    DELETE FROM public.accounts WHERE id = 'acc_rls_b' RETURNING 1
  )
  SELECT count(*) INTO c FROM del;
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: accounts auth A delete B expected 0, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  EXECUTE 'SET LOCAL ROLE service_role';
  SELECT count(*) INTO c FROM public.accounts WHERE id IN ('acc_rls_a','acc_rls_b');
  IF c <> 2 THEN
    RAISE EXCEPTION 'RLS failed: accounts service_role expected 2, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  -- budgets: auth A sees own, cannot update B, service sees all
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', true);
  SELECT count(*) INTO c FROM public.budgets WHERE id IN ('bud_rls_a','bud_rls_b');
  IF c <> 1 THEN
    RAISE EXCEPTION 'RLS failed: budgets auth A visible expected 1, got %', c;
  END IF;
  WITH upd AS (
    UPDATE public.budgets SET name = name WHERE id = 'bud_rls_b' RETURNING 1
  )
  SELECT count(*) INTO c FROM upd;
  IF c <> 0 THEN
    RAISE EXCEPTION 'RLS failed: budgets auth A update B expected 0, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  EXECUTE 'SET LOCAL ROLE service_role';
  SELECT count(*) INTO c FROM public.budgets WHERE id IN ('bud_rls_a','bud_rls_b');
  IF c <> 2 THEN
    RAISE EXCEPTION 'RLS failed: budgets service_role expected 2, got %', c;
  END IF;
  EXECUTE 'RESET ROLE';

  RAISE NOTICE 'RLS smoke test PASSED for categories, transactions, accounts, budgets';
END
$$;

ROLLBACK;
