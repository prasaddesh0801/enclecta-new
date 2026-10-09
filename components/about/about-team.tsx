"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import "./about-team.css";

/* =========================================================
   TEAM PILLS: four tall pill-shaped cards in staggered heights (odd cards high, even cards low).

   EVERY time the section scrolls into view (it resets when you scroll away) this happens:
   1. Opening: cards 1 and 3 open top → bottom, cards 2 and 4 open bottom → top (slow, one after another).
   2. 2 seconds with all fronts showing.
   3. Card 1 flips, shows its back for 2 seconds, flips back. Then the same for card 2, 3 and 4.
   4. Done: all fronts stay showing.

   CLICK (tap, or Enter / Space) a card: it flips in its place. Click it again and it flips back.
   DOUBLE-CLICK (double-tap) a card: it comes to the FRONT of the page, big and centred over a dimmed screen,
   and turns to show its back. In front you can click it as often as you like to flip it back and forth.
   Click anywhere else on the screen (or press Esc) and it flies back to its place.

   EDIT HERE: put photos in /public/team/ and set `photo` (e.g. "/team/ravi.png").
   Best results: portrait cut-outs (PNG with transparent background, or a photo on a plain white background),
   shown in black & white on the card colour. Without a photo a silhouette is drawn.
   `tint` is the card colour. `skills` are the small chips on the back (keep to 3).
   Timings are the constants just below.
   ========================================================= */

type Person = {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  tint: string;
  photo?: string;
};

const TEAM: Person[] = [
  {
    name: "Team Member One",
    role: "Founder & CEO",
    bio: "Leads strategy and keeps every project honest, on time and on budget.",
    skills: ["Strategy", "Planning", "Clients"],
    tint: "#efb9d0",
    photo: undefined,
  },
  {
    name: "Team Member Two",
    role: "Lead Developer",
    bio: "Turns designs into fast, tidy code that is easy to hand over.",
    skills: ["Next.js", "Performance", "APIs"],
    tint: "#cfd9db",
    photo: undefined,
  },
  {
    name: "Team Member Three",
    role: "UI / UX Designer",
    bio: "Sketches, tests and polishes until the screen feels obvious.",
    skills: ["Interface", "Prototyping", "Brand"],
    tint: "#e4e0d6",
    photo: undefined,
  },
  {
    name: "Team Member Four",
    role: "Project Manager",
    bio: "Your one point of contact from the first call to launch day.",
    skills: ["Scheduling", "Reviews", "Support"],
    tint: "#f0c84f",
    photo: undefined,
  },
];

/* ---------- timings (ms) ---------- */
const OPEN_MS = 1900;    // how long one card takes to open
const STAGGER_MS = 260;  // delay between one card starting and the next
const PAUSE_MS = 2000;   // all fronts shown after the opening, before the first flip
const FLIP_MS = 850;     // flip duration (also set in about-team.css through --flip)
const HOLD_MS = 2000;    // each back side stays this long during the demo
const DOUBLE_MS = 380;   // max gap between two clicks to count as a double-click
const ZOOM_MS = 750;     // card flying to the front (keep in step with tm-zoom-in in the css)
const CLOSE_MS = 650;    // card flying back to its place (keep in step with tm-zoom-out in the css)

type Zoom = {
  i: number;
  w: number;  // size of the card in front (px)
  h: number;
  fx: number; // offset of the card's place from the screen centre (px)
  fy: number;
  fs: number; // scale of the card's place relative to the size in front
  closing: boolean;
};

const FlipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

function Silhouette() {
  return (
    <svg className="tm-sil" viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <circle cx="50" cy="40" r="20" />
      <path d="M8 120c2-28 18-44 42-44s40 16 42 44z" />
    </svg>
  );
}

/* the two faces of a card, plus ONE click target on top that never rotates.
   (Per-face buttons lose clicks while the card is mid-flip, which broke double-clicking.)
   Used for the card in its place and for the copy shown in front. */
