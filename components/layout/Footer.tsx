"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  FOOTER_COLUMNS,
  getComputedHeaderHeight,
} from "@/lib/constants";

function scrollToTop() {
  const lenis = (
    window as unknown as {
      lenis?: {
        scrollTo: (
          target: number,
          opts?: { duration?: number }
        ) => void;
      };
    }
  ).lenis;
  if (lenis) {
    const distance = window.scrollY;
    const duration = Math.min(4.5, Math.max(2, distance / 1200));
    lenis.scrollTo(0, { duration });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function Footer() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const patternRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });


  // Preload pattern image so it's ready before first hover
  useEffect(() => {
    const img = new Image();
    img.src = "/images/pattern-obel.png";
  }, []);


  // Cursor spotlight — rAF loop with lerp (same pattern as SpotlightPattern)
  const updateSpotlight = useCallback(() => {
    if (!patternRef.current) return;

    const ease = 0.12;
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

    patternRef.current.style.setProperty("--x", `${currentPos.current.x}px`);
    patternRef.current.style.setProperty("--y", `${currentPos.current.y}px`);

    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = textRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    targetPos.current.x = e.clientX - rect.left;
    targetPos.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const el = textRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetPos.current = { x, y };
      currentPos.current = { x, y };
    }
    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, [updateSpotlight]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // Move spotlight offscreen
    if (patternRef.current) {
      patternRef.current.style.setProperty("--x", "-200px");
      patternRef.current.style.setProperty("--y", "-200px");
    }
  }, []);

  // Attach mouse listeners to the h2
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <footer>
      {/* Dark footer section */}
      <div data-header-dark className="bg-primary text-background"
        style={{ paddingTop: 'var(--header-height-scrolled)' }}
      >
        {/* Main content */}
        <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
            {/* Left: CTA + Email */}
            <div className="max-w-md">
              <Reveal>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mb-10">
                  Get to know more<br />about our work.
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <button
                  onClick={() => window.contactModal?.open()}
                  className="cursor-pointer w-full text-left bg-transparent border border-background/30 px-4 py-3 text-background/40 font-sans text-base hover:border-background/50 transition-colors"
                >
                  Email Address *
                </button>
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
                            onClick={(e) => {
                              if (link.href.startsWith("#")) {
                                e.preventDefault();
                                const lenis = (
                                  window as unknown as {
                                    lenis?: {
                                      scrollTo: (
                                        target: string | number,
                                        opts?: {
                                          offset?: number;
                                          duration?: number;
                                        }
                                      ) => void;
                                    };
                                  }
                                ).lenis;
                                if (lenis) {
                                  const target =
                                    link.href === "#"
                                      ? null
                                      : document.querySelector(link.href);
                                  const dist = target
                                    ? Math.abs(
                                        target.getBoundingClientRect().top
                                      )
                                    : window.scrollY;
                                  const dur = Math.min(
                                    4.5,
                                    Math.max(2, dist / 1200)
                                  );
                                  lenis.scrollTo(
                                    link.href === "#" ? 0 : link.href,
                                    {
                                      offset:
                                        link.href === "#"
                                          ? 0
                                          : -getComputedHeaderHeight(),
                                      duration: dur,
                                    }
                                  );
                                }
                              }
                            }}
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
          <div className="flex items-center justify-end">
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

      {/* Giant "obel" text section — below footer */}
      <div
        data-header-dark
        className="w-full pt-12 bg-primary overflow-hidden"
      >
        <Reveal>
          <h2
            ref={textRef}
            className="relative font-sans text-[53vw] leading-[0.85] tracking-tighter whitespace-nowrap select-none w-fit text-background"
          >
            <span>obel</span>
            {/* Pattern overlay — revealed in a radial spotlight around cursor */}
            <span
              ref={patternRef}
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/pattern-obel.png')",
                backgroundSize: "800px auto",
                backgroundRepeat: "repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "grayscale(1) brightness(1.5)",
                maskImage:
                  "radial-gradient(circle 150px at var(--x, -200px) var(--y, -200px), black 0%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle 150px at var(--x, -200px) var(--y, -200px), black 0%, transparent 100%)",
              }}
            >
              obel
            </span>
          </h2>
        </Reveal>
        <p className="font-sans text-sm text-background/50 px-6 md:px-10 lg:px-16 pt-6 pb-8">
          Copyright &copy; {new Date().getFullYear()} Obel Labs LLC. All
          rights reserved
        </p>
      </div>
    </footer>
  );
}
