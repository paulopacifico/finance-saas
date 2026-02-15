import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Finflow privacy policy for users in Canada.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-zinc-600">Effective date: February 14, 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          Finflow processes personal and financial data to provide account aggregation,
          transaction management, budgeting insights, and support.
        </p>
        <p>
          We collect account profile data, transaction metadata, and usage logs.
          We do not sell personal financial data.
        </p>
        <p>
          Users can request access, correction, and deletion through our DSR process.
          Requests are logged and handled in accordance with legal obligations.
        </p>
        <p>
          For privacy requests, contact{" "}
          <a className="underline" href="mailto:privacy@finflow.app">
            privacy@finflow.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
