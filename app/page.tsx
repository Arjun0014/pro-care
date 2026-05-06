// app/page.tsx
// Home page — full 10-section composition per 13-HOME-AWARD-TIER.md.
// Sections that overlay the canvas (Hero, Identity ticker, Manifesto,
// Pillars marquee, Why Pro Care, Selected projects, Closing CTA) are
// transparent over the global ScrollBackdrop. Sections with their own
// imagery (Pillars deep-dive, Projects horizontal, Stats) cover the canvas
// with their own ground.

import type { Metadata } from 'next';
import Link from 'next/link';
import { SplitText }      from '@/components/motion/split-text';
import { ScrollWords }    from '@/components/motion/scroll-words';
import { Marquee }        from '@/components/motion/marquee';
import { ScrollSkew }     from '@/components/motion/scroll-skew';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { HoverPreview }   from '@/components/motion/hover-preview';
import { Pillars }            from '@/components/sections/home/pillars';
import { ProjectsHorizontal } from '@/components/sections/home/projects-horizontal';
import { WhyCluster }         from '@/components/sections/home/why-cluster';
import { StatsCountUp }       from '@/components/sections/home/stats-count-up';
import { projects }       from '@/lib/content/projects';

export const metadata: Metadata = {
  title:       'Pro Care Qatar — Trading, Contracting, Facility Services',
  description: 'Qatar-rooted operator delivering trading, contracting, and facility services across the Gulf.',
};

// Reusable typographic text-shadow combos for legibility against canvas.
const SHADOW_HEAVY  = '0 2px 24px rgba(11,18,32,0.65), 0 1px 2px rgba(11,18,32,0.5)';
const SHADOW_MEDIUM = '0 2px 16px rgba(11,18,32,0.55), 0 1px 2px rgba(11,18,32,0.4)';
const SHADOW_LIGHT  = '0 1px 8px rgba(11,18,32,0.45)';

// Ink-tinted radial veil — placed BETWEEN the canvas (z-0) and the section
// content (z-10), so the canvas darkens slightly toward edges where text
// usually sits. Kept transparent at center so the building stays the visible
// subject. Per spec § Bug 4.
function InkVeil() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(11,18,32,0) 0%, rgba(11,18,32,0.35) 60%, rgba(11,18,32,0.55) 100%)',
      }}
      aria-hidden="true"
    />
  );
}

// HoverPreview item shape.
const projectItems = projects.slice(0, 8).map((p) => ({
  id:    p.slug,
  name:  p.title,
  image: p.image,
  alt:   p.imageAlt,
  href:  `/projects/${p.slug}`,
}));

