"use client";

import { useCallback, type ReactNode, type AnchorHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import type Lenis from "lenis";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function TransitionLink({
  href,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick?.(e);

      const navigate = () => {
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;
        const hasHash = href.includes("#");

        // Save current scroll position before leaving this page
        const scrollY = lenis ? Math.round(lenis.scroll) : window.scrollY;
        sessionStorage.setItem(`scroll-${window.location.pathname}`, String(scrollY));

        // For links without hash, scroll to top before navigation
        if (!hasHash) {
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }
        }

        // Strip hash from URL to prevent Next.js from auto-scrolling to the
        // hash element (scroll:false doesn't work for hash URLs — known bug).
        // Our SmoothScroll restoration handles position from sessionStorage.
        const url = new URL(href, window.location.origin);
        router.push(url.pathname, { scroll: false });
      };

      // Use pixel transition if available, otherwise navigate directly
      if (window.routeTransition) {
        window.routeTransition.startTransition(navigate);
      } else {
        navigate();
      }
    },
    [href, router, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
