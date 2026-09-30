"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Scroll-driven 3D "assemble" entrance.
 *
 * Mark parts of a section with  data-asm="<preset>"  (and optionally data-asm-order="0…n").
 * While the section scrolls into view every part flies in from its own depth — sliding,
 * tilting and scaling from behind/below — staggered by its order, and settles into its
 * real position. Scrubbed by scroll and reversible, like <Reveal>.
 *
 * It only writes the individual CSS properties  translate / rotate / scale / opacity,
 * which stack on top of an element's own `transform`, so existing transforms and
 * animations (the pin, badges, dial tilt) are never overwritten.
 * For elements inside a preserve-3d parent, opacity would flatten the 3D, so those can
 * opt in to  data-asm-opacity="var"  and the stylesheet multiplies  var(--asm-o)  itself.
 */

type Pose = {
  x: number; // px
  y: number; // px
  z: number; // px (negative = further away)
  rx: number; // deg, tilt around the horizontal axis
  ry: number; // deg, turn around the vertical axis
  s: number; // scale at the start
  o: number; // opacity at the start
};

const P = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1, o: 0, ...p });

/* start poses: what each kind of part looks like before it has arrived */
const PRESETS: Record<string, Pose> = {
  rise: P({ y: 90, z: -240, rx: -38, s: 0.92 }), // tilts up out of the floor
  lift: P({ y: 70, z: -320, rx: -26, s: 0.9 }),
  pop: P({ y: 60, z: -420, rx: -50, s: 0.55 }), // badges / nodes: small and far, then pop forward
  sweep: P({ x: -520, z: -520, ry: 58, s: 0.86, o: 1 }), // a big wheel rolling in from the left
  glow: P({ s: 1.18, o: 0 }),
  fade: P({ y: 36 }),
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); // small overshoot = "snaps into place"
};

type Part = {
  el: HTMLElement;
  pose: Pose;
  order: number;
  useVar: boolean;
  bouncy: boolean;
  lastKey: string;
};

export function useAssemble(
  sectionRef: RefObject<HTMLElement | null>,
  opts: { stagger?: number; span?: number; rescan?: unknown } = {},
) {
  const { stagger = 0.06, span = 0.62, rescan } = opts;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parts: Part[] = Array.from(section.querySelectorAll<HTMLElement>("[data-asm]")).map((el) => ({
      el,
      pose: PRESETS[el.dataset.asm ?? "rise"] ?? PRESETS.rise,
      order: parseFloat(el.dataset.asmOrder ?? "0") || 0,
      useVar: el.dataset.asmOpacity === "var",
      bouncy: el.dataset.asm === "pop",
      lastKey: "",
    }));
    if (!parts.length) return;

    const maxOrder = Math.max(0, ...parts.map((p) => p.order));
    let cur = -1;
    let target = 0;
    let raf = 0;
    let last = 0;

    const measure = () => {
      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top; // section itself is never transformed
      target = clamp01((vh * 0.9 - top) / (vh * 0.85));
      if (cur < 0) cur = target;
    };

    const write = (p: number) => {
      for (const part of parts) {
        // each part owns a slice of the progress, later orders start a little later
        const start = maxOrder ? (part.order / maxOrder) * (1 - span) : 0;
        const t = clamp01((p - start) / span);
        const a = part.pose;
        const e = part.bouncy ? easeBack(t) : easeOut(t);
        const o = clamp01(a.o + (1 - a.o) * easeOut(Math.min(1, t * 1.6)));
        const k = t.toFixed(3);
        if (k === part.lastKey) continue;
        part.lastKey = k;

        const s = part.el.style;
        if (t >= 0.999) {
          s.translate = "";
          s.rotate = "";
          s.scale = "";
          s.opacity = "";
          s.willChange = "";
          s.removeProperty("--asm-o");
          continue;
        }
        const f = 1 - e;
        s.willChange = "translate, rotate, scale, opacity";
        s.translate = `${(a.x * f).toFixed(1)}px ${(a.y * f).toFixed(1)}px ${(a.z * f).toFixed(1)}px`;
        // one axis-angle rotation carrying both tilt (x) and turn (y)
        const ang = Math.hypot(a.rx, a.ry) * f;
        s.rotate = ang < 0.01 ? "" : `${a.rx} ${a.ry} 0 ${ang.toFixed(2)}deg`;
        s.scale = String(a.s + (1 - a.s) * e);
        if (a.o < 1) {
          if (part.useVar) s.setProperty("--asm-o", o.toFixed(3));
          else s.opacity = o.toFixed(3);
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      cur += (target - cur) * (1 - Math.pow(1 - stagger * 2, dt * 60)); // weighted, like <Reveal>
      if (Math.abs(target - cur) < 0.0005) cur = target;
      write(cur);
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      measure();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    measure();
    cur = target;
    write(cur);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      for (const part of parts) {
        const s = part.el.style;
        s.translate = s.rotate = s.scale = s.opacity = s.willChange = "";
        s.removeProperty("--asm-o");
      }
    };
  }, [sectionRef, stagger, span, rescan]); // rescan: re-collect parts that render later
}
