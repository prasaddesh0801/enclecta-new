import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "@/components/services/services-hero-sky";
import ServicesMotion from "@/components/services/services-motion";
import Ico from "@/components/services/service-icons";
import AboutHeroArt from "./about-hero-art";
import AboutTitle from "./about-title";
import AboutTeam from "./about-team";
import CtaArt from "@/components/services/cta-art";
import { siteConfig } from "@/lib/site";
import "@/components/services/services-landing.css"; // same palette, hero, cards and 3D tilt as /services
import "./about.css";

/* =========================================================
   EDIT HERE: all copy lives in these arrays. (The team lives in about-team.tsx.)
   Page = 7 sections, each glides up as you scroll (same <Reveal> as the homepage and /services):
   Hero → Who we are → Team → Vision, mission & values → Capabilities → How we work (numbers) → CTA
   The hero, colours, cards and motion are shared with the services page (services-landing.css, ServicesMotion).
   ========================================================= */

type Tone = "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";

const WHO = [
  "Enclecta Ventures is a website design and development company based in Pune. We build fast, dependable websites, apps and the marketing around them for growing businesses.",
  "We keep the team small and senior on purpose. The people you speak to in the first call are the ones who design, build and support your project, so nothing gets lost between departments.",
];

const FACTS: { icon: string; label: string; value: string }[] = [
  { icon: "map", label: "Based in", value: siteConfig.address },
  { icon: "layers", label: "What we do", value: "Websites, apps and marketing" },
  { icon: "users", label: "How we work", value: "One team, start to finish" },
];

const VISION = {
  title: "Our vision",
  text: "To be the web partner growing businesses trust first: known for work that is fast, honest and built to last.",
};
const MISSION = {
  title: "Our mission",
  text: "To turn ideas into polished, high-performing digital products, with clear scope, fair prices and a team that stays after launch.",
};

const VALUES: { title: string; text: string; tone: Tone; icon: string }[] = [
  { title: "Craft first", text: "We sweat the details nobody asks about: spacing, speed and the edge cases.", tone: "violet", icon: "pen" },
  { title: "Honest by default", text: "Clear quotes, plain language and early warnings when something changes.", tone: "blue", icon: "shield" },
  { title: "You own it", text: "Code, designs, domains and accounts are handed over in your name.", tone: "orange", icon: "check" },
  { title: "Always learning", text: "We test new tools, keep what works and never lock you in.", tone: "pink", icon: "bulb" },
];

/* each card opens its service page, so the slug MUST match `slug` in lib/services-data.ts */
const CAPS: { slug: string; title: string; text: string; tone: Tone; icon: string }[] = [
  { slug: "website-development", title: "Website Development", text: "Fast, responsive websites built around your brand, from landing pages to full e-commerce.", tone: "orange", icon: "code" },
  { slug: "ai-automation", title: "AI & Automation", text: "From LLM-powered copilots to ML pipelines, intelligence built into your product.", tone: "blue", icon: "sparkle" },
  { slug: "saas-development", title: "SaaS Development", text: "Secure, scalable multi-tenant SaaS with subscriptions and analytics, built from the ground up.", tone: "pink", icon: "layers" },
  { slug: "product-engineering", title: "Product Engineering", text: "Full-stack teams that turn ideas into polished, performant products with clean architecture.", tone: "violet", icon: "gear" },
  { slug: "data-analytics", title: "Data & Analytics", text: "Data platforms that turn raw streams into decisions: pipelines, models and clear dashboards.", tone: "yellow", icon: "chart" },
  { slug: "social-media-management", title: "Social Media Management", text: "Strategy, content, scheduling and community, built to deliver growth you can point to.", tone: "navy", icon: "megaphone" },
];

/* Placeholder numbers: replace with your real ones */
const PROOF = [
  { value: "50+", label: "Websites and apps launched" },
  { value: "4 weeks", label: "Typical time from brief to launch" },
  { value: "95+", label: "Lighthouse performance target on every build" },
];

