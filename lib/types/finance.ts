export type FinanceTransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type FinanceCategory = {
  id: string;
  name: string;
} | null;

export type FinanceAccount = {
  id: string;
  name: string;
  currentBalance?: string | number | null;
} | null;

export type TransactionTableItem = {
  id: string;
  description?: string | null;
  amount: number | string;
  currency?: string;
  transactionAt: string | Date;
  type: FinanceTransactionType;
  category: FinanceCategory;
  account: FinanceAccount;
};

export type FinanceOption = {
  id: string;
  name: string;
};

export type FinanceAccountOption = {
  id: string;
  name: string;
  currentBalance?: string | number | null;
};
