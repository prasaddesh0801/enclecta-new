import "./services-hero-sky.css";

/**
 * Services hero sky v4 — soft pastel, pure SVG + CSS (no images).
 * Light = warm peach / pink / lavender / sky-blue day with pastel clouds, yellow sparkles, shooting stars.
 * Dark  = deep indigo night with simple twinkling stars.
 * Follows [data-theme="dark"] on any ancestor. Server-component safe (all seeded).
 * Usage: replace <div className="sv-hero-bg" /> with <HeroSky />.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const n1 = (n: number) => Math.round(n * 10) / 10;

type Puff = { x: number; y: number; r: number };
type Pts = [number, number][];

const ridgeOf = (pts: Pts) => (x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    if (x <= pts[i + 1][0]) {
      const t = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      return pts[i][1] + t * (pts[i + 1][1] - pts[i][1]);
    }
  }
  return pts[pts.length - 1][1];
};

/** Big round puffs along a ridge, filling down past the bottom edge. */
function bank(seed: number, pts: Pts, x0: number, x1: number, step: number, rBase: number): Puff[] {
  const rand = rng(seed);
  const ridge = ridgeOf(pts);
  const out: Puff[] = [];
  for (let x = x0; x <= x1; x += step) {
    const bx = x + (rand() - 0.5) * step * 0.5;
    const r = rBase * (0.8 + rand() * 0.45);
    out.push({ x: n1(bx), y: n1(ridge(bx) + r * 0.55), r: n1(r) });
    out.push({ x: n1(bx + step * 0.1), y: n1(ridge(bx) + r * 1.5), r: n1(r * 1.2) });
    out.push({ x: n1(bx), y: n1(ridge(bx) + r * 2.7 + 140), r: n1(r * 1.6) });
  }
  return out;
}

const BACK: Pts = [[-100, 700], [380, 735], [800, 710], [1200, 735], [1700, 690]];
const LEFT: Pts = [[-120, 430], [100, 440], [300, 520], [520, 620], [760, 715], [980, 775], [1100, 805]];
const CENTER: Pts = [[760, 835], [950, 800], [1150, 810], [1320, 840]];
const RIGHT: Pts = [[1150, 815], [1300, 745], [1450, 690], [1600, 655], [1720, 640]];

const B = {
  back: bank(5, BACK, -100, 1700, 130, 70),
  left: bank(23, LEFT, -120, 1080, 105, 92),
  center: bank(41, CENTER, 740, 1340, 100, 70),
  right: bank(67, RIGHT, 1140, 1720, 100, 86),
};

/* dark theme stars: simple, they only twinkle */
const STARS = (() => {
  const rand = rng(909);
  return Array.from({ length: 150 }, () => ({
    x: n1(rand() * 1600),
    y: n1(Math.pow(rand(), 1.4) * 700),
    r: n1(0.5 + rand() * rand() * 1.3),
    o: n1(0.45 + rand() * 0.55),
    d: n1(rand() * 8),
    t: n1(4 + rand() * 4),
  }));
})();

/* light theme: tiny white dots + shooting stars (head x,y → tail x,y) */
const DOTS = [[980, 300], [640, 500], [1180, 470], [420, 250], [790, 120], [1500, 380]];
const SHOOTERS = [
  { hx: 750, hy: 318, tx: 880, ty: 236, d: 0 },
  { hx: 952, hy: 332, tx: 1150, ty: 222, d: 2.4 },
  { hx: 1480, hy: 360, tx: 1600, ty: 288, d: 4.6 },
];

const star4 = (x: number, y: number, s: number) =>
  `M${x} ${y - s} Q${x + s * 0.14} ${y - s * 0.14} ${x + s} ${y} Q${x + s * 0.14} ${y + s * 0.14} ${x} ${y + s} Q${x - s * 0.14} ${y + s * 0.14} ${x - s} ${y} Q${x - s * 0.14} ${y - s * 0.14} ${x} ${y - s}Z`;

/* Sparkles live in the EMPTY sky only — positions are % of the hero (x, y), size in rem, d = pulse offset.
   The copy sits top-left (x 5–35%, y 20–50%), the planet top-right, the title along the bottom, so these
   spots stay clear of all three. off = hidden on phones, where the copy fills the width. */
const SPARKLES: { x: number; y: number; s: number; d: number; off?: boolean; mx?: number; my?: number }[] = [
  { x: 31, y: 11, s: 1.5, d: 0, mx: 88, my: 5 },
  { x: 45, y: 15, s: 2.1, d: 1.6, off: true },
  { x: 54, y: 40, s: 1.1, d: 2.8, off: true },
  { x: 68, y: 20, s: 0.9, d: 3.4, off: true },
  { x: 93, y: 10, s: 1.3, d: 0.8, mx: 8, my: 54 },
  { x: 46, y: 53, s: 0.9, d: 2.2, off: true },
];
/* mx / my = where a sparkle sits on phones (% of the hero). Sparkles without them are hidden on phones. */
const SPARK_PATH = star4(0, 0, 10);

