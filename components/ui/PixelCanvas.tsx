"use client";

import { useRef, useEffect, useCallback } from "react";

// --- Pixel class (ported from pixel-canvas-web-component/src/script.js) ---

class Pixel {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;
  private speed: number;
  size: number;
  private sizeStep: number;
  private minSize: number;
  private maxSizeInteger: number;
  private maxSize: number;
  private delay: number;
  private counter: number;
  private counterStep: number;
  isIdle: boolean;
  private isReverse: boolean;
  private isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4 + 0.3;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 8 + (canvas.width + canvas.height) * 0.02;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

// --- React component ---

const DEFAULT_COLORS = ["#BFDBFE", "#93C5FD", "#3B82F6"];
const TIME_INTERVAL = 1000 / 60;

interface PixelCanvasProps {
  isHovered: boolean;
  colors?: string[];
  gap?: number;
  speed?: number;
  reducedMotion?: boolean;
  className?: string;
}

export function PixelCanvas({
  isHovered,
  colors = DEFAULT_COLORS,
  gap = 5,
  speed = 35,
  reducedMotion = false,
  className = "",
}: PixelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(0);
  const animModeRef = useRef<"appear" | "disappear">("disappear");

  // Clamp gap and compute speed throttle
  const clampedGap = Math.max(4, Math.min(50, gap));
  const computedSpeed = Math.min(speed, 100) * 0.001;

  const createPixels = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const pixels: Pixel[] = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x += clampedGap) {
        for (let y = 0; y < canvas.height; y += clampedGap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const dx = x - centerX;
          const dy = y - centerY;
          const delay = reducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.5;
          pixels.push(new Pixel(canvas, ctx, x, y, color, computedSpeed, delay));
        }
      }

      return pixels;
    },
    [colors, clampedGap, computedSpeed, reducedMotion]
  );

  // Effect 1: Init canvas + ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const init = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      pixelsRef.current = createPixels(canvas, ctx);
    };

    init();

    const resizeObserver = new ResizeObserver(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      init();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [createPixels]);

  // Effect 2: Hover drives animation
  useEffect(() => {
    if (reducedMotion) return;

    animModeRef.current = isHovered ? "appear" : "disappear";

    const animate = () => {
      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;

      if (timePassed >= TIME_INTERVAL) {
        timePreviousRef.current = timeNow - (timePassed % TIME_INTERVAL);

        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pixels = pixelsRef.current;
        const mode = animModeRef.current;

        for (let i = 0; i < pixels.length; i++) {
          pixels[i][mode]();
        }

        // Stop loop when all pixels are idle (disappear complete)
        if (mode === "disappear" && pixels.every((p) => p.isIdle)) {
          animationRef.current = null;
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isHovered, reducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
}
