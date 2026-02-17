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
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Transactions</h2>
          <p className="text-sm text-zinc-500">
            {filteredTransactions.length} record(s) found
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          Category
          <select
            data-testid="transaction-category-filter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-zinc-500 focus:outline-none"
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
            <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="border-b border-zinc-200 px-3 py-2">Date</th>
              <th className="border-b border-zinc-200 px-3 py-2">Category</th>
              <th className="border-b border-zinc-200 px-3 py-2">Description</th>
              <th className="border-b border-zinc-200 px-3 py-2 text-right">Amount (CAD)</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((transaction) => (
              <tr key={transaction.id} className="text-sm text-zinc-800">
                <td className="border-b border-zinc-100 px-3 py-3">
                  {dateFormatter.format(new Date(transaction.transactionAt))}
                </td>
                <td className="border-b border-zinc-100 px-3 py-3">
                  {transaction.category?.name ?? "Uncategorized"}
                </td>
                <td className="border-b border-zinc-100 px-3 py-3">
                  {transaction.description || "-"}
                </td>
                <td className="border-b border-zinc-100 px-3 py-3 text-right font-medium">
                  {formatAmount(transaction.amount)}
                </td>
              </tr>
            ))}
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-sm text-zinc-500">
                  No transactions found for the selected filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 flex items-center justify-between text-sm text-zinc-600">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            data-testid="transaction-pagination-prev"
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-zinc-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            data-testid="transaction-pagination-next"
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-zinc-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
