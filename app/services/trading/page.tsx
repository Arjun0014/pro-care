import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Trading',
  description: 'Pro Care Qatar trading arm — sourcing and supplying materials, tools, and equipment to construction, oil & gas, and industrial clients.',
  path: '/services/trading',
});

// TODO: Phase 3 — build Trading pillar detail page:
// - Pillar hero
// - Sub-capabilities grid
// - Sample project (one, large)
// - Process diagram
// - Adjacent pillars (cross-link)
// - CTA
export default function TradingPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          01 / 03 — Trading
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Supplying the materials projects <em>depend on.</em>
        </h1>
      </div>
    </section>
  );
}
