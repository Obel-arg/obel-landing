"use client";

import { useEffect, useRef, useState } from "react";
import { Logo3D } from "@/components/ui/Logo3D";
import { NavLink } from "@/components/ui/NavLink";
import { NAV_LINKS, HEADER_SCROLL_THRESHOLD } from "@/lib/constants";

// Hoisted static SVG — avoids re-creation on every render (Rule: rendering-hoist-jsx)
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

export function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  // IntersectionObserver replaces scroll events — no scrollY reads (Rule: never poll scroll position)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Detect when header is over the hero section (dark background)
  useEffect(() => {
    // Find the hero section by its bg-primary class
    const heroSection = document.querySelector("section.bg-primary");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Header is "over hero" when the hero is visible and its top is at or above the viewport top
        const heroRect = entry.boundingClientRect;
        // If the hero bottom is above 0, we've scrolled past it
        setIsOverHero(heroRect.bottom > 64); // 64px = approximate header height
      },
      {
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: "0px",
      }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel element — observed to detect scroll threshold without scroll events */}
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
          ${isScrolled ? "py-4" : "py-8"}
          ${isOverHero ? "bg-transparent text-background" : "bg-background/80 backdrop-blur-md text-foreground"}
        `}
      >
        <div className="px-4 md:px-8 lg:px-16">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Logo3D inverted={isOverHero} />

            {/* Navigation Links - Center */}
            <div className="hidden lg:flex items-center gap-10 xl:gap-16">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Contact CTA - Right */}
            <NavLink href="#contact" className="hidden md:block">
              Contact us
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              aria-label="Open menu"
            >
              {hamburgerIcon}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
