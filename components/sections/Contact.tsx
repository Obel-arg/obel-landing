"use client";

import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  return (
    <section id="contact" className="below-fold py-24 md:py-32 px-4">
      <div>
        <Reveal>
          <h2 className="font-sans font-semibold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">
            Contact
          </h2>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <Reveal delay={0.1}>
            <p className="font-sans text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              Let's make an impact together.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="mailto:hello@obel.la"
              className="mt-4 inline-block font-sans font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight hover:opacity-60 transition-opacity duration-300"
            >
              hello@obel.la
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
