/* All copy for the six service pages lives here. Edit text freely; the design is shared.
   - `slug` MUST match the href on each homepage card (components/home/services.tsx → /services/<slug>)
     and is also the ?service= value used by /contact.
   - `glance` values are placeholders — replace with your real timelines. */

type Pair = [title: string, text: string];
type Item = [icon: string, title: string, text: string];

export type Service = {
  slug: string;
  name: string;
  icon: string; // key from service-icons.tsx
  accent: string; // sampled from the homepage card icon; themes the whole page
  tagline: string;
  heroTitle: [string, string];
  heroText: string;
  glance: Pair[]; // 3 quick facts shown beside the hero
  intro: Pair; // heading + paragraph above "what we deliver"
  deliver: Item[]; // 6
  steps: Pair[]; // 4
  tools: [group: string, items: string[]][];
  outcomes: Pair[]; // 3
  faqs: Pair[]; // 4
  cta: Pair;
};

export const SERVICES: Service[] = [
  {
    slug: "website-development",
    name: "Website Development",
    icon: "code",
    accent: "#d9803f",
    tagline: "Engage your users",
    heroTitle: ["Websites that", "work for your business."],
    heroText:
      "Responsive, high-performance websites built around your brand, from sleek landing pages to full e-commerce platforms, with clean, maintainable code behind pixel-perfect design.",
    glance: [
      ["Typical timeline", "3 to 8 weeks"],
      ["Built with", "Next.js, React, TypeScript"],
      ["Ownership", "Code and accounts in your name"],
    ],
    intro: [
      "A site your team can run and your customers enjoy.",
      "We build for a real goal, whether that is enquiries, sales or credibility, then make sure the site loads fast, ranks well and is easy to update.",
    ],
    deliver: [
      ["monitor", "Company sites and landing pages", "Focused pages that explain what you do and make the next step obvious."],
      ["layers", "E-commerce", "Catalogues, carts and checkout that stay quick on every device."],
      ["pen", "Design to code", "Your designs, or ours, built precisely on a reusable component library."],
      ["search", "SEO foundations", "Clean markup, metadata and Core Web Vitals handled from day one."],
      ["doc", "Easy content updates", "A CMS your team can use without calling a developer."],
      ["shield", "Secure launch and handover", "Deployed, monitored and handed over with full documentation."],
    ],
    steps: [
      ["Discover", "A short call and a written brief covering goals, audience, scope and timeline."],
      ["Design", "Wireframes first, then full screens you can review and comment on."],
      ["Build", "Weekly working builds on a private link, so you see real progress."],
      ["Launch and improve", "Testing, deployment, then refinements based on real traffic."],
    ],
    tools: [
      ["Front end", ["Next.js", "React", "TypeScript", "Tailwind CSS"]],
      ["Content and commerce", ["Headless CMS", "Stripe", "Shopify"]],
      ["Hosting", ["Vercel", "AWS", "CI/CD"]],
    ],
    outcomes: [
      ["Pages that load quickly", "Performance is a requirement from the first sprint, not a cleanup task at the end."],
      ["Content you control", "Update copy, images and pages yourself, safely."],
      ["No lock-in", "Standard tools your next developer will recognise."],
    ],
    faqs: [
      ["How long does a website take?", "Most company sites take three to eight weeks. E-commerce and custom features take longer, and we give a timeline in writing before we start."],
      ["Can you redesign my existing site?", "Yes. We review what works today, keep the content and rankings that matter, and rebuild the rest."],
      ["Will I be able to edit the content?", "Yes. We set up a CMS suited to your team and show you how to use it."],
      ["Do you look after the site after launch?", "If you want us to. We offer ongoing updates and improvements, or hand everything over cleanly."],
    ],
    cta: ["Ready to build a faster website?", "Tell us about your project and we will reply within one working day with next steps and a rough quote."],
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    icon: "sparkle",
    accent: "#5f9bea",
    tagline: "Intelligence at scale",
    heroTitle: ["Intelligence built", "into your product."],
    heroText:
      "From LLM-powered copilots to production ML pipelines, we embed intelligence into your product so it learns, adapts and delivers results you can measure.",
    glance: [
      ["Typical timeline", "4 to 10 weeks to first release"],
      ["Built with", "Python, LLMs, vector databases"],
      ["Approach", "Measured against your own KPIs"],
    ],
    intro: [
      "Practical AI, shipped to production.",
      "We start with a business problem, not a model. Every project has a clear metric, an evaluation plan and a route to production.",
    ],
    deliver: [
      ["sparkle", "LLM copilots and assistants", "Assistants grounded in your own documents, data and workflows."],
      ["search", "Knowledge search", "Vector search over your content, with sources shown so answers can be checked."],
      ["gear", "Workflow automation", "Repetitive tasks automated end to end, with people kept in the loop where it matters."],
      ["chart", "Predictive models", "Forecasting, scoring and classification trained on your data."],
      ["refresh", "MLOps and deployment", "Versioned models, monitoring and retraining that keep quality steady."],
      ["shield", "Evaluation and safety", "Test sets, guardrails and cost controls before anything reaches customers."],
    ],
    steps: [
      ["Frame the problem", "Pick one use case, define success and check the data you already have."],
      ["Prototype", "A working proof of concept, tested against real examples."],
      ["Productionise", "APIs, security, monitoring and cost controls built in."],
      ["Monitor and improve", "Track quality in use and retrain as your data changes."],
    ],
    tools: [
      ["Models", ["LLMs", "Embeddings", "Fine-tuning"]],
      ["Data and ML", ["Python", "Vector DBs", "MLOps"]],
      ["Delivery", ["APIs", "CI/CD", "Observability"]],
    ],
    outcomes: [
      ["Less manual work", "Routine tasks move off your team's desk and stay accurate."],
      ["Answers you can trust", "Responses are grounded in your content and traceable to a source."],
      ["Costs and quality you can see", "Dashboards show accuracy, usage and spend."],
    ],
    faqs: [
      ["Do we need a lot of data to start?", "Not always. Many useful assistants work from the documents you already have. We assess your data in the first week."],
      ["Which models do you use?", "We choose per use case, weighing quality, cost, speed and privacy, and design so models can be swapped later."],
      ["How do you handle sensitive data?", "We agree data handling rules up front and can use private deployments or providers that do not train on your data."],
      ["How do you measure success?", "We agree a metric before building, such as hours saved or resolution rate, and report against it."],
    ],
    cta: ["Ready to put AI to work?", "Describe the problem you want to solve and we will suggest a realistic first project within one working day."],
  },
  {
    slug: "saas-development",
    name: "SaaS Development",
    icon: "layers",
    accent: "#d46a96",
    tagline: "Turnkey SaaS platforms",
    heroTitle: ["A SaaS platform", "ready to grow."],
    heroText:
      "Secure, scalable SaaS applications built from the ground up, with multi-tenant architecture, subscription management and analytics dashboards, so you can focus on the business.",
    glance: [
      ["Typical timeline", "8 to 14 weeks to MVP"],
      ["Built with", "Next.js, Node.js, Postgres"],
      ["Includes", "Billing, roles and analytics"],
    ],
    intro: [
      "The hard parts of SaaS, done properly.",
      "Tenancy, billing and permissions are difficult to retrofit. We build them in from the start so you can add features without rework.",
    ],
    deliver: [
      ["layers", "Multi-tenant architecture", "Customer data kept separate, with a structure that scales from ten accounts to ten thousand."],
      ["refresh", "Subscriptions and billing", "Plans, trials, upgrades and invoices through Stripe."],
      ["shield", "Authentication and roles", "Secure sign-in, teams and fine-grained permissions."],
      ["chart", "Analytics dashboards", "Usage and revenue metrics for you, and reporting for your customers."],
      ["users", "Admin and customer portals", "Tools to manage accounts, support users and review activity."],
      ["code", "APIs and integrations", "A documented API and connections to the tools your customers already use."],
    ],
    steps: [
      ["Scope the MVP", "Decide what the first release must do and what can wait."],
      ["Architect", "Choose the data model, tenancy approach and billing flow."],
      ["Build and iterate", "Two-week sprints, each ending with a demo."],
      ["Launch and scale", "Go live with monitoring, then plan the roadmap from real usage."],
    ],
    tools: [
      ["Application", ["Next.js", "Node.js", "TypeScript"]],
      ["Data and billing", ["Postgres", "Stripe", "Redis"]],
      ["Cloud", ["AWS", "Vercel", "CI/CD"]],
    ],
    outcomes: [
      ["A faster path to revenue", "Billing and onboarding work on day one of launch."],
      ["Room to grow", "Architecture that handles more customers without a rewrite."],
      ["Security by default", "Access control, audit trails and backups included."],
    ],
    faqs: [
      ["What does an MVP include?", "Sign-up, core features, billing and an admin view. We agree the exact list together and keep it small."],
      ["Do you build on an existing codebase?", "Yes. We review the code first and tell you honestly whether to extend it or rebuild."],
      ["Who owns the code?", "You do. Code, infrastructure and accounts are set up in your name."],
      ["Can you support us after launch?", "Yes. We offer monthly support and ongoing development."],
    ],
    cta: ["Ready to launch your platform?", "Share your idea and we will reply within one working day with a proposed MVP scope."],
  },
  {
    slug: "product-engineering",
    name: "Product Engineering",
    icon: "gear",
    accent: "#8a5fe3",
    tagline: "Built to last",
    heroTitle: ["Products built", "to last."],
    heroText:
      "Full-stack teams that turn ideas into polished, performant products, with agile sprints, clean architecture and attention to code quality from day one.",
    glance: [
      ["Working style", "Two-week sprints with demos"],
      ["Built with", "Next.js, Node.js, TypeScript"],
      ["Team", "Senior engineers and a design lead"],
    ],
    intro: [
      "Engineering that stays maintainable as you grow.",
      "We write code your team can read, test and extend, and we are open about trade-offs so you always know where the product stands.",
    ],
    deliver: [
      ["bulb", "Product discovery", "Turn a rough idea into a clear scope, user flows and a plan."],
      ["code", "Full-stack development", "Front end, back end and data layer built by one coordinated team."],
      ["layers", "Architecture", "Simple, well-documented structures that suit your stage."],
      ["shield", "Testing and CI/CD", "Automated tests and deployments so releases are routine."],
      ["bolt", "Performance and reliability", "Profiling, monitoring and alerts from the first release."],
      ["users", "Team extension", "Embed with your developers to add capacity on an existing product."],
    ],
    steps: [
      ["Align", "Agree goals, constraints and what success looks like."],
      ["Plan", "Break the work into sprints with clear priorities."],
      ["Build", "Ship in small increments, reviewed and tested."],
      ["Evolve", "Release, learn from users and keep improving."],
    ],
    tools: [
      ["Front end", ["Next.js", "React", "TypeScript"]],
      ["Back end", ["Node.js", "Postgres", "REST and GraphQL"]],
      ["Quality", ["Automated tests", "CI/CD", "Monitoring"]],
    ],
    outcomes: [
      ["Steady, visible progress", "A working demo at the end of every sprint."],
      ["Code you can hand on", "Documented, reviewed and tested."],
      ["Fewer surprises", "Risks and trade-offs raised early."],
    ],
    faqs: [
      ["Can you work with our in-house team?", "Yes. We can lead delivery or join your team, using your tools and processes."],
      ["How do you handle changing requirements?", "Priorities are reviewed every sprint. We adjust the plan and explain the effect on time and cost."],
      ["How do you keep quality high?", "Peer review on every change, automated tests and continuous integration."],
      ["Do you take over an existing product?", "Yes. We start with a short code review and share findings before proposing a plan."],
    ],
    cta: ["Ready to build your product?", "Tell us what you are making and we will reply within one working day."],
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    icon: "chart",
    accent: "#cfae3f",
    tagline: "Signal over noise",
    heroTitle: ["Data your team", "can act on."],
    heroText:
      "Data platforms that turn raw streams into decisions, with real-time pipelines, clear data models and dashboards people actually use.",
    glance: [
      ["Typical timeline", "4 to 12 weeks"],
      ["Built with", "Spark, dbt, Snowflake, Kafka"],
      ["Output", "Trusted metrics and live dashboards"],
    ],
    intro: [
      "One reliable version of the numbers.",
      "We connect your sources, clean and model the data, and present it so everyone works from the same figures.",
    ],
    deliver: [
      ["bolt", "Real-time pipelines", "Streaming and batch ingestion from your apps, databases and third-party tools."],
      ["layers", "Warehouse and data models", "A clear structure for analysts, with documented definitions."],
      ["chart", "Dashboards and reporting", "Views built around decisions your team makes each week."],
      ["check", "Data quality", "Automated checks that catch problems before they reach a report."],
      ["refresh", "Integrations", "Reliable connections between your systems."],
      ["shield", "Governance and access", "Permissions and audit trails that protect sensitive data."],
    ],
    steps: [
      ["Audit", "Map your sources, questions and current reporting."],
      ["Model", "Define metrics once and agree what each one means."],
      ["Build pipelines", "Automate collection, cleaning and loading."],
      ["Deliver", "Launch dashboards, train your team and monitor quality."],
    ],
    tools: [
      ["Processing", ["Spark", "Kafka", "dbt"]],
      ["Storage", ["Snowflake", "Postgres"]],
      ["Reporting", ["Dashboards", "Alerts", "Scheduled reports"]],
    ],
    outcomes: [
      ["Decisions in hours, not weeks", "Fresh data replaces manual spreadsheets."],
      ["Numbers everyone trusts", "Shared definitions and automated checks."],
      ["Insight for non-specialists", "Dashboards written in your business language."],
    ],
    faqs: [
      ["Where should we start?", "With the three or four decisions you most need data for. We work backwards to the sources."],
      ["Can you use our existing tools?", "Often yes. We recommend new tools only where they clearly help."],
      ["How do you keep data accurate?", "Tests run on every load and alert us when something looks wrong."],
      ["Will our team be able to maintain it?", "Yes. We document the models and train your team."],
    ],
    cta: ["Ready to see your data clearly?", "Tell us which decisions you want to improve and we will reply within one working day."],
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    icon: "megaphone",
    accent: "#4452c6",
    tagline: "Build your brand",
    heroTitle: ["Growth you can", "point to."],
    heroText:
      "Strategic social media management covering content creation, scheduling, community engagement and analytics, built to deliver growth you can point to.",
    glance: [
      ["Cadence", "Monthly plan, weekly reporting"],
      ["Channels", "Instagram, LinkedIn, X, YouTube"],
      ["Contract", "Rolling, no long lock-in"],
    ],
    intro: [
      "A consistent presence that sounds like you.",
      "We plan, create and publish on your behalf, respond to your audience, and report on what is working.",
    ],
    deliver: [
      ["map", "Channel strategy", "Choose the platforms, audiences and goals worth your time."],
      ["pen", "Content creation", "Posts, graphics and short video in your brand voice."],
      ["bell", "Scheduling and publishing", "A content calendar you approve in advance."],
      ["users", "Community engagement", "Replies, comments and messages handled promptly."],
      ["chart", "Analytics and reporting", "Plain-language reports on reach, engagement and leads."],
      ["megaphone", "Brand voice", "Guidelines that keep every post consistent."],
    ],
    steps: [
      ["Listen", "Learn your audience, competitors and goals."],
      ["Plan", "Agree the themes and calendar for the month."],
      ["Publish", "Create, approve and schedule content, then engage with replies."],
      ["Review", "Share results and refine the plan."],
    ],
    tools: [
      ["Channels", ["Instagram", "LinkedIn", "X", "YouTube"]],
      ["Workflow", ["Content calendar", "Scheduling", "Approvals"]],
      ["Insights", ["Analytics", "Monthly reports"]],
    ],
    outcomes: [
      ["A steady presence", "Regular, on-brand posts without adding to your workload."],
      ["An engaged audience", "Questions and comments answered quickly."],
      ["Clear reporting", "You see what worked and what we will change."],
    ],
    faqs: [
      ["Do I approve posts before they go live?", "Yes. You review the calendar in advance and can request changes."],
      ["Which platforms should we use?", "We recommend based on where your customers are, usually one or two to start."],
      ["How do you measure results?", "We set goals together, such as reach, engagement or enquiries, and report on them monthly."],
      ["Is there a minimum contract?", "No long lock-in. We work month to month after an initial setup."],
    ],
    cta: ["Ready to grow your audience?", "Tell us about your brand and we will reply within one working day."],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
