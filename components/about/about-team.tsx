"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

/* =========================================================
   TEAM CAROUSEL: a row of tall photo strips. One strip is open (big, full colour, with name and role),
   the others stay slim and grey. It moves to the next person on its own, one by one;
   hover, tap, click, the arrows or the left / right keys pick a person.

   EDIT HERE: put photos in /public/team/ and set `photo` (e.g. "/team/ravi.jpg"). Portrait photos, about 3:4, work best.
   Without a photo a coloured placeholder with initials is drawn.
   `hue` is the placeholder colour only.
   ========================================================= */

type Person = { name: string; role: string; bio: string; photo?: string; hue: number };

const TEAM: Person[] = [
  { name: "Team Member One", role: "Founder & CEO", bio: "Leads strategy and keeps every project honest, on time and on budget.", photo: undefined, hue: 262 },
  { name: "Team Member Two", role: "Lead Developer", bio: "Turns designs into fast, tidy code that is easy to hand over.", photo: undefined, hue: 214 },
  { name: "Team Member Three", role: "UI / UX Designer", bio: "Sketches, tests and polishes until the screen feels obvious.", photo: undefined, hue: 330 },
  { name: "Team Member Four", role: "Project Manager", bio: "Your one point of contact from the first call to launch day.", photo: undefined, hue: 28 },
];

const AUTOPLAY_MS = 2000; // each person stays open for 2 seconds

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Placeholder({ p }: { p: Person }) {
  return (
    <span
      className="ab-ph"
      style={{ "--h": p.hue } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 120" className="ab-ph-figure">
        <circle cx="50" cy="42" r="19" />
        <path d="M12 120c2-26 17-42 38-42s36 16 38 42z" />
      </svg>
      <span className="ab-ph-ini heading-font">{initials(p.name)}</span>
    </span>
  );
}

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

export default function AboutTeam() {
  const N = TEAM.length;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const step = useCallback((d: number) => setActive((a) => (a + d + N) % N), [N]);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* auto-advance: pauses on hover / keyboard focus, when off-screen, and for reduced motion.
     Any change of `active` restarts the timer. */
  useEffect(() => {
    if (hover || focus || !inView || reduce) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, hover, focus, inView, reduce, step]);

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Our team. Use the left and right arrow keys to browse."
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocus(true)}
      onBlur={() => setFocus(false)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="ab-team">
        {TEAM.map((p, i) => {
          const on = i === active;
          return (
            <div
              key={p.name}
              className={`ab-person${on ? " is-active" : ""}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            >
              <button type="button" className="ab-person-btn" aria-label={`Show ${p.name}, ${p.role}`} aria-current={on} onClick={() => setActive(i)} />

              <span className="ab-photo">
                {p.photo ? (
                  <Image src={p.photo} alt={on ? `${p.name}, ${p.role}` : ""} fill sizes="(min-width: 700px) 45vw, 100vw" className="ab-img" />
                ) : (
                  <Placeholder p={p} />
                )}
              </span>

              <span className="ab-num heading-font" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>

              <span className="ab-info" aria-hidden={!on}>
                <span className="ab-role body-font">{p.role}</span>
                <strong className="ab-name heading-font">{p.name}</strong>
                <span className="ab-bio body-font">{p.bio}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="ab-ctl">
        <button type="button" aria-label="Previous person" onClick={() => step(-1)} className="ab-arrow">
          <Chevron dir="l" />
        </button>
        <div className="ab-dots" role="group" aria-label="Choose a person">
          {TEAM.map((p, i) => (
            <button key={p.name} type="button" aria-label={`Show ${p.name}`} aria-current={i === active} onClick={() => setActive(i)} className="ab-dot-hit">
              <span className={`ab-dot${i === active ? " is-on" : ""}`} />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next person" onClick={() => step(1)} className="ab-arrow">
          <Chevron dir="r" />
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {TEAM[active].name}, {TEAM[active].role}
      </p>
    </div>
  );
}
