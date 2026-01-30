"use client";

import { useEffect, useRef, useCallback } from "react";
import { simplex2DNormalized } from "@/lib/noise";

// Grid configuration
const COLS = 50;
const ROWS = 30;
const ENTER_DURATION = 600; // ms - pixels appearing
const EXIT_DURATION = 800; // ms - pixels dissolving
const NOISE_SCALE = 0.1;
const NOISE_OFFSET = 0.12;

// Primary color RGB values
const PRIMARY_R = 9;
const PRIMARY_G = 14;
const PRIMARY_B = 25;

type TransitionState = "idle" | "entering" | "covered" | "exiting";

interface RouteTransitionAPI {
  startTransition: (onCovered: () => void) => void;
}

// Global reference for TransitionLink to access
declare global {
  interface Window {
    routeTransition?: RouteTransitionAPI;
  }
}

/**
 * Route transition overlay with pixel effect.
 * Pixels animate IN to cover screen, then OUT to reveal new page.
 */
export function RouteTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<TransitionState>("idle");
  const onCoveredRef = useRef<(() => void) | null>(null);
  const animationIdRef = useRef<number>(0);
  const noiseGridRef = useRef<number[][] | null>(null);

  // Generate noise grid
  const generateNoiseGrid = useCallback(() => {
    const grid: number[][] = [];
    for (let row = 0; row < ROWS; row++) {
      grid[row] = [];
      for (let col = 0; col < COLS; col++) {
        const noise = simplex2DNormalized(col * NOISE_SCALE, row * NOISE_SCALE);
        const randomOffset = Math.random() * NOISE_OFFSET;
        grid[row][col] = Math.min(1, noise + randomOffset);
      }
    }
    return grid;
  }, []);

  // Easing functions
  const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
  const easeInQuart = (t: number): number => t * t * t * t;

  const startTransition = useCallback(
    (onCovered: () => void) => {
      if (stateRef.current !== "idle") return;

      // Check reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        onCovered();
        return;
      }

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        onCovered();
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        onCovered();
        return;
      }

      // Setup canvas
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cellWidth = width / COLS;
      const cellHeight = height / ROWS;

      // Generate fresh noise grid
      noiseGridRef.current = generateNoiseGrid();
      const noiseGrid = noiseGridRef.current;

      // Show container
      container.style.display = "block";
      stateRef.current = "entering";
      onCoveredRef.current = onCovered;

      let startTime: number | null = null;

      const animateEnter = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = elapsed / ENTER_DURATION;
        const progress = easeInQuart(Math.min(1, rawProgress));

        ctx.clearRect(0, 0, width, height);

        // Draw pixels appearing (opposite direction - they fade IN)
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const threshold = noiseGrid[row][col];

            // Pixel appears when progress exceeds (1 - threshold)
            // This makes high-noise cells appear later
            const appearThreshold = 1 - threshold;
            if (progress < appearThreshold) continue;

            // Calculate opacity for smooth fade in
            const fadeProgress = Math.min(
              1,
              (progress - appearThreshold) / 0.15
            );
            const opacity = fadeProgress;

            ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${opacity})`;

            const x = col * cellWidth;
            const y = row * cellHeight;
            ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
          }
        }

        if (rawProgress < 1) {
          animationIdRef.current = requestAnimationFrame(animateEnter);
        } else {
          // Fully covered - trigger callback and start exit
          stateRef.current = "covered";

          // Fill solid
          ctx.fillStyle = `rgb(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B})`;
          ctx.fillRect(0, 0, width, height);

          // Call the navigation callback
          if (onCoveredRef.current) {
            onCoveredRef.current();
            onCoveredRef.current = null;
          }

          // Small delay before exit animation
          setTimeout(() => {
            startExitAnimation(ctx, width, height, cellWidth, cellHeight);
          }, 100);
        }
      };

      animationIdRef.current = requestAnimationFrame(animateEnter);
    },
    [generateNoiseGrid]
  );

  const startExitAnimation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cellWidth: number,
      cellHeight: number
    ) => {
      const container = containerRef.current;
      if (!container) return;

      // Regenerate noise for different exit pattern
      noiseGridRef.current = generateNoiseGrid();
      const noiseGrid = noiseGridRef.current;

      stateRef.current = "exiting";
      let startTime: number | null = null;

      const animateExit = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = elapsed / EXIT_DURATION;
        const progress = easeOutQuart(Math.min(1, rawProgress));

        ctx.clearRect(0, 0, width, height);

        // Draw pixels dissolving (same as PixelTransition)
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const threshold = noiseGrid[row][col];
            const distanceToThreshold = threshold - progress;

            if (distanceToThreshold <= 0) continue;

            let opacity: number;
            const fadeZone = 0.15;

            if (distanceToThreshold > fadeZone) {
              opacity = 1;
            } else {
              const fadeProgress = distanceToThreshold / fadeZone;
              opacity = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
            }

            ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${opacity})`;

            const x = col * cellWidth;
            const y = row * cellHeight;
            ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
          }
        }

        if (rawProgress < 1) {
          animationIdRef.current = requestAnimationFrame(animateExit);
        } else {
          // Animation complete
          container.style.display = "none";
          stateRef.current = "idle";
        }
      };

      animationIdRef.current = requestAnimationFrame(animateExit);
    },
    [generateNoiseGrid]
  );

  // Expose API globally
  useEffect(() => {
    window.routeTransition = { startTransition };

    return () => {
      delete window.routeTransition;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [startTransition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ display: "none" }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
