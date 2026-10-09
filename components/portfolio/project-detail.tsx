import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import Button from "@/components/ui/button";
import Shot from "./shot";
import { nextWork, type FeatureIcon, type Work } from "@/lib/featured-projects";
import "./portfolio-v2.css"; // .pw-ph / .pw-img (photo + placeholder)
import "./project-page.css";

/* =========================================================
   Project page (/portfolio/<slug>) — same design language as the service detail pages:
   separate full-width sections (no white card), one accent colour per project.

   Hero → Overview → Challenge & Solution → Design & UX → Key features → Technologies → Gallery → Results
        → Next project + CTA
   Every section reads from `work.detail` in lib/featured-projects.ts. Colours come from `work.theme`
   (b1 = main accent, b2 = second accent). Each block glides up on scroll (<Reveal>).
   ========================================================= */

type IconName = FeatureIcon | "target" | "bulb" | "pen" | "code" | "image" | "chart" | "check" | "back" | "arrow";

const PATHS: Record<IconName, ReactNode> = {
  target: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r=".8" fill="currentColor" /></>),
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
  pen: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />,
  grid: (<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>),
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />,
  image: (<><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><circle cx="9" cy="10" r="1.5" /><path d="m4 17 5-5 4 4 3-3 4 4" /></>),
  chart: <path d="M4 20v-9M10 20V5M16 20v-8M3 20.5h18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  devices: (<><rect x="3" y="5" width="14" height="10" rx="2" /><path d="M8 19h4" /><rect x="18" y="9" width="3" height="8" rx="1" /></>),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  cart: (<><path d="M3 4h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.3h7.7a1.5 1.5 0 0 0 1.45-1.1L20 8H6.2" /><circle cx="9.5" cy="19.3" r="1.1" /><circle cx="17" cy="19.3" r="1.1" /></>),
  bolt: <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />,
  users: <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1a4 4 0 0 0-3-3.9" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

