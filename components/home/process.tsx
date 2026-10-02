"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useAssemble } from "@/lib/use-assemble";
import "./process.css";

type Step = {
  name: string;
  duration: string;
  text: string;
  tags: string[];
  c: string;
  c2: string;
  on: string;
  obj?: string; // deeper colour for the background objects (defaults to c)
};

const STEPS: Step[] = [
  {
    name: "Discovery and scope",
    duration: "2-5 DAYS",
    text: "We clarify the business goal, target users, workflows, constraints, integrations, and success metrics before writing code.",
    tags: ["Project brief", "Feature scope", "Risk notes"],
    c: "var(--tech-cyan)", c2: "var(--tech-bright-blue)", on: "#04141c", obj: "#0284c7",
  },
  {
    name: "Architecture and planning",
    duration: "3-7 DAYS",
    text: "We define the system shape, UI structure, data model, delivery milestones, and the first usable release.",
    tags: ["Technical plan", "Page map", "Sprint plan"],
    c: "var(--tech-purple)", c2: "var(--tech-electric-blue)", on: "#ffffff",
  },
  {
    name: "Design and development",
    duration: "1-8 WEEKS",
    text: "We build in focused iterations with clear review points, responsive interfaces, and maintainable production code.",
    tags: ["Frontend build", "Backend flows", "Weekly demos"],
    c: "var(--tech-electric-blue)", c2: "var(--tech-purple)", on: "#ffffff",
  },
  {
    name: "QA and launch",
    duration: "3-10 DAYS",
    text: "We test core flows, mobile behavior, performance, forms, links, and deployment readiness before handover.",
    tags: ["QA pass", "Deployment", "Launch checklist"],
    c: "var(--tech-bright-blue)", c2: "var(--tech-cyan)", on: "#ffffff",
  },
  {
    name: "Support and improvement",
    duration: "ONGOING",
    text: "After launch, we help with fixes, improvements, analytics review, new features, and long-term product support.",
    tags: ["Maintenance", "Roadmap", "Iteration support"],
    c: "var(--tech-neon-lime)", c2: "var(--tech-cyan)", on: "#0b1a06", obj: "#16a34a",
  },
];

/* ---------- timing ---------- */
const TRAVEL_MS = 1800; // pin glide time for one step (longer jumps scale up)
const HOLD_MS = 2000; // pin rests above each number
const FIRST_MS = 2000; // rest on step 1 before the first move
const EDGE_MS = 1400; // glide off the right end / in from the left end

/* ---------- track geometry (px) ---------- */
const ROAD_H = 230;
const CENTER_Y = 125;
const AMP = 30;
const BADGE_R = 28; // half of the 56px badge
const PIN_LIFT = BADGE_R + 6; // pin tip stops just above the badge

/* ---------- background objects: small, hairline 3D forms (l/t are % of the wide, drifting layer) ---------- */
type Obj = { k: "cube" | "gyro" | "orbit" | "cross" | "dot"; l: string; t: string; s: number; r?: number };

const ORBS = [
  { l: "2%", t: "6%", s: 600, k: "a" },
  { l: "46%", t: "26%", s: 700, k: "b" },
  { l: "80%", t: "0%", s: 520, k: "c" },
];
const MID: Obj[] = [
  { k: "cube", l: "5%", t: "14%", s: 56 },
  { k: "gyro", l: "15%", t: "40%", s: 78 },
  { k: "orbit", l: "29%", t: "6%", s: 150, r: 20 },
  { k: "cube", l: "26%", t: "50%", s: 42 },
  { k: "cube", l: "58%", t: "8%", s: 44 },
  { k: "orbit", l: "62%", t: "46%", s: 112, r: -30 },
  { k: "gyro", l: "72%", t: "14%", s: 84 },
  { k: "cube", l: "83%", t: "40%", s: 64 },
  { k: "orbit", l: "90%", t: "8%", s: 130, r: 60 },
];
const NEAR: Obj[] = [
  { k: "cross", l: "9%", t: "30%", s: 14 },
  { k: "cross", l: "21%", t: "9%", s: 12 },
  { k: "cross", l: "37%", t: "46%", s: 16 },
  { k: "cross", l: "52%", t: "22%", s: 12 },
  { k: "cross", l: "68%", t: "34%", s: 14 },
  { k: "cross", l: "79%", t: "11%", s: 12 },
  { k: "cross", l: "92%", t: "50%", s: 16 },
  { k: "dot", l: "6%", t: "48%", s: 4 },
  { k: "dot", l: "33%", t: "24%", s: 5 },
  { k: "dot", l: "47%", t: "52%", s: 4 },
  { k: "dot", l: "75%", t: "52%", s: 5 },
  { k: "dot", l: "87%", t: "28%", s: 4 },
];

