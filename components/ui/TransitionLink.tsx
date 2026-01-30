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

        // For links without hash, scroll to top before navigation
        if (!hasHash) {
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }
        }

        router.push(href);
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
