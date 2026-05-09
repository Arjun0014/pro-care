import Link from 'next/link';
import { InkVeil } from '@/components/ui/ink-veil';

// Per 05-IA.md: a single editorial line, no drama, same ground rhythm.
export default function NotFound() {
  return (
    <>
      <InkVeil className="!fixed" />
      <div className="relative z-10 min-h-[300vh]">
        <section
          className="text-[var(--color-bone)] min-h-screen flex flex-col items-start justify-center px-[clamp(1.5rem,4vw,4rem)] pt-20"
        >
          <div className="mx-auto max-w-[1440px] w-full">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
              404
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em]">
              That page isn&apos;t here.
            </h1>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 font-sans text-[15px] font-medium border-b border-current pb-1 hover:text-[var(--color-gold-deep)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
            >
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
