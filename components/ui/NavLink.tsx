"use client";

import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { HEADER_HEIGHT } from "@/lib/constants";

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
                opts?: { offset?: number; duration?: number }
              ) => void;
            };
          }
        ).lenis;
        if (lenis) {
          const target = document.querySelector(href);
          const distance = target
            ? Math.abs(target.getBoundingClientRect().top)
            : 0;
          const duration = Math.min(4.5, Math.max(1.5, distance / 1200));
          lenis.scrollTo(href, { offset: -HEADER_HEIGHT, duration });
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
