"use client";

import { useRef } from "react";
import Ico from "@/components/services/service-icons";
import { useLoop } from "./use-loop";

/* Benefits as a tabbed showcase. It plays through the perks one by one (starting at 01 every time the visitor
   arrives) and loops; visitors can also pick any tab by hand. Arrow keys / Home / End move between tabs.
   Items come from careers-landing.tsx. Timing: PERK_MS below. */

const PERK_MS = 2000; // each perk shows for 2 seconds

export type Perk = {
  title: string;
  text: string;
  points: string[];
  tone: "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";
  icon: string;
};

export default function CareersPerks({ items }: { items: Perk[] }) {
  const { ref, active: on, cycle, running, autoplay, next, pick, setPaused } = useLoop(items.length);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = items[on];

  const go = (i: number) => {
    const n = (i + items.length) % items.length;
    pick(n);
    tabs.current[n]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(on + 1); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(on - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(items.length - 1); }
  };

  return (
    <div
      ref={ref}
      className="cr-perks"
      data-run={running}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cr-ptabs" role="tablist" aria-label="Benefits" onKeyDown={onKey}>
        {items.map((p, i) => (
          <button
            key={p.title}
            ref={(el) => { tabs.current[i] = el; }}
            id={`cr-ptab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === on}
            aria-controls="cr-ppanel"
            tabIndex={i === on ? 0 : -1}
            className={`cr-ptab body-font cr-t-${p.tone}${i === on ? " is-on" : ""}`}
            onClick={() => pick(i)}
          >
            <span className="cr-ptab-ic"><Ico name={p.icon} /></span>
            <span className="cr-ptab-name">{p.title}</span>
            {autoplay && i === on && (
              <i
                key={`${i}-${cycle}`}
                className="cr-bar"
                style={{ "--ms": `${PERK_MS}ms` } as React.CSSProperties}
                onAnimationEnd={next}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <div
        key={on}
        id="cr-ppanel"
        role="tabpanel"
        aria-labelledby={`cr-ptab-${on}`}
        className={`cr-ppanel cr-t-${cur.tone}`}
      >
        <span className="cr-pnum heading-font" aria-hidden="true">{String(on + 1).padStart(2, "0")}</span>
        <span className="cr-ic cr-ic-lg"><Ico name={cur.icon} /></span>
        <h3 className="heading-font cr-ptitle">{cur.title}</h3>
        <p className="body-font cr-ptext">{cur.text}</p>
        <ul className="cr-pts body-font">
          {cur.points.map((t) => (
            <li key={t}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
