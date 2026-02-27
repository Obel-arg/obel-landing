"use client";

import { useCallback, type ReactNode, type AnchorHTMLAttributes } from "react";
import Link from "next/link";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      try {
        const lenis = (window as { lenis?: { scroll: number } }).lenis;
        const y = lenis ? Math.round(lenis.scroll) : window.scrollY;
        sessionStorage.setItem(`scroll-${window.location.pathname}`, String(y));
      } catch { /* noop */ }
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <Link href={href} onClick={handleClick} scroll={false} {...props}>
      {children}
    </Link>
  );
}
