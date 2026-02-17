import { unstable_cache } from "next/cache";

import type { TransactionTableItem } from "@/lib/types/finance";
import { assertNoE2EBypassInProduction } from "@/lib/security/production-guard";

const E2E_USER_ID = process.env.E2E_USER_ID ?? "e2e-user";
const E2E_USE_MOCK_DATA = process.env.E2E_USE_MOCK_DATA === "true";

const e2eTransactionsFixture: TransactionTableItem[] = [
  {
    id: "tx-e2e-01",
    description: "Home internet",
    amount: "89.90",
    currency: "CAD",
    transactionAt: "2026-02-01T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-bills", name: "Bills" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-02",
    description: "Electricity",
    amount: "64.10",
    currency: "CAD",
    transactionAt: "2026-01-30T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-bills", name: "Bills" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-03",
    description: "Streaming",
    amount: "19.99",
    currency: "CAD",
    transactionAt: "2026-01-29T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-bills", name: "Bills" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-04",
    description: "Payroll deposit",
    amount: "2400.00",
    currency: "CAD",
    transactionAt: "2026-01-28T10:00:00.000Z",
    type: "INCOME",
    category: { id: "cat-salary", name: "Salary" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-05",
    description: "Pharmacy",
    amount: "32.50",
    currency: "CAD",
    transactionAt: "2026-01-27T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-health", name: "Health" },
    account: { id: "acc-card", name: "Credit Card", currentBalance: "-620.55" },
  },
  {
    id: "tx-e2e-06",
    description: "Software subscription",
    amount: "12.00",
    currency: "CAD",
    transactionAt: "2026-01-26T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-subscriptions", name: "Subscriptions" },
    account: { id: "acc-card", name: "Credit Card", currentBalance: "-620.55" },
  },
  {
    id: "tx-e2e-07",
    description: "Restaurant",
    amount: "54.25",
    currency: "CAD",
    transactionAt: "2026-01-25T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-food", name: "Food" },
    account: { id: "acc-card", name: "Credit Card", currentBalance: "-620.55" },
  },
  {
    id: "tx-e2e-08",
    description: "Transfer to savings",
    amount: "500.00",
    currency: "CAD",
    transactionAt: "2026-01-24T10:00:00.000Z",
    type: "TRANSFER",
    category: { id: "cat-transfer", name: "Transfers" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-09",
    description: "Mobile plan",
    amount: "55.75",
    currency: "CAD",
    transactionAt: "2026-01-23T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-bills", name: "Bills" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
  {
    id: "tx-e2e-10",
    description: "Cashback reward",
    amount: "25.00",
    currency: "CAD",
    transactionAt: "2026-01-22T10:00:00.000Z",
    type: "INCOME",
    category: { id: "cat-reward", name: "Rewards" },
    account: { id: "acc-card", name: "Credit Card", currentBalance: "-620.55" },
  },
  {
    id: "tx-e2e-11",
    description: "Public transit",
    amount: "9.50",
    currency: "CAD",
    transactionAt: "2026-01-21T10:00:00.000Z",
    type: "EXPENSE",
    category: { id: "cat-transport", name: "Transport" },
    account: { id: "acc-main", name: "Main Account", currentBalance: "4320.18" },
  },
];

const getRecentTransactionsCached = unstable_cache(
  async (userId: string): Promise<TransactionTableItem[]> => {
    if (E2E_USE_MOCK_DATA && userId === E2E_USER_ID) {
      return e2eTransactionsFixture;
    }

    const { prisma } = await import("@/lib/prisma");
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        transactionAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        },
      },
      take: 100,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount.toString(),
      description: transaction.description,
      currency: transaction.currency,
      transactionAt: transaction.transactionAt.toISOString(),
      type: transaction.type,
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
          }
        : null,
      account: transaction.account
        ? {
            id: transaction.account.id,
            name: transaction.account.name,
            currentBalance: transaction.account.currentBalance.toString(),
          }
        : null,
    }));
  },
  ["dashboard-recent-transactions"],
  {
    revalidate: 60,
    tags: ["transactions"],
  },
);

export async function getDashboardTransactions(userId: string) {
  assertNoE2EBypassInProduction();
  return getRecentTransactionsCached(userId);
}
