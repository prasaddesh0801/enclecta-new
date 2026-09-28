/* =========================================================
   TEMPLATE SHOWCASE — CARD CONTENT
   Each entry is one website type. `draw` paints a realistic
   page mock-up (nav, hero, imagery, sections) onto a 1280×800
   canvas that the 3D ring uses as a texture.

   To add / change a card: edit or add an object in TEMPLATES.
   The ring, chips, dots and info bar all follow automatically.
   ========================================================= */

export type Fonts = { display: string; text: string; serif: string; mono: string };

export type Template = {
  id: string;
  name: string;
  /** short label of the website type, shown in chips + info bar */
  type: string;
  blurb: string;
  features: string[];
  /** address shown in the mock browser bar */
  url: string;
  /** dark browser chrome for dark sites */
  dark: boolean;
  /** colour used for the small swatch next to the name */
  accent: string;
  draw: (c: C) => void;
};

type C = CanvasRenderingContext2D;
type Fill = string | CanvasGradient;

export const CARD_W = 1280;
export const CARD_H = 800;
const BAR = 56; // mock browser bar
const VW = CARD_W;
const VH = CARD_H - BAR; // drawable page area: 1280 × 744

/* ---------- fonts ---------- */

/** Reads the site's next/font families (set in layout.tsx) so the mock-ups use
 *  the same display/text faces as the rest of the website. */
