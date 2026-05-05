import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Clients',
  description: 'Trusted by leading Qatar and Gulf operators — Pro Care client list and references.',
  path: '/clients',
});

// TODO: Phase 3 — build Clients page:
// - Logo wall (40+ marks)
// - 3–5 client testimonials with full attribution
// - Sector breakdown stat strip
// TODO(arjun): replace placeholder grid with real client logos when supplied.
export default function ClientsPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Clients
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Trusted by the <em>operators who build Qatar.</em>
        </h1>
      </div>
    </section>
  );
}
