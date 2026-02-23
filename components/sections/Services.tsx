"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Atropos from "atropos/react";

// Service cards data - 4 cards
const SERVICE_CARDS = [
  {
    id: 1,
    title: "Product Design & Development",
    headline: "Technology built for real use.",
    description:
      "We design and build digital products that solve operational problems and scale with your organization. From concept to launch, focused on performance, usability and real impact.",
    includes: [
      "Product strategy and definition",
      "UX/UI design",
      "Custom platform and app development",
      "AI integration and automation",
      "Scalable cloud architecture",
    ],
  },
  {
    id: 2,
    title: "AI Solutions",
    headline: "From experimentation to real adoption.",
    description:
      "We turn artificial intelligence into practical tools for everyday work. Our focus is not only on building AI, but on making it useful, reliable and integrated into real workflows.",
    includes: [
      "Use case identification and prioritization",
      "Custom AI models and workflows",
      "Process automation with AI",
      "Data analysis and decision support",
      "Responsible and human-centered implementation",
    ],
  },
  {
    id: 3,
    title: "Implementation & Adoption (OBEL Hub)",
    headline: "Technology only matters when it's used.",
    description:
      "We work with teams to integrate new solutions into their daily operations, removing friction and building sustainable habits.",
    includes: [
      "Workflow integration and rollout support",
      "Friction and usage analysis",
      "Training through real use cases",
      "Development of AI-driven skills",
      "Continuous improvement and optimization",
    ],
  },
  {
    id: 4,
    title: "Process Mapping & Optimization",
    headline: "Make the invisible visible.",
    description:
      "We analyze operations to detect bottlenecks, inefficiencies and opportunities where technology and AI can create real value.",
    includes: [
      "Operational diagnostics",
      "Process mapping and prioritization",
      "Opportunity identification for automation",
      "Impact and feasibility analysis",
      "Actionable implementation roadmap",
    ],
  },
];

