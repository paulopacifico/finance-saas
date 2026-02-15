"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

const LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "features", label: "Features", href: "#features" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
  { id: "testimonials", label: "Contact", href: "#testimonials" },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  const onNavClick = (id: string, href: string) => {
    setActive(id);
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="nav">
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
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
