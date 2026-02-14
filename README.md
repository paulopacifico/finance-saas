# Finance SaaS

Finance SaaS is a micro SaaS for personal finance management in Canada (CAD-first), built with a privacy-first, multi-tenant architecture.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- Plaid
- Vitest + Playwright
- Vercel

## Product Scope
Current MVP includes:
- user authentication
- transaction CRUD foundations
- accounts, categories, and budgets domain modeling
- dashboard with filtering and pagination
- Plaid link token endpoint

## Architecture
### Application Layers
- `app/`: routes, server components, server actions, API handlers
- `components/`: domain UI components (`marketing`, `transactions`, `ui`)
- `lib/`: integrations (`supabase`, `prisma`, `plaid`), security and data modules
- `prisma/`: schema and SQL migrations
- `tests/`: unit and end-to-end tests

### Data Design
- tenant isolation by `userId`
- monetary fields as `Decimal(14,2)`
- soft-delete via `deletedAt`
- indexed read paths for user/time-based queries
- RLS-enabled tenant tables in Supabase

## Security Model
- Tenant-scoped queries at application level (`where: { userId: ... }`)
- Supabase RLS policies for tenant tables
- Plaid endpoint requires authenticated user context
- Plaid endpoint rate-limited (`429` + `Retry-After`)
- `service_role` restricted to administrative/maintenance contexts

Key references:
- `docs/security/data-access-policy.md`
- `prisma/validation/rls_smoke.sql`
- `app/api/plaid/link/route.ts`

## Environment Variables
Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Core variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV`
- `PLAID_COUNTRY_CODES`
- `PLAID_PRODUCTS`
- `PLAID_REDIRECT_URI`
- `NEXT_PUBLIC_SITE_URL`

## Local Development
Install dependencies:

```bash
npm ci
```

Start development server:

```bash
npm run dev
```

Production build and run:

```bash
npm run build
npm run start
```

## Database and Migrations
Generate Prisma client:

```bash
npm run prisma:generate
```

Create migration in development:

```bash
npm run prisma:migrate:dev
```

Apply migrations in deploy environments:

```bash
npm run prisma:migrate:deploy
```

## Validation and Tests
Lint:

```bash
npm run lint
```

Unit tests:

```bash
npm run test:unit
```

E2E tests:

```bash
npm run test:e2e
```

Preview authenticated smoke:

```bash
PREVIEW_BASE_URL="https://your-preview-url" \
PREVIEW_AUTH_COOKIE_NAME="sb-your-project-ref-auth-token" \
PREVIEW_AUTH_COOKIE_VALUE="your-auth-cookie-value" \
npm run test:e2e:preview
```

All tests:

```bash
npm run test
```

## CI
Workflow: `.github/workflows/ci.yml`

Pipeline gates:
1. `lint` + `test:unit` (parallel)
2. `build` + `test:e2e`
3. preview/prod migration deploy + RLS smoke
4. preview authenticated smoke (`test:e2e:preview`)

Recommended repository protection:
- require passing `CI` status checks on `main`
- block merge on failing checks
- block production promotion on failing checks
- configure separate GitHub Environments (`preview`, `production`) with isolated DB secrets

## RLS Smoke Test
Script: `prisma/validation/rls_smoke.sql`

Validates row isolation across:
- `categories`
- `transactions`
- `accounts`
- `budgets`

Example execution:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/validation/rls_smoke.sql
```

## Deployment (Vercel)
Minimum release checklist:
1. configure production environment variables
2. run `prisma migrate deploy`
3. run RLS smoke validation
4. run CI checks (`lint`, `unit`, `e2e`, `build`)
5. promote release

Operational runbook:
- `docs/operations/deploy-runbook.md`
- includes rollback, Supabase PITR backup/restore workflow, and incident checklist

## Compliance Notes (Canada)
This repository implements core technical controls, but production readiness requires additional operational controls:
- published Privacy Policy and Terms
- DSR process (access, correction, deletion)
- data retention policy and disposal process
- audit trail for sensitive data access
- legal review for applicable Canadian privacy obligations

Compliance references and checklist:
- `docs/compliance/canada-compliance-checklist.md`
- `docs/operations/deploy-runbook.md`

## Project Structure
```text
app/
components/
lib/
prisma/
tests/
public/
```

## License
Private use. Define an explicit license before public distribution.
