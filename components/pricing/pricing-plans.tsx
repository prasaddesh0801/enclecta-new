"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/container";
import Reveal from "@/components/ui/reveal";
import Ico from "@/components/services/service-icons";
import { ADDONS, CURRENCY, LOCALE, MODE_COPY, PLANS, type Mode, type Plan } from "@/components/home/pricing-data";

/* Plans + add-ons + live estimate for /pricing, built with the services-page look (sv- cards, palette, buttons).
   All numbers and words come from components/home/pricing-data.ts, shared with the homepage section. */

/** eases a number towards its target so totals count up/down instead of jumping */
function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const cur = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    const tick = () => {
      cur.current += (target - cur.current) * 0.14;
      if (Math.abs(target - cur.current) < 0.5) cur.current = target;
      setValue(Math.round(cur.current));
      if (cur.current !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

const money = (n: number) => `${CURRENCY}${n.toLocaleString(LOCALE)}`;

function Price({ value, className }: { value: number; className?: string }) {
  return <span className={className}>{money(useCountUp(value))}</span>;
}

const PLAN_ICON: Record<Plan["icon"], string> = { seed: "bulb", layers: "layers", star: "rocket" };
const PLAN_TONE: Record<Plan["tone"], "blue" | "violet" | "orange"> = { mint: "blue", lavender: "violet", peach: "orange" };

const Tick = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3v10M3 8h10" />
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export default function PricingPlans() {
  const [mode, setMode] = useState<Mode>("once");
  const [planId, setPlanId] = useState("growth");
  const [picked, setPicked] = useState<string[]>([]);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const addons = ADDONS.filter((a) => picked.includes(a.id));
  const total = plan.price[mode] + addons.reduce((sum, a) => sum + a.price[mode], 0);
  const shownTotal = useCountUp(total);

  const toggleAddon = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <section className="sv-panel sv-p-services" id="pp-plans" aria-labelledby="pp-plans-title">
      <Container>
        <Reveal className="sv-head">
          <h2 id="pp-plans-title" className="heading-font sv-h2">Pick a plan, see your price.</h2>
          <p className="body-font sv-sub">Choose how you would like to pay, add what you need, and watch your estimate update.</p>

          <div className="pp-controls">
            <div role="radiogroup" aria-label="How would you like to pay?" className="pp-toggle">
              <span aria-hidden="true" className="pp-thumb" style={{ transform: mode === "once" ? "translateX(0)" : "translateX(100%)" }} />
              {(Object.keys(MODE_COPY) as Mode[]).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className="pp-toggle-btn body-font">
                  {MODE_COPY[m].label}
                </button>
              ))}
            </div>
            <p className="body-font pp-note" aria-live="polite">{MODE_COPY[mode].note}</p>
          </div>
        </Reveal>

        {/* ---------- plans ---------- */}
        <div role="group" aria-label="Plans" className="sv-grid pp-plans">
          {PLANS.map((p, i) => {
            const selected = p.id === planId;
            const tone = PLAN_TONE[p.tone];
            return (
              <Reveal key={p.id} delay={i * 90} className="h-full">
                <article className={`sv-card sv-card-${tone} pp-plan pp-t-${tone}`} data-selected={selected ? "" : undefined}>
                  {p.badge && <span className="pp-badge body-font">{p.badge}</span>}

                  <div className="pp-plan-head">
                    <span className={`sv-tile sv-tile-${tone}`}><Ico name={PLAN_ICON[p.icon]} /></span>
                    <div>
                      <h3 className="heading-font sv-card-title pp-plan-name">{p.name}</h3>
                      <p className="body-font sv-card-text pp-plan-tag">{p.tagline}</p>
                    </div>
                  </div>

                  <p className="pp-price">
                    <Price value={p.price[mode]} className="heading-font pp-price-n" />
                    <span className="body-font pp-unit">{MODE_COPY[mode].unit}</span>
                  </p>

                  <ul className="pp-feats">
                    {p.features.map((f) => (
                      <li key={f} className="body-font"><Tick />{f}</li>
                    ))}
                  </ul>

                  <button type="button" aria-pressed={selected} onClick={() => setPlanId(p.id)} className="pp-pick body-font">
                    {selected ? <><Tick />Selected</> : `Choose ${p.name}`}
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* ---------- add-ons + estimate ---------- */}
        <Reveal className="pp-extras">
          <h3 className="heading-font pp-extras-title">Make it yours</h3>
          <div role="group" aria-label="Add-ons" className="pp-chips">
            {ADDONS.map((a) => {
              const on = picked.includes(a.id);
              return (
                <button key={a.id} type="button" aria-pressed={on} onClick={() => toggleAddon(a.id)} data-on={on ? "" : undefined} className="pp-chip body-font">
                  <span className="pp-chip-ic">{on ? <Tick /> : <Plus />}</span>
                  {a.name}
                  <span className="pp-chip-price">+{money(a.price[mode])}</span>
                </button>
              );
            })}
          </div>

          <div className="pp-summary">
            <div>
              <p className="body-font pp-sum-label">Your estimate</p>
              <p className="heading-font pp-sum-plan">
                {plan.name}
                {addons.length > 0 && <span> + {addons.length} add-on{addons.length > 1 ? "s" : ""}</span>}
              </p>
            </div>

            <p className="pp-total" aria-live="polite" aria-label={`${money(total)} ${MODE_COPY[mode].unit}`}>
              <span className="heading-font pp-total-n">{money(shownTotal)}</span>
              <span className="body-font pp-unit">{MODE_COPY[mode].unit}</span>
            </p>

            <div className="pp-sum-cta">
              <Link href={`/contact?plan=${plan.id}`} className="sv-btn">
                Book a call <Arrow />
              </Link>
              <span className="body-font pp-fine">Estimate only. We confirm the final price after a quick chat.</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
