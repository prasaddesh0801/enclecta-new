"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Section from "@/components/layout/section";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import { Heading, Subtitle } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ADDONS, CURRENCY, LOCALE, MODE_COPY, PLANS, type Mode, type Plan } from "./pricing-data";

/* ---------- helpers ---------- */

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
  return <span className={cn("tabular-nums", className)}>{money(useCountUp(value))}</span>;
}

/* ---------- icons ---------- */

const ICONS: Record<Plan["icon"], string> = {
  seed: "M12 21v-8M12 13c0-4 2.5-6.5 7-7 0 4.5-2.5 7-7 7zM12 15c0-3-2-5-6-5.5 0 3.5 2 5.5 6 5.5z",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  star: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z",
};

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const CHECK = "M5 12.5l4.5 4.5L19 7.5";
const PLUS = "M12 5v14M5 12h14";
const SPARK = "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z";

/* ---------- section ---------- */

export default function Pricing() {
  const [mode, setMode] = useState<Mode>("once");
  const [planId, setPlanId] = useState("growth");
  const [picked, setPicked] = useState<string[]>([]);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const addons = ADDONS.filter((a) => picked.includes(a.id));
  const total = plan.price[mode] + addons.reduce((sum, a) => sum + a.price[mode], 0);
  const shownTotal = useCountUp(total);

  const toggleAddon = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // soft light that follows the pointer across a card
  const glow = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <Section id="pricing" className="relative overflow-x-clip">
      {/* pastel blobs behind everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background:
          "radial-gradient(38% 30% at 12% 12%, var(--pricing-glow-a), transparent 70%)," +
          "radial-gradient(34% 30% at 92% 40%, var(--pricing-glow-c), transparent 70%)," +
          "radial-gradient(40% 30% at 30% 96%, var(--pricing-glow-b), transparent 70%)",
      }} />

      <div className="relative">
        {/* ---------- heading + toggle ---------- */}
        <Reveal className="mx-auto mb-10 max-w-[40rem] text-center md:mb-14">
          <Heading level={2}>Simple pricing, no surprises</Heading>
          <Subtitle className="mx-auto mt-4 max-w-[30rem]">Pick a plan, add what you need, and watch your estimate update.</Subtitle>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div role="radiogroup" aria-label="How would you like to pay?" className="pr-toggle relative grid grid-cols-2 rounded-full p-1">
              <span aria-hidden="true" className="pr-thumb absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full" style={{ transform: mode === "once" ? "translateX(0)" : "translateX(100%)" }} />
              {(Object.keys(MODE_COPY) as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "button-font relative z-[1] rounded-full px-5 py-2 text-[0.875rem] font-medium transition-colors duration-300 sm:px-7",
                    mode === m ? "text-foreground" : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  {MODE_COPY[m].label}
                </button>
              ))}
            </div>
            <p className="body-font text-[length:var(--text-small)] text-foreground-muted" aria-live="polite">
              {MODE_COPY[mode].note}
            </p>
          </div>
        </Reveal>

        {/* ---------- plans ---------- */}
        <Reveal delay={100}>
          <div role="group" aria-label="Plans" className="pr-grid mx-auto grid max-w-[68rem] items-stretch gap-5 md:grid-cols-3 md:gap-6">
            {PLANS.map((p) => {
              const selected = p.id === planId;
              const featured = !!p.badge;
              return (
                <div
                  key={p.id}
                  onPointerMove={glow}
                  data-selected={selected ? "" : undefined}
                  data-featured={featured ? "" : undefined}
                  className="pr-card flex flex-col p-6 md:p-7"
                  style={{ "--pr-accent": `var(--pricing-${p.tone})`, "--pr-soft": `var(--pricing-${p.tone}-soft)` } as CSSProperties}
                >
                  {p.badge && (
                    <span className="button-font absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3.5 py-1 text-[0.75rem] font-semibold" style={{ background: "var(--pr-accent)", color: "var(--pricing-on-accent)" }}>
                      <Icon d={SPARK} className="h-3.5 w-3.5" />
                      {p.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem]" style={{ background: "var(--pr-soft)", color: "var(--pr-accent)" }}>
                      <Icon d={ICONS[p.icon]} className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="heading-font text-[1.25rem] font-semibold">{p.name}</h3>
                      <p className="body-font text-[0.8125rem] leading-snug text-foreground-muted">{p.tagline}</p>
                    </div>
                  </div>

                  <p className="mt-7 flex items-baseline gap-2">
                    <Price value={p.price[mode]} className="heading-font text-[2.5rem] font-bold leading-none tracking-[-0.02em]" />
                    <span className="body-font text-[0.875rem] text-foreground-muted">{MODE_COPY[mode].unit}</span>
                  </p>

                  <ul className="mt-6 flex flex-col gap-3">
                    {p.features.map((f) => (
                      <li key={f} className="body-font flex items-start gap-3 text-[0.9375rem]">
                        <span className="mt-[0.2rem] grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full" style={{ background: "var(--pr-soft)", color: "var(--pr-accent)" }}>
                          <Icon d={CHECK} className="h-3 w-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPlanId(p.id)}
                    className="pr-pick button-font mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[0.9375rem] font-semibold"
                  >
                    {selected ? (
                      <>
                        <Icon d={CHECK} className="h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      `Choose ${p.name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ---------- add-ons + estimate ---------- */}
        <Reveal delay={150} className="mx-auto mt-12 max-w-[52rem] md:mt-16">
          <p className="heading-font text-center text-[1.0625rem] font-semibold">Make it yours</p>
          <div role="group" aria-label="Add-ons" className="mt-4 flex flex-wrap justify-center gap-2.5">
            {ADDONS.map((a) => {
              const on = picked.includes(a.id);
              return (
                <button key={a.id} type="button" aria-pressed={on} onClick={() => toggleAddon(a.id)} data-on={on ? "" : undefined} className="pr-chip button-font inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.875rem] font-medium">
                  <span className="pr-chip-icon grid h-5 w-5 place-items-center rounded-full">
                    <Icon d={on ? CHECK : PLUS} className="h-3 w-3" />
                  </span>
                  {a.name}
                  <span className="text-foreground-muted">+{money(a.price[mode])}</span>
                </button>
              );
            })}
          </div>

          <div className="pr-summary mt-8 flex flex-col items-center gap-5 p-6 text-center md:flex-row md:justify-between md:gap-8 md:px-8 md:text-left">
            <div>
              <p className="body-font text-[length:var(--text-small)] text-foreground-muted">Your estimate</p>
              <p className="heading-font mt-0.5 text-[1.0625rem] font-semibold">
                {plan.name}
                {addons.length > 0 && <span className="font-medium text-foreground-muted"> + {addons.length} add-on{addons.length > 1 ? "s" : ""}</span>}
              </p>
            </div>

            <p className="flex items-baseline gap-2" aria-live="polite" aria-label={`${money(total)} ${MODE_COPY[mode].unit}`}>
              <span className="heading-font text-[2.75rem] font-bold leading-none tracking-[-0.02em] tabular-nums md:text-[3.25rem]">{money(shownTotal)}</span>
              <span className="body-font text-[0.875rem] text-foreground-muted">{MODE_COPY[mode].unit}</span>
            </p>

            <div className="flex flex-col items-center gap-2 md:items-end">
              <Button href="/contact" size="lg" variant="neon">
                Book a call
              </Button>
              <span className="body-font text-[0.75rem] text-foreground-muted">Estimate only. We confirm the final price after a quick chat.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
