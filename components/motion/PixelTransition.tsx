"use client";

import { useEffect, useRef } from "react";
import { simplex2DNormalized } from "@/lib/noise";
import { getGpuConfig } from "@/lib/gpu";

// Grid configuration
const COLS = 60;
const ROWS = 35;
const DURATION = 1600; // ms - longer for smoother dissolve
const DELAY = 100; // ms before animation starts
const NOISE_SCALE = 0.08; // Controls pattern size (smaller = larger blobs)
const NOISE_OFFSET = 0.15; // Adds variation to timing
const FADE_ZONE = 0.15; // 15% transition zone for smooth per-pixel fade
const GLOW_INTENSITY = 2.5; // Brighten before disappearing (higher for dark colors)

// Dark blue background color RGB values (#090E19)
const PRIMARY_R = 9;
const PRIMARY_G = 14;
const PRIMARY_B = 25;

/**
 * Pixel dissolve transition on page load.
 * Uses Canvas 2D with Simplex noise for organic dissolve pattern.
 * Smooth per-pixel fade with glow trail effect.
 */
export function PixelTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || getGpuConfig().tier <= 1) {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window dimensions
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Calculate cell dimensions
    const cellWidth = width / COLS;
    const cellHeight = height / ROWS;

    // Pre-calculate noise values for each cell (0-1 range)
    // This determines when each cell will disappear
    const noiseGrid: number[][] = [];
    for (let row = 0; row < ROWS; row++) {
      noiseGrid[row] = [];
      for (let col = 0; col < COLS; col++) {
        // Get noise value and add some randomness
        const noise = simplex2DNormalized(
          col * NOISE_SCALE,
          row * NOISE_SCALE
        );
        // Add slight random offset for more organic feel
        const randomOffset = Math.random() * NOISE_OFFSET;
        noiseGrid[row][col] = Math.min(1, noise + randomOffset);
      }
    }

    // Fill initial state (all cells visible)
    ctx.fillStyle = `rgb(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B})`;
    ctx.fillRect(0, 0, width, height);

    let startTime: number | null = null;
    let animationId: number;

    // Easing function: ease-out-quart for fast start, smooth deceleration
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Smooth step for per-pixel fade
    const smoothstep = (t: number): number => {
      return t * t * (3 - 2 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Wait for delay before starting
      if (elapsed < DELAY) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Calculate progress (0 to 1)
      const rawProgress = (elapsed - DELAY) / DURATION;
      const progress = easeOutQuart(Math.min(1, rawProgress));

      // Clear canvas first
      ctx.clearRect(0, 0, width, height);

      // Draw cells with per-pixel opacity fade and glow
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const threshold = noiseGrid[row][col];
          const distanceToThreshold = threshold - progress;

          // Skip if already fully faded
          if (distanceToThreshold <= 0) continue;

          let opacity: number;
          let brightness = 1;

          if (distanceToThreshold > FADE_ZONE) {
            // Fully visible
            opacity = 1;
          } else {
            // In fade zone - calculate smooth opacity and glow
            const fadeProgress = distanceToThreshold / FADE_ZONE;
            opacity = smoothstep(fadeProgress);

            // Glow effect: brighten as pixel is about to disappear
            const glowProgress = 1 - fadeProgress;
            brightness = 1 + glowProgress * GLOW_INTENSITY;
          }

          // Apply brightness to color (clamp to valid range)
          const r = Math.min(255, Math.round(PRIMARY_R * brightness));
          const g = Math.min(255, Math.round(PRIMARY_G * brightness));
          const b = Math.min(255, Math.round(PRIMARY_B * brightness));

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

          const x = col * cellWidth;
          const y = row * cellHeight;
          // Slight overlap to prevent gaps
          ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
        }
      }

      // Continue animation or finish
      if (rawProgress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Animation complete - hide container
        container.style.display = "none";
      }
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
