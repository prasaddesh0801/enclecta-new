"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Ico from "@/components/services/service-icons";
import { SERVICES } from "@/lib/services-data";
import { cn } from "@/lib/utils";

/**
 * Desktop "Services" item of the navbar: the link itself goes to /services, and a dropdown lists every
 * service (each one opens /services/<slug>) with "View all services" at the bottom.
 * The list comes straight from lib/services-data.ts, so adding a service there adds it here.
 *  - mouse: hovering the small arrow (chevron) opens it; moving off the arrow (and off the open menu) closes it.
 *    Hovering the word "Services" does NOT open it, and clicking the word goes to /services.
 *  - touch / keyboard: clicking the arrow toggles it; Escape or a click outside closes it
 */
export default function ServicesMenu({
  overlay = false,
  active = false,
  linkClassName,
}: {
  /** sits on the homepage hero header (uses the hero palette) */
  overlay?: boolean;
  /** the current route is /services or /services/<slug> */
  active?: boolean;
  /** the same classes the other nav links use, so "Services" looks identical to them */
  linkClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const pointerKind = useRef("");

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const muted = overlay ? "text-hero-foreground-muted" : "text-foreground-muted";
  const strong = overlay ? "text-hero-foreground" : "text-foreground";
  // full class names (not built from pieces) so Tailwind can see them
  const chevronHover = overlay ? "hover:text-hero-foreground" : "hover:text-foreground";

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className="flex items-center gap-0.5">
        <Link
          href="/services"
          aria-current={active ? "page" : undefined}
          onClick={() => setOpen(false)}
          className={cn(linkClassName, open && "after:scale-x-100")}
        >
          Services
        </Link>
        <button
          type="button"
          aria-label="Show services menu"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="services-menu"
          onPointerEnter={(e) => e.pointerType === "mouse" && show()}
          onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
          onPointerDown={(e) => (pointerKind.current = e.pointerType)}
          onClick={() => {
            // a mouse click keeps the menu that hover already opened; touch and keyboard toggle it
            if (pointerKind.current === "mouse") setOpen(true);
            else setOpen((v) => !v);
            pointerKind.current = "";
          }}
          className={cn("grid h-6 w-6 place-items-center rounded-full transition-colors", muted, chevronHover)}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>

      {/* the outer box keeps a 0.75rem bridge under the link, so the pointer never "falls off" on the way down */}
      <div
        id="services-menu"
        className={cn(
          "absolute left-1/2 top-full z-10 w-[22rem] -translate-x-1/2 pt-3",
          open ? "visible" : "invisible",
        )}
        onPointerEnter={(e) => e.pointerType === "mouse" && show()}
        onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
      >
        <div
          className={cn(
            "max-h-[calc(100svh-6rem)] overflow-y-auto rounded-[var(--radius-lg)] border p-2 shadow-xl backdrop-blur-md",
            "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            overlay
              ? "border-hero-foreground/10 bg-hero-bg/95"
              : "border-[color:var(--border)] bg-background/95",
          )}
        >
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3.5 rounded-[var(--radius-md)] p-2.5 transition-colors",
                    overlay ? "hover:bg-hero-foreground/5" : "hover:bg-foreground/5",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] transition-colors",
                      "group-hover:bg-logo-accent/15 group-hover:text-logo-accent",
                      overlay ? "bg-hero-foreground/10" : "bg-foreground/5",
                      muted,
                    )}
                  >
                    <Ico name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className={cn("heading-font block text-[0.9375rem] font-semibold leading-tight", strong)}>
                      {s.name}
                    </span>
                    <span className={cn("body-font mt-0.5 block text-[0.8125rem] leading-snug", muted)}>
                      {s.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/services"
            onClick={() => setOpen(false)}
            className={cn(
              "heading-font mt-1 flex items-center justify-center gap-1.5 border-t px-3 pb-2 pt-3.5",
              "text-[0.875rem] font-semibold text-logo-accent transition-opacity hover:opacity-80",
              overlay ? "border-hero-foreground/10" : "border-[color:var(--border)]",
            )}
          >
            View all services
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
