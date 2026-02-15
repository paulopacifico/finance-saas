import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-semibold text-zinc-900">Criar conta</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Finalize seu cadastro para acessar os recursos de controle financeiro.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Continuar para o dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Ja tenho conta
          </Link>
        </div>
      </section>
    </main>
  );
}
