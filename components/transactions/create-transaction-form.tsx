import { createTransaction } from "@/app/actions/finance";

type Option = {
  id: string;
  name: string;
};

type CreateTransactionFormProps = {
  accounts: Option[];
  categories: Option[];
};

const DEFAULT_DATETIME = new Date().toISOString().slice(0, 16);

export function CreateTransactionForm({ accounts, categories }: CreateTransactionFormProps) {
  const hasRequiredOptions = accounts.length > 0 && categories.length > 0;

  async function submitTransaction(formData: FormData) {
    "use server";
    await createTransaction(formData);
  }

  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Nova transação</h2>
        <p className="text-sm text-zinc-500">
          Registre uma transação manualmente no seu dashboard.
        </p>
      </header>

      {!hasRequiredOptions ? (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Não foi possível habilitar o formulário. Verifique se sua conta possui ao menos uma conta
          financeira e uma categoria ativa.
        </p>
      ) : null}

      <form action={submitTransaction} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Conta
          <select
            name="accountId"
            required
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={accounts[0]?.id ?? ""}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Classificação
          <select
            name="categoryId"
            required
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={categories[0]?.id ?? ""}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Tipo
          <select
            name="type"
            required
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue="EXPENSE"
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
            <option value="TRANSFER">Transferência</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Valor
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0.00"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Data
          <input
            name="transactionAt"
            type="datetime-local"
            required
            disabled={!hasRequiredOptions}
            defaultValue={DEFAULT_DATETIME}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Moeda
          <input
            name="currency"
            type="text"
            maxLength={3}
            defaultValue="CAD"
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm uppercase focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-zinc-700">
          Descrição
          <input
            name="description"
            type="text"
            maxLength={255}
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ex.: supermercado"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!hasRequiredOptions}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar transação
          </button>
        </div>
      </form>
    </section>
  );
}
