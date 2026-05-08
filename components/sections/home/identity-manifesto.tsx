'use client';

// R2.8 § Task 1 — combined Identity ticker + Manifesto section.
//
// One 400 vh section with:
//   • a ticker pinned at the bottom for the entire scroll range
//     (same locked content from doc 15 § Identity strip)
//   • 4 wheel-snap sub-targets (beat-1 … beat-4), like Pillars deep-dive
//   • only ONE beat visible at a time — Lift in / Lift out per beat
//     change (motion's AnimatePresence with mode="wait")
//   • all 4 beats lean LEFT (left half hosts text, right half stays
//     clean canvas), per R2.8 user feedback
//   • Beat 4 has TWO parts — Part 4a appears immediately, Part 4b
//     ("Things that last.") Lifts in 600 ms after 4a
//
// Replaces the prior standalone Identity ticker + standalone Manifesto
// sections in `app/page.tsx`.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Marquee } from '@/components/motion/marquee';
import { easings } from '@/lib/motion';

// Tool 2 halo class — light text over varied canvas brightness.
const HALO = '[text-shadow:0_1px_2px_rgba(11,18,32,0.65),0_0_28px_rgba(11,18,32,0.5)]';

// Per-word stagger so each line of the beat enters in a wave.
const WORD_STAGGER_MS  = 50;
const ENTER_DURATION_S = 0.7;   // Lift in
const EXIT_DURATION_S  = 0.5;   // Lift out
const PART_4B_DELAY_S  = 0.6;   // Beat 4b appears 600 ms after 4a

const BEAT_COUNT = 4;

// Helper — split a string by spaces preserving punctuation, return tokens
// for per-word stagger. Renders <em> children if the word is wrapped.
type Word = { text: string; italic?: boolean };
function tokenizeBeat(parts: Array<string | { italic: string }>): Word[] {
  const out: Word[] = [];
  for (const p of parts) {
    if (typeof p === 'string') {
      const words = p.split(/\s+/).filter(Boolean);
      for (const w of words) out.push({ text: w });
    } else {
      const words = p.italic.split(/\s+/).filter(Boolean);
      for (const w of words) out.push({ text: w, italic: true });
    }
  }
  return out;
}

// Render a list of tokens as a stagger of motion.spans. Each word lifts
// from y:30 opacity:0 to its natural state on enter, exits up to y:-30
// on exit.
function StaggeredWords({ tokens, delay = 0 }: { tokens: Word[]; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <>
      {tokens.map((t, i) => {
        const wordDelay = delay + (i * WORD_STAGGER_MS) / 1000;
        return (
          <motion.span
            key={`${i}-${t.text}`}
            className="inline-block whitespace-nowrap"
            initial={reduced ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: -30, opacity: 0 }}
            transition={{
              duration: reduced ? 0.2 : ENTER_DURATION_S,
              ease:     easings.cinema as [number, number, number, number],
              delay:    wordDelay,
            }}
            style={{ fontStyle: t.italic ? 'italic' : 'normal' }}
          >
            {t.text}
            {/* trailing space outside motion so layout doesn't break — but
                each motion.span gets its own non-breaking space inline */}
            {i < tokens.length - 1 ? ' ' : ''}
          </motion.span>
        );
      })}
    </>
  );
}

// Wraps each line of a beat into its own motion.div so words within the
// line stagger but lines also stagger as a unit. Leftover newlines in
// the source text drive the line breaks.
function BeatLine({ tokens, delay = 0 }: { tokens: Word[]; delay?: number }) {
  return (
    <span className="block">
      <StaggeredWords tokens={tokens} delay={delay} />
    </span>
  );
}

// === The 4 beats ============================================================

// Beat 1 — three lines, big.
function Beat1() {
  return (
    <div
      data-beat="1"
      className={`absolute inset-0 left-[5vw] top-0 flex items-center font-display text-[var(--color-bone)] ${HALO}`}
    >
      <h2 className="text-[clamp(5rem,11vw,13rem)] leading-[0.92] tracking-[-0.02em] max-w-[16ch]">
        <BeatLine tokens={tokenizeBeat(['We are'])} delay={0} />
        <BeatLine
          tokens={tokenizeBeat([{ italic: 'three companies' }])}
          delay={(WORD_STAGGER_MS * 2) / 1000}
        />
        <BeatLine
          tokens={tokenizeBeat(['in one.'])}
          delay={(WORD_STAGGER_MS * 4) / 1000}
        />
      </h2>
    </div>
  );
}

// Beat 2 — three roles, mid-large.
function Beat2() {
  return (
    <div
      data-beat="2"
      className={`absolute inset-0 left-[5vw] top-0 flex items-center font-display text-[var(--color-bone)] ${HALO}`}
    >
      <h2 className="text-[clamp(3.5rem,7vw,8rem)] leading-[1.0] tracking-[-0.02em]">
        <BeatLine tokens={tokenizeBeat(['Traders.'])} delay={0} />
        <BeatLine tokens={tokenizeBeat(['Contractors.'])} delay={(WORD_STAGGER_MS * 1) / 1000} />
        <BeatLine tokens={tokenizeBeat(['Operators.'])} delay={(WORD_STAGGER_MS * 2) / 1000} />
      </h2>
    </div>
  );
}

