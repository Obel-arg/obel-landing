"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  FOOTER_COLUMNS,
  HEADER_HEIGHT_SCROLLED,
} from "@/lib/constants";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const resize = () => {
      // Reset to a known base size for measurement
      text.style.fontSize = "100px";
      const textWidth = text.scrollWidth;
      const containerWidth = container.clientWidth;
      // Scale font size so text fills the full container width
      text.style.fontSize = `${(containerWidth / textWidth) * 100}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <footer>
      {/* Giant "obel" text section — light background */}
      <div
        ref={containerRef}
        className="w-full pb-[50vh]"
        style={{ paddingTop: HEADER_HEIGHT_SCROLLED }}
      >
        <Reveal>
          <h2
            ref={textRef}
            className="font-sans text-[30vw] leading-[0.85] tracking-tighter whitespace-nowrap select-none w-fit mx-auto"
          >
            obel
          </h2>
        </Reveal>
      </div>

      {/* Dark footer section */}
      <div className="bg-primary text-background">
        {/* Main content */}
        <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
            {/* Left: CTA + Email */}
            <div className="max-w-md">
              <Reveal>
                <h3 className="font-serif italic text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mb-10">
                  Get to know more about our work.
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-6"
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      className="w-full bg-transparent border border-[#FF4141] px-4 py-3 text-background placeholder:text-background/40 focus:outline-none focus:border-[#FF4141] transition-colors"
                    />
                    <p className="mt-2 text-xs text-[#FF4141]">
                      Must be valid email. example@yourdomain.com
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer px-8 py-3 bg-background text-foreground font-sans text-sm tracking-wide hover:bg-background/90 transition-colors"
                  >
                    Submit
                  </button>

                  <p className="text-sm text-background/50 leading-relaxed">
                    Learn more about how your information will be used in our{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-background/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </Reveal>
            </div>

            {/* Right: Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-8">
              {FOOTER_COLUMNS.map((column) => (
                <Reveal key={column.title}>
                  <div>
                    <h4 className="font-sans text-sm uppercase tracking-widest text-background/50 mb-6">
                      {column.title}
                    </h4>
                    <ul className="space-y-3">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="font-sans text-base hover:opacity-60 transition-opacity duration-300"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 md:px-10 lg:px-16 py-6 border-t border-background/10">
          <div className="flex items-center justify-between">
            <p className="font-sans text-sm text-background/50">
              Copyright &copy; {new Date().getFullYear()} Obel Labs LLC. All
              rights reserved
            </p>
            <button
              onClick={scrollToTop}
              className="cursor-pointer hidden md:flex items-center gap-2 px-4 py-2 border border-background/30 font-sans text-sm hover:bg-background/10 transition-colors"
            >
              Back to top
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8 13V3M8 3L3 8M8 3L13 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
