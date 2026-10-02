/* =========================================================
   PRICING DATA — every number and word in the pricing section lives here.
   All prices below are PLACEHOLDERS; replace them with your real ones.
   ========================================================= */

/** Symbol shown before every price (e.g. "$", "₹", "€") */
export const CURRENCY = "$";
/** Number formatting locale: "en-US" → 1,299   "en-IN" → 12,99,000 style grouping */
export const LOCALE = "en-US";

export type Mode = "once" | "monthly";

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  /** price for each payment mode */
  price: Record<Mode, number>;
  features: string[];
  /** small label on top of the card */
  badge?: string;
  /** which pastel this plan uses (see --pricing-* tokens) */
  tone: "mint" | "lavender" | "peach";
  icon: "seed" | "layers" | "star";
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "A clean one-page home for your business",
    price: { once: 499, monthly: 49 },
    features: [
      "Up to 3 pages",
      "Mobile-friendly design",
      "Contact form",
      "Basic SEO setup",
      "2 rounds of changes",
    ],
    tone: "mint",
    icon: "seed",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "A full website that brings in customers",
    price: { once: 1299, monthly: 119 },
    features: [
      "Up to 8 pages",
      "Custom animations",
      "Blog / content editor",
      "SEO + analytics",
      "Speed tuning",
      "4 rounds of changes",
    ],
    badge: "Most loved",
    tone: "lavender",
    icon: "layers",
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Custom web apps and bigger ideas",
    price: { once: 2999, monthly: 269 },
    features: [
      "Unlimited pages",
      "Custom features & logins",
      "Integrations & automation",
      "Priority support",
      "A dedicated project lead",
    ],
    tone: "peach",
    icon: "star",
  },
];

export type Addon = {
  id: string;
  name: string;
  price: Record<Mode, number>;
};

export const ADDONS: Addon[] = [
  { id: "page", name: "Extra page", price: { once: 80, monthly: 8 } },
  { id: "blog", name: "Blog setup", price: { once: 250, monthly: 20 } },
  { id: "brand", name: "Logo & brand kit", price: { once: 300, monthly: 25 } },
  { id: "copy", name: "Copywriting", price: { once: 200, monthly: 15 } },
  { id: "seo", name: "SEO boost", price: { once: 180, monthly: 15 } },
];

export const MODE_COPY: Record<Mode, { label: string; unit: string; note: string }> = {
  once: { label: "Pay once", unit: "one-time", note: "One payment covers the whole build." },
  monthly: { label: "Pay monthly", unit: "/ month", note: "Spread the cost into easy monthly payments." },
};
