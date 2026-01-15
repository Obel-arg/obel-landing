"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { HEADER_HEIGHT } from "@/lib/constants";

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


function ServiceCard({ service, index }: { service: (typeof SERVICE_CARDS)[0]; index: number }) {
  return (
    <div className="min-w-[85vw] md:min-w-[80vw] lg:min-w-[75vw] h-full flex items-center justify-start px-4 md:px-8 lg:px-16 flex-shrink-0">
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
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll progress for the cards container
  const { scrollYProgress } = useScroll({
    target: cardsContainerRef,
    offset: ["start start", "end end"],
  });

  // Almost no gap then horizontal scroll
  // Scroll stops when card 3 exits, card 4's left margin = gap between cards
  const finalPosition = 215;

  const cardsX = useTransform(
    scrollYProgress,
    [0, 0.001, 1],
    ["100%", "100%", `-${finalPosition}%`]
  );

  // Fade in immediately
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0, 0.001, 0.02],
    [0, 0, 1]
  );

  // If reduced motion, render as vertical stack
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
    <section id="services">
      {/* Part 1: Intro - Normal scroll with clip reveal from bottom */}
      <div className="flex flex-col px-4 pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24">
        {/* Title - clip container for reveal effect */}
        <div className="overflow-hidden">
          <motion.h2
            className="font-sans font-semibold text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl tracking-tight"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            What we do —
          </motion.h2>
        </div>

        {/* Subtitle - same clip reveal effect as title */}
        <div className="overflow-hidden flex justify-end mt-12 md:mt-16 lg:mt-20">
          <motion.p
            className="font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tight max-w-md md:max-w-lg lg:max-w-xl text-right leading-tight"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            We deliver end-to-end solutions built for scale and performance.
          </motion.p>
        </div>
      </div>

      {/* Part 2: Cards - Horizontal carousel */}
      <div
        ref={cardsContainerRef}
        style={{
          // Height calibrated so last card centers exactly at end of scroll
          // Then immediately transitions to vertical scroll
          height: `${(SERVICE_CARDS.length - 0.5) * 100}vh`,
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
          <motion.div
            className="flex h-full"
            style={{
              x: cardsX,
              opacity: cardsOpacity,
            }}
          >
            {SERVICE_CARDS.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
