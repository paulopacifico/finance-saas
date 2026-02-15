import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          Authentication Error
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          We could not complete your sign-in request. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/login" className="btn btn-primary">
            Back to Login
          </Link>
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
