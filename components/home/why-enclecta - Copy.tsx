"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heading, Label } from "@/components/ui/typography";
import "./why-enclecta.css";

type CardTheme = "violet" | "coral" | "cyan" | "mint" | "amber";

type WhyCard = {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  theme: CardTheme;
  mark: string;
};

const CARDS: WhyCard[] = [
  {
    number: "01",
    eyebrow: "01 / STRATEGY",
    title: "Ideas with direction.",
    text: "We turn your goals into clear digital experiences instead of adding design just for the sake of design.",
    theme: "violet",
    mark: "✦",
  },
  {
    number: "02",
    eyebrow: "02 / DESIGN",
    title: "Designed to stand out.",
    text: "Modern interfaces, thoughtful interactions and a visual system built around your brand.",
    theme: "coral",
    mark: "◒",
  },
  {
    number: "03",
    eyebrow: "03 / DEVELOPMENT",
    title: "Built to perform.",
    text: "Clean, responsive and scalable development that keeps your website fast as it grows.",
    theme: "cyan",
    mark: "⌁",
  },
  {
    number: "04",
    eyebrow: "04 / DELIVERY",
    title: "Built around your timeline.",
    text: "A focused process keeps communication clear and every milestone moving forward.",
    theme: "mint",
    mark: "↗",
  },
  {
    number: "05",
    eyebrow: "05 / PARTNERSHIP",
    title: "We stay after launch.",
    text: "Your website should keep evolving. We support improvements, updates and what comes next.",
    theme: "amber",
    mark: "+",
  },
];


export default function WhyEnclecta() {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isAnimating = useRef(false);
  const cycleRef = useRef<number | null>(null);

  const next = useCallback(() => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setLeaving(true);

    // The front card travels out first. Once it has left the deck,
    // the remaining cards become the new stack positions.
    cycleRef.current = window.setTimeout(() => {
      setActive((current) => (current + 1) % CARDS.length);
      setLeaving(false);
      isAnimating.current = false;
    }, 720);
  }, []);

  useEffect(() => {
    // Match the reference: hold the front card, then automatically
    // sweep it left while the next card moves into the front.
    const timer = window.setTimeout(next, 2350);

    return () => {
      window.clearTimeout(timer);
      if (cycleRef.current) window.clearTimeout(cycleRef.current);
    };
  }, [active, next]);

  return (
    <section className="why" id="why-enclecta">
      <div className="why-bg" aria-hidden="true">
        <div className="why-bg-orb why-bg-orb--one" />
        <div className="why-bg-orb why-bg-orb--two" />
        <div className="why-bg-grid" />
      </div>

      <div className="why-inner">
        <div className="why-copy">
          <Label>Why Enclecta</Label>

          <div className="why-title-wrap">
            <Heading level={2} className="why-title">
              Why
              <span>choose</span>
              <span>us?</span>
            </Heading>
          </div>

          <p className="why-intro">
            We combine strategy, design and technology to create digital
            experiences that look distinctive, work beautifully and grow with
            your business.
          </p>

          <div className="why-meta">
            <span className="why-meta-line" />
            <span>DESIGN / BUILD / GROW</span>
          </div>
        </div>

        <div className="why-deck-area">
          <div className="why-deck" aria-label="Why choose Enclecta">
            {CARDS.map((card, index) => {
              const position = (index - active + CARDS.length) % CARDS.length;
              const visiblePosition = Math.min(position, 4);
              const isTop = position === 0;

              return (
                <article
                  key={card.number}
                  className={`why-card why-card--${card.theme} ${
                    isTop ? "is-top" : ""
                  } ${isTop && leaving ? "is-leaving" : ""}`}
                  data-position={visiblePosition}
                >
                  <div className="why-card-top">
                    <span className="why-card-number">{card.number}</span>
                    <span className="why-card-mark">{card.mark}</span>
                  </div>

                  <div className="why-card-content">
                    <span className="why-card-eyebrow">{card.eyebrow}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>

                  <div className="why-card-bottom">
                    <span>ENCLECTA</span>
                    <span>→</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
