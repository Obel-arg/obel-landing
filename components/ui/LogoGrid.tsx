"use client";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { LogoCard } from "@/components/ui/LogoCard";

const LOGOS = [
  { name: "Company A", id: 1 },
  { name: "Company B", id: 2 },
  { name: "Company C", id: 3 },
  { name: "Company D", id: 4 },
  { name: "Company E", id: 5 },
  { name: "Company F", id: 6 },
];

interface LogoGridProps {
  className?: string;
}

export function LogoGrid({ className = "" }: LogoGridProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 ${className}`}>
      {LOGOS.map((logo) => (
        <LogoCard
          key={logo.id}
          name={logo.name}
          reducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}
