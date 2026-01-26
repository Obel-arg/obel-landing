"use client";

import { ReactNode, Children, isValidElement, useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  containerDelay?: number;
  once?: boolean;
  className?: string;
}

export function Stagger({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  once = true,
  className,
}: StaggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const items = container.querySelectorAll(".stagger-item");
    if (items.length === 0) return;

    // Set initial state
    gsap.set(items, {
      opacity: 0,
      y: 20,
    });

    // Create scroll trigger for staggered animation
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: staggerDelay,
          delay: containerDelay,
          ease: "power3.out",
        });
      },
      onLeaveBack: once
        ? undefined
        : () => {
            gsap.to(items, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              stagger: staggerDelay * 0.5,
              ease: "power3.in",
            });
          },
      once,
    });

    return () => {
      trigger.kill();
    };
  }, [staggerDelay, containerDelay, once, prefersReducedMotion]);

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        return <div className="stagger-item">{child}</div>;
      })}
    </div>
  );
}

// Alternative: StaggerItem for more control
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return <div className={`stagger-item ${className || ""}`}>{children}</div>;
}
