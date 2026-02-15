import { Features } from "@/components/marketing/Features";

export default function FeaturesPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Features</h1>
        <p className="text-sm text-zinc-600">
          Essential features to organize accounts, transactions, and budgets without complexity.
        </p>
        <Features />
      </main>
    </div>
  );
}
