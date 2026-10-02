import Hero from "@/components/home/hero";
import TemplateShowcase from "@/components/home/template-showcase";
import WhatWeDo from "@/components/home/what-we-do";
import Process from "@/components/home/process";
import WhyEnclecta from "@/components/home/why-enclecta";
import Portfolio from "@/components/home/portfolio";
import Pricing from "@/components/home/pricing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TemplateShowcase />
      <WhatWeDo />
      <Process />
      <Portfolio />
      <WhyEnclecta />
      <Pricing />
    </>
  );
}