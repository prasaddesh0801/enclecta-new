import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "neon";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "button-font inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] " +
  "font-medium leading-none transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-orange " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-orange text-brand-white hover:bg-brand-amber active:bg-brand-orange",
  secondary:
    "bg-brand-blue-500 text-brand-white hover:bg-brand-blue-700 active:bg-brand-blue-500",
  outline:
    "border border-[color:var(--border)] text-foreground hover:border-brand-orange hover:text-brand-orange",
  ghost: "text-foreground-muted hover:text-foreground hover:bg-foreground/5",
  link: "text-brand-orange hover:text-brand-amber rounded-none px-0",
  neon: "bg-tech-neon-lime text-brand-black hover:bg-tech-neon-lime/85 active:bg-tech-neon-lime",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-8 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    const external = /^https?:|^mailto:|^tel:/.test(href);

    if (external) {
      return (
        <a
          className={classes}
          href={href}
          rel="noreferrer noopener"
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button className={classes} type={buttonProps.type ?? "button"} {...buttonProps}>
      {children}
    </button>
  );
}
