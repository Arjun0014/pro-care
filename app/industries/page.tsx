import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Industries',
  description: 'Pro Care Qatar serves Oil & Gas, Construction, Infrastructure, Hospitality, Power, Manufacturing, Healthcare, and Public Works sectors.',
  path: '/industries',
});

// TODO: Phase 3 — build Industries page:
// - Sector grid (8 industries)
// - Each cell expands to projects + capabilities
export default function IndustriesPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Industries
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Eight sectors. One <em>consistent standard.</em>
        </h1>
      </div>
    </section>
  );
}
