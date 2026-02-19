"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracking";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANDING_ANIMATION } from "@/lib/landing/animations";
import { LANDING_BREAKPOINTS, LANDING_STATS } from "@/lib/landing/constants";

type DashboardView = "cashflow" | "allocation" | "runway";

const logoItems = [
  "Bench",
  "Northstar VC",
  "Arcline",
  "Fieldstone",
  "Altamar",
  "Rivet Capital",
  "Cobalt HQ",
];

function AnimatedCurrency({
  value,
  duration = LANDING_ANIMATION.counterMs,
  decimals = 0,
  prefix = "$",
  suffix = "",
  reducedMotion = false,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  reducedMotion?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (reducedMotion || value === 0) {
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [duration, reducedMotion, value]);

  const visibleValue = reducedMotion ? value : displayValue;

  return (
    <span>
      {prefix}
      {visibleValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${LANDING_BREAKPOINTS.mobileMax}px)`).matches : false,
  );
  const [activeView, setActiveView] = useState<DashboardView>("cashflow");
  const [hoveredDataPoint, setHoveredDataPoint] = useState(4);

  const cashflowSeries = useMemo(() => [42, 48, 45, 57, 61, 66, 72, 69, 75, 84], []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${LANDING_BREAKPOINTS.mobileMax}px)`);
    const listener = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const cycleViews: DashboardView[] = ["cashflow", "allocation", "runway"];
    const interval = window.setInterval(() => {
      setActiveView((current) => {
        const currentIndex = cycleViews.indexOf(current);
        return cycleViews[(currentIndex + 1) % cycleViews.length];
      });
    }, LANDING_ANIMATION.dashboardViewCycleMs);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty("--hero-parallax", "0px");
      return;
    }

    let ticking = false;
    const updateParallax = () => {
      const value = Math.min(window.scrollY * LANDING_ANIMATION.parallaxFactor, LANDING_ANIMATION.parallaxMaxPx);
      document.documentElement.style.setProperty("--hero-parallax", `${value.toFixed(2)}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.setProperty("--hero-parallax", "0px");
    };
  }, [reducedMotion]);

  return (
    <section className="hero" data-reveal>
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-watermark" aria-hidden="true">
        FINFLOW
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            CFO-grade visibility for growth-stage teams
          </div>

          <h1 className="hero-title">
            Turn 18 hours of monthly finance ops into
            <span className="hero-title-emphasis"> 20-minute decision loops.</span>
          </h1>

          <p className="hero-subtitle">
            Finflow tracks <strong>{LANDING_STATS.annualizedCashMovement}</strong> in annualized cash movement across{" "}
            <strong>{LANDING_STATS.teams} teams</strong>, helping operators cut reporting time by{" "}
            <strong>{LANDING_STATS.reportingTimeReduction}</strong>.
          </p>

          <div className="hero-cta">
            <Link
              href="/signup"
              className="btn btn-primary btn-lg hero-cta-primary"
              onClick={() => trackEvent("cta_click", { location: "hero", action: "start_free_trial" })}
            >
              Start free trial
            </Link>
            <a
              href="#features"
              className="btn btn-secondary btn-lg hero-cta-secondary"
              onClick={() => trackEvent("cta_click", { location: "hero", action: "view_interactive_demo" })}
            >
              View interactive demo
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="hero-proof">
            <p className="hero-proof-title">Trusted by finance teams at</p>
            <div className="hero-logo-marquee">
              <div className="hero-logo-track">
                {[...logoItems, ...logoItems].map((logo, index) => (
                  <span className="hero-logo-item" key={`${logo}-${index}`}>
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          {isMobileViewport ? (
            <div className="hero-mobile-static" aria-label="Static dashboard preview">
              <Image
                src="/landing/images/hero-dashboard.webp"
                alt="Finflow dashboard showing revenue and cashflow overview"
                width={1080}
                height={720}
                sizes="(max-width: 639px) 92vw, (max-width: 1023px) 80vw, 0px"
                className="hero-mobile-image"
                loading="eager"
                priority={false}
              />
            </div>
          ) : (
            <>
          <div className="dashboard-shell" role="presentation">
            <div className="dashboard-shell-header">
              <div className="dashboard-dots">
                <span />
                <span />
                <span />
              </div>
              <p>Finflow Command Center</p>
            </div>

            <div className="dashboard-shell-metrics">
              <article className="metric-card">
                <p className="metric-label">Cash on hand</p>
                <p className="metric-value">
                  <AnimatedCurrency value={624500} reducedMotion={reducedMotion} />
                </p>
                <p className="metric-trend up">+12.8% month over month</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Net burn</p>
                <p className="metric-value">
                  <AnimatedCurrency value={46200} suffix="/mo" reducedMotion={reducedMotion} />
                </p>
                <p className="metric-trend down">-8.4% month over month</p>
              </article>
            </div>

            <div className="dashboard-view-tabs">
              <button
                type="button"
                className={activeView === "cashflow" ? "active" : ""}
                onMouseEnter={() => setActiveView("cashflow")}
                onFocus={() => setActiveView("cashflow")}
                onClick={() => setActiveView("cashflow")}
              >
                Cashflow
              </button>
              <button
                type="button"
                className={activeView === "allocation" ? "active" : ""}
                onMouseEnter={() => setActiveView("allocation")}
                onFocus={() => setActiveView("allocation")}
                onClick={() => setActiveView("allocation")}
              >
                Allocation
              </button>
              <button
                type="button"
                className={activeView === "runway" ? "active" : ""}
                onMouseEnter={() => setActiveView("runway")}
                onFocus={() => setActiveView("runway")}
                onClick={() => setActiveView("runway")}
              >
                Runway
              </button>
            </div>

            <div className="dashboard-views">
              <div className={`dashboard-view ${activeView === "cashflow" ? "active" : ""}`}>
                <div className="view-header">
                  <p className="view-title">Rolling 10-week cashflow</p>
                  <p className="view-value">
                    <AnimatedCurrency value={184250} reducedMotion={reducedMotion} />
                  </p>
                </div>
                <div className="line-chart" role="img" aria-label="Cashflow trend line chart">
                  {cashflowSeries.map((point, index) => {
                    const height = `${point}%`;
                    return (
                      <button
                        type="button"
                        key={`cashflow-${index}`}
                        className={`line-point ${hoveredDataPoint === index ? "active" : ""}`}
                        style={{ left: `${(index / (cashflowSeries.length - 1)) * 100}%`, bottom: height }}
                        onMouseEnter={() => setHoveredDataPoint(index)}
                        onFocus={() => setHoveredDataPoint(index)}
                        aria-label={`Week ${index + 1}: ${point}k net cash`}
                      />
                    );
                  })}
                  <svg viewBox="0 0 460 180" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="editorialLineFill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 126 C45 108, 78 116, 104 98 C140 84, 168 73, 204 66 C252 54, 286 63, 322 44 C356 30, 394 22, 460 18 L460 180 L0 180 Z"
                      fill="url(#editorialLineFill)"
                    />
                    <path
                      d="M0 126 C45 108, 78 116, 104 98 C140 84, 168 73, 204 66 C252 54, 286 63, 322 44 C356 30, 394 22, 460 18"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className={`dashboard-view ${activeView === "allocation" ? "active" : ""}`}>
                <div className="view-header">
                  <p className="view-title">Spend allocation by channel</p>
                  <p className="view-value">
                    <AnimatedCurrency value={97200} reducedMotion={reducedMotion} />
                  </p>
                </div>
                <div className="allocation-layout">
                  <div className="allocation-bars" role="img" aria-label="Allocation bar chart">
                    <div className="allocation-row">
                      <span>Product</span>
                      <div className="bar-track">
                        <div className="bar-fill product" style={{ width: "44%" }} />
                      </div>
                      <strong>44%</strong>
                    </div>
                    <div className="allocation-row">
                      <span>Marketing</span>
                      <div className="bar-track">
                        <div className="bar-fill marketing" style={{ width: "31%" }} />
                      </div>
                      <strong>31%</strong>
                    </div>
                    <div className="allocation-row">
                      <span>Operations</span>
                      <div className="bar-track">
                        <div className="bar-fill operations" style={{ width: "25%" }} />
                      </div>
                      <strong>25%</strong>
                    </div>
                  </div>
                  <div className="allocation-donut" aria-label="Allocation donut chart" role="img">
                    <span>Q1 Mix</span>
                  </div>
                </div>
              </div>

              <div className={`dashboard-view ${activeView === "runway" ? "active" : ""}`}>
                <div className="view-header">
                  <p className="view-title">Runway forecast</p>
                  <p className="view-value">18.2 months</p>
                </div>
                <div className="runway-grid" role="img" aria-label="Runway stacked bars by month">
                  {[78, 74, 70, 66, 62, 58].map((level, index) => (
                    <div className="runway-col" key={`runway-${index}`}>
                      <span className="runway-bar" style={{ height: `${level}%` }} />
                      <small>M{index + 1}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

            <aside className="hero-floating-cards" aria-label="Supplementary metrics">
              <article className="floating-card">
                <p className="floating-label">Automation hours saved</p>
                <p className="floating-value">
                  <AnimatedCurrency value={1420} prefix="" reducedMotion={reducedMotion} />
                </p>
              </article>
              <article className="floating-card">
                <p className="floating-label">Anomalies detected</p>
                <p className="floating-value">12</p>
              </article>
            </aside>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
