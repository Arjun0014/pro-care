'use client';

// Per 21-CANVAS-FIRST-REDESIGN.md § Section 6 — typographic horizontal scroll.
// The pin-and-scrub mechanic is preserved (HorizontalScroll handles it). What
// changes vs R2: card images and TiltImage are gone; cards are pure
// typography with a hairline border. Section is transparent so the canvas
// continues to scrub through during the horizontal scroll. Cards anchored
// to viewport bottom 60% so the building behind isn't fully obscured.
//
// Mobile fallback (<769px) inside HorizontalScroll: cards stack vertically
// instead of pinning.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HorizontalScroll } from '@/components/motion/horizontal-scroll';
import { projects, type Project } from '@/lib/content/projects';

const featured: readonly Project[] = projects.slice(0, 5);

export function ProjectsHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counter, setCounter] = useState(1);

  // Update the header counter as the user scrolls past each card.
  // Use the cards' visible center positions to figure out which is "active".
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = sectionRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-project-card]'));
    if (cards.length === 0) return;

    let raf = 0;
    const tick = () => {
      const center = window.innerWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      setCounter(bestIdx + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-cursor-label="DRAG SCROLL"
      className="relative w-full text-[var(--color-bone)] [text-shadow:0_1px_2px_rgba(11,18,32,0.5),0_0_24px_rgba(11,18,32,0.35)]"
      aria-label="Projects gallery"
    >
      <header className="px-[5vw] pt-[10vh] pb-12 flex items-baseline justify-between gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-80">
          Selected projects
        </h2>
        <span className="font-mono text-xs tabular-nums opacity-80">
          {String(counter).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
        </span>
      </header>

      {/* Cards anchored to viewport bottom 60% so the canvas building (mid-
          frame) stays visible behind them. `pt-[40vh]` pushes the card
          track down within HorizontalScroll's pinned viewport on desktop;
          mobile (no pin) just stacks naturally. */}
      <HorizontalScroll className="pl-[5vw] pr-[5vw] pb-[10vh] md:pt-[20vh]">
        {featured.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-cursor
            data-cursor-label="VIEW"
            data-project-card
            className="group block w-[80vw] md:w-[480px] h-[60vh] flex-shrink-0 border border-[var(--color-bone)]/15 hover:border-[var(--color-bone)]/30 transition-colors duration-300 p-8 sm:p-10 flex flex-col"
          >
            {/* Top row — index + year */}
            <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="opacity-80 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="opacity-80 tabular-nums">{p.year}</span>
            </div>

            {/* Project name — large display, takes available space */}
            <h3 className="mt-auto font-display text-[clamp(2rem,3.2vw,3.25rem)] leading-[1.05] tracking-[-0.01em] max-w-[14ch]">
              {p.title}
            </h3>

            {/* Bottom row — sector + view */}
            <div className="mt-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="text-[var(--color-gold)]">{p.sector}</span>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                View details →
              </span>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
