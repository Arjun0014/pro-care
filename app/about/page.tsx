import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: 'One team. Three companies. One standard. Built for operators who need one accountable partner.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <main className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-24 px-[5vw] border-b border-[var(--color-ink)]/10">
          <div className="max-w-5xl mx-auto">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
              About
            </span>
            <SplitText
              as="h1"
              className="mt-6 font-display text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] max-w-4xl"
            >
              One team. <em>Three companies.</em> One standard.
            </SplitText>
            <p className="mt-8 font-sans text-[18px] md:text-[20px] leading-[1.6] text-[var(--color-ink)]/80 max-w-2xl">
              In Qatar's construction economy, three things keep going wrong: materials arrive late, builds finish over budget, and what was built isn't maintained well. We started Pro Care because the same team that brings the materials, builds with them, and maintains them afterwards has every incentive to get all three right. <em>Single accountability across the lifecycle of a building.</em>
            </p>
          </div>
        </section>

        {/* Company Stats */}
        <section className="bg-[var(--color-ink)] text-[var(--color-bone)] py-24 px-[5vw]">
          <div className="max-w-7xl mx-auto">
            <span className="block font-mono text-xs uppercase tracking-[0.2em] opacity-80 mb-12 text-[var(--color-gold)]">
              By the numbers
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Stat 1 */}
              <div className="flex flex-col gap-3 border-t border-[var(--color-bone)]/20 pt-6">
                <em className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1.1] tracking-[-0.01em]">
                  Three
                </em>
                <span className="font-sans text-[15px] leading-[1.4] opacity-80">
                  Disciplines, one team.
                </span>
              </div>
              {/* Stat 2 */}
              <div className="flex flex-col gap-3 border-t border-[var(--color-bone)]/20 pt-6">
                <span className="font-mono text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]">
                  20+
                </span>
                <span className="font-sans text-[15px] leading-[1.4] opacity-80">
                  Projects delivered across Qatar.
                </span>
              </div>
              {/* Stat 3 */}
              <div className="flex flex-col gap-3 border-t border-[var(--color-bone)]/20 pt-6">
                <span className="font-mono text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
                  100,000 <span className="text-[1rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">QAR</span>
                </span>
                <span className="font-sans text-[15px] leading-[1.4] opacity-80">
                  Registered capital
                </span>
              </div>
            </div>
            
            <div className="mt-16 font-mono text-[11px] uppercase tracking-[0.1em] opacity-60">
              Pro Care Trading, Contracting and Facility Services W.L.L. is registered in Doha, Qatar (CR# 217949). Registered capital: 100,000 QAR. Renewal: 25 May 2026.
            </div>
          </div>
        </section>

        {/* Three Disciplines Brief */}
        <section className="py-24 px-[5vw]">
          <div className="max-w-7xl mx-auto">
            <span className="block font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-12">
              Three Disciplines
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-[28px] tracking-[-0.01em]">Trading</h3>
                <p className="font-sans text-[15px] leading-[1.6] opacity-80">
                  We supply the materials, equipment, and tools that Qatar's largest projects rely on. From civil construction inputs to specialized MEP equipment.
                </p>
                <Link href="/services/trading" className="font-sans text-[14px] text-[var(--color-gold)] hover:underline mt-2">Explore Trading →</Link>
              </div>
              <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[var(--color-ink)]/10 pt-8 md:pt-0 md:pl-12">
                <h3 className="font-display text-[28px] tracking-[-0.01em]">Contracting</h3>
                <p className="font-sans text-[15px] leading-[1.6] opacity-80">
                  We are the team between the drawings and the finished building. Civil, MEP, fit-out — delivered against fixed timelines, with site safety as the first metric.
                </p>
                <Link href="/services/contracting" className="font-sans text-[14px] text-[var(--color-gold)] hover:underline mt-2">Explore Contracting →</Link>
              </div>
              <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[var(--color-ink)]/10 pt-8 md:pt-0 md:pl-12">
                <h3 className="font-display text-[28px] tracking-[-0.01em]">Facility Services</h3>
                <p className="font-sans text-[15px] leading-[1.6] opacity-80">
                  We maintain buildings — the mechanical systems that keep them habitable, the surfaces that keep them presentable, and the response times that keep clients calm.
                </p>
                <Link href="/services/facility-services" className="font-sans text-[14px] text-[var(--color-gold)] hover:underline mt-2">Explore Facility Services →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--color-ink)] text-[var(--color-bone)] py-24 px-[5vw] text-center flex flex-col items-center">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] mb-10">
            Working in our sectors? Let's talk.
          </h2>
          <MagneticButton href="/contact" className="bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
            Send an RFQ →
          </MagneticButton>
        </section>
      </main>
      <Footer />
    </>
  );
}
