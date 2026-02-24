"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// TypeScript declaration for global API
declare global {
  interface Window {
    contactModal?: ContactModalAPI;
    lenis?: {
      stop: () => void;
      start: () => void;
    };
  }
}

interface ContactModalAPI {
  open: () => void;
  close: () => void;
}

// Use isomorphic layout effect for SSR safety
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Email validation helper
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Full-screen contact form modal with GSAP animations.
 * Exposed globally via window.contactModal = { open, close }
 */
export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Form state for validation indicators
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    company: "",
    role: "",
    website: "", // Honeypot - should stay empty
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation check
  const isFormValid =
    formValues.firstName.trim() !== "" &&
    formValues.lastName.trim() !== "" &&
    isValidEmail(formValues.email) &&
    formValues.message.trim() !== "";

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const formElementsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Handle input changes for validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // Get validation indicator class for a field
  const getIndicatorClass = (field: string) => {
    const value = formValues[field as keyof typeof formValues];
    const isTouched = touched[field];
    const hasValue = value.trim() !== "";

    if (field === "email") {
      const isValid = isValidEmail(value);
      if (!isTouched) {
        return isValid ? "text-[#84E643]" : "text-[#FF4141]";
      }
      return isValid ? "text-[#84E643]" : "text-[#FF4141] animate-pulse";
    }

    if (!isTouched) {
      return hasValue ? "text-[#84E643]" : "text-[#FF4141]";
    }
    return hasValue ? "text-[#84E643]" : "text-[#FF4141] animate-pulse";
  };

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Lock/unlock Lenis scroll
  const lockScroll = useCallback(() => {
    if (typeof window !== "undefined" && window.lenis) {
      window.lenis.stop();
    }
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    if (typeof window !== "undefined" && window.lenis) {
      window.lenis.start();
    }
    document.body.style.overflow = "";
    // Wait one frame so Lenis syncs its scroll position via GSAP ticker
    // before recalculating trigger positions (fixes dev mode timing race)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  // Open modal
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close modal
  const close = useCallback(() => {
    if (!backdropRef.current) {
      setIsVisible(false);
      setIsOpen(false);
      return;
    }

    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      setIsVisible(false);
      setIsOpen(false);
      unlockScroll();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        setIsOpen(false);
        unlockScroll();
      },
    });

    const formElements = formElementsRef.current?.children;
    const footer = footerRef.current;

    if (formElements) {
      tl.to(formElements, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        stagger: 0.02,
        ease: "power2.in",
      });
    }

    if (footer) {
      tl.to(footer, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
      }, "<");
    }

    if (closeButtonRef.current) {
      tl.to(closeButtonRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      }, "-=0.1");
    }

    tl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.15");

    timelineRef.current = tl;
  }, [prefersReducedMotion, unlockScroll]);

  // Handle open animation
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;

    setIsVisible(true);
    lockScroll();

    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      gsap.set(backdropRef.current, { opacity: 1 });
      gsap.set(closeButtonRef.current, { opacity: 1 });
      if (formElementsRef.current?.children) {
        gsap.set(formElementsRef.current.children, { opacity: 1, y: 0 });
      }
      gsap.set(footerRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(closeButtonRef.current, { opacity: 0 });
    if (formElementsRef.current?.children) {
      gsap.set(formElementsRef.current.children, { opacity: 0, y: 30 });
    }
    gsap.set(footerRef.current, { opacity: 0, y: 30 });

    const tl = gsap.timeline();

    tl.to(backdropRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    tl.to(closeButtonRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.1");

    if (formElementsRef.current?.children) {
      tl.to(formElementsRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
      }, "-=0.2");
    }

    tl.to(footerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.3");

    timelineRef.current = tl;
  }, [isOpen, lockScroll, prefersReducedMotion]);

  // Handle Escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, close]);

  // Expose global API
  useEffect(() => {
    window.contactModal = { open, close };
    return () => {
      delete window.contactModal;
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [open, close]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched to show validation
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
    });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitStatus("success");
      // Reset form after success
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        company: "",
        role: "",
        website: "",
      });
      setTouched({});
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200]"
      style={{ display: isVisible ? "block" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop with blur effect */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#090E19]/95 backdrop-blur-md"
        onClick={handleBackdropClick}
      />

      {/* Content container */}
      <div
        className="relative h-full overflow-y-auto"
        onClick={handleBackdropClick}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={close}
          className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-12 z-10 text-[#FFFAF8]/70 transition-colors duration-200 flex items-center gap-2 font-sans text-sm tracking-wide cursor-pointer"
          aria-label="Close contact form"
        >
          <span className="hidden md:inline">Close</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mt-px"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Centered layout */}
        <div
          className="flex items-center justify-center min-h-full p-6 md:p-10 lg:p-12 xl:p-16"
          onClick={close}
        >
          <div
            ref={formContainerRef}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={formElementsRef}>
              {/* Title */}
              <h2
                id="contact-modal-title"
                className="font-neuebit text-5xl md:text-6xl lg:text-7xl text-[#FFFAF8] mb-8 tracking-tight"
              >
                Let&apos;s be partners
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
                {/* Name row - Required */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      required
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                    />
                    <span className={`text-xs mt-1 block transition-colors duration-200 ${getIndicatorClass("firstName")}`}>*</span>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      value={formValues.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                    />
                    <span className={`text-xs mt-1 block transition-colors duration-200 ${getIndicatorClass("lastName")}`}>*</span>
                  </div>
                </div>

                {/* Email - Required */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                  />
                  <span className={`text-xs mt-1 block transition-colors duration-200 ${getIndicatorClass("email")}`}>*</span>
                </div>

                {/* Message - Required */}
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <input
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Message"
                    required
                    value={formValues.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                  />
                  <span className={`text-xs mt-1 block transition-colors duration-200 ${getIndicatorClass("message")}`}>*</span>
                </div>

                {/* Company - Optional */}
                <div>
                  <label htmlFor="company" className="sr-only">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Company Name"
                    value={formValues.company}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                  />
                </div>

                {/* Role - Optional */}
                <div>
                  <label htmlFor="role" className="sr-only">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    placeholder="Role"
                    value={formValues.role}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#FFFAF8]/20 text-[#FFFAF8] placeholder:text-[#FFFAF8]/40 py-3 focus:border-[#FFFAF8]/50 focus:outline-none transition-colors duration-200 font-sans text-base"
                  />
                </div>

                {/* Honeypot field - hidden from users, bots will fill it */}
                <input
                  type="text"
                  name="website"
                  value={formValues.website}
                  onChange={handleInputChange}
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Submit button */}
                <div className="pt-4 md:pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#FFFAF8]/30 transition-all duration-300 ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#FFFAF8] hover:border-[#FFFAF8] cursor-pointer"
                    }`}
                    aria-label={isSubmitting ? "Sending..." : "Send message"}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#FFFAF8]/30 border-t-[#FFFAF8] rounded-full animate-spin" />
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#FFFAF8] group-hover:text-[#090E19] transition-colors duration-300"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Success message */}
                  {submitStatus === "success" && (
                    <p className="text-[#84E643] font-sans text-sm mt-3 animate-fade-in">
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  )}

                  {/* Error message */}
                  {submitStatus === "error" && (
                    <p className="text-[#FF4141] font-sans text-sm mt-3 animate-fade-in">
                      Failed to send message. Please try again or email us at{" "}
                      <a href="mailto:hello@obel.la" className="underline hover:text-[#FFFAF8]">
                        hello@obel.la
                      </a>
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Footer social links */}
            <div ref={footerRef} className="mt-8 md:mt-10 lg:mt-12 pt-6 border-t border-[#FFFAF8]/10">
              <h3 className="text-[#FFFAF8]/40 font-sans text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">
                Join us
              </h3>
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com/obel.lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#FFFAF8]/20 text-[#FFFAF8]/70 hover:text-[#FFFAF8] hover:border-[#FFFAF8]/50 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/obel-ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#FFFAF8]/20 text-[#FFFAF8]/70 hover:text-[#FFFAF8] hover:border-[#FFFAF8]/50 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="https://twitter.com/obel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#FFFAF8]/20 text-[#FFFAF8]/70 hover:text-[#FFFAF8] hover:border-[#FFFAF8]/50 transition-all duration-200"
                  aria-label="X"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
