import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Send an RFQ or project enquiry to Pro Care Qatar — trading, contracting, and facility services in Doha.',
  path: '/contact',
});

// TODO: Phase 3 — build Contact page:
// - Headline + supporting copy
// - Intent selector (RFQ / Project enquiry / Vendor / General)
// - Form (changes fields by intent) — React Hook Form + Zod
// - Office address + map
// - Direct contact lines
// - Form posts to /api/contact → Web3Forms
export default function ContactPage() {
  return (
    <section
      data-ground="bone"
      className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
          Contact
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
          {/* TODO: client copy */}
          Tell us what you need. We will <em>respond fast.</em>
        </h1>
        <p className="mt-6 font-sans text-[14px] text-[var(--color-smoke)]">
          {/* TODO: real contact details from client */}
          Doha, Qatar · CR# 217949
        </p>
      </div>
    </section>
  );
}
