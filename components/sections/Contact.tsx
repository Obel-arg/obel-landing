"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Contact() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 95%",
              toggleActions: "play none none reset",
            },
          }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.15,
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
    <section id="contact" className="below-fold bg-primary text-background py-24 md:py-32 px-4">
      <div>
        <h2
          ref={titleRef}
          className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8"
        >
          Contact
        </h2>

        <div className="mt-16 md:mt-24 text-center">
          <div ref={subtitleRef}>
            <p className="font-sans text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              Let&#39;s make an impact together.
            </p>
            <a
              href="mailto:hello@obel.la"
              className="mt-4 inline-block font-sans font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight hover:opacity-60 transition-opacity duration-300"
            >
              hello@obel.la
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
