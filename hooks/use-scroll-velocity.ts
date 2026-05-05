'use client';

// Per 16-EXTRA-PATTERNS.md § Component 15.
// Scroll-driven velocity → skew degrees, capped at maxSkew (default 1.5°).
// Lerps toward target each frame and decays target → 0 when scroll stops.
// Reduced motion: returns 0 always (effectively disabled).
//
// Lift this into a context provider if multiple consumers — keeping per-
// instance for now since R1 only has 2 sites of use and the listener is
// passive + cheap.

import { useEffect, useRef, useState } from 'react';

export function useScrollVelocity(maxSkew = 1.5) {
  const [skew, setSkew] = useState(0);
  const lastScroll = useRef(0);
  const lastTime   = useRef(0);
  const target     = useRef(0);
  const current    = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    lastTime.current = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime.current;
      const dy = window.scrollY - lastScroll.current;
      // velocity in px/ms
      const v = dt > 0 ? dy / dt : 0;
      // map to -maxSkew..+maxSkew, with saturation around v=4 px/ms (fast scroll)
      target.current = Math.max(-maxSkew, Math.min(maxSkew, v * 0.4));
      lastScroll.current = window.scrollY;
      lastTime.current   = now;
    };

    let raf = 0;
    const tick = () => {
      // Lerp toward target; decay target toward 0 when scroll stops.
      current.current += (target.current - current.current) * 0.1;
      target.current  *= 0.9;
      setSkew(current.current);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [maxSkew]);

  return skew;
}
