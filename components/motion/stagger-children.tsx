'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { easings, durations } from '@/lib/motion';

type Props = {
  children: ReactNode;
  stagger?: number;
  className?: string;
};

// Wrap a list of children; each direct child gets the lift animation
// with stagger applied between them.
export function StaggerChildren({ children, stagger = 0.06, className }: Props) {
  const reduced = useReducedMotion();
  const effectiveStagger = reduced ? 0 : stagger;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: { transition: { staggerChildren: effectiveStagger } },
        hidden:  {},
      }}
    >
      {children}
    </motion.div>
  );
}

// Pair with this child variant on the direct children of StaggerChildren.
export const liftChildVariant = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: durations.default,
      ease: easings.out as [number, number, number, number],
    },
  },
} as const;
