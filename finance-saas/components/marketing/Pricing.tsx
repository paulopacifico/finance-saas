const plans = [
  { name: "Starter", price: "CA$9", note: "Famílias iniciando controle financeiro." },
  { name: "Growth", price: "CA$19", note: "Mais contas, budgets e relatórios detalhados." },
];

export function Pricing() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <article key={plan.name} className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{plan.price}</p>
          <p className="mt-2 text-sm text-zinc-600">{plan.note}</p>
        </article>
      ))}
    </section>
  );
}
