"use client";

import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";

// Hoisted outside component (rendering-hoist-jsx) — never recreated on re-render
function scrollToAbout() {
  const lenis = (
    window as unknown as {
      lenis?: {
        scrollTo: (
          target: string | number,
          opts?: { offset?: number; duration?: number }
        ) => void;
      };
    }
  ).lenis;
  if (lenis) {
    const target = document.querySelector("#about");
    const distance = target
      ? Math.abs(target.getBoundingClientRect().top)
      : window.innerHeight;
    const duration = Math.min(4.5, Math.max(1.5, distance / 1200));
    lenis.scrollTo("#about", { offset: -72, duration });
  }
}

function openContact() {
  (window as unknown as { contactModal?: { open: () => void } }).contactModal?.open();
}

// Hoisted scroll arrow SVG (rendering-hoist-jsx)
const scrollArrowSvg = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 5V19M12 19L5 12M12 19L19 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Hero() {
  return (
    <section
      className="relative bg-background overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* ── Text content + CTA ── */}
      <div className="relative z-10 flex flex-col items-center text-center justify-center h-full pb-[20vh] md:pb-0 md:justify-start md:h-auto md:absolute md:inset-0 md:pt-[calc(var(--header-height)+10vh)] px-6 md:px-0">
        {/* Heading — mobile: "Digital products...", desktop: "Products..." */}
        <h1 className="font-neuebit text-[min(16vw,27vh)] md:text-[min(10vw,17vh)] leading-[0.64] md:leading-[0.72] tracking-[-0.05em] text-primary max-w-[85vw] md:max-w-[74vw]">
          <span className="md:hidden">Digital products</span>
          <span className="hidden md:inline">Products</span>
          {" "}shaped by people,{" "}
          powered by tech.
        </h1>

        {/* Subtitle */}
        <p className="font-sans font-medium text-sm md:text-[23px] tracking-[-0.02em] text-primary mt-3 md:mt-5 leading-[1.4]">
          From complex operations to digital products
          <br className="hidden md:block" />
          {" "}that support how your business really runs.
        </p>

        {/* ── CTA + Hands Composition (locked alignment) ── */}
        <div className="relative mt-14 md:mt-40">
          {/* CTA Button */}
          <InteractiveHoverButton
            onClick={openContact}
            className="relative z-10 bg-primary text-background text-[16px] md:text-[20px] rounded-[10px] md:rounded-[13px] px-5 md:px-6 py-3 md:py-[14px] border border-white/10 hover:text-primary"
            hoverColor="#FFFAF8"
          >
            Get in Touch
          </InteractiveHoverButton>

          {/* Desktop hands — anchored to CTA center */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(1000px,105vw,2100px)] max-w-none pointer-events-none">
            <Image
              src="/images/hero-image.webp"
              alt=""
              width={1675}
              height={442}
              priority
              sizes="(max-width: 767px) 1px, clamp(1000px, 105vw, 2100px)"
              className="w-full h-auto"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ── Mobile hands ── */}
      <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-[5] w-[170%] max-w-none pointer-events-none">
        <Image
          src="/images/hero-image.webp"
          alt=""
          width={1675}
          height={442}
          priority
          sizes="(max-width: 767px) 170vw, 1px"
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>

      {/* ── Scroll arrow ── */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer p-3 text-primary"
        aria-label="Scroll down"
      >
        {scrollArrowSvg}
      </button>
    </section>
  );
}
