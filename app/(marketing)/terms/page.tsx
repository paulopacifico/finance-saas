import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Finflow personal finance SaaS.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Terms of Service</h1>
      <p className="mt-4 text-sm text-zinc-600">Effective date: February 14, 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          By using Finflow, you agree to these terms. You are responsible for your account
          credentials and all activities under your account.
        </p>
        <p>
          Finflow provides financial tooling for informational and planning purposes and
          does not provide legal, tax, or investment advice.
        </p>
        <p>
          We may suspend accounts for abuse, fraud, or behavior that violates applicable
          law, contractual obligations, or platform security controls.
        </p>
      </section>
    </main>
  );
}
