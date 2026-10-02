import Ico from "./service-icons";
import type { Art, Service } from "@/lib/services-data";
import "./service-art.css";

/* Pure CSS/SVG scenes. Every service has its own hero scene and its own overview scene. */

const Ln = ({ w }: { w: number[] }) => (
  <>{w.map((x, i) => <b key={i} className="ln" style={{ width: `${x}%`, "--i": i } as React.CSSProperties} />)}</>
);
const Spark = ({ x, y, s = 1.1 }: { x: string; y: string; s?: number }) => (
  <svg className="sd-spark" viewBox="0 0 24 24" style={{ left: x, top: y, width: `${s}rem` }} aria-hidden="true">
    <path d="M12 1c.7 6 4.2 9.5 11 11-6.8 1.5-10.3 5-11 11-.7-6-4.2-9.5-11-11C7.8 10.5 11.3 7 12 1Z" />
  </svg>
);
const Cursor = () => <svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6L5 3Z" /></svg>;
const Mountain = () => (
  <svg viewBox="0 0 120 80" className="mt"><circle cx="88" cy="22" r="10" className="sd-sun" /><path d="M0 80 40 32l24 28 22-18 34 38Z" className="sd-mt" /></svg>
);
const Page = () => (
  <div className="pg"><i className="pg-h" /><b className="ln" style={{ width: "70%" }} /><b className="ln" style={{ width: "45%" }} /><div className="pg-g"><i /><i /><i /></div></div>
);

