'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactNode } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  // Caller builds the GSAP timeline. On desktop only — mobile gets no pin.
  buildTimeline: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  scrollDistance?: string; // default: '+=200%'
};

// Pin-and-scrub scroll section wrapper.
// Desktop: pins the element and scrubs the GSAP timeline.
// Mobile (<768px): no pin — each .pillar child fades in on enter instead.
// Reduced-motion: neither pin nor timeline runs; children are always visible.
export function Pinned({ children, buildTimeline, scrollDistance = '+=200%' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 1,
          end: scrollDistance,
          anticipatePin: 1,
        },
      });
      buildTimeline(tl, el);
    });

    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray<HTMLElement>('.pillar', el).forEach((pillar) => {
        gsap.from(pillar, {
          opacity: 0,
          y: 24,
          duration: 0.4,
          scrollTrigger: { trigger: pillar, start: 'top 80%' },
        });
      });
    });

    return () => mm.revert();
  }, { scope: ref, dependencies: [buildTimeline, scrollDistance] });

  return (
    <div ref={ref} className="pinned-wrapper">
      {children}
    </div>
  );
}
