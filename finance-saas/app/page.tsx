import {
  TransactionTable,
  type TransactionTableItem,
} from "@/components/transactions/transaction-table";

export default function Home() {
  const transactions: TransactionTableItem[] = [
    {
      id: "tx_1",
      amount: 84.5,
      description: "Mercado semanal",
      transactionAt: "2026-02-10T14:00:00.000Z",
      category: { id: "cat_food", name: "Groceries" },
    },
    {
      id: "tx_2",
      amount: 129.99,
      description: "Internet residencial",
      transactionAt: "2026-02-09T17:30:00.000Z",
      category: { id: "cat_bills", name: "Bills" },
    },
    {
      id: "tx_3",
      amount: 52,
      description: "Combustível",
      transactionAt: "2026-02-08T12:15:00.000Z",
      category: { id: "cat_transport", name: "Transport" },
    },
    {
      id: "tx_4",
      amount: 45.2,
      description: "Farmácia",
      transactionAt: "2026-02-08T10:00:00.000Z",
      category: { id: "cat_health", name: "Health" },
    },
    {
      id: "tx_5",
      amount: 31.75,
      description: "Cafeteria",
      transactionAt: "2026-02-07T08:20:00.000Z",
      category: { id: "cat_food", name: "Groceries" },
    },
    {
      id: "tx_6",
      amount: 2200,
      description: "Aluguel",
      transactionAt: "2026-02-01T09:00:00.000Z",
      category: { id: "cat_housing", name: "Housing" },
    },
    {
      id: "tx_7",
      amount: 67.8,
      description: "Eletricidade",
      transactionAt: "2026-01-30T18:40:00.000Z",
      category: { id: "cat_bills", name: "Bills" },
    },
    {
      id: "tx_8",
      amount: 18.99,
      description: "Streaming",
      transactionAt: "2026-01-29T13:00:00.000Z",
      category: { id: "cat_bills", name: "Bills" },
    },
    {
      id: "tx_9",
      amount: 95,
      description: "Restaurante",
      transactionAt: "2026-01-28T20:00:00.000Z",
      category: { id: "cat_food", name: "Groceries" },
    },
    {
      id: "tx_10",
      amount: 40,
      description: "Academia",
      transactionAt: "2026-01-26T07:30:00.000Z",
      category: { id: "cat_health", name: "Health" },
    },
    {
      id: "tx_11",
      amount: 72.49,
      description: "Transporte público",
      transactionAt: "2026-01-25T09:10:00.000Z",
      category: { id: "cat_transport", name: "Transport" },
    },
    {
      id: "tx_12",
      amount: 14.99,
      description: "App subscription",
      transactionAt: "2026-01-24T11:11:00.000Z",
      category: null,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">Finance Dashboard</h1>
          <p className="text-sm text-zinc-600">
            Tabela de transações com filtro por categoria e paginação.
          </p>
        </header>
        <TransactionTable transactions={transactions} defaultPageSize={6} />
      </main>
    </div>
  );
}
