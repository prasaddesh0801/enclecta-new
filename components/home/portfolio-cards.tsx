/* =========================================================
   PORTFOLIO CARDS (homepage carousel)
   The carousel shows the SAME 6 projects as the /portfolio page. They come from lib/featured-projects.ts
   (WORKS), so a name, tag, photo or colour changed there changes here too, and every card opens its own
   page: /portfolio/<slug>.
   <Mock> is the preview inside each card: the project photo when one is set, otherwise a coloured
   placeholder built from the project's own theme colours (the same colours as its /portfolio card).
   ========================================================= */

import { WORKS } from "@/lib/featured-projects";

export type Project = {
  id: string;
  title: string;
  tags: string[];
  href: string;
  colors: [string, string, string]; // [deep, bright, soft]
  image?: string;
};

const clean = (s: string) => s.replace(/^EDIT:\s*/, "");

/* All 6 projects, in the same order as the portfolio page (3 big ones, then the 3 small ones). */
export const PROJECTS: Project[] = WORKS.map((w) => ({
  id: w.slug,
  title: w.name,
  // projects with no tags yet fall back to their one-line subtitle
  tags: w.tags.length > 0 ? w.tags : [clean(w.subtitle)],
  href: `/portfolio/${w.slug}`,
  colors: [w.theme.dark, w.theme.b1, w.theme.b2],
  image: w.image,
}));

/* ---------- preview (sizes use cqw = % of card width) ---------- */

export function Mock({ p }: { p: Project }) {
  const [deep, b1, b2] = p.colors;

  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={`${p.title} preview`} className="h-full w-full object-cover" />;
  }

  // placeholder: a tiny website in the project's colours, with its name on the hero
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${deep}, color-mix(in srgb, ${b1} 50%, ${deep}))` }}
    >
      <span aria-hidden="true" className="absolute -right-[10cqw] -top-[14cqw] h-[40cqw] w-[40cqw] rounded-full blur-[7cqw]" style={{ background: b1, opacity: 0.55 }} />
      <span aria-hidden="true" className="absolute -bottom-[14cqw] -left-[10cqw] h-[32cqw] w-[32cqw] rounded-full blur-[7cqw]" style={{ background: b2, opacity: 0.35 }} />

      {/* nav bar */}
      <div className="relative flex items-center justify-between px-[3cqw] pt-[2.4cqw]">
        <span className="h-[2cqw] w-[9cqw] rounded-full" style={{ background: "#fff", opacity: 0.85 }} />
        <span className="flex gap-[1.6cqw]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[1.2cqw] w-[4cqw] rounded-full" style={{ background: "#fff", opacity: 0.4 }} />
          ))}
        </span>
      </div>

      {/* hero: name + lines on the left, a framed screen on the right */}
      <div className="relative grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-[3cqw] px-[3.5cqw] pb-[3cqw]">
        <div className="flex min-w-0 flex-col gap-[1.6cqw]">
          <span className="heading-font truncate text-[length:6.4cqw] font-bold leading-none text-white">{p.title}</span>
          <span className="block h-[1.6cqw] w-[90%] rounded-full bg-white/45" />
          <span className="block h-[1.6cqw] w-[65%] rounded-full bg-white/30" />
          <span className="mt-[1cqw] block h-[4cqw] w-[42%] rounded-full" style={{ background: b2 }} />
        </div>
        <div className="relative h-[88%] overflow-hidden rounded-[1.8cqw] border border-white/30" style={{ background: `linear-gradient(160deg, ${b1}, ${b2})` }}>
          <span className="absolute inset-x-[10%] top-[12%] block h-[22%] rounded-[1cqw] bg-white/55" />
          <span className="absolute inset-x-[10%] top-[40%] block h-[16%] w-[45%] rounded-[1cqw] bg-white/35" />
          <span className="absolute bottom-[10%] right-[10%] block h-[16%] w-[30%] rounded-[1cqw] bg-white/35" />
        </div>
      </div>
    </div>
  );
}
