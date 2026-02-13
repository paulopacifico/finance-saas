import Link from "next/link";

const items = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function MarketingNav() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
          Finflow CAD
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-700">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-zinc-950">
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
