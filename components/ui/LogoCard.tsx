"use client";

import { useState, useCallback } from "react";
import { PixelCanvas } from "@/components/ui/PixelCanvas";

interface LogoCardProps {
  name: string;
  reducedMotion: boolean;
  className?: string;
}

export function LogoCard({ name, reducedMotion, className = "" }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden isolate select-none
        aspect-[3/2]
        flex items-center justify-center
        border border-foreground/10
        transition-[border-color] duration-300
        hover:border-foreground/25
        ${className}
      `}
    >
      <PixelCanvas
        isHovered={isHovered}
        reducedMotion={reducedMotion}
        className="absolute inset-0"
      />
      <span className="relative z-10 font-sans text-xs md:text-sm font-medium tracking-wide">
        {name}
      </span>
    </div>
  );
}
