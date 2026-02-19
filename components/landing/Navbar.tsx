"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracking";
import { LANDING_SCROLL_THRESHOLDS } from "@/lib/landing/constants";

import { cn } from "@/lib/utils";

const LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "features", label: "Features", href: "#features" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
  { id: "testimonials", label: "Reviews", href: "#testimonials" },
];

export function Navbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const onNavClick = (id: string, href: string) => {
    setActive(id);
    setMenuOpen(false);

    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        const navOffset = 82;
        const targetTop = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const sections = LINKS.map((item) => ({
      id: item.id,
      element: item.href === "#" ? null : (document.querySelector(item.href) as HTMLElement | null),
    }));
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = pageHeight > 0 ? (currentY / pageHeight) * 100 : 0;

      setScrolled(currentY > LANDING_SCROLL_THRESHOLDS.navScrolled);
      setShowScrollTop(currentY > LANDING_SCROLL_THRESHOLDS.showScrollTop);
      setScrollProgress(Math.min(100, Math.max(0, ratio)));

      const offset = currentY + 150;
      let nextActive = "home";
      sections.forEach((section) => {
        if (!section.element) {
          return;
        }
        if (offset >= section.element.offsetTop) {
          nextActive = section.id;
        }
      });
      setActive(nextActive);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <nav className={cn("nav", scrolled && "scrolled")} aria-label="Primary">
      <div className="nav-progress" aria-hidden="true">
        <span style={{ width: `${scrollProgress}%` }} />
      </div>
      <div className="nav-container">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          Finflow
        </Link>

        <div className="nav-center">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={cn("nav-link", active === link.id && "active")}
              onClick={(event) => {
                event.preventDefault();
                onNavClick(link.id, link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <Link
            href="/login"
            className="btn btn-ghost"
            onClick={() => trackEvent("cta_click", { location: "nav", action: "login" })}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="btn btn-primary nav-signup-btn"
            onClick={() => trackEvent("cta_click", { location: "nav", action: "signup" })}
          >
            Sign Up Free
          </Link>
        </div>

        <button
          type="button"
          className={cn("nav-menu-btn", menuOpen && "open")}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>

    <div className={cn("mobile-menu-overlay", menuOpen && "open")} onClick={() => setMenuOpen(false)} />
    <aside className={cn("mobile-menu-panel", menuOpen && "open")} aria-hidden={!menuOpen} role="dialog" aria-label="Mobile navigation">
      <div className="mobile-menu-head">
        <span>Menu</span>
        <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close mobile menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="mobile-menu-links">
        {LINKS.map((link) => (
          <a
            key={`mobile-${link.id}`}
            href={link.href}
            className={cn("mobile-menu-link", active === link.id && "active")}
            onClick={(event) => {
              event.preventDefault();
              onNavClick(link.id, link.href);
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="mobile-menu-actions">
        <Link
          href="/login"
          className="btn btn-secondary"
          onClick={() => {
            setMenuOpen(false);
            trackEvent("cta_click", { location: "mobile_menu", action: "login" });
          }}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="btn btn-primary"
          onClick={() => {
            setMenuOpen(false);
            trackEvent("cta_click", { location: "mobile_menu", action: "signup" });
          }}
        >
          Sign Up Free
        </Link>
      </div>
    </aside>

    <button
      type="button"
      className={cn("scroll-top-btn", showScrollTop && "show")}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        trackEvent("interaction", { action: "scroll_to_top" });
      }}
      aria-label="Scroll back to top"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
    </>
  );
}
