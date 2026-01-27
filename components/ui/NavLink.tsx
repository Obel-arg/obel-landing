"use client";

import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { HEADER_HEIGHT } from "@/lib/constants";
import { playPixelTransition } from "@/components/motion/PixelTransition";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const lenis = (
          window as unknown as {
            lenis?: {
              scrollTo: (
                target: string | number,
                opts?: { offset?: number; immediate?: boolean }
              ) => void;
            };
          }
        ).lenis;
        if (lenis) {
          playPixelTransition(() => {
            lenis.scrollTo(href, { offset: -HEADER_HEIGHT, immediate: true });
          });
        }
      }
      onClick?.();
    },
    [href, onClick]
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        font-sans text-base md:text-lg tracking-tight font-medium
        relative
        transition-opacity duration-300
        hover:opacity-60
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
