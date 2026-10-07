/* All copy for the portfolio page and every project page lives here. Everything below is MOCK content.
   To go live: edit a project's text, set `image` (a screenshot in /public, 16:10 works best) and
   replace the `gallery` shots with real screenshots (`image`). Add a project = add one object to PORTFOLIO.
   - `slug` becomes the URL: /portfolio/<slug>
   - `icon` keys come from components/services/service-icons.tsx
   - `related` = slugs from lib/services-data.ts (shown as "Related services" on the project page)
   - `colors` = [background, main shape, detail] — only used by the mock previews (see portfolio-cards.tsx) */

type Pair = [title: string, text: string];
type Item = [icon: string, title: string, text: string];

export type Tone = "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";
export type MockKind = "travel" | "shop" | "dashboard" | "app" | "brand";
type Colors = [string, string, string];

/* page accent per tone (same colours the services pages use): bright for light theme, dark for dark theme */
export const TONES: Record<Tone, { bright: [string, string]; dark: string }> = {
  orange: { bright: ["#ffab85", "#ffd3c2"], dark: "#d9803f" },
  blue: { bright: ["#3fb6ff", "#a2ebf3"], dark: "#4a90e2" },
  pink: { bright: ["#ff6fae", "#ffc9b9"], dark: "#e0488a" },
  violet: { bright: ["#a66cff", "#e6b8ff"], dark: "#8a5fe3" },
  yellow: { bright: ["#ffd964", "#ffe9bd"], dark: "#d9a21f" },
  navy: { bright: ["#8e9cec", "#cdd5f9"], dark: "#6e8cff" },
};

export type Shot = { kind: MockKind; colors: Colors; caption: string; image?: string };

export type Project = {
  slug: string;
  name: string;
  category: string;
  tone: Tone;
  year: string;
  tags: string[];
  summary: string; // one line on the listing card
  kind: MockKind;
  colors: Colors;
  image?: string;
  heroTitle: [string, string];
  heroText: string;
  glance: Pair[]; // 3 quick facts beside the hero
  overview: Pair;
  objectives: Item[]; // 3
  solution: Pair;
  features: Item[]; // 4
  gallery: Shot[]; // 5 (the first one is shown wide)
  tech: [group: string, items: string[]][];
  results: Pair[]; // 3
  related: string[]; // service slugs
};

/* 5 placeholder screens per project: the project's own look, plus dashboard / app / brand variations */
const shots = (kind: MockKind, c: Colors, captions: string[]): Shot[] => [
  { kind, colors: c, caption: captions[0] },
  { kind: "dashboard", colors: ["#181b36", c[1], "#7ee7c7"], caption: captions[1] },
  { kind: "app", colors: [c[1], c[0], "#ffffff"], caption: captions[2] },
  { kind: "brand", colors: ["#f1eaf8", c[1], "#8a6349"], caption: captions[3] },
  { kind, colors: [c[2], c[1], c[0]], caption: captions[4] },
];

