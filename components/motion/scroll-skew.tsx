'use client';

// Per 16-EXTRA-PATTERNS.md § Component 15.
// Wraps a child block in a div that skews subtly based on scroll velocity.
// Capped at maxSkew (1.5° default) so the effect reads as "alive," not glitchy.
// Reduced motion: useScrollVelocity short-circuits to 0 — no skew.

import { type ReactNode } from 'react';
import { useScrollVelocity } from '@/hooks/use-scroll-velocity';

type Props = {
  children: ReactNode;
  /** Max skew in degrees (default 1.5). */
  max?: number;
  className?: string;
};

export function ScrollSkew({ children, max = 1.5, className }: Props) {
  const skew = useScrollVelocity(max);
  return (
    <div
      className={className}
      style={{
        transform: `skewY(${skew}deg)`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
