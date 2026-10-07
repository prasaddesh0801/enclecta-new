"use client";

import type { CSSProperties } from "react";
import { useVisit } from "./use-visit";

const ROWS = 2;

/**
 * Technology chips in 2 rows. Row 1 drifts left → right, row 2 drifts right → left, forever.
 * Each time the section scrolls into view the rows slide in from their own side (see .pw-rows in portfolio-v2.css).
 */
export default function TechRows({ tools }: { tools: string[] }) {
  const [ref, on] = useVisit<HTMLDivElement>(0.2);

  /* deal the tools out to the rows like cards, so every row gets a mix */
  const rows: string[][] = Array.from({ length: ROWS }, () => []);
  tools.forEach((t, i) => rows[i % ROWS].push(t));

  return (
    <>
      {/* the moving rows are decoration; screen readers get one plain list */}
      <ul className="pw-sr">
        {tools.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div ref={ref} className={`pw-rows${on ? " is-in" : ""}`} aria-hidden="true">
        {rows
          .filter((r) => r.length > 0)
          .map((row, r) => {
            /* repeat the row until one half is wider than a big screen, then draw it twice for a seamless loop */
            const half = Array.from({ length: Math.ceil(9 / row.length) }, () => row).flat();
            return (
              <div
                key={r}
                className={`pw-row ${r % 2 === 0 ? "pw-row-ltr" : "pw-row-rtl"}`}
                style={{ "--i": r, "--dur": `${58 + r * 12}s` } as CSSProperties}
              >
                <div className="pw-track">
                  {[0, 1].map((k) => (
                    <ul key={k} className="pw-half">
                      {half.map((t, i) => (
                        <li key={i} className="body-font">{t}</li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
