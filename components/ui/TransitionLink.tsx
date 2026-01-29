"use client";

import { useCallback, type ReactNode, type AnchorHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

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

      gsap.to("main", {
        opacity: 0,
        y: -12,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // Scroll to top before navigation so new page opens at top
          window.scrollTo(0, 0);
          // Also reset Lenis if present
          const lenis = (
            window as unknown as {
              lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };
            }
          ).lenis;
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          }
          router.push(href);
        },
      });
    },
    [href, router, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
