# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Animation-forward landing page for OBEL, an AI-first digital studio. Built with Next.js 16 App Router, Tailwind CSS 4, and GSAP for scroll-driven animations.

## Commands

```bash
npm run dev             # Development server (localhost:3000)
npm run build           # Production build
npm run lint            # ESLint check
npm run remotion:dev    # Remotion video studio
npm run remotion:render # Render logo animation to WebM
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP + ScrollTrigger (NOT Framer Motion)
- **Smooth Scroll:** Lenis (integrated with GSAP ticker)
- **3D:** three.js + @react-three/fiber
- **Scroll Effects:** @bsmnt/scrollytelling
- **Video:** Remotion (for logo animations)

## Architecture

### Animation System

All animations use GSAP, imported from `@/lib/gsap` which pre-registers ScrollTrigger:

```tsx
import { gsap, ScrollTrigger } from "@/lib/gsap";
```

Lenis smooth scroll is integrated in `components/providers/SmoothScroll.tsx` and synced with GSAP's ticker for frame-perfect scroll animations.

### Route Transitions

- `app/template.tsx` - Wraps all pages with GSAP fade-in animation
- `PixelTransition` + `RouteTransition` - Global transition overlays in layout.tsx
- `TransitionLink` - Use instead of Next.js `Link` for animated page transitions

### Header Theme Attributes

Sections can control header appearance by adding data attributes:

- `data-header-dark` — White text + solid dark background (`bg-primary`) when scrolled over the section
- `data-header-transparent` — White text + fully transparent background (no bg at all). Uses inline styles to guarantee override over Tailwind classes.

The Header component (`components/layout/Header.tsx`) detects these via `document.querySelectorAll` on scroll with rAF throttling.

### Key Constants (`lib/constants.ts`)

- `HEADER_HEIGHT` / `HEADER_HEIGHT_SCROLLED` - Account for sticky header in scroll calculations
- `ANIMATION_DURATION` / `ANIMATION_EASE` - Consistent timing across animations

### Dynamic Routes

- `/projects/[slug]` - Project detail pages, data from `lib/projects.ts`

## Design Reference

- Figma: https://www.figma.com/design/SWO0rKk4VcKU9WJYlpSrRl/OBEL-LANDING-PAGE?node-id=65-433
- Inspiration: basement.studio, hugeinc.com

## Global Theme (CRITICAL)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FFFAF8` | All backgrounds (NO pure white) |
| Primary Dark | `#090E19` | Text, borders (NO pure black) |
| Font Body | Inter | Body text |
| Font Display | Instrument Serif | Headings, navigation |
| Font Pixel | Press Start 2P | Pixel effects |

**Never use `#000000` or `#FFFFFF` anywhere.**

## Animation Guidelines

- Use GSAP with `@/lib/gsap` import (NOT Framer Motion)
- Use `ScrollTrigger` for scroll-driven animations
- All animations must respect `prefers-reduced-motion`
- Use transform and opacity only for performance
- Access Lenis instance via `window.lenis` when needed
- **GSAP xPercent** is relative to the element's `offsetWidth` (NOT total content width). For horizontal carousels, calculate: `totalContentWidth / offsetWidth * 100` to determine the xPercent needed.
- **gsap.fromTo + ScrollTrigger scrub**: Always use `immediateRender: true` to apply `from` values immediately, preventing flash of default position before trigger activates.
- Extract animation range into named variables (`xStart`, `xEnd`, `xRange`) instead of hardcoding — snap formulas and progress calculations must stay in sync.

## React Three Fiber Guidelines

When using `@react-three/postprocessing` (EffectComposer, Glitch, etc.):

**CRITICAL:** Never render `EffectComposer` directly inside `<Canvas>`. The GL context may not be ready, causing "Cannot read properties of null" errors.

Always create a separate component that waits for the GL context:

```tsx
function Effects() {
  const { gl } = useThree();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (gl) setReady(true);
  }, [gl]);

  if (!ready) return null;

  return (
    <EffectComposer>
      {/* effects here */}
    </EffectComposer>
  );
}
```

## Change Policy

**CRITICAL: Only make changes that are explicitly requested.**

- Do NOT change styling, fonts, colors, or sizes unless specifically asked
- Do NOT refactor or "improve" code that wasn't part of the request
- Do NOT add features beyond what was requested
- When modifying existing code, preserve all existing behavior and styling unless instructed otherwise
- If replacing a component (e.g., NavLink → button), copy the exact styling classes from the original

## Git Workflow

- Work on `dev` branch, keep `main` for stable releases
- Only commit when explicitly asked
