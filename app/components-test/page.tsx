// app/components-test/page.tsx
// R1.C test bed — every new component renders here with synthetic content.
// This page exists only during R1; in production the home page composes
// these via app/page.tsx (R2 work).

import type { Metadata } from 'next';
import { SplitText } from '@/components/motion/split-text';

export const metadata: Metadata = {
  title: 'Components Test (R1)',
  description: 'Internal test bed for the 17 award-tier components.',
  robots: { index: false, follow: false },
};

export default function ComponentsTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)]">
      <header className="px-[5vw] pt-32 pb-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
          R1 — Components test bed
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] tracking-tight max-w-[20ch]">
          17 components, <em>built and isolated.</em>
        </h1>
        <p className="mt-6 font-sans text-[16px] leading-[1.55] text-[var(--color-ink)]/70 max-w-[60ch]">
          Each section below is a single component rendered with synthetic
          content. Resize, scroll, hover — every component has a reduced-motion
          fallback that activates via DevTools → Rendering → Emulate
          prefers-reduced-motion: reduce.
        </p>
      </header>

      <main className="space-y-32 pb-32">
        {/* C.1 — <SplitText> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.1 · SplitText
          </span>
          <SplitText
            as="h2"
            className="mt-4 font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-[-0.02em] block"
          >
            We build for <em>Qatar</em>.
          </SplitText>
        </section>
      </main>
    </div>
  );
}
