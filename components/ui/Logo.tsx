"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-1 ${className}`}>
      {/* Logo Icon */}
      <div className="relative w-12 h-12 md:w-14 md:h-14" style={{ transform: "rotate(-3deg)" }}>
        <Image
          src="/images/logo-icon.svg"
          alt="OBEL"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="relative w-20 h-8 md:w-24 md:h-10">
          <Image
            src="/images/logo-wordmark.svg"
            alt="obel"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
    </Link>
  );
}
