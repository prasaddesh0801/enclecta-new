import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Auto-advancing "one at a time" loop for a block of the page (used by the perks tabs and the hiring steps).
 *  - every time the block scrolls into view it starts again from item 1
 *  - it only runs while the block is on screen and the visitor is not hovering / focusing it
 *  - visitors can still pick any item by hand (pick), which restarts that item's timer
 *  - with "reduce motion" turned on it never auto-advances
 * The timing itself is a CSS animation on a small progress bar (<i className="cr-bar" onAnimationEnd={next}>),
 * so pausing, resuming and the bar always stay in sync.
 */
export function useLoop(count: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // bump = restart the progress bar
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(0); // always start at number 1 when the visitor arrives
          setCycle((c) => c + 1);
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 }, // counts as "visited" once it reaches the middle of the screen
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);
  const pick = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  return { ref, active, cycle, running: inView && !paused && !reduced, autoplay: !reduced, next, pick, setPaused };
}
