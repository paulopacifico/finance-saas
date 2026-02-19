"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
      <div style={{ maxWidth: "34rem" }}>
        <p style={{ color: "#fda4af", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem", marginBottom: "0.8rem" }}>
          Something went wrong
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.9rem" }}>Unexpected application error</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "1.2rem" }}>
          Try again, or return to the homepage if the issue persists.
        </p>
        <div style={{ display: "inline-flex", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "0.7rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(74,222,128,0.35)", background: "rgba(74,222,128,0.12)", cursor: "pointer", color: "inherit" }}
          >
            Retry
          </button>
          <Link href="/" style={{ display: "inline-block", padding: "0.7rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.15)" }}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
