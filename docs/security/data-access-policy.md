# Data Access Policy (MVP)

## Rule
- User-facing reads/writes must be scoped by the authenticated user id (`userId`) in application queries.
- `service_role` credentials are reserved for administrative or maintenance jobs only.
- User request paths must never run with `service_role`.

## Allowed Usage
- `createSupabaseActionClient` for request/session-bound user context.
- Prisma in user flows only when `where` includes `userId` (and soft-delete checks where applicable).

## Restricted Usage
- `SUPABASE_SERVICE_ROLE_KEY` in route handlers, server actions, or pages handling end-user requests.
- Unscoped Prisma queries on tenant tables (`transactions`, `accounts`, `budgets`, `categories`, `users`).

## Verification
- Keep RLS enabled in Supabase for tenant tables.
- Run `prisma/validation/rls_smoke.sql` on releases.
- Run unit guardrail tests that assert `userId` scoping in critical Prisma queries.
