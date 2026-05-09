import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { InkVeil } from '@/components/ui/ink-veil';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: 'Trading, contracting and facility services across Qatar — three pillars, one operator.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <InkVeil className="!fixed" />
      {/* 300vh wrapper gives enough scroll runway for the backdrop animation */}
      <div className="relative z-10 min-h-[300vh]">
        {/* Sticky content — stays pinned while the backdrop scrubs */}
        <div className="sticky top-0 min-h-screen pt-32 pb-24 px-[clamp(1.5rem,4vw,4rem)] flex flex-col justify-between text-[var(--color-bone)]">
          <div className="mx-auto max-w-[1440px] w-full">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
              Services
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-2xl">
              Three pillars. One <em>operator.</em>
            </h1>
            <p className="mt-8 font-sans text-[16px] md:text-[18px] leading-[1.6] opacity-80 max-w-2xl">
              Trading, contracting, and facility services — delivered under one accountable scope across Qatar.
            </p>

            {/* Pillar links */}
            <div className="mt-16 flex flex-col sm:flex-row gap-8">
              <Link href="/services/trading" className="group flex items-center gap-4 text-[20px] font-display hover:text-[var(--color-gold)] transition-colors">
                Trading
                <span className="w-8 h-[1px] bg-[var(--color-bone)]/30 group-hover:bg-[var(--color-gold)] transition-colors inline-block" />
              </Link>
              <Link href="/services/contracting" className="group flex items-center gap-4 text-[20px] font-display hover:text-[var(--color-gold)] transition-colors">
                Contracting
                <span className="w-8 h-[1px] bg-[var(--color-bone)]/30 group-hover:bg-[var(--color-gold)] transition-colors inline-block" />
              </Link>
              <Link href="/services/facility-services" className="group flex items-center gap-4 text-[20px] font-display hover:text-[var(--color-gold)] transition-colors">
                Facility Services
                <span className="w-8 h-[1px] bg-[var(--color-bone)]/30 group-hover:bg-[var(--color-gold)] transition-colors inline-block" />
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mx-auto max-w-[1440px] w-full mt-16">
            <MagneticButton href="/contact" className="bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
              Send an RFQ →
            </MagneticButton>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
