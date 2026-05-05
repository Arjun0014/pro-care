// app/components-test/page.tsx
// R1.C test bed — every new component renders here with synthetic content.
// This page exists only during R1; in production the home page composes
// these via app/page.tsx (R2 work).

import type { Metadata } from 'next';
import { SplitText }    from '@/components/motion/split-text';
import { MaskedReveal } from '@/components/motion/masked-reveal';
import { Marquee }        from '@/components/motion/marquee';
import { MagneticButton } from '@/components/ui/magnetic-button';

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

        {/* C.3 — <Marquee> (ticker + headline variants) */}
        <section>
          <div className="px-[5vw]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              C.3 · Marquee — ticker
            </span>
          </div>
          <Marquee variant="ticker" className="mt-4 py-4 border-y border-[var(--color-mist)]">
            <span className="px-6">PRO CARE QATAR</span>
            <span className="px-6">·</span>
            <span className="px-6">TRADING</span>
            <span className="px-6">·</span>
            <span className="px-6">CONTRACTING</span>
            <span className="px-6">·</span>
            <span className="px-6">FACILITY SERVICES</span>
            <span className="px-6">·</span>
            <span className="px-6">CR# 217949</span>
            <span className="px-6">·</span>
            <span className="px-6">ESTABLISHED IN DOHA</span>
            <span className="px-6">·</span>
            <span className="px-6">BUILT TO LAST</span>
            <span className="px-6">·</span>
          </Marquee>

          <div className="px-[5vw] mt-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              C.3 · Marquee — headline
            </span>
          </div>
          <Marquee variant="headline" speed={20} className="mt-4">
            <span className="px-12">Trading</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
            <span className="px-12 italic">Contracting</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
            <span className="px-12">Facility Services</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
          </Marquee>
        </section>

        {/* C.4 — useMagnetic + <MagneticButton> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.4 · MagneticButton
          </span>
          <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
            Hover near the button — it should translate ~25% of the cursor offset.
          </p>
          <div className="mt-8 flex items-center gap-8 flex-wrap">
            <MagneticButton>Get in touch</MagneticButton>
            <MagneticButton strength={0.4}>Stronger pull</MagneticButton>
          </div>
        </section>

        {/* C.2 — <MaskedReveal> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.2 · MaskedReveal
          </span>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['bottom', 'top', 'left', 'right'] as const).map((dir) => (
              <MaskedReveal
                key={dir}
                direction={dir}
                className="aspect-[4/5] bg-[var(--color-ink)] text-[var(--color-bone)] grid place-items-center"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                  from {dir}
                </span>
              </MaskedReveal>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
