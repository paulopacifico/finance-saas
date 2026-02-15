import Link from "next/link";

const featureCards = [
  {
    title: "Real-Time Analytics",
    description: "Monitor your finances live with clear dashboards.",
  },
  {
    title: "Automated Reports",
    description: "Generate summaries instantly with zero manual work.",
  },
  {
    title: "Smart Budgeting",
    description: "Plan and adjust with AI-powered budget suggestions.",
  },
];

const pricing = [
  { name: "Starter", price: "$0", period: "/month", cta: "Get Started Free" },
  { name: "Pro", price: "$19", period: "/month", cta: "Get Started", featured: true },
  { name: "Enterprise", price: "$49", period: "/month", cta: "Contact Sales" },
];

export function TailwindLanding() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-semibold">
            Finflow
          </Link>
          <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Easy Finance Made Smarter
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Manage your finances easily and with confidence
          </h1>
          <p className="mt-5 max-w-xl text-zinc-400">
            Finflow empowers you to securely manage, smartly track, and effortlessly grow your
            money with powerful all-in-one tools.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-md bg-emerald-400 px-5 py-3 font-semibold text-zinc-900">
              Get Started
            </Link>
            <a href="#features" className="rounded-md border border-zinc-700 px-5 py-3 text-zinc-200">
              Learn More
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl">
          <p className="text-sm text-zinc-400">Welcome</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-zinc-800 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Income</p>
              <p className="mt-1 text-xl font-bold text-emerald-300">$22,760.23</p>
            </div>
            <div className="rounded-lg bg-zinc-800 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Expense</p>
              <p className="mt-1 text-xl font-bold">$12,760.23</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold">Streamline finances with smart features</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">Simple, transparent pricing</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-xl border p-5 ${
                  plan.featured
                    ? "border-emerald-400 bg-zinc-900 shadow-[0_0_40px_rgba(74,222,128,0.15)]"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">
                  {plan.price}
                  <span className="ml-1 text-sm font-normal text-zinc-400">{plan.period}</span>
                </p>
                <button className="mt-6 w-full rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-900">
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold">Loved by thousands of users</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Sarah Kim", "Marcus Rodriguez", "Amy Liu"].map((name) => (
            <article key={name} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-emerald-300">★★★★★</p>
              <p className="mt-3 text-sm text-zinc-400">
                Finflow improved how I manage finances and gave me better visibility.
              </p>
              <p className="mt-4 text-sm font-semibold">{name}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