function CardFaces({
  p,
  isFlip,
  onClick,
  onDouble,
}: {
  p: Person;
  isFlip: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onDouble?: () => void;
}) {
  return (
    <>
      <div className="tm-flip">
        <div className="tm-inner">
          {/* ---------- front ---------- */}
          <div className="tm-face tm-front" aria-hidden={isFlip}>
            <div className="tm-head">
              <strong className="tm-name heading-font">{p.name}</strong>
              <span className="tm-role body-font">{p.role}</span>
            </div>

            <span className="tm-photo">
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt={isFlip ? "" : `${p.name}, ${p.role}`}
                  fill
                  sizes="(min-width: 900px) 25vw, 50vw"
                  className="tm-img"
                />
              ) : (
                <Silhouette />
              )}
            </span>

            <span className="tm-more body-font" aria-hidden="true">
              <FlipIcon />
              <span>
                <span className="tm-t-mouse">Click</span>
                <span className="tm-t-touch">Tap</span> to flip
              </span>
            </span>
          </div>

          {/* ---------- back ---------- */}
          <div className="tm-face tm-back" aria-hidden={!isFlip}>
            <div className="tm-back-in">
              <strong className="tm-b-name heading-font">{p.name}</strong>
              <span className="tm-b-role body-font">{p.role}</span>
              <i className="tm-rule" aria-hidden="true" />
              <p className="tm-b-bio body-font">{p.bio}</p>
              <span className="tm-chips">
                {p.skills.map((s) => (
                  <span key={s} className="tm-chip body-font">{s}</span>
                ))}
              </span>
              <span className="tm-back-hint body-font" aria-hidden="true">
                <span className="tm-hint-flip">
                  <span className="tm-t-mouse">Click</span>
                  <span className="tm-t-touch">Tap</span> to flip back
                </span>
                <span className="tm-hint-close">
                  <span className="tm-t-mouse">Click</span>
                  <span className="tm-t-touch">Tap</span> outside to close
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="tm-hit"
        aria-label={isFlip ? `Flip ${p.name}'s card back` : `Read more about ${p.name}, ${p.role}`}
        aria-expanded={isFlip}
        onClick={onClick}
        onDoubleClick={onDouble}
      />
    </>
  );
}

