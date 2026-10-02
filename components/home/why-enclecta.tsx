"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from "react";
import Button from "@/components/ui/button";
import { useAssemble } from "@/lib/use-assemble";
import "./why-enclecta.css";

type Kind = "precision" | "partnership" | "transparency" | "rigour";

const PILLARS: {
  numeral: string;
  title: string;
  description: string;
  points: string[]; // placeholder copy, replace with your own
  kind: Kind;
  accentL: string;
  accentD: string;
  onL: string;
  onD: string;
}[] = [
  {
    numeral: "I",
    title: "Precision over volume",
    description:
      "We take on fewer engagements so we can do each one properly. Our teams go deep, not wide.",
    points: [
      "Small, senior team on every build",
      "One lead who owns the outcome",
      "Capacity capped so nothing is rushed",
    ],
    kind: "precision",
    accentL: "#7c5cf0",
    accentD: "var(--hero-title-accent)", // the neon "Ventures" green from globals.css (dark theme)
    onL: "#ffffff",
    onD: "#0b1020",
  },
  {
    numeral: "II",
    title: "Long-term partnership",
    description:
      "We measure success in years, not projects. Our goal is to be the tech partner you never have to replace.",
    points: [
      "Support and roadmap after launch",
      "Same team from kickoff to year three",
      "Planned upgrades, not surprise rebuilds",
    ],
    kind: "partnership",
    accentL: "#ef4f8b",
    accentD: "#ff5c9e",
    onL: "#ffffff",
    onD: "#0b1020",
  },
  {
    numeral: "III",
    title: "Radical transparency",
    description:
      "No hidden costs, no scope creep surprises. You see everything — timelines, trade-offs, risks.",
    points: [
      "Itemised scopes and fixed estimates",
      "Weekly progress and risk updates",
      "Trade-offs explained before decisions",
    ],
    kind: "transparency",
    accentL: "var(--tech-bright-blue)", // from globals.css
    accentD: "var(--tech-cyan)", // from globals.css
    onL: "#ffffff",
    onD: "#0b1020",
  },
  {
    numeral: "IV",
    title: "Engineering rigour",
    description:
      "Code review, test coverage, CI/CD, observability — these aren't optional extras. They're how we work.",
    points: [
      "Peer-reviewed code on every change",
      "Automated tests and CI/CD pipelines",
      "Monitoring and alerts from day one",
    ],
    kind: "rigour",
    accentL: "#e8920a",
    accentD: "#ffc043",
    onL: "#3a2400",
    onD: "#0b1020",
  },
];

const ICONS: Record<Kind, ReactNode> = {
  precision: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </>
  ),
  partnership: (
    <>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </>
  ),
  transparency: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  rigour: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
};

function Icon({ kind, className }: { kind: Kind; className: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[kind]}
      </svg>
    </span>
  );
}

const N = PILLARS.length;
const ANGLE_MIN = -34; // degrees, 0 = pointing right, positive = clockwise (downwards)
const ANGLE_MAX = 34;
const STEP_DEG = (ANGLE_MAX - ANGLE_MIN) / (N - 1);
const angleOf = (i: number) => ANGLE_MIN + i * STEP_DEG;

const AUTOPLAY_MS = 2000; // how long the pointer rests on each pillar (counted from the moment it arrives)
const SPRING = 70; // pointer spring stiffness
const DAMPING = 11; // lower = more overshoot / wobble

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- wrap-around: after pillar 4 the pointer keeps going clockwise, down the circle and out at the
   bottom-left, then re-enters from the top-left and settles on pillar 1 ---------- */
