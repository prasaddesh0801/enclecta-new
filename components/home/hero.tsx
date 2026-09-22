"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/header";
import { useTheme } from "@/components/theme/theme-provider";
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
  const [headerRevealed, setHeaderRevealed] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!hero || !canvas || !l1 || !l2) return;

    // switching theme swaps in the other scene from scratch, so the laptop
    // intro plays in full again each time — reset the reveal until it lands
    setHeaderRevealed(false);

    let handle: HeroSceneHandle | null = null;
    const createScene =
      theme === "dark" ? createDarkHeroScene : createLightHeroScene;

    try {
      handle = createScene({
        hero,
        canvas,
        lineEls: [l1, l2],
        lines: TITLE_LINES,
        onTitleLanded: () => setHeaderRevealed(true),
      });
    } catch {
      // WebGL unavailable — fall back to the plain DOM title and header
      l1.style.color = "var(--hero-foreground)";
      l2.style.color = "var(--hero-foreground)";
      setHeaderRevealed(true);
    }

    return () => handle?.destroy();
  }, [theme]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[34rem] w-full overflow-hidden"
      style={{
        height: "100svh",
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

      {/* Real, accessible heading. Its text is transparent because the visible
          title is drawn in WebGL; this element decides where that title lands. */}
      <h1 className="pointer-events-none absolute inset-0 z-[4] m-0 flex flex-col items-center justify-center text-center">
        <span
          ref={line1Ref}
          className="heading-font block whitespace-nowrap text-[length:var(--text-display)] font-bold leading-[1.2121] tracking-normal text-transparent"
        />
        <span
          ref={line2Ref}
          className="heading-font block whitespace-nowrap text-[length:var(--text-display)] font-bold leading-[1.2121] tracking-normal text-transparent"
        />
      </h1>

      <div className="absolute inset-x-0 top-0 z-[5]">
        <Header variant="overlay" revealed={headerRevealed} />
      </div>
    </section>
  );
}
