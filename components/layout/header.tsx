"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "./container";
import Logo from "./logo";
import Button from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

type HeaderProps = {
  /** "solid" sticks to the top of a normal (light) page, "overlay" floats
   *  above the dark hero canvas and always uses the hero's own palette. */
  variant?: "solid" | "overlay";
  /** overlay only: the hero fades the header in once its intro animation lands */
  revealed?: boolean;
};

export default function Header({
  variant = "solid",
  revealed = true,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = variant === "overlay";

  useEffect(() => {
    if (overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "z-50 w-full pt-[env(safe-area-inset-top,0px)]",
        !overlay && "sticky top-0 border-b transition-colors duration-300",
        !overlay && (scrolled
          ? "border-[color:var(--border)] bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"),
        overlay &&
          "absolute inset-x-0 top-0 transition-opacity duration-1000 motion-reduce:transition-none",
        overlay && (revealed ? "opacity-100" : "pointer-events-none opacity-0"),
      )}
    >
      <Container
        width="wide"
        className="flex h-16 items-center justify-between lg:h-20"
      >
        <Logo tone={overlay ? "light" : "auto"} />

        {/* desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "body-font text-[0.9rem] transition-colors",
                overlay
                  ? "text-hero-foreground-muted hover:text-hero-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href="/contact"
            variant="outline"
            size="sm"
            className={cn(
              "hidden sm:inline-flex",
              overlay &&
                "!border-hero-foreground/25 !text-hero-foreground hover:!border-hero-accent-soft hover:!text-hero-foreground",
            )}
          >
            Book a call
          </Button>

          {/* mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[var(--radius-sm)] border md:hidden",
              overlay ? "border-hero-foreground/25" : "border-[color:var(--border)]",
            )}
          >
            <span
              className={cn(
                "h-px w-4 transition-transform duration-200",
                overlay ? "bg-hero-foreground" : "bg-foreground",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-4 transition-opacity duration-200",
                overlay ? "bg-hero-foreground" : "bg-foreground",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-4 transition-transform duration-200",
                overlay ? "bg-hero-foreground" : "bg-foreground",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </button>
        </div>
      </Container>

      {/* mobile navigation panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "border-t backdrop-blur-md md:hidden",
          overlay
            ? "border-hero-foreground/10 bg-hero-bg/95"
            : "border-[color:var(--border)] bg-background/95",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "body-font rounded-[var(--radius-sm)] px-2 py-3 text-base transition-colors",
                overlay
                  ? "text-hero-foreground-muted hover:bg-hero-foreground/5 hover:text-hero-foreground"
                  : "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button href="/contact" size="md" fullWidth className="mt-3">
            Book a call
          </Button>
        </Container>
      </div>
    </header>
  );
}
