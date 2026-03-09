"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollTextReveal } from "@/components/motion/ScrollTextReveal";

export function About() {
  return (
    <section id="about" data-section="about" className="below-fold relative min-h-dvh flex flex-col justify-center py-20 md:py-24 lg:py-32">
      {/* Static OBEL pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'url("/images/pattern-obel.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.04,
        }}
      />

      <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:pl-[clamp(4rem,4.98vw,86px)] xl:pr-4 flex flex-col">
        {/* Title block */}
        <ScrollTextReveal className="flex flex-col">
          <div>
            <h2 className="font-neuebit text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[clamp(5.5rem,6.42vw,111px)] leading-[0.67] tracking-[-0.023em] xl:max-w-[65vw] text-balance md:whitespace-nowrap">
              We build the team. You run the business<span className="font-sans font-semibold text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem] xl:text-[clamp(3.5rem,3.65vw,63px)]">.</span>
            </h2>
            <p className="font-sans text-xl md:text-[1.75rem] lg:text-[2.75rem] xl:text-[clamp(2.75rem,3.3vw,57px)] leading-[1.15] tracking-tight xl:max-w-[70vw] text-pretty pt-2">
              Every AI employee we create is shaped around your workflows, your tools, and how your team already operates. We stay until they're fully embedded and delivering real results — from hiring to performance, we're in&nbsp;it&nbsp;with&nbsp;you.
            </p>
          </div>
        </ScrollTextReveal>

        {/* OBEL decorative mark — centered in the gap between title and subtitle */}
        <Reveal>
          <Image
            src="/images/obel-mark.svg"
            alt=""
            width={100}
            height={46}
            className="w-14 md:w-18 lg:w-24 h-auto -scale-x-100 my-8 md:my-12 lg:my-14 xl:my-[clamp(3.5rem,3.47vw,60px)]"
            aria-hidden="true"
          />
        </Reveal>

        {/* Subtitle block: Highlighted phrase + Body paragraph */}
        <Reveal>
          <div className="space-y-1.5 xl:max-w-[70vw]">
            <p className="font-sans font-medium text-base md:text-lg lg:text-xl xl:text-[clamp(1.25rem,1.79vw,31px)] tracking-tight leading-normal">
              <mark
                className="bg-primary text-background px-1.5 py-1"
                style={{
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                We don&apos;t just deploy AI. We make it work.
              </mark>
            </p>
            <p className="font-sans text-sm md:text-base lg:text-lg xl:text-[clamp(1.125rem,1.62vw,28px)] tracking-tight leading-relaxed xl:max-w-[clamp(767px,69vw,1193px)] text-pretty">
              Obel is a team that works end to end: from designing AI agents and digital products to integrating them into real systems and daily operations. We don&apos;t believe in building technology that lives outside the business. What we create becomes part of how teams operate, make decisions, and move work forward.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
