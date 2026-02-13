const features = [
  "Conciliação de transações em CAD",
  "Categorias e budgets por família",
  "Dashboard com histórico e filtros",
  "Segurança com RLS e Supabase Auth",
];

export function Features() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <article key={feature} className="rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">{feature}</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Implementado para reduzir complexidade operacional e melhorar previsibilidade financeira.
          </p>
        </article>
      ))}
    </section>
  );
}