/* ---------------- HERO SCENES ---------------- */
function HeroWeb() {
  return (
    <>
      <div className="hc hw-page sd-p1">
        <div className="hw-bar"><i /><i /><i /><u>yoursite.com</u></div>
        <div className="hw-split">
          <div className="hw-wire"><b /><b /><b /></div>
          <div className="hw-done"><div className="hw-hero"><Ln w={[75, 50]} /><em /></div><div className="hw-cards"><i /><i /><i /></div></div>
          <span className="hw-handle" />
        </div>
      </div>
      <div className="hc hw-gauge sd-p2">
        <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9" pathLength="100" className="g-bg" /><circle cx="18" cy="18" r="15.9" pathLength="100" className="g-fg" /></svg>
        <strong>95+</strong>
      </div>
      <span className="hc hw-chip sd-p3">{"</>"}</span>
      <span className="hw-cursor sd-p4"><Cursor /></span>
      <Spark x="90%" y="8%" s={1.3} /><Spark x="3%" y="70%" />
    </>
  );
}
function HeroMobile() {
  return (
    <>
      <div className="hc hm-ph hm-l sd-p3"><i className="hm-top" />{[0, 1, 2, 3].map((i) => <p key={i}><i /><b className="ln" style={{ width: `${80 - i * 12}%` }} /></p>)}</div>
      <div className="hc hm-ph hm-c sd-p1"><i className="hm-top" /><svg viewBox="0 0 100 60"><path d="M4 48 28 32l20 8 26-24 22 8" className="sd-ln" /></svg><Ln w={[80, 55]} /><em /></div>
      <div className="hc hm-ph hm-r sd-p2"><i className="hm-top" /><div className="hm-tiles">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div></div>
      <div className="hc hm-toast sd-p4"><span><Ico name="bell" /></span><p><Ln w={[90, 60]} /></p></div>
      <Spark x="92%" y="10%" s={1.3} /><Spark x="2%" y="14%" />
    </>
  );
}
function HeroUiux() {
  return (
    <>
      <div className="hc hu-board sd-p1"><i className="h tl" /><i className="h tr" /><i className="h bl" /><i className="h br" /><div className="hu-in"><Ln w={[70, 45]} /><em /><Mountain /></div></div>
      <div className="hc hu-pal sd-p2"><p><i /><i /><i /><i /></p><strong>Aa</strong><Ln w={[80]} /></div>
      <svg className="hu-curve sd-p3" viewBox="0 0 120 60"><path d="M8 50C34 50 34 10 62 10S100 50 112 14" className="hu-path" /><path d="M8 50 28 36M62 10 82 26" className="hu-hd" /><circle cx="8" cy="50" r="3.5" /><circle cx="62" cy="10" r="3.5" /><circle cx="112" cy="14" r="3.5" /></svg>
      <div className="hu-cursor"><Cursor /><span>You</span></div>
      <Spark x="92%" y="46%" s={1.2} />
    </>
  );
}
function HeroSeo() {
  return (
    <>
      <div className="hc hs-search sd-p1"><Ico name="search" /><span>best accountant near me</span><i /></div>
      <div className="hs-rows sd-p3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`hc hs-row${i === 0 ? " hs-top" : ""}`}><i /><div><Ln w={i === 0 ? [70, 90] : [55, 80]} /></div>{i === 0 && <em>#1</em>}</div>
        ))}
      </div>
      <div className="hc hs-bars sd-p2">{[30, 45, 40, 65, 90].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />)}</div>
      <span className="hs-trend sd-p4"><Ico name="chart" /></span>
      <Spark x="94%" y="6%" s={1.3} /><Spark x="4%" y="78%" s={0.9} />
    </>
  );
}
function HeroSupport() {
  return (
    <>
      <div className="hp-core sd-p1"><i className="hp-ring" /><i className="hp-ring r2" /><i className="hp-ring r3" /><span><Ico name="shield" /></span></div>
      <div className="hc hp-card hp-a sd-p2"><i /><p>Uptime<strong>Online</strong></p></div>
      <div className="hc hp-card hp-b sd-p3"><i /><p>Backups<strong>Daily</strong></p></div>
      <div className="hc hp-card hp-c sd-p4"><i /><p>Patches<strong>Up to date</strong></p></div>
      <svg className="hp-beat" viewBox="0 0 200 30"><path d="M0 15h60l8-12 10 26 8-14h114" /></svg>
      <Spark x="90%" y="10%" s={1.2} /><Spark x="6%" y="12%" s={0.9} />
    </>
  );
}
function HeroContent() {
  return (
    <>
      <div className="hc hn-doc sd-p1"><i className="hn-title" /><Ln w={[95, 85, 90, 60, 80]} /><span className="hn-pen"><Ico name="pen" /></span></div>
      <div className="hc hn-road sd-p2"><ol>{["Plan", "Write", "Grow"].map((t) => <li key={t}><i />{t}</li>)}</ol></div>
      <div className="hc hn-quote sd-p3"><Ico name="megaphone" /><Ln w={[90, 60]} /></div>
      <span className="hs-trend sd-p4"><Ico name="doc" /></span>
      <Spark x="92%" y="40%" s={1.2} /><Spark x="2%" y="82%" s={0.9} />
    </>
  );
}
const HERO: Record<Art, () => React.JSX.Element> = { web: HeroWeb, mobile: HeroMobile, uiux: HeroUiux, seo: HeroSeo, support: HeroSupport, content: HeroContent };

export function HeroArt({ s }: { s: Service }) {
  const Scene = HERO[s.art];
  return (
    <div className={`sd-art sd-hero-${s.art}`} aria-hidden="true">
      <div className="sd-blob" />
      <Scene />
    </div>
  );
}

