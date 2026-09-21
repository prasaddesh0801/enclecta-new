/** Tiny class-name joiner — keeps components free of clsx/cva dependencies. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
