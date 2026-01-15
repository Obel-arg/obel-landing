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

  // Target position for smooth interpolation
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

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
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current.x = e.clientX - rect.left;
    targetPos.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback(() => {
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

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
      {/* Light OBEL pattern background (always visible, faded) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("/images/pattern-obel.png")`,
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      {/* Navy blue pattern with spotlight mask (revealed on hover) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `url("/images/pattern-obel.png")`,
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
