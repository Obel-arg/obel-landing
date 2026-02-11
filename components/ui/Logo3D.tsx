"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion";

// Dynamic import to avoid SSR issues with Three.js
const LogoGlitch = dynamic(
  () => import("./LogoGlitch").then((mod) => mod.LogoGlitch),
  { ssr: false }
);

// Hook to detect mobile devices
function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// Scale logo proportionally on wide screens (baseline: 1920px)
function useLogoScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(Math.max(1, window.innerWidth / 1920));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

interface Logo3DProps {
  className?: string;
  iconOnly?: boolean;
  inverted?: boolean;
}

// Base logo dimensions
const LOGO_W = 120;
const LOGO_H = 46;

// Static logo component - scales with viewport on wide screens
function StaticLogo({ inverted = false, scale = 1, iconOnly = false }: { inverted?: boolean; scale?: number; iconOnly?: boolean }) {
  return (
    <div
      className="flex items-center"
      style={{
        width: (iconOnly ? 46 : LOGO_W) * scale,
        height: LOGO_H * scale,
        filter: inverted ? "brightness(0) invert(1)" : "none",
      }}
    >
      <Image
        src="/images/logo-icon.svg"
        alt="OBEL"
        width={46 * scale}
        height={46 * scale}
        className="object-contain"
        style={{ transform: "rotate(-3deg)" }}
        priority
      />
      {!iconOnly && (
        <Image
          src="/images/logo-wordmark.svg"
          alt="obel"
          width={70 * scale}
          height={28 * scale}
          className="object-contain"
          priority
        />
      )}
    </div>
  );
}

export function Logo3D({ className = "", inverted = false }: Logo3DProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const scale = useLogoScale();
  const pathname = usePathname();

  // On homepage: smooth-scroll to top instead of navigating
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (pathname === "/") {
        e.preventDefault();
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
          const duration = Math.min(3, Math.max(1, window.scrollY / 1500));
          lenis.scrollTo(0, { duration });
        }
      }
    },
    [pathname]
  );

  // Static logo for reduced motion or mobile devices
  if (prefersReducedMotion || isMobile) {
    return (
      <Link href="/" onClick={handleLogoClick} className={`block ${className}`}>
        <StaticLogo inverted={inverted} scale={scale} iconOnly={isMobile} />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      className={`block ${className}`}
      style={{ filter: inverted ? "brightness(0) invert(1)" : "none" }}
    >
      <LogoGlitch width={Math.round(LOGO_W * scale)} height={Math.round(LOGO_H * scale)} />
    </Link>
  );
}
