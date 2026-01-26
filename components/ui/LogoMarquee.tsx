"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// Placeholder logos - replace with actual client logos
const LOGOS = [
  { name: "Company A", id: 1 },
  { name: "Company B", id: 2 },
  { name: "Company C", id: 3 },
  { name: "Company D", id: 4 },
  { name: "Company E", id: 5 },
  { name: "Company F", id: 6 },
];

interface LogoMarqueeProps {
  className?: string;
}

export function LogoMarquee({ className = "" }: LogoMarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const speedRef = useRef(1.2);
  const targetSpeedRef = useRef(1.2);
  const rafRef = useRef<number | null>(null);
  const singleSetWidthRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Normal speed and slow speed (on hover)
  const NORMAL_SPEED = 1.2;
  const SLOW_SPEED = 0.5;

  // Calculate single set width once track is rendered
  useEffect(() => {
    if (!trackRef.current) return;

    // Calculate width of one set of logos
    const children = trackRef.current.children;
    const logosPerSet = LOGOS.length;
    let width = 0;

    for (let i = 0; i < logosPerSet; i++) {
      const child = children[i] as HTMLElement;
      if (child) {
        width += child.offsetWidth;
        // Add gap (get computed style)
        const style = window.getComputedStyle(trackRef.current);
        const gap = parseFloat(style.gap) || 80;
        width += gap;
      }
    }

    singleSetWidthRef.current = width;
  }, []);

  const animate = useCallback(() => {
    if (!trackRef.current || singleSetWidthRef.current === 0) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Smoothly interpolate current speed towards target speed
    const speedEase = 0.05;
    speedRef.current += (targetSpeedRef.current - speedRef.current) * speedEase;

    // Update position
    positionRef.current -= speedRef.current;

    // Reset position seamlessly when we've scrolled one full set
    if (Math.abs(positionRef.current) >= singleSetWidthRef.current) {
      positionRef.current += singleSetWidthRef.current;
    }

    // Apply transform
    trackRef.current.style.transform = `translateX(${positionRef.current}px)`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, prefersReducedMotion]);

  // Update target speed on hover state change
  useEffect(() => {
    targetSpeedRef.current = isHovered ? SLOW_SPEED : NORMAL_SPEED;
  }, [isHovered]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Duplicate logos 6 times for seamless infinite loop
  const repeatedLogos = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  if (prefersReducedMotion) {
    return (
      <div className={`relative w-screen left-1/2 -translate-x-1/2 overflow-hidden ${className}`}>
        <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 py-6 flex-wrap">
          {LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="flex items-center justify-center min-w-[100px] md:min-w-[120px] h-10 md:h-12 opacity-50"
            >
              <span className="font-sans text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-screen left-1/2 -translate-x-1/2 overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-20 py-6"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {repeatedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex items-center justify-center min-w-[100px] md:min-w-[120px] h-10 md:h-12 opacity-50 hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
          >
            <span className="font-sans text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
