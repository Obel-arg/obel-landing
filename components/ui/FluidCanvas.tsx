"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { FluidField, FieldAccessor } from "@/lib/fluidField";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

// Logo trail settings
const LOGO_SIZE = 14; // px - small for trail effect
const DENSITY_THRESHOLD = 12; // minimum density to show logo
const SAMPLE_INTERVAL = 2; // check every N cells for density
const MAX_OPACITY = 0.45; // cap opacity for subtlety

// Performance settings
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const DENSITY = 80; // Density added on cursor move

interface DeviceCapability {
  tier: "low" | "medium" | "high";
  shouldDisable: boolean;
  fieldSize: number;
}

function getDeviceCapability(): DeviceCapability {
  if (typeof window === "undefined") {
    return { tier: "medium", shouldDisable: false, fieldSize: 6 };
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;
  const isMobile = /Android|iPhone|iPod|iPad/.test(navigator.userAgent);
  const isOldDevice = cores <= 2 && memory < 2;

  if (isOldDevice) {
    return { tier: "low", shouldDisable: true, fieldSize: 8 };
  }

  if (isMobile || (cores <= 4 && memory <= 4)) {
    return { tier: "medium", shouldDisable: false, fieldSize: 8 };
  }

  return { tier: "high", shouldDisable: false, fieldSize: 6 };
}

interface FluidCanvasProps {
  enabled?: boolean;
  fieldSize?: number;
  className?: string;
}

export function FluidCanvas({
  enabled = true,
  fieldSize: propFieldSize,
  className = "",
}: FluidCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fluidRef = useRef<FluidField | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const logoRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse state (using refs to avoid re-renders)
  const mouseRef = useRef({ x: 0, y: 0, ox: 0, oy: 0, drawing: false });
  const rectRef = useRef<DOMRect | null>(null);

  // Dimension refs for animation loop
  const dimsRef = useRef({ displayWidth: 0, displayHeight: 0, fieldWidth: 0, fieldHeight: 0 });

  // Device capability detection
  const [capability] = useState(() => getDeviceCapability());
  const fieldSize = propFieldSize ?? capability.fieldSize;

  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load and prepare white logo
  useEffect(() => {
    if (!isMounted) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/logo-icon.svg";

    img.onload = () => {
      // Create offscreen canvas with white version of logo
      const offscreen = document.createElement("canvas");
      const size = LOGO_SIZE * 2; // Higher res for quality
      offscreen.width = size;
      offscreen.height = size;

      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Draw logo and invert to white
      offCtx.filter = "invert(1) brightness(1.15)";
      offCtx.drawImage(img, 0, 0, size, size);

      logoRef.current = offscreen;
      setLogoLoaded(true);
    };
  }, [isMounted]);

  // Visibility tracking (tab visibility)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Draw frame function - renders logos at high-density points
  const drawFrame = useCallback(
    (field: FieldAccessor, ctx: CanvasRenderingContext2D) => {
      const { displayWidth, displayHeight, fieldWidth, fieldHeight } = dimsRef.current;
      const logo = logoRef.current;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      if (!logo) return;

      // Sample grid and draw logos where density is high
      for (let x = 0; x < fieldWidth; x += SAMPLE_INTERVAL) {
        for (let y = 0; y < fieldHeight; y += SAMPLE_INTERVAL) {
          const density = field.getDensity(x, y);
          if (density < DENSITY_THRESHOLD) continue;

          // Calculate opacity based on density
          const opacity = Math.min(MAX_OPACITY, (density / 255) * 0.8);
          ctx.globalAlpha = opacity;

          // Convert field coords to display coords
          const px = (x / fieldWidth) * displayWidth;
          const py = (y / fieldHeight) * displayHeight;

          // Draw logo centered at position
          ctx.drawImage(
            logo,
            px - LOGO_SIZE / 2,
            py - LOGO_SIZE / 2,
            LOGO_SIZE,
            LOGO_SIZE
          );
        }
      }

      ctx.globalAlpha = 1;
    },
    []
  );

  // Update frame function (input handling)
  const updateFrame = useCallback(
    (field: FieldAccessor) => {
      const { displayWidth, displayHeight, fieldWidth, fieldHeight } = dimsRef.current;
      const mouse = mouseRef.current;

      if (mouse.drawing) {
        const dx = mouse.x - mouse.ox;
        const dy = mouse.y - mouse.oy;
        const length = Math.max(1, (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0);

        for (let i = length; i--; ) {
          const px = ((mouse.ox + (dx * i) / length) / displayWidth) * fieldWidth;
          const py = ((mouse.oy + (dy * i) / length) / displayHeight) * fieldHeight;
          const x = Math.floor(px);
          const y = Math.floor(py);

          if (x >= 0 && x < fieldWidth && y >= 0 && y < fieldHeight) {
            field.setVelocity(x, y, dx, dy);
            field.setDensity(x, y, DENSITY);
          }
        }

        mouse.ox = mouse.x;
        mouse.oy = mouse.y;
      }
    },
    []
  );

  // Main effect: setup canvas, fluid, animation loop
  useEffect(() => {
    if (!isMounted || prefersReducedMotion || !enabled || capability.shouldDisable || !logoLoaded) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const initSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);

      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (displayWidth === 0 || displayHeight === 0) return false;

      const fieldWidth = Math.floor(displayWidth / fieldSize);
      const fieldHeight = Math.floor(displayHeight / fieldSize);

      // Set canvas to display size (not field size)
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.scale(dpr, dpr);

      // Store dimensions for animation loop
      dimsRef.current = { displayWidth, displayHeight, fieldWidth, fieldHeight };

      // Initialize fluid field
      if (!fluidRef.current) {
        fluidRef.current = new FluidField();
      }
      fluidRef.current.setResolution(fieldWidth, fieldHeight);

      // Initialize rect cache
      rectRef.current = canvas.getBoundingClientRect();

      // Don't start drawing until user moves mouse
      mouseRef.current = {
        x: 0,
        y: 0,
        ox: 0,
        oy: 0,
        drawing: false,
      };

      return true;
    };

    if (!initSize()) return;

    // Animation loop
    const animate = (timestamp: number) => {
      // Throttle to target FPS
      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Skip if not visible
      if (!isVisible) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const fluid = fluidRef.current;
      if (!fluid) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      fluid.update(
        (field) => updateFrame(field),
        (field) => drawFrame(field, ctx)
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Pointer event handlers
    const handleMouseMove = (e: MouseEvent) => {
      // Update rect if not cached
      if (!rectRef.current) {
        rectRef.current = canvas.getBoundingClientRect();
      }
      const rect = rectRef.current;

      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      // If not drawing yet, initialize old position to current
      if (!mouseRef.current.drawing) {
        mouseRef.current.ox = newX;
        mouseRef.current.oy = newY;
      }

      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      mouseRef.current.drawing = true;
    };

    const handleMouseEnter = () => {
      rectRef.current = canvas.getBoundingClientRect();
      // Reset drawing state so ox/oy get initialized properly
      mouseRef.current.drawing = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.drawing = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      rectRef.current = canvas.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const rect = rectRef.current;

      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
      mouseRef.current.ox = mouseRef.current.x;
      mouseRef.current.oy = mouseRef.current.y;
      mouseRef.current.drawing = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const rect = rectRef.current;
      if (!rect) return;

      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
    };

    const handleTouchEnd = () => {
      mouseRef.current.drawing = false;
    };

    // Handle scroll - invalidate rect cache
    const handleScroll = () => {
      rectRef.current = null; // Will be recalculated on next mouse move
    };

    // Attach event listeners
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize observer with debouncing
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Reset scale before reinitializing
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        initSize();
        // Refresh rect cache after resize
        rectRef.current = canvas.getBoundingClientRect();
      }, 100);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);

      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);

      fluidRef.current?.dispose();
      fluidRef.current = null;
    };
  }, [isMounted, prefersReducedMotion, enabled, capability.shouldDisable, fieldSize, isVisible, logoLoaded, drawFrame, updateFrame]);

  // Don't render if reduced motion, disabled, or low-end device
  if (prefersReducedMotion || !enabled || capability.shouldDisable) {
    return null;
  }

  // SSR placeholder
  if (!isMounted) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
