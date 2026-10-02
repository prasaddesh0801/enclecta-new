"use client";

import { useEffect, useRef } from "react";

/**
 * Hero title — "OUR SERVICES" falls like the coins in the reference video:
 * every letter drops from above the screen with real gravity, hits the baseline, bounces a few times
 * (each bounce lower than the last), tilts and wobbles as it lands, then settles into place as the title.
 *
 * It is a small physics loop (no library). Each letter is its own <text> with a fixed slot, so together
 * they span the full 1000-unit width edge to edge. To nudge a letter, change its x / width below.
 *
 * Tuning (top of the file):  GRAVITY — lower = slower fall.  BOUNCE — 0.2 small hops … 0.6 very bouncy.
 */

const GRAVITY = 620;   // units / s²  (SVG units; the title is 1000 wide)
const BOUNCE = 0.38;   // share of speed kept after each hit
const BASE_Y = 112;    // baseline of the letters
const MID_Y = 60;      // rotation pivot (middle of the letter height)

/* letter, x, slot width */
const LETTERS: [string, number, number][] = [
  ["O", -4, 102], ["U", 98, 101], ["R", 199, 83],
  ["S", 327, 97], ["E", 424, 84], ["R", 508, 86], ["V", 594, 100], ["I", 694, 37], ["C", 731, 100], ["E", 831, 80], ["S", 911, 89],
];

type Sim = {
  el: SVGTextElement; cx: number; delay: number;
  x: number; vx: number; y: number; vy: number; r: number; vr: number;
  hit: boolean; done: boolean;
};

export default function ServicesTitle() {
  const refs = useRef<(SVGTextElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter((e): e is SVGTextElement => !!e);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => (e.style.opacity = "1"));
      return;
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const sign = () => (Math.random() < 0.5 ? -1 : 1);

    const sims: Sim[] = els.map((el, i) => ({
      el,
      cx: LETTERS[i][1] + LETTERS[i][2] / 2,
      delay: 0.2 + i * 0.1 + rand(0, 0.1),   // letters let go one after another
      x: sign() * rand(10, 50), vx: 0,       // start a little off to the side
      y: -rand(560, 760), vy: 0,             // start above the top of the screen
      r: sign() * rand(8, 25), vr: sign() * rand(10, 30), // tumbling a little while falling
      hit: false, done: false,
    }));

    const apply = (s: Sim) =>
      s.el.setAttribute("transform", `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${s.r.toFixed(2)} ${s.cx} ${MID_Y})`);

    sims.forEach((s) => {
      apply(s);
      s.el.style.opacity = "1";
    });

    let last = performance.now();
    let t = 0;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      t += dt;
      let alive = false;

      for (const s of sims) {
        if (s.done) continue;
        alive = true;
        if (t < s.delay) continue;

        /* gravity + floor */
        s.vy += GRAVITY * dt;
        s.y += s.vy * dt;
        if (s.y >= 0) {
          s.y = 0;
          if (s.vy > 40) {
            s.vy = -s.vy * BOUNCE;
            if (!s.hit) {
              s.hit = true;           // first landing: flatten the tilt, kick sideways a little
              s.r *= 0.4;
              s.vr = sign() * rand(25, 55);
              s.vx = sign() * rand(6, 16);
            }
          } else {
            s.vy = 0;
          }
        }

        /* tilt: free tumble until the first hit, then a springy wobble back to upright */
        if (!s.hit) {
          s.r += s.vr * dt;
        } else {
          s.vr += (-48 * s.r - 9 * s.vr) * dt;
          s.r += s.vr * dt;
        }

        /* sideways: gentle spring back into its slot */
        s.vx += (-14 * s.x - 5 * s.vx) * dt;
        s.x += s.vx * dt;

        if (s.hit && s.y === 0 && s.vy === 0 && Math.abs(s.r) < 0.05 && Math.abs(s.vr) < 0.5 && Math.abs(s.x) < 0.05 && Math.abs(s.vx) < 0.5) {
          s.el.removeAttribute("transform"); // exactly in place
          s.done = true;
        } else {
          apply(s);
        }
      }

      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      els.forEach((e) => e.removeAttribute("transform"));
    };
  }, []);

  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Our services">
        {LETTERS.map(([ch, x, w], i) => (
          <text
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="sv-drop"
            x={x}
            y={BASE_Y}
            textLength={w}
            lengthAdjust="spacingAndGlyphs"
            aria-hidden="true"
          >
            {ch}
          </text>
        ))}
      </svg>
    </h1>
  );
}