const WRAP_DEG = 102; // chosen so the tick-bezel jump is a whole number of ticks (no visible snap)
const OUT_POS = (WRAP_DEG - ANGLE_MIN) / STEP_DEG; // 6: out of sight at the bottom-left
const IN_POS = (-WRAP_DEG - ANGLE_MIN) / STEP_DEG; // -3: out of sight at the top-left
const EXIT_MS = 1300; // pillar 4 -> down the circle and out
const ENTER_MS = 1600; // in from the top-left -> pillar 1
const SHOW_AT = 0.35; // the section counts as "visited" once this much of it is on screen
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function WhyEnclecta() {
  const wrapRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idxRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const phaseRef = useRef<"idle" | "exit" | "enter">("idle");
  const tiltRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);

  /* 3D "assemble" entrance: dial rolls in, nodes pop forward one by one, text lifts in */
  useAssemble(wrapRef);

  /* Used by autoplay, node clicks and the progress dashes. */
  const goTo = useCallback((i: number) => {
    phaseRef.current = "idle"; // a click cancels any wrap-around in progress
    idxRef.current = i;
    elapsedRef.current = 0;
    setActive(i);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dial = dialRef.current;
    const prog = progRef.current;
    if (!wrap || !dial || !prog) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tilt = tiltRef.current;
    let raf = 0;
    let last = 0;
    let pos = 0; // pointer position in "steps"; below 0 / above N-1 = out of sight
    let vel = 0;
    let tx = 0;
    let ty = 0;
    let from = 0; // where the exit started
    let t0 = 0; // when the current wrap phase started

    const render = (now: number) => {
      const ang = ANGLE_MIN + pos * STEP_DEG;
      dial.style.setProperty("--wc-ptr", `${ang.toFixed(2)}deg`);
      dial.style.setProperty("--wc-tilt", `${clamp(ang, ANGLE_MIN, ANGLE_MAX).toFixed(2)}deg`);
      dial.style.setProperty("--wc-pos", pos.toFixed(3));
      dial.style.setProperty("--wc-apos", clamp(pos, 0, N - 1).toFixed(3));
      const swayX = reduce ? 0 : Math.sin(now / 2200) * 0.3; // idle float
      const swayY = reduce ? 0 : Math.cos(now / 2800) * 0.2;
      dial.style.setProperty("--wc-mx", (tx + swayX).toFixed(3));
      dial.style.setProperty("--wc-my", (ty + swayY).toFixed(3));
      nodeRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--wc-k", clamp(Math.abs(pos - i)).toFixed(3));
      });
      prog.style.setProperty("--wc-t", clamp(elapsedRef.current / AUTOPLAY_MS).toFixed(3));
    };

    /* back to pillar 1, as if the section had never been visited */
    const reset = () => {
      phaseRef.current = "idle";
      idxRef.current = 0;
      elapsedRef.current = 0;
      pos = 0;
      vel = 0;
      setActive(0);
      render(performance.now());
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const phase = phaseRef.current;

      if (reduce) {
        pos = idxRef.current;
      } else if (phase === "exit") {
        // pillar 4 -> keeps going clockwise, down the circle, out at the bottom-left
        const t = clamp((now - t0) / EXIT_MS);
        pos = from + (OUT_POS - from) * easeIn(t);
        vel = 0;
        if (t >= 1) {
          // out of sight: come round to the top-left with pillar 1 ready
          phaseRef.current = "enter";
          t0 = now;
          pos = IN_POS;
          idxRef.current = 0;
          elapsedRef.current = 0;
          setActive(0);
        }
      } else if (phase === "enter") {
        // in from the top-left, gliding down onto pillar 1
        const t = clamp((now - t0) / ENTER_MS);
        pos = IN_POS * (1 - easeOut(t));
        vel = 0;
        if (t >= 1) {
          phaseRef.current = "idle";
          pos = 0;
        }
      } else {
        // the rest time only starts counting once the pointer has actually arrived on the pillar
        const settled = Math.abs(idxRef.current - pos) < 0.03 && Math.abs(vel) < 0.3;
        if (!pausedRef.current && settled) {
          elapsedRef.current += dt * 1000;
          if (elapsedRef.current >= AUTOPLAY_MS) {
            if (idxRef.current === N - 1) {
              phaseRef.current = "exit";
              from = pos;
              t0 = now;
            } else {
              goTo(idxRef.current + 1);
            }
          }
        }
        // spring: the pointer swings to the next pillar with a small, weighty overshoot
        vel += (idxRef.current - pos) * SPRING * dt;
        vel *= Math.exp(-DAMPING * dt);
        pos += vel * dt;
      }

      const k = 1 - Math.exp(-4 * dt);
      tx += (tilt.x - tx) * k;
      ty += (tilt.y - ty) * k;

      render(now);
      raf = requestAnimationFrame(tick);
    };

    render(performance.now());

    /* Run only while enough of the section is on screen; leaving it completely resets to pillar 1. */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) reset();
        if (entry.intersectionRatio >= SHOW_AT) {
          if (!raf) {
            last = performance.now();
            raf = requestAnimationFrame(tick);
          }
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: [0, SHOW_AT] },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [goTo]);

  const hold = (v: boolean) => () => {
    pausedRef.current = v;
  };

  /* Mouse parallax: the whole dial leans slightly toward the cursor. */
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    tiltRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const onLeave = () => {
    tiltRef.current.x = 0;
    tiltRef.current.y = 0;
  };

  const cur = PILLARS[active];

  return (
    <section
      id="why-enclecta"
      data-no-reveal
      className="wc"
      ref={wrapRef}
      aria-labelledby="wc-title"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onFocusCapture={(e: FocusEvent) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) pausedRef.current = true;
      }}
      onBlurCapture={hold(false)}
    >
      <div
        className="wc-stage"
        style={{ ["--wc-accent-l" as string]: cur.accentL, ["--wc-accent-d" as string]: cur.accentD } as CSSProperties}
      >
        <div className="wc-bg" aria-hidden="true" data-asm="glow">
          <span className="wc-glow wc-glow--a" />
          <span className="wc-glow wc-glow--b" />
        </div>

        {/* dial + heading; on phones this becomes the clipped semicircle below the info */}
        <div className="wc-dome">
          {/* ---------- dial: layered in 3D (plate, ticks, disc, pointer, nodes) ---------- */}
          <div className="wc-dial" ref={dialRef} data-asm="sweep" onPointerEnter={hold(true)} onPointerLeave={hold(false)}>
            <div className="wc-plate" aria-hidden="true" />
            <div className="wc-beam" aria-hidden="true" />
            <div className="wc-ticks" aria-hidden="true" />
            <div className="wc-ring" aria-hidden="true" />
            <div className="wc-disc" aria-hidden="true">
              <span className="wc-aurora" />
            </div>
            <div className="wc-pointer" aria-hidden="true" />

            {PILLARS.map((p, i) => (
              <button
                key={p.numeral}
                type="button"
                className="wc-node"
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                onClick={() => goTo(i)}
                aria-label={`${p.title} (${i + 1} of ${N})`}
                aria-current={i === active ? "true" : undefined}
                data-asm="pop"
                data-asm-opacity="var"
                data-asm-order={i + 1}
                style={
                  {
                    ["--a" as string]: `${angleOf(i)}deg`,
                    ["--wc-ac-l" as string]: p.accentL,
                    ["--wc-ac-d" as string]: p.accentD,
                    ["--wc-on-l" as string]: p.onL,
                    ["--wc-on-d" as string]: p.onD,
                  } as CSSProperties
                }
              >
                <span className="wc-node-face" aria-hidden="true" />
                <Icon kind={p.kind} className="wc-ico wc-ico--dim" />
                <Icon kind={p.kind} className="wc-ico wc-ico--on" />
                <span className="wc-node-label" aria-hidden="true">
                  <span className="wc-node-num">{p.numeral}</span>
                  <span className="wc-node-title">{p.title}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ---------- heading inside the disc ---------- */}
          <div className="wc-lead" data-asm="rise" data-asm-order="1">
            <h2 id="wc-title" className="wc-title">
              Why choose us?
            </h2>
            <p className="wc-sub">Four principles we hold every project to.</p>
          </div>
        </div>

        {/* ---------- details for the active step ---------- */}
        <div className="wc-info" data-asm="lift" data-asm-order={N + 1} onPointerEnter={hold(true)} onPointerLeave={hold(false)}>
          <div className="wc-progress" ref={progRef}>
            <span className="wc-progress-count" aria-hidden="true">
              0{active + 1} / 0{N}
            </span>
            {PILLARS.map((p, i) => (
              <button
                key={p.numeral}
                type="button"
                className="wc-dash"
                data-on={i === active ? "" : undefined}
                onClick={() => goTo(i)}
                aria-label={`Show ${p.title}`}
              >
                <span className="wc-dash-fill" />
              </button>
            ))}
          </div>

          <div className="wc-stack">
            {PILLARS.map((p, i) => (
              <div
                key={p.numeral}
                className="wc-panel"
                data-state={i === active ? "active" : i < active ? "before" : "after"}
                aria-hidden={i !== active}
                style={
                  {
                    ["--wc-ac-l" as string]: p.accentL,
                    ["--wc-ac-d" as string]: p.accentD,
                  } as CSSProperties
                }
              >
                <h3 className="wc-panel-title">{p.title}</h3>
                <p className="wc-panel-text">{p.description}</p>
                <ul className="wc-points">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="wc-cta wc-cta--desk">
            <Button href="/about" size="lg" variant="outline">
              About us
            </Button>
          </div>
        </div>

        {/* phones: the button sits below the dial */}
        <div className="wc-cta wc-cta--mob">
          <Button href="/about" size="lg" variant="outline">
            About us
          </Button>
        </div>
      </div>
    </section>
  );
}
