import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Facility Services',
  description: 'Pro Care Qatar facility services — hard and soft FM for commercial, residential, and industrial sites across Qatar.',
  path: '/services/facility-services',
});

// TODO: Phase 3 — build Facility Services pillar detail page.
export default function FacilityServicesPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          03 / 03 — Facility Services
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Hard and soft FM that keeps <em>operations running.</em>
        </h1>
      </div>
    </section>
  );
}
