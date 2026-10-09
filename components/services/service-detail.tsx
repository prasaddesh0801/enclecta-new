import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import Button from "@/components/ui/button";
import Ico from "./service-icons";
import { SERVICES, type Service } from "@/lib/services-data";
import "./service-detail.css";

/* Every block below is wrapped in <Reveal> (the same scroll-driven glide-up as the homepage).
 */

/* Light theme uses a bright pastel pair per service (the same colours as the services-page cards);
   dark theme keeps the original muted accent from services-data.ts. */
const BRIGHT: Record<string, [string, string]> = {
  // [main colour, second colour for the soft two-tone gradients]
  "website-development": ["#ffab85", "#ffd3c2"], // lighter peach-orange
  "ai-automation": ["#3fb6ff", "#a2ebf3"], // sky
  "saas-development": ["#ff6fae", "#ffc9b9"], // bubblegum
  "product-engineering": ["#a66cff", "#e6b8ff"], // lilac
  "data-analytics": ["#ffd964", "#ffe9bd"], // lighter butter-yellow
  "social-media-management": ["#8e9cec", "#cdd5f9"], // very light navy-blue (was mint green)
};
const accentVars = (slug: string, dark: string) =>
  ({ "--sd-dark": dark, "--sd-bright": (BRIGHT[slug] ?? [dark, dark])[0], "--sd-bright2": (BRIGHT[slug] ?? [dark, dark])[1] }) as CSSProperties;

function Head({ id, title, text }: { id: string; title: string; text?: string }) {
  return (
    <Reveal className="sd-head">
      <h2 id={id} className="heading-font sd-h2">{title}</h2>
      {text && <p className="body-font sd-text">{text}</p>}
    </Reveal>
  );
}

export default function ServiceDetail({ service: s }: { service: Service }) {
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const k = (n: number) => ({ "--k": n }) as CSSProperties;
  const floats = s.tools[0][1].slice(0, 3); // tool names that float around the hero object

  return (
    <div className="sd-page" style={accentVars(s.slug, s.accent)}>
      {/* 1 · Hero: plays once on load */}
      <section className="sd-hero" aria-labelledby="sd-h1" data-no-reveal>
        <Container>
          <div className="sd-hero-grid">
            <div className="sd-hero-copy">
              <nav className="sd-crumb sd-in" style={k(0)} aria-label="Breadcrumb">
                <Link href="/services">Services</Link>
                <span aria-hidden="true">/</span>
                <span>{s.name}</span>
              </nav>
              <h1 id="sd-h1" className="heading-font sd-h1">
                {s.heroTitle.map((line, i) => (
                  <span key={line} className="sd-line">
                    <span style={k(i + 1)}>{line}</span>
                  </span>
                ))}
              </h1>
              <p className="body-font sd-text sd-hero-lead sd-in" style={k(3)}>{s.heroText}</p>
              <div className="sd-actions sd-in" style={k(4)}>
                <Button href="#sd-how" variant="neon" size="lg" className="sd-btn">
                  See how we work
                </Button>
              </div>
            </div>

            {/* the hero object: rings, a glass tile with the service icon, and floating tool chips */}
            <div className="sd-stage sd-in" style={k(2)} aria-hidden="true">
              <i className="sd-st-ring sd-st-r1" />
              <i className="sd-st-ring sd-st-r2" />
              <i className="sd-st-ring sd-st-r3" />
              <span className="sd-core">
                <Ico name={s.icon} />
              </span>
              {floats.map((t, i) => (
                <span key={t} className={`sd-float sd-float-${i + 1}`}>
                  <i />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <dl className="sd-glance sd-in" style={k(5)}>
            {s.glance.map(([label, value]) => (
              <div key={label} className="sd-glance-item">
                <dt className="body-font">{label}</dt>
                <dd className="heading-font">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 2 · What we deliver */}
      <section className="sd-section" aria-labelledby="sd-deliver-h">
        <Container>
          <Head id="sd-deliver-h" title={s.intro[0]} text={s.intro[1]} />
          <ul className="sd-list">
            {s.deliver.map(([icon, title, text], i) => (
              <li key={title}>
                <Reveal delay={(i % 3) * 90} className="sd-item">
                  <span className="sd-ic"><Ico name={icon} /></span>
                  <div>
                    <h3 className="heading-font">{title}</h3>
                    <p className="body-font">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3 · How we work */}
      <section className="sd-section sd-band" id="sd-how" aria-labelledby="sd-how-h">
        <Container>
          <Head id="sd-how-h" title="How a project runs" text="Four clear stages, so you always know what is happening and what comes next." />
          <ol className="sd-steps">
            {s.steps.map(([title, text], i) => (
              <li key={title}>
                <Reveal delay={i * 90} className="sd-step">
                  <span className="sd-step-n heading-font" aria-hidden="true">{i + 1}</span>
                  <h3 className="heading-font">{title}</h3>
                  <p className="body-font">{text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4 · Tools */}
      <section className="sd-section" aria-labelledby="sd-tools-h">
        <Container>
          <Head id="sd-tools-h" title="Tools we use" text="Proven technology your next developer will recognise, so you are never locked in." />
          <div className="sd-tools">
            {s.tools.map(([group, items], i) => (
              <Reveal key={group} delay={i * 90} className="sd-tool-col">
                <h3 className="heading-font">{group}</h3>
                <ul className="sd-chips">
                  {items.map((t) => (
                    <li key={t} className="body-font">{t}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5 · Outcomes */}
      <section className="sd-section sd-band" aria-labelledby="sd-out-h">
        <Container>
          <Head id="sd-out-h" title="What you can expect" />
          <ul className="sd-outcomes">
            {s.outcomes.map(([title, text], i) => (
              <li key={title}>
                <Reveal delay={i * 90} className="sd-outcome">
                  <span className="sd-tick"><Ico name="check" /></span>
                  <h3 className="heading-font">{title}</h3>
                  <p className="body-font">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6 · FAQ */}
      <section className="sd-section" aria-labelledby="sd-faq-h">
        <Container>
          <Head id="sd-faq-h" title="Common questions" />
          <div className="sd-faq">
            {s.faqs.map(([q, a], i) => (
              <Reveal key={q} delay={i * 60}>
                <details className="sd-q">
                  <summary className="heading-font">{q}</summary>
                  <p className="body-font">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 7 · CTA */}
      <section className="sd-section sd-cta-sec" aria-labelledby="sd-cta-h">
        <Container>
          <Reveal>
            <div className="sd-cta">
              <div className="sd-cta-copy">
                <h2 id="sd-cta-h" className="heading-font sd-h2">{s.cta[0]}</h2>
                <p className="body-font sd-text">{s.cta[1]}</p>
              </div>
              <Button href={`/contact?service=${s.slug}#contact-form`} variant="neon" size="lg" className="sd-btn">
                Get a free quote
              </Button>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <nav className="sd-more" aria-label="Other services">
              <span className="body-font">Other services</span>
              {others.map((o) => (
                <Link key={o.slug} href={`/services/${o.slug}`} className="sd-more-link body-font" style={accentVars(o.slug, o.accent)}>
                  <Ico name={o.icon} />
                  {o.name}
                </Link>
              ))}
            </nav>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
