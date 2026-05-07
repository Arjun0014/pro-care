'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 11 + 11-MOTION-OVERHAUL.md § 14.
// A heading with 3–5 small images orbiting it at deliberately asymmetric
// positions. As the section enters viewport, each image animates in with a
// mask-reveal + slight scale 0.92 → 1, optional rotation, 120ms stagger.
// Reduced motion: static layout, no entry animation.

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { easings } from '@/lib/motion';

export type ClusterImage = {
  src:    string;
  alt:    string;
  /** Position as a fraction of the container (0..1). */
  x:      number;
  y:      number;
  /** Width / height in px (the visible window — image fills via next/image). */
  width:  number;
  height: number;
  rotate?:   number;                                  // degrees
  maskFrom?: 'bottom' | 'top' | 'left' | 'right';
};

type Props = {
  heading: ReactNode;
  images:  ClusterImage[];
  className?: string;
};

const initialClip = (dir: 'bottom' | 'top' | 'left' | 'right'): string =>
  ({
    bottom: 'inset(0 0 100% 0)',
    top:    'inset(100% 0 0 0)',
    left:   'inset(0 100% 0 0)',
    right:  'inset(0 0 0 100%)',
  } as const)[dir];

export function ImageCluster({ heading, images, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`relative w-full min-h-[80vh] grid place-items-center overflow-visible ${className ?? ''}`}
    >
      <div className="relative z-10 max-w-3xl text-center px-6">{heading}</div>

      {images.map((img, i) => {
        const dir = img.maskFrom ?? 'bottom';
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none overflow-hidden"
            style={{
              left:   `${img.x * 100}%`,
              top:    `${img.y * 100}%`,
              width:  img.width,
              height: img.height,
              transform: `translate(-50%, -50%) rotate(${img.rotate ?? 0}deg)`,
            }}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, clipPath: initialClip(dir) }
            }
            animate={
              inView
                ? reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0)' }
                : undefined
            }
            transition={{
              duration: reduceMotion ? 0.3 : 1.0,
              ease: easings.cinema as [number, number, number, number],
              delay: reduceMotion ? 0 : 0.2 + i * 0.12,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={`${img.width}px`}
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
