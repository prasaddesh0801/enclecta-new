import "./services-hero-art.css";

/*
 * Services hero artwork — glowing service hub.
 * Layout follows the reference: a lit round platform, a rising light column,
 * four tilted glossy icon tiles (web / code / marketing / growth),
 * thin glowing swooshes from the platform to each tile, and floating orbs.
 */

/* tile centres are in em, inside a 20em x 20em box */
const CHIPS = [
  { k: "web",       x: 2.3,  y: 8.9,  d: "-1.1s" , in: "1.5s" },
  { k: "code",      x: 6.7,  y: 4.8,  d: "0s" , in: "1.7s" },
  { k: "marketing", x: 13.7, y: 6.0,  d: "-2.1s" , in: "1.9s" },
  { k: "growth",    x: 17.7, y: 10.2, d: "-3.2s" , in: "2.1s" },
];

/* swooshes: platform -> each tile */
const LINES = [
  "M9 14.3C6.9 14.3 5.2 12.6 3.9 10.7",
  "M9.5 13.9C8.9 11.2 8 8.6 7.3 6.9",
  "M10.6 13.9C11.5 11.2 12.4 8.8 13.1 7.3",
  "M11.1 14.3C13.6 14.2 15.9 13.2 17.2 11.9",
];

/* one semicircular glow: from the leftmost icon, over the top, to the rightmost icon */
const O = [10, 12.9];
const R = 8.6;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${Math.round((O[0] + r * Math.sin(a)) * 100) / 100} ${Math.round((O[1] - r * Math.cos(a)) * 100) / 100}`;
};
/* the beam's base is the whole top surface of the platform (x 6.9 -> 13.1), not a single point */
const BASE_Y = 13.1, BASE_L = 6.9, BASE_R = 13.1;
const sector = (r: number) => `M${BASE_L} ${BASE_Y} L${pt(-72, r)} A${r} ${r} 0 0 1 ${pt(76, r)} L${BASE_R} ${BASE_Y} Z`;
const FAN_OUTER = sector(R);

const ORBS = [
  { x: 3.4,  y: 6.2,  s: 0.5,  d: "0s" },
  { x: 17.1, y: 7.0,  s: 0.6,  d: "-1.4s" },
  { x: 13.1, y: 10.7, s: 0.55, d: "-2.6s" },
  { x: 2.9,  y: 12.8, s: 0.7,  d: "-3.4s" },
  { x: 15.8, y: 13.5, s: 0.55, d: "-0.8s" },
];

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  web: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.3 2.3 3.4 5.1 3.4 8.4s-1.1 6.1-3.4 8.4c-2.3-2.3-3.4-5.1-3.4-8.4s1.1-6.1 3.4-8.4ZM5 7.6c4.5 1.6 9.5 1.6 14 0M5 16.4c4.5-1.6 9.5-1.6 14 0" />
    </svg>
  ),
  code: (
    <svg {...svgProps} strokeWidth={2.6}>
      <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.4 4.8l-2.8 14.4" />
    </svg>
  ),
  marketing: (
    <svg {...svgProps} strokeWidth={1.6}>
      <path d="M3.5 9.8h4.3L17 5.2v13.6l-9.2-4.6H3.5z" fill="currentColor" />
      <path d="M7 14.4 8.4 19.5h2.6l-1.2-4.8" fill="currentColor" />
      <path d="M19.4 9.2c1.2.8 1.8 1.7 1.8 2.8s-.6 2-1.8 2.8" strokeWidth={2} />
    </svg>
  ),
  growth: (
    <svg {...svgProps} strokeWidth={0} fill="currentColor">
      <rect x="3.6" y="13" width="3.8" height="7" rx="1.2" />
      <rect x="9.6" y="9" width="3.8" height="11" rx="1.2" />
      <rect x="15.6" y="4.5" width="3.8" height="15.5" rx="1.2" />
    </svg>
  ),
};

export type HeroChipKey = "web" | "code" | "marketing" | "growth";

/** `icons` swaps the glyph on any of the four tiles (the tile colours stay), so other pages
 *  (privacy, terms, about, careers) can reuse the same glowing hub with their own icons. */
export default function HeroArt({ icons }: { icons?: Partial<Record<HeroChipKey, React.ReactNode>> } = {}) {
  return (
    <div className="sva" aria-hidden="true">
      <div className="sva-tilt">
        <div className="sva-scene">
          {/* soft atmospheric glow + bloom that spreads from the platform to every icon */}
          <span className="sva-aura" />
          <span className="sva-bloom" />

          {/* clean light burst from the platform */}
          <span className="sva-burst" />

          {/* semicircular glow */}
          <svg className="sva-rays" viewBox="0 0 20 20" focusable="false">
            <defs>
              <radialGradient id="sva-sg" gradientUnits="userSpaceOnUse" cx={O[0]} cy={O[1]} r={R}>
                <stop offset="0" stopColor="#fff" stopOpacity="1" />
                <stop offset=".3" stopColor="#f3ecff" stopOpacity=".62" />
                <stop offset=".7" stopColor="#dccdff" stopOpacity=".3" />
                <stop offset="1" stopColor="#cdbaff" stopOpacity=".1" />
              </radialGradient>
            </defs>
            <path className="sva-ray" d={FAN_OUTER} fill="url(#sva-sg)" />
          </svg>

          {/* floating orbs */}
          {ORBS.map((o, i) => (
            <i key={i} className="sva-orb" style={{ left: `${o.x}em`, top: `${o.y}em`, width: `${o.s}em`, height: `${o.s}em`, ["--fd" as string]: o.d } as React.CSSProperties} />
          ))}

          {/* glowing swooshes */}
          <svg className="sva-lines" viewBox="0 0 20 20" focusable="false">
            <defs>
              <linearGradient id="sva-lg" gradientUnits="userSpaceOnUse" x1="0" y1="14.5" x2="0" y2="6">
                <stop offset="0" stopColor="#fff" stopOpacity=".95" />
                <stop offset="1" stopColor="#dccbff" stopOpacity=".55" />
              </linearGradient>
            </defs>
            {LINES.map((d, i) => <path key={`b${i}`} className="sva-line" d={d} pathLength={1} style={{ animationDelay: `${1.1 + i * 0.15}s` }} />)}
            {LINES.map((d, i) => <path key={`f${i}`} className="sva-line sva-line-flow" d={d} style={{ ["--fd" as string]: `-${i * 0.8}s` } as React.CSSProperties} />)}
          </svg>

          {/* icon tiles */}
          {CHIPS.map((c) => (
            <span
              key={c.k}
              className={`sva-chip sva-chip-${c.k}`}
              style={{ ["--x" as string]: c.x, ["--y" as string]: c.y, ["--in" as string]: c.in, ["--fd" as string]: c.d } as React.CSSProperties}
            >
              {icons?.[c.k as HeroChipKey] ?? ICONS[c.k]}
            </span>
          ))}

          {/* round lit platform */}
          <div className="sva-platform">
            <span className="sva-pf-ring" />
            <span className="sva-pf-low" />
            <span className="sva-pf-up" />
            <span className="sva-pf-glow" />
          </div>
        </div>
      </div>
    </div>
  );
}
