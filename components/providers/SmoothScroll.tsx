"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Module-level guard — prevents double init in StrictMode (Rule: advanced-init-once)
let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  // Target scroll position — persists across hooks so staggered refreshes can re-apply
  const targetScrollRef = useRef<number | null>(null);

  // Hook 1: Restore scroll position synchronously BEFORE paint
  // This runs before the Lenis useEffect — the browser never paints at position 0
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(`scroll-${window.location.pathname}`);
      if (saved) {
        const pos = parseInt(saved, 10);
        targetScrollRef.current = pos;
        window.scrollTo(0, pos);
        sessionStorage.removeItem(`scroll-${window.location.pathname}`);
      }
    } catch {
      // sessionStorage blocked (private browsing, restricted env)
    }
  }, []);

  // Hook 2: Initialize Lenis AFTER paint (reads already-correct scroll position)
  useEffect(() => {
    if (lenisInstance) return;

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

    // Save scroll position before reload/close
    const handleBeforeUnload = () => {
      try {
        if (lenisInstance) {
          sessionStorage.setItem(
            `scroll-${window.location.pathname}`,
            String(Math.round(lenisInstance.scroll))
          );
        }
      } catch {
        // sessionStorage blocked
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Re-apply scroll position as dynamic content loads.
    // Dynamic imports replace 50vh placeholders with real content (Services alone is 500vh),
    // so the page height grows over time. The initial scrollTo gets clamped to the shorter page.
    // ResizeObserver detects each height change and re-applies the saved position.
    const tryRestore = () => {
      if (targetScrollRef.current === null) return;
      const target = targetScrollRef.current;
      ScrollTrigger.refresh();
      // Use native scrollTo first (not constrained by Lenis internal limit)
      window.scrollTo(0, target);
      if (lenisInstance) {
        lenisInstance.scrollTo(target, { immediate: true });
      }
      // Stop once page is tall enough and we've reached the target
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= target - 5 && Math.abs(window.scrollY - target) < 10) {
        targetScrollRef.current = null;
      }
    };

    // ResizeObserver fires each time body height changes (= dynamic import loaded)
    let resizeObserver: ResizeObserver | null = null;
    if (targetScrollRef.current !== null) {
      resizeObserver = new ResizeObserver(() => {
        tryRestore();
        if (targetScrollRef.current === null && resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
      });
      resizeObserver.observe(document.body);
    }

    // Fallback timeouts in case ResizeObserver misses something
    const t1 = setTimeout(tryRestore, 200);
    const t2 = setTimeout(tryRestore, 800);
    const t3 = setTimeout(tryRestore, 2000);
    const t4 = setTimeout(tryRestore, 4000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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

      let saved: string | null = null;
      try {
        saved = sessionStorage.getItem(`scroll-${pathname}`);
        if (saved) sessionStorage.removeItem(`scroll-${pathname}`);
      } catch {
        // sessionStorage blocked
      }
      if (saved) {
        const pos = parseInt(saved, 10);
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
