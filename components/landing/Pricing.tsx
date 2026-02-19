"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { trackEvent } from "@/lib/analytics/tracking";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANDING_ANIMATION } from "@/lib/landing/animations";

type BillingCycle = "monthly" | "annual";
type CtaVariant = "primary" | "secondary" | "ghost";

type Plan = {
  id: "starter" | "pro" | "enterprise";
  name: string;
  subtitle: string;
  monthly: number;
  annualMonthlyEquivalent: number;
  cta: {
    label: string;
    href: string;
    variant: CtaVariant;
  };
  trust: string;
  features: Array<{ label: string; tooltip?: string }>;
  note: string;
  recommended?: boolean;
  premium?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "For individuals and early-stage teams",
    monthly: 0,
    annualMonthlyEquivalent: 0,
    cta: { label: "Get Started Free", href: "/signup", variant: "secondary" as const },
    trust: "No credit card required",
    features: [
      { label: "2 bank connections" },
      { label: "Core analytics dashboard" },
      { label: "Monthly summary report" },
      { label: "Community support" },
    ],
    note: "Upgrade anytime as transaction volume grows.",
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "For growth-stage finance operators",
    monthly: 29,
    annualMonthlyEquivalent: 23,
    cta: { label: "Start Pro Trial", href: "/signup", variant: "primary" as const },
    trust: "14-day money-back guarantee",
    features: [
      { label: "Unlimited account connections" },
      { label: "Real-time variance monitoring", tooltip: "Auto-alerts when spend drifts outside approved ranges." },
      { label: "Automated board reporting" },
      { label: "Smart budget optimization", tooltip: "Recommends allocation shifts using burn and growth signals." },
      { label: "Priority support in under 2 hours" },
    ],
    note: "Most teams switch to annual after month one.",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For multi-entity and regulated operations",
    monthly: 89,
    annualMonthlyEquivalent: 74,
    cta: { label: "Contact Sales", href: "/about", variant: "ghost" as const },
    trust: "SOC 2 workflows and dedicated success lead",
    features: [
      { label: "Everything in Pro, plus unlimited entities" },
      { label: "Custom data pipelines and ERP connectors", tooltip: "Supports bespoke warehouse and ERP mapping." },
      { label: "Advanced approval controls" },
      { label: "Dedicated implementation manager" },
      { label: "99.9% uptime SLA" },
    ],
    note: "Custom onboarding and migration support included.",
    premium: true,
  },
];

function AnimatedPrice({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    currentRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const from = currentRef.current;
    const to = value;
    if (from === to) {
      return;
    }

    const start = performance.now();
    const duration = LANDING_ANIMATION.priceCounterMs;
    let frameId = 0;

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(from + (to - from) * eased);
      setDisplayValue(nextValue);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [reducedMotion, value]);

  const visibleValue = reducedMotion ? value : displayValue;
  return <span className="pricing-amount">{visibleValue}</span>;
}

export function Pricing() {
  const reducedMotion = useReducedMotion();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showComparison, setShowComparison] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pricing" id="pricing" ref={sectionRef} data-reveal>
      <div className="pricing-container">
        <div className="section-header">
          <h2 className="section-title">
            Pricing built for financial <span className="section-title-italic">execution speed</span>
          </h2>
          <p className="section-subtitle">Scale from first dashboard to multi-entity operations without changing your finance stack.</p>
        </div>

        <div className="pricing-controls">
          <p className="pricing-controls-label">Billing cycle</p>
          <div className="billing-toggle" role="tablist" aria-label="Select billing cycle">
            <button
              type="button"
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
              onClickCapture={() => trackEvent("billing_toggle", { cycle: "monthly" })}
              role="tab"
              aria-selected={billingCycle === "monthly"}
            >
              Monthly
            </button>
            <button
              type="button"
              className={billingCycle === "annual" ? "active" : ""}
              onClick={() => setBillingCycle("annual")}
              onClickCapture={() => trackEvent("billing_toggle", { cycle: "annual" })}
              role="tab"
              aria-selected={billingCycle === "annual"}
            >
              Annual
              <span className="savings-pill">Save up to 22%</span>
            </button>
            <span className={`billing-toggle-thumb ${billingCycle === "annual" ? "annual" : ""}`} aria-hidden="true" />
          </div>
          <button
            type="button"
            className="pricing-compare-toggle"
            onClick={() => {
              setShowComparison((value) => !value);
              trackEvent("pricing_comparison_toggle", { next_state: !showComparison });
            }}
          >
            {showComparison ? "Hide comparison" : "Show comparison table"}
          </button>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, planIndex) => {
            const isAnnual = billingCycle === "annual";
            const value = isAnnual ? plan.annualMonthlyEquivalent : plan.monthly;
            const annualSavings = plan.monthly > 0 ? Math.round((1 - plan.annualMonthlyEquivalent / plan.monthly) * 100) : 0;
            return (
              <article
                key={plan.id}
                className={`pricing-card ${plan.recommended ? "featured" : ""} ${plan.premium ? "premium" : ""}`}
                style={{ "--feature-delay": `${planIndex * 120}ms` } as CSSProperties}
              >
                {plan.recommended && <p className="pricing-popular-badge">Most popular</p>}
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="pricing-description">{plan.subtitle}</p>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <AnimatedPrice value={value} reducedMotion={reducedMotion} />
                  <span className="pricing-period">/month</span>
                </div>
                {isAnnual && plan.monthly > 0 && <p className="pricing-saving-note">Save {annualSavings}% with annual billing</p>}
                <p className="pricing-trust-line">{plan.trust}</p>

                <ul className={`pricing-features ${sectionVisible ? "is-visible" : ""}`}>
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={feature.label}
                      style={{ "--item-delay": `${planIndex * 120 + featureIndex * 110}ms` } as CSSProperties}
                    >
                      <span className="pricing-check">✓</span>
                      <span>{feature.label}</span>
                      {feature.tooltip && (
                        <span className="pricing-tooltip-wrap">
                          <button type="button" className="pricing-tooltip-trigger" aria-label={feature.tooltip}>
                            i
                          </button>
                          <span className="pricing-tooltip">{feature.tooltip}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <p className="pricing-plan-note">{plan.note}</p>
                <Link
                  href={plan.cta.href}
                  className={`btn pricing-cta pricing-cta-${plan.cta.variant}`}
                  onClick={() => trackEvent("pricing_cta_click", { plan: plan.id, billing_cycle: billingCycle })}
                >
                  {plan.cta.label}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="pricing-trust-signals">
          <span>30-day money-back guarantee</span>
          <span>No credit card required on Starter</span>
          <span>2,400+ teams run Finflow monthly</span>
          <span>$2.4B+ annualized flow monitored</span>
        </div>

        {showComparison && (
          <div className="pricing-comparison" role="region" aria-label="Pricing plan comparison">
            <table>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Starter</th>
                  <th>Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Connected accounts</td>
                  <td>2</td>
                  <td>Unlimited</td>
                  <td>Unlimited + entities</td>
                </tr>
                <tr>
                  <td>Automated reports</td>
                  <td>Monthly</td>
                  <td>Real-time</td>
                  <td>Custom templates</td>
                </tr>
                <tr>
                  <td>Support SLA</td>
                  <td>Community</td>
                  <td>&lt; 2 hours</td>
                  <td>Dedicated manager</td>
                </tr>
                <tr>
                  <td>Security controls</td>
                  <td>Standard</td>
                  <td>Advanced approvals</td>
                  <td>Policy + custom controls</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
