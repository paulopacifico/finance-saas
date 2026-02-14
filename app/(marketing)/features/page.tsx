import { Features } from "@/components/marketing/Features";

export default function FeaturesPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Features</h1>
        <p className="text-sm text-zinc-600">
          Recursos essenciais para organizar contas, transações e budgets sem complexidade.
        </p>
        <Features />
      </main>
    </div>
  );
}
