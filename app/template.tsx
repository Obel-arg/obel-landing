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
      // Still signal ready in case RouteTransition is waiting
      window.dispatchEvent(new CustomEvent("routePageReady"));
      return;
    }

    // Signal that the new page has mounted and is ready to be revealed.
    // RouteTransition listens for this to start the exit dissolve.
    window.dispatchEvent(new CustomEvent("routePageReady"));

    // If RouteTransition is handling this SPA navigation, stay invisible
    // until the exit dissolve starts (prevents flash of content beneath canvas)
    if (window.routeTransition) {
      const reveal = () => {
        gsap.set(el, { opacity: 1, y: 0 });
      };
      window.addEventListener("routeTransitionExit", reveal, { once: true });

      // Safety: reveal if routeTransitionExit never fires
      const safety = setTimeout(reveal, 1500);

      return () => {
        window.removeEventListener("routeTransitionExit", reveal);
        clearTimeout(safety);
      };
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  // Start at opacity:0 to prevent flash — revealed by animation/event above
  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>;
}
