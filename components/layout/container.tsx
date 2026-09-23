import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  /** narrow = reading width, wide = full 1280px grid, full = edge to edge with gutters only */
  width?: "narrow" | "default" | "wide" | "full";
  className?: string;
  children: React.ReactNode;
};

const widths: Record<NonNullable<ContainerProps["width"]>, string> = {
  narrow: "max-w-[46rem]",
  default: "max-w-[80rem]",
  wide: "max-w-[90rem]",
  full: "max-w-none",
};

export default function Container({
  as,
  width = "default",
  className,
  children,
}: ContainerProps) {
  const Tag = (as ?? "div") as React.ElementType;

  return (
    <Tag
      className={cn(
        "mx-auto w-full px-[var(--container-gutter)]",
        widths[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