const PROMISES = [
  { title: "Fixed scope, fixed price", text: "You get a written quote and timeline. No surprise invoices." },
  { title: "Weekly working builds", text: "A private preview link every week, so you see real progress." },
  { title: "We stay after launch", text: "Fixes, updates and improvements based on real traffic." },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export default function AboutLanding() {
  return (
    <div className="sv-page ab-page">
      <ServicesMotion />

      {/* ---------- 1 · Hero (same as /services: sky, glowing hub, giant title) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
        <HeroSky />
        <AboutHeroArt />
        <div className="sv-hero-top">
          <span className="sv-pill">Enclecta Ventures</span>
          <p className="body-font sv-hero-lead">
            A small, senior team that designs, builds and looks after websites, apps and the marketing around them.
          </p>
        </div>

        <div className="sv-hero-bottom">
          <AboutTitle />
          <a href="#ab-who" className="sv-scroll">
            Scroll to explore
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 2 · Who we are ---------- */}
      <section className="sv-panel sv-p-services" id="ab-who" aria-labelledby="ab-who-title">
        <Container>
          <div className="ab-who">
            <Reveal className="ab-who-copy">
              <span className="sv-pill">Who we are</span>
              <h2 id="ab-who-title" className="heading-font sv-h2">
                A small team that cares about your site as much as you do.
              </h2>
              {WHO.map((t) => (
                <p key={t} className="body-font sv-sub ab-wide">{t}</p>
              ))}
            </Reveal>
            <Reveal delay={90} className="ab-who-side">
              <div className="ab-who-card">
                <i className="ab-orb ab-orb-a" aria-hidden="true" />
                <i className="ab-orb ab-orb-b" aria-hidden="true" />
                <ul className="ab-facts">
                  {FACTS.map((f) => (
                    <li key={f.label}>
                      <span className="ab-fact-ic"><Ico name={f.icon} /></span>
                      <span>
                        <small className="body-font">{f.label}</small>
                        <strong className="heading-font">{f.value}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- 3 · Team carousel ---------- */}
      <section className="sv-panel sv-p-process ab-team-sec" id="ab-team" aria-labelledby="ab-team-title">
        <Container>
          <Reveal className="sv-head">
            <h2 id="ab-team-title" className="heading-font sv-h2">
              The people behind your next launch.
            </h2>
            <p className="body-font sv-sub">
              Designers, developers and strategists who work side by side. Hover a face to meet them.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <AboutTeam />
          </Reveal>
        </Container>
      </section>

      {/* ---------- 4 · Vision, mission and values ---------- */}
      <section className="sv-panel sv-p-stack" aria-labelledby="ab-vm-title">
        <Container>
          <Reveal className="sv-head">
            <h2 id="ab-vm-title" className="heading-font sv-h2">
              Where we are headed, and how we get there.
            </h2>
            <p className="body-font sv-sub">
              Two ideas guide every decision we make, backed by four values we hold ourselves to.
            </p>
          </Reveal>

          <div className="ab-vm">
            {[
              { ...VISION, icon: "target", tone: "violet" as Tone },
              { ...MISSION, icon: "rocket", tone: "blue" as Tone },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 90} className="h-full">
                <article className="ab-big">
                  <span className={`sv-tile sv-tile-${b.tone}`}><Ico name={b.icon} /></span>
                  <h3 className="heading-font ab-big-title">{b.title}</h3>
                  <p className="body-font sv-card-text">{b.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="ab-values">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 70} className="h-full">
                <article className="ab-value">
                  <span className={`sv-tile sv-tile-${v.tone}`}><Ico name={v.icon} /></span>
                  <h3 className="heading-font sv-card-title">{v.title}</h3>
                  <p className="body-font sv-card-text">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- 5 · Capabilities (cards open the service pages) ---------- */}
      <section className="sv-panel sv-p-proof" aria-labelledby="ab-caps-title">
        <Container>
          <Reveal className="sv-head">
            <h2 id="ab-caps-title" className="heading-font sv-h2">
              What we are really good at.
            </h2>
            <p className="body-font sv-sub">
              Six areas of expertise under one roof. Open any card to see how we work on it.
            </p>
          </Reveal>
          <div className="sv-grid">
            {CAPS.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 90} className="h-full">
                <article className={`sv-card sv-card-${s.tone}`}>
                  <span className={`sv-tile sv-tile-${s.tone}`}><Ico name={s.icon} /></span>
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

      {/* ---------- 6 · How we work (numbers count up) ---------- */}
      <section className="sv-panel sv-p-services" aria-labelledby="ab-proof-title">
        <Container>
          <Reveal className="sv-head">
            <h2 id="ab-proof-title" className="heading-font sv-h2">
              What working with us looks like.
            </h2>
          </Reveal>
          <Reveal>
            <dl className="sv-stats">
              {PROOF.map((p) => (
                <div key={p.label} className="sv-stat">
                  <dt className="body-font sv-stat-label">{p.label}</dt>
                  <dd className="heading-font sv-stat-value">{p.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
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

      {/* ---------- 7 · CTA ---------- */}
      <section className="sv-panel sv-p-cta" aria-labelledby="sv-cta-title">
        <Container>
          <Reveal className="sv-cta ca-cta">
            <div className="ca-cta-copy">
              <h2 id="sv-cta-title" className="heading-font sv-cta-title">
                Let&rsquo;s build something together.
              </h2>
              <p className="body-font sv-sub">
                Send a few lines about your project. We reply within one working day with next steps and a rough quote.
              </p>
              <div className="ab-cta-row">
                <Link href="/contact" className="sv-btn">
                    Work with our team <Arrow />
                </Link>
                <Link href="/portfolio" className="ab-ghost body-font">
                  See our work
                </Link>
              </div>
            </div>

            <CtaArt icon="rocket" chips={[["bolt", "Reply in 1 day"], ["shield", "Fixed quote"], ["refresh", "Weekly builds"], ["heart", "You own it"]]} />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
