/**
 * Single source of truth for site-wide content used by the header,
 * footer and metadata. Update once, every surface follows.
 */

export const siteConfig = {
  name: "Enclecta Ventures",
  tagline: "Website Development Company",
  description:
    "Enclecta Ventures designs and builds fast, dependable websites and web products for growing companies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://enclecta.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@enclecta.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 00000 00000",
  address: "Pune, Maharashtra, India",
} as const;

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Career", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Footer columns that are plain page links. The "Our Services" column is built in
 *  components/layout/footer.tsx straight from lib/services-data.ts, so a new service
 *  appears in the footer, the header menu and /services automatically. */
export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Start a Project", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

/** Required legal pages, shown in the footer's bottom bar. */
export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

/** Replace these with the real profile URLs. */
export const socialLinks: NavLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "GitHub", href: "https://github.com" },
];
