import type { Metadata } from "next";
import PricingLanding from "@/components/pricing/pricing-landing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest website pricing. Pick a plan, add what you need and see your estimate. Fixed written quotes, no surprise invoices.",
};

export default function PricingPage() {
  return <PricingLanding />;
}
