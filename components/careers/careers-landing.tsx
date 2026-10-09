import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "@/components/services/services-hero-sky";
import ServicesMotion from "@/components/services/services-motion";
import Ico from "@/components/services/service-icons";
import CtaArt from "@/components/services/cta-art";
import CareersHeroArt from "./careers-hero-art";
import CareersTitle from "./careers-title";
import CareersJobs from "./careers-jobs";
import CareersPerks, { type Perk } from "./careers-perks";
import CareersSteps from "./careers-steps";
import AppearTogether from "./appear-together";
import CareersDialog, { CareersTrigger } from "./careers-dialog";
import { siteConfig } from "@/lib/site";
import "@/components/services/services-landing.css"; // palette, hero and CTA shared with /services
import "./careers.css";

/* =========================================================
   EDIT HERE: all copy lives in these arrays. Open roles live in lib/careers-data.ts.
   Page = 6 sections:
   Hero (shared) → Life at Enclecta (bento) → Open positions (job board) → Perks (tabs) → Hiring (timeline) → CTA (shared)
   Only the hero and CTA reuse the services/about look; the four middle sections are new layouts in the same colours.
   The dialog (job details + apply form) is rendered once at the very end, outside the sections.
   ========================================================= */

const STORY = [
  "Enclecta Ventures is a young, remote-first startup. Our team works online from across India, stays connected through video calls and shared tools, and builds websites, apps and marketing for growing businesses.",
  "You will work on real client projects from your first month, with the people who actually make the decisions.",
];

/* Edit to match how your week really runs */
const RHYTHM: [day: string, what: string][] = [
  ["Mon", "Plan the week"],
  ["Tue", "Build"],
  ["Wed", "Build"],
  ["Thu", "Review"],
  ["Fri", "Demo and wrap up"],
];

/* Edit these so they match what you really offer */
const PERKS: Perk[] = [
  {
    title: "Work from home",
    text: "Set up your space the way you like it and do your best work from wherever you live in India, with the whole team just a call away.",
    points: ["Remote-first, by design", "Short video calls instead of long meetings", "Written updates so nobody is left out"],
    tone: "blue",
    icon: "map",
  },
  {
    title: "Flexible hours",
    text: "We care about clear communication and finished work, not about being online at 9 sharp.",
    points: ["Plan your day around your best hours", "Agree overlap times with the team", "Time off without the awkward chase"],
    tone: "orange",
    icon: "refresh",
  },
  {
    title: "Real ownership",
    text: "Own features and whole projects from first idea to launch instead of waiting in a long approval chain.",
    points: ["Talk to clients directly", "Make decisions, not just tickets", "See your work live and in use"],
    tone: "violet",
    icon: "target",
  },
  {
    title: "Always learning",
    text: "Try new tools, share what you learn and grow into the work you want to do next.",
    points: ["Time to explore new tech", "Honest feedback on every project", "Learn from senior people daily"],
    tone: "pink",
    icon: "bulb",
  },
  {
    title: "Small senior team",
    text: "Fewer people means no layers between you and the work, and everyone's ideas are heard.",
    points: ["No politics, no silos", "Designers and developers side by side", "Friendly, direct and kind"],
    tone: "yellow",
    icon: "users",
  },
  {
    title: "Room to grow",
    text: "As Enclecta grows, the people who joined early grow into bigger roles with it.",
    points: ["Early team, early responsibility", "Roles that grow with the company", "A say in how we build the studio"],
    tone: "navy",
    icon: "rocket",
  },
];

