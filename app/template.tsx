"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

// Track whether this is the initial page load (reload / first visit)
// vs a subsequent SPA navigation
let isInitialLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // useLayoutEffect runs synchronously before paint — prevents flash of content
  // before animation applies opacity: 0. Re-run on pathname change so we hide
  // previous page (e.g. home footer) and reveal the new page without a flash.
  const isomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  isomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isInitialLoad) {
      isInitialLoad = false;
      gsap.set(el, { opacity: 1, y: 0 });
      window.dispatchEvent(new CustomEvent("routePageReady"));
      return;
    }

    // Route changed: hide content immediately so we don't see previous page (e.g. footer)
    gsap.set(el, { opacity: 0, y: 0 });
    window.dispatchEvent(new CustomEvent("routePageReady"));

    if ((window as unknown as { routeTransition?: unknown }).routeTransition) {
      const reveal = () => gsap.set(el, { opacity: 1, y: 0 });
      window.addEventListener("routeTransitionExit", reveal, { once: true });
      const safety = setTimeout(reveal, 1500);
      return () => {
        window.removeEventListener("routeTransitionExit", reveal);
        clearTimeout(safety);
      };
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [pathname]);

  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>;
}
