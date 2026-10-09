/**
 * Hero title — "PRICING". Same idea as services-title.tsx / contact-title.tsx: every letter is its own <text>
 * in a fixed slot, so the word spans the full 1000-unit width, and `.sv-giant text` in services-landing.css
 * makes the letters rise one after another. Server component, no JavaScript.
 * To nudge a letter, change its x / width below.
 */

const BASE_Y = 112;

/* letter, x, slot width */
const LETTERS: [string, number, number][] = [
  ["P", 0, 140], ["R", 169, 140], ["I", 338, 60], ["C", 427, 140], ["I", 596, 60], ["N", 685, 142], ["G", 858, 142],
];

export default function PricingTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Pricing">
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
