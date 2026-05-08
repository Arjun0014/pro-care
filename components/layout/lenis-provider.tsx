'use client';
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// Now wraps children so the layout can colocate ScrollBackdrop / Nav / main /
// Footer within it. The Lenis useEffect logic and window.__lenis exposure are
// unchanged from R1.7.B.
export function LenisProvider({ children }: { children?: ReactNode } = {}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose for ScrollBackdrop (and any other consumer) to subscribe to
    // Lenis scroll events directly. See 19-SCROLL-SEQUENCE.md § Modifications
    // to LenisProvider.
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
