'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number; // ms
  className?: string;
};

// Cinematic clip-path reveal: content slides in from behind a top mask.
// Used for hero headlines and one section headline per major section.
// Reduced-motion: plain 200ms opacity fade with no clipping.
export function Unveil({ children, delay = 0, duration = 1000, className = '' }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (reduced) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: inView ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: inView ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
        transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
