"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { NAV_LINKS, HEADER_SCROLL_THRESHOLD } from "@/lib/constants";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Create scroll trigger for header shrink effect
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: `top -${HEADER_SCROLL_THRESHOLD}px`,
      onUpdate: (self) => {
        // Interpolate padding based on scroll progress
        const padding = gsap.utils.interpolate(32, 16, self.progress);
        header.style.paddingTop = `${padding}px`;
        header.style.paddingBottom = `${padding}px`;
      },
      onEnter: () => setIsScrolled(false),
      onLeave: () => setIsScrolled(true),
      onEnterBack: () => setIsScrolled(false),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === document.body) t.kill();
      });
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-colors duration-300
        ${isScrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"}
      `}
      style={{ paddingTop: 32, paddingBottom: 32 }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

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
          </button>
        </nav>
      </div>
    </header>
  );
}
