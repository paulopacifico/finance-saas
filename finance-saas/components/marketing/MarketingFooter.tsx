import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} Finflow CAD. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hover:text-zinc-900">
            Pricing
          </Link>
          <Link href="/features" className="hover:text-zinc-900">
            Features
          </Link>
          <Link href="/about" className="hover:text-zinc-900">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
