"use client";

import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
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

// Dev-only diagnostic logging
const DEBUG = process.env.NODE_ENV === "development";
const dbg = (...args: unknown[]) => {
  if (DEBUG) console.debug("[RouteTransition]", ...args);
};

// Unconditional module-level log — confirms this file was loaded by the browser
if (typeof window !== "undefined") {
  console.log("%c[RouteTransition] MODULE LOADED — v2 with popstate handler", "color: lime; font-weight: bold; font-size: 14px;");
}

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
 *
 * Three trigger paths:
 * 1. TransitionLink (forward nav): calls startTransition → enter → covered → navigate → exit
 * 2. Browser back/forward: popstate handler → instant cover → exit dissolve
 * 3. Fallback (programmatic nav): useLayoutEffect detects pathname change → cover → exit
 */
export function RouteTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<TransitionState>("idle");
  const onCoveredRef = useRef<(() => void) | null>(null);
  const animationIdRef = useRef<number>(0);
  const noiseGridRef = useRef<number[][] | null>(null);
  const startExitAnimationRef = useRef<
    (ctx: CanvasRenderingContext2D, w: number, h: number, cw: number, ch: number) => void
  >(() => {});
  const startTransitionRef = useRef<(onCovered: () => void) => void>(() => {});

  // Timeout tracking — cancel all pending timeouts on state resets
  const pendingTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  // Flag: popstate handler already covered screen, useLayoutEffect should skip
  const popstateHandledRef = useRef(false);

  // Track pathname to detect uncontrolled navigations (fallback)
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  // Flag: TransitionLink sets this before router.push so popstate/useLayoutEffect skips
  const isInternalNavigation = useRef(false);

  // --- Timeout helpers ---
  const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current.delete(id);
      fn();
    }, delay);
    pendingTimeoutsRef.current.add(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    pendingTimeoutsRef.current.forEach((id) => clearTimeout(id));
    pendingTimeoutsRef.current.clear();
  }, []);

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

  // --- Forward navigation: TransitionLink calls this ---
  const startTransition = useCallback(
    (onCovered: () => void) => {
      dbg("startTransition called, state:", stateRef.current);
      if (stateRef.current !== "idle") {
        dbg("startTransition BLOCKED — state is not idle");
        return;
      }

      // Mark as internal so popstate + useLayoutEffect skip this route change
      isInternalNavigation.current = true;
      dbg("marked as internal navigation");

      // Check reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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

      // Safety timeout: force through if rAF stalls
      scheduleTimeout(() => {
        if (stateRef.current === "entering") {
          dbg("enter safety timeout fired — forcing to covered");
          stateRef.current = "covered";
          ctx.fillStyle = `rgb(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B})`;
          ctx.fillRect(0, 0, width, height);
          if (onCoveredRef.current) {
            onCoveredRef.current();
            onCoveredRef.current = null;
          }
          scheduleTimeout(() => {
            startExitAnimationRef.current(ctx, width, height, cellWidth, cellHeight);
          }, 100);
        }
      }, ENTER_DURATION + 500);

      const animateEnter = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = elapsed / ENTER_DURATION;
        const progress = easeInQuart(Math.min(1, rawProgress));

        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const threshold = noiseGrid[row][col];
            const appearThreshold = 1 - threshold;
            if (progress < appearThreshold) continue;

            const fadeProgress = Math.min(1, (progress - appearThreshold) / 0.15);

            ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${fadeProgress})`;
            const x = col * cellWidth;
            const y = row * cellHeight;
            ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
          }
        }

        if (rawProgress < 1) {
          animationIdRef.current = requestAnimationFrame(animateEnter);
        } else {
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
          scheduleTimeout(() => {
            startExitAnimationRef.current(ctx, width, height, cellWidth, cellHeight);
          }, 100);
        }
      };

      animationIdRef.current = requestAnimationFrame(animateEnter);
    },
    [generateNoiseGrid, scheduleTimeout]
  );

  // --- Exit dissolve animation (shared by all paths) ---
  const startExitAnimation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cellWidth: number,
      cellHeight: number
    ) => {
      // Guard: only start exit if we're in "covered" state
      if (stateRef.current !== "covered") {
        dbg("startExitAnimation SKIPPED — state is", stateRef.current, "not 'covered'");
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      dbg("startExitAnimation starting");

      // Regenerate noise for different exit pattern
      noiseGridRef.current = generateNoiseGrid();
      const noiseGrid = noiseGridRef.current;

      stateRef.current = "exiting";
      let startTime: number | null = null;

      // Safety timeout: force idle if rAF stalls
      const safetyId = scheduleTimeout(() => {
        if (stateRef.current !== "idle") {
          dbg("exit safety timeout fired — forcing to idle");
          container.style.display = "none";
          stateRef.current = "idle";
        }
      }, EXIT_DURATION + 500);

      const animateExit = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = elapsed / EXIT_DURATION;
        const progress = easeOutQuart(Math.min(1, rawProgress));

        ctx.clearRect(0, 0, width, height);

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
          clearTimeout(safetyId);
          pendingTimeoutsRef.current.delete(safetyId);
          container.style.display = "none";
          stateRef.current = "idle";
          dbg("exit animation complete → idle");
        }
      };

      animationIdRef.current = requestAnimationFrame(animateExit);
    },
    [generateNoiseGrid, scheduleTimeout]
  );

  // Keep refs in sync so deferred callbacks always call latest version.
  // Must be in useEffect (not during render) per React 19 ref rules.
  useEffect(() => {
    startExitAnimationRef.current = startExitAnimation;
    startTransitionRef.current = startTransition;
  });

  // --- Fallback: detect uncontrolled navigations via pathname ---
  // useLayoutEffect runs before paint but AFTER React commits.
  // For browser back/forward, the popstate handler covers screen first.
  // This is a fallback for programmatic navigations that don't fire popstate.
  useLayoutEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    // TransitionLink handles its own enter+exit overlay
    if (isInternalNavigation.current) {
      isInternalNavigation.current = false;
      dbg("useLayoutEffect: internal nav, skipping");
      return;
    }

    // popstate handler already covered the screen
    if (popstateHandledRef.current) {
      popstateHandledRef.current = false;
      dbg("useLayoutEffect: popstate already handled, skipping");
      return;
    }

    dbg("useLayoutEffect: uncontrolled nav detected, covering as fallback");

    // Force reset if stuck
    if (stateRef.current !== "idle") {
      clearAllTimeouts();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      stateRef.current = "idle";
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    container.style.display = "block";
    ctx.fillStyle = `rgb(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B})`;
    ctx.fillRect(0, 0, width, height);
    stateRef.current = "covered";

    const cellWidth = width / COLS;
    const cellHeight = height / ROWS;
    scheduleTimeout(() => {
      startExitAnimationRef.current(ctx, width, height, cellWidth, cellHeight);
    }, 300);
  }, [pathname, clearAllTimeouts, scheduleTimeout]);

  // --- Expose global API + popstate listener ---
  useEffect(() => {
    dbg("useEffect: setting up window.routeTransition + popstate listener");

    // Proxy via ref so TransitionLink always calls the latest startTransition
    window.routeTransition = {
      startTransition: (onCovered: () => void) => {
        startTransitionRef.current(onCovered);
      },
    };

    // --- Primary back/forward handler ---
    // popstate fires IMMEDIATELY when user presses back/forward,
    // BEFORE Next.js starts any React processing. We do synchronous
    // DOM manipulation here to cover the screen before any React rendering.
    const handlePopstate = () => {
      dbg("popstate fired, state:", stateRef.current);

      // TransitionLink uses router.push (pushState) — popstate shouldn't fire,
      // but guard anyway
      if (isInternalNavigation.current) {
        dbg("popstate: internal nav flag set, skipping");
        return;
      }

      // Force reset if stuck
      if (stateRef.current !== "idle") {
        dbg("popstate: resetting stuck state:", stateRef.current);
        clearAllTimeouts();
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        stateRef.current = "idle";
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Canvas setup + SYNCHRONOUS cover (all writes, no interleaved reads)
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      container.style.display = "block";
      ctx.fillStyle = `rgb(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B})`;
      ctx.fillRect(0, 0, width, height);
      stateRef.current = "covered";
      popstateHandledRef.current = true;

      dbg("popstate: screen covered, scheduling exit dissolve");

      // Deferred dissolve after new page renders underneath
      const cellWidth = width / COLS;
      const cellHeight = height / ROWS;
      scheduleTimeout(() => {
        startExitAnimationRef.current(ctx, width, height, cellWidth, cellHeight);
      }, 300);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      delete window.routeTransition;
      window.removeEventListener("popstate", handlePopstate);
      clearAllTimeouts();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [clearAllTimeouts, scheduleTimeout]);

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
