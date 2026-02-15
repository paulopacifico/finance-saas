import Link from "next/link";

export default function SignupPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Create Account</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Create your account to start using Finflow.
        </p>

        <form className="mt-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-[var(--text-primary)]">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 8 characters"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-dim)]">
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
}
