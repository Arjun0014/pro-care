// app/page.tsx
// Home page (R2 first pass) — composed as one continuous typography flow over
// the global ScrollBackdrop canvas. No section has its own opaque background.
// Every section is just text + restraint, sitting in front of the construction
// timelapse that scrubs as the user scrolls.
//
// Section content is mapped to construction stage so the canvas behind each
// section reinforces what's being said:
//
//   stage 1 (frames   0–119, dawn → empty plot)        — Hero
//   stage 2 (frames 120–239, foundation pit)            — Identity ticker + Manifesto opening
//   stage 3 (frames 240–359, frame rising)              — Manifesto continues + Pillars marquee
//   stage 4 (frames 360–479, cladding mid-construction) — Stats
//   stage 5 (frames 480–559, dusk, finished glass)      — Selected projects (typographic list)
//   stage 6 (frames 560–599, night, fully lit)          — Closing CTA
//
// Locked copy from 15-ASSETS-AND-COPY.md verbatim. Body has bg-bone (from
// app/layout.tsx) — that's covered everywhere there isn't a transparent
// section between it and the canvas. The canvas (z-0, fixed inset-0) is
// always behind <main> (z-10) so it shows through every section here.

import type { Metadata } from 'next';
import Link from 'next/link';
import { SplitText }      from '@/components/motion/split-text';
import { ScrollWords }    from '@/components/motion/scroll-words';
import { Marquee }        from '@/components/motion/marquee';
import { ScrollSkew }     from '@/components/motion/scroll-skew';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { HoverPreview }   from '@/components/motion/hover-preview';
import { projects }       from '@/lib/content/projects';

export const metadata: Metadata = {
  title:       'Pro Care Qatar — Trading, Contracting, Facility Services',
  description: 'Qatar-rooted operator delivering trading, contracting, and facility services across the Gulf.',
};

// Reusable typographic text-shadow combos for legibility against the canvas.
const SHADOW_HEAVY  = '0 2px 24px rgba(11,18,32,0.65), 0 1px 2px rgba(11,18,32,0.5)';
const SHADOW_MEDIUM = '0 2px 16px rgba(11,18,32,0.55), 0 1px 2px rgba(11,18,32,0.4)';
const SHADOW_LIGHT  = '0 1px 8px rgba(11,18,32,0.45)';