const PR = 135; // planet radius
const RX = 288;
const RY = 70;
const RING = `M${-RX} 0 A${RX} ${RY} 0 1 1 ${RX} 0 A${RX} ${RY} 0 1 1 ${-RX} 0`;
const CRATERS = [
  { x: -30, y: -78, rx: 30, ry: 22, r: -20 },
  { x: -82, y: 20, rx: 22, ry: 17, r: 18 },
  { x: 52, y: 52, rx: 26, ry: 18, r: -10 },
  { x: 62, y: -52, rx: 14, ry: 10, r: 25 },
  { x: -20, y: 82, rx: 12, ry: 9, r: 0 },
];

/** The planet + ring drawing, centred on (0,0). Its gradients and clip paths live in the shared <defs> in HeroSky. */
function Planet() {
  return (
    <>
      <g clipPath="url(#sky-ring-back)">
        <path d={RING} fill="none" stroke="url(#sky-ring)" strokeWidth="22" opacity=".6" />
        <path d={RING} pathLength="100" fill="none" className="sky-ring-flow" style={{ stroke: "var(--sky-ring-hi)" }} strokeWidth="6" strokeLinecap="round" strokeDasharray="7 43" opacity=".5" />
      </g>
      <circle r={PR} fill="url(#sky-pl)" />
      <g clipPath="url(#sky-pl-clip)">
        {CRATERS.map((c, i) => (
          <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} transform={`rotate(${c.r} ${c.x} ${c.y})`} style={{ fill: "var(--sky-crater)" }} />
        ))}
      </g>
      <circle r={PR} fill="none" style={{ stroke: "var(--sky-rim)" }} strokeWidth="14" filter="url(#sky-glow)" opacity=".6" />
      <g clipPath="url(#sky-ring-front)">
        <path d={RING} fill="none" stroke="url(#sky-ring)" strokeWidth="22" />
        <path d={RING} pathLength="100" fill="none" className="sky-ring-flow" style={{ stroke: "var(--sky-ring-hi)" }} strokeWidth="14" strokeLinecap="round" strokeDasharray="10 40" opacity=".35" />
        <path d={RING} pathLength="100" fill="none" className="sky-ring-flow" style={{ stroke: "var(--sky-ring-hi)" }} strokeWidth="4" strokeLinecap="round" strokeDasharray="7 43" opacity=".9" />
      </g>
    </>
  );
}

/** Soft, smoothly merged cloud: gooey-filtered circles + a lighter highlight copy. */
function Cloud({ puffs, fill, warm }: { puffs: Puff[]; fill: string; warm?: boolean }) {
  return (
    <>
      <g filter="url(#sky-goo)">
        {puffs.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={fill} />
        ))}
      </g>
      <g filter="url(#sky-goo-soft)" className={warm ? "sky-hl sky-hl-warm" : "sky-hl"}>
        {puffs.map((p, i) => (
          <circle key={i} cx={p.x - p.r * 0.1} cy={p.y - p.r * 0.34} r={p.r * 0.6} />
        ))}
      </g>
    </>
  );
}

const grad = (id: string, y1: number, y2: number, v: string) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
    <stop offset="0" style={{ stopColor: `var(--sky-${v}-hi)` }} />
    <stop offset=".34" style={{ stopColor: `var(--sky-${v}-mid)` }} />
    <stop offset="1" style={{ stopColor: `var(--sky-${v}-lo)` }} />
  </linearGradient>
);

