'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 4.
// Two flavors: 'ticker' (ambient, ~50px/s) and 'headline' (giant, ~30px/s).
// CSS-driven (keyframes in globals.css). Pause-on-hover via animation-play-state.
// Reduced motion: animation disabled at the CSS layer; fallback renders the
// content statically (no infinite scroll).

import { useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type Variant = 'ticker' | 'headline';

type Props = {
  children: ReactNode;
  /** Pixels per second (default 50 for ticker, 30 for headline). */
  speed?: number;
  variant?: Variant;
  direction?: 'left' | 'right';
  /** Default false per R2.5 user feedback — the ticker should keep moving
   *  even when the cursor is over it, otherwise the page feels frozen. */
  pauseOnHover?: boolean;
  className?: string;
};

export function Marquee({
  children,
  speed,
  variant = 'ticker',
  direction = 'left',
  pauseOnHover = false,
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const finalSpeed = speed ?? (variant === 'headline' ? 30 : 50);
  // Animation duration is approximated from a synthetic track length of
  // 2000px. Real cycle is determined by content + duplication; CSS handles
  // the loop seamlessly via translateX(0%) → translateX(-50%).
  const animDuration = `${2000 / finalSpeed}s`;

  if (reduceMotion) {
    return (
      <div className={cn('overflow-hidden whitespace-nowrap', className)}>
        <div className="inline-block">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-hidden whitespace-nowrap', className)}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        className={cn(
          'inline-flex',
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
          variant === 'headline' &&
            'text-[clamp(6rem,18vw,18rem)] font-display leading-none',
          variant === 'ticker' &&
            'text-sm font-mono uppercase tracking-[0.2em]',
        )}
        style={{
          animationDuration: animDuration,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {/* Render children twice for a seamless loop */}
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
