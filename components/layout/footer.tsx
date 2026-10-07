"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./container";
import Button from "@/components/ui/button";
import { Subtitle } from "@/components/ui/typography";
import { siteConfig, socialLinks } from "@/lib/site";
import "./footer.css";

/* =========================================================
   EDIT HERE
   ========================================================= */

/* CTA — reads as:  "Your idea. Our ____."  */
const LEAD = "Your idea.";
const TRAIL = "Our";
const WORDS = ["design", "code", "craft", "care"];
const WORD_MS = 2600;

/* Footer columns (change the hrefs to your real routes) */
const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/#services" },
      { label: "Portfolio", href: "/#portfolio" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Web Development", href: "/#services" },
      { label: "UI/UX Design", href: "/#services" },
      { label: "Mobile App Development", href: "/#services" },
      { label: "E-commerce Solutions", href: "/#services" },
      { label: "SEO & Digital Marketing", href: "/#services" },
      { label: "Support & Maintenance", href: "/#services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Tech Stack", href: "/tech-stack" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

/* =========================================================
   SMALL PIECES
   ========================================================= */

function CyclingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % WORDS.length);
    }, WORD_MS);
    return () => window.clearInterval(id);
  }, []);

  const n = WORDS.length;
  return (
    <>
      <span className="sr-only">{WORDS.join(", ")}.</span>
      <span aria-hidden="true" className="enc-cta-word">
        {WORDS.map((w, idx) => {
          const rel = (idx - i + n) % n;
          const state = rel === 0 ? "now" : rel === n - 1 ? "out" : "next";
          return (
            <span key={w} data-state={state} className="enc-cta-word-item">
              {w}.
            </span>
          );
        })}
      </span>
    </>
  );
}

