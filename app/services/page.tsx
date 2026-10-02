import type { Metadata } from "next";
import ServicesLanding from "@/components/services/services-landing";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, UI/UX design, SEO, support and content — everything you need to build, grow and succeed online.",
};

export default function ServicesPage() {
  return <ServicesLanding />;
}
