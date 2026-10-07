import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/portfolio/project-detail";
import { WORKS, getWork } from "@/lib/featured-projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWork((await params).slug);
  return w ? { title: w.name, description: w.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const w = getWork((await params).slug);
  if (!w) notFound();
  // key remounts the page (and its motion) when moving between projects
  return <ProjectDetail key={w.slug} work={w} />;
}
