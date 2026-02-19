"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { trackEvent } from "@/lib/analytics/tracking";

type NewsletterStatus = "idle" | "loading" | "success" | "error";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Contact", href: "/about" },
      { label: "Partners", href: "/about" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/privacy" },
      { label: "Roadmap", href: "/features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/features" },
      { label: "Guides", href: "/features" },
      { label: "API status", href: "/privacy" },
      { label: "Support", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Data retention", href: "/data-retention" },
      { label: "Compliance", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  {
    label: "X",
    href: "https://x.com",
    icon: "M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.2L6.6 21H3.5l7.3-8.4L3 3h6.2l4.3 5.7L18.9 3z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "M6.9 8.8H3.4V20h3.5V8.8zM5.1 2.9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM20.6 13.6c0-3.2-1.7-5-4.4-5-2 0-2.9 1.1-3.4 1.9v-1.7H9.3V20h3.5v-6c0-1.6.3-3.1 2.3-3.1 1.9 0 2 1.8 2 3.2V20H20.6v-6.4z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: "M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.4 1.1 3 .8.1-.7.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5A4 4 0 0 1 7 8.7a3.7 3.7 0 0 1 .1-2.7s.8-.3 2.8 1.1a9.4 9.4 0 0 1 5 0c2-1.4 2.8-1.1 2.8-1.1a3.7 3.7 0 0 1 .1 2.7 4 4 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 2.1v3.1c0 .3.2.6.7.5a10.2 10.2 0 0 0 6.8-9.6C22 6.6 17.5 2 12 2z",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const emailError = touched && email.length > 0 && !emailValid ? "Enter a valid work email address." : "";

  useEffect(() => {
    if (!showToast) {
      return;
    }
    const timer = window.setTimeout(() => setShowToast(false), 2800);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (!emailValid) {
      setStatus("idle");
      setMessage("");
      trackEvent("newsletter_submit_invalid", { location: "footer" });
      return;
    }

    setStatus("loading");
    setMessage("Submitting...");

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    if (normalizedEmail.includes("fail")) {
      setStatus("error");
      setMessage("We could not process that address right now. Please try again in a few minutes.");
      trackEvent("newsletter_submit_failed", { location: "footer" });
      return;
    }

    setStatus("success");
    setMessage("Subscribed. You will receive product updates and release notes.");
    setEmail("");
    setShowToast(true);
    trackEvent("newsletter_subscribed", { location: "footer" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer" data-reveal>
        <div className="footer-pattern" aria-hidden="true" />
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                Finflow
              </Link>
              <p className="footer-brand-copy">
                Financial operations infrastructure for teams that need speed, control, and audit-ready clarity.
              </p>
              <div className="footer-socials">
                {socialLinks.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-columns">
              {footerColumns.map((column) => (
                <div key={column.title} className="footer-column">
                  <h4>{column.title}</h4>
                  {column.links.map((link) => (
                    <Link key={`${column.title}-${link.label}`} href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={`footer-newsletter ${status === "loading" ? "is-loading" : ""}`}>
            <div>
              <h4>Stay in the loop</h4>
              <p>Get monthly finance playbooks, release notes, and implementation tips.</p>
            </div>
            {status === "loading" && (
              <div className="footer-loading-skeleton" aria-hidden="true">
                <span />
                <span />
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className={`form-field ${email.length > 0 ? "filled" : ""}`}>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder=" "
                  aria-label="Email address"
                  aria-invalid={Boolean(emailError)}
                  disabled={status === "loading"}
                />
                <label htmlFor="newsletter-email">Work email</label>
              </div>
              <button
                type="submit"
                className={`btn btn-primary ${status === "loading" ? "is-loading" : ""}`}
                disabled={status === "loading" || !emailValid}
                aria-busy={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Subscribe"}
              </button>
            </form>
            {emailError && <p className="footer-form-message error">{emailError}</p>}
            {status !== "idle" && <p className={`footer-form-message ${status}`}>{message}</p>}
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© {currentYear} Finflow. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/terms" className="footer-link">
                Terms
              </Link>
              <Link href="/privacy" className="footer-link">
                Privacy
              </Link>
              <Link href="/data-retention" className="footer-link">
                Data retention
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <div className={`site-toast ${showToast ? "show" : ""}`} role="status" aria-live="polite">
        Newsletter subscription successful
      </div>
    </>
  );
}
