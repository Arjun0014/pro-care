'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { clients } from '@/lib/content/clients';
import { Eyebrow }   from '@/components/ui/eyebrow';
import { ArrowLink } from '@/components/ui/arrow-link';
import { StaggerChildren } from '@/components/motion/stagger-children';
import { easings } from '@/lib/motion';

// Per spec § Client wall: 200ms opacity fade per cell, 30ms stagger across grid.
const cellVariant = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easings.out as [number, number, number, number],
    },
  },
} as const;

// Section 8 of home: ink ground, logo wall.
// Until real client logos exist (TODO), each cell renders the client name
// in mono uppercase as a placeholder. Hairline grid via border-l/t on the
// container + border-r/b on each cell. Hover: cell border shifts haze→gold.
//
// Mobile: 2 cols · sm: 3 cols · md: 4 cols · lg: 6 cols.
export function ClientWall() {
  return (
    <section
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Eyebrow number="07">Trusted by</Eyebrow>
          <ArrowLink
            href="/clients"
            className="text-[var(--color-bone)] border-[var(--color-bone)] hover:text-[var(--color-gold)]"
          >
            See all clients
          </ArrowLink>
        </div>

        <StaggerChildren
          stagger={0.03}
          className="mt-[clamp(2rem,5vh,5rem)] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-[var(--color-haze)]"
        >
          {clients.map((c, i) => (
            <motion.div key={`${c.sector}-${i}`} variants={cellVariant}>
              <Link
                href="/clients"
                className="group relative flex aspect-square items-center justify-center border-r border-b border-[var(--color-haze)] hover:border-[var(--color-gold)] transition-colors duration-200 px-4 py-3 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-[-2px]"
                aria-label={c.name}
                title={c.name}
              >
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[var(--color-bone)]/55 group-hover:text-[var(--color-bone)] transition-colors duration-200 text-center break-words [filter:grayscale(1)] group-hover:[filter:grayscale(0)]">
                  {c.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
