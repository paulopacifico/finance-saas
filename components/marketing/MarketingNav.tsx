import Link from "next/link";

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-gradient text-2xl font-bold">Finflow</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        <details className="group border-t py-2 md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Menu
            <span className="text-xs text-gray-500 transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="py-2">
            <div className="flex flex-col gap-4">
              <Link href="/#features" className="text-gray-600">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600">
                About
              </Link>
              <hr />
              <Link href="/login" className="text-gray-600">
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex w-fit rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
}
