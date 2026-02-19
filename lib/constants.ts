// Layout constants
export const HEADER_HEIGHT = 96;
export const HEADER_HEIGHT_SCROLLED = 64;
export const HEADER_SCROLL_THRESHOLD = 40;

// Dynamic header height — reads the responsive CSS variable at runtime
export function getComputedHeaderHeight(): number {
  if (typeof window === 'undefined') return HEADER_HEIGHT;
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  ) || HEADER_HEIGHT;
}

// Animation constants
export const ANIMATION_DURATION = 0.6;
export const ANIMATION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // Custom cubic-bezier easing

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Navigation links
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Hub", href: "https://www.obel.la/hub" },
] as const;

// Social links
export const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://twitter.com/obel" },
  { label: "Instagram", href: "https://instagram.com/obel" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/obel-ar/" },
] as const;

// Footer links
export const FOOTER_NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Hub", href: "https://www.obel.la/hub" },
] as const;

// Footer columns (dark footer section)
export const FOOTER_COLUMNS = [
  {
    title: "Channels",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/obel-ar/" },
      { label: "Instagram", href: "https://instagram.com/obel" },
      { label: "X", href: "https://twitter.com/obel" },
    ],
  },
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Works", href: "#works" },
      { label: "Services", href: "#services" },
      { label: "Hub", href: "https://www.obel.la/hub" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Become a Client", href: "#contact" },
      { label: "Careers", href: "#careers" },
      { label: "Press Inquiries", href: "mailto:press@obel.com" },
    ],
  },
] as const;