const STEPS: { title: string; text: string; icon: string; tone: Perk["tone"] }[] = [
  { title: "Apply", text: "Send your profile and a link to your work. A few honest lines about you are enough.", icon: "pen", tone: "violet" },
  { title: "Intro call", text: "A friendly video chat about your work, what you want next and how we work.", icon: "users", tone: "blue" },
  { title: "Small task", text: "A short, clearly scoped task related to the role, so you see what the work is really like.", icon: "code", tone: "orange" },
  { title: "Offer", text: "We decide quickly and tell you either way, with feedback if it is a no.", icon: "check", tone: "pink" },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export default function CareersLanding() {
  return (
    <div className="sv-page cr-page">
      <ServicesMotion />

      {/* ---------- 1 · Hero (same as /services and /about: sky, glowing hub, giant title) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
        <HeroSky />
        <CareersHeroArt />
        <div className="sv-hero-top">
          <span className="sv-pill">Careers at Enclecta</span>
          <p className="body-font sv-hero-lead">
            Join a small, remote-first team building websites, apps and marketing for growing businesses.
          </p>
        </div>

        <div className="sv-hero-bottom">
          <CareersTitle />
          <a href="#cr-life" className="sv-scroll">
            Scroll to explore
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 2 · Life at Enclecta: a bento board ---------- */}
      <section className="sv-panel sv-p-services" id="cr-life" aria-labelledby="cr-life-title">
        <Container>
          <Reveal className="cr-head">
            <div>
              <span className="sv-pill">Life at Enclecta</span>
              <h2 id="cr-life-title" className="heading-font sv-h2">
                Online by design. Great work by habit.
              </h2>
            </div>
            <p className="body-font sv-sub">A look at what working here is like, day to day.</p>
          </Reveal>

          <AppearTogether className="cr-bento">
            <div className="cr-b cr-b-main" data-no-reveal>
              <article className="cr-bt cr-bt-main">
                <svg className="cr-bt-house" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.4 11.4 12 4l8.6 7.4" />
                  <path d="M5.8 9.8V20h12.4V9.8" />
                  <path d="M10 20v-5.4h4V20" />
                </svg>
                <span className="cr-pill-s body-font">Remote-first startup</span>
                <p className="body-font cr-bt-lead">{STORY[0]}</p>
                <a href="#cr-open" className="sv-btn">
                  See open roles <Arrow />
                </a>
              </article>
            </div>

            <div className="cr-b" data-no-reveal>
              <article className="cr-bt cr-bt-stat cr-t-blue">
                <strong className="heading-font">100%</strong>
                <span className="body-font">Remote, from anywhere in India</span>
              </article>
            </div>

            <div className="cr-b" data-no-reveal>
              <article className="cr-bt cr-bt-stat cr-t-orange">
                <strong className="heading-font">1 team</strong>
                <span className="body-font">Connected online, every single day</span>
              </article>
            </div>

            <div className="cr-b cr-b-wide" data-no-reveal>
              <article className="cr-bt cr-bt-plain cr-t-violet">
                <span className="cr-ic"><Ico name="bolt" /></span>
                <div>
                  <h3 className="heading-font cr-bt-h">Real work from week one</h3>
                  <p className="body-font cr-bt-t">{STORY[1]}</p>
                </div>
              </article>
            </div>

            <div className="cr-b cr-b-full" data-no-reveal>
              <article className="cr-bt cr-bt-week">
                <h3 className="heading-font cr-bt-h">A typical week</h3>
                <ol className="cr-week">
                  {RHYTHM.map(([d, w], i) => (
                    <li key={d} style={{ "--i": i } as React.CSSProperties}>
                      <span className="cr-day heading-font">{d}</span>
                      <span className="body-font cr-what">{w}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </AppearTogether>
        </Container>
      </section>

      {/* ---------- 3 · Open positions: a job board ---------- */}
      <section className="sv-panel sv-p-stack" id="cr-open" aria-labelledby="cr-open-title">
        <Container>
          <Reveal className="cr-head">
            <div>
              <span className="sv-pill">Open positions</span>
              <h2 id="cr-open-title" className="heading-font sv-h2">
                Find the role that fits you.
              </h2>
            </div>
            <p className="body-font sv-sub">
              Open any role to see what you would do and what we look for, then apply in two minutes.
            </p>
          </Reveal>
          <CareersJobs />
        </Container>
      </section>

      {/* ---------- 4 · Perks: tabbed showcase ---------- */}
      <section className="sv-panel sv-p-proof" aria-labelledby="cr-ben-title">
        <Container>
          <Reveal className="cr-head">
            <div>
              <span className="sv-pill">Why you will like it here</span>
              <h2 id="cr-ben-title" className="heading-font sv-h2">
                How it feels to work here.
              </h2>
            </div>
            <p className="body-font sv-sub">
              We are a startup, so we keep things simple: trust, clear communication and room to grow.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <CareersPerks items={PERKS} />
          </Reveal>
        </Container>
      </section>

      {/* ---------- 5 · Hiring: a timeline ---------- */}
      <section className="sv-panel sv-p-process" aria-labelledby="cr-hire-title">
        <Container>
          <Reveal className="cr-head">
            <div>
              <span className="sv-pill">How hiring works</span>
              <h2 id="cr-hire-title" className="heading-font sv-h2">
                Four steps, all online.
              </h2>
            </div>
            <p className="body-font sv-sub">Simple, friendly and usually finished within two weeks.</p>
          </Reveal>
          <Reveal delay={90}>
            <CareersSteps items={STEPS} />
          </Reveal>
        </Container>
      </section>

      {/* ---------- 6 · CTA (same as /about and /services) ---------- */}
      <section className="sv-panel sv-p-cta" aria-labelledby="sv-cta-title">
        <Container>
          <Reveal className="sv-cta ca-cta">
            <div className="ca-cta-copy">
              <h2 id="sv-cta-title" className="heading-font sv-cta-title">
                Your next chapter starts with a hello.
              </h2>
              <p className="body-font sv-sub">
                We are always happy to meet talented people. Tell us what you do best and we will reach out when the right
                role opens up.
              </p>
              <div className="cr-cta-row">
                <CareersTrigger jobId={null} mode="apply" className="sv-btn cr-btn">
                  Send your profile <Arrow />
                </CareersTrigger>
                <a href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Careers at Enclecta")}`} className="cr-ghost body-font">
                  Email us instead
                </a>
              </div>
            </div>

            <CtaArt icon="users" chips={[["map", "Work from home"], ["bolt", "Quick replies"], ["bulb", "Always learning"], ["heart", "Friendly team"]]} />
          </Reveal>
        </Container>
      </section>

      {/* job details + apply form: one instance, kept outside every <section> */}
      <CareersDialog />
    </div>
  );
}