/* ---------------- OVERVIEW SCENES ---------------- */
function OvWeb() {
  return (
    <>
      <div className="hc ow-desk sd-p2"><div className="hw-bar"><i /><i /><i /></div><Page /></div>
      <div className="hc ow-tab sd-p3"><Page /></div>
      <div className="hc ow-ph sd-p4"><Page /></div>
      <span className="ow-tag">One site, every screen</span>
    </>
  );
}
function OvMobile() {
  return (
    <>
      <svg className="om-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" /></svg>
      <div className="om-orbit">
        {["bell", "bolt", "heart", "layers"].map((n, i) => (
          <span key={n} style={{ "--a": `${i * 90}deg` } as React.CSSProperties}><i><Ico name={n} /></i></span>
        ))}
      </div>
      <div className="hc om-phone sd-p2"><i className="hm-top" /><Mountain /><Ln w={[80, 55]} /><em /></div>
    </>
  );
}
function OvUiux() {
  const st = ["Sketch", "Wireframe", "Interface"];
  return (
    <>
      {st.map((t, i) => (
        <div key={t} className={`hc ou-st ou-${i + 1}`} style={{ "--i": i } as React.CSSProperties}>
          {i === 0 ? <svg viewBox="0 0 60 50"><path d="M4 6h52v14H4zM4 28h24v16H4zM34 28h22M34 36h18" /></svg> : i === 1 ? <div className="ou-wf"><b /><b /><b /></div> : <div className="ou-ui"><Ln w={[70, 45]} /><em /><Mountain /></div>}
          <small>{t}</small>
        </div>
      ))}
      <span className="ou-arr a1"><Ico name="arrow" /></span><span className="ou-arr a2"><Ico name="arrow" /></span>
    </>
  );
}
function OvSeo() {
  return (
    <>
      <div className="hc oe-chart sd-p2">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none"><defs><linearGradient id="oe-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6af0" stopOpacity=".35" /><stop offset="1" stopColor="#7a6af0" stopOpacity="0" /></linearGradient></defs><path d="M0 90 30 74 60 80 95 50 130 56 165 24 200 8V100H0Z" fill="url(#oe-g)" /><path d="M0 90 30 74 60 80 95 50 130 56 165 24 200 8" className="sd-ln oe-line" /></svg>
      </div>
      {["keyword", "intent", "local"].map((t, i) => <span key={t} className={`hc oe-chip oe-c${i + 1} sd-p${i + 2}`}><Ico name="target" />{t}</span>)}
    </>
  );
}
function OvSupport() {
  return (
    <>
      <div className="hc os-cal sd-p2"><small>Backups this month</small><div className="os-grid">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties}><Ico name="check" /></i>)}</div></div>
      <span className="hs-trend os-bell sd-p3"><Ico name="bell" /></span>
    </>
  );
}
function OvContent() {
  return (
    <>
      <div className="hc oc-page sd-p2"><i className="hn-title" /><Ln w={[95, 80, 90]} /><div className="oc-img"><Mountain /></div><Ln w={[85, 60]} /></div>
      <div className="hc oc-quote sd-p3"><strong>“</strong><Ln w={[90, 70]} /></div>
      <span className="hs-trend os-bell sd-p4"><Ico name="pen" /></span>
    </>
  );
}
const OV: Record<Art, () => React.JSX.Element> = { web: OvWeb, mobile: OvMobile, uiux: OvUiux, seo: OvSeo, support: OvSupport, content: OvContent };

export function OverviewArt({ s }: { s: Service }) {
  const Scene = OV[s.art];
  return (
    <div className={`sd-ov-art sd-ov-${s.art}`} aria-hidden="true">
      <Scene />
      <Spark x="4%" y="8%" /><Spark x="94%" y="88%" s={0.9} />
    </div>
  );
}

/* ---------------- BRIGHT 3D OBJECTS (decor) ----------------
   Pure CSS. Every section gets its own set, so no two sections show the same objects.
   Colours: c = [light, main, shade]. "var(--sd-a)" / "var(--sd-a2)" follow the service's own colours. */
type Kind = "cube" | "orb" | "ring" | "donut" | "pyramid" | "capsule" | "star" | "gem" | "blob";
type Def = { k: Kind; x: string; y: string; s: string; c: [string, string, string]; d?: number; dl?: number; keep?: boolean };
type DecoKind = "hero" | "ov" | "process" | "why";

const A = "var(--sd-a)", B = "var(--sd-a2)";
const PINK = "#ff5fb0", YEL = "#ffd23f", CYAN = "#22d3ee", LIME = "#8be34a", ORG = "#ff8a3d", VIO = "#9b6bff";