export const PORTFOLIO: Project[] = [
  {
    slug: "travel-website",
    name: "Travel Website",
    category: "Website",
    tone: "blue",
    year: "2025",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    summary: "A destination-first travel site that turns browsing into enquiries.",
    kind: "travel",
    colors: ["#1d2552", "#8b9bff", "#e8ecff"],
    heroTitle: ["A travel site that", "makes people want to go."],
    heroText: "A destination-first website with fast, image-rich pages and a clear next step on every screen.",
    glance: [["Timeline", "6 weeks"], ["Built with", "Next.js, Tailwind"], ["Delivered", "Design, build, launch"]],
    overview: ["Making discovery as good as the destination.", "Visitors needed to move from inspiration to enquiry without friction. We rebuilt the site around destinations, with search up front and pages that load instantly."],
    objectives: [
      ["target", "Raise enquiries", "A clear next step on every destination page."],
      ["bolt", "Load fast on mobile", "Most visitors arrive on phones, so speed came first."],
      ["pen", "Feel like the brand", "Photography and type carry the mood, not templates."],
    ],
    solution: ["One flexible page system.", "Destinations, guides and offers share one set of components, so the team can publish new pages without a developer."],
    features: [
      ["search", "Destination search", "Find a trip by place, month or budget."],
      ["layers", "Reusable page blocks", "Build new pages from approved sections."],
      ["monitor", "Image-first layouts", "Large photography that stays sharp and quick."],
      ["bell", "Enquiry forms", "Short forms that go straight to the sales team."],
    ],
    gallery: shots("travel", ["#1d2552", "#8b9bff", "#e8ecff"], ["Homepage", "Booking overview", "Mobile experience", "Guides and articles", "Destination page"]),
    tech: [["Front end", ["Next.js", "Tailwind CSS", "Framer Motion"]], ["Content", ["Headless CMS", "Image CDN"]], ["Hosting", ["Vercel", "CI/CD"]]],
    results: [
      ["Quicker to browse", "Pages load in under two seconds on mobile."],
      ["More enquiries", "A shorter path from landing page to enquiry form."],
      ["Easy to update", "The team publishes new destinations on their own."],
    ],
    related: ["website-development", "product-engineering"],
  },
  {
    slug: "e-commerce-platform",
    name: "E-Commerce Platform",
    category: "E-commerce",
    tone: "orange",
    year: "2025",
    tags: ["Next.js", "Tailwind", "Stripe"],
    summary: "A fast online store with a simple catalogue, cart and checkout.",
    kind: "shop",
    colors: ["#fff1e8", "#ffb08a", "#e0704a"],
    heroTitle: ["An online store", "that sells while you sleep."],
    heroText: "A complete shop with a clean catalogue, quick checkout and an admin the team can run on their own.",
    glance: [["Timeline", "8 weeks"], ["Built with", "Next.js, Stripe"], ["Delivered", "Store, checkout, admin"]],
    overview: ["Fewer steps between product and payment.", "The old store lost customers at checkout. We simplified the catalogue, cut the checkout to a single page and made every screen fast on a phone."],
    objectives: [
      ["chart", "Lift conversions", "Fewer clicks from product to payment."],
      ["phone", "Shop on any device", "Designed for thumbs first, desktops second."],
      ["shield", "Take payments safely", "Card payments handled through Stripe."],
    ],
    solution: ["A store built around the buyer.", "Clear product pages, a persistent cart and one-page checkout, backed by an admin for stock, orders and discounts."],
    features: [
      ["layers", "Catalogue and filters", "Browse by category, size, colour or price."],
      ["bolt", "One-page checkout", "Guest checkout and saved details for returning buyers."],
      ["doc", "Order admin", "Manage stock, orders and discount codes."],
      ["refresh", "Email updates", "Confirmations and shipping updates sent automatically."],
    ],
    gallery: shots("shop", ["#fff1e8", "#ffb08a", "#e0704a"], ["Storefront", "Sales dashboard", "Mobile checkout", "Brand and packaging", "Product page"]),
    tech: [["Front end", ["Next.js", "Tailwind CSS"]], ["Payments", ["Stripe", "Webhooks"]], ["Hosting", ["Vercel", "Monitoring"]]],
    results: [
      ["Shorter checkout", "Buyers pay in one page instead of four."],
      ["Fast on phones", "Product pages open almost instantly."],
      ["Run by the team", "Stock and orders managed without a developer."],
    ],
    related: ["website-development", "saas-development"],
  },
  {
    slug: "dashboard-ui",
    name: "Dashboard UI",
    category: "Web app",
    tone: "violet",
    year: "2025",
    tags: ["React", "Tailwind", "Chart.js"],
    summary: "A clear analytics dashboard that turns raw numbers into decisions.",
    kind: "dashboard",
    colors: ["#181b36", "#b39cff", "#7ee7c7"],
    heroTitle: ["A dashboard people", "actually open every day."],
    heroText: "An analytics workspace that shows the numbers that matter, with charts that explain themselves.",
    glance: [["Timeline", "10 weeks"], ["Built with", "React, Chart.js"], ["Delivered", "UX, UI, front end"]],
    overview: ["From spreadsheets to one clear view.", "The team tracked performance across five tools and three spreadsheets. We brought it into one dashboard with live charts and simple filters."],
    objectives: [
      ["chart", "Show what matters", "Key numbers first, detail one click away."],
      ["users", "Work for every role", "Views for managers, analysts and the front line."],
      ["refresh", "Stay up to date", "Live data instead of weekly exports."],
    ],
    solution: ["Charts that explain themselves.", "A consistent set of chart and table components, tuned for readability in light and dark themes."],
    features: [
      ["chart", "Live charts", "Trends, comparisons and breakdowns that update on their own."],
      ["target", "Saved views", "Each person keeps the filters they use most."],
      ["doc", "Scheduled reports", "Summaries sent to the inbox every week."],
      ["shield", "Roles and access", "People see only the data they should."],
    ],
    gallery: shots("dashboard", ["#181b36", "#b39cff", "#7ee7c7"], ["Overview", "Detailed report", "Mobile summary", "Brand system", "Dark theme"]),
    tech: [["Front end", ["React", "TypeScript", "Chart.js"]], ["Data", ["REST API", "PostgreSQL"]], ["Hosting", ["AWS", "CI/CD"]]],
    results: [
      ["One source of truth", "Five tools reduced to a single view."],
      ["Faster decisions", "Weekly reporting is now a live screen."],
      ["Easy to extend", "New charts are added from ready-made parts."],
    ],
    related: ["data-analytics", "saas-development"],
  },
  {
    slug: "fitness-app",
    name: "Fitness App",
    category: "Mobile app",
    tone: "pink",
    year: "2025",
    tags: ["React Native", "Tailwind", "Expo"],
    summary: "A mobile app for workouts, progress and daily habits.",
    kind: "app",
    colors: ["#6a58e6", "#b9a7ff", "#ffffff"],
    heroTitle: ["A fitness app that", "keeps people showing up."],
    heroText: "A mobile app that makes daily workouts simple, tracks progress and rewards consistency.",
    glance: [["Timeline", "12 weeks"], ["Built with", "React Native, Expo"], ["Delivered", "iOS and Android"]],
    overview: ["Small habits, big progress.", "Most fitness apps overwhelm new users. We designed a calm daily flow: one workout, one goal and clear progress at a glance."],
    objectives: [
      ["heart", "Build the habit", "A daily routine that takes minutes, not hours."],
      ["target", "Show real progress", "Streaks, totals and personal bests in one place."],
      ["phone", "Work offline", "Workouts run without a connection."],
    ],
    solution: ["A calm daily flow.", "One screen per day, a progress ring that fills as you go, and reminders that arrive at the right time."],
    features: [
      ["play", "Guided workouts", "Step-by-step sessions with timers."],
      ["chart", "Progress tracking", "Streaks, totals and personal bests."],
      ["bell", "Smart reminders", "Notifications at the time you choose."],
      ["cloud", "Sync across devices", "Your plan follows you to a new phone."],
    ],
    gallery: shots("app", ["#6a58e6", "#b9a7ff", "#ffffff"], ["Today screen", "Coach dashboard", "Workout player", "Brand and icons", "Progress view"]),
    tech: [["Mobile", ["React Native", "Expo", "Push notifications"]], ["Back end", ["Node.js", "PostgreSQL"]], ["Ship and run", ["App Store", "Play Store", "Monitoring"]]],
    results: [
      ["Simple to start", "New users finish their first workout in minutes."],
      ["Works anywhere", "Offline mode keeps sessions running."],
      ["Two stores, one codebase", "iOS and Android shipped together."],
    ],
    related: ["product-engineering", "saas-development"],
  },
  {
    slug: "brand-website",
    name: "Brand Website",
    category: "Website",
    tone: "yellow",
    year: "2025",
    tags: ["Next.js", "Tailwind", "GSAP"],
    summary: "A brand-led website with polished motion and a strong visual identity.",
    kind: "brand",
    colors: ["#f1eaf8", "#c9987a", "#8a6349"],
    heroTitle: ["A brand site with", "a point of view."],
    heroText: "A brand-led website where layout, type and motion say who the company is before a word is read.",
    glance: [["Timeline", "5 weeks"], ["Built with", "Next.js, GSAP"], ["Delivered", "Design, build, launch"]],
    overview: ["Look like the brand you are.", "The brand had a strong identity but a generic website. We brought its colours, shapes and tone to every page, with motion used sparingly."],
    objectives: [
      ["sparkle", "Stand out", "A site that does not look like a template."],
      ["bolt", "Stay fast", "Rich motion without slowing pages down."],
      ["users", "Tell the story", "Clear sections for who, what and why."],
    ],
    solution: ["Identity first, then structure.", "Page layouts follow the brand guide, with a small library of motion effects used only where they help."],
    features: [
      ["pen", "Custom visual design", "Layouts drawn for this brand, not adapted."],
      ["play", "Purposeful motion", "Scroll effects that guide the eye."],
      ["search", "SEO foundations", "Clean markup and fast loading from day one."],
      ["doc", "Editable content", "Update copy and images without code."],
    ],
    gallery: shots("brand", ["#f1eaf8", "#c9987a", "#8a6349"], ["Homepage", "Campaign dashboard", "Mobile layout", "Brand guide", "Story page"]),
    tech: [["Front end", ["Next.js", "Tailwind CSS", "GSAP"]], ["Content", ["Headless CMS"]], ["Hosting", ["Vercel", "CI/CD"]]],
    results: [
      ["On brand everywhere", "Every page follows the identity."],
      ["Smooth, not heavy", "Animation that stays out of the way."],
      ["Easy to maintain", "Content updates take minutes."],
    ],
    related: ["website-development", "social-media-management"],
  },
];

export const getProject = (slug: string) => PORTFOLIO.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = PORTFOLIO.findIndex((p) => p.slug === slug);
  return PORTFOLIO[(i + 1) % PORTFOLIO.length];
};
export const prevProject = (slug: string) => {
  const i = PORTFOLIO.findIndex((p) => p.slug === slug);
  return PORTFOLIO[(i - 1 + PORTFOLIO.length) % PORTFOLIO.length];
};
