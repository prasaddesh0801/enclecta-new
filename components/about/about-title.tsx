/**
 * Hero title: "ABOUT US" rises from below the hero up to its place at the bottom of the section.
 * Same as services-title.tsx: pure CSS, each letter plays the rise animation from services-landing.css
 * (--i sets the stagger), so this is a server component.
 *
 * Each letter is its own <text> with a fixed slot; together they span the full 1000-unit width edge to edge.
 * To nudge a letter, change its x / width below.
 */

const BASE_Y = 112; // baseline of the letters

/* letter, x, slot width  (ABOUT, a wider gap, US) */
const LETTERS: [string, number, number][] = [
  ["A", 5, 110], ["B", 139, 110], ["O", 273, 110], ["U", 407, 110], ["T", 541, 110],
  ["U", 751, 110], ["S", 885, 110],
];

export default function AboutTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="About us">
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
