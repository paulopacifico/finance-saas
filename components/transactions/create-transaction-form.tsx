import { createTransaction } from "@/app/actions/finance";

type Option = {
  id: string;
  name: string;
};

type CreateTransactionFormProps = {
  accounts: Option[];
  categories: Option[];
};

const DEFAULT_DATETIME = new Date().toISOString().slice(0, 16);

export function CreateTransactionForm({ accounts, categories }: CreateTransactionFormProps) {
  const hasRequiredOptions = accounts.length > 0 && categories.length > 0;

  async function submitTransaction(formData: FormData) {
    "use server";
    await createTransaction(formData);
  }

  return (
    <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">New transaction</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Add a transaction manually to your dashboard.
        </p>
      </header>

      {!hasRequiredOptions ? (
        <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Unable to enable the form. Ensure your account has at least one active financial account
          and one active category.
        </p>
      ) : null}

      <form action={submitTransaction} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Account
          <select
            name="accountId"
            required
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={accounts[0]?.id ?? ""}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Transaction category
          <select
            name="categoryId"
            required
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={categories[0]?.id ?? ""}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Type
          <select
            name="type"
            required
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue="EXPENSE"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Amount
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0.00"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Date
          <input
            name="transactionAt"
            type="datetime-local"
            required
            disabled={!hasRequiredOptions}
            defaultValue={DEFAULT_DATETIME}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Currency
          <input
            name="currency"
            type="text"
            maxLength={3}
            defaultValue="CAD"
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm uppercase text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Description
          <input
            name="description"
            type="text"
            maxLength={255}
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g., grocery store"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!hasRequiredOptions}
            className="rounded-lg border border-[var(--accent-dim)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save transaction
          </button>
        </div>
      </form>
    </section>
  );
}
