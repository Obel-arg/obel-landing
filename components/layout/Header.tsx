"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { NAV_LINKS, HEADER_SCROLL_THRESHOLD } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Listen to scroll position changes
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > HEADER_SCROLL_THRESHOLD);
  });

  // Interpolate padding based on scroll
  const paddingY = useTransform(
    scrollY,
    [0, HEADER_SCROLL_THRESHOLD],
    [32, 16]
  );

  return (
    <motion.header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-colors duration-300
        ${isScrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"}
      `}
      style={{ paddingTop: paddingY, paddingBottom: paddingY }}
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
    </motion.header>
  );
}
