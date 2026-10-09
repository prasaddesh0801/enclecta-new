import type { Metadata } from "next";
import LegalPage from "@/components/legal/legal-page";
import { termsIcons } from "@/components/legal/legal-hero-icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use the ${siteConfig.name} website and services.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      titleLabel="Terms & Conditions"
      lead="The simple ground rules for using our website and working with us."
      updated="October 2026"
      heroIcons={termsIcons}
      glance={{
        heading: "Our terms, at a glance.",
        text: "The key points in a few lines. The full terms follow below.",
        items: [
          { icon: "globe", tone: "orange", title: "Using the site", text: "Browse freely and lawfully. Please don't disrupt the site or try to get into places you shouldn't." },
          { icon: "layers", tone: "blue", title: "Our services", text: "Pages describe what we do in general. Your written proposal sets the scope, price and timeline." },
          { icon: "pen", tone: "pink", title: "Your submissions", text: "What you send us must be accurate and yours to share. We handle it as our Privacy Policy describes." },
          { icon: "shield", tone: "violet", title: "Liability", text: "The site is provided as is. Client work is covered by your project agreement." },
        ],
      }}
      pledge={{
        icon: "doc",
        title: "Your project agreement always comes first.",
        text: "If a signed proposal or agreement says something different from these terms, the agreement wins.",
      }}
      intro="By using this website you agree to these terms. Work we do for clients is covered by a separate written agreement or proposal, which takes priority if it conflicts with anything here."
      contactEmail={siteConfig.email}
      other={{ label: "Read our Privacy Policy", href: "/privacy" }}
      sections={[
        {
          title: "Using the website",
          body: [
            "You may browse and use this site for lawful purposes only. Do not attempt to disrupt it, gain unauthorised access to it, or use it to send spam or harmful code.",
          ],
        },
        {
          title: "Our services",
          body: [
            "Descriptions, timelines and prices on this site are general information, not a binding offer. The scope, price, schedule and deliverables of a project are set out in the written proposal or agreement we both approve.",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            "The content, design, code and branding of this site belong to Enclecta or its licensors and may not be copied or reused without permission. Ownership of work delivered to a client is governed by that client's agreement.",
          ],
        },
        {
          title: "Your submissions",
          body: [
            "Information you send through the contact form or job applications must be accurate and yours to share. We use it as described in our Privacy Policy.",
          ],
        },
        {
          title: "Third-party links",
          body: ["The site may link to other websites. We do not control them and are not responsible for their content or practices."],
        },
        {
          title: "Disclaimer and liability",
          body: [
            "The site is provided \"as is\". To the fullest extent permitted by law, Enclecta is not liable for indirect or consequential loss arising from your use of the site.",
          ],
        },
        {
          title: "Governing law",
          body: ["These terms are governed by the laws of India. Disputes fall under the courts at Pune, Maharashtra."],
        },
        {
          title: "Changes and contact",
          body: [
            `We may update these terms from time to time. Questions: ${siteConfig.email}. ${siteConfig.name}, ${siteConfig.address}.`,
          ],
        },
      ]}
    />
  );
}
