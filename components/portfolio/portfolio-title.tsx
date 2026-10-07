/**
 * Hero title — "PORTFOLIO". Same mechanics as services-title.tsx: each letter is its own <text> with a
 * fixed slot, so together they span the full 1000-unit width, and the CSS in services-landing.css
 * (`.sv-giant text`) makes them rise one after another.
 * To nudge a letter, change its weight in W (a bigger number = a wider slot).
 */

const BASE_Y = 112; // baseline of the letters
const WORD = "PORTFOLIO".split("");
const W = [1, 1.15, 1, 0.95, 0.92, 1.15, 0.85, 0.4, 1.15]; // relative slot widths, one per letter
const SPAN = 1004; // slots run from x = -4 to 1000, like the services title
const total = W.reduce((a, b) => a + b, 0);

let cursor = -4;
const LETTERS = WORD.map((ch, i) => {
  const w = (W[i] / total) * SPAN;
  const slot: [string, number, number] = [ch, Math.round(cursor), Math.round(w)];
  cursor += w;
  return slot;
});

export default function PortfolioTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Portfolio">
        {LETTERS.map(([ch, x, w], i) => (
          <text
            key={i}
            x={x}
            y={BASE_Y}
            textLength={w}
            lengthAdjust="spacingAndGlyphs"
            style={{ "--i": i } as React.CSSProperties}
            aria-hidden="true"
          >
            {ch}
          </text>
        ))}
      </svg>
    </h1>
  );
}
