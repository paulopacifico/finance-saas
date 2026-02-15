import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Sign In</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Sign in with your email and password.</p>

        <form className="mt-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-dim)]">
            Create a new account
          </Link>
          <span className="text-[var(--text-muted)]">|</span>
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
