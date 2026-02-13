import Link from "next/link";

export function CTA() {
  return (
    <section className="rounded-xl bg-zinc-900 p-8 text-white">
      <h2 className="text-2xl font-semibold">Pronto para centralizar suas finanças familiares?</h2>
      <p className="mt-2 text-sm text-zinc-200">
        Comece com configuração simples e acompanhe seus gastos em CAD no primeiro dia.
      </p>
      <Link
        href="/dashboard"
        className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
      >
        Acessar Dashboard
      </Link>
    </section>
  );
}
