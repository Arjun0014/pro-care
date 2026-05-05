import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contracting',
  description: 'Pro Care Qatar contracting — civil, MEP, fit-out, and infrastructure execution across Doha and the Gulf.',
  path: '/services/contracting',
});

// TODO: Phase 3 — build Contracting pillar detail page.
export default function ContractingPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          02 / 03 — Contracting
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Civil, MEP, fit-out and <em>infrastructure execution.</em>
        </h1>
      </div>
    </section>
  );
}
