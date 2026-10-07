import { TECH } from "@/lib/featured-projects";
import TechRows from "./tech-rows";

/** "Technologies we work with": the TECH list in lib/featured-projects.ts, drawn as 2 moving rows. */
export default function PortfolioTech() {
  return <TechRows tools={TECH} />;
}
