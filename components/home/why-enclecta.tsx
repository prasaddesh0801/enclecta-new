import Section from "@/components/layout/section";
import Button from "@/components/ui/button";
import { Heading, Label, Text } from "@/components/ui/typography";
import Reveal from "@/components/ui/reveal";

const PILLARS = [
  {
    numeral: "I",
    title: "Precision over volume",
    description:
      "We take on fewer engagements at a time so each one gets full attention — depth over breadth, on every project.",
  },
  {
    numeral: "II",
    title: "Long-term partnership",
    description:
      "We measure success in years, not single projects. The goal is to be the technology partner you never need to replace.",
  },
  {
    numeral: "III",
    title: "Radical transparency",
    description:
      "No hidden costs, no scope-creep surprises — timelines, trade-offs and risks stay visible the whole way through.",
  },
  {
    numeral: "IV",
    title: "Engineering rigour",
    description:
      "Code review, test coverage, CI/CD and observability aren't optional extras — they're simply how we build.",
  },
];

/* Matches the hero's own numbers (siteConfig has no stats field yet) rather
   than inventing new ones — swap these if you have updated figures. */
const STATS = [
  { value: "2+", label: "Years building digital products" },
  { value: "10+", label: "Websites & apps delivered" },
  { value: "99%", label: "Client satisfaction" },
];

export default function WhyEnclecta() {
  return (
    <Section id="why-enclecta" tone="surface" space="lg">
      <div className="mx-auto max-w-[42rem] text-center">
        <Label>Our Philosophy</Label>
        <Heading level={2} className="mt-3">
          Technology that earns its place
        </Heading>
        <Text className="mx-auto mt-4 max-w-[42rem]">
          We don&apos;t build technology for its own sake — every system has
          to justify itself in business value, reliability, and the time it
          saves the people who use it. Enclecta was built on the idea that
          the best technology stays out of your way: it works, and it scales
          when you need it to.
        </Text>
        <Button href="/services" variant="outline" className="mt-6">
          Explore our services
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.numeral} delay={i * 70} className="h-full">
            <div className="h-full rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-background p-6 transition-colors duration-300 hover:border-brand-orange/40">
              <span className="heading-font block text-[1.5rem] font-bold text-brand-orange">
                {pillar.numeral}
              </span>
              <Heading level={3} className="mt-3">
                {pillar.title}
              </Heading>
              <Text className="mt-2">{pillar.description}</Text>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 divide-y divide-[color:var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-background sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-16">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 px-6 py-8 text-center"
          >
            <span className="heading-font text-[length:var(--text-h1)] font-bold text-foreground">
              {stat.value}
            </span>
            <Text className="text-[0.875rem]">{stat.label}</Text>
          </div>
        ))}
      </div>
    </Section>
  );
}
