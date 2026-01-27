"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const COLS = 13;
const ROWS = 7;

// Module-level singleton (same pattern as Lenis in SmoothScroll.tsx)
let transitionInstance: {
  play: (onMid: () => void) => Promise<void>;
} | null = null;
let isAnimating = false;

/**
 * Pixel transition overlay — Codrops demo 3 style.
 * Two-phase: show (cells scale+fade in) → onMid → hide (cells scale+fade out).
 * Grid stagger from "end" (bottom-right).
 */
export function playPixelTransition(
  onMid: () => void
): Promise<void> | undefined {
  if (isAnimating || !transitionInstance) return;
  return transitionInstance.play(onMid);
}

export function PixelTransition() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transitionInstance = {
      play: (onMid: () => void) => {
        return new Promise<void>((resolve) => {
          isAnimating = true;
          const grid = gridRef.current;
          if (!grid) {
            isAnimating = false;
            resolve();
            return;
          }

          const cells = Array.from(grid.children) as HTMLElement[];

          // Make overlay visible
          gsap.set(grid, { opacity: 1 });

          // Phase 1: Show — cells scale+fade in from bottom-right
          gsap.fromTo(
            cells,
            {
              scale: 0,
              opacity: 0,
            },
            {
              duration: 0.3,
              ease: "power1.inOut",
              scale: 1.01,
              opacity: 1,
              stagger: {
                grid: [ROWS, COLS],
                from: "end",
                each: 0.035,
              },
              onComplete: () => {
                // Execute callback (scroll, etc.)
                onMid();

                // Smooth fade out the entire overlay as one unit
                gsap.to(grid, {
                  duration: 0.5,
                  ease: "power2.out",
                  opacity: 0,
                  onComplete: () => {
                    // Reset cells for next trigger
                    gsap.set(cells, { scale: 0, opacity: 0 });
                    isAnimating = false;
                    resolve();
                  },
                });
              },
            }
          );
        });
      },
    };

    return () => {
      transitionInstance = null;
    };
  }, []);

  return (
    <div
      ref={gridRef}
      aria-hidden
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        opacity: 0,
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div
          key={i}
          className="bg-primary"
          style={{ transform: "scale(0)", opacity: 0 }}
        />
      ))}
    </div>
  );
}
