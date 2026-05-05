import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: 'Pro Care Qatar — established operator with a record of delivery across trading, contracting, and facility services in Doha.',
  path: '/about',
});

// TODO: Phase 3 — build About sections:
// - Cover banner with mission line
// - Operating principles
// - Leadership grid (TODO: client to supply headshots)
// - Certifications strip (TODO: ISO 9001, ICV, etc.)
// - Closing CTA to projects
export default function AboutPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          About
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          A Doha-rooted operator built on <em>delivered work.</em>
        </h1>
        <p className="mt-6 font-sans text-[18px] leading-[1.55] text-[var(--color-ink)]/70 max-w-[52ch]">
          {/* TODO: client copy */}
          CR# 217949 · Capital QAR 100,000 · Operating through 25/05/2026.
        </p>
      </div>
    </section>
  );
}
