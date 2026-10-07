import "../services/services-hero-art.css"; /* same hub, glow and tile styles as /services */

/*
 * Services hero artwork — glowing contact hub (same scene as /services, contact icons).
 * Layout follows the reference: a lit round platform, a rising light column,
 * four tilted glossy icon tiles (mail / phone / chat / location),
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

/* keys web / code / marketing / growth only pick each tile's colour and tilt; the drawing is the contact icon */
const ICONS: Record<string, React.ReactNode> = {
  /* mail */
  web: (
    <svg {...svgProps}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.6" />
      <path d="m3.8 7.6 8.2 6 8.2-6" />
    </svg>
  ),
  /* phone */
  code: (
    <svg {...svgProps} strokeWidth={1.8} fill="currentColor">
      <path d="M6.2 3.8h3.1l1.5 4.1-2 1.4a10.6 10.6 0 0 0 5.9 5.9l1.4-2 4.1 1.5v3.1a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.2 6a2 2 0 0 1 2-2.2Z" />
    </svg>
  ),
  /* chat */
  marketing: (
    <svg {...svgProps} strokeWidth={1.6}>
      <path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.6 3.5V16.5H4.5A1.5 1.5 0 0 1 3 15V7a1.5 1.5 0 0 1 1.5-1.5Z" fill="currentColor" />
      <path d="M7.8 10h8.4M7.8 13h5" stroke="#8a78e0" strokeWidth={1.6} />
    </svg>
  ),
  /* location pin */
  growth: (
    <svg {...svgProps} strokeWidth={1.6}>
      <path d="M12 21.5s7-6 7-11.6a7 7 0 1 0-14 0c0 5.6 7 11.6 7 11.6Z" fill="currentColor" />
      <circle cx="12" cy="9.8" r="2.5" fill="#d45db0" stroke="none" />
    </svg>
  ),
};

export default function ContactHeroArt() {
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
              {ICONS[c.k]}
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
