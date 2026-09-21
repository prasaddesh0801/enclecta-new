# Enclecta Ventures — website

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · three.js + GSAP hero.

## Getting started

```bash
pnpm install          # or npm install
cp .env.example .env.local
pnpm dev              # http://localhost:3000
```

Build check: `pnpm build` · Types: `pnpm typecheck` · Lint: `pnpm lint`

## Git setup

```bash
git init
git branch -M main
git add .
git commit -m "chore: initialise Next.js foundation, design system and hero"
git remote add origin git@github.com:<org>/enclecta-web.git
git push -u origin main

# working branches
git checkout -b develop
git push -u origin develop
# feature work: git checkout -b feat/home-services develop
```

Suggested flow: `main` (production) ← `develop` (integration) ← `feat/*`, `fix/*`.

## Structure

```
app/
  layout.tsx          root layout: fonts, metadata, header/footer, skip link
  globals.css         design tokens, Tailwind theme, breakpoints, base styles
  page.tsx            homepage
components/
  home/               homepage-only components
    hero.tsx          mounts the WebGL intro + overlay header
    hero-scene.ts     three.js + GSAP choreography (port of the prototype)
  layout/             container, section, header, site-header, footer, logo
  ui/                 button, typography
lib/
  site.ts             nav, contact, social data
  utils.ts            cn() class joiner
public/
  images/ icons/ fonts/ brand/
```

Add a folder per page as the site grows: `components/about/`, `components/services/`, …
Anything used by two or more pages moves to `components/ui/` or `components/layout/`.

## Design system

**Colours and type are defined once, in `app/globals.css`.**

- `:root` holds raw brand values (`--brand-orange`, `--brand-navy-900`, `--base-500`, …)
  plus semantic roles (`--background`, `--foreground`, `--surface`, `--border`).
- `@theme inline` re-exports them to Tailwind, so `bg-brand-orange`,
  `text-foreground-muted`, `border-[color:var(--border)]` all work.
- Typography roles (`--type-heading`, `--type-body`, `--type-button`, …) map onto the
  two `next/font` variables declared in `app/layout.tsx`. Swap `Space_Grotesk` / `Inter`
  there and every heading, button, card and paragraph follows — including the text
  drawn inside the WebGL hero, which reads its font from the DOM.
- The hero animation reads the palette from the same CSS variables at runtime
  (`readPalette()` in `hero-scene.ts`), so a colour change recolours the animation too.

Utility classes `.heading-font`, `.subtitle-font`, `.body-font`, `.button-font`,
`.card-font` are available for one-off overrides.

### Breakpoints

| token | width | target |
| --- | --- | --- |
| `xs` | 360px | small phones |
| `sm` | 640px | large phones |
| `md` | 768px | tablets |
| `lg` | 1024px | laptops |
| `xl` | 1280px | desktops |
| `2xl` | 1536px | large desktops |
| `3xl` | 1920px | ultra-wide |

Container width, gutters and section spacing step up at `md` and `lg` via
`--container-gutter` and `--section-space`, so layout rhythm changes in one place.

## Hero animation

`components/home/hero-scene.ts` is the prototype `enclecta-hero-16.html` ported to a
module: lid opens → hands type the headline → the laptop turns slowly so the lid
wordmark reads → camera pushes into the screen → laptop dissolves and the typed text
flies out to become the page `<h1>`, which then reveals the header.

Notes:
- The `<h1>` is real and readable by screen readers; its text is transparent because
  the visible title is rendered in WebGL at the position the `<h1>` occupies.
- `prefers-reduced-motion` jumps straight to the finished state.
- Resize is handled by both `window.resize` and a `ResizeObserver` on the hero, so
  mobile browser-chrome changes reposition the title correctly.
- `three@0.128.0` is pinned — the scene uses the r128 API.
- If WebGL is unavailable, `hero.tsx` falls back to the plain DOM title.

## Assets

- Images go in `public/images`, rendered with `next/image` (`next.config.ts` sets
  AVIF/WebP and device sizes matching the breakpoints above).
- Icons in `public/icons`, brand files in `public/brand`.
- Self-hosted font files, if you ever move off Google Fonts, in `public/fonts` with
  `next/font/local` in `app/layout.tsx`.
- Remote image hosts must be added to `images.remotePatterns` before use.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_*` reaches the browser; everything else stays on the
server. `lib/site.ts` reads the public ones with sensible fallbacks.
