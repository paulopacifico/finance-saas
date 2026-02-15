export function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <div className="section-header">
          <h2 className="section-title">
            Simple, transparent <span className="section-title-italic">pricing</span>
          </h2>
          <p className="section-subtitle">Choose the plan that works for you. No hidden fees.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-name">Starter</h3>
            <p className="pricing-description">For individuals getting started</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">0</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> 2 bank connections</li>
              <li><span className="pricing-check">✓</span> Basic analytics</li>
              <li><span className="pricing-check">✓</span> Monthly reports</li>
              <li><span className="pricing-check">✓</span> Mobile app access</li>
            </ul>
            <a href="#" className="btn btn-secondary">Get Started Free</a>
          </div>

          <div className="pricing-card featured">
            <h3 className="pricing-name">Pro</h3>
            <p className="pricing-description">For growing businesses</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">19</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> Unlimited connections</li>
              <li><span className="pricing-check">✓</span> Advanced analytics</li>
              <li><span className="pricing-check">✓</span> Real-time reports</li>
              <li><span className="pricing-check">✓</span> AI budget suggestions</li>
              <li><span className="pricing-check">✓</span> Priority support</li>
            </ul>
            <a href="#" className="btn btn-primary">Get Started</a>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-name">Enterprise</h3>
            <p className="pricing-description">For large organizations</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">49</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> Everything in Pro</li>
              <li><span className="pricing-check">✓</span> Team collaboration</li>
              <li><span className="pricing-check">✓</span> Custom integrations</li>
              <li><span className="pricing-check">✓</span> Dedicated manager</li>
              <li><span className="pricing-check">✓</span> SLA guarantee</li>
            </ul>
            <a href="#" className="btn btn-secondary">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
