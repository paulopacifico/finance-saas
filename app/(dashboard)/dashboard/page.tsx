import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { CreateTransactionForm } from "@/components/transactions/create-transaction-form";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { getDashboardTransactions } from "@/lib/data/finance";
import { prisma } from "@/lib/prisma";
import { createAuditLog, shouldSampleEvent } from "@/lib/security/audit-log";
import { assertNoE2EBypassInProduction } from "@/lib/security/production-guard";
import { createSupabaseActionClient, ensureAppUserRecord } from "@/lib/supabase/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auditSampleRate = Number(process.env.DASHBOARD_VIEW_AUDIT_SAMPLE_RATE ?? "0.1");
  assertNoE2EBypassInProduction();
  const e2eBypassAuth = process.env.E2E_BYPASS_AUTH === "true";
  const e2eUseMockData = process.env.E2E_USE_MOCK_DATA === "true";
  const e2eUserId = process.env.E2E_USER_ID ?? "e2e-user";

  let effectiveUserId: string | null = null;

  if (e2eBypassAuth) {
    effectiveUserId = e2eUserId;
  } else {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureAppUserRecord(user);
    }

    effectiveUserId = user?.id ?? null;
  }

  if (!effectiveUserId) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-10 sm:px-6 lg:px-10">
        <main className="mx-auto w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to view your financial transactions.
          </p>
        </main>
      </div>
    );
  }

  const useMockData = e2eBypassAuth && e2eUseMockData && effectiveUserId === e2eUserId;

  const [transactions, accounts, categories] = await Promise.all([
    getDashboardTransactions(effectiveUserId),
    useMockData
      ? Promise.resolve([])
      : prisma.account.findMany({
          where: {
            userId: effectiveUserId,
            deletedAt: null,
            isActive: true,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        }),
    useMockData
      ? Promise.resolve([])
      : prisma.category.findMany({
          where: {
            userId: effectiveUserId,
            deletedAt: null,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        }),
  ]);

  if (shouldSampleEvent(auditSampleRate)) {
    await createAuditLog({
      actorUserId: effectiveUserId,
      targetUserId: effectiveUserId,
      action: "DASHBOARD_VIEW",
      resource: "transactions",
      metadata: { source: "dashboard-page", sampleRate: auditSampleRate },
    });
  }

  const serializedAccounts = accounts.map((account) => ({
    ...account,
    currentBalance:
      account.currentBalance && typeof account.currentBalance === "object"
        ? account.currentBalance.toString()
        : account.currentBalance,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-10 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
        <header className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute -right-8 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[var(--accent-glow)] blur-2xl" />
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Finance Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Server-cached data with automatic revalidation and tag invalidation.
          </p>
        </header>
        <DashboardOverview transactions={transactions} accounts={serializedAccounts} />
        <CreateTransactionForm accounts={serializedAccounts} categories={categories} />
        <TransactionTable
          transactions={transactions}
          accounts={serializedAccounts}
          categories={categories}
          defaultPageSize={10}
        />
      </main>
    </div>
  );
}
