import type { ReactNode } from "react";
import Reveal from "@/components/ui/reveal";

/**
 * Heading used by every section of the portfolio page.
 * Desktop: eyebrow + big title on the left, the short text (and anything passed as children, e.g. stats)
 * on the right, bottom-aligned with the title. Mobile: everything stacks.
 * `accent` is the last word(s) of the title, drawn with a gradient.
 */
export default function SectionHead({
  id,
  eyebrow,
  title,
  accent,
  text,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="pw-head">
      <div className="pw-head-main">
        <span className="body-font pw-eyebrow">
          <i aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 id={id} className="heading-font pw-head-title">
          {title}
          {accent && (
            <>
              {" "}
              <em>{accent}</em>
            </>
          )}
        </h2>
      </div>
      {(text || children) && (
        <div className="pw-head-side">
          {text && <p className="body-font pw-head-sub">{text}</p>}
          {children}
        </div>
      )}
    </Reveal>
  );
}
