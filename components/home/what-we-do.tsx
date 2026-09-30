"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import Link from "next/link";
import Section from "@/components/layout/section";
import Reveal from "@/components/ui/reveal";
import "./what-we-do.css";

/* ---------- icons (same stroke style as the rest of the site) ---------- */

type IconProps = { className?: string };

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/* front-card "badge" icons: bigger duotone illustrations (a soft filled
   layer plus a crisp outline/detail layer, both currentColor) designed to
   actually read well at large size inside the icon stage, rather than a
   thin single-stroke icon blown up past its comfort zone. */

const IconWebsite = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-website" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x="6" y="10" width="52" height="44" rx="9" fill="currentColor" />
    <rect
      x="6"
      y="10"
      width="52"
      height="44"
      rx="9"
      fill="url(#wwd-gloss-website)"
    />
    <path d="M6 21.5h52" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
    <circle cx="14.5" cy="15.75" r="1.7" fill="#fff" fillOpacity="0.8" />
    <circle cx="20.5" cy="15.75" r="1.7" fill="#fff" fillOpacity="0.8" />
    <circle cx="26.5" cy="15.75" r="1.7" fill="#fff" fillOpacity="0.8" />
    <path
      d="M23 40l-8-7 8-7M41 26l8 7-8 7M35.5 23l-7 18"
      fill="none"
      stroke="#fff"
      strokeWidth="3.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconAI = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-ai" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
      <path d="M22 6v7M32 6v7M42 6v7M22 51v7M32 51v7M42 51v7M6 22h7M6 32h7M6 42h7M51 22h7M51 32h7M51 42h7" />
    </g>
    <rect x="15" y="15" width="34" height="34" rx="9" fill="currentColor" />
    <rect
      x="15"
      y="15"
      width="34"
      height="34"
      rx="9"
      fill="url(#wwd-gloss-ai)"
    />
    <text
      x="32"
      y="38.5"
      textAnchor="middle"
      fontSize="15"
      fontWeight="800"
      fill="#fff"
      fontFamily="inherit"
    >
      AI
    </text>
    <circle cx="49" cy="15" r="4.2" fill="currentColor" />
    <circle cx="49" cy="15" r="4.2" fill="url(#wwd-gloss-ai)" />
  </svg>
);
const IconSaaS = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-saas" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M8 43 32 55.5 56 43"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.3"
    />
    <path
      d="M8 30.5 32 43l24-12.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.55"
    />
    <path d="M32 6 8 18.5 32 31l24-12.5Z" fill="currentColor" />
    <path d="M32 6 8 18.5 32 31l24-12.5Z" fill="url(#wwd-gloss-saas)" />
  </svg>
);
const IconProduct = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-product" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="20" fill="currentColor" opacity="0.12" />
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
    >
      <path d="M32 8v8M32 48v8M8 32h8M48 32h8" />
      <path d="M14.5 14.5l5.6 5.6M43.9 43.9l5.6 5.6M14.5 49.5l5.6-5.6M43.9 20.1l5.6-5.6" />
    </g>
    <circle cx="32" cy="32" r="11" fill="currentColor" />
    <circle cx="32" cy="32" r="11" fill="url(#wwd-gloss-product)" />
  </svg>
);
const IconData = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-data" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect
      x="7"
      y="41"
      width="10"
      height="16"
      rx="2.5"
      fill="currentColor"
      opacity="0.4"
    />
    <rect
      x="22"
      y="31"
      width="10"
      height="26"
      rx="2.5"
      fill="currentColor"
      opacity="0.62"
    />
    <rect
      x="37"
      y="19"
      width="10"
      height="38"
      rx="2.5"
      fill="currentColor"
      opacity="0.85"
    />
    <rect
      x="37"
      y="19"
      width="10"
      height="38"
      rx="2.5"
      fill="url(#wwd-gloss-data)"
    />
    <path
      d="M9 34 24 22l12 8 22-19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <circle cx="58" cy="11" r="3.4" fill="currentColor" />
    <circle cx="58" cy="11" r="3.4" fill="url(#wwd-gloss-data)" />
  </svg>
);
const IconSocial = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="wwd-gloss-social" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M14 14h36a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H32l-11 11V48H14a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z"
      fill="currentColor"
    />
    <path
      d="M14 14h36a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H32l-11 11V48H14a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z"
      fill="url(#wwd-gloss-social)"
    />
    <path
      d="M32 34.5c-3.4-4.6-10.2-4.1-10.2 1.6 0 4.6 6.1 7.8 10.2 11 4.1-3.2 10.2-6.4 10.2-11 0-5.7-6.8-6.2-10.2-1.6Z"
      fill="#fff"
    />
  </svg>
);
const IconTurn = ({ className }: IconProps) => (
  <svg {...stroke} className={className}>
    <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" />
  </svg>
);
const IconArrow = ({ className }: IconProps) => (
  <svg {...stroke} strokeWidth={1.75} className={className}>
    <path d="M3.5 12h17M14 6l6.5 6-6.5 6" />
  </svg>
);

