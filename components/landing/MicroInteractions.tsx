"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function MicroInteractions() {
  const reducedMotion = useReducedMotion();
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [cursorHover, setCursorHover] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.17, rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) {
        return;
      }
      const href = link.getAttribute("href") || "";
      const isLocalNavigation = href.startsWith("/") && !href.startsWith("//");
      if (isLocalNavigation) {
        setPageLoading(true);
      }
    };

    const clearLoading = () => setPageLoading(false);
    window.addEventListener("click", onClick);
    window.addEventListener("pageshow", clearLoading);
    window.addEventListener("popstate", clearLoading);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", clearLoading);
      window.removeEventListener("popstate", clearLoading);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setCursorVisible(true);
      setCursorX(event.clientX);
      setCursorY(event.clientY);
      const hoverTarget = event.target as HTMLElement | null;
      if (!hoverTarget) {
        setCursorHover(false);
        return;
      }
      const interactive = hoverTarget.closest("a,button,input,textarea,[role='button']");
      setCursorHover(Boolean(interactive));
    };

    const onLeave = () => setCursorVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <>
      <div className={`site-loader ${pageLoading ? "show" : ""}`} aria-hidden="true" />
      {!reducedMotion && (
        <>
          <div
            className={`site-cursor ${cursorVisible ? "show" : ""} ${cursorHover ? "hover" : ""}`}
            style={{ transform: `translate3d(${cursorX}px, ${cursorY}px, 0)` }}
            aria-hidden="true"
          />
          <div
            className={`site-cursor-trail ${cursorVisible ? "show" : ""}`}
            style={{ transform: `translate3d(${cursorX}px, ${cursorY}px, 0)` }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
