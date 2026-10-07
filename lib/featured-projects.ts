/**
 * ALL projects shown on the Portfolio page and on their own pages (/portfolio/<slug>).
 * The first 3 are the big "Featured projects" cards, the last 3 are the small "Explore other projects" cards.
 * Every card and every project page reads from this one file, so edit text here.
 *
 * Photos: put images in /public/portfolio/ and set the path (e.g. "/portfolio/vastaad-hero.png").
 * Without an image a coloured placeholder with the project name is shown.
 *
 * !! Anything starting with "EDIT:" is a placeholder: replace it before going live.
 * !! Vastaad's text and numbers come from your reference design. Check them, and replace the result numbers
 *    (+42%, 3x, 25K+, 40%) with real ones, or remove them.
 */

export type FeatureIcon = "grid" | "lock" | "devices" | "heart" | "cart" | "bolt" | "users" | "star";

export type Work = {
  slug: string; // the project page is /portfolio/<slug>
  name: string;
  subtitle: string; // one line under the name
  tags: string[]; // small pills, e.g. "Web Design"
  summary: string; // 1 to 3 sentences (card + page hero)
  stack: string[]; // tools shown as chips on the big card
  image?: string; // main photo (big card, small card, page hero)
  image2?: string; // optional phone screen shown in front on the big card
  theme: {
    light: boolean; // big card only: true = light card with the photo on the left
    dark: string; // deep colour: card / page background and buttons
    b1: string; // bright accent
    b2: string; // second accent
  };
  /* ---- the project page (/portfolio/<slug>) ---- */
  detail: {
    overview: string;
    challenge: string[]; // 3 short lines
    solution: string[]; // 3 short lines
    design: { text: string; images: [string?, string?] }; // [laptop / wide, phone / tall]
    features: { title: string; text: string; icon: FeatureIcon }[]; // 4
    tech: { name: string; role: string }[]; // 4 (top strip and "Technologies used")
    gallery: [string?, string?, string?]; // [big, small, small]
    results: { text: string; stats: { value: string; label: string }[] }; // 4 stats
  };
};

const e = (what: string) => `EDIT: ${what}`;

/** placeholder page content for projects that are not written yet */
const todoDetail = (): Work["detail"] => ({
  overview: e("2 to 3 sentences: what the project is, who it is for and what we built."),
  challenge: [e("first challenge"), e("second challenge"), e("third challenge")],
  solution: [e("first part of the solution"), e("second part of the solution"), e("third part of the solution")],
  design: { text: e("how the design approach worked and why."), images: [undefined, undefined] },
  features: [
    { title: e("feature 1"), text: e("short line"), icon: "grid" },
    { title: e("feature 2"), text: e("short line"), icon: "lock" },
    { title: e("feature 3"), text: e("short line"), icon: "devices" },
    { title: e("feature 4"), text: e("short line"), icon: "heart" },
  ],
  tech: [
    { name: e("tool 1"), role: e("role") },
    { name: e("tool 2"), role: e("role") },
    { name: e("tool 3"), role: e("role") },
    { name: e("tool 4"), role: e("role") },
  ],
  gallery: [undefined, undefined, undefined],
  results: {
    text: e("what the project achieved."),
    stats: [
      { value: "--", label: e("metric 1") },
      { value: "--", label: e("metric 2") },
      { value: "--", label: e("metric 3") },
      { value: "--", label: e("metric 4") },
    ],
  },
});