const DECO: Record<DecoKind, Def[]> = {
  hero: [
    { k: "orb", x: "45%", y: "10%", s: "4.4rem", c: ["#ffd6ea", PINK, "#c2185b"], d: 7 },
    { k: "cube", x: "90%", y: "74%", s: "3.8rem", c: [B, A, YEL], d: 9, dl: -2, keep: true },
    { k: "ring", x: "2%", y: "80%", s: "5.6rem", c: [CYAN, VIO, PINK], d: 8, dl: -4 },
  ],
  ov: [
    { k: "pyramid", x: "2%", y: "6%", s: "5rem", c: [YEL, ORG, "#e8590c"], d: 8 },
    { k: "capsule", x: "90%", y: "80%", s: "5.5rem", c: [CYAN, "#2f7bff", "#1648c8"], d: 9, dl: -3, keep: true },
    { k: "star", x: "47%", y: "5%", s: "2.6rem", c: [YEL, ORG, "#e8590c"], d: 6, dl: -1 },
  ],
  process: [
    { k: "gem", x: "3%", y: "10%", s: "4.4rem", c: [CYAN, VIO, PINK], d: 8, keep: true },
    { k: "donut", x: "90%", y: "64%", s: "5.4rem", c: [YEL, ORG, PINK], d: 10, dl: -3 },
    { k: "orb", x: "48%", y: "86%", s: "2.4rem", c: ["#d9f7c2", LIME, "#3a9d12"], d: 6, dl: -2 },
  ],
  why: [
    { k: "blob", x: "46%", y: "2%", s: "6rem", c: ["#ffd6ea", PINK, VIO], d: 9 },
    { k: "gem", x: "93%", y: "12%", s: "3rem", c: [YEL, ORG, PINK], d: 7, dl: -2 },
    { k: "ring", x: "4%", y: "84%", s: "3.6rem", c: [LIME, CYAN, VIO], d: 8, dl: -4, keep: true },
  ],
};

function Shape({ d }: { d: Def }) {
  const style = {
    "--x": d.x, "--y": d.y, "--s": d.s, "--c1": d.c[0], "--c2": d.c[1], "--c3": d.c[2],
    "--d": `${d.d ?? 7}s`, "--dl": `${d.dl ?? 0}s`,
  } as React.CSSProperties;
  const cls = `sh sh-${d.k}${d.keep ? " keep" : ""}`;
  switch (d.k) {
    case "cube":
      return <span className={cls} style={style}><span className="cb"><b /><b /><b /><b /><b /><b /></span></span>;
    case "pyramid":
      return <span className={cls} style={style}><i /><i /></span>;
    case "gem":
      return <span className={cls} style={style}><i /><i /><i /><i /><i /><i /></span>;
    default:
      return <span className={cls} style={style}><i /></span>;
  }
}

export function Deco({ kind }: { kind: DecoKind }) {
  return (
    <div className="sd-deco" aria-hidden="true">
      {DECO[kind].map((d, i) => <Shape key={i} d={d} />)}
    </div>
  );
}

/* ---------------- WHY SCENES (one per service — different from its hero and overview) ---------------- */
const Stat = ({ s, cls }: { s: Service; cls: string }) => (
  <div className={`sd-stat ${cls}`}><span><Ico name="check" /></span><p>{s.why.stat.label}<strong>{s.why.stat.value}</strong></p></div>
);

