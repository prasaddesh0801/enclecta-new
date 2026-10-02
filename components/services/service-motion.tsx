"use client";

import { useEffect } from "react";

/**
 * Motion for service pages. Renders nothing; mount once inside .sd-page.
 *  - [data-rise] elements (and children of [data-rise-group]) rise into place as you scroll, once.
 *    Anything you mark with data-rise in service-detail.tsx gets this automatically.
 *  - the process plays step by step (1 → 5) once it scrolls into view
 *  - the hero illustration follows the mouse a little (desktop only)
 * All of it is skipped for prefers-reduced-motion.
 */
export default function ServiceMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sd-page");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const undo: Array<() => void> = [];

    /* stagger children of a group, then arm the reveal */
    root.querySelectorAll<HTMLElement>("[data-rise-group]").forEach((g) =>
      Array.from(g.children).forEach((c, i) => {
        c.setAttribute("data-rise", "");
        (c as HTMLElement).style.setProperty("--d", `${i * 0.09}s`);
      }),
    );
    root.classList.add("sd-js");

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll("[data-rise]").forEach((el) => io.observe(el));
    undo.push(() => io.disconnect());

    /* process: when it scrolls into view the steps play one after another, 1 -> 5 */
    const steps = root.querySelector<HTMLElement>(".sd-steps");
    if (steps) {
      const items = Array.from(steps.querySelectorAll<HTMLElement>(".sd-step"));
      const timers: number[] = [];
      let played = false;
      const sio = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting || played) return;
          played = true;
          sio.disconnect();
          items.forEach((li, i) => {
            timers.push(
              window.setTimeout(() => {
                // the line travels to this step first, then the step pops on
                steps.style.setProperty("--p", String(i / (items.length - 1)));
                timers.push(window.setTimeout(() => li.classList.add("is-on"), i === 0 ? 0 : 800));
              }, 300 + i * 1300),
            );
          });
        },
        { threshold: 0.5 },
      );
      sio.observe(steps);
      undo.push(() => {
        sio.disconnect();
        timers.forEach(clearTimeout);
      });
    }

    /* hero illustration parallax */
    const hero = root.querySelector<HTMLElement>(".sd-hero");
    const art = root.querySelector<HTMLElement>(".sd-hero .sd-art");
    if (hero && art) {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = hero.getBoundingClientRect();
        art.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        art.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      };
      hero.addEventListener("pointermove", move);
      undo.push(() => hero.removeEventListener("pointermove", move));
    }

    return () => {
      undo.forEach((fn) => fn());
      root.classList.remove("sd-js");
    };
  }, []);

  return null;
}
