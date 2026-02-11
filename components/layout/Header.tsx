"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Logo3D } from "@/components/ui/Logo3D";
import { NavLink } from "@/components/ui/NavLink";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NAV_LINKS, HEADER_SCROLL_THRESHOLD } from "@/lib/constants";

// Scale header proportionally on wide screens (baseline: 1920px)
function useHeaderScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(Math.max(1, window.innerWidth / 1920));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

// Extend Window interface for contactModal
declare global {
  interface Window {
    contactModal?: {
      open: () => void;
      close: () => void;
    };
  }
}

const hamburgerIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12H21M3 6H21M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getHeaderHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;

export function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const [isOverTransparent, setIsOverTransparent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scale = useHeaderScale();

  // Check if header overlaps any dark or transparent section
  const checkOverlap = (): { dark: boolean; transparent: boolean } => {
    const headerH = getHeaderHeight();
    let dark = false;
    let transparent = false;

    const darkSections = document.querySelectorAll("[data-header-dark]");
    for (const section of darkSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top < headerH && rect.bottom > 0) {
        dark = true;
        break;
      }
    }

    const transparentSections = document.querySelectorAll("[data-header-transparent]");
    for (const section of transparentSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top < headerH && rect.bottom > 0) {
        transparent = true;
        break;
      }
    }

    return { dark, transparent };
  };

  // Scroll detection
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Dark section detection - using scroll event with rAF throttle
  // Re-runs when pathname changes to handle route navigation
  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const result = checkOverlap();
      setIsOverDark(result.dark);
      setIsOverTransparent(result.transparent);
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    // Initial check (delayed to handle scroll restoration and page transition)
    const initialCheck = () => {
      const result = checkOverlap();
      setIsOverDark(result.dark);
      setIsOverTransparent(result.transparent);
    };

    // Run immediately and after delays for scroll restoration / page transitions
    initialCheck();
    const timeoutId1 = setTimeout(initialCheck, 50);
    const timeoutId2 = setTimeout(initialCheck, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={sentinelRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: HEADER_SCROLL_THRESHOLD }}
        aria-hidden
      />
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-out
          ${isScrolled ? "py-3" : "py-8 md:py-6"}
          ${isOverDark || isOverTransparent ? "text-background" : "text-foreground"}
          ${isOverTransparent ? "" : isScrolled ? (isOverDark ? "bg-primary" : "bg-background/80 backdrop-blur-md") : ""}
        `}
        style={{
          ...(scale > 1 ? { padding: `${(isScrolled ? 12 : 24) * scale}px 0` } : {}),
          ...(isOverTransparent ? { backgroundColor: 'transparent', backdropFilter: 'none' } : {}),
        }}
      >
        <div
          className="px-4 md:px-8 lg:px-16"
          style={scale > 1 ? { padding: `0 ${64 * scale}px` } : undefined}
        >
          <nav
            className="flex items-center justify-between"
            style={{ gap: `${40 * scale}px`, fontSize: `${18 * scale}px` }}
          >
            <Logo3D inverted={isOverDark || isOverTransparent} />

            <div
              className="hidden lg:flex items-center"
              style={{ gap: `${64 * scale}px` }}
            >
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} scale={scale}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => window.contactModal?.open()}
              className="hidden lg:block font-sans tracking-tight font-medium hover:opacity-60 transition-opacity duration-300 cursor-pointer"
              style={{ fontSize: `${18 * scale}px` }}
            >
              Contact us
            </button>

            <button
              className="lg:hidden p-2 cursor-pointer"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              {hamburgerIcon}
            </button>
          </nav>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
