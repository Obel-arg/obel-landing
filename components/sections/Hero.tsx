"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { FluidCanvas } from "@/components/ui/FluidCanvas";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Hoisted static SVG — avoids re-creation on every render (Rule: rendering-hoist-jsx)
const scrollIndicatorSvg = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-60"
  >
    <path
      d="M12 5V19M12 19L5 12M12 19L19 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // GSAP intro timeline
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: -10,
      });

      // Animate scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 1,
      });

      // Continuous bounce animation for scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* z-0: Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-foreground/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
      </div>

      {/* z-10: Fluid Canvas cursor effect */}
      <FluidCanvas
        className="absolute inset-0 z-10"
        enabled={!prefersReducedMotion}
      />

      {/* z-20: Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        {scrollIndicatorSvg}
      </div>
    </section>
  );
}
