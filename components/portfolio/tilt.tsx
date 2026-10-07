"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * 3D tilt: the element leans toward the pointer and a soft light follows it (see .pw-tilt in portfolio-v2.css).
 * Children can sit at different depths with `transform: translateZ(..)` because the wrapper keeps preserve-3d.
 * Touch input is ignored, so phones keep normal scrolling.
 */
export default function Tilt({
  children,
  className = "",
  style,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** maximum lean in degrees */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("is-moving");
    el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-moving");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} className={`pw-tilt ${className}`} style={style} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
