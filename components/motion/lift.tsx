'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { easings, durations } from '@/lib/motion';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
};

// The default scroll-reveal: 24px lift + fade-in. Used for ~90% of reveals.
// Reduced-motion: plain opacity fade with no displacement.
export function Lift({ children, delay = 0, className, amount = 0.3 }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
      whileInView={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduced ? 0.2 : durations.default,
        ease: easings.out as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
