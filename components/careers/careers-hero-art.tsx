import "@/components/services/services-hero-art.css"; // same styles as the services hero, nothing duplicated

/*
 * Careers hero artwork: the same glowing hub as the services and about heroes (same light, platform, rays,
 * swooshes, orbs, colours and animation), but the four glossy tiles carry career icons:
 * job (briefcase) / work from home (house) / join the team (rocket) / grow (rising arrow).
 * Tile colours come from the services CSS by slot name (web, code, marketing, growth), so the slot keys are kept.
 */

/* tile centres are in em, inside a 20em x 20em box */
const CHIPS = [
  { k: "web",       x: 2.3,  y: 8.9,  d: "-1.1s", in: "1.5s" },
  { k: "code",      x: 6.7,  y: 4.8,  d: "0s",    in: "1.7s" },
  { k: "marketing", x: 13.7, y: 6.0,  d: "-2.1s", in: "1.9s" },
  { k: "growth",    x: 17.7, y: 10.2, d: "-3.2s", in: "2.1s" },
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
  /* web slot -> jobs: briefcase */
  web: (
    <svg {...svgProps}>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.6" />
      <path d="M8.6 7.5V6a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.5M3 13h18" />
      <path d="M10.6 13v1.7h2.8V13" />
    </svg>
  ),
  /* code slot -> work from home: house */
  code: (
    <svg {...svgProps} strokeWidth={2.2}>
      <path d="M3.4 11.4 12 4l8.6 7.4" />
      <path d="M5.8 9.8V20h12.4V9.8" />
      <path d="M10 20v-5.4h4V20" />
    </svg>
  ),
  /* marketing slot -> join the team: rocket */
  marketing: (
    <svg {...svgProps} strokeWidth={1.9}>
      <path d="M12 3c3.2 2.1 4.8 5.2 4.8 9.2l-2 3.6H9.2l-2-3.6C7.2 8.2 8.8 5.1 12 3Z" />
      <circle cx="12" cy="10" r="1.7" />
      <path d="M7.4 13.2 4.6 15.6l.8 3 3-1.4M16.6 13.2l2.8 2.4-.8 3-3-1.4M10.4 18.4c.4 1.2.9 2 1.6 2.8.7-.8 1.2-1.6 1.6-2.8" />
    </svg>
  ),
  /* growth slot -> grow your career: rising arrow */
  growth: (
    <svg {...svgProps} strokeWidth={2.4}>
      <path d="m3.5 18.5 5.6-5.6 3.6 3.6 7.8-8.2" />
      <path d="M14.8 8.3h5.7V14" />
    </svg>
  ),
};

export default function CareersHeroArt() {
  return (
    <div className="sva" aria-hidden="true">
      <div className="sva-tilt">
        <div className="sva-scene">
          <span className="sva-aura" />
          <span className="sva-bloom" />
          <span className="sva-burst" />

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

          {ORBS.map((o, i) => (
            <i key={i} className="sva-orb" style={{ left: `${o.x}em`, top: `${o.y}em`, width: `${o.s}em`, height: `${o.s}em`, ["--fd" as string]: o.d } as React.CSSProperties} />
          ))}

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

          {CHIPS.map((c) => (
            <span
              key={c.k}
              className={`sva-chip sva-chip-${c.k}`}
              style={{ ["--x" as string]: c.x, ["--y" as string]: c.y, ["--in" as string]: c.in, ["--fd" as string]: c.d } as React.CSSProperties}
            >
              {ICONS[c.k]}
            </span>
          ))}

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
