"use client";

import { ReactNode, useRef, useLayoutEffect, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const COLS = 13;
const ROWS = 7;

interface PixelRevealProps {
  children: ReactNode;
  cols?: number;
  rows?: number;
  staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  className?: string;
}

export function PixelReveal({
  children,
  cols = COLS,
  rows = ROWS,
  staggerFrom = "end",
  className,
}: PixelRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    if (!grid || !content || !wrapper || prefersReducedMotion) return;

    const cells = Array.from(grid.children) as HTMLElement[];

    // Initial state: cells hidden, content hidden
    gsap.set(cells, { scale: 0, opacity: 0 });
    gsap.set(content, { opacity: 0, y: 20 });

    function resetState() {
      // Kill any running timeline
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      gsap.set(grid, { opacity: 1 });
      gsap.set(cells, { scale: 0, opacity: 0 });
      gsap.set(content, { opacity: 0, y: 20 });
    }

    function playReveal() {
      resetState();

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Cells sweep in (enter only — matches nav transition style)
      tl.to(cells, {
        scale: 1.01,
        opacity: 1,
        duration: 0.3,
        ease: "power1.inOut",
        stagger: {
          grid: [rows, cols],
          from: staggerFrom,
          each: 0.035,
        },
      });

      // Smooth fade out the entire grid, then content appears
      tl.to(grid, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Content fades in — overlaps with grid fade
      tl.to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 80%",
      onEnter: playReveal,
      onEnterBack: playReveal,
      onLeave: resetState,
      onLeaveBack: resetState,
    });

    return () => {
      trigger.kill();
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [cols, rows, staggerFrom, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
      <div
        ref={gridRef}
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="bg-primary" />
        ))}
      </div>
    </div>
  );
}
