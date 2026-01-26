"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion";
import { HEADER_HEIGHT } from "@/lib/constants";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Service cards data - 4 cards
const SERVICE_CARDS = [
  {
    id: 1,
    title: "Brand Strategy & Design",
    headline: "Sharp identities that stand out.",
    description:
      "We craft brands that resonate with your audience and drive business growth. Strategy, visual identity, and design systems that scale.",
  },
  {
    id: 2,
    title: "Digital Experience",
    headline: "High-performing digital products.",
    description:
      "Web platforms, applications, and digital experiences designed for conversion and built for performance.",
  },
  {
    id: 3,
    title: "AI Integration",
    headline: "AI-powered solutions for modern teams.",
    description:
      "Custom AI agents, automation workflows, and intelligent systems that enhance your operations.",
  },
  {
    id: 4,
    title: "Growth & Analytics",
    headline: "Data-driven decisions at scale.",
    description:
      "Performance tracking, conversion optimization, and analytics infrastructure that drives measurable business outcomes.",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICE_CARDS)[0];
  index: number;
}) {
  return (
    <div className="service-card min-w-[85vw] md:min-w-[80vw] lg:min-w-[75vw] h-full flex items-center justify-start px-4 md:px-8 lg:px-16 flex-shrink-0">
      <div className="bg-foreground/5 rounded-lg p-8 md:p-12 lg:p-16 w-full max-w-5xl h-[70%] flex flex-col justify-between border border-foreground/10">
        <div>
          <span className="font-sans text-sm font-medium opacity-50 mb-4 block">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-sans font-semibold text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4">
            {service.title}
          </h3>
          <p className="font-sans text-xl md:text-2xl lg:text-3xl tracking-tight opacity-90 leading-tight">
            {service.headline}
          </p>
        </div>
        <p className="font-sans text-base md:text-lg opacity-70 max-w-xl leading-relaxed mt-8">
          {service.description}
        </p>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // GSAP animations
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    // Shared animation config - change once, applies to both title & subtitle
    const revealAnimation = {
      from: { yPercent: 150, opacity: 0 },
      to: { yPercent: 0, opacity: 1, duration: 1.8, ease: "power3.out" },
    };

    const ctx = gsap.context(() => {
      // Title Y-translate reveal animation
      if (titleRef.current) {
        const titleAnim = gsap.fromTo(
          titleRef.current,
          revealAnimation.from,
          { ...revealAnimation.to, paused: true }
        );

        ScrollTrigger.create({
          trigger: titleRef.current.parentElement,
          start: "top 90%",
          onEnter: () => titleAnim.restart(),
          onEnterBack: () => titleAnim.restart(),
          onLeave: () => titleAnim.progress(0).pause(),
          onLeaveBack: () => titleAnim.progress(0).pause(),
        });
      }

      // Subtitle Y-translate reveal animation
      if (subtitleRef.current) {
        const subtitleAnim = gsap.fromTo(
          subtitleRef.current,
          revealAnimation.from,
          { ...revealAnimation.to, paused: true }
        );

        ScrollTrigger.create({
          trigger: subtitleRef.current.parentElement,
          start: "top 90%",
          onEnter: () => subtitleAnim.restart(),
          onEnterBack: () => subtitleAnim.restart(),
          onLeave: () => subtitleAnim.progress(0).pause(),
          onLeaveBack: () => subtitleAnim.progress(0).pause(),
        });
      }

      // Horizontal scroll for cards
      if (cardsContainerRef.current && carouselRef.current) {
        const finalPosition = 215; // Percentage to scroll to

        // Use gsap.fromTo with ScrollTrigger for cleaner animation
        gsap.fromTo(
          carouselRef.current,
          { xPercent: 100 },
          {
            xPercent: -finalPosition,
            ease: "none",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: `top ${HEADER_HEIGHT}px`,
              // End exactly when sticky releases - scrub smoothing prevents diagonal movement
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Reduced motion fallback - vertical stack
  if (prefersReducedMotion) {
    return (
      <section id="services" className="py-24 md:py-32">
        <div className="px-4">
          <Reveal>
            <h2 className="font-sans font-semibold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-16">
              What we do —
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-sans text-xl md:text-2xl lg:text-3xl tracking-tight opacity-80 max-w-2xl mb-24 leading-tight">
              We deliver end-to-end solutions built for scale and performance.
            </p>
          </Reveal>

          <div className="space-y-16">
            {SERVICE_CARDS.map((service, index) => (
              <Reveal key={service.id}>
                <div className="bg-foreground/5 rounded-lg p-8 md:p-12 border border-foreground/10">
                  <span className="font-sans text-sm font-medium opacity-50 mb-4 block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight mb-4">
                    {service.title}
                  </h3>
                  <p className="font-sans text-xl md:text-2xl tracking-tight opacity-90 mb-6 leading-tight">
                    {service.headline}
                  </p>
                  <p className="font-sans text-lg opacity-70 max-w-2xl leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={sectionRef}>
      {/* Part 1: Intro */}
      <div className="flex flex-col px-4 pt-24 md:pt-32 lg:pt-40 pb-0">
        {/* Title - Y-translate reveal */}
        <div className="overflow-hidden">
          <h2
            ref={titleRef}
            className="font-serif text-7xl md:text-8xl lg:text-[140px] tracking-tight leading-[1.1]"
          >
            What we do —
          </h2>
        </div>

        {/* Subtitle - Y-translate reveal, right aligned */}
        <div className="overflow-hidden mt-40 md:mt-56 lg:mt-72">
          <p
            ref={subtitleRef}
            className="ml-auto max-w-xl font-serif text-2xl md:text-3xl lg:text-[42px] leading-tight tracking-tight"
          >
            We deliver end-to-end solutions built for scale and performance.
          </p>
        </div>
      </div>

      {/* Part 2: Cards - Horizontal carousel */}
      {/* Height creates the scroll distance + buffer at end to prevent diagonal movement */}
      <div
        ref={cardsContainerRef}
        style={{
          height: `${SERVICE_CARDS.length * 100}vh`,
        }}
      >
        <div
          className="sticky overflow-hidden"
          style={{
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          {/* Horizontal carousel - cards side by side */}
          <div ref={carouselRef} className="flex h-full">
            {SERVICE_CARDS.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
