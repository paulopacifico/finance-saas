import { Pricing } from "@/components/marketing/Pricing";

export default function PricingPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Pricing</h1>
        <p className="text-sm text-zinc-600">
          CAD plans for different stages of family financial maturity.
        </p>
        <Pricing />
      </main>
    </div>
  );
}
