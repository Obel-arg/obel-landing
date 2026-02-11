"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Module-level guard — prevents double init in StrictMode (Rule: advanced-init-once)
let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // Initialize Lenis once
  useEffect(() => {
    if (lenisInstance) return;

    // We manage scroll restoration ourselves via sessionStorage
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

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

    // Restore scroll position on reload (saved by beforeunload)
    const saved = sessionStorage.getItem(`scroll-${window.location.pathname}`);
    if (saved) {
      const pos = parseInt(saved, 10);
      // Wait for DOM to be ready before restoring
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lenis.scrollTo(pos, { immediate: true });
          ScrollTrigger.refresh();
        });
      });
      sessionStorage.removeItem(`scroll-${window.location.pathname}`);
    }

    // Save scroll position before reload/close
    const handleBeforeUnload = () => {
      if (lenisInstance) {
        sessionStorage.setItem(
          `scroll-${window.location.pathname}`,
          String(Math.round(lenisInstance.scroll))
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Refresh ScrollTrigger after dynamic content loads (handles dynamic imports)
    // Staggered refreshes: 100ms for fast loads, 500ms/1500ms for slow mobile networks
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 1500);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Restore scroll position on SPA route change (back/forward navigation)
  useEffect(() => {
    if (!lenisInstance) return;

    // Skip first mount (handled by init effect above)
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      const saved = sessionStorage.getItem(`scroll-${pathname}`);
      if (saved) {
        const pos = parseInt(saved, 10);
        sessionStorage.removeItem(`scroll-${pathname}`);
        // Wait for page DOM to fully render + ScrollTrigger to recalculate
        // before restoring position. Multiple attempts ensure it sticks
        // even if layout shifts happen during hydration.
        const restore = () => {
          if (!lenisInstance) return;
          ScrollTrigger.refresh();
          lenisInstance.scrollTo(pos, { immediate: true });
        };
        setTimeout(restore, 150);
        setTimeout(restore, 500);
        setTimeout(restore, 1000);
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
