"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo3D } from "@/components/ui/Logo3D";
import { NavLink } from "@/components/ui/NavLink";
import { NAV_LINKS, HEADER_SCROLL_THRESHOLD } from "@/lib/constants";

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

  // Check if header overlaps any dark section
  const checkOverlap = () => {
    const darkSections = document.querySelectorAll("[data-header-dark]");
    const headerH = getHeaderHeight();

    for (const section of darkSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top < headerH && rect.bottom > 0) {
        return true;
      }
    }
    return false;
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
      setIsOverDark(checkOverlap());
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    // Initial check (delayed to handle scroll restoration and page transition)
    const initialCheck = () => {
      setIsOverDark(checkOverlap());
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
          ${isScrolled ? "py-3 xl:py-[clamp(0.75rem,0.93vw,1rem)]" : "py-6 xl:py-[clamp(1.5rem,1.85vw,2rem)]"}
          ${isOverDark ? "bg-primary text-background" : "bg-background/80 backdrop-blur-md text-foreground"}
        `}
      >
        <div className="px-4 md:px-8 lg:px-16">
          <nav className="flex items-center justify-between">
            <Logo3D inverted={isOverDark} />

            <div className="hidden lg:flex items-center gap-10 xl:gap-16">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => window.contactModal?.open()}
              className="hidden md:block font-sans text-base md:text-lg tracking-tight font-medium hover:opacity-60 transition-opacity duration-300 cursor-pointer"
            >
              Contact us
            </button>

            <button className="lg:hidden p-2" aria-label="Open menu">
              {hamburgerIcon}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
