import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "@/components/services/services-hero-sky";
import ServicesMotion from "@/components/services/services-motion";
import Ico from "@/components/services/service-icons";
import PricingPlans from "./pricing-plans";
import PricingHeroArt from "./pricing-hero-art";
import PricingTitle from "./pricing-title";
import "@/components/services/services-landing.css"; /* hero, card, button and palette styles are shared with /services */
import "./pricing-page.css";

/* =========================================================
   EDIT HERE: all copy on this page lives in these arrays.
   Plans, add-ons, prices and the estimate live in components/home/pricing-data.ts (shared with the homepage).
   Page = hero → plans + estimate → what every project includes → pricing FAQ (the footer follows).
   ========================================================= */

type Tone = "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";

const INCLUDED: { title: string; text: string; tone: Tone; icon: string }[] = [
  { title: "A fixed, written quote", text: "You see the full price and timeline before we start. No hourly surprises.", tone: "orange", icon: "doc" },
  { title: "Weekly working previews", text: "A private preview link every week, so you see real progress instead of just updates.", tone: "blue", icon: "refresh" },
  { title: "Fast, mobile-first builds", text: "Responsive on every screen and tuned for speed from the first day.", tone: "pink", icon: "bolt" },
  { title: "SEO groundwork", text: "Clean structure and the basics set up so people can actually find you.", tone: "violet", icon: "search" },
  { title: "You own everything", text: "Code, designs, domains and accounts are handed over in your name.", tone: "yellow", icon: "check" },
  { title: "Help after launch", text: "Fixes and improvements once you are live, so nothing is left hanging.", tone: "navy", icon: "heart" },
];

const FAQ = [
  { q: "Are these prices final?", a: "They are starting estimates. After a short, free call we confirm a fixed written quote, and that is the price you pay." },
  { q: "Pay once or pay monthly: what is the difference?", a: "Paying once covers the whole build in a single payment. Paying monthly spreads the cost into smaller monthly payments. The estimate above updates for either choice." },
  { q: "What are add-ons?", a: "Extras you can pick on top of a plan, such as extra pages, blog setup, a logo and brand kit, copywriting or an SEO boost. Tick them above to see your estimate change." },
  { q: "Can I change my plan later?", a: "Yes. Start with what you need today and move up as you grow. We adjust the quote for the difference." },
  { q: "My project does not fit a plan. What now?", a: "Tell us about it. Web apps, integrations and larger builds are quoted separately after a free intro call." },
  { q: "How do I get started?", a: "Pick a plan above and press Book a call, or send us a message. We reply within one working day." },
];

export default function PricingLanding() {
  return (
    <div className="sv-page pp-page">
      <ServicesMotion />

      {/* ---------- 1 · Hero (same sky, hub art and letter-drop title as /services, with pricing icons) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
        <HeroSky />
        <PricingHeroArt />
        <div className="sv-hero-top">
          <span className="sv-pill">Enclecta Ventures</span>
          <p className="body-font sv-hero-lead">
            Clear plans, honest prices and no surprise invoices. Pick a plan, add what you need and see your estimate.
          </p>
        </div>

        <div className="sv-hero-bottom">
          <PricingTitle />
          <a href="#pp-plans" className="sv-scroll">
            Scroll to explore
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 2 · Plans, add-ons and live estimate (built for this page; data shared with the homepage) ---------- */}
      <PricingPlans />

      {/* ---------- 3 · What every project includes ---------- */}
      <section className="sv-panel sv-p-stack" aria-labelledby="pp-inc-title">
        <Container>
          <Reveal className="sv-head">
            <h2 id="pp-inc-title" className="heading-font sv-h2">What every project includes.</h2>
            <p className="body-font sv-sub">
              Whichever plan you pick, these come as standard. The limits for each plan (pages, rounds of changes) are listed on its card above.
            </p>
          </Reveal>
          <div className="sv-grid">
            {INCLUDED.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 90} className="h-full">
                <article className={`sv-card sv-card-${s.tone}`}>
                  <span className={`sv-tile sv-tile-${s.tone}`}><Ico name={s.icon} /></span>
                  <h3 className="heading-font sv-card-title">{s.title}</h3>
                  <p className="body-font sv-card-text">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- 4 · Pricing FAQ ---------- */}
      <section className="sv-panel sv-p-proof" aria-labelledby="pp-faq-title">
        <Container>
          <div className="sv-split">
            <Reveal className="sv-split-head">
              <h2 id="pp-faq-title" className="heading-font sv-h2">Questions about pricing.</h2>
              <p className="body-font sv-sub">
                Need something custom? <Link href="/contact" className="pp-inline">Ask us for a quote</Link> and we will reply within one working day.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="pp-faq">
                {FAQ.map((f) => (
                  <details key={f.q} className="pp-q">
                    <summary className="heading-font">
                      {f.q}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M8 3v10M3 8h10" />
                      </svg>
                    </summary>
                    <p className="body-font sv-card-text">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
