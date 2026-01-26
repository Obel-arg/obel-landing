"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    // Expose lenis globally for external access
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis (synced animation frame)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing for precise scroll synchronization
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