// Beat 3 — three actions, increasing indent.
function Beat3() {
  return (
    <div
      data-beat="3"
      className={`absolute inset-0 left-[5vw] top-0 flex items-center font-display text-[var(--color-bone)] ${HALO}`}
    >
      <div className="text-[clamp(2.75rem,5.5vw,6rem)] leading-[1.15] tracking-[-0.02em] max-w-[28ch]">
        <span className="block">
          <StaggeredWords tokens={tokenizeBeat(['We bring materials,'])} delay={0} />
        </span>
        <span className="block ml-[2vw]">
          <StaggeredWords tokens={tokenizeBeat(['we build with them,'])} delay={(WORD_STAGGER_MS * 3) / 1000} />
        </span>
        <span className="block ml-[4vw]">
          <StaggeredWords tokens={tokenizeBeat(['we keep them running.'])} delay={(WORD_STAGGER_MS * 7) / 1000} />
        </span>
      </div>
    </div>
  );
}

// Beat 4 — Part 4a top-left, Part 4b bottom-right (delayed 600 ms).
function Beat4() {
  const reduced = useReducedMotion();
  return (
    <>
      {/* Part 4a — top-left, dominant */}
      <div
        data-beat="4a"
        className={`absolute left-[5vw] top-[25vh] font-display text-[var(--color-bone)] ${HALO}`}
      >
        <h2 className="text-[clamp(4rem,8vw,9rem)] leading-[1.0] tracking-[-0.02em] max-w-[15ch]">
          <BeatLine tokens={tokenizeBeat(['One standard.'])} delay={0} />
          <BeatLine tokens={tokenizeBeat(['Across all three.'])} delay={(WORD_STAGGER_MS * 2) / 1000} />
        </h2>
      </div>

      {/* Part 4b — bottom-right, italic, slightly desaturated, delayed */}
      <div
        data-beat="4b"
        className={`absolute right-[5vw] bottom-[14vh] font-display italic ${HALO}`}
        style={{ color: 'rgba(244, 239, 230, 0.85)' }}
      >
        <motion.div
          className="text-[clamp(1.25rem,2vw,2.5rem)] leading-[1.2] tracking-[-0.01em]"
          initial={reduced ? { opacity: 0 } : { y: 20, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -20, opacity: 0 }}
          transition={{
            duration: reduced ? 0.2 : ENTER_DURATION_S,
            ease:     easings.cinema as [number, number, number, number],
            delay:    PART_4B_DELAY_S,
          }}
        >
          Things that last.
        </motion.div>
      </div>
    </>
  );
}

// === The combined section ==================================================

export function IdentityManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);

  // Read scroll position to determine which beat is "active".
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const sectionTop = r.top + window.scrollY;
      const vh = window.innerHeight;
      // 4 beats × 1 vh each within the 400 vh section. The user's scroll
      // anchor is the TOP of viewport, so beat N starts at sectionTop +
      // N × vh. Pick the beat whose anchor most matches scrollY.
      const offset = window.scrollY - sectionTop;
      const idx = Math.max(0, Math.min(BEAT_COUNT - 1, Math.round(offset / vh)));
      setActiveBeat(idx);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    type WithLenis = Window & { __lenis?: { on: (e: 'scroll', cb: () => void) => void; off: (e: 'scroll', cb: () => void) => void } };
    const lenis = (window as WithLenis).__lenis;
    if (lenis) lenis.on('scroll', update);

    return () => {
      window.removeEventListener('scroll', update);
      if (lenis) lenis.off('scroll', update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-snap-target="identity-manifesto"
      data-scroll-mode="opt-in-subtargets"
      className="relative w-full"
      style={{ height: '400vh' }}
      aria-label="Identity & Manifesto"
    >
      {/* Sub-target anchors — invisible markers used by SectionScrollLock
          to know where each beat starts in document Y. Each is 1 vh tall
          and stacks vertically through the 400 vh section. */}
      <div data-beat-target="beat-1" className="h-screen w-full" aria-hidden />
      <div data-beat-target="beat-2" className="h-screen w-full" aria-hidden />
      <div data-beat-target="beat-3" className="h-screen w-full" aria-hidden />
      <div data-beat-target="beat-4" className="h-screen w-full" aria-hidden />

      {/* Sticky overlay — stays in viewport while user scrolls through the
          400 vh section. Hosts the active-beat renderer + the pinned ticker. */}
      <div
        className="sticky top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none"
        style={{ marginTop: '-400vh' } as CSSProperties}
        aria-hidden
      >
        {/* Active beat with AnimatePresence — only one rendered at a time */}
        <BeatStage activeBeat={activeBeat} />

        {/* Ticker pinned at the bottom of the viewport for the entire
            400 vh range. Same locked content + Tool 2 halo as before. */}
        <div
          className="absolute bottom-[6vh] inset-x-0 overflow-hidden pointer-events-auto"
          aria-hidden="false"
        >
          <Marquee
            variant="ticker"
            className={`text-[var(--color-bone)] ${HALO}`}
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
      </div>
    </section>
  );
}

// Renders the active beat with a per-beat enter/exit Lift via AnimatePresence.
function BeatStage({ activeBeat }: { activeBeat: number }) {
  const beats: ReactNode[] = [<Beat1 key="b1" />, <Beat2 key="b2" />, <Beat3 key="b3" />, <Beat4 key="b4" />];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeBeat}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: EXIT_DURATION_S,
          ease:     easings.cinema as [number, number, number, number],
        }}
      >
        {beats[activeBeat]}
      </motion.div>
    </AnimatePresence>
  );
}
