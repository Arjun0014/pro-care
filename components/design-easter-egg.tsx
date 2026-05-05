'use client';

// Per R1.D step 3.
// Tab x5 within a 2-second window opens a full-screen design-system overlay.
// Closes on click outside the inner panel or Escape key. aria-hidden when
// inactive so screen readers don't announce the dormant content.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GROUNDS = [
  { name: 'Ink',     hex: '#0B1220' },
  { name: 'Ink-2',   hex: '#131C2E' },
  { name: 'Bone',    hex: '#F4EFE6' },
  { name: 'Bone-2',  hex: '#EBE3D5' },
] as const;

const TYPEFACES = [
  { name: 'Fraunces',   classes: 'font-display',          sample: 'The quick brown fox' },
  { name: 'Geist',      classes: 'font-sans',             sample: 'The quick brown fox' },
  { name: 'Geist Mono', classes: 'font-mono uppercase',   sample: 'THE QUICK BROWN FOX' },
] as const;

const EASINGS = [
  { name: 'out',    points: [0.16, 1, 0.3, 1] },
  { name: 'cinema', points: [0.83, 0, 0.17, 1] },
  { name: 'io',     points: [0.65, 0, 0.35, 1] },
  { name: 'snap',   points: [0.34, 1.56, 0.64, 1] },
] as const;

/** Render a cubic-bezier as a 100×100 SVG path. */
function bezierPath([x1, y1, x2, y2]: readonly [number, number, number, number]): string {
  return `M 0 100 C ${x1 * 100} ${(1 - y1) * 100}, ${x2 * 100} ${(1 - y2) * 100}, 100 0`;
}

export function DesignEasterEgg() {
  const [open, setOpen] = useState(false);
  const tapsRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const now = Date.now();
      tapsRef.current = [...tapsRef.current.filter((t) => now - t < 2000), now];
      if (tapsRef.current.length >= 5) {
        tapsRef.current = [];
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="design-egg"
          className="fixed inset-0 z-[300] bg-[var(--color-ink)]/95 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            // Close on backdrop click (not on inner panel).
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Pro Care design system"
        >
          {/* Inner panel — bone text on ink ground, hairline gold border 8vw from edges. */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[84vw] h-[84vh] overflow-y-auto p-[clamp(2rem,5vw,5rem)] border border-[var(--color-gold)] text-[var(--color-bone)]"
          >
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] tracking-tight">
              Designed with <em className="italic text-[var(--color-gold)]">intent.</em>
            </h2>

            {/* Grounds */}
            <section className="mt-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Grounds
              </span>
              <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {GROUNDS.map((g) => (
                  <li key={g.name} className="flex flex-col gap-2">
                    <span
                      className="block aspect-square border border-[var(--color-bone)]/20"
                      style={{ background: g.hex }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                      {g.name}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-bone)]/60 tabular-nums">
                      {g.hex}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Typefaces */}
            <section className="mt-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Typefaces
              </span>
              <ul className="mt-4 flex flex-col gap-6">
                {TYPEFACES.map((tf) => (
                  <li key={tf.name} className="flex flex-col gap-1 border-b border-[var(--color-bone)]/10 pb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-bone)]/60">
                      {tf.name}
                    </span>
                    <span className={`${tf.classes} text-[clamp(1.5rem,3vw,2.25rem)] leading-tight`}>
                      {tf.sample}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Easings */}
            <section className="mt-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Easings
              </span>
              <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {EASINGS.map((es) => (
                  <li key={es.name} className="flex flex-col gap-2">
                    <svg viewBox="0 0 100 100" className="w-full aspect-square border border-[var(--color-bone)]/20 p-3">
                      <path
                        d={bezierPath(es.points)}
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                      {es.name}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-[var(--color-bone)]/50">
                      [{es.points.join(', ')}]
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Footer line */}
            <div className="mt-16 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-bone)]/50">
                Built by Arjun
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-bone)]/70 hover:text-[var(--color-bone)] transition-colors"
                aria-label="Close design overlay"
              >
                close · esc
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
