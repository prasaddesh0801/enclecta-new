/**
 * Giant hero title for the legal pages — same letter-by-letter rise as services-title.tsx
 * ("OUR SERVICES"), but it lays any text out edge to edge across the 1000-unit width.
 * Narrow glyphs (I) get a thin slot, wide ones (M, W) a wider one, spaces a small gap.
 * The animation and look come from `.sv-giant` in services-landing.css.
 */

const BASE_Y = 112;

const weight = (ch: string) => {
  if (ch === " ") return 0.5;
  if (ch === "I") return 0.4;
  if (ch === "M" || ch === "W") return 1.15;
  return 1;
};

export function layoutTitle(text: string) {
  const chars = text.toUpperCase().split("");
  const total = chars.reduce((n, c) => n + weight(c), 0);
  let x = 0;
  return chars.map((ch) => {
    const w = (weight(ch) / total) * 1000;
    const slot = { ch, x, w };
    x += w;
    return slot;
  });
}

export default function LegalTitle({ text, label }: { text: string; label: string }) {
  let i = 0;
  return (
    <h1 id="lg-hero-title" className="sv-giant-wrap">
      <svg className="heading-font sv-giant" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label={label}>
        {layoutTitle(text).map(({ ch, x, w }, k) =>
          ch === " " ? null : (
            <text
              key={k}
              x={x}
              y={BASE_Y}
              textLength={w - 4}
              lengthAdjust="spacingAndGlyphs"
              style={{ "--i": i++ } as React.CSSProperties}
              aria-hidden="true"
            >
              {ch}
            </text>
          ),
        )}
      </svg>
    </h1>
  );
}
