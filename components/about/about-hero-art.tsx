import "@/components/services/services-hero-art.css"; // same styles as the services hero, nothing duplicated

/*
 * About hero artwork: the same glowing hub as the services hero (same light, platform, rays, swooshes, orbs,
 * colours and animation), but the four glossy tiles carry about-us icons:
 * team (people) / ideas (bulb) / care (heart) / goals (target).
 * The tile colours come from the services CSS by slot name (web = coral, code = blue, marketing = mint, growth = pink),
 * so the slot keys below are kept; only the icons are different.
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
  /* web slot -> team: two people */
  web: (
    <svg {...svgProps}>
      <circle cx="9" cy="8.4" r="3.4" />
      <path d="M2.6 19.6c.4-3.7 3-5.7 6.4-5.7s6 2 6.4 5.7" />
      <path d="M15.6 5.3a3.2 3.2 0 0 1 0 6.2M17.4 14.2c2.4.5 3.8 2.3 4.2 5.2" />
    </svg>
  ),
  /* code slot -> ideas: light bulb */
  code: (
    <svg {...svgProps} strokeWidth={2.2}>
      <path d="M9 18.2h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </svg>
  ),
  /* marketing slot -> care and values: heart */
  marketing: (
    <svg {...svgProps} strokeWidth={1.6}>
      <path d="M12 20.4s-7.6-4.6-7.6-10.5a4.3 4.3 0 0 1 7.6-2.7 4.3 4.3 0 0 1 7.6 2.7c0 5.9-7.6 10.5-7.6 10.5Z" fill="currentColor" />
    </svg>
  ),
  /* growth slot -> goals: target */
  growth: (
    <svg {...svgProps} strokeWidth={2.2}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  ),
};

export default function AboutHeroArt() {
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
