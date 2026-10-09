import type { Metadata } from "next";
import CareersLanding from "@/components/careers/careers-landing";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Enclecta Ventures: a small, remote-first team in India building websites, apps and marketing for growing businesses. See open roles and apply.",
};

export default function CareersPage() {
  return <CareersLanding />;
}
