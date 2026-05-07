'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 3.
// Animated clip-path inset reveal. Reads as "the image/block is being unveiled
// by a moving curtain." Direction picks which edge the inset starts from.
// Reduced motion: opacity-only fade, no clip-path.

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { easings } from '@/lib/motion';

type Direction = 'bottom' | 'top' | 'left' | 'right';

const initialClip = (dir: Direction): string =>
  ({
    bottom: 'inset(0 0 100% 0)',
    top:    'inset(100% 0 0 0)',
    left:   'inset(0 100% 0 0)',
    right:  'inset(0 0 0 100%)',
  } as const)[dir];

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
};

export function MaskedReveal({
  children,
  direction = 'bottom',
  delay = 0,
  duration = 1.1,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: 'clip-path' }}
      initial={{
        clipPath: reduceMotion ? 'inset(0 0 0 0)' : initialClip(direction),
        opacity:  reduceMotion ? 0 : 1,
      }}
      animate={
        inView
          ? { clipPath: 'inset(0 0 0 0)', opacity: 1 }
          : { clipPath: initialClip(direction), opacity: reduceMotion ? 0 : 1 }
      }
      transition={{
        duration: reduceMotion ? 0.3 : duration,
        ease: easings.cinema as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
