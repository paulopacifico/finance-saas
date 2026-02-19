"use client";

type TrackPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: TrackPayload }) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: string, payload: TrackPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  if (typeof window.gtag === "function") {
    window.gtag("event", event, cleanPayload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...cleanPayload });
  }

  if (typeof window.plausible === "function") {
    window.plausible(event, { props: cleanPayload });
  }

  window.dispatchEvent(new CustomEvent("finflow:track", { detail: { event, payload: cleanPayload } }));
}
