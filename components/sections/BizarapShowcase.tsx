"use client";

import Image from "next/image";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function BizarapShowcase() {
  return (
    <section id="works" className="relative overflow-hidden bg-background pt-20 md:pt-24 lg:pt-32">
      <MacbookScroll
        src="/images/projects/bizarrap-screen.png"
        showGradient={false}
        title={
          <div className="flex flex-col items-center text-center">
            <span className="font-neuebit text-foreground text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.8]">
              Featured Projects:
            </span>
            <span className="font-sans text-foreground font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mt-3 md:mt-4">
              Landing page Bizarrap
            </span>
          </div>
        }
        badge={
          <Image
            src="/images/logo-icon.svg"
            alt="OBEL"
            width={40}
            height={40}
            className="h-10 w-10 -rotate-12 transform brightness-0 invert"
          />
        }
      />
    </section>
  );
}
