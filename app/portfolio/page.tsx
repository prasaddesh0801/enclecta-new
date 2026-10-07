import type { Metadata } from "next";
import PortfolioLanding from "@/components/portfolio/portfolio-landing";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Websites, web apps and mobile apps we have designed and built, from first sketch to launch.",
};

export default function PortfolioPage() {
  return <PortfolioLanding />;
}