function Ico({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

/* b1 = main accent (both themes), b2 = soft second colour for the gradients */
const vars = (t: Work["theme"]) => ({ "--pd-bright": t.b1, "--pd-bright2": t.b2, "--pd-dark": t.b1 }) as CSSProperties;

function Head({ id, title, text, icon }: { id: string; title: string; text?: string; icon?: IconName }) {
  return (
    <Reveal className="pd-head">
      <h2 id={id} className="heading-font pd-h2">
        {icon && (
          <span className="pd-hi">
            <Ico name={icon} />
          </span>
        )}
        {title}
      </h2>
      {text && <p className="body-font pd-text">{text}</p>}
    </Reveal>
  );
}

/** round badge with the tool's first letters (swap for a real logo if you like) */
const Badge = ({ name }: { name: string }) => <span className="pd-tech-ic heading-font">{name.replace(/^EDIT:\s*/, "").slice(0, 2)}</span>;

export default function ProjectDetail({ work: w }: { work: Work }) {
  const d = w.detail;
  const next = nextWork(w.slug);
  const k = (n: number) => ({ "--k": n }) as CSSProperties;

  return (
    <div className="pd-page" style={vars(w.theme)}>
      {/* 1 · Hero: plays once on load */}
      <section className="pd-hero" aria-labelledby="pd-h1" data-no-reveal>
        <Container>
          <div className="pd-hero-grid">
            <div className="pd-hero-copy">
              <nav className="pd-crumb pd-in" style={k(0)} aria-label="Breadcrumb">
                <Link href="/portfolio">Portfolio</Link>
                <span aria-hidden="true">/</span>
                <span>{w.name}</span>
              </nav>
              <h1 id="pd-h1" className="heading-font pd-h1">
                <span className="pd-line">
                  <span style={k(1)}>{w.name}</span>
                </span>
              </h1>
              <p className="body-font pd-sub pd-in" style={k(2)}>{w.subtitle}</p>
              {w.tags.length > 0 && (
                <ul className="pd-tags body-font pd-in" style={k(3)}>
                  {w.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <p className="body-font pd-text pd-hero-lead pd-in" style={k(3)}>{w.summary}</p>
              <div className="pd-actions pd-in" style={k(4)}>
                <Button href="#pd-overview" variant="neon" size="lg" className="pd-btn">
                  Read the case study
                </Button>
                <Link href="/portfolio" className="pd-back body-font">
                  <Ico name="back" /> All projects
                </Link>
              </div>
            </div>

            {/* the hero object: rings behind a framed project photo, with floating tool chips */}
            <div className="pd-stage pd-in" style={k(2)}>
              <i className="pd-st-ring pd-st-r1" aria-hidden="true" />
              <i className="pd-st-ring pd-st-r2" aria-hidden="true" />
              <div className="pd-hero-img">
                <Shot src={w.image} name={w.name} alt={w.name} sizes="(min-width: 900px) 45vw, 100vw" />
              </div>
              {d.tech.slice(0, 3).map((t, i) => (
                <span key={t.name} className={`pd-float pd-float-${i + 1}`} aria-hidden="true">
                  <i />
                  {t.name.replace(/^EDIT:\s*/, "")}
                </span>
              ))}
            </div>
          </div>

          <dl className="pd-glance pd-in" style={k(5)}>
            {d.tech.map((t) => (
              <div key={t.name} className="pd-glance-item">
                <dt className="body-font">{t.role}</dt>
                <dd className="heading-font">{t.name}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 2 · Overview */}
      <section className="pd-section" id="pd-overview" aria-labelledby="pd-overview-h">
        <Container>
          <Head id="pd-overview-h" title="Project overview" text={d.overview} />
        </Container>
      </section>

      {/* 3 · Challenge & solution */}
      <section className="pd-section pd-band" aria-labelledby="pd-challenge-h">
        <Container>
          <Head id="pd-challenge-h" title="From problem to solution" text="What we were asked to fix, and how we fixed it." />
          <div className="pd-duo">
            <Reveal className="pd-panel">
              <span className="pd-ic"><Ico name="target" /></span>
              <h3 className="heading-font">The challenge</h3>
              <ul className="pd-checks body-font">
                {d.challenge.map((t) => (
                  <li key={t}>
                    <span className="pd-tick"><Ico name="check" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={90} className="pd-panel">
              <span className="pd-ic"><Ico name="bulb" /></span>
              <h3 className="heading-font">Our solution</h3>
              <ul className="pd-checks body-font">
                {d.solution.map((t) => (
                  <li key={t}>
                    <span className="pd-tick"><Ico name="check" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4 · Design & UX */}
      <section className="pd-section" aria-labelledby="pd-design-h">
        <Container>
          <Head id="pd-design-h" title="Design & UX" text={d.design.text} />
          <div className="pd-design">
            <Reveal className="pd-shot pd-wide">
              <Shot src={d.design.images[0]} name={w.name} alt={`${w.name} on desktop`} sizes="(min-width: 900px) 50vw, 100vw" />
            </Reveal>
            <Reveal delay={90} className="pd-shot pd-tall">
              <Shot src={d.design.images[1]} name={w.name} alt={`${w.name} on mobile`} sizes="(min-width: 900px) 25vw, 60vw" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5 · Key features */}
      <section className="pd-section pd-band" aria-labelledby="pd-features-h">
        <Container>
          <Head id="pd-features-h" title="Key features" />
          <ul className="pd-list">
            {d.features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={(i % 2) * 90} className="pd-item">
                  <span className="pd-ic"><Ico name={f.icon} /></span>
                  <div>
                    <h3 className="heading-font">{f.title}</h3>
                    <p className="body-font">{f.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6 · Technologies */}
      <section className="pd-section" aria-labelledby="pd-tech-h">
        <Container>
          <Head id="pd-tech-h" title="Technologies used" text="Proven tools, each picked for a clear job." />
          <ul className="pd-techs">
            {d.tech.map((t, i) => (
              <li key={t.name}>
                <Reveal delay={i * 90} className="pd-tech-i">
                  <Badge name={t.name} />
                  <span>
                    <strong className="body-font pd-tech-n">{t.name}</strong>
                    <span className="body-font pd-tech-r">{t.role}</span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 7 · Media gallery */}
      <section className="pd-section pd-band" aria-labelledby="pd-gallery-h">
        <Container>
          <Head id="pd-gallery-h" title="Media gallery" />
          <div className="pd-gal">
            {d.gallery.map((src, i) => (
              <Reveal key={i} delay={i * 90} className="pd-shot">
                <Shot src={src} name={w.name} alt={`${w.name} screen ${i + 1}`} sizes={i === 0 ? "(min-width: 760px) 55vw, 100vw" : "(min-width: 760px) 35vw, 100vw"} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 8 · Results */}
      <section className="pd-section" aria-labelledby="pd-results-h">
        <Container>
          <Head id="pd-results-h" title="Project results" text={d.results.text} />
          <ul className="pd-stats">
            {d.results.stats.map((s, i) => (
              <li key={s.label}>
                <Reveal delay={i * 90} className="pd-stat">
                  <strong className="heading-font pd-sv">{s.value}</strong>
                  <span className="body-font pd-sl">{s.label}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 9 · Next project + CTA */}
      <section className="pd-section pd-cta-sec" aria-labelledby="pd-cta-h">
        <Container>
          <Reveal>
            <Link href={`/portfolio/${next.slug}`} className="pd-next-card" style={vars(next.theme)}>
              <span className="pd-next-thumb">
                <Shot src={next.image} name={next.name} sizes="12rem" />
              </span>
              <span className="pd-next-txt">
                <small className="body-font">Explore next project</small>
                <strong className="heading-font">{next.name}</strong>
                <span className="body-font">{next.subtitle}</span>
              </span>
              <span className="pd-next-go">
                <Ico name="arrow" />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <div className="pd-cta">
              <div className="pd-cta-copy">
                <h2 id="pd-cta-h" className="heading-font pd-h2">Have a project in mind?</h2>
                <p className="body-font pd-text">Let&apos;s create something amazing together.</p>
              </div>
              <Button href="/contact" variant="neon" size="lg" className="pd-btn">
                Start a project
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
