/**
 * Hero title — "CONTACT US". Same idea as services-title.tsx: every letter is its own <text> in a fixed slot,
 * so the word spans the full 1000-unit width, and `.sv-giant text` in services-landing.css makes the
 * letters rise one after another. Server component, no JavaScript.
 * To nudge a letter, change its x / width below.
 */

const BASE_Y = 112;

/* letter, x, slot width */
const LETTERS: [string, number, number][] = [
  ["C", 6, 105], ["O", 111, 112], ["N", 223, 108], ["T", 331, 98], ["A", 429, 110], ["C", 539, 105], ["T", 644, 98],
  /* word gap, then US */
  ["U", 786, 108], ["S", 894, 100],
];

export default function ContactTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Contact us">
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
