"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/tracking";

export function CTA() {
  return (
    <section className="cta" data-reveal>
      <div className="cta-container">
        <h2 className="cta-title">
          Ready to take control of your <span className="section-title-italic">finances</span>?
        </h2>
        <p className="cta-subtitle">Join thousands of users who trust Finflow to manage their money smarter.</p>
        <div className="cta-buttons">
          <Link
            href="/signup"
            className="btn btn-primary btn-lg"
            onClick={() => trackEvent("cta_click", { location: "bottom_cta", action: "signup" })}
          >
            Get Started Free
          </Link>
          <Link
            href="/about"
            className="btn btn-secondary btn-lg"
            onClick={() => trackEvent("cta_click", { location: "bottom_cta", action: "schedule_demo" })}
          >
            Schedule a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