function renderObj(o: Obj, i: number) {
  const vars = {
    left: o.l,
    top: o.t,
    ["--s" as string]: `${o.s}px`,
    ["--r" as string]: `${o.r ?? 0}deg`,
  } as CSSProperties;
  switch (o.k) {
    case "cube":
      return (
        <span key={i} className="jb-cube" style={vars}>
          <i /><i /><i /><i /><i /><i />
        </span>
      );
    case "gyro":
      return (
        <span key={i} className="jb-gyro" style={vars}>
          <i /><i /><i />
        </span>
      );
    case "orbit":
      return <span key={i} className="jb-orbit" style={vars} />;
    case "cross":
      return <span key={i} className="jb-cross" style={vars} />;
    default:
      return <span key={i} className="jb-dot" style={{ ...vars, width: o.s, height: o.s }} />;
  }
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Geo = { path: SVGPathElement; total: number; lens: number[] };

export function Process() {
  const [current, setCurrent] = useState(0); // step whose info is on screen
  const [target, setTarget] = useState(0);
  const [moving, setMoving] = useState(false);
  const [vw, setVw] = useState(0);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [resetting, setResetting] = useState(false); // pin is re-entering from the left end

  const sectionRef = useRef<HTMLElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const geo = useRef<Geo | null>(null);
  const currentRef = useRef(0);
  const movingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<() => void>(() => {});

  /* ---- measure the full-width track ---- */
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    const update = () => setVw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---- 3D "assemble" entrance: parts fly in from depth as the section scrolls into view ---- */
  useAssemble(sectionRef, { rescan: vw > 0 });

  /* ---- track whether the section is on screen (every re-entry restarts the journey from step 1) ---- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: "-25% 0px -25% 0px", // counts as "in view" once it overlaps the middle half of the screen
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- badge centres, spread from the left end to the right end ---- */
  const padX = Math.max(40, vw * 0.08);
  const points = useMemo(() => {
    const n = STEPS.length;
    const span = Math.max(0, vw - padX * 2);
    return STEPS.map((_, i) => ({
      x: padX + (i * span) / (n - 1),
      y: CENTER_Y + AMP * Math.sin(i * 1.15 + 0.4),
    }));
  }, [vw, padX]);

  /* ---- smooth curve that runs off both edges of the screen ---- */
  const pathD = useMemo(() => {
    if (!vw) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const P = [{ x: -60, y: first.y }, ...points, { x: vw + 60, y: last.y }];
    let d = `M ${P[0].x},${P[0].y} `;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i];
      const p1 = P[i];
      const p2 = P[i + 1];
      const p3 = P[i + 2] || p2;
      d += `C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y} `;
    }
    return d;
  }, [points, vw]);

  /* ---- place the pin (and progress line + parallax) at a length on the path ---- */
  const placeAt = useCallback((len: number) => {
    const g = geo.current;
    const pin = pinRef.current;
    if (!g || !pin) return;
    const { path, total, lens } = g;
    const pt = path.getPointAtLength(len);
    const a = path.getPointAtLength(Math.min(total, len + 2));
    const b = path.getPointAtLength(Math.max(0, len - 2));
    const raw = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;
    const tilt = Math.max(-16, Math.min(16, raw * 0.6));
    pin.style.transform = `translate3d(${pt.x}px, ${pt.y - PIN_LIFT}px, 0) translate(-50%, -100%) rotate(${tilt}deg)`;
    if (progressRef.current) progressRef.current.style.strokeDashoffset = String(total - len);
    const span = lens[lens.length - 1] - lens[0] || 1;
    const p = Math.max(0, Math.min(1, (len - lens[0]) / span));
    sectionRef.current?.style.setProperty("--p", p.toFixed(4));
  }, []);

  /* ---- after the path (re)renders: find each badge's length along it ---- */
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathD) return;
    const total = path.getTotalLength();
    const lens = points.map((pt) => {
      let lo = 0;
      let hi = total;
      for (let k = 0; k < 28; k++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).x < pt.x) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    });
    geo.current = { path, total, lens };
    if (progressRef.current) progressRef.current.style.strokeDasharray = String(total);
    if (!movingRef.current) placeAt(lens[currentRef.current]);
    setReady(true);
  }, [pathD, points, placeAt]);

  /* ---- animate the pin between two lengths on the path ---- */
  const glide = useCallback(
    (from: number, to: number, dur: number, done: () => void) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = reduced ? 1 : dur;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / d);
        placeAt(from + (to - from) * easeInOut(t));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        rafRef.current = null;
        done();
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [placeAt]
  );

  const scheduleAdvance = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => advanceRef.current(), HOLD_MS);
  };

  /* ---- glide along the track to a step ---- */
  function travelTo(i: number) {
    const g = geo.current;
    if (!g || movingRef.current || i === currentRef.current || i < 0 || i >= STEPS.length) return;
    if (autoTimer.current) clearTimeout(autoTimer.current);

    const hops = Math.abs(i - currentRef.current);
    movingRef.current = true;
    setMoving(true);
    setTarget(i);

    glide(g.lens[currentRef.current], g.lens[i], TRAVEL_MS * Math.sqrt(hops), () => {
      currentRef.current = i;
      movingRef.current = false;
      setCurrent(i);
      setMoving(false);
      scheduleAdvance();
    });
  }

  /* ---- after the last step: keep going off the right end, then re-enter from the left end to step 1 ---- */
  function wrapAround() {
    const g = geo.current;
    if (!g || movingRef.current) return;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    const last = STEPS.length - 1;

    movingRef.current = true;
    setMoving(true);

    glide(g.lens[last], g.total, EDGE_MS, () => {
      // pin is off-screen right: jump it to the off-screen left end and reset the progress line
      currentRef.current = 0;
      setResetting(true);
      setTarget(0);
      placeAt(0);
      glide(0, g.lens[0], EDGE_MS, () => {
        movingRef.current = false;
        setCurrent(0);
        setResetting(false);
        setMoving(false);
        scheduleAdvance();
      });
    });
  }

  advanceRef.current = () => {
    if (currentRef.current < STEPS.length - 1) travelTo(currentRef.current + 1);
    else wrapAround();
  };

  /* ---- autoplay: every time the section comes into view, start again at step 1, rest 2s per step, loop ---- */
  useEffect(() => {
    if (!ready || !inView) return;
    const g = geo.current;
    if (g) {
      currentRef.current = 0;
      movingRef.current = false;
      setCurrent(0);
      setTarget(0);
      setMoving(false);
      setResetting(false);
      placeAt(g.lens[0]);
    }
    autoTimer.current = setTimeout(() => advanceRef.current(), FIRST_MS);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      movingRef.current = false;
    };
  }, [ready, inView, placeAt]);

  const step = STEPS[current];
  const objVars = (s: Step) =>
    ({ ...accentVars(s), ["--step-obj" as string]: s.obj ?? s.c }) as CSSProperties;
  const accentVars = (s: Step) =>
    ({
      ["--step-accent" as string]: s.c,
      ["--step-grad" as string]: `linear-gradient(135deg, ${s.c}, ${s.c2})`,
      ["--step-on" as string]: s.on,
    }) as CSSProperties;

  return (
    <section className="journey" id="process" aria-labelledby="journey-title" ref={sectionRef} style={objVars(STEPS[resetting ? 0 : current])}>
      {/* ---------- moving 3D background (drifts right to left as the pin advances) ---------- */}
      <div className="journey-bg" aria-hidden="true" data-asm="glow">
        <div className="jb-layer jb-far">
          {ORBS.map((o, i) => (
            <span key={i} className={`jb-orb jb-orb--${o.k}`} style={{ left: o.l, top: o.t, width: o.s, height: o.s }} />
          ))}
        </div>
        <div className="jb-floor" />
        <div className="jb-layer jb-mid">{MID.map(renderObj)}</div>
        <div className="jb-layer jb-near">{NEAR.map(renderObj)}</div>
      </div>

      <div className="journey-intro" data-asm="rise">
        <p className="journey-eyebrow">How we work</p>
        <h2 id="journey-title" className="journey-title">From first call to ongoing support</h2>
      </div>

      {/* ---------- step info, sitting directly on the background ---------- */}
      <div className="journey-info-wrap" aria-live="polite" data-asm="lift" data-asm-order="1">
        <div key={current} className={`journey-info${moving ? " is-leaving" : ""}`} style={accentVars(step)}>
          <div className="journey-meta">
            <span className="journey-num">{String(current + 1).padStart(2, "0")}</span>
            <span className="journey-duration">{step.duration}</span>
          </div>
          <h3 className="journey-card-title">{step.name}</h3>
          <span className="journey-rule" aria-hidden="true" />
          <p className="journey-text">{step.text}</p>
          <ul className="journey-tags">
            {step.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- the track: fixed, edge to edge. Only the pin moves. ---------- */}
      <div className="journey-road" ref={roadRef} style={{ height: ROAD_H }}>
        <div className="journey-road-inner">
          {vw > 0 && (
            <svg className="journey-path-svg" width={vw} height={ROAD_H} aria-hidden="true" data-asm="fade" data-asm-order="2">
              <defs>
                <linearGradient id="roadGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={vw} y2="0">
                  {STEPS.map((s, i) => (
                    <stop key={i} offset={points[i].x / vw} style={{ stopColor: s.c }} />
                  ))}
                </linearGradient>
              </defs>
              <path ref={pathRef} d={pathD} className="journey-road-bed" fill="none" strokeWidth={22} strokeLinecap="round" />
              <path d={pathD} className="journey-road-dash" fill="none" strokeWidth={3} strokeLinecap="round" strokeDasharray="2 14" />
              <path
                ref={progressRef}
                d={pathD}
                className="journey-road-progress"
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth={5}
                strokeLinecap="round"
                style={{ opacity: ready ? 1 : 0 }}
              />
            </svg>
          )}

          {vw > 0 &&
            STEPS.map((s, i) => (
              <button
                key={s.name}
                type="button"
                className={`journey-badge${!resetting && i === current ? " is-active" : ""}${!resetting && i < current ? " is-done" : ""}${moving && i === target ? " is-target" : ""}`}
                style={{ left: points[i].x, top: points[i].y, ...accentVars(s) }}
                aria-label={`Step ${i + 1}: ${s.name}`}
                aria-current={!resetting && i === current ? "step" : undefined}
                data-asm="pop"
                data-asm-order={i + 2}
                onClick={() => travelTo(i)}
              >
                {i + 1}
                <span className="journey-badge-label">{s.name}</span>
              </button>
            ))}

          <div className={`journey-pin${moving ? " is-moving" : ""}`} ref={pinRef} aria-hidden="true" data-asm="pop" data-asm-order="2">
            <svg className="journey-pin-body" width="30" height="40" viewBox="0 0 30 40" fill="none">
              <path
                d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13 23.8 13.5 24.4a2 2 0 0 0 3 0C17 38.8 30 25.5 30 15 30 6.7 23.3 0 15 0z"
                fill="var(--brand-orange)"
              />
              <circle cx="15" cy="15" r="6.5" fill="var(--surface)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="journey-controls" data-asm="fade" data-asm-order={STEPS.length + 2}>
        <button type="button" className="journey-arrow" onClick={() => travelTo(current - 1)} disabled={current === 0 || moving} aria-label="Previous step">&larr;</button>
        <span className="journey-counter">{current + 1} / {STEPS.length}</span>
        <button type="button" className="journey-arrow journey-arrow--next" onClick={() => travelTo(current + 1)} disabled={current === STEPS.length - 1 || moving} aria-label="Next step">&rarr;</button>
      </div>
    </section>
  );
}

export default Process;