function Shapes() {
  return (
    <div aria-hidden="true" className="enc-shapes">
      <span className="enc-shape enc-shape-cube" style={{ animationDelay: "-1s" }} />
      <span className="enc-shape enc-shape-orb enc-shape-orb-a" style={{ animationDelay: "-3s" }} />
      <span className="enc-shape enc-shape-orb enc-shape-orb-b" style={{ animationDelay: "-2s" }} />
      <svg viewBox="0 0 64 64" className="enc-shape enc-shape-plane" style={{ animationDelay: "-4s" }}>
        <path d="M6 30L58 8 44 56 31 38 6 30z" fill="currentColor" />
        <path d="M31 38L58 8 26 33z" fill="currentColor" opacity="0.55" />
      </svg>
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 40" className="enc-logo-mark" fill="none" aria-hidden="true">
      <path d="M12 8L3 20l9 12" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 8l9 12-9 12" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27.5 4L20.5 36" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- social icons ---------- */

const socials: { key: string; label: string; fallback: string; icon: React.ReactNode }[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    fallback: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X",
    fallback: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    fallback: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    fallback: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    fallback: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.921.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

/* ---------- illustrations (pure SVG) ---------- */

function TopWaves() {
  return (
    <svg
      className="enc-waves"
      viewBox="0 0 1590 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="encWavePurple" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--f-wave-purple)" />
          <stop offset="1" stopColor="var(--f-wave-purple)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="encWavePeach" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--f-wave-peach)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--f-wave-peach)" />
        </linearGradient>
      </defs>
      <g transform="translate(0 22)">
        {/* lavender ribbon — thick on the left, tapers to a point in the middle */}
        <path
          d="M0 75C50 56 100 42 160 42C260 42 340 70 430 96C500 116 570 120 640 110C700 101 770 96 830 106C850 110 862 113 872 116C800 108 740 112 700 122C650 135 600 152 540 162C480 172 400 158 340 145C270 130 210 126 150 132C90 138 40 155 0 176Z"
          fill="url(#encWavePurple)"
        />
        {/* peach ribbon — starts at that point and swells to the right */}
        <path
          d="M862 113C920 128 990 146 1080 150C1170 154 1250 132 1340 108C1420 86 1500 62 1590 66V178C1520 148 1450 138 1380 148C1300 158 1220 174 1130 172C1020 170 940 140 862 113Z"
          fill="url(#encWavePeach)"
        />
      </g>
    </svg>
  );
}

function Ground() {
  return (
    <svg
      className="enc-ground"
      viewBox="0 0 1440 130"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="encGround" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--f-hill-green)" />
          <stop offset="0.3" stopColor="var(--f-wave-purple)" />
          <stop offset="0.72" stopColor="var(--f-wave-purple)" />
          <stop offset="1" stopColor="var(--f-wave-peach)" />
        </linearGradient>
      </defs>
      {/* soft lavender swell across the middle */}
      <path
        d="M0 104C200 98 330 76 520 64C700 54 800 78 940 84C1100 92 1250 66 1440 54V130H0Z"
        fill="url(#encGround)"
        opacity="0.7"
      />
      {/* faint peach glow behind the rock */}
      <path
        d="M760 130C900 96 1100 78 1440 90V130Z"
        fill="var(--f-wave-peach)"
        opacity="0.55"
      />
    </svg>
  );
}

/* a single pointed leaf with a mid-rib; base sits at 0,0 and grows upward */
function Blade({
  transform,
  color,
  shade = "rgba(15, 30, 60, 0.09)",
}: {
  transform: string;
  color: string;
  shade?: string;
}) {
  return (
    <g transform={transform}>
      <path d="M0 0C-17 -28 -19 -72 0 -104C19 -72 17 -28 0 0Z" fill={color} />
      <path d="M0 0C3 -30 3 -70 0 -104C19 -72 17 -28 0 0Z" fill={shade} />
      <path d="M0 -2L0 -90" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" fill="none" />
    </g>
  );
}

function LeftScenery() {
  return (
    <svg className="enc-hill-left" viewBox="0 60 780 190" aria-hidden="true">
      {/* far, very faint mountains */}
      <path
        d="M0 250V72C90 78 200 100 300 130C420 165 560 215 700 250Z"
        fill="var(--f-hill-green)"
        opacity="0.4"
      />
      <path
        d="M170 250C225 150 330 102 430 120C520 138 620 200 780 250Z"
        fill="var(--f-hill-green)"
        opacity="0.5"
      />
      {/* low mid-green hump */}
      <path
        d="M290 250C380 208 470 196 560 204C620 210 690 234 720 250Z"
        fill="var(--f-hill-green-2)"
        opacity="0.75"
      />
      {/* main green hill in the corner */}
      <path
        d="M0 250V147C70 140 150 160 210 195C270 228 350 246 430 250Z"
        fill="var(--f-hill-green-2)"
      />

      {/* leaves sitting on the hill */}
      <Blade transform="translate(140 168) rotate(-24) scale(0.4)" color="#f2b27a" shade="rgba(190,90,20,0.12)" />
      <Blade transform="translate(150 170) rotate(-72) scale(0.34)" color="#f5c08f" shade="rgba(190,90,20,0.1)" />
      <Blade transform="translate(178 170) rotate(-24) scale(0.62)" color="#86ccb9" />
      <Blade transform="translate(180 170) rotate(26) scale(0.86)" color="#5fb4a0" />
      <Blade transform="translate(180 172) rotate(80) scale(0.72)" color="#5fb4a0" />
      <Blade transform="translate(184 174) rotate(112) scale(0.42)" color="#3f9c88" />
      <Blade transform="translate(258 208) rotate(2) scale(0.42)" color="#f2b27a" shade="rgba(190,90,20,0.12)" />
      <Blade transform="translate(258 210) rotate(46) scale(0.76)" color="#f0a95f" shade="rgba(190,90,20,0.14)" />
      <Blade transform="translate(258 212) rotate(80) scale(0.7)" color="#f3a460" shade="rgba(190,90,20,0.14)" />
    </svg>
  );
}

function Developer() {
  return (
    <svg className="enc-developer" viewBox="100 70 1110 660" aria-hidden="true">
      {/* clouds */}
      <g fill="var(--f-cloud)">
        <path d="M148 262C160 248 200 246 235 240C240 200 275 165 315 165C350 165 375 190 380 215C400 210 430 225 435 245C445 250 455 258 455 263Z" />
        <path d="M1015 123C1030 110 1050 108 1060 108C1065 92 1090 84 1105 92C1115 96 1120 102 1122 108C1135 112 1143 118 1145 124Z" />
      </g>

      {/* floating code card */}
      <g>
        <rect x="912" y="155" width="240" height="185" rx="20" fill="var(--f-card)" stroke="var(--f-border)" strokeWidth="2" />
        <rect x="937" y="182" width="76" height="10" rx="5" fill="#9edfe0" />
        <rect x="940" y="207" width="42" height="10" rx="5" fill="#4a5cf0" />
        <rect x="992" y="207" width="120" height="10" rx="5" fill="#4a5cf0" opacity="0.28" />
        <rect x="992" y="207" width="60" height="10" rx="5" fill="#4a5cf0" />
        <rect x="960" y="232" width="96" height="10" rx="5" fill="#eba86e" />
        <rect x="940" y="252" width="76" height="10" rx="5" fill="#cdd6b8" />
        <rect x="940" y="270" width="44" height="10" rx="5" fill="#e0915a" />
        <rect x="993" y="270" width="120" height="10" rx="5" fill="#9aa4e6" opacity="0.35" />
        <rect x="940" y="292" width="66" height="10" rx="5" fill="#5f7fb0" />
        <rect x="1006" y="292" width="24" height="10" rx="5" fill="#9edfe0" opacity="0.7" />
      </g>

      {/* leaves BEHIND the rock */}
      <Blade transform="translate(315 590) rotate(-12) scale(1.35)" color="#5fb4a0" />
      <Blade transform="translate(330 592) rotate(28) scale(1.1)" color="#86ccb9" />
      <Blade transform="translate(304 594) rotate(-52) scale(0.9)" color="#4aa08c" />
      <Blade transform="translate(388 552) rotate(58) scale(0.5)" color="#f6c58f" shade="rgba(190,90,20,0.1)" />
      <Blade transform="translate(1012 552) rotate(-8) scale(1.15)" color="#f0b57f" shade="rgba(190,90,20,0.12)" />
      <Blade transform="translate(1030 560) rotate(24) scale(0.9)" color="#f3c091" shade="rgba(190,90,20,0.1)" />
      <Blade transform="translate(990 562) rotate(-26) scale(0.8)" color="#f2b98a" shade="rgba(190,90,20,0.1)" />

      {/* rock */}
      <path
        d="M105 725C150 690 230 640 310 598C390 558 470 545 560 532C680 512 880 506 985 524C1035 540 1058 610 1092 725Z"
        fill="var(--f-rock)"
      />
      <path
        d="M470 548C560 530 700 512 830 512C900 512 960 516 990 526C930 548 780 556 660 552C590 550 520 560 470 548Z"
        fill="var(--f-rock-hi)"
      />
      <path
        d="M330 700C400 630 470 596 560 580C650 570 700 590 760 645C700 665 600 695 520 725L330 725Z"
        fill="var(--f-rock-2)"
        opacity="0.4"
      />
      <path d="M170 705C230 668 300 642 380 622C330 662 290 700 260 725L150 725Z" fill="#fff" opacity="0.3" />

      {/* backpack (resting against his back) */}
      <g>
        <path d="M848 382C850 352 888 352 890 382" stroke="#2a3670" strokeWidth="9" fill="none" strokeLinecap="round" />
        <rect x="812" y="378" width="142" height="160" rx="34" fill="#1f2a55" />
        <rect x="822" y="470" width="124" height="62" rx="18" fill="#2a3670" />
        <rect x="806" y="474" width="26" height="54" rx="10" fill="#26315f" />
        <path d="M816 476C795 500 790 522 812 534" stroke="#1a2348" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* </> */}
        <g stroke="#f0781f" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M873 414L861 427L873 440" />
          <path d="M895 410L888 444" />
          <path d="M910 414L922 427L910 440" />
        </g>
      </g>

      {/* legs */}
      <path
        d="M430 438C520 428 660 432 730 440C775 446 792 482 782 516C720 526 630 514 570 520C540 524 500 560 468 640L385 612C382 540 395 478 430 438Z"
        fill="#232d5c"
      />
      <path d="M560 522C520 530 490 570 470 638L456 632C476 572 510 536 560 522Z" fill="#1b2450" opacity="0.6" />
      {/* cuffs + ankles */}
      <path d="M383 606L470 636L466 652L379 622Z" fill="#2e3a72" />
      <path d="M392 624L420 636L416 662C400 664 392 650 392 640Z" fill="#f0c9b1" />
      <path d="M436 640L462 648L456 670C440 672 434 660 436 650Z" fill="#f0c9b1" />

      {/* sneakers */}
      <g>
        <path d="M345 706C345 684 368 672 396 672C420 670 444 676 470 686C490 692 492 706 484 714L354 716C348 714 345 710 345 706Z" fill="#fff" />
        <path d="M342 708L488 708C492 716 488 722 478 722L352 722C342 722 338 714 342 708Z" fill="#3d4bd8" />
        <path d="M396 678l14 14M408 675l14 14M420 674l12 12" stroke="#c4cbe8" strokeWidth="3" strokeLinecap="round" />
        <path d="M440 690C452 684 466 690 466 700" stroke="#b8c2e6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g>
        <path d="M290 700C288 678 312 664 340 664C364 662 388 668 412 678C432 684 434 700 426 708L300 710C293 708 290 704 290 700Z" fill="#f7f8ff" />
        <path d="M287 702L430 702C434 710 430 716 420 716L296 716C286 716 283 708 287 702Z" fill="#3d4bd8" />
        <path d="M336 670l14 14M348 667l14 14M360 666l12 12" stroke="#e0a76b" strokeWidth="3" strokeLinecap="round" />
        <path d="M384 682C396 676 410 682 410 692" stroke="#b8c2e6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* torso / hoodie */}
      <path
        d="M648 300C655 262 690 238 738 232C792 228 822 268 824 332C826 400 816 452 796 500C770 506 730 500 704 490C690 470 700 440 690 412C672 388 644 352 648 300Z"
        fill="#3f4ef2"
      />
      <path d="M770 240C806 258 822 300 824 340C826 410 816 456 796 500L770 498C796 440 800 340 770 240Z" fill="#2f3fd6" opacity="0.5" />
      {/* hood */}
      <path d="M690 246C692 218 730 200 768 203C800 208 812 235 812 262C812 290 800 300 790 300C770 270 730 260 690 246Z" fill="#4a59f5" />
      <path d="M690 246C700 222 735 208 770 208C755 214 740 224 738 246Z" fill="#2c3bcc" />
      {/* neck + collar */}
      <path d="M672 220L704 226L708 254L688 250Z" fill="#efc9b0" />
      <path d="M686 240L702 268L716 236Z" fill="#f7f7fc" />
      {/* drawstrings */}
      <path d="M679 274V304M707 274V302" stroke="#e8ecff" strokeWidth="3" strokeLinecap="round" />

      {/* laptop */}
      <path d="M392 320L520 332L548 432L418 418Z" fill="#7f8bb5" />
      <path d="M404 334L512 344L536 424L428 412Z" fill="#9aa5cc" />
      <g stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
        <path d="M450 366L441 376L450 386" />
        <path d="M484 368L493 378L484 388" />
        <path d="M472 364L463 390" />
      </g>
      <path d="M548 420L662 424L664 436L548 434Z" fill="#2c3562" />

      {/* arm + hands typing */}
      <path d="M735 305C762 350 762 388 728 402L650 402" fill="none" stroke="#2f3fd6" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M728 300C754 346 754 384 722 396L650 398" fill="none" stroke="#3f4ef2" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="626" cy="404" rx="32" ry="13" fill="#f4d3bd" transform="rotate(-4 626 404)" />
      <ellipse cx="584" cy="398" rx="30" ry="13" fill="#f6dcc8" transform="rotate(-8 584 398)" />
      <path d="M560 396l-10 4M566 402l-10 4" stroke="#e8bfa6" strokeWidth="2" strokeLinecap="round" />

      {/* head (faceless, looking down-left at the screen) */}
      <ellipse cx="712" cy="186" rx="9" ry="13" fill="#edc8b3" />
      <ellipse cx="676" cy="190" rx="37" ry="46" fill="#f6dfd0" transform="rotate(-6 676 190)" />
      <path d="M606 150C602 125 628 106 662 112C684 100 722 106 738 134C748 158 736 186 718 202C722 178 712 162 696 158C672 154 648 158 632 172C630 162 626 156 606 150Z" fill="#1c2450" />
      <path d="M606 150C598 140 604 128 618 126C612 134 612 142 618 150Z" fill="#1c2450" />

      {/* leaves IN FRONT of the rock (right) */}
      <Blade transform="translate(1075 704) rotate(8) scale(2.6)" color="#5fb4a0" />
      <Blade transform="translate(1075 706) rotate(40) scale(2.1)" color="#86ccb9" />
      <Blade transform="translate(1020 722) rotate(-8) scale(1.7)" color="#5fb4a0" />
      <Blade transform="translate(1004 726) rotate(-42) scale(1.4)" color="#4aa08c" />
      <Blade transform="translate(1130 726) rotate(64) scale(1.9)" color="#3f9c88" />
      {/* orange leaves at the left toe of the rock */}
      <Blade transform="translate(170 716) rotate(-78) scale(1.3)" color="#f2b27a" shade="rgba(190,90,20,0.12)" />
      <Blade transform="translate(170 716) rotate(-52) scale(1.1)" color="#f5c08f" shade="rgba(190,90,20,0.1)" />
      <Blade transform="translate(190 720) rotate(-14) scale(0.9)" color="#f0a95f" shade="rgba(190,90,20,0.12)" />
      <Blade transform="translate(184 704) rotate(-4) scale(1.2)" color="#f0b57f" shade="rgba(190,90,20,0.12)" />
    </svg>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

export default function Footer() {
  const year = new Date().getFullYear();
  /* on /contact the CTA scrolls to the form instead of reloading the same page */
  const onContact = usePathname() === "/contact";

  const hrefFor = (key: string, fallback: string) =>
    socialLinks.find((s) => s.label.toLowerCase() === key)?.href ?? fallback;

  return (
    <footer className="enc-footer">
      {/* ================= CTA (over the wave) ================= */}
      <section id="start" className="enc-footer-top">
        <TopWaves />
        <Shapes />

        <div className="enc-cta-inner">
          <h2 className="heading-font enc-cta-title">
            <span className="enc-cta-line">{LEAD}</span>
            <span className="enc-cta-line">
              {TRAIL} <CyclingWord />
            </span>
          </h2>

          <Subtitle className="mx-auto mt-4 max-w-[32rem] enc-cta-subtitle">
            <span className="enc-cta-subtitle-line">Tell us what you&rsquo;re dreaming up. We&rsquo;ll help you</span>
            <span className="enc-cta-subtitle-line">design it, build it and launch it.</span>
          </Subtitle>

          <div className="enc-cta-buttons">
            <Button href={onContact ? "#contact-form" : "/contact"} size="lg" variant="neon">
              Start a project
            </Button>
            <Button href="#portfolio" size="lg" variant="hero-outline">
              See our work
            </Button>
          </div>
        </div>
      </section>

      {/* ================= MAIN FOOTER ================= */}
      <div className="enc-footer-lower">
        <Container width="wide" className="enc-footer-main">
          <div className="enc-footer-content">
            {/* BRAND */}
            <div className="enc-footer-brand">
              <Link href="/" className="enc-footer-logo" aria-label="Enclecta home">
                <LogoMark />
                <span className="heading-font">Enclecta</span>
              </Link>

              <p className="enc-footer-tagline">
                Turning your ideas into powerful digital experiences.
              </p>
              <p className="enc-footer-about">
                We build modern websites, web apps and digital solutions that help
                businesses grow and succeed online.
              </p>

              <div className="enc-footer-socials">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={hrefFor(s.key, s.fallback)}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* LINK COLUMNS */}
            {columns.map((group) => (
              <nav key={group.title} className="enc-footer-column" aria-label={group.title}>
                <h3 className="heading-font">{group.title}</h3>
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}

            {/* NEWSLETTER */}
            <div className="enc-footer-connect">
              <h3 className="heading-font">Stay Connected</h3>
              <p>Get the latest updates, tech insights and offers straight to your inbox.</p>

              <form className="enc-footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                <span className="enc-footer-mail">
                  <MailIcon />
                </span>
                <input type="email" placeholder="Your email address" aria-label="Your email address" />
                <button type="submit">Subscribe</button>
              </form>

              <div className="enc-footer-reach">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}>{siteConfig.phone}</a>
                <Link href="/contact">Send us a message</Link>
              </div>
            </div>
          </div>
        </Container>

        {/* SCENERY (full-bleed) */}
        <div className="enc-footer-scene" aria-hidden="true">
          <Ground />
          <LeftScenery />
          <Developer />
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="enc-footer-bar">
        <Container width="wide" className="enc-footer-bar-inner">
          <p>© {year} Enclecta. All rights reserved.</p>

          <div className="enc-footer-flow">
            <span>Ideas</span>
            <ArrowIcon />
            <span>Code</span>
            <ArrowIcon />
            <span>Your Success</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
