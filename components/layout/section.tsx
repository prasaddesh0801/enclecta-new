import Container from "./container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  /** background treatment */
  tone?: "default" | "surface" | "raised" | "brand";
  /** vertical padding */
  space?: "none" | "sm" | "md" | "lg";
  /** container width passed through; "full" skips the container entirely */
  width?: "narrow" | "default" | "wide" | "full" | "bleed";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  raised: "bg-surface-raised text-foreground",
  brand: "bg-brand-orange text-brand-white",
};

const spaces: Record<NonNullable<SectionProps["space"]>, string> = {
  none: "py-0",
  sm: "py-[calc(var(--section-space)*0.5)]",
  md: "py-[var(--section-space)]",
  lg: "py-[calc(var(--section-space)*1.35)]",
};

export default function Section({
  id,
  tone = "default",
  space = "md",
  width = "default",
  className,
  innerClassName,
  children,
}: SectionProps) {
  const content =
    width === "bleed" ? (
      children
    ) : (
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    );

  return (
    <section id={id} className={cn("w-full", tones[tone], spaces[space], className)}>
      {content}
    </section>
  );
}
