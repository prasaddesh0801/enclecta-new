"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

/**
 * The homepage hero renders its own overlay header, revealed by the
 * intro animation. Every other route gets the sticky header.
 * /services and /services/<slug> keep the normal theme-aware header, with a green "Ventures".
 */
export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const greenAccent = pathname === "/services" || !!pathname?.startsWith("/services/");
  return <Header variant="solid" greenAccent={greenAccent} />;
}
