"use client";

import { useEffect } from "react";

/**
 * Scroll-triggered motion for the services page. Renders nothing — it finds the existing
 * elements by class name, so no markup changes are needed. Mount it once inside .sv-page.
 *
 *  - process steps   (.sv-steps)      drop in 1 → 4
 *  - tech chips      (.sv-stack-grid) pop in one by one
 *  - stat numbers    (.sv-stat-value) count up to their final value
 *  - service cards   (.sv-grid .sv-card) tilt in 3D toward the pointer
 *
 * Each block plays when you scroll TO its section (its panel has slid up to the top of the screen),
 * and plays again the next time you come back to it.
 */
export default function ServicesMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sv-page");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    /* start from a clean slate (also clears anything left over from hot reload) */
    root.querySelectorAll(".is-in").forEach((el) => el.classList.remove("is-in"));

    /* ---------- index the things that animate in sequence ---------- */
    const steps = root.querySelector<HTMLElement>(".sv-steps");
    steps?.querySelectorAll<HTMLElement>(".sv-step").forEach((el, i) => el.style.setProperty("--i", String(i)));
    const chipGrid = root.querySelector<HTMLElement>(".sv-stack-grid");
    chipGrid?.querySelectorAll<HTMLElement>(".sv-chip").forEach((el, i) => el.style.setProperty("--i", String(i)));

    /* ---------- count-up ---------- */
    const stats = root.querySelector<HTMLElement>(".sv-stats");
    const parsed = Array.from(root.querySelectorAll<HTMLElement>(".sv-stat-value")).map((el) => {
      const final = el.dataset.final ?? el.textContent ?? "";
      el.dataset.final = final;
      const m = final.trim().match(/^(\d+(?:\.\d+)?)([\s\S]*)$/);
      return m ? { el, target: parseFloat(m[1]), suffix: m[2], decimals: (m[1].split(".")[1] ?? "").length } : null;
    });
    type Stat = NonNullable<(typeof parsed)[number]>;
    const showValue = (p: Stat, n: number) => {
      p.el.textContent = `${n.toFixed(p.decimals)}${p.suffix}`;
    };
    let rafs: number[] = [];
    const stopCount = () => {
      rafs.forEach(cancelAnimationFrame);
      rafs = [];
    };
    const resetCount = () => {
      stopCount();
      parsed.forEach((p) => p && showValue(p, 0));
    };
    const runCount = () => {
      stopCount();
      parsed.forEach((p, i) => {
        if (!p) return;
        const dur = 2200;
        const delay = i * 180;
        let t0 = 0;
        const tick = (now: number) => {
          if (!t0) t0 = now + delay;
          const t = Math.min(Math.max((now - t0) / dur, 0), 1);
          showValue(p, p.target * (1 - Math.pow(1 - t, 4))); // fast start, soft landing
          if (t < 1) rafs.push(requestAnimationFrame(tick));
        };
        rafs.push(requestAnimationFrame(tick));
      });
    };

    /* ---------- reveal only when the user has scrolled TO that section ----------
       Panels are sticky and stack on top of each other, so "is it on screen" is not enough.
       A block plays once its panel has slid all the way up to the top of the viewport, and is
       re-armed once that panel is back down below the fold (scrolled up past it). */
    type Trigger = { el: Element; panel: Element; onIn?: () => void; onReset?: () => void; on: boolean };
    const triggers: Trigger[] = [];
    const add = (el: Element | null, onIn?: () => void, onReset?: () => void) => {
      if (el) triggers.push({ el, panel: el.closest(".sv-panel") ?? el, onIn, onReset, on: false });
    };
    add(steps);
    add(chipGrid);
    add(stats, runCount, resetCount);

    if (reduce) {
      triggers.forEach((t) => t.el.classList.add("is-in"));
    } else {
      root.classList.add("sv-js");
      resetCount();
      let ticking = false;
      const check = () => {
        ticking = false;
        const vh = window.innerHeight;
        triggers.forEach((t) => {
          const top = t.panel.getBoundingClientRect().top;
          if (!t.on && top <= vh * 0.06) {
            t.on = true;
            t.el.classList.add("is-in");
            t.onIn?.();
          } else if (t.on && top >= vh * 0.9) {
            t.on = false;
            t.el.classList.remove("is-in");
            t.onReset?.();
          }
        });
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(check);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      });
      check();
    }

    /* ---------- 3D tilt on service cards (mouse only) ---------- */
    root.querySelectorAll<HTMLElement>(".sv-grid .sv-card").forEach((card) => {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      };
      const leave = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      stopCount();
      parsed.forEach((p) => p && showValue(p, p.target));
      root.querySelectorAll(".is-in").forEach((el) => el.classList.remove("is-in"));
      root.classList.remove("sv-js");
    };
  }, []);

  return null;
}
