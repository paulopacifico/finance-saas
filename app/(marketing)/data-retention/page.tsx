import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Retention",
  description: "Finflow data retention policy.",
};

export default function DataRetentionPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Data Retention Policy</h1>
      <p className="mt-4 text-sm text-zinc-600">Effective date: February 14, 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          We retain active account data while the account is in good standing and the data
          is required to provide the service.
        </p>
        <p>
          We retain audit and security logs for operations, legal obligations, and incident
          response.
        </p>
        <p>
          For verified deletion requests, personal data is removed or anonymized, except when
          retention is required by law, fraud prevention, or dispute handling.
        </p>
      </section>
    </main>
  );
}
