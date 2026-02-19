"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANDING_ANIMATION } from "@/lib/landing/animations";
import { TESTIMONIAL_AUTOPLAY_MS } from "@/lib/landing/constants";

const testimonials = [
  {
    quote:
      "Finflow removed spreadsheet overhead from our close process. We saved 15.4 hours per month and catch runway variance in under a day.",
    name: "Sarah Kim",
    title: "Finance Lead",
    company: "Northbeam Labs",
    avatar: "SK",
    metricValue: 15.4,
    metricUnit: "hrs",
    metricLabel: "saved every month",
  },
  {
    quote:
      "After moving forecasting into Finflow, we cut reporting costs by 40% and standardized approvals across three subsidiaries.",
    name: "Marcus Rodriguez",
    title: "Operations Director",
    company: "Arcline Commerce",
    avatar: "MR",
    metricValue: 40,
    metricUnit: "%",
    metricLabel: "reporting cost reduction",
  },
  {
    quote:
      "The anomaly monitor paid for itself in two weeks. We flagged $82k in duplicate vendor charges before they posted to final books.",
    name: "Amina Liu",
    title: "Founder & CEO",
    company: "Studio Violet",
    avatar: "AL",
    metricValue: 82,
    metricUnit: "k",
    metricLabel: "duplicate spend prevented",
  },
  {
    quote:
      "Board reporting used to take three days. Finflow now generates decision packets in 18 minutes with a clean audit trail attached.",
    name: "David Patel",
    title: "Head of Finance",
    company: "Rivet Systems",
    avatar: "DP",
    metricValue: 18,
    metricUnit: "min",
    metricLabel: "board packet turnaround",
  },
] as const;

function AnimatedMetric({
  value,
  unit,
  active,
  reducedMotion,
}: {
  value: number;
  unit: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) {
      return;
    }

    const start = performance.now();
    const duration = LANDING_ANIMATION.counterMs;
    let frameId = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [active, reducedMotion, value]);

  const visibleValue = reducedMotion || !active ? value : displayValue;
  const decimals = value % 1 === 0 ? 0 : 1;
  return (
    <>
      {visibleValue.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {unit}
    </>
  );
}

export function Testimonials() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }

    const tick = LANDING_ANIMATION.testimonialProgressTickMs;
    const increment = 100 / (TESTIMONIAL_AUTOPLAY_MS / tick);

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + increment;
        if (next >= 100) {
          setActiveIndex((index) => (index + 1) % testimonials.length);
          return 0;
        }
        return next;
      });
    }, tick);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const previous = () => {
    goTo((activeIndex - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    goTo((activeIndex + 1) % testimonials.length);
  };

  return (
    <section className="testimonials" id="testimonials" data-reveal>
      <div className="testimonials-container">
        <div className="section-header">
          <h2 className="section-title">
            Trusted by operators who need <span className="section-title-italic">proof, not promises</span>
          </h2>
          <p className="section-subtitle">Every review highlights measurable outcomes from real finance teams running Finflow daily.</p>
        </div>

        <div
          className="testimonials-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          <div className="testimonial-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="testimonials-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((item, index) => (
              <article className="testimonial-card" key={item.name} aria-hidden={index !== activeIndex}>
                <div className="testimonial-watermark">{item.company}</div>
                <div className="testimonial-top">
                  <div className="testimonial-stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <svg viewBox="0 0 24 24" key={`${item.name}-star-${starIndex}`} aria-hidden="true">
                        <path d="M12 2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 16.3 6.4 19.2l1.1-6.2L3 8.6l6.2-.9L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="testimonial-verified">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9.2 16.7 4.7 12.2l1.5-1.5 3 3 8.6-8.6 1.5 1.5-10.1 10.1z" />
                    </svg>
                    Verified review
                  </span>
                </div>

                <p className="testimonial-content">
                  <span className="testimonial-quote-mark" aria-hidden="true">
                    “
                  </span>
                  {item.quote}
                </p>

                <div className="testimonial-metric">
                  <strong>
                    <AnimatedMetric value={item.metricValue} unit={item.metricUnit} active={index === activeIndex} reducedMotion={reducedMotion} />
                  </strong>
                  <span>{item.metricLabel}</span>
                </div>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">{item.avatar}</div>
                  <div>
                    <div className="testimonial-name">{item.name}</div>
                    <div className="testimonial-role">
                      {item.title}, {item.company}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="testimonials-nav">
            <button type="button" className="testimonial-arrow" onClick={previous} aria-label="Previous testimonial">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 4.5 8 12l7.5 7.5" />
              </svg>
            </button>

            <div className="testimonial-dots" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((item, index) => (
                <button
                  type="button"
                  key={`${item.name}-dot`}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => goTo(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-selected={index === activeIndex}
                  role="tab"
                />
              ))}
            </div>

            <button type="button" className="testimonial-arrow" onClick={next} aria-label="Next testimonial">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.5 4.5 16 12l-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
