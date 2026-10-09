import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text wordmark. Swap the inner markup for an <Image> once the SVG logo lands
 *  in /public/brand — the rest of the site only imports this component.
 *  It looks the same on every page: "Ventures" is always --logo-accent (brand orange) and the
 *  whole wordmark uses the .logo-font typeface (Raghero) — both set in globals.css. */
/** Raghero is a single-weight font, so extra weight comes from a thin outline in the text colour
 *  (works the same whether Raghero or the fallback heading font is showing). Raise 0.035em for bolder. */
const heavier = "[-webkit-text-stroke:0.035em_currentColor]";

export default function Logo({
  className,
  href = "/",
  /** "auto" follows the page theme; "light" forces the hero's light-on-dark
   *  colours for "Enclecta" — use this when the logo sits on the hero overlay. */
  tone = "auto",
}: {
  className?: string;
  href?: string;
  tone?: "auto" | "light";
}) {
  return (
    <Link
      href={href}
      aria-label="Enclecta Ventures — home"
      className={cn(
        "logo-font text-[1.15rem] tracking-[0.01em] sm:text-[1.3rem]",
        heavier,
        tone === "light" ? "text-hero-foreground" : "text-foreground",
        className,
      )}
    >
      Enclecta <span className={cn("text-logo-accent", heavier)}>Ventures</span>
    </Link>
  );
}
