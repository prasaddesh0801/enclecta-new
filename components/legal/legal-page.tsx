import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "@/components/services/services-hero-sky";
import HeroArt, { type HeroChipKey } from "@/components/services/services-hero-art";
import Ico from "@/components/services/service-icons";
import LegalTitle, { layoutTitle } from "./legal-title";
import "@/components/services/services-landing.css";
import "./legal.css";

/* Shared layout for /privacy and /terms.
   Hero (same sky, glowing hub and giant title as /services) → 1 · at a glance → 2 · the full text → footer.
   Each page only supplies its words and four hero icons (see app/privacy and app/terms). */

export type LegalSection = { title: string; body: string[] };
export type LegalHighlight = { icon: string; title: string; text: string; tone: "orange" | "blue" | "pink" | "violet" };

const TONES: Record<LegalHighlight["tone"], [string, string]> = {
  orange: ["#ffbd90", "#ff8f5e"],
  blue: ["#6fb7ff", "#3b8df5"],
  pink: ["#ffa8c8", "#f4709f"],
  violet: ["#cbadf8", "#a47bec"],
};

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export default function LegalPage({
  title,
  titleLabel,
  lead,
  updated,
  heroIcons,
  glance,
  pledge,
  intro,
  sections,
  contactEmail,
  other,
}: {
  /** the giant hero title, e.g. "Privacy Policy" */
  title: string;
  /** accessible name for the title */
  titleLabel: string;
  lead: string;
  updated: string;
  /** glyphs for the four glowing hero tiles */
  heroIcons: Partial<Record<HeroChipKey, React.ReactNode>>;
  /** section 1 */
  glance: { heading: string; text: string; items: LegalHighlight[] };
  pledge: { icon: string; title: string; text: string };
  /** section 2 */
  intro: string;
  sections: LegalSection[];
  contactEmail: string;
  /** link to the sibling legal page */
  other: { label: string; href: string };
}) {
  /* the intro copy lines up with the 2nd letter of the title, like "U" on /services */
  const leadX = (layoutTitle(title)[1]?.x ?? 100) / 1000;

  return (
    <div className="sv-page lg-page">
      {/* ---------- hero (same as /services) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="lg-hero-title" data-no-reveal>
        <HeroSky />
        <HeroArt icons={heroIcons} />
        <div className="sv-hero-top" style={{ "--lg-lead-x": leadX } as React.CSSProperties}>
          <span className="sv-pill">Enclecta Ventures</span>
          <p className="body-font sv-hero-lead">{lead}</p>
        </div>
        <div className="sv-hero-bottom">
          <LegalTitle text={title} label={titleLabel} />
          <a href="#lg-glance" className="sv-scroll">
            Scroll to read
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 1 · at a glance ---------- */}
      <section className="sv-panel sv-p-services lg-sec" id="lg-glance" aria-labelledby="lg-glance-h">
        <Container>
          <Reveal className="sv-head">
            <h2 id="lg-glance-h" className="heading-font sv-h2">{glance.heading}</h2>
            <p className="body-font sv-sub">{glance.text}</p>
          </Reveal>

          <ul className="lg-grid">
            {glance.items.map((it, i) => (
              <li key={it.title}>
                <Reveal delay={(i % 4) * 90} className="h-full">
                  <article className="lg-card" style={{ "--c1": TONES[it.tone][0], "--c2": TONES[it.tone][1] } as React.CSSProperties}>
                    <span className="lg-ic"><Ico name={it.icon} /></span>
                    <h3 className="heading-font lg-card-title">{it.title}</h3>
                    <p className="body-font sv-card-text">{it.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={120}>
            <div className="lg-pledge">
              <span className="lg-pledge-ic"><Ico name={pledge.icon} /></span>
              <div>
                <h3 className="heading-font lg-pledge-title">{pledge.title}</h3>
                <p className="body-font sv-card-text">{pledge.text}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- 2 · the full text ---------- */}
      <section className="sv-panel sv-p-process lg-sec" id="lg-full" aria-labelledby="lg-full-h">
        <Container>
          <div className="lg-split">
            <aside className="lg-toc" aria-label="On this page">
              <p className="body-font lg-toc-label">On this page</p>
              <ol>
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a href={`#lg-s-${i}`} className="body-font">
                      <span aria-hidden="true">{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="lg-doc">
              <Reveal>
                <h2 id="lg-full-h" className="heading-font sv-h2">The full {titleLabel.toLowerCase()}.</h2>
                <p className="body-font lg-updated">Last updated: {updated}</p>
                <p className="body-font sv-sub lg-intro">{intro}</p>
              </Reveal>

              {sections.map((s, i) => (
                <Reveal key={s.title} className="lg-block">
                  <section id={`lg-s-${i}`} aria-labelledby={`lg-s-${i}-h`}>
                    <h3 id={`lg-s-${i}-h`} className="heading-font lg-block-title">
                      <span className="lg-n heading-font" aria-hidden="true">{i + 1}</span>
                      {s.title}
                    </h3>
                    {s.body.map((p) => (
                      <p key={p} className="body-font lg-p">{p}</p>
                    ))}
                  </section>
                </Reveal>
              ))}

              <Reveal>
                <div className="lg-contact">
                  <div>
                    <h3 className="heading-font lg-block-title lg-contact-title">Questions?</h3>
                    <p className="body-font sv-card-text">
                      Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and we will reply within one working day.
                    </p>
                  </div>
                  <div className="lg-contact-actions">
                    <Link href="/contact" className="sv-btn">
                      Contact us <Arrow />
                    </Link>
                    <Link href={other.href} className="lg-link body-font">
                      {other.label} <Arrow />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
