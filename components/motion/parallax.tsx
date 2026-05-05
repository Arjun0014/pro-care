'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  // Negative value moves element upward as you scroll down (typical parallax).
  // Keep small: -15 for backgrounds, -8 for foreground photos.
  amount?: number;
  className?: string;
};

// Scroll-linked parallax depth cue.
// Reduced-motion: static, no movement.
export function Parallax({ children, amount = -8, className }: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end:   'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [amount, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
