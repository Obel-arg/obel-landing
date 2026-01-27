"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const COLS = 70;
const ROWS = 40;

/**
 * Opening pixel curtain animation.
 * Plays once on page load — cells start visible and scale out from center.
 */
export function PixelTransition() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = Array.from(grid.children) as HTMLElement[];

    gsap.delayedCall(0.2, () => {
      gsap.to(cells, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        stagger: {
          grid: [ROWS, COLS],
          from: "center",
          each: 0.004,
        },
        onComplete: () => {
          gsap.set(grid, { opacity: 0 });
          gsap.set(cells, { scale: 0, opacity: 0 });
        },
      });
    });
  }, []);

  return (
    <div
      ref={gridRef}
      aria-hidden
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        opacity: 1,
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div
          key={i}
          className="bg-primary"
          style={{ transform: "scale(1.01)", opacity: 1 }}
        />
      ))}
    </div>
  );
}
