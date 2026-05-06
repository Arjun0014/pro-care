'use client';

// Per 13-HOME-AWARD-TIER.md § Section 8 — Why Pro Care (image cluster).
// Center: Instrument Serif headline with italic emphasis. Around it, 4 small-
// to-medium images orbit at deliberate, asymmetric positions. Each cluster
// image wrapped in <TiltImage>. Ink ground (own bg), canvas hidden.
// Heading uses split-text. Images stagger in with mask-reveal.
//
// Mobile: heading centered, full width; images in a 2×2 grid below.

import Image from 'next/image';
import { SplitText }    from '@/components/motion/split-text';
import { MaskedReveal } from '@/components/motion/masked-reveal';
import { TiltImage }    from '@/components/motion/tilt-image';

type ClusterImage = {
  src:  string;
  alt:  string;
  /** Desktop position (% of section box). */
  x:    string;
  y:    string;
  /** Width in px on desktop. */
  w:    number;
  rot?: number;
  delay?: number;
  maskFrom?: 'bottom' | 'top' | 'left' | 'right';
};

const IMAGES: readonly ClusterImage[] = [
  { src: '/images/why/01.jpg', alt: 'Golden hour on a Pro Care construction site', x: '12%', y: '18%', w: 220, rot: -2, delay: 0.2, maskFrom: 'left'   },
  { src: '/images/why/02.jpg', alt: 'Architect reviewing blueprints',              x: '8%',  y: '70%', w: 320, rot:  2, delay: 0.5, maskFrom: 'bottom' },
  { src: '/images/why/03.jpg', alt: 'Warm modern interior',                        x: '78%', y: '20%', w: 240, rot:  3, delay: 0.7, maskFrom: 'right'  },
  { src: '/images/why/04.jpg', alt: 'Craftsman hands at work',                     x: '82%', y: '72%', w: 200, rot: -3, delay: 0.9, maskFrom: 'top'    },
];

export function WhyCluster() {
  return (
    <section
      data-ground="ink"
      className="relative w-full min-h-[120vh] bg-[var(--color-ink)] text-[var(--color-bone)] overflow-hidden"
      aria-label="Why Pro Care"
    >
      {/* Eyebrow */}
      <div className="px-[5vw] pt-[8vh]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/70">
          Why Pro Care
        </span>
      </div>

      {/* Centered heading — desktop sits over the cluster, mobile sits above */}
      <div className="relative z-10 grid place-items-center min-h-[100vh] px-6">
        <SplitText
          as="h2"
          className="block font-display text-center text-[clamp(2.25rem,5vw,5rem)] leading-[1.05] tracking-[-0.02em] max-w-[20ch]"
        >
          Built on relationships <em>that outlast</em> projects.
        </SplitText>
      </div>

      {/* Desktop cluster — absolute orbit positions */}
      <div className="hidden md:block">
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left:      img.x,
              top:       img.y,
              width:     img.w,
              transform: `translate(-50%, -50%) rotate(${img.rot ?? 0}deg)`,
            }}
          >
            <MaskedReveal direction={img.maskFrom ?? 'bottom'} delay={img.delay ?? 0}>
              <div className="pointer-events-auto">
                <TiltImage max={5}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={`${img.w}px`}
                      className="object-cover"
                    />
                  </div>
                </TiltImage>
              </div>
            </MaskedReveal>
          </div>
        ))}
      </div>

      {/* Mobile fallback — 2×2 grid below the heading */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-6 pb-[8vh]">
        {IMAGES.map((img, i) => (
          <MaskedReveal key={i} direction="bottom" delay={i * 0.1}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </MaskedReveal>
        ))}
      </div>
    </section>
  );
}
