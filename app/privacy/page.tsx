import type { Metadata } from "next";
import LegalPage from "@/components/legal/legal-page";
import { privacyIcons } from "@/components/legal/legal-hero-icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      titleLabel="Privacy Policy"
      lead="How we collect, use and protect your information, in plain language."
      updated="October 2026"
      heroIcons={privacyIcons}
      glance={{
        heading: "Your privacy, at a glance.",
        text: "The short version of what happens to the information you share with us. The full policy follows below.",
        items: [
          { icon: "search", tone: "orange", title: "What we collect", text: "Details you send us, like your name, email and project brief, plus basic technical data from site logs." },
          { icon: "gear", tone: "blue", title: "How we use it", text: "To reply to you, deliver our services, review applications and keep the site secure and improving." },
          { icon: "users", tone: "pink", title: "Who sees it", text: "Only service providers who help us run the site, and only as needed to do that work." },
          { icon: "check", tone: "violet", title: "Your choices", text: "Ask us to access, correct or delete your information, or unsubscribe, at any time." },
        ],
      }}
      pledge={{
        icon: "shield",
        title: "We never sell your personal information.",
        text: `Want to know what we hold about you? Write to ${siteConfig.email} and we will tell you.`,
      }}
      intro={`This policy explains what information ${siteConfig.name} ("Enclecta", "we", "us") collects through this website, why we collect it and the choices you have.`}
      contactEmail={siteConfig.email}
      other={{ label: "Read our Terms & Conditions", href: "/terms" }}
      sections={[
        {
          title: "Information we collect",
          body: [
            "Details you give us directly: your name, email address, phone number, company and project details when you use the contact form, apply for a role or subscribe to updates, and anything you choose to include in your message or application.",
            "Basic technical data such as browser type, device, pages visited and approximate location, collected through standard server logs and analytics tools.",
          ],
        },
        {
          title: "How we use it",
          body: [
            "To reply to enquiries, prepare proposals, deliver and support our services, review job applications, send updates you asked for, keep the site secure and understand how it is used so we can improve it.",
            "We do not sell your personal information.",
          ],
        },
        {
          title: "Sharing",
          body: [
            "We share information only with service providers that help us run the website and our business (for example hosting, email and analytics), and only as needed for them to do that work. We may also disclose information when the law requires it.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "The site may use cookies or similar storage to remember preferences such as your light or dark theme and to measure traffic. You can block or delete cookies in your browser settings; some features may then work differently.",
          ],
        },
        {
          title: "Retention and security",
          body: [
            "We keep information only as long as we need it for the purposes above or to meet legal obligations, and we use reasonable technical and organisational measures to protect it. No method of transmission or storage is completely secure.",
          ],
        },
        {
          title: "Your choices",
          body: [
            "You can ask us to access, correct or delete the personal information we hold about you, and you can unsubscribe from emails at any time. Write to us using the details below.",
          ],
        },
        {
          title: "Changes to this policy",
          body: ["We may update this policy from time to time. The date at the top shows when it last changed."],
        },
        {
          title: "Contact",
          body: [`Questions about privacy: ${siteConfig.email}. ${siteConfig.name}, ${siteConfig.address}.`],
        },
      ]}
    />
  );
}
