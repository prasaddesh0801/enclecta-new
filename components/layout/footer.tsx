import Link from "next/link";
import Container from "./container";
import Logo from "./logo";
import Button from "@/components/ui/button";
import { Heading, Small, Text } from "@/components/ui/typography";
import { footerNav, siteConfig, socialLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--border)] bg-surface">
      {/* CTA band */}
      <Container
        width="wide"
        className="flex flex-col gap-6 border-b border-[color:var(--border)] py-12 md:flex-row md:items-end md:justify-between md:py-16"
      >
        <div className="max-w-[34ch]">
          <Heading level={2}>Have a project in mind?</Heading>
          <Text className="mt-3">
            Tell us what you are building and we will come back with a plan, a
            timeline and a price.
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" size="lg">
            Start a project
          </Button>
          <Button href={`mailto:${siteConfig.email}`} variant="outline" size="lg">
            Email us
          </Button>
        </div>
      </Container>

      {/* Navigation grid */}
      <Container
        width="wide"
        className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-16"
      >
        <div className="flex flex-col gap-4">
          <Logo />
          <Text className="max-w-[38ch] text-[0.9rem]">
            {siteConfig.description}
          </Text>
          <address className="body-font not-italic text-[0.9rem] text-foreground-muted">
            {siteConfig.address}
            <br />
            <a className="hover:text-foreground" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            <br />
            <a className="hover:text-foreground" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              {siteConfig.phone}
            </a>
          </address>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
            <p className="heading-font text-[0.95rem] font-semibold text-foreground">
              {group.title}
            </p>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="body-font text-[0.9rem] text-foreground-muted transition-colors hover:text-brand-amber"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </Container>

      {/* Bottom bar */}
      <Container
        width="wide"
        className="flex flex-col gap-4 border-t border-[color:var(--border)] py-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <Small>
          © {year} {siteConfig.name}. All rights reserved.
        </Small>
        <ul className="flex flex-wrap items-center gap-5">
          {socialLinks.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="body-font text-[0.875rem] text-foreground-muted transition-colors hover:text-brand-orange"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
