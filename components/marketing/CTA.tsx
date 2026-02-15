import Link from "next/link";

export function CTA() {
  return (
    <section className="rounded-xl bg-zinc-900 p-8 text-white">
      <h2 className="text-2xl font-semibold">Ready to centralize your family finances?</h2>
      <p className="mt-2 text-sm text-zinc-200">
        Start with a simple setup and track your spending in CAD from day one.
      </p>
      <Link
        href="/signup"
        className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
      >
        Create Free Account
      </Link>
    </section>
  );
}
