"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

interface PerspectiveTransitionProps {
  section1: ReactNode;
  section2: ReactNode;
}

/**
 * Perspective section transition — replicates the scroll-driven 3D illusion
 * from olivierlarose/perspective-section-transition.
 *
 * Section 1 / Hero (sticky) shrinks + tilts backward as Section 2 / About
 * scrolls up over it, growing + straightening. The wrapper bg peeks through
 * as a depth cue.
 */
export function PerspectiveTransition({
  section1,
  section2,
}: PerspectiveTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  // Detect when dynamically imported About section has mounted (Hero is static, always present)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const check = () => {
      const hasAbout = container.querySelector('[data-section="about"]');
      if (hasAbout) {
        setReady(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    const observer = new MutationObserver(() => {
      if (check()) observer.disconnect();
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion) return;

      const container = containerRef.current;
      const section1El = section1Ref.current;
      const section2El = section2Ref.current;
      if (!container || !section1El || !section2El) return;

      // Scroll distance for the full transition = one viewport height
      const scrollDistance = () => window.innerHeight;

      // Section 1 (Hero): scale 1 → 0.8, rotate 0° → −5°
      gsap.to(section1El, {
        scale: 0.8,
        rotation: -5,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: true,
        },
      });

      // Section 2 (About): scale 0.8 → 1, rotate 5° → 0°
      gsap.fromTo(
        section2El,
        { scale: 0.8, rotation: 5 },
        {
          scale: 1,
          rotation: 0,
          immediateRender: true,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollDistance()}`,
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [ready, prefersReducedMotion] }
  );

  // Reduced motion: render children without perspective effect
  if (prefersReducedMotion) {
    return (
      <>
        {section1}
        {section2}
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ backgroundColor: "#FFFAF8" }}
    >
      {/* Section 1 (Hero): sticky, scales down + rotates backward on scroll */}
      <div
        ref={section1Ref}
        className="sticky top-0 z-[1] bg-background"
        style={{ height: "100dvh", overflow: "hidden" }}
      >
        {section1}
      </div>

      {/* Section 2 (About): scrolls up over Hero, grows + straightens */}
      <div ref={section2Ref} className="relative z-[2] bg-background">
        {section2}
      </div>
    </div>
  );
}
