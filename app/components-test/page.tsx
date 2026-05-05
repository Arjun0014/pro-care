// app/components-test/page.tsx
// R1.C test bed — every new component renders here with synthetic content.
// This page exists only during R1; in production the home page composes
// these via app/page.tsx (R2 work).

import type { Metadata } from 'next';
import { SplitText }    from '@/components/motion/split-text';
import { MaskedReveal } from '@/components/motion/masked-reveal';
import { Marquee }        from '@/components/motion/marquee';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { HoverPreview }   from '@/components/motion/hover-preview';
import { Preloader }      from '@/components/preloader';
import { RouteCurtain }   from '@/components/route-curtain';
import { HorizontalScroll } from '@/components/motion/horizontal-scroll';
import { HeroVideo }        from '@/components/motion/hero-video';
import { ImageCluster }     from '@/components/motion/image-cluster';
import { LiveClock }        from '@/components/ui/live-clock';
import { LocaleToggle }     from '@/components/ui/locale-toggle';
import { ScrollSkew }       from '@/components/motion/scroll-skew';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Components Test (R1)',
  description: 'Internal test bed for the 17 award-tier components.',
  robots: { index: false, follow: false },
};

export default function ComponentsTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)]">
      {/* C.6 — <Preloader> mounts on first visit; sessionStorage skips on revisit. */}
      <Preloader />
      {/* C.7 — <RouteCurtain> plays on every route change. */}
      <RouteCurtain />

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

        {/* C.7 — <RouteCurtain> demonstration links */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.7 · RouteCurtain
          </span>
          <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
            Click a link — the ink panel slides up, displays the destination
            page name, then slides off the top. ~1.2s total.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            {(['/about', '/services', '/projects', '/contact'] as const).map((href) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-xs uppercase tracking-[0.2em] border border-[var(--color-ink)] px-4 py-2 hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] transition-colors duration-200"
              >
                {href}
              </Link>
            ))}
          </div>
        </section>

        {/* C.14 — useScrollVelocity + <ScrollSkew> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.14 · ScrollSkew
          </span>
          <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
            Scroll fast and the headline skews subtly (capped at 1.5°). When
            scroll stops, target decays back to 0.
          </p>
          <ScrollSkew className="mt-8">
            <h3 className="font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] tracking-tight">
              Trading <em>—</em> Contracting <em>—</em> Facility
            </h3>
          </ScrollSkew>
        </section>

        {/* C.12 — <LocaleToggle> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.12 · LocaleToggle
          </span>
          <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
            EN/AR toggle. Clicking AR shows a &ldquo;coming soon&rdquo; toast
            and reverts to EN (V1 scaffolding pending V2 Arabic content).
          </p>
          <div className="mt-6 inline-block bg-[var(--color-ink)] text-[var(--color-bone)] px-6 py-3">
            <LocaleToggle />
          </div>
        </section>

        {/* C.11 — <LiveClock> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.11 · LiveClock
          </span>
          <div className="mt-4 inline-block bg-[var(--color-ink)] text-[var(--color-bone)] px-6 py-3">
            <LiveClock />
          </div>
        </section>

        {/* C.10 — <ImageCluster> */}
        <section>
          <div className="px-[5vw]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              C.10 · ImageCluster
            </span>
          </div>
          <ImageCluster
            className="mt-4"
            heading={
              <h2 className="font-display text-[clamp(2rem,5vw,5rem)] leading-[1.05] tracking-tight">
                Built on relationships <em>that outlast</em> projects.
              </h2>
            }
            images={[
              { src: '/images/why/01.jpg', alt: 'Cluster image 01', x: 0.18, y: 0.25, width: 200, height: 260, rotate: -3, maskFrom: 'left' },
              { src: '/images/why/02.jpg', alt: 'Cluster image 02', x: 0.20, y: 0.78, width: 280, height: 200, rotate:  2, maskFrom: 'bottom' },
              { src: '/images/why/03.jpg', alt: 'Cluster image 03', x: 0.82, y: 0.30, width: 220, height: 180, rotate:  3, maskFrom: 'right' },
              { src: '/images/why/04.jpg', alt: 'Cluster image 04', x: 0.80, y: 0.78, width: 180, height: 220, rotate: -2, maskFrom: 'top' },
            ]}
          />
        </section>

        {/* C.9 — <HeroVideo> */}
        <section>
          <div className="px-[5vw]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              C.9 · HeroVideo
            </span>
            <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
              Scroll out of the section — the video shrinks to 70% with rounded
              corners on desktop. Mobile: no scale.
            </p>
          </div>
          <HeroVideo
            src="/videos/hero-loop.mp4"
            srcH265="/videos/hero-loop.h265.mp4"
            poster="/images/hero-poster.jpg"
            className="mt-8"
          />
        </section>

        {/* C.8 — <HorizontalScroll> */}
        <section>
          <div className="px-[5vw]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              C.8 · HorizontalScroll
            </span>
            <p className="mt-4 font-sans text-sm text-[var(--color-ink)]/60 max-w-[60ch]">
              Scroll while inside the section — the track moves horizontally.
              On &lt;769px it stacks vertically (no pin).
            </p>
          </div>
          <HorizontalScroll className="mt-8 px-[5vw]">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="shrink-0 w-[80vw] md:w-[40vw] aspect-[4/3] bg-[var(--color-ink)] text-[var(--color-bone)] grid place-items-center"
              >
                <div className="text-center">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    Card {String(n).padStart(2, '0')}
                  </span>
                  <p className="mt-2 font-display text-3xl">Item {n}</p>
                </div>
              </div>
            ))}
          </HorizontalScroll>
        </section>

        {/* C.5 — <HoverPreview> */}
        <section className="px-[5vw]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            C.5 · HoverPreview
          </span>
          <HoverPreview
            className="mt-4 border-y border-[var(--color-mist)]"
            items={[
              { id: 'p01', name: 'West Bay Office Tower Fit-out',     image: '/images/projects/p01.jpg', href: '/projects/p01' },
              { id: 'p02', name: 'Lusail Marina Tower Maintenance',   image: '/images/projects/p02.jpg', href: '/projects/p02' },
              { id: 'p03', name: 'Hamad Port Logistics Hub',          image: '/images/projects/p03.jpg', href: '/projects/p03' },
              { id: 'p04', name: 'The Pearl Residential — Block C',   image: '/images/projects/p04.jpg', href: '/projects/p04' },
              { id: 'p05', name: 'Doha Industrial District Phase II', image: '/images/projects/p05.jpg', href: '/projects/p05' },
            ]}
          />
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
