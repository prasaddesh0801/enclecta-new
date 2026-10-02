"use client";

import { useEffect, useRef } from "react";

/**
 * Slide-up stack (like the Sandhill Studio reference).
 * Every direct child of <Stack> with class "sv-panel" is pinned (position: sticky)
 * and the next panel slides up over it.
 *
 * - Panels taller than the viewport scroll fully first, then get covered:
 *   we set `top` to (viewport height - panel height) when the panel is taller.
 * - While the next panel covers a pinned one, the pinned one recedes slightly
 *   (scale + dim) via the --sv-cover CSS variable (0 → 1).
 */
export default function Stack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>(":scope > .sv-panel"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const measure = () => {
      const vh = window.innerHeight;
      panels.forEach((p) => {
        const h = p.offsetHeight;
        p.style.top = h > vh ? `${vh - h}px` : "0px";
      });
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      panels.forEach((p, i) => {
        const next = panels[i + 1];
        if (!next || reduce) {
          p.style.setProperty("--sv-cover", "0");
          return;
        }
        const top = next.getBoundingClientRect().top;
        // 0 when the next panel is below the fold, 1 when it fully covers this one
        const cover = Math.min(1, Math.max(0, 1 - top / vh));
        p.style.setProperty("--sv-cover", cover.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    const ro = new ResizeObserver(onResize);
    panels.forEach((p) => ro.observe(p));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="sv-stack">
      {children}
    </div>
  );
}
