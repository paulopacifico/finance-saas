type TrendPoint = {
  label: string;
  income: number;
  expense: number;
};

export type CategoryPoint = {
  label: string;
  value: number;
};

type MonthlyPoint = {
  label: string;
  income: number;
  expense: number;
};

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const fmt = (value: number) => currency.format(Number.isFinite(value) ? value : 0);

const COLORS = ["#4ade80", "#38bdf8", "#f59e0b", "#f472b6", "#a78bfa", "#f87171"];

const toPath = (
  points: number[],
  width: number,
  height: number,
  maxValue: number,
): string => {
  if (points.length === 0 || maxValue <= 0) {
    return "";
  }

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - (point / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

export function CashflowTrendChart({ points }: { points: TrendPoint[] }) {
  const width = 600;
  const height = 180;
  const values = points.flatMap((point) => [point.income, point.expense]);
  const maxValue = Math.max(1, ...values);
  const incomePath = toPath(
    points.map((point) => point.income),
    width,
    height,
    maxValue,
  );
  const expensePath = toPath(
    points.map((point) => point.expense),
    width,
    height,
    maxValue,
  );

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Income vs expenses trend</h3>
        <p className="text-xs text-[var(--text-muted)]">Last 6 months</p>
      </header>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full rounded-lg bg-[var(--bg-secondary)] p-2"
        role="img"
        aria-label="Cashflow trend chart"
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={0}
            y1={height * ratio}
            x2={width}
            y2={height * ratio}
            stroke="rgba(161,161,170,0.18)"
            strokeWidth={1}
          />
        ))}
        {incomePath ? (
          <path d={incomePath} fill="none" stroke="#4ade80" strokeWidth={3} strokeLinecap="round" />
        ) : null}
        {expensePath ? (
          <path d={expensePath} fill="none" stroke="#f87171" strokeWidth={3} strokeLinecap="round" />
        ) : null}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Income
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Expenses
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-6">
        {points.map((point) => (
          <div key={point.label} className="rounded-md border border-[var(--border)] px-2 py-1">
            <p>{point.label}</p>
            <p className="text-emerald-300">{fmt(point.income)}</p>
            <p className="text-rose-300">{fmt(point.expense)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryBreakdownChart({
  points,
  subtitle = "Current month expenses",
}: {
  points: CategoryPoint[];
  subtitle?: string;
}) {
  const total = points.reduce((sum, point) => sum + point.value, 0);
  const safePoints = points.slice(0, 6);
  const gradient =
    safePoints.length === 0 || total <= 0
      ? "conic-gradient(from 0deg, rgba(161,161,170,0.25) 0deg 360deg)"
      : `conic-gradient(${safePoints
          .reduce<{ stops: string[]; acc: number }>(
            (state, point, index) => {
              const size = (point.value / total) * 360;
              const start = state.acc;
              const end = state.acc + size;
              state.stops.push(`${COLORS[index % COLORS.length]} ${start}deg ${end}deg`);
              state.acc = end;
              return state;
            },
            { stops: [], acc: 0 },
          )
          .stops.join(", ")})`;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Category breakdown</h3>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="mx-auto h-40 w-40 rounded-full p-4" style={{ background: gradient }}>
          <div className="h-full w-full rounded-full bg-[var(--bg-card)]" />
        </div>
        <ul className="space-y-2">
          {safePoints.length > 0 ? (
            safePoints.map((point, index) => {
              const percent = total > 0 ? (point.value / total) * 100 : 0;
              return (
                <li
                  key={point.label}
                  className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2 text-sm"
                >
                  <span className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {point.label}
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {fmt(point.value)} ({percent.toFixed(0)}%)
                  </span>
                </li>
              );
            })
          ) : (
            <li className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)]">
              No category data yet.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

export function MonthlyComparisonChart({ points }: { points: MonthlyPoint[] }) {
  const max = Math.max(1, ...points.flatMap((point) => [point.income, point.expense]));

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Monthly comparison</h3>
        <p className="text-xs text-[var(--text-muted)]">Income vs expenses</p>
      </header>
      <div className="space-y-3">
        {points.map((point) => (
          <div key={point.label} className="rounded-md border border-[var(--border)] p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>{point.label}</span>
              <span>
                Net{" "}
                <span className={point.income - point.expense >= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {fmt(point.income - point.expense)}
                </span>
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  Income
                </span>
                <div className="h-2.5 flex-1 rounded bg-[var(--bg-secondary)]">
                  <div
                    className="h-2.5 rounded bg-emerald-400"
                    style={{ width: `${Math.max((point.income / max) * 100, 2)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-14 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  Expense
                </span>
                <div className="h-2.5 flex-1 rounded bg-[var(--bg-secondary)]">
                  <div
                    className="h-2.5 rounded bg-rose-400"
                    style={{ width: `${Math.max((point.expense / max) * 100, 2)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
