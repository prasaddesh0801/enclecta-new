"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Container from "./container";
import Logo from "./logo";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

type HeaderProps = {
  /** "solid" sticks to the top of a normal (light) page, "overlay" floats
   *  above the dark hero canvas and always uses the hero's own palette. */
  variant?: "solid" | "overlay";
  /** overlay only: the hero fades the header in once its intro animation lands */
  revealed?: boolean;
  /** show the "Start a project" button in the header (off by default) */
  showCta?: boolean;
};

/** Matches "/work" against "/work" and "/work/anything", but "/" only
 *  against the exact homepage — prevents every route matching "/". */
function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({
  variant = "solid",
  revealed = true,
  showCta = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const overlay = variant === "overlay";

  // Hide the navbar while scrolling down, bring it back as soon as the visitor
  // scrolls up. It always stays visible near the top of the page.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) < 6) return; // ignore tiny jitters
      setHidden(y > lastY && y > 120);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // never slide the bar away while the mobile menu is open
  const hideNav = hidden && !open;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close the mobile panel on Escape, and if the viewport is resized up
  // past the md breakpoint while it's open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mql = window.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (mql.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    mql.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mql.removeEventListener("change", onChange);
    };
  }, [open]);

  const navLinkClasses = (active: boolean) =>
    cn(
      "body-font relative py-1 text-[0.9rem] transition-colors",
      "after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full",
      "after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:content-['']",
      overlay
        ? [
            active
              ? "text-hero-foreground after:scale-x-100"
              : "text-hero-foreground-muted hover:text-hero-foreground hover:after:scale-x-100",
            "after:bg-hero-foreground",
          ]
        : [
            active
              ? "text-foreground after:scale-x-100"
              : "text-foreground-muted hover:text-foreground hover:after:scale-x-100",
            "after:bg-brand-orange",
          ],
    );

  return (
    <header
      className={cn(
        "z-50 w-full border-b pt-[env(safe-area-inset-top,0px)]",
        "transition-[transform,opacity,background-color,border-color] duration-500 ease-out motion-reduce:transition-none",
        // overlay = the hero's header: fixed so it can follow the visitor down
        // the page once they scroll back up; solid = normal sticky header
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0",
        scrolled
          ? overlay
            ? "border-hero-foreground/10 bg-hero-bg/85 backdrop-blur-md"
            : "border-[color:var(--border)] bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
        hideNav && "-translate-y-full",
        overlay && !revealed && "pointer-events-none opacity-0",
      )}
    >
      <Container
        width="wide"
        className="flex h-16 items-center justify-between lg:h-20"
      >
        <Logo tone={overlay ? "light" : "auto"} />

        {/* desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {mainNav.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(navLinkClasses(active))}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* header CTA — desktop/tablet only, mobile gets its own full-width
              copy inside the mobile panel below */}
          {showCta && (
            <Button
              href="/contact"
              size="sm"
              variant={overlay ? "neon" : "primary"}
              className="hidden md:inline-flex"
            >
              Start a project
            </Button>
          )}

          <ThemeToggle overlay={overlay} className="hidden sm:block" />

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

      {/* mobile navigation panel — height-animated via the grid-rows trick
          (0fr -> 1fr) so it slides open/closed instead of snapping */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            id="mobile-nav"
            aria-hidden={!open}
            className={cn(
              "border-t backdrop-blur-md",
              overlay
                ? "border-hero-foreground/10 bg-hero-bg/95"
                : "border-[color:var(--border)] bg-background/95",
            )}
          >
            <Container className="flex flex-col gap-1 py-4">
              {mainNav.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "body-font rounded-[var(--radius-sm)] px-2 py-3 text-base transition-colors",
                      overlay
                        ? active
                          ? "bg-hero-foreground/10 text-hero-foreground"
                          : "text-hero-foreground-muted hover:bg-hero-foreground/5 hover:text-hero-foreground"
                        : active
                          ? "bg-foreground/5 text-foreground"
                          : "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {showCta && (
                <Button
                  href="/contact"
                  size="md"
                  fullWidth
                  tabIndex={open ? 0 : -1}
                  variant={overlay ? "neon" : "primary"}
                  onClick={() => setOpen(false)}
                  className="mt-3"
                >
                  Start a project
                </Button>
              )}

              <ThemeToggle
                overlay={overlay}
                className="mt-3 self-start"
              />
            </Container>
          </div>
        </div>
      </div>
    </header>
  );
}
