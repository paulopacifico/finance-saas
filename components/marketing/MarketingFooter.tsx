import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="footer">
      <div className="footer-container">
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
        <div className="footer-links">
          <Link href="/pricing" className="footer-link">Pricing</Link>
          <Link href="/features" className="footer-link">Features</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <Link href="/terms" className="footer-link">Terms</Link>
          <Link href="/data-retention" className="footer-link">Data Retention</Link>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} Finflow. All rights reserved.</p>
      </div>
    </footer>
  );
}
