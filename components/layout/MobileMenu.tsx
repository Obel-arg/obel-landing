"use client";

import { useEffect, useRef, useCallback } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Swipe-to-dismiss touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchCurrentX.current = e.touches[0].clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;

    // Only allow dragging to the right (closing direction)
    if (deltaX > 0 && panelRef.current) {
      panelRef.current.style.transform = `translateX(${deltaX}px)`;
      panelRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const deltaX = touchCurrentX.current - touchStartX.current;

    if (panelRef.current) {
      panelRef.current.style.transition = "";
      panelRef.current.style.transform = "";
    }

    // Close if swiped right more than 80px
    if (deltaX > 80) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className={`
        fixed inset-0 z-[60]
        transition-visibility
        ${isOpen ? "visible" : "invisible pointer-events-none"}
      `}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-primary/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        ref={panelRef}
        className={`
          absolute top-0 right-0 bottom-0 w-[80vw] max-w-sm
          bg-primary text-background
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2 cursor-pointer"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-8 px-8 pt-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="!text-2xl !tracking-tight"
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              onClose();
              window.contactModal?.open();
            }}
            className="text-left font-sans text-2xl tracking-tight font-medium hover:opacity-60 transition-opacity duration-300 cursor-pointer"
          >
            Contact us
          </button>
        </nav>
      </div>
    </div>
  );
}
