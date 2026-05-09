import type { Metadata } from 'next';
import Link from 'next/link';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Clients',
  description: 'Pro Care Qatar Clients. Content coming soon.',
};

export default function ClientsPage() {
  return (
    <>
      <main className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-[90svh] pt-40 pb-24 px-[5vw] flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-6">
            Clients
          </span>
          <SplitText
            as="h1"
            className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] mb-8"
          >
            Trusted by operators across Qatar.
          </SplitText>
          <p className="font-sans text-[18px] md:text-[20px] leading-[1.6] opacity-80 mb-12 max-w-2xl">
            End-users, main contractors, and partners we work with.
          </p>
          
          <div className="bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10 px-8 py-6 rounded-sm mb-16 inline-block">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-70">
              Content coming soon — check back shortly.
            </span>
          </div>

          <MagneticButton href="/" className="bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]">
            ← Return Home
          </MagneticButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