/* ---------- content ----------
   At laptop size the cards ride an elliptical dotted orbit (rx 36 / ry 38,
   defined in the CSS) instead of a fixed position — each card is spaced an
   even 1/6 of the ring apart via its index (see --i in the CSS) and slowly
   drifts right-to-left along the top of the ring, looping forever. */

type Service = {
  index: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  accent: string;
  icon: (p: IconProps) => React.JSX.Element;
};

const SERVICES: Service[] = [
  {
    index: "01",
    title: "Website Development",
    tagline: "Engage your users",
    description:
      "Fast, responsive websites and e-commerce, built around your brand and business goals.",
    href: "/services#website-development",
    accent: "#3b82f6",
    icon: IconWebsite,
  },
  {
    index: "02",
    title: "AI & Automation",
    tagline: "Intelligence at scale",
    description:
      "LLM copilots to production ML pipelines: intelligence embedded in your product.",
    href: "/services#ai-automation",
    accent: "#22c55e",
    icon: IconAI,
  },
  {
    index: "03",
    title: "SaaS Development",
    tagline: "Turnkey SaaS platforms",
    description:
      "Secure, scalable multi-tenant SaaS with subscriptions and analytics dashboards.",
    href: "/services#saas-development",
    accent: "#7c5cff",
    icon: IconSaaS,
  },
  {
    index: "04",
    title: "Product Engineering",
    tagline: "Built to last",
    description:
      "Full-stack teams turning ideas into polished products, with clean architecture from day one.",
    href: "/services#product-engineering",
    accent: "#f97316",
    icon: IconProduct,
  },
  {
    index: "05",
    title: "Data & Analytics",
    tagline: "Signal over noise",
    description:
      "Real-time pipelines, clear data models and dashboards that turn raw data into decisions.",
    href: "/services#data-analytics",
    accent: "#ec4899",
    icon: IconData,
  },
  {
    index: "06",
    title: "Social Media Management",
    tagline: "Build your brand",
    description:
      "Content, scheduling, community and analytics, built to deliver growth you can point to.",
    href: "/services#social-media",
    accent: "#06b6d4",
    icon: IconSocial,
  },
];

/* ---------- one flip card ----------
   Two-step interaction: the first click brings a card to the front and
   zooms it in (and — see the CSS — pauses every card's orbit, not just
   this one). A second click on that same, now-active card flips it to
   read the description. Clicking anywhere outside it (the dimmed
   backdrop rendered by the parent) closes it and the whole ring resumes
   drifting. */

