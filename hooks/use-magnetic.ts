'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 5.
// Translates the target element ~25% of the cursor offset (capped by the
// element's own bounding box + triggerDistance). Uses requestAnimationFrame
// + lerp 0.15 for smoothness. Disabled on touch and reduced-motion.

import { useEffect, type RefObject } from 'react';

type Options = {
  /** Translate magnitude as a fraction of cursor offset. Default 0.25. */
  strength?: number;
  /** Activation radius outside the element (px). Default 80. */
  triggerDistance?: number;
};

export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  { strength = 0.25, triggerDistance = 80 }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    let raf = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = Math.max(rect.width, rect.height) / 2 + triggerDistance;

      if (dist < max) {
        targetX = dx * strength;
        targetY = dy * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(raf);
    };
  }, [ref, strength, triggerDistance]);
}
