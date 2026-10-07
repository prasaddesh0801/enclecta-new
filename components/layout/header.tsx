"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Container from "./container";
import Logo from "./logo";
import ServicesMenu from "./services-menu";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { mainNav } from "@/lib/site";
import { SERVICES } from "@/lib/services-data";
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
  const [mobileServices, setMobileServices] = useState(false); // phones: Services sub-list expanded
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
        "transition-[transform,opacity,background-color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        // overlay = the hero's header: fixed so it can follow the visitor down
        // the page once they scroll back up; solid = normal sticky header
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0",
        // frosted glass: slightly see-through + blurred, so it sits well over any section in either theme.
        // The homepage (overlay) header stays fully clear until the visitor scrolls.
        overlay
          ? scrolled
            ? "border-hero-foreground/10 bg-hero-bg/65 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]"
            : "border-transparent bg-transparent"
          : [
              "border-[color:var(--border)] bg-background/65 backdrop-blur-xl backdrop-saturate-150",
              scrolled && "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]",
            ],
        hideNav && "-translate-y-full",
        overlay && !revealed && "pointer-events-none opacity-0",
      )}
    >
      <Container
        width="wide"
        className="flex h-14 items-center justify-between lg:h-[4.25rem]"
      >
        <Logo tone={overlay ? "light" : "auto"} />

        {/* desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {mainNav.map((link) => {
            const active = isActivePath(pathname, link.href);
            if (link.href === "/services") {
              return (
                <ServicesMenu
                  key={link.href}
                  overlay={overlay}
                  active={active}
                  linkClassName={navLinkClasses(active)}
                />
              );
            }
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
                const rowClasses = cn(
                  "body-font rounded-[var(--radius-sm)] px-2 py-3 text-base transition-colors",
                  overlay
                    ? active
                      ? "bg-hero-foreground/10 text-hero-foreground"
                      : "text-hero-foreground-muted hover:bg-hero-foreground/5 hover:text-hero-foreground"
                    : active
                      ? "bg-foreground/5 text-foreground"
                      : "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
                );

                if (link.href === "/services") {
                  const subClasses = cn(
                    "body-font block rounded-[var(--radius-sm)] py-2.5 pl-3 pr-2 text-[0.9375rem] transition-colors",
                    overlay
                      ? "text-hero-foreground-muted hover:bg-hero-foreground/5 hover:text-hero-foreground"
                      : "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
                  );
                  return (
                    <div key={link.href}>
                      <div className="flex items-stretch">
                        <Link
                          href={link.href}
                          tabIndex={open ? 0 : -1}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(rowClasses, "flex-1")}
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          tabIndex={open ? 0 : -1}
                          aria-label={mobileServices ? "Hide services" : "Show services"}
                          aria-expanded={mobileServices}
                          onClick={() => setMobileServices((v) => !v)}
                          className={cn(
                            "grid w-11 place-items-center rounded-[var(--radius-sm)]",
                            overlay ? "text-hero-foreground-muted" : "text-foreground-muted",
                          )}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn("h-4 w-4 transition-transform duration-200", mobileServices && "rotate-180")}
                            aria-hidden="true"
                          >
                            <path d="m4 6 4 4 4-4" />
                          </svg>
                        </button>
                      </div>
                      {mobileServices && (
                        <div
                          className={cn(
                            "ml-3 mb-1 border-l pl-1",
                            overlay ? "border-hero-foreground/15" : "border-[color:var(--border)]",
                          )}
                        >
                          {SERVICES.map((sv) => (
                            <Link
                              key={sv.slug}
                              href={`/services/${sv.slug}`}
                              tabIndex={open ? 0 : -1}
                              onClick={() => setOpen(false)}
                              className={subClasses}
                            >
                              {sv.name}
                            </Link>
                          ))}
                          <Link
                            href="/services"
                            tabIndex={open ? 0 : -1}
                            onClick={() => setOpen(false)}
                            className={cn(subClasses, "font-medium text-logo-accent hover:text-logo-accent")}
                          >
                            View all services →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={rowClasses}
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

              {/* phones: "Light" / "Dark" as two plain buttons side by side — a popup menu would be
                  clipped by this panel's overflow-hidden. From the sm breakpoint up, the header's own
                  dropdown (above) is shown instead. */}
              <ThemeToggle
                inline
                overlay={overlay}
                tabIndex={open ? 0 : -1}
                className="mt-3 sm:hidden"
              />
            </Container>
          </div>
        </div>
      </div>
    </header>
  );
}