function ServiceFlipCard({
  s,
  i,
  active,
  onActivate,
  onClose,
}: {
  s: Service;
  i: number;
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLButtonElement | null>(null);
  const backRef = useRef<HTMLButtonElement | null>(null);
  const focusNext = useRef<"front" | "back" | null>(null);
  const Icon = s.icon;

  // after a flip, move keyboard focus to the face that is now visible
  useEffect(() => {
    const which = focusNext.current;
    if (!which) return;
    focusNext.current = null;
    const id = requestAnimationFrame(() => {
      (which === "back" ? backRef : frontRef).current?.focus({
        preventScroll: true,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [flipped]);

  // closing (clicking outside, Escape, or another card taking over) always
  // resets this card back to its front face
  useEffect(() => {
    if (!active) setFlipped(false);
  }, [active]);

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  };

  const flip = (next: boolean) => {
    focusNext.current = next ? "back" : "front";
    resetTilt();
    setFlipped(next);
  };

  // mouse only: tilt the card towards the cursor and move the glass glare —
  // only while idle; an active/zoomed card holds still
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const el = cardRef.current;
    if (!el || e.pointerType !== "mouse" || flipped || active) return;
    // measure the card itself, not the slot — the slot is now the full-stage
    // orbit mover, so its own rect no longer matches the visible card
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };

  return (
    <li
      className="wwd-slot"
      data-flipped={flipped}
      data-active={active}
      style={{ "--acc": s.accent, "--i": i } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={resetTilt}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        if (flipped) flip(false);
        else if (active) onClose();
      }}
    >
      {/* sized, always-on-top interactive box; the <li> itself is only the
          full-stage mover that the orbit animation slides along the ring */}
      <div className="wwd-orbit-item">
        <div ref={cardRef} className="wwd-card">
          <div className="wwd-plate" aria-hidden="true" />
          <div className="wwd-flip">
            {/* front: name up top, big icon filling the rest of the card */}
            <button
              ref={frontRef}
              type="button"
              className="wwd-face wwd-front"
              inert={flipped}
              aria-label={
                active
                  ? `${s.title}. Turn the card to read more.`
                  : `${s.index} ${s.title}. Open for details.`
              }
              onClick={() => {
                resetTilt();
                if (active) flip(true);
                else onActivate();
              }}
            >
              <span className="wwd-top">
                <span className="wwd-name">{s.title}</span>
                <span className="wwd-num" aria-hidden="true">
                  {s.index}
                </span>
              </span>
              <span className="wwd-icon-stage" aria-hidden="true">
                <Icon className="wwd-icon-big" />
              </span>
              <IconArrow className="wwd-corner-arrow" />
            </button>

            {/* back: what the service is */}
            <div
              className="wwd-face wwd-back"
              inert={!flipped}
              onClick={() => flip(false)}
            >
              <p className="wwd-tag">{s.tagline}</p>
              <p className="wwd-desc">{s.description}</p>
              <div className="wwd-actions">
                <Link
                  href={s.href}
                  className="wwd-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn more
                  <IconArrow className="h-3.5 w-3.5" />
                </Link>
                <button
                  ref={backRef}
                  type="button"
                  className="wwd-back-btn"
                  aria-label={`Turn the ${s.title} card back`}
                  onClick={(e) => {
                    e.stopPropagation();
                    flip(false);
                  }}
                >
                  <IconTurn className="h-1/2 w-1/2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ---------- section ---------- */

export default function WhatWeDo() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  // which card (if any) is currently zoomed to the front; while set, every
  // card's orbit is paused (see .wwd-plane[data-frozen] in the CSS) and a
  // dimmed backdrop appears behind the active card to catch outside clicks
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = () => setActiveIndex(null);

  // laptop only (the CSS ignores these vars below 1024px): gently tilt the
  // whole ring towards the mouse so the section reads as one 3D object
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    const plane = planeRef.current;
    if (!stage || !plane || e.pointerType !== "mouse") return;
    const r = stage.getBoundingClientRect();
    plane.style.setProperty(
      "--px",
      String(((e.clientX - r.left) / r.width - 0.5) * 2),
    );
    plane.style.setProperty(
      "--py",
      String(((e.clientY - r.top) / r.height - 0.5) * 2),
    );
  };
  const onLeave = () => {
    planeRef.current?.style.setProperty("--px", "0");
    planeRef.current?.style.setProperty("--py", "0");
  };

  return (
    <Section id="services" space="sm" className="wwd-section">
      <Reveal variant="fade" duration={1200}>
        <div ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
          <div
            ref={planeRef}
            className="wwd-plane"
            data-frozen={activeIndex !== null}
          >
            {/* dashed orbit behind the cards (laptop only) — a true circle;
                the stage itself is square (see .wwd-plane) so this lines up
                exactly with the circular offset-path the cards ride */}
            <svg className="wwd-ring" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="var(--wwd-ring)"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeDasharray="0.5 10.5"
                vectorEffect="non-scaling-stroke"
                className="wwd-ring-dots"
              />
            </svg>

            <div className="wwd-hub">
              <span className="wwd-pill">Our services</span>
              <h2 className="wwd-title">
                <span>What We</span>
                <span className="wwd-accent">Build</span>
              </h2>
              <p className="wwd-hub-desc">
                From idea to launch, we create modern digital experiences that
                help your business grow.
              </p>
            </div>

            {/* dims and blurs the idle cards behind the zoomed-in one, and
                catches the "click outside to close" gesture */}
            {activeIndex !== null && (
              <button
                type="button"
                className="wwd-backdrop"
                aria-label="Close service details"
                onClick={close}
              />
            )}

            <ul className="wwd-list">
              {SERVICES.map((s, i) => (
                <ServiceFlipCard
                  key={s.index}
                  s={s}
                  i={i}
                  active={activeIndex === i}
                  onActivate={() => setActiveIndex(i)}
                  onClose={close}
                />
              ))}
            </ul>
          </div>

          <p className="wwd-hint">
            Click a card to bring it forward, click again to read more, click
            outside to close.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
