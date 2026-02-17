"use client";

import { deleteTransaction, updateTransaction } from "@/app/actions/finance";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";

export type TransactionTableItem = {
  id: string;
  description?: string | null;
  amount: number | string;
  currency?: string;
  transactionAt: string | Date;
  category: {
    id: string;
    name: string;
  } | null;
};

type Option = {
  id: string;
  name: string;
};

type TransactionTableProps = {
  transactions: TransactionTableItem[];
  categories: Option[];
  defaultPageSize?: number;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const formatAmount = (value: number | string) => {
  const numericValue = typeof value === "number" ? value : Number(value);
  return cadFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
};

const toInputDateTimeLocal = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

export function TransactionTable({
  transactions,
  categories,
  defaultPageSize = 10,
}: TransactionTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filterCategories = useMemo(() => {
    const values = new Set(
      transactions.map((transaction) => transaction.category?.name ?? "Uncategorized"),
    );
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedCategory === "all") {
      return transactions;
    }
    return transactions.filter(
      (transaction) => (transaction.category?.name ?? "Uncategorized") === selectedCategory,
    );
  }, [transactions, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / defaultPageSize));
  const currentPage = Math.min(page, totalPages);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * defaultPageSize;
    const end = start + defaultPageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage, defaultPageSize]);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <header className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Transactions</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {filteredTransactions.length} record(s) found
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          Category
          <select
            data-testid="transaction-category-filter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="all">All</option>
            {filterCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </header>

      {statusMessage ? (
        <p className="border-b border-[var(--border)] px-5 py-3 text-sm text-[var(--text-secondary)]">
          {statusMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                Date
              </th>
              <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                Category
              </th>
              <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                Description
              </th>
              <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-right">
                Amount (CAD)
              </th>
              <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((transaction) => (
              <Fragment key={transaction.id}>
                <tr
                  className="text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)]"
                >
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    {dateFormatter.format(new Date(transaction.transactionAt))}
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3">
                    <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                      {transaction.category?.name ?? "Uncategorized"}
                    </span>
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text-secondary)]">
                    {transaction.description || "No description"}
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-right font-semibold tabular-nums text-[var(--accent)]">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="border-b border-[var(--border)] px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          setStatusMessage(null);
                          setEditingTransactionId((current) =>
                            current === transaction.id ? null : transaction.id,
                          );
                        }}
                        className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          if (!window.confirm("Delete this transaction?")) {
                            return;
                          }

                          startTransition(() => {
                            void (async () => {
                              setStatusMessage(null);
                              const formData = new FormData();
                              formData.set("transactionId", transaction.id);
                              const result = await deleteTransaction(formData);

                              if (!result.ok) {
                                setStatusMessage(result.error);
                                return;
                              }

                              if (editingTransactionId === transaction.id) {
                                setEditingTransactionId(null);
                              }
                              setStatusMessage("Transaction deleted.");
                              router.refresh();
                            })();
                          });
                        }}
                        className="rounded-md border border-rose-500/50 px-2.5 py-1 text-xs text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {editingTransactionId === transaction.id ? (
                  <tr key={`${transaction.id}-edit`}>
                    <td colSpan={5} className="border-b border-[var(--border)] px-4 py-4">
                      <form
                        action={(formData) => {
                          startTransition(() => {
                            void (async () => {
                              setStatusMessage(null);
                              const result = await updateTransaction(formData);

                              if (!result.ok) {
                                setStatusMessage(result.error);
                                return;
                              }

                              setEditingTransactionId(null);
                              setStatusMessage("Transaction updated.");
                              router.refresh();
                            })();
                          });
                        }}
                        className="grid gap-3 lg:grid-cols-4"
                      >
                        <input type="hidden" name="transactionId" value={transaction.id} />

                        <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                          Amount
                          <input
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            defaultValue={
                              typeof transaction.amount === "number"
                                ? transaction.amount.toFixed(2)
                                : transaction.amount
                            }
                            className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
                          />
                        </label>

                        <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                          Category
                          <select
                            name="categoryId"
                            disabled={categories.length === 0}
                            defaultValue={transaction.category?.id ?? categories[0]?.id ?? ""}
                            className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                          Date
                          <input
                            name="transactionAt"
                            type="datetime-local"
                            required
                            defaultValue={toInputDateTimeLocal(transaction.transactionAt)}
                            className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
                          />
                        </label>

                        <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                          Description
                          <input
                            name="description"
                            type="text"
                            maxLength={255}
                            defaultValue={transaction.description ?? ""}
                            placeholder="Optional"
                            className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
                          />
                        </label>

                        <div className="lg:col-span-4 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              setStatusMessage(null);
                              setEditingTransactionId(null);
                            }}
                            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-md border border-[var(--accent-dim)] bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isPending ? "Saving..." : "Update transaction"}
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]"
                >
                  No transactions found for the selected filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-sm text-[var(--text-secondary)]">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            data-testid="transaction-pagination-prev"
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            data-testid="transaction-pagination-next"
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
