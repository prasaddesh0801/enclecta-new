"use client";

import { useEffect } from "react";

/**
 * Gives the service cards a gentle 3D tilt + moving light that follow the pointer.
 * Renders nothing. Touch devices and "reduce motion" users get static cards.
 * Needs no props: it finds the cards by class (.sv-home-grid .svc-card).
 */
export default function ServicesCardTilt() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const MAX = 7; // max tilt in degrees
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".sv-home-grid .svc-card"),
    );

    const move = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", `${((px - 0.5) * 2 * MAX).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - py) * 2 * MAX).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    };
    const leave = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      ["--rx", "--ry", "--mx", "--my"].forEach((v) => card.style.removeProperty(v));
    };

    cards.forEach((c) => {
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
    });
    return () => {
      cards.forEach((c) => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  return null;
}
