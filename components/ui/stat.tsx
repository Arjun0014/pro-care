'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type Props = {
  value:      number;
  suffix?:    string; // e.g. '+', '%'
  label:      string;
  duration?:  number; // ms
  delay?:     number; // ms — stagger between siblings in a stats strip
  className?: string;
};

// Animated counter: counts from 0 to `value` with a cubic-ease-out curve.
// Geist Mono tabular-nums, gold color, per 02-DESIGN-SYSTEM.md.
// Reduced-motion: shows final value immediately.
//
// `animated` is a ref (not state) so the count-up RAF isn't interrupted by
// a re-render — useState would re-run the effect and cancel the timeout.
export function Stat({ value, suffix = '+', label, duration = 1200, delay = 0, className }: Props) {
  const ref         = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const [display, setDisplay] = useState(0);
  const reduced     = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || animatedRef.current) return;

    let timeoutId: number | undefined;
    let raf: number | undefined;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;

        if (reduced) {
          setDisplay(value);
          return;
        }

        timeoutId = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t     = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
            setDisplay(Math.round(value * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.5 },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [value, duration, delay, reduced]);

  return (
    <div ref={ref} className={cn('flex flex-col gap-3', className)}>
      <span className="font-mono tabular-nums text-[clamp(3rem,8vw,6rem)] text-[var(--color-gold)] leading-none">
        {display}
        {suffix}
      </span>
      <span className="font-sans text-[14px] opacity-70 max-w-[14ch]">
        {label}
      </span>
    </div>
  );
}
