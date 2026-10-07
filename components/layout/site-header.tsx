"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

/**
 * The homepage hero renders its own overlay header, revealed by the
 * intro animation. Every other route gets the sticky header.
 * Both use the same <Logo> and the same nav, so the navbar looks identical on every page.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Header variant="solid" />;
}