function ServiceCard({
  service,
}: {
  service: (typeof SERVICE_CARDS)[0];
}) {
  return (
    <div className="service-card w-[60vw] sm:w-[60vw] md:w-[65vw] lg:w-[60vw] min-w-[60vw] sm:min-w-[60vw] md:min-w-[65vw] lg:min-w-[60vw] h-full flex items-center justify-center px-2 md:px-8 lg:px-12 xl:px-16 flex-shrink-0">
      <Atropos
        className="w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl"
        rotateXMax={10}
        rotateYMax={10}
        rotateTouch={false}
        shadow={false}
        highlight={false}
      >
        <div
          className="service-card-inner rounded-2xl md:rounded-[27px] p-5 sm:p-7 md:p-10 lg:p-14 xl:p-18 flex flex-col gap-6 md:gap-8 lg:gap-10 bg-[rgba(9,14,25,0.74)] border-[0.5px] border-white/20 overflow-clip"
        >
          {/* Title + headline */}
          <div>
            <h3 className="font-sans font-semibold text-[#FFFAF8] text-lg sm:text-xl md:text-3xl lg:text-4xl tracking-tight mb-1 sm:mb-2 md:mb-3">
              {service.title}
            </h3>
            <p className="font-sans text-[#FFFAF8] text-base sm:text-lg md:text-2xl lg:text-3xl tracking-tight leading-tight">
              {service.headline}
            </p>
          </div>

          {/* Arrow list */}
          <ul className="space-y-2 sm:space-y-3 md:space-y-4">
            {service.includes.map((item, i) => (
              <li key={i} className="flex items-center gap-3 md:gap-5">
                <span className="font-neuebit text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none shrink-0" aria-hidden="true">
                  →
                </span>
                <span className="font-sans text-[#FFFAF8] text-sm sm:text-base md:text-lg lg:text-xl tracking-tight">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Atropos>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const snapCooldownRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Refs for dynamic xPercent values — snap closure reads the latest values
  const xStartRef = useRef(125);
  const xEndRef = useRef(-340);
  const xRangeRef = useRef(465);

  // Equalize card heights — all cards match the tallest one
  useGSAP(
    () => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const equalize = () => {
        const cards = carousel.querySelectorAll<HTMLElement>('.service-card-inner');
        cards.forEach(c => { c.style.minHeight = ''; });
        let max = 0;
        cards.forEach(c => { max = Math.max(max, c.scrollHeight); });
        cards.forEach(c => { c.style.minHeight = `${max}px`; });
      };

      equalize();
      window.addEventListener('resize', equalize);
      return () => window.removeEventListener('resize', equalize);
    },
    { scope: carouselRef }
  );

  // GSAP animations with responsive breakpoints
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // Fade out "Our Services" title — same across all breakpoints
      if (titleRef.current && cardsContainerRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top top",
              end: "15% top",
              scrub: true,
            },
          }
        );
      }

      // Horizontal scroll — responsive via matchMedia
      // Animations auto-revert and re-create on breakpoint change (e.g. phone rotation)
      if (cardsContainerRef.current && carouselRef.current) {
        const computeXEnd = () => {
          const cards = Array.from(carouselRef.current!.children) as HTMLElement[];
          const totalContentWidth = cards.reduce((sum, card) => sum + card.offsetWidth, 0);
          const viewportWidth = window.innerWidth;
          return -(totalContentWidth / viewportWidth) * 100 - 5;
        };

        const createCarousel = (xStart: number) => {
          const xEnd = computeXEnd();
          xStartRef.current = xStart;
          xEndRef.current = xEnd;
          xRangeRef.current = xStart - xEnd;

          gsap.fromTo(
            carouselRef.current!,
            { xPercent: xStart },
            {
              xPercent: xEnd,
              immediateRender: true,
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current!,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
                invalidateOnRefresh: true,
                onRefresh: () => {
                  const newEnd = computeXEnd();
                  xStartRef.current = xStart;
                  xEndRef.current = newEnd;
                  xRangeRef.current = xStart - newEnd;
                },
                snap: {
                  snapTo: (progress: number) => {
                    const carousel = carouselRef.current;
                    if (!carousel) return progress;

                    const currentXStart = xStartRef.current;
                    const currentXRange = xRangeRef.current;

                    const cards = Array.from(carousel.children) as HTMLElement[];
                    const elWidth = carousel.offsetWidth;
                    const vw = window.innerWidth;
                    const viewportCenter = vw / 2;

                    const currentXPercent = currentXStart - currentXRange * progress;
                    const translatePx = (currentXPercent / 100) * elWidth;

                    const firstCard = cards[0];
                    const lastCard = cards[cards.length - 1];
                    const firstVisualCenter = firstCard.offsetLeft + firstCard.offsetWidth / 2 + translatePx;
                    const lastVisualCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2 + translatePx;

                    if (lastVisualCenter < viewportCenter - lastCard.offsetWidth * 0.15) {
                      return 1;
                    }

                    if (firstVisualCenter > viewportCenter + firstCard.offsetWidth * 0.15) {
                      return 0;
                    }

                    if (snapCooldownRef.current) return progress;

                    let bestProgress = progress;
                    let bestDist = Infinity;

                    for (let i = 0; i < cards.length; i++) {
                      const card = cards[i];
                      const cardLeft = card.offsetLeft + translatePx;
                      const cardRight = cardLeft + card.offsetWidth;

                      const visibleWidth = Math.max(
                        0,
                        Math.min(cardRight, vw) - Math.max(cardLeft, 0)
                      );
                      if (visibleWidth / card.offsetWidth < 0.2) continue;

                      const cardCenter = cardLeft + card.offsetWidth / 2;
                      const dist = Math.abs(cardCenter - viewportCenter);

                      if (dist < bestDist) {
                        bestDist = dist;
                        const targetXPercent =
                          ((viewportCenter - card.offsetLeft - card.offsetWidth / 2) /
                            elWidth) *
                          100;
                        bestProgress = Math.max(
                          0,
                          Math.min(1, (currentXStart - targetXPercent) / currentXRange)
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
        };

        const mm = gsap.matchMedia();

        // Mobile: larger xStart for more intro space before first card
        mm.add("(max-width: 1023px)", () => {
          createCarousel(150);
        });

        // Desktop: tighter xStart
        mm.add("(min-width: 1024px)", () => {
          createCarousel(105);
        });
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  // Reduced motion fallback - vertical stack with dark theme
  if (prefersReducedMotion) {
    return (
      <section id="services" data-header-transparent className="below-fold relative py-24 md:py-32 overflow-hidden bg-[#090E19]">
        {/* Background image - static for reduced motion */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="/images/back.webp"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-[#090E19]/30" />
        </div>

        {/* Title */}
        <div className="relative z-10 flex items-center justify-center py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <h2 className="font-neuebit text-[#FFFAF8] text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] tracking-tight leading-none">
              Our Services
            </h2>
            <span className="font-neuebit text-[#FFFAF8] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none select-none" aria-hidden="true">→</span>
          </div>
        </div>

        {/* Cards in vertical stack */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 space-y-6 sm:space-y-8">
          {SERVICE_CARDS.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl md:rounded-[27px] p-5 sm:p-7 md:p-10 lg:p-14 xl:p-18 flex flex-col gap-6 md:gap-8 lg:gap-10 bg-[rgba(9,14,25,0.74)] border-[0.5px] border-white/20 overflow-clip"
            >
              <div>
                <h3 className="font-sans font-semibold text-[#FFFAF8] text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2 sm:mb-3 md:mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-[#FFFAF8] text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight leading-tight">
                  {service.headline}
                </p>
              </div>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 md:gap-5">
                    <span className="font-neuebit text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none shrink-0" aria-hidden="true">
                      →
                    </span>
                    <span className="font-sans text-[#FFFAF8] text-sm sm:text-base md:text-lg lg:text-xl tracking-tight">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={sectionRef} data-header-transparent data-scroll-offset="8vh" className="contain-animated relative bg-[#090E19]">
      {/* Scroll trigger container — responsive height: 400vh mobile, 500vh desktop */}
      <div
        ref={cardsContainerRef}
        className="relative z-10 h-[350vh] md:h-[400vh] lg:h-[500vh]"
      >
        {/* Sticky viewport — pins at top: 0 so background covers full screen including behind header.
             suppressHydrationWarning: GSAP (PerspectiveTransition) applies inline transform
             properties (translate, rotate, scale) via immediateRender before React hydrates. */}
        <div
          className="sticky overflow-hidden"
          suppressHydrationWarning
          style={{
            top: '0px',
            height: '100dvh',
          }}
        >
          {/* Background image - hidden on mobile (solid bg-[#090E19] shows instead) */}
          <div className="absolute inset-0 z-0 hidden md:block" aria-hidden="true">
            <Image
              src="/images/back.webp"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 767px) 0px, 100vw"
              quality={85}
            />
            {/* Dark overlay for glassmorphism contrast */}
            <div className="absolute inset-0 bg-[#090E19]/30" />
          </div>

          {/* "Our Services" title — visible before cards scroll in */}
          <div
            ref={titleRef}
            className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none"
            style={{ paddingTop: 'var(--header-height)' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <h2 className="font-neuebit text-[#FFFAF8] text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] tracking-tight leading-none">
                Our Services
              </h2>
              <span className="font-neuebit text-[#FFFAF8] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none select-none" aria-hidden="true">→</span>
            </div>
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
