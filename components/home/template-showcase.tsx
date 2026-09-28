"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Section from "@/components/layout/section";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import { Heading, Subtitle, Small } from "@/components/ui/typography";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { TEMPLATES, drawTemplate, ensureFonts } from "./template-showcase-cards";
import { createShowcaseScene, type ShowcaseHandle } from "./template-showcase-scene";

/* ---------- small icons ---------- */

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const CHEVRON_L = "M15 5l-7 7 7 7";
const CHEVRON_R = "M9 5l7 7-7 7";
const CLOSE = "M6 6l12 12M18 6L6 18";
const EXPAND = "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5";

const arrowBtn =
  "absolute top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--border)] bg-surface/75 text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-40 sm:h-12 sm:w-12";

const pill =
  "button-font inline-flex h-10 items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] bg-surface px-4 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-40";

export default function TemplateShowcase() {
  const { theme } = useTheme();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<ShowcaseHandle | null>(null);
  const startRef = useRef<() => void>(() => {});
  const pendingRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [steering, setSteering] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [coarse, setCoarse] = useState(false); // touch-first device → touch wording
  const [thumbs, setThumbs] = useState<string[]>([]);

  /* Build the scene only when the section is near the viewport, and pause it
     whenever it is off-screen, so it never competes with the hero animation. */
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);

    let cancelled = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      createShowcaseScene({
        canvas,
        stage,
        onActive: setActive,
        onZoom: setZoomed,
        onSteer: setSteering,
        onReady: () => setReady(true),
      })
        .then((h) => {
          if (cancelled) {
            h.destroy();
            return;
          }
          handleRef.current = h;
          h.setVisible(visibleRef.current);
          if (pendingRef.current !== null) {
            h.open(pendingRef.current);
            pendingRef.current = null;
          }
        })
        .catch(() => {
          if (!cancelled) setFailed(true); // WebGL unavailable
        });
    };
    startRef.current = start;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        handleRef.current?.setVisible(entry.isIntersecting);
        if (entry.isIntersecting) start();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      handleRef.current?.destroy();
      handleRef.current = null;
      startRef.current = () => {};
      setReady(false);
    };
  }, []);

  // light ⇄ dark: the scene keeps running, only fog + floor shadow are re-tinted
  useEffect(() => {
    handleRef.current?.refreshTheme();
  }, [theme]);

  // no WebGL → still show every template, as a plain image grid
  useEffect(() => {
    if (!failed) return;
    let dead = false;
    ensureFonts().then((fonts) => {
      if (dead) return;
      setThumbs(
        TEMPLATES.map((t) => {
          const c = document.createElement("canvas");
          drawTemplate(c, t, fonts);
          return c.toDataURL("image/jpeg", 0.82);
        }),
      );
    });
    return () => {
      dead = true;
    };
  }, [failed]);

  const showTemplate = useCallback((i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (handleRef.current) handleRef.current.open(i);
    else {
      pendingRef.current = i; // scene not built yet — open as soon as it is
      startRef.current();
    }
  }, []);

  const current = TEMPLATES[active] ?? TEMPLATES[0];

  const hint = zoomed
    ? coarse
      ? "Swipe for the next site · tap outside the card to close"
      : "Use ← → to browse · click outside the card or press Esc to close"
    : steering
      ? "Steering: move the mouse left or right · click to stop"
      : coarse
        ? "Swipe to spin · tap a site to open it"
        : "Click once, then move the mouse to spin · click a site to open it";

  return (
    <Section id="templates" space="none" className="pt-10 pb-[var(--section-space)] md:pt-14">
      {/* ---------- heading ---------- */}
      <Reveal className="mx-auto mb-10 max-w-[44rem] text-center md:mb-14">
        <Heading level={2}>One studio, a different website for every business</Heading>
        <Subtitle className="mx-auto mt-4 max-w-[34rem]">
          Spin the ring to see how we can design a site that fits yours.
        </Subtitle>
      </Reveal>

      {failed ? (
        <Reveal delay={100}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t, i) => (
              <li key={t.id}>
                <div className="aspect-[8/5] overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] bg-surface-raised">
                  {thumbs[i] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbs[i]} alt={`${t.name} — ${t.type} website example`} className="h-full w-full object-cover" />
                  )}
                </div>
                <p className="heading-font mt-3 font-semibold">{t.name}</p>
                <Small>{t.type}</Small>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : (
        <>
          {/* ---------- 3D ring ---------- */}
          <Reveal delay={100}>
            <div
              ref={stageRef}
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label="Website templates in a 3D ring. Use the left and right arrow keys to rotate and Enter to open one full screen."
              className="relative w-full select-none overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)]"
              style={{
                // shorter on phones so the ring is not lost in a tall empty box
                height: "min(80svh, clamp(21rem, calc(52vw + 9rem), 42rem))",
                background:
                  "radial-gradient(70% 60% at 50% 100%, var(--showcase-glow, rgba(1,197,255,.2)), transparent 72%)," +
                  "radial-gradient(45% 50% at 12% 8%, var(--showcase-glow-warm, rgba(255,98,0,.12)), transparent 70%)," +
                  "linear-gradient(180deg, var(--showcase-stage-top, #eceeff), var(--showcase-stage-bottom, #fff1e6))",
              }}
            >
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 block h-full w-full touch-pan-y transition-opacity duration-700 motion-reduce:transition-none",
                  ready ? "opacity-100" : "opacity-0",
                )}
              />

              {!ready && (
                <p className="body-font absolute inset-0 grid place-items-center text-[length:var(--text-small)] text-foreground-muted">Loading templates…</p>
              )}

              <button type="button" aria-label="Previous template" disabled={!ready} onClick={() => handleRef.current?.prev()} className={cn(arrowBtn, "left-3")}>
                <Icon d={CHEVRON_L} className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next template" disabled={!ready} onClick={() => handleRef.current?.next()} className={cn(arrowBtn, "right-3")}>
                <Icon d={CHEVRON_R} className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Close full view"
                onClick={() => handleRef.current?.close()}
                className={cn(
                  pill,
                  "absolute right-3 top-3 z-[2] bg-surface/80 backdrop-blur-md transition-opacity duration-300",
                  zoomed ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                tabIndex={zoomed ? 0 : -1}
              >
                <Icon d={CLOSE} className="h-4 w-4" />
                Close
              </button>
            </div>

            {/* Instruction pill moved outside the 3D box */}
            <p
              aria-hidden="true"
              className="body-font mx-auto mt-4 max-w-fit rounded-[var(--radius-pill)] border border-[color:var(--border)] bg-surface/75 px-3.5 py-1.5 text-center text-[0.75rem] leading-snug text-foreground-muted backdrop-blur-md shadow-sm"
            >
              {hint}
            </p>
          </Reveal>

          {/* ---------- current site + dots + buttons ---------- */}
          <Reveal delay={150} className="mt-8 flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <Heading level={3}>{current.name}</Heading>
                <Small>{current.type}</Small>
              </div>
              <div className="flex items-center gap-1.5" role="group" aria-label="Choose a template">
                {TEMPLATES.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`Show ${t.name}`}
                    aria-current={i === active}
                    disabled={!ready}
                    onClick={() => handleRef.current?.goTo(i)}
                    className="grid h-6 w-6 place-items-center"
                  >
                    <span className={cn("block h-2 rounded-full transition-all duration-300", i === active ? "w-6 bg-brand-orange" : "w-2 bg-foreground/25")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button href="/contact" size="lg" variant="neon">
                Start a project
              </Button>
              <Button href="/work" size="lg" variant="hero-outline">
                View our work
              </Button>
            </div>
          </Reveal>

          <p className="sr-only" aria-live="polite">
            {current.name}, {current.type}.{zoomed ? " Full view." : ""}
          </p>
        </>
      )}
    </Section>
  );
}