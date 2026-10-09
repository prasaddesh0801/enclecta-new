/* Glyphs for the four glowing hero tiles on the legal pages.
   Tile order/colours come from services-hero-art: web (peach) · code (blue) · marketing (mint) · growth (pink). */

const sp = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** privacy: padlock · shield with tick · eye · key */
export const privacyIcons = {
  web: (
    <svg {...sp}>
      <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
      <path d="M8.2 11V8a3.8 3.8 0 0 1 7.6 0v3" />
      <circle cx="12" cy="15.7" r="1.2" fill="currentColor" />
    </svg>
  ),
  code: (
    <svg {...sp}>
      <path d="M12 3 5 6v5.5c0 4.4 3 7.6 7 9.5 4-1.9 7-5.1 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  ),
  marketing: (
    <svg {...sp}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  growth: (
    <svg {...sp}>
      <circle cx="8" cy="15" r="3.8" />
      <path d="m10.8 12.2 9-9M16.5 6.5l3 3M13.8 9.2l2 2" />
    </svg>
  ),
};

/** terms: document · scales · pen · tick badge */
export const termsIcons = {
  web: (
    <svg {...sp}>
      <path d="M7 3.5h8l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M15 3.5V8h4M9 12.5h6M9 16h6" />
    </svg>
  ),
  code: (
    <svg {...sp}>
      <path d="M12 4v16M7 20h10M5 7h14" />
      <path d="m5 7-3 7a3.5 3.5 0 0 0 6 0L5 7ZM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7Z" />
    </svg>
  ),
  marketing: (
    <svg {...sp}>
      <path d="m4 20 4-1L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
      <path d="m14 7 3 3" />
    </svg>
  ),
  growth: (
    <svg {...sp}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5.2" />
    </svg>
  ),
};
