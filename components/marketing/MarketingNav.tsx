import Link from "next/link";

export function MarketingNav() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          Finflow
        </Link>

        <div className="nav-center">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/about" className="nav-link">About</Link>
        </div>

        <div className="nav-right">
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