export default function HomePage() {
  return (
    <>
      {/* ───── Section 1 · Hero ─────────────────────────────────────
          Empty plot at dawn. Canvas IS the hero visual. */}
      <section
        data-ground="ink"
        className="relative h-[100svh] w-full px-[5vw] flex flex-col justify-end pb-[10vh]"
        aria-label="Hero"
      >
        <InkVeil />
        <div className="relative z-10 flex flex-col">
          <span
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/80"
            style={{ textShadow: SHADOW_LIGHT }}
          >
            TRADING — CONTRACTING — FACILITY
          </span>
          <SplitText
            as="h1"
            className="mt-6 font-display text-[clamp(4rem,11vw,11rem)] leading-[0.92] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_24px_rgba(11,18,32,0.65),0_1px_2px_rgba(11,18,32,0.5)]"
          >
            We build for <em>Qatar</em>.
          </SplitText>
          <div className="mt-10 flex items-end justify-between gap-8 flex-wrap">
            <Link href="/contact" className="inline-block">
              <MagneticButton
                data-cursor-label="GET IN TOUCH"
                className="text-[var(--color-bone)] border-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
              >
                Get in touch
              </MagneticButton>
            </Link>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-bone)]/70"
              style={{ textShadow: SHADOW_LIGHT }}
              aria-hidden="true"
            >
              ↓ Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ───── Section 2 · Identity ticker ──────────────────────────
          Bone ground per doc 13. Single ambient ribbon. */}
      <section
        data-ground="bone"
        className="relative w-full bg-[var(--color-bone)] py-5 border-y border-[var(--color-mist)]"
        aria-label="Identity ticker"
      >
        <Marquee variant="ticker" className="text-[var(--color-ink)]">
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
      </section>

      {/* ───── Section 3 · Manifesto ────────────────────────────────
          Per doc 13, Manifesto is bone ground. Words light up via ScrollWords.
          Canvas hidden behind own bone bg. */}
      <section
        data-ground="bone"
        className="relative w-full min-h-[120vh] bg-[var(--color-bone)] text-[var(--color-ink)] flex items-center justify-center px-[8vw] py-[10vh]"
        aria-label="Manifesto"
      >
        <ScrollWords
          className="font-display text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.2] max-w-[52ch] text-center"
        >
          We are <em>three companies in one</em>. Traders, contractors,
          operators. We bring materials to Qatar, we build with them, and
          we keep what we build running. One standard across all three.{' '}
          <em>Things that last.</em>
        </ScrollWords>
      </section>

      {/* ───── Section 4 · Pillars marquee ──────────────────────────
          Ink ground, monumental. Hard cut from manifesto bone. */}
      <section
        data-ground="ink"
        className="relative w-full bg-[var(--color-ink)] text-[var(--color-bone)] py-[6vh] overflow-hidden"
        aria-label="Three pillars marquee"
      >
        <ScrollSkew>
          <Marquee
            variant="headline"
            speed={25}
            direction="right"
            className="text-[var(--color-bone)]"
          >
            <span className="px-12">Trading</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
            <span className="px-12 italic">Contracting</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
            <span className="px-12">Facility Services</span>
            <span className="px-12 text-[var(--color-gold)]">—</span>
          </Marquee>
        </ScrollSkew>
        {/* Hairline gold rule between marquee and pin-scrub deep-dive */}
        <div className="mt-[6vh] mx-auto w-3/5 h-px bg-[var(--color-gold)]/40" aria-hidden="true" />
      </section>

      {/* ───── Section 5 · Pillars (pin-and-scrub) ──────────────────
          Own ink ground; canvas hidden. */}
      <Pillars />

      {/* ───── Section 6 · Projects horizontal scroll ───────────────
          Own bone ground. */}
      <ProjectsHorizontal />

      {/* ───── Section 7 · Stats (count-up) ─────────────────────────
          Bone ground per doc 13. Three numbers, animated counters
          on scroll-into-view. */}
      <StatsCountUp />

      {/* ───── Section 8 · Why Pro Care (image cluster) ─────────────
          Own ink ground; canvas hidden. */}
      <WhyCluster />

      {/* ───── Section 9 · Selected projects (hover list) ───────────
          Bone ground per doc 13 — own bone bg, canvas hidden. */}
      <section
        data-ground="bone"
        className="relative w-full bg-[var(--color-bone)] text-[var(--color-ink)] px-[clamp(1.5rem,5vw,8vw)] py-[14vh]"
        aria-label="Selected projects"
      >
        <header className="mb-12 flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
            Selected work
          </span>
          <SplitText
            as="h2"
            className="block font-display text-[clamp(2rem,5vw,5rem)] leading-[1.05] tracking-[-0.02em] max-w-[18ch]"
          >
            Eight projects. <em>Three disciplines.</em>
          </SplitText>
        </header>

        <HoverPreview items={projectItems} />
      </section>

      {/* ───── Section 10 · Closing CTA ─────────────────────────────
          Night-lit building behind. Canvas through. */}
      <section
        data-ground="ink"
        className="relative min-h-[100vh] w-full px-[5vw] py-[14vh] flex flex-col items-center justify-center text-center"
        aria-label="Closing call to action"
      >
        <InkVeil />
        <div className="relative z-10 flex flex-col items-center">
          <ScrollSkew>
            <SplitText
              as="h2"
              className="font-display text-[clamp(3rem,8vw,8rem)] leading-[1] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_32px_rgba(11,18,32,0.85),0_1px_4px_rgba(11,18,32,0.7)]"
            >
              Let's build <em>something durable</em>.
            </SplitText>
          </ScrollSkew>

          <div className="mt-16">
            <Link href="/contact" className="inline-block">
              <MagneticButton
                data-cursor-label="START"
                className="text-[var(--color-bone)] border-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
              >
                Start a conversation
              </MagneticButton>
            </Link>
          </div>

          <span
            className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/80"
            style={{ textShadow: SHADOW_LIGHT }}
          >
            Doha · Qatar · CR# 217949
          </span>
        </div>
      </section>
    </>
  );
}
