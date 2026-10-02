import Section from "@/components/layout/section";
import { Heading, Label, Subtitle } from "@/components/ui/typography";
import ServiceCard, { type ServiceCardProps } from "./service-card";
import Reveal from "@/components/ui/reveal";

/* Icon set — hand-built inline SVGs matching the stroke style already used
   in components/theme/theme-toggle.tsx (strokeWidth 1.75, round caps), so
   no new icon-library dependency is introduced. */

function IconWebsite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 6 3 12l5 6M16 6l5 6-5 6M14 4l-4 16" />
    </svg>
  );
}

function IconAI({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} aria-hidden="true">
      <path d="M12 3c.6 3.2 2.2 4.8 5.4 5.4-3.2.6-4.8 2.2-5.4 5.4-.6-3.2-2.2-4.8-5.4-5.4C9.8 7.8 11.4 6.2 12 3Z" />
      <circle cx="18.5" cy="17.2" r="1.4" />
    </svg>
  );
}

function IconSaaS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 4 3 9l9 5 9-5-9-5Z" />
      <path d="M3 14l9 5 9-5" />
    </svg>
  );
}

function IconProductEng({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.4M12 18.6V21M4.9 7l2 1.2M17.1 15.8l2 1.2M3 12h2.4M18.6 12H21M4.9 17l2-1.2M17.1 8.2l2-1.2" />
    </svg>
  );
}

function IconData({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" />
    </svg>
  );
}

function IconSocial({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 10v4a1 1 0 0 0 1 1h2l3 4V5l-3 4H4a1 1 0 0 0-1 1Z" />
      <path d="M14 8.5a4 4 0 0 1 0 7M17.3 6a7.5 7.5 0 0 1 0 12" />
    </svg>
  );
}

export const SERVICES: ServiceCardProps[] = [
  {
    index: "01",
    icon: IconWebsite,
    title: "Website Development",
    tagline: "Engage your users",
    description:
      "Responsive, high-performance websites built around your brand — from sleek landing pages to full e-commerce platforms, with clean, maintainable code behind pixel-perfect design.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    href: "/services/website-development",
  },
  {
    index: "02",
    icon: IconAI,
    title: "AI & Automation",
    tagline: "Intelligence at scale",
    description:
      "From LLM-powered copilots to production ML pipelines, we embed intelligence into your product so it learns, adapts, and delivers results you can measure.",
    tags: ["LLMs", "MLOps", "Python", "Vector DBs"],
    href: "/services/ai-automation",
  },
  {
    index: "03",
    icon: IconSaaS,
    title: "SaaS Development",
    tagline: "Turnkey SaaS platforms",
    description:
      "Secure, scalable SaaS applications built from the ground up — multi-tenant architecture, subscription management and analytics dashboards, so you can focus on the business.",
    tags: ["SaaS", "Multi-tenant", "Subscriptions", "Analytics"],
    href: "/services/saas-development",
  },
  {
    index: "04",
    icon: IconProductEng,
    title: "Product Engineering",
    tagline: "Built to last",
    description:
      "Full-stack teams that turn ideas into polished, performant products — agile sprints, clean architecture, and attention to code quality from day one.",
    tags: ["Next.js", "Node.js", "TypeScript", "Postgres"],
    href: "/services/product-engineering",
  },
  {
    index: "05",
    icon: IconData,
    title: "Data & Analytics",
    tagline: "Signal over noise",
    description:
      "Data platforms that turn raw streams into decisions your team can act on — real-time pipelines, clear data models, and dashboards people actually use.",
    tags: ["Spark", "dbt", "Snowflake", "Kafka"],
    href: "/services/data-analytics",
  },
  {
    index: "06",
    icon: IconSocial,
    title: "Social Media Management",
    tagline: "Build your brand",
    description:
      "Strategic social media management — content creation, scheduling, community engagement and analytics — built to deliver growth you can point to.",
    tags: ["Social Media", "Content", "Community", "Analytics"],
    href: "/services/social-media-management",
  },
];

export default function Services() {
  return (
    <Section id="services" tone="default" space="lg">
      <div className="mx-auto max-w-[40rem] text-center">
        <Label>What We Do</Label>
        <Heading level={2} className="mt-3">
          Capabilities built for what&apos;s next
        </Heading>
        <Subtitle className="mx-auto mt-4">
          Six practice areas, one integrated partner — covering every layer
          of the modern web and software stack.
        </Subtitle>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {SERVICES.map((service, i) => (
          <Reveal key={service.index} delay={i * 60} className="h-full">
            <ServiceCard {...service} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
