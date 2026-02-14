# Deploy Runbook

## Purpose
Operational readiness checklist for preview and production deployments on Vercel with Supabase PostgreSQL.

## Environment Segregation
Use separate environments and secrets:
- GitHub Environment `preview`
- GitHub Environment `production`
- Vercel Preview Environment
- Vercel Production Environment

Required GitHub secrets:
- `PREVIEW_DATABASE_URL`
- `PRODUCTION_DATABASE_URL`

Required Vercel environment variables:
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

## Pipeline Behavior
Workflow: `.github/workflows/ci.yml`

For pull requests into `main`:
1. lint
2. unit tests
3. e2e tests
4. build
5. `prisma migrate deploy` against preview database
6. `prisma/validation/rls_smoke.sql` against preview database

For pushes to `main`:
1. lint
2. unit tests
3. e2e tests
4. build
5. `prisma migrate deploy` against production database
6. `prisma/validation/rls_smoke.sql` against production database

## Release Procedure
1. Merge PR into `main` after CI passes.
2. Wait for production migration and RLS smoke validation to pass.
3. Confirm Vercel production deployment is healthy.
4. Verify key user journeys:
   - login
   - dashboard load
   - create transaction
   - Plaid link token request

## Rollback Strategy
Application rollback:
1. In Vercel, open Deployments for project.
2. Promote the previous stable deployment.
3. Validate health checks and core user journeys.

Database rollback:
- Prefer forward-fix migrations.
- If data corruption or migration incident occurs, use Supabase Point-in-Time Recovery (PITR).

PITR recovery process:
1. Identify incident timestamp (UTC).
2. In Supabase, start a PITR restore to a new database instance/project at a point before the incident.
3. Validate data consistency in restored environment.
4. Repoint application `DATABASE_URL`/`DIRECT_URL` to restored instance.
5. Re-run smoke tests and production checks.
6. Post-incident: document root cause and corrective migration.

## Backup and Restore
- Ensure Supabase backups/PITR are enabled for production plan.
- Define RPO and RTO targets.
- Perform quarterly restore drills:
  - restore to a non-production target
  - run integrity checks
  - verify critical tables (`users`, `transactions`, `accounts`, `budgets`, `categories`)

## Incident Checklist
1. Freeze deployments.
2. Capture failing migration logs.
3. Assess blast radius (data and user impact).
4. Choose forward-fix or PITR restore.
5. Communicate status updates.
6. Run post-incident review and update this runbook.
