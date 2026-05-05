'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Flame, HardHat, Construction as ConstructionIcon, Hotel,
  Zap, Factory, HeartPulse, Landmark,
} from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ArrowLink } from '@/components/ui/arrow-link';
import { StaggerChildren, liftChildVariant } from '@/components/motion/stagger-children';

// 8 sectors per 05-IA.md.
// TODO(arjun): commission bespoke 1px-line SVG glyphs — Lucide is V1 placeholder.
// TODO(arjun): real project counts when client confirms.
const SECTORS = [
  { slug: 'oil-gas',              name: 'Oil & Gas',              icon: Flame,            count: '// TODO' },
  { slug: 'construction',         name: 'Construction',           icon: HardHat,          count: '// TODO' },
  { slug: 'infrastructure',       name: 'Infrastructure',         icon: ConstructionIcon, count: '// TODO' },
  { slug: 'hospitality-facility', name: 'Hospitality & Facility', icon: Hotel,            count: '// TODO' },
  { slug: 'power-utilities',      name: 'Power & Utilities',      icon: Zap,              count: '// TODO' },
  { slug: 'manufacturing',        name: 'Manufacturing',          icon: Factory,          count: '// TODO' },
  { slug: 'healthcare',           name: 'Healthcare',             icon: HeartPulse,       count: '// TODO' },
  { slug: 'public-works',         name: 'Public Works',           icon: Landmark,         count: '// TODO' },
] as const;

// Section 4 of home: ink ground, 8 sector cells.
// Layout: 1-col mobile · 2-col tablet · 4-col desktop.
// Hairline grid via border-r/b on every cell + border-l/t on container.
// Reveal: 60ms stagger across the 8 cells (~480ms total).
export function IndustriesMatrix() {
  return (
    <section
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)] py-[clamp(5rem,12vh,12rem)]"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]">
        <Eyebrow number="03">Sectors we serve</Eyebrow>

        <StaggerChildren
          stagger={0.06}
          className="mt-[clamp(1.75rem,5vh,5rem)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-l border-[var(--color-haze)]"
        >
          {SECTORS.map(({ slug, name, icon: Icon, count }) => (
            <motion.div
              key={slug}
              variants={liftChildVariant}
              className="border-r border-b border-[var(--color-haze)]"
            >
              <Link
                href={`/industries#${slug}`}
                className="group relative flex h-full flex-col justify-between gap-6 p-6 sm:p-7 lg:p-8 min-h-[180px] sm:min-h-[200px] hover:bg-[var(--color-ink-2)] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-[-2px]"
              >
                <Icon
                  size={28}
                  strokeWidth={1.25}
                  className="shrink-0 text-[var(--color-bone)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[8deg]"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-2 min-w-0">
                  <h3 className="font-sans text-[18px] sm:text-[20px] font-medium tracking-[-0.005em] text-[var(--color-bone)] break-words">
                    {name}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-smoke)] group-hover:text-[var(--color-gold)] transition-colors duration-200">
                    {count} projects
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>

        <div className="mt-[clamp(2rem,5vh,4rem)]">
          <ArrowLink
            href="/industries"
            className="text-[var(--color-bone)] border-[var(--color-bone)] hover:text-[var(--color-gold)]"
          >
            See all industries
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
