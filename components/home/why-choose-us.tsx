"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./why-choose-us.css";

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
    accentD: "#a08cff",
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
    accentD: "#ff7fae",
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
    accentL: "#0f9a6b",
    accentD: "#3fdca6",
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
    accentD: "#ffb43a",
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
const ANGLE_MIN = -45; // degrees, 0 = pointing right, positive = clockwise (downwards)
const ANGLE_MAX = 45;
const STEP_DEG = (ANGLE_MAX - ANGLE_MIN) / (N - 1);
const angleOf = (i: number) => ANGLE_MIN + i * STEP_DEG;

/* Scroll length: each step gets 90svh, plus a short rest at the end. */
const STEP_SVH = 90;
const DWELL_SVH = 40;
const WRAP_SVH = 100 + (N - 1) * STEP_SVH + DWELL_SVH;
const ENTRY_FRAC = ((N - 1) * STEP_SVH) / ((N - 1) * STEP_SVH + DWELL_SVH);

const SMOOTHING = 7; // higher = snappier pointer, lower = floatier

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/* Pointer rests on each step for ~30% of the scroll, then swings to the next one. */
const dwell = (f: number) => {
  const s = clamp((f - 0.28) / 0.44);
  return s * s * (3 - 2 * s);
};

export default function WhyChooseUs() {
  const wrapRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dial = dialRef.current;
    if (!wrap || !dial) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let target = 0;
    let current = 0;
    let vh = window.innerHeight;
    let shown = 0;

    const readTarget = () => {
      const r = wrap.getBoundingClientRect();
      const total = r.height - vh;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      const t = clamp(p / ENTRY_FRAC) * (N - 1);
      const i0 = Math.min(Math.floor(t), N - 2);
      target = i0 + dwell(t - i0); // 0 … N-1, lingers on whole numbers
    };

    const render = (pos: number) => {
      dial.style.setProperty("--wc-ptr", `${(ANGLE_MIN + pos * STEP_DEG).toFixed(2)}deg`);
      dial.style.setProperty("--wc-pos", pos.toFixed(3));
      nodeRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--wc-k", clamp(Math.abs(pos - i)).toFixed(3));
      });
      const a = Math.round(pos);
      if (a !== shown) {
        shown = a;
        setActive(a);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      current += (target - current) * (1 - Math.exp(-SMOOTHING * dt));
      if (Math.abs(target - current) < 0.0005) current = target;
      render(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      readTarget();
      if (reduce) {
        current = target;
        render(current);
        return;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      vh = window.innerHeight;
      kick();
    };

    readTarget();
    current = target; // no swoop on first paint or when reloading mid-page
    render(current);

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Clicking a node scrolls to the exact spot where the pointer rests on it. */
  const goTo = useCallback((i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = (i / (N - 1)) * ENTRY_FRAC;
    window.scrollTo({ top: window.scrollY + r.top + p * total, behavior: "smooth" });
  }, []);

  const cur = PILLARS[active];

  return (
    <section
      id="why-choose-us"
      className="wc"
      ref={wrapRef}
      style={{ height: `${WRAP_SVH}svh` }}
      aria-labelledby="wc-title"
    >
      <div
        className="wc-stage"
        style={{ ["--wc-accent-l" as string]: cur.accentL, ["--wc-accent-d" as string]: cur.accentD } as CSSProperties}
      >
        <div className="wc-bg" aria-hidden="true">
          <span className="wc-glow wc-glow--a" />
          <span className="wc-glow wc-glow--b" />
        </div>

        {/* ---------- dial: rings, disc, pointer, nodes ---------- */}
        <div className="wc-dial" ref={dialRef}>
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
        <div className="wc-lead">
          <h2 id="wc-title" className="wc-title">
            Why choose us?
          </h2>
          <p className="wc-sub">Four principles we hold every project to.</p>
        </div>

        {/* ---------- details for the active step ---------- */}
        <div className="wc-info">
          <div className="wc-progress" aria-hidden="true">
            <span className="wc-progress-count">
              0{active + 1} / 0{N}
            </span>
            {PILLARS.map((p, i) => (
              <span key={p.numeral} className="wc-dash" data-on={i === active ? "" : undefined} />
            ))}
          </div>

          <div className="wc-stack" aria-live="polite">
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
        </div>
      </div>
    </section>
  );
}
