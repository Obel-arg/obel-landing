"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Atropos from "atropos/react";

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
      "We craft brands that resonate with your audiencie and drive business growth. Strategy, visual identity, and design sistems that scale.",
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
}: {
  service: (typeof SERVICE_CARDS)[0];
}) {
  return (
    <div className="service-card min-w-[85vw] md:min-w-[80vw] lg:min-w-[75vw] h-full flex items-center justify-center px-4 md:px-8 lg:px-16 flex-shrink-0">
      <Atropos
        className="w-full max-w-4xl h-[75%]"
        rotateXMax={10}
        rotateYMax={10}
        shadow={false}
        highlight={false}
      >
        <div
          className="rounded-[27px] p-8 md:p-12 lg:p-16 h-full flex flex-col justify-between bg-[rgba(212,212,219,0.25)] backdrop-blur-[8px] border border-white/[0.12] supports-[not(backdrop-filter)]:bg-[#090E19]/60"
        >
          {/* Top: icon + title + headline */}
          <div>
            <Image
              src="/images/obel-mark.svg"
              alt=""
              width={60}
              height={28}
              className="w-10 md:w-12 lg:w-14 h-auto mb-8 brightness-0 invert"
              aria-hidden="true"
            />
            <h3 className="font-sans font-semibold text-[#FFFAF8] text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4">
              {service.title}
            </h3>
            <p className="font-sans text-[#FFFAF8] text-xl md:text-2xl lg:text-3xl tracking-tight leading-tight">
              {service.headline}
            </p>
          </div>

          {/* Bottom: description */}
          <p className="font-sans text-[#FFFAF8] text-base md:text-lg max-w-xl leading-relaxed mt-8">
            {service.description}
          </p>
        </div>
      </Atropos>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const snapCooldownRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // GSAP animations
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll for cards
      if (cardsContainerRef.current && carouselRef.current) {
        // xPercent is relative to offsetWidth (= viewport width), NOT total content width.
        // 4 cards × 75vw = 300vw total content. Need xPercent -300 to clear all cards left.
        // xPercent 200 = cards start 2× viewport widths right (generous bg intro ~40vh)
        // xPercent -300 = last card right edge at x=0 (exact exit)
        // Range 500 over 200vh effective scroll → ~30vh between card centers (matches original)
        const xStart = 105;
        const xEnd = -300;
        const xRange = xStart - xEnd;

        gsap.fromTo(
          carouselRef.current,
          { xPercent: xStart },
          {
            xPercent: xEnd,
            immediateRender: true,
            ease: "none",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
              snap: {
                snapTo: (progress: number) => {
                  // Desktop only (>= lg breakpoint)
                  if (window.innerWidth < 1024) return progress;

                  // Cooldown: skip snap if recently completed one
                  if (snapCooldownRef.current) return progress;

                  const carousel = carouselRef.current;
                  if (!carousel) return progress;

                  // Fresh measurements on every call (handles resize)
                  const cards = Array.from(carousel.children) as HTMLElement[];
                  const elWidth = carousel.offsetWidth;
                  const vw = window.innerWidth;
                  const viewportCenter = vw / 2;

                  // Current xPercent at this progress
                  const currentXPercent = xStart - xRange * progress;
                  const translatePx = (currentXPercent / 100) * elWidth;

                  let bestProgress = progress;
                  let bestDist = Infinity;

                  for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    const cardLeft = card.offsetLeft + translatePx;
                    const cardRight = cardLeft + card.offsetWidth;

                    // 20% visibility threshold — skip cards barely in view
                    const visibleWidth = Math.max(
                      0,
                      Math.min(cardRight, vw) - Math.max(cardLeft, 0)
                    );
                    if (visibleWidth / card.offsetWidth < 0.2) continue;

                    // Distance from card center to viewport center
                    const cardCenter = cardLeft + card.offsetWidth / 2;
                    const dist = Math.abs(cardCenter - viewportCenter);

                    if (dist < bestDist) {
                      bestDist = dist;
                      // Compute the progress that centers this card
                      const targetXPercent =
                        ((viewportCenter - card.offsetLeft - card.offsetWidth / 2) /
                          elWidth) *
                        100;
                      bestProgress = Math.max(
                        0,
                        Math.min(1, (xStart - targetXPercent) / xRange)
                      );
                    }
                  }

                  return bestProgress;
                },
                duration: { min: 0.8, max: 1.4 },
                delay: 0.15,
                ease: "power1.inOut",
                onComplete: () => {
                  snapCooldownRef.current = true;
                  setTimeout(() => {
                    snapCooldownRef.current = false;
                  }, 700);
                },
              },
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Reduced motion fallback - vertical stack with dark theme
  if (prefersReducedMotion) {
    return (
      <section id="services" data-header-transparent className="below-fold relative py-24 md:py-32 overflow-hidden bg-[#090E19]">
        {/* Background image - static for reduced motion */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="/images/back.jpeg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-[#090E19]/30" />
        </div>

        {/* Cards in vertical stack */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 space-y-8">
          {SERVICE_CARDS.map((service) => (
            <div
              key={service.id}
              className="rounded-[27px] p-8 md:p-12 bg-[rgba(212,212,219,0.25)] backdrop-blur-[8px] border border-white/[0.12] supports-[not(backdrop-filter)]:bg-[#090E19]/60"
            >
              <Image
                src="/images/obel-mark.svg"
                alt=""
                width={60}
                height={28}
                className="w-10 md:w-12 h-auto mb-6 brightness-0 invert"
                aria-hidden="true"
              />
              <h3 className="font-sans font-semibold text-[#FFFAF8] text-2xl md:text-3xl tracking-tight mb-4">
                {service.title}
              </h3>
              <p className="font-sans text-[#FFFAF8] text-xl md:text-2xl tracking-tight mb-6 leading-tight">
                {service.headline}
              </p>
              <p className="font-sans text-[#FFFAF8] text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={sectionRef} data-header-transparent className="below-fold relative bg-[#090E19]">
      {/* Scroll trigger container — 500vh = 400vh effective scroll for slower pace */}
      <div
        ref={cardsContainerRef}
        className="relative z-10"
        style={{
          height: '500vh',
        }}
      >
        {/* Sticky viewport — pins at top: 0 so background covers full screen including behind header */}
        <div
          className="sticky overflow-hidden"
          style={{
            top: 0,
            height: '100vh',
          }}
        >
          {/* Background image - inside sticky so it stays fixed while scrolling */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/back.jpeg"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={85}
            />
            {/* Dark overlay for glassmorphism contrast */}
            <div className="absolute inset-0 bg-[#090E19]/30" />
          </div>

          {/* Horizontal carousel - padded below header */}
          <div
            ref={carouselRef}
            className="relative z-10 flex h-full"
            style={{
              willChange: "transform",
              paddingTop: 'var(--header-height)',
            }}
          >
            {SERVICE_CARDS.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
