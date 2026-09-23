import Hero from "@/components/home/hero";
import Section from "@/components/layout/section";
import Button from "@/components/ui/button";
import { Heading, Subtitle, Text } from "@/components/ui/typography";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Placeholder section — proves the container, spacing, type and button
          system below the hero. Replace with real homepage content. */}
      <Section id="what-we-do" tone="default" space="md">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Heading level={2}>
              We build the websites growing companies run on
            </Heading>
            <Subtitle className="mt-4">
              Design, build, launch, maintain — one team, start to finish.
            </Subtitle>
          </div>
          <div className="flex flex-col items-start gap-6">
            <Text>
              Enclecta Ventures works with founders and marketing teams to ship
              sites that load fast, rank well and are easy to keep updating long
              after launch.
            </Text>
            <Button href="/contact" size="lg">
              Start a project
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
