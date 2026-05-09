'use client';

// Per R3 § Task 3 — Page transitions.
// Wraps page content to animate it smoothly (fade + slide up) on route changes.
// Keyed by pathname so AnimatePresence can trigger enter animations.
// Reduced motion: renders children directly with no animation.

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { easings } from '@/lib/motion';

export function RouteCurtain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: easings.out as [number, number, number, number],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
