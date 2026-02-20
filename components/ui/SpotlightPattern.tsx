"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface SpotlightPatternProps {
  className?: string;
  children?: React.ReactNode;
}

export function SpotlightPattern({ className = "", children }: SpotlightPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Target position for smooth interpolation
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  // Cached rect — measured once on mouseenter, reused during mousemove (Rule: measure once, then animate)
  const cachedRect = useRef<DOMRect | null>(null);

  const updateSpotlight = useCallback(() => {
    if (!spotlightRef.current) return;

    // Smooth interpolation (lerp)
    const ease = 0.12;
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

    spotlightRef.current.style.setProperty("--x", `${currentPos.current.x}px`);
    spotlightRef.current.style.setProperty("--y", `${currentPos.current.y}px`);

    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = cachedRect.current;
    if (!rect) return;

    targetPos.current.x = e.clientX - rect.left;
    targetPos.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      cachedRect.current = containerRef.current.getBoundingClientRect();
    }
    setIsHovered(true);
    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, [updateSpotlight]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Lazy-load pattern image when section nears viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Light OBEL pattern background (always visible, faded) — lazy loaded */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isVisible ? `url("/images/pattern-obel.webp")` : "none",
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      {/* Navy blue pattern with spotlight mask (revealed on hover) — lazy loaded */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: isVisible ? `url("/images/pattern-obel.webp")` : "none",
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          opacity: isHovered ? 0.15 : 0,
          maskImage: `radial-gradient(circle 200px at var(--x, 50%) var(--y, 50%), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at var(--x, 50%) var(--y, 50%), black 0%, transparent 100%)`,
          ["--x" as string]: "50%",
          ["--y" as string]: "50%",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
