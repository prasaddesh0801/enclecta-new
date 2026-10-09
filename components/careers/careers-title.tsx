/**
 * Hero title: "CAREERS" rises from below the hero, same technique as about-title.tsx / services-title.tsx
 * (each letter plays the rise animation from services-landing.css; --i sets the stagger).
 * Each letter has a fixed slot and together they span the full 1000-unit width edge to edge.
 * To nudge a letter, change its x / width below.
 */

const BASE_Y = 112; // baseline of the letters

/* letter, x, slot width  (C A R E E R S) */
const LETTERS: [string, number, number][] = [
  ["C", 5, 130], ["A", 148, 130], ["R", 292, 130], ["E", 435, 130], ["E", 578, 130], ["R", 722, 130], ["S", 865, 130],
];

export default function CareersTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Careers">
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
