"use client";

import { ReactNode } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION, ANIMATION_EASE } from "@/lib/constants";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const getVariants = (
  direction: RevealProps["direction"],
  duration: number
): Variants => {
  const offset = 30;
  const transforms = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  const transform = direction ? transforms[direction] : { y: offset };

  return {
    hidden: {
      opacity: 0,
      ...transform,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: ANIMATION_EASE,
      },
    },
  };
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = ANIMATION_DURATION,
  once = true,
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = getVariants(direction, duration);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
