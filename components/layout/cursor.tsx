'use client';
import { useEffect, useRef } from 'react';

// Custom cursor: 6px gold dot + 36px ring with 0.15 lerp factor.
// Disabled on touch (pointer: coarse) and prefers-reduced-motion.
// Global CSS for cursor: none lives in app/globals.css.
export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target  = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        // Dot is 6px (w-1.5), offset by 3px to center
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let raf: number;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, target.current.x, 0.15);
      ring.current.y = lerp(ring.current.y, target.current.y, 0.15);
      if (ringRef.current) {
        // Ring is 36px (w-9), offset by 18px to center
        ringRef.current.style.transform = `translate3d(${ring.current.x - 18}px, ${ring.current.y - 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        ringRef.current?.classList.add('cursor-ring--hover');
      }
    };
    const onLeave = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        ringRef.current?.classList.remove('cursor-ring--hover');
      }
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onEnter, true);
    document.addEventListener('pointerout',  onLeave, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onEnter, true);
      document.removeEventListener('pointerout',  onLeave, true);
    };
  }, []);

  return (
    <>
      {/* Lerping ring */}
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-[var(--color-gold)] mix-blend-difference"
        style={{ transition: 'width 0.2s ease, height 0.2s ease' }}
        aria-hidden="true"
      />
      {/* Exact-position dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]"
        aria-hidden="true"
      />
    </>
  );
}
