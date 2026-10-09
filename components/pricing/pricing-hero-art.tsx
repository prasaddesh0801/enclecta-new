import HeroArt from "../services/services-hero-art";

/*
 * Pricing hero artwork — the same glowing hub as /services, with the four light-up tiles
 * showing pricing icons instead: price tag, dollar coin, receipt and wallet.
 * (Tile colours, platform, rays and motion all come from services-hero-art; only the glyphs change.)
 */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS = {
  /* price tag */
  web: (
    <svg {...svgProps}>
      <path d="M3.5 12.2V4.8a1.3 1.3 0 0 1 1.3-1.3h7.4a1.3 1.3 0 0 1 .9.4l7.6 7.6a1.3 1.3 0 0 1 0 1.8l-6.7 6.7a1.3 1.3 0 0 1-1.8 0L3.9 13.1a1.3 1.3 0 0 1-.4-.9Z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  /* dollar coin */
  code: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 6.8v10.4M14.8 9.4c-.5-1-1.5-1.5-2.8-1.5-1.6 0-2.8.8-2.8 2.1 0 3 5.8 1.5 5.8 4.5 0 1.3-1.2 2.1-2.9 2.1-1.4 0-2.5-.6-3-1.7" />
    </svg>
  ),
  /* receipt / quote */
  marketing: (
    <svg {...svgProps}>
      <path d="M6 3.5h12v17l-2.2-1.5L13.5 20.5 12 19.5l-1.5 1L8.2 19 6 20.5v-17ZM9 8h6M9 11.5h6M9 15h3" />
    </svg>
  ),
  /* wallet */
  growth: (
    <svg {...svgProps}>
      <path d="M4 8V6.5A2.5 2.5 0 0 1 6.5 4H17v4" />
      <rect x="3.5" y="8" width="17" height="12" rx="2.5" />
      <path d="M16.5 14h2.2" />
    </svg>
  ),
};

export default function PricingHeroArt() {
  return <HeroArt icons={ICONS} />;
}
