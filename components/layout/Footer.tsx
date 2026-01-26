"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { FOOTER_NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="min-h-screen flex flex-col">
      {/* Large OBEL Typography */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <Reveal>
          <h2 className="font-serif text-[20vw] md:text-[15vw] lg:text-[12vw] leading-none tracking-tighter select-none">
            obel
          </h2>
        </Reveal>
      </div>

      {/* Footer Content */}
      <div className="px-4 md:px-8 lg:px-16 py-12 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Navigation */}
            <Stagger className="space-y-3">
              {FOOTER_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight hover:opacity-60 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </Stagger>

            {/* Join & Contact */}
            <div className="space-y-6">
              <Reveal>
                <Link
                  href="#careers"
                  className="block font-serif text-2xl md:text-3xl tracking-tight hover:opacity-60 transition-opacity duration-300"
                >
                  Join the Obel team
                </Link>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="#contact"
                  className="block font-serif text-2xl md:text-3xl tracking-tight hover:opacity-60 transition-opacity duration-300"
                >
                  Contact us
                </Link>
              </Reveal>
            </div>

            {/* Spacer for larger screens */}
            <div className="hidden lg:block" />

            {/* Social Links & Copyright */}
            <div className="space-y-8">
              <Reveal>
                <div className="flex flex-wrap gap-4 font-serif text-xl md:text-2xl">
                  {SOCIAL_LINKS.map((link, index) => (
                    <span key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-60 transition-opacity duration-300"
                      >
                        {link.label}
                      </a>
                      {index < SOCIAL_LINKS.length - 1 && (
                        <span className="mx-2 opacity-40">,</span>
                      )}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="font-sans text-sm opacity-60">
                  &copy; Obel Labs LLC {new Date().getFullYear()} all rights reserved
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
