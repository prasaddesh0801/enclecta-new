"use client";

import { useEffect } from "react";

/** Keeps the "Ventures" word of the navbar logo green (same as the homepage) while a /services page
 *  is open, then puts it back when you leave. It finds the word by its text, so it works without
 *  touching the header code. Mounted once in app/services/layout.tsx. */
const GREEN = "#94fc2d";

export default function ServiceNavGreen() {
  useEffect(() => {
    const paint = () => {
      document.querySelectorAll<HTMLElement>("header *").forEach((el) => {
        if (el.children.length === 0 && /^\s*Ventures\s*$/i.test(el.textContent ?? "")) {
          el.style.setProperty("color", GREEN, "important");
          el.dataset.svcGreen = "1";
        }
      });
    };
    paint();
    const header = document.querySelector("header");
    const mo = header ? new MutationObserver(paint) : null;
    if (header) mo?.observe(header, { childList: true, subtree: true });

    return () => {
      mo?.disconnect();
      document.querySelectorAll<HTMLElement>("[data-svc-green]").forEach((el) => {
        el.style.removeProperty("color");
        delete el.dataset.svcGreen;
      });
    };
  }, []);

  return null;
}
