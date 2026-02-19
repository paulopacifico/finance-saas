"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANDING_ANIMATION } from "@/lib/landing/animations";

const FEATURE_IDS = ["analytics", "reports", "budgeting", "growth", "syncing"] as const;
type FeatureId = (typeof FEATURE_IDS)[number];

export function Features() {
  const reducedMotion = useReducedMotion();
  const cardRefs = useRef<Record<FeatureId, HTMLElement | null>>({
    analytics: null,
    reports: null,
    budgeting: null,
    growth: null,
    syncing: null,
  });
  const [visibleCards, setVisibleCards] = useState<Record<FeatureId, boolean>>({
    analytics: false,
    reports: false,
    budgeting: false,
    growth: false,
    syncing: false,
  });
  const [hoveredCard, setHoveredCard] = useState<FeatureId | null>(null);

  const [analyticsSeries, setAnalyticsSeries] = useState([42, 48, 54, 51, 63, 58, 66, 72, 69, 76]);
  const [reportProgress, setReportProgress] = useState(18);
  const [marketingAllocation, setMarketingAllocation] = useState(31);
  const [displayedGrowthScore, setDisplayedGrowthScore] = useState(0);

  const operationsAllocation = 24;
  const productAllocation = 100 - operationsAllocation - marketingAllocation;
  const targetGrowthScore = useMemo(
    () => Math.round(productAllocation * 0.52 + (100 - Math.abs(marketingAllocation - 30)) * 0.48),
    [marketingAllocation, productAllocation],
  );

  const revenueProjection = useMemo(
    () => (128_450 + analyticsSeries[analyticsSeries.length - 1] * 920).toLocaleString("en-US"),
    [analyticsSeries],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const id = entry.target.getAttribute("data-feature-id") as FeatureId | null;
          if (!id) {
            return;
          }
          setVisibleCards((previous) => ({ ...previous, [id]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    FEATURE_IDS.forEach((id) => {
      const element = cardRefs.current[id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const interval = window.setInterval(() => {
      setAnalyticsSeries((previous) => {
        const nextPoint = Math.max(36, Math.min(88, previous[previous.length - 1] + (Math.random() * 14 - 7)));
        return [...previous.slice(1), Math.round(nextPoint)];
      });
    }, LANDING_ANIMATION.analyticsTickMs);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const interval = window.setInterval(() => {
      setReportProgress((previous) => (previous >= 100 ? 0 : previous + 4));
    }, LANDING_ANIMATION.reportProgressTickMs);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let frameId = 0;
    const animate = () => {
      setDisplayedGrowthScore((previous) => {
        if (previous === targetGrowthScore) {
          return previous;
        }
        const delta = targetGrowthScore - previous;
        const step = Math.max(1, Math.ceil(Math.abs(delta) / 10));
        return previous + Math.sign(delta) * step;
      });
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [reducedMotion, targetGrowthScore]);

  const visibleGrowthScore = reducedMotion ? targetGrowthScore : displayedGrowthScore;

  const growthRingLength = 2 * Math.PI * 46;
  const growthRingOffset = growthRingLength * (1 - visibleGrowthScore / 100);

  const reportStage =
    reportProgress < 34 ? "Collecting ledger events" : reportProgress < 68 ? "Reconciling anomalies" : "Publishing board packet";

  return (
    <section className="features" id="features" data-reveal>
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">
            See financial workflows become <span className="section-title-italic">decision systems</span>
          </h2>
          <p className="section-subtitle">
            Five live modules demonstrate how Finflow compresses reporting, forecasting, and governance into one operating layer.
          </p>
        </div>

        <div className={`features-grid ${hoveredCard ? "is-hovering" : ""}`}>
          <article
            ref={(element) => {
              cardRefs.current.analytics = element;
            }}
            data-feature-id="analytics"
            className={`feature-card feature-analytics ${visibleCards.analytics ? "is-visible" : ""} ${hoveredCard === "analytics" ? "is-hovered" : ""}`}
            style={{ "--card-delay": "0ms" } as CSSProperties}
            onMouseEnter={() => setHoveredCard("analytics")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <header className="feature-head">
              <div className="feature-icon analytics-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M8 34L18 24L26 30L40 14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18" cy="24" r="3" fill="currentColor" />
                  <circle cx="26" cy="30" r="3" fill="currentColor" />
                  <circle cx="40" cy="14" r="3" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-title">Real-Time Analytics</h3>
            </header>
            <p className="feature-description">
              Revenue and burn trends update every second so operators can react before cashflow shifts become risks.
            </p>
            <div className="feature-demo analytics-demo">
              <div className="analytics-meta">
                <strong>${revenueProjection}</strong>
                <span>projected month-end revenue</span>
              </div>
              <div className="analytics-bars" role="img" aria-label="Live analytics bar chart">
                {analyticsSeries.map((point, index) => (
                  <span
                    key={`analytics-${index}`}
                    className={index >= analyticsSeries.length - 2 ? "active" : ""}
                    style={{ height: `${point}%` }}
                  />
                ))}
              </div>
            </div>
          </article>

          <article
            ref={(element) => {
              cardRefs.current.reports = element;
            }}
            data-feature-id="reports"
            className={`feature-card feature-reports ${visibleCards.reports ? "is-visible" : ""} ${hoveredCard === "reports" ? "is-hovered" : ""}`}
            style={{ "--card-delay": "120ms" } as CSSProperties}
            onMouseEnter={() => setHoveredCard("reports")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <header className="feature-head">
              <div className="feature-icon reports-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect x="11" y="8" width="26" height="32" rx="5" stroke="currentColor" strokeWidth="2.8" />
                  <path d="M18 19H30M18 25H30M18 31H26" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="feature-title">Automated Reports</h3>
            </header>
            <p className="feature-description">Board-ready reports are generated with reconciled numbers, commentary, and highlights.</p>
            <div className="feature-demo reports-demo">
              <div className="report-progress-row">
                <span>{reportStage}</span>
                <strong>{reportProgress}%</strong>
              </div>
              <div className="report-progress-track" aria-hidden="true">
                <span style={{ width: `${reportProgress}%` }} />
              </div>
              <div className="report-lines" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>

          <article
            ref={(element) => {
              cardRefs.current.budgeting = element;
            }}
            data-feature-id="budgeting"
            className={`feature-card feature-budgeting ${visibleCards.budgeting ? "is-visible" : ""} ${hoveredCard === "budgeting" ? "is-hovered" : ""}`}
            style={{ "--card-delay": "240ms" } as CSSProperties}
            onMouseEnter={() => setHoveredCard("budgeting")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <header className="feature-head">
              <div className="feature-icon budgeting-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M8 35H40" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                  <rect x="12" y="19" width="8" height="16" rx="3" stroke="currentColor" strokeWidth="2.8" />
                  <rect x="22" y="14" width="8" height="21" rx="3" stroke="currentColor" strokeWidth="2.8" />
                  <rect x="32" y="10" width="8" height="25" rx="3" stroke="currentColor" strokeWidth="2.8" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Budgeting</h3>
            </header>
            <p className="feature-description">Drag allocation targets and watch product, marketing, and operations rebalance in real time.</p>
            <div className="feature-demo budgeting-demo">
              <label htmlFor="marketing-allocation">Marketing allocation: {marketingAllocation}%</label>
              <input
                id="marketing-allocation"
                type="range"
                min={20}
                max={55}
                value={marketingAllocation}
                onChange={(event) => setMarketingAllocation(Number(event.target.value))}
                aria-label="Adjust marketing allocation percentage"
              />
              <div className="budget-bars" role="img" aria-label="Budget allocation bars">
                <div>
                  <span>Product</span>
                  <strong>{productAllocation}%</strong>
                </div>
                <div className="budget-track">
                  <span className="product" style={{ width: `${productAllocation}%` }} />
                </div>
                <div>
                  <span>Marketing</span>
                  <strong>{marketingAllocation}%</strong>
                </div>
                <div className="budget-track">
                  <span className="marketing" style={{ width: `${marketingAllocation}%` }} />
                </div>
                <div>
                  <span>Operations</span>
                  <strong>{operationsAllocation}%</strong>
                </div>
                <div className="budget-track">
                  <span className="operations" style={{ width: `${operationsAllocation}%` }} />
                </div>
              </div>
            </div>
          </article>

          <article
            ref={(element) => {
              cardRefs.current.growth = element;
            }}
            data-feature-id="growth"
            className={`feature-card feature-growth ${visibleCards.growth ? "is-visible" : ""} ${hoveredCard === "growth" ? "is-hovered" : ""}`}
            style={{ "--card-delay": "360ms" } as CSSProperties}
            onMouseEnter={() => setHoveredCard("growth")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <header className="feature-head">
              <div className="feature-icon growth-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="2.8" />
                  <path d="M24 13V24L32 28" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="feature-title">Growth Score</h3>
            </header>
            <p className="feature-description">A single weighted score combines runway, variance control, and revenue quality signals.</p>
            <div className="feature-demo growth-demo">
              <svg viewBox="0 0 120 120" role="img" aria-label={`Growth score ${visibleGrowthScore}`}>
                <circle cx="60" cy="60" r="46" />
                <circle
                  className="growth-progress"
                  cx="60"
                  cy="60"
                  r="46"
                  style={{ strokeDasharray: growthRingLength, strokeDashoffset: growthRingOffset }}
                />
              </svg>
              <div className="growth-score">
                <strong>{visibleGrowthScore}</strong>
                <span>Growth Score</span>
              </div>
            </div>
          </article>

          <article
            ref={(element) => {
              cardRefs.current.syncing = element;
            }}
            data-feature-id="syncing"
            className={`feature-card feature-syncing ${visibleCards.syncing ? "is-visible" : ""} ${hoveredCard === "syncing" ? "is-hovered" : ""}`}
            style={{ "--card-delay": "480ms" } as CSSProperties}
            onMouseEnter={() => setHoveredCard("syncing")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <header className="feature-head">
              <div className="feature-icon syncing-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M8 24H18L24 14L30 34L36 24H40" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="24" r="3" fill="currentColor" />
                  <circle cx="24" cy="14" r="3" fill="currentColor" />
                  <circle cx="40" cy="24" r="3" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Syncing</h3>
            </header>
            <p className="feature-description">Bank data, invoices, and ops tools sync through encrypted channels with signed payload flow.</p>
            <div className="feature-demo syncing-demo" role="img" aria-label="Secure syncing data flow animation">
              <div className="sync-node">BANK</div>
              <div className="sync-link">
                <span />
              </div>
              <div className="sync-node">CORE</div>
              <div className="sync-link">
                <span />
              </div>
              <div className="sync-node">BI</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
