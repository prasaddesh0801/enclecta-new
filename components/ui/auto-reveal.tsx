"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * <AutoReveal /> — put it ONCE in app/layout.tsx.
 *
 * Gives every <section> inside <main> the same scroll-driven glide-up as <Reveal>:
 * each block's position, scale and opacity follow how far it has travelled up the
 * screen, so it settles into place as you scroll and glides back if you scroll up.
 * New sections and components you add later get it automatically.
 *
 *   Opt out:  <section data-no-reveal>         leave a section/element alone
 *   Opt in:   <div data-reveal-section>        a block that isn't a <section>
 *   Stagger:  <div data-reveal-children>       animate each child in turn
 *
 * Blocks already wrapped in <Reveal> are left to it; the rest of that section still animates.
 * Sections with a <canvas> or the 3D rings are skipped entirely.
 */

const SKIP = "[data-no-reveal], header, footer, nav, script, style, canvas";
const SECTION_OWN = ".journey, .wwd-section, .wc, canvas"; // whole section has its own motion → skip it
const OWN_MOTION = `${SECTION_OWN}, [data-reveal]`; // a block that is/contains a <Reveal> → skip just that block
const SKIP_SECTION = `[data-no-reveal], #templates, #why-enclecta, ${SECTION_OWN}`;

const DISTANCE = 90; // px each block travels while it settles (Reveal uses 110)
const STEP = 90; // "delay" per block, same meaning as Reveal's delay prop
const MAX_STEPS = 5;
const EASE = 0.12; // same lerp as Reveal

type Item = {
  el: HTMLElement;
  delay: number;
  cur: number; // eased progress 0…1 (-1 = not measured yet)
  target: number;
  ty: number; // translate currently applied (needed to find the true layout top)
  s: number; // scale currently applied
  settled: boolean;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** the real content blocks of a section: dig through single wrapper divs */
function blocksOf(section: Element): Element[] {
  let kids = Array.from(section.children);
  for (let depth = 0; depth < 3 && kids.length === 1; depth++) {
    const only = kids[0];
    if (only.matches(SKIP) || only.children.length === 0) break;
    kids = Array.from(only.children);
  }
  return kids;
}

function eligible(el: Element) {
  if (el.matches(SKIP) || el.matches(OWN_MOTION) || el.querySelector(OWN_MOTION)) return false;
  const cs = getComputedStyle(el);
  if (cs.position === "absolute" || cs.position === "fixed" || cs.position === "sticky") return false;
  if (cs.transform !== "none" || cs.opacity !== "1" || cs.display === "none") return false;
  return true;
}

export function AutoReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector("main") ?? document.body;
    const items = new Map<Element, Item>();
    let raf = 0;
    let last = 0;

    const clear = (it: Item) => {
      const s = it.el.style;
      s.transform = "";
      s.opacity = "";
      s.willChange = "";
      s.transition = ""; // hover/transition styles of the element work normally again
      it.ty = 0;
      it.s = 1;
      it.settled = true;
    };

    /* READ phase: where should each block be, based on its true layout position */
    const measure = () => {
      const vh = window.innerHeight;
      for (const it of items.values()) {
        if (!it.el.isConnected) continue;
        const r = it.el.getBoundingClientRect();
        // r.top includes our own translate + scale (about the centre); take them out
        const natural = r.top - it.ty - ((1 - it.s) * r.height) / (2 * it.s);
        const start = vh * 0.95 - it.delay * 0.25; // enters here → progress 0
        const range = vh * 0.5; // fully settled after travelling this far
        it.target = clamp01((start - natural) / range);
        if (it.cur < 0) it.cur = it.target; // first paint: right pose, no animation
      }
    };

    /* WRITE phase: ease towards the target and apply */
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const k = 1 - Math.pow(1 - EASE, dt * 60); // frame-rate independent lerp
      let moving = false;

      for (const it of items.values()) {
        if (!it.el.isConnected) continue;
        it.cur += (it.target - it.cur) * k;
        if (Math.abs(it.target - it.cur) < 0.001) it.cur = it.target;
        if (it.cur !== it.target) moving = true;

        const p = it.cur;
        if (p >= 0.999) {
          if (!it.settled) clear(it);
          continue;
        }
        const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
        it.ty = (1 - e) * DISTANCE;
        it.s = 0.94 + 0.06 * e;
        const st = it.el.style;
        st.transition = "none"; // our per-frame writes must not be smoothed twice
        st.willChange = "transform, opacity";
        st.transform = `translate3d(0, ${it.ty}px, 0) scale(${it.s})`;
        st.opacity = String(Math.min(1, e * 1.5));
        it.settled = false;
      }
      raf = moving ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      measure();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const add = (el: Element, index: number) => {
      if (items.has(el) || !eligible(el)) return;
      items.set(el, {
        el: el as HTMLElement,
        delay: Math.min(index, MAX_STEPS) * STEP,
        cur: -1,
        target: 0,
        ty: 0,
        s: 1,
        settled: true,
      });
    };

    const scan = () => {
      for (const [el] of items) if (!el.isConnected) items.delete(el);

      const sections = Array.from(root.querySelectorAll("section, [data-reveal-section]")).filter(
        (s) =>
          !s.matches(SKIP_SECTION) &&
          !s.querySelector(SECTION_OWN) &&
          !s.closest("[data-no-reveal]") &&
          !s.parentElement?.closest("section, [data-reveal-section]"),
      );
      for (const section of sections) {
        blocksOf(section).forEach((block, i) => {
          const isGrid =
            block.hasAttribute("data-reveal-children") ||
            (getComputedStyle(block).display === "grid" && block.children.length >= 2 && block.children.length <= 12);
          if (isGrid) Array.from(block.children).forEach((card, j) => add(card, j)); // cards settle one by one
          else add(block, i);
        });
      }
      kick();
    };

    scan();

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("load", kick); // images/fonts can shift layout

    // components that mount later (route changes, lazy sections)
    let scanFrame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(scan);
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scanFrame);
      mo.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("load", kick);
      for (const it of items.values()) clear(it);
      items.clear();
    };
  }, [pathname]);

  return null;
}
