"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getComputedHeaderHeight } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Obel Hub", href: "https://www.obel.la/hub" },
];

const CHANNEL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/obel" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/obel-ar/" },
  { label: "X", href: "https://twitter.com/obel" },
];

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

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
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
    const target =
      href === "#" ? null : document.querySelector(href);
    const dist = target
      ? Math.abs(target.getBoundingClientRect().top)
      : window.scrollY;
    const dur = Math.min(4.5, Math.max(2, dist / 1200));
    lenis.scrollTo(href === "#" ? 0 : href, {
      offset: href === "#" ? 0 : -getComputedHeaderHeight(),
      duration: dur,
    });
  }
}

export function Footer() {
  const textRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const img = new window.Image();
    img.src = "/images/pattern-obel.png";
  }, [isDesktop]);

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
      targetPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      currentPos.current = { ...targetPos.current };
    }
    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, [updateSpotlight]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (patternRef.current) {
      patternRef.current.style.setProperty("--x", "-200px");
      patternRef.current.style.setProperty("--y", "-200px");
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const el = textRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <footer className="bg-background">
      {/* CTA Banner */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 pt-20 md:pt-24 lg:pt-32">
        <Reveal>
          <div className="relative bg-[#080d1a] rounded-2xl md:rounded-[27px] lg:rounded-[43px] overflow-hidden px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-10 sm:py-12 md:py-16 lg:py-20">
            {/* Pattern background — invert to white logos on dark bg */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage: 'url(/images/footer-pattern2.png)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />

            {/* CTA content */}
            <div className="relative z-10">
              {/* Fix #6: Force 2 lines with whitespace-nowrap per line */}
              <h3 className="font-sans font-medium text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[50px] tracking-tight leading-tight">
                <span className="block whitespace-nowrap">Bring us your problem.</span>
                <span className="block whitespace-nowrap">We&rsquo;ll help you build the solution.</span>
              </h3>
              {/* Fix #7: Hover animation on button */}
              <button
                onClick={() => window.contactModal?.open()}
                className="group/cta cursor-pointer mt-6 md:mt-8 inline-flex items-center gap-2 bg-white text-foreground font-sans font-medium text-sm sm:text-base md:text-lg tracking-tight px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              >
                Get in Touch
                <span className="inline-flex items-center justify-center bg-foreground text-white rounded-lg w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover/cta:translate-x-0.5">
                  <span className="font-neuebit text-lg sm:text-xl leading-none">→</span>
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Middle section: tagline + nav columns */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-14 lg:pt-16 pb-8 md:pb-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
          {/* Left: Tagline + Back to top */}
          <div className="lg:flex-1">
            <Reveal>
              {/* Fix #4: Force 2 lines */}
              <p className="font-sans text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] tracking-tight leading-snug">
                <span className="block whitespace-nowrap font-semibold">From Argentina to your daily operations.</span>
                <span className="block whitespace-nowrap">Real solutions. Real adoption.</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <button
                onClick={scrollToTop}
                className="cursor-pointer mt-6 md:mt-8 inline-flex items-center gap-3 border border-foreground/20 text-foreground font-sans font-medium text-sm sm:text-base tracking-tight px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:border-foreground/40 transition-colors"
              >
                Back to top
                <span className="font-neuebit text-foreground text-lg sm:text-xl leading-none -rotate-90">→</span>
              </button>
            </Reveal>
          </div>

          {/* Right: Navigation + Channels */}
          <div className="flex gap-12 sm:gap-16 md:gap-20 lg:gap-16 lg:shrink-0 lg:ml-auto lg:mr-[8vw] xl:mr-[12vw] 2xl:mr-[16vw]">
            {/* Navigation */}
            <Reveal>
              <div>
                <h4 className="font-sans font-medium text-foreground/80 text-lg md:text-xl lg:text-2xl tracking-tight mb-4">
                  Navigation
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={(e) => handleSmoothScroll(e, link.href)}
                        className="font-sans text-foreground/80 text-sm sm:text-base tracking-tight hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Channels */}
            <Reveal delay={0.1}>
              <div>
                <h4 className="font-sans font-medium text-foreground/80 text-lg md:text-xl lg:text-2xl tracking-tight mb-4">
                  Channels
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {CHANNEL_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-foreground/80 text-sm sm:text-base tracking-tight hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Giant "obel" text — Fix #2: text-primary for dark blue */}
      <div className="w-full overflow-hidden">
        <Reveal>
          <div
            ref={textRef}
            className="relative select-none text-primary"
          >
            <svg viewBox="0 0 1592.32 642" className="w-full h-auto block" fill="currentColor" role="img" aria-label="obel">
              <path d="M1590.37 0V634.195H1513.29V0H1590.37Z"/>
              <path d="M1469.87 381.321C1469.87 396.175 1469.01 411.886 1467.29 428.454H1090.67C1093.53 474.727 1109.3 511.003 1137.96 537.283C1167.2 562.989 1202.45 575.845 1243.72 575.845C1277.54 575.845 1305.63 568.133 1327.99 552.707C1350.92 536.711 1366.97 515.574 1376.14 489.294H1460.41C1447.8 534.425 1422.57 571.273 1384.74 599.837C1346.91 627.831 1299.9 641.828 1243.72 641.828C1199.01 641.828 1158.88 631.831 1123.34 611.836C1088.37 591.84 1060.86 563.561 1040.8 526.998C1020.73 489.866 1010.7 447.02 1010.7 398.461C1010.7 349.902 1020.45 307.341 1039.94 270.778C1059.43 234.217 1086.66 206.224 1121.62 186.801C1157.16 166.806 1197.86 156.808 1243.72 156.808C1288.44 156.808 1327.99 166.52 1362.38 185.944C1396.78 205.367 1423.15 232.218 1441.49 266.494C1460.41 300.199 1469.87 338.476 1469.87 381.321ZM1389.04 365.041C1389.04 335.333 1382.45 309.912 1369.26 288.775C1356.08 267.066 1338.02 250.784 1315.09 239.93C1292.73 228.504 1267.8 222.791 1240.28 222.791C1200.73 222.791 1166.91 235.359 1138.82 260.496C1111.3 285.632 1095.54 320.481 1091.53 365.041H1389.04Z"/>
              <path d="M579.896 251.936C595.946 223.943 619.449 201.092 650.405 183.382C681.36 165.672 716.614 156.817 756.168 156.817C798.586 156.817 836.708 166.814 870.529 186.809C904.349 206.804 931.005 235.083 950.495 271.644C969.985 307.635 979.731 349.626 979.731 397.613C979.731 445.03 969.985 487.304 950.495 524.436C931.005 561.571 904.063 590.42 869.669 610.987C835.848 631.552 798.015 641.837 756.168 641.837C715.466 641.837 679.64 632.981 648.685 615.272C618.304 597.562 595.375 574.997 579.896 547.574V634.123H501.649V0H579.896V251.936ZM899.764 397.613C899.764 362.194 892.598 331.345 878.267 305.064C863.936 278.786 844.446 258.791 819.798 245.08C795.721 231.369 769.065 224.514 739.829 224.514C711.167 224.514 684.513 231.655 659.862 245.937C635.788 259.648 616.296 279.928 601.393 306.778C587.063 333.058 579.896 363.621 579.896 398.47C579.896 433.889 587.063 465.023 601.393 491.873C616.296 518.154 635.788 538.434 659.862 552.715C684.513 566.428 711.167 573.283 739.829 573.283C769.065 573.283 795.721 566.428 819.798 552.715C844.446 538.434 863.936 518.154 878.267 491.873C892.598 465.023 899.764 433.604 899.764 397.613Z"/>
              <path d="M234.742 641.828C190.602 641.828 150.475 631.831 114.361 611.836C78.8204 591.84 50.7318 563.561 30.095 526.998C10.0317 489.866 0 447.02 0 398.461C0 350.474 10.3183 308.198 30.9548 271.635C52.1649 234.503 80.8268 206.224 116.941 186.801C153.055 166.806 193.468 156.808 238.181 156.808C282.895 156.808 323.308 166.806 359.422 186.801C395.536 206.224 423.912 234.217 444.547 270.778C465.756 307.341 476.362 349.902 476.362 398.461C476.362 447.02 465.471 489.866 443.687 526.998C422.478 563.561 393.528 591.84 356.842 611.836C320.154 631.831 279.455 641.828 234.742 641.828ZM234.742 573.274C262.831 573.274 289.199 566.704 313.85 553.564C338.498 540.423 358.274 520.716 373.179 494.435C388.658 468.157 396.396 436.166 396.396 398.461C396.396 360.757 388.943 328.765 374.038 302.485C359.134 276.207 339.644 256.783 315.57 244.214C291.493 231.075 265.41 224.505 237.321 224.505C208.659 224.505 182.29 231.075 158.214 244.214C134.711 256.783 115.794 276.207 101.464 302.485C87.1324 328.765 79.967 360.757 79.967 398.461C79.967 436.738 86.8459 469.014 100.603 495.294C114.935 521.572 133.851 541.28 157.354 554.421C180.857 566.989 206.653 573.274 234.742 573.274Z"/>
            </svg>
            {/* Fix #1: Pattern overlay — white logos on hover, not dark grey */}
            {isDesktop && (
              <svg
                ref={patternRef}
                aria-hidden="true"
                viewBox="0 0 1592.32 642"
                className="absolute inset-0 w-full h-full"
                style={{
                  filter: "brightness(0) invert(1)",
                  maskImage:
                    "radial-gradient(circle 150px at var(--x, -200px) var(--y, -200px), black 0%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle 150px at var(--x, -200px) var(--y, -200px), black 0%, transparent 100%)",
                }}
              >
                <defs>
                  <pattern id="obel-pattern" patternUnits="objectBoundingBox" width="1" height="1">
                    <image href="/images/pattern-obel.png" x="0" y="0" width="1592.32" height="642" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <path d="M1590.37 0V634.195H1513.29V0H1590.37Z" fill="url(#obel-pattern)"/>
                <path d="M1469.87 381.321C1469.87 396.175 1469.01 411.886 1467.29 428.454H1090.67C1093.53 474.727 1109.3 511.003 1137.96 537.283C1167.2 562.989 1202.45 575.845 1243.72 575.845C1277.54 575.845 1305.63 568.133 1327.99 552.707C1350.92 536.711 1366.97 515.574 1376.14 489.294H1460.41C1447.8 534.425 1422.57 571.273 1384.74 599.837C1346.91 627.831 1299.9 641.828 1243.72 641.828C1199.01 641.828 1158.88 631.831 1123.34 611.836C1088.37 591.84 1060.86 563.561 1040.8 526.998C1020.73 489.866 1010.7 447.02 1010.7 398.461C1010.7 349.902 1020.45 307.341 1039.94 270.778C1059.43 234.217 1086.66 206.224 1121.62 186.801C1157.16 166.806 1197.86 156.808 1243.72 156.808C1288.44 156.808 1327.99 166.52 1362.38 185.944C1396.78 205.367 1423.15 232.218 1441.49 266.494C1460.41 300.199 1469.87 338.476 1469.87 381.321ZM1389.04 365.041C1389.04 335.333 1382.45 309.912 1369.26 288.775C1356.08 267.066 1338.02 250.784 1315.09 239.93C1292.73 228.504 1267.8 222.791 1240.28 222.791C1200.73 222.791 1166.91 235.359 1138.82 260.496C1111.3 285.632 1095.54 320.481 1091.53 365.041H1389.04Z" fill="url(#obel-pattern)"/>
                <path d="M579.896 251.936C595.946 223.943 619.449 201.092 650.405 183.382C681.36 165.672 716.614 156.817 756.168 156.817C798.586 156.817 836.708 166.814 870.529 186.809C904.349 206.804 931.005 235.083 950.495 271.644C969.985 307.635 979.731 349.626 979.731 397.613C979.731 445.03 969.985 487.304 950.495 524.436C931.005 561.571 904.063 590.42 869.669 610.987C835.848 631.552 798.015 641.837 756.168 641.837C715.466 641.837 679.64 632.981 648.685 615.272C618.304 597.562 595.375 574.997 579.896 547.574V634.123H501.649V0H579.896V251.936ZM899.764 397.613C899.764 362.194 892.598 331.345 878.267 305.064C863.936 278.786 844.446 258.791 819.798 245.08C795.721 231.369 769.065 224.514 739.829 224.514C711.167 224.514 684.513 231.655 659.862 245.937C635.788 259.648 616.296 279.928 601.393 306.778C587.063 333.058 579.896 363.621 579.896 398.47C579.896 433.889 587.063 465.023 601.393 491.873C616.296 518.154 635.788 538.434 659.862 552.715C684.513 566.428 711.167 573.283 739.829 573.283C769.065 573.283 795.721 566.428 819.798 552.715C844.446 538.434 863.936 518.154 878.267 491.873C892.598 465.023 899.764 433.604 899.764 397.613Z" fill="url(#obel-pattern)"/>
                <path d="M234.742 641.828C190.602 641.828 150.475 631.831 114.361 611.836C78.8204 591.84 50.7318 563.561 30.095 526.998C10.0317 489.866 0 447.02 0 398.461C0 350.474 10.3183 308.198 30.9548 271.635C52.1649 234.503 80.8268 206.224 116.941 186.801C153.055 166.806 193.468 156.808 238.181 156.808C282.895 156.808 323.308 166.806 359.422 186.801C395.536 206.224 423.912 234.217 444.547 270.778C465.756 307.341 476.362 349.902 476.362 398.461C476.362 447.02 465.471 489.866 443.687 526.998C422.478 563.561 393.528 591.84 356.842 611.836C320.154 631.831 279.455 641.828 234.742 641.828ZM234.742 573.274C262.831 573.274 289.199 566.704 313.85 553.564C338.498 540.423 358.274 520.716 373.179 494.435C388.658 468.157 396.396 436.166 396.396 398.461C396.396 360.757 388.943 328.765 374.038 302.485C359.134 276.207 339.644 256.783 315.57 244.214C291.493 231.075 265.41 224.505 237.321 224.505C208.659 224.505 182.29 231.075 158.214 244.214C134.711 256.783 115.794 276.207 101.464 302.485C87.1324 328.765 79.967 360.757 79.967 398.461C79.967 436.738 86.8459 469.014 100.603 495.294C114.935 521.572 133.851 541.28 157.354 554.421C180.857 566.989 206.653 573.274 234.742 573.274Z" fill="url(#obel-pattern)"/>
              </svg>
            )}
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
