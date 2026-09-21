import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text wordmark. Swap the inner markup for an <Image> once the SVG logo lands
 *  in /public/brand — the rest of the site only imports this component. */
export default function Logo({
  className,
  href = "/",
  /** "auto" follows the page theme; "light" forces the hero's light-on-dark
   *  colours — use this when the logo sits on the dark hero overlay. */
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
        "heading-font text-[1.05rem] font-semibold tracking-[0.01em] sm:text-[1.15rem]",
        tone === "light" ? "text-hero-foreground" : "text-foreground",
        className,
      )}
    >
      Enclecta{" "}
      <span className={tone === "light" ? "text-hero-accent-soft" : "text-brand-orange"}>
        Ventures
      </span>
    </Link>
  );
}
