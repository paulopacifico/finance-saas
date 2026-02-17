"use client";

import {
  ArrowLeftRight,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";

import {
  CashflowTrendChart,
  CategoryBreakdownChart,
  MonthlyComparisonChart,
} from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/stat-card";
import type {
  FinanceAccountOption,
  FinanceTransactionType,
  TransactionTableItem,
} from "@/lib/types/finance";

type DashboardOverviewProps = {
  transactions: TransactionTableItem[];
  accounts: FinanceAccountOption[];
};

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const toNumber = (value: string | number | null | undefined) => {
  const numeric = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
};

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

export function DashboardOverview({ transactions, accounts }: DashboardOverviewProps) {
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = monthKey(now);
    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = monthKey(previousMonthDate);

    let income = 0;
    let expense = 0;
    let previousIncome = 0;
    let previousExpense = 0;

    const typeCount: Record<FinanceTransactionType, number> = {
      INCOME: 0,
      EXPENSE: 0,
      TRANSFER: 0,
    };

    const expenseByCategory = new Map<string, number>();

    const monthlySeries = new Map<
      string,
      {
        income: number;
        expense: number;
      }
    >();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = monthKey(date);
      monthlySeries.set(key, { income: 0, expense: 0 });
    }

    for (const transaction of transactions) {
      const txDate = new Date(transaction.transactionAt);
      const key = monthKey(txDate);
      const amount = toNumber(transaction.amount);
      typeCount[transaction.type] += 1;

      if (key === currentMonth) {
        if (transaction.type === "INCOME") {
          income += amount;
        } else if (transaction.type === "EXPENSE") {
          expense += amount;
          const categoryName = transaction.category?.name ?? "Uncategorized";
          expenseByCategory.set(categoryName, (expenseByCategory.get(categoryName) ?? 0) + amount);
        }
      }

      if (key === previousMonth) {
        if (transaction.type === "INCOME") {
          previousIncome += amount;
        } else if (transaction.type === "EXPENSE") {
          previousExpense += amount;
        }
      }

      const monthlyPoint = monthlySeries.get(key);
      if (!monthlyPoint) {
        continue;
      }

      if (transaction.type === "INCOME") {
        monthlyPoint.income += amount;
      } else if (transaction.type === "EXPENSE") {
        monthlyPoint.expense += amount;
      }
    }

    const totalBalance = accounts.reduce((sum, account) => sum + toNumber(account.currentBalance), 0);
    const net = income - expense;
    const previousNet = previousIncome - previousExpense;
    const netChangePercent =
      previousNet === 0 ? null : ((net - previousNet) / Math.abs(previousNet)) * 100;

    const chartPoints = Array.from(monthlySeries.entries()).map(([key, point]) => {
      const [yearText, monthText] = key.split("-");
      const year = Number(yearText);
      const month = Number(monthText);
      const label = new Date(year, month, 1).toLocaleString("en-CA", { month: "short" });

      return {
        label,
        income: point.income,
        expense: point.expense,
      };
    });

    const categoryBreakdown = Array.from(expenseByCategory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    return {
      totalBalance,
      income,
      expense,
      net,
      netChangePercent,
      typeCount,
      chartPoints,
      categoryBreakdown,
    };
  }, [accounts, transactions]);

  return (
    <section className="w-full space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Balance"
          value={currency.format(summary.totalBalance)}
          icon={Wallet}
          tone="neutral"
          helper={`${accounts.length} account(s) connected`}
        />
        <StatCard
          title="Monthly Income"
          value={currency.format(summary.income)}
          icon={TrendingUp}
          tone="income"
        />
        <StatCard
          title="Monthly Expenses"
          value={currency.format(summary.expense)}
          icon={TrendingDown}
          tone="expense"
        />
        <StatCard
          title="Net Cash Flow"
          value={currency.format(summary.net)}
          icon={ArrowLeftRight}
          tone={summary.net >= 0 ? "income" : "expense"}
          deltaPercent={summary.netChangePercent}
        />
        <StatCard
          title="Transactions"
          value={String(transactions.length)}
          icon={ReceiptText}
          tone="transfer"
          helper={`${summary.typeCount.INCOME} income • ${summary.typeCount.EXPENSE} expense • ${summary.typeCount.TRANSFER} transfer`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CashflowTrendChart points={summary.chartPoints} />
        <CategoryBreakdownChart points={summary.categoryBreakdown} />
      </div>

      <MonthlyComparisonChart points={summary.chartPoints.slice(-4)} />
    </section>
  );
}
