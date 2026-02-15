import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-semibold text-zinc-900">Entrar</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Tela de autenticacao em atualizacao. Use o acesso guiado para continuar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Criar conta
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Voltar para inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
