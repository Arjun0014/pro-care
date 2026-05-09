import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = buildMetadata({
  title: 'Facility Services',
  description: 'Buildings that keep running. Keeping operations running, every day.',
  path: '/services/facility-services',
});

export default function FacilityServicesPage() {
  return (
    <>
      <main>
        {/* 1. Pillar hero (bone) */}
        <section className="relative h-[80svh] w-full px-[5vw] flex flex-col justify-end pb-[10vh] bg-[var(--color-bone)] text-[var(--color-bone)] pt-32">
          <div className="absolute inset-0 z-0 bg-[var(--color-ink)]">
            <Image
              src="/images/pillars/facility.jpg"
              alt="Facility maintenance"
              fill
              className="object-cover opacity-80"
              priority
            />
            {/* Subtle gradient so text reads */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 via-[var(--color-ink)]/20 to-transparent pointer-events-none" />
          </div>
          
          <div className="relative z-10 max-w-5xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-80 block mb-4 text-[var(--color-gold)]">
              Keeping operations running, every day.
            </span>
            <SplitText
              as="h1"
              className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[1.05] tracking-[-0.02em] mb-6 [text-shadow:0_1px_8px_rgba(11,18,32,0.5)] max-w-[14ch]"
            >
              Buildings that keep running.
            </SplitText>
            <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] max-w-[48ch] opacity-90 [text-shadow:0_1px_4px_rgba(11,18,32,0.8)]">
              Buildings exist long after handover. We maintain them — the mechanical systems that keep them habitable, the surfaces that keep them presentable, and the response times that keep clients calm.
            </p>
          </div>
        </section>

        {/* 2. Sub-capabilities grid (bone) */}
        <section className="bg-[var(--color-bone)] text-[var(--color-ink)] px-[5vw] py-[14vh]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-12 opacity-80 text-[var(--color-gold)]">
              What we deliver
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                {
                  title: '24/7 mechanical maintenance',
                  desc: 'Round-the-clock technical support for critical HVAC and electrical systems.',
                },
                {
                  title: 'Cleaning services',
                  desc: 'Comprehensive soft FM including deep cleaning and daily janitorial support.',
                },
                {
                  title: 'Pest control',
                  desc: 'Scheduled and reactive pest management for commercial properties.',
                },
                {
                  title: 'Operations support',
                  desc: 'Integrated facility management handling day-to-day building needs.',
                },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col gap-5 border-t border-[var(--color-ink)]/15 pt-8 hover:border-[var(--color-gold)] transition-colors duration-400">
                  <div className="w-6 h-[1px] bg-[var(--color-ink)] group-hover:bg-[var(--color-gold)] group-hover:scale-125 transition-all duration-400 origin-left" />
                  <h3 className="font-display text-[24px] tracking-[-0.01em]">{item.title}</h3>
                  <p className="font-sans text-[15px] leading-[1.6] opacity-75">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Adjacent pillars (ink) */}
        <section className="bg-[var(--color-ink)] text-[var(--color-bone)] px-[5vw] py-[10vh] border-b border-[var(--color-bone)]/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
              Also offering
            </span>
            <div className="flex flex-col sm:flex-row gap-8">
              <Link href="/services/trading" className="group flex items-center gap-4 text-[20px] font-display hover:text-[var(--color-gold)] transition-colors">
                Trading
                <span className="w-8 h-[1px] bg-[var(--color-bone)]/30 group-hover:bg-[var(--color-gold)] transition-colors inline-block" />
              </Link>
              <Link href="/services/contracting" className="group flex items-center gap-4 text-[20px] font-display hover:text-[var(--color-gold)] transition-colors">
                Contracting
                <span className="w-8 h-[1px] bg-[var(--color-bone)]/30 group-hover:bg-[var(--color-gold)] transition-colors inline-block" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Closing CTA (bone) */}
        <section className="bg-[var(--color-bone)] text-[var(--color-ink)] px-[5vw] py-[14vh] text-center flex flex-col items-center">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] mb-10 max-w-[20ch]">
            Project requires facility services? Let's scope it.
          </h2>
          <MagneticButton href="/contact" className="bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
            Send an RFQ →
          </MagneticButton>
        </section>
      </main>
      <Footer />
    </>
  );
}
