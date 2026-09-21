"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

/**
 * The homepage hero renders its own overlay header, revealed by the
 * intro animation. Every other route gets the sticky header.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Header variant="solid" />;
}
