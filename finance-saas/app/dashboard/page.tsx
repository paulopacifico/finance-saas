import { TransactionTable } from "@/components/transactions/transaction-table";
import { getDashboardTransactions } from "@/lib/data/finance";
import { createSupabaseActionClient } from "@/lib/supabase/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 lg:px-10">
        <main className="mx-auto w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Faça login para visualizar suas transações financeiras.
          </p>
        </main>
      </div>
    );
  }

  const transactions = await getDashboardTransactions(user.id);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">Finance Dashboard</h1>
          <p className="text-sm text-zinc-600">
            Dados cacheados no server com revalidação automática e invalidação por tags.
          </p>
        </header>
        <TransactionTable transactions={transactions} defaultPageSize={10} />
      </main>
    </div>
  );
}
