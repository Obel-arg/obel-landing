"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If RouteTransition just handled the navigation, skip the fade-in
    // The pixel overlay already provides the reveal effect
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
