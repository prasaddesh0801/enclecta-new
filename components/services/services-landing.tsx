import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "./services-hero-sky";
import HeroArt from "./services-hero-art";
import ServicesTitle from "./services-title";
import ServicesMotion from "./services-motion";
import CtaArt from "./cta-art";
import "./services-landing.css";

/* =========================================================
   EDIT HERE — all copy lives in these arrays.
   Page = 6 sections, each glides up as you scroll (same <Reveal> as the homepage):
   Hero → Services → Process → Tech stack → Proof → CTA
   (the site footer follows after the last section)
   ========================================================= */

type Tone = "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";

const icon = (children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/* slug MUST match `slug` in lib/services-data.ts — each card opens /services/<slug> */
const SERVICES: { slug: string; title: string; text: string; tone: Tone; icon: React.ReactNode }[] = [
  {
    slug: "website-development",
    title: "Website Development",
    text: "Fast, responsive websites built around your brand, from landing pages to full e-commerce.",
    tone: "orange",
    icon: icon(<><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m13.5 5-3 14" /></>),
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    text: "From LLM-powered copilots to ML pipelines, intelligence built into your product.",
    tone: "blue",
    icon: icon(<><path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5C9.7 9.4 11.4 7.7 12 3.5Z" /><path d="M18.5 15.5c.2 1.5.8 2.1 2.3 2.3-1.5.2-2.1.8-2.3 2.3-.2-1.5-.8-2.1-2.3-2.3 1.5-.2 2.1-.8 2.3-2.3Z" /></>),
  },
  {
    slug: "saas-development",
    title: "SaaS Development",
    text: "Secure, scalable multi-tenant SaaS with subscriptions and analytics, built from the ground up.",
    tone: "pink",
    icon: icon(<><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" /></>),
  },
  {
    slug: "product-engineering",
    title: "Product Engineering",
    text: "Full-stack teams that turn ideas into polished, performant products with clean architecture.",
    tone: "violet",
    icon: icon(<><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.6M12 18.6v2.6M4.2 7.4l2.2 1.3M17.6 15.3l2.2 1.3M2.8 12h2.6M18.6 12h2.6M4.2 16.6l2.2-1.3M17.6 8.7l2.2-1.3" /></>),
  },
  {
    slug: "data-analytics",
    title: "Data & Analytics",
    text: "Data platforms that turn raw streams into decisions: pipelines, models and clear dashboards.",
    tone: "yellow",
    icon: icon(<><path d="M5 20V11M12 20V5M19 20v-7" /><path d="M3 20h18" /></>),
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    text: "Strategy, content, scheduling and community, built to deliver growth you can point to.",
    tone: "navy",
    icon: icon(<><path d="M4 10v4a1 1 0 0 0 1 1h2.5l7 4V5l-7 4H5a1 1 0 0 0-1 1Z" /><path d="M18 9.5a4 4 0 0 1 0 5" /></>),
  },
];

const STEPS = [
  { title: "Discover", text: "A short call and a written brief. We agree on goals, audience, scope, and a fixed timeline before anything is built." },
  { title: "Design", text: "Wireframes first, then full-colour screens in light and dark. You review a clickable preview and request changes." },
  { title: "Build", text: "Weekly working builds on a private link, so you see real progress instead of status reports." },
  { title: "Launch & grow", text: "We test, deploy, and stay on after launch with fixes, updates, and improvements based on real traffic." },
];

const STACK: { group: string; items: string[] }[] = [
  { group: "Front end", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "GSAP"] },
  { group: "Back end", items: ["Node.js", "PostgreSQL", "REST & GraphQL", "Stripe", "Auth & roles"] },
  { group: "Mobile", items: ["React Native", "Expo", "Push notifications", "Offline mode"] },
  { group: "Ship & run", items: ["Vercel", "AWS", "CI/CD", "Monitoring", "Daily backups"] },
];

/* Placeholder numbers — replace with your real ones */
const PROOF = [
  { value: "50+", label: "Websites and apps launched" },
  { value: "4 weeks", label: "Typical time from brief to launch" },
  { value: "95+", label: "Lighthouse performance target on every build" },
];

const PROMISES = [
  { title: "Fixed scope, fixed price", text: "You get a written quote and timeline. No surprise invoices." },
  { title: "You own everything", text: "Code, designs, domains, and accounts are handed over in your name." },
  { title: "One team, start to finish", text: "The people who design your site are the ones who build and support it." },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export default function ServicesLanding() {
  return (
    <div className="sv-page">
      <ServicesMotion />
        {/* ---------- 1 · Hero ---------- */}
        <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
          <HeroSky />
          <HeroArt />
          {/* positioned against the panel (see .sv-hero-top) so it lines up with the "U" of the title */}
          <div className="sv-hero-top">
            <span className="sv-pill">Enclecta Ventures</span>
            <p className="body-font sv-hero-lead">
              Websites, apps, and the marketing around them. Designed, built, and looked after by one team.
            </p>
          </div>

          <div className="sv-hero-bottom">
            {/* letters drop in one after another — see services-title.tsx */}
            <ServicesTitle />
            <a href="#sv-services" className="sv-scroll">
              Scroll to explore
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
          </div>
        </section>

        {/* ---------- 2 · Services ---------- */}
        <section className="sv-panel sv-p-services" id="sv-services" aria-labelledby="sv-services-title">
          <Container>
            <Reveal className="sv-head">
              <h2 id="sv-services-title" className="heading-font sv-h2">
                Everything your business needs online, from one team.
              </h2>
              <p className="body-font sv-sub">
                Pick one service or combine several. Every project starts with a free call and ends with a site you fully own.
              </p>
            </Reveal>
            <div className="sv-grid">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={(i % 3) * 90} className="h-full">
                <article className={`sv-card sv-card-${s.tone}`}>
                  <span className={`sv-tile sv-tile-${s.tone}`}>{s.icon}</span>
                  <h3 className="heading-font sv-card-title">{s.title}</h3>
                  <p className="body-font sv-card-text">{s.text}</p>
                  <Link href={`/services/${s.slug}`} className="sv-card-go" aria-label={`Learn more about ${s.title}`}>
                    <Arrow />
                  </Link>
                </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------- 3 · Process ---------- */}
        <section className="sv-panel sv-p-process" aria-labelledby="sv-process-title" data-no-reveal>
          <Container>
            <div className="sv-split">
              <Reveal className="sv-split-head">
                <h2 id="sv-process-title" className="heading-font sv-h2">
                  A project in four clear steps.
                </h2>
                <p className="body-font sv-sub">
                  You always know what is happening, what comes next, and when it will be done.
                </p>
              </Reveal>
              <ol className="sv-steps">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="sv-step">
                    <span className="sv-step-n heading-font" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="heading-font sv-step-title">{s.title}</h3>
                      <p className="body-font sv-card-text">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* ---------- 4 · Tech stack ---------- */}
        <section className="sv-panel sv-p-stack" aria-labelledby="sv-stack-title" data-no-reveal>
          <Container>
            <Reveal className="sv-head">
              <h2 id="sv-stack-title" className="heading-font sv-h2">
                Modern tools, chosen for speed and longevity.
              </h2>
              <p className="body-font sv-sub">
                We use proven technology your next developer will recognise, so you are never locked in.
              </p>
            </Reveal>
            <div className="sv-stack-grid">
              {STACK.map((g) => (
                <div key={g.group} className="sv-stack-col">
                  <h3 className="heading-font sv-stack-title">{g.group}</h3>
                  <ul className="sv-chips">
                    {g.items.map((t) => (
                      <li key={t} className="body-font sv-chip">{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------- 5 · Proof ---------- */}
        <section className="sv-panel sv-p-proof" aria-labelledby="sv-proof-title">
          <Container>
            <Reveal className="sv-head">
              <h2 id="sv-proof-title" className="heading-font sv-h2">
                What working with us looks like.
              </h2>
            </Reveal>
            <Reveal><dl className="sv-stats">
              {PROOF.map((p) => (
                <div key={p.label} className="sv-stat">
                  <dt className="body-font sv-stat-label">{p.label}</dt>
                  <dd className="heading-font sv-stat-value">{p.value}</dd>
                </div>
              ))}
            </dl></Reveal>
            <div className="sv-promises">
              {PROMISES.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="sv-promise">
                    <h3 className="heading-font sv-card-title">{p.title}</h3>
                    <p className="body-font sv-card-text">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------- 6 · CTA ---------- */}
        <section className="sv-panel sv-p-cta" aria-labelledby="sv-cta-title">
          <Container>
            <Reveal className="sv-cta ca-cta">
              <div className="ca-cta-copy">
                <h2 id="sv-cta-title" className="heading-font sv-cta-title">
                  Tell us what you want to build.
                </h2>
                <p className="body-font sv-sub">
                  Send a few lines about your project. We reply within one working day with next steps and a rough quote.
                </p>
                <Link href="/contact" className="sv-btn">
                  Start your project <Arrow />
                </Link>
              </div>
              <CtaArt icon="layers" chips={[["phone", "Free intro call"], ["shield", "Fixed price"], ["code", "You own the code"], ["bolt", "Reply in 1 day"]]} />
            </Reveal>
          </Container>
        </section>
    </div>
  );
}
