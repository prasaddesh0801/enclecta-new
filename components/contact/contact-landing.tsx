import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import HeroSky from "../services/services-hero-sky";
import ContactHeroArt from "./contact-hero-art";
import ContactTitle from "./contact-title";
import ContactMotion from "./contact-motion";
import ContactScene from "./contact-scene";
import ContactForm from "./contact-form";
import { siteConfig, socialLinks } from "@/lib/site";
import "../services/services-landing.css"; /* hero, card, button and palette styles are shared with /services */
import "./contact.css";

/* =========================================================
   EDIT HERE — all copy lives in these arrays.
   Page = hero → ways to reach us → form → what happens next → FAQ (the footer follows).
   Contact details come from lib/site.ts (siteConfig).
   ========================================================= */

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

const digits = siteConfig.phone.replace(/\D/g, "");
/* lib/site.ts ships a placeholder phone (+91 00000 00000) until NEXT_PUBLIC_CONTACT_PHONE is set;
   the Call and WhatsApp cards stay hidden until then, so nobody dials a fake number */
const hasRealPhone = !/^(91)?0+$/.test(digits);

const REACH: { title: string; value: string; href: string; tone: string; label: string; external?: boolean; icon: React.ReactNode }[] = [
  {
    title: "Email us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    tone: "blue",
    label: "Send us an email",
    icon: svg(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>),
  },
  {
    title: "Call us",
    value: siteConfig.phone,
    href: `tel:+${digits}`,
    tone: "violet",
    label: "Call us",
    icon: svg(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />),
  },
  {
    title: "WhatsApp",
    value: "Message us any time and we reply during working hours.",
    href: `https://wa.me/${digits}`,
    tone: "pink",
    label: "Chat with us on WhatsApp",
    external: true,
    icon: svg(<path d="M4 5h16v11H9l-5 4V5Z" />),
  },
  {
    title: "Visit us",
    value: siteConfig.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`,
    tone: "orange",
    label: "Open our location in Maps",
    external: true,
    icon: svg(<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></>),
  },
];

const FACTS = ["A reply within one working day", "A free intro call, no obligation", "A written quote with a fixed price"];

const NEXT_STEPS = [
  { title: "We read it", text: "A person on the team reads every message, never a bot, and replies within one working day.", tone: "blue" },
  { title: "We talk it through", text: "A short, free call to agree on goals, audience and scope. Bring questions, not a finished brief.", tone: "violet" },
  { title: "You get a quote", text: "A written quote and timeline with a fixed price, so there are no surprise invoices later.", tone: "pink" },
];

const FAQ = [
  { q: "How quickly will you reply?", a: "Within one working day. If your message arrives on a weekend or holiday, expect an answer on the next working day." },
  { q: "Is the first call really free?", a: "Yes. The intro call and the rough quote cost nothing and carry no obligation." },
  { q: "What should I put in my message?", a: "What you want to build, who it is for, and when you need it. A budget range and links to sites you like help us quote faster." },
  { q: "Can you work with my existing website or team?", a: "Yes. We can improve a site you already have, or work next to your in-house developers and designers." },
  { q: "Who owns the finished work?", a: "You do. Code, designs, domains and accounts are handed over in your name." },
];

export default function ContactLanding() {
  return (
    <div className="sv-page ct-page">
      <ContactMotion />

      {/* ---------- 1 · Hero (same sky, hub art and letter-drop title as /services) ---------- */}
      <section className="sv-panel sv-p-hero" aria-labelledby="sv-hero-title" data-no-reveal>
        <HeroSky />
        <ContactHeroArt />
        <div className="sv-hero-top">
          <span className="sv-pill">Enclecta Ventures</span>
          <p className="body-font sv-hero-lead">
            Tell us what you want to build. A real person replies within one working day.
          </p>
        </div>

        <div className="sv-hero-bottom">
          <ContactTitle />
          <a href="#ct-reach" className="sv-scroll">
            Scroll to explore
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- 2 · Ways to reach us ---------- */}
      <section className="sv-panel sv-p-services" id="ct-reach" aria-labelledby="ct-reach-title" data-no-reveal>
        <Container>
          <Reveal className="sv-head">
            <h2 id="ct-reach-title" className="heading-font sv-h2">Pick the way that suits you.</h2>
            <p className="body-font sv-sub">
              Write, call, message us on WhatsApp or drop by. Every route reaches the same small team.
            </p>
          </Reveal>

          <div className="sv-grid ct-reach">
            {REACH.filter((r) => hasRealPhone || !(r.href.startsWith("tel:") || r.href.includes("wa.me"))).map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 90} className="h-full">
                <article className={`sv-card sv-card-${r.tone}`}>
                  <span className={`sv-tile sv-tile-${r.tone}`}>{r.icon}</span>
                  <h3 className="heading-font sv-card-title">{r.title}</h3>
                  <p className="body-font sv-card-text ct-value">{r.value}</p>
                  <a
                    href={r.href}
                    className="sv-card-go"
                    aria-label={r.label}
                    {...(r.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  >
                    <Arrow />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <ul className="ct-socials" aria-label="Our social profiles">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="body-font sv-chip ct-social" target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ---------- 3 · Form + 3D scene ---------- */}
      <section className="sv-panel sv-p-process ct-p-form" aria-labelledby="ct-form-title" data-no-reveal>
        <Container>
          <div className="ct-split">
            <Reveal className="ct-copy">
              <h2 id="ct-form-title" className="heading-font sv-h2">Tell us about your project.</h2>
              <p className="body-font sv-sub">
                A few lines is enough. We will come back with questions, ideas and a rough quote.
              </p>
              <ContactScene />
              <ul className="ct-facts">
                {FACTS.map((f) => (
                  <li key={f} className="body-font">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="ct-formwrap">
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- 4 · What happens next ---------- */}
      <section className="sv-panel sv-p-stack" aria-labelledby="ct-next-title" data-no-reveal>
        <Container>
          <Reveal className="sv-head">
            <h2 id="ct-next-title" className="heading-font sv-h2">What happens after you send it.</h2>
            <p className="body-font sv-sub">Three steps, no pressure. You can stop after any of them.</p>
          </Reveal>

          <Reveal>
            <ol className="sv-grid ct-steps">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="ct-step-li">
                  <article className={`sv-card sv-card-${s.tone} ct-step`}>
                    <span className={`sv-tile sv-tile-${s.tone} heading-font ct-num`} aria-hidden="true">{i + 1}</span>
                    <h3 className="heading-font sv-card-title">{s.title}</h3>
                    <p className="body-font sv-card-text">{s.text}</p>
                  </article>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* ---------- 5 · FAQ ---------- */}
      <section className="sv-panel sv-p-proof" aria-labelledby="ct-faq-title" data-no-reveal>
        <Container>
          <div className="sv-split">
            <Reveal className="sv-split-head">
              <h2 id="ct-faq-title" className="heading-font sv-h2">Questions people ask first.</h2>
              <p className="body-font sv-sub">
                Something missing? <Link href="#contact-form" className="ct-inline">Send us a message</Link> and we will answer it.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="ct-faq">
                {FAQ.map((f) => (
                  <details key={f.q} className="ct-q">
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
