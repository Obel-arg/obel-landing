"use client";

import { startTransition, useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      startTransition(() => {
        setIsScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${isScrolled ? "py-4 bg-background/80 backdrop-blur-md" : "py-8 bg-transparent backdrop-blur-none"}
      `}
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
            {hamburgerIcon}
          </button>
        </nav>
      </div>
    </header>
  );
}
