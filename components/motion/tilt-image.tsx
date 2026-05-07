'use client';

// Per 16-EXTRA-PATTERNS.md § Component 16.
// 3D-ish parallax tilt on hover. Subtle — max 6° tilt, capped slight scale.
// Touch and reduced-motion: handlers no-op (the element stays at neutral).
// 'use client' present; window guarded inside handlers (event-driven, so SSR
// only executes the function bodies on the client).

import { useRef, type ReactNode, type MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  /** Max tilt in degrees (default 6). */
  max?: number;
  className?: string;
};

export function TiltImage({ children, max = 6, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5..0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(1.02)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
