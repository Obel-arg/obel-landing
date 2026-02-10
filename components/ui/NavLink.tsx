"use client";

import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { getComputedHeaderHeight } from "@/lib/constants";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  scale?: number;
}

export function NavLink({ href, children, className = "", onClick, scale = 1 }: NavLinkProps) {
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
          lenis.scrollTo(href, { offset: -getComputedHeaderHeight(), duration });
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
        font-sans tracking-tight font-medium
        relative
        transition-opacity duration-300
        hover:opacity-60
        ${className}
      `}
      style={{ fontSize: `${18 * scale}px` }}
    >
      {children}
    </Link>
  );
}
