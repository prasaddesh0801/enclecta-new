"use client";

import { useEffect } from "react";

/**
 * Motion for the contact page. Renders nothing; it finds elements by class name (mount once inside .ct-page).
 * Same approach as services-motion.tsx, so the page feels identical to /services.
 *
 *  - .ct-steps          the three "what happens next" cards rise in one after another, every time you scroll to them
 *  - .ct-faq            the questions drop in one after another, every time you scroll to them
 *  - .sv-grid .sv-card  (contact cards + step cards) tilt in 3D toward the mouse
 *  - .ct-stage          the 3D cube scene leans toward the mouse (--px / --py, -1 … 1)
 *  (the glide-up of each section is <Reveal>, exactly as on the services page)
 */
export default function ContactMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ct-page");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    root.querySelectorAll(".is-in").forEach((el) => el.classList.remove("is-in"));
    root.querySelectorAll<HTMLElement>(".ct-steps .ct-step").forEach((el, i) => el.style.setProperty("--i", String(i)));

    /* ---------- play every time the block scrolls into view ----------
       adds .is-in when it comes up into the screen, removes it once it is fully below or fully above,
       so the sequence plays again on every visit (scrolling up or down) */
    root.querySelectorAll<HTMLElement>(".ct-faq .ct-q").forEach((el, i) => el.style.setProperty("--i", String(i)));
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(".ct-steps, .ct-faq"));
    if (reduce) {
      blocks.forEach((b) => b.classList.add("is-in"));
    } else {
      root.classList.add("ct-js");
      const on = new Set<HTMLElement>();
      let ticking = false;
      const check = () => {
        ticking = false;
        const vh = window.innerHeight;
        blocks.forEach((b) => {
          const r = b.getBoundingClientRect();
          const visible = r.top <= vh * 0.8 && r.bottom > vh * 0.1;
          if (!on.has(b) && visible) {
            on.add(b);
            b.classList.add("is-in");
          } else if (on.has(b) && (r.top >= vh || r.bottom <= 0)) {
            on.delete(b);
            b.classList.remove("is-in");
          }
        });
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(check);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      });
      check();
    }

    /* ---------- 3D tilt on cards (mouse only) ---------- */
    root.querySelectorAll<HTMLElement>(".sv-grid .sv-card").forEach((card) => {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      };
      const leave = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });

    /* ---------- cube scene follows the pointer ---------- */
    const stage = root.querySelector<HTMLElement>(".ct-stage");
    if (stage && !reduce) {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = stage.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        stage.style.setProperty("--px", Math.max(-1, Math.min(1, dx * 2)).toFixed(3));
        stage.style.setProperty("--py", Math.max(-1, Math.min(1, dy * 2)).toFixed(3));
      };
      window.addEventListener("pointermove", move, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", move));
    }

    return () => {
      cleanups.forEach((fn) => fn());
      root.querySelectorAll(".is-in").forEach((el) => el.classList.remove("is-in"));
      root.classList.remove("ct-js");
    };
  }, []);

  return null;
}
