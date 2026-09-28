"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Fires `inView` true once the element crosses into the viewport, then
 * disconnects — a one-shot reveal trigger, not a scroll-position tracker.
 * Falls back to already-in-view when IntersectionObserver isn't available
 * (very old browsers / some test environments) so content is never stuck
 * hidden.
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