function WyWeb({ s }: { s: Service }) {
  return (
    <>
      <div className="wy-launch sd-p2"><i className="hp-ring" /><i className="hp-ring r2" /><i className="hp-ring r3" /><span className="wy-rk"><Ico name="rocket" /></span></div>
      <div className="hc wy-live sd-p3"><i />Live now</div>
      <span className="wy-cloud wc1 sd-p4" /><span className="wy-cloud wc2 sd-p3" />
      <Stat s={s} cls="sd-p4" />
      <Spark x="86%" y="14%" s={1.3} /><Spark x="6%" y="46%" s={0.9} />
    </>
  );
}
function WyMobile({ s }: { s: Service }) {
  return (
    <>
      <div className="hc wy-app sd-p2">
        <span className="wy-appic"><Ico name="phone" /></span>
        <p><strong>Your App</strong><small>★★★★★ 4.9</small></p>
        <em>Get</em>
      </div>
      <div className="wy-shots sd-p3"><i /><i /><i /></div>
      <span className="hs-trend sd-p4"><Ico name="heart" /></span>
      <Stat s={s} cls="sd-p4" />
      <Spark x="90%" y="6%" s={1.2} /><Spark x="3%" y="50%" s={0.9} />
    </>
  );
}
function WyUiux({ s }: { s: Service }) {
  return (
    <>
      <div className="hc wy-ds sd-p2">
        <p className="wy-row"><span>Dark mode</span><i className="wy-tg" /></p>
        <p className="wy-row"><span>Corners</span><i className="wy-sl" /></p>
        <div className="wy-btns"><b>Primary</b><b className="o">Outline</b></div>
        <p className="wy-sw"><i /><i /><i /><i /><i /></p>
      </div>
      <div className="hc wy-type sd-p3"><strong>Aa</strong><small>Type scale</small></div>
      <Stat s={s} cls="sd-p4" />
      <Spark x="88%" y="6%" s={1.2} /><Spark x="4%" y="86%" s={0.9} />
    </>
  );
}
function WySeo({ s }: { s: Service }) {
  return (
    <>
      <div className="wy-pod sd-p2">
        {[{ n: 2, h: "62%" }, { n: 1, h: "100%" }, { n: 3, h: "46%" }].map((b, i) => (
          <i key={b.n} style={{ "--h": b.h, "--i": i } as React.CSSProperties}>{b.n}</i>
        ))}
      </div>
      <span className="wy-crown sd-p3" />
      <span className="hs-trend sd-p4"><Ico name="search" /></span>
      <Stat s={s} cls="sd-p4" />
      <Spark x="6%" y="8%" s={1.2} /><Spark x="88%" y="48%" s={0.9} />
    </>
  );
}
function WySupport({ s }: { s: Service }) {
  return (
    <>
      <div className="wy-rack sd-p2">
        {["Website", "Database", "Backups"].map((t, i) => (
          <div key={t} className="hc wy-un" style={{ "--i": i } as React.CSSProperties}>
            <i /><b className="ln" style={{ width: `${70 - i * 12}%` }} /><u>{t}</u>
          </div>
        ))}
      </div>
      <span className="hs-trend sd-p3"><Ico name="shield" /></span>
      <Stat s={s} cls="sd-p4" />
      <Spark x="90%" y="8%" s={1.2} /><Spark x="4%" y="88%" s={0.9} />
    </>
  );
}
function WyContent({ s }: { s: Service }) {
  return (
    <>
      <div className="hc wy-b1 sd-p2"><Ln w={[90, 70, 50]} /></div>
      <div className="wy-b2 sd-p3"><span className="wy-dots"><i /><i /><i /></span></div>
      <div className="hc wy-like sd-p4"><Ico name="heart" />1.2k</div>
      <Stat s={s} cls="sd-p4" />
      <Spark x="88%" y="6%" s={1.2} /><Spark x="4%" y="60%" s={0.9} />
    </>
  );
}
const WHY: Record<Art, (p: { s: Service }) => React.JSX.Element> = {
  web: WyWeb, mobile: WyMobile, uiux: WyUiux, seo: WySeo, support: WySupport, content: WyContent,
};

export function WhyArt({ s }: { s: Service }) {
  const Scene = WHY[s.art];
  return (
    <div className={`sd-why-art sd-why-${s.art}`} aria-hidden="true">
      <div className="sd-blob" />
      <Scene s={s} />
    </div>
  );
}
