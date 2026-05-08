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

// Lighter ambient veil for the alternating-veil experiment (R2.5 user
// feedback — "the transparent covering like in the first one, it can be
// there for alternating sections, lets try that out also"). Sits at
// roughly half the depth of InkVeil so the canvas still reads as the
// subject; just adds a subtle tonal pool. Tool 3 in the doc 21 vocabulary.
function AmbientPool({ position = 'center' as 'center' | 'top' | 'bottom' }) {
  const at =
    position === 'top'    ? '50% 25%' :
    position === 'bottom' ? '50% 75%' : 'center';
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          `radial-gradient(ellipse 80vw 50vh at ${at}, rgba(11,18,32,0.3) 0%, rgba(11,18,32,0.12) 45%, rgba(11,18,32,0) 80%)`,
      }}
    />
  );
}

// HoverPreview item shape.
// R2.7 § Task 4 — home page surfaces only the first 3 projects.
// The full set lives in `lib/content/projects.ts` and will populate the
// R3 /projects interior page.
const projectItems = projects.slice(0, 3).map((p) => ({
  id:     p.slug,
  name:   p.title,
  image:  p.image,
  alt:    p.imageAlt,
  href:   `/projects/${p.slug}`,
  sector: p.sector.toUpperCase(),
  year:   p.year,
}));

