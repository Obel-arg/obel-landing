"use client";

import { Reveal } from "@/components/motion/Reveal";

const KEY_AREAS = [
  "Diagnosing real operational problems",
  "Supporting long-term adoption and cultural change",
  "Activating AI-driven ways of working",
] as const;

export function ObelHub() {
  return (
    <section className="below-fold bg-background px-4 sm:px-6 md:px-10 lg:px-16 pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-24 lg:pb-32">
      <Reveal>
        <div className="bg-[rgba(8,13,26,0.07)] rounded-2xl md:rounded-[32px] lg:rounded-[44px] px-6 sm:px-10 md:px-14 lg:px-20 pt-10 sm:pt-14 md:pt-16 lg:pt-20 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-20">
            {/* Left: Badge + Headline + Description */}
            <div className="xl:w-[55%] flex flex-col">
              {/* Headline area with overlapping badge */}
              <div className="relative pt-9 sm:pt-10 md:pt-11 lg:pt-12">
                {/* Obel HUB badge — absolutely positioned to overlap headline */}
                <div
                  className="absolute left-0 z-10 -rotate-[4deg]"
                  style={{ top: '6%' }}
                >
                  <div className="bg-[#72052f] rounded-[12px] md:rounded-[15px] lg:rounded-[19px] px-2.5 py-2 md:px-3 md:py-2.5 lg:px-3.5 lg:py-3 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] inline-flex items-end gap-0.5">
                    <img
                      src="/images/obel-hub-logo.svg"
                      alt="obel"
                      width={70}
                      height={28}
                      className="h-[22px] w-auto sm:h-[26px] md:h-[30px] lg:h-[34px]"
                    />
                    <span className="font-sans text-[#FFFBFA] text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-[-0.08em] leading-none">
                      hub
                    </span>
                  </div>
                </div>

                {/* Headline */}
                <h2 className="font-neuebit text-primary text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.3rem] tracking-[-0.04em] leading-[0.75] sm:leading-[0.85]">
                  Where pixels{" "}
                  <span className="relative inline-block align-baseline sm:mt-1.5 md:mt-2" style={{ transform: "rotate(-1.5deg)" }}>
                    <span
                      className="absolute bg-[#72052f] -z-10 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                      style={{
                        top: "12%",
                        bottom: "8%",
                        left: "0%",
                        right: "0%",
                      }}
                      aria-hidden="true"
                    />
                    <span className="relative font-sans font-medium text-[#FFFBFA] text-[1.5rem] sm:text-[1.9rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] tracking-[-0.04em] leading-none px-1 py-0.5 sm:py-1">
                      meet people
                    </span>
                  </span>
                </h2>
              </div>

              {/* Description */}
              <p className="mt-3 md:mt-4 font-sans text-primary text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[27px] tracking-[-0.04em] leading-[1.2]">
                Obel Hub helps organizations turn AI and digital products into real ways of working.
              </p>

              {/* Link — desktop only, pushed to bottom to align with 3rd key area */}
              <a
                href="https://www.obel.la/hub"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-block mt-auto mb-6 lg:mb-10 pt-4 lg:pt-6 font-sans text-primary text-base sm:text-lg md:text-xl lg:text-2xl tracking-[-0.04em] underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                More about Obel HUB
              </a>
            </div>

            {/* Right: Key Areas */}
            <div className="xl:w-[45%]">
              <p className="font-sans font-medium text-primary text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[27px] tracking-[-0.04em] leading-[1.2] mb-5 md:mb-7 lg:mb-8">
                We focus on three key areas:
              </p>

              <div>
                {KEY_AREAS.map((area, i) => (
                  <div key={i}>
                    {i > 0 && (
                      <div
                        className="h-[2px]"
                        style={{
                          backgroundImage: "repeating-linear-gradient(to right, rgba(114,5,47,0.35) 0px, rgba(114,5,47,0.35) 16px, transparent 16px, transparent 28px)",
                        }}
                      />
                    )}
                    <div className="flex items-center gap-3 md:gap-5 py-4 md:py-5 lg:py-6">
                      <span className="font-neuebit text-[#72052f] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[1] tracking-[-0.04em] shrink-0 w-[1.2em] text-center">
                        {i + 1}
                      </span>
                      <p className="font-sans text-primary text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[26px] tracking-[-0.04em] leading-[1.2]">
                        {area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link — mobile/tablet only, at bottom of card */}
          <a
            href="https://www.obel.la/hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block xl:hidden mt-4 sm:mt-6 md:mt-8 font-sans text-primary text-base sm:text-lg md:text-xl tracking-[-0.04em] underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
          >
            More about Obel HUB
          </a>
        </div>
      </Reveal>
    </section>
  );
}
