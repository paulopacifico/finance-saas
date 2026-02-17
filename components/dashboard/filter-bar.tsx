import type { FinanceAccountOption, FinanceOption, FinanceTransactionType } from "@/lib/types/finance";

export type DatePreset = "all" | "this-week" | "this-month" | "last-30-days" | "custom";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "category-asc";

type FilterBarProps = {
  accounts: FinanceAccountOption[];
  categories: FinanceOption[];
  selectedAccountId: string;
  selectedCategoryId: string;
  selectedType: "all" | FinanceTransactionType;
  datePreset: DatePreset;
  customStartDate: string;
  customEndDate: string;
  sort: SortOption;
  search: string;
  pageSize: number;
  selectedCount: number;
  isPending: boolean;
  onAccountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: "all" | FinanceTransactionType) => void;
  onDatePresetChange: (value: DatePreset) => void;
  onCustomStartDateChange: (value: string) => void;
  onCustomEndDateChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onClearFilters: () => void;
  onBulkDelete: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
};

export function FilterBar({
  accounts,
  categories,
  selectedAccountId,
  selectedCategoryId,
  selectedType,
  datePreset,
  customStartDate,
  customEndDate,
  sort,
  search,
  pageSize,
  selectedCount,
  isPending,
  onAccountChange,
  onCategoryChange,
  onTypeChange,
  onDatePresetChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onSortChange,
  onSearchChange,
  onPageSizeChange,
  onClearFilters,
  onBulkDelete,
  onExportCsv,
  onExportPdf,
}: FilterBarProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="grid gap-3 lg:grid-cols-12">
        <label className="lg:col-span-3 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Search
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search description"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          />
        </label>

        <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Account
          <select
            value={selectedAccountId}
            onChange={(event) => onAccountChange(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="all">All accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Category
          <select
            data-testid="transaction-category-filter"
            value={selectedCategoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Type
          <select
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value as "all" | FinanceTransactionType)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="all">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </label>

        <label className="lg:col-span-3 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Date range
          <select
            value={datePreset}
            onChange={(event) => onDatePresetChange(event.target.value as DatePreset)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="all">All time</option>
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
        </label>

        {datePreset === "custom" ? (
          <>
            <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Start date
              <input
                type="date"
                value={customStartDate}
                onChange={(event) => onCustomStartDateChange(event.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
            </label>
            <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
              End date
              <input
                type="date"
                value={customEndDate}
                onChange={(event) => onCustomEndDateChange(event.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
            </label>
          </>
        ) : null}

        <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Sort
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="date-desc">Date (newest)</option>
            <option value="date-asc">Date (oldest)</option>
            <option value="amount-desc">Amount (high to low)</option>
            <option value="amount-asc">Amount (low to high)</option>
            <option value="category-asc">Category (A-Z)</option>
          </select>
        </label>

        <label className="lg:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Rows per page
          <select
            value={String(pageSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm normal-case text-[var(--text-primary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>

        <div className="lg:col-span-8 flex flex-wrap items-end gap-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={onBulkDelete}
            disabled={selectedCount === 0 || isPending}
            className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete selected ({selectedCount})
          </button>
        </div>
      </div>
    </section>
  );
}
