import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Easy Finance Made Smarter
          </div>

          <h1 className="hero-title">
            Manage your finances easily and with{" "}
            <span className="hero-title-italic">confidence</span>
          </h1>

          <p className="hero-subtitle">
            Finflow empowers you to securely manage, smartly track, and effortlessly grow your
            money with powerful, all-in-one tools.
          </p>

          <div className="hero-cta">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <span className="mockup-time">9:41</span>
              <div className="mockup-icons">
                <span>●●●●</span>
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            <div className="mockup-welcome">
              <p className="mockup-welcome-text">Welcome</p>
              <div className="mockup-balance-row">
                <div className="balance-card income">
                  <div className="balance-label">Income</div>
                  <div className="balance-value">$22,760.23</div>
                </div>
                <div className="balance-card">
                  <div className="balance-label">Expense</div>
                  <div className="balance-value">$12,760.23</div>
                </div>
              </div>
            </div>

            <div className="mockup-chart">
              <div className="chart-header">
                <div>
                  <div className="chart-value">$30,113.80</div>
                  <div className="chart-change">+2.76%</div>
                </div>
                <span className="chart-more">More</span>
              </div>
              <div className="chart-graph">
                <div className="chart-line">
                  <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#4ade80", stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: "#4ade80", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 100 Q50 80 100 70 T200 50 T300 60 T400 30 L400 120 L0 120 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0 100 Q50 80 100 70 T200 50 T300 60 T400 30"
                      stroke="#4ade80"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mockup-sidebar">
            <div className="sidebar-item">
              <span className="sidebar-label">ol/USD</span>
              <div>
                <div className="sidebar-value">8.87</div>
                <div className="sidebar-change">+3.75%</div>
              </div>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Bitcoin</span>
              <div>
                <div className="sidebar-value">$1,270.10</div>
                <div className="sidebar-change">+1.24%</div>
              </div>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">ATOM/US</span>
              <div>
                <div className="sidebar-value">$68.05</div>
                <div className="sidebar-change">+2.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
