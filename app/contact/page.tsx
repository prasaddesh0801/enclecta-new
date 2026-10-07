import type { Metadata } from "next";
import ContactLanding from "@/components/contact/contact-landing";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you want to build. Email, call, message us on WhatsApp or send the project form. We reply within one working day.",
};

export default function ContactPage() {
  return <ContactLanding />;
}
