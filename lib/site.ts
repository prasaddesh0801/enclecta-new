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
  address: "Nagpur, Maharashtra, India",
} as const;

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Website development", href: "/services#websites" },
      { label: "Web applications", href: "/services#apps" },
      { label: "E-commerce", href: "/services#ecommerce" },
      { label: "Maintenance & support", href: "/services#support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const socialLinks: NavLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
];
