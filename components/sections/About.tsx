"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SpotlightPattern } from "@/components/ui/SpotlightPattern";
import { LogoMarquee } from "@/components/ui/LogoMarquee";

export function About() {
  return (
    <section id="about" className="below-fold relative min-h-screen py-24 md:py-32">
      <SpotlightPattern className="absolute inset-0" />

      {/* Content aligned with header padding (matching logo position) */}
      {/* Use flex to push Trusted by to the bottom */}
      <div className="relative z-10 px-4 min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-16rem)] flex flex-col justify-between">
        {/* Top content: Title and Subtitle */}
        <Stagger className="space-y-6 lg:space-y-10">
          {/* Main Headline - large, bold, fills 2 lines on desktop */}
          <h2 className="font-serif font-normal text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4rem] tracking-[-0.02em] leading-[1.08]">
            Obel is an AI-first digital studio and branding
            <br className="hidden lg:block" />
            {" "}partner built for teams that move fast.
          </h2>

          {/* Supporting Paragraph - smaller, regular weight, fills 2 lines on desktop */}
          <p className="font-sans font-normal text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-[1.35rem] tracking-normal opacity-70 leading-[1.5]">
            We work with ambitious startups, scale-ups, and brands to craft sharp identities and high-performing
            <br className="hidden lg:block" />
            {" "}digital experiences powered by agents, strategy, design, and technology working as one.
          </p>
        </Stagger>

        {/* Bottom content: Trusted By Section - pushed to bottom, close to Featured Projects */}
        <div className="mt-auto">
          <Reveal>
            <h3 className="font-sans font-semibold text-xl md:text-2xl mb-6">
              Trusted by
            </h3>
          </Reveal>

          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