export default function AboutTeam() {
  const N = TEAM.length;
  const [shown, setShown] = useState(false);              // opening animation running / done
  const [auto, setAuto] = useState<number | null>(null);  // card flipped by the automatic demo
  const [flips, setFlips] = useState<number[]>([]);       // cards flipped by the visitor, in place
  const [zoom, setZoom] = useState<Zoom | null>(null);    // card brought to the front by a double-click
  const [zoomFlip, setZoomFlip] = useState(false);        // flip state of the card in front
  const [reduce, setReduce] = useState(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const demoTimers = useRef<number[]>([]);
  const userTimers = useRef<number[]>([]);
  const lastClick = useRef({ i: -1, t: 0 });
  const openedAt = useRef(0);
  const zoomRef = useRef<Zoom | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const setFlip = useCallback((i: number, on: boolean) => {
    setFlips((f) => (on ? (f.includes(i) ? f : [...f, i]) : f.filter((x) => x !== i)));
  }, []);

  const stopDemo = useCallback(() => {
    demoTimers.current.forEach((t) => window.clearTimeout(t));
    demoTimers.current = [];
    setAuto(null);
  }, []);

  const clearUser = useCallback(() => {
    userTimers.current.forEach((t) => window.clearTimeout(t));
    userTimers.current = [];
  }, []);

  /* play on EVERY visit: start when the row is on screen, reset once it has fully left the screen */
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.3) setShown(true);
        else if (!e.isIntersecting) setShown(false);
      },
      { threshold: [0, 0.3] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* leaving the section: put everything back so the next visit starts clean */
  useEffect(() => {
    if (shown) return;
    stopDemo();
    clearUser();
    setZoom(null);
    setFlips([]);
  }, [shown, stopDemo, clearUser]);

  /* the automatic demo: opening → 2s fronts → flip 1 (2s on the back) → flip 2 → flip 3 → flip 4 → stop */
  useEffect(() => {
    if (!shown || reduce) return;
    const timers: number[] = [];
    let t = OPEN_MS + STAGGER_MS * (N - 1) + PAUSE_MS;
    for (let i = 0; i < N; i++) {
      timers.push(window.setTimeout(() => setAuto(i), t));
      timers.push(window.setTimeout(() => setAuto(null), t + FLIP_MS + HOLD_MS));
      t += FLIP_MS + HOLD_MS + FLIP_MS + 200; // flip over, hold, flip back, small gap
    }
    demoTimers.current = timers;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [shown, reduce, N]);

  /* where a card sits on screen, and how big it is when it is in front */
  const measure = useCallback((i: number) => {
    const li = listRef.current?.children[i] as HTMLElement | undefined;
    if (!li) return null;
    const r = li.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const h = Math.min(vh * 0.84, (vw * 0.84 * 9) / 4, 800); // card ratio is 4:9
    const w = (h * 4) / 9;
    return { w, h, fx: r.left + r.width / 2 - vw / 2, fy: r.top + r.height / 2 - vh / 2, fs: r.width / w };
  }, []);

  /* double-click: the card comes to the front, then turns to show its back */
  const openZoom = (i: number) => {
    stopDemo();
    clearUser();
    const m = measure(i);
    if (!m) return;
    openedAt.current = Date.now();
    setZoomFlip(flips.includes(i)); // carry on from whatever the first click of the double-click showed
    setFlip(i, false);              // the card in its place goes back to its front, hidden behind the copy
    const z: Zoom = { i, ...m, closing: false };
    zoomRef.current = z;
    setZoom(z);
    userTimers.current.push(window.setTimeout(() => setZoomFlip(true), ZOOM_MS + 150));
  };

  /* click anywhere else / Esc: the card flies back to its place */
  const closeZoom = useCallback(() => {
    const z = zoomRef.current;
    if (!z || z.closing) return;
    clearUser();
    const m = measure(z.i);
    setZoomFlip(false);
    const next: Zoom = m ? { ...z, ...m, closing: true } : { ...z, closing: true };
    zoomRef.current = next;
    setZoom(next);
    userTimers.current.push(
      window.setTimeout(() => {
        zoomRef.current = null;
        setZoom(null);
        window.requestAnimationFrame(() => {
          const btn = listRef.current?.children[z.i]?.querySelector<HTMLElement>(".tm-hit");
          btn?.focus({ preventScroll: true });
        });
      }, CLOSE_MS)
    );
  }, [clearUser, measure]);

  const zoomOpen = zoom !== null;

  useEffect(() => {
    if (!zoomOpen) return;
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomOpen, closeZoom]);

  /* a click on a card in its place */
  const onCard = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    if (zoomRef.current) return;
    const wasFlip = flips.includes(i) || auto === i;
    stopDemo();

    if (e.detail !== 0) {
      const now = Date.now();
      if (lastClick.current.i === i && now - lastClick.current.t < DOUBLE_MS) {
        lastClick.current = { i: -1, t: 0 };
        openZoom(i); // second click in time = double-click / double-tap
        return;
      }
      lastClick.current = { i, t: now };
    }
    setFlip(i, !wasFlip); // single click (or Enter / Space): flip in place, or turn back
  };

  /* a click on the card in front: flip it, as often as you like */
  const onZoomCard = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // the screen behind would close it
    if (zoomRef.current?.closing) return;
    clearUser(); // cancels the automatic turn if it has not happened yet
    setZoomFlip((f) => !f);
  };

  const zp = zoom ? TEAM[zoom.i] : null;

  return (
    <>
      <ul
        ref={listRef}
        className={`tm-list${shown ? " is-in" : ""}`}
        style={{ "--open": `${OPEN_MS}ms`, "--flip": `${FLIP_MS}ms` } as CSSProperties}
        aria-label="Our team. Click a card to flip it and read more, double-click to bring it to the front."
      >
        {TEAM.map((p, i) => {
          const isFlip = flips.includes(i) || auto === i;
          /* cards 1 and 3 open top to bottom, cards 2 and 4 open bottom to top */
          const dir = i % 2 === 0 ? "tm-from-top" : "tm-from-bottom";
          return (
            <li
              key={p.name}
              className={`tm-card ${dir}${isFlip ? " is-flipped" : ""}${zoom?.i === i ? " is-zoomed" : ""}`}
              style={{ "--tint": p.tint, "--d": `${i * STAGGER_MS}ms` } as CSSProperties}
            >
              <CardFaces
                p={p}
                isFlip={isFlip}
                onClick={(e) => onCard(i, e)}
                onDouble={() => {
                  if (!zoomRef.current) openZoom(i);
                }}
              />
            </li>
          );
        })}
      </ul>

      {/* the card in front: drawn on top of the whole page so nothing can clip or cover it */}
      {zoom && zp
        ? createPortal(
            <div
              ref={rootRef}
              className={`tm-zoom-root${zoom.closing ? " is-closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label={`${zp.name}, ${zp.role}`}
              tabIndex={-1}
              onClick={() => {
                if (Date.now() - openedAt.current < DOUBLE_MS) return; // ignore the tail of the double-click
                closeZoom();
              }}
            >
              <div className="tm-backdrop" aria-hidden="true" />
              <div
                className="tm-zoom-card"
                style={
                  {
                    "--zw": `${zoom.w}px`,
                    "--zh": `${zoom.h}px`,
                    "--fx": `${zoom.fx}px`,
                    "--fy": `${zoom.fy}px`,
                    "--fs": zoom.fs,
                  } as CSSProperties
                }
              >
                <div
                  className={`tm-card is-zoom${zoomFlip ? " is-flipped" : ""}`}
                  style={{ "--tint": zp.tint } as CSSProperties}
                >
                  <CardFaces p={zp} isFlip={zoomFlip} onClick={onZoomCard} />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
