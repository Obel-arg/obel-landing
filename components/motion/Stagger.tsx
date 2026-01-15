"use client";

import { ReactNode, Children, isValidElement, cloneElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "./variants";

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  containerDelay?: number;
  once?: boolean;
  className?: string;
}

export function Stagger({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  once = true,
  className,
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={containerVariants}
      className={className}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        return (
          <motion.div variants={staggerItem}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Alternative: StaggerItem for more control
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
