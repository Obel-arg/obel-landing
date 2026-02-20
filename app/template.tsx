"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

// Track whether this is the initial page load (reload / first visit)
// vs a subsequent SPA navigation
let isInitialLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect runs synchronously before paint — prevents flash of content
  // before animation applies opacity: 0
  const isomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  isomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // On initial page load, PixelTransition handles the reveal — skip fade-in
    if (isInitialLoad) {
      isInitialLoad = false;
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // If RouteTransition just handled the SPA navigation, skip the fade-in
    if (window.routeTransition) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
