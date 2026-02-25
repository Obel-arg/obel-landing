"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

// Service cards data — 6 cards
const SERVICE_CARDS = [
  {
    id: 1,
    title: "Product Design & Development",
    previewTitle: "Product Design and DVP",
    headline: "Technology built for real use.",
    includes: [
      "Product strategy and definition",
      "UX/UI design",
      "Custom platform and app development",
    ],
  },
  {
    id: 2,
    title: "AI Solutions",
    previewTitle: "AI Solutions",
    headline: "From experimentation to real adoption.",
    includes: [
      "Use case identification and prioritization",
      "Custom AI models and workflows",
      "Process automation with AI",
    ],
  },
  {
    id: 3,
    title: "Process Mapping & Optimization",
    previewTitle: "Process Mapping and Optimization",
    headline: "Make the invisible visible.",
    includes: [
      "Operational diagnostics",
      "Process mapping and prioritization",
      "Opportunity identification for automation",
    ],
  },
  {
    id: 4,
    title: "Branding",
    previewTitle: "Branding",
    headline: "Identity that speaks before you do.",
    includes: [
      "Brand strategy and positioning",
      "Visual identity and design systems",
      "Brand guidelines and documentation",
    ],
  },
  {
    id: 5,
    title: "CTO as a Service",
    previewTitle: "CTO as a Service",
    headline: "Strategic tech leadership, on demand.",
    includes: [
      "Technology strategy and roadmap",
      "Architecture and infrastructure decisions",
      "Team mentoring and vendor management",
    ],
  },
  {
    id: 6,
    title: "Implementation & Adoption (OBEL Hub)",
    previewTitle: "OBEL Hub",
    headline: "Technology only matters when it's used.",
    includes: [
      "Workflow integration and rollout support",
      "Training through real use cases",
      "Continuous improvement and optimization",
    ],
  },
];

const ACTIVE_COLOR = "#090E19";
const COLLAPSED_COLORS: Record<number, string> = {
  1: "rgba(9, 14, 25, 0.92)",
  2: "rgba(9, 14, 25, 0.84)",
  3: "rgba(9, 14, 25, 0.76)",
  4: "rgba(9, 14, 25, 0.68)",
  5: "rgba(9, 14, 25, 0.60)",
  6: "#72052f",
};

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      id="services"
      data-scroll-offset="8vh"
      className="below-fold relative bg-background py-24 md:py-32 lg:py-44 xl:py-56"
    >
      {/* Title */}
      <h2 className="font-neuebit text-primary text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[clamp(96px,8vw,140px)] tracking-tight leading-none mb-8 md:mb-12 lg:mb-16">
        Our Services
      </h2>

      {/* Card row — entrance animation with delay */}
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="w-full px-4 md:px-8 lg:px-16"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col lg:flex-row w-full items-center justify-center gap-1 lg:gap-2"
        >
        {SERVICE_CARDS.map((service, i) => {
          const isActive = i === activeIndex;

          return (
            <motion.div
              key={service.id}
              className="relative overflow-hidden rounded-xl lg:rounded-2xl"
              animate={{
                width: isDesktop
                  ? isActive
                    ? "40rem"
                    : "6rem"
                  : "100%",
                height: isDesktop
                  ? "32rem"
                  : isActive
                    ? "24rem"
                    : "4rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveIndex(i)}
              onHoverStart={() => setActiveIndex(i)}
              style={{
                backgroundColor: COLLAPSED_COLORS[service.id],
              }}
            >
              {/* Expanded content — fades in after card opens */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2, ease: "easeOut" } }}
                    exit={{ opacity: 0, transition: { duration: 0.1, ease: "easeIn" } }}
                    className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col"
                  >
                    {/* Service number */}
                    <span className="self-end font-neuebit text-xl md:text-2xl lg:text-4xl text-background/50">
                      {i + 1}
                    </span>

                    {/* Content */}
                    <div className="flex flex-col justify-center flex-1 gap-6 md:gap-8">
                      <div>
                        <h3 className="font-sans font-semibold text-background text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight leading-[1.05] mb-1.5 md:mb-3">
                          {service.title}
                        </h3>
                        <p className="font-sans text-background text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-tight">
                          {service.headline}
                        </p>
                      </div>

                      <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                        {service.includes.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2.5 md:gap-4"
                          >
                            <span
                              className="font-neuebit text-background text-lg sm:text-xl md:text-2xl lg:text-3xl leading-none shrink-0"
                              aria-hidden="true"
                            >
                              →
                            </span>
                            <span className="font-sans text-background text-xs sm:text-sm md:text-base lg:text-lg tracking-tight">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed label — fades in when inactive */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15, ease: "easeOut" } }}
                    exit={{ opacity: 0, transition: { duration: 0.1, ease: "easeIn" } }}
                    className="absolute inset-0 flex items-end justify-center pb-4 lg:pb-6"
                  >
                    <span className="font-neuebit text-white uppercase tracking-tight text-base sm:text-lg md:text-xl lg:text-[clamp(1rem,2.3vw,36px)] lg:[writing-mode:vertical-rl] lg:rotate-180 lg:origin-center">
                      {service.previewTitle}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </motion.div>
      </motion.div>
    </section>
  );
}
