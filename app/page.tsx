import type { Metadata } from 'next';
import { Hero }              from '@/components/sections/home/hero';
import { IdentityStrip }     from '@/components/sections/home/identity-strip';
import { IndustriesMatrix }  from '@/components/sections/home/industries-matrix';
import { SelectedProjects }  from '@/components/sections/home/selected-projects';
import { StatsStrip }        from '@/components/sections/home/stats-strip';
import { WhyProCare }        from '@/components/sections/home/why-procare';
import { ClientWall }        from '@/components/sections/home/client-wall';
import { ClosingCta }        from '@/components/sections/home/closing-cta';

export const metadata: Metadata = {
  title: 'Pro Care Qatar — Trading, Contracting, Facility Services',
  description:
    'Qatar-rooted operator delivering trading, contracting, and facility services across the Gulf.',
};

// Phase 2 — sections build out one at a time per 09-IMPLEMENTATION-PLAN.md.
// Build order: Hero, Identity strip, Industries matrix, Selected projects,
// Stats, Why Pro Care, Client wall, Closing CTA, Pillars (last).
// Visual order in the rendered page is different — Pillars sits between
// Identity strip and Industries matrix. The placeholder below holds its slot.
export default function HomePage() {
  return (
    <>
      <Hero />
      <IdentityStrip />

      {/* Pillars placeholder — bone ground, built last (Step 2.9). */}
      <section
        data-ground="bone"
        className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-[50vh] flex flex-col items-center justify-center px-[clamp(1.5rem,4vw,4rem)] py-[clamp(4rem,10vh,8rem)]"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Pillars (built last per 09-IMPLEMENTATION-PLAN.md)
        </span>
      </section>

      <IndustriesMatrix />
      <SelectedProjects />
      <StatsStrip />
      <WhyProCare />
      <ClientWall />
      <ClosingCta />
    </>
  );
}
