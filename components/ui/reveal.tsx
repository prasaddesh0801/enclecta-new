"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven reveal. Instead of playing a one-off fade when an element
 * appears, the element's position, scale and opacity are tied to how far it
 * has travelled up the screen — so it visibly glides up and *settles* into
 * place as you scroll, and glides back down if you scroll up again. A small
 * lerp (easing towards the target) adds the smooth, weighted feel.
 *
 * Same props as before, so existing <Reveal delay={...}> usages keep working.
 * (Only change from your version: data-reveal on the outer div, so <AutoReveal />
 * knows this section already has a hand-placed Reveal and leaves it alone.)
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  distance = 110,
}: {
  children: React.ReactNode;
  className?: string;
  /** stagger in ms — later items start settling slightly later */
  delay?: number;
  /** how far (px) the element travels up while it settles */
  distance?: number;
}) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const apply = (p: number) => {
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      if (p >= 0.999) {
        inner.style.transform = "none";
        inner.style.opacity = "1";
        return;
      }
      inner.style.transform = `translate3d(0, ${(1 - e) * distance}px, 0) scale(${0.94 + 0.06 * e})`;
      inner.style.opacity = String(Math.min(1, e * 1.5));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    let current = -1; // -1 = not measured yet → jump straight to the first target
    let target = 0;
    let raf = 0;

    const measure = () => {
      // `outer` is never transformed, so its position is the true layout position
      const top = outer.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * 0.95 - delay * 0.25; // element top enters here → progress 0
      const range = vh * 0.5; // …and is fully settled after travelling this far
      target = Math.min(1, Math.max(0, (start - top) / range));
    };

    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.001) current = target;
      apply(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    current = target; // no animation on first paint, just the right starting pose
    apply(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [delay, distance]);

  return (
    <div ref={outerRef} data-reveal>
      <div
        ref={innerRef}
        // hidden until the effect places it, so there is no flash of content
        style={{ opacity: 0 }}
        className={cn("will-change-[transform,opacity]", className)}
      >
        {children}
      </div>
    </div>
  );
}
