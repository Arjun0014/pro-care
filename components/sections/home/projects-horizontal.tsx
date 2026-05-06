'use client';

// Per 13-HOME-AWARD-TIER.md § Section 6 — Projects (horizontal scroll).
// Pinned section, inner track is a horizontal flexbox of 5 project cards.
// Each card wrapped in <TiltImage>. data-cursor-label="DRAG SCROLL" on the
// section, "VIEW" on each card. Section header counter ("01 / 05") updates
// as scroll progresses through cards.
//
// Mobile (<769px): no pin, cards stack vertically (HorizontalScroll's
// internal matchMedia handles that).

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HorizontalScroll } from '@/components/motion/horizontal-scroll';
import { TiltImage }        from '@/components/motion/tilt-image';
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
      data-ground="bone"
      data-cursor-label="DRAG SCROLL"
      className="relative w-full bg-[var(--color-bone)] text-[var(--color-ink)]"
      aria-label="Projects gallery"
    >
      <header className="px-[5vw] pt-[10vh] pb-12 flex items-baseline justify-between gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
          Selected projects
        </h2>
        <span className="font-mono text-xs tabular-nums opacity-70">
          {String(counter).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
        </span>
      </header>

      <HorizontalScroll className="pl-[5vw] pr-[5vw] pb-[10vh]">
        {featured.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-cursor
            data-cursor-label="VIEW"
            data-project-card
            className="group block w-[80vw] md:w-[480px] flex-shrink-0"
          >
            <TiltImage>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(min-width: 768px) 480px, 80vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
            </TiltImage>
            <div className="pt-6 flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                {p.sector} · {p.year}
              </span>
              <h3 className="font-display text-[clamp(1.5rem,2vw,2rem)] leading-[1.1]">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