export default function HomePage() {
  return (
    <>
      {/* ───── Section 1 · Hero ─────────────────────────────────────
          Empty plot at dawn. Canvas IS the hero visual. */}
      <section
        data-ground="ink"
        data-snap-target="hero"
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
          Per R2.7 § Task 2 — moved from top:8vh to bottom:8vh so the upper
          ~90% of the viewport is clean canvas. Same ticker content, same
          marquee animation, same Tool 2 halo. */}
      <section
        data-snap-target="identity-ticker"
        className="relative h-[100vh] w-full"
        aria-label="Identity ticker"
      >
        <AmbientPool position="bottom" />
        <div className="absolute bottom-[8vh] inset-x-0 overflow-hidden">
          <Marquee
            variant="ticker"
            className="text-[var(--color-bone)] [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_0_16px_rgba(0,0,0,0.3)]"
          >
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
        </div>
      </section>

      {/* ───── Section 3 · Manifesto ────────────────────────────────
          Per R2.7-fix § Task 5 — three asymmetric beats sized to fit ONE
          viewport so the snap-target landing renders the entire manifesto
          composition at once, including the closing italic line.
          Layout (100 vh tall, justify-between distributes beats):
            Beat 1 — top, left-aligned in left half
            Beat 2 — middle, right-aligned in right half
            Beat 3 — bottom, centred "One standard..." + indented italic
                     "Things that last." right below (tight spacing)
          Stronger radial pool (alpha 0.55→0.30→0) and per-ScrollWords
          halos so the text reads cleanly against bright canvas frames. */}
      <section
        data-snap-target="manifesto"
        className="relative w-full min-h-[100vh] py-[8vh]"
        aria-label="Manifesto"
      >
        {/* Tool 3 — stronger radial pool (R2.7-fix). Centred ellipse,
            fades to transparent at 80% so canvas reads continuous. */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 90vw 70vh at center, rgba(11,18,32,0.55) 0%, rgba(11,18,32,0.30) 40%, rgba(11,18,32,0) 80%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-[5vw] h-full min-h-[84vh] flex flex-col justify-between gap-[6vh]">
          {/* Top row — Beat 1 (left) + Beat 2 (right) side-by-side, each
              text-aligned centre within its half */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] md:gap-[4vw]">
            {/* Beat 1 — left half, centred text */}
            <div className="flex justify-center md:justify-start">
              <ScrollWords
                className="font-display text-[clamp(1.625rem,3.2vw,3rem)] leading-[1.15] max-w-[22ch] text-center [text-shadow:0_1px_2px_rgba(11,18,32,0.65),0_0_28px_rgba(11,18,32,0.5)]"
                dimColor="rgba(244, 239, 230, 0.30)"
                litColor="rgb(244, 239, 230)"
                textShadow="0 1px 2px rgba(11,18,32,0.65), 0 0 28px rgba(11,18,32,0.5)"
              >
                We are <em>three companies in one</em>. Traders, contractors, operators.
              </ScrollWords>
            </div>

            {/* Beat 2 — right half, centred text */}
            <div className="flex justify-center md:justify-end">
              <ScrollWords
                className="font-display text-[clamp(1.625rem,3.2vw,3rem)] leading-[1.15] max-w-[22ch] text-center [text-shadow:0_1px_2px_rgba(11,18,32,0.65),0_0_28px_rgba(11,18,32,0.5)]"
                dimColor="rgba(244, 239, 230, 0.30)"
                litColor="rgb(244, 239, 230)"
                textShadow="0 1px 2px rgba(11,18,32,0.65), 0 0 28px rgba(11,18,32,0.5)"
              >
                We bring materials to Qatar, we build with them, and we keep what we build running.
              </ScrollWords>
            </div>
          </div>

          {/* Beat 3 — bottom, centred "One standard..." + tight italic
              "Things that last." right below */}
          <div className="flex flex-col items-center gap-[2.5vh]">
            <ScrollWords
              className="font-display text-[clamp(1.625rem,3.4vw,3.25rem)] leading-[1.15] max-w-[26ch] text-center [text-shadow:0_1px_2px_rgba(11,18,32,0.65),0_0_28px_rgba(11,18,32,0.5)]"
              dimColor="rgba(244, 239, 230, 0.30)"
              litColor="rgb(244, 239, 230)"
              textShadow="0 1px 2px rgba(11,18,32,0.65), 0 0 28px rgba(11,18,32,0.5)"
            >
              One standard across all three.
            </ScrollWords>
            <ScrollWords
              className="font-display italic text-[clamp(1.375rem,2.8vw,2.5rem)] leading-[1.2] [text-shadow:0_1px_2px_rgba(11,18,32,0.7),0_0_32px_rgba(11,18,32,0.55)]"
              dimColor="rgba(244, 239, 230, 0.30)"
              litColor="rgb(244, 239, 230)"
              textShadow="0 1px 2px rgba(11,18,32,0.7), 0 0 32px rgba(11,18,32,0.55)"
            >
              <em>Things that last.</em>
            </ScrollWords>
          </div>
        </div>
      </section>

      {/* Section 4 (mid-page Pillars marquee) was REMOVED in R2.6 per
          user feedback — the giant "Trading — Contracting — Facility
          Services" mix-blend-mode banner was redundant with the Pillars
          deep-dive's own typography below it. The Identity ticker
          (Section 2) still carries the trading/contracting/facility
          chrome. ScrollBackdrop frame mapping is scrollY-based so it
          adjusts automatically to the shorter document height. */}

      {/* ───── Section 4 · Pillars (pin-and-scrub) ──────────────────
          Per doc 21 § Section 5 — pure typography over canvas, pin and
          scrub three pillar panels. */}
      <Pillars />

      {/* ───── Section 5 · Projects horizontal scroll ───────────────
          Typographic cards, pin-and-scrub. */}
      <ProjectsHorizontal />

      {/* ───── Section 6 · Stats (count-up) ─────────────────────────
          Three numbers anchored to viewport bottom. */}
      <StatsCountUp />

      {/* ───── Section 7 · Why Pro Care ─────────────────────────────
          Single typographic headline over canvas. */}
      <WhyCluster />

      {/* ───── Section 8 · Selected projects (hover list) ───────────
          Per R2.7 § Task 4 — 2-column side-by-side layout. Title block on
          the left, 3 project rows on the right. Hover-thumbnail mechanic
          and edge-clamping unchanged from R2.6. */}
      <section
        data-snap-target="selected-projects"
        className="relative w-full px-[clamp(1.5rem,5vw,8vw)] py-[14vh] text-[var(--color-bone)] [text-shadow:0_1px_2px_rgba(11,18,32,0.5),0_0_24px_rgba(11,18,32,0.35)]"
        aria-label="Selected projects"
      >
        <AmbientPool />
        <div className="relative mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-16 items-start">
          {/* Left column — title block */}
          <header className="flex flex-col gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-80">
              Selected work
            </span>
            <SplitText
              as="h2"
              className="block font-display text-[clamp(2rem,4.5vw,4.25rem)] leading-[1.1] tracking-[-0.02em] max-w-[14ch]"
            >
              Selected <em>projects.</em>
            </SplitText>
            <p className="font-sans text-[15px] leading-[1.6] text-[var(--color-bone)]/80 max-w-[36ch]">
              Three of our recent works across Qatar.
            </p>
          </header>

          {/* Right column — 3 project rows */}
          <HoverPreview items={projectItems} />
        </div>
      </section>

      {/* ───── Section 9 · Closing CTA + integrated footer ──────────
          Per R2.5 user feedback — combine the closing CTA with the
          contact/legal chrome so the last frame reads as one coherent
          composition over the night canvas. The standalone Footer
          (with its Navigate column) is replaced by inline contact info
          below the headline. The "Start a conversation" button is now
          a solid bone pill so it reads against the lit building. */}
      <section
        data-ground="ink"
        data-snap-target="closing-cta"
        className="relative min-h-[100vh] w-full px-[5vw] pt-[14vh] pb-[6vh] flex flex-col items-center justify-between text-center"
        aria-label="Closing call to action"
      >
        {/* Top — Headline + CTA */}
        <div className="relative z-10 flex flex-col items-center pt-[8vh]">
          <ScrollSkew>
            <SplitText
              as="h2"
              className="font-display text-[clamp(3rem,8vw,8rem)] leading-[1.15] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_24px_rgba(11,18,32,0.6),0_1px_2px_rgba(11,18,32,0.55),0_0_48px_rgba(11,18,32,0.35)]"
            >
              Let's build <em>something durable</em>.
            </SplitText>
          </ScrollSkew>

          <div className="mt-14">
            <Link href="/contact" className="inline-block">
              <MagneticButton
                data-cursor-label="START"
                className="bg-[var(--color-bone)] text-[var(--color-ink)] border-[var(--color-bone)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]"
              >
                Start a conversation
              </MagneticButton>
            </Link>
          </div>

          <span
            className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/85"
            style={{ textShadow: SHADOW_LIGHT }}
          >
            Doha · Qatar · CR# 217949
          </span>
        </div>

        {/* Bottom — integrated footer chrome (no Navigate column).
            Three blocks: brand + contact + legal. All transparent,
            bone with halo. */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto mt-[8vh] flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-left">
            {/* Brand block */}
            <div className="flex flex-col gap-3">
              <span className="font-display text-[22px] tracking-[-0.01em] text-[var(--color-bone)]">
                Pro Care
              </span>
              <p className="font-sans text-[14px] leading-[1.6] text-[var(--color-bone)]/80 max-w-[36ch]">
                Trading, contracting and facility services across Qatar.
              </p>
            </div>

            {/* Contact block */}
            <div className="flex flex-col gap-3 md:items-end md:text-right">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                Contact
              </span>
              <address className="not-italic flex flex-col gap-2 font-sans text-[14px] text-[var(--color-bone)]/85">
                <span>Doha, Qatar</span>
                {/* TODO(arjun): replace placeholders with real phone/email */}
                <span className="opacity-70">// TODO: phone</span>
                <span className="opacity-70">// TODO: email</span>
              </address>
            </div>
          </div>

          {/* Legal strip */}
          <div className="border-t border-[var(--color-bone)]/20 pt-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-bone)]/75">
              CR# 217949 · © Pro Care Trading, Contracting and Facility Services W.L.L.
            </span>
            <nav className="flex items-center gap-6" aria-label="Legal">
              <Link
                href="/privacy"
                className="font-sans text-[12px] text-[var(--color-bone)]/75 hover:text-[var(--color-bone)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="font-sans text-[12px] text-[var(--color-bone)]/75 hover:text-[var(--color-bone)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
