'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 9.
// A horizontal track that scrubs as the user scrolls vertically. The container
// is pinned for the duration of the horizontal travel. Touch / <769px disable
// the pin and lay out the track vertically (CSS flex-col baseline).
// Reduced motion: gsap.matchMedia branch is skipped so the track lays out
// naturally; no pin, no scrub.

import { useLayoutEffect, useEffect, useRef, type ReactNode } from 'react';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Content rendered inside the pinned container but above the horizontal
   *  track. Use for overlay headers that should stay visible during scrub
   *  without scrolling horizontally. */
  overlay?: ReactNode;
};

export function HorizontalScroll({ children, className, overlay }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const trackWidth    = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance      = trackWidth - viewportWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start:   'top top',
          end:     () => `+=${distance}`,
          pin:     true,
          scrub:   1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className ?? ''}`}
      data-cursor-label="DRAG SCROLL"
    >
      {overlay}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row gap-8 will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
