import Section from "@/components/layout/section";
import { Heading, Label, Small, Subtitle, Text } from "@/components/ui/typography";
import Reveal from "@/components/ui/reveal";

const STEPS = [
  {
    index: "01",
    duration: "2–5 days",
    title: "Discovery and scope",
    description:
      "We pin down the business goal, target users, workflows, constraints and success metrics before a line of code gets written.",
    deliverables: ["Project brief", "Feature scope", "Risk notes"],
  },
  {
    index: "02",
    duration: "3–7 days",
    title: "Architecture and planning",
    description:
      "System shape, UI structure and data model get mapped out, along with delivery milestones and the first usable release.",
    deliverables: ["Technical plan", "Page map", "Sprint plan"],
  },
  {
    index: "03",
    duration: "1–8 weeks",
    title: "Design and development",
    description:
      "We build in focused iterations with clear review points, responsive interfaces, and production-grade, maintainable code.",
    deliverables: ["Frontend build", "Backend flows", "Weekly demos"],
  },
  {
    index: "04",
    duration: "3–10 days",
    title: "QA and launch",
    description:
      "Core flows, mobile behaviour, performance, forms and links get tested, and deployment readiness confirmed before handover.",
    deliverables: ["QA pass", "Deployment", "Launch checklist"],
  },
  {
    index: "05",
    duration: "Ongoing",
    title: "Support and improvement",
    description:
      "After launch we handle fixes, improvements, analytics review and new features as the product keeps evolving.",
    deliverables: ["Maintenance", "Roadmap", "Iteration support"],
  },
];

export default function Process() {
  return (
    <Section id="process" tone="default" space="lg">
      <div className="mx-auto max-w-[40rem] text-center">
        <Label>Process</Label>
        <Heading level={2} className="mt-3">
          How projects move forward
        </Heading>
        <Subtitle className="mx-auto mt-4">
          A clear process keeps the work predictable — you always know what
          is being built, why it matters, and what happens next.
        </Subtitle>
      </div>

      <ol className="relative mx-auto mt-12 flex max-w-[46rem] flex-col gap-10 lg:mt-16">
        {/* connecting rail behind the step markers */}
        <div
          aria-hidden="true"
          className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-[color:var(--border)] sm:left-[1.6rem]"
        />

        {STEPS.map((step, i) => (
          <Reveal key={step.index} delay={i * 90}>
            <li className="group relative flex gap-5 sm:gap-6">
              <span
                className="heading-font relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--border)] bg-surface text-[0.9rem] font-semibold text-foreground-muted transition-colors duration-300 group-hover:border-brand-orange group-hover:text-brand-orange sm:h-[3.25rem] sm:w-[3.25rem]"
              >
                {step.index}
              </span>

              <div className="flex-1 pb-1 pt-1.5 sm:pt-2.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Heading level={3}>{step.title}</Heading>
                  <Small className="rounded-[var(--radius-pill)] bg-foreground/5 px-2.5 py-0.5">
                    {step.duration}
                  </Small>
                </div>
                <Text className="mt-2">{step.description}</Text>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.deliverables.map((d) => (
                    <span
                      key={d}
                      className="body-font rounded-[var(--radius-sm)] border border-[color:var(--border)] px-2.5 py-1 text-[0.75rem] text-foreground-muted transition-colors duration-300 group-hover:border-brand-orange/40 group-hover:text-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
