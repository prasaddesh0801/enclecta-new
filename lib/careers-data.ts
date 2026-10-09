/* =========================================================
   CAREERS DATA: edit roles here, nothing else needs to change.
   Add a job = add an object. Remove all jobs = the page shows
   "no open roles" plus a general-application button.
   `tone` picks the card colour (same names as the services cards):
   orange | blue | pink | violet | yellow | navy
   `icon` must be a name from components/services/service-icons.tsx
   (only icons already used on /about are used here).
   ========================================================= */

export type Job = {
  id: string; // used internally, keep it unique
  title: string;
  department: string;
  location: string;
  type: string; // Full-time, Internship, Contract…
  experience: string;
  tone: "orange" | "blue" | "pink" | "violet" | "yellow" | "navy";
  icon: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
};

export const GENERAL_ROLE = "General application";

/* PLACEHOLDER ROLES: replace with your real openings */
export const JOBS: Job[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    experience: "1 to 3 years",
    tone: "blue",
    icon: "code",
    summary: "Build fast, polished websites and web apps for our clients with Next.js, React and Tailwind.",
    responsibilities: [
      "Turn approved designs into responsive, accessible Next.js pages.",
      "Build reusable components and keep our code base clean.",
      "Work with designers to polish spacing, motion and details.",
      "Ship weekly builds and fix issues quickly after launch.",
    ],
    requirements: [
      "Solid React, TypeScript and CSS fundamentals.",
      "Experience with Next.js and Tailwind (or similar).",
      "A portfolio, GitHub or live projects we can look at.",
      "Clear written communication for remote, async work.",
    ],
    niceToHave: ["Animation experience (GSAP, Framer Motion, three.js)", "Basic SEO and performance tuning"],
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote (India)",
    type: "Full-time",
    experience: "1 to 3 years",
    tone: "violet",
    icon: "pen",
    summary: "Design clean, modern websites and product screens that clients love and developers can build.",
    responsibilities: [
      "Create wireframes, UI designs and clickable prototypes in Figma.",
      "Build and maintain design systems for client projects.",
      "Present ideas to clients and turn feedback into improvements.",
      "Hand over clear specs to the development team.",
    ],
    requirements: [
      "Strong Figma skills and a good eye for layout and typography.",
      "A portfolio showing real UI work (web or app).",
      "Understanding of responsive design and accessibility basics.",
      "Comfortable giving and receiving honest feedback.",
    ],
    niceToHave: ["Motion or illustration skills", "Experience designing for SaaS products"],
  },
  {
    id: "social-media-executive",
    title: "Social Media Executive",
    department: "Marketing",
    location: "Remote (India)",
    type: "Full-time",
    experience: "0 to 2 years",
    tone: "pink",
    icon: "megaphone",
    summary: "Plan and publish content that grows our clients' brands across Instagram, LinkedIn and more.",
    responsibilities: [
      "Plan monthly content calendars for client accounts.",
      "Write captions, scripts and posts in each brand's voice.",
      "Schedule posts, reply to the community and track results.",
      "Report on reach and growth in plain language.",
    ],
    requirements: [
      "Excellent written English; Hindi or Marathi is a plus.",
      "Hands-on experience managing social accounts (personal projects count).",
      "Basic design skills in Canva or similar tools.",
      "Curious, organised and happy to learn analytics tools.",
    ],
  },
  {
    id: "web-development-intern",
    title: "Web Development Intern",
    department: "Engineering",
    location: "Remote (India)",
    type: "Internship",
    experience: "Students and freshers",
    tone: "yellow",
    icon: "gear",
    summary: "Learn real client-project workflows while building components and fixing issues alongside our developers.",
    responsibilities: [
      "Build small components and pages under senior guidance.",
      "Fix bugs and polish UI details on live projects.",
      "Join weekly reviews and learn how we plan and ship.",
    ],
    requirements: [
      "Basic HTML, CSS and JavaScript knowledge.",
      "A few small projects on GitHub or a personal site.",
      "Can commit at least 20 hours a week for three months.",
    ],
    niceToHave: ["Some React experience"],
  },
];

/* options of the "Role" dropdown in the apply form */
export const ROLE_OPTIONS: string[] = [...JOBS.map((j) => j.title), GENERAL_ROLE];
