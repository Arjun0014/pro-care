'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 10 + 11-MOTION-OVERHAUL.md § 11.
// Full-viewport hero. As the page scrolls past it, the inner video frame scales
// from 1 → 0.7 with border-radius 0 → 24px, scrubbing on the scroll position.
// h.265 (hvc1) source preferred for smaller payload; h.264 fallback. A poster
// image holds the LCP slot until video data is ready.
//
// Mobile: full-bleed video, no scale (matchMedia breakpoint guard).
// Reduced motion: GSAP not registered. If only fallbackImage is supplied,
// the still uses the ken-burns CSS animation defined in globals.css.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  /** h.264 source (universal). */
  src?: string;
  /** h.265/hevc source (smaller payload, modern browsers). */
  srcH265?: string;
  /** Static poster shown until video can play. */
  poster?: string;
  /** Fallback image when no video source is available. */
  fallbackImage?: string;
  className?: string;
};

export function HeroVideo({
  src,
  srcH265,
  poster,
  fallbackImage,
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const tween = gsap.to(wrapper, {
        scale: 0.7,
        borderRadius: 24,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end:   'bottom top',
          scrub: 0.6,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className={`h-screen w-full overflow-hidden relative ${className ?? ''}`}>
      <div
        ref={wrapperRef}
        className="absolute inset-0 origin-center will-change-transform overflow-hidden"
      >
        {src ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            className="w-full h-full object-cover"
          >
            {srcH265 && <source src={srcH265} type='video/mp4; codecs="hevc,hvc1"' />}
            <source src={src} type="video/mp4" />
          </video>
        ) : fallbackImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fallbackImage}
            alt=""
            className="w-full h-full object-cover animate-ken-burns"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-ink)]" />
        )}

        {/* Dark overlay for text contrast — the ONLY gradient in the system. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/30 via-transparent to-[var(--color-ink)]/60" />
      </div>
    </div>
  );
}