export default function HeroSky() {
  return (
    <div className="sv-hero-bg sky" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }} focusable="false">
        <defs>
          <filter id="sky-goo" colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="13" result="b" />
            <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="g" />
            <feGaussianBlur in="g" stdDeviation="1.2" />
          </filter>
          <filter id="sky-goo-soft" colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="sky-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          {grad("sky-cl", 400, 900, "l")}
          {grad("sky-cm", 740, 900, "m")}
          {grad("sky-cr", 600, 900, "r")}
          <linearGradient id="sky-cloud-back" gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="0" y2="900">
            <stop offset="0" style={{ stopColor: "var(--sky-b-hi)" }} />
            <stop offset="1" style={{ stopColor: "var(--sky-b-lo)" }} />
          </linearGradient>
          {/* planet gradients + clip paths, shared by the desktop and phone planet */}
          <radialGradient id="sky-pl" cx=".34" cy=".28" r=".95">
            <stop offset="0" style={{ stopColor: "var(--sky-pl-a)" }} />
            <stop offset=".6" style={{ stopColor: "var(--sky-pl-b)" }} />
            <stop offset="1" style={{ stopColor: "var(--sky-pl-c)" }} />
          </radialGradient>
          <linearGradient id="sky-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--sky-ring-a)" }} />
            <stop offset=".5" style={{ stopColor: "var(--sky-ring-b)" }} />
            <stop offset="1" style={{ stopColor: "var(--sky-ring-c)" }} />
          </linearGradient>
          <clipPath id="sky-pl-clip"><circle r={PR} /></clipPath>
          <clipPath id="sky-ring-back"><rect x="-340" y="-140" width="680" height="140" /></clipPath>
          <clipPath id="sky-ring-front"><rect x="-340" y="0" width="680" height="140" /></clipPath>
        </defs>
      </svg>

      {/* base colour, crossfades between themes */}
      <div className="sky-fill sky-day" />
      <div className="sky-fill sky-night" />

      {/* light: tiny dots + shooting stars */}
      <svg className="sky-layer sky-day" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          {SHOOTERS.map((s, i) => (
            <linearGradient key={i} id={`sky-sh${i}`} gradientUnits="userSpaceOnUse" x1={s.hx} y1={s.hy} x2={s.tx} y2={s.ty}>
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity=".8" className="sky-dot" style={{ animationDelay: `-${i * 1.3}s` }} />
        ))}
        {SHOOTERS.map((s, i) => (
          <g key={i} className="sky-shooter" style={{ animationDelay: `${s.d}s` }}>
            <path d={`M${s.hx} ${s.hy} Q${(s.hx + s.tx) / 2 - 6} ${(s.hy + s.ty) / 2 - 12} ${s.tx} ${s.ty}`} fill="none" stroke={`url(#sky-sh${i})`} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx={s.hx} cy={s.hy} r="4" fill="#fff" />
          </g>
        ))}
      </svg>

      {/* dark: soft nebula + simple twinkling stars */}
      <svg className="sky-layer sky-night" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs><filter id="sky-neb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70" /></filter></defs>
        <g filter="url(#sky-neb)">
          <ellipse cx="1180" cy="330" rx="330" ry="150" fill="#a855f7" opacity=".42" />
          <ellipse cx="1320" cy="520" rx="260" ry="150" fill="#38bdf8" opacity=".3" />
          <ellipse cx="900" cy="470" rx="240" ry="120" fill="#ec4899" opacity=".2" />
          <ellipse cx="300" cy="180" rx="280" ry="130" fill="#4f46e5" opacity=".3" />
        </g>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#ece9ff"
            className="sky-star"
            style={{ "--o": s.o, "--t": `${s.t}s`, "--d": `-${s.d}s` } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* sparkles: yellow in light, white in dark — a soft pulse, placed in the empty sky */}
      {SPARKLES.map((s, i) => (
        <svg
          key={i}
          className={`sky-spk${s.off ? " sm-off" : ""}`}
          viewBox="-11 -11 22 22"
          focusable="false"
          style={
            {
              "--x": `${s.x}%`,
              "--y": `${s.y}%`,
              ...(s.mx != null && s.my != null ? { "--mx": `${s.mx}%`, "--my": `${s.my}%` } : {}),
              width: `${s.s}rem`,
              height: `${s.s}rem`,
              animationDelay: `-${s.d + 1}s`,
            } as React.CSSProperties
          }
        >
          <path d={SPARK_PATH} />
        </svg>
      ))}

      {/* ringed planet, top-right on wide screens (clear of the intro copy) */}
      <svg className="sky-layer sky-orbit sky-orbit-d" viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMin slice" focusable="false">
        <g transform="translate(1262 205) rotate(-16)">
          <Planet />
        </g>
      </svg>

      {/* phones: the same planet, smaller, parked in the empty sky between the intro copy and the title */}
      <svg className="sky-orbit sky-orbit-m" viewBox="-300 -160 600 320" focusable="false">
        <g transform="rotate(-16)">
          <Planet />
        </g>
      </svg>

      {/* clouds, back to front */}
      <svg className="sky-layer sky-clouds sky-drift-b" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
        <g opacity=".75"><Cloud puffs={B.back} fill="url(#sky-cloud-back)" /></g>
      </svg>
      <svg className="sky-layer sky-clouds sky-drift-a" viewBox="0 0 1600 900" preserveAspectRatio="xMinYMax slice" focusable="false">
        <Cloud puffs={B.left} fill="url(#sky-cl)" />
      </svg>
      <svg className="sky-layer sky-clouds sky-drift-b" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
        <Cloud puffs={B.center} fill="url(#sky-cm)" warm />
      </svg>
      <svg className="sky-layer sky-clouds sky-drift-c" viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMax slice" focusable="false">
        <Cloud puffs={B.right} fill="url(#sky-cr)" warm />
      </svg>

      <div className="sky-fill sky-foot" />
    </div>
  );
}
