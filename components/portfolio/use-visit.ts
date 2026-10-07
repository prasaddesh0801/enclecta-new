"use client";

import { useEffect, useRef, useState } from "react";

/**
 * `on` is true while the element is on screen and false when it leaves, so any animation tied to it
 * plays again every time the visitor scrolls back to the section.
 */
export function useVisit<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      threshold,
      rootMargin: "0px 0px -8% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, on] as const;
}
