"use client";

import { ReactNode, useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ClipRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

// Get clip-path values based on direction
// The element starts "clipped" (hidden) and reveals in the specified direction
const getClipPaths = (direction: ClipRevealProps["direction"]) => {
  const clipPaths = {
    up: {
      from: "inset(100% 0% 0% 0%)", // Hidden from bottom
      to: "inset(0% 0% 0% 0%)", // Fully visible
    },
    down: {
      from: "inset(0% 0% 100% 0%)", // Hidden from top
      to: "inset(0% 0% 0% 0%)",
    },
    left: {
      from: "inset(0% 0% 0% 100%)", // Hidden from right
      to: "inset(0% 0% 0% 0%)",
    },
    right: {
      from: "inset(0% 100% 0% 0%)", // Hidden from left
      to: "inset(0% 0% 0% 0%)",
    },
  };
  return direction ? clipPaths[direction] : clipPaths.up;
};

export function ClipReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1,
  once = true,
  className,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const clips = getClipPaths(direction);

    // Set initial clipped state
    gsap.set(el, { clipPath: clips.from });

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          clipPath: clips.to,
          duration,
          delay,
          ease: "power3.out",
        });
      },
      onLeaveBack: once
        ? undefined
        : () => {
            gsap.to(el, {
              clipPath: clips.from,
              duration: duration * 0.5,
              ease: "power3.in",
            });
          },
      once,
    });

    return () => {
      trigger.kill();
    };
  }, [direction, delay, duration, once, prefersReducedMotion]);

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      {children}
    </div>
  );
}