// Map projects to the HoverPreview item shape.
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
      {/* ───── Stage 1 · Hero ────────────────────────────────────────
          Empty plot at dawn. The canvas IS the hero visual — no video,
          no image. Typography only, anchored bottom-left. */}
      <section
        data-ground="ink"
        className="relative h-[100svh] w-full px-[5vw] flex flex-col justify-end pb-[10vh]"
        aria-label="Hero"
      >
        <span
          className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/80"
          style={{ textShadow: SHADOW_LIGHT }}
        >
          TRADING — CONTRACTING — FACILITY
        </span>
        <SplitText
          as="h1"
          className="mt-6 font-display font-medium text-[clamp(4rem,11vw,11rem)] leading-[0.92] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_24px_rgba(11,18,32,0.65),0_1px_2px_rgba(11,18,32,0.5)]"
        >
          We build for <em>Qatar</em>.
        </SplitText>
        <div
          className="mt-10 flex items-end justify-between gap-8 flex-wrap"
        >
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
      </section>

      {/* ───── Stage 2 · Identity ticker ────────────────────────────
          Small ambient ribbon — the brand's heartbeat. Sits flat against
          the canvas; no panel, just the words moving. */}
      <section
        data-ground="ink"
        className="relative w-full py-6"
        aria-label="Identity ticker"
      >
        <Marquee
          variant="ticker"
          className="text-[var(--color-bone)]/85"
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
      </section>

      {/* ───── Stage 2–3 · Manifesto ────────────────────────────────
          120vh tall — the user has to scroll through to read. Words light
          up as scroll progress crosses each one. Canvas behind moves from
          foundation excavation into steel frame as the words progress. */}
      <section
        data-ground="ink"
        className="relative min-h-[120vh] flex items-center justify-center px-[8vw] py-[10vh]"
        aria-label="Manifesto"
      >
        <ScrollWords
          className="font-display text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.2] max-w-[52ch] text-center"
          litColor="rgba(244, 239, 230, 1)"
          dimColor="rgba(244, 239, 230, 0.22)"
          textShadow={SHADOW_HEAVY}
        >
          We are <em>three companies in one</em>. Traders, contractors,
          operators. We bring materials to Qatar, we build with them, and
          we keep what we build running. One standard across all three.{' '}
          <em>Things that last.</em>
        </ScrollWords>
      </section>

      {/* ───── Stage 3 · Pillars marquee ────────────────────────────
          Monumental. The three names move slowly across the canvas. Italic
          on "Contracting", gold em-dashes. ScrollSkew picks up scroll
          velocity for a subtle alive feel. */}
      <section
        data-ground="ink"
        className="relative w-full py-[8vh] overflow-hidden"
        aria-label="Three pillars"
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
      </section>

      {/* ───── Stage 4 · Stats ──────────────────────────────────────
          Three numbers. Stat 1 is a word in italic Fraunces (Three).
          Stat 2 + 3 are mono numerals. All bone with shadow. */}
      <section
        data-ground="ink"
        className="relative min-h-[80vh] w-full px-[5vw] py-[14vh] flex flex-col justify-center"
        aria-label="Stats"
      >
        <span
          className="block font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/70 mb-12"
          style={{ textShadow: SHADOW_LIGHT }}
        >
          By the numbers
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <Stat
            value={<em className="not-italic md:italic font-display">Three</em>}
            label="Disciplines, one team."
            isWord
          />
          <Stat
            value="20+"
            label="Projects delivered across Qatar."
          />
          <Stat
            value="100,000"
            unit="QAR"
            label="Registered capital · CR# 217949"
          />
        </div>
      </section>

      {/* ───── Stage 5 · Selected projects ──────────────────────────
          Type-driven hover list. Each row reveals a thumbnail at the
          cursor on hover. The list itself is just type + dividers — no
          panel, no card. */}
      <section
        data-ground="ink"
        className="relative w-full px-[clamp(1.5rem,5vw,8vw)] py-[14vh]"
        aria-label="Selected projects"
      >
        <header className="mb-12 flex flex-col gap-2">
          <span
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/70"
            style={{ textShadow: SHADOW_LIGHT }}
          >
            Selected work
          </span>
          <SplitText
            as="h2"
            className="block font-display text-[clamp(2.5rem,6vw,6rem)] leading-[1] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_24px_rgba(11,18,32,0.7),0_1px_3px_rgba(11,18,32,0.5)]"
          >
            Eight projects. <em>Three disciplines.</em>
          </SplitText>
        </header>

        <HoverPreview items={projectItems} />
      </section>

      {/* ───── Stage 6 · Closing CTA ────────────────────────────────
          Night, fully lit building. The decisive close. ScrollSkew on
          the heading, magnetic button to /contact. */}
      <section
        data-ground="ink"
        className="relative min-h-[100vh] w-full px-[5vw] py-[14vh] flex flex-col items-center justify-center text-center"
        aria-label="Closing call to action"
      >
        <ScrollSkew>
          <SplitText
            as="h2"
            className="font-display text-[clamp(3rem,8vw,8rem)] leading-[1] tracking-[-0.02em] text-[var(--color-bone)] [text-shadow:0_2px_32px_rgba(11,18,32,0.85),0_1px_4px_rgba(11,18,32,0.7)]"
          >
            Let's build <em>something durable</em>.
          </SplitText>
        </ScrollSkew>

        <div className="mt-16">
          <Link
            href="/contact"
            className="inline-block"
          >
            <MagneticButton
              data-cursor-label="START"
              className="text-[var(--color-bone)] border-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
            >
              Start a conversation
            </MagneticButton>
          </Link>
        </div>

        <span
          className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/70"
          style={{ textShadow: SHADOW_LIGHT }}
        >
          Doha · Qatar · CR# 217949
        </span>
      </section>
    </>
  );
}

// ── Local Stat helper ───────────────────────────────────────────────
// Server-rendered, no animation — keeps the section transparent and the
// canvas fully through. (Animated count-up could land in a follow-up; for
// the first-pass composition, static stats serve the design intent.)
function Stat({
  value,
  unit,
  label,
  isWord = false,
}: {
  value:  React.ReactNode;
  unit?:  string;
  label:  string;
  isWord?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 text-[var(--color-bone)]">
      <div
        className={`leading-[0.95] tracking-[-0.02em] ${
          isWord
            ? 'font-display text-[clamp(3.5rem,9vw,9rem)]'
            : 'font-mono tabular-nums text-[clamp(3.5rem,9vw,9rem)]'
        }`}
        style={{ textShadow: SHADOW_HEAVY }}
      >
        {value}
        {unit && (
          <span className="ml-3 font-mono text-[clamp(1rem,1.6vw,1.5rem)] uppercase tracking-[0.16em] text-[var(--color-gold)]">
            {unit}
          </span>
        )}
      </div>
      <span
        className="font-sans text-[15px] leading-[1.4] max-w-[24ch] text-[var(--color-bone)]/80"
        style={{ textShadow: SHADOW_MEDIUM }}
      >
        {label}
      </span>
    </div>
  );
}
