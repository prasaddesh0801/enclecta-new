"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Section from "@/components/layout/section";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import { Heading, Subtitle } from "@/components/ui/typography";
import { useAssemble } from "@/lib/use-assemble"; // ← adjust if use-assemble.ts lives elsewhere
import { cn } from "@/lib/utils";
import { PROJECTS, Mock } from "./portfolio-cards";

const N = PROJECTS.length;
const AUTOPLAY_MS = 5000; // time each card stays in the centre

/** -2…2: where a card sits relative to the centre (wraps around the ring) */
function offsetOf(i: number, active: number) {
  const half = Math.floor(N / 2);
  return ((i - active + N + half) % N) - half;
}

/*  x  = sideways shift in card-widths     z  = depth in px
    r  = turn towards the centre in deg    sc = size
    Centre card is large; side cards are small and turned hard. */
const DESKTOP = [
  { x: 0, z: 70, r: 0, sc: 1.55 },
  { x: 1.0, z: -170, r: 46, sc: 0.86 },
  { x: 1.6, z: -360, r: 60, sc: 0.68 },
];
const COMPACT = [
  { x: 0, z: 40, r: 0, sc: 1.15 },
  { x: 0.86, z: -130, r: 46, sc: 0.78 },
  { x: 1.35, z: -280, r: 60, sc: 0.62 },
];

const arrowBtn =
  "grid h-11 w-11 place-items-center rounded-full border border-[color:var(--border)] bg-surface/75 text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-brand-orange hover:text-brand-orange";

function Chevron({ dir }: { dir: "l" | "r" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function Portfolio() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number } | null>(null);
  const moved = useRef(false);

  // `prev` lets us spot the one card that wraps from one far edge to the other (it fades in instead of flying across)
  const [pos, setPos] = useState({ active: 0, prev: 0 });
  const active = pos.active;
  const goTo = useCallback((i: number) => setPos((p) => ({ active: i, prev: p.active })), []);
  const [compact, setCompact] = useState(false);
  const [paused, setPaused] = useState(false); // keyboard focus in the stage
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // smooth fly-in of the cards as the stage scrolls into view (same feel as the other sections)
  useAssemble(stageRef);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.99rem)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const step = useCallback((d: number) => setPos((p) => ({ active: (p.active + d + N) % N, prev: p.active })), []);

  /* ---------- auto-advance ----------
     Moves to the next card every AUTOPLAY_MS. Pauses while the stage has keyboard
     focus, when it is off-screen, when the tab is hidden,
     and never runs if the visitor prefers reduced motion. Any manual change (click,
     swipe, arrows, dots) changes `active`, which restarts the timer. */
  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || reduceMotion) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, inView, reduceMotion, step]);

  const current = PROJECTS[active];
  const poses = compact ? COMPACT : DESKTOP;

  return (
    <Section id="portfolio" space="none" width="bleed" noReveal className="relative overflow-x-clip pt-[calc(var(--section-space)*0.8)] pb-[calc(var(--section-space)*0.7)] md:pt-[calc(var(--section-space)*0.9)] md:pb-[calc(var(--section-space)*0.8)]">
      {/* LIGHT backdrop: light blue. Bottom fades into the page background so the next section joins cleanly. */}
<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 [[data-theme=dark]_&]:hidden [.dark_&]:hidden" style={{
  background:
    "radial-gradient(55% 42% at 50% 40%, rgba(199,229,255,0.75), transparent 72%)," +
    "radial-gradient(35% 30% at 85% 15%, rgba(255,255,255,0.65), transparent 70%)," +
    "linear-gradient(180deg, transparent 88%, var(--background) 100%)," +
    "linear-gradient(135deg, #DCEEFF 0%, #F4F9FF 50%, #CFE7FF 100%)",
}} />

