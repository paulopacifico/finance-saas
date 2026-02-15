import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          Finflow
        </Link>
        <div className="footer-links">
          <a href="#" className="footer-link">Twitter</a>
          <a href="#" className="footer-link">LinkedIn</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Help</a>
        </div>
        <p className="footer-copyright">© 2024 Finflow. All rights reserved.</p>
      </div>
    </footer>
  );
}
