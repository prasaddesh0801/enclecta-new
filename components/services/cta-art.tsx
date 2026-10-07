import Ico from "./service-icons";
import "./cta-art.css";

/**
 * Decorative art for the right side of a CTA block (used on /about, /services and /portfolio):
 * a glowing tile with an icon inside soft rings, and four floating chips.
 * Put it next to the CTA copy inside `<Reveal className="sv-cta ca-cta">`:
 *   <div className="ca-cta-copy">…heading, text, button…</div>
 *   <CtaArt icon="layers" chips={[["phone", "Free intro call"], …]} />
 * `icon` and the chip icons are names from service-icons.tsx. Hidden from screen readers.
 */
export default function CtaArt({ icon, chips }: { icon: string; chips: [icon: string, label: string][] }) {
  return (
    <div className="ca-art" aria-hidden="true">
      <i className="ca-ring ca-ring-1" />
      <i className="ca-ring ca-ring-2" />
      <i className="ca-ring ca-ring-3" />
      <span className="ca-core"><Ico name={icon} /></span>
      {chips.slice(0, 4).map(([ic, label], i) => (
        <span key={label} className={`ca-chip ca-chip-${i + 1}`}>
          <Ico name={ic} />
          {label}
        </span>
      ))}
      <i className="ca-spark ca-spark-1" />
      <i className="ca-spark ca-spark-2" />
      <i className="ca-spark ca-spark-3" />
    </div>
  );
}
