import { ANIMATION_DURATION, ANIMATION_EASE } from "@/lib/constants";

// Animation configuration objects
// These can be used as reference for GSAP animations

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

export const staggerContainer = {
  staggerChildren: 0.1,
  delayChildren: 0.1,
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};
