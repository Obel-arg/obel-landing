"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { ANIMATION_EASE } from "@/lib/constants";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative h-screen w-full overflow-hidden">
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
        <Reveal delay={0.2}>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-center tracking-tight">
            OBEL
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-center max-w-md opacity-80">
            AI-first digital studio
          </p>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: ANIMATION_EASE }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
        </motion.div>
      </motion.div>
    </section>
  );
}