export function getFonts(): Fonts {
  let display = "";
  let text = "";
  if (typeof document !== "undefined") {
    const cs = getComputedStyle(document.documentElement);
    display = cs.getPropertyValue("--font-display").trim();
    text = cs.getPropertyValue("--font-text").trim();
  }
  return {
    display: `${display ? display + "," : ""} "Space Grotesk", system-ui, sans-serif`,
    text: `${text ? text + "," : ""} Inter, system-ui, sans-serif`,
    serif: `Georgia, "Times New Roman", serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
  };
}

let F: Fonts = getFonts();

/* ---------- drawing helpers ---------- */

function rp(c: C, x: number, y: number, w: number, h: number, r: number | number[] = 0) {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r];
  c.beginPath();
  c.moveTo(x + tl, y);
  c.lineTo(x + w - tr, y);
  c.arcTo(x + w, y, x + w, y + tr, tr);
  c.lineTo(x + w, y + h - br);
  c.arcTo(x + w, y + h, x + w - br, y + h, br);
  c.lineTo(x + bl, y + h);
  c.arcTo(x, y + h, x, y + h - bl, bl);
  c.lineTo(x, y + tl);
  c.arcTo(x, y, x + tl, y, tl);
  c.closePath();
}

function box(c: C, x: number, y: number, w: number, h: number, r: number | number[], fill: Fill, line?: string) {
  rp(c, x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = 1.5;
    c.stroke();
  }
}

function lg(c: C, x0: number, y0: number, x1: number, y1: number, ...cols: string[]) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  cols.forEach((col, i) => g.addColorStop(cols.length === 1 ? 0 : i / (cols.length - 1), col));
  return g;
}

/** soft radial light; rgb like "120,110,255" */
function glow(c: C, x: number, y: number, r: number, rgb: string, a: number) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}

function dot(c: C, x: number, y: number, r: number, fill: Fill) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}

function shadowed(c: C, blur: number, dy: number, col: string, fn: () => void) {
  c.save();
  c.shadowColor = col;
  c.shadowBlur = blur;
  c.shadowOffsetY = dy;
  fn();
  c.restore();
}

type TO = { w?: number | string; f?: string; a?: number; al?: CanvasTextAlign; ls?: number; i?: boolean; mw?: number };

function t(c: C, s: string, x: number, y: number, size: number, col: Fill, o: TO = {}) {
  c.save();
  let sz = size;
  const set = () => {
    c.font = `${o.i ? "italic " : ""}${o.w ?? 500} ${sz}px ${o.f ?? F.text}`;
  };
  c.textBaseline = "alphabetic";
  c.textAlign = o.al ?? "left";
  c.globalAlpha = o.a ?? 1;
  c.fillStyle = col;
  (c as C & { letterSpacing?: string }).letterSpacing = `${o.ls ?? 0}px`;
  set();
  if (o.mw) {
    while (sz > 12 && c.measureText(s).width > o.mw) {
      sz -= 2;
      set();
    }
  }
  c.fillText(s, x, y);
  c.restore();
}

function width(c: C, s: string, size: number, font: string, w: number | string = 500) {
  c.save();
  c.font = `${w} ${size}px ${font}`;
  const m = c.measureText(s).width;
  c.restore();
  return m;
}

function btn(c: C, x: number, y: number, w: number, h: number, label: string, bg: Fill, ink: string, font = F.display) {
  box(c, x, y, w, h, h / 2, bg);
  t(c, label, x + w / 2, y + h / 2 + 7, 20, ink, { f: font, w: 600, al: "center" });
}

function lines(c: C, x: number, y: number, widths: number[], gap: number, col: string, a = 0.3) {
  widths.forEach((w, i) => {
    c.globalAlpha = a;
    box(c, x, y + i * gap, w, 10, 5, col);
  });
  c.globalAlpha = 1;
}

/** rounded image area: fills, clips, then runs `paint` in local (0,0) coordinates */
function photo(
  c: C,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[],
  fill: (w: number, h: number) => Fill,
  paint?: (w: number, h: number) => void,
) {
  c.save();
  rp(c, x, y, w, h, r);
  c.clip();
  c.translate(x, y);
  c.fillStyle = fill(w, h);
  c.fillRect(0, 0, w, h);
  paint?.(w, h);
  c.restore();
}

function poly(c: C, pts: [number, number][], fill: Fill) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

/** links laid out right-to-left from `rx`, each spaced by its measured width */
function linkRow(c: C, links: string[], rx: number, y: number, size: number, col: string, font: string, a = 0.75) {
  let x = rx;
  for (let i = links.length - 1; i >= 0; i--) {
    t(c, links[i], x, y, size, col, { f: font, al: "right", a });
    x -= width(c, links[i], size, font) + 36;
  }
}

/** links laid out left-to-right from `lx` */
function linkRowLeft(c: C, links: string[], lx: number, y: number, size: number, col: string, font: string) {
  let x = lx;
  links.forEach((s) => {
    t(c, s, x, y, size, col, { f: font });
    x += width(c, s, size, font) + 36;
  });
}

type NavOpts = {
  logo: string;
  links: string[];
  cta: string;
  ink: string;
  ctaBg: string;
  ctaInk: string;
  logoFont?: string;
  logoSize?: number;
  logoW?: number | string;
};

function nav(c: C, o: NavOpts) {
  t(c, o.logo, 64, 52, o.logoSize ?? 30, o.ink, { f: o.logoFont ?? F.display, w: o.logoW ?? 700, ls: -0.5 });
  const cw = width(c, o.cta, 18, F.display, 600) + 44;
  const cx = VW - 64 - cw;
  box(c, cx, 26, cw, 42, 21, o.ctaBg);
  t(c, o.cta, cx + cw / 2, 53, 18, o.ctaInk, { f: F.display, w: 600, al: "center" });
  linkRow(c, o.links, cx - 40, 53, 18, o.ink, F.text, 0.72);
}

/* ---------- templates ---------- */

export const TEMPLATES: Template[] = [
  /* 1 — SaaS dashboard */
  {
    id: "aurora",
    name: "Aurora",
    type: "SaaS & dashboards",
    url: "aurora.app",
    dark: true,
    accent: "#8b8cff",
    blurb: "A product site with a live dashboard preview, clear pricing and a calm dark interface that keeps the data in focus.",
    features: ["Live charts", "Pricing tables", "Docs & changelog"],
    draw(c) {
      box(c, 0, 0, VW, VH, 0, lg(c, 0, 0, VW * 0.7, VH, "#050817", "#0d1342"));
      glow(c, 1040, 190, 560, "112,104,255", 0.5);
      nav(c, { logo: "aurora", links: ["Product", "Pricing", "Docs", "Customers"], cta: "Start free", ink: "#e9ebff", ctaBg: "#8b8cff", ctaInk: "#0a0d24" });
      dot(c, 64 + width(c, "aurora", 30, F.display, 700) + 10, 40, 6, "#5eead4");

      box(c, 64, 148, 236, 38, 19, "rgba(139,140,255,.16)");
      dot(c, 88, 167, 5, "#5eead4");
      t(c, "Live launch reports", 104, 173, 16, "#cfd1ff");
      t(c, "See every launch", 64, 274, 64, "#f5f6ff", { f: F.display, w: 700, ls: -2, mw: 590 });
      t(c, "as it happens.", 64, 348, 64, "#9a9bff", { f: F.display, w: 700, ls: -2, mw: 590 });
      t(c, "Track sign-ups, revenue and churn in one view,", 64, 410, 23, "#e9ebff", { a: 0.7, mw: 570 });
      t(c, "and share it with your whole team.", 64, 442, 23, "#e9ebff", { a: 0.7, mw: 570 });
      btn(c, 64, 486, 180, 56, "Start free", "#8b8cff", "#0a0d24");
      box(c, 262, 486, 188, 56, 28, "rgba(255,255,255,.06)", "rgba(255,255,255,.24)");
      t(c, "Watch demo", 356, 521, 20, "#e9ebff", { f: F.display, w: 600, al: "center" });
      t(c, "Trusted by teams at", 64, 626, 16, "#e9ebff", { a: 0.45 });
      let lx = 64;
      ["Lumen", "Northwind", "Kite", "Orbital", "Pillar"].forEach((s) => {
        t(c, s, lx, 668, 22, "#e9ebff", { f: F.display, w: 600, a: 0.5 });
        lx += width(c, s, 22, F.display, 600) + 34;
      });

      // dashboard window
      shadowed(c, 60, 30, "rgba(0,0,0,.55)", () => box(c, 690, 132, 530, 420, 22, "#0f1438", "rgba(255,255,255,.1)"));
      box(c, 690, 132, 84, 420, [22, 0, 0, 22], "rgba(255,255,255,.035)");
      for (let i = 0; i < 5; i++) box(c, 710, 166 + i * 56, 44, 34, 11, i === 0 ? "rgba(139,140,255,.4)" : "rgba(255,255,255,.07)");
      t(c, "Revenue", 800, 180, 17, "#e9ebff", { a: 0.6 });
      t(c, "$248,910", 800, 228, 40, "#ffffff", { f: F.display, w: 700 });
      box(c, 986, 202, 86, 30, 15, "rgba(94,234,212,.18)");
      t(c, "+12.4%", 1029, 223, 16, "#5eead4", { al: "center", w: 600 });
      ["7d", "30d", "90d"].forEach((s, i) => {
        if (i === 1) box(c, 1080 + i * 44, 170, 42, 28, 14, "rgba(255,255,255,.12)");
        t(c, s, 1101 + i * 44, 190, 14, "#e9ebff", { al: "center", a: i === 1 ? 1 : 0.5 });
      });
      const pts = [0.3, 0.42, 0.36, 0.55, 0.48, 0.66, 0.6, 0.78, 0.72, 0.92];
      const gx = 800, gw = 396, gy = 500, gh = 190;
      for (let i = 0; i < 4; i++) box(c, gx, gy - i * 64 + 0, gw, 1.5, 0, "rgba(255,255,255,.07)");
      const trace = () => {
        c.beginPath();
        pts.forEach((p, i) => {
          const x = gx + (i * gw) / (pts.length - 1);
          const y = gy - p * gh;
          if (i) c.lineTo(x, y);
          else c.moveTo(x, y);
        });
      };
      trace();
      c.lineTo(gx + gw, gy);
      c.lineTo(gx, gy);
      c.fillStyle = lg(c, 0, gy - gh, 0, gy, "rgba(139,140,255,.4)", "rgba(139,140,255,0)");
      c.fill();
      shadowed(c, 14, 0, "rgba(139,140,255,.9)", () => {
        trace();
        c.strokeStyle = "#a9aaff";
        c.lineWidth = 4;
        c.lineJoin = "round";
        c.stroke();
      });
      dot(c, gx + gw, gy - 0.92 * gh, 7, "#ffffff");
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((s, i) => t(c, s, gx + (i * gw) / 4, 530, 14, "#e9ebff", { al: i === 4 ? "right" : i ? "center" : "left", a: 0.4 }));

      // floating stat
      shadowed(c, 40, 20, "rgba(0,0,0,.5)", () => box(c, 640, 520, 214, 116, 20, "#171d52", "rgba(255,255,255,.12)"));
      t(c, "Conversion", 664, 556, 16, "#e9ebff", { a: 0.6 });
      t(c, "4.8%", 664, 606, 42, "#ffffff", { f: F.display, w: 700 });
      c.beginPath();
      c.arc(800, 588, 26, 0, Math.PI * 2);
      c.strokeStyle = "rgba(255,255,255,.12)";
      c.lineWidth = 8;
      c.stroke();
      c.beginPath();
      c.arc(800, 588, 26, -Math.PI / 2, Math.PI * 0.9);
      c.strokeStyle = "#5eead4";
      c.lineCap = "round";
      c.stroke();
    },
  },

  /* 2 — Fashion e-commerce */
  {
    id: "maison",
    name: "Maison",
    type: "Fashion & e-commerce",
    url: "maison.store",
    dark: false,
    accent: "#c4552d",
    blurb: "An editorial online store with large product photography, quick filters and a checkout that stays out of the way.",
    features: ["Product grid & filters", "Fast checkout", "Wishlist & search"],
    draw(c) {
      const ink = "#2b1a12";
      box(c, 0, 0, VW, VH, 0, "#f3eadf");
      linkRowLeft(c, ["Women", "Men", "Objects"], 64, 52, 19, ink, F.serif);
      t(c, "MAISON", VW / 2, 54, 30, ink, { f: F.serif, w: 600, ls: 9, al: "center" });
      t(c, "Search", VW - 170, 52, 19, ink, { f: F.serif, al: "right" });
      t(c, "Bag (2)", VW - 64, 52, 19, ink, { f: F.serif, al: "right" });
      box(c, 64, 84, VW - 128, 1.5, 0, "rgba(43,26,18,.16)");

      t(c, "Autumn / Winter 24", 64, 160, 20, "#a4522f", { f: F.serif, i: true });
      t(c, "Slow fashion,", 64, 254, 96, ink, { f: F.serif, w: 400, ls: -2, mw: 640 });
      t(c, "made to keep.", 64, 350, 96, "#a4522f", { f: F.serif, w: 400, i: true, ls: -2, mw: 640 });
      t(c, "Coats, knits and leather goods, made in small", 64, 402, 22, ink, { f: F.serif, a: 0.7 });
      t(c, "batches from natural fibres that age well.", 64, 434, 22, ink, { f: F.serif, a: 0.7 });
      btn(c, 64, 466, 214, 54, "Shop the edit", ink, "#f3eadf", F.serif);
      t(c, "Our materials", 306, 500, 20, ink, { f: F.serif });
      box(c, 306, 506, 112, 1.5, 0, ink);

      photo(c, 764, 108, 452, 388, [226, 226, 10, 10], (_w, h) => lg(c, 0, 0, 0, h, "#f1cdb0", "#c97a4c"), (w, h) => {
        glow(c, w / 2, 90, 240, "255,240,220", 0.8);
        c.fillStyle = "rgba(60,25,10,.22)";
        c.beginPath();
        c.ellipse(w / 2, h - 30, 150, 20, 0, 0, Math.PI * 2);
        c.fill();
        poly(c, [[w / 2 - 70, 206], [w / 2 + 70, 206], [w / 2 + 128, 236], [w - 92, h - 30], [92, h - 30], [w / 2 - 128, 236]], lg(c, 0, 206, 0, h, "#8a4526", "#52260f"));
        poly(c, [[w / 2 - 44, 212], [w / 2 + 44, 212], [w / 2, 290]], "#e8b995");
        poly(c, [[w / 2 - 52, 212], [w / 2, 300], [w / 2 - 12, h - 30], [w / 2 - 46, h - 30]], "rgba(0,0,0,.18)");
        dot(c, w / 2, 160, 40, "#e8b995");
        c.fillStyle = "#3a1d10";
        c.beginPath();
        c.arc(w / 2, 152, 42, Math.PI, Math.PI * 2);
        c.fill();
        box(c, w / 2 - 6, 212, 12, 12, 0, "#e8b995");
      });

      const tiles: [string, string, string, (x: number, y: number) => void][] = [
        ["Wool overcoat", "$420", "#e6d3bf", (x, y) => poly(c, [[x + 100, y + 22], [x + 172, y + 22], [x + 200, y + 118], [x + 72, y + 118]], "#8a4a2c")],
        ["Leather tote", "$310", "#d8c1a8", (x, y) => {
          c.strokeStyle = "#4a2a18";
          c.lineWidth = 7;
          c.beginPath();
          c.arc(x + 136, y + 50, 30, Math.PI, 0);
          c.stroke();
          box(c, x + 88, y + 52, 96, 66, 12, "#6b3820");
        }],
        ["Suede boots", "$260", "#c9b29a", (x, y) => poly(c, [[x + 100, y + 26], [x + 140, y + 26], [x + 144, y + 84], [x + 196, y + 100], [x + 196, y + 118], [x + 100, y + 118]], "#3d2416")],
        ["Cable knit", "$180", "#eed9c9", (x, y) => {
          box(c, x + 92, y + 40, 90, 78, 14, "#b9603a");
          poly(c, [[x + 92, y + 46], [x + 56, y + 96], [x + 76, y + 108], [x + 106, y + 72]], "#a7532f");
          poly(c, [[x + 182, y + 46], [x + 218, y + 96], [x + 198, y + 108], [x + 168, y + 72]], "#a7532f");
        }],
      ];
      tiles.forEach(([name, price, bg, shape], i) => {
        const x = 64 + i * 293;
        box(c, x, 540, 272, 130, 12, bg);
        shape(x, 540);
        t(c, name, x, 704, 19, ink, { f: F.serif });
        t(c, price, x + 272, 704, 19, "#a4522f", { f: F.serif, al: "right" });
      });
    },
  },

  /* 3 — Creative agency */
  {
    id: "volt",
    name: "Volt",
    type: "Creative agency",
    url: "volt.studio",
    dark: true,
    accent: "#c8ff3c",
    blurb: "A bold, type-led portfolio with big project tiles and playful motion for studios that want to be remembered.",
    features: ["Case studies", "Motion-led layouts", "Showreel"],
    draw(c) {
      box(c, 0, 0, VW, VH, 0, "#0b0b0e");
      nav(c, { logo: "VOLT®", links: ["Work", "Studio", "Journal"], cta: "Let's talk", ink: "#f5f5f5", ctaBg: "#c8ff3c", ctaInk: "#0b0b0e" });
      const big = { f: F.display, w: 700, ls: -6, mw: 640 };
      t(c, "We make", 60, 256, 158, "#f5f5f5", big);
      t(c, "brands", 60, 396, 158, "#f5f5f5", big);
      t(c, "loud.", 60, 536, 158, "#c8ff3c", big);
      t(c, "Identity, websites and motion for people with something to say.", 64, 590, 21, "#f5f5f5", { a: 0.6, mw: 600 });

      const card = (x: number, y: number, rot: number, w: number, h: number, paint: (w: number, h: number) => void, label: string) => {
        c.save();
        c.translate(x + w / 2, y + h / 2);
        c.rotate(rot);
        c.translate(-w / 2, -h / 2);
        shadowed(c, 40, 20, "rgba(0,0,0,.6)", () => box(c, 0, 0, w, h, 22, "#111"));
        photo(c, 0, 0, w, h, 22, () => "#111", paint);
        t(c, label, 20, h - 22, 17, "#fff", { w: 600, f: F.display });
        c.restore();
      };
      card(730, 118, -0.1, 250, 340, (w, h) => {
        c.fillStyle = lg(c, 0, 0, w, h, "#c8ff3c", "#1fd1a8");
        c.fillRect(0, 0, w, h);
        [150, 100, 52].forEach((r, i) => {
          dot(c, w / 2, h / 2 - 20, r, i % 2 ? "#c8ff3c" : "#0b0b0e");
        });
      }, "Halo — identity");
      card(920, 170, 0.07, 250, 340, (w, h) => {
        c.fillStyle = lg(c, 0, 0, w, h, "#ff4fd8", "#6a2cff");
        c.fillRect(0, 0, w, h);
        t(c, "Aa", w / 2, h / 2 + 50, 170, "#fff", { f: F.display, w: 700, al: "center", ls: -8 });
      }, "Nord — campaign");
      card(1040, 318, -0.04, 190, 262, (w, h) => {
        c.fillStyle = "#f5f5f5";
        c.fillRect(0, 0, w, h);
        for (let i = 0; i < 6; i++) box(c, 18, 24 + i * 32, i % 2 ? w - 70 : w - 36, 20, 10, i === 2 ? "#ff4fd8" : "#0b0b0e");
      }, "Orbit — web");

      dot(c, 690, 610, 66, "#ff4fd8");
      c.save();
      c.translate(690, 610);
      c.rotate(-0.22);
      t(c, "Booking", 0, -4, 24, "#0b0b0e", { f: F.display, w: 700, al: "center" });
      t(c, "Q3 2026", 0, 24, 24, "#0b0b0e", { f: F.display, w: 700, al: "center" });
      c.restore();

      c.save();
      c.translate(-30, 672);
      c.rotate(-0.028);
      box(c, 0, 0, VW + 80, 62, 0, "#c8ff3c");
      t(c, "Identity  •  Websites  •  Motion  •  Campaigns  •  Identity  •  Websites  •  Motion  •  Campaigns  •", 30, 41, 26, "#0b0b0e", { f: F.display, w: 700, ls: 0 });
      c.restore();
    },
  },

  /* 4 — FinTech */
  {
    id: "verde",
    name: "Verde",
    type: "FinTech & banking",
    url: "verde.money",
    dark: true,
    accent: "#f2c14e",
    blurb: "A trust-first finance site with an app preview, clear numbers and a sign-up flow that takes two minutes.",
    features: ["App preview", "Secure onboarding", "Rates & calculators"],
    draw(c) {
      box(c, 0, 0, VW, VH, 0, lg(c, 0, 0, VW, VH, "#062d27", "#0b4b3f"));
      glow(c, 1000, 250, 460, "94,234,212", 0.22);
      nav(c, { logo: "verde", links: ["Personal", "Business", "Cards", "Help"], cta: "Open account", ink: "#effcf6", ctaBg: "#f2c14e", ctaInk: "#062d27" });
      dot(c, 64 + width(c, "verde", 30, F.display, 700) + 10, 40, 6, "#f2c14e");
      t(c, "Money that", 64, 218, 76, "#effcf6", { f: F.display, w: 700, ls: -2, mw: 640 });
      t(c, "moves with you.", 64, 298, 76, "#f2c14e", { f: F.display, w: 700, ls: -2, mw: 640 });
      t(c, "Everyday banking with no monthly fees, instant transfers", 64, 360, 22, "#effcf6", { a: 0.72, mw: 640 });
      t(c, "and savings that earn from the first day.", 64, 392, 22, "#effcf6", { a: 0.72, mw: 640 });
      btn(c, 64, 430, 200, 56, "Open account", "#f2c14e", "#062d27");
      box(c, 282, 430, 208, 56, 28, "rgba(255,255,255,.06)", "rgba(255,255,255,.26)");
      t(c, "See how it works", 386, 465, 19, "#effcf6", { f: F.display, w: 600, al: "center" });
      [["4.9/5", "app rating"], ["$0", "monthly fees"], ["2 min", "to get started"]].forEach(([n, l], i) => {
        const x = 64 + i * 210;
        if (i) box(c, x - 26, 590, 1.5, 70, 0, "rgba(255,255,255,.16)");
        t(c, n, x, 620, 38, "#ffffff", { f: F.display, w: 700 });
        t(c, l, x, 652, 17, "#effcf6", { a: 0.6 });
      });

      // tilted card behind the phone
      c.save();
      c.translate(1060, 250);
      c.rotate(0.24);
      shadowed(c, 40, 20, "rgba(0,0,0,.45)", () => box(c, -150, -95, 300, 190, 22, lg(c, -150, -95, 150, 95, "#f2c14e", "#c98d22")));
      t(c, "verde", -122, -50, 26, "#062d27", { f: F.display, w: 700 });
      box(c, -122, -10, 46, 34, 7, "rgba(6,45,39,.35)");
      t(c, "4417  ••••  ••••  0921", -122, 66, 20, "#062d27", { f: F.mono, w: 600 });
      c.restore();

      // phone
      shadowed(c, 60, 30, "rgba(0,0,0,.55)", () => box(c, 820, 116, 306, 680, 46, "#08130f", "rgba(255,255,255,.2)"));
      box(c, 832, 128, 282, 656, 36, "#0e211b");
      t(c, "Good morning, Ana", 858, 190, 19, "#effcf6", { f: F.display, w: 600 });
      dot(c, 1080, 182, 16, "#f2c14e");
      t(c, "Total balance", 858, 240, 15, "#effcf6", { a: 0.6 });
      t(c, "$12,480.50", 858, 284, 38, "#ffffff", { f: F.display, w: 700, mw: 232 });
      box(c, 858, 314, 230, 116, 18, lg(c, 858, 314, 1088, 430, "#1f9d76", "#0b5b48"));
      t(c, "Savings", 876, 346, 15, "#effcf6", { a: 0.75 });
      t(c, "$8,200", 876, 386, 30, "#ffffff", { f: F.display, w: 700 });
      t(c, "+3.9% APY", 876, 414, 14, "#f2c14e", { w: 600 });
      t(c, "Recent", 858, 476, 17, "#effcf6", { f: F.display, w: 600 });
      [["Market", "-$42.10", "#effcf6"], ["Salary", "+$3,400", "#5eead4"], ["Transit pass", "-$64.00", "#effcf6"], ["Rent", "-$1,150", "#effcf6"]].forEach(([n, a, col], i) => {
        const y = 506 + i * 60;
        dot(c, 880, y + 18, 18, i === 1 ? "rgba(94,234,212,.25)" : "rgba(255,255,255,.1)");
        t(c, n, 912, y + 24, 16, "#effcf6", { a: 0.9 });
        t(c, a, 1088, y + 24, 16, col, { al: "right", w: 600 });
      });
    },
  },

  /* 5 — Architecture */
  {
    id: "atelier",
    name: "Atelier",
    type: "Architecture & portfolio",
    url: "atelierbrandt.com",
    dark: false,
    accent: "#a98545",
    blurb: "A quiet, gallery-style portfolio where the project photography leads and the typography stays out of the way.",
    features: ["Project galleries", "Journal", "Press & awards"],
    draw(c) {
      const ink = "#1c1b19";
      box(c, 0, 0, VW, VH, 0, "#e8e5de");
      t(c, "Atelier Brandt", 64, 52, 26, ink, { f: F.serif, w: 500 });
      linkRow(c, ["Projects", "Studio", "Journal", "Contact"], VW - 64, 52, 17, ink, F.text);
      box(c, 64, 84, VW - 128, 1.5, 0, "rgba(28,27,25,.2)");

      photo(c, 64, 116, 690, 530, 4, (_w, h) => lg(c, 0, 0, 0, h, "#c4ccd0", "#f0eadf"), (w, h) => {
        glow(c, 560, 90, 300, "255,248,230", 0.9);
        box(c, 0, 410, w, h - 410, 0, lg(c, 0, 410, 0, h, "#7f8968", "#5d6748"));
        // building
        poly(c, [[120, 180], [520, 180], [520, 420], [120, 420]], lg(c, 0, 180, 0, 420, "#cbc6b9", "#b3ae9f"));
        poly(c, [[520, 180], [600, 210], [600, 420], [520, 420]], "#8f8a7d");
        box(c, 84, 150, 470, 34, 0, "#e3ded1");
        poly(c, [[554, 150], [620, 176], [620, 200], [554, 184]], "#a29d90");
        for (let i = 0; i < 3; i++) {
          box(c, 150, 214 + i * 66, 340, 44, 0, lg(c, 150, 0, 490, 0, "#33434a", "#5e7a84", "#33434a"));
          for (let k = 1; k < 6; k++) box(c, 150 + k * 56, 214 + i * 66, 3, 44, 0, "#cbc6b9");
        }
        box(c, 180, 386, 90, 34, 0, "#2b2a27");
        box(c, 0, 420, w, 10, 0, "rgba(0,0,0,.16)");
        [[40, 400, 46], [660, 392, 56], [610, 430, 34]].forEach(([x, y, r]) => {
          box(c, x - 3, y, 6, 50, 0, "#4b3d2c");
          dot(c, x, y, r, "#41522f");
        });
        c.fillStyle = "rgba(0,0,0,.14)";
        c.beginPath();
        c.moveTo(120, 420);
        c.lineTo(520, 420);
        c.lineTo(640, 470);
        c.lineTo(230, 470);
        c.fill();
      });
      t(c, "Casa Halden, Lisbon — 2024", 64, 676, 17, ink, { a: 0.7 });
      t(c, "01 / 12", 754, 676, 17, ink, { a: 0.7, al: "right" });

      t(c, "Spaces shaped", 810, 196, 58, ink, { f: F.serif, w: 400, ls: -1.5, mw: 406 });
      t(c, "by light.", 810, 262, 58, ink, { f: F.serif, w: 400, i: true, ls: -1.5, mw: 406 });
      lines(c, 810, 300, [400, 380, 340], 26, ink, 0.32);
      t(c, "Selected works", 810, 446, 18, ink, { a: 0.6 });
      t(c, "24", 1216, 446, 18, ink, { a: 0.6, al: "right" });
      [["Casa Halden", "Lisbon"], ["Museu do Rio", "Porto"], ["Pavilion 9", "Milan"], ["Rua Nova House", "Faro"]].forEach(([n, l], i) => {
        const y = 462 + i * 46;
        box(c, 810, y, 406, 1.5, 0, "rgba(28,27,25,.22)");
        t(c, n, 810, y + 33, 25, ink, { f: F.serif, a: i === 0 ? 1 : 0.85 });
        t(c, l, 1216, y + 32, 17, ink, { a: 0.55, al: "right" });
      });
      box(c, 810, 646, 406, 1.5, 0, "rgba(28,27,25,.22)");
    },
  },

  /* 6 — Restaurant */
  {
    id: "ember",
    name: "Ember",
    type: "Restaurants & cafés",
    url: "ember.kitchen",
    dark: true,
    accent: "#ffb04a",
    blurb: "An appetite-first site with a menu that reads well on a phone, table booking and a warm, moody palette.",
    features: ["Online menu", "Table booking", "Gift cards"],
    draw(c) {
      box(c, 0, 0, VW, VH, 0, "#2a0a14");
      glow(c, 960, 320, 620, "150,28,58", 0.85);
      t(c, "Ember", 64, 56, 40, "#ffb04a", { f: F.serif, i: true, w: 400 });
      const cta = 138;
      box(c, VW - 64 - cta, 26, cta, 42, 21, "#ffb04a");
      t(c, "Reserve", VW - 64 - cta / 2, 53, 18, "#2a0a14", { f: F.display, w: 600, al: "center" });
      linkRow(c, ["Menu", "Wine", "Private dining", "Visit"], VW - 64 - cta - 40, 53, 18, "#fff1e6", F.text);

      t(c, "Fire, salt,", 64, 236, 98, "#fff1e6", { f: F.serif, w: 400, ls: -2, mw: 620 });
      t(c, "and time.", 64, 340, 98, "#ffb04a", { f: F.serif, w: 400, i: true, ls: -2, mw: 620 });
      t(c, "A wood-fired kitchen serving the season's best, one", 64, 400, 22, "#fff1e6", { f: F.serif, a: 0.75, mw: 600 });
      t(c, "plate at a time. Dinner Tuesday to Sunday.", 64, 432, 22, "#fff1e6", { f: F.serif, a: 0.75, mw: 600 });
      btn(c, 64, 470, 214, 56, "Book a table", "#ffb04a", "#2a0a14");
      t(c, "View the menu", 306, 505, 20, "#fff1e6", { f: F.serif });
      box(c, 306, 511, 122, 1.5, 0, "#fff1e6");

      // plate
      const px = 960, py = 316;
      shadowed(c, 60, 34, "rgba(0,0,0,.55)", () => dot(c, px, py, 226, lg(c, px - 226, py - 226, px + 226, py + 226, "#f8efe4", "#cdbba6")));
      dot(c, px, py, 178, lg(c, px - 178, py - 178, px + 178, py + 178, "#e9dbc8", "#f6ecdf"));
      c.save();
      c.translate(px - 10, py + 10);
      c.rotate(-0.4);
      shadowed(c, 24, 14, "rgba(0,0,0,.4)", () => {
        c.beginPath();
        c.ellipse(0, 0, 122, 68, 0, 0, Math.PI * 2);
        c.fillStyle = lg(c, 0, -68, 0, 68, "#7b3b24", "#4a2014");
        c.fill();
      });
      c.clip();
      for (let i = -6; i < 7; i++) {
        c.strokeStyle = "rgba(20,8,4,.5)";
        c.lineWidth = 7;
        c.beginPath();
        c.moveTo(i * 26 - 30, -80);
        c.lineTo(i * 26 + 30, 80);
        c.stroke();
      }
      c.restore();
      c.strokeStyle = "#a13a2b";
      c.lineWidth = 10;
      c.lineCap = "round";
      c.beginPath();
      c.arc(px + 20, py + 10, 158, 0.25, 1.5);
      c.stroke();
      [[-100, -70, 14, "#6a9a4c"], [-70, -96, 11, "#88b35b"], [-120, -40, 10, "#88b35b"], [90, -80, 13, "#6a9a4c"], [118, -46, 10, "#88b35b"], [70, 100, 12, "#e0703a"], [100, 74, 9, "#e0703a"], [-40, 110, 12, "#88b35b"]].forEach(([dx, dy, r, col]) =>
        dot(c, px + (dx as number), py + (dy as number), r as number, col as string),
      );

      // menu strip
      box(c, 64, 584, VW - 128, 1.5, 0, "rgba(255,241,230,.2)");
      [["Charred octopus", "smoked paprika, potato", "19"], ["Dry-aged ribeye", "bone marrow, greens", "46"], ["Burnt honey tart", "crème fraîche, thyme", "12"]].forEach(([n, d, p], i) => {
        const cx = 64 + i * 400;
        t(c, n, cx, 636, 24, "#fff1e6", { f: F.serif });
        t(c, p, cx + 350, 636, 24, "#ffb04a", { f: F.serif, al: "right" });
        t(c, d, cx, 668, 17, "#fff1e6", { f: F.serif, i: true, a: 0.6 });
      });
    },
  },

  /* 7 — Wellness */
  {
    id: "bloom",
    name: "Bloom",
    type: "Wellness & booking",
    url: "bloom.care",
    dark: false,
    accent: "#1f9d76",
    blurb: "A soft, airy booking experience for studios, clinics and wellbeing brands, with a live class schedule built in.",
    features: ["Class booking", "Memberships", "Teacher profiles"],
    draw(c) {
      const ink = "#123a36";
      box(c, 0, 0, VW, VH, 0, lg(c, 0, 0, VW, VH, "#e4f7ec", "#f8e9f2"));
      dot(c, 1120, 90, 230, "rgba(170,230,208,.55)");
      dot(c, 90, 720, 200, "rgba(247,190,214,.5)");
      nav(c, { logo: "bloom", links: ["Classes", "Teachers", "Membership", "Studio"], cta: "Try a free week", ink, ctaBg: "#1f9d76", ctaInk: "#ffffff" });
      const fx = 64 + width(c, "bloom", 30, F.display, 700) + 22;
      [[0, -9], [9, -2], [5, 8], [-5, 8], [-9, -2]].forEach(([dx, dy]) => dot(c, fx + dx, 34 + dy, 5, "#f39bc0"));
      dot(c, fx, 34, 4, "#ffe08a");

      t(c, "Breathe in,", 64, 232, 80, ink, { f: F.display, w: 600, ls: -2.5, mw: 600 });
      t(c, "begin again.", 64, 316, 80, "#1f9d76", { f: F.display, w: 600, ls: -2.5, mw: 600 });
      t(c, "Yoga, pilates and breathwork in a light-filled studio.", 64, 378, 22, ink, { a: 0.72, mw: 580 });
      t(c, "Book a class in under a minute.", 64, 410, 22, ink, { a: 0.72, mw: 580 });
      btn(c, 64, 450, 190, 56, "Book a class", "#1f9d76", "#ffffff");
      box(c, 272, 450, 190, 56, 28, "rgba(255,255,255,.7)", "rgba(18,58,54,.2)");
      t(c, "Meet the team", 367, 485, 19, ink, { f: F.display, w: 600, al: "center" });
      ["#f7a8c4", "#9bdcc4", "#ffd88a", "#b8b4f0"].forEach((col, i) => {
        dot(c, 84 + i * 30, 590, 22, "#ffffff");
        dot(c, 84 + i * 30, 590, 19, col);
      });
      t(c, "2,300 members this week", 208, 597, 18, ink, { a: 0.7 });

      shadowed(c, 60, 24, "rgba(18,58,54,.18)", () => box(c, 700, 112, 516, 568, 30, "#ffffff"));
      t(c, "Today's classes", 736, 172, 26, ink, { f: F.display, w: 600 });
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((d, i) => {
        const x = 736 + i * 88;
        box(c, x, 198, 78, 62, 18, i === 2 ? "#1f9d76" : "#f2f7f5");
        t(c, d, x + 39, 224, 14, i === 2 ? "#ffffff" : ink, { al: "center", a: i === 2 ? 0.85 : 0.55 });
        t(c, String(12 + i), x + 39, 249, 19, i === 2 ? "#ffffff" : ink, { al: "center", f: F.display, w: 600 });
      });
      [["7:30", "Morning flow", "with Maya · 45 min", "3 spots", "#1f9d76"], ["9:00", "Reformer basics", "with Jonas · 55 min", "Book", "#1f9d76"], ["12:15", "Lunch breathwork", "with Aiko · 30 min", "Full", "#9aa5a2"], ["18:00", "Slow evening yoga", "with Maya · 60 min", "Book", "#1f9d76"]].forEach(([tm, n, d, s, col], i) => {
        const y = 284 + i * 84;
        box(c, 736, y, 444, 72, 18, "#f4faf7");
        t(c, tm, 756, y + 44, 21, ink, { f: F.display, w: 600 });
        box(c, 830, y + 16, 3, 40, 1.5, i % 2 ? "#f39bc0" : "#9bdcc4");
        t(c, n, 848, y + 34, 19, ink, { f: F.display, w: 600, mw: 190 });
        t(c, d, 848, y + 58, 14, ink, { a: 0.55, mw: 190 });
        box(c, 1060, y + 20, 96, 34, 17, col === "#1f9d76" ? "rgba(31,157,118,.14)" : "rgba(154,165,162,.2)");
        t(c, s, 1108, y + 43, 15, col === "#1f9d76" ? "#14795a" : "#6f7a77", { al: "center", w: 600 });
      });
      t(c, "View full schedule", 736, 654, 17, "#14795a", { f: F.display, w: 600 });
    },
  },

  /* 8 — Travel */
  {
    id: "voyage",
    name: "Voyage",
    type: "Travel & stays",
    url: "voyage.travel",
    dark: true,
    accent: "#ff8f6b",
    blurb: "Dreamy destination storytelling with immersive imagery, a simple search bar and trip planning that feels effortless.",
    features: ["Search & dates", "Destination guides", "Trip planner"],
    draw(c) {
      box(c, 0, 0, VW, VH, 0, lg(c, 0, 0, 0, 470, "#2c1466", "#8a3fb8", "#ff8f6b", "#ffd08a"));
      glow(c, 1080, 400, 420, "255,220,150", 0.7);
      dot(c, 1080, 392, 84, lg(c, 0, 308, 0, 476, "#fffbe0", "#ffd58a"));
      poly(c, [[560, 470], [700, 330], [780, 400], [900, 300], [1040, 430], [1180, 350], [1280, 420], [1280, 500], [560, 500]], "#8a4aa8");
      poly(c, [[0, 500], [0, 380], [140, 300], [260, 400], [380, 340], [560, 470], [700, 500]], "#5a2f8a");
      poly(c, [[0, 520], [0, 450], [170, 400], [330, 470], [520, 430], [760, 500], [900, 470], [1280, 500], [1280, 540], [0, 540]], "#361b62");
      box(c, 0, 496, VW, VH - 496, 0, lg(c, 0, 496, 0, VH, "#5a3596", "#1f1150"));

      nav(c, { logo: "voyage", links: ["Destinations", "Stays", "Journal"], cta: "Sign in", ink: "#ffffff", ctaBg: "rgba(255,255,255,.2)", ctaInk: "#ffffff" });
      t(c, "Find your", 64, 190, 88, "#ffffff", { f: F.display, w: 700, ls: -3, mw: 640 });
      t(c, "next horizon.", 64, 278, 88, "#ffe08a", { f: F.display, w: 700, ls: -3, mw: 640 });
      t(c, "Curated trips and stays in 60 countries, planned in minutes.", 64, 328, 23, "#ffffff", { a: 0.9, mw: 640 });

      shadowed(c, 50, 24, "rgba(20,8,60,.4)", () => box(c, 64, 372, 900, 86, 43, "#ffffff"));
      [["Where", "Lofoten, Norway"], ["When", "Jun 12 – 19"], ["Guests", "2 adults"]].forEach(([l, v], i) => {
        const x = 104 + i * 258;
        if (i) box(c, x - 26, 392, 1.5, 46, 0, "rgba(30,20,70,.15)");
        t(c, l, x, 405, 14, "#3b1a78", { a: 0.6 });
        t(c, v, x, 436, 21, "#1c1240", { f: F.display, w: 600 });
      });
      box(c, 838, 386, 112, 58, 29, "#ff6b4a");
      t(c, "Search", 894, 423, 19, "#ffffff", { f: F.display, w: 600, al: "center" });

      [["Lofoten", "from $1,240", ["#3a6ea5", "#f6a96b"]], ["Kyoto", "from $1,780", ["#c2415d", "#ffcf9e"]], ["Amalfi", "from $1,390", ["#1d8fb0", "#ffe0a3"]], ["Patagonia", "from $2,150", ["#5a4fcf", "#ff9a8b"]]].forEach(([n, p, cols], i) => {
        const x = 64 + i * 293;
        const cc = cols as string[];
        photo(c, x, 512, 272, 200, 20, (_w, h) => lg(c, 0, 0, 0, h, cc[0], cc[1]), (w, h) => {
          dot(c, w * 0.7, h * 0.4, 26, "rgba(255,255,255,.75)");
          poly(c, [[0, h], [0, h * 0.62], [w * 0.3, h * 0.42], [w * 0.55, h * 0.66], [w * 0.8, h * 0.5], [w, h * 0.68], [w, h]], "rgba(20,10,50,.5)");
          box(c, 0, h - 70, w, 70, 0, lg(c, 0, h - 70, 0, h, "rgba(0,0,0,0)", "rgba(10,5,30,.65)"));
        });
        t(c, n as string, x + 18, 682, 24, "#ffffff", { f: F.display, w: 700 });
        t(c, p as string, x + 254, 682, 16, "#ffffff", { al: "right", a: 0.85 });
      });
    },
  },
];

/* ---------- rendering ---------- */

/** Paints one template (browser bar + page) onto a canvas. */
export function drawTemplate(canvas: HTMLCanvasElement, tpl: Template, fonts: Fonts = getFonts()) {
  F = fonts;
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const c = canvas.getContext("2d");
  if (!c) return;
  c.clearRect(0, 0, CARD_W, CARD_H);

  // browser bar
  box(c, 0, 0, CARD_W, BAR, 0, tpl.dark ? "#16171c" : "#eceef2");
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => dot(c, 34 + i * 26, BAR / 2, 7.5, col));
  box(c, 160, 12, 520, 32, 16, tpl.dark ? "#0c0d11" : "#ffffff");
  dot(c, 184, BAR / 2, 5, tpl.dark ? "#6b6f80" : "#a3a8b8");
  t(c, tpl.url, 202, 34, 17, tpl.dark ? "#a8abbb" : "#5b6070", { f: F.text });

  // page
  c.save();
  c.translate(0, BAR);
  c.beginPath();
  c.rect(0, 0, VW, VH);
  c.clip();
  tpl.draw(c);
  c.restore();

  // hairline edge so cards read against any background
  rp(c, 1, 1, CARD_W - 2, CARD_H - 2, 0);
  c.strokeStyle = "rgba(255,255,255,.14)";
  c.lineWidth = 2;
  c.stroke();
}

/** Waits (briefly) for the site fonts, so canvas text uses them. */
export async function ensureFonts(): Promise<Fonts> {
  const fonts = getFonts();
  try {
    if (typeof document !== "undefined" && document.fonts) {
      await Promise.race([
        Promise.all([
          document.fonts.load(`700 40px ${fonts.display}`),
          document.fonts.load(`500 20px ${fonts.text}`),
          document.fonts.ready,
        ]),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    }
  } catch {
    /* fall back to system fonts */
  }
  return fonts;
}
