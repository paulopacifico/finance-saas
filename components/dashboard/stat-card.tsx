import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const toneMap = {
  neutral: {
    iconBg: "bg-[var(--bg-secondary)] border-[var(--border)]",
    iconFg: "text-[var(--text-primary)]",
    value: "text-[var(--text-primary)]",
  },
  income: {
    iconBg: "bg-emerald-500/15 border-emerald-400/35",
    iconFg: "text-emerald-300",
    value: "text-emerald-300",
  },
  expense: {
    iconBg: "bg-rose-500/15 border-rose-400/35",
    iconFg: "text-rose-300",
    value: "text-rose-300",
  },
  transfer: {
    iconBg: "bg-sky-500/15 border-sky-400/35",
    iconFg: "text-sky-300",
    value: "text-sky-300",
  },
} as const;

type StatTone = keyof typeof toneMap;

type StatCardProps = {
  title: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  tone?: StatTone;
  deltaPercent?: number | null;
};

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
  deltaPercent = null,
}: StatCardProps) {
  const deltaClass =
    deltaPercent === null
      ? "text-[var(--text-muted)]"
      : deltaPercent >= 0
        ? "text-emerald-300"
        : "text-rose-300";

  const formattedDelta =
    deltaPercent === null
      ? null
      : `${deltaPercent >= 0 ? "+" : ""}${deltaPercent.toFixed(1)}% vs last month`;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{title}</p>
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border",
            toneMap[tone].iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4", toneMap[tone].iconFg)} aria-hidden />
        </span>
      </div>
      <p className={cn("text-2xl font-semibold tracking-tight", toneMap[tone].value)}>{value}</p>
      <p className={cn("mt-2 text-xs", formattedDelta ? deltaClass : "text-[var(--text-muted)]")}>
        {formattedDelta ?? helper ?? "No trend data yet"}
      </p>
    </article>
  );
}
