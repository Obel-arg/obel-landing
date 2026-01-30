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
      <div className="relative w-6 h-6 md:w-7 md:h-7" style={{ transform: "rotate(-3deg)" }}>
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
        <div className="relative w-12 h-5 md:w-14 md:h-6">
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
