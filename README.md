# Finflow (Finance SaaS) - Interview-Ready Project for Canada

Finflow is a CAD-first personal finance SaaS designed as a portfolio-grade project for software engineering interviews in Canada.

It demonstrates how to build and ship a secure, multi-tenant fintech application with modern full-stack tooling, clear data isolation, and production-minded delivery practices.

## Why This Project Is Strong for Interviews
- It solves a real-world problem: personal finance management for Canadian users.
- It uses a modern stack widely expected in Canadian startups and scale-ups.
- It includes security and privacy controls that are relevant to Canadian compliance expectations.
- It shows both product thinking (UX, onboarding, dashboard) and engineering rigor (tests, CI, deployment, runbooks).

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

## Product Scope (Current)
- Authentication (email/password + callback flow)
- Dashboard with filtering and pagination
- Transaction data model and retrieval
- Plaid link token endpoint
- Marketing landing pages and pricing sections

## Architecture at a Glance
### Layers
- `app/`: routes, server components, server actions, API handlers
- `components/`: UI and feature components (`landing`, `marketing`, `transactions`, `ui`)
- `lib/`: core integrations (`supabase`, `prisma`, `plaid`) + security modules
- `prisma/`: schema and migration artifacts
- `tests/`: unit and end-to-end tests

### Multi-Tenant Data Design
- Tenant isolation based on `userId`
- Monetary fields as `Decimal(14,2)`
- Soft-delete with `deletedAt`
- Indexed read paths for user/time-based access
- RLS-backed tables in Supabase

## Security and Privacy Controls
- Tenant-scoped queries at application level (`where: { userId: ... }`)
- Supabase RLS policies for defense in depth
- Auth-required Plaid endpoints
- Rate limiting (`429` with `Retry-After`) on sensitive API routes
- Restricted use of `SUPABASE_SERVICE_ROLE_KEY`

References:
- `docs/security/data-access-policy.md`
- `prisma/validation/rls_smoke.sql`
- `app/api/plaid/link/route.ts`

## Auth Flow (Interview Talking Point)
- Sign-up and sign-in forms call Supabase Auth directly.
- OAuth/magic-link callback route exchanges code for session.
- Callback route uses dynamic request `origin` for safe production redirect behavior.

Key files:
- `app/(marketing)/login/page.tsx`
- `app/(marketing)/signup/page.tsx`
- `app/auth/callback/route.ts`
- `lib/supabase/actions.ts`
- `lib/supabase/client.ts`

## Local Setup
1. Clone and install dependencies:

```bash
git clone https://github.com/paulopacifico/finance-saas.git
cd finance-saas
npm ci
```

2. Create local environment:

```bash
cp .env.example .env
```

3. Run development server:

```bash
npm run dev
```

4. Open:
- `http://localhost:3000`

## Environment Variables
Required core variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV`
- `PLAID_COUNTRY_CODES`
- `PLAID_PRODUCTS`
- `PLAID_REDIRECT_URI`
- `NEXT_PUBLIC_SITE_URL`

## Database and Migrations
Generate Prisma client:

```bash
npm run prisma:generate
```

Create migration (dev):

```bash
npm run prisma:migrate:dev
```

Apply migration (deploy):

```bash
npm run prisma:migrate:deploy
```

## Tests and Quality Gates
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

Full suite:

```bash
npm run test
```

## Deployment (Vercel)
Recommended release flow:
1. Set production environment variables.
2. Run `prisma migrate deploy`.
3. Run RLS smoke test.
4. Confirm CI checks (`lint`, `unit`, `e2e`, `build`).
5. Promote deployment.

Operational runbook:
- `docs/operations/deploy-runbook.md`

## Canadian Interview Framing
When presenting this project in an interview, focus on:
- Data privacy and tenant isolation strategy
- Risk reduction through layered controls (app-level + RLS)
- Production-readiness choices (CI, runbooks, migration discipline)
- Tradeoff decisions (velocity vs reliability, auth UX vs security)

## Suggested 5-Minute Demo Script
1. Show landing page and explain product scope.
2. Walk through sign-up/login and callback route.
3. Show dashboard filtering and pagination.
4. Explain one API endpoint (`/api/plaid/link`) and its guardrails.
5. Show test commands and CI expectations.

## Common Interview Questions You Should Be Ready For
- Why combine app-level tenant checks with database RLS?
- How do you prevent callback redirect vulnerabilities?
- How would you scale this for 10x users?
- What would you add for compliance hardening in production?
- What parts are MVP shortcuts and what parts are production-grade?

## Compliance Notes (Canada)
This project includes technical controls, but production compliance still requires operational and legal processes:
- Privacy Policy and Terms
- DSR workflows (access/correction/deletion)
- Data retention and disposal process
- Auditability for sensitive access
- Legal review against applicable Canadian obligations

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
