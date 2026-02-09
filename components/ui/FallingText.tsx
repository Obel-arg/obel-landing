"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FallingTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function FallingText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.04,
  as: Tag = "div",
}: FallingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Split text into words and letters
  const words = text.split(" ");

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll(".falling-letter");
    if (letters.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(letters, {
        y: "-120%",
        opacity: 0,
        rotateX: -90,
      });

      // Animate letters falling in
      gsap.to(letters, {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: staggerDelay,
        delay: delay,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, delay, staggerDelay]);

  const content = words.map((word, wordIndex) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap">
      {word.split("").map((letter, letterIndex) => (
        <span
          key={`${wordIndex}-${letterIndex}`}
          className="falling-letter inline-block"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {letter}
        </span>
      ))}
      {/* Add space after word (except last word) */}
      {wordIndex < words.length - 1 && (
        <span className="inline-block">&nbsp;</span>
      )}
    </span>
  ));

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      style={{ perspective: "1000px" }}
    >
      <Tag>{content}</Tag>
    </div>
  );
}
