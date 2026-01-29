"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { FluidField, FieldAccessor } from "@/lib/fluidField";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

// Brand colors from globals.css
const PARTICLE_COLOR = {
  r: 16, // #10 from foreground
  g: 26, // #1A from foreground
  b: 49, // #31 from foreground
};

// Performance settings
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const DENSITY = 80; // Lower = more subtle trail (was 200)

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
    return { tier: "medium", shouldDisable: false, fieldSize: 6 };
  }

  return { tier: "high", shouldDisable: false, fieldSize: 4 };
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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fluidRef = useRef<FluidField | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);

  // Mouse state (using refs to avoid re-renders)
  const mouseRef = useRef({ x: 0, y: 0, ox: 0, oy: 0, drawing: false });
  const rectRef = useRef<DOMRect | null>(null);

  // Buffer for pixel data
  const bufferRef = useRef<ImageData | null>(null);

  // Device capability detection
  const [capability] = useState(() => getDeviceCapability());
  const fieldSize = propFieldSize ?? capability.fieldSize;

  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Visibility tracking (tab visibility)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Draw frame function
  const drawFrame = useCallback(
    (field: FieldAccessor, ctx: CanvasRenderingContext2D, buffer: ImageData, fieldWidth: number, fieldHeight: number) => {
      const data = buffer.data;

      for (let x = fieldWidth; x--; ) {
        for (let y = fieldHeight; y--; ) {
          const density = field.getDensity(x, y);
          const idx = (y * fieldWidth + x) * 4;

          // Navy blue with slight variation
          data[idx] = PARTICLE_COLOR.r;
          data[idx + 1] = PARTICLE_COLOR.g;
          data[idx + 2] = PARTICLE_COLOR.b + Math.floor(Math.random() * 20);
          data[idx + 3] = Math.min(255, Math.floor(density * 0xff * 0.4)); // Lower opacity for subtler effect
        }
      }

      ctx.putImageData(buffer, 0, 0);
    },
    []
  );

  // Update frame function (input handling)
  const updateFrame = useCallback(
    (field: FieldAccessor, displayWidth: number, displayHeight: number, fieldWidth: number, fieldHeight: number) => {
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
    if (!isMounted || prefersReducedMotion || !enabled || capability.shouldDisable) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    let displayWidth = 0;
    let displayHeight = 0;
    let fieldWidth = 0;
    let fieldHeight = 0;

    const initSize = () => {
      const rect = container.getBoundingClientRect();
      displayWidth = Math.floor(rect.width);
      displayHeight = Math.floor(rect.height);

      if (displayWidth === 0 || displayHeight === 0) return false;

      fieldWidth = Math.floor(displayWidth / fieldSize);
      fieldHeight = Math.floor(displayHeight / fieldSize);

      canvas.width = fieldWidth;
      canvas.height = fieldHeight;

      // Create buffer for pixel manipulation
      bufferRef.current = ctx.createImageData(fieldWidth, fieldHeight);

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
      const buffer = bufferRef.current;
      if (!fluid || !buffer) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      fluid.update(
        (field) => updateFrame(field, displayWidth, displayHeight, fieldWidth, fieldHeight),
        (field) => drawFrame(field, ctx, buffer, fieldWidth, fieldHeight)
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
      bufferRef.current = null;
    };
  }, [isMounted, prefersReducedMotion, enabled, capability.shouldDisable, fieldSize, isVisible, drawFrame, updateFrame]);

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
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
