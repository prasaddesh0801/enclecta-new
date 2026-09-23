import { cn } from "@/lib/utils";

/* Every size below reads from the fluid type scale in globals.css,
   so a change to the scale reflows the whole site. */

type TextProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
};

export function Display({ as, className, children }: TextProps<"h1">) {
  const Tag = (as ?? "h1") as React.ElementType;
  return (
    <Tag
      className={cn(
        "heading-font text-[length:var(--text-display)] font-bold leading-[1.08] tracking-[-0.02em]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Heading({
  as,
  level = 2,
  className,
  children,
}: TextProps<"h2"> & { level?: 1 | 2 | 3 }) {
  const Tag = (as ?? (`h${level}` as const)) as React.ElementType;
  const sizes = {
    1: "text-[length:var(--text-h1)] tracking-[-0.02em]",
    2: "text-[length:var(--text-h2)] tracking-[-0.015em]",
    3: "text-[length:var(--text-h3)] tracking-[-0.01em]",
  } as const;

  return (
    <Tag className={cn("heading-font font-semibold", sizes[level], className)}>
      {children}
    </Tag>
  );
}

export function Subtitle({ as, className, children }: TextProps<"p">) {
  const Tag = (as ?? "p") as React.ElementType;
  return (
    <Tag
      className={cn(
        "subtitle-font text-[length:var(--text-lead)] font-medium text-foreground-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Text({ as, className, children }: TextProps<"p">) {
  const Tag = (as ?? "p") as React.ElementType;
  return (
    <Tag
      className={cn(
        "body-font max-w-[68ch] text-[length:var(--text-body)] text-foreground-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Label({ as, className, children }: TextProps<"span">) {
  const Tag = (as ?? "span") as React.ElementType;
  return (
    <Tag
      className={cn(
        "subtitle-font text-[length:var(--text-label)] font-medium tracking-[0.01em] text-brand-amber",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Small({ as, className, children }: TextProps<"span">) {
  const Tag = (as ?? "span") as React.ElementType;
  return (
    <Tag
      className={cn(
        "body-font text-[length:var(--text-small)] text-foreground-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
