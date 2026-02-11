"use client";

import {
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Recursively splits text nodes in React children into character-level spans.
 * Preserves element structure (mark, span, etc.) and handles arrays/fragments.
 * Spaces are kept as plain text (not wrapped).
 */
function splitTextIntoChars(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    // String → split into character spans
    if (typeof child === "string") {
      return child.split("").map((char, i) => {
        if (char === " ") return " ";
        return (
          <span key={i} data-scroll-char="" style={{ display: "inline" }}>
            {char}
          </span>
        );
      });
    }

    // Array/Fragment → recurse
    if (Array.isArray(child)) {
      return splitTextIntoChars(child);
    }

    // React element → recurse into its children
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(
        child,
        {},
        splitTextIntoChars(child.props.children)
      );
    }

    return child;
  });
}

interface ScrollTextRevealProps {
  children: ReactNode;
  className?: string;
}

export function ScrollTextReveal({
  children,
  className,
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const chars = container.querySelectorAll("[data-scroll-char]");
    if (chars.length === 0) return;

    // Viewport check — if already visible, skip animation
    const rect = container.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight * 0.85;

    if (isInViewport) return;

    // Set initial faded state
    gsap.set(chars, { opacity: 0.15 });

    // Dynamic stagger: ~2s of scrub progress regardless of character count
    const staggerEach = Math.max(0.02, 2 / chars.length);

    // Minimum scroll range (300px) prevents abrupt reveals on short text
    const elHeight = rect.height;
    const minRange = 300;
    const end = elHeight > minRange ? "bottom 40%" : `+=${minRange}`;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      end,
      scrub: true,
      animation: gsap.to(chars, {
        opacity: 1,
        ease: "none",
        stagger: { each: staggerEach },
      }),
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  // Reduced motion — render plain children
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      {splitTextIntoChars(children)}
    </div>
  );
}
