# OBEL Landing Page - Project Instructions

## Overview
Animation-forward landing page for OBEL, an AI-first digital studio, using Next.js App Router + Tailwind CSS + Framer Motion.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Fonts:** Instrument Serif + Inter (Google Fonts)

## Design Reference
- Figma: https://www.figma.com/design/SWO0rKk4VcKU9WJYlpSrRl/OBEL-LANDING-PAGE?node-id=65-433
- Inspiration: basement.studio, hugeinc.com

---

## Global Theme (IMPORTANT)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FFFAF8` | Site background, section backgrounds (NO pure white) |
| Primary Dark | `#090E19` | Text, borders, hover states (NO pure black #000) |
| Font Body | Inter | Body text, descriptions |
| Font Display | Instrument Serif | Navigation, headings |

**CRITICAL:** Never use `#000000` or `#FFFFFF` anywhere in the codebase.

---

## Code Standards

### Component Structure
- Keep components reusable with single responsibility
- Separate layout, sections, motion, and UI components
- Use TypeScript for all components
- Export with named exports

### Animations
- All animations must respect `prefers-reduced-motion`
- Use transform and opacity only (performance)
- Use Framer Motion's `whileInView` for scroll reveals
- Keep animations subtle and purposeful

### Styling
- Use Tailwind utility classes
- Custom values go in `tailwind.config.ts`
- No inline styles unless absolutely necessary
- Use CSS variables for dynamic values (spotlight effects)

---

## Key Implementation Notes

### Header
- Always sticky (`position: sticky`, `top: 0`, `z-index: 50`)
- Shrink on scroll (after ~20-40px): reduce padding and font size
- Backdrop blur with semi-transparent background when scrolled

### About Section (Spotlight)
- Pattern background with cursor-following spotlight
- Use `requestAnimationFrame` + refs for performance (no re-renders on mouse move)
- `mask-image: radial-gradient()` technique
- Logos inside spotlight: full color; outside: muted/grayscale

### Trusted By Marquee
- Auto-sliding continuous loop (duplicate logos for seamless)
- Slow down on hover (but keep moving)
- Stop completely with `prefers-reduced-motion`

### Featured Projects (Stacking)
- Sticky title that stays while scrolling through cards
- Cards stack on top of each other (basement.studio style)
- Account for `HEADER_OFFSET` on sticky elements

### Services (Horizontal Scroll)
- Vertical scroll drives horizontal movement
- Pinned/sticky container with scroll-mapped translateX
- No wheel hijacking - natural scroll continues after last panel
- Mobile: vertical stack fallback

### Footer
- Final "obel" screen fills `100svh`
- No extra bottom spacing - this is the end of document

---

## Git Workflow

**IMPORTANT:**
- Only commit changes when the user explicitly asks. Never commit automatically or proactively.
- Work on the `dev` branch, not `main`. Keep `main` for stable releases only.

```bash
git status                    # Check for changes
git add .                     # Stage all changes
git commit -m "message"       # Commit with message
git push -u origin dev        # Push dev branch to GitHub
git checkout main && git merge dev  # Merge to main when ready for release
```

---

## Verification Commands
```bash
npm run dev     # Start development server
npm run build   # Production build
npm run lint    # Lint check
```

---

## File Structure
```
obel-landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/        # Header, Footer
│   ├── sections/      # Hero, About, FeaturedProjects, Services, Contact
│   ├── motion/        # Reveal, Stagger, variants, useReducedMotion
│   └── ui/            # Logo, LogoMarquee, NavLink, SpotlightPattern
├── lib/
│   ├── constants.ts
│   └── fonts.ts
└── public/
    ├── videos/
    └── images/
```
