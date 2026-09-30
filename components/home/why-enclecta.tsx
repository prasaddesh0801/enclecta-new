"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from "react";
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
const ANGLE_MIN = -34; // degrees, 0 = pointing right, positive = clockwise (downwards)
const ANGLE_MAX = 34;
const STEP_DEG = (ANGLE_MAX - ANGLE_MIN) / (N - 1);
const angleOf = (i: number) => ANGLE_MIN + i * STEP_DEG;

const AUTOPLAY_MS = 5200; // how long each pillar stays active
const SPRING = 70; // pointer spring stiffness
const DAMPING = 11; // lower = more overshoot / wobble

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function WhyEnclecta() {
  const wrapRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idxRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const tiltRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);

  /* 3D "assemble" entrance: dial rolls in, nodes pop forward one by one, text lifts in */
  useAssemble(wrapRef);

  /* Used by autoplay, node clicks and the progress dashes. */
  const goTo = useCallback((i: number) => {
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
    let pos = 0; // pointer position in "steps" (0 … N-1)
    let vel = 0;
    let tx = 0;
    let ty = 0;

    const render = (now: number) => {
      dial.style.setProperty("--wc-ptr", `${(ANGLE_MIN + pos * STEP_DEG).toFixed(2)}deg`);
      dial.style.setProperty("--wc-pos", pos.toFixed(3));
      const swayX = reduce ? 0 : Math.sin(now / 2200) * 0.3; // idle float
      const swayY = reduce ? 0 : Math.cos(now / 2800) * 0.2;
      dial.style.setProperty("--wc-mx", (tx + swayX).toFixed(3));
      dial.style.setProperty("--wc-my", (ty + swayY).toFixed(3));
      nodeRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--wc-k", clamp(Math.abs(pos - i)).toFixed(3));
      });
      prog.style.setProperty("--wc-t", clamp(elapsedRef.current / AUTOPLAY_MS).toFixed(3));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      if (!reduce && !pausedRef.current) {
        elapsedRef.current += dt * 1000;
        if (elapsedRef.current >= AUTOPLAY_MS) goTo((idxRef.current + 1) % N);
      }

      if (reduce) {
        pos = idxRef.current;
      } else {
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

    /* Only animate while the section is on screen. */
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
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
        </div>
      </div>
    </section>
  );
}
