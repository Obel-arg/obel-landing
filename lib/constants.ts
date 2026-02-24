// Layout constants
export const HEADER_HEIGHT = 96;
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

// Navigation links
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Hub", href: "#hub" },
  { label: "Projects", href: "#works" },
] as const;
