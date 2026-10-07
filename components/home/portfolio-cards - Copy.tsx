/* =========================================================
   PORTFOLIO CARDS — the <Mock> placeholder previews live here.
   Project data (titles, tags, images, colours) is in lib/portfolio-data.ts.
   ========================================================= */

import { PORTFOLIO } from "@/lib/portfolio-data";

export type Project = {
  id: string;
  title: string;
  tags: string[];
  href: string;
  kind: "travel" | "shop" | "dashboard" | "app" | "brand";
  colors: [string, string, string];
  image?: string;
};

/* The homepage carousel reads from lib/portfolio-data.ts, the same list the /portfolio pages use.
   Edit projects (title, tags, image, colours) THERE. */
export const PROJECTS: Project[] = PORTFOLIO.map((p) => ({
  id: p.slug,
  title: p.name,
  tags: p.tags,
  href: `/portfolio/${p.slug}`,
  kind: p.kind,
  colors: p.colors,
  image: p.image,
}));

/* ---------- placeholder previews (sizes use cqw = % of card width) ---------- */

export function Mock({ p }: { p: Project }) {
  const [c1, c2, c3] = p.colors;

  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={`${p.title} preview`} className="h-full w-full object-cover" />;
  }

  const bar = (w: string, o = 0.9) => (
    <span className="block h-[1.8cqw] rounded-full" style={{ width: w, background: c3, opacity: o }} />
  );
  const nav = (
    <div className="flex items-center justify-between px-[3cqw] pt-[2.4cqw]">
      <span className="h-[2cqw] w-[9cqw] rounded-full" style={{ background: c3, opacity: 0.85 }} />
      <span className="flex gap-[1.6cqw]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[1.2cqw] w-[4cqw] rounded-full" style={{ background: c3, opacity: 0.4 }} />
        ))}
      </span>
    </div>
  );

  switch (p.kind) {
    case "travel":
      return (
        <div className="flex h-full flex-col" style={{ background: c1 }}>
          {nav}
          <div className="grid flex-1 grid-cols-[1fr_1.5fr] items-center gap-[3cqw] px-[3cqw] pb-[3cqw]">
            <div className="flex flex-col gap-[1.6cqw]">
              <span className="block h-[3.6cqw] w-[80%] rounded-full" style={{ background: c3 }} />
              <span className="block h-[3.6cqw] w-[55%] rounded-full" style={{ background: c3 }} />
              {bar("90%", 0.4)}
              {bar("70%", 0.4)}
              <span className="mt-[1cqw] block h-[4cqw] w-[45%] rounded-full border" style={{ borderColor: c3 }} />
            </div>
            <div className="relative h-full overflow-hidden rounded-[1.8cqw]" style={{ background: `linear-gradient(160deg, ${c2}, #3a2f7a)` }}>
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[70%] w-full">
                <polygon points="0,60 25,18 45,42 65,10 100,60" fill="#ffffff" opacity="0.85" />
                <polygon points="0,60 30,34 55,52 80,28 100,60" fill={c1} opacity="0.7" />
              </svg>
              <span className="absolute right-[10%] top-[14%] h-[70%] w-[24%] rounded-[1.6cqw] border" style={{ background: c1, borderColor: c3 }} />
            </div>
          </div>
        </div>
      );

    case "shop":
      return (
        <div className="flex h-full flex-col" style={{ background: c1 }}>
          {nav}
          <div className="grid flex-1 grid-cols-2 items-center gap-[3cqw] px-[4cqw] pb-[3cqw]">
            <div className="flex flex-col gap-[1.6cqw]">
              <span className="block h-[3.4cqw] w-[85%] rounded-full" style={{ background: c3 }} />
              <span className="block h-[3.4cqw] w-[60%] rounded-full" style={{ background: c3 }} />
              <span className="block h-[1.6cqw] w-[90%] rounded-full" style={{ background: c3, opacity: 0.35 }} />
              <span className="mt-[1cqw] block h-[4.2cqw] w-[40%] rounded-[1cqw]" style={{ background: c3 }} />
            </div>
            <div className="flex h-full items-end justify-center">
              <span className="block h-[92%] w-[70%] rounded-t-full" style={{ background: `linear-gradient(180deg, ${c2}, ${c1})`, border: `0.5cqw solid ${c2}` }} />
            </div>
          </div>
        </div>
      );

    case "dashboard":
      return (
        <div className="grid h-full grid-cols-[14%_1fr] gap-[2cqw] p-[2.4cqw]" style={{ background: c1 }}>
          <div className="flex flex-col gap-[1.6cqw] rounded-[1.4cqw] p-[1.4cqw]" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-[1.4cqw] rounded-full" style={{ background: c2, opacity: i === 0 ? 0.9 : 0.35 }} />
            ))}
          </div>
          <div className="flex flex-col gap-[2cqw]">
            <div className="flex gap-[2cqw]">
              {[c2, c3, c2].map((c, i) => (
                <span key={i} className="block h-[7cqw] flex-1 rounded-[1.2cqw]" style={{ background: "rgba(255,255,255,0.07)", borderTop: `0.6cqw solid ${c}` }} />
              ))}
            </div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full flex-1 rounded-[1.2cqw]" style={{ background: "rgba(255,255,255,0.05)" }}>
              <polyline points="0,34 15,26 30,30 48,14 65,20 82,6 100,12" fill="none" stroke={c3} strokeWidth="1.4" />
              <polygon points="0,40 0,34 15,26 30,30 48,14 65,20 82,6 100,12 100,40" fill={c2} opacity="0.35" />
            </svg>
          </div>
        </div>
      );

    case "app":
      return (
        <div className="grid h-full place-items-center" style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}>
          <div className="flex h-[88%] w-[34%] flex-col items-center gap-[2cqw] rounded-[3cqw] border p-[2cqw]" style={{ background: "rgba(20,16,60,0.55)", borderColor: "rgba(255,255,255,0.35)" }}>
            <span className="block h-[1.4cqw] w-[45%] rounded-full" style={{ background: c3, opacity: 0.7 }} />
            <svg viewBox="0 0 36 36" className="w-[70%]">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke={c3} strokeWidth="4" strokeLinecap="round" strokeDasharray="66 88" transform="rotate(-90 18 18)" />
            </svg>
            {[0, 1].map((i) => (
              <span key={i} className="block h-[4cqw] w-full rounded-[1.2cqw]" style={{ background: "rgba(255,255,255,0.14)" }} />
            ))}
          </div>
        </div>
      );

    case "brand":
      return (
        <div className="flex h-full flex-col" style={{ background: c1 }}>
          {nav}
          <div className="relative flex flex-1 items-end justify-center gap-[4cqw] pb-[3cqw]">
            <div className="flex flex-col items-center">
              <span className="block h-[3cqw] w-[4cqw] rounded-t-[0.8cqw]" style={{ background: c3 }} />
              <span className="block h-[15cqw] w-[9cqw] rounded-[1.6cqw]" style={{ background: `linear-gradient(90deg, ${c2}, ${c3})` }} />
            </div>
            <span className="block h-[9cqw] w-[6cqw] rounded-t-full" style={{ background: c2, opacity: 0.55 }} />
          </div>
        </div>
      );
  }
}