export const WORKS: Work[] = [
  /* ---------------- the big three ---------------- */
  {
    slug: "vastaad",
    name: "Vastaad",
    subtitle: "Traditional Indian Fitness Equipment",
    tags: ["E-commerce", "Web Design"],
    summary:
      "An e-commerce platform for traditional Indian akhada fitness equipment like mudgar, gada, nal and push-up patti. Built with Next.js, Tailwind and Framer Motion.",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    image: undefined,
    theme: { light: false, dark: "#24150e", b1: "#c27a3c", b2: "#7a4a2a" },
    detail: {
      overview:
        "Vastaad is a modern e-commerce platform dedicated to traditional Indian fitness equipment, designed to bring the legacy of akhada culture to modern fitness enthusiasts. The platform combines cultural heritage with a clean, minimal and modern shopping experience.",
      challenge: [
        "Modernize a traditional concept for a digital audience",
        "Showcase unique products with rich cultural context",
        "Create a seamless shopping experience",
      ],
      solution: [
        "Clean and minimal design with earthy tones",
        "Immersive product visuals and 3D elements",
        "Smooth e-commerce flow with modern UI/UX",
      ],
      design: {
        text: "We focused on creating a bold yet clean visual language that reflects strength, tradition and authenticity. The design uses warm earthy tones, large product visuals and simple navigation to guide users effortlessly.",
        images: [undefined, undefined],
      },
      features: [
        { title: "Product Categories", text: "Mudgar, Gada, Nal, Push-up Patti", icon: "grid" },
        { title: "Secure Checkout", text: "Fast & safe payment options", icon: "lock" },
        { title: "Responsive Design", text: "Seamless on all devices", icon: "devices" },
        { title: "Wishlist & Cart", text: "Easy shopping experience", icon: "heart" },
      ],
      tech: [
        { name: "Next.js", role: "Frontend" },
        { name: "React", role: "Library" },
        { name: "Tailwind CSS", role: "Styling" },
        { name: "Framer Motion", role: "Animations" },
      ],
      gallery: [undefined, undefined, undefined],
      results: {
        text: "The platform successfully brought a traditional fitness concept into the digital space, helping more people discover and buy Indian fitness equipment.",
        stats: [
          { value: "+42%", label: "Engagement" },
          { value: "3x", label: "Faster Experience" },
          { value: "25K+", label: "Users" },
          { value: "40%", label: "Conversion Increase" },
        ],
      },
    },
  },
  {
    slug: "rudra-arts",
    name: "Rudra Arts",
    subtitle: e("one line about Rudra Arts"),
    tags: [],
    summary: e("one to three sentences about this project, what we built and for whom."),
    stack: [],
    image: undefined,
    theme: { light: true, dark: "#2b1f5c", b1: "#8b6bff", b2: "#c9b8ff" },
    detail: todoDetail(),
  },
  {
    slug: "serynsinth",
    name: "Serynsinth",
    subtitle: e("one line about Serynsinth"),
    tags: [],
    summary: e("one to three sentences about this project, what we built and for whom."),
    stack: [],
    image: undefined,
    theme: { light: false, dark: "#150f33", b1: "#7a5cff", b2: "#c36bff" },
    detail: todoDetail(),
  },

  /* ---------------- the three small cards (rename these, and change the slugs to match) ---------------- */
  {
    slug: "project-4",
    name: "Project 4",
    subtitle: e("one line about this project"),
    tags: [],
    summary: e("one to three sentences about this project."),
    stack: [],
    image: undefined,
    theme: { light: false, dark: "#10243a", b1: "#3fa2ff", b2: "#6bd0ff" },
    detail: todoDetail(),
  },
  {
    slug: "project-5",
    name: "Project 5",
    subtitle: e("one line about this project"),
    tags: [],
    summary: e("one to three sentences about this project."),
    stack: [],
    image: undefined,
    theme: { light: false, dark: "#10302a", b1: "#2fc79a", b2: "#6be3c0" },
    detail: todoDetail(),
  },
  {
    slug: "project-6",
    name: "Project 6",
    subtitle: e("one line about this project"),
    tags: [],
    summary: e("one to three sentences about this project."),
    stack: [],
    image: undefined,
    theme: { light: false, dark: "#34122a", b1: "#e25aa8", b2: "#ff9ad0" },
    detail: todoDetail(),
  },
];

export const FEATURED = WORKS.slice(0, 3);
export const OTHERS = WORKS.slice(3);

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);
/** the project after this one (wraps around to the first) */
export const nextWork = (slug: string) => {
  const i = WORKS.findIndex((w) => w.slug === slug);
  return WORKS[(i + 1) % WORKS.length];
};

/** "Technologies we work with" (the two moving rows). Edit freely. */
export const TECH = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Node.js", "PostgreSQL",
  "REST API", "Headless CMS", "Image CDN", "Vercel", "AWS", "Stripe", "Webhooks", "Chart.js",
  "React Native", "Expo", "Push notifications", "App Store", "Play Store", "CI/CD", "Monitoring",
];
