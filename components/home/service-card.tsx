import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export type ServiceCardProps = {
  index: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  icon: ComponentType<{ className?: string }>;
  href: string;
  className?: string;
};

export default function ServiceCard({
  index,
  title,
  tagline,
  description,
  tags,
  icon: Icon,
  href,
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col gap-5 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-surface p-6 sm:p-7",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-orange/40",
        "hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="heading-font text-[0.8125rem] font-semibold text-foreground-muted/70">
          {index}
        </span>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
            "bg-brand-orange/10 text-brand-orange transition-colors duration-300",
            "group-hover:bg-brand-orange group-hover:text-brand-white",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div>
        <p className="subtitle-font text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-brand-orange">
          {tagline}
        </p>
        <Heading level={3} className="mt-1.5">
          {title}
        </Heading>
      </div>

      <Text>{description}</Text>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="body-font rounded-[var(--radius-sm)] bg-foreground/5 px-2.5 py-1 text-[0.75rem] text-foreground-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <span className="body-font mt-auto inline-flex items-center gap-1.5 pt-1 text-[0.875rem] font-medium text-foreground transition-colors duration-300 group-hover:text-brand-orange">
        Learn more
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" />
        </svg>
      </span>
    </Link>
  );
}
