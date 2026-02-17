"use client";

import { useMemo, useState } from "react";

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

type TransactionTableProps = {
  transactions: TransactionTableItem[];
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

export function TransactionTable({
  transactions,
  defaultPageSize = 10,
}: TransactionTableProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </header>

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
            </tr>
          </thead>
          <tbody>
            {pageData.map((transaction) => (
              <tr
                key={transaction.id}
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
              </tr>
            ))}
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
