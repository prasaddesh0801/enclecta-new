import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "@/components/services/services-hero-sky";
import ServicesMotion from "@/components/services/services-motion";
import PortfolioHeroArt from "./portfolio-hero-art";
import PortfolioTitle from "./portfolio-title";
import SectionHead from "./section-head";
import FeaturedProjects from "./featured-projects";
import PortfolioWork from "./portfolio-work";
import PortfolioTech from "./portfolio-tech";
import ProcessSteps from "./process-steps";
import CtaArt from "@/components/services/cta-art";
import { FEATURED, OTHERS, TECH } from "@/lib/featured-projects";
import "@/components/services/services-landing.css"; // same palette, hero, cards and 3D tilt as /services
import "./portfolio.css";
import "./portfolio-v2.css";

/* =========================================================
   Page = 6 sections, each glides up as you scroll (same <Reveal> as the homepage):
   Hero → Featured projects (3 big 3D cards + 3 small "Explore other projects" cards) → What we can build (services)
   → Technologies (2 moving rows) → How every project runs (steps appear one by one) → CTA
   The hero is unchanged. All 6 projects (and their own pages) live in lib/featured-projects.ts.
   ========================================================= */

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

const STEPS: [string, string][] = [
  ["Discover", "We learn your goals, users and constraints, then agree scope and timeline."],
  ["Design", "Layouts and a visual direction you approve before any code is written."],
  ["Build", "Fast, tested code in short cycles, with a preview link you can open any time."],
  ["Launch and support", "We go live, watch performance and stay on hand to improve it."],
];

export default function PortfolioLanding() {
  return (
    <div className="sv-page pl-page">
      <ServicesMotion />

      {/* ---------- 1 · Hero (unchanged) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
        <HeroSky />
        <PortfolioHeroArt />
        <div className="sv-hero-top">
          <span className="sv-pill">Enclecta Ventures</span>
          <p className="body-font sv-hero-lead">
            Websites, apps and brands we have built, from first sketch to launch.
          </p>
        </div>
        <div className="sv-hero-bottom">
          <PortfolioTitle />
          <a href="#pl-about" className="sv-scroll">
            Scroll to explore
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 2 · Featured projects: 3 big cards, then 3 small cards ---------- */}
      <section className="sv-panel sv-p-services" id="pl-about" aria-labelledby="pl-feat-title">
        <Container>
          <SectionHead
            id="pl-feat-title"
            eyebrow="Featured work"
            title="Featured"
            accent="projects."
            text="A closer look at some of our best work. Move your pointer over a project to explore it."
          >
            <dl className="pw-stats">
              <div>
                <dt className="body-font">Projects delivered</dt>
                <dd className="heading-font">{FEATURED.length + OTHERS.length}</dd>
              </div>
              <div>
                <dt className="body-font">Technologies</dt>
                <dd className="heading-font">{TECH.length}</dd>
              </div>
              <div>
                <dt className="body-font">Reply time</dt>
                <dd className="heading-font">1 day</dd>
              </div>
            </dl>
          </SectionHead>
          <FeaturedProjects projects={FEATURED} others={OTHERS} />
        </Container>
      </section>

      {/* ---------- 3 · What we can build (services only) ---------- */}
      <section className="sv-panel sv-p-services" aria-labelledby="pl-build-title">
        <Container>
          <SectionHead
            id="pl-build-title"
            eyebrow="Our services"
            title="What we can"
            accent="build."
            text="From a single website to a full product, we turn your ideas into digital experiences."
          />
          <PortfolioWork />
        </Container>
      </section>

      {/* ---------- 4 · Technologies (2 moving rows) ---------- */}
      <section className="sv-panel sv-p-services" aria-labelledby="pl-tech-title">
        <Container>
          <SectionHead
            id="pl-tech-title"
            eyebrow="Our stack"
            title="Technologies"
            accent="we work with."
            text="Modern, proven tools chosen for speed and longevity."
          />
        </Container>
        <PortfolioTech />
      </section>

      {/* ---------- 5 · How we deliver (steps appear one by one) ---------- */}
      <section className="sv-panel sv-p-services" aria-labelledby="pl-process-title">
        <Container>
          <SectionHead id="pl-process-title" eyebrow="Our process" title="How every" accent="project runs." />
          <ProcessSteps steps={STEPS} />
        </Container>
      </section>

      {/* ---------- 6 · CTA ---------- */}
      <section className="sv-panel sv-p-cta" aria-labelledby="sv-cta-title">
        <Container>
          <Reveal className="sv-cta ca-cta">
            <div className="ca-cta-copy">
              <h2 id="sv-cta-title" className="heading-font sv-cta-title">
                Have an idea worth building?
              </h2>
              <p className="body-font sv-sub">
                Send a few lines about what you want to build. We reply within one working day with next steps and a rough quote.
              </p>
              <Link href="/contact" className="sv-btn">
                Start your project <Arrow />
              </Link>
            </div>
            <CtaArt icon="monitor" chips={[["check", "Real client work"], ["bolt", "Fast launches"], ["chart", "Built to perform"], ["heart", "Designed for you"]]} />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
