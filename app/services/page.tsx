import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { InkVeil } from '@/components/ui/ink-veil';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: 'Trading, contracting and facility services across Qatar — three pillars, one operator.',
  path: '/services',
});

// TODO: Phase 3 — build Services overview sections:
// - Brief intro
// - Three pillar slabs (Trading / Contracting / Facility Services)
// - Capabilities matrix
// - CTA
export default function ServicesPage() {
  return (
    <>
      <InkVeil className="!fixed" />
      <section
        className="text-[var(--color-bone)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)] relative z-10"
      >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Services
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          Three pillars. One <em>operator.</em>
        </h1>
      </div>
    </section>
    </>
  );
}
