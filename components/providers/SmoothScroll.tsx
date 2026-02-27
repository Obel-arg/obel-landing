"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const targetScrollRef = useRef<number | null>(null);
  const hasInitialMounted = useRef(false);

  // Restore scroll synchronously before first paint (hard reload / direct visit)
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(`scroll-${window.location.pathname}`);
      if (saved) {
        const pos = parseInt(saved, 10);
        targetScrollRef.current = pos;
        window.scrollTo(0, pos);
        sessionStorage.removeItem(`scroll-${window.location.pathname}`);
      }
    } catch { /* noop */ }
  }, []);

  // Run BEFORE paint on SPA route change: projects always at top; home restores saved scroll.
  // Lenis reads its own internal animatedScroll/targetScroll (not window.scrollY), so we must
  // call lenisInstance.scrollTo(0, { immediate: true }) when entering projects so the first paint is at top.
  useLayoutEffect(() => {
    if (!hasInitialMounted.current) {
      hasInitialMounted.current = true;
      return; // initial load is handled by the [] layoutEffect
    }

    if (pathname.startsWith("/projects/") || pathname === "/projects") {
      window.scrollTo(0, 0);
      if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
      // Re-apply on next frames so we win vs in-flight Lenis scroll when user clicked while scrolling
      const raf1 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
      });
      const raf2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    try {
      const saved = sessionStorage.getItem(`scroll-${pathname}`);
      if (saved) {
        const pos = parseInt(saved, 10);
        if (lenisInstance) {
          lenisInstance.scrollTo(pos, { immediate: true });
        } else {
          window.scrollTo(0, pos);
        }
      }
    } catch { /* noop */ }
  }, [pathname]);

  // Init Lenis
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
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const handleBeforeUnload = () => {
      try {
        if (lenisInstance) {
          sessionStorage.setItem(
            `scroll-${window.location.pathname}`,
            String(Math.round(lenisInstance.scroll))
          );
        }
      } catch { /* noop */ }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Re-apply scroll as dynamic imports expand the page height
    const tryRestore = () => {
      if (targetScrollRef.current === null) return;
      const target = targetScrollRef.current;
      ScrollTrigger.refresh();
      window.scrollTo(0, target);
      if (lenisInstance) lenisInstance.scrollTo(target, { immediate: true });
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= target - 5 && Math.abs(window.scrollY - target) < 10) {
        targetScrollRef.current = null;
      }
    };

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

    const t1 = setTimeout(tryRestore, 200);
    const t2 = setTimeout(tryRestore, 800);
    const t3 = setTimeout(tryRestore, 2000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // SPA route change: save → reset → restore
  useEffect(() => {
    if (!lenisInstance) return;

    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Project pages always start at top
    if (pathname.startsWith("/projects/") || pathname === "/projects") {
      window.scrollTo(0, 0);
      lenisInstance.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
      return;
    }

    // Restore saved position for this pathname
    let pos: number | null = null;
    try {
      const saved = sessionStorage.getItem(`scroll-${pathname}`);
      if (saved) {
        sessionStorage.removeItem(`scroll-${pathname}`);
        pos = parseInt(saved, 10);
      }
    } catch { /* noop */ }

    if (!pos) return;

    // Jump immediately, then re-apply each time dynamic imports expand the page
    targetScrollRef.current = pos;
    window.scrollTo(0, pos);
    lenisInstance.scrollTo(pos, { immediate: true });
    ScrollTrigger.refresh();

    // Al volver: alinear ScrollTrigger con Lenis en el siguiente frame (tras el ticker)
    requestAnimationFrame(() => {
      ScrollTrigger.update();
      ScrollTrigger.refresh();
    });

    if (pathname === "/") {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("obel:scroll-restored"));
      });
    }

    const apply = () => {
      if (targetScrollRef.current === null || !lenisInstance) return;
      const target = targetScrollRef.current;
      ScrollTrigger.refresh();
      window.scrollTo(0, target);
      lenisInstance.scrollTo(target, { immediate: true });
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= target - 5 && Math.abs(window.scrollY - target) < 10) {
        targetScrollRef.current = null;
      }
    };

    const ro = new ResizeObserver(() => {
      apply();
      if (targetScrollRef.current === null) ro.disconnect();
    });
    ro.observe(document.body);

    const safety = setTimeout(() => {
      targetScrollRef.current = null;
      ro.disconnect();
    }, 3000);

    return () => {
      clearTimeout(safety);
      ro.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
