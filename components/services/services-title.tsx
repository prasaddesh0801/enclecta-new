/**
 * Hero title — "OUR SERVICES" rises from below the hero up to its place at the bottom of the section.
 *
 * Pure CSS: each letter plays the `sv-title-rise` keyframes in services-landing.css, one slightly after
 * the other (--i sets the stagger). No JavaScript, so this is a server component.
 * Each letter is its own <text> with a fixed slot, so together they span the full 1000-unit width edge to
 * edge. To nudge a letter, change its x / width below.
 *
 * Tuning (services-landing.css, `.sv-giant text`): duration 1.1s · stagger 0.06s per letter
 * (set the stagger to 0s to make the whole title rise as one piece).
 */

const BASE_Y = 112; // baseline of the letters

/* letter, x, slot width */
const LETTERS: [string, number, number][] = [
  ["O", -4, 102], ["U", 98, 101], ["R", 199, 83],
  ["S", 327, 97], ["E", 424, 84], ["R", 508, 86], ["V", 594, 100], ["I", 694, 37], ["C", 731, 100], ["E", 831, 80], ["S", 911, 89],
];

export default function ServicesTitle() {
  return (
    <h1 id="sv-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label="Our services">
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
