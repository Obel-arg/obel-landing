"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Contact() {
  const subtitleRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 95%",
              toggleActions: "play none none reset",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="contact" className="below-fold py-24 md:py-32 px-4">
      <div className="text-center" ref={subtitleRef}>
        <p className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl xl:text-[clamp(3rem,3.3vw,4.5rem)] tracking-tight leading-tight">
          From Argentina to your daily operations.
        </p>
        <p className="font-sans text-2xl md:text-3xl lg:text-4xl xl:text-[clamp(3rem,3.3vw,4.5rem)] tracking-tight leading-tight">
          Real solutions. Real adoption.
        </p>
        <button
          onClick={() => window.contactModal?.open()}
          className="mt-10 md:mt-14 inline-block font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight hover:opacity-60 transition-opacity duration-300 cursor-pointer"
        >
          hello@obel.la
        </button>
      </div>
    </section>
  );
}
