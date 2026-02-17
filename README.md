# Finance SaaS

The project emphasizes practical full-stack execution: secure multi-tenant data access, real authentication flows, API guardrails, testing, and production deployment on Vercel.

## Project Progress Snapshot (February 2026)
### Implemented
- Marketing landing page (Next.js App Router) aligned with the fintech template system.
- Email/password authentication UI wired to Supabase Auth:
  - `signInWithPassword` on `/login`
  - `signUp` on `/signup`
- Auth callback route for OAuth/magic-link style flows:
  - code exchange via `exchangeCodeForSession`
  - safe redirect sanitization (`next` path validation)
- Auth error fallback page (`/auth/auth-error`).
- Protected dashboard access with authenticated user resolution.
- Plaid link token API with auth and rate-limiting controls.
- Core finance server actions and data retrieval modules.
- Unit and E2E test suites running in CI.

### In Progress / Next Improvements
- Complete English-only copy across all dashboard and table labels.
- Add explicit unit tests for `app/auth/callback/route.ts` success/failure branches.
- Expand dashboard from current foundational views to full CRUD workflows.
- Improve local/offline font strategy to avoid Google Fonts dependency during restricted-network builds.
- 
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

## Current Product Scope
- Authentication (email/password + callback flow)
- Dashboard (authenticated access, filtering, pagination)
- Transaction data retrieval and finance server actions
- Plaid link token endpoint
- Marketing pages (home, pricing, features, legal pages)

## Architecture Overview
### Layers
- `app/`: routes, server components, server actions, API handlers
- `components/`: UI and feature components (`landing`, `marketing`, `transactions`, `ui`)
- `lib/`: integrations (`supabase`, `prisma`, `plaid`) + security/data modules
- `prisma/`: schema and migration artifacts
- `tests/`: unit and E2E tests

### Multi-Tenant Data Model
- Tenant isolation based on `userId`
- Monetary fields as `Decimal(14,2)`
- Soft-delete via `deletedAt`
- Indexed read paths for tenant/time access patterns
- Supabase RLS policies for defense in depth

## Security and Privacy Controls
- App-layer tenant scoping (`where: { userId: ... }`)
- Supabase RLS for protected tables
- Auth-required Plaid endpoint access
- Rate limiting with `429` + `Retry-After`
- Controlled usage of `SUPABASE_SERVICE_ROLE_KEY`

References:
- `docs/security/data-access-policy.md`
- `prisma/validation/rls_smoke.sql`
- `app/api/plaid/link/route.ts`

## Authentication Flow
- `/login` -> Supabase `signInWithPassword`
- `/signup` -> Supabase `signUp` with `emailRedirectTo`
- `/auth/callback` -> `exchangeCodeForSession(code)` + safe redirect
- `/auth/auth-error` -> fallback page for failed auth exchanges

Key files:
- `app/(marketing)/login/page.tsx`
- `app/(marketing)/signup/page.tsx`
- `app/auth/callback/route.ts`
- `app/auth/auth-error/page.tsx`
- `lib/supabase/actions.ts`
- `lib/supabase/client.ts`

## Local Setup
1. Clone and install:

```bash
git clone https://github.com/paulopacifico/finance-saas.git
cd finance-saas
npm ci
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Run dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables
Core variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV`
- `PLAID_COUNTRY_CODES`
- `PLAID_PRODUCTS`
- `PLAID_REDIRECT_URI`
- `NEXT_PUBLIC_SITE_URL`

## Database and Migrations
```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
```

## Testing and Quality Gates
```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run test
```

Preview authenticated smoke:

```bash
PREVIEW_BASE_URL="https://your-preview-url" \
PREVIEW_AUTH_COOKIE_NAME="sb-your-project-ref-auth-token" \
PREVIEW_AUTH_COOKIE_VALUE="your-auth-cookie-value" \
npm run test:e2e:preview
```

## Deployment (Vercel)
Recommended release flow:
1. Configure production environment variables.
2. Run `prisma migrate deploy`.
3. Run RLS smoke validation.
4. Confirm CI checks (`lint`, `unit`, `e2e`, `build`).
5. Promote deployment.

Operational runbook:
- `docs/operations/deploy-runbook.md`

## Common Interview Questions to Prepare
- Why combine app-level tenant checks with database RLS?
- How do you prevent open redirect vulnerabilities in auth callbacks?
- What are the next reliability/compliance steps for production?
- Which parts are MVP shortcuts vs. production-grade controls?

## Compliance Notes (Canada)
This repository includes core technical controls, but full production compliance still needs legal and operational processes:
- Public Privacy Policy and Terms
- DSR workflows (access/correction/deletion)
- Data retention/disposal process
- Auditable sensitive access controls
- Legal review for applicable Canadian obligations

References:
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
Private project. Add an explicit license before public distribution.
