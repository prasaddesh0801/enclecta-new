import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import Tilt from "./tilt";

/* "What we can build": the services only (no project examples). Edit the copy here.
   Every card links to the main services page. */
const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const SERVICES: { name: string; text: string; icon: React.ReactNode }[] = [
  {
    name: "Websites",
    text: "Fast, good-looking company and brand sites that make the next step obvious.",
    icon: (
      <svg {...ip}>
        <rect x="3" y="4.5" width="18" height="15" rx="3" />
        <path d="M3 9.5h18" />
        <circle cx="6.2" cy="7" r=".4" fill="currentColor" />
        <circle cx="8.4" cy="7" r=".4" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "E-commerce",
    text: "Online stores with a clean catalogue, quick checkout and an easy admin.",
    icon: (
      <svg {...ip}>
        <path d="M3 4h2l2.4 10.2a1.5 1.5 0 0 0 1.5 1.3h7.7a1.5 1.5 0 0 0 1.45-1.1L20 8H6.2" />
        <circle cx="9.5" cy="19.3" r="1.1" />
        <circle cx="17" cy="19.3" r="1.1" />
      </svg>
    ),
  },
  {
    name: "Web applications",
    text: "Dashboards and internal tools that put your data and workflows on one screen.",
    icon: (
      <svg {...ip}>
        <rect x="4" y="4.5" width="7" height="6" rx="1.5" />
        <rect x="13" y="4.5" width="7" height="3.5" rx="1.5" />
        <rect x="13" y="10.5" width="7" height="9" rx="1.5" />
        <rect x="4" y="13" width="7" height="6.5" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Mobile apps",
    text: "iOS and Android apps from one codebase that feel simple to use.",
    icon: (
      <svg {...ip}>
        <rect x="7" y="3" width="10" height="18" rx="2.5" />
        <path d="M10.5 17.5h3" />
      </svg>
    ),
  },
  {
    name: "UI/UX design",
    text: "Layouts and visual direction you approve before any code is written.",
    icon: (
      <svg {...ip}>
        <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6" />
      </svg>
    ),
  },
  {
    name: "Product development",
    text: "From first idea to a launched product, built and improved in short cycles.",
    icon: (
      <svg {...ip}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
];

export default function PortfolioWork() {
  return (
    <div className="pw-svc-grid">
      {SERVICES.map((s, i) => (
        <Reveal key={s.name} delay={(i % 3) * 90} className="pw-svc-cell">
          <Tilt className="pw-svc-tilt" max={9}>
            <Link href="/services" className="pw-svc">
              <span className={`pw-svc-ic pw-svc-ic-${i % 6}`}>{s.icon}</span>
              <h3 className="heading-font pw-svc-name">{s.name}</h3>
              <p className="body-font pw-svc-text">{s.text}</p>
              <span className="body-font pw-svc-more">
                Learn more
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
                </svg>
              </span>
            </Link>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
