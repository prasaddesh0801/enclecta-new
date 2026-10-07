import type { Metadata } from "next";
import AboutLanding from "@/components/about/about-landing";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet Enclecta Ventures: a small, senior team in Pune that designs, builds and looks after websites, apps and the marketing around them.",
};

export default function AboutPage() {
  return <AboutLanding />;
}
