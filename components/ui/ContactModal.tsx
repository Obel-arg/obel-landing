"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

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
        className="absolute inset-0 bg-[#090E19]/90 backdrop-blur-xl"
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
          className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-12 z-10 text-[#FFFAF8]/70 hover:text-[#C6DDFF] transition-colors duration-200 flex items-center gap-2 font-sans text-sm tracking-wide cursor-pointer"
          aria-label="Close contact form"
        >
          <span>Close</span>
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

        {/* Two-column layout */}
        <div
          className="grid lg:grid-cols-2 min-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Decorative space (hidden on mobile) */}
          <div className="hidden lg:block" aria-hidden />

          {/* Right: Form */}
          <div
            ref={formContainerRef}
            className="flex flex-col justify-center p-6 md:p-10 lg:p-12 xl:p-16"
          >
            <div ref={formElementsRef} className="max-w-lg">
              {/* Title */}
              <h2
                id="contact-modal-title"
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FFFAF8] mb-8 tracking-tight"
              >
                Let&apos;s be partners{" "}
                <span className="text-[#FFFAF8]/40">—</span>
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
                    Tell us a little bit more
                  </label>
                  <input
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Tell us a little bit more:"
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
                    className={`group relative inline-flex items-center gap-3 md:gap-4 font-serif text-2xl md:text-3xl lg:text-4xl transition-colors duration-300 ${
                      isSubmitting
                        ? "text-[#FFFAF8]/50 cursor-not-allowed"
                        : "text-[#FFFAF8] hover:text-[#C6DDFF] cursor-pointer"
                    }`}
                  >
                    <span>{isSubmitting ? "Sending..." : "Let's talk."}</span>
                    {!isSubmitting && (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 transform group-hover:translate-x-2 transition-transform duration-300"
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
                      <a href="mailto:hello@obel.la" className="underline hover:text-[#C6DDFF]">
                        hello@obel.la
                      </a>
                    </p>
                  )}
                </div>

                {/* Privacy policy */}
                <div className="pt-2">
                  <p className="text-[#FFFAF8]/40 text-sm font-sans">
                    By submitting, you agree to our{" "}
                    <a
                      href="/privacy"
                      className="underline hover:text-[#C6DDFF] transition-colors duration-200"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer contact links */}
            <div ref={footerRef} className="mt-8 md:mt-10 lg:mt-12 pt-6 border-t border-[#FFFAF8]/10">
              <h3 className="text-[#FFFAF8]/40 font-sans text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">
                How else can we help?
              </h3>
              <div>
                {/* Join us - Instagram (entire block is clickable) */}
                <a
                  href="https://instagram.com/obel.lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <p className="text-[#FFFAF8] font-serif text-xl md:text-2xl lg:text-3xl mb-1 group-hover:text-[#C6DDFF] transition-colors duration-200">
                    Join us.
                  </p>
                  <span className="text-[#FFFAF8]/70 font-sans text-base md:text-lg group-hover:text-[#C6DDFF] transition-colors duration-200">
                    obel.lab
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
