import Hero from "@/components/home/hero";
import TemplateShowcase from "@/components/home/template-showcase";
import WhatWeDo from "@/components/home/what-we-do";
import Process from "@/components/home/process";
import WhyEnclecta from "@/components/home/why-enclecta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TemplateShowcase />
      <WhatWeDo />
      <Process />
      <WhyEnclecta />
    </>
  );
}