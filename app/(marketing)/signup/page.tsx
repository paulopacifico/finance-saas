import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-semibold text-zinc-900">Create Account</h1>
        <p className="mt-3 text-sm text-zinc-600">Create your account to start using Finflow.</p>
        <form className="mt-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 8 characters"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-sm">
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}
