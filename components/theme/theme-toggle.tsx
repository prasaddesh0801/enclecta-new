"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "./theme-provider";
import { cn } from "@/lib/utils";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.25M12 19.25v2.25M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.25M19.25 12h2.25M4.4 19.6l1.6-1.6M18 6l1.6-1.6" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.35 14.44A8.5 8.5 0 1 1 9.56 3.65a.75.75 0 0 1 .9 1 7 7 0 0 0 8.9 8.9.75.75 0 0 1 .99.9Z" />
    </svg>
  );
}

const OPTIONS: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
];

export default function ThemeToggle({
  overlay = false,
  className,
}: {
  /** overlay = sits on the dark hero canvas and uses its light-on-dark palette */
  overlay?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "button-font inline-flex h-9 items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 text-[0.8125rem] font-medium transition-colors",
          overlay
            ? "border-hero-foreground/25 text-hero-foreground hover:border-hero-accent-soft hover:text-hero-foreground"
            : "border-[color:var(--border)] text-foreground hover:border-brand-orange hover:text-brand-orange",
        )}
      >
        <current.Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className={cn(
            "absolute right-0 top-[calc(100%+0.5rem)] z-10 w-36 overflow-hidden rounded-[var(--radius-md)] border py-1 shadow-lg backdrop-blur-md",
            overlay
              ? "border-hero-foreground/10 bg-hero-bg/95"
              : "border-[color:var(--border)] bg-background/95",
          )}
        >
          {OPTIONS.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "body-font flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.875rem] transition-colors",
                  overlay
                    ? "text-hero-foreground-muted hover:bg-hero-foreground/5 hover:text-hero-foreground"
                    : "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
                  active &&
                    (overlay ? "text-hero-foreground" : "text-foreground"),
                )}
              >
                <opt.Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
