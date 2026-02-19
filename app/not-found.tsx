import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
      <div style={{ maxWidth: "32rem" }}>
        <p style={{ color: "#86efac", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem", marginBottom: "0.8rem" }}>
          404
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.9rem" }}>Page not found</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "1.2rem" }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" style={{ display: "inline-block", padding: "0.7rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(74,222,128,0.35)", background: "rgba(74,222,128,0.12)" }}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
