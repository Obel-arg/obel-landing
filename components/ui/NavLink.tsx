"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
