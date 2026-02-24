"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const CELL = 6;

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hoverColor?: string;
}

/**
 * Returns true if the device supports hover (pointer device, not touch-only).
 * Falls back to true on SSR / old browsers so the canvas is created just in case.
 */
function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);
  return canHover;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, hoverColor = "#FFFAF8", ...props }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const canHover = useCanHover();

  // Skip canvas entirely on touch-only devices or reduced motion
  const enableEffect = canHover && !reducedMotion;

  const state = useRef({
    raf: 0,
    entering: false,
    filled: 0,
    order: [] as number[],
    cols: 0,
    rows: 0,
  });

  const init = useCallback(() => {
    if (!enableEffect) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = state.current;
    s.cols = Math.ceil(rect.width / CELL);
    s.rows = Math.ceil(rect.height / CELL);
    const total = s.cols * s.rows;

    // Fisher-Yates shuffle for random dissolve order
    s.order = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s.order[i], s.order[j]] = [s.order[j], s.order[i]];
    }
    s.filled = 0;
  }, [enableEffect]);

  useEffect(() => {
    if (!enableEffect) return;
    init();
    const ro = new ResizeObserver(init);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(state.current.raf);
    };
  }, [init, enableEffect]);

  const run = useCallback(() => {
    if (!enableEffect) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = state.current;
    const total = s.order.length;
    if (total === 0) return;

    cancelAnimationFrame(s.raf);
    const cellsPerFrame = Math.max(1, Math.ceil(total / 8));

    const step = () => {
      const target = s.entering ? total : 0;
      if (s.filled === target) return;

      const count = Math.min(cellsPerFrame, Math.abs(target - s.filled));

      for (let i = 0; i < count; i++) {
        if (s.entering) {
          const idx = s.order[s.filled];
          ctx.fillStyle = hoverColor;
          ctx.fillRect(
            (idx % s.cols) * CELL,
            Math.floor(idx / s.cols) * CELL,
            CELL + 1,
            CELL + 1,
          );
          s.filled++;
        } else {
          s.filled--;
          const idx = s.order[s.filled];
          ctx.clearRect(
            (idx % s.cols) * CELL,
            Math.floor(idx / s.cols) * CELL,
            CELL + 1,
            CELL + 1,
          );
        }
      }

      if (s.filled !== (s.entering ? total : 0)) {
        s.raf = requestAnimationFrame(step);
      }
    };

    s.raf = requestAnimationFrame(step);
  }, [hoverColor, enableEffect]);

  const handleEnter = useCallback(() => {
    state.current.entering = true;
    run();
  }, [run]);

  const handleLeave = useCallback(() => {
    state.current.entering = false;
    run();
  }, [run]);

  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden text-center font-sans font-medium transition-colors duration-300",
        className,
      )}
      onMouseEnter={enableEffect ? handleEnter : undefined}
      onMouseLeave={enableEffect ? handleLeave : undefined}
      {...props}
    >
      {enableEffect && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ borderRadius: "inherit" }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
