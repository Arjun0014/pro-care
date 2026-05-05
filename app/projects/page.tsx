import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description: 'Selected projects delivered by Pro Care Qatar across trading, contracting, and facility services.',
  path: '/projects',
});

// TODO: Phase 3 — build Projects gallery:
// - Editorial grid — large, asymmetric, sector-tagged
// - Filter by sector + by pillar
// - Hover reveals end-user / client / description
// - V2: click → detail page; V1: hover-expand
export default function ProjectsPage() {
  return (
    <section
      data-ground="ink"
      className="bg-[var(--color-ink)] text-[var(--color-bone)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Projects
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl text-[var(--color-bone)]">
          {/* TODO: client copy */}
          Selected work across <em>Qatar and the Gulf.</em>
        </h1>
        <p className="mt-4 font-sans text-[14px] text-[var(--color-bone)]/50">
          {/* TODO(arjun): replace with real project list from client */}
        </p>
      </div>
    </section>
  );
}
