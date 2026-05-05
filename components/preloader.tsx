'use client';

// Per 12-AWARD-TIER-COMPONENTS.md § 1 + 11-MOTION-OVERHAUL.md § 12.
// Counter 0 → 100 over ~1800ms, cycling greetings (ahlan / hello / namaskaram /
// مرحباً / привет), then split-screen exit revealing the page underneath.
// Skips on revisit within session via sessionStorage.
// Reduced motion: 300ms fade-out, no counter, no split.
//
// R1.D wires up <link rel="preload"> for the hero video here so LCP isn't
// blocked by the loader.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { easings } from '@/lib/motion';

const GREETINGS = ['ahlan', 'hello', 'namaskaram', 'مرحباً', 'привет'] as const;

type Stage = 'counting' | 'split' | 'done';

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>('counting');
  const [count, setCount] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const startedAt = useRef(Date.now());

  // Skip on revisit within session.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('procare-loaded') === '1') {
      setStage('done');
      return;
    }
    sessionStorage.setItem('procare-loaded', '1');

    // Pre-cache the hero video while the loader is on screen.
    // (Per R1.D step 2 — kicks off network fetch so LCP is faster.)
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as  = 'video';
    link.href = '/videos/hero-loop.mp4';
    document.head.appendChild(link);

    return () => {
      // Leave the preload <link> in place — cleaning it up post-mount cancels
      // an in-flight fetch on some browsers. The link is small overhead.
    };
  }, []);

  // Reduced-motion fast path.
  useEffect(() => {
    if (!reduceMotion) return;
    if (stage !== 'counting') return;
    const t = window.setTimeout(() => setStage('done'), 300);
    return () => window.clearTimeout(t);
  }, [reduceMotion, stage]);

  // Counter animation (cinema curve).
  useEffect(() => {
    if (stage !== 'counting' || reduceMotion) return;
    const TOTAL_MS = 1800;
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / TOTAL_MS, 1);
      // cubic-bezier(.83, 0, .17, 1) approximation
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Hold at 100 for 200ms, then split.
        window.setTimeout(() => setStage('split'), 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, reduceMotion]);

  // Greetings cycle (200ms per greeting, ~1s of cycling then settle).
  useEffect(() => {
    if (stage !== 'counting' || reduceMotion) return;
    const id = window.setInterval(() => {
      setGreetingIndex((idx) => (idx + 1) % GREETINGS.length);
    }, 200);
    const stop = window.setTimeout(() => window.clearInterval(id), 1000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [stage, reduceMotion]);

  // Sanity: minimum hold of 1.6s (in case scripts run very fast on revisit-skip
  // logic somehow gets bypassed).
  useEffect(() => {
    if (stage !== 'counting' || reduceMotion) return;
    const minHold = 1600;
    const elapsed = Date.now() - startedAt.current;
    if (elapsed >= minHold) return;
  }, [stage, reduceMotion]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[100] bg-[var(--color-ink)] text-[var(--color-bone)] overflow-hidden"
        aria-hidden
      >
        {/* Counting stage — visible content (skipped on reduced-motion). */}
        {stage === 'counting' && !reduceMotion && (
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={count > 95 ? 'pro-care' : greetingIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="font-display text-2xl sm:text-3xl tracking-tight text-center"
                >
                  {count > 95 ? (
                    <span>
                      Pro <em className="italic">Care</em>
                    </span>
                  ) : (
                    GREETINGS[greetingIndex]
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="font-mono tabular-nums text-[clamp(6rem,16vw,16rem)] leading-none">
                {count.toString().padStart(3, '0')}
              </div>

              <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-bone)]/60 text-center">
                Pro Care Qatar · Trading · Contracting · Facility Services
              </div>
            </div>
          </div>
        )}

        {/* Reduced-motion fade. */}
        {reduceMotion && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[var(--color-ink)]"
            onAnimationComplete={() => setStage('done')}
          />
        )}

        {/* Split exit — top half slides up, bottom half slides down. */}
        {stage === 'split' && !reduceMotion && (
          <>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: '-100%' }}
              transition={{ duration: 0.9, ease: easings.cinema as [number, number, number, number] }}
              onAnimationComplete={() => setStage('done')}
              className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-ink)]"
            />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: '100%' }}
              transition={{ duration: 0.9, ease: easings.cinema as [number, number, number, number] }}
              className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--color-ink)]"
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
