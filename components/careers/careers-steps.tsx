"use client";

import { useEffect, useRef, useState } from "react";
import Ico from "@/components/services/service-icons";

/* Hiring steps as a timeline. The cards start invisible and appear one by one in number order:
   01 slides in from the left, 02 from the right, 03 from the left, 04 from the right.
   The latest card is highlighted and the line fills down to it. It plays ONCE per visit: after 04 appears
   everything stays visible (no repeating while the visitor stays here). Leave the section and come back and it
   plays again from 01. Visitors can click a step's round icon (or its card) to highlight it. Timing is set below. */

const FIRST_MS = 400; // wait before 01 appears
const STEP_MS = 1300; // gap between one card and the next

export type StepItem = {
  title: string;
  text: string;
  icon: string;
  tone: "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";
};

export default function CareersSteps({ items }: { items: StepItem[] }) {
  const n = items.length;
  const ref = useRef<HTMLDivElement | null>(null);
  const lis = useRef<(HTMLLIElement | null)[]>([]);
  const [shown, setShown] = useState(0); // how many cards are visible
  const [active, setActive] = useState(0); // the highlighted step
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* every visit starts again from 01; with "reduce motion" everything is simply shown */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    if (rm) {
      setShown(n);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(0);
          setActive(0);
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);

  /* the sequence: reveal the next card, then stop once all are visible */
  useEffect(() => {
    if (!inView || paused || reduced || shown >= n) return;
    const id = setTimeout(() => {
      setShown(shown + 1);
      setActive(shown);
    }, shown === 0 ? FIRST_MS : STEP_MS);
    return () => clearTimeout(id);
  }, [inView, paused, reduced, shown, n]);

  const pick = (i: number) => {
    setActive(i);
    setShown((s) => Math.max(s, i + 1));
  };

  /* the progress line ends at the centre of the highlighted step's round icon */
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const place = () => {
      const li = lis.current[active];
      const node = li?.querySelector<HTMLElement>(".cr-node");
      if (!li || !node) return;
      wrap.style.setProperty("--fill", `${li.offsetTop + node.offsetTop + node.offsetHeight / 2}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div
      ref={ref}
      className="cr-tl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <i className="cr-tl-fill" aria-hidden="true" />
      <ol className="cr-tl-list">
        {items.map((s, i) => {
          const visible = i < shown;
          const state = !visible ? "" : i === active ? " is-shown is-on" : i < active ? " is-shown is-done" : " is-shown";
          return (
            <li key={s.title} ref={(el) => { lis.current[i] = el; }} className={`cr-tl-item cr-t-${s.tone}${state}`}>
              <button
                type="button"
                className="cr-node"
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === active ? "step" : undefined}
                onClick={() => pick(i)}
              >
                <Ico name={s.icon} />
              </button>
              <div className="cr-tl-card" aria-hidden={!visible} onClick={() => pick(i)}>
                <span className="cr-tl-no heading-font" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="heading-font cr-bt-h">{s.title}</h3>
                <p className="body-font cr-bt-t">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
