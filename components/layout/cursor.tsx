'use client';

// Per 16-EXTRA-PATTERNS.md § Component 14 (replaces 12 § 6).
// Custom cursor with magnetic-snap awareness + contextual labels.
//   • 6px gold dot follows the pointer exactly.
//   • 36px ring lerps toward the pointer (factor 0.18). On hover over an
//     interactive element, scales 1.65×; on hover over a [data-magnetic]
//     element, scales 2.4× and snaps toward the element center (40%).
//   • A label box renders [data-cursor-label] text next to the cursor when set.
//
// Disabled on touch and reduced-motion.

import { useEffect, useRef, useState } from 'react';

export function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [label,   setLabel]   = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window) {
      setEnabled(false);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let ringScale = 1;
    let targetScale = 1;
    let snapTarget: { x: number; y: number } | null = null;
    let snapStrength = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, [data-cursor]') as HTMLElement | null;
      const magnetic    = t.closest('[data-magnetic]') as HTMLElement | null;
      const labelTarget = t.closest('[data-cursor-label]') as HTMLElement | null;

      if (interactive) {
        targetScale = magnetic ? 2.4 : 1.65;
        if (magnetic) {
          const rect = magnetic.getBoundingClientRect();
          snapTarget = {
            x: rect.left + rect.width / 2,
            y: rect.top  + rect.height / 2,
          };
          snapStrength = 0.4;
        } else {
          snapTarget = null;
          snapStrength = 0;
        }
      } else {
        targetScale = 1;
        snapTarget = null;
        snapStrength = 0;
      }

      const newLabel = labelTarget?.getAttribute('data-cursor-label') ?? null;
      setLabel(newLabel);
    };

    const animate = () => {
      // Dot tracks the mouse exactly.
      dotX = mouseX;
      dotY = mouseY;

      // Ring blends mouse with snapTarget when hovering a magnetic element.
      const tx = snapTarget ? mouseX * (1 - snapStrength) + snapTarget.x * snapStrength : mouseX;
      const ty = snapTarget ? mouseY * (1 - snapStrength) + snapTarget.y * snapStrength : mouseY;
      ringX += (tx - ringX) * 0.18;
      ringY += (ty - ringY) * 0.18;
      ringScale += (targetScale - ringScale) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${ringScale})`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${dotX + 24}px, ${dotY + 12}px, 0)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 6px gold dot — exact pointer position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[var(--color-gold)] pointer-events-none z-[9999] mix-blend-difference"
        aria-hidden
      />

      {/* 36px lerping ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-full border border-[var(--color-bone)] pointer-events-none z-[9998] mix-blend-difference"
        aria-hidden
      />

      {/* Contextual label, shown when [data-cursor-label] is hovered */}
      <div
        ref={labelRef}
        className={
          'fixed top-0 left-0 pointer-events-none z-[9997] ' +
          'font-mono text-[10px] uppercase tracking-[0.2em] ' +
          'text-[var(--color-bone)] mix-blend-difference ' +
          'px-3 py-1.5 border border-[var(--color-bone)] ' +
          'transition-opacity duration-150 ' +
          (label ? 'opacity-100' : 'opacity-0')
        }
        aria-hidden
      >
        {label}
      </div>
    </>
  );
}
