"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // GSAP intro timeline
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Create intro timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: -10,
      });

      // Animate sequence
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3, // Small initial delay for page load
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5" // Overlap with title animation
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.3"
        );

      // Continuous bounce animation for scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5, // Start after intro completes
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {prefersReducedMotion ? (
          // Static image for reduced motion
          <div
            className="absolute inset-0 bg-foreground/10"
            style={{
              backgroundImage: "url(/videos/hero-poster.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/videos/hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <h1
          ref={titleRef}
          className="hero-title font-serif text-5xl md:text-7xl lg:text-8xl text-center tracking-tight"
        >
          OBEL
        </h1>

        <p
          ref={subtitleRef}
          className="hero-subtitle mt-4 md:mt-6 text-lg md:text-xl text-center max-w-md opacity-80"
        >
          AI-first digital studio
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60"
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