{/* DARK backdrop: dark blue with a blue glow behind the cards. Bottom fades into the dark page background. */}
<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 hidden [[data-theme=dark]_&]:block [.dark_&]:block" style={{
  background:
    "radial-gradient(55% 42% at 50% 45%, rgba(23,62,158,0.55), transparent 72%)," +
    "radial-gradient(30% 25% at 15% 20%, rgba(72,217,232,0.10), transparent 70%)," +
    "linear-gradient(180deg, transparent 88%, var(--background) 100%)," +
    "linear-gradient(135deg, #071A35 0%, #0B2347 55%, #071A35 100%)",
}} />

      <div className="relative mx-auto w-full max-w-[90rem] px-[var(--container-gutter)]">
        {/* ---------- heading ---------- */}
        <Reveal className="mx-auto mb-4 max-w-[44rem] text-center md:mb-6">
          <p className="subtitle-font mb-3 text-[length:var(--text-label)] tracking-[0.32em] text-foreground-muted">OUR WORK</p>
          <Heading level={1}>Ideas we&rsquo;ve brought to life</Heading>
          <span className="mx-auto mt-5 block h-[2px] w-14 rounded-full" style={{ background: "var(--portfolio-accent)" }} />
          <Subtitle className="mx-auto mt-5 max-w-[32rem]">Websites we designed and built, from first sketch to launch.</Subtitle>
        </Reveal>

        {/* ---------- 3D stage ---------- */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Our work. Use the left and right arrow keys to browse."
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
          }}
          onPointerDown={(e) => {
            drag.current = { x: e.clientX };
            moved.current = false;
          }}
          onPointerMove={(e) => {
            if (drag.current && Math.abs(e.clientX - drag.current.x) > 10) moved.current = true;
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => (drag.current = null)}
          onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
          onBlur={() => setPaused(false)}
          className="pf-stage relative select-none outline-none"
        >
          {/* floor */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[6%] bottom-[3%] h-[16%] rounded-[50%] blur-2xl" style={{ background: "radial-gradient(closest-side, var(--portfolio-floor), transparent)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] bottom-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, var(--portfolio-accent), transparent)", opacity: 0.35 }} />

          {PROJECTS.map((p, i) => {
            const o = offsetOf(i, active);
            const a = Math.abs(o);
            const s = Math.sign(o);
            const pose = poses[Math.min(a, 2)];
            const isActive = o === 0;
            const hidden = a > 2;
            // the card that wraps round from one far edge to the other fades in instead of flying across the stage
            const wrapped = Math.abs(o - offsetOf(i, pos.prev)) > Math.floor(N / 2);

            const style = {
              "--x": s * pose.x,
              "--z": pose.z,
              "--r": -s * pose.r,
              "--big": poses[0].sc, // every card is laid out at the centre card's real width…
              "--sc": pose.sc / poses[0].sc, // …and the others are scaled DOWN from it (smooth + sharp)
              zIndex: 10 - a,
              visibility: hidden ? "hidden" : "visible",
            } as CSSProperties;

            return (
              <div
                key={p.id}
                data-asm="rise"
                data-asm-order={Math.abs(offsetOf(i, 0))}
                data-active={isActive ? "" : undefined}
                data-side={isActive ? undefined : ""}
                data-wrap={wrapped ? "" : undefined}
                className="pf-card"
                style={style}
              >
                <div className="pf-face flex h-full flex-col p-[4.4cqw]">
                  <div className="flex items-center gap-[2cqw] text-[length:3.4cqw] text-foreground-muted">
                    <span className="heading-font">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px w-[5cqw] bg-current opacity-50" />
                  </div>

                  <div className="mt-[2.6cqw] min-h-0 flex-1 overflow-hidden rounded-[2.4cqw] border border-[color:var(--portfolio-card-border)]">
                    <Mock p={p} />
                  </div>

                  <div className="flex shrink-0 items-end justify-between gap-[3cqw] pt-[3cqw]">
                    <div className="min-w-0">
                      <h3 className="heading-font truncate text-[length:5.6cqw] font-semibold leading-tight">{p.title}</h3>
                      <p className="body-font mt-[1.2cqw] truncate text-[length:3.1cqw] text-foreground-muted">{p.tags.join(" / ")}</p>
                    </div>
                    <Link
                      href={p.href}
                      aria-label={`Open ${p.title}`}
                      tabIndex={isActive ? 0 : -1}
                      aria-hidden={isActive ? undefined : true}
                      className={cn(
                        "relative z-20 grid h-[8.5cqw] w-[8.5cqw] shrink-0 place-items-center rounded-full transition-[opacity,transform] duration-700 hover:translate-x-[0.6cqw]",
                        isActive ? "opacity-100" : "pointer-events-none opacity-0",
                      )}
                      style={{ color: "var(--portfolio-accent)" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden="true">
                        <path d="M4 12h16M14 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* depth shading on the cards further from the centre */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-1000" style={{ background: "var(--portfolio-dim)", opacity: a * 0.16 }} />

                {!isActive && (
                  <button
                    type="button"
                    aria-label={`Show ${p.title}`}
                    onClick={() => {
                      if (!moved.current) goTo(i);
                    }}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ---------- controls ---------- */}
        <div className="mt-3 flex flex-col items-center gap-5 text-center md:mt-5">
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Previous project" onClick={() => step(-1)} className={arrowBtn}>
              <Chevron dir="l" />
            </button>
            <div className="flex items-center gap-1.5" role="group" aria-label="Choose a project">
              {PROJECTS.map((p, i) => (
                <button key={p.id} type="button" aria-label={`Show ${p.title}`} aria-current={i === active} onClick={() => goTo(i)} className="grid h-6 w-6 place-items-center">
                  <span className={cn("block h-2 rounded-full transition-all duration-300", i === active ? "w-6" : "w-2 bg-foreground/25")} style={i === active ? { background: "var(--portfolio-accent)" } : undefined} />
                </button>
              ))}
            </div>
            <button type="button" aria-label="Next project" onClick={() => step(1)} className={arrowBtn}>
              <Chevron dir="r" />
            </button>
          </div>

          <p aria-live="polite" className="sr-only">
            {current.title}
          </p>

          <Button href="/work" size="lg" variant="hero-outline">
            View all work
          </Button>
        </div>
      </div>
    </Section>
  );
}
