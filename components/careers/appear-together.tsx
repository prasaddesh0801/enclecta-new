"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wrap a group of boxes: they are hidden, then ALL pop in together (same moment, same animation)
 * each time the group scrolls into view. The animation itself is in careers.css (.cr-bento.is-in .cr-b).
 * Give each box its own wrapper with class "cr-b" and data-no-reveal (so the page-wide scroll glide leaves them alone).
 */
export default function AppearTogether({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className ?? ""}${on ? " is-in" : ""}`}>
      {children}
    </div>
  );
}
