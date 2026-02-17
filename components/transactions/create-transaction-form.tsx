"use client";

import { createTransaction } from "@/app/actions/finance";
import type { FinanceOption } from "@/lib/types/finance";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type CreateTransactionFormProps = {
  accounts: FinanceOption[];
  categories: FinanceOption[];
};

const DEFAULT_DATETIME = new Date().toISOString().slice(0, 16);

export function CreateTransactionForm({ accounts, categories }: CreateTransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const hasRequiredOptions = accounts.length > 0 && categories.length > 0;

  const resettableDefaults = useMemo(
    () => ({
      accountId: accounts[0]?.id ?? "",
      categoryId: categories[0]?.id ?? "",
      type: "EXPENSE",
      currency: "CAD",
      transactionAt: DEFAULT_DATETIME,
    }),
    [accounts, categories],
  );

  const readFieldError = (field: string) => fieldErrors[field]?.[0] ?? null;

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

      {status ? (
        <p
          className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
            status.kind === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <form
        action={(formData) => {
          startTransition(() => {
            void (async () => {
              setStatus(null);
              setFieldErrors({});
              const result = await createTransaction(formData);

              if (!result.ok) {
                setStatus({ kind: "error", message: result.error });
                setFieldErrors(result.fields ?? {});
                return;
              }

              setStatus({ kind: "success", message: "Transaction created successfully." });
              router.refresh();
            })();
          });
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Account
          <select
            name="accountId"
            required
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={resettableDefaults.accountId}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          {readFieldError("accountId") ? (
            <span className="text-xs text-rose-300">{readFieldError("accountId")}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Transaction category
          <select
            name="categoryId"
            required
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={resettableDefaults.categoryId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {readFieldError("categoryId") ? (
            <span className="text-xs text-rose-300">{readFieldError("categoryId")}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Type
          <select
            name="type"
            required
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={resettableDefaults.type}
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
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0.00"
          />
          {readFieldError("amount") ? (
            <span className="text-xs text-rose-300">{readFieldError("amount")}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Date
          <input
            name="transactionAt"
            type="datetime-local"
            required
            disabled={!hasRequiredOptions || isPending}
            defaultValue={resettableDefaults.transactionAt}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          />
          {readFieldError("transactionAt") ? (
            <span className="text-xs text-rose-300">{readFieldError("transactionAt")}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Currency
          <input
            name="currency"
            type="text"
            maxLength={3}
            defaultValue={resettableDefaults.currency}
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm uppercase text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          />
          {readFieldError("currency") ? (
            <span className="text-xs text-rose-300">{readFieldError("currency")}</span>
          ) : null}
        </label>

        <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
          Description
          <input
            name="description"
            type="text"
            maxLength={255}
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g., Monthly grocery run at FreshCo"
          />
        </label>

        <div className="sm:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={!hasRequiredOptions || isPending}
            className="rounded-lg border border-[var(--accent-dim)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save transaction"}
          </button>
          <button
            type="reset"
            disabled={isPending}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
