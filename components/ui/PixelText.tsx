"use client";

import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Particle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
}

interface PixelTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  color?: string;
  particleSize?: number;
  sampleGap?: number;
  start?: string;
  end?: string;
}

export function PixelText({
  text,
  className = "",
  fontSize = 72,
  fontWeight = 600,
  fontFamily = "Inter, system-ui, sans-serif",
  color = "#090E19",
  particleSize = 2,
  sampleGap = 3,
  start = "top 80%",
  end = "top 30%",
}: PixelTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const isCompleteRef = useRef(false);
  const renderFnRef = useRef<() => void>(() => {});
  const measuredWidthRef = useRef(0);
  const isVisibleRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isComplete, setIsComplete] = useState(false);

  // Pause rAF when off-screen (Rule: use IntersectionObserver for visibility and pausing)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Render function — uses refs for completion tracking to avoid circular deps
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Clear canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const progress = progressRef.current;
    const particles = particlesRef.current;

    if (particles.length === 0) return;

    // Easing function for smoother convergence
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    ctx.fillStyle = color;

    particles.forEach((particle) => {
      const x = particle.startX + (particle.endX - particle.startX) * easedProgress;
      const y = particle.startY + (particle.endY - particle.startY) * easedProgress;

      // Draw square particles
      ctx.fillRect(x, y, particle.size, particle.size);
    });

    // Check if animation is complete — use ref to avoid circular dependency
    const complete = progress >= 0.99;
    if (complete !== isCompleteRef.current) {
      isCompleteRef.current = complete;
      setIsComplete(complete);
    }
  }, [color]);

  // Keep renderFnRef in sync with latest render
  renderFnRef.current = render;

  // Initialize particles
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width || 800;

    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.3;
    const textHeight = lineHeight * lines.length;

    // Measure actual text width using a temporary canvas
    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    if (!measureCtx) return;
    measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const maxTextWidth = Math.max(
      ...lines.map((line) => measureCtx.measureText(line).width)
    );

    // Use the wider of container width or actual text width (+4 for subpixel safety)
    const width = Math.max(containerWidth, Math.ceil(maxTextWidth) + 4);
    measuredWidthRef.current = width;

    // Canvas height includes space for particles to animate from below
    const canvasHeight = textHeight + 500; // Extra space for scatter animation

    dimensionsRef.current = { width, height: canvasHeight };

    // Set up main canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Create offscreen canvas to render text and extract pixels
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    // Set offscreen canvas size (just for text area)
    offscreen.width = width;
    offscreen.height = textHeight;

    // Render text (handle multiple lines)
    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    offCtx.fillStyle = color;
    offCtx.textBaseline = "middle";
    offCtx.textAlign = "left";

    lines.forEach((line, index) => {
      const y = lineHeight * index + lineHeight / 2;
      offCtx.fillText(line, 0, y);
    });

    // Extract pixel data
    const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imageData.data;
    const particles: Particle[] = [];

    // Sample pixels
    for (let y = 0; y < offscreen.height; y += sampleGap) {
      for (let x = 0; x < offscreen.width; x += sampleGap) {
        const i = (y * offscreen.width + x) * 4;
        const alpha = data[i + 3];

        if (alpha > 50) {
          // Scatter from bottom - particles start below the text area
          const startX = x + (Math.random() - 0.5) * 250;
          const startY = textHeight + 100 + Math.random() * 400;

          particles.push({
            startX,
            startY,
            endX: x,
            endY: y,
            size: particleSize + Math.random() * 0.5,
          });
        }
      }
    }

    particlesRef.current = particles;
    setIsReady(true);

    // Initial render with progress 0
    progressRef.current = 0;
    isCompleteRef.current = false;
    setIsComplete(false);
    renderFnRef.current();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize, fontWeight, fontFamily, color, particleSize, sampleGap, prefersReducedMotion]);

  // Set up ScrollTrigger
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion || !isReady || !containerRef.current) return;

    const container = containerRef.current;

    // Animation loop — skips render when off-screen (Rule: no rAF loops without stop condition)
    const animate = () => {
      if (isVisibleRef.current) {
        renderFnRef.current();
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animFrameRef.current = requestAnimationFrame(animate);

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      end,
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, start, end, prefersReducedMotion]);

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color,
            fontFamily,
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  // Calculate height based on number of lines
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.3;
  const totalHeight = lineHeight * lines.length;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        height: `${totalHeight}px`,
        minWidth: measuredWidthRef.current > 0 ? `${measuredWidthRef.current}px` : undefined,
        overflow: "visible",
      }}
    >
      {/* Canvas for pixel animation - hidden when complete */}
      <canvas
        ref={canvasRef}
        className="block absolute top-0 left-0 pointer-events-none"
        style={{
          opacity: isComplete ? 0 : 1,
        }}
      />
      {/* Real text - shown when animation complete */}
      <div
        className="absolute top-0 left-0"
        style={{
          height: `${totalHeight}px`,
          minWidth: measuredWidthRef.current > 0 ? `${measuredWidthRef.current}px` : undefined,
          fontSize: `${fontSize}px`,
          fontWeight,
          fontFamily,
          color,
          opacity: isComplete ? 1 : 0,
          pointerEvents: "none",
          whiteSpace: "pre-line",
          lineHeight: `${lineHeight}px`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
