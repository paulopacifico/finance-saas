import { unstable_cache } from "next/cache";

import type { TransactionTableItem } from "@/components/transactions/transaction-table";

const getRecentTransactionsCached = unstable_cache(
  async (userId: string): Promise<TransactionTableItem[]> => {
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
      },
      take: 100,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount.toString(),
      description: transaction.description,
      currency: transaction.currency,
      transactionAt: transaction.transactionAt.toISOString(),
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
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
  return getRecentTransactionsCached(userId);
}
