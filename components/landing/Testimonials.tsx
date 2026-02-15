export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <div className="section-header">
          <h2 className="section-title">
            Loved by thousands of <span className="section-title-italic">users</span>
          </h2>
          <p className="section-subtitle">See what our customers have to say about Finflow.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-content">&quot;Finflow completely changed how I manage my business finances. The real-time analytics are incredibly useful for making quick decisions.&quot;</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">SK</div>
              <div>
                <div className="testimonial-name">Sarah Kim</div>
                <div className="testimonial-role">Startup Founder</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-content">&quot;The automated reports save me hours every month. I can focus on growing my business instead of crunching numbers.&quot;</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">MR</div>
              <div>
                <div className="testimonial-name">Marcus Rodriguez</div>
                <div className="testimonial-role">E-commerce Owner</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-content">&quot;Finally, a finance app that actually understands what small business owners need. The AI suggestions are spot-on.&quot;</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">AL</div>
              <div>
                <div className="testimonial-name">Amy Liu</div>
                <div className="testimonial-role">Freelance Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
