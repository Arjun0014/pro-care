import type { Metadata } from 'next';
import Link from 'next/link';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';
import { InkVeil } from '@/components/ui/ink-veil';

export const metadata: Metadata = {
  title: 'Industries',
  description: 'Pro Care Qatar Industries. Content coming soon.',
};

export default function IndustriesPage() {
  return (
    <>
      <InkVeil className="!fixed" />
      <div className="text-[var(--color-bone)] min-h-[90svh] pt-40 pb-24 px-[5vw] flex flex-col items-start justify-center text-left relative z-10">
        <div className="max-w-3xl mr-auto flex flex-col items-start">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-6">
            Industries
          </span>
          <SplitText
            as="h1"
            className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] mb-8"
          >
            Sectors we serve.
          </SplitText>
          <p className="font-sans text-[18px] md:text-[20px] leading-[1.6] opacity-80 mb-12 max-w-2xl">
            Eight industries. Each with delivered references and a dedicated capability set.
          </p>
          
          <div className="bg-[var(--color-bone)]/5 border border-[var(--color-bone)]/10 px-8 py-6 rounded-sm mb-16 inline-block">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-70">
              Content coming soon — check back shortly.
            </span>
          </div>

          <MagneticButton href="/" className="bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
            ← Return Home
          </MagneticButton>
        </div>
      </div>
      <Footer />
    </>
  );
}
