"use client";

import {
  bulkDeleteTransactions,
  deleteTransaction,
  restoreTransaction,
  updateTransaction,
} from "@/app/actions/finance";
import type { DatePreset, SortOption } from "@/components/dashboard/filter-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { MobileTransactionCard, TransactionRow } from "@/components/dashboard/transaction-row";
import type {
  FinanceAccountOption,
  FinanceOption,
  FinanceTransactionType,
  TransactionTableItem,
} from "@/lib/types/finance";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState, useTransition } from "react";

type TransactionTableProps = {
  transactions: TransactionTableItem[];
  accounts: FinanceAccountOption[];
  categories: FinanceOption[];
  defaultPageSize?: number;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const toNumber = (value: number | string | null | undefined) => {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const signedAmount = (transaction: TransactionTableItem) => {
  const amount = toNumber(transaction.amount);
  if (transaction.type === "INCOME") {
    return amount;
  }
  if (transaction.type === "EXPENSE") {
    return -amount;
  }
  return 0;
};

const toInputDateTimeLocal = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function TransactionTable({
  transactions,
  accounts,
  categories,
  defaultPageSize = 20,
}: TransactionTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState(transactions);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | FinanceTransactionType>("all");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string[]>>({});
  const [collapsedAccounts, setCollapsedAccounts] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [undoCandidate, setUndoCandidate] = useState<TransactionTableItem | null>(null);

  useEffect(() => {
    setRows(transactions);
  }, [transactions]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setNotice(null);
      setUndoCandidate(null);
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const availableAccounts = useMemo(() => {
    const map = new Map<string, FinanceAccountOption>();

    for (const account of accounts) {
      map.set(account.id, account);
    }

    for (const transaction of rows) {
      if (!transaction.account) {
        continue;
      }

      if (!map.has(transaction.account.id)) {
        map.set(transaction.account.id, {
          id: transaction.account.id,
          name: transaction.account.name,
          currentBalance: transaction.account.currentBalance ?? null,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [accounts, rows]);

  const availableCategories = useMemo(() => {
    const map = new Map<string, FinanceOption>();

    for (const category of categories) {
      map.set(category.id, category);
    }

    for (const transaction of rows) {
      if (!transaction.category) {
        continue;
      }

      if (!map.has(transaction.category.id)) {
        map.set(transaction.category.id, {
          id: transaction.category.id,
          name: transaction.category.name,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, rows]);

  const accountBalanceById = useMemo(() => {
    const map = new Map<string, number>();
    for (const account of availableAccounts) {
      map.set(account.id, toNumber(account.currentBalance));
    }
    return map;
  }, [availableAccounts]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const customStart = customStartDate ? new Date(`${customStartDate}T00:00:00`) : null;
    const customEnd = customEndDate ? new Date(`${customEndDate}T23:59:59`) : null;

    const normalizedSearch = search.trim().toLowerCase();

    const matchesDate = (value: Date) => {
      if (datePreset === "all") {
        return true;
      }
      if (datePreset === "this-week") {
        return value >= startOfWeek && value <= now;
      }
      if (datePreset === "this-month") {
        return value >= startOfMonth && value <= now;
      }
      if (datePreset === "last-30-days") {
        return value >= last30Days && value <= now;
      }
      if (datePreset === "custom") {
        if (!customStart && !customEnd) {
          return true;
        }
        if (customStart && value < customStart) {
          return false;
        }
        if (customEnd && value > customEnd) {
          return false;
        }
      }
      return true;
    };

    return rows
      .filter((transaction) => {
        if (selectedAccountId !== "all" && transaction.account?.id !== selectedAccountId) {
          return false;
        }

        if (selectedCategoryId !== "all" && transaction.category?.name !== selectedCategoryId) {
          return false;
        }

        if (selectedType !== "all" && transaction.type !== selectedType) {
          return false;
        }

        const date = new Date(transaction.transactionAt);
        if (Number.isNaN(date.getTime()) || !matchesDate(date)) {
          return false;
        }

        if (normalizedSearch.length > 0) {
          const haystack = [
            transaction.description ?? "",
            transaction.category?.name ?? "",
            transaction.account?.name ?? "",
            transaction.type,
          ]
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(normalizedSearch)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "date-desc") {
          return new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime();
        }
        if (sort === "date-asc") {
          return new Date(a.transactionAt).getTime() - new Date(b.transactionAt).getTime();
        }
        if (sort === "amount-desc") {
          return toNumber(b.amount) - toNumber(a.amount);
        }
        if (sort === "amount-asc") {
          return toNumber(a.amount) - toNumber(b.amount);
        }
        return (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
      });
  }, [
    customEndDate,
    customStartDate,
    datePreset,
    rows,
    search,
    selectedAccountId,
    selectedCategoryId,
    selectedType,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    customEndDate,
    customStartDate,
    datePreset,
    pageSize,
    search,
    selectedAccountId,
    selectedCategoryId,
    selectedType,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [currentPage, filteredTransactions, pageSize]);

  const runningBalanceByTransactionId = useMemo(() => {
    const byAccount = new Map<string, TransactionTableItem[]>();
    const result = new Map<string, number | null>();

    for (const row of rows) {
      const accountId = row.account?.id ?? "unassigned";
      const group = byAccount.get(accountId) ?? [];
      group.push(row);
      byAccount.set(accountId, group);
    }

    for (const [accountId, group] of byAccount) {
      const sorted = [...group].sort(
        (a, b) => new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime(),
      );
      const hasBalance = accountBalanceById.has(accountId);
      let running = hasBalance ? (accountBalanceById.get(accountId) ?? 0) : null;

      for (const row of sorted) {
        result.set(row.id, running);
        if (running !== null) {
          running -= signedAmount(row);
        }
      }
    }

    return result;
  }, [accountBalanceById, rows]);

  const groupedPageData = useMemo(() => {
    const groups = new Map<
      string,
      {
        id: string;
        name: string;
        balance: number | null;
        transactions: TransactionTableItem[];
      }
    >();

    for (const transaction of pageData) {
      const id = transaction.account?.id ?? "unassigned";
      const name = transaction.account?.name ?? "Unassigned account";
      const existing = groups.get(id);
      if (existing) {
        existing.transactions.push(transaction);
        continue;
      }

      groups.set(id, {
        id,
        name,
        balance: accountBalanceById.has(id) ? (accountBalanceById.get(id) ?? 0) : null,
        transactions: [transaction],
      });
    }

    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [accountBalanceById, pageData]);

  const allPageSelected = pageData.length > 0 && pageData.every((item) => selectedIds.has(item.id));

  useEffect(() => {
    setSelectedIds((prev) => {
      const existing = new Set(rows.map((row) => row.id));
      const next = new Set<string>();
      for (const id of prev) {
        if (existing.has(id)) {
          next.add(id);
        }
      }
      return next;
    });
  }, [rows]);

  const handleDelete = (transaction: TransactionTableItem) => {
    if (!window.confirm("Delete this transaction?")) {
      return;
    }

    const previousRows = rows;
    setRows((current) => current.filter((item) => item.id !== transaction.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(transaction.id);
      return next;
    });
    setEditingTransactionId((current) => (current === transaction.id ? null : current));

    startTransition(() => {
      void (async () => {
        const formData = new FormData();
        formData.set("transactionId", transaction.id);
        const result = await deleteTransaction(formData);

        if (!result.ok) {
          setRows(previousRows);
          setNotice({ kind: "error", message: result.error });
          return;
        }

        setUndoCandidate(transaction);
        setNotice({ kind: "success", message: "Transaction deleted. Undo is available for a few seconds." });
        router.refresh();
      })();
    });
  };

  const handleUndoDelete = () => {
    if (!undoCandidate) {
      return;
    }

    const candidate = undoCandidate;
    setUndoCandidate(null);

    startTransition(() => {
      void (async () => {
        const formData = new FormData();
        formData.set("transactionId", candidate.id);
        const result = await restoreTransaction(formData);

        if (!result.ok) {
          setNotice({ kind: "error", message: result.error });
          return;
        }

        setRows((current) => [candidate, ...current]);
        setNotice({ kind: "success", message: "Transaction restored." });
        router.refresh();
      })();
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      return;
    }
    if (!window.confirm(`Delete ${ids.length} selected transaction(s)?`)) {
      return;
    }

    const previousRows = rows;
    const idSet = new Set(ids);
    setRows((current) => current.filter((item) => !idSet.has(item.id)));
    setSelectedIds(new Set());

    startTransition(() => {
      void (async () => {
        const formData = new FormData();
        formData.set("transactionIds", ids.join(","));
        const result = await bulkDeleteTransactions(formData);

        if (!result.ok) {
          setRows(previousRows);
          setNotice({ kind: "error", message: result.error });
          return;
        }

        setNotice({
          kind: "success",
          message: `${result.data.count} transaction(s) deleted.`,
        });
        router.refresh();
      })();
    });
  };

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      setNotice({ kind: "error", message: "No rows available to export." });
      return;
    }

    const header = [
      "Date",
      "Type",
      "Account",
      "Category",
      "Description",
      "Amount",
      "Running Balance",
    ];
    const rowsToExport = filteredTransactions.map((transaction) => {
      const running = runningBalanceByTransactionId.get(transaction.id);
      return [
        new Date(transaction.transactionAt).toISOString(),
        transaction.type,
        transaction.account?.name ?? "Unassigned account",
        transaction.category?.name ?? "Uncategorized",
        transaction.description ?? "",
        String(transaction.amount),
        running === null || running === undefined ? "" : running.toFixed(2),
      ];
    });

    const content = [header, ...rowsToExport]
      .map((line) =>
        line
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice({ kind: "success", message: "CSV exported successfully." });
  };

  const handleExportPdf = () => {
    if (filteredTransactions.length === 0) {
      setNotice({ kind: "error", message: "No rows available to export." });
      return;
    }

    const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!popup) {
      setNotice({ kind: "error", message: "Pop-up blocked. Allow pop-ups to export PDF." });
      return;
    }

    const rowsHtml = filteredTransactions
      .map((transaction) => {
        const running = runningBalanceByTransactionId.get(transaction.id);
        return `<tr>
          <td>${escapeHtml(new Date(transaction.transactionAt).toLocaleDateString("en-CA"))}</td>
          <td>${escapeHtml(transaction.type)}</td>
          <td>${escapeHtml(transaction.account?.name ?? "Unassigned account")}</td>
          <td>${escapeHtml(transaction.category?.name ?? "Uncategorized")}</td>
          <td>${escapeHtml(transaction.description ?? "")}</td>
          <td>${escapeHtml(cadFormatter.format(toNumber(transaction.amount)))}</td>
          <td>${escapeHtml(
            running === null || running === undefined ? "N/A" : cadFormatter.format(running),
          )}</td>
        </tr>`;
      })
      .join("");

    popup.document.write(`<!doctype html>
      <html>
        <head>
          <title>Transaction Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 20px; color: #111; }
            h1 { margin-bottom: 4px; }
            p { color: #555; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Finance SaaS - Transactions</h1>
          <p>Generated on ${escapeHtml(new Date().toLocaleString("en-CA"))}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Account</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>`);
    popup.document.close();
    popup.focus();
    popup.print();
    setNotice({ kind: "success", message: "PDF print view opened." });
  };

  const submitUpdate = (formData: FormData, transaction: TransactionTableItem) => {
    startTransition(() => {
      void (async () => {
        setEditFieldErrors({});
        const result = await updateTransaction(formData);

        if (!result.ok) {
          setNotice({ kind: "error", message: result.error });
          setEditFieldErrors(result.fields ?? {});
          return;
        }

        const accountId = String(formData.get("accountId") ?? transaction.account?.id ?? "");
        const categoryId = String(formData.get("categoryId") ?? transaction.category?.id ?? "");
        const selectedAccount =
          availableAccounts.find((account) => account.id === accountId) ?? transaction.account;
        const selectedCategory =
          availableCategories.find((category) => category.id === categoryId) ?? transaction.category;
        const nextType = String(formData.get("type") ?? transaction.type) as FinanceTransactionType;
        const nextAmount = String(formData.get("amount") ?? transaction.amount);
        const nextDate = String(formData.get("transactionAt") ?? transaction.transactionAt);
        const nextCurrency = String(formData.get("currency") ?? transaction.currency ?? "CAD")
          .toUpperCase()
          .slice(0, 3);
        const rawDescription = String(formData.get("description") ?? "").trim();

        setRows((current) =>
          current.map((row) =>
            row.id === transaction.id
              ? {
                  ...row,
                  account: selectedAccount
                    ? {
                        id: selectedAccount.id,
                        name: selectedAccount.name,
                        currentBalance: selectedAccount.currentBalance ?? null,
                      }
                    : null,
                  category: selectedCategory
                    ? {
                        id: selectedCategory.id,
                        name: selectedCategory.name,
                      }
                    : null,
                  type: nextType,
                  amount: nextAmount,
                  transactionAt: nextDate,
                  currency: nextCurrency,
                  description: rawDescription.length > 0 ? rawDescription : null,
                }
              : row,
          ),
        );

        setEditingTransactionId(null);
        setNotice({ kind: "success", message: "Transaction updated successfully." });
        router.refresh();
      })();
    });
  };

  const clearFilters = () => {
    setSelectedAccountId("all");
    setSelectedCategoryId("all");
    setSelectedType("all");
    setDatePreset("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSort("date-desc");
    setSearch("");
    setNotice(null);
  };

  const renderInlineEditForm = (transaction: TransactionTableItem) => (
    <form
      action={(formData) => submitUpdate(formData, transaction)}
      className="grid gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 lg:grid-cols-7"
    >
      <input type="hidden" name="transactionId" value={transaction.id} />
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Account
        <select
          name="accountId"
          defaultValue={transaction.account?.id ?? availableAccounts[0]?.id ?? ""}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        >
          {availableAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Category
        <select
          name="categoryId"
          defaultValue={transaction.category?.id ?? availableCategories[0]?.id ?? ""}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        >
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Type
        <select
          name="type"
          defaultValue={transaction.type}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Amount
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={toNumber(transaction.amount).toFixed(2)}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Date
        <input
          name="transactionAt"
          type="datetime-local"
          required
          defaultValue={toInputDateTimeLocal(transaction.transactionAt)}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
        Currency
        <input
          name="currency"
          type="text"
          maxLength={3}
          defaultValue={transaction.currency ?? "CAD"}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm uppercase text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)] lg:col-span-2">
        Description
        <input
          name="description"
          type="text"
          maxLength={255}
          defaultValue={transaction.description ?? ""}
          placeholder="Add context for this transaction"
          className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none"
        />
      </label>

      {Object.keys(editFieldErrors).length > 0 ? (
        <div className="lg:col-span-7 rounded-md border border-rose-500/35 bg-rose-500/10 px-2.5 py-2 text-xs text-rose-200">
          {Object.entries(editFieldErrors)
            .flatMap(([, messages]) => messages)
            .join(" • ")}
        </div>
      ) : null}

      <div className="lg:col-span-7 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setEditingTransactionId(null);
            setEditFieldErrors({});
          }}
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md border border-[var(--accent-dim)] bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );

  const totalBalance = availableAccounts.reduce(
    (sum, account) => sum + toNumber(account.currentBalance),
    0,
  );

  return (
    <section className="w-full space-y-4">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Transactions</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {filteredTransactions.length} result(s) • Total tracked balance {cadFormatter.format(totalBalance)}
            </p>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedAccountId("all")}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-sm transition",
              selectedAccountId === "all"
                ? "border-[var(--accent-dim)] bg-[var(--accent-glow)] text-[var(--text-primary)]"
                : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]",
            )}
          >
            <p className="font-medium">All accounts</p>
            <p className="text-xs text-[var(--text-muted)]">
              {rows.length} tx • {cadFormatter.format(totalBalance)}
            </p>
          </button>
          {availableAccounts.map((account) => {
            const count = rows.filter((row) => row.account?.id === account.id).length;
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelectedAccountId(account.id)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-sm transition",
                  selectedAccountId === account.id
                    ? "border-[var(--accent-dim)] bg-[var(--accent-glow)] text-[var(--text-primary)]"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]",
                )}
              >
                <p className="font-medium">{account.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {count} tx • {cadFormatter.format(toNumber(account.currentBalance))}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <FilterBar
        accounts={availableAccounts}
        categories={availableCategories}
        selectedAccountId={selectedAccountId}
        selectedCategoryId={selectedCategoryId}
        selectedType={selectedType}
        datePreset={datePreset}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        sort={sort}
        search={search}
        pageSize={pageSize}
        selectedCount={selectedIds.size}
        isPending={isPending}
        onAccountChange={setSelectedAccountId}
        onCategoryChange={setSelectedCategoryId}
        onTypeChange={setSelectedType}
        onDatePresetChange={setDatePreset}
        onCustomStartDateChange={setCustomStartDate}
        onCustomEndDateChange={setCustomEndDate}
        onSortChange={setSort}
        onSearchChange={setSearch}
        onPageSizeChange={setPageSize}
        onClearFilters={clearFilters}
        onBulkDelete={handleBulkDelete}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
      />

      {notice ? (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
            notice.kind === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200",
          )}
        >
          <span>{notice.message}</span>
          {undoCandidate ? (
            <button
              type="button"
              onClick={handleUndoDelete}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-300/40 px-2.5 py-1 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden />
              Undo
            </button>
          ) : null}
        </div>
      ) : null}

      {filteredTransactions.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[var(--border-hover)] bg-[var(--bg-card)] p-8 text-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No matching transactions</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Try changing filters, date range, or search terms. You can also add your first transaction
            using the form above.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
            >
              Reset filters
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] lg:block">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedIds((current) => {
                          const next = new Set(current);
                          for (const item of pageData) {
                            if (checked) {
                              next.add(item.id);
                            } else {
                              next.delete(item.id);
                            }
                          }
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)] focus:ring-[var(--accent-glow)]"
                      aria-label="Select all transactions on page"
                    />
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    Date
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    Type
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    Account
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    Category
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    Description
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-right">
                    Amount
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-right">
                    Running balance
                  </th>
                  <th className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedPageData.map((group) => {
                  const collapsed = collapsedAccounts.has(group.id);
                  return (
                    <Fragment key={group.id}>
                      <tr>
                        <td
                          colSpan={9}
                          className="border-b border-[var(--border)] bg-[var(--bg-card-hover)] px-4 py-2"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setCollapsedAccounts((current) => {
                                const next = new Set(current);
                                if (next.has(group.id)) {
                                  next.delete(group.id);
                                } else {
                                  next.add(group.id);
                                }
                                return next;
                              })
                            }
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
                          >
                            {collapsed ? (
                              <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
                            )}
                            {group.name}
                            <span className="text-xs text-[var(--text-muted)]">
                              {group.transactions.length} tx •{" "}
                              {group.balance === null ? "N/A" : cadFormatter.format(group.balance)}
                            </span>
                          </button>
                        </td>
                      </tr>

                      {!collapsed
                        ? group.transactions.map((transaction) => (
                            <Fragment key={transaction.id}>
                              <TransactionRow
                                transaction={transaction}
                                runningBalance={
                                  runningBalanceByTransactionId.get(transaction.id) ?? null
                                }
                                isSelected={selectedIds.has(transaction.id)}
                                isPending={isPending}
                                onToggleSelect={(checked) =>
                                  setSelectedIds((current) => {
                                    const next = new Set(current);
                                    if (checked) {
                                      next.add(transaction.id);
                                    } else {
                                      next.delete(transaction.id);
                                    }
                                    return next;
                                  })
                                }
                                onEdit={() => {
                                  setNotice(null);
                                  setEditFieldErrors({});
                                  setEditingTransactionId((current) =>
                                    current === transaction.id ? null : transaction.id,
                                  );
                                }}
                                onDelete={() => handleDelete(transaction)}
                              />
                              {editingTransactionId === transaction.id ? (
                                <tr>
                                  <td colSpan={9} className="border-b border-[var(--border)] px-4 py-3">
                                    {renderInlineEditForm(transaction)}
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ))
                        : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="space-y-3 lg:hidden">
            {groupedPageData.map((group) => {
              const collapsed = collapsedAccounts.has(group.id);
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedAccounts((current) => {
                        const next = new Set(current);
                        if (next.has(group.id)) {
                          next.delete(group.id);
                        } else {
                          next.add(group.id);
                        }
                        return next;
                      })
                    }
                    className="mb-3 flex w-full items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-[var(--text-primary)]">{group.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {group.transactions.length} tx •{" "}
                      {group.balance === null ? "N/A" : cadFormatter.format(group.balance)}
                    </span>
                  </button>

                  {!collapsed ? (
                    <div className="space-y-2">
                      {group.transactions.map((transaction) => (
                        <Fragment key={transaction.id}>
                          <MobileTransactionCard
                            transaction={transaction}
                            runningBalance={runningBalanceByTransactionId.get(transaction.id) ?? null}
                            isSelected={selectedIds.has(transaction.id)}
                            isPending={isPending}
                            onToggleSelect={(checked) =>
                              setSelectedIds((current) => {
                                const next = new Set(current);
                                if (checked) {
                                  next.add(transaction.id);
                                } else {
                                  next.delete(transaction.id);
                                }
                                return next;
                              })
                            }
                            onEdit={() => {
                              setNotice(null);
                              setEditFieldErrors({});
                              setEditingTransactionId((current) =>
                                current === transaction.id ? null : transaction.id,
                              );
                            }}
                            onDelete={() => handleDelete(transaction)}
                          />
                          {editingTransactionId === transaction.id ? renderInlineEditForm(transaction) : null}
                        </Fragment>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>

          <footer className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
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
        </>
      )}
    </section>
  );
}
