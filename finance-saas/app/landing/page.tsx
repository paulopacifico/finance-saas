import Link from "next/link";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 text-zinc-900 sm:px-6 lg:px-10">
      <main className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Finance SaaS Canada
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Controle financeiro familiar em CAD, com privacidade e simplicidade.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600">
            Esta página pública usa ISR para manter carregamento rápido sem rebuild completo.
            O conteúdo é revalidado periodicamente no servidor.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Abrir Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
