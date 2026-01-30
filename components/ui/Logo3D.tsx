"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
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

interface Logo3DProps {
  className?: string;
  iconOnly?: boolean;
  inverted?: boolean;
}

// Static logo component - same size as glitch version (120x46)
function StaticLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      className="flex items-center"
      style={{
        width: 120,
        height: 46,
        filter: inverted ? "brightness(0) invert(1)" : "none",
      }}
    >
      <Image
        src="/images/logo-icon.svg"
        alt="OBEL"
        width={46}
        height={46}
        className="object-contain"
        style={{ transform: "rotate(-3deg)" }}
        priority
      />
      <Image
        src="/images/logo-wordmark.svg"
        alt="obel"
        width={70}
        height={28}
        className="object-contain"
        priority
      />
    </div>
  );
}

export function Logo3D({ className = "", inverted = false }: Logo3DProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Static logo for reduced motion or mobile devices
  if (prefersReducedMotion || isMobile) {
    return (
      <Link href="/" className={`block ${className}`}>
        <StaticLogo inverted={inverted} />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`block ${className}`}
      style={{ filter: inverted ? "brightness(0) invert(1)" : "none" }}
    >
      <LogoGlitch width={120} height={46} />
    </Link>
  );
}
