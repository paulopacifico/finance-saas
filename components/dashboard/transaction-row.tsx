import {
  ArrowRightLeft,
  CircleDollarSign,
  MinusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import type { FinanceTransactionType, TransactionTableItem } from "@/lib/types/finance";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const date = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const typeMeta: Record<
  FinanceTransactionType,
  {
    icon: typeof CircleDollarSign;
    label: string;
    rowClass: string;
    amountClass: string;
    sign: "+" | "-" | "±";
  }
> = {
  INCOME: {
    icon: CircleDollarSign,
    label: "Income",
    rowClass: "bg-emerald-500/8 hover:bg-emerald-500/15",
    amountClass: "text-emerald-300",
    sign: "+",
  },
  EXPENSE: {
    icon: MinusCircle,
    label: "Expense",
    rowClass: "bg-rose-500/8 hover:bg-rose-500/15",
    amountClass: "text-rose-300",
    sign: "-",
  },
  TRANSFER: {
    icon: ArrowRightLeft,
    label: "Transfer",
    rowClass: "bg-sky-500/8 hover:bg-sky-500/15",
    amountClass: "text-sky-300",
    sign: "±",
  },
};

const categoryBadgeStyles = [
  "border-emerald-400/35 bg-emerald-500/10 text-emerald-200",
  "border-sky-400/35 bg-sky-500/10 text-sky-200",
  "border-amber-400/35 bg-amber-500/10 text-amber-200",
  "border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-200",
  "border-violet-400/35 bg-violet-500/10 text-violet-200",
  "border-rose-400/35 bg-rose-500/10 text-rose-200",
];

const hashIndex = (value: string) =>
  Math.abs(
    value.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 100_000, 7),
  ) % categoryBadgeStyles.length;

const formatCurrency = (value: number | string) => {
  const amount = typeof value === "number" ? value : Number(value);
  return money.format(Number.isFinite(amount) ? amount : 0);
};

export const formatSignedAmount = (transaction: TransactionTableItem) => {
  const meta = typeMeta[transaction.type];
  return `${meta.sign}${formatCurrency(transaction.amount)}`;
};

export function formatRunningBalance(value: number | null) {
  if (value === null) {
    return "N/A";
  }
  return formatCurrency(value);
}

type RowProps = {
  transaction: TransactionTableItem;
  runningBalance: number | null;
  isSelected: boolean;
  isPending: boolean;
  onToggleSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TransactionRow({
  transaction,
  runningBalance,
  isSelected,
  isPending,
  onToggleSelect,
  onEdit,
  onDelete,
}: RowProps) {
  const meta = typeMeta[transaction.type];
  const Icon = meta.icon;
  const categoryName = transaction.category?.name ?? "Uncategorized";
  const placeholder = "No memo added";

  return (
    <tr
      className={cn(
        "text-sm text-[var(--text-primary)] transition-colors",
        "border-b border-[var(--border)]",
        meta.rowClass,
      )}
      title={`Type: ${meta.label} | Account: ${transaction.account?.name ?? "No account"} | Category: ${categoryName}`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(event) => onToggleSelect(event.target.checked)}
          className="h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent-glow)]"
          aria-label={`Select ${transaction.description ?? "transaction"}`}
        />
      </td>
      <td className="px-4 py-3 text-[var(--text-secondary)]">
        {date.format(new Date(transaction.transactionAt))}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5">
          <Icon className={cn("h-4 w-4", meta.amountClass)} aria-hidden />
          <span className="text-xs text-[var(--text-secondary)]">{meta.label}</span>
        </span>
      </td>
      <td className="px-4 py-3 text-[var(--text-secondary)]">
        {transaction.account?.name ?? "Unassigned account"}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-xs",
            categoryBadgeStyles[hashIndex(categoryName)],
          )}
        >
          {categoryName}
        </span>
      </td>
      <td className="max-w-[240px] px-4 py-3 text-[var(--text-secondary)]">
        <p className="truncate">{transaction.description || placeholder}</p>
      </td>
      <td className={cn("px-4 py-3 text-right font-semibold tabular-nums", meta.amountClass)}>
        {formatSignedAmount(transaction)}
      </td>
      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums">
        {formatRunningBalance(runningBalance)}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-md border border-rose-500/50 px-2.5 py-1 text-xs text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

type MobileCardProps = {
  transaction: TransactionTableItem;
  runningBalance: number | null;
  isSelected: boolean;
  isPending: boolean;
  onToggleSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function MobileTransactionCard({
  transaction,
  runningBalance,
  isSelected,
  isPending,
  onToggleSelect,
  onEdit,
  onDelete,
}: MobileCardProps) {
  const meta = typeMeta[transaction.type];
  const Icon = meta.icon;
  const categoryName = transaction.category?.name ?? "Uncategorized";

  return (
    <article
      className={cn(
        "rounded-xl border border-[var(--border)] p-3",
        "bg-[var(--bg-card)]",
        meta.rowClass,
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {transaction.description || "No memo added"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {transaction.account?.name ?? "Unassigned account"} •{" "}
            {date.format(new Date(transaction.transactionAt))}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(event) => onToggleSelect(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent-glow)]"
          aria-label={`Select ${transaction.description ?? "transaction"}`}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[var(--text-secondary)]">
          <Icon className={cn("h-3.5 w-3.5", meta.amountClass)} aria-hidden />
          {meta.label}
        </span>
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5",
            categoryBadgeStyles[hashIndex(categoryName)],
          )}
        >
          {categoryName}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5">
          <p className="text-[var(--text-muted)]">Amount</p>
          <p className={cn("font-semibold tabular-nums", meta.amountClass)}>
            {formatSignedAmount(transaction)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5">
          <p className="text-[var(--text-muted)]">Running balance</p>
          <p className="font-semibold tabular-nums text-[var(--text-primary)]">
            {formatRunningBalance(runningBalance)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isPending}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className="flex-1 rounded-md border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
