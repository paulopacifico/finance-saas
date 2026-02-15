export function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">
            Streamline finances with smart <span className="section-title-italic">features</span>
          </h2>
          <p className="section-subtitle">Everything you need to take control of your money, all in one place.</p>
        </div>

        <div className="bento-grid">
          <div className="bento-card analytics-card">
            <div>
              <h3 className="bento-title">Real-Time Analytics</h3>
              <p className="bento-description">Monitor your finances live with clear, intuitive dashboards.</p>
            </div>
            <div className="analytics-visual">
              <div className="analytics-amount">
                <span className="analytics-value">$8900.70</span>
                <span className="analytics-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  12%
                </span>
              </div>
              <div className="analytics-bars">
                <div className="analytics-bar" style={{ height: "40%" }} />
                <div className="analytics-bar" style={{ height: "60%" }} />
                <div className="analytics-bar" style={{ height: "45%" }} />
                <div className="analytics-bar active" style={{ height: "80%" }} />
                <div className="analytics-bar" style={{ height: "55%" }} />
                <div className="analytics-bar active" style={{ height: "90%" }} />
                <div className="analytics-bar" style={{ height: "70%" }} />
                <div className="analytics-bar active" style={{ height: "95%" }} />
                <div className="analytics-bar" style={{ height: "50%" }} />
                <div className="analytics-bar" style={{ height: "65%" }} />
              </div>
            </div>
          </div>

          <div className="bento-card reports-card">
            <div className="reports-visual">
              <div className="reports-icon">
                <div className="reports-bars">
                  <div className="reports-bar" style={{ width: "60px" }} />
                  <div className="reports-bar" style={{ width: "45px" }} />
                  <div className="reports-bar" style={{ width: "70px" }} />
                </div>
              </div>
            </div>
            <h3 className="bento-title">Automated Reports</h3>
            <p className="bento-description">Generate summaries instantly, no manual work needed</p>
          </div>

          <div className="bento-card budgeting-card">
            <div>
              <h3 className="bento-title">Smart Budgeting</h3>
              <p className="bento-description">Plan and adjust with AI-powered budget suggestions.</p>
            </div>
            <div className="budgeting-visual">
              <div className="donut-chart">
                <svg viewBox="0 0 160 160">
                  <circle className="donut-bg" cx="80" cy="80" r="60" />
                  <circle className="donut-segment" cx="80" cy="80" r="60" stroke="#4ade80" strokeDasharray="377" strokeDashoffset="94" />
                  <circle
                    className="donut-segment"
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="#22c55e"
                    strokeDasharray="377"
                    strokeDashoffset="283"
                    style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
                  />
                </svg>
                <div className="donut-label">
                  <span className="donut-percent">5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card growth-card">
            <h3 className="bento-title">Growth Score</h3>
            <p className="bento-description">Track your financial health with a simple score.</p>
            <div className="growth-visual">
              <div className="growth-gauge">
                <svg viewBox="0 0 180 100">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "#22c55e" }} />
                      <stop offset="100%" style={{ stopColor: "#4ade80" }} />
                    </linearGradient>
                  </defs>
                  <path className="gauge-bg" d="M20 90 A 70 70 0 0 1 160 90" />
                  <path className="gauge-fill" d="M20 90 A 70 70 0 0 1 160 90" />
                </svg>
                <div className="growth-value">
                  <div className="growth-number">75</div>
                  <div className="growth-label">Growth Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card syncing-card span-2">
            <h3 className="bento-title">Secure Syncing</h3>
            <p className="bento-description">Monitor your finances live with dashboards. Connect all your accounts securely.</p>
            <div className="syncing-visual">
              <div className="sync-node">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="sync-line" />
              <div className="sync-node">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="sync-line" />
              <div className="sync-node">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
