"use client";

import type { CSSProperties } from "react";
import { useVisit } from "./use-visit";

/**
 * "How every project runs": the steps appear one by one (about 0.7s apart) every time the section scrolls into view,
 * and each number pops as its card lands (see .pw-steps in portfolio-v2.css).
 */
export default function ProcessSteps({ steps }: { steps: [string, string][] }) {
  const [ref, on] = useVisit<HTMLOListElement>(0.25);
  return (
    <ol ref={ref} className={`pw-steps${on ? " is-in" : ""}`}>
      {steps.map(([title, text], i) => (
        <li key={title} style={{ "--i": i } as CSSProperties}>
          <div className="pw-step">
            <span className="heading-font pw-step-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="heading-font">{title}</h3>
            <p className="body-font">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
