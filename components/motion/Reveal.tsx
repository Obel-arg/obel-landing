"use client";

import { ReactNode, useRef, useLayoutEffect, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { ANIMATION_DURATION } from "@/lib/constants";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const getOffsets = (direction: RevealProps["direction"]) => {
  const offset = 30;
  const offsets = {
    up: { y: offset, x: 0 },
    down: { y: -offset, x: 0 },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
  };
  return direction ? offsets[direction] : offsets.up;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = ANIMATION_DURATION,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const offsets = getOffsets(direction);

    // Set initial state
    gsap.set(el, {
      opacity: 0,
      ...offsets,
    });

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
        });
      },
      onLeaveBack: once
        ? undefined
        : () => {
            gsap.to(el, {
              opacity: 0,
              ...offsets,
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
