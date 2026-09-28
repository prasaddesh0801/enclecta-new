"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/header";
import { useTheme } from "@/components/theme/theme-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { createHeroScene as createLightHeroScene } from "./hero-scene-light";
import { createHeroScene as createDarkHeroScene } from "./hero-scene-dark";
import type { HeroSceneHandle } from "./hero-scene-light";

/** The two lines typed on the laptop screen — they become the page title. */
const TITLE_LINES: [string, string] = ["Website Development", "Company"];

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  // gates the header AND the subtitle/CTA reveal — all three land together
  // once the laptop intro finishes typing the title
  const [revealed, setRevealed] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!hero || !canvas || !l1 || !l2) return;

    // switching theme swaps in the other scene from scratch, so the laptop
    // intro plays in full again each time — reset the reveal until it lands
    setRevealed(false);

    let handle: HeroSceneHandle | null = null;
    const createScene =
      theme === "dark" ? createDarkHeroScene : createLightHeroScene;

    try {
      handle = createScene({
        hero,
        canvas,
        lineEls: [l1, l2],
        lines: TITLE_LINES,
        onTitleLanded: () => setRevealed(true),
      });
    } catch {
      // WebGL unavailable — fall back to the plain DOM title and header
      l1.style.color = "var(--hero-foreground)";
      l2.style.color = "var(--hero-foreground)";
      setRevealed(true);
    }

    return () => handle?.destroy();
  }, [theme]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex w-full flex-col overflow-hidden"
      style={{
        // min-height, not a fixed height — the section can still grow on short
        // viewports instead of clipping the subtitle, since the canvas resizes
        // to match via the scene's own ResizeObserver on this element.
        // Capped at 46rem so tall screens don't leave a big empty gap before
        // the next section — raise the 46rem if you want a taller hero.
        minHeight: "min(100svh, 46rem)",
        background:
          "radial-gradient(ellipse at 70% 20%, color-mix(in srgb, var(--tech-cyan) 16%, transparent) 0%, transparent 55%)," +
          "radial-gradient(ellipse at 20% 85%, color-mix(in srgb, var(--brand-orange) 14%, transparent) 0%, transparent 50%)," +
          "var(--hero-bg)",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full"
      />

      {/* Soft fade from the hero's own backdrop into the page background, so
          the hero and the section below blend instead of meeting at a hard
          edge. Reads --background, so it follows the light/dark theme. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-36 sm:h-48"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 0%, transparent), var(--background))",
        }}
      />

      <div className="relative z-[4] flex min-h-[38rem] w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-28 text-center sm:gap-7 sm:px-8 lg:py-32">
        {/* Real, accessible heading. Its text is transparent because the visible
            title is drawn in WebGL; this element decides where that title lands. */}
        <h1 className="pointer-events-none m-0 flex flex-col items-center">
          <span
            ref={line1Ref}
            className="heading-font block whitespace-nowrap text-[length:var(--text-display)] font-bold leading-[1.2121] tracking-normal text-transparent"
          />
          <span
            ref={line2Ref}
            className="heading-font block whitespace-nowrap text-[length:var(--text-display)] font-bold leading-[1.2121] tracking-normal text-transparent"
          />
        </h1>

        {/* Supporting text — fade/slide in once the title lands,
            in step with the header reveal above */}
        <div
          className={cn(
            "flex flex-col items-center gap-6 transition-all duration-700 ease-out motion-reduce:transition-none",
            revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <p className="body-font max-w-[34rem] text-pretty text-[length:var(--text-lead)] text-hero-foreground-muted">
            {siteConfig.description}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 z-50">
        <Header variant="overlay" revealed={revealed} />
      </div>
    </section>
  );
}
