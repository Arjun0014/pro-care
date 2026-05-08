'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 7.
// A list of project rows; hovering a row makes a single thumbnail follow the
// cursor (offset 24px right + 24px down) with a slight lerp. Mask-reveal entry,
// mask-collapse exit. Mobile/reduced-motion fallback: thumbnails inline.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'motion/react';

export type HoverPreviewItem = {
  id:     string;
  name:   string;
  image:  string;
  alt?:   string;
  href:   string;
  /** Optional metadata rendered as small uppercase mono caps under the name. */
  sector?: string;
  year?:   string;
};

type Props = {
  items: HoverPreviewItem[];
  className?: string;
};

export function HoverPreview({ items, className }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reduceMotion) return;
    if ('ontouchstart' in window) return;
    const node = previewRef.current;
    if (!node) return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    let px = 0;
    let py = 0;

    // Per 21-CANVAS-FIRST-REDESIGN.md § Section 9 — clamp the thumbnail to
    // the viewport with a 24px margin on every side. Cursor at the right
    // edge → thumbnail flips left of cursor; near the bottom → flips above.
    // Constants match the hard-coded thumbnail size below (280×350).
    const TH_W = 280;
    const TH_H = 350;
    const MARGIN = 24;

    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    const onMove = (e: MouseEvent) => {
      const maxX = window.innerWidth  - TH_W - MARGIN;
      const maxY = window.innerHeight - TH_H - MARGIN;
      mx = clamp(e.clientX + MARGIN, MARGIN, maxX);
      my = clamp(e.clientY + MARGIN, MARGIN, maxY);
    };

    const tick = () => {
      px += (mx - px) * 0.18;
      py += (my - py) * 0.18;
      node.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    // Reset hover state on scroll so the preview thumbnail doesn't get
    // stuck if the user scrolls away from a row mid-hover.
    const onScroll = () => setActiveId(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const active = items.find((i) => i.id === activeId);

  // Reduced motion / touch: inline thumbnails next to each row.
  if (reduceMotion) {
    return (
      <ul className={cn('divide-y divide-current/15', className)}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={item.href}
              className="flex items-center gap-6 py-6 px-4"
            >
              <span className="font-mono text-xs text-[var(--color-ink)]/50 w-8">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-none flex-1">
                {item.name}
              </span>
              <span className="relative w-[120px] aspect-[4/3] overflow-hidden flex-none">
                <Image
                  src={item.image}
                  alt={item.alt ?? item.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  const previewStyle: CSSProperties = {
    clipPath: active ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
  };

  return (
    <>
      <ul className={cn('flex flex-col', className)}>
        {items.map((item, i) => (
          <li
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId((id) => (id === item.id ? null : id))}
            className="group border-b border-[var(--color-bone)]/15 last:border-b-0"
          >
            {/* Per R2.7 § Task 4 — index left, project name + meta stacked
                vertically right. Hairline divider between rows replaces the
                R2.6 per-row box tint (the divider reads cleaner against the
                wider 1.4fr column). */}
            <a
              href={item.href}
              data-cursor
              data-cursor-label="VIEW"
              className={cn(
                'flex items-start gap-6 py-7 sm:py-9 px-2 sm:px-4',
                'transition-[padding,background-color] duration-300',
                'group-hover:px-4 sm:group-hover:px-6 group-hover:bg-[var(--color-bone)]/[0.04]',
                'min-w-0',
              )}
            >
              <span className="shrink-0 font-mono text-[11px] sm:text-xs text-current opacity-60 tabular-nums w-12 pt-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.1] tracking-[-0.01em] pb-[0.05em]">
                  {item.name}
                </h3>
                <div className="flex items-baseline gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] opacity-75 group-hover:opacity-100 transition-opacity">
                  {item.sector && (
                    <>
                      <span>{item.sector}</span>
                      <span aria-hidden className="text-[var(--color-bone)]/40">·</span>
                    </>
                  )}
                  {item.year && (
                    <>
                      <span className="tabular-nums">{item.year}</span>
                      <span aria-hidden className="text-[var(--color-bone)]/40">·</span>
                    </>
                  )}
                  <span>View →</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        className={cn(
          'fixed top-0 left-0 pointer-events-none z-50 overflow-hidden',
          // Subtle border so the thumbnail is distinguishable from the
          // canvas behind the rest of the page (doc 21 § Section 9).
          'border border-[var(--color-bone)]/25',
          'transition-[clip-path,opacity] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)]',
          active ? 'opacity-100' : 'opacity-0',
        )}
        // Hard-coded size — 280×350 (4:5 portrait per doc 16 § HoverPreview
        // spec). Inline `width`/`height` plus explicit min/max box-size
        // ensure no parent or utility class can override the dimensions.
        style={{
          ...previewStyle,
          width:    280,
          height:   350,
          minWidth: 280,
          maxWidth: 280,
          minHeight: 350,
          maxHeight: 350,
        }}
        aria-hidden
      >
        {active && (
          <Image
            src={active.image}
            alt={active.alt ?? active.name}
            // Explicit width/height instead of fill so Next.js Image
            // can't introduce intrinsic-aspect quirks. Wrapper has
            // overflow:hidden so any minor slice is hidden cleanly.
            width={280}
            height={350}
            sizes="280px"
            className="block w-full h-full object-cover"
          />
        )}
      </div>
    </>
  );
}
